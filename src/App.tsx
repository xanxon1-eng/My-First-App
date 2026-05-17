import React, { useState } from 'react';
import { 
  Layout, 
  GitBranch, 
  Hammer, 
  ChevronRight, 
  BookOpen, 
  Bird, 
  ScrollText,
  Boxes,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Component Imports
import SkillTreeEditor from './components/SkillTreeEditor';
import QuestMatrix from './components/QuestMatrix';
import CraftingSimulator from './components/CraftingSimulator';
import UnrealLab from './components/UnrealLab';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'unreal' | 'skill-tree' | 'quests' | 'crafting' | 'overview';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layout },
    { id: 'unreal', label: 'Unreal Engine Lab', icon: Boxes },
    { id: 'skill-tree', label: 'Passive Skill Forge', icon: GitBranch },
    { id: 'quests', label: 'Quest Matrix', icon: ScrollText },
    { id: 'crafting', label: 'Deep Itemization', icon: Hammer },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'skill-tree': return <SkillTreeEditor />;
      case 'quests': return <QuestMatrix />;
      case 'crafting': return <CraftingSimulator />;
      case 'unreal': return <UnrealLab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="flex h-screen bg-kingfisher-dark text-kingfisher-surface overflow-hidden font-sans">
      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 bg-kingfisher-dark/80 backdrop-blur-md z-40 border-b border-kingfisher-blue/20">
        <div className="flex items-center gap-2">
           <Bird className="w-6 h-6 text-kingfisher-warm" />
           <span className="font-bold text-lg">Kingfisher</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-kingfisher-blue">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:relative w-64 h-full border-r border-kingfisher-blue/20 bg-kingfisher-dark/95 md:bg-kingfisher-dark/50 backdrop-blur-md flex flex-col z-50 transition-transform duration-300",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
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
                onClick={() => {
                  setActiveTab(tab.id as Tab);
                  setIsSidebarOpen(false);
                }}
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
                animate={{ width: '35%' }}
                className="h-full bg-kingfisher-warm"
              />
            </div>
            <p className="text-[10px] text-kingfisher-muted mt-2 uppercase text-center font-bold">Systems Loaded</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative pt-20 md:pt-0">
        <div className="absolute top-0 right-0 p-8 h-64 w-64 bg-kingfisher-warm/5 blur-[100px] pointer-events-none rounded-full"></div>
        <div className="absolute bottom-0 left-0 p-8 h-96 w-96 bg-kingfisher-blue/5 blur-[120px] pointer-events-none rounded-full"></div>

        <div className="p-6 md:p-12 max-w-7xl mx-auto relative z-10 h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function OverviewTab() {
  return (
     <div className="space-y-12">
        <header>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter"
          >
            Architecting the <br/>
            <span className="text-kingfisher-warm">Open World RPG</span>
          </motion.h1>
          <p className="text-kingfisher-muted text-xl max-w-2xl leading-relaxed">
            A technical guide to building complex RPG systems. 
            Bridge high-level design with Unreal Engine 5 performance patterns.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SystemCard 
            title="Path of Exile Systems" 
            description="Deep dive into scalable itemization, gem-based skill modifiers, and massive passive trees."
            icon={GitBranch}
            color="blue"
          />
          <SystemCard 
            title="The Witcher 3 Quests" 
            description="Branching narratives, persistent world states, and meaningful decision trees."
            icon={ScrollText}
            color="warm"
          />
          <SystemCard 
            title="Unreal Engine Core" 
            description="Scalable Actor architectures, Component-based logic, and C++ performance."
            icon={Boxes}
            color="deep"
          />
        </div>

        <section className="bg-kingfisher-dark/40 border border-kingfisher-blue/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-kingfisher-blue/20 rounded-2xl">
              <BookOpen className="w-8 h-8 text-kingfisher-blue" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Engineering Roadmap</h2>
              <p className="text-kingfisher-muted text-sm">Translating design goals into optimized framework systems.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <ObjectiveItem 
              title="Optimized Foundation" 
              status="active" 
              description="Setting up the scalable architecture for every framework system." 
            />
            <ObjectiveItem 
              title="Passive Skill Tree Editor" 
              status="active" 
              description="Interactive node positioning and connection logic simulation." 
            />
            <ObjectiveItem 
              title="Quest Flow Matrix" 
              status="active" 
              description="Decision-driven world state management simulation." 
            />
            <ObjectiveItem 
              title="Deep Crafting Engine" 
              status="active" 
              description="Mathematical backend for modular item modification." 
            />
          </div>
        </section>
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
    <div className="group bg-kingfisher-dark/50 border border-kingfisher-blue/5 rounded-[2rem] p-8 hover:border-kingfisher-blue/30 transition-all hover:-translate-y-2 cursor-pointer shadow-xl hover:shadow-kingfisher-blue/5">
      <div className={cn("inline-flex p-4 rounded-2xl mb-6 transition-transform group-hover:scale-110", colors[color])}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-bold mb-3 text-kingfisher-surface">{title}</h3>
      <p className="text-kingfisher-muted text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function ObjectiveItem({ title, description, status }: { title: string, description: string, status: 'active' | 'pending' }) {
  return (
    <div className="flex gap-6 p-6 rounded-3xl hover:bg-kingfisher-blue/5 transition-colors border border-transparent hover:border-kingfisher-blue/10">
      <div className="mt-1">
        {status === 'active' ? (
          <div className="w-5 h-5 rounded-full bg-kingfisher-warm shadow-[0_0_15px_rgba(233,187,147,0.5)] animate-pulse" />
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-kingfisher-muted" />
        )}
      </div>
      <div>
        <h4 className={cn("text-lg font-bold", status === 'active' ? "text-kingfisher-surface" : "text-kingfisher-muted")}>{title}</h4>
        <p className="text-sm text-kingfisher-muted">{description}</p>
      </div>
    </div>
  );
}

