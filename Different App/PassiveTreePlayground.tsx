import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Zap, Shield, Search, RefreshCw, Layers, Database, Play, Code } from 'lucide-react';

interface SkillNode {
  id: number;
  x: number;
  y: number;
  connections: number[];
  isStart?: boolean;
  type: 'stat' | 'major' | 'keystone';
}

export default function SkillTreePlayground({ onEvent }: { onEvent: (msg: string) => void }) {
  const [allocated, setAllocated] = useState<Set<number>>(new Set([0]));
  const [jewelPos, setJewelPos] = useState<{ x: number, y: number } | null>(null);
  const [radius, setRadius] = useState(60);

  // LAYER 1: Definition
  const nodes: SkillNode[] = useMemo(() => [
    { id: 0, x: 150, y: 150, connections: [1, 2], isStart: true, type: 'major' },
    { id: 1, x: 200, y: 100, connections: [0, 3], type: 'stat' },
    { id: 2, x: 240, y: 180, connections: [0, 4], type: 'stat' }, // Adjusted to be closer
    { id: 3, x: 280, y: 80, connections: [1, 5], type: 'major' },
    { id: 4, x: 300, y: 220, connections: [2, 6], type: 'major' },
    { id: 5, x: 350, y: 50, connections: [3], type: 'keystone' },
    { id: 6, x: 380, y: 250, connections: [4], type: 'keystone' },
  ], []);

  const isReachableFromRoot = (nodeId: number, currentAllocated: Set<number>) => {
    if (nodeId === 0) return true;
    const visited = new Set<number>();
    const queue = [0];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === nodeId) return true;
      visited.add(current);
      
      const node = nodes[current];
      for (const neighbor of node.connections) {
        if (!visited.has(neighbor) && currentAllocated.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }
    return false;
  };

  const toggleNode = (id: number) => {
    if (id === 0) return;
    const newAllocated = new Set(allocated);
    if (newAllocated.has(id)) {
      // Refund check: can we remove this without breaking others?
      newAllocated.delete(id);
      let breaks = false;
      for (const otherId of Array.from(newAllocated)) {
        if (!isReachableFromRoot(otherId, newAllocated)) {
          breaks = true;
          break;
        }
      }
      if (breaks) {
        onEvent(`DFS Error: REFUND_REJECTED. Node ${id} produces islands.`);
        return;
      }
      onEvent(`Node ${id} Refunded`);
    } else {
      // Connect check: is it adjacent to an allocated node?
      const isAdjacent = nodes[id].connections.some(cid => allocated.has(cid));
      if (!isAdjacent) {
        onEvent(`Adjacency Breach: Node ${id} is unreachable from current path.`);
        return;
      }
      newAllocated.add(id);
      onEvent(`Layer 2 Update: FProgressionState Allocated Node ${id}`);
    }
    setAllocated(newAllocated);
  };

  const isInJewelRadius = (node: SkillNode) => {
    if (!jewelPos) return false;
    const dx = node.x - jewelPos.x;
    const dy = node.y - jewelPos.y;
    return Math.sqrt(dx * dx + dy * dy) < radius;
  };

  return (
    <div className="flex flex-col gap-4 w-full h-[320px] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/40 rounded-lg border border-white/5">
        <div className="flex items-center gap-2">
           <Share2 className="w-3.5 h-3.5 text-blue-400" />
           <span className="text-[10px] font-mono text-blue-300 uppercase">FProgressionComponent Architecture</span>
        </div>
        <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest bg-black/40 px-2 py-1 rounded">A skill tree isn't UI, it's a Bitmask verified by a Graph traversal.</div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        
        {/* Memory Column */}
        <div className="w-[300px] shrink-0 flex flex-col gap-4 overflow-hidden">
           {/* Layer 1 */}
           <div className="flex-[0.4] bg-slate-900/50 rounded-xl border border-slate-700/50 shadow-inner flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 px-2 py-1 bg-slate-800 rounded-bl-lg text-[8px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 border-l border-b border-slate-600/30">
               <Code className="w-2.5 h-2.5" /> Layer 1: Definition
             </div>
             <div className="p-3">
               <h3 className="text-gray-400 font-bold text-[9px] uppercase border-b border-white/5 pb-1">UDataAsset_SkillTree</h3>
               <div className="mt-2 text-[8px] font-mono text-gray-500 leading-relaxed overflow-hidden text-ellipsis whitespace-nowrap">
                 The graph structure is read-only.<br/>
                 Contains absolute X,Y positions for UI,<br/>
                 Stat Modifiers for Simulation,<br/>
                 and Neighbors for BFS Validation.
               </div>
             </div>
           </div>

           {/* Layer 2 */}
           <div className="flex-[0.6] bg-blue-950/20 rounded-xl border border-blue-900/40 flex flex-col shadow-inner relative overflow-hidden">
             <div className="absolute top-0 right-0 px-2 py-1 bg-blue-900/80 rounded-bl-lg text-[8px] font-bold text-blue-300 uppercase tracking-widest flex items-center gap-1 border-l border-b border-blue-500/30">
               <Database className="w-2.5 h-2.5" /> Layer 2: State
             </div>
             <div className="p-3 flex-1 flex flex-col">
               <h3 className="text-blue-500 font-bold text-[9px] uppercase border-b border-blue-900/30 pb-1 flex items-center gap-1.5"><Zap className="w-3 h-3"/> Allocated Bitmask</h3>
               
               <div className="mt-3 flex-1 flex flex-col gap-2 font-mono text-[10px]">
                 <div className="bg-black/60 p-2 rounded border border-blue-900/30 relative">
                   <div className="flex gap-1 flex-wrap">
                     {Array.from({ length: 16 }).map((_, i) => {
                       const isActive = allocated.has(i);
                       return (
                         <div key={i} className={`w-4 h-4 flex items-center justify-center border ${isActive ? 'bg-blue-500 text-white border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-slate-900 text-slate-700 border-slate-800'}`}>
                           {isActive ? '1' : '0'}
                         </div>
                       );
                     })}
                   </div>
                   <div className="mt-2 text-[8px] text-blue-300/80">
                      uint16 Mask = 0x{Array.from(allocated).reduce((acc, id) => acc | (1 << id), 0).toString(16).toUpperCase().padStart(4, '0')};
                   </div>
                 </div>

                 <div className="mt-auto bg-blue-900/20 border border-blue-900 p-2 rounded">
                     <p className="text-blue-200/60 leading-relaxed text-[8px]">Clients click UI (Layer 3). Server traces from Node [0] using known graph edges (Layer 1). If valid, Server mutates Mask (Layer 2).</p>
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* Layer 3: Graph Canvas */}
        <div className="flex-1 bg-purple-950/20 rounded-xl border border-purple-900/40 overflow-hidden relative shadow-inner">
           <div className="absolute top-0 right-0 px-2 py-1 bg-purple-900/80 rounded-bl-lg z-20 text-[8px] font-bold text-purple-300 uppercase tracking-widest flex items-center gap-1 border-l border-b border-purple-500/30">
               <Play className="w-2.5 h-2.5" /> Layer 3: Presentation
           </div>
           
           <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0px,transparent_1px)] bg-[size:10px_10px]" />

           <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
             {/* Render Connections */}
             {nodes.map(node => (
               node.connections.map(targetId => {
                 const target = nodes[targetId];
                 if (targetId < node.id) return null; // Avoid double lines
                 const isPath = allocated.has(node.id) && allocated.has(targetId);
                 return (
                   <motion.line 
                     key={`${node.id}-${targetId}`}
                     initial={{ pathLength: 0, opacity: 0 }}
                     animate={{ pathLength: 1, opacity: 1 }}
                     x1={node.x} y1={node.y} x2={target.x} y2={target.y}
                     stroke={isPath ? '#a855f7' : '#1e293b'}
                     strokeWidth={isPath ? '2.5' : '1'}
                     className="transition-all duration-300"
                     style={{ filter: isPath ? 'drop-shadow(0 0 4px rgba(168,85,247,0.8))' : 'none' }}
                   />
                 );
               })
             ))}
           </svg>

           {/* Jewel Radius */}
           <AnimatePresence>
             {jewelPos && (
               <motion.div 
                 initial={{ scale: 0, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0, opacity: 0 }}
                 className="absolute pointer-events-none rounded-full border border-yellow-500/40 bg-yellow-500/5 backdrop-blur-[1px] z-0"
                 style={{
                   left: jewelPos.x - radius,
                   top: jewelPos.y - radius,
                   width: radius * 2,
                   height: radius * 2,
                 }}
               >
                 <div className="absolute inset-0 rounded-full border border-yellow-500/10 animate-ping opacity-20" />
               </motion.div>
             )}
           </AnimatePresence>

             {/* Render Nodes */}
             {nodes.map(node => {
               const isAllocated = allocated.has(node.id);
               const inJewel = isInJewelRadius(node);
               return (
                 <button
                   key={node.id}
                   onClick={() => toggleNode(node.id)}
                   onContextMenu={(e) => { e.preventDefault(); setJewelPos({ x: node.x, y: node.y }); onEvent(`Jewel Socket Computes Overlay at [${node.x}, ${node.y}]`); }}
                   className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-110 z-20 ${
                     isAllocated 
                      ? 'bg-purple-900 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]' 
                      : 'bg-slate-900 border-slate-700 hover:border-gray-500'
                   } ${inJewel ? 'ring-[3px] ring-yellow-500/30 ring-offset-2 ring-offset-purple-900 border-yellow-500' : ''}`}
                   style={{ left: node.x, top: node.y }}
                 >
                   {node.type === 'keystone' ? <Zap className={`w-4 h-4 ${isAllocated ? 'text-white' : 'text-gray-600'}`} /> : 
                    node.type === 'major' ? <Shield className={`w-4 h-4 ${isAllocated ? 'text-white' : 'text-gray-600'}`} /> :
                    <div className={`w-1.5 h-1.5 rounded-full ${isAllocated ? 'bg-white' : 'bg-gray-700'}`} />}
                 </button>
               );
             })}

             <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between p-2 bg-black/60 rounded border border-white/5 opacity-80 z-30">
                <span className="text-[9px] text-gray-400">Click to trace DFS valid paths.</span>
                <div className="flex items-center gap-1.5">
                  <Search className="w-3 h-3 text-yellow-500" />
                  <span className="text-[9px] text-yellow-500/70">Right-click node for Jewel</span>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
}
