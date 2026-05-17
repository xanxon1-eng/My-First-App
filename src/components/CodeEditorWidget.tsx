import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useTrainingCore } from '../core/TrainingCore';
import { FileCode2, BookOpen } from 'lucide-react';

export function CodeEditorWidget() {
  const { currentTask, documents, activeDocumentId, setActiveDocument, updateDocument } = useTrainingCore();

  const activeDoc = documents.find(d => d.id === activeDocumentId);

  useEffect(() => {
    // If we have a task but no document is selected, select the first one
    if (documents.length > 0 && !activeDocumentId) {
      setActiveDocument(documents[0].id);
    }
  }, [documents, activeDocumentId, setActiveDocument]);

  if (!currentTask) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
        <BookOpen className="w-12 h-12 mb-4 opacity-50" />
        <p>Select a task from the Training Browser to begin.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* File Tabs */}
      <div className="flex border-b border-[#2a2a2a] bg-[#1a1a1a] overflow-x-auto shrink-0">
        {documents.map(doc => (
          <button
            key={doc.id}
            onClick={() => setActiveDocument(doc.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm border-r border-[#2a2a2a] transition-colors
              ${activeDocumentId === doc.id ? 'bg-[#1e1e1e] text-blue-400 border-t-2 border-t-blue-500' : 'bg-transparent text-gray-400 hover:bg-[#252525] border-t-2 border-t-transparent'}`}
          >
            <FileCode2 className={`w-4 h-4 ${doc.languageKind === 'header' ? 'text-purple-400' : 'text-blue-400'}`} />
            {doc.filePath} {doc.isDirty && '*'}
          </button>
        ))}
      </div>

      {/* Editor Space and Task Objective */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 overflow-hidden">
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
              }}
            />
          )}
        </div>

        {/* Task Objective Context Panel */}
        <div className="w-64 border-l border-[#2a2a2a] bg-[#181818] p-4 overflow-y-auto shrink-0 text-sm">
          <h3 className="font-semibold text-white mb-2 pb-2 border-b border-[#2a2a2a]">Objective</h3>
          <p className="text-gray-300 leading-relaxed mb-6">{currentTask.objective}</p>
          
          <h3 className="font-semibold text-white mb-2 pb-2 border-b border-[#2a2a2a]">Rules & Criteria</h3>
          <ul className="list-disc pl-4 space-y-2 text-gray-400 text-xs">
            {currentTask.successCriteria.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
