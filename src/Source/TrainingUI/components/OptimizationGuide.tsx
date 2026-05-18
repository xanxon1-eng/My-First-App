import React, { useState } from 'react';
import {
  Settings, ArrowLeft, Activity, Cpu, Monitor, Sun, Database, Network,
  Clock, HardDrive, Zap, LayoutTemplate, Box, Waves, CheckCircle, CircleDashed,
  ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Shield, Radio,
  Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music,
  Package, Eye, TrendingDown, Flame, GitBranch
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COLORS } from '../../../constants/colors';

interface OptimizationGuideProps {
  onBack: () => void;
}

const TABS = [
  { id: 'overview',         label: 'Implementation Status',    icon: ClipboardList },
  { id: 'pipeline',         label: '16.7ms Pipeline',          icon: Activity },
  { id: 'architecture',     label: 'CPU & RAM Architecture',   icon: Cpu },
  { id: 'draw_calls',       label: 'Draw Calls & Instancing',  icon: BarChart3 },
  { id: 'gpu',              label: 'GPU Geometry & Nanite',    icon: Box },
  { id: 'lod',              label: 'LOD Systems',              icon: Triangle },
  { id: 'materials',        label: 'Materials & Shaders',      icon: Palette },
  { id: 'textures',         label: 'Textures & Streaming',     icon: Image },
  { id: 'lighting',         label: 'Light & Shadows',          icon: Sun },
  { id: 'postprocess',      label: 'Post-Process & Upscaling', icon: Monitor },
  { id: 'occlusion',        label: 'Occlusion & Visibility',   icon: Eye },
  { id: 'collision',        label: 'Collision & Traces',       icon: Crosshair },
  { id: 'memory_state',     label: 'Memory & State Arch',      icon: Folder },
  { id: 'network_physics',  label: 'Networking & Physics',     icon: Globe },
  { id: 'npc',              label: 'World AI Simulation',      icon: Network },
  { id: 'animation_audio',  label: 'Animation & Audio',        icon: Music },
  { id: 'scalability',      label: 'Scalability & CVars',      icon: Sliders },
  { id: 'budgets',          label: 'Budgets & Tools',          icon: Database },
  { id: 'storage',          label: 'Disk / Install Storage',   icon: HardDrive },
  { id: 'aaa_profiling',    label: 'AAA Quality Profiling',    icon: Zap },
];

export const OptimizationGuide: React.FC<OptimizationGuideProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':         return <OverviewTab />;
      case 'pipeline':         return <PipelineTab />;
      case 'architecture':     return <ArchitectureTab />;
      case 'draw_calls':       return <DrawCallsTab />;
      case 'gpu':              return <GeometryTab />;
      case 'lod':              return <LODTab />;
      case 'materials':        return <MaterialsTab />;
      case 'textures':         return <TexturesTab />;
      case 'lighting':         return <LightingTab />;
      case 'postprocess':      return <PostProcessTab />;
      case 'occlusion':        return <OcclusionTab />;
      case 'collision':        return <CollisionTab />;
      case 'memory_state':     return <MemoryStateTab />;
      case 'network_physics':  return <NetworkingPhysicsTab />;
      case 'npc':              return <AITab />;
      case 'animation_audio':  return <AnimationAudioTab />;
      case 'scalability':      return <ScalabilityTab />;
      case 'budgets':          return <BudgetsTab />;
      case 'storage':          return <StorageTab />;
      case 'aaa_profiling':    return <AAAQualityProfilingTab />;
      default:                 return null;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-kingfisher-dark text-kingfisher-surface font-sans overflow-hidden">
      <header className="h-14 border-b border-kingfisher-border bg-kingfisher-panel flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-2 mr-2 text-kingfisher-muted hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 bg-kingfisher-deep rounded-md flex items-center justify-center text-white shadow-md">
            <Settings className="w-5 h-5" />
          </div>
          <h1 className="font-semibold tracking-wide text-sm text-white">
            Optimization <span style={{ color: COLORS.kingfisher.warm }}>Guide</span>
          </h1>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-kingfisher-border bg-kingfisher-panel/50 flex flex-col p-4 shrink-0 overflow-y-auto">
          <div className="text-xs font-semibold uppercase tracking-wider text-kingfisher-muted mb-4 pl-2">Topics</div>
          <nav className="flex flex-col gap-1">
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-kingfisher-blue/20 text-white shadow-sm border border-kingfisher-blue/30'
                      : 'text-kingfisher-muted hover:bg-kingfisher-panel hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-kingfisher-blue' : ''}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper Components
// ─────────────────────────────────────────────────────────────────────────────

const SectionCard = ({ title, icon: Icon, color = COLORS.kingfisher.blue, children, className = '' }: any) => (
  <div className={`bg-kingfisher-panel/80 border border-kingfisher-border rounded-xl p-6 shadow-md ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      {Icon && <div className="p-2 rounded-lg bg-black/20"><Icon className="w-5 h-5" style={{ color }} /></div>}
      <h3 className="font-semibold text-white text-lg tracking-wide">{title}</h3>
    </div>
    <div className="text-sm text-kingfisher-surface space-y-4 leading-relaxed">{children}</div>
  </div>
);

const HighlightBox = ({ children, type = 'info', className = '' }: any) => {
  const colors: Record<string, string> = {
    info:    'border-blue-500/30 bg-blue-500/10 text-blue-100',
    warning: 'border-amber-500/30 bg-amber-500/10 text-amber-100',
    danger:  'border-red-500/30 bg-red-500/10 text-red-100',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100',
  };
  return (
    <div className={`p-4 rounded-lg border ${colors[type]} text-sm font-medium leading-relaxed ${className}`}>
      {children}
    </div>
  );
};

const StatRow = ({ label, value, note, color = 'text-white' }: { label: string; value: string; note?: string; color?: string }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-kingfisher-border/40 last:border-0">
    <span className="text-kingfisher-muted text-sm">{label}</span>
    <div className="text-right">
      <span className={`font-mono text-sm font-semibold ${color}`}>{value}</span>
      {note && <span className="text-xs text-kingfisher-muted ml-2">({note})</span>}
    </div>
  </div>
);

const PageHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
    <p className="text-kingfisher-muted">{subtitle}</p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Tabs
// ─────────────────────────────────────────────────────────────────────────────

const OverviewTab = () => (
  <div className="space-y-6">
    <PageHeader title="Implementation Status Overview" subtitle="Deep analysis from extensive documentation and practical technical playground integration." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Currently Implemented" icon={CheckCircle} color={COLORS.status.success}>
        <ul className="space-y-3 pt-1">
          {[
            ['Architecture Validation', '3-Layer Data-Driven Architecture, Ban Event Tick, Soft References, Object Pooling, Event Bus Decoupling.'],
            ['Advanced Game Mechanics', 'Passive Tree Bitmasks, Enhanced Input mappings, Inventory USTRUCTs, Item Crafting systems.'],
            ['Rendering & Profiling', '16.7ms pipeline, Budget allocations, Nanite bucket classifications, Lumen strategy.'],
            ['Simulation & Logic', 'Quadtree Fog-of-War, Server Culling, Timestamp Catch-Up, Significance Manager.'],
          ].map(([title, desc]) => (
            <li key={title} className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div><strong className="text-white block mb-0.5">{title}</strong><span className="text-kingfisher-muted text-sm">{desc}</span></div>
            </li>
          ))}
        </ul>
      </SectionCard>
      <SectionCard title="Newly Added in This Version" icon={CheckCircle} color={COLORS.kingfisher.blue}>
        <ul className="space-y-3 pt-1">
          {[
            ['Draw Calls & Instancing', 'HISM/ISM instancing pipeline, 1000-draw-call rule, mesh merging, UV atlasing.'],
            ['LOD Systems', 'Screen-size thresholds, HLOD vs static LOD, skeletal LOD, Imposter Sprites.'],
            ['Materials & Shaders', 'Instruction counts, translucency overdraw, dynamic branches, PBR texture packing.'],
            ['Textures & Streaming', 'Mip mapping, BC compression formats, Virtual Textures, streaming pool tuning.'],
            ['Post-Process & Upscaling', 'TSR/DLSS/FSR cost analysis, resolution scaling, AA strategy.'],
            ['Occlusion & Visibility', 'HW occlusion queries, Precomputed Visibility, cull distance volumes.'],
            ['Collision & Traces', 'Simple vs complex collision, trace channels, async trace patterns.'],
            ['Animation & Audio', 'Animation budget, skeletal LOD, audio streaming vs in-memory.'],
            ['Scalability & CVars', 'r.* console variable system, scalability presets, per-platform tuning.'],
          ].map(([title, desc]) => (
            <li key={title} className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div><strong className="text-white block mb-0.5">{title}</strong><span className="text-kingfisher-muted text-sm">{desc}</span></div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
    <SectionCard title="Not Yet Implemented (Future Scope)" icon={CircleDashed} color={COLORS.status.warning}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ['Live Memory Connect', 'Live WebSocket metrics binding from C++ UE5 Game Process to React HUD representation.'],
          ['Deep Visual Debug Overlays', 'In-game drawing overlays corresponding to Bitmask states or AI NavMesh traces.'],
          ['Mobile-Specific Guide', 'Different draw call budgets, ES3.1 shader tier, thermal throttling strategies.'],
          ['Shader Permutation Profiling', 'Shader compilation times, permutation reduction strategies for shipping builds.'],
        ].map(([title, desc]) => (
          <div key={title} className="flex items-start gap-3">
            <CircleDashed className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
            <div><strong className="text-white block mb-0.5">{title}</strong><span className="text-kingfisher-muted text-sm">{desc}</span></div>
          </div>
        ))}
      </div>
    </SectionCard>
  </div>
);

const PipelineTab = () => (
  <div className="space-y-6">
    <PageHeader title="The 16.7ms Pipeline" subtitle="Understanding 60 FPS parallel engine architecture. 13.5ms targets with 3ms buffer per thread." />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SectionCard title="Game Thread (CPU)" icon={Activity} color={COLORS.status.info}>
        <p><strong>Frame N:</strong> The Brain. Calculates AI, physics, animations, Blueprint/C++. Must finish before 13.5ms.</p>
        <div className="mt-3 space-y-1">
          <StatRow label="World Logic" value="~3.0ms" />
          <StatRow label="AI & Behavior Tree" value="~3.5ms" />
          <StatRow label="Animations" value="~2.5ms" />
          <StatRow label="Physics / Audio" value="~2.0ms" />
          <StatRow label="Safety Buffer" value="4.17ms" color="text-emerald-400" />
        </div>
      </SectionCard>
      <SectionCard title="Draw Thread (CPU)" icon={LayoutTemplate} color={COLORS.status.warning}>
        <p><strong>Frame N-1:</strong> The Coordinator. Translates Game Thread data, handles occlusion culling, packages Draw Calls.</p>
        <div className="mt-3 space-y-1">
          <StatRow label="Visibility / Culling" value="~4.0ms" />
          <StatRow label="Draw Call Prep" value="~5.0ms" />
          <StatRow label="Shadow Setup" value="~3.0ms" />
          <StatRow label="Target Ceiling" value="13.5ms" color="text-amber-400" />
        </div>
      </SectionCard>
      <SectionCard title="GPU" icon={Monitor} color={COLORS.status.success}>
        <p><strong>Frame N-2:</strong> The Artist. Rasterizes polygons, calculates pixels, shadows, Lumen GI, Post-Process.</p>
        <div className="mt-3 space-y-1">
          <StatRow label="Base Pass" value="~3.5ms" />
          <StatRow label="Shadows (VSM)" value="~3.5ms" />
          <StatRow label="Lumen GI" value="~4.5ms" />
          <StatRow label="Post-Process" value="~1.5ms" />
        </div>
      </SectionCard>
    </div>
    <HighlightBox type="success">
      <strong>The Parallel Secret:</strong> Game Thread (10ms) + Draw Thread (10ms) + GPU (10ms) = 30ms of work delivered simultaneously every 10ms. Frame rate is determined by the <em>slowest individual thread</em> — not the sum.
    </HighlightBox>
    <SectionCard title="The Thread Interlocking Trap" icon={Network} color={COLORS.status.error}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black/20 p-4 rounded border border-red-500/20">
          <strong className="text-red-400">GPU Bottleneck (Draw Waits)</strong>
          <p className="mt-1 text-kingfisher-muted text-sm">If GPU takes 25ms, Draw Thread finishes its 10ms but must wait idle (<code>WaitForGPU</code>) before handing off the next frame. FPS collapses to the GPU's pace.</p>
        </div>
        <div className="bg-black/20 p-4 rounded border border-amber-500/20">
          <strong className="text-amber-400">CPU Bottleneck (GPU Starves)</strong>
          <p className="mt-1 text-kingfisher-muted text-sm">If AI pathfinding takes 30ms but GPU is only 5ms, the GPU sits idle at 20% utilization waiting for geometry commands. Locked to ~33 FPS by the CPU.</p>
        </div>
      </div>
    </SectionCard>
  </div>
);

const ArchitectureTab = () => (
  <div className="space-y-6">
    <PageHeader title="CPU & RAM Memory Architecture" subtitle="Eliminating traversal stutters, memory leaks, garbage collection sweeps, and cache misses." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="The Golden Rule: Ban Event Tick" icon={Clock} color={COLORS.kingfisher.warm}>
        <p className="font-semibold text-white">Event-Driven Architecture Only</p>
        <p className="mt-2 text-sm">Ban Event Tick on 99% of classes. Turn off <code>Start with Tick Enabled</code>. CPU is almost always the bottleneck due to accumulated per-frame logic.</p>
        <div className="mt-4 p-3 bg-black/30 rounded border border-purple-500/20">
          <strong className="text-purple-400">Event Bus Integration:</strong> Use decoupled Multi-Cast Delegates (UGameEventBus). Emit isolated signals like <code>"PLAYER_DEATH"</code> so remote systems subscribe asynchronously instead of polling every frame.
        </div>
        <div className="mt-3 p-3 bg-black/30 rounded border border-blue-500/20 text-sm">
          <strong className="text-blue-400">When You Must Use Tick:</strong> Set <code>PrimaryActorTick.TickInterval = 0.1f;</code> — anything that updates slower than 10 FPS logic (health regen, map fog) costs 90% less immediately.
        </div>
      </SectionCard>
      <SectionCard title="Object Pooling — Defeating GC" icon={Database} color={COLORS.status.success}>
        <p className="font-semibold text-white">Never Destroy What You Can Recycle</p>
        <p className="mt-2 text-sm text-kingfisher-muted">When you <code>Destroy()</code> an actor it marks as "Pending Kill". The GC sweeps every 60s causing 2–5ms hitches.</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-kingfisher-muted">
          <li><strong className="text-white">UObjects/Actors:</strong> Use an Object Pool — hide and recycle. Spawn once, reuse forever.</li>
          <li><strong className="text-white">Niagara Particles:</strong> Use GPU-tier. Niagara recycles memory instantly and bypasses the GC mechanism entirely.</li>
          <li><strong className="text-white">GC Tuning:</strong> Set <code>gc.TimeBetweenPurgingPendingKillObjects=120</code> to halve sweep frequency in stable scenes.</li>
        </ul>
      </SectionCard>
      <SectionCard title="3-Layer Optimization Structure" icon={Layers} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">Separate concerns to maintain pure data states and optimize caching:</p>
        <ul className="list-disc pl-5 space-y-3 text-sm text-kingfisher-muted">
          <li><strong className="text-white">1. Definition (UDataAsset):</strong> Static read-only truth (Name, Base Damage). Loaded via async. Never mutated at runtime.</li>
          <li><strong className="text-white">2. Runtime State (USTRUCT):</strong> Lean mutable representation — durability, bitmasks. Must fit in L1 Cache cycles. Never include UObjects here.</li>
          <li><strong className="text-white">3. Presentation (UWidget):</strong> Render mirror only. Zero simulation logic permitted. Reads from State on delegate signal.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Soft Pointers & Transitive Loading" icon={HardDrive} color={COLORS.status.info}>
        <p className="font-semibold text-white mb-2">Preventing Traversal Stutter</p>
        <p className="text-sm mb-3">Hard Reference to an asset triggers synchronous load holding the Main Thread hostage ("Traversal Hitching").</p>
        <p className="text-sm">Use <strong>TSoftObjectPtr</strong> everywhere. It holds a text path and only executes Asynchronous requests via <code>StreamableManager.RequestAsyncLoad</code>.</p>
        <div className="mt-3 bg-black/20 p-2 rounded text-xs font-mono text-amber-300 border border-amber-500/20">
          Hard ref chain: CharacterBP → WeaponBP → 500MB texture atlas → loaded at startup
        </div>
      </SectionCard>
    </div>
  </div>
);

const DrawCallsTab = () => (
  <div className="space-y-6">
    <PageHeader title="Draw Calls & Instancing" subtitle="Every unique mesh submission is a CPU-to-GPU command. Too many commands starve the bus and cripple frame rates." />
    <HighlightBox type="danger">
      <strong>The 1,000 Draw Call Rule:</strong> A well-optimized AAA open world targets under 1,000–2,000 draw calls per frame on the Draw Thread. Each call carries fixed CPU overhead (~0.02–0.05ms). 10,000 calls = 200–500ms of pure overhead — game over.
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="What Creates a Draw Call?" icon={BarChart3} color={COLORS.status.error}>
        <p className="text-sm mb-3">Each unique combination of these generates a separate draw call:</p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-kingfisher-muted">
          <li>One unique <strong className="text-white">Static Mesh</strong> in the viewport</li>
          <li>One unique <strong className="text-white">Material</strong> applied to that mesh</li>
          <li>Each <strong className="text-white">Material Slot</strong> on a mesh is a separate call</li>
          <li>Each <strong className="text-white">Shadow Map</strong> face (cube = 6 calls per point light)</li>
          <li>Each unique <strong className="text-white">Decal</strong> projection</li>
        </ul>
        <div className="mt-3 p-3 bg-red-950/30 border border-red-500/20 rounded text-sm">
          <strong className="text-red-400">Danger Pattern:</strong> A village with 200 unique rocks, each with 2 material slots = 400 draw calls for just the rocks.
        </div>
      </SectionCard>
      <SectionCard title="HISM / ISM — The Instancing Fix" icon={Layers} color={COLORS.status.success}>
        <p className="text-sm mb-3"><strong>Hierarchical Instanced Static Mesh (HISM)</strong> batches thousands of identical meshes into a <em>single</em> draw call.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li><strong className="text-white">ISM (basic):</strong> Flat list, all visible or all culled. Good for dense identical props.</li>
          <li><strong className="text-white">HISM (advanced):</strong> Builds an internal tree. Each cluster can be independently culled by the GPU. Use for foliage, rocks, modular buildings.</li>
          <li><strong className="text-white">Auto-Instancing:</strong> UE5's <em>Merged Actor</em> tool bakes separate actors into a single HISM asset automatically.</li>
        </ul>
        <div className="mt-3 p-2 bg-emerald-900/20 border border-emerald-500/20 rounded text-xs font-mono text-emerald-300">
          500 rocks individually = 500 calls → HISM = 1 call
        </div>
      </SectionCard>
      <SectionCard title="Material Count Reduction" icon={Palette} color={COLORS.kingfisher.warm}>
        <p className="font-semibold text-white mb-2">UV Atlasing — Pack Many into One</p>
        <p className="text-sm text-kingfisher-muted mb-3">Instead of 10 materials on 10 prop types, pack all 10 textures into a single atlas texture. All 10 props share one material — all batched into one draw call.</p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-kingfisher-muted">
          <li><strong>Limit material slots per mesh</strong> to 1–2 maximum for instanced foliage/props.</li>
          <li><strong>Master Materials</strong> with parameter collections allow massive visual variety from a single draw call shader.</li>
          <li>Each unique <strong>Material Instance</strong> that differs only in scalar/texture parameters still counts as the same draw call batch.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Mesh Merging Strategies" icon={GitBranch} color={COLORS.kingfisher.blue}>
        <p className="text-sm text-kingfisher-muted mb-3">Combining static geometry eliminates per-mesh overhead. Choose the right tool:</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li><strong className="text-white">Merge Actors Tool:</strong> Editor-side bake. Combines N props into 1 mesh + 1 atlas texture. Permanent — loses individual editability.</li>
          <li><strong className="text-white">World Partition HLODs:</strong> Automatic far-distance mesh proxy generation. 1000 distant buildings → 1 merged imposter mesh.</li>
          <li><strong className="text-white">Blueprint Actor Merging:</strong> Group related props into Blueprint actors with components — inherits single-actor culling advantages.</li>
        </ul>
      </SectionCard>
    </div>
    <SectionCard title="Draw Call Budget Reference" icon={Database} color={COLORS.status.warning}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['Open World (AAA)', '800–2,000', 'text-emerald-400'],
          ['Urban Scene (Dense)', '1,500–3,000', 'text-amber-400'],
          ['Interior Room', '200–600', 'text-emerald-400'],
          ['Particle Systems', '10–50', 'text-blue-400'],
          ['UI / HUD', '20–100', 'text-blue-400'],
          ['Shadow Passes', '300–800', 'text-amber-400'],
          ['Critical Failure', '>5,000', 'text-red-400'],
          ['Mobile Target', '<300', 'text-purple-400'],
        ].map(([label, value, color]) => (
          <div key={label} className="bg-black/20 p-3 rounded border border-kingfisher-border/50 text-center">
            <div className={`font-mono text-lg font-bold ${color}`}>{value}</div>
            <div className="text-xs text-kingfisher-muted mt-1">{label}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  </div>
);

const LODTab = () => (
  <div className="space-y-6">
    <PageHeader title="LOD Systems" subtitle="Level of Detail reduces geometry complexity as objects move farther from the camera — the single highest-ROI optimization in 3D rendering." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="How LODs Work — Screen Size Thresholds" icon={Triangle} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">UE5 calculates the projected screen area of each mesh each frame. When it crosses a threshold, it switches to the next LOD level.</p>
        <div className="space-y-2 text-sm">
          {[
            ['LOD 0 (Full)', '>0.25 screen %', 'Camera range', 'text-emerald-400'],
            ['LOD 1', '0.10 – 0.25%', '~30m away', 'text-blue-400'],
            ['LOD 2', '0.03 – 0.10%', '~80m away', 'text-amber-400'],
            ['LOD 3', '0.01 – 0.03%', '~200m away', 'text-orange-400'],
            ['LOD 4 (Imposter)', '<0.01%', '~500m+ away', 'text-red-400'],
          ].map(([lod, threshold, dist, color]) => (
            <div key={lod} className="flex items-center justify-between p-2 bg-black/20 rounded border border-kingfisher-border/30">
              <span className={`font-semibold text-xs ${color}`}>{lod}</span>
              <span className="text-kingfisher-muted text-xs">{threshold}</span>
              <span className="text-xs text-white">{dist}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-kingfisher-muted">Triangle targets: LOD0=100%, LOD1=40%, LOD2=15%, LOD3=5%, LOD4=&lt;1%.</p>
      </SectionCard>
      <SectionCard title="Static LOD vs HLOD vs Nanite" icon={Layers} color={COLORS.status.warning}>
        <div className="space-y-4 text-sm">
          <div className="p-3 bg-black/20 rounded border border-blue-500/20">
            <strong className="text-blue-400">Static LOD (Classic)</strong>
            <p className="mt-1 text-kingfisher-muted">Hand-crafted or auto-generated lower-poly meshes per distance tier. Full artist control. Works on all hardware. Required for alpha-masked vegetation.</p>
          </div>
          <div className="p-3 bg-black/20 rounded border border-amber-500/20">
            <strong className="text-amber-400">HLOD (Hierarchical LOD)</strong>
            <p className="mt-1 text-kingfisher-muted">Merges many actors into a single proxy mesh at far distances. Reduces draw calls dramatically for complex scenes. Auto-generated, no artist work.</p>
          </div>
          <div className="p-3 bg-black/20 rounded border border-emerald-500/20">
            <strong className="text-emerald-400">Nanite (Micro-poly Virtual)</strong>
            <p className="mt-1 text-kingfisher-muted">No LODs needed. Engine streams micro-triangles from disk. Trades GPU memory pressure for zero artist LOD work. Requires SSD.</p>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Skeletal Mesh LOD — Characters" icon={Activity} color={COLORS.status.success}>
        <p className="text-sm mb-3">Characters are expensive because they deform every bone each frame. LOD is critical:</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li><strong className="text-white">LOD 0 (Hero):</strong> Full skeleton, 15,000–50,000 triangles, morph targets, cloth simulation.</li>
          <li><strong className="text-white">LOD 1:</strong> 40% reduction, remove hand/toe bones, disable cloth. ~30m away.</li>
          <li><strong className="text-white">LOD 2:</strong> 80% reduction, merge material slots to 1, remove facial bones. ~80m away.</li>
          <li><strong className="text-white">LOD 3 (Imposter):</strong> Billboard sprite for background crowds. ~200m+ away. Zero bones.</li>
          <li><strong className="text-white">Animation Sharing Plugin:</strong> 50+ distant characters share one animation evaluation = massive CPU savings.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Imposter Sprites — The Background Secret" icon={Image} color={COLORS.kingfisher.warm}>
        <p className="text-sm mb-3">At extreme distances, replace 3D geometry entirely with a pre-rendered camera-facing sprite (billboard). The viewer cannot tell the difference beyond ~300m.</p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-kingfisher-muted">
          <li>A forest of 10,000 trees at LOD3 = 10,000 billboard quads. GPU cost: near zero.</li>
          <li>Unreal's <strong>Imposter Bake</strong> tool auto-generates multi-angle sprites from the source mesh.</li>
          <li>Combine with <strong>HISM</strong> to batch all 10,000 billboard instances into one draw call.</li>
        </ul>
        <HighlightBox type="success" className="mt-3">
          <strong>ROI:</strong> Adding LOD3 imposters to a dense forest scene can save 8–15ms GPU time in a single optimization step.
        </HighlightBox>
      </SectionCard>
    </div>
  </div>
);

const MaterialsTab = () => (
  <div className="space-y-6">
    <PageHeader title="Materials & Shaders" subtitle="Materials compile to GPU shaders. Every instruction, every branch, and every texture sample has a measurable cost per pixel per frame." />
    <HighlightBox type="warning">
      <strong>The Instruction Count Rule:</strong> Enable <em>Shader Complexity View</em> (viewport → View Mode → Shader Complexity) before shipping. Green = cheap. Red = expensive. White = critically over-budget. A material costing 200+ instructions per pixel will destroy frame rates in dense scenes.
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="The Translucency Overdraw Problem" icon={Layers} color={COLORS.status.error}>
        <p className="font-semibold text-white mb-2">The #1 GPU Killer in Particle-Heavy Scenes</p>
        <p className="text-sm text-kingfisher-muted mb-3">Translucent materials (smoke, glass, fire) cannot be depth-sorted into the GBuffer. They must be rendered in a separate forward pass and blended per-pixel — every pixel drawn multiple times.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li>5 overlapping smoke sheets = 5× the pixel cost for that screen area.</li>
          <li>Fix: Use <strong className="text-white">Dithered Transparency</strong> (opaque dither pattern simulates translucency at zero overdraw cost).</li>
          <li>Fix: Reduce particle sprite sizes and counts aggressively — designers always request too many.</li>
          <li>Fix: Use <strong className="text-white">Refraction + Responsive AA</strong> only on hero translucent objects (car glass, water surface).</li>
        </ul>
      </SectionCard>
      <SectionCard title="Dynamic Branch Avoidance" icon={GitBranch} color={COLORS.status.warning}>
        <p className="text-sm mb-3">The GPU runs shaders on thousands of pixels in parallel (SIMD). Dynamic branches that differ per-pixel force the GPU to serialize execution.</p>
        <div className="space-y-2 text-sm">
          <div className="p-2 bg-red-950/30 border border-red-500/20 rounded">
            <strong className="text-red-400">Bad:</strong> <code>if (bIsWet) ApplyWetness();</code> — different per-pixel, kills parallelism.
          </div>
          <div className="p-2 bg-emerald-900/20 border border-emerald-500/20 rounded">
            <strong className="text-emerald-400">Good:</strong> Multiply by a <code>WetnessMap</code> texture and lerp. No branch — pure math, fully parallel.
          </div>
        </div>
        <p className="text-xs text-kingfisher-muted mt-3">Static switches (compile-time <code>StaticSwitchParameter</code>) are free — they branch before compilation, removing dead code entirely from the shader.</p>
      </SectionCard>
      <SectionCard title="PBR Texture Packing" icon={Package} color={COLORS.status.success}>
        <p className="font-semibold text-white mb-2">4 Maps → 1 Texture Sample</p>
        <p className="text-sm text-kingfisher-muted mb-3">Each texture sample is a separate GPU memory access. Pack grayscale maps into RGBA channels:</p>
        <div className="space-y-1 text-sm font-mono">
          <div className="flex gap-4 p-2 bg-black/20 rounded">
            <span className="text-red-400 w-6">R:</span><span className="text-kingfisher-muted">Ambient Occlusion (AO)</span>
          </div>
          <div className="flex gap-4 p-2 bg-black/20 rounded">
            <span className="text-emerald-400 w-6">G:</span><span className="text-kingfisher-muted">Roughness</span>
          </div>
          <div className="flex gap-4 p-2 bg-black/20 rounded">
            <span className="text-blue-400 w-6">B:</span><span className="text-kingfisher-muted">Metallic</span>
          </div>
          <div className="flex gap-4 p-2 bg-black/20 rounded">
            <span className="text-white w-6">A:</span><span className="text-kingfisher-muted">Cavity / unused</span>
          </div>
        </div>
        <p className="text-xs text-kingfisher-muted mt-2">Result: 4 texture samples reduced to 1. Saves 3 memory bandwidth reads per pixel, every frame.</p>
      </SectionCard>
      <SectionCard title="Material Domain Selection" icon={Palette} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">Each domain compiles a fundamentally different shader tier:</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li><strong className="text-white">Surface (Deferred Lit):</strong> Standard PBR objects. Full GBuffer write. Cheapest for scene geometry.</li>
          <li><strong className="text-white">Unlit:</strong> No lighting calculation at all. Use for emissive VFX, skyboxes, UI elements.</li>
          <li><strong className="text-white">Translucent:</strong> Forward pass. Most expensive. Reserve for water, glass, hero FX.</li>
          <li><strong className="text-white">Post Process:</strong> Runs once per screen pixel. Even simple materials cost massively at 4K. Profile aggressively.</li>
          <li><strong className="text-white">Decal:</strong> Projects onto surfaces. Limit to 50 visible decals. Use Deferred Decals, never Translucent.</li>
        </ul>
      </SectionCard>
    </div>
    <SectionCard title="Material Complexity Quick Reference" icon={Zap} color={COLORS.kingfisher.warm}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['Simple Rock', '50–80 instr', 'text-emerald-400', 'Good'],
          ['Character Skin', '100–150 instr', 'text-blue-400', 'Acceptable'],
          ['Foliage (masked)', '80–120 instr', 'text-amber-400', 'Watch it'],
          ['Water Surface', '200–400 instr', 'text-red-400', 'Hero asset only'],
          ['Glass/Refraction', '300–600 instr', 'text-red-400', 'Limit: 2–3 objects'],
          ['Emissive VFX', '20–50 instr', 'text-emerald-400', 'Use Unlit'],
          ['Layered Landscape', '150–250 instr', 'text-amber-400', 'Reduce layers'],
          ['Post Process FX', '800+ instr', 'text-purple-400', 'Full screen cost!'],
        ].map(([label, value, color, note]) => (
          <div key={label} className="bg-black/20 p-3 rounded border border-kingfisher-border/50">
            <div className={`font-mono text-sm font-bold ${color}`}>{value}</div>
            <div className="text-xs text-white mt-0.5">{label}</div>
            <div className="text-xs text-kingfisher-muted mt-0.5">{note}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  </div>
);

const TexturesTab = () => (
  <div className="space-y-6">
    <PageHeader title="Textures & Streaming" subtitle="Textures consume 40–60% of VRAM. Poor management causes stuttering, pop-in, and out-of-memory crashes." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Mip Maps — Non-Negotiable" icon={TrendingDown} color={COLORS.status.error}>
        <p className="font-semibold text-white mb-2">Never ship a texture without mip maps.</p>
        <p className="text-sm text-kingfisher-muted mb-3">Without mips, a distant rock samples a 4K texture at 4×4 screen pixels — 16 million texels wasted, causing shimmering aliasing and massive GPU cache thrashing.</p>
        <p className="text-sm">Mips pre-compute progressively halved versions (2K → 1K → 512 → 256…). The GPU selects the appropriate mip automatically, achieving:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-kingfisher-muted">
          <li>No texture aliasing shimmering</li>
          <li>Better GPU cache utilization</li>
          <li>~33% extra VRAM overhead (acceptable)</li>
        </ul>
        <div className="mt-3 p-2 bg-black/20 rounded text-xs font-mono text-red-300 border border-red-500/20">
          Texture Settings → Generate Mip Maps → ✅ Always enabled
        </div>
      </SectionCard>
      <SectionCard title="Compression Formats (BC Codecs)" icon={HardDrive} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">GPU-native compression. Not CPU ZIP — GPU reads these natively without decompression overhead.</p>
        <div className="space-y-2 text-sm font-mono">
          {[
            ['BC1 (DXT1)', 'Opaque color (no alpha)', '8:1 ratio', 'text-emerald-400'],
            ['BC3 (DXT5)', 'Color + alpha (RGT)', '4:1 ratio', 'text-blue-400'],
            ['BC4', 'Single channel grayscale (AO, roughness)', '8:1 ratio', 'text-blue-400'],
            ['BC5', 'Normal maps (XY channels)', '4:1 ratio', 'text-amber-400'],
            ['BC6H', 'HDR textures (skies, emissive)', '6:1 ratio', 'text-purple-400'],
            ['BC7', 'High quality color + alpha', '~3:1 ratio', 'text-amber-400'],
          ].map(([format, use, ratio, color]) => (
            <div key={format} className="flex items-center p-2 bg-black/20 rounded border border-kingfisher-border/30 gap-3">
              <span className={`w-24 shrink-0 ${color}`}>{format}</span>
              <span className="text-kingfisher-muted text-xs flex-1">{use}</span>
              <span className="text-white text-xs">{ratio}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-kingfisher-muted mt-2">Use Auto (DX) in UE5 — it selects BC format automatically per texture type.</p>
      </SectionCard>
      <SectionCard title="Texture Streaming Pool" icon={Database} color={COLORS.status.warning}>
        <p className="font-semibold text-white mb-2">The Streaming Budget</p>
        <p className="text-sm text-kingfisher-muted mb-3">UE5 maintains a streaming pool — textures not fitting are forcibly reduced to a lower mip. Too small a pool = constant blurry textures.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li>Check: <code className="text-amber-300">stat streaming</code> console command. Watch "Streaming Pool Used" vs "Total".</li>
          <li>Tune: <code className="text-amber-300">r.Streaming.PoolSize=2048</code> (MB). Default 1000MB is often too low for 4K textures.</li>
          <li>Profile: <strong>Memory Insights</strong> → Texture category shows every loaded texture with mip resolution.</li>
        </ul>
        <div className="mt-3 space-y-1">
          <StatRow label="Recommended pool (8GB VRAM)" value="2,000 MB" />
          <StatRow label="Recommended pool (12GB VRAM)" value="3,500 MB" />
          <StatRow label="Streaming timeout" value="0.5s" note="before mip downgrade" />
        </div>
      </SectionCard>
      <SectionCard title="Virtual Textures (VT)" icon={Layers} color={COLORS.status.success}>
        <p className="font-semibold text-white mb-2">Page-Based Streaming for Massive Textures</p>
        <p className="text-sm text-kingfisher-muted mb-3">Virtual Textures enable textures far larger than VRAM — only the visible tiles are loaded. Essential for landscape layers and high-resolution environment atlases.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li><strong className="text-white">Runtime VT:</strong> Dynamic streaming, works with moving objects, adds ~1ms overhead for page table lookup.</li>
          <li><strong className="text-white">Lightmap VT:</strong> Baked lightmaps streamed as VT pages. Eliminates lightmap resolution limits entirely.</li>
          <li><strong className="text-white">Landscape Material:</strong> Use Landscape Layer Blend with VT enabled — supports 30+ layers without memory explosion.</li>
        </ul>
        <HighlightBox type="warning" className="mt-3">
          VT adds GPU overhead for page cache misses. Don't use VT on small props — only landscapes and large environment textures benefit.
        </HighlightBox>
      </SectionCard>
    </div>
    <SectionCard title="Texture Resolution Decision Chart" icon={Monitor} color={COLORS.kingfisher.warm}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <strong className="text-white block mb-2">Use 4K (4096×4096) for:</strong>
          <ul className="list-disc pl-5 space-y-1 text-kingfisher-muted">
            <li>Hero character skin / armor (up close always)</li>
            <li>Large architectural hero surfaces (cathedral walls, massive rocks)</li>
            <li>Landscape albedo / normal (already VT-paged)</li>
          </ul>
        </div>
        <div>
          <strong className="text-white block mb-2">Use 2K (2048×2048) for:</strong>
          <ul className="list-disc pl-5 space-y-1 text-kingfisher-muted">
            <li>Secondary character gear, weapons, vehicles</li>
            <li>Medium props (barrels, crates, tables)</li>
            <li>Most environment surfaces</li>
          </ul>
        </div>
        <div>
          <strong className="text-white block mb-2">Use 1K (1024×1024) for:</strong>
          <ul className="list-disc pl-5 space-y-1 text-kingfisher-muted">
            <li>Small props (cups, books, coins)</li>
            <li>LOD1+ replacement textures</li>
            <li>Trim sheets</li>
          </ul>
        </div>
        <div>
          <strong className="text-white block mb-2">Use 512 or smaller for:</strong>
          <ul className="list-disc pl-5 space-y-1 text-kingfisher-muted">
            <li>Particles and VFX sprites</li>
            <li>UI icons (use 256 max)</li>
            <li>Distant LOD3+ meshes</li>
          </ul>
        </div>
      </div>
    </SectionCard>
  </div>
);

const LightingTab = () => (
  <div className="space-y-6">
    <PageHeader title="Light & Shadows Masterclass" subtitle="Delivering Lumen GI natively without catastrophic millisecond deficits." />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SectionCard title="Understanding Lumen" icon={Sun} color={COLORS.kingfisher.warm}>
        <p className="mb-2"><strong>Lumen Only Computes Indirect Light (GI & Reflections).</strong></p>
        <p className="text-sm">Lumen does <em>not</em> calculate the primary beam of light or sharp shadow hits. That is handled by Direct Lighting and Virtual Shadow Maps (VSMs). Lumen exclusively mimics indirect bouncing scatter light.</p>
        <div className="mt-4 flex gap-2 text-xs font-mono bg-black/40 p-2 rounded flex-wrap">
          <span className="text-blue-400">Directional Light</span>
          <span className="text-kingfisher-muted">→</span>
          <span className="text-purple-400">VSM Sharp Shadow</span>
          <span className="text-kingfisher-muted">→</span>
          <span className="text-orange-400">Lumen Ray Trace Bounce</span>
        </div>
      </SectionCard>
      <SectionCard title="Controlling Lumen Overhead" icon={Settings} color={COLORS.kingfisher.muted}>
        <p>Lumen can be micro-managed radically to save budgets:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>Per-Light Limits:</strong> Use <code>Affect Global Illumination</code> toggles. Minor torches provide direct VSM light but do not contribute to expensive Lumen scatter.</li>
          <li><strong>Emissive Trick:</strong> Apply an emissive material rather than a Point Light Actor. Lumen integrates emissive surfaces via its screen pipeline natively — "Free" GI bounce lighting.</li>
          <li><strong>Scene Capture Lumen:</strong> Disable Lumen in secondary cameras / mirrors. Use a cube-capture reflection instead.</li>
        </ul>
      </SectionCard>
      <SectionCard className="lg:col-span-2" title="Defensive Open World Lighting Rules" icon={Zap} color={COLORS.status.success}>
        <ol className="list-decimal pl-5 space-y-3 text-kingfisher-muted text-sm">
          <li><strong>Virtual Shadow Maps (VSM) Dominance:</strong> Cached VSM shadow data is imperative. Shadows only recalculate if a dynamic skeleton walks through. Avoid un-cached heavy calculations.</li>
          <li><strong>The "No Shadow" Approach:</strong> Eliminate Cast Shadows on 90% of minor environmental lights (sconces, braziers, fireflies). Compute cost plummets.</li>
          <li><strong>Strict Cull Ranges:</strong> Apply Max Draw Distance Fade immediately. A village torch 200m away should be phased out entirely before logic evaluation.</li>
          <li><strong>Shadow Cascade Bias:</strong> Tune <code>r.Shadow.CSMMaxCascades</code> from default 4 to 2 in open worlds — barely visible difference, 30% shadow cost reduction.</li>
        </ol>
      </SectionCard>
      <SectionCard className="lg:col-span-2" title="Lighting Architecture Alternatives" icon={Sun} color={COLORS.kingfisher.blue}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/20 p-3 rounded border border-kingfisher-border/50">
            <strong className="text-white text-sm">Lumen (Dynamic GI)</strong>
            <p className="mt-1 text-xs text-kingfisher-muted">Heavy. Handles changing times of day, darkness/cave delving, and dynamic destruction. Requires high-end hardware.</p>
          </div>
          <div className="bg-black/20 p-3 rounded border border-emerald-500/30">
            <strong className="text-emerald-400 text-sm">Baked Lighting (Lightmass)</strong>
            <p className="mt-1 text-xs text-kingfisher-muted">Flawless performance (free GPU cost). World frozen in time — no day/night cycles. Ghost shadows can break immersion.</p>
          </div>
          <div className="bg-black/20 p-3 rounded border border-blue-500/30">
            <strong className="text-blue-400 text-sm">SSGI & SSR</strong>
            <p className="mt-1 text-xs text-kingfisher-muted">Screen Space effects. Very high performance for dynamic scenes. Breaks instantly if the light source or reflecting object is off-screen.</p>
          </div>
        </div>
      </SectionCard>
    </div>
  </div>
);

const PostProcessTab = () => (
  <div className="space-y-6">
    <PageHeader title="Post-Process & Temporal Upscaling" subtitle="Everything that runs after the 3D scene is rendered — applied once per screen pixel — must be budgeted carefully." />
    <HighlightBox type="danger">
      <strong>Post-process effects multiply with resolution.</strong> A 4ms effect at 1080p becomes 16ms at 4K (4× the pixels). Design for the highest target resolution.
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Temporal Super Resolution (TSR)" icon={Monitor} color={COLORS.status.success}>
        <p className="font-semibold text-white mb-2">Render at 50–70% resolution. Upscale to native quality.</p>
        <p className="text-sm text-kingfisher-muted mb-3">TSR (UE5's native solution) accumulates information over multiple frames to reconstruct near-native image quality from a sub-native render target.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li><strong className="text-white">Performance gain:</strong> Rendering at 67% resolution (4K→~2.7K internal) saves ~50% GPU time on rasterization.</li>
          <li><strong className="text-white">Quality:</strong> Near-indistinguishable from native at default quality preset.</li>
          <li><strong className="text-white">Cost:</strong> ~1.5–2.5ms overhead for the upscale pass itself.</li>
          <li><strong className="text-white">Ghosting:</strong> Fast-moving objects need velocity vectors. Ensure all materials write to the velocity buffer.</li>
        </ul>
      </SectionCard>
      <SectionCard title="DLSS / FSR — Third-Party Upscalers" icon={Zap} color={COLORS.kingfisher.blue}>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-black/20 rounded border border-green-500/20">
            <strong className="text-green-400">DLSS 3 (NVIDIA RTX Only)</strong>
            <p className="mt-1 text-kingfisher-muted">AI-trained upscaler + Frame Generation (inserts AI-generated frames between rendered frames). Best image quality. Requires RTX GPU and separate DLSS plugin.</p>
          </div>
          <div className="p-3 bg-black/20 rounded border border-orange-500/20">
            <strong className="text-orange-400">FSR 3 (AMD / Cross-Platform)</strong>
            <p className="mt-1 text-kingfisher-muted">Temporal upscaler + Frame Interpolation. Works on all GPUs including integrated. Slightly lower quality than DLSS at equivalent settings. Excellent for console/cross-platform.</p>
          </div>
          <div className="p-3 bg-black/20 rounded border border-blue-500/20">
            <strong className="text-blue-400">TSR (Built-in, Zero Cost)</strong>
            <p className="mt-1 text-kingfisher-muted">No licensing. No plugin. No platform restrictions. Quality rivals DLSS Quality mode. Use as baseline before adding third-party upscalers.</p>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Post-Process Effect Cost Table" icon={Database} color={COLORS.status.warning}>
        <div className="space-y-1">
          {[
            ['Depth of Field (Cinematic)', '2.0–5.0ms', 'text-red-400', 'Only in cutscenes'],
            ['Motion Blur', '0.5–2.0ms', 'text-amber-400', 'Consider disabling for competitive'],
            ['Bloom', '0.3–1.0ms', 'text-blue-400', 'Very cheap, keep enabled'],
            ['Lens Flare', '0.1–0.3ms', 'text-emerald-400', 'Free for all intents'],
            ['Screen Space Reflections', '1.0–3.0ms', 'text-amber-400', 'Replaced by Lumen if enabled'],
            ['Ambient Occlusion (SSAO)', '0.5–1.5ms', 'text-amber-400', 'Free via Lumen if using Lumen'],
            ['Film Grain / Vignette', '0.05ms', 'text-emerald-400', 'Negligible'],
            ['Color Grading (LUT)', '0.1ms', 'text-emerald-400', 'Always use LUTs over math'],
            ['Eye Adaptation / Auto Exposure', '0.1ms', 'text-emerald-400', 'Negligible'],
          ].map(([label, value, color, note]) => (
            <div key={label} className="flex items-center justify-between py-1 border-b border-kingfisher-border/30 last:border-0">
              <span className="text-kingfisher-muted text-xs">{label}</span>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-xs font-semibold ${color}`}>{value}</span>
                <span className="text-kingfisher-muted text-xs hidden md:inline">— {note}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Anti-Aliasing Strategy" icon={Monitor} color={COLORS.kingfisher.warm}>
        <p className="text-sm mb-3">AA method impacts both quality and frame budget significantly:</p>
        <div className="space-y-2 text-sm">
          {[
            ['TSR (recommended)', 'Best quality + performance via temporal reprojection. Built-in UE5.', 'text-emerald-400'],
            ['TAA (legacy)', 'Good quality but prone to ghosting. Pre-UE5 standard.', 'text-blue-400'],
            ['MSAA', 'Edge-only AA. Cheap but misses specular/sub-pixel aliasing. Mobile use.', 'text-amber-400'],
            ['FXAA', 'Post-process blur. Fast but blurry. Last resort only.', 'text-red-400'],
            ['No AA', 'Competitive shooters only (input latency priority over quality).', 'text-kingfisher-muted'],
          ].map(([method, desc, color]) => (
            <div key={method} className="p-2 bg-black/20 rounded">
              <strong className={`text-xs ${color}`}>{method}</strong>
              <p className="text-xs text-kingfisher-muted mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  </div>
);

const OcclusionTab = () => (
  <div className="space-y-6">
    <PageHeader title="Occlusion & Visibility Culling" subtitle="Don't render what the player can't see. Culling is free performance — it eliminates work entirely before the GPU touches it." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Hardware Occlusion Queries (HOQ)" icon={Eye} color={COLORS.status.info}>
        <p className="font-semibold text-white mb-2">GPU Asks: Is This Object Behind Something?</p>
        <p className="text-sm text-kingfisher-muted mb-3">UE5 submits lightweight bounding box tests to the GPU before the full draw call. If the box is entirely behind other geometry, the full mesh is skipped.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li>Cost: ~0.5ms per frame for the query pass.</li>
          <li>Benefit: Can save 30–60% draw calls in dense urban environments with lots of interior occlusion.</li>
          <li>Latency: Results arrive one frame late — tiny objects may flicker when emerging from occlusion.</li>
          <li>Enable: <code>r.HZBOcclusion=1</code> (default on), use Hierarchical Z-Buffer for the query.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Precomputed Visibility (PVS)" icon={Layers} color={COLORS.status.success}>
        <p className="font-semibold text-white mb-2">Bake Visibility for Fixed Camera Paths</p>
        <p className="text-sm text-kingfisher-muted mb-3">For level corridors, interiors, or any scene with known camera positions, PVS pre-calculates exactly which objects are visible from each cell — zero runtime cost.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li>Enable: Place <code>PrecomputedVisibilityVolume</code> actors over playable areas.</li>
          <li>Build: Lighting build pipeline includes PVS calculation.</li>
          <li>Result: Each camera cell has a precomputed list of visible actors. Query = array lookup (nanoseconds).</li>
          <li>Limitation: Not useful for fully open-world games with no fixed paths.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Cull Distance Volumes" icon={TrendingDown} color={COLORS.kingfisher.warm}>
        <p className="font-semibold text-white mb-2">Force Distance-Based Culling per Zone</p>
        <p className="text-sm text-kingfisher-muted mb-3">Place <code>CullDistanceVolume</code> actors to override the default Max Draw Distance for objects inside the volume — aggressive culling for dense interior areas.</p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-kingfisher-muted">
          <li>Small props (cups, papers): cull at 15m max.</li>
          <li>Medium props (furniture): cull at 40m max.</li>
          <li>Architecture elements: cull at 200m.</li>
          <li>Skybox / atmospheric elements: never cull.</li>
        </ul>
        <div className="mt-3 p-2 bg-black/20 rounded text-xs font-mono text-amber-300 border border-amber-500/20">
          r.MaxAnisotropy applies per-texture. Cull Distances apply per-actor-class.
        </div>
      </SectionCard>
      <SectionCard title="Frustum Culling & Distance Cull" icon={Monitor} color={COLORS.kingfisher.blue}>
        <p className="font-semibold text-white mb-2">Built-In Culling (Always Active)</p>
        <div className="space-y-3 text-sm text-kingfisher-muted">
          <div className="p-2 bg-black/20 rounded">
            <strong className="text-white">Frustum Culling:</strong> Objects entirely outside the camera's view frustum (FOV cone) are instantly skipped. Zero cost. Always enabled.
          </div>
          <div className="p-2 bg-black/20 rounded">
            <strong className="text-white">Distance Culling:</strong> Objects beyond their Max Draw Distance are removed from the render queue. Set per-mesh in Static Mesh settings or via Cull Distance Volume.
          </div>
          <div className="p-2 bg-black/20 rounded">
            <strong className="text-white">Significance Manager:</strong> Unreal's higher-level system that controls LOD, tick rate, and culling based on player distance + screen importance. Essential for open-world NPC optimization.
          </div>
        </div>
      </SectionCard>
    </div>
  </div>
);

const CollisionTab = () => (
  <div className="space-y-6">
    <PageHeader title="Collision & Traces" subtitle="Physics queries are CPU operations that block the Game Thread. Every unnecessary trace is stolen frame budget." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Simple vs Complex Collision" icon={Crosshair} color={COLORS.status.warning}>
        <p className="text-sm mb-3">Every mesh has two collision representations. Picking the right one is critical:</p>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-emerald-900/20 border border-emerald-500/20 rounded">
            <strong className="text-emerald-400">Simple Collision</strong>
            <p className="mt-1 text-kingfisher-muted">Convex hull or primitive shape (box, sphere, capsule). Very fast. Used for physics simulation, projectile blocking, character movement. Always prefer this.</p>
          </div>
          <div className="p-3 bg-red-950/20 border border-red-500/20 rounded">
            <strong className="text-red-400">Complex Collision (per-poly)</strong>
            <p className="mt-1 text-kingfisher-muted">Traces every polygon. Accurate but expensive. 10–100× slower than simple collision. <strong>Only use for: line-of-sight traces, bullet penetration, destructible terrain.</strong></p>
          </div>
        </div>
        <div className="mt-3 p-2 bg-black/20 rounded text-xs font-mono text-amber-300 border border-amber-500/20">
          Static Mesh → Collision → Collision Complexity → Simple and Complex (dual) vs Single Convex Hull
        </div>
      </SectionCard>
      <SectionCard title="Trace Channels & Filtering" icon={GitBranch} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">Collision channels act as filters — a trace only tests objects that respond to that channel. Proper channel setup eliminates unnecessary query overhead.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li><strong className="text-white">WorldStatic:</strong> Terrain, buildings. Never moves.</li>
          <li><strong className="text-white">WorldDynamic:</strong> Movable actors (crates, vehicles).</li>
          <li><strong className="text-white">Pawn:</strong> Characters only. Projectiles use this to hit players.</li>
          <li><strong className="text-white">Visibility:</strong> Line-of-sight checks. AI uses this.</li>
          <li><strong className="text-white">Custom Channels:</strong> Define "Bullet" channel — only actors that should stop bullets respond. Furniture ignores bullets.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Async Trace — Never Block the Game Thread" icon={Activity} color={COLORS.status.success}>
        <p className="text-sm mb-3">Synchronous traces (<code>LineTraceSingleByChannel</code>) block the Game Thread until complete. For anything non-critical, use async:</p>
        <div className="space-y-2 text-sm font-mono">
          <div className="p-2 bg-red-950/30 border border-red-500/20 rounded">
            <strong className="text-red-400">Sync (blocking):</strong>
            <p className="text-xs text-kingfisher-muted mt-0.5">GetWorld()-&gt;LineTraceSingleByChannel(...)  ← Game Thread stalls</p>
          </div>
          <div className="p-2 bg-emerald-900/20 border border-emerald-500/20 rounded">
            <strong className="text-emerald-400">Async (non-blocking):</strong>
            <p className="text-xs text-kingfisher-muted mt-0.5">GetWorld()-&gt;AsyncLineTraceByChannel(...)  ← Results next frame via delegate</p>
          </div>
        </div>
        <p className="text-xs text-kingfisher-muted mt-3">For AI vision (checks 50 NPCs/frame), always batch async traces across multiple frames using a queue. Never run 50 sync traces in one tick.</p>
      </SectionCard>
      <SectionCard title="Trace Cost Reference" icon={Database} color={COLORS.status.warning}>
        <div className="space-y-1">
          <StatRow label="Simple sphere sweep" value="~0.002ms" color="text-emerald-400" />
          <StatRow label="Simple line trace" value="~0.001ms" color="text-emerald-400" />
          <StatRow label="Complex line trace (poly)" value="~0.02–0.1ms" color="text-amber-400" />
          <StatRow label="50 NPCs visibility (sync)" value="~5–10ms" color="text-red-400" />
          <StatRow label="50 NPCs visibility (async)" value="~0.5ms overhead" color="text-emerald-400" />
          <StatRow label="PhysX full scene query" value="~0.5–2.0ms" color="text-amber-400" />
        </div>
        <HighlightBox type="success" className="mt-3">
          <strong>Rule:</strong> Any trace running every frame on 10+ actors should be async, batched, or converted to an event-driven check triggered only on relevant state changes.
        </HighlightBox>
      </SectionCard>
    </div>
  </div>
);

const MemoryStateTab = () => (
  <div className="space-y-6">
    <PageHeader title="Memory, Saves & Formats" subtitle="Techniques to avoid massive GC hitches and stream persistent data architectures efficiently." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Save/Load Binary Patterns" icon={Save} color={COLORS.status.success}>
        <p className="mb-2 text-sm"><strong>The Problem:</strong> Saving text models like JSON scales awfully — string representations trigger monumental alloc hitches.</p>
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>FArchive Binary:</strong> Immediate raw byte conversions parsing MBs into milliseconds.</li>
          <li><strong>Delta-Saving Protocol:</strong> Don't serialize base constants. Only serialize dynamic permutations from template states.</li>
          <li><strong>Rolling Buffers:</strong> Prevent save corruption by sequentially allocating multiple internal slots during autosaves against crash faults.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Data-Driven Items & State Packs" icon={Folder} color={COLORS.kingfisher.blue}>
        <p className="mb-2 text-sm">Spawning individual UObjects for thousands of inventory items: GC sweep crushes frame rates.</p>
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>USTRUCT Pointers:</strong> Items evaluate as 64-byte blocks mapped to FName static asset references. Lookups bypass heavy strings.</li>
          <li><strong>Passive Tree Bitmasks:</strong> Entire massive UI progression arrays reduced to pure byte uint32[16] logic, saving monumental networking payloads.</li>
        </ul>
      </SectionCard>
      <SectionCard className="md:col-span-2" title="World Partition & Grid HLODs" icon={Layers} color={COLORS.status.warning}>
        <p className="mb-2 text-sm">Seamless mapping requires dividing the terrain into cell logic and asynchronously pulling chunks in before viewing.</p>
        <div className="bg-black/20 p-3 rounded border border-amber-500/30 mt-2 text-sm text-kingfisher-muted">
          <strong className="text-amber-400">HLOD System:</strong> Automatic process integrating thousands of distant mesh instances into one merged Proxy material, resolving extreme Draw Call delays toward visible horizons. Sub-culling occurs directly per node.
        </div>
      </SectionCard>
    </div>
  </div>
);

const NetworkingPhysicsTab = () => (
  <div className="space-y-6">
    <PageHeader title="Networking & Simulation Protocols" subtitle="Ensuring accurate multiplayer synchronicity while optimizing logic payloads." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Multiplayer Authority & Limits" icon={Globe} color={COLORS.status.info}>
        <p className="mb-2 text-sm"><strong>Server Logic:</strong> The Server is the absolute Referee evaluating all Client inputs before mutation. Predict client animations visually.</p>
        <div className="bg-black/20 p-3 rounded border border-blue-500/30 mt-2 text-sm text-kingfisher-muted">
          <strong className="text-blue-400">COND_SkipOwner Protocol:</strong> Never enforce the server to redundantly reply with a verified stat back to the original client that initiated it. Prevent bandwidth cycle waste.
        </div>
      </SectionCard>
      <SectionCard title="Massive Graph Compression" icon={Network} color={COLORS.kingfisher.warm}>
        <p className="mb-2 text-sm"><strong>Bandwidth Optimization:</strong> Don't sync arrays of bool strings over UDP packets.</p>
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>Bitset Compression:</strong> Entire skill trees, quest steps, and inventory arrays mapped directly into optimized integers representing binary toggles.</li>
          <li><strong>Graph Validations (BFS/DFS):</strong> The server evaluates input path networks mitigating client "jump" or floating island cheating exploits.</li>
        </ul>
      </SectionCard>
      <SectionCard className="md:col-span-2" title="Physics: Sub-Stepping & Spatial Fog" icon={Waves} color={COLORS.status.success}>
        <ul className="list-disc pl-5 space-y-3 text-kingfisher-muted text-sm">
          <li><strong className="text-emerald-400">Hitscan Evaluation:</strong> Completely bypass rendering/collision physics bodies via invisible line logic processing for hyper-velocity impacts.</li>
          <li><strong className="text-emerald-400">Continuous Sub-Stepping:</strong> Slow, dynamic projectiles evaluate logic loops fractions of times a frame to prohibit tunnel/phase glitching against static landscapes.</li>
          <li><strong className="text-emerald-400">Fog Quadtrees:</strong> Rather than O(N²) pixel assessments for dynamic FOW, employ hierarchical partition quadrants restricting resolution iteration counts natively.</li>
        </ul>
      </SectionCard>
    </div>
  </div>
);

const AITab = () => (
  <div className="space-y-6">
    <PageHeader title="Dual-State AI Simulation" subtitle="Scaling A-Life biomes to process massive amounts of NPCs optimally." />
    <HighlightBox type="info">
      <strong>The Dual-State Trap:</strong> Never run Blueprints, Navigation Meshes, or 3D Physics underground to "hide" faraway NPCs. The CPU will drown tracing hidden mesh bounds.
    </HighlightBox>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <SectionCard title="Global Simulation State (0.2ms)" icon={Network}>
        <h4 className="text-white text-sm font-semibold mb-2">Distance: Far (Spline Paths)</h4>
        <p className="mb-4 text-sm">Global NPCs literally do not exist as Actors. They are math positions processed via the Significance Manager in a flat array, transitioning entirely on continuous mathematical Spline lines (fast C++ formulas).</p>
      </SectionCard>
      <SectionCard title="Local 3D State Hand-Off (1.5ms)" icon={Activity}>
        <h4 className="text-white text-sm font-semibold mb-2">Distance: Near (Complex Tracing)</h4>
        <p className="mb-4 text-sm">Materializing array points into 3D characters executing Behavior Trees. Employs perception hooks against SightCones and NoiseRadii thresholds, evaluating immediate Navigation Meshes.</p>
      </SectionCard>
      <SectionCard className="lg:col-span-2" title="Analytical Simulation (Timestamp Catch-Up)" icon={Clock} color={COLORS.kingfisher.warm}>
        <p className="mb-2"><strong>Offline Ecosystems:</strong> Never process an unloaded farming village in real time.</p>
        <p className="mt-2 text-sm text-kingfisher-muted leading-relaxed">
          1. Player unloads Biome; Manager records <strong>TimeLeft = 12:00 PM</strong>.<br />
          2. Biome mathematical execution ceases completely (Cost = 0.00ms).<br />
          3. Player returns hours later. <strong>TimeReturn = 2:00 PM</strong>.<br />
          4. Manager evaluates instant O(1) Catch-Up: <code className="bg-black/30 px-1 py-0.5 rounded text-kingfisher-warm">CropGrowth = BaseRate * 2 Hrs</code><br />
          5. State resolves and updates Visuals seamlessly.
        </p>
      </SectionCard>
    </div>
  </div>
);

const AnimationAudioTab = () => (
  <div className="space-y-6">
    <PageHeader title="Animation & Audio Optimization" subtitle="Two systems that run silently in the background consuming CPU every frame — both commonly over-budget in released games." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Animation Budget — The Hidden CPU Drain" icon={Activity} color={COLORS.status.warning}>
        <p className="text-sm mb-3">Every animated skeletal mesh evaluates bone transforms every frame on the Game Thread.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li><strong className="text-white">Hero Character (full):</strong> ~0.5–1.5ms per character including IK, physics, animation blending.</li>
          <li><strong className="text-white">Background NPC (simplified):</strong> ~0.1–0.3ms with reduced bone count and no IK.</li>
          <li><strong className="text-white">20 NPCs on screen:</strong> 2–6ms of animation alone. Plan this budget explicitly.</li>
        </ul>
        <div className="mt-3 p-3 bg-black/20 rounded border border-amber-500/20 text-sm">
          <strong className="text-amber-400">Animation Budget Plugin:</strong> Enable in project settings. Automatically throttles NPC animation update rates based on screen importance. Distant NPCs update at 5 FPS animation rate instead of 60. Cost near zero.
        </div>
      </SectionCard>
      <SectionCard title="Animation Sharing — Crowd Optimization" icon={Layers} color={COLORS.status.success}>
        <p className="font-semibold text-white mb-2">50 NPCs, 1 Animation Evaluation</p>
        <p className="text-sm text-kingfisher-muted mb-3">The Animation Sharing Plugin allows multiple skeletal meshes to share a single animation pose result. All 50 background guards run the same walk cycle from one evaluation.</p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-kingfisher-muted">
          <li>Works identically for run cycles, idle animations, death animations.</li>
          <li>Minor visual monotony — acceptable for background crowds.</li>
          <li>Can add random time offset to desync identical poses across sharing characters.</li>
          <li>Cost: ~0.1ms for all 50 sharing NPCs vs 5ms for independent evaluation.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Audio — Streaming vs In-Memory" icon={Music} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">Every audio asset has a memory cost mode. Choose wrong and you either waste RAM or cause IO hitches:</p>
        <div className="space-y-2 text-sm">
          <div className="p-2 bg-black/20 rounded border border-blue-500/20">
            <strong className="text-blue-400">Load on Demand (small SFX)</strong>
            <p className="text-xs text-kingfisher-muted mt-0.5">Under 1–2 seconds. Gunshots, footsteps, UI clicks. Decompressed into RAM on first play. Zero streaming overhead.</p>
          </div>
          <div className="p-2 bg-black/20 rounded border border-amber-500/20">
            <strong className="text-amber-400">Streaming (music, ambient loops)</strong>
            <p className="text-xs text-kingfisher-muted mt-0.5">Long audio files (BGM, 30s+ loops). Read from disk progressively. Very low RAM footprint. Adds tiny IO overhead. Always use for music.</p>
          </div>
          <div className="p-2 bg-black/20 rounded border border-emerald-500/20">
            <strong className="text-emerald-400">Retain On Load (frequent SFX)</strong>
            <p className="text-xs text-kingfisher-muted mt-0.5">Medium sounds played repeatedly (combat impacts). Loaded at scene start, stays in RAM. No hitch on playback. Use for performance-critical SFX.</p>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Audio Budget & Concurrency" icon={Database} color={COLORS.kingfisher.warm}>
        <p className="text-sm mb-3">Audio is computed on the Game Thread. Too many simultaneous sounds causes hitches:</p>
        <div className="space-y-1">
          <StatRow label="Target: max active sounds" value="64–128" color="text-emerald-400" />
          <StatRow label="Voice budget (PC)" value="64 voices" note="default UE5" />
          <StatRow label="Mobile voice limit" value="16–32 voices" color="text-amber-400" />
          <StatRow label="Audio thread budget" value="~2–3ms" color="text-blue-400" />
        </div>
        <ul className="list-disc pl-5 mt-3 space-y-1 text-sm text-kingfisher-muted">
          <li>Use <strong>Sound Concurrency</strong> groups to limit simultaneous gunshot sounds to 8 max — beyond that, oldest is silenced.</li>
          <li>Enable <strong>Virtual Voices</strong> — inaudible sounds maintain state but consume zero CPU processing.</li>
          <li><code>au.Debug.SoloSoundWave</code> console command isolates individual sounds for profiling.</li>
        </ul>
      </SectionCard>
    </div>
  </div>
);

const ScalabilityTab = () => (
  <div className="space-y-6">
    <PageHeader title="Scalability & Console Variables" subtitle="UE5's scalability system lets you ship to low-end and high-end hardware from a single build — if tuned correctly." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="The Scalability System" icon={Sliders} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">UE5 includes a built-in scalability framework with presets (Low, Medium, High, Epic, Cinematic). Each preset modifies dozens of CVars simultaneously.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li>Configuration files: <code>Engine/Config/BaseScalability.ini</code></li>
          <li>Override per-project: <code>Config/DefaultScalability.ini</code></li>
          <li>In-game toggle: <code>sg.ResolutionQuality 75</code>, <code>sg.ShadowQuality 2</code></li>
          <li>Expose to users via Settings screen — UE provides Blueprint nodes for scalability group access.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Key Console Variables (r.*)" icon={Settings} color={COLORS.kingfisher.warm}>
        <p className="text-sm mb-3">Critical CVars every UE5 developer should know:</p>
        <div className="space-y-1 text-xs font-mono">
          {[
            ['r.ScreenPercentage', '50–100', 'Internal render resolution %'],
            ['r.Shadow.MaxResolution', '512–4096', 'Shadow map resolution'],
            ['r.Shadow.CSMMaxCascades', '1–4', 'Directional shadow cascades'],
            ['r.Lumen.DiffuseIndirect.Allow', '0 or 1', 'Toggle Lumen GI'],
            ['r.Nanite.MaxPixelsPerEdge', '1.0–4.0', 'Nanite triangle density'],
            ['r.VSync', '0 or 1', 'V-Sync toggle'],
            ['r.AmbientOcclusionMaxQuality', '0–100', 'SSAO quality'],
            ['foliage.DensityScale', '0.0–1.0', 'Global foliage density'],
            ['r.ViewDistanceScale', '0.5–2.0', 'Draw distance multiplier'],
            ['t.MaxFPS', '60 / 120', 'Frame rate cap'],
          ].map(([cvar, values, desc]) => (
            <div key={cvar} className="flex items-start gap-2 p-1.5 hover:bg-black/20 rounded">
              <span className="text-amber-300 w-52 shrink-0">{cvar}</span>
              <span className="text-blue-300 w-20 shrink-0">{values}</span>
              <span className="text-kingfisher-muted">{desc}</span>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Per-Platform Scalability" icon={Monitor} color={COLORS.status.success}>
        <p className="text-sm mb-3">Different platforms need different defaults:</p>
        <div className="space-y-2 text-sm">
          {[
            ['PC High-End', 'Epic preset, TSR on, Lumen on, Nanite on, 60–120 FPS target'],
            ['PC Mid-Range', 'High preset, TSR 75%, Lumen on, Nanite on, 60 FPS target'],
            ['PC Low-End', 'Medium preset, SSGI, No Nanite, 30–60 FPS, lower shadow cascades'],
            ['Console (PS5/XSX)', 'High preset, custom 30/60 performance modes, TSR or FSR'],
            ['Console (Switch)', 'Low preset, FXAA, baked lighting, no Lumen, strict 30 FPS'],
            ['Mobile (high-end)', 'Medium preset, MSAA or FXAA, no Lumen, reduced texture pool'],
          ].map(([platform, config]) => (
            <div key={platform} className="p-2 bg-black/20 rounded border border-kingfisher-border/30">
              <strong className="text-white text-xs">{platform}</strong>
              <p className="text-xs text-kingfisher-muted mt-0.5">{config}</p>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Dynamic Resolution Scaling" icon={TrendingDown} color={COLORS.status.info}>
        <p className="font-semibold text-white mb-2">Automatically Adjust Resolution to Hit Target FPS</p>
        <p className="text-sm text-kingfisher-muted mb-3">Enable Dynamic Resolution in Project Settings. UE5 monitors frame time each frame and scales internal render resolution up/down to maintain your target (e.g., 33.3ms for 30 FPS).</p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-kingfisher-muted">
          <li>Range: typically 70%–100% of target resolution.</li>
          <li>Invisible to players in most scenes — upscalers (TSR/FSR) hide the reduction.</li>
          <li>Critical for console releases with fixed hardware targets.</li>
          <li>Configure: <code>r.DynamicRes.MinScreenPercentage=70</code></li>
        </ul>
      </SectionCard>
    </div>
  </div>
);

const BudgetsTab = () => (
  <div className="space-y-6">
    <PageHeader title="Hard Budgets & CPU Baselines" subtitle="Concrete benchmarks ensuring strict memory scaling checks." />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <SectionCard title="Commands & Diagnostics" icon={Activity} color={COLORS.kingfisher.warm}>
        <ul className="space-y-3 text-sm">
          <li><code className="text-emerald-400">stat Unit</code>: Primary overlay tracking exact ms bottlenecks among threads.</li>
          <li><code className="text-emerald-400">stat GPU</code>: In-depth visual dissection indexing Lumen, ShadowDepths, BasePass.</li>
          <li><code className="text-emerald-400">stat SceneRendering</code>: Draw call count, visible primitives, mesh count.</li>
          <li><code className="text-emerald-400">profilegpu</code>: One-frame GPU capture — dumps every pass with timing.</li>
          <li><strong>Unreal Insights:</strong> Deep trace visualization of script spikes, GC stalls, and streaming hits.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Code CPU Baselines" icon={Cpu} color={COLORS.kingfisher.blue}>
        <ul className="space-y-3 text-sm">
          <li><strong>USTRUCT:</strong> ~16–24 Bytes (Extremely optimal cache tracking).</li>
          <li><strong>Event Blueprint:</strong> ~150 KB+ (Heavy object-reflection penalty).</li>
          <li><strong className="text-red-400">Quad Overdraw:</strong> Overlapping translucent particle masks can randomly spike 3.0–5.0ms.</li>
          <li><strong>CPU vs GPU Particles:</strong> CPU scales to ~0.2ms max. GPU is 0.01ms for vast multitudes.</li>
          <li><strong>GC Healthy Sweep:</strong> ~2.0–5.0ms (Time-sliced cleanly).</li>
        </ul>
      </SectionCard>
      <SectionCard title="Visual RAM Targets" icon={Database} color={COLORS.status.warning}>
        <p className="text-xs text-kingfisher-muted mb-3 border-b border-kingfisher-border/50 pb-2">Assuming an 8GB VRAM target pool.</p>
        <div className="space-y-1">
          <StatRow label="Textures" value="~3.5–4.5 GB" />
          <StatRow label="Geometry" value="~1.7–2.0 GB" />
          <StatRow label="Characters / LODs" value="~1.0 GB" />
          <StatRow label="State Code" value="~1.2 GB" />
          <StatRow label="Audio" value="~600 MB" />
        </div>
      </SectionCard>
    </div>
  </div>
);

const StorageTab = () => (
  <div className="space-y-6">
    <PageHeader title="Disk I/O & Install Size Management" subtitle="Managing massive SSD footprints caused by Next-Gen rendering and environment architectures." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="The Clean Slate Baseline" icon={HardDrive} color={COLORS.kingfisher.blue}>
        <p className="mb-2 text-sm"><strong>Empty UE5 Project: ~300–350 MB</strong></p>
        <p className="text-sm text-kingfisher-muted">This base weight is purely the engine runtime: physics engine, rendering code, core plugins, and the executable file. It is not empty space; it is the framework itself.</p>
      </SectionCard>
      <SectionCard title="The Baked Lighting Tax" icon={Sun} color={COLORS.status.warning}>
        <p className="mb-2 text-sm"><strong>Lightmass Expansion</strong></p>
        <p className="text-sm text-kingfisher-muted">While Baked Lighting provides flawless GPU framerates, it vastly inflates your final install size. You must export and save tens of thousands of unique, high-resolution Lightmap 2D textures onto the SSD to permanently encode bounce data into surfaces.</p>
      </SectionCard>
      <SectionCard className="md:col-span-2" title="The High-Poly Assets" icon={Box} color={COLORS.status.error}>
        <p className="mb-2 text-sm font-semibold text-white">Nanite Geometry Overheads</p>
        <p className="text-sm text-kingfisher-muted mb-4">Nanite shifts the bottleneck entirely from the GPU to the NVMe SSD bandwidth and physical capacity.</p>
        <ul className="list-disc pl-5 space-y-3 text-kingfisher-muted text-sm">
          <li><strong>Standard Approach (Traditional):</strong> A standard low-poly game rock takes ~1–5 MB on disk utilizing highly compressed mapping.</li>
          <li><strong>Cinema Quality (Nanite):</strong> A Quixel Megascans cliff trivially consumes ~100–500+ MB for a single solitary asset file.</li>
          <li><strong>Crucial Mitigation:</strong> If you don't aggressively enforce Kitbashing (scaling, rotating, reusing a small set of identical master assets as instances), blindly enabling Nanite will push a small indie world install size beyond 100GB.</li>
        </ul>
      </SectionCard>
    </div>
  </div>
);

const AAAQualityProfilingTab = () => (
  <div className="space-y-6">
    <PageHeader title="AAA Quality Profiling" subtitle="Deep timeline dissection and diagnostic procedures ensuring a 99.9% 60fps floor without chaotic micro-adjustments." />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SectionCard title="Immediate Overlay Diagnostics" icon={Activity} color={COLORS.status.success}>
        <p className="font-semibold text-white mb-2">stat Unit Constraints</p>
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>stat Unit:</strong> Reveals exact ms breakdowns for Game (Frame N), Draw (Frame N-1), and GPU (Frame N-2). Keep threads under ~12ms max (4ms buffer for streaming/spikes).</li>
          <li><strong>stat GPU:</strong> Detailed breakdown showing LumenGi cost, ShadowDepths scaling, and BasePass geometry limits.</li>
          <li><strong>Thread Wait States:</strong> Draw thread jumps with <code className="text-orange-400">WaitForGPU</code> = GPU bottleneck. GPU at 20% idle = CPU bottleneck.</li>
          <li><strong>stat SceneRendering:</strong> Visible primitives count + draw calls. Your primary draw call budget monitor.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Unreal Insights (Deep Tracking)" icon={EyeOff} color={COLORS.status.warning}>
        <p className="font-semibold text-white mb-2">The Ultimate Diagnostic Solution</p>
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>GC Stall Analysis:</strong> Pinpoint exact Garbage Collection hitches disrupting the Game Thread.</li>
          <li><strong>Asset Streaming Hitches:</strong> Locate exactly which large texture or mesh Hard Reference paused execution.</li>
          <li><strong>Function Call Precision:</strong> Discover exact Blueprint functions checking logic in high-density loops dragging thread pace.</li>
          <li><strong>GPU Insights:</strong> Frame-by-frame GPU pass timeline — see exactly which render pass overran budget.</li>
        </ul>
      </SectionCard>
      <SectionCard className="lg:col-span-2" title="Sanity Budgets — What Things Should Cost" icon={Box} color={COLORS.kingfisher.blue}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            ['Niagara GPU Particles', '0.01–0.05ms', 'text-emerald-400', 'Hardware math parallelism'],
            ['Niagara CPU Particles', '0.05–0.2ms', 'text-amber-400', 'Game Thread must calculate'],
            ['Healthy GC Sweep', '2.0–5.0ms', 'text-blue-400', 'Incremental split across frames'],
            ['Quad Overdraw', '3.0–5.0ms', 'text-red-400', 'Overlapping alpha particles'],
            ['Game Thread Target', '<12.0ms', 'text-purple-400', '4.6ms buffer for spikes'],
            ['GPU Target Limit', '<13.0ms', 'text-orange-400', 'Buffer for camera FX bursts'],
            ['Draw Call (each)', '0.02–0.05ms', 'text-blue-400', 'CPU command overhead'],
            ['Single Line Trace', '0.001ms', 'text-emerald-400', 'Simple shape only'],
            ['Complex Poly Trace', '0.02–0.1ms', 'text-amber-400', 'Per-polygon accuracy'],
            ['Skeletal Anim (hero)', '0.5–1.5ms', 'text-amber-400', 'Full IK + blending'],
            ['Material Sample (each)', '0.001ms×pixels', 'text-blue-400', 'Per-pixel at resolution'],
            ['Audio Thread Budget', '2.0–3.0ms', 'text-emerald-400', 'All active voices'],
          ].map(([label, value, color, note]) => (
            <div key={label} className="bg-black/20 p-3 rounded border border-kingfisher-border/50">
              <div className={`font-mono text-sm font-bold ${color}`}>{value}</div>
              <div className="text-xs text-white mt-0.5">{label}</div>
              <div className="text-xs text-kingfisher-muted mt-0.5">{note}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  </div>
);

export default OptimizationGuide;