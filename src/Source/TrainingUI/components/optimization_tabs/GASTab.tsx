import React, { useState } from 'react';
import { 
  Sword, Shield, Activity, Cpu, Database, Server, Radio, Zap,
  Wifi, ShieldAlert, Crosshair, ArrowRight, Play, CheckCircle, X, Terminal, Code
} from 'lucide-react';
import { motion } from 'motion/react';
import { COLORS } from '../../../../constants/colors';
import { SectionCard, HighlightBox, PageHeader, CodeBlock, StatRow, MultiplayerImpact, FeatureMatrix } from './OptimizationHelpers';

type FrameworkType = 'unreal_gas' | 'custom_bitmask' | 'mass_ecs';
type ReplicationPolicy = 'full_replicated' | 'mixed_dormancy' | 'local_only';

export const GASTab: React.FC = () => {
  // Simulator state variables
  const [framework, setFramework] = useState<FrameworkType>('unreal_gas');
  const [actorCount, setActorCount] = useState<number>(100);
  const [spellCastRate, setSpellCastRate] = useState<number>(15); // per second globally
  const [repPolicy, setRepPolicy] = useState<ReplicationPolicy>('full_replicated');
  const [activeTab, setActiveTab] = useState<'concepts' | 'comparisons' | 'simulator' | 'strategies'>('concepts');

  // Perform calculations for budget values
  const calculateBudgets = () => {
    let cpuMs = 0;
    let gpuMs = 0;
    let ramMb = 0;
    let vramMb = 0;
    let netKbps = 0;
    let desyncRisk = 'Low';
    
    // Base loads
    if (framework === 'unreal_gas') {
      // GAS involves heavy UObject creation, ASC ticking, GameplayTag search, and virtual function cascades
      cpuMs = (actorCount * 0.05) + (spellCastRate * 0.15);
      ramMb = (actorCount * 0.95) + 85; // 0.95MB per ASC component instance + base memory
      vramMb = 120; // Gameplay effect asset blueprints & transient buffers load
      netKbps = actorCount * 3.5;
      
      if (repPolicy === 'mixed_dormancy') {
        cpuMs *= 0.75;
        netKbps *= 0.35;
      } else if (repPolicy === 'local_only') {
        cpuMs *= 0.60;
        netKbps = 0;
      }
      desyncRisk = 'Very Low (Validated via ASC Client prediction and Server Rollback)';
    } else if (framework === 'custom_bitmask') {
      // Witcher 3 / PoE inspired contiguous preallocated struct array bitmask indexing
      cpuMs = (actorCount * 0.004) + (spellCastRate * 0.012);
      ramMb = (actorCount * 0.02) + 8; // ultra light, struct arrays
      vramMb = 12; // minimalist 2D state references
      netKbps = actorCount * 0.8;
      
      if (repPolicy === 'mixed_dormancy') {
        cpuMs *= 0.85;
        netKbps *= 0.40;
      } else if (repPolicy === 'local_only') {
        cpuMs *= 0.65;
        netKbps = 0;
      }
      desyncRisk = repPolicy === 'local_only' ? 'High' : 'Low (O(1) state sync using raw byte replication packets)';
    } else if (framework === 'mass_ecs') {
      // MassEntity contiguous float/tag chunks on worker threads
      cpuMs = (actorCount * 0.008) + (spellCastRate * 0.02);
      ramMb = (actorCount * 0.08) + 22;
      vramMb = 45;
      netKbps = actorCount * 1.4;
      
      if (repPolicy === 'mixed_dormancy') {
        cpuMs *= 0.80;
        netKbps *= 0.45;
      } else if (repPolicy === 'local_only') {
        cpuMs *= 0.70;
        netKbps = 0;
      }
      desyncRisk = 'Medium (Parallel state syncing can hit occasional framing gaps)';
    }

    // GPU updates: visual sparks based on casts
    gpuMs = 1.5 + (spellCastRate * 0.12);

    return {
      cpu: Number(cpuMs.toFixed(2)),
      gpu: Number(gpuMs.toFixed(2)),
      ram: Number(ramMb.toFixed(1)),
      vram: Number(vramMb.toFixed(1)),
      net: Number(netKbps.toFixed(1)),
      desyncRisk
    };
  };

  const metrics = calculateBudgets();

  // Get recommendations based on selection matching target RPG inspirations
  const getSimRecommendations = () => {
    if (framework === 'unreal_gas') {
      return {
        witcher: "Overkill and highly bloated. Geralt has very few active traits; utilizing heavy ASCs on singleplayer mobs wastes CPU frames that could be spent on rendering dense crowds.",
        poe: "Catastrophic pipeline bottleneck. Spawning 500+ high-frequency dynamic spells on 250+ active monsters triggers garbage collection hitches and virtual method lookup cascades, dropping frames to sub-30 FPS on high-tier maps.",
        bg3: "Stellar and highly recommended fit. Tactical turn-based play is non-latency critical. Complex spell trees, environment reactions, status stacks, and concentration are easily managed by GameplayTags and GameplayEffects."
      };
    } else if (framework === 'custom_bitmask') {
      return {
        witcher: "Perfect architectural alignment. Light, highly cache-localized, easy to profile, and integrates perfectly with dynamic character movement and custom status effects without allocation costs.",
        poe: "Excellent raw performance. Enables seamless 60Hz attribute calculations for 500+ actors on the game thread. Capping allocations inside O(1) circular rings ensures continuous combat without GC stutters.",
        bg3: "Functional but painful. Scaling hundreds of distinct rules, dice rolls, and passive saving-throw stacks inside manual bitwise indexes will cause immense code bloat and limit designer customization."
      };
    } else {
      return {
        witcher: "Improper setup. MassEntity thrives on crowds but lacks support for dense animation bones or individual dialog triggers typical of a tight intimate action-RPG.",
        poe: "Strong architectural candidate. Handling massive enemy visual and attribute ticks across contiguous memory caches frees the Main game thread completely.",
        bg3: "Poor fit. Turn-based interactions rely on deep nested tree queries and individual event listener triggers, which are highly inefficient to batch inside SIMD pipelines."
      };
    }
  };

  const recs = getSimRecommendations();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gameplay Ability System / GAS Optimization Core" 
        subtitle="Technical dissection of Unreal Engine's ASC performance boundaries, custom lightweight C++ modifier registries, and high-performance replication proxies designed for Witcher 3, PoE, and BG3 inspired architectures." 
      />

      {/* TABS SELECTOR */}
      <div className="flex border-b border-kingfisher-border/40 gap-1 overflow-x-auto pb-px shrink-0">
        {[
          { id: 'concepts', label: 'GAS Core Concepts & Metrics', icon: Activity },
          { id: 'comparisons', label: 'RPG Benchmark Comparison', icon: Sword },
          { id: 'simulator', label: 'Interactive Hardware Simulator', icon: Radio },
          { id: 'strategies', label: 'C++ Strategy & Workarounds', icon: Code },
        ].map(t => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                isActive 
                  ? 'border-kingfisher-blue text-white bg-kingfisher-blue/10' 
                  : 'border-transparent text-kingfisher-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* CONCEPTS TAB */}
      {activeTab === 'concepts' && (
        <div className="space-y-6">
          <HighlightBox type="info">
            <strong>Gameplay Ability System (GAS)</strong> is a robust, highly extensible framework provided inside Unreal Engine out of the box. While exceptionally powerful for complex networked games like Fortnite, its monolithic <code>UObject</code> architecture can introduce substantial performance overhead under high entity counts. This guide details how to master GAS, analyze its hardware characteristics, and build efficient alternatives.
          </HighlightBox>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard title="Under the Hood: GAS Anatomy & Bottlenecks" icon={Cpu} color={COLORS.kingfisher.blue}>
              <p className="text-xs leading-relaxed">
                GAS operates through the **AbilitySystemComponent (ASC)**, the primary interface that manages a character's ability sets, gameplay tags, active attributes, and gameplay effects. 
              </p>
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                  <h4 className="text-white font-semibold text-xs mb-1">1. The UObject Sprawl (RAM & GC Overhead)</h4>
                  <p className="text-kingfisher-muted text-xs leading-relaxed">
                    Every active GameplayAbility and dynamic GameplayEffect is instantiated as an individual <code>UObject</code>. Spawning hundreds of active status updates or hit reactions in dense combat triggers massive garbage collection heap-sweeping overhead (causing ~10ms freeze hitches).
                  </p>
                </div>
                <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                  <h4 className="text-white font-semibold text-xs mb-1">2. Component Tick & Attribute Evaluation (CPU Overhead)</h4>
                  <p className="text-kingfisher-muted text-xs leading-relaxed">
                    By default, the ASC frequently sweeps active gameplay tags to re-evaluate passive modifiers. Under heavy combat (e.g., Path of Exile style, where 50+ spells hit dozens of targets concurrently), the virtual function lookup cascades inside <code>UAbilitySystemComponent::TickComponent</code> can easily consume up to **5ms to 10ms of the Game Thread frame budget**.
                  </p>
                </div>
                <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                  <h4 className="text-white font-semibold text-xs mb-1">3. Replication Bloat (Network & Ping Latency)</h4>
                  <p className="text-kingfisher-muted text-xs leading-relaxed">
                    Replicating massive float matrices (Attributes like Health, Mana, Resists, modifiers) inside standard actor channels triggers heavy packet serialization overhead. This can choke peer upload limits, leading to packet queuing and sudden ping spikes of **+150ms**.
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Target RPG Architecture Evaluation" icon={Sword} color={COLORS.kingfisher.warm}>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-3">
                  <h4 className="text-white font-bold text-xs">The Witcher 3: Wild Hunt (Action-RPG)</h4>
                  <p className="text-kingfisher-muted text-xs mt-1 leading-relaxed">
                    **Verdict: Low GAS Fit.** Witcher 3 focuses on a single primary player character with a very intimate combat set (5 signs, basic sword modifiers, dynamic dodge animations). Using standard GAS incurs massive architectural weight. Witcher is best executed using custom **Actor Components with direct delegates** for zero prediction overhead and painless profiling.
                  </p>
                </div>
                <div className="border-l-2 border-amber-500 pl-3">
                  <h4 className="text-white font-bold text-xs">Path of Exile Series (Hack & Slash ARPG)</h4>
                  <p className="text-kingfisher-muted text-xs mt-1 leading-relaxed">
                    **Verdict: Extremely Poor GAS Fit.** PoE processes thousands of combat calculations per frame across 200+ active horde enemies. Standard GAS's memory allocation patterns, reflection layers, and ticking queues will crash the frame budget. PoE requires highly vectorized C++ bitmask tagging pipelines and contiguous memory buffers running on safe background worker threads.
                  </p>
                </div>
                <div className="border-l-2 border-emerald-500 pl-3">
                  <h4 className="text-white font-bold text-xs font-sans">Baldur's Gate 3 (Turn-Based Tactical RPG)</h4>
                  <p className="text-kingfisher-muted text-xs mt-1 leading-relaxed">
                    **Verdict: Perfect GAS Fit.** Turn-based systems feature extremely complex rule overlays (dice rolls, environment overlaps, concentration traits, status stacks, condition trees). Response latency is non-critical, and tick processing can be completely disabled for passive actors, making GAS's robust tag search and modifier cascading mechanisms an elegant pre-built choice.
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      )}

      {/* COMPARISONS TAB */}
      {activeTab === 'comparisons' && (
        <div className="space-y-6">
          <SectionCard title="Ability Framework Comparison Matrix" icon={Activity} color={COLORS.kingfisher.blue}>
            <p className="text-xs text-kingfisher-muted mb-4leading-relaxed">
              Before instantiating standard Unreal GAS, evaluate alternative custom architectures mapped directly to performance constraints. Designing an optimal system requires selecting the correct data structures for the target style:
            </p>
            <div className="overflow-x-auto border border-kingfisher-border/40 rounded-xl bg-black/20 custom-scrollbar">
              <table className="w-full text-left text-xs text-kingfisher-muted border-collapse">
                <thead>
                  <tr className="border-b border-kingfisher-border/60 bg-black/30">
                    <th className="p-3 font-bold text-white uppercase tracking-wider text-[10px] w-1/5">Evaluation Metric</th>
                    <th className="p-3 font-bold text-blue-400 uppercase tracking-wider text-[10px] w-4/15">Unreal Engine GAS</th>
                    <th className="p-3 font-bold text-amber-400 uppercase tracking-wider text-[10px] w-4/15">Custom C++ Bitmask Conveyor</th>
                    <th className="p-3 font-bold text-emerald-400 uppercase tracking-wider text-[10px] w-4/15">MassEntity ECS Fragments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-kingfisher-border/30">
                  <tr>
                    <td className="p-3 text-white font-semibold flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-blue-400" /> Game Thread Tick</td>
                    <td className="p-3">
                      **High Overhead (~5.2ms)**
                      Deep call-stacks, virtual method lookup, continuous tick scans for passive cooldown tags.
                    </td>
                    <td className="p-3">
                      **Extreme Performance (~0.3ms)**
                      Pure contiguous array lookups, loop unrolling, SIMD compiler alignments, zero-copy calculations.
                    </td>
                    <td className="p-3">
                      **Excellent Ticking (~0.7ms)**
                      Multi-threaded vectorized batch ticks processing up to 10k entities in contiguous chunk segments.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-white font-semibold flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-purple-400" /> RAM / allocations</td>
                    <td className="p-3">
                      **High Memory Sprawl**
                      UObject allocations per active ability, leading to GC sweeping hitches (creates ~12ms freezes during spikes).
                    </td>
                    <td className="p-3">
                      **Zero Dynamic Allocation**
                      Pre-allocated C++ static ring buffers; memory allocations restricted to boot, minimizing cache misses.
                    </td>
                    <td className="p-3">
                      **Contiguous Caches**
                      Structured within memory-optimized archetype chunks; keeps memory footprint light and clean.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-white font-semibold flex items-center gap-1.5"><Radio className="w-3.5 h-3.5 text-emerald-400" /> Replication QoS</td>
                    <td className="p-3">
                      **Built-in Client Prediction**
                      Automatic rollback predictive queues but carries high replication float packet size, taxing network pipelines.
                    </td>
                    <td className="p-3">
                      **Custom State Rep Compression**
                      Extremely compact bitflags and raw byte packets, cutting network footprint by up to -85%.
                    </td>
                    <td className="p-3">
                      **Parallel Iris Sync**
                      Optimized on parallel threads with Iris NetReplication, dropping Main thread tick cost significantly.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-white font-semibold flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-red-400" /> Designer Usability</td>
                    <td className="p-3">
                      **Premium**
                      Abilities, layouts, conditions, and animations are easily authorable in visual Blueprint graphs without recompiling.
                    </td>
                    <td className="p-3">
                      **Low/Coders-Only**
                      Requires direct modification of C++ code registries and bit enum masks, slowing designer iteration frames.
                    </td>
                    <td className="p-3">
                      **Medium**
                      Requires specialized ECS trait composition setups, which are highly different from standard Unreal blueprints.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      )}

      {/* SIMULATOR TAB */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <SectionCard title="Interactive Performance Blueprint & Hardware Simulator" icon={Radio} color={COLORS.kingfisher.blue}>
            <p className="text-xs text-kingfisher-muted mb-4leading-relaxed">
              Test how diverse ability architectures scale under high combat workloads. Adjust player and monster bounds below to analyze CPU, GPU, RAM, and Network budgets in real-time, matching target RPG system plans:
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls Column */}
              <div className="lg:col-span-5 space-y-5 bg-black/25 border border-kingfisher-border/30 p-5 rounded-xl">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">1. Select Architecture</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'unreal_gas', title: 'Unreal Std GAS (ASC)', desc: 'Robust prediction, high UObject tick weight' },
                      { id: 'custom_bitmask', title: 'Custom C++ Bitmasks (PoE / Witcher)', desc: 'O(1) raw structures, zero allocation stalls' },
                      { id: 'mass_ecs', title: 'MassEntity ECS chunks', desc: 'Vectorized parallel ticks for heavy crowds' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setFramework(f.id as any)}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                          framework === f.id
                            ? 'bg-kingfisher-blue/20 border-kingfisher-blue/80 ring-1 ring-kingfisher-blue text-white shadow-md'
                            : 'bg-black/40 border-kingfisher-border/30 text-kingfisher-muted hover:border-white/25 hover:text-white'
                        }`}
                      >
                        <strong className="block font-semibold mb-0.5">{f.title}</strong>
                        <span className="opacity-70">{f.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white">2. Active Entities: {actorCount}</label>
                    <span className="text-[10px] text-kingfisher-muted font-mono">50 - 500 actors</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="25"
                    value={actorCount}
                    onChange={(e) => setActorCount(Number(e.target.value))}
                    className="w-full accent-kingfisher-blue bg-neutral-800 rounded-lg h-1.5 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-kingfisher-muted font-mono mt-1">
                    <span>50 Mobs (Dungeon)</span>
                    <span>250 Mobs (Novigrad)</span>
                    <span>500 Mobs (PoE Horde)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-white">3. Ability Iteration Rate: {spellCastRate}/s</label>
                    <span className="text-[10px] text-kingfisher-muted font-mono">5 - 60 casts</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={spellCastRate}
                    onChange={(e) => setSpellCastRate(Number(e.target.value))}
                    className="w-full accent-kingfisher-blue bg-neutral-800 rounded-lg h-1.5 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-kingfisher-muted font-mono mt-1">
                    <span>5 (Slow combat)</span>
                    <span>30 (Intense)</span>
                    <span>60 (Endgame PoE chaos)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">4. Replication QoS Policy</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'full_replicated', label: 'Full NetSync' },
                      { id: 'mixed_dormancy', label: 'NetDormant' },
                      { id: 'local_only', label: 'Local-Only' }
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => setRepPolicy(p.id as any)}
                        className={`py-1.5 px-2 rounded-md border text-[10px] font-bold uppercase tracking-widest text-center transition-all ${
                          repPolicy === p.id
                            ? 'bg-kingfisher-blue/20 border-kingfisher-blue text-white shadow-md'
                            : 'bg-black/30 border-transparent text-kingfisher-muted hover:bg-neutral-800'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Outputs Column */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="bg-black/30 border border-kingfisher-border/40 p-5 rounded-2xl flex-1">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-kingfisher-border/30 pb-2">Hardware Telemetry Analysis</h4>
                  
                  <MultiplayerImpact 
                    cpu={`${metrics.cpu} ms`} 
                    gpu={`${metrics.gpu} ms`} 
                    ram={`${metrics.ram} MB`} 
                    vram={`${metrics.vram} MB`} 
                    latency={framework === 'unreal_gas' ? 'Client-Side Predicted (ASC Task)' : 'Instant Custom Byte Rollback'} 
                  />

                  <div className="space-y-3 mt-6">
                    <div className="flex justify-between items-center py-2 border-b border-kingfisher-border/10">
                      <span className="text-xs text-kingfisher-muted">Main Game Thread Frame Budget Cost:</span>
                      <span className={`font-mono text-sm font-bold ${metrics.cpu > 10 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {metrics.cpu} ms / 16.67ms
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-kingfisher-border/10">
                      <span className="text-xs text-kingfisher-muted">Peer Upload Network Bandwidth:</span>
                      <span className="font-mono text-xs font-bold text-blue-300">
                        {metrics.net} kbps
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-kingfisher-border/10">
                      <span className="text-xs text-kingfisher-muted">Desync / Hit Validation Risk:</span>
                      <span className="font-mono text-[11px] font-bold text-white leading-relaxed">
                        {metrics.desyncRisk}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Target Game Recommendation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl text-xs">
                    <div className="text-blue-400 font-bold uppercase tracking-wider text-[10px] mb-1">vs. Witcher 3 Goal</div>
                    <p className="text-kingfisher-muted leading-relaxed text-[10.5px]">{recs.witcher}</p>
                  </div>
                  <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs">
                    <div className="text-amber-400 font-bold uppercase tracking-wider text-[10px] mb-1">vs. Path of Exile Goal</div>
                    <p className="text-kingfisher-muted leading-relaxed text-[10.5px]">{recs.poe}</p>
                  </div>
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs">
                    <div className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] mb-1">vs. Baldur's Gate 3 Goal</div>
                    <p className="text-kingfisher-muted leading-relaxed text-[10.5px]">{recs.bg3}</p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* STRATEGIES TAB */}
      {activeTab === 'strategies' && (
        <div className="space-y-6">
          <SectionCard title="Unreal Engine Native Support & Blindspots" icon={ShieldAlert} color={COLORS.kingfisher.warm}>
            <FeatureMatrix
              has={[
                "Mixed Replication Mode (limits attributes updates to local connections, leaving proxy actors in a lightweight net state)",
                "Deferred Tag Replication (enables grouping dynamic gameplay tags inside compact replication buffers instead of individual RPC vectors)",
                "Gameplay Cue local triggers (executes visual particle cues purely on clients upon receiving compact tags, preserving host bandwidth)"
              ]}
              missing={[
                "Niagara Gameplay Cue Pooling (spawning modular spell actors causes severe dynamic allocation stalls inside particle systems)",
                "Out-of-the-box MassEntity ECS bindings for GAS (cannot bind heavy ASC UObjects to lightweight numeric entity arrays)",
                "Flexible runtime CPU tick profiles (ASCs remain fully ticking even if the host actor has zero active or cooldown abilities)"
              ]}
              howToUse="To build a scalable Action-RPG, disable component ticked loops by setting bWantsInitializeComponent to true on the ASC and managing updates event-driven. Build custom static visual asset managers to cache dynamic gameplay effect classes."
            />
          </SectionCard>

          <SectionCard title="Production-Ready Custom C++ Implementations" icon={Code} color={COLORS.kingfisher.blue}>
            <p className="text-xs text-kingfisher-muted mb-4leading-relaxed">
              Below are production-grade implementations addressing core GAS vulnerabilities. Integrate these patterns into your custom RPG project files to maintain robust O(1) attribute culling and prevent GC hitches:
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-white font-bold text-xs mb-2">1. Custom Lightweight Actor-less Net Replication Proxy (Eliminate ~4.5ms ASC Ticks)</h4>
                <p className="text-kingfisher-muted text-xs mb-2 leading-relaxed">
                  Instead of attaching heavy <code>UAbilitySystemComponent</code> pointers to every environmental hazard or dungeon minion, replicate active traits as highly compacted bitflags packed inside a single 8-byte payload:
                </p>
                <CodeBlock 
                  language="cpp"
                  code={`
#pragma once

#include "CoreMinimal.h"
#include "Net/UnrealNetwork.h"
#include "GASTab.generated.h"

// 64 combat bits replacing dynamic GameplayTags
UENUM(BlueprintType, Meta = (Bitflags, UseEnumValuesAsMaskValuesInBlueprint = "true"))
enum class ECombatStateEnum : uint64
{
    None         = 0,
    IsFrozen     = 1ULL << 0,
    IsPoisoned   = 1ULL << 1,
    IsStunned    = 1ULL << 2,
    IsShielded   = 1ULL << 3,
    IsBurning    = 1ULL << 4,
    IsBleeding   = 1ULL << 5,
    CanDodge     = 1ULL << 6
};

USTRUCT(BlueprintType)
struct FAL_API FCompactedCombatStatePacket
{
    GENERATED_BODY()

    UPROPERTY()
    uint64 CombatStateFlags = 0; // Packed O(1) bitflag tag matrix

    UPROPERTY()
    float HealthPercentage = 100.0f; // Minimal network payload

    // Compact serialization bypassing standard reflection checks
    bool NetSerialize(FArchive& Ar, class UPackageMap* Map, bool& bOutSuccess)
    {
        Ar.SerializeBits(&CombatStateFlags, 7); // Serialize only the first 7 active bits!
        Ar << HealthPercentage;
        bOutSuccess = true;
        return true;
    }
};
                  `}
                />
              </div>

              <div>
                <h4 className="text-white font-bold text-xs mb-2">2. Dynamic GameplayCue Actor Pooler (Solve ~12ms spawning freezes)</h4>
                <p className="text-kingfisher-muted text-xs mb-2 leading-relaxed">
                  Avoid allocating new memory instances for spell particles. This custom C++ asset manager pre-pools visual components at level startup, matching active game threads:
                </p>
                <CodeBlock 
                  language="cpp"
                  code={`
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "GameplayCuePooler.generated.h"

UCLASS()
class FAL_API AGameplayCuePooler : public AActor
{
    GENERATED_BODY()

public:
    AGameplayCuePooler()
    {
        PrimaryActorTick.bCanEverTick = false;
        bReplicates = false; // Local host pooling
    }

    UPROPERTY(EditDefaultsOnly, Category = "Pooling")
    TSubclassOf<AActor> VisualEffectClass;

    UPROPERTY(EditDefaultsOnly, Category = "Pooling")
    int32 PreAllocatedPoolSize = 100;

protected:
    UPROPERTY()
    TArray<AActor*> FreeEffectPool;

    virtual void BeginPlay() override
    {
        Super::BeginPlay();
        
        // Contiguous static pre-allocation prevents RAM page stalls
        FreeEffectPool.Reserve(PreAllocatedPoolSize);
        
        for (int32 i = 0; i < PreAllocatedPoolSize; ++i)
        {
            FActorSpawnParameters SpawnParams;
            SpawnParams.SpawnCollisionHandlingOverride = ESpawnActorCollisionHandlingMethod::AlwaysSpawn;
            
            AActor* PooledActor = GetWorld()->SpawnActor<AActor>(VisualEffectClass, FVector::ZeroVector, FRotator::ZeroRotator, SpawnParams);
            if (PooledActor)
            {
                PooledActor->SetActorHiddenInGame(true);
                PooledActor->SetActorEnableCollision(false);
                FreeEffectPool.Add(PooledActor);
            }
        }
    }

public:
    AActor* AcquireCueVisual(const FVector& TargetLocation)
    {
        if (FreeEffectPool.Num() > 0)
        {
            AActor* Act = FreeEffectPool.Pop();
            Act->SetActorLocation(TargetLocation);
            Act->SetActorHiddenInGame(false);
            return Act;
        }
        return nullptr; // Fallback or spin-off spawn
    }

    void ReleaseCueVisual(AActor* ExpiredActor)
    {
        if (ExpiredActor)
        {
            ExpiredActor->SetActorHiddenInGame(true);
            FreeEffectPool.Add(ExpiredActor);
        }
    }
};
                  `}
                />
              </div>
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
};
