
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const MaterialsTab = () => (
  <div className="space-y-6">
    <PageHeader title="Materials & Shaders" subtitle="Materials compile to GPU shaders. Every instruction, every branch, and every texture sample has a measurable cost per pixel per frame." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Deferred shading algorithms evaluating G-Buffer permutations to minimize instruction counts.</p>
    </HighlightBox>
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

    <SectionCard title="Material & Shader Hardware Impact Masterclass" icon={Monitor} color={COLORS.kingfisher.blue}>
      <p className="text-sm text-kingfisher-muted mb-4 font-medium italic">Concrete hardware impacts of G-Buffer writes, instruction bounds, and rendering threads:</p>
      <MultiplayerImpact 
        gpu="Critical (3.5ms - 7.5ms per frame on Base Pass)" 
        cpu="Low (0.2ms overhead unless dynamic instancing switches run on Tick)" 
        ram="~12MB heap allocations for tracking compiled materials" 
        latency="0ms (Local visual cost)" 
      />
      <FeatureMatrix 
        has={[
          "Material Instances (both Static parameters and Dynamic runtimes)",
          "Fully integrated Material Graph compiler with dynamic G-Buffer hooks",
          "Dithered Temporal Antialiasing transparency nodes"
        ]}
        missing={[
          "Automated dynamic material layer blending (compiles cumulative layers together)",
          "Real-time unused shader parameter registry stripping (unused parameters remain cached)",
          "Built-in overdraw throttle constraints for translucent systems"
        ]}
        howToUse="Enforce the use of Material Instance Constants everywhere. Use DitherTemporalAA node on foliage materials to completely bypass translucent overdraw."
      />
    </SectionCard>
  </div>
);
