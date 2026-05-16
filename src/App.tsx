import React, { useState, useEffect } from 'react';
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
  ArrowUp,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_VERSION } from './constants';

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

const INTERFACE_ID = (window as any).INITIAL_ID || 'NEST-INIT';

function Footer() {
  return (
    <div className="fixed bottom-1 left-0 right-0 flex justify-center items-center gap-4 text-[8px] font-mono opacity-20 pointer-events-none select-none z-[9999]">
      <span>v{APP_VERSION}</span>
      <span>{INTERFACE_ID}</span>
    </div>
  );
}

export default function App() {
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
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
    // Initial check
    const checkStandalone = () => {
      if (typeof window === 'undefined') return false;
      
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                               (window.navigator as any).standalone === true;
      
      // Also check for a URL parameter we might have set
      const urlParams = new URLSearchParams(window.location.search);
      const isPWAUrl = urlParams.get('source') === 'pwa';
      
      return isStandaloneMode || isPWAUrl;
    };

    setIsStandalone(checkStandalone());

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // Watch for display-mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const listener = (e: MediaQueryListEvent | Event) => {
      setIsStandalone(checkStandalone());
    };
    
    // Support both new and old listener styles for cross-browser safety
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(listener);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else if ((mediaQuery as any).removeListener) {
        (mediaQuery as any).removeListener(listener);
      }
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      // Show manual instructions
      setIsInstallModalOpen(true);
    }
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
    // On mobile, close sidebar when a note is created/selected
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const selectNote = (id: string) => {
    setActiveNoteId(id);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
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
      // Clear error after 5 seconds
      setTimeout(() => setSyncStatus({ type: 'idle' }), 5000);
    }
  };

  return (
    <div className="flex h-screen bg-king-base overflow-hidden font-sans relative text-king-neutral">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        initial={false}
        animate={{ 
          x: isSidebarOpen ? 0 : -320,
          opacity: isSidebarOpen ? 1 : 0
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed lg:relative w-80 flex-shrink-0 bg-king-base/50 backdrop-blur-2xl border-r border-king-muted/10 flex flex-col h-full z-30"
      >
        <div className="p-5 border-b border-king-muted/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-king-accent rounded-xl text-king-neutral shadow-lg shadow-king-accent/20">
              <Bird size={24} className="transform -rotate-12" />
            </div>
            <h1 className="font-display font-bold text-king-neutral tracking-tight text-xl">Kingfisher</h1>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-king-muted hover:bg-king-muted/10 hover:text-king-accent rounded-xl transition-all"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <button 
              onClick={createNote}
              className="p-2 bg-king-accent text-king-neutral hover:bg-king-brown rounded-xl transition-all shadow-lg shadow-king-accent/20"
              title="New Note"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Sync Status Bar */}
        <div className="px-4 py-2 bg-black/20 border-b border-king-muted/10 flex items-center justify-between text-[10px] uppercase tracking-wider font-bold">
          <div className="flex items-center gap-2">
            {syncStatus.type === 'success' && <CircleCheck size={12} className="text-emerald-400" />}
            {syncStatus.type === 'error' && <CircleX size={12} className="text-king-accent" />}
            {syncStatus.type === 'idle' && <Waves size={12} className="text-king-muted" />}
            <span className={
              syncStatus.type === 'error' ? 'text-king-accent' : 
              syncStatus.type === 'success' ? 'text-emerald-400' : 
              'text-king-muted'
            }>
              {syncStatus.message || (ghConfig.token ? 'River Stream Clear' : 'Unconnected')}
            </span>
          </div>
          {syncStatus.type !== 'loading' && (
            <button 
              onClick={syncWithGithub}
              className="text-king-accent hover:text-king-neutral transition-colors"
            >
              Dive
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-24">
          {notes.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-king-muted/5 text-king-muted rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-king-muted/10">
                <Bird size={32} />
              </div>
              <p className="text-sm text-king-muted font-medium">No notes in the nest.</p>
            </div>
          ) : (
            notes.map(note => (
              <button
                key={note.id}
                onClick={() => selectNote(note.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all group relative overflow-hidden ${
                  activeNoteId === note.id 
                    ? 'bg-king-accent text-king-neutral shadow-lg shadow-king-accent/20' 
                    : 'hover:bg-king-muted/10 text-king-secondary bg-transparent'
                }`}
              >
                <div className={`font-bold line-clamp-1 ${activeNoteId === note.id ? 'text-king-neutral' : 'text-king-neutral'}`}>
                  {note.title || 'Untitled Note'}
                </div>
                <div className={`text-xs mt-1 line-clamp-2 ${activeNoteId === note.id ? 'text-king-neutral/80' : 'text-king-muted'}`}>
                  {note.content || 'Start a new thought...'}
                </div>
                <div className={`text-[10px] mt-3 font-medium ${activeNoteId === note.id ? 'text-king-neutral/60' : 'text-king-muted/40'}`}>
                  {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-king-muted/10 bg-black/20">
          {!isStandalone && (
            <button 
              onClick={handleInstallClick}
              className="w-full py-3 bg-king-muted/5 text-king-muted text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-king-muted/10 transition-colors flex items-center justify-center gap-2 mb-3"
            >
              <Download size={12} />
              Install App
            </button>
          )}
          <div className="flex items-center justify-center opacity-20 text-[8px] font-mono">
            <span>KINGFISHER v{APP_VERSION}</span>
          </div>
        </div>
      </motion.div>

      {/* Editor component */}
      <div className="flex-1 flex flex-col bg-king-base overflow-hidden relative">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-king-muted/10 flex items-center justify-between bg-king-base/80 backdrop-blur-md z-10 sticky top-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-king-muted hover:bg-king-muted/10 rounded-xl"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Bird size={20} className="text-king-accent" />
            <span className="font-display font-bold text-king-neutral">Kingfisher</span>
          </div>
          <button 
            onClick={createNote}
            className="p-2 text-king-accent hover:bg-king-muted/10 rounded-xl"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none hidden lg:block">
          <Bird size={400} className="text-king-neutral" />
        </div>
        
        {activeNote ? (
          <>
            <div className="p-6 border-b border-king-muted/10 flex items-center justify-between bg-king-base/40 backdrop-blur-md z-10">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                className="text-xl lg:text-2xl font-display font-bold text-king-neutral bg-transparent border-none focus:outline-none focus:ring-0 w-full placeholder:text-king-neutral/10"
                placeholder="Name your thought..."
              />
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => deleteNote(activeNote.id)}
                  className="p-2.5 text-king-accent hover:bg-king-accent/10 rounded-xl transition-all"
                  title="Delete Note"
                >
                  <Trash2 size={22} />
                </button>
                <div className="h-8 w-px bg-king-muted/10 mx-1 hidden sm:block"></div>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] font-bold text-king-accent uppercase tracking-widest flex items-center gap-1">
                    <Save size={12} />
                    Nest Sync
                  </span>
                  <span className="text-[9px] text-king-muted/40 font-medium">Autosaved locally</span>
                </div>
              </div>
            </div>
            <textarea
              value={activeNote.content}
              onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
              className="flex-1 p-6 lg:p-10 text-base lg:text-lg text-king-neutral/80 bg-transparent resize-none focus:outline-none focus:ring-0 leading-relaxed font-sans placeholder:text-king-neutral/10 z-10"
              placeholder="Capture the moment..."
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <div className="w-24 h-24 bg-king-muted/5 text-king-accent rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-king-accent/10 border border-king-muted/10 mx-auto">
                <Bird size={48} className="transform -rotate-12" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold text-king-neutral mb-4 tracking-tight">Welcome to the Nest</h2>
              <p className="max-w-xs text-king-muted font-medium leading-relaxed mx-auto">
                Your thoughts are swift as a Kingfisher. Catch them before they fly away!
              </p>
              <button 
                onClick={createNote}
                className="mt-10 px-8 py-3 bg-king-accent text-king-neutral font-bold rounded-2xl hover:bg-king-brown transition-all shadow-xl shadow-king-accent/20 flex items-center gap-2 mx-auto"
              >
                <Plus size={20} />
                Create New Note
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Install Modal */}
      <AnimatePresence>
        {isInstallModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-king-base rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden border border-king-muted/10 p-8 text-center"
            >
              <div className="w-16 h-16 bg-king-accent text-king-neutral rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-king-accent/20">
                <Bird size={32} className="transform -rotate-12" />
              </div>
              
              <h2 className="text-2xl font-display font-bold text-king-neutral mb-3">Install Kingfisher</h2>
              <p className="text-king-muted font-medium text-sm mb-8 leading-relaxed">
                Add Kingfisher to your home screen for the best experience.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 text-left p-4 bg-king-muted/5 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-king-base flex items-center justify-center shrink-0 shadow-sm">
                    <Share size={16} className="text-king-accent" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-king-muted/40 uppercase tracking-wider">Step 1</div>
                    <div className="text-xs font-semibold text-king-neutral/80">Tap the Share/Menu button in your browser</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-left p-4 bg-king-muted/5 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-king-base flex items-center justify-center shrink-0 shadow-sm">
                    <Plus size={16} className="text-king-accent" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-king-muted/40 uppercase tracking-wider">Step 2</div>
                    <div className="text-xs font-semibold text-king-neutral/80">Select "Add to Home Screen"</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsInstallModalOpen(false)}
                className="w-full py-4 bg-king-accent text-king-neutral font-bold rounded-2xl hover:bg-king-brown transition-all shadow-xl shadow-king-accent/20"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-king-base rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-king-muted/10"
            >
              <div className="p-8 border-b border-king-muted/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-king-accent text-king-neutral rounded-2xl shadow-lg">
                    <Cloud size={24} />
                  </div>
                  <h2 className="text-xl font-display font-bold text-king-neutral">GitHub Dive Sync</h2>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 text-king-muted/40 hover:bg-king-muted/10 hover:text-king-accent rounded-full transition-all"
                >
                  <X size={28} />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <p className="text-sm text-king-muted leading-relaxed font-medium">
                  Store your notes in the great river of GitHub. They'll be safe and accessible across all your devices.
                </p>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-king-muted/40 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Key size={14} />
                      River Access Token
                    </label>
                    <input
                      type="password"
                      value={ghConfig.token}
                      onChange={(e) => setGhConfig({ ...ghConfig, token: e.target.value })}
                      placeholder="ghp_xxxxxxxxxxxx"
                      className="w-full px-5 py-4 bg-king-muted/5 border border-king-muted/10 rounded-2xl focus:ring-4 focus:ring-king-accent/10 focus:border-king-accent/30 outline-none transition-all text-sm font-mono text-king-neutral placeholder:text-king-neutral/10"
                    />
                    <p className="text-[10px] text-king-muted/40 font-medium pl-1">
                      Create at <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-king-accent hover:underline">GitHub</a> with 'repo' scope.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-king-muted/40 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Database size={14} />
                      Nest Branch (user/repo)
                    </label>
                    <input
                      type="text"
                      value={ghConfig.repo}
                      onChange={(e) => setGhConfig({ ...ghConfig, repo: e.target.value })}
                      placeholder="username/notes-nest"
                      className="w-full px-5 py-4 bg-king-muted/5 border border-king-muted/10 rounded-2xl focus:ring-4 focus:ring-king-accent/10 focus:border-king-accent/30 outline-none transition-all text-sm font-mono text-king-neutral placeholder:text-king-neutral/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-king-muted/40 uppercase tracking-[0.2em] flex items-center gap-2">
                      <FileText size={14} />
                      Current Stream
                    </label>
                    <input
                      type="text"
                      value={ghConfig.path}
                      onChange={(e) => setGhConfig({ ...ghConfig, path: e.target.value })}
                      placeholder="thoughts.json"
                      className="w-full px-5 py-4 bg-king-muted/5 border border-king-muted/10 rounded-2xl focus:ring-4 focus:ring-king-accent/10 focus:border-king-accent/30 outline-none transition-all text-sm font-mono text-king-neutral placeholder:text-king-neutral/10"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-black/20 flex items-center justify-end gap-4">
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-6 py-3 font-bold text-king-muted/40 hover:text-king-neutral transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setIsSettingsOpen(false);
                    syncWithGithub();
                  }}
                  className="px-8 py-3 bg-king-accent text-king-neutral font-bold rounded-2xl hover:bg-king-brown transition-all shadow-xl shadow-king-accent/20 flex items-center gap-2"
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
