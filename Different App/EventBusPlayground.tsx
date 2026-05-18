import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Database, Activity, Zap, Play, CheckCircle2 } from 'lucide-react';

export default function EventBusPlayground({ onEvent }: { onEvent: (msg: string) => void }) {
  const [messages, setMessages] = useState<{ id: string, msg: string, priority: number }[]>([]);
  const [listeners, setListeners] = useState(
    ['UI_Subsystem', 'Audio_Subsystem', 'Reward_Subsystem']
  );
  const [receivedCount, setReceivedCount] = useState(0);

  const broadcastAndNotify = (msg: string, priority: number) => {
    const id = crypto.randomUUID();
    onEvent(`EventBus: Broadcast Event '${msg}' with Priority ${priority}`);
    
    // Add to message queue
    setMessages(prev => [{ id, msg, priority }, ...prev].sort((a,b) => b.priority - a.priority));
    
    // Process messages asynchronously simulating dispatch
    setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== id));
        setReceivedCount(prev => prev + listeners.length);
        onEvent(`EventBus: Sent '${msg}' to ${listeners.length} listeners.`);
    }, 1000 + (Math.random() * 500));
  };

  const toggleListener = (name: string) => {
     if(listeners.includes(name)) {
         setListeners(prev => prev.filter(l => l !== name));
         onEvent(`System ${name} unsubscribed from EventBus.`);
     } else {
         setListeners(prev => [...prev, name]);
         onEvent(`System ${name} subscribed to EventBus.`);
     }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-[320px] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/40 rounded-lg border border-white/5">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] font-mono text-blue-300 uppercase">UGameEventBus::Broadcast()</span>
        </div>
        <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest bg-black/40 px-2 py-1 rounded">Decoupled Multicast Delegates</div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        
        {/* Memory Column: Sender */}
        <div className="w-[180px] shrink-0 bg-blue-950/20 rounded-xl border border-blue-900/40 shadow-inner p-3 flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 px-2 py-1 bg-blue-900/80 rounded-bl-lg text-[8px] font-bold text-blue-300 uppercase tracking-widest flex items-center gap-1 border-l border-b border-blue-500/30">
               <Zap className="w-2.5 h-2.5" /> Source
             </div>
             <h3 className="text-gray-400 font-bold text-[9px] uppercase border-b border-blue-900/40 pb-1 mt-4">Uncoupled Callers</h3>
             <div className="mt-4 flex flex-col gap-2">
                <button onClick={() => broadcastAndNotify("LEVEL_UP", 2)} className="p-2 border border-blue-500/50 bg-blue-900/20 hover:bg-blue-900/40 rounded text-[9px] font-bold text-blue-200 transition">Broadcast Level Up</button>
                <button onClick={() => broadcastAndNotify("PLAYER_DEATH", 5)} className="p-2 border border-red-500/50 bg-red-900/20 hover:bg-red-900/40 rounded text-[9px] font-bold text-red-200 transition">Broadcast Death (Pri: 5)</button>
             </div>
        </div>

        {/* The Bus */}
        <div className="flex-[0.6] flex flex-col justify-center items-center relative min-w-[120px]">
             {/* Animating messages */}
             <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
               <div className="h-full w-2 bg-slate-800 rounded-full border border-slate-700/50 overflow-hidden relative shadow-inner">
                  <AnimatePresence>
                     {messages.map(m => (
                         <motion.div 
                            key={m.id}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 200, opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 1.5, ease: "linear" }}
                            className={`absolute top-0 w-full h-8 ${m.priority === 5 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-blue-400 shadow-[0_0_10px_blue]'} rounded z-10`}
                         />
                     ))}
                  </AnimatePresence>
               </div>
             </div>
             
             <div className="bg-slate-900 border border-slate-700 rounded shadow-2xl p-2 z-20 text-[9px] font-mono text-gray-400">
               Queue: {messages.length}
             </div>
        </div>

        {/* Listeners */}
        <div className="flex-1 bg-purple-950/20 rounded-xl border border-purple-900/40 overflow-hidden relative shadow-inner p-3 flex flex-col">
           <div className="absolute top-0 right-0 px-2 py-1 bg-purple-900/80 rounded-bl-lg z-20 text-[8px] font-bold text-purple-300 uppercase tracking-widest flex items-center gap-1 border-l border-b border-purple-500/30">
               <Database className="w-2.5 h-2.5" /> Listeners
           </div>
           <h3 className="text-gray-400 font-bold text-[9px] uppercase border-b border-purple-900/40 pb-1 mt-4">Subscribed Systems</h3>
           
           <div className="flex-1 flex flex-col justify-center gap-3 mt-2 pr-1">
              {['UI_Subsystem', 'Audio_Subsystem', 'Reward_Subsystem', 'Analytics_Subsystem'].map(sys => {
                  const isSub = listeners.includes(sys);
                  return (
                      <button 
                        key={sys}
                        onClick={() => toggleListener(sys)}
                        className={`p-2 border rounded-lg flex items-center justify-between text-left transition ${isSub ? 'bg-slate-800/80 border-purple-500/50' : 'bg-black/40 border-slate-800 opacity-50'}`}
                      >
                         <div className="flex flex-col">
                             <span className={`text-[10px] font-mono font-bold ${isSub ? 'text-purple-300' : 'text-gray-500'}`}>{sys}</span>
                             <span className="text-[7px] text-gray-500 uppercase">{isSub ? 'Listening' : 'Unsubscribed'}</span>
                         </div>
                         {isSub && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      </button>
                  );
              })}
           </div>
           
           <div className="mt-2 text-[8px] font-mono text-green-400 bg-green-900/10 p-1.5 rounded text-center border border-green-500/20">
               Total successful dispatches: {receivedCount}
           </div>
        </div>
      </div>
    </div>
  );
}
