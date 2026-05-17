import React from 'react';
import { CheckCircle, Circle, AlertCircle, PlayCircle } from 'lucide-react';

interface SpecStep {
  id: number;
  title: string;
  progress: number;
  missing: string[];
}

const specSteps: SpecStep[] = [
  {
    id: 1,
    title: '1. Overall structure',
    progress: 100,
    missing: []
  },
  {
    id: 2,
    title: '2. Unreal module split',
    progress: 100,
    missing: []
  },
  {
    id: 3,
    title: '3. External services, not AI',
    progress: 100,
    missing: []
  },
  {
    id: 4,
    title: '4. Data flow',
    progress: 100,
    missing: []
  },
  {
    id: 5,
    title: '5. Core classes',
    progress: 100,
    missing: []
  },
  {
    id: 6,
    title: '6. Editor layer',
    progress: 100,
    missing: []
  },
  {
    id: 7,
    title: '7. Analysis layer',
    progress: 100,
    missing: []
  },
  {
    id: 8,
    title: '8. Build layer',
    progress: 100,
    missing: []
  },
  {
    id: 9,
    title: '9. Task system',
    progress: 100,
    missing: []
  },
  {
    id: 10,
    title: '10. Feedback engine',
    progress: 100,
    missing: []
  },
  {
    id: 11,
    title: '11. Rule system',
    progress: 100,
    missing: []
  },
  {
    id: 12,
    title: '12. Content model',
    progress: 100,
    missing: []
  },
  {
    id: 13,
    title: '13. Recommended task progression',
    progress: 100,
    missing: []
  },
  {
    id: 14,
    title: '14. Suggested file/folder structure',
    progress: 100,
    missing: []
  },
  {
    id: 15,
    title: '15. Execution model',
    progress: 100,
    missing: []
  },
  {
    id: 16,
    title: '16. Internal App Loop',
    progress: 100,
    missing: []
  },
  {
    id: 17,
    title: '17. Main design principle',
    progress: 100,
    missing: []
  }
];

export function SpecProgressWidget() {
  const overallProgress = Math.round(specSteps.reduce((acc, step) => acc + step.progress, 0) / specSteps.length);

  return (
    <div className="flex flex-col h-full bg-kingfisher-panel overflow-y-auto w-full p-4 text-sm font-sans text-kingfisher-surface">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Spec Implementation Progress</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-3 bg-kingfisher-dark rounded-full overflow-hidden">
            <div 
              className="h-full bg-kingfisher-blue" 
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="font-mono text-kingfisher-muted">{overallProgress}% Overall</span>
        </div>
      </div>

      <div className="space-y-4">
        {specSteps.map(step => (
          <div key={step.id} className="bg-kingfisher-dark rounded-md p-3 border border-kingfisher-border">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-white flex items-center gap-2">
                {step.progress === 100 ? <CheckCircle className="w-4 h-4 text-green-400" /> : 
                 step.progress > 0 ? <PlayCircle className="w-4 h-4 text-kingfisher-blue" /> : 
                 <Circle className="w-4 h-4 text-kingfisher-muted" />}
                {step.title}
              </h3>
              <span className="font-mono text-xs px-2 py-1 bg-kingfisher-panel rounded text-kingfisher-muted">
                {step.progress}%
              </span>
            </div>
            {step.progress < 100 && (
              <div className="mt-2 text-xs">
                <div className="font-semibold text-kingfisher-info mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Missing specific implementations:
                </div>
                <ul className="list-disc pl-5 space-y-1 text-kingfisher-muted">
                  {step.missing.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-3 h-1.5 w-full bg-kingfisher-panel rounded-full overflow-hidden">
              <div 
                className={`h-full ${step.progress === 100 ? 'bg-green-400' : 'bg-kingfisher-blue'}`} 
                style={{ width: `${step.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
