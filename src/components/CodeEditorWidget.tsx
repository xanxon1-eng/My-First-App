import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useTrainingCore } from '../core/TrainingCore';
import { FileCode2, BookOpen, ChevronDown, ChevronRight } from 'lucide-react';

export function CodeEditorWidget() {
  const { currentTask, documents, activeDocumentId, setActiveDocument, updateDocument } = useTrainingCore();
  const [showObjective, setShowObjective] = useState(false);

  const activeDoc = documents.find(d => d.id === activeDocumentId);

  useEffect(() => {
    // If we have a task but no document is selected, select the first one
    if (documents.length > 0 && !activeDocumentId) {
      setActiveDocument(documents[0].id);
    }
  }, [documents, activeDocumentId, setActiveDocument]);

  if (!currentTask) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-kingfisher-muted">
        <BookOpen className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-center px-4">Select a task from the Curriculum to begin.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-kingfisher-dark">
      {/* File Tabs */}
      <div className="flex border-b border-kingfisher-border bg-kingfisher-panel overflow-x-auto shrink-0 hide-scrollbar">
        {documents.map(doc => (
          <button
            key={doc.id}
            onClick={() => setActiveDocument(doc.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm border-r border-kingfisher-border transition-colors whitespace-nowrap
              ${activeDocumentId === doc.id ? 'bg-kingfisher-dark text-kingfisher-warm border-t-2 border-t-kingfisher-deep shadow-inner' : 'bg-transparent text-kingfisher-muted hover:bg-white/5 border-t-2 border-t-transparent'}`}
          >
            <FileCode2 className={`w-4 h-4 ${doc.languageKind === 'header' ? 'text-purple-400' : 'text-kingfisher-blue'}`} />
            {doc.filePath} {doc.isDirty && '*'}
          </button>
        ))}
      </div>

      {/* Mobile Objective Toggle */}
      <div className="md:hidden border-b border-kingfisher-border bg-black/20 shrink-0">
        <button 
          onClick={() => setShowObjective(!showObjective)}
          className="flex items-center justify-between w-full px-4 py-2 text-sm text-kingfisher-surface"
        >
          <span className="font-semibold text-white">Objective & Rules</span>
          {showObjective ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {showObjective && (
          <div className="px-4 pb-4">
             <p className="text-kingfisher-surface leading-relaxed mb-4 text-sm">{currentTask.objective}</p>
             <h3 className="font-semibold text-white mb-2 pb-2 border-b border-kingfisher-border/50 text-sm">Rules & Criteria</h3>
             <ul className="list-disc pl-4 space-y-1 text-kingfisher-muted text-xs">
                {currentTask.successCriteria.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
             </ul>
          </div>
        )}
      </div>

      {/* Editor Space and Task Objective */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Editor Area */}
        <div className="flex-1 overflow-hidden relative">
          {activeDoc && (
            <Editor
              height="100%"
              language="cpp"
              theme="vs-dark"
              value={activeDoc.textBuffer}
              onChange={(value) => updateDocument(activeDoc.id, value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'JetBrains Mono',
                scrollBeyondLastLine: false,
                lineNumbersMinChars: 3,
                wordWrap: 'on',
                padding: { top: 16 }
              }}
            />
          )}
        </div>

        {/* Task Objective Context Panel (Desktop) */}
        <div className="hidden md:block w-72 lg:w-80 border-l border-kingfisher-border bg-kingfisher-panel p-4 overflow-y-auto shrink-0 text-sm">
          <h3 className="font-semibold text-white mb-2 pb-2 border-b border-kingfisher-border">Objective</h3>
          <p className="text-kingfisher-surface leading-relaxed mb-6">{currentTask.objective}</p>
          
          <h3 className="font-semibold text-white mb-2 pb-2 border-b border-kingfisher-border">Rules & Criteria</h3>
          <ul className="list-disc pl-4 space-y-2 text-kingfisher-muted text-xs">
            {currentTask.successCriteria.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
