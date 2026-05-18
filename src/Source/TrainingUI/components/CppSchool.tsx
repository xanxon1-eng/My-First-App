import React, { useState } from 'react';
import { Bird, Menu, X, Keyboard, Download, ArrowLeft } from 'lucide-react';
import { TaskContentWidget } from './TaskContentWidget';
import { TaskBrowserWidget } from './TaskBrowserWidget';
import { UnrealShortcutsModal } from './UnrealShortcutsModal';
import { COLORS } from '../../../constants/colors';

interface CppSchoolProps {
  onBack: () => void;
  showInstallButton: boolean;
  onInstallClick: () => void;
}

export const CppSchool: React.FC<CppSchoolProps> = ({ onBack, showInstallButton, onInstallClick }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  return (
    <div className="flex flex-col h-full w-full bg-kingfisher-dark text-kingfisher-surface font-sans overflow-hidden">
      {/* Top Header */}
      <header className="h-14 border-b border-kingfisher-border bg-kingfisher-panel flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden text-kingfisher-muted hover:text-white" 
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <button 
            onClick={onBack}
            className="hidden md:flex items-center gap-2 mr-2 text-kingfisher-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 bg-kingfisher-deep rounded-md flex items-center justify-center text-white shadow-md">
            <Bird className="w-5 h-5" />
          </div>
          <h1 className="font-semibold tracking-wide text-sm text-white">
            Kingfisher <span style={{ color: COLORS.kingfisher.warm }}>School</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {showInstallButton && (
            <button 
              onClick={onInstallClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-all shadow-sm active:scale-95"
              title="Install as App"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}
          <div className="hidden sm:flex items-center gap-4">
            <button 
              onClick={() => setIsShortcutsOpen(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-kingfisher-muted hover:text-white transition-colors"
              title="Unreal Engine Shortcuts"
            >
              <Keyboard className="w-4 h-4" />
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

        {/* Center: Reading Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-kingfisher-dark relative">
          <div className="flex-1 flex flex-col min-h-0">
            <TaskContentWidget />
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
