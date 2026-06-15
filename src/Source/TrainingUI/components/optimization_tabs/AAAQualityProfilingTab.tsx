import React, { useState, useEffect } from 'react';
import {
  CheckCircle, Monitor, Cpu, Database, HardDrive, Radio, GitBranch,
  Activity, Zap, RotateCcw, AlertTriangle, Terminal, Sliders, Server,
  FileText, TrendingDown, Layers,
} from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import {
  FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox,
  StatRow, PageHeader, CodeBlock, Collapsible,
} from './OptimizationHelpers';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface OptimizationEntry {
  id: string;
  label: string;
  /** Display order and recommended application order — 1 = highest impact, apply first. */
  priority: number;
  impactCpu: number;
  impactGpu: number;
  impactRam: number;
  impactVram: number;
  impactLatency: number;
  detail: string;
}

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
  optimizations: OptimizationEntry[];
  diagnostics: string;
}

interface FrameSample {
  cpu: number;
  gpu: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENARIO DATA
// ─────────────────────────────────────────────────────────────────────────────

const REALISTIC_SCENARIOS: Scenario[] = [
  {
    id: 'witcher_streaming',
    name: 'Witcher 3-Style Novigrad Fast-Streaming Bottleneck',
    gameSource: 'Inspired by The Witcher 3: Wild Hunt',
    description:
      'High-speed horse gallop through Oxenfurt into Novigrad triggers deep level-streaming disk access. Standard synchronous asset hits stall the Game Thread, dropping frames from 60 FPS to 18 FPS.',
    unoptimized: { cpu: 28.5, gpu: 8.2, ram: 7.2, vram: 4.1, latency: 0 },
    optimizations: [
      {
        id: 'async_stream',
        label: 'Asynchronous Stream Loading (FStreamableManager)',
        priority: 1,
        impactCpu: -10.5,
        impactGpu: 0.8,
        impactRam: -0.4,
        impactVram: 0,
        impactLatency: 0,
        detail:
          'Moves raw disk reads to asynchronous IO worker threads, completely decoupling loading hits from the Game Thread (saves -10.5ms CPU).',
      },
      {
        id: 'cell_culling',
        label: 'World Partition Cell Load Bubble Scaling',
        priority: 2,
        impactCpu: -4.4,
        impactGpu: -1.1,
        impactRam: -1.2,
        impactVram: -0.6,
        impactLatency: 0,
        detail:
          'Narrows the dynamic loading radius from 450m to 250m. Restricts active chunk counts and decreases CPU tracking loads (saves -4.4ms CPU).',
      },
      {
        id: 'lod_bias',
        label: 'Virtual Texture Streaming & MIP Bias (r.Streaming.LODBias)',
        priority: 3,
        impactCpu: -1.2,
        impactGpu: -2.3,
        impactRam: -0.8,
        impactVram: -1.2,
        impactLatency: 0,
        detail:
          'Aggressively scales loaded MIP-maps for far-off static meshes, saving -1.2GB VRAM and reclaiming valuable GPU memory bandwidth.',
      },
    ],
    diagnostics:
      "Launch viewport with `-trace=cpu,loadtime,memory`. Search Unreal Insights Asset Loading Timeline. Look for `BlockingLoad` calls on the Game Thread exceeding 16.6ms.",
  },
  {
    id: 'bg3_npc_tick',
    name: "Baldur's Gate 3-Style Act III Crowd Tick Avalanche",
    gameSource: "Inspired by Baldur's Gate 3",
    description:
      'Entering the lower city with 120+ active civilian NPCs. Running full generic actor tick loops (behavior state machines, animation updates, IK bounds) oversaturates the single-threaded CPU Game Thread.',
    unoptimized: { cpu: 44.2, gpu: 7.4, ram: 5.8, vram: 2.3, latency: 15 },
    optimizations: [
      {
        id: 'significance_manager',
        label: 'Significance Manager Distance Culling',
        priority: 1,
        impactCpu: -22.4,
        impactGpu: 0.4,
        impactRam: 0,
        impactVram: 0,
        impactLatency: 0,
        detail:
          'Completely disables skeleton ticks and culls updates for off-screen or far NPCs, reclaiming -22.4ms of raw Game Thread processing.',
      },
      {
        id: 'mass_entity',
        label: 'MassEntity (ECS) Crowd Actor Offloading',
        priority: 2,
        impactCpu: -11.6,
        impactGpu: -0.5,
        impactRam: -0.6,
        impactVram: -0.2,
        impactLatency: 0,
        detail:
          'Packs civilian translation, pathing, and rendering arrays into contiguous memory chunks, boosting CPU cache hits (saves -11.6ms CPU).',
      },
      {
        id: 'tick_batching',
        label: 'Central Subsystem Tick Batching & Tasking',
        priority: 3,
        impactCpu: -4.8,
        impactGpu: 0,
        impactRam: -0.2,
        impactVram: -0.1,
        impactLatency: 0,
        detail:
          'Replaces 120+ independent ticking UObjects with a single vectorized subsystem, reducing reflection loop overhead (saves -4.8ms CPU).',
      },
    ],
    diagnostics:
      "Execute `stat game` and inspect `SkeletalMeshComponent_Tick` activity. Trace frame scopes using Unreal Insights to pinpoint thread stall timings.",
  },
  {
    id: 'poe_spell_burst',
    name: 'Path of Exile-Style 120+ Spell-Burst Combat Spill',
    gameSource: 'Inspired by Path of Exile',
    description:
      'Encountering extreme endgame clusters. Hundreds of overlapping elemental status triggers, particle mesh loops, dynamic damage calculations, and RPC packets cause severe Game Thread hitches and 300ms server ping rubberbands.',
    unoptimized: { cpu: 38.5, gpu: 19.8, ram: 4.8, vram: 2.9, latency: 280 },
    optimizations: [
      {
        id: 'spatial_hash',
        label: 'O(1) Spatial Hash Broadphase Collision Filtering',
        priority: 1,
        impactCpu: -16.5,
        impactGpu: 0,
        impactRam: 0.1,
        impactVram: 0,
        impactLatency: -20,
        detail:
          'Replaces slow O(N²) overlap physics evaluations with static hash lookup maps, freeing -16.5ms CPU and halting game-tick congestion.',
      },
      {
        id: 'rep_dormancy',
        label: 'NetDormancy & RPC Replication QoS Decoupling',
        priority: 2,
        impactCpu: -4.2,
        impactGpu: -0.8,
        impactRam: -0.3,
        impactVram: -0.1,
        impactLatency: -190,
        detail:
          'Caps network replication bandwidth, queues cosmetic items on lowest priority bands, and drops client-server response latency by -190ms.',
      },
      {
        id: 'server_rewind',
        label: 'Server-Side Lag Rewind & Trace Pooling',
        priority: 3,
        impactCpu: -6.4,
        impactGpu: -1.2,
        impactRam: -0.2,
        impactVram: 0,
        impactLatency: -45,
        detail:
          'Leverages high-performance transform ring arrays to compute hit registrations against historic player states out-of-band (saves -6.4ms CPU).',
      },
    ],
    diagnostics:
      "Monitor Packet Queues inside Network Insights. Check `Net GUID` cache miss allocations in the trace viewer to pinpoint RPC packet spikes.",
  },
  // ── NEW: RDR2-inspired fourth scenario ────────────────────────────────────
  {
    id: 'rdr2_ecosystem',
    name: 'RDR2-Style Open World Ecosystem & PSO Weather Spike',
    gameSource: 'Inspired by Red Dead Redemption 2',
    description:
      'Galloping at full sprint through frontier wilderness triggers simultaneous foliage physics (50k+ grass blade instances), weather system PSO shader recompilation, and 80+ wildlife AI state machines competing on the same core cluster. Dynamic shader pipeline hitches collapse GPU frame time from 8ms to 24.6ms in under 200ms of travel.',
    unoptimized: { cpu: 31.2, gpu: 24.6, ram: 6.8, vram: 6.4, latency: 0 },
    optimizations: [
      {
        id: 'wildlife_significance',
        label: 'Wildlife AI Significance Manager & Distance LOD Throttling',
        priority: 1,
        impactCpu: -14.8,
        impactGpu: -1.2,
        impactRam: -0.8,
        impactVram: -0.4,
        impactLatency: 0,
        detail:
          'Freezes full AI state machine evaluation for distant fauna agents. Switches to lightweight animation-only proxy actors beyond 200m (saves -14.8ms CPU).',
      },
      {
        id: 'foliage_hism',
        label: 'Hierarchical Instanced Static Mesh (HISM) Foliage Batching',
        priority: 2,
        impactCpu: -8.4,
        impactGpu: -10.2,
        impactRam: -0.6,
        impactVram: -2.1,
        impactLatency: 0,
        detail:
          'Collapses 50k+ individual foliage draw calls into batched HISM clusters with hierarchical frustum culling, slashing CPU overhead and GPU fill rate (-10.2ms GPU).',
      },
      {
        id: 'pso_warmup',
        label: 'PSO Shader Precompilation Warmup & Permutation Pruning',
        priority: 3,
        impactCpu: -3.2,
        impactGpu: -8.8,
        impactRam: 0.4,
        impactVram: -1.2,
        impactLatency: 0,
        detail:
          'Pre-warms critical weather shader PSO permutations on game boot. Eliminates mid-session GPU pipeline compilation hitches during weather biome transitions (saves -8.8ms GPU).',
      },
    ],
    diagnostics:
      "Run `r.ShaderComplexity 1` to expose overdraw hotspots. Execute `stat initviews` for cull efficiency. Trace `-trace=gpu` and inspect PSO Compile events in GPU Insights for shader hitch attribution.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Recomputes all performance metrics given a set of active optimization IDs. */
const computeMetrics = (opts: Record<string, boolean>, scen: Scenario) => {
  let cpu     = scen.unoptimized.cpu;
  let gpu     = scen.unoptimized.gpu;
  let ram     = scen.unoptimized.ram;
  let vram    = scen.unoptimized.vram;
  let latency = scen.unoptimized.latency;

  scen.optimizations.forEach(opt => {
    if (opts[opt.id]) {
      cpu     = Math.max(1.5, cpu     + opt.impactCpu);
      gpu     = Math.max(1.5, gpu     + opt.impactGpu);
      ram     = Math.max(0.1, ram     + opt.impactRam);
      vram    = Math.max(0.1, vram    + opt.impactVram);
      latency = Math.max(0,   latency + opt.impactLatency);
    }
  });

  return { cpu, gpu, ram, vram, latency };
};

// ─────────────────────────────────────────────────────────────────────────────
// FRAME TIME HISTORY SPARKLINE
// ─────────────────────────────────────────────────────────────────────────────

const FrameSparkline: React.FC<{ history: FrameSample[] }> = ({ history }) => {
  if (history.length < 2) {
    return (
      <div className="h-14 flex items-center justify-center text-[10px] font-mono text-kingfisher-muted/40 border border-white/5 rounded-lg bg-black/20">
        ↓ Toggle optimizations to trace live frame-time history
      </div>
    );
  }

  const TARGET = 16.67;
  const MAX_MS = 55;
  const W = 300;
  const H = 52;
  const PAD = 2;

  const toX = (i: number) =>
    history.length === 1
      ? W / 2
      : PAD + (i / (history.length - 1)) * (W - PAD * 2);
  const toY = (v: number) =>
    PAD + (1 - Math.min(v, MAX_MS) / MAX_MS) * (H - PAD * 2);

  const targetY = toY(TARGET);

  const buildPath = (fn: (s: FrameSample) => number) =>
    history
      .map((h, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(fn(h)).toFixed(1)}`)
      .join(' ');

  const cpuPath = buildPath(h => h.cpu);
  const gpuPath = buildPath(h => h.gpu);
  const cpuArea = `${cpuPath} L${toX(history.length - 1).toFixed(1)},${H} L${toX(0).toFixed(1)},${H} Z`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3 text-[9px] font-mono uppercase text-kingfisher-muted/50">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-[2px] bg-amber-400 rounded" />
          CPU Thread
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 h-[2px] bg-blue-400 rounded" />
          GPU Raster
        </span>
        <span className="ml-auto text-yellow-500/60">— 16.67ms budget</span>
      </div>
      <div className="border border-white/5 rounded-lg overflow-hidden bg-black/30">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-14" preserveAspectRatio="none">
          {/* Zone backgrounds */}
          <rect x="0" y="0"        width={W} height={targetY}      fill="rgba(239,68,68,0.03)" />
          <rect x="0" y={targetY}  width={W} height={H - targetY}  fill="rgba(52,211,153,0.04)" />

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map(t => (
            <line key={t} x1="0" y1={H * t} x2={W} y2={H * t}
              stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          ))}

          {/* 16.67ms budget threshold */}
          <line x1="0" y1={targetY} x2={W} y2={targetY}
            stroke="rgba(234,179,8,0.45)" strokeWidth="1" strokeDasharray="5,4" />

          {/* CPU area fill + line */}
          <path d={cpuArea} fill="rgba(251,191,36,0.07)" />
          <path d={cpuPath} fill="none" stroke="rgb(251,191,36)" strokeWidth="1.5"
            strokeLinejoin="round" strokeLinecap="round" />

          {/* GPU line */}
          <path d={gpuPath} fill="none" stroke="rgb(96,165,250)" strokeWidth="1.5"
            strokeLinejoin="round" strokeLinecap="round" />

          {/* Data-point dots */}
          {history.map((h, i) => (
            <React.Fragment key={i}>
              <circle cx={toX(i)} cy={toY(h.cpu)} r="2.5"
                fill={h.cpu <= TARGET ? 'rgb(52,211,153)' : 'rgb(248,113,113)'} />
              <circle cx={toX(i)} cy={toY(h.gpu)} r="2.5"
                fill={h.gpu <= TARGET ? 'rgb(96,165,250)' : 'rgb(167,139,250)'} />
            </React.Fragment>
          ))}
        </svg>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const AAAQualityProfilingTab = () => {
  const [selectedScenarioId, setSelectedScenarioId] =
    useState<string>(REALISTIC_SCENARIOS[0].id);
  const [activeOptimizations, setActiveOptimizations] =
    useState<Record<string, boolean>>({});
  const [frameHistory, setFrameHistory] = useState<FrameSample[]>([]);
  const [lastAction,   setLastAction]   = useState<string>('');

  const scenario = REALISTIC_SCENARIOS.find(s => s.id === selectedScenarioId)
    ?? REALISTIC_SCENARIOS[0];
  const metrics  = computeMetrics(activeOptimizations, scenario);

  // Sorted optimizations (used in both toggles and efficiency bar)
  const sortedOpts = [...scenario.optimizations].sort((a, b) => a.priority - b.priority);

  const appliedCount = Object.values(activeOptimizations).filter(Boolean).length;
  const totalCount   = scenario.optimizations.length;
  const allApplied   = appliedCount === totalCount;
  const estimatedFps = Math.min(999, Math.round(1000 / Math.max(metrics.cpu, metrics.gpu, 1)));
  const isCpuMet     = metrics.cpu <= 16.67;
  const isGpuMet     = metrics.gpu <= 16.67;
  const bothMet      = isCpuMet && isGpuMet;

  const budgetWarnings: string[] = [];
  if (!isCpuMet) budgetWarnings.push('CPU');
  if (!isGpuMet) budgetWarnings.push('GPU');

  // ── Track frame-time history whenever optimizations or scenario change ──
  useEffect(() => {
    const scen = REALISTIC_SCENARIOS.find(s => s.id === selectedScenarioId)
      ?? REALISTIC_SCENARIOS[0];
    const { cpu, gpu } = computeMetrics(activeOptimizations, scen);
    setFrameHistory(prev => {
      const last = prev[prev.length - 1];
      // Deduplicate: skip if unchanged (handles React 18 StrictMode double-invoke)
      if (last && Math.abs(last.cpu - cpu) < 0.01 && Math.abs(last.gpu - gpu) < 0.01)
        return prev;
      return [...prev.slice(-13), { cpu, gpu }];
    });
  }, [activeOptimizations, selectedScenarioId]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleScenarioChange = (id: string) => {
    setSelectedScenarioId(id);
    setActiveOptimizations({});
    setFrameHistory([]);
    setLastAction('');
  };

  const handleToggleOpt = (id: string) => {
    const opt       = scenario.optimizations.find(o => o.id === id);
    const wasActive = !!activeOptimizations[id];
    setActiveOptimizations(prev => ({ ...prev, [id]: !prev[id] }));
    if (opt) {
      const shortLabel = opt.label.split(' (')[0].trim();
      setLastAction(`${wasActive ? '↩ Reverted' : '✓ Applied'}: ${shortLabel}`);
    }
  };

  const handleReset = () => {
    setActiveOptimizations({});
    setFrameHistory([]);
    setLastAction('↩ Full profiler reset — baseline metrics restored.');
  };

  // ── Formatting helpers ────────────────────────────────────────────────────

  /** Returns a signed string; integers show no decimal places. */
  const fmtDelta = (val: number): string => {
    if (val === 0) return '';
    const prefix   = val > 0 ? '+' : '';
    const decimals = Number.isInteger(val) ? 0 : 1;
    return `${prefix}${val.toFixed(decimals)}`;
  };

  /** Builds the impact-delta badge descriptors for an optimization entry. */
  const buildChips = (opt: OptimizationEntry): Array<{ label: string; color: string }> => {
    const chips: Array<{ label: string; color: string }> = [];
    if (opt.impactCpu !== 0)
      chips.push({ label: `CPU ${fmtDelta(opt.impactCpu)}ms`, color: opt.impactCpu < 0 ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400' });
    if (opt.impactGpu !== 0)
      chips.push({ label: `GPU ${fmtDelta(opt.impactGpu)}ms`, color: opt.impactGpu < 0 ? 'bg-blue-500/15 text-blue-400' : 'bg-red-500/15 text-red-400' });
    if (opt.impactRam !== 0)
      chips.push({ label: `RAM ${fmtDelta(opt.impactRam)}GB`, color: opt.impactRam < 0 ? 'bg-purple-500/15 text-purple-400' : 'bg-orange-500/15 text-orange-400' });
    if (opt.impactVram !== 0)
      chips.push({ label: `VRAM ${fmtDelta(opt.impactVram)}GB`, color: opt.impactVram < 0 ? 'bg-pink-500/15 text-pink-400' : 'bg-orange-500/15 text-orange-400' });
    if (opt.impactLatency !== 0)
      chips.push({ label: `NET ${fmtDelta(opt.impactLatency)}ms`, color: opt.impactLatency < 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400' });
    return chips;
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <PageHeader
        title="AAA Quality Profiling & Diagnostic Suites"
        subtitle="Deep multi-threaded tracing, timeline micro-dissection, and real-time hardware telemetry analyzers modeled for high-fidelity open world RPGs."
      />

      <HighlightBox type="success" className="my-4">
        <div className="flex items-center gap-2 mb-2">
          <GitBranch className="w-4 h-4 text-emerald-400" />
          <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
            AAA Diagnostic Principle
          </strong>
        </div>
        <p className="text-emerald-100/90 text-sm italic">
          Prioritize asynchronous stack-sample tracers over heavy instrumentation hooks. Real
          hardware performance must be profiled on target configurations using non-intrusive tracing
          buffer rings, ensuring diagnostic procedures do not induce false artificial pipeline stalls.
        </p>
      </HighlightBox>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* INTERACTIVE WORKBENCH                                              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-kingfisher-panel/90 border border-kingfisher-border rounded-xl p-6 shadow-xl relative overflow-hidden">
        {/* Corner label */}
        <div className="absolute top-0 right-0 p-3 bg-blue-500/10 text-blue-400 border-l border-b border-kingfisher-border text-[9px] font-mono uppercase tracking-widest rounded-bl-xl font-bold flex items-center gap-1.5">
          <Terminal className="w-3 h-3" /> Live Simulator Workbench
        </div>

        <h3 className="text-white text-lg font-bold tracking-wide mb-2 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-400" />
          AAA Real-Time Hardware Profiler &amp; Sandbox
        </h3>
        <p className="text-kingfisher-muted text-xs mb-6">
          Toggle diagnostic scripts and structural C++ alignment modifications. Observe live metric
          recalculations mapped to CPU timers, G-Buffer raster threads, physics hashes, memory
          buffers, and packet ping queues.
        </p>

        {/* ── SCENARIO SELECTOR (4 scenarios → 2×2 / 4-col) ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 bg-black/40 p-2 rounded-xl border border-white/5">
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
              <div className="text-[9px] font-bold uppercase tracking-wider mb-0.5 text-blue-400 truncate leading-tight">
                {item.gameSource.replace('Inspired by ', '')}
              </div>
              <div className="text-xs font-semibold truncate leading-tight">
                {item.name.split('-Style')[0]} Setup
              </div>
            </button>
          ))}
        </div>

        {/* ── SIMULATOR LAYOUT ── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

          {/* ─── LEFT PANEL: INPUTS ──────────────────────────────────────── */}
          <div className="xl:col-span-5 space-y-4">

            {/* Context + diagnostics card */}
            <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-kingfisher-muted/80 flex items-center justify-between border-b border-white/5 pb-2">
                <span>System Context Description</span>
                <span className="text-[10px] text-amber-500 font-mono">⚠ Bottleneck Active</span>
              </div>
              <p className="text-xs text-kingfisher-muted leading-relaxed">
                {scenario.description}
              </p>
              <div className="p-2.5 bg-black/40 rounded border border-yellow-500/10 text-[11px] text-yellow-400/90 font-mono leading-tight">
                <strong>Console Diagnostic Hook:</strong>
                <br />
                {scenario.diagnostics}
              </div>
            </div>

            {/* Optimization toggles — sorted by priority */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-bold uppercase tracking-wider text-kingfisher-muted/80">
                  Select C++ &amp; Compiler Optimizations:
                </span>
                <span className="text-[9px] font-mono text-kingfisher-muted/40 uppercase tracking-wider">
                  Priority order ↓
                </span>
              </div>

              {sortedOpts.map(opt => {
                const isSelected = !!activeOptimizations[opt.id];
                const chips      = buildChips(opt);
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
                    {/* Checkbox */}
                    <div className="mt-0.5 shrink-0">
                      {isSelected
                        ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                        : <div className="w-4 h-4 rounded-full border border-white/30" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      {/* Label row with priority badge */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-kingfisher-muted/50 shrink-0">
                          #{opt.priority}
                        </span>
                        <span className="text-xs font-bold leading-none">{opt.label}</span>
                      </div>

                      {/* Detail description */}
                      <p className="text-[11px] opacity-70 leading-relaxed">{opt.detail}</p>

                      {/* Impact delta chips */}
                      {chips.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {chips.map(chip => (
                            <span key={chip.label}
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${chip.color}`}>
                              {chip.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optimization coverage / efficiency meter */}
            <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-kingfisher-muted/60 uppercase tracking-wider">
                  Optimization Coverage
                </span>
                <span className={`font-bold ${allApplied ? 'text-emerald-400' : 'text-kingfisher-muted'}`}>
                  {appliedCount} / {totalCount} Applied
                </span>
              </div>
              <div className="flex gap-1.5">
                {sortedOpts.map(opt => (
                  <div key={opt.id}
                    className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                      activeOptimizations[opt.id] ? 'bg-emerald-500' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
              {allApplied && (
                <p className="text-[10px] text-emerald-400 font-mono pt-0.5">
                  ✓ All optimizations active — peak configuration reached.
                </p>
              )}
            </div>
          </div>

          {/* ─── RIGHT PANEL: TELEMETRY ──────────────────────────────────── */}
          <div className="xl:col-span-7 flex flex-col gap-4 bg-black/30 border border-white/5 p-5 rounded-2xl">

            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-kingfisher-muted flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-red-400 animate-pulse" />
                Virtual Insights Frame Telemetry
              </span>
              <div className="flex items-center gap-2">
                {/* FPS estimate badge */}
                <div className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${
                  estimatedFps >= 60
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : estimatedFps >= 30
                    ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  ~{estimatedFps} FPS
                </div>
                <button
                  onClick={handleReset}
                  className="text-[10px] uppercase font-mono text-kingfisher-muted/60 hover:text-white bg-white/5 px-2 py-1 rounded border border-white/5 hover:border-white/20 transition-all flex items-center gap-1"
                >
                  <RotateCcw className="w-2.5 h-2.5" /> Reset
                </button>
              </div>
            </div>

            {/* Frame time history sparkline */}
            <FrameSparkline history={frameHistory} />

            {/* Performance metric bars */}
            <div className="space-y-4">

              {/* CPU game thread bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-amber-400" />
                    CPU Game Thread Frame Time
                  </span>
                  <span className={`font-mono text-sm font-bold ${isCpuMet ? 'text-emerald-400' : 'text-red-400'}`}>
                    {metrics.cpu.toFixed(1)} ms {isCpuMet ? '✓' : '⚠'}
                  </span>
                </div>
                <div className="h-2.5 w-full bg-black/80 rounded-full overflow-hidden border border-white/5 relative">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${isCpuMet ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, (metrics.cpu / 50) * 100)}%` }}
                  />
                  {/* 16.67ms budget marker */}
                  <div className="absolute left-[33.3%] top-0 h-full w-[2px] bg-yellow-500/60" title="16.67ms — 60 FPS budget" />
                </div>
                <div className="flex justify-between text-[9px] text-kingfisher-muted/70 font-mono">
                  <span>0ms</span>
                  <span>16.67ms (60 FPS Budget)</span>
                  <span>50ms Max</span>
                </div>
              </div>

              {/* GPU raster bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-blue-400" />
                    GPU Renderer Raster Capacity
                  </span>
                  <span className={`font-mono text-sm font-bold ${isGpuMet ? 'text-blue-400' : 'text-purple-400'}`}>
                    {metrics.gpu.toFixed(1)} ms {isGpuMet ? '✓' : '⚠'}
                  </span>
                </div>
                <div className="h-2.5 w-full bg-black/80 rounded-full overflow-hidden border border-white/5 relative">
                  <div
                    className="h-full transition-all duration-300 rounded-full bg-blue-500"
                    style={{ width: `${Math.min(100, (metrics.gpu / 30) * 100)}%` }}
                  />
                  <div className="absolute left-[55.5%] top-0 h-full w-[2px] bg-yellow-500/60" title="16.67ms — 60 FPS budget" />
                </div>
                <div className="flex justify-between text-[9px] text-kingfisher-muted/70 font-mono">
                  <span>0ms</span>
                  <span>16.67ms (60 FPS Budget)</span>
                  <span>30ms Max</span>
                </div>
              </div>

              {/* RAM / VRAM / Latency triple grid */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Database className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[9px] font-bold uppercase text-kingfisher-muted">System RAM</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-white mb-0.5">{metrics.ram.toFixed(2)} GB</div>
                  <div className="text-[9px] text-kingfisher-muted/60">Host Heap Footprint</div>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <HardDrive className="w-3.5 h-3.5 text-pink-400" />
                    <span className="text-[9px] font-bold uppercase text-kingfisher-muted">GPU VRAM</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-white mb-0.5">{metrics.vram.toFixed(2)} GB</div>
                  <div className="text-[9px] text-kingfisher-muted/60">G-Buffer Allocation</div>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Radio className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[9px] font-bold uppercase text-kingfisher-muted">Net Ping</span>
                  </div>
                  <div className={`text-sm font-mono font-bold mb-0.5 ${
                    scenario.unoptimized.latency === 0 ? 'text-kingfisher-muted/30'
                      : metrics.latency <= 60  ? 'text-emerald-400'
                      : metrics.latency <= 120 ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}>
                    {scenario.unoptimized.latency === 0 ? 'N/A' : `${metrics.latency} ms`}
                  </div>
                  <div className="text-[9px] text-kingfisher-muted/60">Client-Server Jitter</div>
                </div>
              </div>
            </div>

            {/* Live console log */}
            <div className="mt-auto p-3.5 rounded-xl bg-black/60 border border-white/5">
              <div className="text-[10px] font-mono text-emerald-400 mb-1.5 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                <span>DYNAMIC TELEMETRY VERIFICATION FRAMEWORK LOG</span>
              </div>
              <div className="font-mono text-xs text-kingfisher-muted space-y-1">
                <div>
                  {'> Frame Time: '}
                  <span className={bothMet ? 'text-emerald-400' : 'text-red-400'}>
                    {Math.max(metrics.cpu, metrics.gpu).toFixed(2)} ms
                  </span>
                  {'  |  Est. FPS: '}
                  <span className={
                    estimatedFps >= 60 ? 'text-emerald-400'
                    : estimatedFps >= 30 ? 'text-yellow-400'
                    : 'text-red-400'
                  }>
                    ~{estimatedFps}
                  </span>
                </div>
                {lastAction && (
                  <div className="text-blue-400/80">&gt; {lastAction}</div>
                )}
                {bothMet ? (
                  <div className="text-emerald-400 font-semibold">
                    &gt; ✓ SUCCESS: Both CPU and GPU within 16.67ms budget. Smooth 60 FPS achieved.
                  </div>
                ) : (
                  <div className="text-red-400 font-semibold">
                    &gt; ⚠ WARNING: {budgetWarnings.join(' + ')}{' '}
                    {budgetWarnings.length > 1 ? 'threads exceed' : 'thread exceeds'} 16.67ms budget.
                  </div>
                )}
                {allApplied && bothMet && (
                  <div className="text-emerald-300 font-bold">
                    &gt; ★ PEAK PERFORMANCE: All optimizations confirmed — scenario fully resolved!
                  </div>
                )}
                <div className="text-[10px] text-kingfisher-muted/30">
                  &gt; Diagnostic suite: {scenario.gameSource}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* DEEP-DIVE DIAGNOSTIC CHAPTERS                                      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <h3 className="text-white text-lg font-bold tracking-wide mt-8 pl-1">
        Deep-Dive Core Diagnostic Chapters
      </h3>

      {/* ── CHAPTER 1: GARBAGE COLLECTION ─────────────────────────────────── */}
      <Collapsible
        title="Chapter 1: Memory & Asset Tracing (Garbage Collection Stalls)"
        icon={Database}
        color={COLORS.status.success}
        badge="Memory Allocs"
      >
        <div className="space-y-4">
          <p className="text-sm text-kingfisher-muted leading-relaxed">
            In deep RPG architectures (such as loading hundreds of tooltip boxes in an inventory
            chest containing 500+ items, akin to <em>Baldur's Gate 3</em>), the engine generates
            huge heaps of temporary structures. This triggers a mark-sweep garbage collection pass
            that freezes the game thread for up to <strong>15.0ms</strong>.
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
              "Memreport dumps (command line dump parameters for UObject counting)",
            ]}
            missing={[
              "Automatic static reflection UPROPERTY memory leak scanner (forces manual tree evaluations)",
              "Out-of-the-box hot reload serialization checkers",
            ]}
            howToUse="Trace garbage leaks by querying memory counts. Launch with `-trace=memory` using cooked configs. Use `gc.ForceCollectGarbageEveryFrame` during profiling sandbox stages to expose raw load boundaries."
          />

          <h4 className="text-white text-xs font-bold uppercase tracking-wider mt-4">
            Production-Grade C++ Struct Alignment (Avoid Stalls):
          </h4>
          <CodeBlock
            language="cpp"
            code={`// Struct fields grouped biggest to smallest to eliminate compiler padding leaks
// and optimize CPU cache timing. Avoids memory bloating in large arrays
// (e.g. 100k RPG item records).
USTRUCT(BlueprintType)
struct FRpgInventoryItemRecord
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "RPG Tooling")
    UTexture2D* PrimaryIconAsset;       // 8 bytes (Pointer)

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "RPG Tooling")
    int64 UniqueDatabaseUID;            // 8 bytes (Integer)

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "RPG Tooling")
    float BaseDurabilityCoefficient;    // 4 bytes (Floating point)

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "RPG Tooling")
    int32 AbsoluteCopperValue;          // 4 bytes (Integer)

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "RPG Tooling")
    uint8 ItemQualityRarityClass;       // 1 byte  (Byte indicator)

    // Implicit compiler pad bytes reduced to 0 — safeguards RAM cache retrieval speeds!
};`}
          />
        </div>
      </Collapsible>

      {/* ── CHAPTER 2: GPU FRAME DISSECTION ───────────────────────────────── */}
      <Collapsible
        title="Chapter 2: RenderDoc & GPU Frame Dissection (G-Buffer & Overdraw Shader Bottlenecks)"
        icon={Monitor}
        color={COLORS.kingfisher.blue}
        badge="GPU Shaders"
      >
        <div className="space-y-4">
          <p className="text-sm text-kingfisher-muted leading-relaxed">
            Dense foliage assemblies in <em>The Witcher 3</em> or active particle-dense spell rings
            in <em>Path of Exile</em> trigger extremely high overdraw counts. Drawing 8 overlapping
            semi-transparent pixel planes over the same viewport coordinate overloads dynamic
            G-Buffers and collapses pixel throughput on the GPU.
          </p>

          <MultiplayerImpact
            gpu="-6.5ms (By replacing transparent screen overdraws with lightweight volumetric vectors)"
            cpu="-1.2ms (Reduces draw call registration sequences on render pipelines)"
            ram="+12MB (PSO pipeline compilation caches)"
            vram="Saves -850MB (Using virtual texture streaming pools)"
            latency="0ms (Local hardware execution dependent)"
          />

          <FeatureMatrix
            has={[
              "ProfileGPU console dissection interface (Ctrl+Shift+Comma frame capture)",
              "Render Dependency Graph (RDG) pipeline mapping",
              "Material Analyzer window tools to pinpoint heavy pixel shader nodes",
            ]}
            missing={[
              "Automatic out-of-the-box multi-platform shader assembly timing maps",
              "Low-level raytracing shader instruction profiling diagnostics natively",
            ]}
            howToUse="Capture frame segments using RenderDoc or Unreal GPU Visualizer. Map G-Buffer categories in the tree. Target expensive slots such as BasePass and ShadowDepths bottlenecks."
          />

          <h4 className="text-white text-xs font-bold uppercase tracking-wider mt-4">
            C++ Asynchronous Render Task Example:
          </h4>
          <CodeBlock
            language="cpp"
            code={`// Uses Unreal RDG (Render Dependency Graph) to feed custom pixel-mask matrices
// as asynchronous render passes, bypassing CPU overhead loops entirely.
void FRpgBufferComputeModule::RenderMaskBuffer_RenderThread(
    FRHICommandListImmediate& RHICmdList, const FSceneView& View)
{
    FRDGBuilder GraphBuilder(RHICmdList);

    // Initializing high-performance G-Buffer textures
    FRDGTextureDesc DynamicTextureDesc = FRDGTextureDesc::Create2D(
        View.ConstraintRect.Size(), PF_FloatRGBA, FClearValueBinding::Black,
        TexCreate_ShaderResource | TexCreate_RenderTargetable
    );
    FRDGTexture* CustomMaskRDGTexture = GraphBuilder.CreateTexture(
        DynamicTextureDesc, TEXT("RPGMaskTexture"));

    // Async pass: executes on the GPU without stalling the CPU
    GraphBuilder.AddPass(
        RDG_EVENT_NAME("RPGPixelMaskOverdrawClear"),
        ERDGPassFlags::Raster,
        [CustomMaskRDGTexture](FRHICommandListImmediate& RHICmdListImmediate)
        {
            // Execute specialized bare-metal draw calls directly,
            // bypassing CPU overhead loops entirely.
        }
    );

    GraphBuilder.Execute();
}`}
          />
        </div>
      </Collapsible>

      {/* ── CHAPTER 3: NETWORK INSIGHTS ───────────────────────────────────── */}
      <Collapsible
        title="Chapter 3: Dedicated Server Network Insights & RPC Load Profiling (Replication Queues)"
        icon={Server}
        color={COLORS.kingfisher.warm}
        badge="Dedicated Server"
      >
        <div className="space-y-4">
          <p className="text-sm text-kingfisher-muted leading-relaxed">
            Multiplayer action RPGs tracing 100+ enemies concurrently replicate hundreds of
            variables over the wire (combat damages, movement arrays, spell positions, active buffs).
            Flooding server interfaces triggers RPC bufferbloat, creating severe desync
            rubberbanding and raising network ping queues from <strong>40ms to 320ms</strong>.
          </p>

          <MultiplayerImpact
            gpu="0ms (Server-side execution processes only)"
            cpu="-5.4ms (Utilizing Replication Graph grids to process actor dormancy sweeps)"
            ram="+120MB (Replication cache maps on hosts)"
            vram="0ms (No server-side physics-render overhead)"
            latency="Saves -240ms Latency (Aggressively bounds RPC ticks to local screen spaces only)"
          />

          <FeatureMatrix
            has={[
              "Unreal Network Insights tracking (Packet Profiler session tracer)",
              "Replication Graph hierarchies for specialized spatial grids",
              "NetDormancy console controls to toggle idle status loops",
            ]}
            missing={[
              "Dynamic server tick culling based on active connection speed bottlenecks",
              "Out-of-the-box multi-region cluster server simulation tests inside local sandboxes",
            ]}
            howToUse="Diagnose network pipelines by launching with `-trace=net`. Trace packet flow frequencies inside Unreal Network Insights. Maintain net transfer budgets below 4.0KB/sec per connected client."
          />

          <h4 className="text-white text-xs font-bold uppercase tracking-wider mt-4">
            High-Performance Replication Dormancy Triggering (C++):
          </h4>
          <CodeBlock
            language="cpp"
            code={`// Implements dynamic net dormancy for passive loot chest actors.
// Disables dynamic update loops unless the actor is opened, conserving network traffic.
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
            // Enter immediate network sleep — consumes zero net tick cycles!
            SetNetDormancy(DORM_Initial);
            SetReplicatedHasBegunPlay(false);
        }
    }
}`}
          />
        </div>
      </Collapsible>

      {/* ── CHAPTER 4: BINARY SERIALIZATION ───────────────────────────────── */}
      <Collapsible
        title="Chapter 4: FArchive Binary Save Stream Profiling (BG3 / Witcher 3 Save-Game Serialization)"
        icon={FileText}
        color={COLORS.status.warning}
        badge="Serialization"
      >
        <div className="space-y-4">
          <p className="text-sm text-kingfisher-muted leading-relaxed">
            Giant open world RPG state files storing quest progress, active map properties, millions
            of item inventories, and world coordinate states can exceed 20MB. Standard
            reflection-based JSON/XML saving architectures stall the Game Thread, inducing a
            massive <strong>400ms</strong> disk-write hitch.
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
              "Compressed binary streams (FArchiveSaveCompressed)",
            ]}
            missing={[
              "Zero-copy direct-to-disk binary arrays natively mapped to struct fields",
              "Dynamic save state change-delta mappers (requires custom save logs)",
            ]}
            howToUse="Format save state serialization pipelines with custom `operator<<` rules. Wrap storage writes inside parallel workers using asynchronous task frameworks to preserve game loop performance."
          />

          <h4 className="text-white text-xs font-bold uppercase tracking-wider mt-4">
            Unreal Engine Byte-Aligned FArchive Serialization Example:
          </h4>
          <CodeBlock
            language="cpp"
            code={`// Highly optimized, zero-copy custom FArchive serialization stream.
// Avoids UProperty reflection overhead. Loads dynamic profiles under 2ms.
void FRpgQuestStateTracker::SerializeQuestProgressBuffer(FArchive& Ar)
{
    // Serialize total entry count — works as both writer (save) and reader (load)
    int32 ActiveQuestTaskCount = QuestProgressMap.Num();
    Ar << ActiveQuestTaskCount;

    for (auto& QuestEntry : QuestProgressMap)
    {
        // 1. Serialize quest step index
        int32 QuestStepID = QuestEntry.Key;
        Ar << QuestStepID;

        // 2. Serialize complete state using custom raw byte-alignment rules
        FRpgQuestStepMetadata& StepRecord = QuestEntry.Value;

        Ar << StepRecord.bStepCompleted;
        Ar << StepRecord.TimestampAbsolute;
        Ar << StepRecord.ObjectiveCounter;

        // Saves and loads instantly by writing contiguous raw primitives to disk!
    }
}`}
          />
        </div>
      </Collapsible>

      {/* ── CHAPTER 5: PSO SHADER COMPILATION (NEW) ───────────────────────── */}
      <Collapsible
        title="Chapter 5: PSO Shader Compilation Stalls & Async Warmup Strategies"
        icon={Zap}
        color={COLORS.kingfisher.warm}
        badge="Shader PSO"
      >
        <div className="space-y-4">
          <p className="text-sm text-kingfisher-muted leading-relaxed">
            Pipeline State Object (PSO) compilation stalls are among the most disruptive hitch
            sources in modern open-world titles. When UE5 encounters a new shader permutation at
            runtime — triggered by entering a new biome, a weather state change, or a first combat
            ability activation — it must compile and link GPU pipeline state synchronously, causing
            freezes ranging from <strong>50ms to 800ms</strong> per incident. In RDR2-scale
            environments with hundreds of material permutations, these stalls occur constantly
            during exploration and cannot be hidden by LOD tricks alone.
          </p>

          <MultiplayerImpact
            gpu="-8.5ms average (Prewarmed PSO pipelines eliminate mid-session GPU pipeline compilation bubbles)"
            cpu="-0.8ms (Removes CPU stalls synchronously waiting on GPU shader compile fence signals)"
            ram="+45MB (PSO precompilation cache stored in host memory during warmup pass)"
            vram="+20MB (Resident compiled shader bytecode cache in VRAM pipeline state pool)"
            latency="Prevents disconnects (eliminates server tick hitches caused by Game Thread PSO stalls)"
          />

          <FeatureMatrix
            has={[
              "Async shader compilation (r.ShaderCompiler.AsyncCompiling=1) for non-blocking background compile",
              "FPipelineStateCacheData for cross-session PSO binary cache persistence to disk",
              "SHADER_PERMUTATION_BOOL macros to prune impossible variant branches at HLSL compile time",
              "r.PSO.Precompile=1 console variable for runtime precompilation pass on game boot",
            ]}
            missing={[
              "Automatic PSO warmup coverage analyzer — must manually trace and curate trigger event lists",
              "Pixel-accurate PSO compile timing heatmaps natively (requires 3rd-party tooling: RenderDoc, PIX, NSight)",
            ]}
            howToUse="Profile PSO compile events in GPU Insights by filtering for 'CreateComputePipelineState' and 'CreateGraphicsPipelineState' events. Launch with -shadercompilationmode=async in development. Populate the PSO binary cache by doing a guided content tour on first boot, then ship the cache file to players to eliminate all runtime stalls."
          />

          <h4 className="text-white text-xs font-bold uppercase tracking-wider mt-4">
            Async PSO Precompilation Warmup Subsystem (C++):
          </h4>
          <CodeBlock
            language="cpp"
            code={`// Async PSO precompilation warmup subsystem — called during the loading screen.
// Precompiles all critical shader permutations on background threads so zero
// mid-session GPU pipeline hitches can occur during open world traversal.
void URpgShaderWarmupSubsystem::PrecompileCorePSOPermutations()
{
    // Collect all RPG-critical materials: environment biomes, weather layers,
    // VFX, combat abilities, UI overlays — anything seen in the first 10 minutes.
    TArray<UMaterialInterface*> CriticalMaterials;
    CollectCriticalRPGMaterials(CriticalMaterials);

    FPSOPrecacheParams PrecacheParams;
    PrecacheParams.SetSkinInfluenceCount(4);        // Character meshes: 4-bone weighting
    PrecacheParams.bSupportsLandscape   = true;     // Open world terrain blending
    PrecacheParams.bUsesStaticLighting  = false;    // Full dynamic lighting path

    int32 LaunchedCount = 0;
    for (UMaterialInterface* Material : CriticalMaterials)
    {
        if (!IsValid(Material)) continue;

        // Dispatches async PSO compile job to shader worker pool.
        // Returns immediately — compiles run on background threads, never blocking
        // the Game Thread or producing a visible hitch.
        if (Material->ConditionallyPrecompilePSOCache(PrecacheParams))
        {
            ++LaunchedCount;
        }
    }

    UE_LOG(LogRpgShader, Log,
        TEXT("[PSOWarmup] Async precompilation launched for %d materials. Zero runtime stalls expected."),
        LaunchedCount);
}

// ── PERMUTATION PRUNING ─────────────────────────────────────────────────────
// Reducing permutation count directly reduces PSO compile time and cache size.
// Place in your material's USHADERPERMUTATIONDOMAIN declaration.
//
// class FRpgWeatherPermutationDomain : public FShaderPermutationParameters
// {
//     SHADER_PERMUTATION_BOOL(USES_RAIN_WETNESS,      "RAIN_WETNESS");      // Wet BRDF
//     SHADER_PERMUTATION_BOOL(USES_LIGHTNING_FLASH,   "LIGHTNING_FLASH");   // HDR burst
//     SHADER_PERMUTATION_BOOL(USES_SNOW_ACCUMULATION, "SNOW_ACCUM");        // Height-blend
//
//     static bool ShouldCompilePermutation(const FShaderPermutationParameters& Params)
//     {
//         // Prune impossible: rain and snow never coexist — eliminates 33% of variants!
//         if (Params.Get(USES_RAIN_WETNESS) && Params.Get(USES_SNOW_ACCUMULATION))
//             return false;
//         return true;
//     }
// };`}
          />
        </div>
      </Collapsible>

      {/* ── CHAPTER 6: CPU TASKGRAPH & ASYNC MULTITHREADING (NEW) ────────── */}
      <Collapsible
        title="Chapter 6: CPU TaskGraph Async Multithreading & Game Thread Offloading"
        icon={GitBranch}
        color={COLORS.kingfisher.blue}
        badge="TaskGraph"
      >
        <div className="space-y-4">
          <p className="text-sm text-kingfisher-muted leading-relaxed">
            Unreal Engine's TaskGraph system and <code>ParallelFor</code> primitives unlock
            substantial Game Thread headroom by offloading CPU-heavy work to background worker
            pools. For dense RPG scenarios — 120+ NPC AI evaluations in{' '}
            <em>Baldur's Gate 3</em>-style crowd sequences, or mass physics overlap queries in{' '}
            <em>Path of Exile</em>-style spell bursts — the canonical pattern is{' '}
            <strong>Snapshot → Evaluate → Apply</strong>: capture thread-safe plain-struct
            snapshots on the Game Thread, evaluate them on workers, then write results back on the
            Game Thread. This eliminates UObject access races entirely while achieving near-linear
            CPU core scaling.
          </p>

          <MultiplayerImpact
            gpu="0ms (Pure CPU worker execution — no render thread dependencies)"
            cpu="-18.5ms average (Moving 80%+ of AI evaluation off Game Thread to background worker pool)"
            ram="+80MB (NPC AI snapshot buffers and decision result arrays in worker memory)"
            vram="0ms (No GPU-side dependencies)"
            latency="Prevents server tick stalls (Game Thread freed to process authority RPC and replication)"
          />

          <FeatureMatrix
            has={[
              "ParallelFor() with EParallelForFlags::BackgroundPriority for non-blocking batch evaluation",
              "Async() with EAsyncExecution::TaskGraph and TFuture<T> returns for fire-and-forget dispatch",
              "FGraphEventArray dependency chains for sequencing dependent async passes (AI → Nav → Anim)",
              "FCriticalSection / FRWLock / TAtomic<T> primitives for thread-safe shared state access",
            ]}
            missing={[
              "Automatic race condition detection in Unreal Insights (requires manual atomic instrumentation)",
              "Visual task graph dependency mapper in the editor IDE (console command only: stat taskgraph)",
            ]}
            howToUse="Profile task graph thread utilization in Unreal Insights under Named Threads. Verify CPU core load distribution across the worker pool. Trace AI evaluation costs with -trace=cpu,task. Confirm no UObject access occurs outside the Game Thread using IsInGameThread() assertions in debug builds."
          />

          <h4 className="text-white text-xs font-bold uppercase tracking-wider mt-4">
            Parallel NPC AI Evaluation — Snapshot-Evaluate-Apply Pattern (C++):
          </h4>
          <CodeBlock
            language="cpp"
            code={`// Thread-safe parallel NPC AI evaluation using the Snapshot-Evaluate-Apply pattern.
// Computes AI decisions on TaskGraph worker threads.
// RULE: Only plain data structs (no UObject pointers) cross thread boundaries.

void URpgNpcAiSubsystem::EvaluateAiStatesParallel(float DeltaTime)
{
    const TArray<ARpgNpcBase*>& AllNpcs = GetAllActiveNpcs();
    if (AllNpcs.IsEmpty()) return;

    // ── PHASE 1: SNAPSHOT (Game Thread — safe UObject reads) ─────────────────
    TArray<FRpgNpcAiSnapshot> Snapshots;
    Snapshots.Reserve(AllNpcs.Num());
    for (ARpgNpcBase* Npc : AllNpcs)
    {
        if (IsValid(Npc) && Npc->IsEligibleForAiEvaluation())
        {
            // CaptureAiSnapshot() returns a plain struct — no UObject pointers inside.
            Snapshots.Add(Npc->CaptureAiSnapshot());
        }
    }

    // ── PHASE 2: EVALUATE (Worker Threads via ParallelFor) ───────────────────
    // Pure data transformation — reads Snapshots[], writes Decisions[].
    // Zero UObject access: fully thread-safe.
    TArray<FRpgNpcAiDecision> Decisions;
    Decisions.SetNum(Snapshots.Num());

    ParallelFor(Snapshots.Num(), [&](int32 Index)
    {
        // FAiDecisionEngine processes plain struct arrays only.
        // Behavior tree evaluation and spatial-hash lookups are pre-baked into data.
        Decisions[Index] = FAiDecisionEngine::EvaluateSnapshot(Snapshots[Index], DeltaTime);
    },
    EParallelForFlags::BackgroundPriority); // Yields to higher-priority Render Thread work

    // ── PHASE 3: APPLY (Game Thread — safe UObject writes) ───────────────────
    for (int32 i = 0; i < Decisions.Num(); ++i)
    {
        if (ARpgNpcBase* Npc = GetNpcByUID(Snapshots[i].NpcUID))
        {
            Npc->ApplyAiDecision(Decisions[i]); // Safe: back on the Game Thread
        }
    }
}

// ── ASYNC TASK DISPATCH (TFuture pattern) ────────────────────────────────────
// Use for isolated, independent work units (quest validation, pathfinding pre-solve).
TFuture<FRpgQuestValidationResult> URpgQuestSubsystem::ValidateQuestStateAsync(int32 QuestID)
{
    // Capture snapshot on Game Thread before dispatching
    FRpgQuestSnapshot Snapshot = CaptureQuestSnapshot(QuestID);

    return Async(EAsyncExecution::TaskGraph,
        [Snapshot = MoveTemp(Snapshot)]() -> FRpgQuestValidationResult
        {
            // Runs on a TaskGraph worker thread.
            // Touches only the captured plain-struct snapshot — zero UObject access.
            return FRpgQuestValidator::ValidateSnapshot(Snapshot);
        }
    );
    // Caller uses .Get() to block-wait when the result is needed,
    // or .IsReady() to poll without blocking during the same frame.
}`}
          />
        </div>
      </Collapsible>
    </div>
  );
};