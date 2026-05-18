import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Activity, EyeOff, Layers, Zap } from 'lucide-react';

export default function PerformancePlayground({ onEvent }: { onEvent: (msg: string) => void }) {
  const [actorCount, setActorCount] = useState(10);
  const [fps, setFps] = useState(60);
  const [cpuUsage, setCpuUsage] = useState(15);
  
  // Simulated physics: more actors = lower performance
  useEffect(() => {
    const targetFps = Math.max(15, 60 - Math.floor(actorCount / 10));
    const targetCpu = Math.min(100, 15 + Math.floor(actorCount / 4));
    
    const interval = setInterval(() => {
      setFps(prev => {
        const diff = targetFps - prev;
        return prev + diff * 0.1 + (Math.random() - 0.5) * 2;
      });
      setCpuUsage(prev => {
        const diff = targetCpu - prev;
        return prev + diff * 0.1 + (Math.random() - 0.5) * 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [actorCount]);

  const handleActorChange = (val: number) => {
    setActorCount(val);
    onEvent(`PerformanceManager: Evaluating Frame Budget with ${val} Tickable simulated entities.`);
  };

  const isWarning = fps < 45;
  const isCritical = fps < 30;

  return (
    <div className="flex flex-col gap-4 w-full h-[320px] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/40 rounded-lg border border-white/5">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] font-mono text-blue-300 uppercase">FPerformanceManager::TickBudget()</span>
        </div>
        <div className="text-[9px] font-mono text-blue-500/70 border border-blue-500/20 px-1.5 rounded bg-blue-500/5">
          Global Performance Singleton
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden p-1">
        {/* Layer 2: State / Control Panel */}
        <div className="w-[200px] flex flex-col gap-6 p-4 bg-black/40 border border-white/5 rounded-xl shadow-xl">
           <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5 flex items-center gap-1.5"><Layers className="w-3 h-3 text-gray-500"/> Population</span>
                <span className="text-[8px] text-gray-600 font-mono">Simulated actors</span>
              </div>
              <span className="text-xl font-mono text-blue-400 font-black tracking-tight">{actorCount}</span>
            </div>
            <div className="relative pt-2">
              <input 
                type="range" 
                min="1" 
                max="500" 
                value={actorCount} 
                onChange={(e) => handleActorChange(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 outline-none"
              />
              <div className="flex justify-between text-[7px] text-gray-600 font-bold uppercase mt-2 px-1">
                <span>Optimized</span>
                <span className="text-red-500/70">Overload</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-auto">
             <div className="p-2 border border-slate-700 bg-slate-800/50 rounded flex items-center justify-between px-3">
               <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">CPU Delta</span>
               <span className={`text-[10px] font-mono font-bold ${cpuUsage > 85 ? 'text-red-400' : 'text-blue-400'}`}>{Math.round(cpuUsage)}%</span>
             </div>
             <div className={`p-2 border rounded flex items-center justify-between px-3 ${isCritical ? 'bg-red-900/20 border-red-900 shadow-[inset_0_0_10px_rgba(239,68,68,0.2)]' : isWarning ? 'bg-yellow-900/20 border-yellow-900' : 'bg-green-900/20 border-green-900'}`}>
               <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Render MS</span>
               <span className={`text-[10px] font-mono font-bold ${isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-green-400'}`}>{Math.max(10, Math.round(1000/fps))}ms</span>
             </div>
          </div>
        </div>

        {/* Layer 3: Presentation - Dynamic visualization */}
        <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col relative shadow-2xl">
           <div className="absolute top-0 w-full p-2 bg-slate-950/80 border-b border-white/5 flex items-center justify-between z-20 backdrop-blur-sm">
             <span className="text-[8px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2 px-2">
               <Zap className="w-3 h-3" /> Presentation Adjustments
             </span>
             <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/30' : isWarning ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
               {Math.round(fps)} FPS
             </span>
           </div>
           
           <div className="flex-1 p-6 mt-8 flex flex-col gap-4 relative">
             {/* Scanline effect */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10" />
             
             {/* Optimization Reactions */}
             <div className="relative z-20 flex flex-col gap-3 w-full max-w-[280px] mx-auto opacity-90">
               
               <div className={`p-3 border rounded-lg transition-all duration-500 flex flex-col gap-2 relative overflow-hidden ${isCritical ? 'bg-red-950/40 border-red-500/50' : 'bg-green-950/20 border-green-900/50 grayscale opacity-50'}`}>
                  {isCritical && <motion.div animate={{x: ['-100%', '200%']}} transition={{duration: 2, repeat: Infinity, ease: 'linear'}} className="absolute top-0 w-full h-[1px] bg-red-400 shadow-[0_0_8px_red]" />}
                  <span className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${isCritical ? 'text-red-400' : 'text-green-500'}`}><EyeOff className="w-3 h-3"/> Culling Active</span>
                  <span className="text-[10px] font-mono text-gray-400">Shadow Cascades: {isCritical ? '0' : '3'}</span>
                  <div className="w-full h-1 bg-black rounded overflow-hidden"><motion.div animate={{width: isCritical ? '100%' : '0%'}} className="h-full bg-red-500" /></div>
               </div>

               <div className={`p-3 border rounded-lg transition-all duration-500 flex flex-col gap-2 relative overflow-hidden ${isWarning || isCritical ? 'bg-yellow-950/40 border-yellow-500/50' : 'bg-green-950/20 border-green-900/50 grayscale opacity-50'}`}>
                  {(isWarning || isCritical) && <motion.div animate={{x: ['-100%', '200%']}} transition={{duration: 3, repeat: Infinity, ease: 'linear'}} className="absolute top-0 w-full h-[1px] bg-yellow-400 shadow-[0_0_8px_yellow]" />}
                  <span className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${isWarning || isCritical ? 'text-yellow-400' : 'text-green-500'}`}><BarChart3 className="w-3 h-3"/> Resolution Scaling</span>
                  <span className="text-[10px] font-mono text-gray-400">Screen %: {isCritical ? '65%' : isWarning ? '85%' : '100%'}</span>
                  <div className="w-full h-1 bg-black rounded overflow-hidden"><motion.div animate={{width: isCritical ? '35%' : isWarning ? '15%' : '0%'}} className="h-full bg-yellow-500" /></div>
               </div>

               <div className="mt-2 p-3 bg-black/60 rounded border border-gray-800">
                  <div className="text-[8px] text-gray-500 font-bold uppercase mb-1">Architecture Note</div>
                  <div className="text-[9px] text-gray-400/80 font-light leading-relaxed">
                    The engine strictly preserves Layer 2 (Simulation State) integrity. It reacts to high load by scaling down Layer 3 (Presentation), such as culling shadows or reducing render scale, to prevent input latency.
                  </div>
               </div>

             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
