import React, { useState, useEffect, useCallback } from 'react';
import { 
  Save, 
  Settings, 
  Trash2, 
  Plus, 
  FileText, 
  RefreshCw, 
  CircleCheck, 
  CircleX,
  Key,
  Database,
  Cloud,
  X,
  Bird,
  Waves,
  Sparkles,
  Download,
  Share,
  ArrowUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

interface GithubConfig {
  token: string;
  repo: string;
  path: string;
}

const STORAGE_KEYS = {
  NOTES: 'kingfisher_notes_v1',
  GH_CONFIG: 'kingfisher_gh_config_v1'
};

export default function App() {
  const [isStandalone, setIsStandalone] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone === true;
  });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [ghConfig, setGhConfig] = useState<GithubConfig>({
    token: '',
    repo: 'XanXon1/kingfisher-notes', // Example default
    path: 'notes.json'
  });
  const [syncStatus, setSyncStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  // PWA Detection and Installation
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // Watch for display-mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const listener = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches || (window.navigator as any).standalone === true);
    };
    
    mediaQuery.addEventListener('change', listener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If no prompt, maybe it's iOS or already installed but not detected
      alert('To install Kingfisher:\n\n1. Tap the Share button below\n2. Scroll down and tap "Add to Home Screen"');
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
  };

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Failed to parse notes from storage', e);
      }
    }

    const savedGhConfig = localStorage.getItem(STORAGE_KEYS.GH_CONFIG);
    if (savedGhConfig) {
      try {
        setGhConfig(JSON.parse(savedGhConfig));
      } catch (e) {
        console.error('Failed to parse GH config from storage', e);
      }
    }
  }, []);

  // Save to LocalStorage whenever notes or config changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GH_CONFIG, JSON.stringify(ghConfig));
  }, [ghConfig]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const createNote = () => {
    const newNote: Note = {
      id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36),
      title: 'New Note',
      content: '',
      updatedAt: Date.now()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => 
      n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
    ));
  };

  const deleteNote = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(n => n.id !== id));
      if (activeNoteId === id) setActiveNoteId(null);
    }
  };

  const syncWithGithub = async () => {
    if (!ghConfig.token || !ghConfig.repo || !ghConfig.path) {
      setSyncStatus({ 
        type: 'error', 
        message: 'Please complete GitHub settings first.' 
      });
      setIsSettingsOpen(true);
      return;
    }

    setSyncStatus({ type: 'loading', message: 'Syncing with GitHub...' });

    try {
      // 1. Get current file from GitHub to get SHA (for updating)
      const url = `https://api.github.com/repos/${ghConfig.repo}/contents/${ghConfig.path}`;
      const headers = {
        'Authorization': `token ${ghConfig.token}`,
        'Accept': 'application/vnd.github.v3+json',
      };

      let sha = '';
      let remoteNotes: Note[] = [];

      const getResponse = await fetch(url, { headers });
      
      if (getResponse.ok) {
        const data = await getResponse.json();
        sha = data.sha;
        const decodedContent = atob(data.content);
        remoteNotes = JSON.parse(decodedContent);
      } else if (getResponse.status !== 404) {
        throw new Error(`Failed to fetch from GitHub: ${getResponse.statusText}`);
      }

      // 2. Merge logic (Simple "most recent wins" by updatedAt per ID)
      const mergedMap = new Map<string, Note>();
      
      // Add remote notes to map
      remoteNotes.forEach(n => mergedMap.set(n.id, n));
      
      // Add local notes to map, overwriting if local is newer
      notes.forEach(n => {
        const existing = mergedMap.get(n.id);
        if (!existing || n.updatedAt > existing.updatedAt) {
          mergedMap.set(n.id, n);
        }
      });

      const finalNotes = Array.from(mergedMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);
      setNotes(finalNotes);

      // 3. Push merged content back to GitHub
      const content = JSON.stringify(finalNotes, null, 2);
      const putResponse = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: 'Sync notes from Kingfisher App',
          content: btoa(unescape(encodeURIComponent(content))), // Handle unicode
          sha: sha || undefined
        })
      });

      if (!putResponse.ok) {
        const errorData = await putResponse.json();
        throw new Error(errorData.message || 'Failed to upload to GitHub');
      }

      setSyncStatus({ type: 'success', message: 'Successfully synced with GitHub!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSyncStatus({ type: 'idle' }), 3000);

    } catch (error: any) {
      console.error('Sync error:', error);
      setSyncStatus({ 
        type: 'error', 
        message: error.message || 'An unexpected error occurred during sync.' 
      });
    }
  };

  // INSTALL GATE
  if (!isStandalone) {
    return (
      <div className="h-screen bg-sky-50 flex flex-col items-center justify-center p-8 text-center font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-sky-200 border border-sky-100 max-w-sm w-full relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 opacity-5">
            <Bird size={200} />
          </div>
          
          <div className="w-20 h-20 bg-sky-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-sky-200">
            <Bird size={40} className="transform -rotate-12" />
          </div>
          
          <h1 className="text-3xl font-display font-bold text-sky-950 mb-3 tracking-tight">Kingfisher</h1>
          <p className="text-sky-800/60 font-medium mb-12 leading-relaxed">
            Swift thoughts, captured instantly. <br/>Install the app to begin.
          </p>
          
          <button 
            onClick={handleInstallClick}
            className="w-full py-4 bg-sky-600 text-white font-bold rounded-2xl hover:bg-sky-700 transition-all shadow-xl shadow-sky-200 flex items-center justify-center gap-3 active:scale-95"
          >
            <Download size={20} />
            Install Kingfisher
          </button>
          
          {/* iOS specific hint */}
          <div className="mt-8 pt-8 border-t border-sky-50">
            <p className="text-[10px] text-sky-300 font-bold uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2">
              <Share size={12} />
              iOS Instructions
            </p>
            <div className="flex items-center justify-center gap-4 text-sky-400">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                  <Share size={14} />
                </div>
                <span className="text-[8px] font-bold">1. Share</span>
              </div>
              <div className="w-4 h-px bg-sky-100" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                  <ArrowUp size={14} />
                </div>
                <span className="text-[8px] font-bold">2. Add to Home</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // FULL APP (STANDALONE ONLY)
  return (
    <div className="flex h-screen bg-sky-50/30 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 bg-white border-r border-sky-100 flex flex-col h-full shadow-lg shadow-sky-900/5 z-10">
        <div className="p-5 border-b border-sky-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500 rounded-xl text-white shadow-md shadow-sky-200">
              <Bird size={24} className="transform -rotate-12" />
            </div>
            <h1 className="font-display font-bold text-sky-950 tracking-tight text-lg">Kingfisher</h1>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-sky-400 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-all"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <button 
              onClick={createNote}
              className="p-2 bg-sky-600 text-white hover:bg-sky-700 rounded-xl transition-all shadow-md shadow-sky-200"
              title="New Note"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Sync Status Bar */}
        <div className="px-4 py-2 bg-sky-50/50 border-b border-sky-100 flex items-center justify-between text-[10px] uppercase tracking-wider font-bold">
          <div className="flex items-center gap-2">
            {syncStatus.type === 'loading' && <RefreshCw size={12} className="animate-spin text-sky-600" />}
            {syncStatus.type === 'success' && <CircleCheck size={12} className="text-emerald-500" />}
            {syncStatus.type === 'error' && <CircleX size={12} className="text-orange-500" />}
            {syncStatus.type === 'idle' && <Waves size={12} className="text-sky-300" />}
            <span className={
              syncStatus.type === 'error' ? 'text-orange-600' : 
              syncStatus.type === 'success' ? 'text-emerald-600' : 
              'text-sky-600/60'
            }>
              {syncStatus.message || (ghConfig.token ? 'River Stream Clear' : 'Unconnected')}
            </span>
          </div>
          {syncStatus.type !== 'loading' && (
            <button 
              onClick={syncWithGithub}
              className="text-sky-600 hover:text-sky-800 transition-colors"
            >
              Dive
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notes.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-sky-50 text-sky-200 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-sky-100">
                <Bird size={32} />
              </div>
              <p className="text-sm text-sky-800/50 font-medium">No notes in the nest.</p>
            </div>
          ) : (
            notes.map(note => (
              <button
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all group relative overflow-hidden ${
                  activeNoteId === note.id 
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-200' 
                    : 'hover:bg-sky-50 text-slate-700 bg-transparent'
                }`}
              >
                {activeNoteId === note.id && (
                  <motion.div 
                    layoutId="active-bg"
                    className="absolute inset-0 bg-sky-500 -z-10"
                  />
                )}
                <div className={`font-bold line-clamp-1 ${activeNoteId === note.id ? 'text-white' : 'text-sky-950'}`}>
                  {note.title || 'Untitled Note'}
                </div>
                <div className={`text-xs mt-1 line-clamp-2 ${activeNoteId === note.id ? 'text-sky-100' : 'text-slate-500'}`}>
                  {note.content || 'Start a new thought...'}
                </div>
                <div className={`text-[10px] mt-3 font-medium ${activeNoteId === note.id ? 'text-sky-200' : 'text-sky-300'}`}>
                  {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Editor component */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <Bird size={400} className="text-sky-900" />
        </div>
        {activeNote ? (
          <>
            <div className="p-6 border-b border-sky-50 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                className="text-2xl font-display font-bold text-sky-950 bg-transparent border-none focus:outline-none focus:ring-0 w-full placeholder:text-sky-100"
                placeholder="Name your thought..."
              />
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => deleteNote(activeNote.id)}
                  className="p-2.5 text-orange-400 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all"
                  title="Delete Note"
                >
                  <Trash2 size={22} />
                </button>
                <div className="h-8 w-px bg-sky-50 mx-1"></div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1">
                    <Save size={12} />
                    Nest Sync
                  </span>
                  <span className="text-[9px] text-sky-200 font-medium">Autosaved locally</span>
                </div>
              </div>
            </div>
            <textarea
              value={activeNote.content}
              onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
              className="flex-1 p-10 text-lg text-slate-700 bg-transparent resize-none focus:outline-none focus:ring-0 leading-relaxed font-sans placeholder:text-sky-100 z-10"
              placeholder="Capture the moment..."
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden bg-gradient-to-br from-sky-50 to-white">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-24 h-24 bg-white text-sky-500 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-sky-200 border-2 border-sky-50">
                <Bird size={48} className="transform -rotate-12" />
              </div>
              <h2 className="text-3xl font-display font-bold text-sky-950 mb-4 tracking-tight">Welcome to the Nest</h2>
              <p className="max-w-xs text-sky-800/60 font-medium leading-relaxed">
                Your thoughts are swift as a Kingfisher. Catch them before they fly away!
              </p>
              <button 
                onClick={createNote}
                className="mt-10 px-8 py-3 bg-sky-600 text-white font-bold rounded-2xl hover:bg-sky-700 transition-all shadow-xl shadow-sky-200 flex items-center gap-2 mx-auto"
              >
                <Plus size={20} />
                Create New Note
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-sky-950/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-sky-50"
            >
              <div className="p-8 border-b border-sky-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-sky-950 text-white rounded-2xl shadow-lg">
                    <Cloud size={24} />
                  </div>
                  <h2 className="text-xl font-display font-bold text-sky-950">GitHub Dive Sync</h2>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 text-sky-300 hover:bg-sky-50 hover:text-sky-600 rounded-full transition-all"
                >
                  <X size={28} />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <p className="text-sm text-sky-800/60 leading-relaxed font-medium">
                  Store your notes in the great river of GitHub. They'll be safe and accessible across all your devices.
                </p>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Key size={14} />
                      River Access Token
                    </label>
                    <input
                      type="password"
                      value={ghConfig.token}
                      onChange={(e) => setGhConfig({ ...ghConfig, token: e.target.value })}
                      placeholder="ghp_xxxxxxxxxxxx"
                      className="w-full px-5 py-4 bg-sky-50/50 border border-sky-100 rounded-2xl focus:ring-4 focus:ring-sky-100 focus:border-sky-300 outline-none transition-all text-sm font-mono placeholder:text-sky-200"
                    />
                    <p className="text-[10px] text-sky-300 font-medium pl-1">
                      Create at <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">GitHub</a> with 'repo' scope.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Database size={14} />
                      Nest Branch (user/repo)
                    </label>
                    <input
                      type="text"
                      value={ghConfig.repo}
                      onChange={(e) => setGhConfig({ ...ghConfig, repo: e.target.value })}
                      placeholder="username/notes-nest"
                      className="w-full px-5 py-4 bg-sky-50/50 border border-sky-100 rounded-2xl focus:ring-4 focus:ring-sky-100 focus:border-sky-300 outline-none transition-all text-sm font-mono placeholder:text-sky-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <FileText size={14} />
                      Current Stream
                    </label>
                    <input
                      type="text"
                      value={ghConfig.path}
                      onChange={(e) => setGhConfig({ ...ghConfig, path: e.target.value })}
                      placeholder="thoughts.json"
                      className="w-full px-5 py-4 bg-sky-50/50 border border-sky-100 rounded-2xl focus:ring-4 focus:ring-sky-100 focus:border-sky-300 outline-none transition-all text-sm font-mono placeholder:text-sky-200"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-sky-50/50 flex items-center justify-end gap-4">
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-8 py-3.5 font-bold text-sky-800/60 hover:text-sky-950 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setIsSettingsOpen(false);
                    syncWithGithub();
                  }}
                  className="px-8 py-3.5 bg-sky-600 text-white font-bold rounded-2xl hover:bg-sky-700 transition-all shadow-xl shadow-sky-200 flex items-center gap-2"
                >
                  <Sparkles size={18} />
                  Start Diving
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
