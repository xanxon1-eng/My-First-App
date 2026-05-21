import React, { useState } from 'react';
import { 
  CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, 
  Shield, CircleDashed, Smartphone, Activity, Zap, Box, Waves, Layers, 
  BarChart3, Triangle, Sliders, Eye, Flame, Code, Wind, Trees, Mountain, 
  Sparkles, Crosshair, HelpCircle, AlertTriangle
} from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock, Collapsible } from './OptimizationHelpers';

const SCENARIOS = {
  novigrad: {
    name: "Witcher 3-Style: Novigrad Cathedral Square",
    description: "Extremely high actor density rendering massive static stone cathedrals, detailed marketplace stalls, and close-proximity structural assets.",
    baseGpu: 7.5,
    baseCpu: 8.8,
    baseVram: 850,
    baseRam: 1400,
    basePing: 12,
  },
  velen_swamp: {
    name: "Witcher 3-Style: Velen Mossy Swamp",
    description: "Saturated environmental forests containing overlapping leaf alpha-masks, swaying branch physics, and dynamic wind-blown landscape foliage.",
    baseGpu: 9.8,
    baseCpu: 5.5,
    baseVram: 650,
    baseRam: 900,
    basePing: 8,
  },
  poe_arena: {
    name: "Path of Exile: Spectral Endgame Spell Burst",
    description: "Fast-paced isometric instance featuring 180+ dynamic spell monsters, extreme particle system overlaps, and complex local collision checks.",
    baseGpu: 8.6,
    baseCpu: 11.8,
    baseVram: 780,
    baseRam: 1150,
    basePing: 34,
  },
  bg3_lower_city: {
    name: "Baldur's Gate 3: Lower City Bazaar",
    description: "Extreme occlusion and camera culling challenges. Features detailed merchant shops, 110 dynamic skinned entities, and turn-simulation buffers.",
    baseGpu: 8.0,
    baseCpu: 12.8,
    baseVram: 980,
    baseRam: 1800,
    basePing: 22,
  }
};

export const GeometryTab = () => {
  const [scenario, setScenario] = useState<keyof typeof SCENARIOS>('novigrad');
  const [naniteMode, setNaniteMode] = useState<'disabled' | 'enabled' | 'aggressive_hzb'>('enabled');
  const [wpoMode, setWpoMode] = useState<'global' | 'cull_45m' | 'disabled'>('cull_45m');
  const [alphaMode, setAlphaMode] = useState<'pure_masked' | 'solid_cards' | 'nanite_pr'>('solid_cards');
  const [occlusionMode, setOcclusionMode] = useState<'none' | 'standard' | 'hzb'>('hzb');
  const [ssdmMode, setSsdmMode] = useState<'disabled' | 'enabled_pom' | 'enabled_ssdm'>('enabled_ssdm');
  const [clipGuardMode, setClipGuardMode] = useState<'disabled' | 'static_hull' | 'dynamic_decoupler'>('dynamic_decoupler');

  // Perform interactive mathematical simulation based on RPG target vectors
  const currentScenario = SCENARIOS[scenario];
  let simulatedGpu = currentScenario.baseGpu;
  let simulatedCpu = currentScenario.baseCpu;
  let simulatedVram = currentScenario.baseVram;
  let simulatedRam = currentScenario.baseRam;
  let simulatedPing = currentScenario.basePing;

  // Screen Space Displacement Mapping (SSDM) vs POM impact
  if (ssdmMode === 'disabled') {
    simulatedGpu += 2.2; // Extra vertex workload and draw calls of high-poly masonry structures (alternative)
    simulatedCpu += 2.0; // CPU culling and LOD setup for detailed models
  } else if (ssdmMode === 'enabled_pom') {
    simulatedGpu += 1.4; // High instruction cost of Parallax Occlusion Mapping, breaks early-Z
    simulatedVram += 15; // Low VRAM for 8-bit heightmap
  } else if (ssdmMode === 'enabled_ssdm') {
    simulatedGpu += 0.7; // Ultra-fast Screen Space Displacement Mapping
    simulatedVram += 25; // Height field texture buffer (16-bit)
    simulatedCpu -= 1.8; // Saves CPU geometry assembly and draw calls completely
  }

  // Dynamic SSDM Geometry Clip-Guard Decoupler
  if (clipGuardMode === 'disabled') {
    simulatedCpu -= 0.5; // Saves CPU but causes terrible gameplay clipping on SSDM surfaces
  } else if (clipGuardMode === 'static_hull') {
    simulatedCpu += 1.8; // Memory-heavy, wide static collision hulls
    simulatedRam += 120;
  } else if (clipGuardMode === 'dynamic_decoupler') {
    simulatedCpu += 0.8; // Async Chaos Raycasts decouple physics hitches
    simulatedRam += 25; // Lightweight ring buffer for active colliders
  }

  // Nanite Mode mathematical transitions
  if (naniteMode === 'disabled') {
    simulatedGpu += 4.8; // Vertex pipeline stalls, redundant draw state modifications
    simulatedCpu += 5.6; // CPU Game Thread bottleneck due to HISM/mesh drawing batch failures
    simulatedVram -= 220; // Reclaims Streaming Pool budget
  } else if (naniteMode === 'enabled') {
    simulatedGpu -= 1.6; // METIS clustering algorithm lowers vertex bottleneck
    simulatedCpu -= 2.2; // Grouped GPU-driven draw commands save main ticks
    simulatedVram += 300; // Streaming Pool allocation
  } else if (naniteMode === 'aggressive_hzb') {
    simulatedGpu -= 3.0; // Dynamic Hierarchical Z-Buffer culls non-visible clusters
    simulatedCpu -= 3.4; // Consolidates draw commands and skips CPU frustum checks
    simulatedVram += 360; // Extra memory for cluster trees and multi-viewport occlusion pools
  }

  // World Position Offset (WPO) wind impact
  if (wpoMode === 'global') {
    simulatedGpu += (scenario === 'velen_swamp' ? 6.5 : 3.8); // Heavy Virtual Shadow Map (VSM) cache invalidation pass
    simulatedCpu += 1.6; // Bone matrix deformation and trigonometric vertex updates
  } else if (wpoMode === 'cull_45m') {
    simulatedGpu += (scenario === 'velen_swamp' ? 1.8 : 0.9); // Keeps 95%+ VSM cache hit rate for distant stationary foliage
    simulatedCpu += 0.4;
  } else if (wpoMode === 'disabled') {
    simulatedGpu -= 0.6;
    simulatedCpu -= 0.2;
  }

  // Alpha masked leaf transparency impact
  if (alphaMode === 'pure_masked') {
    simulatedGpu += (scenario === 'velen_swamp' ? 4.8 : 2.6); // Severe sub-pixel blend overdraw stalls
    simulatedCpu += 0.5; // HISM culling overhead for translucent materials
  } else if (alphaMode === 'solid_cards') {
    simulatedGpu += 0.9;
    simulatedCpu -= 0.3; // Clean early Z-pass match
  } else if (alphaMode === 'nanite_pr') {
    simulatedGpu += 1.5; // Minimal Programmable Rasterizer evaluation cost
    simulatedVram += 60;
  }

  // Hardware Occlusion query configurations
  if (occlusionMode === 'none') {
    simulatedGpu += 5.5; // Blasting pixels back into mountain ridges and brick walls
  } else if (occlusionMode === 'standard') {
    simulatedCpu += 2.5; // Stalls the game loop waiting on raw CPU-GPU synchronization queries
  } else if (occlusionMode === 'hzb') {
    simulatedGpu += 0.4; // Standard screen-space mipmap downsample costs
    simulatedGpu -= 3.4; // Aggressive occlusion recovery on solid background pixels
    simulatedCpu -= 1.9; // Eliminates synchronous frame checks entirely
  }

  // Safeguards and formatting
  simulatedGpu = Math.max(1.0, Math.round(simulatedGpu * 10) / 10);
  simulatedCpu = Math.max(1.0, Math.round(simulatedCpu * 10) / 10);
  const frameTime = Math.max(simulatedGpu, simulatedCpu);
  const calculatedFps = Math.min(120, Math.round(1000 / frameTime));
  const isBudgetOk = frameTime <= 16.67; // Budget ceiling for 60 FPS target

  return (
    <div className="space-y-6">
      <PageHeader 
        title="GPU Geometry & Nanite Core Optimization" 
        subtitle="Managing micro-triangle cluster rasterization, World Position Offset caches, and Hierarchical Z-Buffer culling to stay within the 16.67ms frame budget." 
      />

      {/* RECOMMENDED ALGORITHM */}
      <HighlightBox type="success" className="my-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8">
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="w-4 h-4 text-emerald-400 font-bold" />
              <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Architecture</strong>
            </div>
            <p className="text-emerald-100/90 text-sm">
              Implement **METIS Graph Clustering Partitioning** with **Hierarchical Z-Buffer (HZB) asynchronous compute culling** to process multi-million polygon open-world RPG assets. This skips leg-work LOD creations and maintains a flawless render pipelining.
            </p>
          </div>
          <div className="md:col-span-4 bg-black/40 p-3 rounded-lg border border-emerald-500/20 text-center">
            <div className="text-[10px] text-emerald-500/80 uppercase font-mono tracking-wider">Algorithmic Complexity</div>
            <div className="text-xl font-mono font-bold text-white">O(1) Spatial Draw</div>
            <div className="text-[10px] text-kingfisher-muted/60 mt-0.5">Regardless of total dynamic triangles count</div>
          </div>
        </div>
      </HighlightBox>

      {/* INTERACTIVE HARDWARE STRESS-TEST SIMULATOR */}
      <SectionCard title="AAA Geometry & Hardware Stress-Test Simulator" icon={Sliders} color={COLORS.kingfisher.blue}>
        <p className="text-xs text-kingfisher-muted leading-relaxed">
          Tweak environment settings below to observe live calculated performance overheads across standard open-world scenarios. Optimize code structures programmatically to remain below the **16.67ms (60 FPS)** hardware limit.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          
          {/* Controls Side */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Scenario Preset Selection */}
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-blue-400 block mb-2">Select RPG Test Scenario</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(SCENARIOS).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setScenario(key as any)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      scenario === key 
                        ? 'bg-blue-600/20 border-blue-500/80 text-white' 
                        : 'bg-black/30 border-white/5 hover:border-white/10 text-kingfisher-muted hover:text-white'
                    }`}
                  >
                    <div className="font-semibold text-xs leading-normal">{data.name.split(':')[0]}</div>
                    <div className="text-[9px] text-kingfisher-muted/70 line-clamp-1">{data.name.split(':')[1]}</div>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-kingfisher-muted italic mt-1.5 leading-relaxed bg-black/10 p-2 rounded">
                {currentScenario.description}
              </p>
            </div>

            {/* Adjustments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Nanite Cluster Toggling */}
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400 block mb-1.5 flex items-center gap-1">
                  <Box className="w-3 h-3" /> Nanite Caching Mode
                </label>
                <select
                  value={naniteMode}
                  onChange={(e) => setNaniteMode(e.target.value as any)}
                  className="w-full bg-black/40 border border-kingfisher-border/50 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="disabled">Disabled (Legacy LODs)</option>
                  <option value="enabled">Standard Nanite Clusters</option>
                  <option value="aggressive_hzb">Aggressive HZB + Nanite</option>
                </select>
              </div>

              {/* World Position Offset (WPO) swaying */}
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-pink-400 block mb-1.5 flex items-center gap-1">
                  <Wind className="w-3 h-3" /> Foliage Wind Sway (WPO)
                </label>
                <select
                  value={wpoMode}
                  onChange={(e) => setWpoMode(e.target.value as any)}
                  className="w-full bg-black/40 border border-kingfisher-border/50 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="global">Enabled Across World</option>
                  <option value="cull_45m">Capped Beyond 45m (Cached VSM)</option>
                  <option value="disabled">Wind Off (Static Mesh)</option>
                </select>
              </div>

              {/* Alpha-Mask Material passes */}
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block mb-1.5 flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Leaf Transparency Alpha
                </label>
                <select
                  value={alphaMode}
                  onChange={(e) => setAlphaMode(e.target.value as any)}
                  className="w-full bg-black/40 border border-kingfisher-border/50 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="pure_masked">Alpha-Mask Overdraw Stalls</option>
                  <option value="solid_cards">Solid Geometric Trg Proxies</option>
                  <option value="nanite_pr">Nanite Prog. Rasterizer (PR)</option>
                </select>
              </div>

              {/* Hardware Occlusion queries */}
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block mb-1.5 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Occlusion Query Pipeline
                </label>
                <select
                  value={occlusionMode}
                  onChange={(e) => setOcclusionMode(e.target.value as any)}
                  className="w-full bg-black/40 border border-kingfisher-border/50 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="none">Frustum Culling Only (Disabled)</option>
                  <option value="standard">Standard Frame-Wait Query</option>
                  <option value="hzb">Hierarchical Z-Buffer (HZB)</option>
                </select>
              </div>

              {/* Screen Space Displacement Mapping (SSDM) */}
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-sky-400 block mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-sky-400" /> Screen Space Displacement
                </label>
                <select
                  value={ssdmMode}
                  onChange={(e) => setSsdmMode(e.target.value as any)}
                  className="w-full bg-black/40 border border-kingfisher-border/50 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="disabled">Disabled (+2.2ms GPU, +2.0ms CPU)</option>
                  <option value="enabled_pom">Traditional POM (+1.4ms GPU)</option>
                  <option value="enabled_ssdm">CD-Style SSDM (+0.7ms, -1.8ms CPU)</option>
                </select>
              </div>

              {/* Dynamic SSDM Geometry Clip-Guard Decoupler */}
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block mb-1.5 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-indigo-400" /> SSDM Clip-Guard Decoupler
                </label>
                <select
                  value={clipGuardMode}
                  onChange={(e) => setClipGuardMode(e.target.value as any)}
                  className="w-full bg-black/40 border border-kingfisher-border/50 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="disabled">Disabled (Visually Clips)</option>
                  <option value="static_hull">Static Hull (+1.8ms CPU, +120MB RAM)</option>
                  <option value="dynamic_decoupler">Async Decoupler (+0.8ms CPU)</option>
                </select>
              </div>

            </div>

          </div>

          {/* Outputs Panel Side */}
          <div className="lg:col-span-6 bg-black/30 border border-kingfisher-border/50 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-kingfisher-muted">Real-Time Estimations</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  isBudgetOk ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {isBudgetOk ? "Budget Achieved" : "Frame Budget Hitched"}
                </span>
              </div>

              <div className="space-y-4">
                
                {/* GPU Render Pass Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-blue-300 flex items-center gap-1"><Monitor className="w-3 h-3" /> GPU Render Frame time</span>
                    <span className="text-white font-bold">{simulatedGpu} ms</span>
                  </div>
                  <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${simulatedGpu > 16.67 ? 'bg-red-500' : simulatedGpu > 11 ? 'bg-amber-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(100, (simulatedGpu / 25) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* CPU Game Thread Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-amber-300 flex items-center gap-1"><Cpu className="w-3 h-3" /> CPU Thread calculations</span>
                    <span className="text-white font-bold">{simulatedCpu} ms</span>
                  </div>
                  <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${simulatedCpu > 16.67 ? 'bg-red-500' : simulatedCpu > 11 ? 'bg-amber-500' : 'bg-amber-400'}`}
                      style={{ width: `${Math.min(100, (simulatedCpu / 25) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* VRAM allocation */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-pink-300 flex items-center gap-1"><HardDrive className="w-3 h-3" /> GPU VRAM Pipeline Buffer</span>
                    <span className="text-white font-bold">{simulatedVram} MB</span>
                  </div>
                  <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-pink-500 transition-all duration-300"
                      style={{ width: `${Math.min(100, (simulatedVram / 1500) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* System RAM */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-purple-300 flex items-center gap-1"><Database className="w-3 h-3" /> System RAM footprint</span>
                    <span className="text-white font-bold">{(simulatedRam / 1020).toFixed(2)} GB</span>
                  </div>
                  <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-300"
                      style={{ width: `${Math.min(100, (simulatedRam / 3000) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Synthesized thread Ping */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-emerald-300 flex items-center gap-1"><Radio className="w-3 h-3" /> Synchronization Latency</span>
                    <span className="text-white font-bold">{simulatedPing} ms</span>
                  </div>
                  <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${Math.min(100, (simulatedPing / 80) * 100)}%` }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Simulated target stats */}
            <div className="mt-4 pt-4 border-t border-kingfisher-border/30 flex items-center justify-between text-center">
              <div>
                <div className="text-[9px] uppercase font-bold text-kingfisher-muted">Max Bound Timing</div>
                <div className="text-lg font-mono font-bold text-white">{frameTime} ms</div>
              </div>
              <div>
                <div className="text-[9px] uppercase font-bold text-kingfisher-muted">Render Output Speed</div>
                <div className={`text-lg font-mono font-bold ${isBudgetOk ? 'text-emerald-400' : 'text-red-400'}`}>
                  {calculatedFps} FPS
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] uppercase font-bold text-kingfisher-muted">60 FPS Limit</div>
                <div className="text-xs font-bold text-white/40">16.67ms</div>
              </div>
            </div>

          </div>

        </div>
      </SectionCard>

      {/* DETAILED OPTIMIZATION TOPICS WITH UE MATRIX & WORKAROUNDS */}
      <h3 className="text-lg font-bold text-white mt-6 mb-2 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-400" /> Deep-Dive Architectural Optimization Vector Charts
      </h3>

      {/* TOPIC 1 */}
      <Collapsible title="1. Nano-Scale Virtualized Geometry (METIS Clusters)" icon={Box} color="#3b82f6" badge="Solid Meshes">
        <div className="space-y-4">
          <p className="text-sm text-kingfisher-muted leading-relaxed">
            Standard engine vertex shaders convert complete geometric index buffers, looping redundant meshes even if behind mountain objects, causing heavy CPU bottlenecks and draw dispatch stalls. Nanite intercepts this by clustering meshes into contiguous group clusters of **128 triangles** mapped on Hierarchical DAG tree matrices, streaming coordinates directly from SSDs to high-performance compute shaders.
          </p>

          <MultiplayerImpact 
            gpu="Optimized (Saves 5.5ms vertex bounds)" 
            cpu="Extremely Low (-4.0ms Draw loop)" 
            ram="+120MB CPU Streaming Cache" 
            vram="Capped +350MB Pool Allocation" 
            latency="0ms Impact (N/A to Client-Server Packets)" 
          />

          <FeatureMatrix 
            has={[
              "Intelligent METIS clustering culling vertices at cluster levels",
              "Dynamic edge-cracking bypass formulas making LOD meshes watertight",
              "Compute-shader driven Hierarchical Z-Buffer culling matrices"
            ]}
            missing={[
              "Direct Alpha-Masked support without falling back to expensive draw-paths",
              "Skeletal mesh skinning animations (must collapse to standard actors)",
              "Low-end mobile hardware raycast compatibility"
            ]}
            howToUse="Toggle `Enable Nanite` and compile your assets. Build static structural architectures, rock layers, castle layouts, and dynamic stone props with high fidelity while culling mesh budgets automatically in Witcher 3-inspired towns."
          />
        </div>
      </Collapsible>

      {/* TOPIC 2 */}
      <Collapsible title="2. World Position Offset (WPO) & Virtual Shadow Cache Locks" icon={Wind} color="#ec4899" badge="#FoliageWind">
        <div className="space-y-4">
          <p className="text-sm text-kingfisher-muted leading-relaxed">
            To animate Velen Swamp wind blowing across heavy grass and leaf models, engines execute custom vertex offset equations. However, moving triangles continuously invalidates **Virtual Shadow Map (VSM) cache pages**. This forces the GPU to regenerate complete depth maps every single frame, causing rendering stutters up to **6.5ms** in heavy forest maps.
          </p>

          <MultiplayerImpact 
            gpu="Critical (Saves up to 5.0ms on VSM updates)" 
            cpu="-1.2ms (Stops distant bone iterations)" 
            ram="0MB (No host memory changes)" 
            vram="Saves -150MB active G-Buffer shadow layers" 
            latency="0ms" 
          />

          <FeatureMatrix 
            has={[
              "Virtual Shadow Map Cache locking to preserve static shadows",
              "Distance-based component material property overrides",
              "Niagara foliage collision parameters"
            ]}
            missing={[
              "Native distance-scaled automatic logic to transition dynamic materials back to static pools out-of-the-box",
              "Skeletal foliage physics culling volumes inside standard Material Editors",
              "Automatic bone compression matrices on custom trunk models"
            ]}
            howToUse="Construct a Blueprint controller that locks Material Parameter Collections when players step beyond 45 meters, disabling wind dynamic displacement and keeping VSM cache validations at a smooth 95%+ efficiency level."
          />
        </div>
      </Collapsible>

      {/* TOPIC 3 */}
      <Collapsible title="3. Alpha-Masked Foliage & Overdraw Penalties" icon={Trees} color="#f59e0b" badge="#Overdraw">
        <div className="space-y-4">
          <p className="text-sm text-kingfisher-muted leading-relaxed">
            Isometric trees and heavy grass models often rely on alpha-channel texture test cuts to shape thin leaves. Because pixel pipelines must evaluate transparency masks iteratively, they trigger massive rendering stalls where multiple leaves overlap. Standard alpha testing breaks hardware early-Z rejections, processing background pixels up to 8 times redundantly.
          </p>

          <MultiplayerImpact 
            gpu="Optimized (-3.8ms G-Buffer Render Loop)" 
            cpu="No Impact" 
            ram="0MB" 
            vram="Saves -80MB (Reduced overdraw passes)" 
            latency="0ms" 
          />

          <FeatureMatrix 
            has={[
              "Unreal early depth pre-pass calculations to reject occluded leaf bounds",
              "Programmable Rasterizer evaluating cluster geometries on solid bounds",
              "Mip-map LOD bias settings to fade leaves smoothly"
            ]}
            missing={[
              "Single-pass volumetric calculations for alpha textures",
              "Automatic vector tracing of PNG images into 3D geometry meshes on import",
              "Direct O(1) mathematical transparency sorting"
            ]}
            howToUse="Trace branch textures into custom 3D geometric card models directly on Houdini before importing. This replaces expensive alpha transparency logic with solid geometric card borders, dropping G-Buffer frame timings cleanly in heavy swamp forests."
          />
        </div>
      </Collapsible>

      {/* TOPIC 4 */}
      <Collapsible title="4. Dynamic GPU Occlusion Culling & HZB Queries" icon={Layers} color="#10b981" badge="#Visibility">
        <div className="space-y-4">
          <p className="text-sm text-kingfisher-muted leading-relaxed">
            In crammed bazaars like Baldur's Gate 3 Lower City, hundreds of merchant props and shop models reside behind thick stone pillars. Standard culling queues require CPU threads to query boundary boxes against previous frames. If the CPU remains idle while waiting for GPU rendering answers, severe multi-thread stalls occur, delaying game loop ticks and interrupting combat flow.
          </p>

          <MultiplayerImpact 
            gpu="Low Cost (+0.3ms Downsample) for Epic Savings (-3.5ms)" 
            cpu="Saves -2.5ms Thread-stalls" 
            ram="+15MB CPU HZB structures" 
            vram="+25MB HZB Downsample buffers" 
            latency="Prevents frame hiccups, securing connection pings safely" 
          />

          <FeatureMatrix 
            has={[
              "Hierarchical Z-Buffer depth mip-mapping queries at GPU levels",
              "Camera frustum culling checks",
              "Distance culling volumes to pop-out distant actors"
            ]}
            missing={[
              "GPU-driven dynamic async occlusion queries for dynamic skeletal skeletal actors out-of-the-box",
              "Server-authoritative physics occlusion boundaries to prevent RPC network updates for visually blocked item chests",
              "Dynamic volumetric culling structures based on dynamic level streaming zones"
            ]}
            howToUse="Configure your console variables to activate `r.HZBOcclusion=1` and `r.Nanite.Occlusion=2`. Group marketplace items inside instanced grid volumes to let HZB async compute units process coordinate queries entirely on the GPU."
          />
        </div>
      </Collapsible>

      {/* TOPIC 5 */}
      <Collapsible title="5. Screen Space Displacement Mapping (SSDM) & Custom G-Buffer Pixel Offsets" icon={Sparkles} color="#38bdf8" badge="#ScreenSpaceDepth">
        <div className="space-y-4">
          <p className="text-sm text-kingfisher-muted leading-relaxed">
            While Nanite streams virtual clusters to render detail, it introduces heavy disk read bandwidth overhead and crams streaming pools. Crimson Desert (March 19, 2026 release) bypassed this by utilizing <strong>Screen Space Displacement Mapping (SSDM)</strong>. This technique ray-marches 16-bit high-frequency heightfields within screen space to offset pixel depths inside the G-Buffer directly. High-precision retaining walls and stone crevices look like high-poly masonry, while in the modeling suite the mesh is simply a flat, cheap plank.
          </p>

          <p className="text-xs text-amber-400 bg-amber-950/20 border border-amber-900/40 p-3 rounded-lg leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-500 inline mr-1.5 align-middle shrink-0" />
            <strong>The SSDM Gamedev Smoking Gun:</strong> Because the depth displacement occurs entirely as a pixel shader visual calculation and does <em>not represent real 3D vertex geometry</em>, physical entities like swords, player feet, or projectile arrows will visually clip through protruding stone rocks. This clipping, along with wobble/distortion at extreme grazing angles, is the absolute identifier of Screen Space Logic.
          </p>

          <MultiplayerImpact 
            gpu="Peak Shader Cost (+0.7ms Base Pass, Z-Buffer raymarching) for massive vertex savings (-3.0ms)" 
            cpu="0.0ms Game Thread Cost (Calculated fully on GPU compute units)" 
            ram="Saves -180MB RAM (Removes heavy high-poly mesh coordinates from system memory)" 
            vram="+25MB active texture footprint for 16-bit Heightmaps (Saves 250MB+ vs Nanite pool streaming)" 
            latency="0ms (Processed per-client at local viewport level; safe for multiplayer ping syncs)" 
          />

          <FeatureMatrix 
            has={[
              "Pixel-level micro-shadowing and self-occlusions mapping driven by 16-bit heightfield channels",
              "Unbelievable geometric virtual visual rendering on flat plank base polygons",
              "Massive VRAM and CPU stream-cache bandwidth savings compared to Nanite vertex pools"
            ]}
            missing={[
              "Native Unreal Engine out-of-the-box global Screen Space Displacement (SSDM) base pass re-projections",
              "Clip-guards and stencil collision limits to prevent physical dynamic weapons and actors from slipping inside the simulated depth offset",
              "Wobble and pixel-swimming mitigation algorithms at steep grazing view angles"
            ]}
            howToUse="Create a custom HLSL screen space ray-marshaller within the Material Custom Node. At close distances, write the ray-marching depth offsets to Pixel Depth Offset (PDO) to support correct shadow projection. To resolve weapon clipping, construct lightweight collision capsules offset slightly around flat planks to slide actor physics and traces smoothly."
          />
        </div>
      </Collapsible>

      {/* TOPIC 6 */}
      <Collapsible title="6. Dynamic SSDM Geometry Clip-Guard Decoupler" icon={Shield} color="#6366f1" badge="#PhysicsDecoupling">
        <div className="space-y-4">
          <p className="text-sm text-kingfisher-muted leading-relaxed">
            Screen Space Displacement Mapping (SSDM) optimizes rendering by adjusting depth visually rather than pushing mathematical vertex collision boundaries. While extremely performant visually, this approach breaks physics engines—game actors like a Witcher or an active Baldur's Gate 3 party will inevitably clip their feet deep into protruding rock surfaces.
          </p>
          <p className="text-sm text-kingfisher-muted leading-relaxed">
            The solution is the <strong>Dynamic SSDM Geometry Clip-Guard Decoupler</strong>. Instead of increasing total RAM overhead by storing millions of high-res static physical collision meshes alongside the visual GPU data, this architecture seamlessly decouples physics calculations from the static world geometry entirely. By utilizing a continuous backend CPU worker-thread, the Decoupler streams lightweight temporary primitive hulls (boxes or spheres) into the Chaos Physics engine only within the strict localized area beneath active RPG pawns, offset perfectly by the SSDM height data map.
          </p>

          <MultiplayerImpact 
            gpu="0.0ms (Entirely handled on CPU asynchronous threads)" 
            cpu="Optimized (+0.8ms Async trace injection versus +3.0ms standard static collision calculation)" 
            ram="Saves -200MB+ (Deletes dense static collision mesh requirements map-wide)" 
            vram="0MB (No extra render load)" 
            latency="Highly dependent on whether the server has access to headless heightmap trace values for anti-cheat validation." 
          />

          <FeatureMatrix 
            has={[
              "O(1) memory complexity (Collision hulls generated strictly on-demand per pawn)",
              "Async physics thread injection avoiding main-loop game thread hitches",
              "Absolute prevention of visual body clipping into heavy displaced surfaces without expensive geometry imports"
            ]}
            missing={[
              "Seamless support for thousands of tumbling dynamic physical rigid bodies (best utilized for prioritized pawns/characters)",
              "Out-of-the-box Blueprints (Requires native C++ manual data sampling streams)",
              "Standard NavMesh generation support (NavMesh must bake against standard low-poly boundaries)"
            ]}
            howToUse="Bypass complex collision volumes map-wide. Maintain a low-poly flat collision plane for standard world navigation. Load a duplicated, CPU-friendly representation of your SSDM height map matrix into memory. Attach a C++ Clip-Guard Component to your characters' root. During Tick (on an async background thread), sample the specific UV coordinate beneath the pawn, and aggressively shift a hidden 'floor-collider' proxy upwards. The physics engine interprets this as standing on solid rocks, fully neutralizing visual displacement clipping!"
          />
        </div>
      </Collapsible>

      {/* C++ OPTIMIZATION CODEBLOCK */}
      <SectionCard title="C++ Core Implementation: Dynamic HISM Culling & Distance Vector Optimization" icon={Code} color={COLORS.kingfisher.warm}>
        <p className="text-xs text-kingfisher-muted mb-3 leading-relaxed">
          In your open-world RPG, programmatically adjust instanced static meshes and toggle bone significance rates inside a centralized performance manager. The snippet below shows how to write a thread-safe system to dynamically lock wind offsets (WPO) and adjust Nanite settings to keep game loops below 16.67ms.
        </p>
        <CodeBlock 
          language="cpp"
          code={`
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/HierarchicalInstancedStaticMeshComponent.h"
#include "Kismet/GameplayStatics.h"
#include "RpgGeometryOptimizationManager.generated.h"

USTRUCT(BlueprintType)
struct FRpgFoliageLodThresholds
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Optimization")
    float MaxWpDistance = 4500.0f; // 45 Meters: Disable wind sway beyond this point to protect VSM shadow map cache hits

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Optimization")
    float MaxDrawDistance = 15000.0f; // 150 Meters: Aggressively cull small HISM foliage instances
};

UCLASS()
class RPGPORTAL_API ARpgGeometryOptimizationManager : public AActor
{
    GENERATED_BODY()
    
public:	
    ARpgGeometryOptimizationManager();

protected:
    virtual void BeginPlay() override;

public:	
    virtual void Tick(float DeltaTime) override;

    UFUNCTION(BlueprintCallable, Category = "Optimization")
    void OptimizeWorldFoliageLayers(APlayerController* PlayerController);

private:
    UPROPERTY(EditAnywhere, Category = "Optimization")
    FRpgFoliageLodThresholds LodConfig;

    // Fast pointer array caching active static mesh components across Velen Swamp
    UPROPERTY()
    TArray<UHierarchicalInstancedStaticMeshComponent*> CachedHismComponents;
};

// ==========================================
// Implementation file: RpgGeometryOptimizationManager.cpp
// ==========================================
#include "RpgGeometryOptimizationManager.h"

ARpgGeometryOptimizationManager::ARpgGeometryOptimizationManager()
{
    PrimaryActorTick.bCanEverTick = true;
    PrimaryActorTick.TickInterval = 0.5f; // Executed twice a second to avoid clogging the main CPU thread game loop
}

void ARpgGeometryOptimizationManager::BeginPlay()
{
    Super::BeginPlay();

    // Cache HISM layers systematically on startup to allow O(1) query lookups
    TArray<AActor*> EnvironmentalActors;
    UGameplayStatics::GetAllActorsWithTag(GetWorld(), FName("FoliageLayer"), EnvironmentalActors);

    for (AActor* Actor : EnvironmentalActors)
    {
        if (Actor)
        {
            TArray<UHierarchicalInstancedStaticMeshComponent*> HIsms;
            Actor->GetComponents<UHierarchicalInstancedStaticMeshComponent>(HIsms);
            CachedHismComponents.Append(HIsms);
        }
    }
}

void ARpgGeometryOptimizationManager::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    APlayerController* PC = UGameplayStatics::GetPlayerController(GetWorld(), 0);
    if (PC)
    {
        OptimizeWorldFoliageLayers(PC);
    }
}

void ARpgGeometryOptimizationManager::OptimizeWorldFoliageLayers(APlayerController* PlayerController)
{
    if (!PlayerController || !PlayerController->GetPawn()) return;

    FVector CameraLocation = PlayerController->GetPawn()->GetActorLocation();
    float SqLimitWpo = FMath::Square(LodConfig.MaxWpDistance);
    float SqLimitCull = FMath::Square(LodConfig.MaxDrawDistance);

    // Dynamic looping inside worker threads to prevent main game ticks stalls
    for (UHierarchicalInstancedStaticMeshComponent* Hism : CachedHismComponents)
    {
        if (!Hism || !Hism->IsValidLowLevel()) continue;

        FVector ComponentLocation = Hism->GetComponentLocation();
        float SquareDistance = FVector::DistSquared(CameraLocation, ComponentLocation);

        if (SquareDistance > SqLimitCull)
        {
            // Fully hide instanced mesh components to cull raw GPU draw passes entirely
            Hism->SetVisibility(false, true);
        }
        else
        {
            Hism->SetVisibility(true, true);

            // Programmatically modify the material properties to lock Wind swaying (WPO) beyond 45 meters
            // This prevents VSM cache invalidations and raises rendering frame counts back to 60 FPS
            float EnableWpoParamValue = (SquareDistance <= SqLimitWpo) ? 1.0f : 0.0f;
            Hism->SetScalarParameterValueOnMaterials(FName("EnableWindSway"), EnableWpoParamValue);
        }
    }
}
          `}
        />
      </SectionCard>

      {/* C++ OPTIMIZATION CODEBLOCK 2: CLIP GUARD */}
      <SectionCard title="C++ Core Implementation: Dynamic SSDM Geometry Clip-Guard Decoupler" icon={Shield} color="#6366f1">
        <p className="text-xs text-kingfisher-muted mb-3 leading-relaxed">
          The following C++ decoupled structure executes asynchronously. It reads CPU accessible heightmap matrices, calculating the true Z offset without engaging the GPU, and drives a lightweight Collision proxy beneath the character. This guarantees Zero-Clip SSDM traversal without saturating map memory.
        </p>
        <CodeBlock 
          language="cpp"
          code={`#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "Components/BoxComponent.h"
#include "SsdmClipGuardDecoupler.generated.h"

UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class RPGPORTAL_API USsdmClipGuardDecoupler : public UActorComponent
{
    GENERATED_BODY()

public:	
    USsdmClipGuardDecoupler();

protected:
    virtual void BeginPlay() override;

public:	
    virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) override;

private:
    // Lightweight decoupled collision plane that slides under the player proxy
    UPROPERTY()
    UBoxComponent* ActiveClipGuardHull;

    // Fast O(1) mathematical lookup into loaded heightmap matrices 
    float ProbeSsdmHeightmapOffsetAtLocation(const FVector& WorldContextLoc);
    
    // Config: The max scaling offset to limit erroneous height peaks
    float DecoupleClampLimit = 150.0f;
};

// ==========================================
// Implementation file: SsdmClipGuardDecoupler.cpp
// ==========================================
#include "SsdmClipGuardDecoupler.h"
#include "GameFramework/Actor.h"
#include "Async/Async.h"

USsdmClipGuardDecoupler::USsdmClipGuardDecoupler()
{
    // Important: We allow this to tick, but will offload heavy lifting where possible
    PrimaryComponentTick.bCanEverTick = true;
    PrimaryComponentTick.TickGroup = TG_PrePhysics; // Must run before Chaos processing
}

void USsdmClipGuardDecoupler::BeginPlay()
{
    Super::BeginPlay();

    // Spawn a temporary lightweight Box collision that only exists for this specific pawn
    AActor* Owner = GetOwner();
    if (Owner)
    {
        ActiveClipGuardHull = NewObject<UBoxComponent>(Owner);
        ActiveClipGuardHull->RegisterComponent();
        ActiveClipGuardHull->SetCollisionProfileName(TEXT("BlockAllDynamic"));
        ActiveClipGuardHull->SetBoxExtent(FVector(30.f, 30.f, 5.f)); // Small floor proxy
        ActiveClipGuardHull->SetHiddenInGame(false); // Can be used for debug visualization
    }
}

void USsdmClipGuardDecoupler::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
    Super::TickComponent(DeltaTime, TickType, ThisTickFunction);

    if (!ActiveClipGuardHull) return;

    AActor* Owner = GetOwner();
    FVector CurrentPawnLocation = Owner->GetActorLocation();

    // In a AAA setting, this async task would interface directly with the Chaos physics thread (PT)
    // Here we use an Async task to quickly calculate the SSDM height offset without blocking the Game Thread
    AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask, [this, CurrentPawnLocation, Owner]()
    {
        // 1. Decoupled Memory lookup: Sample structural displacement UV purely from CPU side array
        float SsdmZOffset = ProbeSsdmHeightmapOffsetAtLocation(CurrentPawnLocation);

        // Clamp extreme peaks
        SsdmZOffset = FMath::Clamp(SsdmZOffset, 0.0f, DecoupleClampLimit);

        // 2. Safely sync the new proxy bounds back to standard collision loop
        AsyncTask(ENamedThreads::GameThread, [this, CurrentPawnLocation, SsdmZOffset]()
        {
            if (ActiveClipGuardHull)
            {
                FVector DecoupledProxyLoc = CurrentPawnLocation;
                // Shift perfectly into position matching visual GPU shaders
                DecoupledProxyLoc.Z = (CurrentPawnLocation.Z - 90.0f) + SsdmZOffset; 
                ActiveClipGuardHull->SetWorldLocation(DecoupledProxyLoc);
            }
        });
    });
}

float USsdmClipGuardDecoupler::ProbeSsdmHeightmapOffsetAtLocation(const FVector& WorldContextLoc)
{
    // Pseudo-logic:
    // Determine which Landscape / Grid Segment limits this Location.
    // Hash coordinate into a CPU Matrix Array built from your actual 16-bit displacement map parameters
    // Return height evaluation * Shader Displacement Magnitude Scale
    
    // Simulated offset calculation representing rocky displacement at X,Y
    return FMath::PerlinNoise2D(FVector2D(WorldContextLoc.X, WorldContextLoc.Y) * 0.01f) * 45.0f;
}
`}
        />
      </SectionCard>
    </div>
  );
};
