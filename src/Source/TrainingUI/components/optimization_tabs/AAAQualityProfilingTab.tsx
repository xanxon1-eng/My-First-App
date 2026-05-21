import React, { useState } from 'react';
import { 
  CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, 
  Shield, CircleDashed, Activity, Zap, Play, RotateCcw, AlertTriangle, 
  Terminal, BarChart3, Sliders, Server, Code, Layers, FileText
} from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock, Collapsible } from './OptimizationHelpers';

interface Scenario {
  id: string;
  name: string;
  gameSource: string;
  description: string;
  unoptimized: {
    cpu: number;
    gpu: number;
    ram: number;
    vram: number;
    latency: number;
  };
  optimizations: {
    id: string;
    label: string;
    impactCpu: number;
    impactGpu: number;
    impactRam: number;
    impactVram: number;
    impactLatency: number;
    detail: string;
  }[];
  diagnostics: string;
}

const REALISTIC_SCENARIOS: Scenario[] = [
  {
    id: 'witcher_streaming',
    name: 'Witcher 3-Style Novigrad Fast-Streaming Bottleneck',
    gameSource: 'Inspired by The Witcher 3: Wild Hunt',
    description: 'High-speed horse gallop through Oxenfurt into Novigrad triggers deep level-streaming disk access. Standard synchronous asset hits stall the Game Thread, dropping frames from 60 FPS to 18 FPS.',
    unoptimized: { cpu: 28.5, gpu: 8.2, ram: 7.2, vram: 4.1, latency: 0 },
    optimizations: [
      {
        id: 'async_stream',
        label: 'Asynchronous Async Stream Loading (FStreamableManager)',
        impactCpu: -10.5,
        impactGpu: 0.8,
        impactRam: -0.4,
        impactVram: 0,
        impactLatency: 0,
        detail: 'Moves raw disk reads to asynchronous IO worker threads, completely decoupling loading hits from the Game Thread (saves -10.5ms CPU).'
      },
      {
        id: 'lod_bias',
        label: 'Virtual Texture Streaming & Bias Biasing (r.Streaming.LODBias)',
        impactCpu: -1.2,
        impactGpu: -2.3,
        impactRam: -0.8,
        impactVram: -1.2,
        impactLatency: 0,
        detail: 'Aggressively scales loaded MIP-maps of far-off static meshes, saving -1.2GB VRAM and reclaiming valuable GPU memory bandwidth.'
      },
      {
        id: 'cell_culling',
        label: 'World Partition Cell Load Bubbles Scaling',
        impactCpu: -4.4,
        impactGpu: -1.1,
        impactRam: -1.2,
        impactVram: -0.6,
        impactLatency: 0,
        detail: 'Narrows the dynamic loading radius from 450 meters to 250 meters. Restricts active chunk counts and decreases CPU tracking loads (saves -4.4ms CPU).'
      }
    ],
    diagnostics: 'Launch viewport with `-trace=cpu,loadtime,memory`. Search Unreal Insights Asset Loading Timeline. Look for `BlockingLoad` calls on the Game Thread exceeding 16.6ms.'
  },
  {
    id: 'bg3_npc_tick',
    name: 'Baldur\'s Gate 3-Style Act III Crowd Tick Avalanche',
    gameSource: 'Inspired by Baldur\'s Gate 3',
    description: 'Entering the lower city with 120+ active civilian NPCs. Running full generic actor tick loops (behavior state machines, animation updates, ik bounds) oversaturates the single-threaded CPU Game Thread.',
    unoptimized: { cpu: 44.2, gpu: 7.4, ram: 5.8, vram: 2.3, latency: 15 },
    optimizations: [
      {
        id: 'significance_manager',
        label: 'Significance Manager Distance Culling',
        impactCpu: -22.4,
        impactGpu: 0.4,
        impactRam: 0,
        impactVram: 0,
        impactLatency: 0,
        detail: 'Completely disables skeleton ticks and culls updates for off-screen or far NPCs, reclaiming -22.4ms of raw Game Thread processing.'
      },
      {
        id: 'tick_batching',
        label: 'Central Subsystem Tick Batching & Tasking',
        impactCpu: -4.8,
        impactGpu: 0,
        impactRam: -0.2,
        impactVram: -0.1,
        impactLatency: 0,
        detail: 'Replaces 120+ independent ticking UObjects with a single vectorized subsystem, reducing reflection loop overhead (saves -4.8ms CPU).'
      },
      {
        id: 'mass_entity',
        label: 'MassEntity (ECS) Crowd Actor Offloading',
        impactCpu: -11.6,
        impactGpu: -0.5,
        impactRam: -0.6,
        impactVram: -0.2,
        impactLatency: 0,
        detail: 'Packs civilian translation, pathing, and rendering arrays into contiguous memory chunks, boosting CPU cache hits (saves -11.6ms CPU).'
      }
    ],
    diagnostics: 'Execute `stat game` and inspect `SkeletalMeshComponent_Tick` activity. Trace frame scopes using Unreal Insights to pinpoint thread stall timings.'
  },
  {
    id: 'poe_spell_burst',
    name: 'Path of Exile-Style 120+ Spell-Burst Combat Spill',
    gameSource: 'Inspired by Path of Exile',
    description: 'Encountering extreme endgame clusters. Hundreds of overlapping elemental status triggers, particle mesh loops, dynamic damage calculations, and RPC packets cause severe Game Thread hitches and 300ms server ping rubberbands.',
    unoptimized: { cpu: 38.5, gpu: 19.8, ram: 4.8, vram: 2.9, latency: 280 },
    optimizations: [
      {
        id: 'spatial_hash',
        label: 'O(1) Spatial Hash Broadphase Collision Filtering',
        impactCpu: -16.5,
        impactGpu: 0,
        impactRam: 0.1,
        impactVram: 0,
        impactLatency: -20,
        detail: 'Replaces slow O(N^2) overlap physics evaluations with static hash lookup maps, freeing -16.5ms CPU and halting game-tick congestions.'
      },
      {
        id: 'rep_dormancy',
        label: 'NetDormancy & RPC Replication QoS Decoupling',
        impactCpu: -4.2,
        impactGpu: -0.8,
        impactRam: -0.3,
        impactVram: -0.1,
        impactLatency: -190,
        detail: 'Caps network replication bandwidth, queues cosmetic items on lowest priority bands, and drops client-server response latency by -190ms.'
      },
      {
        id: 'server_rewind',
        label: 'Server-Side Lag Rewind & Trace Pooling',
        impactCpu: -6.4,
        impactGpu: -1.2,
        impactRam: -0.2,
        impactVram: 0,
        impactLatency: -45,
        detail: 'Leverages high-performance transform ring arrays to compute hit registrations against historic player states out-of-band (saves -6.4ms CPU).'
      }
    ],
    diagnostics: 'Monitor Packet Queues inside Network Insights. Check `Net GUID` cache miss allocations in the trace viewer to pinpoint RPC packet spikes.'
  }
];

export const AAAQualityProfilingTab = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(REALISTIC_SCENARIOS[0].id);
  const [activeOptimizations, setActiveOptimizations] = useState<Record<string, boolean>>({});

  const scenario = REALISTIC_SCENARIOS.find(s => s.id === selectedScenarioId) || REALISTIC_SCENARIOS[0];

  const handleScenarioChange = (id: string) => {
    setSelectedScenarioId(id);
    setActiveOptimizations({});
  };

  const handleToggleOpt = (id: string) => {
    setActiveOptimizations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Compute live telemetry results based on active optimizations
  let currentCpu = scenario.unoptimized.cpu;
  let currentGpu = scenario.unoptimized.gpu;
  let currentRam = scenario.unoptimized.ram;
  let currentVram = scenario.unoptimized.vram;
  let currentLatency = scenario.unoptimized.latency;

  scenario.optimizations.forEach(opt => {
    if (activeOptimizations[opt.id]) {
      currentCpu = Math.max(1.5, currentCpu + opt.impactCpu);
      currentGpu = Math.max(1.5, currentGpu + opt.impactGpu);
      currentRam = Math.max(0.1, currentRam + opt.impactRam);
      currentVram = Math.max(0.1, currentVram + opt.impactVram);
      currentLatency = Math.max(0, currentLatency + opt.impactLatency);
    }
  });

  // Target lines
  const isCpuTargetMet = currentCpu <= 16.67;
  const isGpuTargetMet = currentGpu <= 16.67;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="AAA Quality Profiling & Diagnostic Suites" 
        subtitle="Deep multi-threaded tracing, timeline micro-dissection, and real-time hardware telemetry analyzers modeled for high-fidelity open world RPGs." 
      />

      <HighlightBox type="success" className="my-4">
        <div className="flex items-center gap-2 mb-2">
          <GitBranch className="w-4 h-4 text-emerald-400" />
          <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">AAA Diagnostic Principle</strong>
        </div>
        <p className="text-emerald-100/90 text-sm italic">
          Prioritize asynchronous stack sample tracers over heavy instrumentation hooks. Real hardware performance must be profiled on target configurations utilizing non-intrusive tracing buffer rings, ensuring diagnostic procedures do not induce false artificial pipeline stalls.
        </p>
      </HighlightBox>

      {/* INTERACTIVE WORKBENCH */}
      <div className="bg-kingfisher-panel/90 border border-kingfisher-border rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 bg-blue-500/10 text-blue-400 border-l border-b border-kingfisher-border text-[9px] font-mono uppercase tracking-widest rounded-bl-xl font-bold flex items-center gap-1.5">
          <Terminal className="w-3" /> Live Simulator Workbench
        </div>

        <h3 className="text-white text-lg font-bold tracking-wide mb-2 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-400" /> AAA Real-Time Hardware Profiler & Sandbox
        </h3>
        <p className="text-kingfisher-muted text-xs mb-6">
          Toggle diagnostic scripts and structural C++ alignment modifications. Observe live metrics recalculations mapped to CPU timers, G-Buffer raster threads, physics hashes, memory buffers, and packet ping buffers.
        </p>

        {/* TOP SCENARIO SELECTOR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 bg-black/40 p-2 rounded-xl border border-white/5">
          {REALISTIC_SCENARIOS.map(item => (
            <button
              key={item.id}
              onClick={() => handleScenarioChange(item.id)}
              className={`p-3 rounded-lg text-left transition-all ${
                selectedScenarioId === item.id 
                  ? 'bg-blue-500/20 border border-blue-500/40 text-white' 
                  : 'hover:bg-white/5 border border-transparent text-kingfisher-muted'
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-wider mb-0.5 text-blue-400">{item.gameSource}</div>
              <div className="text-sm font-semibold truncate leading-tight">{item.name.split('-Style')[0]} Setup</div>
            </button>
          ))}
        </div>

        {/* SIMULATOR LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* LEFT PANEL: INPUT CHANNELS */}
          <div className="xl:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-kingfisher-muted/80 flex items-center justify-between border-b border-white/5 pb-2">
                <span>System Context Description</span>
                <span className="text-[10px] text-amber-500 font-mono">&#x26A0; Bottleneck Active</span>
              </div>
              <p className="text-xs text-kingfisher-muted leading-relaxed">
                {scenario.description}
              </p>
              <div className="p-2.5 bg-black/40 rounded border border-yellow-500/10 text-[11px] text-yellow-400/90 font-mono leading-tight">
                <strong>Console Diagnostic Hook:</strong><br />
                {scenario.diagnostics}
              </div>
            </div>

            {/* OPTIMIZATION TOGGLES */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-kingfisher-muted/80 block">Select C++ & Compiler Optimizations:</span>
              {scenario.optimizations.map(opt => {
                const isSelected = activeOptimizations[opt.id] || false;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleToggleOpt(opt.id)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-colors ${
                      isSelected 
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-100 hover:bg-emerald-500/15'
                        : 'bg-black/30 border-white/5 hover:bg-white/5 text-kingfisher-muted hover:text-white'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isSelected ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-white/30 shrink-0" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-xs font-bold leading-none">{opt.label}</div>
                      <p className="text-[11px] opacity-70 leading-relaxed font-sans">{opt.detail}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL: TELEMETRY GAUGES */}
          <div className="xl:col-span-7 flex flex-col justify-between bg-black/30 border border-white/5 p-5 rounded-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-kingfisher-muted flex items-center gap-1">
                <Activity className="w-3 h-3 text-red-400 animate-pulse" /> Virtual Insights Frame Telemetry
              </span>
              <button 
                onClick={() => setActiveOptimizations({})}
                className="text-[10px] uppercase font-mono text-kingfisher-muted/60 hover:text-white bg-white/5 px-2 py-1 rounded border border-white/5 hover:border-white/20 transition-all flex items-center gap-1"
              >
                <RotateCcw className="w-2.5 h-2.5" /> Full Reset
              </button>
            </div>

            {/* PERFORMANCE METRICS CHANNELS */}
            <div className="space-y-4">
              {/* CPU WORKLOAD BAR */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-amber-400" /> CPU Game Thread Frame Time
                  </span>
                  <span className={`font-mono text-sm font-bold ${isCpuTargetMet ? 'text-emerald-400' : 'text-red-400'}`}>
                    {currentCpu.toFixed(1)} ms {isCpuTargetMet ? '(Stably Locked)' : '(Stutter Frame Spike)'}
                  </span>
                </div>
                <div className="h-2.5 w-full bg-black/80 rounded-full overflow-hidden border border-white/5 relative">
                  <div 
                    className={`h-full transition-all duration-300 rounded-full ${isCpuTargetMet ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, (currentCpu / 50) * 100)}%` }}
                  />
                  {/* 16.6ms standard budget line */}
                  <div className="absolute left-[33.3%] top-0 h-full w-[2px] bg-yellow-500/60" title="16.67ms (60 FPS Limit)" />
                </div>
                <div className="flex justify-between text-[9px] text-kingfisher-muted/70 font-mono">
                  <span>0ms</span>
                  <span>16.67ms (60 FPS Budget Limit)</span>
                  <span>50ms Target Max</span>
                </div>
              </div>

              {/* GPU G-BUFFER RASTER BAR */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-blue-400" /> GPU Renderer Raster Capacity
                  </span>
                  <span className={`font-mono text-sm font-bold ${isGpuTargetMet ? 'text-blue-400' : 'text-purple-400'}`}>
                    {currentGpu.toFixed(1)} ms
                  </span>
                </div>
                <div className="h-2.5 w-full bg-black/80 rounded-full overflow-hidden border border-white/5 relative">
                  <div 
                    className="h-full transition-all duration-300 rounded-full bg-blue-500"
                    style={{ width: `${Math.min(100, (currentGpu / 30) * 100)}%` }}
                  />
                  {/* 16.6ms standard budget line */}
                  <div className="absolute left-[55.5%] top-0 h-full w-[2px] bg-yellow-500/60" title="16.67ms (60 FPS Limit)" />
                </div>
                <div className="flex justify-between text-[9px] text-kingfisher-muted/70 font-mono">
                  <span>0ms</span>
                  <span>16.67ms (60 FPS Budget Limit)</span>
                  <span>30ms Target Max</span>
                </div>
              </div>

              {/* RAM, VRAM, NETWORK PING TRIPLE COLUMN */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Database className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[10px] font-bold uppercase text-kingfisher-muted">System Heap RAM</span>
                  </div>
                  <div className="text-base font-mono font-bold text-white mb-0.5">{currentRam.toFixed(2)} GB</div>
                  <div className="text-[10px] text-kingfisher-muted/60">Dynamic Host Footprint</div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <HardDrive className="w-3.5 h-3.5 text-pink-400" />
                    <span className="text-[10px] font-bold uppercase text-kingfisher-muted">GPU VRAM Usage</span>
                  </div>
                  <div className="text-base font-mono font-bold text-white mb-0.5">{currentVram.toFixed(2)} GB</div>
                  <div className="text-[10px] text-kingfisher-muted/60">G-Buffer & Texture Allocation</div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Radio className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase text-kingfisher-muted">Client-Server Ping</span>
                  </div>
                  <div className="text-base font-mono font-bold text-white mb-0.5">{currentLatency} ms</div>
                  <div className="text-[10px] text-kingfisher-muted/60">Network Latency Jitter</div>
                </div>
              </div>
            </div>

            {/* LIVE CONTEXT LOGS */}
            <div className="mt-5 p-3.5 rounded-xl bg-black/60 border border-white/5">
              <div className="text-[10px] font-mono text-emerald-400 mb-1.5 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                <span>DYNAMIC TELEMETRY VERIFICATION FRAMEWORK LOG...</span>
              </div>
              <div className="font-mono text-xs text-kingfisher-muted space-y-1">
                <div>&gt; Frame Time Result: {(Math.max(currentCpu, currentGpu)).toFixed(2)} ms ({(1000 / Math.max(currentCpu, currentGpu)).toFixed(0)} FPS Virtual Target Rate)</div>
                {isCpuTargetMet && isGpuTargetMet ? (
                  <div className="text-emerald-400 font-semibold">&gt; SUCCESS: Hardware loads meet strict 16.67ms frame budgets! Smooth gameplay achieved.</div>
                ) : (
                  <div className="text-red-400 font-semibold">&gt; WARNING: Unresolved rendering or CPU thread hitches crossing 16.67ms. Optimization required.</div>
                )}
                <div className="text-[10px] text-kingfisher-muted/40 font-mono">&gt; Witcher 3/PoE/BG3 diagnostic pipelines validated successfully.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED DIAGNOSTIC MODULES */}
      <h3 className="text-white text-lg font-bold tracking-wide mt-8 pl-1">
        Deep-Dive Core Diagnostic Chapters
      </h3>

      {/* TOPIC 1: GARBAGE COLLECTION */}
      <Collapsible 
        title="Chapter 1: Memory & Asset Tracing (Garbage Collection Stalls)" 
        icon={Database} 
        color={COLORS.status.success}
        badge="Memory Allocs"
      >
        <div className="space-y-4">
          <p className="text-sm text-kingfisher-muted leading-relaxed">
            In deep RPG architectures (such as loading hundreds of tooltip boxes on an inventory chest containting 500+ items akin to <em>Baldur's Gate 3</em>), the engine generates huge heaps of temporary structures. This triggers a mark-sweep garbage collection pass that freezes the game thread for up to <strong>15.0ms</strong>.
          </p>

          <MultiplayerImpact 
            gpu="0.0ms (Telemetry is purely CPU/RAM trace-based)" 
            cpu="-3.2ms (Resolving garbage cycles eliminates sudden 15ms frame spikes)" 
            ram="Saves -450MB Heap (Preallocating garbage-safe arrays blocks leaking variables)" 
            vram="Saves -120MB (By aggressively cleaning up dynamic material instance references)" 
            latency="Prevents packet drops (retains constant server Game Thread tick rate)" 
          />

          <FeatureMatrix 
            has={[
              "Clustered Garbage Collection (gc.CreateGCClusters=1 to group passive assets)",
              "Unreal Insights Memory allocator tracing (tracking allocation histories)",
              "Memreport dumps (command line dump parameters for UObject counting)"
            ]}
            missing={[
              "Automatic static reflection UPROPERTY memory leak scanner (forces manual tree evaluations)",
              "Out-of-the-box hot reload serialization checkers"
            ]}
            howToUse="Trace garbage leaks by querying memory counts. Launch utilizing cooked configs with command arguments `-trace=memory`. Use `gc.ForceCollectGarbageEveryFrame` during profiling sandbox stages to target raw load boundaries."
          />

          <h4 className="text-white text-xs font-bold uppercase tracking-wider mt-4">Production-Grade C++ Struct Alignment (Avoid Stalls):</h4>
          <CodeBlock 
            language="cpp"
            code={`// Struct fields grouped biggest to smallest to eliminate compiler padding leaks and optimize CPU cache timing.
// Avoids memory bloating in large arrays (e.g. 100k RPG item records).
USTRUCT(BlueprintType)
struct FRpgInventoryItemRecord
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "RPG Tooling")
    UTexture2D* PrimaryIconAsset; // 8 bytes (Pointer)

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "RPG Tooling")
    int64 UniqueDatabaseUID; // 8 bytes (Integer)

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "RPG Tooling")
    float BaseDurabilityCoefficient; // 4 bytes (Floating point)

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "RPG Tooling")
    int32 AbsoluteCopperValue; // 4 bytes (Integer)

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "RPG Tooling")
    uint8 ItemQualityRarityClass; // 1 byte (Byte indicator)

    // Implicit compiler pad bytes are reduced to 0, safeguarding RAM cache retrieval speeds!
};`}
          />
        </div>
      </Collapsible>

      {/* TOPIC 2: GPU FRAME DISSECTION */}
      <Collapsible 
        title="Chapter 2: RenderDoc & GPU Frame Dissection (G-Buffer & Overdraw Shader Bottlenecks)" 
        icon={Monitor} 
        color={COLORS.kingfisher.blue}
        badge="GPU Shaders"
      >
        <div className="space-y-4">
          <p className="text-sm text-kingfisher-muted leading-relaxed">
            Dense foliage assemblies inside <em>The Witcher 3</em> or active particle-dense spell rings in <em>Path of Exile</em> trigger extremely high overdraw counts. Drawing 8 overlapping semi-transparent pixel planes over the same viewport coordinate drops pixel speeds on graphics engines, overloading dynamic G-Buffers.
          </p>

          <MultiplayerImpact 
            gpu="-6.5ms (By replacing transparent screen overdraws with lightweight volumetric vectors)" 
            cpu="-1.2ms (Reduces draw call registration sequences on render pipelines)" 
            ram="+12MB (PSO pipeline compilations caches)" 
            vram="Saves -850MB (Using virtual texture streaming pools)" 
            latency="0ms (Local hardware execution dependent)" 
          />

          <FeatureMatrix 
            has={[
              "ProfileGPU console dissection interface (Ctrl+Shift+Comma frame capture)",
              "Render Dependency Graph (RDG) pipeline mapping",
              "Material Analyzer window tools to pinpoint heavy pixel shader nodes"
            ]}
            missing={[
              "Automatic out-of-the-box multi-platform shader assembly timing maps",
              "Low-level raytracing shader instruction profiling diagnostics natively"
            ]}
            howToUse="Capture frame segments using RenderDoc or Unreal GPU Visualizer. Map G-Buffer categories in the tree. Target expensive slots, such as BasePass and ShadowDepths bottlenecks."
          />

          <h4 className="text-white text-xs font-bold uppercase tracking-wider mt-4">C++ Asynchronous Render Task Example:</h4>
          <CodeBlock 
            language="cpp"
            code={`// Uses Unreal RDG (Render Dependency Graph) to feed custom pixel-mask matrices as asynchronous threads.
void FRpgBufferComputeModule::RenderMaskBuffer_RenderThread(FRHICommandListImmediate& RHICmdList, const FSceneView& View)
{
    FRDGBuilder GraphBuilder(RHICmdList);

    // Initializing high-performance G-Buffer textures
    FRDGTextureDesc DynamicTextureDesc = FRDGTextureDesc::Create2D(
        View.ConstraintRect.Size(), PF_FloatRGBA, FClearValueBinding::Black,
        TexCreate_ShaderResource | TexCreate_RenderTargetable
    );
    FRDGTexture* CustomMaskRDGTexture = GraphBuilder.CreateTexture(DynamicTextureDesc, TEXT("RPGMaskTexture"));

    // Contriving safe asynchronously executed pass metrics
    GraphBuilder.AddPass(
        RDG_EVENT_NAME("RPGPixelMaskOverdrawClear"),
        ERDGPassFlags::Raster,
        [CustomMaskRDGTexture](FRHICommandListImmediate& RHICmdListImmediate)
        {
            // Execute specialized bare metal drawing calls directly, bypassing CPU overhead loops!
        }
    );

    GraphBuilder.Execute();
}`}
          />
        </div>
      </Collapsible>

      {/* TOPIC 3: DEDICATED SERVER NETWORK INSIGHTS */}
      <Collapsible 
        title="Chapter 3: Dedicated Server Network Insights & RPC Load Profiling (Replication Queues)" 
        icon={Server} 
        color={COLORS.kingfisher.warm}
        badge="Dedicated Server"
      >
        <div className="space-y-4">
          <p className="text-sm text-kingfisher-muted leading-relaxed">
            Multiplayer action RPGs tracing 100+ enemies concurrently replicate hundreds of variables over the wire (combat damages, movement arrays, spell positions, active buffs). Flooding server interfaces triggers RPC bufferbloat. This creates severe desync rubberbanding, raising network ping queues from <strong>40ms to 320ms</strong>.
          </p>

          <MultiplayerImpact 
            gpu="0ms (Server side execution processes)" 
            cpu="-5.4ms (By utilizing Replication Graph grids to process actor dormancy sweeps)" 
            ram="+120MB (Replication cache maps on hosts)" 
            vram="0ms (No server-side physics-render overhead)" 
            latency="Saves -240ms Latency (Aggressively bounds RPC ticks to only local screen spaces)" 
          />

          <FeatureMatrix 
            has={[
              "Unreal Network Insights tracking (Packet Profiler session tracer)",
              "Replication Graph hierarchies for specialized grids",
              "NetDormancy console controls to toggle idle status loops"
            ]}
            missing={[
              "Dynamic dynamic server tick culling based on active connection speed bottlenecks",
              "Out-of-the-box multi-region cluster server simulation tests inside local sandboxes"
            ]}
            howToUse="Diagnose network pipelines by launching with `-trace=net`. Trace packet flow frequencies inside Unreal Network Insights. Maintain net transfer budgets below 4.0KB/sec per connected client."
          />

          <h4 className="text-white text-xs font-bold uppercase tracking-wider mt-4">High-Performance Replication Dormancy Triggering (C++):</h4>
          <CodeBlock 
            language="cpp"
            code={`// Implements dynamic net dormancy for passive loot chest actors.
// Disables dynamic update loops unless opened, conserving network traffic.
void ARpgWorldLootLocker::SetLockerInteractiveState(bool bIsInteractive)
{
    if (HasAuthority())
    {
        if (bIsInteractive)
        {
            // Wake actor from network sleep to replicate updated inventories
            FlushNetDormancy();
            SetReplicates(true);
            ForceNetUpdate();
        }
        else
        {
            // Enter immediate network sleep structure. Consumes 0 net tick cycles!
            SetNetDormancy(DORM_Initial);
            SetReplicatedHasBegunPlay(false);
        }
    }
}`}
          />
        </div>
      </Collapsible>

      {/* TOPIC 4: BINARY SERIALIZATION */}
      <Collapsible 
        title="Chapter 4: FArchive Binary Save Stream Profiling (BG3 / Witcher 3 Save-Game Serialization)" 
        icon={FileText} 
        color={COLORS.status.warning}
        badge="Serialization"
      >
        <div className="space-y-4">
          <p className="text-sm text-kingfisher-muted leading-relaxed">
            Giant open world RPG state files storing quest progress, active map properties, millions of item inventories, and world coordinate states can exceed 20MB. Standard reflection-based JSON/XML saving architectures stall the Game Thread, inducing a massive <strong>400ms</strong> disk-write hitch.
          </p>

          <MultiplayerImpact 
            gpu="0ms" 
            cpu="-12.5ms (By serializing to bare-metal memory out-of-band)" 
            ram="-150MB GC overhead memory allocations (Bypasses slow dynamic string pools)" 
            vram="0ms" 
            latency="Prevents socket timeouts (Allows server processes to tick stably during automatic backups)" 
          />

          <FeatureMatrix 
            has={[
              "FArchive reflection streaming pipelines",
              "SaveGame infrastructure models and classes",
              "Compressed binary streams (FArchiveSaveCompressed)"
            ]}
            missing={[
              "Zero-copy direct-to-disk binary arrays natively mapped to struct fields",
              "Dynamic save state change-delta mappers (requires custom save logs)"
            ]}
            howToUse="Format save state serialization pipelines with custom `operator<<` rules. Wrap storage writes inside parallel workers using asynchronous task frameworks to preserve game loop performance."
          />

          <h4 className="text-white text-xs font-bold uppercase tracking-wider mt-4">Unreal Engine Byte-Aligned FArchive Serialization Example:</h4>
          <CodeBlock 
            language="cpp"
            code={`// Highly optimized, zero-copy custom FArchive serialization stream.
// Avoids UProperty reflection overhead. Loads dynamic profiles under 2ms.
void FRpgQuestStateTracker::SerializeQuestProgressBuffer(FArchive& Ar)
{
    // Serialize total entries. Operates as writer (disk save) or reader (disk load).
    int32 ActiveQuestTaskCount = QuestProgressMap.Num();
    Ar << ActiveQuestTaskCount;

    for (auto& QuestEntry : QuestProgressMap)
    {
        // 1. Serialize index values
        int32 QuestStepID = QuestEntry.Key;
        Ar << QuestStepID;

        // 2. Serialize complete state status using custom raw byte alignment rules
        FRpgQuestStepMetadata& StepRecord = QuestEntry.Value;
        
        Ar << StepRecord.bStepCompleted;
        Ar << StepRecord.TimestampAbsolute;
        Ar << StepRecord.ObjectiveCounter;

        // Saves and loads instantly by writing contiguous raw primitive variables to the disk stream!
    }
}`}
          />
        </div>
      </Collapsible>
    </div>
  );
};
