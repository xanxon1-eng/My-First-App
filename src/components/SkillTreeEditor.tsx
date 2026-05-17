import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { GitBranch, Plus, Trash2, Link as LinkIcon, Settings2, Hexagon, Circle, Gem, Zap } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SkillNode {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'major' | 'minor' | 'socket' | 'choice';
  options?: string[];
  selectedOption?: string;
  questModifier?: string;
}

interface Connection {
  source: string;
  target: string;
}

export default function SkillTreeEditor() {
  const [nodes, setNodes] = useState<SkillNode[]>([
    { id: '1', name: 'Start', x: 400, y: 300, type: 'major' },
    { id: '2', name: 'Might', x: 500, y: 200, type: 'minor' },
    { id: '3', name: 'Agility', x: 500, y: 400, type: 'minor' },
    { id: '4', name: 'Jewel Socket', x: 600, y: 300, type: 'socket' },
  ]);
  const [connections, setConnections] = useState<Connection[]>([
    { source: '1', target: '2' },
    { source: '1', target: '3' },
    { source: '2', target: '4' },
    { source: '3', target: '4' },
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Handle dragging
  const handleDrag = (id: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
  };

  const addNode = (type: SkillNode['type']) => {
    const newNode: SkillNode = {
      id: Math.random().toString(36).substr(2, 9),
      name: `New ${type}`,
      x: 400 + (Math.random() - 0.5) * 100,
      y: 300 + (Math.random() - 0.5) * 100,
      type,
    };
    setNodes(prev => [...prev, newNode]);
  };

  const deleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setConnections(prev => prev.filter(c => c.source !== id && c.target !== id));
    if (selectedNode === id) setSelectedNode(null);
  };

  const startLinking = (id: string) => {
    if (isLinking && isLinking !== id) {
      // Create connection
      if (!connections.find(c => (c.source === isLinking && c.target === id) || (c.source === id && c.target === isLinking))) {
        setConnections(prev => [...prev, { source: isLinking, target: id }]);
      }
      setIsLinking(null);
    } else {
      setIsLinking(id);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Passive Skill Tree Editor</h2>
          <p className="text-kingfisher-muted">Design complex node networks with Path of Exile style logic.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => addNode('minor')} className="flex items-center gap-2 px-3 py-2 bg-kingfisher-blue/20 hover:bg-kingfisher-blue/30 rounded-lg text-sm transition-colors border border-kingfisher-blue/30">
            <Plus className="w-4 h-4" /> Add Minor
          </button>
          <button onClick={() => addNode('major')} className="flex items-center gap-2 px-3 py-2 bg-kingfisher-warm/20 hover:bg-kingfisher-warm/30 rounded-lg text-sm transition-colors border border-kingfisher-warm/30">
            <Plus className="w-4 h-4" /> Add Major
          </button>
          <button onClick={() => addNode('socket')} className="flex items-center gap-2 px-3 py-2 bg-kingfisher-deep/20 hover:bg-kingfisher-deep/30 rounded-lg text-sm transition-colors border border-kingfisher-deep/30 text-white">
            <Gem className="w-4 h-4" /> Add Socket
          </button>
        </div>
      </div>

      <div className="flex-1 bg-kingfisher-dark/80 border border-kingfisher-blue/20 rounded-3xl relative overflow-hidden min-h-[500px]">
        <svg 
          ref={svgRef}
          className="w-full h-full cursor-crosshair"
          viewBox="0 0 1000 800"
        >
          {/* Grid Background */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(120, 127, 178, 0.05)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Connections */}
          {connections.map((conn, idx) => {
            const source = nodes.find(n => n.id === conn.source);
            const target = nodes.find(n => n.id === conn.target);
            if (!source || !target) return null;
            return (
              <line
                key={`${conn.source}-${conn.target}-${idx}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="rgba(120, 127, 178, 0.3)"
                strokeWidth="4"
                strokeDasharray="8 4"
                className="animate-pulse"
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(node => (
             <g 
               key={node.id} 
               className="cursor-move group"
               onMouseDown={(e) => {
                 setSelectedNode(node.id);
                 const onMouseMove = (moveEvent: MouseEvent) => {
                   const rect = svgRef.current?.getBoundingClientRect();
                   if (rect) {
                     const x = moveEvent.clientX - rect.left;
                     const y = moveEvent.clientY - rect.top;
                     handleDrag(node.id, x, y);
                   }
                 };
                 const onMouseUp = () => {
                   window.removeEventListener('mousemove', onMouseMove);
                   window.removeEventListener('mouseup', onMouseUp);
                 };
                 window.addEventListener('mousemove', onMouseMove);
                 window.addEventListener('mouseup', onMouseUp);
               }}
             >
               {node.type === 'major' ? (
                 <rect 
                   x={node.x - 25} 
                   y={node.y - 25} 
                   width="50" 
                   height="50" 
                   className={cn(
                     "transition-colors",
                     selectedNode === node.id ? "fill-kingfisher-warm" : "fill-kingfisher-blue",
                     isLinking === node.id && "stroke-4 stroke-white"
                   )}
                   rx="8"
                 />
               ) : node.type === 'socket' ? (
                 <circle 
                   cx={node.x} 
                   cy={node.y} 
                   r="20" 
                   className={cn(
                     "transition-colors stroke-2 ",
                     selectedNode === node.id ? "fill-kingfisher-deep" : "fill-kingfisher-dark/50 stroke-kingfisher-deep",
                     isLinking === node.id && "stroke-white"
                   )}
                 />
               ) : (
                 <circle 
                   cx={node.x} 
                   cy={node.y} 
                   r="15" 
                   className={cn(
                     "transition-colors",
                     selectedNode === node.id ? "fill-kingfisher-warm" : "fill-kingfisher-blue/40 stroke-2 stroke-kingfisher-blue",
                     isLinking === node.id && "stroke-white"
                   )}
                 />
               )}
               <text 
                 x={node.x} 
                 y={node.y + 40} 
                 textAnchor="middle" 
                 className="fill-kingfisher-surface text-[10px] font-bold pointer-events-none select-none uppercase tracking-wider"
               >
                 {node.name}
               </text>
             </g>
          ))}
        </svg>

        {/* Floating Tooltips/Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
           <div className="bg-kingfisher-dark/90 backdrop-blur-md p-4 rounded-2xl border border-kingfisher-blue/20 w-64 shadow-2xl">
              <h3 className="text-sm font-bold border-b border-kingfisher-blue/10 pb-2 mb-3 flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-kingfisher-blue" />
                Node Properties
              </h3>
              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase text-kingfisher-muted block mb-1">Node Title</label>
                    <input 
                      type="text" 
                      value={nodes.find(n => n.id === selectedNode)?.name || ''} 
                      onChange={(e) => setNodes(nodes.map(n => n.id === selectedNode ? { ...n, name: e.target.value } : n))}
                      className="w-full bg-kingfisher-dark border border-kingfisher-blue/20 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-kingfisher-warm mb-3"
                    />
                    
                    {nodes.find(n => n.id === selectedNode)?.type === 'major' && (
                      <div className="space-y-2 mt-4 pt-4 border-t border-kingfisher-blue/10">
                        <label className="text-[10px] uppercase text-kingfisher-muted block mb-1">Choice Options (PoE Mastery)</label>
                        <select 
                          className="w-full bg-kingfisher-dark border border-kingfisher-blue/20 rounded-md px-2 py-1 text-sm focus:outline-none"
                          onChange={(e) => {
                            setNodes(nodes.map(n => n.id === selectedNode ? { ...n, selectedOption: e.target.value } : n))
                          }}
                        >
                          <option>Select Option...</option>
                          <option>+20 to Strength</option>
                          <option>10% Life Regen</option>
                          <option>AoE Multiplier</option>
                        </select>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-kingfisher-blue/10">
                      <label className="text-[10px] uppercase text-kingfisher-muted block mb-1">Quest Outcome Modifier</label>
                      <div className="flex items-center gap-2 text-[10px] text-kingfisher-warm font-mono bg-kingfisher-warm/5 p-2 rounded">
                        <Zap className="w-3 h-3" />
                        {nodes.find(n => n.id === selectedNode)?.questModifier || "Inherit Global: WoodSpiritBound"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startLinking(selectedNode)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
                        isLinking === selectedNode ? "bg-kingfisher-warm text-kingfisher-dark" : "bg-kingfisher-blue/20 text-kingfisher-blue hover:bg-kingfisher-blue/30"
                      )}
                    >
                      <LinkIcon className="w-3 h-3" /> {isLinking === selectedNode ? "Linking..." : "Link"}
                    </button>
                    <button 
                      onClick={() => deleteNode(selectedNode)}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-kingfisher-muted italic">Select a node to edit properties.</p>
              )}
           </div>

           <div className="bg-kingfisher-dark/90 backdrop-blur-md p-4 rounded-2xl border border-kingfisher-blue/20 w-64 shadow-2xl">
             <h3 className="text-sm font-bold border-b border-kingfisher-blue/10 pb-2 mb-3">Controls</h3>
             <ul className="space-y-1 text-[10px] text-kingfisher-muted list-disc pl-3">
               <li>Click & Drag nodes to reposition</li>
               <li>Click "Link" to enter linking mode</li>
               <li>Click another node to connect them</li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
