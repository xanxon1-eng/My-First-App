import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, CheckCircle2, Lock, GitBranch, Terminal, Database, Play } from 'lucide-react';

interface DialogueNode {
  id: string;
  text: string;
  speaker: string;
  options: DialogueOption[];
}

interface DialogueOption {
  text: string;
  nextNodeId: string;
  condition?: string;
  isMet?: boolean;
}

export default function DialoguePlayground({ onEvent }: { onEvent: (msg: string) => void }) {
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [worldState, setWorldState] = useState({ has_key: false, reputation: 10 });
  
  const nodes: Record<string, DialogueNode> = {
    start: {
      id: 'start',
      speaker: 'Gatekeeper',
      text: "Halt! None shall pass the Iron Gates without permission from the Baron.",
      options: [
        { text: "I have the Baron's sigil. (Has Item)", nextNodeId: 'passed', condition: 'has_key' },
        { text: "Is there no other way?", nextNodeId: 'bribe' },
        { text: "[Attack] Step aside, old man.", nextNodeId: 'combat' }
      ]
    },
    passed: {
      id: 'passed',
      speaker: 'Gatekeeper',
      text: "Ah, my apologies. The gates are open to you.",
      options: [{ text: "[Proceed]", nextNodeId: 'start' }]
    },
    bribe: {
      id: 'bribe',
      speaker: 'Gatekeeper',
      text: "Perhaps... for a contribution to the guard's fund (20 Rep Needed).",
      options: [
        { text: "Here, take this. (Reputation)", nextNodeId: 'passed', condition: 'reputation >= 20' },
        { text: "I don't have that kind of influence.", nextNodeId: 'start' }
      ]
    },
    combat: {
      id: 'combat',
      speaker: 'System',
      text: "World State Updated: Faction 'Town Guards' is now hostile.",
      options: [{ text: "[Reload State]", nextNodeId: 'start' }]
    }
  };

  const currentNode = nodes[currentNodeId];

  const handleOption = (opt: DialogueOption) => {
    if (opt.condition) {
      const met = opt.condition === 'has_key' ? worldState.has_key : worldState.reputation >= 20;
      if (!met) {
        onEvent(`Condition Restricted: Evaluated ${opt.condition} against UWorldStateSubsystem = FALSE`);
        return;
      }
    }
    setCurrentNodeId(opt.nextNodeId);
    onEvent(`Node Transition: Stepped to ${opt.nextNodeId}`);
    if (opt.nextNodeId === 'combat') {
      onEvent('WorldState: PERSISTED_SET_FLAG(Hostile_Guards, true)');
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-[320px] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/40 rounded-lg border border-white/5">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] font-mono text-blue-300 uppercase">UDialogueGraph::Evaluate(WorldState)</span>
        </div>
        <div className="text-[9px] font-mono text-blue-500/70 border border-blue-500/20 px-1.5 rounded bg-blue-500/5 flex items-center gap-1">
          <Database className="w-2.5 h-2.5" /> Condition Evaluator
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Layer 3: Presentation UI */}
        <div className="flex-[1.5] bg-black/40 rounded-xl border border-purple-900/50 p-4 flex flex-col gap-3 overflow-y-auto scrollbar-hide relative group">
          <div className="absolute top-0 right-0 px-2 py-1 bg-purple-900/80 rounded-bl-lg text-[8px] font-bold text-purple-300 uppercase tracking-widest border-l border-b border-purple-500/30 flex items-center gap-1">
            <Play className="w-2.5 h-2.5" /> Layer 3: Presentation
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <MessageSquare className="w-3 h-3 text-white" />
            </div>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-tighter">{currentNode.speaker}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentNode.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <p className="text-gray-300 text-xs italic leading-relaxed">"{currentNode.text}"</p>
              
              <div className="flex flex-col gap-2">
                {currentNode.options.map((opt, i) => {
                  const met = opt.condition ? (opt.condition === 'has_key' ? worldState.has_key : worldState.reputation >= 20) : true;
                  return (
                    <button
                      key={i}
                      disabled={!met && opt.condition === 'has_key'}
                      onClick={() => handleOption(opt)}
                      className={`group/btn relative text-left p-2.5 rounded border transition-all ${
                        !met ? 'bg-red-950/20 border-red-900/30 opacity-60' : 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50 hover:bg-purple-900/20'
                      }`}
                    >
                      <div className="flex justify-between items-center z-10 relative">
                        <span className={`text-[10px] ${!met ? 'text-gray-500' : 'text-gray-300'}`}>{opt.text}</span>
                        {opt.condition && (
                          met ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Lock className="w-3 h-3 text-red-500 shadow-[0_0_5px_rgba(239,68,68,0.3)]" />
                        )}
                      </div>
                      {opt.condition && !met && (
                        <div className="absolute inset-0 bg-red-950/40 backdrop-blur-[1px] hidden group-hover/btn:flex items-center justify-center rounded z-20">
                          <span className="text-[9px] text-red-400 font-bold uppercase tracking-tighter shadow-sm bg-black/50 px-2 py-1 rounded">Condition Required: {opt.condition}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Layer 2: State Panel */}
        <div className="flex-1 bg-blue-950/20 rounded-xl border border-blue-900/50 p-3 flex flex-col gap-3 relative">
          <div className="absolute top-0 right-0 px-2 py-1 bg-blue-900/80 rounded-bl-lg text-[8px] font-bold text-blue-300 uppercase tracking-widest border-l border-b border-blue-500/30 flex items-center gap-1">
            <Database className="w-2.5 h-2.5" /> Layer 2: State
          </div>
          
          <div className="flex items-center gap-2 border-b border-blue-900/50 pb-2 mt-4 text-blue-400">
             <GitBranch className="w-3 h-3" />
             <span className="text-[9px] font-bold uppercase tracking-widest">Global Flags</span>
          </div>
          
          <div className="space-y-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <span className="text-[8px] text-blue-300/60 font-mono uppercase">Inventory Check</span>
              <button 
                onClick={() => { setWorldState(s => ({ ...s, has_key: !s.has_key })); onEvent(`WorldState: Toggle has_key -> ${!worldState.has_key}`); }}
                className={`w-full p-2 rounded border text-[9px] flex items-center justify-center gap-2 transition-all ${worldState.has_key ? 'bg-green-900/30 border-green-500/50 text-green-300 shadow-[inset_0_0_10px_rgba(34,197,94,0.1)]' : 'bg-slate-800 border-slate-700 text-gray-500 grayscale'}`}
              >
                <div className={`w-2 h-2 rounded-full ${worldState.has_key ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-gray-700'}`} />
                Baron's Sigil
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[8px] text-blue-300/60 font-mono uppercase">Reputation</span>
                <span className="text-[10px] font-mono text-blue-300">{worldState.reputation}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setWorldState(s => ({ ...s, reputation: Math.max(0, s.reputation - 10) }))} className="flex-1 bg-blue-900/30 hover:bg-blue-800 border border-blue-900 rounded p-1 text-blue-200 transition-colors text-[9px]">-10</button>
                <button onClick={() => setWorldState(s => ({ ...s, reputation: s.reputation + 10 }))} className="flex-1 bg-blue-900/30 hover:bg-blue-800 border border-blue-900 rounded p-1 text-blue-200 transition-colors text-[9px]">+10</button>
              </div>
              <div className="w-full bg-blue-950 border border-blue-900 h-1.5 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${(worldState.reputation / 100) * 100}%` }} className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
            
            <div className="mt-auto p-2 border-t border-blue-900/50">
                <div className="text-[8px] text-gray-400 font-bold uppercase mb-0.5">Architecture Note</div>
                <div className="text-[8px] text-gray-500 leading-tight">
                  The graph node (Definition) evaluates options strictly by asking this WorldStateSubsystem (State) for truth.
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
