import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { SKILL_TREE_DATA } from '../data/skillTreeData';
import { useMastery } from '../contexts/MasteryContext';
import { SkillNode, NodeType, Modifier, Jewel } from '../types/gameTypes';
import { Search, ZoomIn, ZoomOut, RotateCcw, Crosshair, HelpCircle, Edit3, Save } from 'lucide-react';
import { HighlightGlossary } from './HighlightGlossary';

const NODE_SIZES: Record<NodeType, number> = {
  small: 20,
  medium: 40,
  large: 60,
  keystone: 80,
  socket: 50,
  choice: 55
};

const NODE_COLORS: Record<NodeType, string> = {
  small: 'bg-slate-700 border-slate-500',
  medium: 'bg-blue-900 border-blue-400',
  large: 'bg-indigo-900 border-indigo-400',
  keystone: 'bg-amber-900 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
  socket: 'bg-emerald-900 border-emerald-400',
  choice: 'bg-purple-900 border-purple-400'
};

export default function PassiveSkillTree() {
  const { masteryState, allocateNode, refundNode, setChoice, insertJewel } = useMastery();
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<SkillNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [isDevMode, setIsDevMode] = useState(false);
  const [dragingNodeId, setDraggingNodeId] = useState<string | null>(null);
  
  // Local state for dragging nodes in DevMode
  const [nodes, setNodes] = useState(SKILL_TREE_DATA);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingMap = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (dragingNodeId) return;
    isDraggingMap.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingMap.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
    
    if (isDevMode && dragingNodeId) {
       const rect = containerRef.current?.getBoundingClientRect();
       if (rect) {
          const x = (e.clientX - rect.left - rect.width/2 - offset.x) / zoom;
          const y = (e.clientY - rect.top - rect.height/2 - offset.y) / zoom;
          setNodes(prev => prev.map(n => n.id === dragingNodeId ? { ...n, x, y } : n));
       }
    }
  };

  const handleMouseUp = () => {
    isDraggingMap.current = false;
    setDraggingNodeId(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.min(Math.max(prev * delta, 0.2), 3));
  };

  const toggleAllocation = (nodeId: string) => {
    if (masteryState.skillTree.allocatedNodes.includes(nodeId)) {
      refundNode(nodeId);
    } else {
      // Logic: Only allow allocation if connected to an allocated node
      const node = nodes.find(n => n.id === nodeId);
      if (node?.connections.some(connId => masteryState.skillTree.allocatedNodes.includes(connId)) || nodeId === 'start') {
        allocateNode(nodeId);
      }
    }
  };

  const getActiveModifiers = (node: SkillNode) => {
    let mods = [...node.modifiers];
    
    if (node.type === 'choice') {
      const choiceId = masteryState.skillTree.choices[node.id];
      const choice = node.choiceOptions?.find(o => o.id === choiceId);
      if (choice) mods.push(choice);
    }

    if (node.questRequirement) {
      const questState = masteryState.questStates[node.questRequirement];
      if (questState && node.questModifiers?.[questState]) {
        mods = [...mods, ...node.questModifiers[questState]];
      }
    }

    const jewel = masteryState.skillTree.jewels[node.id];
    if (jewel) {
      mods = [...mods, ...jewel.modifiers];
    }

    return mods;
  };

  // Export nodes to console for the developer
  const exportData = () => {
    console.log("UPDATED SKILL TREE DATA:");
    console.log(JSON.stringify(nodes, null, 2));
    alert("Node data logged to console. Check browser DevTools.");
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 overflow-hidden relative font-sans">
      {/* HUD Header */}
      <div className="absolute top-4 left-4 z-20 flex gap-4 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl flex items-center gap-4 pointer-events-auto shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Mastery Points</span>
            <span className="text-xl font-display font-bold text-amber-500">
              {masteryState.skillTree.allocatedNodes.length} / 100
            </span>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div className="flex gap-2">
            <button onClick={() => setZoom(z => z * 1.1)} className="p-2 hover:bg-slate-800 rounded-lg"><ZoomIn className="w-4 h-4" /></button>
            <button onClick={() => setZoom(z => z * 0.9)} className="p-2 hover:bg-slate-800 rounded-lg"><ZoomOut className="w-4 h-4" /></button>
            <button onClick={() => { setZoom(1); setOffset({x:0, y:0}); }} className="p-2 hover:bg-slate-800 rounded-lg"><RotateCcw className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button 
          onClick={() => setIsDevMode(!isDevMode)}
          className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${isDevMode ? 'bg-red-600 border-red-400 text-white animate-pulse' : 'bg-slate-900/80 border-slate-700 text-slate-400'}`}
        >
          <Edit3 className="w-4 h-4" /> {isDevMode ? 'DEV MODE ACTIVE' : 'DEV MODE'}
        </button>
        {isDevMode && (
          <button onClick={exportData} className="px-4 py-2 bg-emerald-600 border border-emerald-400 text-white rounded-xl flex items-center gap-2 text-xs font-bold">
            <Save className="w-4 h-4" /> EXPORT JSON
          </button>
        )}
      </div>

      {/* Main Interactive Map */}
      <div 
        ref={containerRef}
        className="flex-1 cursor-grab active:cursor-grabbing relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-20"
          animate={{ x: offset.x * 0.1, y: offset.y * 0.1 }}
          style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, #475569 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        <div 
          style={{ 
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: 'center',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transition: 'transform 0.05s linear'
          }}
        >
          {/* Connection Lines (SVG) */}
          <svg className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
            {nodes.map(node => node.connections.map(connId => {
              const target = nodes.find(n => n.id === connId);
              if (!target) return null;
              const isAllocated = masteryState.skillTree.allocatedNodes.includes(node.id) && masteryState.skillTree.allocatedNodes.includes(connId);
              return (
                <line 
                  key={`${node.id}-${connId}`}
                  x1={node.x} y1={node.y}
                  x2={target.x} y2={target.y}
                  stroke={isAllocated ? "#6366f1" : "#1e293b"}
                  strokeWidth={isAllocated ? 4 : 2}
                  strokeDasharray={isAllocated ? "" : "5,5"}
                />
              );
            }))}
          </svg>

          {/* Nodes */}
          {nodes.map(node => {
            const isAllocated = masteryState.skillTree.allocatedNodes.includes(node.id);
            const isSelectable = node.id === 'start' || node.connections.some(c => masteryState.skillTree.allocatedNodes.includes(c));
            const size = NODE_SIZES[node.type];
            
            return (
              <motion.div
                key={node.id}
                initial={false}
                animate={{ x: node.x, y: node.y }}
                className="absolute"
                style={{ 
                  left: -size/2, top: -size/2,
                  zIndex: hoveredNode?.id === node.id ? 10 : 1
                }}
              >
                <div 
                  className={`relative rounded-full border-2 transition-all duration-300 flex items-center justify-center cursor-pointer group
                    ${NODE_COLORS[node.type]}
                    ${isAllocated ? 'scale-110 border-indigo-300 ring-4 ring-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'hover:scale-105'}
                    ${!isSelectable && !isAllocated ? 'grayscale opacity-40 blur-[0.5px]' : ''}
                  `}
                  style={{ width: size, height: size }}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isDevMode) {
                       setDraggingNodeId(node.id);
                    } else {
                       setSelectedNode(node);
                       if (isSelectable || isAllocated) toggleAllocation(node.id);
                    }
                  }}
                >
                  {node.type === 'keystone' && <div className="absolute inset-0 rounded-full border border-amber-500/50 animate-ping" />}
                  {node.type === 'socket' && masteryState.skillTree.jewels[node.id] && (
                    <div className="w-1/2 h-1/2 bg-emerald-300 rounded-sm rotate-45 animate-pulse" />
                  )}
                  {node.type === 'choice' && (
                     <div className="w-1/3 h-1/3 border-2 border-white/50 rounded-full" />
                  )}
                  
                  {/* Tooltip Link */}
                  {hoveredNode?.id === node.id && (
                    <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 pointer-events-none">
                       <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl w-64 ring-1 ring-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{node.type}</span>
                            {isAllocated && <span className="text-[10px] text-indigo-400 font-bold">ALLOCATED</span>}
                          </div>
                          <h4 className="text-white font-bold text-sm mb-1">{node.name}</h4>
                          <p className="text-xs text-slate-400 mb-3">{node.description}</p>
                          <div className="space-y-1">
                             {getActiveModifiers(node).map((mod) => (
                               <div key={mod.id} className="text-[11px] text-slate-300 flex gap-2">
                                 <span className="text-indigo-500">•</span>
                                 <span>{mod.text}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Item/Choice Interaction Panel (Desktop Right) */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute right-6 top-24 bottom-6 w-80 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl z-30 flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${NODE_COLORS[selectedNode.type]}`}>
                  <Crosshair className="w-5 h-5" />
                </div>
                <button onClick={() => setSelectedNode(null)} className="p-1 hover:bg-slate-800 rounded">
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{selectedNode.name}</h3>
              <p className="text-xs text-slate-400">{selectedNode.description}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {selectedNode.type === 'choice' && (
                <section>
                  <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-widest">Select One Modifier</h4>
                  <div className="space-y-2">
                    {selectedNode.choiceOptions?.map(opt => (
                      <button 
                        key={opt.id}
                        onClick={() => setChoice(selectedNode.id, opt.id)}
                        className={`w-full p-3 rounded-xl border text-left transition-all ${masteryState.skillTree.choices[selectedNode.id] === opt.id ? 'bg-indigo-900/50 border-indigo-400 text-indigo-100 ring-2 ring-indigo-500/20' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                      >
                        <span className="text-xs">{opt.text}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {selectedNode.type === 'socket' && (
                <section>
                  <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-widest">Jewel Socket</h4>
                  {masteryState.skillTree.jewels[selectedNode.id] ? (
                    <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-xl">
                       <span className="text-xs font-bold text-emerald-400 block mb-2">{masteryState.skillTree.jewels[selectedNode.id].name}</span>
                       <button 
                         onClick={() => insertJewel(selectedNode.id, null as any)}
                         className="text-[10px] text-red-400 hover:underline"
                       >
                         Remove Jewel
                       </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="text-[11px] text-slate-500 mb-2 italic">Insert a crafted memory optimizer to boost this cluster.</p>
                      <button 
                        onClick={() => insertJewel(selectedNode.id, { id: 'j1', name: 'Optimized Cache Jewel', modifiers: [{ id: 'jm1', text: '+15% Cache Coherency' }] })}
                        className="w-full py-3 border-2 border-dashed border-slate-800 rounded-xl text-slate-600 text-xs font-bold hover:border-emerald-500/50 hover:text-emerald-500 transition-all"
                      >
                        Insert "Cache Jewel"
                      </button>
                    </div>
                  )}
                </section>
              )}

              {selectedNode.questRequirement && (
                <section className="bg-purple-900/20 border border-purple-500/20 p-4 rounded-xl">
                  <h4 className="text-[10px] uppercase font-bold text-purple-400 mb-2 tracking-widest flex items-center gap-2">
                    <RotateCcw className="w-3 h-3" /> Quest Modifiers Active
                  </h4>
                  <p className="text-[10px] text-slate-400 italic">Current Quest State: <span className="text-white">{masteryState.questStates[selectedNode.questRequirement]}</span></p>
                </section>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
