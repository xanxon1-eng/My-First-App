
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const TexturesTab = () => (
  <div className="space-y-6">
    <PageHeader title="Textures & Streaming" subtitle="Mip mapping, compression formats, and streaming pool tuning." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">MIP-mapping trilinear filtering and algorithmic texture streaming (Kraken compression algorithms).</p>
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Memory Constraints" icon={Image} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">Textures are the #1 reason for "Out of Memory" crashes on mobile.</p>
        <MultiplayerImpact 
          gpu="Medium (Memory Bus)" 
          cpu="Low (Streaming)" 
          ram="+800MB VRAM" 
          latency="+5ms Texture Pop" 
        />
        <FeatureMatrix 
          has={[
            "Texture Streaming Pool",
            "Virtual Textures (RVTs)",
            "BC7 / ASTC compression"
          ]}
          missing={[
            "Native per-platform Texture Swapping",
            "Automatic Texture Atlas Generator",
            "Real-time VRAM Budgeter"
          ]}
          howToUse="Set `r.Streaming.PoolSize` to 1000MB for mobile to prevent aggressive blurry mips."
        />
      </SectionCard>

      <SectionCard title="Virtual Texturing" icon={Layers} color={COLORS.status.success}>
        <p className="text-sm text-kingfisher-muted mb-3">RVTs allow you to bake complex landscape layers into a single runtime texture.</p>
        <div className="p-3 bg-emerald-500/5 rounded border border-emerald-500/20 text-xs">
          Landscape Layers: 10 {'->'} 1 RVT. Saves 9 texture lookups per pixel.
        </div>
      </SectionCard>
    </div>
    <SectionCard title="Texture Resolution Decision Chart" icon={Monitor} color={COLORS.kingfisher.warm}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <strong className="text-white block mb-2">Use 4K (4096×4096) for:</strong>
          <ul className="list-disc pl-5 space-y-1 text-kingfisher-muted">
            <li>Hero character skin / armor (up close always)</li>
            <li>Large architectural hero surfaces (cathedral walls, massive rocks)</li>
            <li>Landscape albedo / normal (already VT-paged)</li>
          </ul>
        </div>
        <div>
          <strong className="text-white block mb-2">Use 2K (2048×2048) for:</strong>
          <ul className="list-disc pl-5 space-y-1 text-kingfisher-muted">
            <li>Secondary character gear, weapons, vehicles</li>
            <li>Medium props (barrels, crates, tables)</li>
            <li>Most environment surfaces</li>
          </ul>
        </div>
        <div>
          <strong className="text-white block mb-2">Use 1K (1024×1024) for:</strong>
          <ul className="list-disc pl-5 space-y-1 text-kingfisher-muted">
            <li>Small props (cups, books, coins)</li>
            <li>LOD1+ replacement textures</li>
            <li>Trim sheets</li>
          </ul>
        </div>
        <div>
          <strong className="text-white block mb-2">Use 512 or smaller for:</strong>
          <ul className="list-disc pl-5 space-y-1 text-kingfisher-muted">
            <li>Particles and VFX sprites</li>
            <li>UI icons (use 256 max)</li>
            <li>Distant LOD3+ meshes</li>
          </ul>
        </div>
      </div>
    </SectionCard>
  </div>
);
