import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Hammer, Boxes, Sparkles, Zap, Shield, Swords, Gem, Plus } from 'lucide-react';

interface Modifier {
  id: string;
  name: string;
  value: number;
  type: 'damage' | 'speed' | 'defense';
  rarity: 'common' | 'rare' | 'monumental';
}

interface Item {
  name: string;
  baseDamage: number;
  gems: string[];
  maxGems: number;
}

export default function CraftingSimulator() {
  const [item, setItem] = useState<Item>({
    name: "Sun-Touched Broadsword",
    baseDamage: 45,
    gems: [],
    maxGems: 3
  });

  const availableGems = [
    { id: 'g1', name: 'Fire Gem', effect: '+15 Fire Damage', color: 'bg-red-500' },
    { id: 'g2', name: 'Swift Gem', effect: '+10% Attack Speed', color: 'bg-green-400' },
    { id: 'g3', name: 'Echo Gem', effect: 'Repeat skill 15% chance', color: 'bg-blue-400' },
    { id: 'g4', name: 'Void Gem', effect: '10% Armor Penetration', color: 'bg-purple-500' }
  ];

  const addGem = (gemName: string) => {
    if (item.gems.length < item.maxGems) {
      setItem({ ...item, gems: [...item.gems, gemName] });
    }
  };

  const clearGems = () => setItem({ ...item, gems: [] });

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-3xl font-bold mb-2">Deep Itemization Engine</h2>
        <p className="text-kingfisher-muted">Engineering scalable item systems with Path of Exile inspired modification logic.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Item Workbench */}
        <div className="bg-kingfisher-dark/50 border border-kingfisher-blue/20 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-kingfisher-warm/5 to-transparent pointer-events-none"></div>
          
          {/* Visual Item Representation */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-48 h-48 bg-kingfisher-blue/10 rounded-full flex items-center justify-center border-4 border-kingfisher-blue/20 shadow-[0_0_50px_rgba(120,127,178,0.2)] relative z-10"
          >
            <Swords className="w-24 h-24 text-kingfisher-blue" />
            
            {/* Sockets */}
            <div className="absolute inset-0">
               {Array.from({ length: item.maxGems }).map((_, i) => (
                 <div 
                   key={i}
                   className={`absolute w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center ${
                     i === 0 ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' :
                     i === 1 ? 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2' :
                     'bottom-0 right-0 translate-x-1/2 translate-y-1/2'
                   } ${item.gems[i] ? 'bg-kingfisher-warm border-kingfisher-warm' : 'bg-kingfisher-dark border-kingfisher-blue/40'}`}
                 >
                   {item.gems[i] && <Gem className="w-5 h-5 text-kingfisher-dark" />}
                 </div>
               ))}
            </div>
          </motion.div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-kingfisher-surface mb-2">{item.name}</h3>
            <div className="flex gap-4 justify-center text-sm font-bold uppercase tracking-widest text-kingfisher-muted">
              <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-kingfisher-warm" /> {item.baseDamage + (item.gems.length * 12)} DMG</span>
              <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-kingfisher-blue" /> {100 + (item.gems.filter(g => g.includes('Void')).length * 20)} PEN</span>
            </div>
          </div>

          <button 
            onClick={clearGems}
            className="mt-8 px-4 py-2 border border-kingfisher-blue/20 rounded-lg text-xs font-bold hover:bg-kingfisher-blue/10 transition-colors uppercase"
          >
            Scour Sockets
          </button>
        </div>

        {/* Modification Control */}
        <div className="space-y-6">
          <div className="bg-kingfisher-dark/40 border border-kingfisher-blue/20 rounded-3xl p-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-kingfisher-blue mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Available Gems/Orbs
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {availableGems.map(gem => (
                <button
                  key={gem.id}
                  onClick={() => addGem(gem.name)}
                  disabled={item.gems.length >= item.maxGems}
                  className="group flex items-center justify-between p-4 bg-kingfisher-dark border border-kingfisher-blue/5 rounded-2xl hover:border-kingfisher-warm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${gem.color} flex items-center justify-center shadow-lg`}>
                       <Gem className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold">{gem.name}</div>
                      <div className="text-[10px] text-kingfisher-muted">{gem.effect}</div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-4 h-4 text-kingfisher-warm" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-kingfisher-warm/5 border border-kingfisher-warm/10 rounded-3xl p-6">
             <h4 className="text-sm font-bold uppercase tracking-wider text-kingfisher-warm mb-3 flex items-center gap-2">
               <Hammer className="w-4 h-4" /> Unreal Blueprint Logic
             </h4>
             <p className="text-xs text-kingfisher-muted leading-relaxed">
               In Unreal Engine, this is implemented using a **Data-Driven Architecture**. Items are `UDataAssets`, and gems are `UObjects` that apply `UGameplayEffect` modifiers via the **Gameplay Ability System (GAS)**.
             </p>
             <ul className="mt-4 space-y-2">
               <li className="text-[10px] bg-kingfisher-warm/10 p-2 rounded border border-kingfisher-warm/20 text-kingfisher-surface font-mono">
                 // Mod apply logic<br/>
                 ItemAttributeSet-&gt;Damage.BaseValue += GemModifier;
               </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
