import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useTrainingCore } from '../../TrainingCore/core/TrainingCore';
import { Play, RotateCcw, Monitor, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export function CppSchoolEditor() {
  const {
    currentTask,
    documents,
    activeDocumentId,
    diagnostics,
    consoleOutput,
    isCompiling,
    isTesting,
    setActiveDocument,
    updateDocument,
    compileAndTest,
    resetTask,
  } = useTrainingCore();

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the terminal logs
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleOutput]);

  if (!currentTask || documents.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-kingfisher-muted bg-kingfisher-dark/40 h-full p-6 text-center">
        <Monitor className="w-12 h-12 mb-4 opacity-30 text-kingfisher-blue" />
        <p className="text-sm">Select any Unreal training module to write C++ code.</p>
      </div>
    );
  }

  const activeDoc = documents.find((d) => d.id === activeDocumentId) || documents[0];

  return (
    <div className="flex flex-col h-full w-full bg-kingfisher-dark overflow-hidden">
      {/* File Tab Switcher */}
      <div className="flex items-center gap-1 border-b border-kingfisher-border/50 bg-black/30 px-3 shrink-0 select-none">
        {documents.map((doc) => {
          const isActive = doc.id === activeDoc.id;
          return (
            <button
              key={doc.id}
              onClick={() => setActiveDocument(doc.id)}
              className={`px-3 py-2 text-xs font-mono font-medium transition-colors border-t-2 relative ${
                isActive
                  ? 'bg-kingfisher-dark text-white border-kingfisher-warm'
                  : 'text-kingfisher-muted hover:text-white hover:bg-black/10 border-transparent'
              }`}
            >
              <span>{doc.filePath}</span>
              {doc.isDirty && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-kingfisher-warm" />
              )}
            </button>
          );
        })}
      </div>

      {/* Editor & Console Grid */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Editor Wrapper */}
        <div className="flex-1 min-h-0 bg-black/40 relative border-b border-kingfisher-border/40">
          <Editor
            height="100%"
            language={activeDoc.languageKind === 'header' ? 'cpp' : 'cpp'}
            theme="vs-dark"
            value={activeDoc.textBuffer}
            onChange={(val) => updateDocument(activeDoc.id, val || '')}
            options={{
              fontSize: 13,
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              automaticLayout: true,
              tabSize: 4,
              padding: { top: 12 },
              suggest: {
                showWords: true,
              },
            }}
          />
          
          {/* Quick status overlays */}
          {isCompiling && (
            <div className="absolute inset-0 bg-kingfisher-dark/80 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 transition-opacity">
              <div className="w-8 h-8 rounded-full border-4 border-kingfisher-warm border-t-transparent animate-spin mb-3" />
              <div className="text-xs font-mono text-kingfisher-warm tracking-wider uppercase animate-pulse">
                Unreal Header Tool scanning dependencies...
              </div>
            </div>
          )}
          {isTesting && (
            <div className="absolute inset-0 bg-kingfisher-dark/80 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 transition-opacity">
              <div className="w-8 h-8 rounded-full border-4 border-kingfisher-blue border-t-transparent animate-spin mb-3" />
              <div className="text-xs font-mono text-kingfisher-blue tracking-wider uppercase">
                UTestFrameworkBindings: running hidden criteria check...
              </div>
            </div>
          )}
        </div>

        {/* Console / Output Tabs */}
        <div className="h-56 shrink-0 bg-black/80 border-t border-kingfisher-border/30 flex flex-col overflow-hidden">
          {/* Output Header */}
          <div className="h-9 border-b border-kingfisher-border/30 bg-black/40 flex items-center justify-between px-4 shrink-0 select-none">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-semibold text-kingfisher-muted uppercase tracking-wider">
                Unreal Build Tool Output (UBT)
              </span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={resetTask}
                title="Reset Starter Code"
                className="flex items-center gap-1 text-[10px] bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 px-2 py-1 rounded text-white font-semibold transition-all"
              >
                <RotateCcw className="w-3 h-3 text-kingfisher-warm" />
                <span>Reset</span>
              </button>
              <button
                onClick={compileAndTest}
                disabled={isCompiling || isTesting}
                className="flex items-center gap-1.5 text-[10px] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 active:scale-95 px-3 py-1 rounded text-white font-bold tracking-tight shadow-lg transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Compile & Test (F5)</span>
              </button>
            </div>
          </div>

          {/* Log Lines Area */}
          <div className="flex-1 overflow-y-auto p-3 font-mono text-xs text-slate-300 space-y-1.5 selection:bg-kingfisher-blue/30 select-text">
            {consoleOutput.map((line, idx) => {
              let color = 'text-slate-400';
              if (line.includes('Success') || line.includes('succeeded') || line.includes('met.')) {
                color = 'text-green-400 font-semibold';
              } else if (line.includes('Failed') || line.includes('Violated') || line.includes('errors')) {
                color = 'text-red-400 font-semibold';
              } else if (line.includes('[Build Worker]') || line.includes('[Evaluator]')) {
                color = 'text-kingfisher-warm';
              } else if (line.includes('[Clangd Bridge]')) {
                color = 'text-blue-400';
              }
              
              return (
                <div key={idx} className={`${color} leading-relaxed break-all`}>
                  {line}
                </div>
              );
            })}
            <div ref={consoleEndRef} />
          </div>
        </div>
      </div>

      {/* Diagnostics Panel if failures exist */}
      {diagnostics.length > 0 && (
        <div className="border-t border-red-950 bg-red-950/20 p-4 shrink-0 max-h-48 overflow-y-auto">
          <div className="flex items-center gap-2 text-red-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Unreal Compiler Errors ({diagnostics.length})</span>
          </div>
          <div className="space-y-3">
            {diagnostics.map((diag) => (
              <div key={diag.id} className="text-xs bg-black/40 border border-red-500/20 rounded p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-mono text-red-300 font-medium">
                    [{diag.category}] Line {diag.line}: {diag.message}
                  </div>
                </div>
                {diag.explanation && (
                  <p className="text-slate-400 mt-1 leading-relaxed">{diag.explanation}</p>
                )}
                {diag.suggestedFix && (
                  <div className="mt-2 p-2 bg-emerald-950/20 border border-emerald-500/20 rounded font-mono text-emerald-400">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-500 mb-0.5">Suggested Fix:</div>
                    <pre className="whitespace-pre-wrap">{diag.suggestedFix}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
