import React from 'react';
import { useTrainingCore, getMockTasks } from '../core/TrainingCore';
import { FileCode, CheckCircle, Lock, PlayCircle } from 'lucide-react';

export function TaskBrowserWidget() {
  const { currentTask, selectTask, masteryState } = useTrainingCore();
  const tasks = getMockTasks();

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = [];
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  return (
    <div className="flex flex-col h-full bg-[#181818] border-r border-[#2a2a2a]">
      <div className="p-4 border-b border-[#2a2a2a]">
        <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Tutorial Packs</h2>
      </div>
      <div className="flex-1 overflow-y-auto w-full">
        {Object.entries(groupedTasks).map(([category, catTasks]) => (
          <div key={category} className="mb-4">
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-[#141414]">{category}</h3>
            <ul>
              {catTasks.map(task => {
                const isActive = currentTask?.id === task.id;
                const status = masteryState[task.id] || 'locked';

                return (
                  <li key={task.id}>
                    <button
                      onClick={() => selectTask(task)}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${isActive ? 'bg-[#2354a3] bg-opacity-20 border-l-4 border-[#0070d2]' : 'border-l-4 border-transparent hover:bg-[#202020]'}`}
                    >
                      {status === 'completed' && <CheckCircle className="line-w-4 w-4 h-4 text-green-500" />}
                      {status === 'locked' && <Lock className="w-4 h-4 text-gray-600" />}
                      {status === 'available' && <PlayCircle className="w-4 h-4 text-gray-400" />}
                      
                      <span className={`text-sm ${isActive ? 'text-white' : 'text-gray-300'}`}>{task.title}</span>
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
