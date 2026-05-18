import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ItemInstance, BASE_TYPES } from '../types/gameTypes';
import { generateBaseItem, applyAlchemyOrb, applyChaosOrb, applyScouringOrb, applyTransmutationOrb, applyExaltedOrb, applyAnnulmentOrb, applyVaalOrb, applyMirrorOfKalandra, applyHarvestAugment } from '../utils/craftingLogic';
import { Hammer, Database, Cpu, Monitor, Zap } from 'lucide-react';

interface Props {
  onEvent: (msg: string) => void;
}

export default function ItemCraftingPlayground({ onEvent }: Props) {
  const [item, setItem] = useState<ItemInstance>(generateBaseItem());
  const [harvestTag, setHarvestTag] = useState<string>('life');

  const baseDef = BASE_TYPES.SWORD; // We know it's a sword for the playground

  const renderRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Normal': return 'text-rarity-normal';
      case 'Magic': return 'text-rarity-magic';
      case 'Rare': return 'text-rarity-rare';
      case 'Unique': return 'text-rarity-unique';
      default: return 'text-white';
    }
  };

  const handleAction = (action: () => ItemInstance, msg: string) => {
    setItem(action());
    onEvent(msg);
  };

  const isFull = item.prefixes.length >= 3 && item.suffixes.length >= 3;

  return (
    <div className="flex flex-col gap-4 w-full h-full text-sm">
      <div className="p-2 bg-slate-900 border border-slate-700/50 rounded-lg text-center font-bold tracking-widest text-[#d4af37] text-[10px] uppercase shadow-md flex justify-between items-center px-4">
        <span>The 3-Layer Architecture</span>
        <span className="text-gray-500 font-normal">Observe how Data, State, and UI interact</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0 overflow-y-auto">
        
        {/* Layer 1: Definition */}
        <div className="flex-1 bg-green-950/20 border border-green-900/40 rounded-xl p-4 flex flex-col gap-3 shadow-inner">
          <h3 className="text-green-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 border-b border-green-900/30 pb-2">
            <Database className="w-3.5 h-3.5" /> 1. Definition (UDataAsset)
          </h3>
          <div className="flex-1 bg-black/50 rounded p-3 text-[10px] font-mono text-green-300 leading-relaxed overflow-y-auto border border-white/5">
            // Read-Only, Shared across all instances<br/><br/>
            ID: <span className="text-white">"ITEM_def_001"</span><br/>
            BaseName: <span className="text-white">"{baseDef.baseName}"</span><br/>
            EquipSlot: ESlot::MainHand<br/>
            BasePhysicsDamage: [45, 120]<br/>
            Mesh: <span className="text-gray-500">SM_IronSword.uasset</span><br/>
            Icon: <span className="text-gray-500">T_IronSword.uasset</span><br/>
            Item Level: <span className="text-white">{item.itemLevel}</span><br/>
          </div>
          <p className="text-[9px] text-gray-500 italic">This memory never mutates during gameplay.</p>
        </div>

        {/* Layer 2: Runtime State */}
        <div className="flex-[1.5] bg-blue-950/20 border border-blue-900/40 rounded-xl p-4 flex flex-col gap-3 shadow-inner">
          <h3 className="text-blue-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 border-b border-blue-900/30 pb-2">
            <Cpu className="w-3.5 h-3.5" /> 2. Runtime State (USTRUCT)
          </h3>
          <div className="flex-1 bg-black/50 rounded p-3 text-[10px] font-mono text-blue-300 leading-relaxed overflow-y-auto border border-white/5 relative">
            <AnimatePresence mode="popLayout">
               <motion.div key={item.rarity + item.prefixes.length + item.suffixes.length + item.isCorrupted.toString() + item.isMirrored.toString()} initial={{opacity:0, scale: 0.98}} animate={{opacity:1, scale: 1}} className="absolute inset-0 p-3 h-full overflow-y-auto">
                 <span className="text-gray-500">// 32-Byte Chunk. Fully Serializable.</span><br/>
                 struct FItemInstance {'{'}<br/>
                 &nbsp;&nbsp;DefID: "ITEM_def_001",<br/>
                 &nbsp;&nbsp;Rarity: ERarity::<span className={item.rarity === 'Normal' ? 'text-gray-400' : item.rarity === 'Magic' ? 'text-blue-400' : 'text-yellow-400'}>{item.rarity.toUpperCase()}</span>,<br/>
                 &nbsp;&nbsp;bIsCorrupted: <span className={item.isCorrupted ? 'text-red-400' : 'text-gray-400'}>{item.isCorrupted ? 'true' : 'false'}</span>,<br/>
                 &nbsp;&nbsp;bIsMirrored: <span className={item.isMirrored ? 'text-blue-400' : 'text-gray-400'}>{item.isMirrored ? 'true' : 'false'}</span>,<br/>
                 &nbsp;&nbsp;Quality: 20,<br/>
                 &nbsp;&nbsp;Modifiers: [<br/>
                 {item.implicits.map(p => (
                   <span key={p.id} className="text-gray-400">&nbsp;&nbsp;&nbsp;&nbsp;Mod(Implicit, "{p.statName}", {p.value}),<br/></span>
                 ))}
                 {item.prefixes.map(p => (
                   <span key={p.id}>&nbsp;&nbsp;&nbsp;&nbsp;Mod(Pref, T{p.tier}, "{p.statName}", {p.value}),<br/></span>
                 ))}
                 {item.suffixes.map(p => (
                   <span key={p.id}>&nbsp;&nbsp;&nbsp;&nbsp;Mod(Suff, T{p.tier}, "{p.statName}", {p.value}),<br/></span>
                 ))}
                 &nbsp;&nbsp;]<br/>
                 {'}'}
               </motion.div>
            </AnimatePresence>
          </div>
          <p className="text-[9px] text-gray-500 italic">This is the ONLY data saved to disk. No UI pointers.</p>
        </div>

        {/* Layer 3: Presentation & Actions */}
        <div className="flex-[1.5] bg-purple-950/20 border border-purple-900/40 rounded-xl p-4 flex flex-col gap-3 shadow-inner">
          <h3 className="text-purple-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 border-b border-purple-900/30 pb-2">
            <Monitor className="w-3.5 h-3.5" /> 3. Presentation (UWidget)
          </h3>
          
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4">
            
            {/* Tooltip Observer */}
            <div className="w-[180px] flex-shrink-0 bg-black/80 border border-gray-700 font-sans shadow-2xl relative overflow-hidden ring-1 ring-white/5 text-center">
              <div className="p-2 border-b border-gray-700 bg-slate-900/50">
                <h3 className={`font-display font-bold text-xs leading-tight uppercase ${renderRarityColor(item.rarity)}`}>
                  {item.rarity === 'Rare' && <span className="block text-[8px] text-gray-500">Glyph Etcher</span>}
                  {baseDef.baseName}
                </h3>
              </div>
              <div className="p-2 flex flex-col gap-1.5">
                <div className="text-gray-400 space-y-0.5 text-[9px]">
                  <div className="flex justify-between"><span>Quality:</span> <span className="text-white">+20%</span></div>
                  <div className="flex justify-between"><span>Physical Dmg:</span> <span className="text-white">45-120</span></div>
                </div>
                <div className="w-full h-px bg-gray-700/50 my-1"></div>
                {item.implicits.length > 0 && (
                  <div className="text-gray-300 flex flex-col gap-0.5 text-[9px]">
                    <AnimatePresence>
                      {item.implicits.map(imp => (
                         <motion.div initial={{opacity: 0}} animate={{opacity: 1}} key={imp.id}>
                           {imp.statName} +{imp.value}
                         </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
                <div className="w-full h-px bg-gray-700/50 my-1"></div>
                {(item.prefixes.length > 0 || item.suffixes.length > 0) && (
                  <div className="text-[#8888FF] flex flex-col gap-0.5 text-[9px]">
                    <AnimatePresence>
                      {item.prefixes.map(pref => (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} key={pref.id}>
                          <span className="text-gray-600 mr-1 opacity-50">P{pref.tier}</span> {pref.statName} +{pref.value}
                        </motion.div>
                      ))}
                      {item.suffixes.map(suff => (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} key={suff.id}>
                          <span className="text-gray-600 mr-1 opacity-50">S{suff.tier}</span> {suff.statName} +{suff.value}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
                {item.isCorrupted && <div className="text-red-500 text-[10px] font-bold mt-2 uppercase">Corrupted</div>}
                {item.isMirrored && <div className="text-gray-400 text-[10px] font-bold mt-1 uppercase">Mirrored</div>}
              </div>
            </div>

            {/* Simulated Server Commands */}
            <div className="flex-1 max-w-[200px] flex flex-col gap-2">
               <div className="grid grid-cols-2 gap-2 w-full">
                  <button 
                    onClick={() => handleAction(() => applyTransmutationOrb(item), 'Craft(Transmute)')}
                    disabled={item.rarity !== 'Normal' || item.isCorrupted || item.isMirrored}
                    className="p-1 rounded bg-blue-900/20 border border-blue-900/50 hover:bg-blue-900/40 disabled:opacity-30 text-center transition-all text-[9px] font-bold text-blue-200"
                  >Transmute</button>
                  <button 
                    onClick={() => handleAction(() => applyAlchemyOrb(item), 'Craft(Alchemy)')}
                    disabled={item.rarity !== 'Normal' || item.isCorrupted || item.isMirrored}
                    className="p-1 rounded bg-yellow-900/20 border border-yellow-900/50 hover:bg-yellow-900/40 disabled:opacity-30 text-center transition-all text-[9px] font-bold text-yellow-200"
                  >Alchemy</button>
                  <button 
                    onClick={() => handleAction(() => applyChaosOrb(item), 'Craft(Chaos)')}
                    disabled={item.rarity !== 'Rare' || item.isCorrupted || item.isMirrored}
                    className="p-1 rounded bg-amber-700/20 border border-amber-700/50 hover:bg-amber-700/40 disabled:opacity-30 text-center transition-all text-[9px] font-bold text-amber-200"
                  >Chaos</button>
                  <button 
                    onClick={() => handleAction(() => applyScouringOrb(item), 'Craft(Scour)')}
                    disabled={item.rarity === 'Normal' || item.isCorrupted || item.isMirrored}
                    className="p-1 rounded bg-gray-700/20 border border-gray-700/50 hover:bg-gray-700/40 disabled:opacity-30 text-center transition-all text-[9px] font-bold text-gray-200"
                  >Scour</button>
                  <button 
                    onClick={() => handleAction(() => applyExaltedOrb(item), 'Craft(Exalt)')}
                    disabled={item.rarity !== 'Rare' || isFull || item.isCorrupted || item.isMirrored}
                    className="p-1 rounded bg-orange-400/20 border border-orange-400/50 hover:bg-orange-400/40 disabled:opacity-30 text-center transition-all text-[9px] font-bold text-orange-200"
                  >Exalt</button>
                  <button 
                    onClick={() => handleAction(() => applyAnnulmentOrb(item), 'Craft(Annul)')}
                    disabled={(item.rarity !== 'Magic' && item.rarity !== 'Rare') || item.isCorrupted || item.isMirrored}
                    className="p-1 rounded bg-zinc-400/20 border border-zinc-400/50 hover:bg-zinc-400/40 disabled:opacity-30 text-center transition-all text-[9px] font-bold text-zinc-200"
                  >Annul</button>
                  <button 
                    onClick={() => handleAction(() => applyVaalOrb(item), 'Craft(Vaal)')}
                    disabled={item.isCorrupted || item.isMirrored}
                    className="p-1 rounded bg-red-600/20 border border-red-600/50 hover:bg-red-600/40 disabled:opacity-30 text-center transition-all text-[9px] font-bold text-red-400"
                  >Vaal Orb</button>
                  <button 
                    onClick={() => handleAction(() => applyMirrorOfKalandra(item), 'Craft(Mirror)')}
                    disabled={item.isCorrupted || item.isMirrored}
                    className="p-1 rounded bg-cyan-400/20 border border-cyan-400/50 hover:bg-cyan-400/40 disabled:opacity-30 text-center transition-all text-[9px] font-bold text-cyan-200"
                  >Mirror</button>
               </div>
               
               <div className="mt-2 bg-emerald-950/40 border border-emerald-900/50 p-2 rounded flex flex-col gap-1">
                 <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest flex items-center justify-between">
                   <Zap className="w-3 h-3" /> Harvest Augment
                 </div>
                 <div className="flex gap-1 mt-1">
                   <select value={harvestTag} onChange={e => setHarvestTag(e.target.value)} className="bg-black border border-emerald-900/50 text-emerald-200 text-[9px] p-1 rounded outline-none flex-1">
                     <option value="life">Life</option>
                     <option value="physical">Physical</option>
                     <option value="fire">Fire</option>
                     <option value="speed">Speed</option>
                   </select>
                   <button 
                     onClick={() => handleAction(() => applyHarvestAugment(item, harvestTag), `Harvest(Augment ${harvestTag})`)}
                     disabled={(item.rarity !== 'Magic' && item.rarity !== 'Rare') || isFull || item.isCorrupted || item.isMirrored}
                     className="px-2 bg-emerald-700/50 hover:bg-emerald-600/60 disabled:opacity-30 rounded text-[9px] font-bold text-white transition-colors"
                   >Go</button>
                 </div>
               </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
