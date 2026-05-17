import React, { useEffect, useRef } from 'react';
import { useTrainingCore } from '../core/TrainingCore';

export function ConsoleOutputWidget() {
  const { consoleOutput } = useTrainingCore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleOutput]);

  return (
    <div className="h-full bg-[#121212] font-mono text-sm p-4 overflow-y-auto">
      {consoleOutput.length === 0 ? (
        <span className="text-gray-600">Console ready...</span>
      ) : (
        consoleOutput.map((line, idx) => {
          let textColor = 'text-gray-300';
          if (line.includes('Failed') || line.includes('Error')) textColor = 'text-red-400';
          else if (line.includes('Success')) textColor = 'text-green-400';
          else if (line.includes('[Build Worker]')) textColor = 'text-cyan-400';
          else if (line.includes('[Evaluator]')) textColor = 'text-purple-400';

          return (
            <div key={idx} className={`leading-relaxed ${textColor}`}>
              {line}
            </div>
          );
        })
      )}
      <div ref={bottomRef} />
    </div>
  );
}
