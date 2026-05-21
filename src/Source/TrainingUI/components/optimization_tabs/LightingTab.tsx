import React, { useState } from 'react';
import {
  Sun, Cpu, Monitor, Database, HardDrive, Radio, CheckCircle, X,
  Sliders, Search, Code, RefreshCw, Zap, Shield, HelpCircle, AlertTriangle, Play, Check, Copy, Trees, Sword, Flame, Clock
} from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { PageHeader, SectionCard, HighlightBox, CodeBlock } from './OptimizationHelpers';

// Types and Interfaces
interface PerformanceResult {
  cpuMain: number; // ms
  cpuRender: number; // ms
  gpu: number; // ms
  vram: string;
  ram: string;
  pingImpact: number; // ms
  verdict: string;
  suitability: 'perfect' | 'good' | 'average' | 'poor' | 'unviable';
  pros: string[];
  cons: string[];
  ueFeatures: string[];
  ueMissing: string[];
}

export const LightingTab: React.FC = () => {
  // Selector State
  const [selectedPlatform, setSelectedPlatform] = useState<string>('pc_high');
  const [selectedArchetype, setSelectedArchetype] = useState<string>('witcher');
  const [selectedPreset, setSelectedPreset] = useState<string>('outdoor');
  const [selectedLighting, setSelectedLighting] = useState<string>('lumen');
  const [currentInfoTab, setCurrentInfoTab] = useState<'legacy' | 'meshes' | 'cascades' | 'blueprints'>('cascades');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Static options dictionaries
  const PLATFORMS = [
    { id: 'pc_high', name: 'High-End PC (CPU N, RTX 4080+)', desc: '8-Core modern CPU, hardware ray tracing. Generous budget.' },
    { id: 'console_next', name: 'Next-Gen Console (PS5 / Xbox Series X)', desc: 'Unified memory architecture, standard multi-threaded GPU pipelines.' },
    { id: 'handheld', name: 'Handheld / Steam Deck (CPU N-1, RDNA2)', desc: 'Highly energy-throttled, dynamic mobile scaling required.' },
    { id: 'vr_standalone', name: 'VR Standalone (Meta Quest 3 equivalent)', desc: 'Strict 90Hz/120Hz frame target (11.1ms/8.3ms), rendering twice for stereo projection.' },
    { id: 'prev_gen', name: 'Prev-Gen / CPU N-1 (PS4 / Core i7-4790K)', desc: 'Severe CPU draw call bottlenecks and zero ray-tracing hardware support.' }
  ];

  const ARCHETYPES = [
    { id: 'witcher', name: 'The Witcher 3 (Wide-Open-World RPG)', devTitle: 'Massive Landscapes, Dynamic sun-cycle, dense foliage, caves' },
    { id: 'poe', name: 'Path of Exile 2 (Isometric VFX Spell-Caster)', devTitle: 'Fixed camera, 100+ overlapping dynamic magic lights, volatile visual effects' },
    { id: 'bg3', name: 'Baldur\'s Gate 3 (CPU-Bound Systemic RPG)', devTitle: 'Turn-based logic, massive NPC counts, dense visual cities, dialogue cams' }
  ];

  const ENVIRONMENT_PRESETS = [
    { id: 'outdoor', name: 'Sunlit Village & Dense Forest' },
    { id: 'cave', name: 'Dark Crypt (Torches & Magic Spellcasts)' },
    { id: 'city', name: 'Crowded Medieval Metropolis' }
  ];

  const LIGHTING_OPTIONS = [
    { id: 'pure_baked', name: 'Pure Baked Global Illumination (GPU Lightmass)', desc: 'Completely frozen, offline light pre-calculation.' },
    { id: 'hybrid_baked', name: 'Hybrid Baked (GPU Lightmass + CSM Sun)', desc: 'Baked background, real-time dynamic shadows for movers.' },
    { id: 'megalights', name: 'Stochastic Direct Dynamic (MegaLights + SSGI)', desc: 'UE5.5+ stochastic ray sampling for thousands of lights.' },
    { id: 'lumen', name: 'Dynamic GI Next-Gen (Lumen + VSM)', desc: 'Software/Hardware raymarched dynamic indirect bounces.' },
    { id: 'rtgi_brute', name: 'Brute-Force Hardware Ray Tracing (RTGI)', desc: 'Direct, unfiltered triangle ray checks across BVH.' },
    { id: 'ambient_fake', name: 'High-Performance Ambient Fake (Ambient Cubemap + DFAO)', desc: 'No active GI; HDRI lighting map with distance caving.' },
    { id: 'radiance_cascades', name: 'Sparse 3D Radiance Cascades Cache (Next-Gen)', desc: 'Noiseless hierarchical interval angle-merging. Custom integrated.' }
  ];

  // Dynamic Metrics Simulator Core
  const calculateMetrics = (): PerformanceResult => {
    // Base values that get modified by parameters
    let baseCpuMain = 1.0;
    let baseCpuRender = 1.2;
    let baseGpu = 4.0;
    let baseVramNum = 1.0; // GB
    let baseRamNum = 200; // MB
    let basePing = 0; // ms

    let pros: string[] = [];
    let cons: string[] = [];
    let suitability: 'perfect' | 'good' | 'average' | 'poor' | 'unviable' = 'good';
    let verdict = "";
    let ueFeatures: string[] = [];
    let ueMissing: string[] = [];

    // Apply Lighting System modifiers
    switch (selectedLighting) {
      case 'pure_baked':
        baseCpuMain = 0.1;
        baseCpuRender = 0.1;
        baseGpu = 0.3;
        baseVramNum = 1.6;
        baseRamNum = 480;
        pros = ['Flawless performance - lighting costs 0ms on the GPU!', 'No dynamic leaks, clean ambient shadows, perfect contact shadows on static items.'];
        cons = ['Completely static. Moving a light or time slider does absolutely nothing.', 'Foliage cannot sway realistically, and dynamic spells look ungrounded.', 'Extreme lightmap VRAM footprint.'];
        ueFeatures = ['GPU/CPU Lightmass', 'Volumetric Lightmaps (VLM) for moving characters', 'Baked Lightmap uv packing in static mesh editor'];
        ueMissing = ['Dynamic UV generation on PROCEDURAL procedural assets.', 'Runtime baking features for open worlds without severe 5-minute pauses.'];
        break;

      case 'hybrid_baked':
        baseCpuMain = 0.6;
        baseCpuRender = 1.2;
        baseGpu = 2.8;
        baseVramNum = 1.1;
        baseRamNum = 260;
        pros = ['Decent visual quality with baked GI and sharp, real-time Sun shadows (CSM).', 'Stable, predictable frame times on last-gen hardware.'];
        cons = ['Character shadow limits: dynamic characters only receive CSM shadow bounds, causing clipping or floating.', 'Time-of-day changes are limited (sun rotates, but indoor ambient bounces remain static).'];
        ueFeatures = ['Stationary Lights (Direct Dynamic + Indirect Baked)', 'Cascaded Shadow Maps (CSM)', 'Volumetric Lightmap Interpolation'];
        ueMissing = ['Dynamic color bleed from dynamic clothing onto static world surfaces.', 'Automatic sun-direction light-cascade matching.'];
        break;

      case 'megalights':
        baseCpuMain = 0.8;
        baseCpuRender = 1.6;
        baseGpu = 5.2;
        baseVramNum = 2.1;
        baseRamNum = 240;
        pros = ['Renders thousands of shadow-casting point and spot lights with flat overhead.', 'Absolute perfect mapping for PoE-style magical battles where spells overlap on screen.', 'No frame spikes or thread loops.'];
        cons = ['Strictly requires Hardware SM6 / DX12 support (unviable on Switch/PS4).', 'Provides direct lighting only; needs fallback like SSGI or DFAO for indirect bouncing lighting.'];
        ueFeatures = ['MegaLights stochastic compute scheduler (UE 5.5+)', 'Importance sampling ray tracer', 'Shadow map page binning'];
        ueMissing = ['Support for skeletal muscle translucency lighting out-of-the-box.', 'Forward rendering integration (Mobile/VR cannot use it).'];
        break;

      case 'lumen':
        baseCpuMain = 1.8;
        baseCpuRender = 2.4;
        baseGpu = 7.5;
        baseVramNum = 2.8;
        baseRamNum = 380;
        pros = ['Physically accurate, fully dynamic global illumination and glossy reflections.', 'Supports real-time structural destruction and time-of-day solar sweeps.'];
        cons = ['Troughs of noise and ghosting on rapid dynamic movers (Lumen lag).', 'Foliage sways constantly invalidate Virtual Shadow Map caches, spiking CPU.', 'Severe GPU overhead.'];
        ueFeatures = ['Lumen Card representations', 'Signed Distance Field (SDF) Software Tracing', 'Hardware Triangle BVH tracing'];
        ueMissing = ['Specialized foliage-wind caching bounds (wind material offsets always break VSM caching).', 'Noise-free reflections on animated skeletal fabrics without dynamic scaling.'];
        break;

      case 'rtgi_brute':
        baseCpuMain = 2.8;
        baseCpuRender = 3.2;
        baseGpu = 11.0;
        baseVramNum = 3.4;
        baseRamNum = 500;
        pros = ['Flawless, noise-free specular reflections and perfect indoor contact occlusion.', 'Bypasses Lumen\'s blocky card proxies, checking actual triangles.'];
        cons = ['Substantial CPU draw thread impact to rebuild the BVH spatial index from bone animations.', 'Insane GPU ray tracing cost that instantly drops frame rates below 30 FPS.'];
        ueFeatures = ['FScene Ray Tracing BVH building', 'PostProcess RTGI & RT Reflections overrides', 'Hardware ray-tracing pipelines'];
        ueMissing = ['Thread-safe background BVH refitting for dynamic procedural meshes.', 'Intelligent spatial denoising filters for multi-bounce calculations.'];
        break;

      case 'ambient_fake':
        baseCpuMain = 0.3;
        baseCpuRender = 0.5;
        baseGpu = 1.4;
        baseVramNum = 0.4;
        baseRamNum = 110;
        pros = ['Extremely lightweight on both CPU and GPU. Perfect for competitive/low-end platforms.', 'Safe from crash-loops, memory leaks, or driver timeouts.'];
        cons = ['Looks flat. Indoor dungeons and caves look unnaturally bright or leak light.', 'Characters look ungrounded - white fabric looks stark white in dark corners.'];
        ueFeatures = ['Ambient Cubemaps', 'Distance Field Ambient Occlusion (DFAO)', 'GTAO (Ground Truth Ambient Occlusion)'];
        ueMissing = ['Dynamic real-time color bleeding from world colors.', 'Ambient caving for dynamic weather without complex volumetric triggers.'];
        break;

      case 'radiance_cascades':
        baseCpuMain = 0.4;
        baseCpuRender = 0.8;
        baseGpu = 3.2;
        baseVramNum = 0.6;
        baseRamNum = 140;
        pros = ['Completely noiseless! No temporal filters or "trailing ghost" artifacts.', 'Grounds animated characters perfectly on the ground with zero latency color-transfer.', 'Procedural terrain destructions are practically free (raymarches the screen G-buffer).'];
        cons = ['Severe C++ implementation difficulty (requires custom RDG pass injection via Unreal source code).', 'Not a native out-of-the-box system in Epic\'s standard launcher.', 'Struggles with sharp mirror-like reflections (best suited for diffuse GI).'];
        ueFeatures = ['Render Dependency Graph (RDG) to inject custom Compute Shaders', 'Global Distance Fields for off-screen raymarching fallbacks'];
        ueMissing = ['Standard engine-level integration. Placing custom GI requires manually overriding shaders (.usf).', 'Automatic screen-to-world sparse cache scaling.'];
        break;
    }

    // Apply Platform Modifiers
    switch (selectedPlatform) {
      case 'pc_high':
        // Modern powerful specs, handle parallel threads smoothly
        baseCpuMain *= 0.8;
        baseCpuRender *= 0.7;
        baseGpu *= 0.6;
        baseVramNum *= 1.1;
        break;
      case 'console_next':
        // Standard baseline
        baseCpuMain *= 1.1;
        baseCpuRender *= 1.2;
        baseGpu *= 1.2;
        baseVramNum *= 0.9; // consolidated ESRAM/VRAM
        break;
      case 'handheld':
        // Extremely energy-restricted, CPU N-1, RDNA2
        baseCpuMain *= 2.4;
        baseCpuRender *= 2.6;
        baseGpu *= 3.8;
        baseVramNum *= 0.6; // restricted pool
        baseRamNum *= 0.8;
        if (selectedLighting === 'lumen' || selectedLighting === 'rtgi_brute' || selectedLighting === 'megalights') {
          suitability = 'unviable';
        } else if (selectedLighting === 'ambient_fake' || selectedLighting === 'pure_baked') {
          suitability = 'perfect';
        } else {
          suitability = 'average';
        }
        break;
      case 'vr_standalone':
        // Renders twice; must maintain stable low latency
        baseCpuMain *= 2.0;
        baseCpuRender *= 2.4;
        baseGpu *= 4.5; // stereo multiplier too
        baseVramNum *= 0.5;
        baseRamNum *= 0.7;
        if (selectedLighting === 'lumen' || selectedLighting === 'rtgi_brute' || selectedLighting === 'megalights') {
          suitability = 'unviable';
        } else if (selectedLighting === 'pure_baked') {
          suitability = 'perfect';
        } else {
          suitability = 'poor';
        }
        break;
      case 'prev_gen':
        // Ancient 4-thread CPU N-1, SM5 graphics
        baseCpuMain *= 3.2;
        baseCpuRender *= 3.5;
        baseGpu *= 4.2;
        baseVramNum *= 0.45;
        baseRamNum *= 0.9;
        if (selectedLighting === 'lumen' || selectedLighting === 'rtgi_brute' || selectedLighting === 'megalights') {
          suitability = 'unviable';
        } else if (selectedLighting === 'pure_baked' || selectedLighting === 'hybrid_baked') {
          suitability = 'perfect';
        } else if (selectedLighting === 'ambient_fake') {
          suitability = 'good';
        } else {
          suitability = 'poor';
        }
        break;
    }

    // Apply Archetype Modifiers (Combat, Foliage, AI)
    switch (selectedArchetype) {
      case 'witcher':
        // Large open world, massive foliage checks sways
        if (selectedLighting === 'lumen') {
          baseCpuMain += 1.2; // Huge VSM cache invalidation overhead due to foliage movement
          baseGpu += 1.8;
          cons.push('Foliage warning: Wind actor tree swaying is constantly invalidating VSM cache pages, spiking CPU render thread by +2.2ms.');
        } else if (selectedLighting === 'pure_baked') {
          suitability = 'poor';
          cons.push('Severe mismatch: Open worlds with clock tickers cannot use frozen static lightmaps without breaking active exploration loops.');
        } else if (selectedLighting === 'radiance_cascades') {
          baseCpuMain += 0.2;
          baseGpu += 0.4;
          pros.push('Open World edge: Highly reactive to day/night changes, and filters out foliage-sway pixel flickering natively.');
        }
        break;
      case 'poe':
        // Isometric, hundreds of overlapping lights, Niagara VFX
        if (selectedLighting === 'lumen') {
          baseCpuMain += 0.8;
          baseGpu += 3.5; // Deferred shading loop explosion! Overlapping points forcing deep G-buffer loops
          cons.push('VFX spell bottleneck: 30+ overlapping light radius checks choke standard Deferred rasterization paths.');
        } else if (selectedLighting === 'megalights') {
          suitability = 'perfect';
          baseGpu *= 0.6; // Stochastic capping does beautiful work here!
          pros.push('PoE-Style Combat Winner: Perfectly packs overlapping spell casts into a unified, flat-overhead ray check.');
        } else if (selectedLighting === 'radiance_cascades') {
          suitability = 'perfect';
          baseGpu *= 0.7;
          pros.push('Noiseless combat: Exploding spell casts light up the environment instantly without leaving ghost trails.');
        }
        break;
      case 'bg3':
        // Heavily CPU Bound: high pathing, turn logic, AI
        baseCpuMain += 2.0; // Base CPU strain from turn simulation
        basePing += 5; // Extra tick processing load
        if (selectedLighting === 'rtgi_brute') {
          suitability = 'unviable';
          baseCpuMain += 3.5; // BVH reconstruction spikes on top of existing simulation completely freezes frame pacing
          cons.push('Stutter trap! Stacked BVH refitting on top of systemic calculations delays Main Thread ticks, triggering massive 120ms frame drops.');
        } else if (selectedLighting === 'ambient_fake' || selectedLighting === 'radiance_cascades') {
          if (suitability !== 'unviable') suitability = 'perfect';
          pros.push('CPU Savior: Keeps the Game Thread entirely clear of lighting reconstruction, allowing maximum budget for simulation AI.');
        }
        break;
    }

    // Apply Environment Presets
    switch (selectedPreset) {
      case 'outdoor':
        if (selectedLighting === 'lumen') {
          baseGpu += 0.8;
        }
        break;
      case 'cave':
        // Lots of tiny local emitters (torches, dust, glow)
        if (selectedLighting === 'megalights') {
          baseCpuRender += 0.4;
        } else if (selectedLighting === 'pure_baked') {
          pros.push('Beautiful cave contrast! Static Lightmass creates stunning physical bounce gradients across dry stone walls.');
        }
        break;
      case 'city':
        // Huge geometric draw call counts
        baseCpuRender += 1.3; // coordinate geometry draws
        baseGpu += 1.5;
        if (selectedLighting === 'rtgi_brute') {
          baseCpuMain += 1.5;
        }
        break;
    }

    // Round values to high precision
    const cpuMainVal = parseFloat(baseCpuMain.toFixed(2));
    const cpuRenderVal = parseFloat(baseCpuRender.toFixed(2));
    const gpuVal = parseFloat(baseGpu.toFixed(2));

    // High CPU bottlenecks leak into frame times, causing network ticks to delay
    if (cpuMainVal > 15.0) {
      basePing += Math.round((cpuMainVal - 15.0) * 4);
    }

    // Assign suitability classes and verdicts
    if (suitability !== 'unviable') {
      const totalFrameTime = cpuMainVal + cpuRenderVal + gpuVal;
      if (totalFrameTime < 6.0) suitability = 'perfect';
      else if (totalFrameTime < 12.0) suitability = 'good';
      else if (totalFrameTime < 18.0) suitability = 'average';
      else suitability = 'poor';
    }

    // Dynamic Verdict formulation
    if (suitability === 'perfect') {
      verdict = "Flawless matching! Under 6ms total frame overhead. Completely optimized for this archetype, offering fluid 144 FPS potential and perfect thread headroom.";
    } else if (suitability === 'good') {
      verdict = "Production-ready. Maintains strict stable 60 FPS (16.6ms) safely. Excellent compromise between visual quality and performance constraints.";
    } else if (suitability === 'average') {
      verdict = "Requires vigilance. Total bounds hover near 16ms, indicating risk of dynamic drop rates during intense combat scenes. Needs strict scalability CVars.";
    } else if (suitability === 'poor') {
      verdict = "Severe concern. Frame deficits violate smooth pacing. Heavy bottlenecking detected; players will notice consistent micro-stuttering.";
    } else {
      verdict = "CRITICAL BOOT FAILURE / UNPLAYABLE! Graphics driver hangs (TDR) or single-digit frame rates will occur. This lighting configuration is forbidden on this hardware class.";
    }

    return {
      cpuMain: cpuMainVal,
      cpuRender: cpuRenderVal,
      gpu: gpuVal,
      vram: baseVramNum.toFixed(2) + " GB",
      ram: baseRamNum.toFixed(0) + " MB",
      pingImpact: basePing,
      verdict,
      suitability,
      pros,
      cons,
      ueFeatures,
      ueMissing
    };
  };

  const results = calculateMetrics();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lights, Shadows & Ray-Merging Masterclass"
        subtitle="Unraveling pre-Nanite legacy pipelines, stochastic direct lighting (MegaLights), and modern Radiance Cascades optimized for Witcher-like wide horizons, PoE-like VFX spams, and BG3-like CPU simulation densities."
      />

      {/* Interactive Simulator Section */}
      <SectionCard title="Interactive Performance & Hardware budget Simulator" icon={Sun} color={COLORS.kingfisher.warm}>
        <div className="text-xs text-kingfisher-muted mb-4 border-b border-kingfisher-border/30 pb-3">
          Configure game archetypes, platforms, and lighting structures to dynamically measure and verify the impact on budgets (GPU, CPU, VRAM, and systemic latency parameters) with concrete millisecond precision.
        </div>

        {/* Configurations Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-black/30 border border-kingfisher-border/50">
          
          {/* Column 1: Platform */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-kingfisher-muted flex items-center gap-1.5">
              <Monitor className="w-3 h-3 text-blue-400" /> Target Hardware Class
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full text-xs bg-kingfisher-dark border border-kingfisher-border rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-kingfisher-blue"
            >
              {PLATFORMS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <div className="text-[9px] text-kingfisher-muted/65 leading-relaxed italic">
              {PLATFORMS.find(p => p.id === selectedPlatform)?.desc}
            </div>
          </div>

          {/* Column 2: Game Archetype */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-kingfisher-muted flex items-center gap-1.5">
              <Sword className="w-3 h-3 text-orange-400" /> Game Design Archetype
            </label>
            <select
              value={selectedArchetype}
              onChange={(e) => setSelectedArchetype(e.target.value)}
              className="w-full text-xs bg-kingfisher-dark border border-kingfisher-border rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-kingfisher-blue"
            >
              {ARCHETYPES.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <div className="text-[9px] text-kingfisher-muted/65 leading-relaxed italic">
              {ARCHETYPES.find(a => a.id === selectedArchetype)?.devTitle}
            </div>
          </div>

          {/* Column 3: Environment Preset */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-kingfisher-muted flex items-center gap-1.5">
              <Trees className="w-3 h-3 text-emerald-400" /> Map Environmental Context
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
              className="w-full text-xs bg-kingfisher-dark border border-kingfisher-border rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-kingfisher-blue"
            >
              {ENVIRONMENT_PRESETS.map(ep => (
                <option key={ep.id} value={ep.id}>{ep.name}</option>
              ))}
            </select>
          </div>

          {/* Column 4: Lighting system setup */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-kingfisher-muted flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-yellow-400" /> Active Lighting Architecture
            </label>
            <select
              value={selectedLighting}
              onChange={(e) => setSelectedLighting(e.target.value)}
              className="w-full text-xs bg-kingfisher-dark border border-kingfisher-border rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-kingfisher-blue"
            >
              {LIGHTING_OPTIONS.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            <div className="text-[9px] text-kingfisher-muted/65 leading-relaxed italic">
              {LIGHTING_OPTIONS.find(l => l.id === selectedLighting)?.desc}
            </div>
          </div>
        </div>

        {/* Real-time Simulated Outputs Card */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6 p-5 rounded-xl border border-kingfisher-border/60 bg-kingfisher-dark/50 shadow-inner">
          
          {/* Col 1: Performance meters */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-kingfisher-blue" /> Frame-Time Budget Allocation
              </h4>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                results.suitability === 'perfect' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                results.suitability === 'good' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                results.suitability === 'average' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                results.suitability === 'poor' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                'bg-red-500/20 text-red-500 border border-red-500/40 animate-pulse'
              }`}>
                {results.suitability}
              </span>
            </div>

            {/* Simulated meters display */}
            <div className="space-y-3.5 pt-1">
              
              {/* GPU Meter */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-kingfisher-muted flex items-center gap-1"><Monitor className="w-3.5 h-3.5 text-blue-400" /> GPU Draw & Rasterization:</span>
                  <span className={`font-semibold ${results.gpu > 12.0 ? 'text-red-400' : 'text-white'}`}>{results.gpu} ms</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, (results.gpu / 16.67) * 100)}%` }}
                  />
                </div>
              </div>

              {/* CPU Main Thread */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-kingfisher-muted flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-amber-400" /> CPU Game Thread (Logic):</span>
                  <span className="text-white font-semibold">{results.cpuMain} ms</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, (results.cpuMain / 16.67) * 100)}%` }}
                  />
                </div>
              </div>

              {/* CPU Render Thread */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-kingfisher-muted flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-purple-400" /> CPU Render Thread (Draw calls coordination):</span>
                  <span className="text-white font-semibold">{results.cpuRender} ms</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, (results.cpuRender / 16.67) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Extra hardware indicators */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-black/20 p-2.5 rounded-lg border border-white/5 text-center">
                  <div className="text-[10px] text-kingfisher-muted mb-0.5 font-bold uppercase tracking-wider">VRAM Occupancy</div>
                  <div className="font-mono text-xs font-extrabold text-[#fc84fc]">{results.vram}</div>
                </div>
                <div className="bg-black/20 p-2.5 rounded-lg border border-white/5 text-center">
                  <div className="text-[10px] text-kingfisher-muted mb-0.5 font-bold uppercase tracking-wider">System RAM</div>
                  <div className="font-mono text-xs font-extrabold text-blue-400">{results.ram}</div>
                </div>
                <div className="bg-black/20 p-2.5 rounded-lg border border-white/5 text-center">
                  <div className="text-[10px] text-kingfisher-muted mb-0.5 font-bold uppercase tracking-wider">Net Tick Ping Impact</div>
                  <div className={`font-mono text-xs font-extrabold ${results.pingImpact > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {results.pingImpact > 0 ? `+${results.pingImpact}ms stall` : '0ms (Unstalled)'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Verdict card */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between">
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#fc84cb] flex items-center gap-1">
                <Shield className="w-3 h-3" /> Core Architect Verdict
              </h5>
              <p className="text-xs text-kingfisher-surface/90 leading-relaxed font-sans">{results.verdict}</p>
            </div>

            {results.suitability === 'unviable' ? (
              <div className="mt-4 p-2.5 rounded bg-red-500/15 border border-red-500/35 flex gap-2 items-start text-[11px] text-red-300">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Critical Bottleneck:</strong> This selection exceeds the platform's thermal boundaries and memory allocation pools. It is strictly rejected.
                </div>
              </div>
            ) : (
              <div className="mt-4 text-[10px] bg-emerald-500/10 border border-emerald-500/20 p-2 rounded flex gap-1.5 items-center text-emerald-400">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Compliant with selected platform budgets.</span>
              </div>
            )}
          </div>
        </div>

        {/* Pros and Cons Dynamic Breakdowns */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> Core Implementation Advantages
            </h5>
            <ul className="space-y-1">
              {results.pros.map((pro, i) => (
                <li key={i} className="text-xs text-kingfisher-muted flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-500 mt-1">•</span> {pro}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <X className="w-3.5 h-3.5" /> Tradeoffs & Friction Metrics
            </h5>
            <ul className="space-y-1">
              {results.cons.map((con, i) => (
                <li key={i} className="text-xs text-kingfisher-muted flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-500 mt-1">•</span> {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Unreal Has vs Missing details box */}
        <div className="mt-4 p-4 rounded-xl bg-kingfisher-panel/40 border border-kingfisher-border/60">
          <h5 className="text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5 mb-3">
            <Sliders className="w-3.5 h-3.5 text-kingfisher-blue" /> Unreal Engine out-of-the-box Platform Mapping
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <div className="text-emerald-400 font-bold text-[9px] uppercase tracking-wider">✅ What Unreal Provides out-of-the-box:</div>
              <ul className="space-y-1 text-kingfisher-muted">
                {results.ueFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5"><span>•</span> {f}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-1">
              <div className="text-rose-400 font-bold text-[9px] uppercase tracking-wider">❌ What Unreal Lacks (Requires custom source setup):</div>
              <ul className="space-y-1 text-kingfisher-muted">
                {results.ueMissing.map((m, i) => (
                  <li key={i} className="flex items-start gap-1.5"><span>•</span> {m}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Segmented Knowledge Tabs Controller */}
      <div className="border-b border-kingfisher-border flex gap-2 overflow-x-auto pb-px scrollbar-none">
        {[
          { id: 'legacy', label: 'Pre-UE5 Legacy Architecture', icon: Clock },
          { id: 'meshes', label: 'Mesh-Type GI Matrix', icon: Sliders },
          { id: 'cascades', label: 'Radiance Cascades Breakthrough', icon: SpotLightIcon },
          { id: 'blueprints', label: 'Production Shader C++ Blueprint', icon: Code }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setCurrentInfoTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
              currentInfoTab === tab.id
                ? 'border-kingfisher-warm text-white bg-white/5 rounded-t-lg'
                : 'border-transparent text-kingfisher-muted hover:text-white hover:bg-white/5 rounded-t-lg'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content Areas dependent on Selected Information Tab */}
      <div className="space-y-6">
        {currentInfoTab === 'legacy' && (
          <div className="space-y-6">
            <HighlightBox type="info">
              <strong>The Game Architect Choice:</strong> Before Lumen and Virtual Shadow Maps, game loops had highly standardized approaches to dynamic sun sweeping. While legacy systems lack "infinite bounce GI", their execution cost is a tiny fraction of current systems, making them critical for handheld optimization (Switch, Steam Deck, low-end PCs).
            </HighlightBox>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Pure Precomputed Lightmass (Static Lighting)',
                  gpu: '0.2ms - 0.4ms (Only handles lightmap texture sample fetch)',
                  cpu: '0.0ms at runtime (Absolutely free of scene calculation loops)',
                  ram: 'High (~250MB - 500MB VRAM/RAM for loaded lightmap blocks)',
                  simplicity: 'Low: Single clicking "Build Lighting" in editor invokes Swarm / GPU solver.',
                  friction: 'Extreme: Moving any actor (even a small chair) invalidates the bake, forcing a complete recalculation and requiring flat non-overlapping Lightmap UV coordinates.',
                  recommendation: 'Perfect for static interior scenes, fixed visual time-of-day layouts, or competitive e-sports titles.'
                },
                {
                  title: 'Stationary Lighting (Hybrid Pipeline)',
                  gpu: '1.2ms - 2.8ms (Handles dynamic CSM sun blends + static interior bakes)',
                  cpu: '0.8ms - 1.5ms (Gathers shadow culling boxes for dynamic meshes)',
                  ram: 'Moderate (~150MB matching smaller lightmap resolutions)',
                  simplicity: 'High: Assign light actors to "Stationary". No further settings needed.',
                  friction: 'Moderate: Limit of 4 overlapping Stationary lights per viewport tile (due to 4 channels inside the texture mask), exceeding flags light as red.',
                  recommendation: 'Highly recommended for Witcher 3 classic/mobile tiers where open-world directional sweeps need real-time character shadowing, but houses remain baked.'
                },
                {
                  title: 'Cascaded Shadow Maps (CSM)',
                  gpu: '2.5ms - 6.5ms (Scales exponentially with high vertex density counts)',
                  cpu: '1.4ms - 3.0ms (Forces meshes to render across multiple cascade viewports)',
                  ram: 'Minimal (~30MB for dynamic depth buffers)',
                  simplicity: 'Immediate plug-and-play. Set directional light to "Movable".',
                  friction: 'Low: Calibrating cascade distance clipping and texture resolutions takes some manual sliders.',
                  recommendation: 'Gold standard sun shadow mapping for older hardware classes (CPU N-1, PS4) and dense foliage scenes where Nanite is offline.'
                },
                {
                  title: 'Signed Distance Field Shadows (SDF Shadows)',
                  gpu: '0.8ms - 1.5ms (Computes soft shadow vectors beautifully at extreme ranges)',
                  cpu: '0.2ms (Bypasses rendering meshes, checks low-res volume fields)',
                  ram: 'Low (~60MB for pre-calculated distance field textures)',
                  simplicity: 'Medium: Requires enabling global distance field checkboxes in Project Settings.',
                  friction: 'Low: Can cause minor visual leaking around extreme micro-geometric models (like mesh fences).',
                  recommendation: 'Exceptional for open world foliage and forests, producing soft shadows in the 50m - 500m range and saving huge vertex pools.'
                }
              ].map((sys, idx) => (
                <SectionCard key={idx} title={sys.title} icon={Clock} color={COLORS.kingfisher.blue}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2.5 bg-black/30 p-2.5 rounded border border-white/5 text-[11px] font-mono">
                      <div>
                        <div className="text-blue-400 font-bold uppercase tracking-wider text-[9px]">GPU Cost</div>
                        <div>{sys.gpu}</div>
                      </div>
                      <div>
                        <div className="text-amber-400 font-bold uppercase tracking-wider text-[9px]">CPU Cost</div>
                        <div>{sys.cpu}</div>
                      </div>
                      <div>
                        <div className="text-purple-400 font-bold uppercase tracking-wider text-[9px]">RAM footprint</div>
                        <div>{sys.ram}</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs text-kingfisher-muted">
                      <div><strong>Implementation:</strong> <span className="text-kingfisher-surface">{sys.simplicity}</span></div>
                      <div><strong>Friction Metrics:</strong> <span className="text-kingfisher-surface">{sys.friction}</span></div>
                      <div className="p-2 rounded bg-kingfisher-blue/5 border border-kingfisher-blue/20">
                        <strong>Architect Choice:</strong> <span className="text-kingfisher-surface">{sys.recommendation}</span>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              ))}
            </div>
          </div>
        )}

        {currentInfoTab === 'meshes' && (
          <div className="space-y-6">
            <HighlightBox type="success">
              <strong>Mesh Pipeline Compatibility Masterclass:</strong> How next-gen lighting solvers interact with individual mesh types (Static vs dynamic skeletal). In open world RPGs, animated characters and splines cannot use precomputed proxies, meaning naive systems suffer immense performance regressions.
            </HighlightBox>

            <SectionCard title="Dynamic Mesh & Lighting Compatibility Matrix" icon={Sliders} color={COLORS.kingfisher.blue}>
              <div className="overflow-x-auto text-xs font-sans">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-kingfisher-border bg-black/40">
                      <th className="p-3 text-left font-bold text-white tracking-wide">Pipeline Setup</th>
                      <th className="p-3 text-left font-bold text-emerald-400 tracking-wide">Static Meshes (Environment)</th>
                      <th className="p-3 text-left font-bold text-amber-400 tracking-wide">Skeletal Meshes (Movers)</th>
                      <th className="p-3 text-left font-bold text-purple-400 tracking-wide">Procedural Meshes (Voxel/Spline)</th>
                      <th className="p-3 text-left font-bold text-blue-400 tracking-wide">Nanite Geometries (Micro)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-kingfisher-border/30">
                    {[
                      {
                        name: 'Software Lumen',
                        static: 'Computes low-res Mesh Distance Fields and flat cards. High-fidelity bounce GI.',
                        skeletal: 'Screen-space ONLY. If character goes off-camera, their ambient bounce coloring drops instantly.',
                        procedural: 'Off-screen blind spot. Lacks MDF indices, treating dynamic splines strictly in screen buffer.',
                        nanite: 'Uses optimized low-poly Nanite Fallback Mesh to generate lightweight GI cards.'
                      },
                      {
                        name: 'Hardware Lumen',
                        static: 'Checks Ray-Tracing BVH directly, delivering flawless contact shading and glossy metals.',
                        skeletal: 'Dynamic BVH refitting per-frame matches animations. Highly realistic but costs CPU cycles.',
                        procedural: 'Supported, but forcing CPU to reconstruct BVH nodes as splines deform causes severe micro-stuttering.',
                        nanite: 'Traces the fallback proxy by default; can force full-mesh validation via console command.'
                      },
                      {
                        name: 'Path Tracer',
                        static: 'Ground-truth mathematically perfect diffuse and specular ray bounces.',
                        skeletal: 'Flawless visual scattering (subsurface skin), but causes temporal noise blur during fast motion.',
                        procedural: 'Renders procedural models perfectly, but demands extreme raw GPU processing power.',
                        nanite: 'Native streaming of high-precision Nanite models; bypasses fallback proxies completely.'
                      },
                      {
                        name: 'Radiance Cascades (Sparse)',
                        static: 'Constant-time diffuse ambient bounce with razor-tight occlusion details.',
                        skeletal: 'Perfect color-bleed grounding without temporal latency or ghost trails as characters run.',
                        procedural: 'Virtually free! Marches the screen depth buffer; shattering rocks naturally react to nearby campfires.',
                        nanite: 'Samples the prinstine, razor-sharp G-Buffer depth generated by Nanite, grounding dense foliage grass.'
                      }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-bold text-white border-r border-kingfisher-border/20 bg-black/20">{row.name}</td>
                        <td className="p-3 text-kingfisher-muted leading-relaxed">{row.static}</td>
                        <td className="p-3 text-kingfisher-muted leading-relaxed">{row.skeletal}</td>
                        <td className="p-3 text-kingfisher-muted leading-relaxed">{row.procedural}</td>
                        <td className="p-3 text-kingfisher-muted leading-relaxed">{row.nanite}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>
        )}

        {currentInfoTab === 'cascades' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Box 1: Core details */}
              <SectionCard title="Deconstructing Radiance Cascades" icon={Zap} color={COLORS.kingfisher.warm}>
                <p className="text-sm">
                  Originally pioneered by the <strong>Grinding Gear Games</strong> engineering team for <strong>Path of Exile 2</strong>, 
                  Radiance Cascades represents a foundational breakthrough in calculating Global Illumination.
                </p>
                <p className="text-sm text-kingfisher-muted">
                  Unlike traditional ray tracing which shoots random rays and requires heavy temporal filters (which cause the typical "Lumen trail" or ghosting), 
                  Radiance Cascades uses a mathematical hierarchy of intervals. It samples closer regions with high spatial density but low angular resolution, and far regions with low spatial density but high angular resolution.
                </p>
                
                {/* Visual character grounding breakdown */}
                <div className="mt-4 p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Witcher-Style Character Grounding Breakdown
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <strong className="text-white block">1. Raw baseline (Without Grounding system):</strong>
                      <span className="text-kingfisher-muted">The character appears to float unnaturally. Because there is no micro-occlusion, the exact point where boots meet mud has no shadow. White cloak fabric remains bright-white underneath, ignoring dark grass or nearby glowing torches.</span>
                    </div>
                    <div>
                      <strong className="text-amber-400 block">2. Capsule Shadows & SSAO (Legacy default):</strong>
                      <span className="text-kingfisher-muted">SSAO adds dynamic crevice lines, but lacks any color bounce. If you rotate the camera to look down, screen-space AO instantly shifts or vanishes as depth calculations change based on visible screen boundaries. Capsule shadows look like blurry dark smudges.</span>
                    </div>
                    <div>
                      <strong className="text-emerald-400 block">3. Localized Radiance Cascades Cache:</strong>
                      <span className="text-kingfisher-muted">Perfect contact shading in the microscopical gaps between boots and dirt. The white cloak naturally receives a soft green bounce from grass, and dynamic armor panels capture orange campfire glow instantly with <strong>zero temporal shading lag</strong> as the player sprints.</span>
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Box 2: The catch and limitations */}
              <SectionCard title="Rethinking the Magic: What is the Catch?" icon={AlertTriangle} color={COLORS.kingfisher.muted}>
                <p className="text-sm">
                  With such miraculous features, why didn\'t Epic Games integrate it as the default out-of-the-box system in UE5?
                  Graphics programming values compromise, and Radiance Cascades carries distinct production trade-offs:
                </p>

                <div className="space-y-4 pt-1">
                  
                  {/* Factor 1: Specular */}
                  <div className="flex gap-3">
                    <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 h-fit">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white text-xs block mb-0.5">The Specular Reflection Problem</strong>
                      <span className="text-xs text-kingfisher-muted leading-relaxed">
                        Radiance Cascades is mathematically designed for diffuse, uniform indirect lighting. Grouping narrow, sharp light directions (like mirrors or glossy glass) defeats the performance consolidation, making computation rates bloom exponentially. SSR or Hardware Ray Tracing are still prerequisite fallbacks.
                      </span>
                    </div>
                  </div>

                  {/* Factor 2: Dimensions */}
                  <div className="flex gap-3">
                    <div className="p-1.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 h-fit">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white text-xs block mb-0.5">The 3D Dimensional Memory Curse</strong>
                      <span className="text-xs text-kingfisher-muted leading-relaxed">
                        In static 2D or locked-isometric viewports (like PoE 2), allocating flat cascades is straightforward. But scaling into a full first- or third-person 3D world map requires a 3D grid of probes. Each probe storing branching angular rays of multi-layer cascades will choke system memory if allocated globally.
                      </span>
                    </div>
                  </div>

                  {/* Factor 3: Rings */}
                  <div className="flex gap-3">
                    <div className="p-1.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 h-fit">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-white text-xs block mb-0.5">Ringing, Haloes & Leaking</strong>
                      <span className="text-xs text-kingfisher-muted leading-relaxed">
                        Blending data between distinct far-field and near-field cascade levels (e.g. upscaling cascade 3 into cascade 0) can result in physical ringing artifacts - visible concentric halos around small bright lights. Slabs or thin wall buffers thinner than base probe spacing leak light.
                      </span>
                    </div>
                  </div>

                </div>
              </SectionCard>
            </div>

            {/* In-depth 3D implementation checklist step-by-step */}
            <SectionCard title="C++ & Shader Architecture: Optimal 3D Sparse Implementation" icon={Code} color={COLORS.kingfisher.blue}>
              <p className="text-sm">
                To prevent the "3D memory curse" from clogging your GPU budget, production-grade 3D Radiance Cascades in Unreal Engine 
                must implement a <strong>Camera-Targeted Sparse 3D Hash Map</strong>.
                Probes should only be spawned in a spatial frustum immediately visible to the camera, retaining recent records across frames.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs pt-1">
                {[
                  { step: '01', title: 'Sparse Allocation', desc: 'Read camera G-Buffer Depth and Normals. Compute shader groups pixels into 3D tiles, allocating probes only where solid models exist. Limits VRAM usage.' },
                  { step: '02', title: 'Base Traces (Cascade 0)', desc: 'Compile the closest tier. Shoot 4 to 8 rays out to a very short range R0. Execute fast screen-space raymarching against depth buffer to capture tight corners.' },
                  { step: '03', title: 'Hierarchy sweeps (1 to N)', desc: 'Iterate upwards. For Cascade C, double ray distance and quadruple angular density. For off-screen sweeps, fall back to sampling Global SDF vectors.' },
                  { step: '04', title: 'Bilinear 3D Interpolation', desc: 'Merge cascades downwards. Smoothly upscale low-resolution far-field data into highly detailed near-field probes, eliminating ringing halos.' },
                  { step: '05', title: 'G-Buffer Shading Injection', desc: 'Inject fully resolved light structures straight into G-Buffer emissive accumulation coordinates, rendering gorgeous dynamic indirect bounce.' }
                ].map((step, idx) => (
                  <div key={idx} className="bg-black/20 p-3 rounded-lg border border-kingfisher-border/40 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="text-lg font-mono font-extrabold text-[#fc84cb] mb-1">{step.step}</div>
                      <strong className="text-white block mb-1 font-semibold leading-snug">{step.title}</strong>
                      <span className="text-kingfisher-muted leading-relaxed text-[11px] block">{step.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {currentInfoTab === 'blueprints' && (
          <div className="space-y-6">
            <HighlightBox type="warning">
              <strong>Source-Code Injection Requirement:</strong> Integrating third-party GI setups into Unreal 5.8 cannot be done via Material Nodes or Blueprints. You must write a custom C++ rendering pass utilizing the <strong>Render Dependency Graph (RDG)</strong> and manual HLSL Compute Shaders.
            </HighlightBox>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              {/* C++ Blueprint */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-t-xl border-t border-x border-kingfisher-border/50">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-blue-400" /> RDG Pass Registration (C++)
                  </span>
                  <button
                    onClick={() => handleCopyCode('cppCode', cppCodeString)}
                    className="flex items-center gap-1 text-[10px] text-kingfisher-muted hover:text-white transition-all p-1 rounded bg-kingfisher-dark"
                  >
                    {copiedCode === 'cppCode' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCode === 'cppCode' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="max-h-[500px] overflow-y-auto rounded-b-xl border border-kingfisher-border/50">
                  <CodeBlock language="cpp" code={cppCodeString} />
                </div>
              </div>

              {/* HLSL Blueprint */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-t-xl border-t border-x border-kingfisher-border/50">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-emerald-400" /> HLSL Multi-Cascade Solver (.usf)
                  </span>
                  <button
                    onClick={() => handleCopyCode('hlslCode', hlslCodeString)}
                    className="flex items-center gap-1 text-[10px] text-kingfisher-muted hover:text-white transition-all p-1 rounded bg-kingfisher-dark"
                  >
                    {copiedCode === 'hlslCode' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCode === 'hlslCode' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="max-h-[500px] overflow-y-auto rounded-b-xl border border-kingfisher-border/50">
                  <CodeBlock language="hlsl" code={hlslCodeString} />
                </div>
              </div>

            </div>

            {/* Performance and scale parameters instruction */}
            <SectionCard title="Configuring & Tuning via console variables (CVars)" icon={Sliders} color={COLORS.kingfisher.blue}>
              <p className="text-xs text-kingfisher-muted mb-4 leading-relaxed">
                When shipping performance-tuned RPG directories, you can optimize native G-Buffer and distance metrics using these console commands.
                Bypassing active dynamic updates will stabilize your baseline rendering budget on target devices:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-black/30 p-3 rounded-lg border border-white/5 space-y-2">
                  <div className="font-extrabold text-blue-400 border-b border-kingfisher-border/30 pb-1 flex justify-between">
                    <span>CSM Sun and Shadows Optimizations</span>
                    <span className="text-[10px] text-kingfisher-muted">Saves ~1.8ms GPU</span>
                  </div>
                  <div>
                    <span className="text-white">r.Shadow.CSMMaxCascades = 2</span>
                    <p className="text-[10px] text-kingfisher-muted italic mt-0.5">Cuts dynamic sun cascades from 4 to 2, heavily optimizing GPU draw overhead on foliage.</p>
                  </div>
                  <div>
                    <span className="text-white">r.Shadow.Cache.KeepAliveMode = 1</span>
                    <p className="text-[10px] text-kingfisher-muted italic mt-0.5">Strictly caches static shadow pages inside VSM, preventing expensive redundant calculations.</p>
                  </div>
                  <div>
                    <span className="text-white">r.Shadow.DistanceScale = 0.85</span>
                    <p className="text-[10px] text-kingfisher-muted italic mt-0.5">Slightly tightens dynamic shadow draw distances, saving invaluable rendering coordinate ticks.</p>
                  </div>
                </div>

                <div className="bg-black/30 p-3 rounded-lg border border-white/5 space-y-2">
                  <div className="font-extrabold text-emerald-400 border-b border-kingfisher-border/30 pb-1 flex justify-between">
                    <span>Lumen & Ray Tracing Tweaks</span>
                    <span className="text-[10px] text-kingfisher-muted">Saves ~3.5ms GPU, 1.2ms CPU</span>
                  </div>
                  <div>
                    <span className="text-white">r.Lumen.HardwareRayTracing = 0</span>
                    <p className="text-[10px] text-kingfisher-muted italic mt-0.5">Forces Lumen to use low-cost Software SDF tracking, saving high-end hardware Ray Tracing budgets.</p>
                  </div>
                  <div>
                    <span className="text-white">r.Lumen.ScreenProbeGather.DownsampleFactor = 32</span>
                    <p className="text-[10px] text-kingfisher-muted italic mt-0.5">Reduces angular screen sampling densities. Bypasses high-resolution tracing but lowers visual accuracy.</p>
                  </div>
                  <div>
                    <span className="text-white">r.RayTracing.Nanite.Mode = 0</span>
                    <p className="text-[10px] text-kingfisher-muted italic mt-0.5">Restricts Ray Tracing checks to Nanite fallback proxy models instead of actual millions-of-polygons meshes.</p>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
};

// SVG Spot Light Icon Helper
const SpotLightIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2v2M5 5l1.5 1.5M19 5L17.5 6.5M12 22v-6M10 16h4M12 8a4 4 0 1 0 0 8 4 4 0 1 0 0-8z" />
  </svg>
);

// High-precision source-code strings
const cppCodeString = `
// ─── C++ SHADER PARAMETERS REGISTRATION REGISTER (Render Dependency Graph RDG)
#include "RendererPrivate.h"
#include "RenderGraphUtils.h"
#include "ShaderParameterMacros.h"

// Define the parameter structure mapping C++ fields straight to HLSL GPU nodes
BEGIN_SHADER_PARAMETER_STRUCT(FRadianceCascadeParameters, RENDERER_API)
    SHADER_PARAMETER_RDG_TEXTURE(Texture2D, SceneDepthTexture)
    SHADER_PARAMETER_RDG_TEXTURE(Texture2D, SceneNormalTexture)
    SHADER_PARAMETER_RDG_TEXTURE(Texture2D, SourceRadianceTexture) // Interpolated inputs
    SHADER_PARAMETER_RDG_TEXTURE_UAV(Texture2D<float4>, OutputRadianceUAV)
    SHADER_PARAMETER(FVector4f, ViewRectDimensions)
    SHADER_PARAMETER(int32, TargetCascadeLevel)
    SHADER_PARAMETER(float, BaseSpatialIntervalRange)
END_SHADER_PARAMETER_STRUCT()

class FRadianceCascadeCS : public FGlobalShader
{
public:
    DECLARE_GLOBAL_SHADER(FRadianceCascadeCS);
    SHADER_USE_PARAMETER_STRUCT(FRadianceCascadeCS, FGlobalShader);
};
IMPLEMENT_GLOBAL_SHADER(FRadianceCascadeCS, "/Virtual/Project/RadianceCascade.usf", "MainCS", SF_Compute);

// Injector function called inside FDeferredShadingRenderer::Render() loop
void FDeferredShadingRenderer::InjectRadianceCascadePass(
    FRDGBuilder& GraphBuilder, 
    FViewInfo& View, 
    FRDGTextureRef OutputTexture)
{
    FRadianceCascadeParameters* PassParams = GraphBuilder.AllocParameters<FRadianceCascadeParameters>();
    
    // Wire up G-Buffer buffers safely
    PassParams->SceneDepthTexture = SceneTextures.SceneDepthTexture;
    PassParams->SceneNormalTexture = SceneTextures.GBufferA; // GBufferA houses Normals
    PassParams->SourceRadianceTexture = View.PrevFrameRadianceCache; 
    PassParams->OutputRadianceUAV = GraphBuilder.CreateUAV(OutputTexture);
    
    PassParams->ViewRectDimensions = FVector4f(View.ViewRect.Width(), View.ViewRect.Height(), 0, 0);
    PassParams->TargetCascadeLevel = 2; // Medium background sweep
    PassParams->BaseSpatialIntervalRange = 4.0f; // 4 pixels base scale

    TShaderMapRef<FRadianceCascadeCS> ComputeShader(View.ShaderMap);
    FIntPoint GroupCount = FIntPoint::DivideAndRoundUp(View.ViewRect.Size(), FIntPoint(16, 16));

    GraphBuilder.AddPass(
        RDG_EVENT_NAME("RadianceCascades_MergeSweep"),
        PassParams,
        ERDGPassFlags::Compute,
        [ComputeShader, PassParams, GroupCount](FRDGIComputeShaderRegistry& RHICmdList)
        {
            FComputeShaderUtils::Dispatch(RHICmdList, ComputeShader, *PassParams, FIntVector(GroupCount.X, GroupCount.Y, 1));
        }
    );
}
`;

const hlslCodeString = `
// ─── HLSL COMPUTE SHADER IMPLEMENTATION (RadianceCascade.usf)
#include "/Engine/Public/Platform.ush"

Texture2D<float> SceneDepthTexture;
Texture2D<float4> SceneNormalTexture;
Texture2D<float4> SourceRadianceTexture; // Lower resolution parent cascade
RWTexture2D<float4> OutputRadianceUAV;

float4 ViewRectDimensions;
int TargetCascadeLevel;
float BaseSpatialIntervalRange;

static const float PI_CONST = 3.14159265;

[numthreads(16, 16, 1)]
void MainCS(uint3 ThreadId : SV_DispatchThreadID)
{
    uint2 PixelCoord = ThreadId.xy;
    if (PixelCoord.x >= (uint)ViewRectDimensions.x || PixelCoord.y >= (uint)ViewRectDimensions.y)
    {
        return;
    }

    float2 UV = PixelCoord / ViewRectDimensions.xy;
    float SampledDepth = SceneDepthTexture.Load(int3(PixelCoord, 0)).r;
    float3 PixelNormal = SceneNormalTexture.Load(int3(PixelCoord, 0)).xyz;

    // Calculate hierarchical cascade settings
    // Spaced intervals grow at 2^C, angular rays density at 4^C
    int RayCount = uint(pow(4, TargetCascadeLevel + 1));
    float MinRayDistance = BaseSpatialIntervalRange * pow(2, TargetCascadeLevel);
    float MaxRayDistance = BaseSpatialIntervalRange * pow(2, TargetCascadeLevel + 1);

    float4 AccumulatedColor = float4(0, 0, 0, 0);

    for (int RayIdx = 0; RayIdx < RayCount; ++RayIdx)
    {
        float RayAngle = (float(RayIdx) / float(RayCount)) * 2.0 * PI_CONST;
        float2 RayVector = float2(cos(RayAngle), sin(RayAngle));

        float3 CascadeLightContribution = float3(0, 0, 0);
        float RaySegmentStepsCount = 8.0;
        float IntegrationStepSize = (MaxRayDistance - MinRayDistance) / RaySegmentStepsCount;

        // Perform fast screen-space raymarching over the specified cascade interval
        for (int StepIdx = 0; StepIdx < 8; ++StepIdx)
        {
            float CurrentTravelDist = MinRayDistance + (float(StepIdx) * IntegrationStepSize);
            uint2 CheckPixelLocation = PixelCoord + uint2(RayVector * CurrentTravelDist);

            float CurrentStepDepth = SceneDepthTexture.Load(int3(CheckPixelLocation, 0)).r;
            
            // Check for physical occlusion intersections inside tight margin gaps
            if (CurrentStepDepth < SampledDepth && (SampledDepth - CurrentStepDepth) < 0.008)
            {
                // Solid surface intersection detected! Apply local color.
                CascadeLightContribution = float3(1.0f, 0.45f, 0.15f); // Searing orange campfire emissive placeholder
                break;
            }
        }

        // Interpolate parent far-field dataset to prevent ringing or leaking
        uint2 ParentProbeGridCoord = PixelCoord / 2; // Parent level sweeps at half spatial density
        float4 ParentCascadeDataset = SourceRadianceTexture.Load(int3(ParentProbeGridCoord, 0));

        // Merge high-frequency near-field ray results with the smooth pre-integrated far-field
        AccumulatedColor.rgb += CascadeLightContribution + (ParentCascadeDataset.rgb / float(RayCount));
    }

    AccumulatedColor.a = 1.0f;
    OutputRadianceUAV[PixelCoord] = AccumulatedColor;
}
`;
