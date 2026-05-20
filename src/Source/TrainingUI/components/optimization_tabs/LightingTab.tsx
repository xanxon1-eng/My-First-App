
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const LightingTab = () => (
  <div className="space-y-6">
    <PageHeader title="Light & Shadows Masterclass" subtitle="Delivering Lumen GI natively without catastrophic millisecond deficits." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Software Raytracing algorithms (Lumen) using Signed Distance Fields (SDFs) and Voxel cone tracing.</p>
    </HighlightBox>
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

    <SectionCard title="Lumen & VSM Shadow Hardware Impact Masterclass" icon={Monitor} color={COLORS.kingfisher.blue}>
      <p className="text-sm text-kingfisher-muted mb-4 font-medium italic">Detailed analysis of how Lumen and Virtual Shadow Maps burden hardware budgets:</p>
      <MultiplayerImpact 
        gpu="Critical (5.2ms - 12.0ms on high-end, 18ms+ if uncached)" 
        cpu="Medium (1.5ms Game/Render thread coordination, cache invalidation tracing)" 
        ram="~45MB (Lumen Card representations and G-Buffer tracking)" 
        latency="0ms (Pure local visual cost)" 
      />
      <FeatureMatrix 
        has={[
          "Lumen Real-Time Software Ray Tracing (using Signed Distance Fields)",
          "Virtual Shadow Maps with hierarchical page culling & cached pages",
          "Distance Field Ambient Occlusion and cached shadow volumes"
        ]}
        missing={[
          "Out-of-the-box non-invalidating sways (wind material offsets always invalidate VSM caches unless specialized distance controls are added)",
          "Automated dynamic shadow cascade adjustment based on real-time target platform categories"
        ]}
        howToUse="Throttle or freeze vertex animation shaders on distant foliage (beyond 45m) to ensure shadow maps remain perfectly cached, immediately reclaiming up to 4.5ms GPU cycles."
      />
    </SectionCard>
  </div>
);
