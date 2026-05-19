import React from 'react';
import { useTrainingCore, getEmbeddedTasks } from '../../TrainingCore/core/TrainingCore';
import { FileCode, CheckCircle, Lock, PlayCircle } from 'lucide-react';

export function TaskBrowserWidget({ onClose }: { onClose?: () => void }) {
  const { currentTask, selectTask, masteryState } = useTrainingCore();
  const tasks = getEmbeddedTasks();

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = [];
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  return (
    <div className="flex flex-col h-full bg-kingfisher-panel w-full">
      <div className="p-4 border-b border-kingfisher-border hidden md:block">
        <h2 className="text-sm font-semibold tracking-wider text-kingfisher-muted uppercase">Tutorial Packs</h2>
      </div>
      <div className="flex-1 overflow-y-auto w-full">
        {Object.entries(groupedTasks).map(([category, catTasks]) => (
          <div key={category} className="mb-4">
            <h3 className="px-4 py-2 text-xs font-semibold text-kingfisher-muted uppercase bg-black/20">{category}</h3>
            <ul>
              {catTasks.map(task => {
                const isActive = currentTask?.id === task.id;
                const status = masteryState[task.id] || 'locked';

                return (
                  <li key={task.id}>
                    <button
                      onClick={() => {
                        selectTask(task);
                        if (onClose) onClose();
                      }}
                      className={`w-full text-left px-4 py-4 flex items-center gap-4 transition-colors ${isActive ? 'bg-kingfisher-blue/20 border-l-4 border-kingfisher-blue' : 'border-l-4 border-transparent hover:bg-black/10'}`}
                    >
                      {status === 'completed' && <CheckCircle className="shrink-0 w-5 h-5 text-green-500" />}
                      {status === 'locked' && <Lock className="shrink-0 w-5 h-5 text-kingfisher-muted/50" />}
                      {status === 'available' && <PlayCircle className="shrink-0 w-5 h-5 text-kingfisher-muted" />}
                      
                      <span className={`text-sm md:text-base ${isActive ? 'text-white font-medium' : 'text-kingfisher-surface'}`}>{task.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
