import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, X, Shield, Cpu, Database, Settings, Zap, ArrowRight,
  RefreshCw, Layers, Sparkles, HardDrive, Trash2, Box, Code, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COLORS } from '../../../../constants/colors';
import { SectionCard, HighlightBox, PageHeader, CodeBlock, StatRow, MultiplayerImpact, FeatureMatrix } from './OptimizationHelpers';

// FNV-1a 32-bit Hash implementation
function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export const ModderOptimizationTab: React.FC = () => {
  // Input for String Hashing Simulator
  const [hashInput, setHashInput] = useState('Rebels');
  const activeHash = fnv1a(hashInput);

  // States for Re-Baking Simulator
  const [activeSupportGem, setActiveSupportGem] = useState('Added Fire Damage');
  const [activeWeapon, setActiveWeapon] = useState('Flame Blade');
  const [allocatedPassive, setAllocatedPassive] = useState('Pyromaniac (+10% Fire Damage)');
  
  const [bIsDirty, setBIsDirty] = useState(false);
  const [bIsBaking, setBIsBaking] = useState(false);
  const [bakedVersion, setBakedVersion] = useState(1);
  const [recalculatingThread, setRecalculatingThread] = useState<string | null>(null);

  // States for Sparse Archetype Simulator
  const [entityCount, setEntityCount] = useState(2500);
  const [modelType, setModelType] = useState<'oop_actor' | 'sparse_ecs'>('sparse_ecs');

  const triggerReBake = (actionName: string) => {
    if (bIsBaking) return;
    setBIsDirty(true);
    setBIsBaking(true);
    setRecalculatingThread('Worker Thread Pool (Async Task)');
    
    setTimeout(() => {
      setBakedVersion(prev => prev + 1);
      setBIsDirty(false);
      setBIsBaking(false);
      setRecalculatingThread(null);
    }, 1200);
  };

  // Run initial hash comparison simulation
  const standardStringCompareCost = hashInput.length * 4.2; // arbitrary nanoseconds multiplier
  const hashedIntCompareCost = 0.4; // 0.4 nanoseconds for direct comparison

  // Sparse Archetype Maths
  const oopMemoryPerEntity = 42 * 1024; // 42KB per Actor
  const ecsMemoryPerEntity = 32; // 32 bytes per instance
  const genericTotalOopMemory = (entityCount * oopMemoryPerEntity) / (1024 * 1024); // MB
  const genericTotalEcsMemory = (entityCount * ecsMemoryPerEntity) / 1024; // KB
  
  const oopCacheMissRate = 72; // %
  const ecsCacheMissRate = 1.2; // %

  const oopCpuTime = 4.2 + (entityCount * 0.0036); // ms Game Thread
  const ecsCpuTime = 0.15 + (entityCount * 0.00012); // ms Game Thread

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="Modder-Friendly & Peak Optimized Architecture" 
        subtitle="Master the 'Static Engine, Dynamic Data' paradigm. Discover how to provide human-readable text configurations (JSON/Lua) for infinite moddability while compiling assets offline and utilizing contiguous memory layouts at runtime."
      />

      <HighlightBox type="info" className="p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/15 rounded-lg text-blue-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">The Fundamental Conflict: Flexibility vs. Rigidity</h4>
            <p className="text-kingfisher-muted text-xs leading-relaxed mt-0.5">
              Modders need <strong>human-readable text formats</strong> (JSON/YAML) and <strong>dynamic scripting languages</strong> (Lua) to mod weapons, stats, and behaviors easily. However, parsing text and executing dynamic scripts inside real-time game loops ruins CPU cache performance and causes massive frame drops. 
              The solution lies in a <strong>two-layer architecture</strong>: developers edit loose data, but the game engine <strong>hashes, bakes, and packages</strong> everything into optimized binary memory layouts (like static C++ arrays and sparse archetypes) the moment the game boots or loads.
            </p>
          </div>
        </div>
      </HighlightBox>

      {/* HARDWARE IMPACT OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'CPU Game Thread saving', value: '-8.5ms', sub: 'String Hashing & Pools', color: 'text-amber-400', icon: Cpu },
          { label: 'System RAM Saved', value: 'Up to 90%', sub: 'No Duplicate OOP Assets', color: 'text-purple-400', icon: Database },
          { label: 'VRAM Stream Efficiency', value: 'Zero-Parsing streaming', sub: 'Pre-Cooked Binary Buffers', color: 'text-pink-400', icon: HardDrive },
          { label: 'Garbage Collection Spikes', value: '0ms', sub: 'Pre-Allocated Static Pools', color: 'text-emerald-400', icon: Zap },
        ].map((stat, i) => (
          <div key={i} className="bg-kingfisher-panel/60 border border-kingfisher-border/40 p-4 rounded-xl flex items-center gap-4">
            <div className="p-2 rounded-lg bg-black/20">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-kingfisher-muted font-bold">{stat.label}</div>
              <div className="text-lg font-mono font-bold text-white leading-tight">{stat.value}</div>
              <div className="text-[10px] text-kingfisher-muted/70">{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* UNREAL ENGINE HAS vs HAS NOT */}
      <SectionCard title="Unreal Engine 5.8 Toolkit Capability Map" icon={Shield} color={COLORS.kingfisher.blue}>
        <p className="text-xs text-kingfisher-muted mb-4 -mt-2">
          Evaluating the out-of-the-box features Unreal provides to bridge modding with performance, and how developers must bridge the missing gaps:
        </p>
        <FeatureMatrix 
          has={[
            "UPrimaryDataAsset (Loose, standalone content classes loaded on demand)",
            "AssetManager (Static dependency registration, custom game-state chunking rules)",
            "DataTables (CSV/JSON compilation inside the editor, caching table keys)"
          ]}
          missing={[
            "Native, runtime JSON-to-optimized-struct 'Baking' systems in cooked client builds (cooked games expect read-only static UAssets).",
            "Built-in lightweight sandboxed Lua interpreters (Blueprint execution carries major virtual machine overhead; developers must write custom C++ Lua integrations).",
            "Out-of-the-box tools for mod conflict JSON patching/xpath overrides."
          ]}
          howToUse="Store gameplay numbers in UPrimaryDataAssets during development. For release, compile (cook) these data assets into packed binary files (compressing graphics into GPU formats). For modding support, write a native C++ loader that scans user folders at boot, hashes and validates all custom JSON entries, and injects them into a pre-allocated C++ static registry array."
        />
      </SectionCard>

      {/* SIMULATOR 1: STRING HASHING ENGINE (FNV-1a) */}
      <SectionCard title="Simulator #1: FNV-1a String Hashing Engine (Human Text ──► CPU Numbers)" icon={Code} color={COLORS.kingfisher.warm}>
        <div className="space-y-6">
          <p className="text-xs text-kingfisher-muted leading-relaxed">
            Modders love descriptive strings like <code className="bg-black/40 px-1 py-0.5 text-blue-300 rounded">"custom_faction_laser_bullet"</code> or <code className="bg-black/40 px-1 py-0.5 text-blue-300 rounded">"Rebels"</code>. Comparing strings inside your game loops, however, is a catastrophic CPU bottleneck: the CPU must compare character-by-character, jumping across heap memory. 
            By hashing strings into a single 32-bit integer (like <code className="bg-black/40 px-1 py-0.5 text-amber-300 rounded">2306871730 / 0x8A3F21B2</code>) at boot, the CPU compares them in single-cycle micro-operations, maintaining 100% Cache hits.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-black/25 p-5 rounded-2xl border border-kingfisher-border/50">
            {/* Left: Input string and math breakdown */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  1. Type Modder Faction String
                </label>
                <input 
                  type="text" 
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  className="w-full bg-kingfisher-dark border border-kingfisher-border focus:border-kingfisher-blue text-white font-mono text-sm p-3 rounded-xl focus:outline-none transition-all"
                  placeholder="Enter a descriptive string..."
                />
              </div>

              {/* FNV-1a Math Breakdown */}
              <div className="space-y-2 p-4 bg-kingfisher-dark/60 rounded-xl border border-kingfisher-border/30">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700] block mb-2">
                  FNV-1a 32-bit Hash Processing Flow
                </span>
                <div className="font-mono text-xs text-kingfisher-muted space-y-1">
                  <div>Initial Hash Offset Basis: <span className="text-blue-400">0x811c9dc5</span> (2166136261)</div>
                  <div>FNV-1a 32-bit Prime: <span className="text-emerald-400">0x01000193</span> (16777619)</div>
                  <div className="h-px bg-kingfisher-border/30 my-2" />
                  <div className="text-[10px] text-kingfisher-muted/60 uppercase tracking-wider mb-2">Step-by-Step Character Iterations:</div>
                  <div className="max-h-32 overflow-y-auto custom-scrollbar pr-1 space-y-1 text-[11px] leading-tight">
                    {hashInput.split('').slice(0, 10).map((char, index) => {
                      const prevHash = index === 0 ? 0x811c9dc5 : fnv1a(hashInput.substring(0, index));
                      const code = char.charCodeAt(0);
                      const xorHash = (prevHash ^ code) >>> 0;
                      const finalStepHash = Math.imul(xorHash, 0x01000193) >>> 0;
                      return (
                        <div key={index} className="flex justify-between font-mono py-1 border-b border-kingfisher-border/10 last:border-0">
                          <span>
                            Char #{index}: <strong className="text-white">'{char}'</strong> (code {code})
                          </span>
                          <span style={{ color: COLORS.kingfisher.warm }}>
                            XOR ──► Mult ──► Hex: 0x{finalStepHash.toString(16).toUpperCase()}
                          </span>
                        </div>
                      );
                    })}
                    {hashInput.length > 10 && (
                      <div className="text-center text-[10px] text-kingfisher-muted italic pt-1 border-t border-kingfisher-border/10">
                        + {hashInput.length - 10} more characters...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Live Hashed representation and timings compared */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="p-4 bg-kingfisher-dark/80 rounded-xl border border-kingfisher-border text-center space-y-2">
                <span className="text-[10px] font-bold text-kingfisher-muted uppercase tracking-widest block">
                  32-Bit Compiled Value (The Registry Key)
                </span>
                <div className="text-3xl font-mono font-extrabold text-blue-400 select-all tracking-wide">
                  0x{activeHash.toString(16).toUpperCase()}
                </div>
                <div className="text-xs text-kingfisher-muted font-mono">
                  Decimal format: {activeHash}
                </div>
              </div>

              {/* Performance Comparison graph */}
              <div className="p-4 bg-black/40 rounded-xl border border-kingfisher-border/30 space-y-3">
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
                  Live CPU Cost Comparison (1,000 Loop Iterations)
                </span>
                
                {/* String search row */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[10.5px]">
                    <span className="text-rose-400 font-bold">Standard String compares:</span>
                    <span>{standardStringCompareCost.toFixed(1)} ns</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                  <span className="text-[9px] text-kingfisher-muted/75 leading-relaxed block italic">
                    Scans letter-by-letter. CPU Cache cleared on iteration. Risk of Frame hitch.
                  </span>
                </div>

                {/* Hashed Int search row */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between font-mono text-[10.5px]">
                    <span className="text-emerald-400 font-bold">Integer checks (O(1) Hashed):</span>
                    <span>{hashedIntCompareCost.toFixed(1)} ns</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(hashedIntCompareCost / standardStringCompareCost) * 100}%` }} />
                  </div>
                  <span className="text-[9px] text-kingfisher-muted/75 leading-relaxed block italic">
                    Single-clock bitwise compare. Kept entirely in L1/L2 Cache line. Blistering fast.
                  </span>
                </div>

                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] text-emerald-400 font-mono text-center">
                  🚀 Saved <strong>{(standardStringCompareCost - hashedIntCompareCost).toFixed(0)}x</strong> CPU Clock Cycles!
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* SIMULATOR 2: DYNAMIC RE-BAKING */}
      <SectionCard title="Simulator #2: Dynamic Re-Baking (The Gatekeeper / Dirty Flagging)" icon={RefreshCw} color={COLORS.status.success}>
        <div className="space-y-6">
          <p className="text-xs text-kingfisher-muted leading-relaxed">
            In Path of Exile, players can swap support gems, items, and passive tree skills in real time. Swapping gear forces complex calculations (e.g. converting Cold damage to Fire damage, updating overlap modifiers). 
            If your engine runs this math tree inside the combat loop, your frames will tank. Instead, the engine uses <strong>Deferred Lazy Evaluation (Dirty Flagging)</strong>:
            the second gear changes, the engine marks the character as <em>"Dirty."</em> It spans a background <strong>Worker Thread</strong> to recalculate (Re-Bake) the entire math structure, while the <strong>Main Frame Thread</strong> slides on unaffected at 144 FPS. Once completed, it seamlessly replaces pointers in a pre-allocated structural mailbox array.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-black/25 p-5 rounded-2xl border border-kingfisher-border/50">
            {/* Left: Input Selection switches (representing speedrunner hot swapping items) */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700] block">
                Trigger Speedrunner Hot-Swaps Mid-Combat
              </span>

              {/* Gem Selector */}
              <div className="space-y-1">
                <span className="text-[11px] text-white font-medium block">Support Gem Slot #1:</span>
                <div className="flex gap-2">
                  {['Added Fire Damage', 'Increased Crit Strikes', 'Faster Attacks'].map(gem => (
                    <button
                      key={gem}
                      onClick={() => { setActiveSupportGem(gem); triggerReBake('Gem Swapped'); }}
                      className={`flex-1 text-[10px] p-2 rounded-lg border font-bold transition-all ${
                        activeSupportGem === gem 
                          ? 'bg-blue-500/20 border-blue-500 text-white'
                          : 'bg-black/30 border-transparent hover:bg-neutral-800 text-kingfisher-muted hover:text-white'
                      }`}
                    >
                      {gem.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weapon Selector */}
              <div className="space-y-1">
                <span className="text-[11px] text-white font-medium block">Active Weapon Type:</span>
                <div className="flex gap-2">
                  {['Flame Blade', 'Archon Mace', 'Energy Staff'].map(wpn => (
                    <button
                      key={wpn}
                      onClick={() => { setActiveWeapon(wpn); triggerReBake('Weapon Swapped'); }}
                      className={`flex-1 text-[10px] p-2 rounded-lg border font-bold transition-all ${
                        activeWeapon === wpn 
                          ? 'bg-blue-500/20 border-blue-500 text-white'
                          : 'bg-black/30 border-transparent hover:bg-neutral-800 text-kingfisher-muted hover:text-white'
                      }`}
                    >
                      {wpn.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Passive Allocator */}
              <div className="space-y-1">
                <span className="text-[11px] text-white font-medium block">Passive Tree Node:</span>
                <div className="flex gap-2">
                  {['Pyromaniac (+10% Fire)', 'Assassin (+15% Crit)', 'Gladiator (+10% Speed)'].map(node => (
                    <button
                      key={node}
                      onClick={() => { setAllocatedPassive(node); triggerReBake('Passive Allocated'); }}
                      className={`flex-1 text-[10px] p-2 rounded-lg border font-bold transition-all ${
                        allocatedPassive === node 
                          ? 'bg-blue-500/20 border-blue-500 text-white'
                          : 'bg-black/30 border-transparent hover:bg-neutral-800 text-kingfisher-muted hover:text-white'
                      }`}
                    >
                      {node.split(' (+')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Code description */}
              <div className="p-3 bg-kingfisher-dark/50 rounded-lg border border-kingfisher-border/20 text-[10.5px] leading-relaxed text-kingfisher-muted">
                <strong className="text-white">Under the hood structure:</strong> Swapping variables flips a micro-register <code className="text-[#ffd700] bg-black/40 px-1 py-0.5 rounded">bIsStatsTreeDirty = true</code>. The engine schedules an incremental C++ task. No mallocs or deletions hit your memory heap; instead, pointers are reassigned inside zero-fragmentation static arrays.
              </div>
            </div>

            {/* Right: Simulation Threads visualizer */}
            <div className="lg:col-span-7 flex flex-col justify-between border-l border-kingfisher-border/30 pl-0 lg:pl-6 space-y-4">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffd700] block">
                  C++ Real-Time Process Mapping (Live Action)
                </span>

                {/* Main Thread box */}
                <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden flex items-center justify-between">
                  <div className="space-y-1 z-10">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Main Frame Thread (Active Combat Loop)
                    </div>
                    <div className="text-xs text-white font-mono">
                      Running Combat Calculations: <strong>144 FPS</strong> (~6.94ms / frame)
                    </div>
                    <div className="text-[10px] text-kingfisher-muted/80">
                      Processing: Accuracy sweeps, base multiplier arrays, physics sweeps, drawing visual assets.
                    </div>
                  </div>
                  <div className="text-[10px] font-mono p-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 tracking-wider font-extrabold uppercase rounded shrink-0">
                    UNBLOCKED
                  </div>
                </div>

                {/* Worker Thread box */}
                <div className={`p-3.5 rounded-xl border transition-all duration-300 relative overflow-hidden flex items-center justify-between ${
                  bIsBaking 
                    ? 'border-blue-500/50 bg-blue-500/15' 
                    : 'border-kingfisher-border/30 bg-black/20 text-kingfisher-muted'
                }`}>
                  <div className="space-y-1">
                    <div className={`text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 ${bIsBaking ? 'text-blue-400' : 'text-kingfisher-muted'}`}>
                      {bIsBaking && <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />}
                      Worker Thread Pool (Background Micro-Task)
                    </div>
                    <div className={`text-xs font-mono ${bIsBaking ? 'text-white' : 'text-kingfisher-surface/40'}`}>
                      State: {bIsBaking ? '⚡ ACTIVE RE-BAKERS RUNNING' : '💤 SLEEPING (Wait on dirty-flag)'}
                    </div>
                    <div className="text-[10px]">
                      Task: Recalculate passive tree dependencies, resolve damage converters, write flattened coefficients.
                    </div>
                  </div>
                  <div className={`text-[9px] font-mono p-1 border tracking-wider font-extrabold uppercase rounded shrink-0 ${
                    bIsBaking 
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400 animate-pulse' 
                      : 'bg-black/40 border-transparent text-kingfisher-muted/30'
                  }`}>
                    {bIsBaking ? 'COMPILING' : 'STBY'}
                  </div>
                </div>
              </div>

              {/* Memory Array Visualization */}
              <div className="p-4 bg-kingfisher-dark/80 border border-kingfisher-border/40 rounded-xl space-y-2">
                <span className="text-[10.5px] font-bold text-white block">
                  Character Pre-allocated 'Mailbox' Array (Active Socket Registers)
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 font-mono text-center">
                  {[
                    { slot: 0, label: activeSupportGem.split(' ')[0], type: 'Support Gem' },
                    { slot: 1, label: activeWeapon.split(' ')[0], type: 'Weapon' },
                    { slot: 2, label: allocatedPassive.split(' ')[0], type: 'Passive Node' },
                    { slot: 3, label: 'null', type: 'Unused' },
                    { slot: 4, label: 'null', type: 'Unused' },
                    { slot: 5, label: 'null', type: 'Unused' },
                    { slot: 6, label: 'null', type: 'Unused' },
                    { slot: 7, label: 'null', type: 'Unused' },
                  ].map((mailbox, index) => {
                    const isFilled = mailbox.label !== 'null';
                    return (
                      <div 
                        key={mailbox.slot} 
                        className={`p-1.5 rounded border transition-all text-[10px] leading-tight ${
                          bIsBaking && index === 0
                            ? 'bg-blue-500/20 border-blue-400 text-white animate-pulse'
                            : isFilled 
                              ? 'bg-kingfisher-panel border-kingfisher-blue text-blue-200' 
                              : 'bg-black/35 border-transparent text-kingfisher-muted/40'
                        }`}
                      >
                        <div className="text-[8px] opacity-60">Box #{mailbox.slot}</div>
                        <div className="font-bold truncate mt-0.5">{mailbox.label}</div>
                        <div className="text-[7px] truncate opacity-50 uppercase mt-0.5">{mailbox.type}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between items-center text-[10px] text-kingfisher-muted pt-1">
                  <span>Incremental baked version: <strong>v{bakedVersion}</strong></span>
                  <span className="text-emerald-400 flex items-center gap-1 font-mono text-[9px] uppercase font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> GC-free hot reload achieved
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* SIMULATOR 3: SPARSE ENEMY ARCHETYPES vs HEAVY OOP ACTORS */}
      <SectionCard title="Simulator #3: Sparse Component Archetypes vs. Heavy Object-Oriented Actors" icon={Layers} color={COLORS.kingfisher.blue}>
        <div className="space-y-6">
          <p className="text-xs text-kingfisher-muted leading-relaxed">
            Spawning hundreds of enemies (like Witcher 3's swamp Drowners or PoE's skeleton armies) can melt your CPU. Under traditional Object-Oriented layouts, every skeleton represents a heavy, separate object (<code className="text-white font-bold">AActor</code> in Unreal, ~40KB+ memory footprint) with its own ticking behavior, transform pointers, and dynamic lists. This thrashes L1/L2 caches and causes massive memory bottlenecks.
            A <strong>Sparse Component Archetype model</strong> groups identical enemies into strict, read-only statistical templates. Spawned instances are tiny, microsecond-aligned structs holding only dynamic coefficients (health, 3D vectors).
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-black/25 p-5 rounded-2xl border border-kingfisher-border/50">
            {/* Left: Toggles and stats */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700] block">
                Simulation Scale & Actor Layout
              </span>

              {/* Slider for entity count */}
              <div className="space-y-2 select-none">
                <div className="flex justify-between text-xs text-white">
                  <span>Number of Spawned Skeletons:</span>
                  <span className="font-mono font-bold text-blue-400">{entityCount.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="250" 
                  max="10000" 
                  step="250" 
                  value={entityCount}
                  onChange={(e) => setEntityCount(Number(e.target.value))}
                  className="w-full h-1 bg-kingfisher-border rounded-lg appearance-none cursor-pointer focus:outline-none"
                />
                <div className="flex justify-between text-[9px] text-kingfisher-muted font-mono">
                  <span>250 Mobs (Dungeon)</span>
                  <span>10,000 Mobs (Juiced Arena)</span>
                </div>
              </div>

              {/* Toggle component */}
              <div className="space-y-1">
                <span className="text-[11px] text-white font-medium block">Character Class Model:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setModelType('oop_actor')}
                    className={`text-xs p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      modelType === 'oop_actor'
                        ? 'bg-rose-500/10 border-rose-500 text-white shadow-md'
                        : 'bg-black/30 border-transparent hover:bg-neutral-800 text-kingfisher-muted hover:text-white'
                    }`}
                  >
                    <span className="font-bold">Heavy OOP Actors</span>
                    <span className="text-[9px] opacity-70 mt-1">Epic's Default AActor ticks</span>
                  </button>
                  <button
                    onClick={() => setModelType('sparse_ecs')}
                    className={`text-xs p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      modelType === 'sparse_ecs'
                        ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-md'
                        : 'bg-black/30 border-transparent hover:bg-neutral-800 text-kingfisher-muted hover:text-white'
                    }`}
                  >
                    <span className="font-bold">Sparse Archetypes</span>
                    <span className="text-[9px] opacity-70 mt-1">Contiguous C++ ECS Slices</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Live Telemetry output */}
            <div className="lg:col-span-7 flex flex-col justify-between border-l border-kingfisher-border/30 pl-0 lg:pl-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffd700]">
                    Simulated CPU / Memory Metrics
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 font-extrabold uppercase">
                    {modelType === 'oop_actor' ? 'OOP Actor' : 'Sparse ECS'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* CPU Ticking Speed */}
                  <div className="p-3 bg-kingfisher-dark/60 rounded-xl border border-kingfisher-border/30">
                    <span className="text-kingfisher-muted text-[10px] block">CPU Game Thread Tick:</span>
                    <strong className={`font-mono text-xl block mt-1 ${
                      modelType === 'oop_actor' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {modelType === 'oop_actor' ? oopCpuTime.toFixed(2) : ecsCpuTime.toFixed(2)} ms
                    </strong>
                    <span className="text-[9px] text-kingfisher-muted/60 mt-0.5 block">
                      Time spent sorting, updating, & ticking
                    </span>
                  </div>

                  {/* System RAM Footprint */}
                  <div className="p-3 bg-kingfisher-dark/60 rounded-xl border border-kingfisher-border/30">
                    <span className="text-kingfisher-muted text-[10px] block">System Memory Footprint:</span>
                    <strong className={`font-mono text-xl block mt-1 ${
                      modelType === 'oop_actor' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {modelType === 'oop_actor' ? `${genericTotalOopMemory.toFixed(1)} MB` : `${genericTotalEcsMemory.toFixed(0)} KB`}
                    </strong>
                    <span className="text-[9px] text-kingfisher-muted/60 mt-0.5 block">
                      Allocated heap structure size
                    </span>
                  </div>

                  {/* Cache Miss Rate */}
                  <div className="p-3 bg-kingfisher-dark/60 rounded-xl border border-kingfisher-border/30">
                    <span className="text-kingfisher-muted text-[10px] block">L1 / L2 Cache Miss Rate:</span>
                    <strong className={`font-mono text-xl block mt-1 ${
                      modelType === 'oop_actor' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {modelType === 'oop_actor' ? `${oopCacheMissRate}%` : `${ecsCacheMissRate}%`}
                    </strong>
                    <span className="text-[9px] text-kingfisher-muted/60 mt-0.5 block">
                      Failed local CPU register sweeps
                    </span>
                  </div>

                  {/* GC Hitch Danger */}
                  <div className="p-3 bg-kingfisher-dark/60 rounded-xl border border-kingfisher-border/30">
                    <span className="text-kingfisher-muted text-[10px] block">Garbage Collector Hitch risk:</span>
                    <strong className={`font-mono text-xl block mt-1 ${
                      modelType === 'oop_actor' ? 'text-red-400 font-extrabold animate-pulse' : 'text-emerald-400 font-bold'
                    }`}>
                      {modelType === 'oop_actor' ? 'CRITICAL HIGH' : 'ZERO RISK'}
                    </strong>
                    <span className="text-[9px] text-kingfisher-muted/60 mt-0.5 block">
                      Sweep pause threat during gameplay
                    </span>
                  </div>
                </div>
              </div>

              {/* Graphic analysis box */}
              <div className="p-3 bg-black/40 rounded-xl border border-kingfisher-border/30 space-y-1.5 text-xs">
                {modelType === 'oop_actor' ? (
                  <p className="text-rose-200/90 leading-relaxed text-[11px]">
                    ⚠️ <strong>OOP Bottleneck:</strong> Spawning {entityCount} standard Actors registers {entityCount} individual Tick loops on the Game Thread. Pointer chasing causes the CPU to constantly halt and fetch variables from the slow System RAM (at ~100ns), leading to extreme thread congestion and stuttering frames.
                  </p>
                ) : (
                  <p className="text-emerald-100/90 leading-relaxed text-[11px]">
                    ✅ <strong>Sparse ECS Efficiency:</strong> Skeletons share a single read-only registry profile in L1/L2 cache. The CPU sweeps across perfectly uniform arrays of dynamic coordinates in a single continuous sweep using 100% vector memory math, preventing cache line misses completely.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* C++ PRODUCTION SKELETON CODE */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Code className="w-4 h-4 text-emerald-400" /> Production C++ Architectures: Fixed-Size Ring Buffer for Dynamic Ailment Allocations
        </span>
        <CodeBlock code={`// ABattleCharacter.h - Pre-allocated, zero-malloc ring buffer protecting CPU from GC hitches
#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "ABattleCharacter.generated.h"

// Define modular lightweight struct for the buff. No heavy UObjects or String variables.
struct FLightweightDebuff
{
    uint32 DebuffID = 0;   // FNV-1a Hashed ID of the curse (e.g. 0x8A3F21B2)
    float TimeRemaining = 0.0f;
    float Magnitude = 0.0f;
};

#define MAX_BUFF_SLOTS 64

UCLASS()
class GAME_API ABattleCharacter : public AActor
{
    GENERATED_BODY()

private:
    // Pre-allocate EXACTLY 64 slots in memory at initialization.
    // Resident in character's memory footprint. No resizing, zero heap allocations mid-combat.
    TStaticArray<FLightweightDebuff, MAX_BUFF_SLOTS> ActiveDebuffs;
    
    // Circular Ring Buffer pointer to overwrite oldest if we overflow the 64 slots bounds
    int32 OldestSlotIndex = 0;

public:
    void ApplyNewDebuff(uint32 NewID, float Duration, float Power)
    {
        // Step A: Scan matching slots to see if we already have this active debuff (Refresh state)
        for (int32 i = 0; i < MAX_BUFF_SLOTS; ++i)
        {
            if (ActiveDebuffs[i].DebuffID == NewID)
            {
                ActiveDebuffs[i].TimeRemaining = Duration; // Reset duration timer
                ActiveDebuffs[i].Magnitude = Power;       // Update magnitude scale
                return;
            }
        }

        // Step B: Look for a completely empty (null/zero) slot in the static array
        for (int32 i = 0; i < MAX_BUFF_SLOTS; ++i)
        {
            if (ActiveDebuffs[i].DebuffID == 0) // 0 implies unused slot
            {
                ActiveDebuffs[i].DebuffID = NewID;
                ActiveDebuffs[i].TimeRemaining = Duration;
                ActiveDebuffs[i].Magnitude = Power;
                return;
            }
        }

        // Step C: EMERGENCY OVERFLOW HOOK (Hit the 65th buff ceiling)
        // All pre-allocated slots are saturated. Overwrite oldest slot index to protect performance from expanding!
        ActiveDebuffs[OldestSlotIndex].DebuffID = NewID;
        ActiveDebuffs[OldestSlotIndex].TimeRemaining = Duration;
        ActiveDebuffs[OldestSlotIndex].Magnitude = Power;

        // Advance circular index
        OldestSlotIndex = (OldestSlotIndex + 1) % MAX_BUFF_SLOTS;
    }
};`} />
      </div>
    </div>
  );
};
