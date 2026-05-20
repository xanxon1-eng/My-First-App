
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const ScalabilityTab = () => (
  <div className="space-y-6">
    <PageHeader title="Scalability System" subtitle="Per-platform tuning, dynamic resolution scaling, and foliage detail optimizations for massive RPG areas." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Dynamic Resolution Scaling (DRS) using high-precision temporal estimation filters.</p>
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Performance Targets & Foliage Scaling" icon={Sliders} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">Define clear scalability groups for different hardware tiers to support different rendering loads:</p>
        <ul className="list-disc pl-5 mb-4 space-y-2 text-xs text-kingfisher-muted">
          <li><strong>Witcher 3-style Foliage:</strong> Setting <code>sg.FoliageQuality = 1</code> (Low) drops grass drawing density from 10,000 blades to 800 blades per square meter, reclaiming up to <span className="text-emerald-400">~4.2ms GPU time</span>.</li>
          <li><strong>Lower City Crowd Scaling:</strong> Link <code>sg.CharacterQueryLimit</code> directly with custom character pooling. Farther cosmetic NPCs are completely disabled when frame times exceed 16.6ms on target systems.</li>
          <li><strong>Path of Exile Magic Clutter:</strong> Limit active Niagara system burst particles on Low presets (caps sprite bursts to 100 max per flame burst).</li>
        </ul>
        <MultiplayerImpact 
          gpu="-6.2ms (Scaling shadow resolutions and foliage densities dynamically on mid-range hardware)" 
          cpu="-1.5ms (Disabling bone checks for distant crowd agents in dense areas)" 
          ram="Saves -850MB RAM (Halving texture mipmap pools via sg.TextureQuality configuration)" 
          vram="Saves -1.2GB VRAM (Lowering texture bias limits)"
          latency="-25ms system latency (Reduces frame queue bottlenecks at lower graphics tiers)" 
        />
        <FeatureMatrix 
          has={[
            "DefaultScalability.ini configuration presets (Epic, High, Medium, Low)",
            "Console variables (CVar groups) for automatic runtime graphics scaling",
            "TSR (Temporal Super Resolution) built-in upscaling variables"
          ]}
          missing={[
            "Automatic CPU core count benchmarking (requires custom C++ platform checks)",
            "Dynamic CVar interpolation (switching scalability presets causes visual pop/stutter instead of smooth blending)"
          ]}
          howToUse="Expose `sg.ShadowQuality` and `sg.FoliageQuality` within the user settings menu to allow players to reclaim 30-40% GPU time on mid-range PCs. On mobile/Steam Deck, force `sg.ViewDistanceQuality = 1` immediately to cull distant actors."
        />
      </SectionCard>

      <SectionCard title="Dynamic Resolution Setup" icon={TrendingDown} color={COLORS.status.success}>
        <p className="text-sm text-kingfisher-muted mb-3">Automatically drops internal rendering percentages (0.67x - 1.0x) to preserve the target FPS lock during spell explosions or sweeping landscapes.</p>
        <div className="p-3 bg-emerald-500/5 rounded border border-emerald-500/20 text-xs mb-4">
          <strong className="text-emerald-400 block mb-1">DRS Logic Scheme (60 FPS Lock):</strong>
          <p className="leading-relaxed">If frame time sits at &gt;16.67ms (or &gt;33.3ms on Steam Deck/consoles), the engine automatically scales TSR's rendering target down by 10% per frame until it stabilizes. If frame time falls below 14.2ms, resolution scales back up to maintain image sharpness.</p>
        </div>
        <p className="text-xs text-kingfisher-muted mb-3">Include this block inside your <code>DefaultEngine.ini</code> configuration file to enable native dynamic upsampling:</p>
        <CodeBlock code={`[SystemSettings]
r.DynamicRes.OperationMode=1
r.DynamicRes.MinScreenPercentage=67
r.DynamicRes.MaxScreenPercentage=100
r.DynamicRes.FrameTimeThreshold=16.67
r.DynamicRes.HistoryCount=30`} />
      </SectionCard>
    </div>
  </div>
);
