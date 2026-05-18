import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Shield, Swords, Backpack, Trash2, Filter, Weight, List, Database, Play, Code } from 'lucide-react';

interface InvItem {
  id: string; // Instance ID
  defId: string; // Definition ID
  name: string;
  type: 'Weapon' | 'Armor' | 'Generic';
  weight: number;
  stackSize: number;
  currentStack: number;
  rarity: 'Normal' | 'Magic' | 'Rare';
}

export default function InventoryPlayground({ onEvent }: { onEvent: (msg: string) => void }) {
  const [inventory, setInventory] = useState<InvItem[]>([
    { id: 'inst_1', defId: 'WPN_IronSword', name: 'Iron Sword', type: 'Weapon', weight: 4.5, stackSize: 1, currentStack: 1, rarity: 'Normal' },
    { id: 'inst_2', defId: 'CONS_HealthPo', name: 'Health Potion', type: 'Generic', weight: 0.5, stackSize: 20, currentStack: 5, rarity: 'Normal' },
  ]);

  const maxWeight = 50;
  const currentWeight = useMemo(() => 
    inventory.reduce((acc, item) => acc + (item.weight * item.currentStack), 0)
  , [inventory]);

  const addItem = () => {
    if (currentWeight >= maxWeight) {
      onEvent('Inventory Error: Capacity reached (Overencumbered)');
      return;
    }
    const types: ('Weapon' | 'Armor' | 'Generic')[] = ['Weapon', 'Armor', 'Generic'];
    const randType = types[Math.floor(Math.random() * types.length)];
    const newItem: InvItem = {
      id: "inst_" + Math.random().toString(36).substr(2, 6),
      defId: randType === 'Weapon' ? 'WPN_SteelBlade' : randType === 'Armor' ? 'ARM_IronGuard' : 'GEN_LootSack',
      name: randType === 'Weapon' ? 'Steel Blade' : randType === 'Armor' ? 'Iron Guard' : 'Loot Sack',
      type: randType,
      weight: randType === 'Generic' ? 1.0 : 8.0,
      stackSize: randType === 'Generic' ? 10 : 1,
      currentStack: 1,
      rarity: Math.random() > 0.5 ? 'Magic' : 'Normal'
    };
    setInventory(prev => [...prev, newItem]);
    onEvent(`State: Created FItemInstance (${newItem.id}) pointing to UItemDefinition (${newItem.defId})`);
  };

  const removeItem = (id: string, name: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
    onEvent(`State: FInventoryComponent removed instance ${id}`);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-[320px] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/40 rounded-lg border border-white/5">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] font-mono text-blue-300 uppercase">FInventoryComponent Architecture</span>
        </div>
        <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest bg-black/40 px-2 py-1 rounded">Abstract math grid</div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        
        {/* Layer 1: Definition */}
        <div className="w-[180px] bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 flex flex-col gap-3 relative shadow-inner">
           <div className="absolute top-0 right-0 px-2 py-1 bg-slate-800 rounded-bl-lg text-[8px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 border-l border-b border-slate-600/30">
               <Code className="w-2.5 h-2.5" /> Layer 1: Definition
           </div>
           
           <h3 className="text-gray-400 font-bold text-[9px] uppercase mt-2 border-b border-white/5 pb-1">Data Asset (UItemDef)</h3>
           <div className="flex-1 overflow-y-auto space-y-2 mt-2">
             <div className="p-2 border border-slate-700 bg-slate-800/80 rounded bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMmQzNzQ4Ij48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMzNzQxNTEiPjwvcmVjdD4KPC9zdmc+')]">
                 <span className="text-[9px] font-bold text-green-400 block mb-1">WPN_IronSword</span>
                 <div className="space-y-0.5 text-[8px] font-mono text-gray-500">
                     <div>MaxStack: 1</div>
                     <div>BaseDamage: 25</div>
                     <div>Mesh: StaticMesh_Sword</div>
                 </div>
             </div>
             
             <div className="p-2 border border-slate-700 bg-slate-800/80 rounded bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMmQzNzQ4Ij48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMzNzQxNTEiPjwvcmVjdD4KPC9zdmc+')]">
                 <span className="text-[9px] font-bold text-green-400 block mb-1">CONS_HealthPo</span>
                 <div className="space-y-0.5 text-[8px] font-mono text-gray-500">
                     <div>MaxStack: 20</div>
                     <div>HealAmount: 50</div>
                     <div>Mesh: SM_Potion</div>
                 </div>
             </div>
           </div>
           
           <span className="text-[8px] text-gray-500 font-bold uppercase leading-tight bg-black/40 p-1.5 rounded">Read-Only Disk Data</span>
        </div>

        {/* Separator */}
        <div className="flex flex-col items-center justify-center shrink-0 w-4">
           <div className="w-[1px] h-20 bg-gray-700/50" />
           <div className="w-0 h-0 border-x-3 border-x-transparent border-t-3 border-t-gray-500 my-2" />
        </div>

        {/* Layer 2: State */}
        <div className="flex-1 bg-blue-950/20 border border-blue-900/40 rounded-xl p-3 flex flex-col gap-3 relative shadow-inner">
           <div className="absolute top-0 right-0 px-2 py-1 bg-blue-900/80 rounded-bl-lg text-[8px] font-bold text-blue-300 uppercase tracking-widest flex items-center gap-1 border-l border-b border-blue-500/30">
               <Database className="w-2.5 h-2.5" /> Layer 2: State
           </div>
           
           <div className="flex items-center justify-between border-b border-blue-900/30 pb-2 mt-3">
             <h3 className="text-blue-500 font-bold text-[9px] uppercase tracking-widest flex items-center gap-1.5">
                <Backpack className="w-3 h-3" /> FInventoryComponent
             </h3>
             <button onClick={addItem} className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/40 rounded text-[8px] text-blue-300 font-bold uppercase transition-colors shadow">+ RPC(SpawnLoot)</button>
           </div>
           
           <div className="flex-1 bg-black/60 rounded p-2 border border-blue-900/30 overflow-y-auto block relative">
              <span className="absolute top-1 right-2 text-[8px] text-gray-600 font-mono">TArray&lt;FItemInstance&gt;</span>
              <div className="mt-3 space-y-1.5">
                <AnimatePresence>
                  {inventory.map((item, index) => (
                    <motion.div 
                      layoutId={`struct-${item.id}`}
                      initial={{opacity: 0, x: -10}} 
                      animate={{opacity: 1, x: 0}}
                      exit={{opacity: 0, scale: 0.9}}
                      key={item.id} 
                      className="p-1.5 bg-blue-900/10 border-[0.5px] border-blue-500/30 border-l-[2px] border-l-blue-500 font-mono text-[9px] text-blue-200/80 rounded block group"
                    >
                       <div className="flex items-center justify-between">
                         <span className="text-blue-400 font-bold text-[10px]">[{index}] {item.id}</span>
                         <button onClick={() => removeItem(item.id, item.name)} className="opacity-0 group-hover:opacity-100 px-1.5 py-0.5 bg-red-900/50 hover:bg-red-900 border border-red-500/50 rounded text-red-200 text-[7px] transition-all">Del</button>
                       </div>
                       <div className="mt-0.5 pl-2 text-blue-400/50 text-[8px]">
                           Def: <span className="text-green-500">{item.defId}</span> // Ptr<br/>
                           Stack: {item.currentStack}/{item.stackSize} // Mutable
                       </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
           </div>
        </div>

        {/* Layer 3: Presentation UI */}
        <div className="flex-[0.8] bg-purple-950/20 border border-purple-900/40 rounded-xl p-3 flex flex-col gap-3 relative shadow-inner">
           <div className="absolute top-0 right-0 px-2 py-1 bg-purple-900/80 rounded-bl-lg text-[8px] font-bold text-purple-300 uppercase tracking-widest flex items-center gap-1 border-l border-b border-purple-500/30">
               <Play className="w-2.5 h-2.5" /> Layer 3: View
           </div>
           <div className="border-b border-purple-900/30 pb-2 mt-3">
             <h3 className="text-purple-500 font-bold text-[9px] uppercase tracking-widest flex items-center gap-1.5">
               <List className="w-3 h-3" /> UWidget_Grid
             </h3>
           </div>
           
           <div className="flex-1 bg-black/40 rounded border border-white/5 p-2 overflow-y-auto">
             <div className="grid grid-cols-2 gap-1.5">
               <AnimatePresence>
                 {inventory.map(item => (
                   <motion.div 
                     layoutId={`cell-${item.id}`}
                     key={item.id}
                     initial={{ opacity: 0, scale: 0.8 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.8 }}
                     className="aspect-square bg-slate-800/80 rounded border border-purple-500/30 flex items-center justify-center relative shadow group hover:border-purple-400"
                   >
                     {item.type === 'Weapon' ? <Swords className="w-5 h-5 text-purple-400" /> : 
                      item.type === 'Armor' ? <Shield className="w-5 h-5 text-indigo-400" /> :
                      <Package className="w-5 h-5 text-amber-400" />}
                     {item.stackSize > 1 && <span className="absolute bottom-px right-1 text-[7px] font-bold text-white bg-black/50 px-0.5 rounded">x{item.currentStack}</span>}
                     
                     <div className="absolute -top-1 -right-1 text-[6px] text-green-400 bg-black/80 px-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                         {item.defId}
                     </div>
                   </motion.div>
                 ))}
                 {Array.from({ length: Math.max(0, 8 - inventory.length) }).map((_, i) => (
                   <div key={i} className="aspect-square bg-slate-900/30 rounded border border-white/5 border-dashed" />
                 ))}
               </AnimatePresence>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
