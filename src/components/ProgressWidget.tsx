import React from 'react';
import { useTrainingCore } from '../core/TrainingCore';
import { Trophy } from 'lucide-react';

export function ProgressWidget() {
  const { masteryState } = useTrainingCore();
  
  const total = Object.keys(masteryState).length;
  const completed = Object.values(masteryState).filter(s => s === 'completed').length;
  
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="flex items-center gap-3 bg-[#121212] rounded-full px-3 py-1 border border-[#2a2a2a]">
      <Trophy className={`w-4 h-4 ${percentage === 100 ? 'text-yellow-500' : 'text-gray-500'}`} />
      <div className="flex flex-col">
        <span className="text-[10px] text-gray-400 font-semibold uppercase leading-none mb-1">Mastery Progress</span>
        <div className="w-24 h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-500 ease-out" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <span className="text-xs font-mono font-bold text-gray-300 w-8">{percentage}%</span>
    </div>
  );
}
