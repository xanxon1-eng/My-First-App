
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const GICachingTab = () => (
  <div className="space-y-6">
    <PageHeader title="Global Dynamic GI Caching" subtitle="Offline probe grids combined with runtime irradiance caching to bypass Lumen hardware raytracing costs." />
    
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Irradiance Volume Sampling using Spherical Harmonics baked offline inside Lightmass grids.</p>
    </HighlightBox>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Viability: Solo Dev vs AAA" icon={Waves} color={COLORS.kingfisher.blue}>
        <p className="text-sm text-kingfisher-muted mb-3">For open world RPGs (Witcher 3, BG3), dynamic time-of-day is standard. However, hardware Lumen raytracing takes ~4.5ms to 6.0ms on GPUs. For solo devs, baking offline GI means losing true dynamic Sun cycles, but guarantees 60 FPS on mid-range hardware.</p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-4">
          <li><strong>AAA Studios:</strong> Dedicate entire teams to blend Hardware Raytracing with cached probes for low-end scalable modes.</li>
          <li><strong>Solo / Indie:</strong> Can achieve 60FPS on older GPUs by fully disabling Lumen and relying entirely on rich Baked GI and reflection capture probes, but the day/night cycle must be faked or limited.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Pros vs Cons" icon={Activity} color={COLORS.status.warning}>
        <div className="bg-black/20 p-3 rounded text-xs">
          <strong className="text-emerald-400 block mb-1">Pros:</strong>
          <ul className="list-disc pl-4 space-y-1 mb-3 text-emerald-100/70">
            <li>Massive GPU cost reduction (-6.0ms).</li>
            <li>Eliminates visual noise/smearing on moving objects in shaded areas.</li>
            <li>No heavy BVH (Bounding Volume Hierarchy) CPU update costs.</li>
          </ul>
          <strong className="text-red-400 block mb-1">Cons:</strong>
          <ul className="list-disc pl-4 space-y-1 text-red-100/70">
            <li>Day/Night sun angle completely invalidates baked GI bounces.</li>
            <li>Destructible buildings / walls geometry cannot block baked light dynamically.</li>
            <li>Skybox and volumetric clouds don't dynamically alter indirect lighting color.</li>
          </ul>
        </div>
      </SectionCard>
    </div>

    <SectionCard title="Hardware Architecture Impact" icon={HardDrive} color={COLORS.kingfisher.warm}>
      <MultiplayerImpact 
        gpu="-6.0ms (Completely bypasses Lumen Hardware Raytracing / Screen Traces)" 
        cpu="+0.2ms (Game Thread must interpolate and fetch spherical harmonic probes for dynamic actors moving between grid cells)" 
        ram="+65MB (System heap required to hold static irradiance vectors loaded from disk)" 
        vram="+120MB (VRAM allocation to store baked spherical harmonic textures and sparse volume maps)" 
        latency="-1.0ms to -2.5ms (Smoother frame pacing; lower GPU execution times lower overall input-to-display latency)" 
      />
      <FeatureMatrix 
        has={[
          "CPU/GPU Lightmass static baking natively built-in for rigid offline environments.",
          "Precomputed Visibility Volumes for localized static bounds occlusions.",
          "Volumetric Lightmap probe placement algorithms (places denser probes near surfaces)."
        ]}
        missing={[
          "Dynamic day/night cycle integrations over pre-baked grids (custom probe blending algorithms must be authored in C++).",
          "Seamless out-of-the-box blending between Lumen high-end profiles and pre-cached irradiance fallbacks without hitches."
        ]}
        howToUse="Disable Lumen in Project Settings. Place a Lightmass Importance Volume over your playable area to restrict bake times. Build Lighting (CPU/GPU) to bake indirect lighting bounces onto a sparse Volumetric Lightmap. Ensure dynamic characters are set to sample lighting from interpolation probes at runtime."
      />
    </SectionCard>
  </div>
);
