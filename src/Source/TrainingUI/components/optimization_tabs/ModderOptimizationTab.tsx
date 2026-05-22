import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, X, Shield, Cpu, Database, Settings, Zap, ArrowRight,
  RefreshCw, Layers, Sparkles, HardDrive, Trash2, Box, Code, Play, 
  Activity, Radio, Shuffle, Users, Layers3, Flame, Sword, Search, HelpCircle
} from 'lucide-react';
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
  // --- STATE FOR SECTION TRANSITIONS ---
  const [activeTabSection, setActiveTabSection] = useState<'hashing' | 'rebaking' | 'combat' | 'ringbuffer' | 'archetypes'>('hashing');

  useEffect(() => {
    const target = (window as any).__scrollTarget;
    if (target) {
      if (target === 'poe-combat-pipeline') {
        setActiveTabSection('combat');
      } else if (target === 'circular-buffers') {
        setActiveTabSection('ringbuffer');
      } else if (target === 'hashing-visualizer') {
        setActiveTabSection('hashing');
      } else if (target === 'archetype-comparison') {
        setActiveTabSection('archetypes');
      }
    }
  }, []);

  // --- SIMULATOR 1: STRING HASHING ---
  const [hashInput, setHashInput] = useState('Rebels');
  const activeHash = fnv1a(hashInput);
  const standardStringCompareCost = hashInput.length * 4.2; // simulated nanoseconds
  const hashedIntCompareCost = 0.4; // simulated nanoseconds

  // --- SIMULATOR 2: RE-BAKING AND DIRTY FLAGGING ---
  const [activeSupportGem, setActiveSupportGem] = useState('Added Fire Damage');
  const [activeWeapon, setActiveWeapon] = useState('Flame Blade');
  const [allocatedPassive, setAllocatedPassive] = useState('Pyromaniac (+10% Fire Damage)');
  
  const [bIsDirty, setBIsDirty] = useState(false);
  const [bIsBaking, setBIsBaking] = useState(false);
  const [bakedVersion, setBakedVersion] = useState(1);
  const [recalculatingThread, setRecalculatingThread] = useState<string | null>(null);
  const [bakeType, setBakeType] = useState<'micro' | 'full'>('micro');

  const triggerReBake = (actionType: 'micro' | 'full') => {
    if (bIsBaking) return;
    setBIsDirty(true);
    setBIsBaking(true);
    setBakeType(actionType);
    setRecalculatingThread('Worker Thread Pool (Async Task)');
    
    // Simulate compilation delay: micro-bakes are incredibly fast (~50us in engine, simulated 500ms for UI)
    const delay = actionType === 'micro' ? 450 : 1200;
    setTimeout(() => {
      setBakedVersion(prev => prev + 1);
      setBIsDirty(false);
      setBIsBaking(false);
      setRecalculatingThread(null);
    }, delay);
  };

  // --- SIMULATOR 3: SPARSE ENEMY ARCHETYPES ---
  const [entityCount, setEntityCount] = useState(2500);
  const [modelType, setModelType] = useState<'oop_actor' | 'sparse_ecs'>('sparse_ecs');
  const oopMemoryPerEntity = 42 * 1024; // 42KB per Actor
  const ecsMemoryPerEntity = 32; // 32 bytes per instance
  const genericTotalOopMemory = (entityCount * oopMemoryPerEntity) / (1024 * 1024); // MB
  const genericTotalEcsMemory = (entityCount * ecsMemoryPerEntity) / 1024; // KB
  
  const oopCacheMissRate = 72; // %
  const ecsCacheMissRate = 1.2; // %
  const oopCpuTime = 4.2 + (entityCount * 0.0036); // ms
  const ecsCpuTime = 0.15 + (entityCount * 0.00012); // ms

  // --- SIMULATOR 4: PoE COMBAT PIPELINE & BITMASK FILTER ---
  const [isAttackBit, setIsAttackBit] = useState(true);
  const [isSpellBit, setIsSpellBit] = useState(false);
  const [isCritBit, setIsCritBit] = useState(true);
  const [isFireBit, setIsFireBit] = useState(true);
  const [isChaosBit, setIsChaosBit] = useState(false);

  // Selected gear that changes the math / rules
  const [eqShavronnes, setEqShavronnes] = useState(false);
  const [eqTrypanon, setEqTrypanon] = useState(true);
  const [eqMjolnir, setEqMjolnir] = useState(false);

  const [combatConsole, setCombatConsole] = useState<string[]>([
    'Combat resolution subsystem initialized. Awaiting attack registers...'
  ]);
  const [pipelineStage, setPipelineStage] = useState<number>(-1);
  const [isProcessingHit, setIsProcessingHit] = useState(false);

  const testAttackDNA = () => {
    if (isProcessingHit) return;
    setIsProcessingHit(true);
    setPipelineStage(0);
    setCombatConsole([]);

    const log = (msg: string) => {
      setCombatConsole(prev => [...prev, msg]);
    };

    // Calculate binary tag passport
    let bitmask = 0;
    if (isAttackBit) bitmask |= (1 << 0);
    if (isSpellBit) bitmask |= (1 << 1);
    if (isCritBit || eqTrypanon) bitmask |= (1 << 2); // Trypanon forces crits
    if (isFireBit) bitmask |= (1 << 3);
    if (isChaosBit) bitmask |= (1 << 4);

    const binaryRep = bitmask.toString(2).padStart(8, '0');
    log(`[INIT] Packet created. Tags Bitmask: 0b${binaryRep} (0x${bitmask.toString(16).toUpperCase()})`);

    const runStage = (stage: number) => {
      setPipelineStage(stage);
      
      switch(stage) {
        case 0:
          log(`[Stage 1/6: Accuracy] Checking evaders. Bitwise bit comparison with target. Result: hits connected natively. (< 0.1 ns)`);
          setTimeout(() => runStage(1), 400);
          break;
        case 1:
          if (eqTrypanon) {
            log(`[Stage 2/6: Crit Roll] UNIQUE MODIFIER TRIGGER! Trypanon Mace (Stat ID 1120) active. Override crit calculation. CRITICAL STRIKE GUARANTEED! (< 0.2 ns)`);
          } else {
            const hasCrit = (bitmask & (1 << 2)) !== 0;
            log(`[Stage 2/6: Crit Roll] Check bit index 2. Result: ${hasCrit ? 'CRITICAL HIT!' : 'Normal hit'} (${hasCrit ? '< 0.1 ns' : '< 0.1 ns'})`);
          }
          setTimeout(() => runStage(2), 400);
          break;
        case 2:
          let baseDamage = 150;
          log(`[Stage 3/6: Base Damage] Compiling base multipliers. Weapon base physical damage = ${baseDamage}. Applying tag vectors...`);
          setTimeout(() => runStage(3), 400);
          break;
        case 3:
          log(`[Stage 4/6: Mitigation] Applying enemy resistance matrices. Checking elements tags...`);
          setTimeout(() => runStage(4), 400);
          break;
        case 4:
          const isFire = (bitmask & (1 << 3)) !== 0;
          if (isFire) {
            log(`[Stage 5/6: Ailment] Fire tag active (Bit index 3). Spawning Ignite debuff slot on target, resetting timer. (< 0.1 ns)`);
          } else {
            log(`[Stage 5/6: Ailment] No element tags triggered. Slid past ailment registries natively.`);
          }
          setTimeout(() => runStage(5), 400);
          break;
        case 5:
          log(`[Stage 6/6: On-Hit Hooks] Checking Unique Modification Registry...`);
          let extraLog = '';
          if (eqShavronnes && isChaosBit) {
            extraLog += ` | Shavronne's Wrappings (Stat ID 5231) active: Chaos damage bypassing energy shield is BLOCKED !`;
          }
          if (eqMjolnir && (eqTrypanon || isCritBit)) {
            extraLog += ` | Mjölnir Hammer (Stat ID 9820) active: Critical strike triggered lightning multicast spell cast in background thread!`;
          }
          log(`[On-Hit] Sweep composite list.${extraLog ? extraLog : ' No rule changers in pipeline slot.'} Pipeline terminated. Handing final payload to health register. (< 0.4 ns total evaluation cost)`);
          setIsProcessingHit(false);
          setPipelineStage(-1);
          break;
      }
    };

    setTimeout(() => runStage(0), 200);
  };

  // --- SIMULATOR 5: FIXED-SIZE RING BUFFER & OVERFLOW ---
  const [activeDebuffs, setActiveDebuffs] = useState<Array<{ id: number; name: string; rem: number; mag: number }>>([
    { id: 0x9a3f21, name: 'Ignite', rem: 4.8, mag: 120.5 },
    { id: 0x2b4c8d, name: 'Vulnerability', rem: 12.0, mag: 1.15 },
    { id: 0x1f4c3a, name: 'Shock', rem: 2.1, mag: 15.0 },
  ]);
  const [overflowPointer, setOverflowPointer] = useState<number>(3);
  const [ringConsole, setRingConsole] = useState<string[]>(['Static Array buffer registered at memory address offset 0x00F3A2B0.']);

  const addStaticDebuff = (typeName: string, idVal: number) => {
    setRingConsole(prev => [...prev, `[CALL] ApplyNewDebuff(ID=0x${idVal.toString(16).toUpperCase()}) triggered mid-combat.`]);
    
    // Step A: Check if already exists
    const existingIndex = activeDebuffs.findIndex(d => d.id === idVal);
    if (existingIndex !== -1) {
      setRingConsole(prev => [...prev, `[STEP A] Matching ID found in Slot ${existingIndex}. Refreshing duration timer and magnitude. Zero-alloc pointer reassignment.`]);
      setActiveDebuffs(prev => {
        const copy = [...prev];
        copy[existingIndex] = { ...copy[existingIndex], rem: 10.0, mag: copy[existingIndex].mag + 10 };
        return copy;
      });
      return;
    }

    // Step B: Look for empty slot (represented by an array of max 8 for this UI simulation)
    const MAX_UI_SLOTS = 8;
    const emptySlot = activeDebuffs.length < MAX_UI_SLOTS ? activeDebuffs.length : -1;
    if (emptySlot !== -1) {
      setRingConsole(prev => [...prev, `[STEP B] Found empty cell Slot ${emptySlot}. Writing properties to contiguous registers. Zero-malloc.`]);
      setActiveDebuffs(prev => [...prev, { id: idVal, name: typeName, rem: 10.0, mag: 25.0 }]);
      return;
    }

    // Step C: EMERGENCY OVERFLOW HOOK
    setRingConsole(prev => [
      ...prev, 
      `[STEP C] BUFFER FULL! MAX_BUFF_SLOTS (8) exceeded. Overwriting oldest Index #${overflowPointer} via circular modulo.`
    ]);
    setActiveDebuffs(prev => {
      const copy = [...prev];
      copy[overflowPointer] = { id: idVal, name: typeName, rem: 10.0, mag: 50.0 };
      return copy;
    });

    setOverflowPointer(prev => (prev + 1) % MAX_UI_SLOTS);
  };

  const clearRingSimulation = () => {
    setActiveDebuffs([]);
    setOverflowPointer(0);
    setRingConsole(['Memory buffer cleared. Static structure retains pre-allocated indices.']);
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="Modder-Friendly & Peak Optimized Architecture" 
        subtitle="Unify next-gen data-driven dynamics with unyielding C++ cache efficiency. Architect game systems that authorize players to mod everything without incurring catastrophic CPU stalls, Garbage Collection spikes, or thread barriers."
      />

      <HighlightBox type="success" className="p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/15 rounded-lg text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">The Golden Rule: Static Engine, Dynamic Data</h4>
            <p className="text-kingfisher-muted text-xs leading-relaxed mt-0.5">
              The ultimate benchmark of game software (implemented by Factorio, Skyrim, PoE, and Witcher 3) is to decouple the <strong>Authoring Environment</strong> (what developers and modders edit: readable JSON, event scripts, loose .obj assets) from the <strong>Runtime Environment</strong> (what the CPU executes: flat binary-aligned structs, integer hashes, and pre-allocated contiguous arrays). This achieves zero-cost abstraction.
            </p>
          </div>
        </div>
      </HighlightBox>

      {/* QUICK LINK NAVIGATION PINS */}
      <div className="flex flex-wrap gap-2 mb-4 bg-kingfisher-panel/30 border border-kingfisher-border/40 p-2 rounded-xl">
        {[
          { id: 'hashing', label: '1. FNV-1a Hashing', icon: Code },
          { id: 'rebaking', label: '2. Dynamic Re-Bakes & Dirty Flags', icon: RefreshCw },
          { id: 'combat', label: '3. Combat Conveyor & Bitmasks', icon: Sword },
          { id: 'ringbuffer', label: '4. Fixed-Size Ring Buffer', icon: Layers },
          { id: 'archetypes', label: '5. Sparse ECS vs Heavy OOP', icon: Box },
        ].map(btn => (
          <button
            key={btn.id}
            onClick={() => setActiveTabSection(btn.id as any)}
            className={`flex items-center gap-2 text-xs py-2 px-3 rounded-lg border font-bold transition-all ${
              activeTabSection === btn.id
                ? 'bg-kingfisher-blue/20 border-kingfisher-blue text-white shadow-lg shadow-kingfisher-blue/5'
                : 'bg-black/30 border-transparent hover:bg-neutral-800 text-kingfisher-muted hover:text-white'
            }`}
          >
            <btn.icon className="w-3.5 h-3.5" />
            {btn.label}
          </button>
        ))}
      </div>

      {/* RENDER ACTIVE TAB COMPONENT */}
      {activeTabSection === 'hashing' && (
        <div id="hashing-visualizer" className="space-y-6">
          <HighlightBox type="info">
            <h5 className="font-bold text-white mb-1">String Hashing Deep-Dive: Life-cycle & Math Costs</h5>
            <p className="text-xs text-kingfisher-muted leading-relaxed">
              <strong>Does hashing string keys destroy performance?</strong> No, because string hashing is decoupled via two lifecycle mechanisms: <br />
              1. <strong>Baking-at-Boot (Once Per Playsession):</strong> When the loading screen sweeps the <code className="text-blue-300">mods/</code> folder, every string identifier (e.g., weapon types, element names, asset file directories) is instantly converted into a 32-bit uint32_t number. The text strings are completely vaporized from simulation memory. <br />
              2. <strong>Compile-Time Expression Hashing:</strong> Custom C++ templates hash hardcoded strings in code at compile time, reducing calculation costs to exactly zero clock cycles at runtime. <br />
              Even if a script invokes hashing mid-frame, FNV-1a is blisteringly fast—using only two micro-operations (<strong>Multiply & XOR</strong>) per character, requiring a mere <strong>3-5 nanoseconds</strong> (one billionth of a sec) per word.
            </p>
          </HighlightBox>

          <Simulator1StringHashing 
            hashInput={hashInput} 
            setHashInput={setHashInput} 
            activeHash={activeHash} 
            standardCompare={standardStringCompareCost} 
            hashedCompare={hashedIntCompareCost} 
          />

          <SectionCard title="Unreal Engine has / hasn't Matrix for String Hashing" icon={Shield} color={COLORS.kingfisher.blue}>
            <FeatureMatrix 
              has={[
                "FName structures: Encapsulates string storage by mapping text to global string pools. Comparing two FNames evaluates instant index lookups rather than character matches.",
                "TMap of FName paths: Built-in hashed map lookup indices.",
                "FString class containing basic bitwise comparisons in isolated string pools."
              ]}
              missing={[
                "Uncooked mod text compilers: UE cooked applications do not support loading loose JSON files and compiling them into FNames dynamically without the Editor compiler binaries.",
                "Loose mod directory watchers to auto-hash mod configurations at the loading viewport."
              ]}
              howToUse="Bypass UE's read-only cook limitations by implementing a custom file loader in C++ using FFileHelper. At boot, scan the directory, parse mod parameters using TJsonReader, convert character definitions to hashed integer array indexes, and utilize FName values inside a custom dynamic Registry array."
            />
            <MultiplayerImpact 
              gpu="0.0 ms" 
              cpu="-5.5 ms (combat processing bottleneck solved)" 
              ram="+12 KB (microscopic flat lookups)" 
              vram="0.0 MB" 
              latency="0.0 ms impact" 
            />
          </SectionCard>
        </div>
      )}

      {activeTabSection === 'rebaking' && (
        <div className="space-y-6">
          <HighlightBox type="info">
            <h5 className="font-bold text-white mb-1">Dynamic Re-Baking, Asynchronous Threads, & Micro-Bakes</h5>
            <p className="text-xs text-kingfisher-muted leading-relaxed">
              If a player re-specs a passive tree, the math dependencies alter. To prevent lag spikes, the engine splits execution into threads: <br />
              - <strong>Main Frame Thread (The Train):</strong> Never blocks. It processes graphics, physical animation, ticks, and reads raw values from the pre-calculated stats. <br />
              - <strong>Worker Threads (The Backroom):</strong> Perform compiling in the background. If a speedrunner swaps support gems mid-air, the engine detects that other armor arrays did not modify. It schedules a targeted <strong>Micro-Bake</strong> taking just <strong>50 microseconds (0.05ms)</strong>. Once computed, the background thread performs a <strong>Pointer Swap</strong>, replacing indices in the pre-allocated structure. No memory allocations (mallocs) occur, bringing garbage collection stutters to exactly <strong>0ms</strong>!
            </p>
          </HighlightBox>

          <Simulator2ReBaking 
            activeGem={activeSupportGem}
            setActiveGem={setActiveSupportGem}
            activeWeapon={activeWeapon}
            setActiveWeapon={setActiveWeapon}
            allocatedPassive={allocatedPassive}
            setAllocatedPassive={setAllocatedPassive}
            bIsDirty={bIsDirty}
            bIsBaking={bIsBaking}
            bakedVersion={bakedVersion}
            recalculatingThread={recalculatingThread}
            bakeType={bakeType}
            triggerReBake={triggerReBake}
          />

          <SectionCard title="Unreal Engine has / hasn't Matrix for Lazy Re-Baking" icon={Shield} color={COLORS.kingfisher.blue}>
            <FeatureMatrix 
              has={[
                "FNonAbandonableTask / AsyncTask classes for offloading complex graph calculations onto thread pools safely.",
                "FProperty reflection handles to query modification values asynchronously."
              ]}
              missing={[
                "Integrated dependency trackers or dynamic 'Dirty Flags' on Actor components out of the box (standard actors update values synchronously, risking Game Thread freezes).",
                "Built-in structures that block garbage collectors from deleting shared references when a background thread hot-swaps pointer indexes safely."
              ]}
              howToUse="Declare custom thread-safe dirty bit flags in a modular Gameplay Component. When a weapon or modifier change is called, flip the flag. Schedule a custom background worker thread to recalculate overlapping stat multipliers. Once computed, swap pointers atomically using std::atomic<StatsLedger*> to write the flat statistics without locking the Render loop."
            />
            <MultiplayerImpact 
              gpu="0.0 ms" 
              cpu="-1.8 ms (offloads active calculations from game ticks)" 
              ram="+4 KB (recycled float arrays)" 
              vram="0.0 MB" 
              latency="0.0 ms" 
            />
          </SectionCard>
        </div>
      )}

      {activeTabSection === 'combat' && (
        <div id="poe-combat-pipeline" className="space-y-6">
          <HighlightBox type="info">
            <h5 className="font-bold text-white mb-1">PoE-Style Combat Pipeline & Bitmask Filtering (Multi-Modifier Resolution)</h5>
            <p className="text-xs text-kingfisher-muted leading-relaxed">
              <strong>How does a server evaluate 30,000 distinct spell hits in 33ms without crashing?</strong> <br />
              It uses a <strong>Bitmask Filter</strong> as a binary passport. Every combat hit is an instance of a flat C++ struct <code className="text-emerald-300">FCombatHitPacket</code> containing a 64-bit Bitmask representing attack tags (e.g. Melee, Fire, Crit, Spell). <br />
              When a hit connects, the engine performs a hardware-level <strong>Bitwise AND</strong> check against the target's unique items (1 CPU clock cycle). If the bits do not match, the modifier is discarded instantly without reading a single line of script! <br />
              Relevant modifiers are arranged along a strict linear <strong>Conveyor Belt (Chain of Responsibility)</strong>: Accuracy ──► Crit Roll ──► Base Damage ──► Mitigation ──► Ailments ──► On-Hit Hooks. This Monomorphized pass ensures extreme vector execution across CPU cores.
            </p>
          </HighlightBox>

          <Simulator4CombatPipeline
            isAttackBit={isAttackBit} setIsAttackBit={setIsAttackBit}
            isSpellBit={isSpellBit} setIsSpellBit={setIsSpellBit}
            isCritBit={isCritBit} setIsCritBit={setIsCritBit}
            isFireBit={isFireBit} setIsFireBit={setIsFireBit}
            isChaosBit={isChaosBit} setIsChaosBit={setIsChaosBit}
            eqShavronnes={eqShavronnes} setEqShavronnes={setEqShavronnes}
            eqTrypanon={eqTrypanon} setEqTrypanon={setEqTrypanon}
            eqMjolnir={eqMjolnir} setEqMjolnir={setEqMjolnir}
            combatConsole={combatConsole}
            pipelineStage={pipelineStage}
            isProcessingHit={isProcessingHit}
            testAttackDNA={testAttackDNA}
          />

          <SectionCard title="Unreal Engine has / hasn't Matrix for Combat Pipelines" icon={Shield} color={COLORS.kingfisher.blue}>
            <FeatureMatrix 
              has={[
                "FGameplayTagContainer structures inside GAS (Gameplay Ability System) that allow matching tags across items and abilities.",
                "Gameplay Effects matrices that resolve accuracy, armor, and resistances via execution calculations."
              ]}
              missing={[
                "Bitmask compiler automation: Gameplay Tags are compared via complex runtime string-tree loops rather than native 64-bit bitwise AND calculations, causing overhead in dense battles.",
                "Custom rigid step-conveyor queues that enforce structural multi-threaded SIMD compilations for spell hits."
              ]}
              howToUse="Rather than resolving tags via GAS dynamic containers, map core game mechanics to pre-defined bit schemas (Bit[0]=Melee, Bit[1]=Spell, etc.). Store active modifiers in a central WorldSubsystem. Run bitwise masks over flat structured arrays on worker threads using parallel-for loops to achieve blazing-fast combat resolution."
            />
            <MultiplayerImpact 
              gpu="-0.5 ms (due to Niagara and particle pipeline batching)" 
              cpu="-12.4 ms (prevents server crashes/lockups on juiced maps)" 
              ram="+8 KB (flat structure bounds)" 
              vram="0.0 MB" 
              latency="Prevents rubber-banding on high packet bursts" 
            />
          </SectionCard>
        </div>
      )}

      {activeTabSection === 'ringbuffer' && (
        <div id="circular-buffers" className="space-y-6">
          <HighlightBox type="info">
            <h5 className="font-bold text-white mb-1">Fixed-Size Static Arrays vs. Resizable Vector Bloat</h5>
            <p className="text-xs text-kingfisher-muted leading-relaxed">
              Standard engines let characters accumulate unlimited dynamic arrays of buffs. This thrashes memory allocations and triggers Garbage Collection freezes mid-fight. <br />
              An optimized RPG limits complexity via <strong>hard limits (Static Sizing)</strong>. A character has a fixed row of mailboxes: exactly 32 pointers for equipped gems, a 10,000-slot global stats ledger (~40KB, fitting entirely inside the L3 cache line), and a <strong>64-slot Ring Buffer array for active buffs</strong>. <br />
              If players somehow break balance and triggers a 65th debuff? The engine activates the <strong>Emergency Overflow Rule</strong>: it overwrites the oldest active slot index via a circular modulo loop, preventing memory extensions entirely and keeping search times uniform.
            </p>
          </HighlightBox>

          <Simulator5RingBuffer
            activeDebuffs={activeDebuffs}
            overflowPointer={overflowPointer}
            ringConsole={ringConsole}
            addStaticDebuff={addStaticDebuff}
            clearSim={clearRingSimulation}
          />

          <SectionCard title="Unreal Engine has / hasn't Matrix for Pre-Allocated Arrays" icon={Shield} color={COLORS.kingfisher.blue}>
            <FeatureMatrix 
              has={[
                "TStaticArray container templates: Allocates fixed-size contiguous memory blocks directly within the class footprint at compile-time.",
                "TDoubleLinkedList structures for tracking queue hierarchies."
              ]}
              missing={[
                "Automated circular ring buffer mechanics inside default game classes (standard array adds append elements dynamically, risking dynamic memory heap re-allocation).",
                "Gameplay Effects buffers that hard-cap and rewrite oldest entries without throwing warnings or leaking memory refs."
              ]}
              howToUse="Structure your player active debuffs array as a TStaticArray<FLightweightDebuff, 64> directly inside your C++ Character class, setting up a circular tracking index. On applying a new effect, do a single contiguous scan. If missing and array limits are crossed, update the circular index and overwrite the oldest parameters."
            />
            <MultiplayerImpact 
              gpu="0.0 ms" 
              cpu="-2.2 ms (zero malloc stutters, zero-loop search cost)" 
              ram="-150 KB (constant memory layout per character)" 
              vram="0.0 MB" 
              latency="0.0 ms impact" 
            />
          </SectionCard>
        </div>
      )}

      {activeTabSection === 'archetypes' && (
        <div id="archetype-comparison" className="space-y-6">
          <HighlightBox type="info">
            <h5 className="font-bold text-white mb-1">Sparse ECS Archetypes vs. Heavy OOP Actor Overheads</h5>
            <p className="text-xs text-kingfisher-muted leading-relaxed">
              Under traditional Object-Oriented layouts, every skeleton represents a heavy, separate object (<code className="text-white font-bold">AActor</code>, ~42KB memory footprint) with its own ticking behavior, transform pointers, and dynamic lists. This thrashes L1/L2 caches and causes massive memory bottlenecks. <br />
              A <strong>Sparse Component Archetype model</strong> groups identical enemies into strict, read-only statistical templates. Spawned instances are tiny, microsecond-aligned structs holding only dynamic coefficients (health, 3D vectors).
            </p>
          </HighlightBox>

          <Simulator3SparseArchetypes 
            entityCount={entityCount}
            setEntityCount={setEntityCount}
            modelType={modelType}
            setModelType={setModelType}
            oopCpu={oopCpuTime}
            ecsCpu={ecsCpuTime}
            totalOopMem={genericTotalOopMemory}
            totalEcsMem={genericTotalEcsMemory}
            oopMiss={oopCacheMissRate}
            ecsMiss={ecsCacheMissRate}
          />

          <SectionCard title="Unreal Engine has / hasn't Matrix for OOP vs. ECS" icon={Shield} color={COLORS.kingfisher.blue}>
            <FeatureMatrix 
              has={[
                "MassEntity ECS plug-in providing data-oriented structure pipelines, contiguous memory allocations, and optimized processor ticking loops.",
                "MassTraits for composing modular character properties without dynamic components."
              ]}
              missing={[
                "Seamless integration with standard character behaviors (converting Mass Entities to Standard AActor blueprints for custom animations requires intricate C++ bridges).",
                "Out-of-the-box support for complete server-side navigation mesh queries directly inside Mass Processor loops."
              ]}
              howToUse="Utilize Unreal's MassEntity processor loops for dense, passive mob armies (birds, rats, city crowd peasants), stripping away all Actor components. Store coordinates, and bone vectors in contiguous arrays. Map active combat inputs, and only transition entities to standard AActors if they enter intimate proximity battles with the player."
            />
            <MultiplayerImpact 
              gpu="-1.2 ms (reduces vertex mesh transformation bottlenecks)" 
              cpu="-14.5 ms (scales crowd counts up to 10k smoothly)" 
              ram="-650 MB (avoids actor allocations)" 
              vram="0.0 MB" 
              latency="-20 ms (slashes server tick calculations dramatically)" 
            />
          </SectionCard>
        </div>
      )}

    </div>
  );
};

// --- SUB-COMPONENTS FOR SIMULATORS ---

const Simulator1StringHashing: React.FC<{
  hashInput: string;
  setHashInput: (v: string) => void;
  activeHash: number;
  standardCompare: number;
  hashedCompare: number;
}> = ({ hashInput, setHashInput, activeHash, standardCompare, hashedCompare }) => {
  return (
    <SectionCard title="Simulator #1: FNV-1a String Hashing Engine (Human Text ──► CPU Numbers)" icon={Code} color={COLORS.kingfisher.warm}>
      <div className="space-y-6">
        <p className="text-xs text-kingfisher-muted leading-relaxed">
          Comparing strings inside your game loops is a catastrophic CPU bottleneck: the CPU must compare character-by-character, jumping across heap memory. By hashing strings into a single 32-bit integer (like <code className="bg-black/40 px-1 py-0.5 text-amber-300 rounded">2306871730</code>) at boot, the CPU compares them in single-cycle, hardware-level matching.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-black/25 p-5 rounded-2xl border border-kingfisher-border/50">
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                Type Modder Faction/Tag String Key:
              </label>
              <input 
                type="text" 
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                className="w-full bg-kingfisher-dark border border-kingfisher-border focus:border-kingfisher-blue text-white font-mono text-sm p-3 rounded-xl focus:outline-none transition-all"
                placeholder="Enter a descriptive string..."
              />
            </div>

            <div className="space-y-2 p-4 bg-kingfisher-dark/60 rounded-xl border border-kingfisher-border/30">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700] block mb-2">
                FNV-1a 32-bit Hash Processing Flow
              </span>
              <div className="font-mono text-xs text-kingfisher-muted space-y-1">
                <div>Initial Hash Offset Basis: <span className="text-blue-400">0x811c9dc5</span></div>
                <div>FNV-1a 32-bit Prime: <span className="text-emerald-400">0x01000193</span></div>
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
                          XOR ──► Mult: 0x{finalStepHash.toString(16).toUpperCase()}
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

          <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between space-y-4">
            <div className="p-4 bg-kingfisher-dark/80 rounded-xl border border-kingfisher-border text-center space-y-2">
              <span className="text-[10px] font-bold text-kingfisher-muted uppercase tracking-widest block">
                32-Bit Compiled Value (The Registry Key)
              </span>
              <div className="text-3xl font-mono font-extrabold text-blue-400 tracking-wide">
                0x{activeHash.toString(16).toUpperCase()}
              </div>
              <div className="text-xs text-kingfisher-muted font-mono">
                Decimal format: {activeHash}
              </div>
            </div>

            <div className="p-4 bg-black/40 rounded-xl border border-kingfisher-border/30 space-y-3">
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
                Live CPU Cost Comparison (1,000 Loop Iterations)
              </span>
              
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10.5px]">
                  <span className="text-rose-400 font-bold">Standard String Compares:</span>
                  <span>{standardCompare.toFixed(1)} ns</span>
                </div>
                <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '100%' }} />
                </div>
                <span className="text-[9px] text-kingfisher-muted/75 block italic leading-relaxed">
                  Scans character-by-character. Thrashes cache and blocks execution waves.
                </span>
              </div>

              <div className="space-y-1 pt-2">
                <div className="flex justify-between font-mono text-[10.5px]">
                  <span className="text-emerald-400 font-bold">Integer Checks (O(1) Hashed):</span>
                  <span>{hashedCompare.toFixed(1)} ns</span>
                </div>
                <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(hashedCompare / standardCompare) * 100}%` }} />
                </div>
                <span className="text-[9px] text-kingfisher-muted/75 block italic leading-relaxed">
                  Single-clock vector compare inside L1 CPU cache. Blistering fast.
                </span>
              </div>

              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] text-emerald-400 font-mono text-center">
                🚀 Performance Boost: <strong>{(standardCompare / hashedCompare).toFixed(0)}x</strong> hardware speed multiplier!
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

const Simulator2ReBaking: React.FC<{
  activeGem: string;
  setActiveGem: (v: string) => void;
  activeWeapon: string;
  setActiveWeapon: (v: string) => void;
  allocatedPassive: string;
  setAllocatedPassive: (v: string) => void;
  bIsDirty: boolean;
  bIsBaking: boolean;
  bakedVersion: number;
  recalculatingThread: string | null;
  bakeType: 'micro' | 'full';
  triggerReBake: (type: 'micro' | 'full') => void;
}> = ({
  activeGem, setActiveGem, activeWeapon, setActiveWeapon, allocatedPassive,
  setAllocatedPassive, bIsDirty, bIsBaking, bakedVersion, recalculatingThread,
  bakeType, triggerReBake
}) => {
  return (
    <SectionCard title="Simulator #2: Dynamic Re-Baking (The Gatekeeper / Dirty Flagging)" icon={RefreshCw} color={COLORS.status.success}>
      <div className="space-y-6">
        <p className="text-xs text-kingfisher-muted leading-relaxed">
          Speedrunners and pro players frequently swap gems, items, and traits mid-fight. Instead of rebuilding calculations on the Game Thread every tick, we use <strong>Asynchronous Lazy Re-Baking</strong>. Swapping single buffers represents a micro-bake taking only microseconds.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-black/25 p-5 rounded-2xl border border-kingfisher-border/50">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700] block">
              Test Instant Dynamic Swap Loops:
            </span>

            <div className="space-y-1">
              <span className="text-[11px] text-white font-medium block">Support Gem Selection (Micro-Bake ⚡):</span>
              <div className="flex gap-2">
                {['Added Fire Damage', 'Crit Strikes Support', 'Faster Attacks'].map(gem => (
                  <button
                    key={gem}
                    onClick={() => { setActiveGem(gem); triggerReBake('micro'); }}
                    className={`flex-1 text-[10px] p-2 rounded-lg border font-bold transition-all ${
                      activeGem === gem 
                        ? 'bg-blue-500/20 border-blue-500 text-white shadow-md'
                        : 'bg-black/30 border-transparent hover:bg-neutral-800 text-kingfisher-muted hover:text-white'
                    }`}
                  >
                    {gem.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-white font-medium block">Weapon Interface (Micro-Bake ⚡):</span>
              <div className="flex gap-2">
                {['Flame Blade', 'Archon Mace', 'Energy Staff'].map(wpn => (
                  <button
                    key={wpn}
                    onClick={() => { setActiveWeapon(wpn); triggerReBake('micro'); }}
                    className={`flex-1 text-[10px] p-2 rounded-lg border font-bold transition-all ${
                      activeWeapon === wpn 
                        ? 'bg-blue-500/20 border-blue-500 text-white shadow-md'
                        : 'bg-black/30 border-transparent hover:bg-neutral-800 text-kingfisher-muted hover:text-white'
                    }`}
                  >
                    {wpn.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-white font-medium block">Passive Tree Node Re-Spec (Full Re-Bake 🌀):</span>
              <div className="flex gap-2">
                {['Pyromaniac (+10% Fire)', 'Assassin (+15% Crit)', 'Gladiator (+10% Speed)'].map(node => (
                  <button
                    key={node}
                    onClick={() => { setAllocatedPassive(node); triggerReBake('full'); }}
                    className={`flex-1 text-[10px] p-2 rounded-lg border font-bold transition-all ${
                      allocatedPassive === node 
                        ? 'bg-amber-500/20 border-amber-500 text-white shadow-md'
                        : 'bg-black/30 border-transparent hover:bg-neutral-800 text-kingfisher-muted hover:text-white'
                    }`}
                  >
                    {node.split(' (+')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between border-l border-kingfisher-border/30 pl-0 lg:pl-6 space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffd700] block">
                C++ Async Compile Visualizer (Live View)
              </span>

              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Main Frame Thread (Active Render Engine Loop)
                  </div>
                  <div className="text-xs text-white font-mono mt-1">
                    Frame-Rate Target: <strong className="text-white">144 FPS</strong> (~6.94ms per frame)
                  </div>
                  <div className="text-[10px] text-kingfisher-muted mt-0.5">
                    Main loop processes inputs, draws VFX, and reads read-only calculated stat indices safely.
                  </div>
                </div>
                <span className="text-[10px] font-mono p-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase font-extrabold rounded">
                  UNBLOCKED
                </span>
              </div>

              <div className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                bIsBaking 
                  ? 'border-blue-500/50 bg-blue-500/10' 
                  : 'border-kingfisher-border/30 bg-black/20 text-kingfisher-muted'
              }`}>
                <div>
                  <div className={`text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 ${bIsBaking ? 'text-blue-400' : 'text-kingfisher-muted'}`}>
                    {bIsBaking && <RefreshCw className="w-3 h-3 animate-spin" />}
                    Worker Thread Pool (Asynchronous Tasks)
                  </div>
                  <div className={`text-xs font-mono mt-1 ${bIsBaking ? 'text-white font-bold' : 'text-kingfisher-surface/30'}`}>
                    Status: {bIsBaking 
                      ? `⚡ COMPILING CHARACTER STATE (${bakeType === 'micro' ? 'MICRO-BAKE: ~50us' : 'FULL RE-BUILD: ~0.5ms'})` 
                      : '💤 DORMANT (Standing by for swap flag...)'}
                  </div>
                  <div className="text-[10px] mt-0.5">
                    Performs heavy tree traversal, modifier overlapping calculations, and compiles flat values.
                  </div>
                </div>
                <span className={`text-[9px] font-mono p-1 border tracking-wider uppercase font-extrabold rounded ${
                  bIsBaking 
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400 animate-pulse' 
                    : 'bg-black/40 border-transparent text-kingfisher-muted/30'
                }`}>
                  {bIsBaking ? 'WORKING' : 'STBY'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-kingfisher-dark/80 border border-kingfisher-border/40 rounded-xl space-y-2">
              <span className="text-[10.5px] font-bold text-white block">
                Character Pre-allocated 'Mailbox' Array (GC-Free Pointer Swaps)
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 font-mono text-center">
                {[
                  { slot: 0, label: activeGem.split(' ')[0], type: 'Gem Pointer' },
                  { slot: 1, label: activeWeapon.split(' ')[0], type: 'Wpn Pointer' },
                  { slot: 2, label: allocatedPassive.split(' ')[0], type: 'Node Pointer' },
                  { slot: 3, label: 'null', type: 'Unused' },
                  { slot: 4, label: 'null', type: 'Unused' },
                  { slot: 5, label: 'null', type: 'Unused' },
                  { slot: 6, label: 'null', type: 'Unused' },
                  { slot: 7, label: 'null', type: 'Unused' },
                ].map((mailbox, index) => {
                  const isFilled = mailbox.label !== 'null';
                  return (
                    <div 
                      key={index}
                      className={`p-1.5 rounded border transition-all text-[10px] leading-tight ${
                        bIsBaking && index === (bakeType === 'micro' ? 0 : 2)
                          ? 'bg-blue-500/20 border-blue-400 text-white animate-pulse'
                          : isFilled 
                            ? 'bg-kingfisher-panel border-kingfisher-blue text-blue-200' 
                            : 'bg-black/35 border-transparent text-kingfisher-muted/40'
                      }`}
                    >
                      <div className="text-[8px] opacity-60 font-medium">Box #{index}</div>
                      <div className="font-bold truncate mt-0.5">{mailbox.label}</div>
                      <div className="text-[7px] truncate opacity-50 uppercase mt-0.5">{mailbox.type}</div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center text-[10px] text-kingfisher-muted pt-1">
                <span>Incremental state version: <strong>v{bakedVersion}</strong></span>
                <span className="text-emerald-400 font-mono text-[9px] uppercase font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Atomic Pointer Swap Success (0ms gc stutters)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

const Simulator3SparseArchetypes: React.FC<{
  entityCount: number;
  setEntityCount: (v: number) => void;
  modelType: 'oop_actor' | 'sparse_ecs';
  setModelType: (v: 'oop_actor' | 'sparse_ecs') => void;
  oopCpu: number;
  ecsCpu: number;
  totalOopMem: number;
  totalEcsMem: number;
  oopMiss: number;
  ecsMiss: number;
}> = ({
  entityCount, setEntityCount, modelType, setModelType,
  oopCpu, ecsCpu, totalOopMem, totalEcsMem, oopMiss, ecsMiss
}) => {
  return (
    <SectionCard title="Simulator #3: Sparse Component Archetypes vs. Heavy Object-Oriented Actors" icon={Layers} color={COLORS.kingfisher.blue}>
      <div className="space-y-6">
        <p className="text-xs text-kingfisher-muted leading-relaxed">
          Skeletons or Drowners spawning on screen thrashes standard OOP cache execution layers due to nested transform components, ticking chains, and heap fragmentation (~42KB per Actor pointer). Organizing templates as sparse components reduces instance state blocks to a microscopic 32 bytes composed of health and 3D vectors.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-black/25 p-5 rounded-2xl border border-kingfisher-border/50">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700] block">
              Simulation Scale & Actor Layout
            </span>

            <div className="space-y-2">
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
                <span>250 Mobs (Skirmish)</span>
                <span>10,000 Mobs (Extreme Juiced Mapping)</span>
              </div>
            </div>

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
                  <span className="text-[9px] opacity-70 mt-1">Epic's Default AActor loops</span>
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
                  <span className="text-[9px] opacity-70 mt-1">Contiguous C++ ECS Pools</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-between border-l border-kingfisher-border/30 pl-0 lg:pl-6 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffd700]">
                  Simulated CPU / Memory Metrics
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 font-extrabold uppercase">
                  {modelType === 'oop_actor' ? 'OOP Actor layout' : 'Sparse ECS layout'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-kingfisher-dark/60 rounded-xl border border-kingfisher-border/30">
                  <span className="text-kingfisher-muted text-[10px] block">CPU Game Thread Tick:</span>
                  <strong className={`font-mono text-xl block mt-1 ${
                    modelType === 'oop_actor' ? 'text-rose-400 font-extrabold' : 'text-emerald-400 font-bold'
                  }`}>
                    {modelType === 'oop_actor' ? oopCpu.toFixed(2) : ecsCpu.toFixed(2)} ms
                  </strong>
                  <span className="text-[9px] mt-0.5 text-kingfisher-muted/60 block">
                    Update, transforms, and sorting loops.
                  </span>
                </div>

                <div className="p-3 bg-kingfisher-dark/60 rounded-xl border border-kingfisher-border/30">
                  <span className="text-kingfisher-muted text-[10px] block">System RAM Footprint:</span>
                  <strong className={`font-mono text-xl block mt-1 ${
                    modelType === 'oop_actor' ? 'text-rose-400 font-extrabold' : 'text-emerald-400 font-bold'
                  }`}>
                    {modelType === 'oop_actor' ? `${totalOopMem.toFixed(1)} MB` : `${totalEcsMem.toFixed(0)} KB`}
                  </strong>
                  <span className="text-[9px] mt-0.5 text-kingfisher-muted/60 block">
                    Allocated heap structure boundaries.
                  </span>
                </div>

                <div className="p-3 bg-kingfisher-dark/60 rounded-xl border border-kingfisher-border/30">
                  <span className="text-kingfisher-muted text-[10px] block">L1 / L2 Cache Miss Rate:</span>
                  <strong className={`font-mono text-xl block mt-1 ${
                    modelType === 'oop_actor' ? 'text-rose-400 font-extrabold' : 'text-emerald-400 font-bold'
                  }`}>
                    {modelType === 'oop_actor' ? `${oopMiss}%` : `${ecsMiss}%`}
                  </strong>
                  <span className="text-[9px] mt-0.5 text-kingfisher-muted/60 block">
                    Failed local CPU cache register retrievals.
                  </span>
                </div>

                <div className="p-3 bg-kingfisher-dark/60 rounded-xl border border-kingfisher-border/30">
                  <span className="text-kingfisher-muted text-[10px] block">Garbage Collector Hitch Risk:</span>
                  <strong className={`font-mono text-xl block mt-1 ${
                    modelType === 'oop_actor' ? 'text-red-400 font-extrabold animate-pulse' : 'text-emerald-400 font-bold'
                  }`}>
                    {modelType === 'oop_actor' ? 'CRITICAL HIGH' : 'ZERO RISK'}
                  </strong>
                  <span className="text-[9px] mt-0.5 text-kingfisher-muted/60 block">
                    Risk of recurring frame stalls during sweeps.
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-black/40 rounded-xl border border-kingfisher-border/30 text-xs">
              {modelType === 'oop_actor' ? (
                <p className="text-rose-200/90 leading-relaxed text-[11px]">
                  ⚠️ <strong>OOP Bottleneck:</strong> Spawning {entityCount} standard Actors registers individual tick indices on the Game Thread. Pointer-chasing forces the CPU to halt and fetch variables from system RAM across different addresses (at ~100ns latency), choking cache processing lines.
                </p>
              ) : (
                <p className="text-emerald-100/90 leading-relaxed text-[11px]">
                  ✅ <strong>Sparse ECS Efficiency:</strong> Skeletons share a single read-only registry template block. The CPU sweeps across perfectly contiguous memory arrays of coordinates inside the local cache in single clock passes.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

const Simulator4CombatPipeline: React.FC<{
  isAttackBit: boolean; setIsAttackBit: (v: boolean) => void;
  isSpellBit: boolean; setIsSpellBit: (v: boolean) => void;
  isCritBit: boolean; setIsCritBit: (v: boolean) => void;
  isFireBit: boolean; setIsFireBit: (v: boolean) => void;
  isChaosBit: boolean; setIsChaosBit: (v: boolean) => void;
  eqShavronnes: boolean; setEqShavronnes: (v: boolean) => void;
  eqTrypanon: boolean; setEqTrypanon: (v: boolean) => void;
  eqMjolnir: boolean; setEqMjolnir: (v: boolean) => void;
  combatConsole: string[];
  pipelineStage: number;
  isProcessingHit: boolean;
  testAttackDNA: () => void;
}> = ({
  isAttackBit, setIsAttackBit, isSpellBit, setIsSpellBit, isCritBit, setIsCritBit,
  isFireBit, setIsFireBit, isChaosBit, setIsChaosBit, eqShavronnes, setEqShavronnes,
  eqTrypanon, setEqTrypanon, eqMjolnir, setEqMjolnir, combatConsole, pipelineStage,
  isProcessingHit, testAttackDNA
}) => {
  return (
    <SectionCard title="Simulator #4: PoE Combat Pipeline & Bitmask Filtering Simulator" icon={Sword} color={COLORS.kingfisher.blue}>
      <div className="space-y-6">
        <p className="text-xs text-kingfisher-muted leading-relaxed">
          Configure an attack's binary passport tags (the "DNA") and equip special rule-changing items. Watch how the packet moves down a 6-stage structured conveyor belt with maximum efficiency, filtering out conflicting rules natively using single-cycle Bitwise checks rather than slow string evaluations.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-black/25 p-5 rounded-2xl border border-kingfisher-border/50">
          {/* Left panel: configure tag bitmask */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700] block">
              1. Customize Packet Bitmask Tags
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Bit 0: IS_ATTACK', val: isAttackBit, set: setIsAttackBit },
                { label: 'Bit 1: IS_SPELL', val: isSpellBit, set: setIsSpellBit },
                { label: 'Bit 2: IS_CRITICAL', val: isCritBit, set: setIsCritBit, disabled: eqTrypanon },
                { label: 'Bit 3: IS_FIRE', val: isFireBit, set: setIsFireBit },
                { label: 'Bit 4: IS_CHAOS', val: isChaosBit, set: setIsChaosBit },
              ].map((bit, idx) => (
                <button
                  key={idx}
                  disabled={bit.disabled}
                  onClick={() => bit.set(!bit.val)}
                  className={`p-2 rounded-lg border text-left flex justify-between items-center transition-all text-[11px] font-semibold ${
                    bit.disabled 
                      ? 'bg-neutral-800/10 border-neutral-800 text-neutral-600 cursor-not-allowed'
                      : bit.val
                        ? 'bg-blue-500/10 border-blue-500 text-white shadow-sm'
                        : 'bg-black/35 border-transparent text-kingfisher-muted hover:text-white'
                  }`}
                >
                  <span>{bit.label}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${bit.val && !bit.disabled ? 'bg-emerald-400' : 'bg-neutral-700'}`} />
                </button>
              ))}
            </div>

            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700] block pt-2">
              2. Equip Rule-Changer Modifiers (Unique Gear)
            </span>
            <div className="space-y-2">
              <button
                onClick={() => setEqShavronnes(!eqShavronnes)}
                className={`w-full p-2.5 rounded-xl border text-left flex justify-between items-center transition-all text-xs ${
                  eqShavronnes ? 'bg-amber-500/10 border-amber-500 text-white font-bold' : 'bg-black/35 border-transparent text-kingfisher-muted'
                }`}
              >
                <div>
                  <div className="font-bold text-white">Shavronne's Wrappings (Stat ID 5231)</div>
                  <div className="text-[9.5px] font-normal leading-relaxed text-kingfisher-muted mt-0.5">Chaos Damage does not bypass Energy Shield.</div>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ml-2 ${eqShavronnes ? 'bg-amber-400' : 'bg-neutral-700'}`} />
              </button>

              <button
                onClick={() => setEqTrypanon(!eqTrypanon)}
                className={`w-full p-2.5 rounded-xl border text-left flex justify-between items-center transition-all text-xs ${
                  eqTrypanon ? 'bg-amber-500/10 border-amber-500 text-white font-bold' : 'bg-black/35 border-transparent text-kingfisher-muted'
                }`}
              >
                <div>
                  <div className="font-bold text-white">Trypanon Great Mace (Stat ID 1120)</div>
                  <div className="text-[9.5px] font-normal leading-relaxed text-kingfisher-muted mt-0.5">All attacks are guaranteed Critical Strikes. Overrides Crit roll.</div>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ml-2 ${eqTrypanon ? 'bg-amber-400' : 'bg-neutral-700'}`} />
              </button>

              <button
                onClick={() => setEqMjolnir(!eqMjolnir)}
                className={`w-full p-2.5 rounded-xl border text-left flex justify-between items-center transition-all text-xs ${
                  eqMjolnir ? 'bg-amber-500/10 border-amber-500 text-white font-bold' : 'bg-black/35 border-transparent text-kingfisher-muted'
                }`}
              >
                <div>
                  <div className="font-bold text-white">Mjölnir Gavel (Stat ID 9820)</div>
                  <div className="text-[9.5px] font-normal leading-relaxed text-kingfisher-muted mt-0.5">Triggers multicast lightning spell event on landing a Critical Strike.</div>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ml-2 ${eqMjolnir ? 'bg-amber-400' : 'bg-neutral-700'}`} />
              </button>
            </div>

            <button
              onClick={testAttackDNA}
              disabled={isProcessingHit}
              className="w-full bg-kingfisher-blue hover:bg-kingfisher-blue/80 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg text-xs"
            >
              <Play className="w-4 h-4 fill-white" />
              {isProcessingHit ? 'PROCESSING IN CONVEYOR...' : 'FIRE ATTACK PACKET'}
            </button>
          </div>

          {/* Right panel: visually animated conveyor belt */}
          <div className="lg:col-span-7 flex flex-col justify-between border-l border-kingfisher-border/30 pl-0 lg:pl-6 space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffd700] block">
              Combat Assembly Pipeline Conveyor (Execution Stages)
            </span>

            {/* Conveyor graphic */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {[
                { name: '1. Accuracy', icon: Activity },
                { name: '2. Crit Roll', icon: Shuffle },
                { name: '3. Multipliers', icon: Layers },
                { name: '4. Mitigation', icon: Shield },
                { name: '5. Ailments', icon: Flame },
                { name: '6. Hooks', icon: Sword },
              ].map((stage, idx) => {
                const isActive = pipelineStage === idx;
                const isCompleted = pipelineStage > idx;
                return (
                  <div 
                    key={idx}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      isActive 
                        ? 'bg-blue-500/25 border-blue-400 text-white scale-105 shadow-md shadow-blue-500/20' 
                        : isCompleted 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : 'bg-black/25 border-kingfisher-border/20 text-kingfisher-muted/50'
                    }`}
                  >
                    <stage.icon className={`w-4 h-4 mx-auto mb-1 ${isActive ? 'text-blue-400' : isCompleted ? 'text-emerald-400' : 'text-kingfisher-muted/35'}`} />
                    <div className="text-[9.5px] font-bold leading-tight">{stage.name}</div>
                  </div>
                );
              })}
            </div>

            {/* Simulated Live Console logs */}
            <div className="p-4 bg-black/50 border border-kingfisher-border/40 rounded-xl space-y-2 h-64 overflow-y-auto custom-scrollbar">
              <span className="text-[9px] uppercase font-mono tracking-wider text-kingfisher-muted block border-b border-kingfisher-border/25 pb-1 select-none">
                SIMULATED SERVER COMBAT TELEMETRY LOG
              </span>
              <div className="font-mono text-[10.5px] space-y-2 leading-relaxed">
                {combatConsole.map((line, idx) => (
                  <div key={idx} className="text-emerald-400">
                    <span className="text-kingfisher-muted/40 font-normal">[{idx + 1}]</span> {line}
                  </div>
                ))}
                {isProcessingHit && (
                  <div className="text-blue-400 animate-pulse flex items-center gap-1 font-bold">
                    <RefreshCw className="w-3 h-3 animate-spin text-blue-400" /> Computing composite factors...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

const Simulator5RingBuffer: React.FC<{
  activeDebuffs: Array<{ id: number; name: string; rem: number; mag: number }>;
  overflowPointer: number;
  ringConsole: string[];
  addStaticDebuff: (typeName: string, idVal: number) => void;
  clearSim: () => void;
}> = ({ activeDebuffs, overflowPointer, ringConsole, addStaticDebuff, clearSim }) => {
  return (
    <SectionCard title="Simulator #5: Static Ring Buffer & Overwrite Overflow Manager" icon={Layers3} color={COLORS.kingfisher.blue}>
      <div className="space-y-6">
        <p className="text-xs text-kingfisher-muted leading-relaxed">
          Avoid vector list memory expansion during active gameplay. This simulator represents a hard-capped array sized to exactly <strong>8 active debuffs</strong>. Click elements to apply them — if the array fills up completely, are we safe? Yes: the <strong>Emergency Overflow Rule</strong> overwrites the oldest slot safely using circular modulo indexes.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-black/25 p-5 rounded-2xl border border-kingfisher-border/50">
          {/* Controls: select debuff to add */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-[#ffd700] font-bold block">
              1. Apply Buffs / Debuffs Mid-Combat
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Ignite', id: 0x9a3f21 },
                { name: 'Vulnerability', id: 0x2b4c8d },
                { name: 'Shock', id: 0x1f4c3a },
                { name: 'Freeze', id: 0x5d21a4 },
                { name: 'Bleed', id: 0x8a1b2c },
                { name: 'Poison', id: 0x3f5c8a },
                { name: 'Despair', id: 0x7c2d9b },
                { name: 'Enfeeble', id: 0x4f1a23 },
                { name: 'Temporal Chains', id: 0x0a9e21 },
                { name: 'Punishment', id: 0x8b3c4f }
              ].map(debuff => (
                <button
                  key={debuff.name}
                  onClick={() => addStaticDebuff(debuff.name, debuff.id)}
                  className="p-2.5 bg-black/35 hover:bg-neutral-800 border border-transparent hover:border-kingfisher-blue/40 text-left text-xs font-bold font-mono text-blue-200 rounded-xl transition-all"
                >
                  <div className="text-white text-[11px] font-bold">{debuff.name}</div>
                  <div className="text-[9px] text-[#ffd700] font-normal mt-0.5">0x{debuff.id.toString(16).toUpperCase()}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={clearSim}
                className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold py-2.5 text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Reset Buffer
              </button>
            </div>
          </div>

          {/* Right side: static index boxes and registers */}
          <div className="lg:col-span-7 flex flex-col justify-between border-l border-kingfisher-border/30 pl-0 lg:pl-6 space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffd700] block">
                Contiguous Cache-Aligned Static Index Boxes (Max 8 Saturated Map)
              </span>

              <div className="grid grid-cols-4 gap-2 text-center select-none font-mono text-xs">
                {Array.from({ length: 8 }).map((_, idx) => {
                  const item = activeDebuffs[idx];
                  const isOldest = overflowPointer === idx && activeDebuffs.length >= 8;
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border relative transition-all ${
                        item 
                          ? isOldest 
                            ? 'bg-amber-500/20 border-amber-500 text-white animate-pulse font-bold'
                            : 'bg-blue-500/10 border-blue-500/50 text-blue-100'
                          : 'bg-black/35 border-dashed border-kingfisher-border/20 text-kingfisher-muted/30'
                      }`}
                    >
                      {isOldest && (
                        <span className="absolute -top-1.5 -right-1 px-1 py-0.5 bg-amber-500 text-black text-[7.5px] uppercase font-extrabold tracking-tight rounded leading-none">
                          Next Overwrite
                        </span>
                      )}
                      <div className="text-[8px] opacity-65">Cell Register #{idx}</div>
                      {item ? (
                        <div className="mt-1">
                          <div className="font-extrabold text-[11px] truncate text-white">{item.name}</div>
                          <div className="text-[8.5px] text-amber-300 mt-0.5">0x{item.id.toString(16).toUpperCase()}</div>
                          <div className="text-[8px] opacity-50 mt-1">{item.rem.toFixed(1)}s (mag {item.mag.toFixed(0)})</div>
                        </div>
                      ) : (
                        <div className="py-4 text-[10px] italic">0x00000000</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audit Console output and telemetry review */}
            <div className="p-4 bg-black/50 border border-kingfisher-border/40 rounded-xl space-y-2 h-44 overflow-y-auto custom-scrollbar">
              <span className="text-[9px] uppercase font-mono tracking-wider text-kingfisher-muted block border-b border-kingfisher-border/25 pb-1 select-none">
                LIVE STATIC BUFFER TRACE
              </span>
              <div className="font-mono text-[10.5px] space-y-1.5 leading-relaxed text-emerald-400">
                {ringConsole.map((log, index) => (
                  <div key={index}>
                    <span className="text-kingfisher-muted/40">[{index + 1}]</span> {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};
