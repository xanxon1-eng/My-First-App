import React, { useState } from 'react';
import { Bird, Menu, X, Keyboard, Download, ArrowLeft, BookOpen, Code, Trophy } from 'lucide-react';
import { TaskContentWidget } from './TaskContentWidget';
import { TaskBrowserWidget } from './TaskBrowserWidget';
import { CppSchoolEditor } from './CppSchoolEditor';
import { CppSchoolVisualizer } from './CppSchoolVisualizer';
import { UnrealShortcutsModal } from './UnrealShortcutsModal';
import { COLORS } from '../../../constants/colors';

interface CppSchoolProps {
  onBack: () => void;
  showInstallButton: boolean;
  onInstallClick: () => void;
}

type WorkspaceTab = 'theory' | 'editor' | 'sandbox';

export const CppSchool: React.FC<CppSchoolProps> = ({ onBack, showInstallButton, onInstallClick }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('theory');

  return (
    <div className="flex flex-col h-full w-full bg-kingfisher-dark text-kingfisher-surface font-sans overflow-hidden">
      {/* Top Header */}
      <header className="h-16 border-b border-kingfisher-border bg-kingfisher-panel flex items-center justify-between px-4 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden text-kingfisher-muted hover:text-white p-2 -ml-2" 
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <button 
            onClick={onBack}
            className="hidden md:flex items-center gap-2 mr-2 text-kingfisher-muted hover:text-white transition-colors p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 bg-kingfisher-deep rounded-md flex items-center justify-center text-white shadow-md">
            <Bird className="w-5 h-5 text-kingfisher-warm" />
          </div>
          <h1 className="font-semibold tracking-wide text-sm text-white">
            Kingfisher <span style={{ color: COLORS.kingfisher.warm }}>cpp school</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {showInstallButton && (
            <button 
              onClick={onInstallClick}
              className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-all shadow-sm active:scale-95"
              title="Install as App"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Install</span>
            </button>
          )}
          <div className="hidden sm:flex items-center gap-4">
            <button 
              onClick={() => setIsShortcutsOpen(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-kingfisher-muted hover:text-white transition-colors p-2"
              title="Unreal Engine Shortcuts"
            >
              <Keyboard className="w-5 h-5" />
              <span>Shortcuts</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar: Task Browser */}
        <aside className={`
          absolute inset-y-0 left-0 z-20 w-72 bg-kingfisher-dark border-r border-kingfisher-border flex flex-col shrink-0
          transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center justify-between p-4 border-b border-kingfisher-border md:hidden bg-kingfisher-panel">
            <div className="flex items-center gap-2">
              <button onClick={onBack} className="text-kingfisher-muted hover:text-white mr-1">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-sm text-white">Curriculum</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="text-kingfisher-muted hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <TaskBrowserWidget onClose={() => setIsSidebarOpen(false)} />
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/50 z-10 md:hidden" 
            onClick={() => setIsSidebarOpen(false)} 
          />
        )}

        {/* Center Workspace */}
        <main className="flex-1 flex flex-col min-w-0 bg-kingfisher-dark relative">
          
          {/* Subheader Workspace Tab Selector for mobile / split setup */}
          <div className="h-12 border-b border-kingfisher-border bg-black/20 flex items-center justify-between px-4 shrink-0 select-none">
            {/* Split controls tab triggers */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('theory')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'theory' 
                    ? 'bg-kingfisher-blue/20 text-white shadow-inner font-bold' 
                    : 'text-kingfisher-muted hover:text-white hover:bg-black/10'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Theory & Task</span>
              </button>
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'editor' 
                    ? 'bg-kingfisher-blue/20 text-white shadow-inner font-bold' 
                    : 'text-kingfisher-muted hover:text-white hover:bg-black/10'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>C++ Code Editor</span>
              </button>
              
              {/* Only show Sandbox tab trigger in responsive / smaller screens */}
              <button
                onClick={() => setActiveTab('sandbox')}
                className={`lg:hidden flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'sandbox' 
                    ? 'bg-kingfisher-blue/20 text-white shadow-inner font-bold' 
                    : 'text-kingfisher-muted hover:text-white hover:bg-black/10'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Sandbox View</span>
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-kingfisher-muted uppercase bg-black/30 px-3 py-1 rounded border border-white/5">
              <span className="w-2 h-2 rounded-full bg-kingfisher-warm animate-pulse" />
              <span>Split Docked View Enabled</span>
            </div>
          </div>

          {/* Flexible Multi-Column Panel */}
          <div className="flex-1 flex overflow-hidden min-h-0 bg-kingfisher-dark select-none">
            {/* LEFT / CENTER PANEL: Houses Lesson Theory or Monaco Code Editor depending on selection */}
            <div className={`flex-1 flex flex-col min-w-0 h-full border-r border-kingfisher-border/30 ${
              activeTab === 'sandbox' && 'hidden lg:flex'
            }`}>
              {activeTab === 'theory' && (
                <div className="flex-1 overflow-y-auto">
                  <TaskContentWidget />
                </div>
              )}
              {(activeTab === 'editor' || (activeTab === 'sandbox' && typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
                <div className="flex-1 flex flex-col min-h-0">
                  <CppSchoolEditor />
                </div>
              )}
            </div>

            {/* RIGHT PANEL: Houses active Visual Sandbox representation, pinned on large desktop screens */}
            <div className={`
              flex-1 lg:flex-[1.1] flex flex-col min-w-0 h-full bg-slate-900
              ${activeTab === 'sandbox' ? 'flex' : 'hidden lg:flex'}
            `}>
              <CppSchoolVisualizer />
            </div>
          </div>
        </main>
      </div>

      <UnrealShortcutsModal 
        isOpen={isShortcutsOpen} 
        onClose={() => setIsShortcutsOpen(false)} 
      />
    </div>
  );
};
