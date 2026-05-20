
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const ArchitectureTab = () => (
  <div className="space-y-6">
    <PageHeader title="CPU & RAM Memory Architecture" subtitle="Eliminating traversal stutters, memory leaks, garbage collection sweeps, and cache misses." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Event-based pub/sub routing algorithms instead of O(N) tick polling.</p>
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="The Golden Rule: Ban Event Tick" icon={Clock} color={COLORS.kingfisher.warm}>
        <p className="font-semibold text-white">Event-Driven Architecture Only</p>
        <p className="mt-2 text-sm">Ban Event Tick on 99% of classes. Turn off <code>Start with Tick Enabled</code>. CPU is almost always the bottleneck due to accumulated per-frame logic.</p>
        
        <MultiplayerImpact 
          gpu="+0.0ms Offset" 
          cpu="-3.5ms Savings" 
          ram="+0.5MB (Callbacks)" 
          latency="-12ms Jitter" 
        />

        <div className="mt-4 p-3 bg-black/30 rounded border border-purple-500/20">
          <strong className="text-purple-400 text-xs">Architecture Hub:</strong> Use decoupled Multi-Cast Delegates. Emit signals like <code>"ITEM_LOOTED"</code>.
        </div>
      </SectionCard>

      <SectionCard title="Garbage Collection & Object Clustering" icon={Database} color={COLORS.status.success}>
        <p className="font-semibold text-white">Never Destroy What You Can Recycle</p>
        <p className="mt-2 text-sm text-kingfisher-muted text-xs">Destroy triggers GC sweeps cause 2–5ms hitches. Use <code>FGCCluster</code> to group objects.</p>
        
        <div className="mt-3 p-3 bg-emerald-500/5 rounded border border-emerald-500/20">
          <strong className="text-emerald-400 text-xs">GC Clustering:</strong> Group 1000 items {'->'} 1 check. Saves 2.5ms background sweep time.
        </div>
      </SectionCard>
    </div>

    <SectionCard title="Multi-Platform & Mobile Memory Logic" icon={Smartphone} color={COLORS.kingfisher.blue}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-kingfisher-muted mb-4 leading-relaxed">
            On Android/Mobile, <strong>VRAM is shared RAM</strong>. Native UE overhead is ~350MB, but large textures and skeletal mesh LODs can blow budgets.
          </p>
          <MultiplayerImpact 
            gpu="High (Thermal Throttling)" 
            cpu="Medium (Wait on I/O)" 
            ram="< 1.5GB Total" 
            latency="+15ms Touch Delay" 
          />
        </div>
        <FeatureMatrix 
          has={[
            "Mobile Render Pass (Forward/Deffered)",
            "Texture Compression (ETC2/ASTC)",
            "Automatic Mesh LODing"
          ]}
          missing={[
            "Real-time GC Profiling on Device",
            "Auto-Resolution Thermal Scaling",
            "Predictive VRAM swapping"
          ]}
          howToUse="Set `r.Mobile.DisableVertexFog=1` and `r.Mobile.MaxMovableSpotLights=1` for stable Android performance."
        />
      </div>
    </SectionCard>
  </div>
);
