import React from 'react';
import { useTrainingCore } from '../../TrainingCore/core/TrainingCore';
import { Trophy } from 'lucide-react';

export function ProgressWidget() {
  const { masteryState } = useTrainingCore();
  
  const total = Object.keys(masteryState).length;
  const completed = Object.values(masteryState).filter(s => s === 'completed').length;
  
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="flex items-center gap-3 bg-kingfisher-dark rounded-full px-3 py-1 border border-kingfisher-border">
      <Trophy className={`w-4 h-4 ${percentage === 100 ? 'text-kingfisher-warm' : 'text-kingfisher-muted'}`} />
      <div className="flex flex-col">
        <span className="text-[10px] text-kingfisher-muted font-semibold uppercase leading-none mb-1">Mastery Progress</span>
        <div className="w-24 h-1.5 bg-black/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-kingfisher-blue transition-all duration-500 ease-out" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <span className="text-xs font-mono font-bold text-kingfisher-surface w-8">{percentage}%</span>
    </div>
  );
}
