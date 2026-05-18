import React, { useState } from 'react';
import { 
  Settings, ArrowLeft, Activity, Cpu, Monitor, Sun, Database, Network, 
  Clock, HardDrive, Zap, LayoutTemplate, Box, Waves, CheckCircle, CircleDashed, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COLORS } from '../../../constants/colors';

interface OptimizationGuideProps {
  onBack: () => void;
}

const TABS = [
  { id: 'overview', label: 'Implementation Status', icon: ClipboardList },
  { id: 'pipeline', label: '16.7ms Pipeline', icon: Activity },
  { id: 'architecture', label: 'CPU & RAM Memory', icon: Cpu },
  { id: 'gpu', label: 'GPU & Geometry', icon: Box },
  { id: 'lighting', label: 'Light & Shadows', icon: Sun },
  { id: 'memory_state', label: 'Memory & State Arch', icon: Folder },
  { id: 'network_physics', label: 'Networking & Physics', icon: Globe },
  { id: 'npc', label: 'World AI Simulation', icon: Network },
  { id: 'budgets', label: 'Budgets & Tools', icon: Database },
  { id: 'profiler', label: 'Interactive Profiler', icon: Zap },
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
      case 'profiler': return <ProfilerTab />;
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

const HighlightBox = ({ children, type = 'info' }: any) => {
  const colors = {
    info: 'border-blue-500/30 bg-blue-500/10 text-blue-100',
    warning: 'border-amber-500/30 bg-amber-500/10 text-amber-100',
    danger: 'border-red-500/30 bg-red-500/10 text-red-100',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100',
  }[type as 'info' | 'warning' | 'danger' | 'success'];

  return (
    <div className={`p-4 rounded-lg border ${colors} text-sm font-medium leading-relaxed`}>
      {children}
    </div>
  );
};

// --- Tab Implementations ---

const OverviewTab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">Implementation Status Overview</h2>
      <p className="text-kingfisher-muted">A clear breakdown of what has been implemented in the training application, and what is scheduled for future updates.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Currently Implemented" icon={CheckCircle} color={COLORS.status.success}>
        <ul className="space-y-4 pt-2">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-base mb-1">Theoretical Guidelines</strong>
              <span className="text-kingfisher-muted text-sm leading-relaxed">Comprehensive documentation for the 16.7ms pipeline, CPU/RAM, GPU/Geometry, Lighting, AI bounds, memory, networking, and Budgets.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-base mb-1">System Optimizations Integrated</strong>
              <span className="text-kingfisher-muted text-sm leading-relaxed">Included strategies for Data-Driven Items, Asynchronous Loading, UMG ViewModels, Multiplayer Replication Culling, and Quest/Passive-Tree Bitmasks.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-base mb-1">Interactive Profiler Mockups</strong>
              <span className="text-kingfisher-muted text-sm leading-relaxed">Live mock engine stat tools (stat Unit, stat GPU) with variable tweaking to simulate bottlenecks. (See Interactive Profiler tab).</span>
            </div>
          </li>
        </ul>
      </SectionCard>

      <SectionCard title="Not Yet Implemented (Future Scope)" icon={CircleDashed} color={COLORS.status.warning}>
        <ul className="space-y-4 pt-2">
          <li className="flex items-start gap-3">
            <CircleDashed className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-base mb-1">Visual Culling & LOD Demo</strong>
              <span className="text-kingfisher-muted text-sm leading-relaxed">Interactive 2D/3D visualizer showing how Nanite partitions and frustum culling actually work.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CircleDashed className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-base mb-1">Live Engine Connection</strong>
              <span className="text-kingfisher-muted text-sm leading-relaxed">Direct WebSocket or REST integration to a running Unreal Engine instance for live metric capture.</span>
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
      <p className="text-kingfisher-muted">Understanding the fundamental mathematics of the 60 FPS parallel engine architecture.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SectionCard title="Game Thread (CPU)" icon={Activity} color={COLORS.status.info}>
        <p><strong>Frame N:</strong> The Brain.<br/>Calculates player input, AI logic, physics, animations, and runs Blueprint/C++ code. This must ideally finish before 12ms.</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-kingfisher-muted">
          <li>World Logic: ~3.0ms</li>
          <li>AI & Behavior: ~3.5ms</li>
          <li>Animations: ~2.5ms</li>
          <li>Physics/Audio: ~3.5ms</li>
        </ul>
      </SectionCard>

      <SectionCard title="Render Thread (CPU)" icon={LayoutTemplate} color={COLORS.status.warning}>
        <p><strong>Frame N-1:</strong> The Coordinator.<br/>Translates Game Thread data, handles occlusion culling (what exists on screen), and packages Draw Calls for the GPU. Target: {'<'}11ms.</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-kingfisher-muted">
          <li>Visibility/Culling: ~4.0ms</li>
          <li>Draw Call Prep: ~5.0ms</li>
          <li>Shadow Prepping: ~3.0ms</li>
        </ul>
      </SectionCard>

      <SectionCard title="Graphics (GPU)" icon={Monitor} color={COLORS.status.success}>
        <p><strong>Frame N-2:</strong> The Artist.<br/>Rasterizes polygons, calculates pixels, shadows, Global Illumination (Lumen), and post-processing. Target: {'<'}13ms.</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-kingfisher-muted">
          <li>Base Pass (G-Buffer): ~3.5ms</li>
          <li>Shadows (VSM): ~3.5ms</li>
          <li>Lumen (GI): ~4.5ms</li>
          <li>Post-Process/UI: ~1.5ms</li>
        </ul>
      </SectionCard>
    </div>

    <HighlightBox type="success">
      <strong>The 60 FPS Secret:</strong> Frame math does <em>not</em> add up sequentially. Game Thread (10ms) + Draw Thread (10ms) + GPU (10ms) = 30ms total work, but delivered simultaneously every 10ms. Therefore, your game runs flawlessly. <strong>Aim for a 3ms safety buffer on all threads!</strong>
    </HighlightBox>

    <SectionCard title="The Thread Interlocking Trap (Traffic Jams)" icon={Network} color={COLORS.status.error}>
      <p>Because the engine is a pipeline, a delay in one thread cascades into the others, causing visible stutters:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-black/20 p-4 rounded border border-kingfisher-border/50">
          <strong className="text-white">GPU Bottleneck (Draw Waits)</strong>
          <p className="mt-1 text-kingfisher-muted">If the GPU is choked (e.g. 25ms volumetric fog), the Draw Thread finishes in 10ms but <em>must</em> wait idle (WaitForGPU) to hand off the next frame, dropping FPS.</p>
        </div>
        <div className="bg-black/20 p-4 rounded border border-kingfisher-border/50">
          <strong className="text-white">CPU Bottleneck (GPU Waits)</strong>
          <p className="mt-1 text-kingfisher-muted">If AI calculations take 30ms but GPU only takes 5ms, the GPU starves for instructions and sits idle at 20% utilization, locked to the CPU's ~33FPS pace.</p>
        </div>
      </div>
    </SectionCard>
  </div>
);

const ArchitectureTab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">CPU & RAM Memory Architecture</h2>
      <p className="text-kingfisher-muted">Eliminating traversal stutter, memory leaks, and CPU cache misses in Open Worlds.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="RAM Latency vs. CPU Cache" icon={Cpu} color={COLORS.kingfisher.warm}>
        <p className="font-semibold text-white">The Target: Zero CPU Waits</p>
        <p>RAM capacity rarely causes stuttering—RAM <em>latency</em> does. The CPU must fetch data from RAM to calculate math. If data is scattered randomly in memory (a "Cache Miss"), the CPU sits idle for hundreds of clock cycles waiting for delivery.</p>
        
        <div className="mt-4 p-3 bg-black/30 rounded border border-red-500/20">
          <strong className="text-red-400">The Blueprint Trap:</strong> Creating heavy Blueprints for mechanics scatters complex 150KB object references everywhere. Loop updating 200 of them destroys the Game Thread.
        </div>
        <div className="mt-2 p-3 bg-black/30 rounded border border-emerald-500/20">
          <strong className="text-emerald-400">The Solution: L1 CPU Prefetching:</strong> Use a Head Manager containing flat C++ TArrays of bare structs (e.g., FPoisonData, ~24 bytes). RAM sequentially streams these into the CPU's ultra-fast L1 Cache implicitly, plummeting costs to fractions of a millisecond.
        </div>
      </SectionCard>

      <SectionCard title="Soft vs. Hard References" icon={HardDrive} color={COLORS.status.info}>
        <p className="font-semibold text-white">Preventing Traversal Stutter</p>
        <p>If Code permanently references an Asset, it locks it dynamically into RAM constraints immediately, causing massive load-stutters ("Traversal Stutter") when moving around the world.</p>
        <ul className="list-disc pl-5 mt-3 space-y-2 text-kingfisher-muted">
          <li><strong>Soft Object References (TSoftObjectPtr):</strong> Points to a text string path (Zero RAM cost). When player is close, asynchronously stream the asset over several frames. Used for exactly-needed environments, bosses, or rare loot.</li>
          <li><strong>Hard References:</strong> Instant memory lock. Mandatory for HUD/UI, Player Character Skeleton, basic collision impacts (wood/stone hits), and Fallback error objects (Generic sword).</li>
        </ul>
      </SectionCard>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Garbage Collection (GC) Stutters" icon={Database} color={COLORS.kingfisher.blue}>
        <p>Unreal does not erase destroyed objects instantly (it would freeze the frame). They get marked "Pending Kill" and linger. Every 30-60 seconds, GC sweeps the RAM, causing unavoidable micro-stutters if trash is massive.</p>
        <HighlightBox type="info" className="mt-3">
          <strong>The GC Killer: Object Pooling.</strong><br/>
          Never spawn or destroy projectiles, enemy drop-loot, or standard FX constantly. Pull an inactive arrow from a pre-allocated RAM array. When it hits, hide it and place it back into the array. GC never triggers.
        </HighlightBox>
      </SectionCard>
      
      <SectionCard title="Component-Driven Passives" icon={Settings} color={COLORS.kingfisher.muted}>
        <p>Not everything needs a flat C++ array (which introduces rigidity). For individual local enemies (not swarms):</p>
        <p className="mt-2">Use <strong>Dynamic Tick Throttling</strong>. Give an enemy actor a custom C++ Component. Far away, it ticks once every 10 frames (300ms). When close or damaged, it accelerates dynamically to 16ms, maximizing ease of programming while maintaining CPU safety.</p>
      </SectionCard>
    </div>
  </div>
);

const GeometryTab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">GPU Geometry & Nanite Strategy</h2>
      <p className="text-kingfisher-muted">Managing billions of polygons efficiently without melting the memory bandwidth.</p>
    </div>

    <HighlightBox type="warning">
      <strong>The "Turn Nanite on Everything" Approach (Approach A):</strong> Moves the bottleneck from GPU rendering to SSD I/O bandwidth. It demands high-speed NVMe drives, requires capped player traversal speeds (preventing massive pop-ins), favors aggressive kitbashing (instancing 5 rocks forever), and favors Runtime Virtual Texturing (RVT).
    </HighlightBox>

    <h3 className="text-lg font-semibold text-white mt-6 mb-4">Approach B: The Optimal AAA Hybrid Design</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SectionCard title="Bucket 1: Heavyweights" icon={Waves} color={COLORS.kingfisher.blue}>
        <p className="font-semibold text-white mb-2">The World Foundations</p>
        <p className="text-kingfisher-muted">Mountains, castles, large ruins, landscapes.</p>
        <div className="mt-4 pt-4 border-t border-kingfisher-border/50">
          <strong className="text-emerald-400">Rule:</strong> Full Nanite Enabled.<br/>
          Import cinema-film resolutions. Never create LODs. Nanite perfectly micro-polygon rasterizes massive geometry completely on the GPU rendering pipeline.
        </div>
      </SectionCard>

      <SectionCard title="Bucket 2: Micro-Clutter" icon={Box} color={COLORS.status.warning}>
        <p className="font-semibold text-white mb-2">Traditional Small Props</p>
        <p className="text-kingfisher-muted">Cups, books, debris, crates, simple fences.</p>
        <div className="mt-4 pt-4 border-t border-kingfisher-border/50">
          <strong className="text-red-400">Rule:</strong> Keep Nanite Disabled.<br/>
          Meshes under 2,000 triangles lose performance with Nanite due to fixed memory overheads. Use standard hardware instancing (HISMs) and Unreal's automatic 4-tier LOD generation. 
        </div>
      </SectionCard>

      <SectionCard title="Bucket 3: Hybrid Foliage" icon={Sun} color={COLORS.status.success}>
        <p className="font-semibold text-white mb-2">Trees, Grass, Masks</p>
        <p className="text-kingfisher-muted">Forest geometry and alpha-masked leaves.</p>
        <div className="mt-4 pt-4 border-t border-kingfisher-border/50">
          <strong className="text-amber-400">Rule:</strong> Nanite Trunks + Alpha LOD Leaves.<br/>
          Alpha-masked transparencies trigger Quad Overdraw on GPUs. Use Nanite strictly on the solid trunks; use hand-optimized traditional meshes with billboards for far leaves.
        </div>
      </SectionCard>
    </div>
  </div>
);

const LightingTab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">Light & Shadows Masterclass</h2>
      <p className="text-kingfisher-muted">Achieving dynamic mood without paying catastrophic performance penalties.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 bg-kingfisher-panel border border-kingfisher-border rounded-xl">
        <h4 className="font-bold text-white mb-2 text-sm">Direct Lights</h4>
        <p className="text-sm text-kingfisher-muted">The primary beam hits the environment based on distance from the source actor.</p>
      </div>
      <div className="p-4 bg-kingfisher-panel border border-kingfisher-border rounded-xl">
        <h4 className="font-bold text-white mb-2 text-sm">Crist Shadows (VSM)</h4>
        <p className="text-sm text-kingfisher-muted">Virtual Shadow Maps calculate shadows. Static meshes are cached; only moving items redraw shadows!</p>
      </div>
      <div className="p-4 bg-kingfisher-panel border border-kingfisher-border rounded-xl">
        <h4 className="font-bold text-white mb-2 text-sm">Indirect Light (Lumen)</h4>
        <p className="text-sm text-kingfisher-muted">Lumen traces how the light scatters naturally, bleeds color onto adjacent walls, and illuminates darkness.</p>
      </div>
      <div className="p-4 bg-kingfisher-panel border border-kingfisher-border rounded-xl">
        <h4 className="font-bold text-white mb-2 text-sm">Reflections (Lumen)</h4>
        <p className="text-sm text-kingfisher-muted">Accurately traces reflective bounces across rough surfaces or water realistically.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <SectionCard title="Controlling Lumen Selectively" icon={Sun}>
        <p>Lumen is incredibly GPU-heavy and dynamic. You can micromanage it per light or per area:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2 text-kingfisher-muted">
          <li><strong>Per-Light:</strong> The "Affect GI" checkbox. Placed torches cast direct light, but only the player's equipped torch should be granted expensive Lumen bounce.</li>
          <li><strong>Per-Area:</strong> Post-Process Volumes can localize Lumen to specific puzzle caves, falling back to SSGI globally. (Beware memory allocation hitches upon passing the volume border).</li>
        </ul>
      </SectionCard>

      <SectionCard title="Defensive Open World Lighting rules" icon={Zap}>
        <p>Architect your lighting to scale globally without frame drops:</p>
        <ol className="list-decimal pl-5 mt-2 space-y-2 text-kingfisher-muted">
          <li><strong>The "No Shadow" Rule:</strong> Disable casting shadows entirely on 90% of local torches. The aesthetic hit is minor, the performance gain is massive.</li>
          <li><strong>Aggressive Max Draw Distance:</strong> Fade local lights out to completely zero calculations before city borders end.</li>
          <li><strong>Weaponize Emissive Materials:</strong> Lumen inherently scatters emissive material light (mushroom glow) screen-space. This is literally "Free" compared to a dedicated Point Light actor.</li>
        </ol>
      </SectionCard>
    </div>
  </div>
);

const AITab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">Massive AI Simulation (5000 NPCs)</h2>
      <p className="text-kingfisher-muted">Scaling A-Life biomes to process 5000 real-time characters in {"<"} 2.0 milliseconds.</p>
    </div>

    <HighlightBox type="info">
      <strong>The Dual-State Architecture:</strong> Never run Blueprints, Navigation Meshes, or 3D Physics underground to "hide" faraway NPCs. The CPU will drown in coordinates. Only loaded environments get 3D math; everything else runs pure numerical simulation loops.
    </HighlightBox>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <SectionCard title="Global Simulation State (0.2ms)" icon={Network}>
        <h4 className="text-white text-sm font-semibold mb-2">4,800 NPCs moving kilometers away:</h4>
        <p className="mb-4">Global NPCs completely lack actors. They are merely vectors in a Head Manager flat C++ array traveling on Splines.</p>
        
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>Cubic Bézier Math:</strong> The Spline handles real, perfect curved coordinates. Extrapolating a continuous position along the mathematical curve demands just ~0.0001 ms per NPC.</li>
          <li><strong>Terrain Modifications:</strong> Heights (Z-Axis), muddy slowdowns (Multiplier = 0.4x), and highways (Multiplier = 1.0) are calculated purely inside the array formula.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Local 3D State Hand-Off (1.5ms)" icon={Activity}>
        <h4 className="text-white text-sm font-semibold mb-2">200 NPCs actively near the player:</h4>
        <p className="mb-4">At 150m away, the Head Manager materializes the array point into a 3D Mesh, locking them into NavMesh ORCA logic, preventing "pop-in" before they enter camera sight.</p>
        
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>Adaptive Budget Queue:</strong> We only process a maximum budget (e.g. 5) of complex pathfinding calculations per frame. </li>
          <li><strong>The Animation Smoothers:</strong> To cover the waiting time for the other 195 NPCs, play a "shock/react" 15-frame animation, or assign them a simple vector-steering "flock ahead" task until their NavMesh calculation finishes.</li>
        </ul>
      </SectionCard>

      <SectionCard className="lg:col-span-2" title="Analytical Simulation (The Catch-up System)" icon={Clock}>
        <p><strong>Simulating complete offline living biomes:</strong> A farming village should rot entirely when the player leaves without drawing CPU power forever.</p>
        <p className="mt-2 text-sm text-kingfisher-muted">
          1. Player unloads Biome; Manager records <strong>`TimeLeft = 12:00 PM`</strong>.<br/>
          2. The biome ceases all math completely. (Cost = 0.00ms)<br/>
          3. Player returns hours later. <strong>`TimeReturn = 2:00 PM`</strong>.<br/>
          4. Manager executes instant formula: <code className="bg-black/30 px-1 py-0.5 rounded text-kingfisher-warm">CropGrowth = BaseGrowth * 2 Hours</code><br/>
          5. Visuals populate updated. The ultimate persistent-world illusion.
        </p>
      </SectionCard>
    </div>
  </div>
);

const BudgetsTab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">Hard Budgets & Diagnostic Tools</h2>
      <p className="text-kingfisher-muted">Sanity checking your open world architecture scaling via concrete benchmarks.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <SectionCard title="Commands & Profilers" icon={Activity} color={COLORS.kingfisher.warm}>
        <ul className="space-y-3 text-sm">
          <li><code className="text-emerald-400">stat Unit</code>: The mandatory overlay breaking down total frame costs (Game vs Draw vs GPU vs Frame total).</li>
          <li><code className="text-emerald-400">stat GPU</code>: High-detail pipeline breakdown (LumenGis vs ShadowDepths vs BasePass latency).</li>
          <li><strong>Unreal Insights:</strong> The deepest profiler. Records frame arrays, isolates script spikes, asset streaming hitching, and logic anomalies via timeline.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Code CPU Baselines" icon={Cpu} color={COLORS.kingfisher.blue}>
        <ul className="space-y-3 text-sm">
          <li><strong>Flat Array Struct:</strong> ~16-24 Bytes. (100k instances = 1.6MB).</li>
          <li><strong>Empty Blueprint:</strong> 150 KB. (Heavy UClass reflection layer overhead).</li>
          <li><strong>CPU Particles:</strong> 0.05 to 0.2ms MAX. High danger.</li>
          <li><strong>GPU Particles:</strong> 0.01 to 0.05ms MAX. Safest for 100k counts.</li>
          <li><strong>GC Healthy Sweep:</strong> 2.0ms to 5.0ms incrementally sliced over frames.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Visual RAM Targets" icon={Database} color={COLORS.status.warning}>
        <p className="text-xs text-kingfisher-muted mb-3 border-b border-kingfisher-border/50 pb-2">Assuming an 8GB physical target.</p>
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between"><span>Textures Pool:</span> <strong>~3.5 - 4.5 GB</strong></li>
          <li className="flex justify-between"><span>Geometry/Nanite:</span> <strong>~1.7 - 2.0 GB</strong></li>
          <li className="flex justify-between"><span>Characters/LODs:</span> <strong>~1.0 GB</strong></li>
          <li className="flex justify-between"><span>Code/State Engine:</span> <strong>~1.2 GB</strong></li>
          <li className="flex justify-between"><span>Audio Package:</span> <strong>~600 MB</strong></li>
        </ul>
      </SectionCard>
    </div>
  </div>
);

const ProfilerTab = () => {
  const [actorCount, setActorCount] = React.useState(10);
  const [fps, setFps] = React.useState(60);
  const [cpuUsage, setCpuUsage] = React.useState(15);
  
  // Simulated physics: more actors = lower performance
  React.useEffect(() => {
    const targetFps = Math.max(15, 60 - Math.floor(actorCount / 10));
    const targetCpu = Math.min(100, 15 + Math.floor(actorCount / 4));
    
    const interval = setInterval(() => {
      setFps(prev => {
        const diff = targetFps - prev;
        return prev + diff * 0.1 + (Math.random() - 0.5) * 2;
      });
      setCpuUsage(prev => {
        const diff = targetCpu - prev;
        return prev + diff * 0.1 + (Math.random() - 0.5) * 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [actorCount]);

  const handleActorChange = (val: number) => {
    setActorCount(val);
  };

  const isWarning = fps < 45;
  const isCritical = fps < 30;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Interactive Profiler</h2>
        <p className="text-kingfisher-muted">Tweak the amount of tickable entities manually to view how it affects CPU load, rendering MS, and triggers engine fallbacks (such as culling cascades and scaling resolution).</p>
      </div>
      
      <div className="flex flex-col gap-4 w-full h-[400px] overflow-hidden bg-[#0d1117] p-2 rounded-xl border border-white/5">
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/40 rounded-lg border border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-mono text-blue-300 uppercase">FPerformanceManager::TickBudget()</span>
          </div>
          <div className="text-[9px] font-mono text-blue-500/70 border border-blue-500/20 px-1.5 rounded bg-blue-500/5">
            Global Performance Singleton
          </div>
        </div>

        <div className="flex-1 flex gap-4 overflow-hidden p-1">
          {/* State / Control Panel */}
          <div className="w-[200px] flex flex-col gap-6 p-4 bg-black/40 border border-white/5 rounded-xl shadow-xl shrink-0">
             <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5 flex items-center gap-1.5"><Layers className="w-3 h-3 text-gray-500"/> Population</span>
                  <span className="text-[8px] text-gray-600 font-mono">Simulated actors</span>
                </div>
                <span className="text-xl font-mono text-blue-400 font-black tracking-tight">{actorCount}</span>
              </div>
              <div className="relative pt-2">
                <input 
                  type="range" 
                  min="1" 
                  max="500" 
                  value={actorCount} 
                  onChange={(e) => handleActorChange(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 outline-none"
                />
                <div className="flex justify-between text-[7px] text-gray-600 font-bold uppercase mt-2 px-1">
                  <span>Optimized</span>
                  <span className="text-red-500/70">Overload</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-auto">
               <div className="p-2 border border-slate-700 bg-slate-800/50 rounded flex items-center justify-between px-3">
                 <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">CPU Delta</span>
                 <span className={`text-[10px] font-mono font-bold ${cpuUsage > 85 ? 'text-red-400' : 'text-blue-400'}`}>{Math.round(cpuUsage)}%</span>
               </div>
               <div className={`p-2 border rounded flex items-center justify-between px-3 transition-colors ${isCritical ? 'bg-red-900/20 border-red-900 shadow-[inset_0_0_10px_rgba(239,68,68,0.2)]' : isWarning ? 'bg-yellow-900/20 border-yellow-900' : 'bg-green-900/20 border-green-900'}`}>
                 <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Render MS</span>
                 <span className={`text-[10px] font-mono font-bold ${isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-green-400'}`}>{Math.max(10, Math.round(1000/fps))}ms</span>
               </div>
            </div>
          </div>

          {/* Presentation Panel */}
          <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col relative shadow-2xl">
             <div className="absolute top-0 w-full p-2 bg-slate-950/80 border-b border-white/5 flex items-center justify-between z-20 backdrop-blur-sm">
               <span className="text-[8px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2 px-2">
                 <Zap className="w-3 h-3" /> Presentation Adjustments
               </span>
               <span className={`transition-colors text-[10px] px-2 py-0.5 rounded font-mono font-bold ${isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/30' : isWarning ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                 {Math.round(fps)} FPS
               </span>
             </div>
             
             <div className="flex-1 p-6 mt-8 flex flex-col gap-4 relative">
               <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10" />
               
               <div className="relative z-20 flex flex-col gap-3 w-full max-w-[280px] mx-auto opacity-90">
                 <div className={`p-3 border rounded-lg transition-all duration-500 flex flex-col gap-2 relative overflow-hidden ${isCritical ? 'bg-red-950/40 border-red-500/50' : 'bg-green-950/20 border-green-900/50 grayscale opacity-50'}`}>
                    {isCritical && <motion.div animate={{x: ['-100%', '200%']}} transition={{duration: 2, repeat: Infinity, ease: 'linear'}} className="absolute top-0 w-full h-[1px] bg-red-400 shadow-[0_0_8px_red]" />}
                    <span className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${isCritical ? 'text-red-400' : 'text-green-500'}`}><EyeOff className="w-3 h-3"/> Culling Active</span>
                    <span className="text-[10px] font-mono text-gray-400">Shadow Cascades: {isCritical ? '0' : '3'}</span>
                    <div className="w-full h-1 bg-black rounded overflow-hidden"><motion.div animate={{width: isCritical ? '100%' : '0%'}} className="h-full bg-red-500" /></div>
                 </div>

                 <div className={`p-3 border rounded-lg transition-all duration-500 flex flex-col gap-2 relative overflow-hidden ${isWarning || isCritical ? 'bg-yellow-950/40 border-yellow-500/50' : 'bg-green-950/20 border-green-900/50 grayscale opacity-50'}`}>
                    {(isWarning || isCritical) && <motion.div animate={{x: ['-100%', '200%']}} transition={{duration: 3, repeat: Infinity, ease: 'linear'}} className="absolute top-0 w-full h-[1px] bg-yellow-400 shadow-[0_0_8px_yellow]" />}
                    <span className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${isWarning || isCritical ? 'text-yellow-400' : 'text-green-500'}`}><BarChart3 className="w-3 h-3"/> Resolution Scaling</span>
                    <span className="text-[10px] font-mono text-gray-400">Screen %: {isCritical ? '65%' : isWarning ? '85%' : '100%'}</span>
                    <div className="w-full h-1 bg-black rounded overflow-hidden"><motion.div animate={{width: isCritical ? '35%' : isWarning ? '15%' : '0%'}} className="h-full bg-yellow-500" /></div>
                 </div>

                 <div className="mt-2 p-3 bg-black/60 rounded border border-gray-800">
                    <div className="text-[8px] text-gray-500 font-bold uppercase mb-1">Architecture Note</div>
                    <div className="text-[9px] text-gray-400/80 font-light leading-relaxed">
                      The engine strictly preserves Simulation State integrity. It reacts to high load by scaling down Presentation, such as culling shadows or reducing render scale, to prevent input latency.
                    </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MemoryStateTab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">Memory & State Architecture</h2>
      <p className="text-kingfisher-muted">Techniques to minimize RAM footprint, prevent Garbage Collection hitches, and stream assets efficiently.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Data-Driven Items (USTRUCTs)" icon={Folder} color={COLORS.status.success}>
        <p className="mb-2"><strong>The Problem:</strong> Creating 1,000 "Object" items is like giving each item its own separate car. It clogs up the road with massive GC overhead.</p>
        <p className="mb-4"><strong>The Optimization:</strong> We use tiny, efficient "Envelopes" (USTRUCTs).</p>
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>Lean Memory:</strong> Structs avoid the UObject reflection layer, keeping the per-item footprint {"<"} 64 bytes. Fits within a single CPU Cache Line.</li>
          <li><strong>FName Lookups:</strong> We use `FName` for ID lookups, turning string comparisons into instant integer checks.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Streaming & Precaching" icon={HardDrive} color={COLORS.kingfisher.blue}>
        <p className="mb-2"><strong>The Problem:</strong> Hard-referencing assets bloating the Resident Set Size (RSS) and causing startup/traversal stalls.</p>
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>Asynchronous Loading:</strong> Use `TSoftObjectPtr` as an "IOU". The game knows where the asset is on disk, but doesn't load its binary data into RAM until you get close.</li>
          <li><strong>Fluid Cutscenes:</strong> Prerender shadows and pre-cache heavy cinematic Skeletal Meshes *before* the camera starts moving to avoid frame-time spikes and pop-in.</li>
        </ul>
      </SectionCard>

      <SectionCard title="World Partition & HLODs" icon={Layers} color={COLORS.status.warning}>
        <p className="mb-2"><strong>Grid-Based Streaming:</strong> We divide the planet into a spatial grid and only load the cell you are in, plus the 8 around it.</p>
        <div className="bg-black/20 p-3 rounded border border-amber-500/30 mt-2 text-sm text-kingfisher-muted">
          <strong className="text-amber-400">HLODs (Hierarchical Level of Detail):</strong> Optimization process that merges 1000 distant trees into 1 single "Fake" 3D proxy mesh. Maintains the visual horizon while drastically dropping the vertex and draw-call count.
        </div>
      </SectionCard>

      <SectionCard title="Advanced Persistence (Save/Load)" icon={Database} color={COLORS.status.info}>
        <p className="mb-2"><strong>The Problem:</strong> Saving in text like JSON causes massive heap allocations and slowness.</p>
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>Binary Archives:</strong> Use `FArchive` for raw computer data that deserializes megabytes in milliseconds.</li>
          <li><strong>Rolling Buffers:</strong> Stagger autosaves across multiple index slots. If a power outage corrupts a write, the previous slots survive.</li>
          <li><strong>Delta-Saving:</strong> For open worlds, only save what *changed* from the base template.</li>
        </ul>
      </SectionCard>
    </div>
  </div>
);

const NetworkingPhysicsTab = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">Networking, Physics & UI</h2>
      <p className="text-kingfisher-muted">Scaling systems to support massive multiiplayer, instant hit-detection, and highly responsive UI.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Multiplayer Authority & Culling" icon={Globe} color={COLORS.status.info}>
        <p className="mb-2"><strong>Replication Culling:</strong> The server acts as a Referee. It shouldn't send you movement data for a player located 10 miles away. Distance-based culling saves immense bandwidth.</p>
        <div className="bg-black/20 p-3 rounded border border-blue-500/30 mt-2 text-sm text-kingfisher-muted">
          <strong className="text-blue-400">COND_SkipOwner:</strong> Don't send data back to the person who triggered it. If a client plays a prediction animation, having the server immediately send back the same state causes rubber-banding and wastes packets.
        </div>
      </SectionCard>

      <SectionCard title="Massive Graph Compression (Bitmasks)" icon={Network} color={COLORS.kingfisher.warm}>
        <p className="mb-2"><strong>Passive Trees & Quest Objectives:</strong> Storing 500 "Yes/No" node answers as separate bools wastes network payload sizes.</p>
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>Bitset Compression:</strong> We store the entire Skill Tree state as bits (0s and 1s) in a `uint32[16]` array. 512 booleans packed perfectly into UDP packets.</li>
          <li><strong>Graph Traversal (DFS):</strong> Ensures players cannot "cheat" by modifying memory to unlock isolated floating nodes.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Physics: Traces vs Sub-Stepping" icon={Waves} color={COLORS.status.success}>
        <ul className="list-disc pl-5 space-y-3 text-kingfisher-muted text-sm">
          <li><strong className="text-emerald-400">Hitscan (Line Traces):</strong> Instant, invisible, and cheap. Used for fast bullets. Bypasses the heavy collision engine.</li>
          <li><strong className="text-emerald-400">Sub-Stepping:</strong> For slow, physical spells. If a projectile travels at 5000 units/s, it might pass through a wall between frames. Sub-stepping splices the physics check multiple times per frame so the spell never phases through geometry.</li>
          <li><strong className="text-emerald-400">Quadtrees for Visibility:</strong> Fog of War utilizes a Quadtree to efficiently cull unseen map tiles instead of O(N^2) pixel checks.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Thread-Safety & UMG ViewModels" icon={Settings} color={COLORS.kingfisher.muted}>
        <p className="mb-2"><strong>Decoupling Systems:</strong></p>
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>UMG ViewModels:</strong> Never use "Tick Bindings" allowing a UI to ask "Did health change?" every frame. We push events to a ViewModel. O(1) rendering updates.</li>
          <li><strong>Anim Worker Threads:</strong> Never lock the Main Thread with bone math. Animation Proxies compute IK and blended walks on asynchronous worker threads.</li>
        </ul>
      </SectionCard>
    </div>
  </div>
);

export default OptimizationGuide;

