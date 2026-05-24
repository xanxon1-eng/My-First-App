
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network, ArrowRight } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const ArchitectureTab = () => (
  <div className="space-y-6">
    <PageHeader title="CPU & RAM Memory Architecture" subtitle="Eliminating traversal stutters, memory leaks, garbage collection sweeps, and cache misses." />

    <HighlightBox type="warning" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">The Golden Rule: Hybrid Architecture</strong>
      </div>
      <p className="text-emerald-100/90 text-sm leading-relaxed">
        To build a massive, complex game (like Path of Exile or Baldur's Gate 3) that scales well, you must apply the hybrid approach systematically:
        Use <strong>Object-Oriented Design (OOP)</strong> where data is unique, low-volume, and logic-heavy. Use <strong>Data-Oriented Design (DOD)</strong> where data is repetitive, high-volume, and math-heavy.
      </p>
    </HighlightBox>

    {/* The Architectural Choice Grid */}
    <div id="oop-vs-dod-matrix" className="bg-kingfisher-panel/30 border border-kingfisher-border/30 rounded-xl overflow-hidden shadow-xl mb-6 scroll-mt-20">
      <div className="p-4 bg-black/40 border-b border-kingfisher-border/30 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-400" />
          The Architectural Choice Grid (OOP vs DOD)
        </h3>
        <span className="text-[10px] uppercase font-bold text-kingfisher-muted/60 tracking-wider">Subsystems Matrix</span>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-kingfisher-panel/50 text-kingfisher-muted/60 text-[10px] uppercase tracking-wider font-bold">
              <th className="p-3 border-b border-kingfisher-border/30 whitespace-nowrap">Game Element / Subsystem</th>
              <th className="p-3 border-b border-kingfisher-border/30 whitespace-nowrap">Orientation</th>
              <th className="p-3 border-b border-kingfisher-border/30 min-w-[300px]">Primary Reason & Hardware Impact</th>
              <th className="p-3 border-b border-kingfisher-border/30 min-w-[300px]">Architectural Implementation Details (UE5)</th>
            </tr>
          </thead>
          <tbody className="text-xs text-kingfisher-muted divide-y divide-kingfisher-border/10">
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-3 font-medium text-white flex items-center gap-2"><LayoutTemplate className="w-3.5 h-3.5 text-blue-400" /> User Interface (UI) & HUD</td>
              <td className="p-3 font-mono font-bold text-blue-400">OOP</td>
              <td className="p-3 leading-relaxed">Low object count, highly hierarchical. Logic is triggered by rare human inputs, meaning cache misses are irrelevant. <br/><span className="text-kingfisher-muted/70 text-[10px] mt-1 block">Hardware: -0.2ms CPU (Events over Ticks).</span></td>
              <td className="p-3 leading-relaxed">Base UIElement class with inherited Button, HealthBar, and InventorySlot classes. Uses UMG event listeners (e.g., OnClicked()), entirely bypassing Event Tick.</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-3 font-medium text-white flex items-center gap-2"><Package className="w-3.5 h-3.5 text-amber-400" /> Inventory System (Data)</td>
              <td className="p-3 font-mono font-bold text-blue-400">OOP</td>
              <td className="p-3 leading-relaxed">Complex unique states (item mods, socket configurations, weapon tiers) that don't need to be iterated every frame. <br/><span className="text-kingfisher-muted/70 text-[10px] mt-1 block">Hardware: ~2MB RAM (Non-contiguous allocations).</span></td>
              <td className="p-3 leading-relaxed">A standard UObject or struct mapping holding a collection of GemSocket objects and a list of ItemAffix properties.</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-3 font-medium text-white flex items-center gap-2"><Crosshair className="w-3.5 h-3.5 text-red-400" /> Loot Drops & Ground Items</td>
              <td className="p-3 font-mono font-bold text-red-400">DOD</td>
              <td className="p-3 leading-relaxed">High volume (PoE maps). Hundreds of items require continuous physics collision checks / distancing. <br/><span className="text-kingfisher-muted/70 text-[10px] mt-1 block">Hardware: -3.5ms CPU (Batched distance checks).</span></td>
              <td className="p-3 leading-relaxed">Flat arrays of PositionComponent and LootIDComponent (MassEntity fragments). Uses Instanced Static Meshes (HISM) for batched draw calls (-2.0ms GPU).</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-3 font-medium text-white flex items-center gap-2"><Grid className="w-3.5 h-3.5 text-emerald-400" /> Enemy AI (Trash Mobs)</td>
              <td className="p-3 font-mono font-bold text-red-400">DOD</td>
              <td className="p-3 leading-relaxed">High volume. 300 mobs calculating distance simultaneously will thrash the L1/L2 cache in OOP. <br/><span className="text-kingfisher-muted/70 text-[10px] mt-1 block">Hardware: -8.5ms CPU (MassEntity/SIMD).</span></td>
              <td className="p-3 leading-relaxed">Arrays of basic state vectors. Movement updated in large batches using parallel CPU jobs. UE5's MassEntity framework fits this perfectly.</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-3 font-medium text-white flex items-center gap-2"><ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> Boss AI & Scripted Fights</td>
              <td className="p-3 font-mono font-bold text-blue-400">OOP</td>
              <td className="p-3 leading-relaxed">Single-entity, highly complex, deeply nested conditional logic and sub-phase transitions. <br/><span className="text-kingfisher-muted/70 text-[10px] mt-1 block">Hardware: Negligible (+0.1ms CPU due to branch mispredictions).</span></td>
              <td className="p-3 leading-relaxed">A traditional Behavior Tree or Finite State Machine (FSM) Component attached directly to the Boss Character class.</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-3 font-medium text-white flex items-center gap-2"><Map className="w-3.5 h-3.5 text-cyan-400" /> Quest & Dialogue Trees</td>
              <td className="p-3 font-mono font-bold text-blue-400">OOP</td>
              <td className="p-3 leading-relaxed">Highly specific, low-frequency logic conditions. Maps perfectly to human-readable graph structures. <br/><span className="text-kingfisher-muted/70 text-[10px] mt-1 block">Hardware: ~4MB RAM (Graph Node Storage).</span></td>
              <td className="p-3 leading-relaxed">A Quest UObject containing node links to QuestObjective. Evaluated solely via Event Dispatchers when triggers fire.</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-3 font-medium text-white flex items-center gap-2"><Save className="w-3.5 h-3.5 text-orange-400" /> Save / Serialization</td>
              <td className="p-3 font-mono font-bold text-blue-400">OOP</td>
              <td className="p-3 leading-relaxed">High-level data grouping. Read/write operations happen during loading where time is in seconds. <br/><span className="text-kingfisher-muted/70 text-[10px] mt-1 block">Hardware: I/O Bound (+100ms load hitch).</span></td>
              <td className="p-3 leading-relaxed">Master SaveGameManager singleton that requests state snapshots, pushing them through FArchive blocks to NVMe.</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-3 font-medium text-white flex items-center gap-2"><Activity className="w-3.5 h-3.5 text-yellow-400" /> Player Stats & Auras</td>
              <td className="p-3 font-mono font-bold text-yellow-400">Hybrid</td>
              <td className="p-3 leading-relaxed">One player, but stats evaluated millions of times a second by DOD combat/damage equations. <br/><span className="text-kingfisher-muted/70 text-[10px] mt-1 block">Hardware: -2.5ms CPU (Data Mirroring cache hits).</span></td>
              <td className="p-3 leading-relaxed">Maintain an OOP wrapper for easy scripting (GAS), but mirror active stats into flat C++ arrays for the damage engine to iterate (DOD).</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-3 font-medium text-white flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-indigo-400" /> Projectile Physics</td>
              <td className="p-3 font-mono font-bold text-red-400">DOD</td>
              <td className="p-3 leading-relaxed">Massive scaling. 1 skill triggers 50 piercing, chaining projectiles hitting 100 targets. <br/><span className="text-kingfisher-muted/70 text-[10px] mt-1 block">Hardware: -5.8ms CPU (Eliminating AActor Ticks).</span></td>
              <td className="p-3 leading-relaxed">Pure ECS. Projectiles are non-Actor Entity IDs with Velocity and BoundingBox structs processes by a bulk MovementSystem. (e.g. Niagara Systems driven via C++).</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-3 font-medium text-white flex items-center gap-2"><Trees className="w-3.5 h-3.5 text-emerald-500" /> Environmental Interaction</td>
              <td className="p-3 font-mono font-bold text-red-400">DOD</td>
              <td className="p-3 leading-relaxed">Every cup/box has physics and reactivity states. Spawning AActors destroys the Game Thread. <br/><span className="text-kingfisher-muted/70 text-[10px] mt-1 block">Hardware: -14.2ms CPU, -250MB RAM.</span></td>
              <td className="p-3 leading-relaxed">World items exist as tightly packed MassEntity IDs combined with optional Destructible or SurfaceElement fragment bits.</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-3 font-medium text-white flex items-center gap-2"><Image className="w-3.5 h-3.5 text-cyan-400" /> World Asset Streaming</td>
              <td className="p-3 font-mono font-bold text-red-400">DOD</td>
              <td className="p-3 leading-relaxed">Engine must rapidly prepare massive chunks of geometry. L1 cache and DMA layout are critical. <br/><span className="text-kingfisher-muted/70 text-[10px] mt-1 block">Hardware: -1.5GB RAM, -120ms Hitching.</span></td>
              <td className="p-3 leading-relaxed">DirectStorage / World Partition. Data heavily linear matching disk sectors for direct Memory Access (DMA) into VRAM buffers.</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="p-3 font-medium text-white flex items-center gap-2"><Waves className="w-3.5 h-3.5 text-pink-400" /> Audio Mixing</td>
              <td className="p-3 font-mono font-bold text-red-400">DOD</td>
              <td className="p-3 leading-relaxed">One explosion triggers 80 overlapping clips mixed simultaneously. <br/><span className="text-kingfisher-muted/70 text-[10px] mt-1 block">Hardware: -2.1ms CPU (Background Thread Ops).</span></td>
              <td className="p-3 leading-relaxed">MetaSounds / Audio channels processed as parallel arrays of raw floating-point waveform data on high-priority Audio hardware thread.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="The One-Way Architectural Barrier" icon={Shield} color={COLORS.kingfisher.warm} id="one-way-barrier">
        <p className="font-semibold text-white">How the Two Sides Communicate</p>
        <p className="mt-2 text-sm text-kingfisher-muted/90 mb-3">
          The biggest challenge in a hybrid architecture is preventing the OOP side from breaking the performance layout of the DOD side.
        </p>

        <div className="flex flex-col gap-3">
          <div className="bg-black/30 border border-red-500/20 p-3 rounded-lg flex gap-3 items-start">
            <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-red-400 block mb-1">Forbidden Direct Calls</strong>
              <p className="text-kingfisher-muted">DOD systems never talk directly to OOP objects. A high-speed projectile loop should <span className="text-white font-bold opacity-80">never</span> call <code>Player{'>'}PlaySound()</code>, which trashes L1 instruction caches.</p>
            </div>
          </div>

          <div className="bg-black/40 border border-emerald-500/30 p-3 rounded-lg flex gap-3 items-start">
             <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
             <div className="text-xs">
               <strong className="text-emerald-400 block mb-1">Command Buffers & Queues</strong>
               <p className="text-kingfisher-muted">When a projectile hits, it drops a <code className="text-purple-300">ExplosionData</code> packet into a flat <code>std::vector</code> / <code>TArray</code> buffer.</p>
               <div className="mt-2 bg-black/50 p-2 rounded border border-white/5 font-mono text-[10px] text-emerald-200/70">
                 [Explosion ID: 44] -{'>'} [ExplosionEventQueue]
               </div>
               <p className="mt-2 text-kingfisher-muted">The slower OOP layer (AudioPlayer) polls the queue at the <span className="text-white opacity-80">end of the frame</span>, isolates 80 explosion packets, and triggers sound cues batched natively.</p>
             </div>
          </div>
        </div>

        <MultiplayerImpact 
          gpu="0.0ms Offset" 
          cpu="-4.2ms Savings (No L1 L2 cache misses)" 
          ram="+1.2MB (Event Packets)" 
          latency="-20ms Stutter reduction" 
        />
      </SectionCard>

      <SectionCard title="The Golden Rule: Ban Event Tick" icon={Clock} color={COLORS.kingfisher.warm}>
        <p className="font-semibold text-white">Event-Driven Architecture Only</p>
        <p className="mt-2 text-sm">Ban Event Tick on 99% of classes. Turn off <code>Start with Tick Enabled</code>. CPU is almost always the bottleneck due to accumulated per-frame logic.</p>
        
        <FeatureMatrix 
          has={[
            "Global Delegate Managers",
            "Blueprint Implementable Events (OnHit)",
            "Actor Component overriding tick rules"
          ]}
          missing={[
            "Automated compiler warnings for heavy node ticks",
            "DOD / ECS arrays as out-of-box defaults"
          ]}
          howToUse="Enforce FComponentTickFunction::bCanEverTick = false. Use TMulticastDelegate to broadcast state swaps globally."
        />

        <div className="mt-4 p-3 bg-black/30 rounded border border-purple-500/20">
          <strong className="text-purple-400 text-xs">Architecture Hub:</strong> Use decoupled Multi-Cast Delegates. Emit signals like <code>"ITEM_LOOTED"</code>.
        </div>
      </SectionCard>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <SectionCard title="Garbage Collection & Object Clustering" icon={Database} color={COLORS.status.success}>
        <p className="font-semibold text-white">Never Destroy What You Can Recycle</p>
        <p className="mt-2 text-sm text-kingfisher-muted text-xs mb-3">Destroy triggers GC sweeps cause 2–5ms hitches. Use <code>FGCCluster</code> and pure Object pooling to bypass the massive OS level memory free() stall.</p>
        
        <FeatureMatrix 
          has={[
            "FGCCluster API (Batch objects for 1 GC validation)",
            "Subsystem Object Pooling interfaces",
            "Incremental Garbage Collection sweeping"
          ]}
          missing={[
            "Automatic runtime pooling for raw UObjects",
            "O(1) destruction times for nested AActor chains"
          ]}
          howToUse="Pre-allocate arrays. Override EndPlay to hide meshes & disable collision, placing them in an InactivePool array rather than calling Destroy()."
        />
        
        <div className="mt-3 p-3 bg-emerald-500/5 rounded border border-emerald-500/20 text-xs text-kingfisher-muted">
          <strong className="text-emerald-400 mb-1 block">Hardware Metric:</strong> Grouping 1,000 sub-items {'->'} 1 cluster validation. <br/>Saves <strong className="text-white">+2.5ms</strong> background sweep time across cores. Reduces micro-stutter latency by <strong className="text-white drop-shadow-md">~18ms</strong> during large scale zone destruction.
        </div>
      </SectionCard>

      <SectionCard title="Multi-Platform & Mobile Memory Logic" icon={Smartphone} color={COLORS.kingfisher.blue}>
        <p className="text-sm text-kingfisher-muted mb-4 leading-relaxed">
          On Android/Mobile, <strong>VRAM is shared RAM</strong>. Native UE overhead is ~350MB, but large textures and skeletal mesh LODs can blow budgets rapidly.
        </p>
          <MultiplayerImpact 
            gpu="High (Thermal Limit)" 
            cpu="Medium (Wait on I/O)" 
            ram="< 1.5GB Total" 
            latency="+15ms Touch Delay" 
          />
        
        <div className="mt-4">
          <FeatureMatrix 
            has={[
              "Mobile Render Pass (Forward/Deffered)",
              "Texture Compression (ETC2/ASTC)",
              "Automatic Mesh LODing"
            ]}
            missing={[
              "Real-time GC Profiling on Device",
              "Auto-Resolution Thermal Scaling",
              "Predictive VRAM swapping"
            ]}
            howToUse="Set `r.Mobile.DisableVertexFog=1` and `r.Mobile.MaxMovableSpotLights=1` for stable Android performance."
          />
        </div>
      </SectionCard>
    </div>
  </div>
);

