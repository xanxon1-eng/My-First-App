import React, { useState } from 'react';
import { 
  Layout, 
  GitBranch, 
  Hammer, 
  Settings, 
  ChevronRight, 
  BookOpen, 
  Bird, 
  ScrollText,
  Boxes,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'unreal' | 'skill-tree' | 'quests' | 'crafting' | 'overview';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layout },
    { id: 'unreal', label: 'Unreal Engine Lab', icon: Boxes },
    { id: 'skill-tree', label: 'Passive Skill Forge', icon: GitBranch },
    { id: 'quests', label: 'Quest Matrix', icon: ScrollText },
    { id: 'crafting', label: 'Deep Itemization', icon: Hammer },
  ];

  return (
    <div className="flex h-screen bg-kingfisher-dark text-kingfisher-surface overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-kingfisher-blue/20 bg-kingfisher-dark/50 backdrop-blur-md flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-kingfisher-deep rounded-xl flex items-center justify-center shadow-lg shadow-kingfisher-deep/20 text-white rotate-3 group overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
             <Bird className="w-6 h-6 relative z-10" />
          </div>
          <span className="font-bold text-lg tracking-tight text-kingfisher-surface">
            Kingfisher <span className="text-kingfisher-warm">App</span>
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                  isActive 
                    ? "bg-kingfisher-blue text-white shadow-lg shadow-kingfisher-blue/30" 
                    : "text-kingfisher-muted hover:bg-kingfisher-blue/10 hover:text-kingfisher-surface"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-kingfisher-blue")} />
                {tab.label}
                {isActive && <ChevronRight className="ml-auto w-4 h-4" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-kingfisher-blue/20">
          <div className="bg-kingfisher-blue/10 rounded-2xl p-4 border border-kingfisher-blue/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-kingfisher-warm" />
              <span className="text-xs font-bold text-kingfisher-surface uppercase tracking-wider">Dev Status</span>
            </div>
            <div className="h-2 w-full bg-kingfisher-dark rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '15%' }}
                className="h-full bg-kingfisher-warm"
              />
            </div>
            <p className="text-[10px] text-kingfisher-muted mt-2 uppercase">Foundation: Integrated</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute top-0 right-0 p-8 h-64 w-64 bg-kingfisher-warm/5 blur-[100px] pointer-events-none rounded-full"></div>
        <div className="absolute bottom-0 left-0 p-8 h-96 w-96 bg-kingfisher-blue/5 blur-[120px] pointer-events-none rounded-full"></div>

        <div className="p-8 max-w-6xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <header>
                  <h1 className="text-4xl font-bold mb-4">Architecting the <span className="text-kingfisher-warm">Open World RPG</span></h1>
                  <p className="text-kingfisher-muted text-lg max-w-2xl">
                    This interactive development sandbox is designed to bridge the gap between high-level RPG concepts and technical Unreal Engine 5 implementation.
                  </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* System Cards */}
                  <SystemCard 
                    title="Path of Exile Systems" 
                    description="Deep dive into scalable itemization, gem-based skill modifiers, and massive passive trees."
                    icon={GitBranch}
                    color="blue"
                  />
                  <SystemCard 
                    title="Witcher 3 questing" 
                    description="Architecting branching narratives, persistent world states, and meaningful decision trees."
                    icon={ScrollText}
                    color="warm"
                  />
                  <SystemCard 
                    title="Unreal Engine Core" 
                    description="Scalable Actor architectures, Component-based logic, and C++ RPG performance patterns."
                    icon={Boxes}
                    color="deep"
                  />
                </div>

                <section className="bg-kingfisher-dark/40 border border-kingfisher-blue/20 rounded-3xl p-8 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-kingfisher-blue/20 rounded-lg">
                      <BookOpen className="w-5 h-5 text-kingfisher-blue" />
                    </div>
                    <h2 className="text-2xl font-bold">Latest Learning Objectives</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <ObjectiveItem 
                      title="Optimized Foundation" 
                      status="active" 
                      description="Setting up the scalable architecture for every framework system." 
                    />
                    <ObjectiveItem 
                      title="Passive Skill Tree Editor" 
                      status="pending" 
                      description="Interactive node positioning and connection logic simulation." 
                    />
                    <ObjectiveItem 
                      title="Item Modifiers & Gems" 
                      status="pending" 
                      description="Mathematical backend for Path of Exile style item crafting." 
                    />
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab !== 'overview' && (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
              >
                <div className="w-20 h-20 bg-kingfisher-blue/10 rounded-3xl flex items-center justify-center mb-6 border border-kingfisher-blue/20 ring-4 ring-kingfisher-blue/5">
                  <Settings className="w-10 h-10 text-kingfisher-blue animate-spin-slow" />
                </div>
                <h2 className="text-3xl font-bold mb-2">System Initializing</h2>
                <p className="text-kingfisher-muted max-w-sm">
                  The {tabs.find(t => t.id === activeTab)?.label} workspace is currently being engineered for optimized scalability.
                </p>
                <button 
                  onClick={() => setActiveTab('overview')}
                  className="mt-8 text-kingfisher-warm hover:underline flex items-center gap-2 group"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  Return to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SystemCard({ title, description, icon: Icon, color }: { title: string, description: string, icon: any, color: 'blue' | 'warm' | 'deep' }) {
  const colors = {
    blue: "bg-kingfisher-blue/10 border-kingfisher-blue/20 text-kingfisher-blue",
    warm: "bg-kingfisher-warm/10 border-kingfisher-warm/20 text-kingfisher-warm",
    deep: "bg-kingfisher-deep/10 border-kingfisher-deep/20 text-kingfisher-deep",
  };

  return (
    <div className="group bg-kingfisher-dark/50 border border-kingfisher-blue/10 rounded-2xl p-6 hover:border-kingfisher-blue/30 transition-all hover:-translate-y-1">
      <div className={cn("inline-flex p-3 rounded-xl mb-4 transition-transform group-hover:scale-110", colors[color])}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-kingfisher-surface">{title}</h3>
      <p className="text-kingfisher-muted text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function ObjectiveItem({ title, description, status }: { title: string, description: string, status: 'active' | 'pending' }) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl hover:bg-kingfisher-blue/5 transition-colors border border-transparent hover:border-kingfisher-blue/10">
      <div className="mt-1">
        {status === 'active' ? (
          <div className="w-4 h-4 rounded-full bg-kingfisher-warm animate-pulse" />
        ) : (
          <div className="w-4 h-4 rounded-full border-2 border-kingfisher-muted" />
        )}
      </div>
      <div>
        <h4 className={cn("font-bold", status === 'active' ? "text-kingfisher-surface" : "text-kingfisher-muted")}>{title}</h4>
        <p className="text-sm text-kingfisher-muted">{description}</p>
      </div>
    </div>
  );
}
