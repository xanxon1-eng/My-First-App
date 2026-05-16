import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Cpu, 
  Layers, 
  Code2, 
  Zap, 
  Wifi, 
  WifiOff, 
  BookOpen, 
  ChevronRight,
  Plus,
  Minus,
  Sparkles
} from 'lucide-react';

const ROADMAP = [
  {
    id: 'ue5-core',
    title: 'Unreal Engine 5 Core',
    description: 'Master C++ basics, Actor systems, and Component architecture for UE 5.7+.',
    icon: Cpu,
    status: 'in-progress',
  },
  {
    id: 'quest-logic',
    title: 'Complex Quest Systems',
    description: 'Event-driven quest chains with meaningful branching decisions.',
    icon: Layers,
    status: 'pending',
  },
  {
    id: 'poe-skills',
    title: 'PoE Skill Systems',
    description: 'Manual node connections, passive tree logic, and dynamic gem-based modifiers.',
    icon: Zap,
    status: 'pending',
  },
  {
    id: 'npc-ai',
    title: 'Advanced NPC Behavior',
    description: 'Utility-based AI and reactive environmental change logic.',
    icon: Gamepad2,
    status: 'pending',
  }
];

function App() {
  const [count, setCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activeTab, setActiveTab] = useState('roadmap');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
              <Gamepad2 className="w-6 h-6 text-cyan-500" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">World Builder</h1>
              <span className="text-[10px] uppercase tracking-widest text-cyan-500/70 font-mono">Development Hub v1.0</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${isOnline ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isOnline ? 'Online' : 'Offline Mode'}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="flex gap-8 mb-12 border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('roadmap')}
            className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === 'roadmap' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            RPG Project Roadmap
            {activeTab === 'roadmap' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
          </button>
          <button 
            onClick={() => setActiveTab('pwa-guide')}
            className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === 'pwa-guide' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            PWA Core Concepts
            {activeTab === 'pwa-guide' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === 'roadmap' ? (
                <motion.div 
                  key="roadmap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">The RPG Foundation</h2>
                    <p className="text-slate-400 max-w-2xl">
                      Tracking your journey to becoming an Unreal Engine master. This app acts as your central 
                      resource repository while you build the next-gen open world.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ROADMAP.map((item) => (
                      <div key={item.id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:border-cyan-500/50 transition-colors group">
                        <div className="p-3 bg-slate-900/50 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                          <item.icon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-400 flex-1">{item.description}</p>
                        <div className="mt-6 flex items-center justify-between">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                            item.status === 'in-progress' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                            'bg-slate-500/10 text-slate-500 border-slate-500/20'
                          }`}>
                            {item.status.replace('-', ' ')}
                          </span>
                          <button className="text-cyan-500 hover:text-cyan-400 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-cyan-500/5 border border-cyan-500/20 p-8 rounded-2xl relative overflow-hidden">
                    <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-cyan-500/10 rotate-12" />
                    <div className="relative z-10 flex gap-6 items-start">
                      <div className="bg-cyan-500 p-3 rounded-full text-slate-900">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-bold text-xl">The Path of Exile Skill Tree Strategy</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          To implement a passive tree like PoE in Unreal, we'll use a <strong>Graph Data Structure</strong>. 
                          Each node stores its XYZ position and links. Jewels are implemented as <em>Dynamic Modifiers</em> 
                          that apply a 'Radius Search' logic to nearby nodes on the C++ backend for extreme performance.
                        </p>
                        <button className="text-cyan-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                          See Implementation Logic <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="pwa-guide"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Understanding PWAs</h2>
                    <p className="text-slate-400">
                      Progressive Web Apps bridge the gap between websites and native apps. 
                    </p>
                  </div>

                  <div className="space-y-12">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                            <Code2 className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-lg text-white">manifest.json</h3>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          Think of this as your <strong>App's ID Card</strong>. It tells the browser: 
                          "Hey, I'm not just a website. My name is World Builder."
                        </p>
                        <div className="font-mono text-xs bg-slate-900/50 p-4 rounded-lg border border-slate-700 overflow-x-auto">
                          <pre>{`{
  "name": "World Builder",
  "display": "standalone"
}`}</pre>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                            <Zap className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-lg text-white">sw.js (Service Worker)</h3>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          This is the <strong>Offline Brain</strong>. It sits in the background and 
                          intercepts network requests.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-cyan-500/20 p-6 rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-1">State Sync Test</h3>
                  <p className="text-xs text-slate-400">Verifying reactive state visibility.</p>
                </div>
                <div className="flex flex-col items-center gap-4 py-8">
                  <motion.div 
                    key={count}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-7xl font-black text-white tabular-nums tracking-tighter"
                  >
                    {count}
                  </motion.div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setCount(prev => Math.max(0, prev - 1))}
                      className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setCount(prev => prev + 1)}
                      className="w-12 h-12 rounded-xl bg-cyan-500 text-slate-900 flex items-center justify-center hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
                    >
                      <Plus className="w-5 h-5 font-bold" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-8 mt-12 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 font-mono italic">
            Developed by XanXon for the Next Gen RPG Vision
          </p>
        </div>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
