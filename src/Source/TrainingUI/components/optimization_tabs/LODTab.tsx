
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const LODTab = () => (
  <div className="space-y-6">
    <PageHeader title="LOD Systems" subtitle="Level of Detail reduces geometry complexity as objects move farther from the camera." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Screen-space error metric algorithms (HLODs) to compute triangle reduction thresholds.</p>
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="ROI Analysis" icon={Triangle} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">LODs are the main defense against GPU oversubscription on Android devices.</p>
        <MultiplayerImpact 
          gpu="Critical (Fillrate)" 
          cpu="Medium (Mesh Swapping)" 
          ram="+25% (per LOD mesh)" 
          latency="+0.1ms Swap Hitch" 
        />
        <FeatureMatrix 
          has={[
            "Auto-LOD Generation",
            "Skeletal Mesh LODs",
            "Screen-Size thresholds"
          ]}
          missing={[
            "Real-time vertex-density metrics",
            "Mobile-specific LOD biasing UI",
            "Dynamic LOD based on Ping"
          ]}
          howToUse="Set `r.StaticMeshLODDistanceScale` to 2.0 on mobile to force lower LODs sooner."
        />
      </SectionCard>
      
      <SectionCard title="Skeletal Mesh LOD — Characters" icon={Activity} color={COLORS.status.success}>
        <p className="text-sm mb-3">Characters deform every bone each frame. LODs remove bones at distance.</p>
        <div className="bg-black/20 p-3 rounded border border-white/5 text-xs">
          <StatRow label="LOD 0 (Hero)" value="~50k Tris" color="text-emerald-400" />
          <StatRow label="LOD 2 (Crowd)" value="~2k Tris" color="text-amber-400" />
          <p className="mt-2 text-kingfisher-muted italic">Saves ~1.5ms Game Thread time per 10 characters.</p>
        </div>
      </SectionCard>
    </div>
  </div>
);
