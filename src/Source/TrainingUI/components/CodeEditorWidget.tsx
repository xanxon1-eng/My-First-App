import React, { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useTrainingCore } from '../../TrainingCore/core/TrainingCore';
import { FileCode2, BookOpen, ChevronDown, ChevronRight } from 'lucide-react';
import Markdown from 'react-markdown';

export function CodeEditorWidget() {
  const { currentTask, documents, activeDocumentId, setActiveDocument, updateDocument } = useTrainingCore();
  const [showObjective, setShowObjective] = useState(false);

  const activeDoc = documents.find(d => d.id === activeDocumentId);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEditorChange = (value: string | undefined) => {
    if (!activeDoc) return;
    const newText = value || '';
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a new timer to debounce updates to the training core (simulating debounced AST parse)
    debounceTimerRef.current = setTimeout(() => {
      updateDocument(activeDoc.id, newText);
    }, 500);
  };

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
             <div className="markdown-body mb-4 text-sm">
               <Markdown>{currentTask.objective}</Markdown>
             </div>
             <h3 className="font-semibold text-white mb-2 pb-2 border-b border-kingfisher-border/50 text-sm">Rules & Criteria</h3>
             <ul className="list-disc pl-4 space-y-1 text-kingfisher-muted text-xs mb-4">
                {currentTask.successCriteria.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
             </ul>
             {currentTask.exampleSolutions && currentTask.exampleSolutions.length > 0 && (
               <div>
                 <h3 className="font-semibold text-white mb-2 pb-2 border-b border-kingfisher-border/50 text-sm">Example Solutions</h3>
                 <div className="space-y-3">
                   {currentTask.exampleSolutions.map((solution, idx) => (
                     <details key={solution.id} className="group bg-black/20 border border-kingfisher-border rounded-md overflow-hidden">
                       <summary className="flex items-center justify-between px-3 py-2 cursor-pointer select-none text-xs text-kingfisher-muted hover:text-white hover:bg-black/40">
                         <span className="font-medium">Solution {idx + 1}: {solution.title}</span>
                         <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
                       </summary>
                       <div className="border-t border-kingfisher-border/50 bg-black/40 p-3">
                         {solution.explanation && (
                           <p className="text-xs text-kingfisher-surface mb-3">{solution.explanation}</p>
                         )}
                         {Object.entries(solution.code).map(([filename, fileCode]) => (
                           <div key={filename} className="mb-2 last:mb-0">
                             <div className="text-[10px] text-kingfisher-blue font-mono mb-1">{filename}</div>
                             <pre className="text-[10px] text-gray-300 font-mono overflow-x-auto whitespace-pre p-2 bg-kingfisher-dark rounded border border-kingfisher-border">
                               {fileCode.trim()}
                             </pre>
                           </div>
                         ))}
                       </div>
                     </details>
                   ))}
                 </div>
               </div>
             )}
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
              onChange={handleEditorChange}
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
          <div className="markdown-body mb-6 text-sm">
            <Markdown>{currentTask.objective}</Markdown>
          </div>
          
          <h3 className="font-semibold text-white mb-2 pb-2 border-b border-kingfisher-border">Rules & Criteria</h3>
          <ul className="list-disc pl-4 space-y-2 text-kingfisher-muted text-xs mb-6">
            {currentTask.successCriteria.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>

          {currentTask.exampleSolutions && currentTask.exampleSolutions.length > 0 && (
            <div>
              <h3 className="font-semibold text-white mb-2 pb-2 border-b border-kingfisher-border">Example Solutions</h3>
              <div className="space-y-3">
                {currentTask.exampleSolutions.map((solution, idx) => (
                  <details key={solution.id} className="group bg-black/20 border border-kingfisher-border rounded-md overflow-hidden">
                    <summary className="flex items-center justify-between px-3 py-2 cursor-pointer select-none text-xs text-kingfisher-muted hover:text-white hover:bg-black/40">
                      <span className="font-medium">Solution {idx + 1}: {solution.title}</span>
                      <ChevronDown className="w-3.5 h-3.5 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="border-t border-kingfisher-border/50 bg-black/40 p-3">
                      {solution.explanation && (
                        <p className="text-xs text-kingfisher-surface mb-3">{solution.explanation}</p>
                      )}
                      {Object.entries(solution.code).map(([filename, fileCode]) => (
                        <div key={filename} className="mb-2 last:mb-0">
                          <div className="text-[10px] text-kingfisher-blue font-mono mb-1">{filename}</div>
                          <pre className="text-[10px] text-gray-300 font-mono overflow-x-auto whitespace-pre p-2 bg-kingfisher-dark rounded border border-kingfisher-border">
                            {fileCode.trim()}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
