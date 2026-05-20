
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const PostProcessTab = () => (
  <div className="space-y-6">
    <PageHeader title="Post-Process & Temporal Upscaling" subtitle="Everything that runs after the 3D scene is rendered — applied once per screen pixel — must be budgeted carefully." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Temporal Anti-Aliasing (TAA) algorithms relying on motion vectors and previous frame reprojection.</p>
    </HighlightBox>
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

    <SectionCard title="Post-Process & Temporal Upscaling Hardware Impact" icon={Monitor} color={COLORS.kingfisher.blue}>
      <p className="text-sm text-kingfisher-muted mb-4 font-medium italic">Detailed hardware performance impact of post-processing filters & downsampling:</p>
      <MultiplayerImpact 
        gpu="High (~3.2ms at 1080p, up to 12.0ms at native 4K without upscaling)" 
        cpu="Low (0.1ms Render Thread dispatch queues)" 
        ram="~22MB (Backbuffers & Accumulation History frame targets)" 
        latency="+1.5ms to +3.5ms (Inherent latency added for frame scaling math)" 
      />
      <FeatureMatrix 
        has={[
          "Temporal Super Resolution (TSR) with sub-pixel history accumulation",
          "Post Process Volume zones with custom transitional blend offsets",
          "Direct G-Buffer reprojection & velocity-vector tracking nodes"
        ]}
        missing={[
          "Out-of-the-box dynamic upscaler preset transitions based on user thermal/battery thresholds on mobile (Requires manual triggering in C++)"
        ]}
        howToUse="Map target frame rates natively. Scale down the Render Resolution Percentage to 67% (or 50% on low-end units) when the console variables report a GPU execution hitch beyond 13.5ms."
      />
    </SectionCard>
  </div>
);
