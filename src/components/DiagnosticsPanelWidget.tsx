import React from 'react';
import { useTrainingCore } from '../core/TrainingCore';
import { AlertCircle, AlertTriangle, Info, TerminalSquare } from 'lucide-react';

export function DiagnosticsPanelWidget() {
  const { diagnostics, currentTask } = useTrainingCore();

  if (!currentTask) {
    return <div className="p-4 text-kingfisher-muted text-sm">No task running.</div>;
  }

  if (diagnostics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-kingfisher-muted">
        <TerminalSquare className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">No compilation errors or rule violations.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 bg-kingfisher-panel shadow-inner">
      {diagnostics.map(diag => (
        <div key={diag.id} className="bg-red-950/40 border border-red-900/50 rounded-md p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between">
                <h4 className="text-red-400 font-semibold text-sm">{diag.message}</h4>
                <span className="text-xs text-red-300 font-mono bg-red-900/30 px-2 py-0.5 rounded">{diag.file}:{diag.line}</span>
              </div>
              <p className="text-xs font-mono text-gray-400 bg-black/40 px-3 py-2 rounded">
                [{diag.category}]
              </p>
              {diag.explanation && (
                <p className="text-sm text-gray-300 leading-relaxed">
                  <strong className="text-red-300 font-medium">Why it failed:</strong> {diag.explanation}
                </p>
              )}
              {diag.suggestedFix && (
                <div className="bg-green-950/20 border border-green-900/30 px-3 py-2 rounded text-sm text-gray-300">
                  <span className="text-green-500 mr-2">👉</span>
                  {diag.suggestedFix}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
