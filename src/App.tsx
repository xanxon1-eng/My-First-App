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
  X
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
  NOTES: 'uhu_notes_v1',
  GH_CONFIG: 'uhu_gh_config_v1'
};

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [ghConfig, setGhConfig] = useState<GithubConfig>({
    token: '',
    repo: 'XanXon1/uhu-club-data', // Example default
    path: 'notes.json'
  });
  const [syncStatus, setSyncStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

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
          message: 'Sync notes from Uhu Notes App',
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

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <FileText size={20} />
            </div>
            <h1 className="font-bold text-slate-900 tracking-tight">Uhu Notes</h1>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <button 
              onClick={createNote}
              className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
              title="New Note"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Sync Status Bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-medium">
            {syncStatus.type === 'loading' && <RefreshCw size={14} className="animate-spin text-indigo-600" />}
            {syncStatus.type === 'success' && <CircleCheck size={14} className="text-emerald-600" />}
            {syncStatus.type === 'error' && <CircleX size={14} className="text-rose-600" />}
            {syncStatus.type === 'idle' && <Cloud size={14} className="text-slate-400" />}
            <span className={
              syncStatus.type === 'error' ? 'text-rose-600' : 
              syncStatus.type === 'success' ? 'text-emerald-600' : 
              'text-slate-500'
            }>
              {syncStatus.message || (ghConfig.token ? 'Ready to sync' : 'Cloud sync not configured')}
            </span>
          </div>
          {syncStatus.type !== 'loading' && (
            <button 
              onClick={syncWithGithub}
              className="text-indigo-600 hover:text-indigo-700 font-bold"
            >
              Sync
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notes.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={24} />
              </div>
              <p className="text-sm text-slate-500">No notes yet. Create your first one!</p>
            </div>
          ) : (
            notes.map(note => (
              <button
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  activeNoteId === note.id 
                    ? 'bg-indigo-50 border-indigo-200 shadow-sm border' 
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="font-bold text-slate-800 line-clamp-1">{note.title || 'Untitled Note'}</div>
                <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {note.content || 'No content...'}
                </div>
                <div className="text-[10px] text-slate-400 mt-2">
                  {new Date(note.updatedAt).toLocaleDateString()} {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Editor component */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {activeNote ? (
          <>
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                className="text-xl font-bold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                placeholder="Note Title"
              />
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => deleteNote(activeNote.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Note"
                >
                  <Trash2 size={20} />
                </button>
                <div className="h-6 w-px bg-slate-200 mx-1"></div>
                <span className="text-xs text-slate-400 px-2 flex items-center gap-1">
                  <Save size={14} />
                  Saved locally
                </span>
              </div>
            </div>
            <textarea
              value={activeNote.content}
              onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
              className="flex-1 p-8 text-lg text-slate-700 bg-transparent resize-none focus:outline-none focus:ring-0 leading-relaxed font-serif"
              placeholder="Start writing..."
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mb-6">
              <FileText size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to Uhu Notes</h2>
            <p className="max-w-xs text-slate-500">
              Select a note from the sidebar or click the plus button to create a new one.
            </p>
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 text-white rounded-lg">
                    <Database size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">GitHub Cloud Sync</h2>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-5">
                <p className="text-sm text-slate-500">
                  To keep your notes permanent across devices without a traditional database, you can sync them to a private GitHub repository.
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Key size={14} />
                      Personal Access Token
                    </label>
                    <input
                      type="password"
                      value={ghConfig.token}
                      onChange={(e) => setGhConfig({ ...ghConfig, token: e.target.value })}
                      placeholder="ghp_xxxxxxxxxxxx"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm font-mono"
                    />
                    <p className="text-[10px] text-slate-400">
                      Create one at <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-indigo-600 underline">GitHub Settings</a> with 'repo' scope.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Database size={14} />
                      Repository (user/repo)
                    </label>
                    <input
                      type="text"
                      value={ghConfig.repo}
                      onChange={(e) => setGhConfig({ ...ghConfig, repo: e.target.value })}
                      placeholder="username/my-notes-data"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <FileText size={14} />
                      Data Path
                    </label>
                    <input
                      type="text"
                      value={ghConfig.path}
                      onChange={(e) => setGhConfig({ ...ghConfig, path: e.target.value })}
                      placeholder="notes.json"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setIsSettingsOpen(false);
                    syncWithGithub();
                  }}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                >
                  <RefreshCw size={18} />
                  Save & Sync
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
