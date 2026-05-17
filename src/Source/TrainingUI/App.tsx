import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle, Database, Bird, Menu, X, LayoutDashboard, Keyboard } from 'lucide-react';
import { CodeEditorWidget } from './components/CodeEditorWidget';
import { DiagnosticsPanelWidget } from './components/DiagnosticsPanelWidget';
import { TaskBrowserWidget } from './components/TaskBrowserWidget';
import { ConsoleOutputWidget } from './components/ConsoleOutputWidget';
import { ProgressWidget } from './components/ProgressWidget';
import { UnrealShortcutsModal } from './components/UnrealShortcutsModal';
import { useTrainingCore } from '../TrainingCore/core/TrainingCore';

export default function App() {
  const [activeBottomPanel, setActiveBottomPanel] = useState<'console' | 'diagnostics'>('diagnostics');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const { currentTask, isCompiling, isTesting, compileAndTest, resetTask } = useTrainingCore();

  return (
    <div className="flex flex-col h-full w-full bg-kingfisher-dark text-kingfisher-surface font-sans overflow-hidden">
      {/* Top Header */}
      <header className="h-14 border-b border-kingfisher-border bg-kingfisher-panel flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button className="md:hidden text-kingfisher-muted hover:text-white" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-kingfisher-deep rounded-md flex items-center justify-center text-white shadow-md">
            <Bird className="w-5 h-5" />
          </div>
          <h1 className="font-semibold tracking-wide text-sm text-white">Kingfisher <span style={{ color: '#e9bb93' }}>App</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4">
            <button 
              onClick={() => setIsShortcutsOpen(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-kingfisher-muted hover:text-white transition-colors"
              title="Unreal Engine Shortcuts"
            >
              <Keyboard className="w-4 h-4" />
              <span>Shortcuts</span>
            </button>
            <ProgressWidget />
          </div>
          <div className="flex items-center gap-2 border-l border-kingfisher-border pl-4">
            <button 
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-kingfisher-panel hover:bg-kingfisher-border rounded"
              onClick={resetTask}
              disabled={isCompiling || isTesting}
            >
              <RotateCcw className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Reset</span>
            </button>
            <button 
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-kingfisher-blue text-white rounded hover:bg-opacity-90 disabled:opacity-50"
              onClick={compileAndTest}
              disabled={isCompiling || isTesting}
            >
              <Play className="w-3.5 h-3.5" fill="currentColor" /> 
              <span className="hidden sm:inline">
                {isCompiling ? 'Compiling...' : isTesting ? 'Running...' : 'Compile'}
              </span>
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
            <span className="font-semibold text-sm text-white">Curriculum</span>
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

        {/* Center: Editor & Bottom Panels */}
        <main className="flex-1 flex flex-col min-w-0 bg-kingfisher-dark relative">
          {/* Top Center: Code Editor */}
          <div className="flex-1 flex flex-col border-b border-kingfisher-border min-h-0">
            <CodeEditorWidget />
          </div>

          {/* Bottom Center: Tools Panel */}
          <div className="h-1/3 md:h-64 flex flex-col bg-kingfisher-panel shrink-0">
            {/* Panel Tabs */}
            <div className="flex items-center border-b border-kingfisher-border px-2">
              <button 
                className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${activeBottomPanel === 'diagnostics' ? 'border-kingfisher-blue text-white' : 'border-transparent text-kingfisher-muted hover:text-white'}`}
                onClick={() => setActiveBottomPanel('diagnostics')}
              >
                Diagnostics Panel
              </button>
              <button 
                className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${activeBottomPanel === 'console' ? 'border-kingfisher-blue text-white' : 'border-transparent text-kingfisher-muted hover:text-white'}`}
                onClick={() => setActiveBottomPanel('console')}
              >
                Output Console
              </button>
            </div>
            
            {/* Panel Content */}
            <div className="flex-1 overflow-hidden relative">
              {activeBottomPanel === 'diagnostics' && <DiagnosticsPanelWidget />}
              {activeBottomPanel === 'console' && <ConsoleOutputWidget />}
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
}

