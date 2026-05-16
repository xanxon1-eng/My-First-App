import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  RefreshCcw,
  Sparkles
} from 'lucide-react';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  status: 'pending' | 'in-progress' | 'complete' | 'legendary';
}

const ROADMAP: RoadmapItem[] = [
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

export default function App() {
  const [count, setCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'pwa-guide'>('roadmap');

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
      {/* Header */}
      <header className="border-b border-brand-border bg-brand-bg/80 backdrop-blur-md sticky top-0 z-50">
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
        {/* Navigation Tabs */}
        <div className="flex gap-8 mb-12 border-b border-brand-border">
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
          {/* Left Column: Content */}
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

                  <div className="data-grid">
                    {ROADMAP.map((item) => (
                      <div key={item.id} className="card-step group h-full flex flex-col">
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
                      <div className="bg-cyan-500 p-3 rounded-full text-brand-bg">
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
                      Here is the ELI5 on the core components you just added to your repo:
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
                          Think of this as your <strong>App's ID Card</strong>. It tells Android/iOS: 
                          "Hey, I'm not just a website. My name is World Builder, use this icon, 
                          and hide the browser toolbar when you open me."
                        </p>
                        <div className="code-snippet">
{`{
  "name": "World Builder",
  "display": "standalone",
  "icons": [...]
}`}
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
                          intercepts network requests. If your phone goes into a cave (offline), 
                          this script says: "No internet? No problem. I have the files in my pocket."
                        </p>
                        <div className="code-snippet">
{`self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
  );
});`}
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-xl">
                      <h4 className="font-bold mb-4 flex items-center gap-2">
                        <RefreshCcw className="w-4 h-4 text-indigo-400" />
                        Next Steps for Mobile Installation
                      </h4>
                      <ol className="space-y-4 text-sm text-slate-400">
                        <li className="flex gap-3">
                          <span className="flex-none w-6 h-6 rounded-full bg-slate-800 text-indigo-400 font-bold flex items-center justify-center text-[10px] border border-slate-700">1</span>
                          <span>Open the URL in your phone's browser (Chrome on Android).</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-none w-6 h-6 rounded-full bg-slate-800 text-indigo-400 font-bold flex items-center justify-center text-[10px] border border-slate-700">2</span>
                          <span>Wait for the <strong>"Add to Home Screen"</strong> prompt or find it in the browser menu.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-none w-6 h-6 rounded-full bg-slate-800 text-indigo-400 font-bold flex items-center justify-center text-[10px] border border-slate-700">3</span>
                          <span>Once installed, it will appear as an app in your launcher, no URL bar in sight.</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Interaction Counter */}
          <div className="space-y-6">
            <div className="card-step !border-cyan-500/20 !bg-cyan-500/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none" />
              
              <div className="relative z-10 space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-1">State Sync Test</h3>
                  <p className="text-xs text-slate-400">Verifying reactive state & PWA storage persistence.</p>
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
                    <button 
                      onClick={() => setCount(0)}
                      className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors"
                    >
                      <RefreshCcw className="w-5 h-5 p-0.5" />
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-cyan-500/10 text-center">
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-cyan-500/60">
                    Persistence: Active
                  </p>
                </div>
              </div>
            </div>

            <div className="card-step !p-4 bg-slate-900/10">
              <p className="text-[10px] text-slate-500 leading-relaxed italic">
                "Real world building is about the foundation. Each click is a commitment to the architecture."
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-brand-border py-8 mt-12 bg-brand-bg/50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 font-mono italic">
            Developed by XanXon for the Next Gen RPG Vision
          </p>
          <div className="flex gap-6">
            <a href="#" className="underline-offset-4 hover:underline text-cyan-500/70 hover:text-cyan-400 text-xs transition-colors">Documentation</a>
            <a href="#" className="underline-offset-4 hover:underline text-cyan-500/70 hover:text-cyan-400 text-xs transition-colors">Source Code</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
