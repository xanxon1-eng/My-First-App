import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle, Database } from 'lucide-react';
import { CodeEditorWidget } from './components/CodeEditorWidget';
import { DiagnosticsPanelWidget } from './components/DiagnosticsPanelWidget';
import { TaskBrowserWidget } from './components/TaskBrowserWidget';
import { ConsoleOutputWidget } from './components/ConsoleOutputWidget';
import { ProgressWidget } from './components/ProgressWidget';
import { useTrainingCore } from './core/TrainingCore';

export default function App() {
  const [activeBottomPanel, setActiveBottomPanel] = useState<'console' | 'diagnostics'>('diagnostics');
  const { currentTask, isCompiling, isTesting, compileAndTest, resetTask } = useTrainingCore();

  return (
    <div className="flex flex-col h-full w-full bg-unreal-dark text-unreal-text font-sans overflow-hidden">
      {/* Top Header */}
      <header className="h-12 border-b border-unreal-border bg-unreal-panel flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-unreal-blue" />
          <h1 className="font-semibold tracking-wide text-sm">Unreal Engine C++ Training Shell</h1>
        </div>
        <div className="flex items-center gap-4">
          <ProgressWidget />
          <div className="flex items-center gap-2 border-l border-unreal-border pl-4">
            <button 
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-unreal-border hover:bg-unreal-border/80 rounded"
              onClick={resetTask}
              disabled={isCompiling || isTesting}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button 
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-unreal-blue text-white rounded hover:bg-unreal-blue/90 disabled:opacity-50"
              onClick={compileAndTest}
              disabled={isCompiling || isTesting}
            >
              <Play className="w-3.5 h-3.5" fill="currentColor" /> 
              {isCompiling ? 'Compiling...' : isTesting ? 'Running Tests...' : 'Compile & Run'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Task Browser */}
        <aside className="w-72 border-r border-unreal-border bg-unreal-panel flex flex-col shrink-0">
          <TaskBrowserWidget />
        </aside>

        {/* Center: Editor & Bottom Panels */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
          {/* Top Center: Code Editor */}
          <div className="flex-1 flex flex-col border-b border-unreal-border min-h-0">
            <CodeEditorWidget />
          </div>

          {/* Bottom Center: Tools Panel */}
          <div className="h-64 flex flex-col bg-unreal-panel shrink-0">
            {/* Panel Tabs */}
            <div className="flex items-center border-b border-unreal-border px-2">
              <button 
                className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${activeBottomPanel === 'diagnostics' ? 'border-unreal-blue text-white' : 'border-transparent text-unreal-muted hover:text-white'}`}
                onClick={() => setActiveBottomPanel('diagnostics')}
              >
                Diagnostics Panel
              </button>
              <button 
                className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${activeBottomPanel === 'console' ? 'border-unreal-blue text-white' : 'border-transparent text-unreal-muted hover:text-white'}`}
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
    </div>
  );
}

