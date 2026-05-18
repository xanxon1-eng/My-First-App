import React, { useState } from 'react';
import { useTrainingCore } from '../../TrainingCore/core/TrainingCore';
import { BookOpen, ChevronDown, ChevronRight, CheckCircle, Info } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function TaskContentWidget() {
  const { currentTask } = useTrainingCore();


  if (!currentTask) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-kingfisher-muted bg-kingfisher-dark w-full h-full">
        <BookOpen className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-center px-4">Select a learning module from the Curriculum to begin.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-kingfisher-dark p-6 md:p-10 hide-scrollbar w-full h-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">{currentTask.title}</h1>
      </div>

      <div className="bg-kingfisher-panel rounded-lg border border-kingfisher-border p-6 md:p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-kingfisher-border/50">
          <BookOpen className="w-5 h-5 text-kingfisher-blue" />
          <h2 className="text-lg font-semibold text-white">Objective</h2>
        </div>
        <div className="markdown-body text-kingfisher-surface text-base leading-relaxed">
          <Markdown remarkPlugins={[remarkGfm]}>{currentTask.objective}</Markdown>
        </div>
      </div>

      <div className="bg-kingfisher-panel rounded-lg border border-kingfisher-border p-6 md:p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-kingfisher-border/50">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-semibold text-white">Key Concepts</h2>
        </div>
        <ul className="list-none space-y-3">
          {currentTask.successCriteria.map((c, i) => (
            <li key={i} className="flex gap-3 text-kingfisher-surface text-base">
              <span className="shrink-0 w-2 h-2 rounded-full bg-emerald-500/80 mt-2"></span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {currentTask.exampleSolutions && currentTask.exampleSolutions.length > 0 && (
        <div className="bg-kingfisher-panel rounded-lg border border-kingfisher-border p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-2 border-b border-kingfisher-border/50">
            <Info className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Examples</h2>
          </div>
          <div className="space-y-4">
            {currentTask.exampleSolutions.map((solution, idx) => (
              <details key={solution.id} className="group border border-kingfisher-border rounded-lg overflow-hidden bg-black/20" open>
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none text-sm text-kingfisher-muted hover:text-white hover:bg-black/40 transition-colors">
                  <span className="font-semibold text-white">Example {idx + 1}: {solution.title}</span>
                  <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="border-t border-kingfisher-border/50 bg-black/40 p-4">
                  {solution.explanation && (
                    <p className="text-sm text-kingfisher-surface mb-4 leading-relaxed">{solution.explanation}</p>
                  )}
                  {Object.entries(solution.code).map(([filename, fileCode]) => (
                    <div key={filename} className="mb-4 last:mb-0">
                      <div className="text-xs text-kingfisher-blue font-mono mb-2 flex items-center gap-2">
                        <span>{filename}</span>
                      </div>
                      <pre className="text-sm text-gray-300 font-mono overflow-x-auto whitespace-pre p-4 bg-kingfisher-dark rounded-md border border-kingfisher-border leading-relaxed">
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
  );
}
