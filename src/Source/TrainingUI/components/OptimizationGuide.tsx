import React, { useState } from 'react';
import { 
  Settings, ArrowLeft, Activity, Cpu, Monitor, Sun, Database, Network, 
  Clock, HardDrive, Zap, LayoutTemplate, Box, Waves, CheckCircle, CircleDashed, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Shield, Radio, Hexagon, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COLORS } from '../../../constants/colors';

interface OptimizationGuideProps {
  onBack: () => void;
}

const TABS = [
  { id: 'overview', label: 'Implementation Status', icon: ClipboardList },
  { id: 'pipeline', label: '16.7ms Pipeline', icon: Activity },
  { id: 'architecture', label: 'CPU & RAM Architecture', icon: Cpu },
  { id: 'gpu', label: 'GPU & Geometry', icon: Box },
  { id: 'lighting', label: 'Light & Shadows', icon: Sun },
  { id: 'memory_state', label: 'Memory & State Arch', icon: Folder },
  { id: 'network_physics', label: 'Networking & Physics', icon: Globe },
  { id: 'npc', label: 'World AI Simulation', icon: Network },
  { id: 'budgets', label: 'Budgets & Tools', icon: Database },
  { id: 'storage', label: 'Disk/Install Storage', icon: HardDrive },
  { id: 'aaa_profiling', label: 'AAA Quality Profiling', icon: Zap },
];

export const OptimizationGuide: React.FC<OptimizationGuideProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'pipeline': return <PipelineTab />;
      case 'architecture': return <ArchitectureTab />;
      case 'gpu': return <GeometryTab />;
      case 'lighting': return <LightingTab />;
      case 'memory_state': return <MemoryStateTab />;
      case 'network_physics': return <NetworkingPhysicsTab />;
      case 'npc': return <AITab />;
      case 'budgets': return <BudgetsTab />;
      case 'storage': return <StorageTab />;
      case 'aaa_profiling': return <AAAQualityProfilingTab />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-kingfisher-dark text-kingfisher-surface font-sans overflow-hidden">
      {/* Top Header */}
      <header className="h-14 border-b border-kingfisher-border bg-kingfisher-panel flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 mr-2 text-kingfisher-muted hover:text-white transition-colors"
          >
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

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-kingfisher-border bg-kingfisher-panel/50 flex flex-col p-4 shrink-0 overflow-y-auto">
          <div className="text-xs font-semibold uppercase tracking-wider text-kingfisher-muted mb-4 pl-2">
            Topics
          </div>
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
                  <Icon className={`w-4 h-4 ${isActive ? 'text-kingfisher-blue' : ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
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

// --- Helper Components ---

const SectionCard = ({ title, icon: Icon, color = COLORS.kingfisher.blue, children, className = '' }: any) => (
  <div className={`bg-kingfisher-panel/80 border border-kingfisher-border rounded-xl p-6 shadow-md ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      {Icon && <div className="p-2 rounded-lg bg-black/20"><Icon className="w-5 h-5" style={{ color }} /></div>}
      <h3 className="font-semibold text-white text-lg tracking-wide">{title}</h3>
    </div>
    <div className="text-sm text-kingfisher-surface space-y-4 leading-relaxed">
      {children}
    </div>
  </div>
);

const HighlightBox = ({ children, type = 'info', className = '' }: any) => {
  const colors = {
    info: 'border-blue-500/30 bg-blue-500/10 text-blue-100',
    warning: 'border-amber-500/30 bg-amber-500/10 text-amber-100',
    danger: 'border-red-500/30 bg-red-500/10 text-red-100',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100',
  }[type as 'info' | 'warning' | 'danger' | 'success'];

  return (
    <div className={`p-4 rounded-lg border ${colors} text-sm font-medium leading-relaxed ${className}`}>
      {children}
    </div>
  );
};

// --- Tab Implementations ---

const OverviewTab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">Implementation Status Overview</h2>
      <p className="text-kingfisher-muted">Deep analysis from extensive documentation and practical technical playgrounds integration.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Currently Implemented (Completed)" icon={CheckCircle} color={COLORS.status.success}>
        <ul className="space-y-4 pt-2">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-base mb-1">Architecture Validation</strong>
              <span className="text-kingfisher-muted text-sm leading-relaxed">3-Layer Data-Driven Architecture (Definition -&gt; State -&gt; Presentation). The "Ban Event Tick", Soft Object References vs Hard References, Data-Driven Iterations, Object Pooling, Event Bus Decoupling.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-base mb-1">Advanced Game Mechanics</strong>
              <span className="text-kingfisher-muted text-sm leading-relaxed">Passive Tree Bitmask allocations, Spatial Jewel injections, Enhanced Input mappings, Inventory Component integrations, Modular USTRUCT definitions, and Item Crafting systems.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-base mb-1">Rendering & Profiling Metrics</strong>
              <span className="text-kingfisher-muted text-sm leading-relaxed">16.7ms pipeline threading definitions, precise Budget allocations (CPU Game vs Draw vs GPU), AAA quality optimal profiling strategies, Nanite vs Foliage bucket classifications.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-base mb-1">Simulation & Logic Strategies</strong>
              <span className="text-kingfisher-muted text-sm leading-relaxed">Quadtree Fog-of-War, Server Culling (COND_SkipOwner), Timestamp Catch-Up simulations for disconnected biomes, Significance Manager strategies.</span>
            </div>
          </li>
        </ul>
      </SectionCard>

      <SectionCard title="Not Yet Implemented (Future Scope)" icon={CircleDashed} color={COLORS.status.warning}>
        <ul className="space-y-4 pt-2">
          <li className="flex items-start gap-3">
            <CircleDashed className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-base mb-1">Live Memory Connect</strong>
              <span className="text-kingfisher-muted text-sm leading-relaxed">Live WebSocket metrics binding from C++ UE5 Game Process to React HUD representation. Current profilers are heavily accurate simulations.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CircleDashed className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-base mb-1">Deep Visual Debug Overlays</strong>
              <span className="text-kingfisher-muted text-sm leading-relaxed">In-game dynamic drawing overlays corresponding to Bitmask states or AI NavMesh traces outside of the isolated Playground.</span>
            </div>
          </li>
        </ul>
      </SectionCard>
    </div>
  </div>
);

const PipelineTab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">The 16.7ms Pipeline</h2>
      <p className="text-kingfisher-muted">Understanding the fundamental mathematics of the 60 FPS parallel engine architecture. 13.5ms Targets with 3ms Buffer.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SectionCard title="Game Thread (CPU)" icon={Activity} color={COLORS.status.info}>
        <p><strong>Frame N:</strong> The Brain.<br/>Calculates AI, physics, animations, and Blueprint/C++ code. Must finish before 13.5ms max limit.</p>
        <ul className="list-disc pl-5 mt-4 space-y-1 text-kingfisher-muted text-sm">
          <li><strong>World Logic:</strong> ~3.0ms</li>
          <li><strong>AI & Tree:</strong> ~3.5ms</li>
          <li><strong>Animations:</strong> ~2.5ms</li>
          <li><strong>Physics/Audio:</strong> ~2.0ms</li>
          <li><strong>Safety Buffer:</strong> 4.17ms</li>
        </ul>
      </SectionCard>

      <SectionCard title="Draw Thread (CPU)" icon={LayoutTemplate} color={COLORS.status.warning}>
        <p><strong>Frame N-1:</strong> The Coordinator.<br/>Translates Game Thread data, handles occlusion culling, and packages Draw Calls. Target {'<'}13.5ms.</p>
        <ul className="list-disc pl-5 mt-4 space-y-1 text-kingfisher-muted text-sm">
          <li><strong>Visibility/Culling:</strong> ~4.0ms</li>
          <li><strong>Draw Call Prep:</strong> ~5.0ms</li>
          <li><strong>Shadow Setup:</strong> ~3.0ms</li>
        </ul>
      </SectionCard>

      <SectionCard title="Graphics (GPU)" icon={Monitor} color={COLORS.status.success}>
        <p><strong>Frame N-2:</strong> The Artist.<br/>Rasterizes polygons, calculates pixels, shadows, Global Illumination (Lumen), and Post-Process.</p>
        <ul className="list-disc pl-5 mt-4 space-y-1 text-kingfisher-muted text-sm">
          <li><strong>Base Pass:</strong> ~3.5ms</li>
          <li><strong>Shadows (VSM):</strong> ~3.5ms</li>
          <li><strong>Lumen (GI):</strong> ~4.5ms</li>
          <li><strong>Post-Process:</strong> ~1.5ms</li>
        </ul>
      </SectionCard>
    </div>

    <HighlightBox type="success">
      <strong>The 60 FPS Secret:</strong> The math runs in parallel, NOT sequential! Game Thread (10ms) + Draw Thread (10ms) + GPU (10ms) = 30ms of work total, but it is delivered simultaneously every 10ms. Frame rate is determined strictly by the <em>slowest individual thread</em>.
    </HighlightBox>

    <SectionCard title="The Thread Interlocking Trap (Traffic Jams)" icon={Network} color={COLORS.status.error}>
      <p>Because the engine is an assembly line pipeline, a delay in one thread cascades into the others, causing visible wait states and drops:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-black/20 p-4 rounded border border-kingfisher-border/50">
          <strong className="text-white">GPU Bottleneck (Draw Waits)</strong>
          <p className="mt-1 text-kingfisher-muted">If the GPU is choked by 25ms fog effects, the Draw Thread finishes its 10ms work but <em>must</em> wait idle (<code>WaitForGPU</code>) before handing off the next frame, dropping FPS heavily.</p>
        </div>
        <div className="bg-black/20 p-4 rounded border border-kingfisher-border/50">
          <strong className="text-white">CPU Bottleneck (GPU Waits)</strong>
          <p className="mt-1 text-kingfisher-muted">If AI pathfinding calculations take 30ms but the GPU is simple and takes 5ms, the GPU starves for rendering instructions. It sits idle at 20% utilization, locked to the CPU's ~33 FPS pace.</p>
        </div>
      </div>
    </SectionCard>
  </div>
);

const ArchitectureTab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">CPU & RAM Memory Architecture</h2>
      <p className="text-kingfisher-muted">Eliminating traversal stutters, memory leaks, garbage collection sweeps, and cache misses.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="The Golden Rule: Ban Event Tick" icon={Clock} color={COLORS.kingfisher.warm}>
        <p className="font-semibold text-white">Event-Driven Architecture Only</p>
        <p className="mt-2 text-sm">The CPU is almost always the bottleneck due to logic constraints. Ban Event Tick unconditionally on 99% of classes. Turn off <code>Start with Tick Enabled</code>.</p>
        
        <div className="mt-4 p-3 bg-black/30 rounded border border-purple-500/20">
          <strong className="text-purple-400">Event Bus Integration:</strong> Instead of checking states on tick, use decoupled Multi-Cast Delegates (UGameEventBus). Emit isolated signals like <code>"PLAYER_DEATH"</code> so remote systems can subscribe asynchronously.
        </div>
      </SectionCard>

      <SectionCard title="Object Pooling (GC Killer)" icon={Database} color={COLORS.status.success}>
        <p className="font-semibold text-white">Defeating the Garbage Collector</p>
        <p className="mt-2 text-sm text-kingfisher-muted">When you <code>Destroy()</code> an actor, it doesn't leave RAM instantly. It marks as "Pending Kill". Forcing instantaneous deallocation freezes the Game Thread, so GC sweeps the trash every 60s instead.</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-kingfisher-muted text-sm pb-2">
          <li><strong>UObjects/Actors:</strong> Sit in RAM and trigger 2-5ms sweep hitches. Use an Object Pooler (hide and recycle) instead of destroying.</li>
          <li><strong>Niagara Particles:</strong> Use highly optimized autonomous memory layers. Niagara recycle instantly and bypass the heavy GC mechanism entirely!</li>
        </ul>
      </SectionCard>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="3-Layer Optimization Structure" icon={Layers} color={COLORS.kingfisher.blue}>
        <p className="text-sm">Separate concerns to maintain pure data states and optimize caching:</p>
        <ul className="list-disc pl-5 mt-3 space-y-3 text-kingfisher-muted text-sm">
          <li><strong className="text-white">1. Definition (UDataAsset)</strong>: The static read-only truth (Name, Base Damage). Loaded via async.</li>
          <li><strong className="text-white">2. Runtime State (USTRUCT)</strong>: Very lean mutable state representations containing volatile durability or bitmasks. Never use Heavy Objects, ensures it stays within L1 Cache cycles.</li>
          <li><strong className="text-white">3. Presentation (UWidget)</strong>: Render mirror only. Does absolutely no simulation logic!</li>
        </ul>
      </SectionCard>
      
      <SectionCard title="Soft Pointers & Transitive Loading" icon={HardDrive} color={COLORS.status.info}>
        <p className="font-semibold text-white mb-2">Preventing Traversal Stutter</p>
        <p className="text-sm mb-3">If code places a Hard Reference to an asset, it instantly triggers synchronous loads holding the Main Thread hostage ("Traversal Hitching").</p>
        <p className="text-sm">Use <strong>TSoftObjectPtr</strong> everywhere. It holds a text ID path of an asset and only executes Asynchronous requests using <code>StreamableManager.RequestAsyncLoad</code>.</p>
      </SectionCard>
    </div>
  </div>
);

const GeometryTab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">GPU Geometry & Nanite Strategy</h2>
      <p className="text-kingfisher-muted">Managing billions of polygons. Nanite shifts rendering costs to Disk/SSD I/O speeds!</p>
    </div>

    <HighlightBox type="warning">
      <strong>Approach A: The "Nanite Everything" Rule</strong><br/><br/>
      Trades extreme optimization time for extreme player hardware limits. Demands an SSD. Since everything is Micro-polygon streaming, player movement speeds must be clamped to avoid massive geometric "pop-in" traversal hitching due to disk bandwidth limits.
    </HighlightBox>

    <h3 className="text-lg font-semibold text-white mt-6 mb-4">Approach B: The Optimal AAA Hybrid Design</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SectionCard title="Bucket 1: Heavyweights" icon={Waves} color={COLORS.kingfisher.blue}>
        <p className="font-semibold text-white mb-2">The World Foundations</p>
        <p className="text-kingfisher-muted">Mountains, castles, large ruins, main architectural sets.</p>
        <div className="mt-4 pt-4 border-t border-kingfisher-border/50">
          <strong className="text-emerald-400">Rule:</strong> Full Nanite Enabled.<br/>
          Import million-poly models. Zero manual LOD generation needed. Nanite manages instances perfectly.
        </div>
      </SectionCard>

      <SectionCard title="Bucket 2: Micro-Clutter" icon={Box} color={COLORS.status.warning}>
        <p className="font-semibold text-white mb-2">Traditional Small Props</p>
        <p className="text-kingfisher-muted">Cups, books, debris, simple fences, interior filler.</p>
        <div className="mt-4 pt-4 border-t border-kingfisher-border/50">
          <strong className="text-red-400">Rule:</strong> Disable Nanite.<br/>
          Nanite fixes memory overheads per mesh! For assets under 2000 triangles, Nanite reduces performance. Rely on standard <code>HISM</code> (Hierarchical Instanced Static Meshes) with Unreal’s Auto-LODs.
        </div>
      </SectionCard>

      <SectionCard title="Bucket 3: Hybrid Foliage" icon={Sun} color={COLORS.status.success}>
        <p className="font-semibold text-white mb-2">Trees, Grass, Masks</p>
        <p className="text-kingfisher-muted">Dense forest generation and alpha-masked layers.</p>
        <div className="mt-4 pt-4 border-t border-kingfisher-border/50">
          <strong className="text-amber-400">Rule:</strong> Nanite Trunks + Alpha LOD Leaves.<br/>
          Alpha-masked transparencies trigger Quad Overdraw on GPUs. Use Nanite strictly on solid geometry trunks, and hand-optimized low-poly billboards for far leaves.
        </div>
      </SectionCard>
    </div>
  </div>
);

const LightingTab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">Light & Shadows Masterclass</h2>
      <p className="text-kingfisher-muted">Delivering Lumen GI natively without catastrophic millisecond deficits.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <SectionCard title="Understanding Lumen" icon={Sun} color={COLORS.kingfisher.warm}>
        <p className="mb-2"><strong>Lumen Only Computes Indirect Light (GI & Reflections).</strong></p>
        <p className="text-sm">Lumen does <em>not</em> calculate the primary beam of light or sharp shadow hits. That is handled by Direct Lighting and Virtual Shadow Maps (VSMs). Lumen exclusively mimics indirect bouncing scatter light.</p>
        
        <div className="mt-4 flex gap-4 text-xs font-mono bg-black/40 p-2 rounded">
          <span className="text-blue-400">Directional Light</span> -&gt; 
          <span className="text-purple-400">VSM Sharp Shadow</span> -&gt; 
          <span className="text-orange-400">Lumen Ray Trace Bounce</span>
        </div>
      </SectionCard>

      <SectionCard title="Controlling Lumen Overhead" icon={Settings} color={COLORS.kingfisher.muted}>
        <p>Lumen operates as globally "Active" but can be micro-managed radically to save budgets:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>Per-Light Limits:</strong> Use `Affect Global Illumination` toggles. Minor torches provide direct VSM light, but do not contribute to expensive Lumen scatter.</li>
          <li><strong>Emissive Trick:</strong> Rather than a Point Light Actor, apply an emissive material. Lumen integrates emissive surfaces via its screen pipeline natively—making it "Free" GI bounce lighting!</li>
        </ul>
      </SectionCard>

      <SectionCard className="lg:col-span-2" title="Defensive Open World Lighting Rules" icon={Zap} color={COLORS.status.success}>
        <ol className="list-decimal pl-5 space-y-3 text-kingfisher-muted text-sm">
          <li><strong>Virtual Shadow Maps (VSM) Dominance:</strong> Cached VSM shadow data is imperative for Open Worlds. Shadows are only recalculated if a dynamic skeleton walks through it. Avoid un-cached heavy calculations.</li>
          <li><strong>The "No Shadow" Approach:</strong> Eliminate ``Cast Shadows`` functionality on 90% of minor environmental lights (sconces, braziers, fireflies). Compute cost plummets.</li>
          <li><strong>Strict Cull Ranges:</strong> Apply the Max Draw Distance Fade immediately. A village torch 200m away should be phased out entirely before logic evaluation.</li>
        </ol>
      </SectionCard>

      <SectionCard className="lg:col-span-2" title="Lighting Architecture Alternatives" icon={Sun} color={COLORS.kingfisher.blue}>
        <p className="mb-4 text-sm text-kingfisher-muted">Lumen is heavy. Choose the architecture that fits your target hardware and gameplay loop:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-black/20 p-3 rounded border border-kingfisher-border/50">
            <strong className="text-white text-sm">Lumen (Dynamic GI)</strong>
            <p className="mt-1 text-xs text-kingfisher-muted">Heavy. Handles changing times of day, darkness/cave delving, and dynamic destruction. Requires high-end hardware.</p>
          </div>
          <div className="bg-black/20 p-3 rounded border border-emerald-500/30">
            <strong className="text-emerald-400 text-sm">Baked Lighting (Lightmass)</strong>
            <p className="mt-1 text-xs text-kingfisher-muted">Flawless performance (free GPU cost). However, world is frozen in time—no day/night cycles, and dynamic shadows can break immersion (ghost shadows).</p>
          </div>
          <div className="bg-black/20 p-3 rounded border border-blue-500/30">
            <strong className="text-blue-400 text-sm">SSGI & SSR</strong>
            <p className="mt-1 text-xs text-kingfisher-muted">Screen Space effects. Very high performance for dynamic scenes, but breaks instantly if the light source or reflecting object is off-screen.</p>
          </div>
        </div>
      </SectionCard>
    </div>
  </div>
);

const AITab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">Dual-State AI Simulation</h2>
      <p className="text-kingfisher-muted">Scaling A-Life biomes to process massive amounts of NPCs optimally.</p>
    </div>

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
          1. Player unloads Biome; Manager records <strong>`TimeLeft = 12:00 PM`</strong>.<br/>
          2. Biome mathematical execution ceases completely (Cost = 0.00ms).<br/>
          3. Player returns hours later. <strong>`TimeReturn = 2:00 PM`</strong>.<br/>
          4. Manager evaluates instant O(1) Catch-Up: <code className="bg-black/30 px-1 py-0.5 rounded text-kingfisher-warm">CropGrowth = BaseRate * 2 Hrs</code><br/>
          5. State resolves and updates Visuals seamlessly.
        </p>
      </SectionCard>
    </div>
  </div>
);

const BudgetsTab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">Hard Budgets & CPU Baselines</h2>
      <p className="text-kingfisher-muted">Concrete benchmarks ensuring strict memory scaling checks.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <SectionCard title="Commands & Diagnostics" icon={Activity} color={COLORS.kingfisher.warm}>
        <ul className="space-y-3 text-sm">
          <li><code className="text-emerald-400">stat Unit</code>: The primary overlay tracking exact Ms bottlenecks among threads.</li>
          <li><code className="text-emerald-400">stat GPU</code>: In-depth visual dissection indexing Lumen, ShadowDepths, BasePass.</li>
          <li><strong>Unreal Insights:</strong> Deep trace visualization indicating script spikes, GC stalls, and streaming hits.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Code CPU Baselines" icon={Cpu} color={COLORS.kingfisher.blue}>
        <ul className="space-y-3 text-sm">
          <li><strong>Structure:</strong> ~16-24 Bytes. (Extremely optimal cache tracking).</li>
          <li><strong>Event Blueprint:</strong> ~150 KB+ (Heavy object-reflection penalty!).</li>
          <li><strong className="text-red-400">Quad Overdraw:</strong> Overlapping translucent smoke particle masks can randomly spike 3.0-5.0ms.</li>
          <li><strong>CPU vs GPU Particles:</strong> CPU scales up to ~0.2ms max. GPU is practically 0.01ms for vast particle multitudes.</li>
          <li><strong>GC Healthy Sweep:</strong> ~2.0ms to 5.0ms (Time-sliced cleanly).</li>
        </ul>
      </SectionCard>

      <SectionCard title="Visual RAM Targets" icon={Database} color={COLORS.status.warning}>
        <p className="text-xs text-kingfisher-muted mb-3 border-b border-kingfisher-border/50 pb-2">Assuming an 8GB target pool.</p>
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between"><span>Textures:</span> <strong>~3.5 - 4.5 GB</strong></li>
          <li className="flex justify-between"><span>Geometry:</span> <strong>~1.7 - 2.0 GB</strong></li>
          <li className="flex justify-between"><span>Chars/LODs:</span> <strong>~1.0 GB</strong></li>
          <li className="flex justify-between"><span>State Code:</span> <strong>~1.2 GB</strong></li>
          <li className="flex justify-between"><span>Audio:</span> <strong>~600 MB</strong></li>
        </ul>
      </SectionCard>
    </div>
  </div>
);

const MemoryStateTab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">Memory, Saves, & Formats</h2>
      <p className="text-kingfisher-muted">Techniques to avoid massive GC hitches and stream persistent data architectures efficiently.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Save/Load Binary Patterns" icon={Save} color={COLORS.status.success}>
        <p className="mb-2 text-sm"><strong>The Problem:</strong> Saving text models like JSON scales awfully string representations trigger monumental alloc hitches.</p>
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>FArchive Binary:</strong> Immediate raw byte conversions parsing Mb's into Ms.</li>
          <li><strong>Delta-Saving Protocol:</strong> Don't serialize base constants, only serialize dynamic permutations from template states!</li>
          <li><strong>Rolling Buffers:</strong> Prevent save corruption by sequentially allocating multiple internal slots during autosaves against crash faults.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Data-Driven Items & State Packs" icon={Folder} color={COLORS.kingfisher.blue}>
        <p className="mb-2 text-sm">Inventory limits are destroyed by spawning individual <code>UObjects</code> representing thousands of potions. GC sweep crushes game framerates.</p>
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>USTRUCT Pointers:</strong> Items evaluate as 64-byte blocks mapped to <code>FName</code> static asset references. Lookups bypass heavy strings.</li>
          <li><strong>Passive Tree Bitmasks:</strong> Entire massive UI progression arrays reduced to pure byte <code>uint32[16]</code> logic, saving monumental networking payloads.</li>
        </ul>
      </SectionCard>

      <SectionCard className="md:col-span-2" title="World Partition & Grid HLODs" icon={Layers} color={COLORS.status.warning}>
        <p className="mb-2 text-sm">Seamless mapping requires dividing the terrain dynamically into cell logic and asynchronously pulling chunks in before viewing.</p>
        <div className="bg-black/20 p-3 rounded border border-amber-500/30 mt-2 text-sm text-kingfisher-muted">
          <strong className="text-amber-400">HLOD System:</strong> Automatic process integrating 1000s of distant mesh instances into one merged Proxy material, resolving extreme Draw Call delays toward visible horizons. Sub-culling occurs directly per node.
        </div>
      </SectionCard>
    </div>
  </div>
);

const NetworkingPhysicsTab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">Networking & Simulation Protocols</h2>
      <p className="text-kingfisher-muted">Ensuring accurate multiplayer synchronicity while optimizing logic payloads.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Multiplayer Authority & Limits" icon={Globe} color={COLORS.status.info}>
        <p className="mb-2 text-sm"><strong>Server Logic:</strong> The Server is the absolute Referee evaluating all Client inputs before mutation. Predict client animations visually.</p>
        <div className="bg-black/20 p-3 rounded border border-blue-500/30 mt-2 text-sm text-kingfisher-muted">
          <strong className="text-blue-400">COND_SkipOwner Protocol:</strong> Never enforce the server to redundantly reply with a verified stat back to the original client that successfully initiated it. Prevent bandwidth cycle waste.
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
          <li><strong className="text-emerald-400">Fog Quadtrees:</strong> Rather than O(N^2) pixel assessments for dynamic FOW, employ hierarchical partition quadrants restricting resolution iteration counts natively.</li>
        </ul>
      </SectionCard>
    </div>
  </div>
);

const StorageTab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">Disk I/O & Install Size Management</h2>
      <p className="text-kingfisher-muted">Managing massive SSD footprints caused by Next-Gen rendering and environment architectures.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="The Clean Slate Baseline" icon={HardDrive} color={COLORS.kingfisher.blue}>
        <p className="mb-2 text-sm"><strong>Empty UE5 Project: ~300 MB to 350 MB</strong></p>
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
          <li><strong>Standard Approach (Traditional):</strong> A standard low-poly game rock takes ~1 MB to 5 MB on disk, utilizing highly compressed mapping.</li>
          <li><strong>Cinema Quality (Nanite):</strong> A Quixel Megascans cliff utilizes millions of polygons. It trivially consumes ~100 MB to 500+ MB for a single solitary asset file.</li>
          <li><strong>Crucial Mitigations:</strong> If you don't aggressively enforce Kitbashing (scaling, rotating, and reusing a small set of identical master assets as instances), blindly enabling Nanite will effortlessly push a small indie world install size completely beyond 100GB.</li>
        </ul>
      </SectionCard>
    </div>
  </div>
);

const AAAQualityProfilingTab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">AAA Quality Optimal Profiling</h2>
      <p className="text-kingfisher-muted">Deep timeline dissection and diagnostic procedures ensuring an immaculate 99.9% 60fps floor without chaotic micro-adjustments.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SectionCard title="Immediate Overlay Diagnostics" icon={Activity} color={COLORS.status.success}>
        <p className="font-semibold text-white mb-2">The built-in stat Unit constraints</p>
        <p className="text-kingfisher-muted text-sm mb-4">Never guess frame times. Rely on real-time diagnostic outputs.</p>
        
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>stat Unit:</strong> Reveals exact Ms breakdowns for Game (Frame N), Draw (Frame N-1), and GPU (Frame N-2). You MUST keep threads under ~12ms max (leaving a 4ms buffer for streaming/spikes).</li>
          <li><strong>stat GPU:</strong> Detailed breakdown showing LumenGis cost, ShadowDepths scaling, and BasePass geometry limits.</li>
          <li><strong>Thread Wait States:</strong> If the Draw thread shows massive jumps, check if it's accompanied by <code className="text-orange-400">WaitForGPU</code> (GPU bottleneck) or if GPU lays idle at 20% (CPU bottleneck).</li>
        </ul>
      </SectionCard>

      <SectionCard title="Unreal Insights (Deep Tracking)" icon={EyeOff} color={COLORS.status.warning}>
        <p className="font-semibold text-white mb-2">The Ultimate Diagnostic Solution</p>
        <p className="text-kingfisher-muted text-sm mb-4">Standalone tool recording massive timelines of entire application execution sequences to capture single-millisecond hitch anomalies.</p>
        
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>GC Stall Analysis:</strong> Pinpoint exact Garbage Collection hitches disrupting the Game Thread.</li>
          <li><strong>Asset Streaming Hitches:</strong> Locate exactly which large 4k texture or unoptimized 3D mesh Hard Reference paused execution.</li>
          <li><strong>Function Call Precision:</strong> Discover exact Blueprints checking logic in high-density loops dragging thread pace.</li>
        </ul>
      </SectionCard>

      <SectionCard className="lg:col-span-2" title="Baseline 'Sanity Budgets' (What things should cost)" icon={Box} color={COLORS.kingfisher.blue}>
        <p className="text-sm text-kingfisher-muted mb-4">Veteran baseline metrics so you don't even need a profiler to know if a system design is mathematically sound:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-black/20 p-3 rounded border border-kingfisher-border/50">
            <strong className="text-emerald-400 text-sm block mb-1">Niagara GPU Particles</strong>
            <span className="text-white font-mono text-xs">0.01ms - 0.05ms</span>
            <p className="mt-1 text-xs text-kingfisher-muted">Extremely cheap. Hardware mathematical parallelism.</p>
          </div>
          <div className="bg-black/20 p-3 rounded border border-kingfisher-border/50">
            <strong className="text-amber-400 text-sm block mb-1">Niagara CPU Particles</strong>
            <span className="text-white font-mono text-xs">0.05ms - 0.2ms</span>
            <p className="mt-1 text-xs text-kingfisher-muted">Game Thread must calculate velocity, collision, lifetime. Heavy hazard above 0.5ms.</p>
          </div>
          <div className="bg-black/20 p-3 rounded border border-kingfisher-border/50">
            <strong className="text-blue-400 text-sm block mb-1">Healthy GC Sweep</strong>
            <span className="text-white font-mono text-xs">2.0ms - 5.0ms</span>
            <p className="mt-1 text-xs text-kingfisher-muted">Incremental sweep split cleanly across 2-3 frames, rendering it practically invisible.</p>
          </div>
          <div className="bg-black/20 p-3 rounded border border-kingfisher-border/50">
            <strong className="text-red-400 text-sm block mb-1">Quad Overdraw</strong>
            <span className="text-white font-mono text-xs">3.0ms - 5.0ms (Spike)</span>
            <p className="mt-1 text-xs text-kingfisher-muted">Alpha-masked transparencies drawing simultaneously overlapping smoke or leaves.</p>
          </div>
          <div className="bg-black/20 p-3 rounded border border-kingfisher-border/50">
            <strong className="text-purple-400 text-sm block mb-1">Game Thread (CPU) Limit</strong>
            <span className="text-white font-mono text-xs">&lt; 12.0ms Target</span>
            <p className="mt-1 text-xs text-kingfisher-muted">Mandatory ~4.6ms buffer reserved for intense AI combat or physics spikes.</p>
          </div>
          <div className="bg-black/20 p-3 rounded border border-kingfisher-border/50">
            <strong className="text-orange-400 text-sm block mb-1">GPU Target Limit</strong>
            <span className="text-white font-mono text-xs">&lt; 13.0ms Target</span>
            <p className="mt-1 text-xs text-kingfisher-muted">Always leave buffer limits for camera-bound sudden environmental light effects.</p>
          </div>
        </div>
      </SectionCard>
    </div>
  </div>
);

export default OptimizationGuide;
