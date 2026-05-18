import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ItemInstance, BASE_TYPES } from '../types/gameTypes';
import { generateBaseItem, applyAlchemyOrb, applyChaosOrb, applyScouringOrb, applyTransmutationOrb } from '../utils/craftingLogic';
import { Box, Hammer, Info, Database, Code } from 'lucide-react';
import HoverableLine from './HoverableLine';
import { HighlightGlossary } from './HighlightGlossary';

interface Props {
  onEvent?: (msg: string) => void;
}

export default function ItemDataContent({ onEvent }: Props) {
  const [item, setItem] = useState<ItemInstance>(generateBaseItem());

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

  const formatStatName = (stat: string, value: number) => {
    return stat.replace('#', value.toString());
  };

  const handleAction = (action: () => ItemInstance, msg: string) => {
    setItem(action());
    if (onEvent) onEvent(msg);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full overflow-hidden">
      {/* LEFT COLUMN: VISUAL INVENTORY & CRAFTING */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 pb-8 custom-scrollbar">
        <div className="bg-rpg-panel border border-rpg-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-rpg-border pb-4">
            <Hammer className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-display font-semibold text-white">Crafting Bench</h2>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* The Item Tooltip */}
            <div className="w-[300px] flex-shrink-0 bg-black/80 border border-gray-700 font-sans shadow-2xl relative overflow-hidden group">
              {/* Header */}
              <div className="text-center p-2 border-b border-gray-700">
                <h3 className={`font-display font-bold text-lg leading-tight uppercase ${renderRarityColor(item.rarity)}`}>
                  {item.rarity === 'Rare' && <span className="block text-sm">Glyph Etcher</span>}
                  {baseDef.baseName}
                </h3>
              </div>
              
              {/* Stats */}
              <div className="p-4 flex flex-col gap-3">
                <div className="text-gray-400 space-y-1 text-sm">
                  <div className="flex justify-between"><span>Quality:</span> <span className="text-white">+20%</span></div>
                  <div className="flex justify-between"><span>Physical Damage:</span> <span className="text-white">45-120</span></div>
                  <div className="flex justify-between"><span>Crit Chance:</span> <span className="text-white">5.00%</span></div>
                  <div className="flex justify-between"><span>Attacks/Sec:</span> <span className="text-white">1.30</span></div>
                </div>

                <div className="w-full h-px bg-gray-700 my-1"></div>
                
                {/* Implicits */}
                {item.implicits.length > 0 && (
                  <div className="text-[#8888FF] text-center text-sm">
                    {item.implicits.map(imp => (
                      <div key={imp.id}>{formatStatName(imp.statName, imp.value)}</div>
                    ))}
                  </div>
                )}

                {(item.prefixes.length > 0 || item.suffixes.length > 0) && (
                  <div className="w-full h-px bg-gray-700 my-1"></div>
                )}

                {/* Explicits */}
                <div className="text-[#8888FF] text-center flex flex-col gap-1 text-sm">
                  <AnimatePresence>
                    {item.prefixes.map(pref => (
                      <motion.div initial={{opacity: 0, x: -10}} animate={{opacity: 1, x: 0}} key={pref.id}>
                        {formatStatName(pref.statName, pref.value)}
                      </motion.div>
                    ))}
                    {item.suffixes.map(suff => (
                      <motion.div initial={{opacity: 0, x: -10}} animate={{opacity: 1, x: 0}} key={suff.id}>
                        {formatStatName(suff.statName, suff.value)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Crafting Controls */}
            <div className="flex flex-col gap-3 flex-1 w-full">
              <h3 className="text-gray-400 font-medium mb-2 uppercase tracking-wider text-xs">Apply Currency</h3>
              
              <button 
                onClick={() => handleAction(() => applyTransmutationOrb(item), 'Used Orb of Transmutation: Normal -> Magic')}
                disabled={item.rarity !== 'Normal'}
                className="flex items-center gap-3 p-3 rounded bg-blue-900/20 border border-blue-900/50 hover:bg-blue-900/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-left"
              >
                <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-xs font-bold text-blue-900 shadow-[0_0_10px_rgba(96,165,250,0.5)] flex-shrink-0">TO</div>
                <div>
                  <div className="font-bold text-blue-200">Orb of Transmutation</div>
                  <div className="text-blue-200/60 text-xs">Upgrades a normal item to a magic item</div>
                </div>
              </button>

              <button 
                onClick={() => handleAction(() => applyAlchemyOrb(item), 'Used Orb of Alchemy: Normal -> Rare')}
                disabled={item.rarity !== 'Normal'}
                className="flex items-center gap-3 p-3 rounded bg-yellow-900/20 border border-yellow-900/50 hover:bg-yellow-900/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-left"
              >
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-yellow-900 shadow-[0_0_10px_rgba(250,204,21,0.5)] flex-shrink-0">AO</div>
                <div>
                  <div className="font-bold text-yellow-200">Orb of Alchemy</div>
                  <div className="text-yellow-200/60 text-xs">Upgrades a normal item to a rare item</div>
                </div>
              </button>

              <button 
                onClick={() => handleAction(() => applyChaosOrb(item), 'Used Chaos Orb: Reforged Rare Modifiers')}
                disabled={item.rarity !== 'Rare'}
                className="flex items-center gap-3 p-3 rounded bg-amber-700/20 border border-amber-700/50 hover:bg-amber-700/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-left"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-amber-900 shadow-[0_0_10px_rgba(245,158,11,0.5)] flex-shrink-0">CO</div>
                <div>
                  <div className="font-bold text-amber-200">Chaos Orb</div>
                  <div className="text-amber-200/60 text-xs">Reforges a rare item with new random modifiers</div>
                </div>
              </button>

              <button 
                onClick={() => handleAction(() => applyScouringOrb(item), 'Used Orb of Scouring: Returning to Normal')}
                disabled={item.rarity === 'Normal'}
                className="flex items-center gap-3 p-3 rounded bg-gray-700/20 border border-gray-700/50 hover:bg-gray-700/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-left mt-4"
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-800 flex-shrink-0">SO</div>
                <div>
                  <div className="font-bold text-gray-200">Orb of Scouring</div>
                  <div className="text-gray-400 text-xs">Removes all modifiers, returning it to Normal rarity</div>
                </div>
              </button>
              
            </div>
          </div>
        </div>
        
        {/* Architectural Explanation */}
        <div className="bg-rpg-panel border border-rpg-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-display font-semibold text-white">How This Works in UE5</h2>
          </div>
          <div className="space-y-4 text-gray-300 leading-relaxed text-sm">
            <HighlightGlossary>
              <p>
                An ARPG cannot afford to have a unique C++ class for every single sword in the game. That would mean writing tens of thousands of classes. Instead, we use a <strong>Data-Driven Architecture</strong>.
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li><strong>The Base:</strong> Designers create a `UDataTable` or `UPrimaryDataAsset` in the UE editor containing base stats.</li>
                <li><strong>The Instance:</strong> When an item drops, C++ generates an `FItemInstance` struct in memory.</li>
                <li><strong>The Logic:</strong> An Orb is simply a function that evaluates and modifies the dynamic array of `FAffixInstance` structs.</li>
              </ol>
            </HighlightGlossary>
            <div className="bg-blue-900/20 border border-blue-900 text-blue-200 p-4 rounded mt-4 flex gap-3 items-center">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>Hover over the JSON payload on the right to see how the C++ Struct representation reacts to your crafting in real-time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: RAW DATA / JSON VIEW */}
      <div className="w-full xl:w-[450px] bg-slate-950 border border-rpg-border rounded-lg overflow-hidden flex flex-col flex-shrink-0 h-[600px] xl:h-auto pb-4">
        <div className="bg-slate-900 px-4 py-3 border-b border-rpg-border flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 font-mono">USTRUCT FItemInstance (Memory View)</span>
          </div>
        </div>
        <div className="p-4 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words flex-1 font-mono text-xs leading-5 custom-scrollbar">
          <pre className="text-pink-400">
            {`{`}
          </pre>
          <div className="pl-4">
            <HoverableLine 
              code={<span className="text-green-300">"Id": <span className="text-blue-300">"{item.id.slice(0, 8)}..."</span>,</span>}
              explanation="Unique identifier generated at runtime for each distinct drop."
            />
            
            <HoverableLine
              code={
                <>
                  <span className="text-green-300">"DefinitionId":</span> <span className="text-blue-300">"{item.definitionId}"</span>,
                </>
              }
              explanation="Pointer to a UE5 PrimaryDataAsset containing static base weapon stats."
            />

            <HoverableLine
              code={<span className="text-green-300">"ItemLevel": <span className="text-orange-300">{item.itemLevel}</span>,</span>}
              explanation="Determines the max tier of modifiers that can spawn on this item."
            />

            <HoverableLine
              code={<span className="text-green-300">"Rarity": <span className="text-blue-300">"ERarity::{item.rarity}"</span>,</span>}
              explanation="C++ Enum defining the behavior and structural bounds of the item."
            />
            
            <HoverableLine
              code={<span className="text-green-300">"Implicits": <span className="text-pink-400">[</span></span>}
              explanation="Base attributes intrinsic to the item type, immutable by normal orbs."
            />

            <div className="pl-4 border-l border-gray-800 ml-2 mb-2 bg-white/5 py-1 rounded">
              {item.implicits.map(imp => (
                <div key={imp.id}>
                  <HoverableLine code={<span className="text-pink-400">{'{'}</span>} explanation="An instance of an FAffixInstance Struct inside an Array." />
                  <div className="pl-4">
                    <HoverableLine code={<><span className="text-green-300">"StatId":</span> <span className="text-blue-300">"{imp.statName}"</span>,</>} explanation="Refers to global gameplay tags or variable IDs." />
                    <HoverableLine code={<><span className="text-green-300">"Value":</span> <span className="text-orange-300">{imp.value}</span></>} explanation="Actual rolled value within the specific tier's boundaries." />
                  </div>
                  <HoverableLine code={<span className="text-pink-400">{'}'}</span>} explanation="End of FAffixInstance." />
                </div>
              ))}
            </div>
            <HoverableLine code={<span className="text-pink-400">],</span>} explanation="End of Implicits Array." />

            <HoverableLine
              code={<span className="text-green-300">"Prefixes": <span className="text-pink-400">[</span></span>}
              explanation="Dynamically expanding array. Max capacity varies by rarity."
            />

            <div className="pl-4 border-l border-gray-800 ml-2 mb-2 bg-white/5 py-1 rounded">
              <AnimatePresence>
                {item.prefixes.map((pref, i) => (
                  <motion.div initial={{opacity: 0, backgroundColor: 'rgba(59, 130, 246, 0.5)'}} animate={{opacity: 1, backgroundColor: 'transparent'}} transition={{duration: 1}} key={pref.id}>
                    <HoverableLine code={<span className="text-pink-400">{'{'}</span>} explanation="Prefix Modifier Struct Instance." />
                    <div className="pl-4">
                      <HoverableLine code={<><span className="text-green-300">"StatId":</span> <span className="text-blue-300">"{pref.statName}"</span>,</>} explanation="The targeted gameplay variable to augment." />
                      <HoverableLine code={<><span className="text-green-300">"Tier":</span> <span className="text-orange-300">{pref.tier}</span>,</>} explanation="The tier determines the min/max values possible." />
                      <HoverableLine code={<><span className="text-green-300">"Value":</span> <span className="text-orange-300">{pref.value}</span></>} explanation="The calculated value using UE's FMath::RandRange." />
                    </div>
                    <HoverableLine code={<span className="text-pink-400">{'}'}{i < item.prefixes.length - 1 ? ',' : ''}</span>} explanation="End of Prefix Instance." />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <HoverableLine code={<span className="text-pink-400">],</span>} explanation="End of Prefixes Array." />

            <HoverableLine
              code={<span className="text-green-300">"Suffixes": <span className="text-pink-400">[</span></span>}
              explanation="Dynamically expanding array, typically modifying secondary attributes."
            />
            <div className="pl-4 border-l border-gray-800 ml-2 mb-2 bg-white/5 py-1 rounded">
              <AnimatePresence>
                {item.suffixes.map((suff, i) => (
                  <motion.div initial={{opacity: 0, backgroundColor: 'rgba(59, 130, 246, 0.5)'}} animate={{opacity: 1, backgroundColor: 'transparent'}} transition={{duration: 1}} key={suff.id}>
                    <HoverableLine code={<span className="text-pink-400">{'{'}</span>} explanation="Suffix Modifier Struct Instance." />
                    <div className="pl-4">
                      <HoverableLine code={<><span className="text-green-300">"StatId":</span> <span className="text-blue-300">"{suff.statName}"</span>,</>} explanation="The targeted gameplay variable to augment." />
                      <HoverableLine code={<><span className="text-green-300">"Tier":</span> <span className="text-orange-300">{suff.tier}</span>,</>} explanation="The tier determines the min/max values possible." />
                      <HoverableLine code={<><span className="text-green-300">"Value":</span> <span className="text-orange-300">{suff.value}</span></>} explanation="The calculated value using UE's FMath::RandRange." />
                    </div>
                    <HoverableLine code={<span className="text-pink-400">{'}'}{i < item.suffixes.length - 1 ? ',' : ''}</span>} explanation="End of Suffix Instance." />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <HoverableLine code={<span className="text-pink-400">]</span>} explanation="End of Suffixes Array." />
          </div>
          <HoverableLine code={<pre className="text-pink-400">{'}'}</pre>} explanation="End of FItemInstance." />
        </div>
      </div>
    </div>
  );
}
