
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const GeometryTab = () => (
  <div className="space-y-6">
    <PageHeader title="GPU Geometry & Nanite" subtitle="Managing high polycount meshes, World Position Offset, and staying within budget while targeting 60 FPS." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Nanite's algorithmic graph clustering (METIS) and DAG simplifications for pixel-scale geometry.</p>
    </HighlightBox>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Nanite Virtual Geometry" icon={Box} color={COLORS.kingfisher.blue}>
        <p className="text-sm text-kingfisher-muted mb-3">Nanite virtualizes geometry, streaming micro-triangles from SSD to VRAM.</p>
        <MultiplayerImpact 
          gpu="High (Vertex Clusters)" 
          cpu="Low (Culling Overruled)" 
          ram="+350MB VRAM Pool" 
          latency="+0.2ms Draw Handoff" 
        />
        <FeatureMatrix 
          has={[
            "Micro-Triangle Rasterization",
            "Depth pre-pass optimization",
            "Automatic Mesh Clustering"
          ]}
          missing={[
            "Translucency / Blend support",
            "Mobile Hardware Raytracing",
            "Low-end Android compatibility"
          ]}
          howToUse="Enable `Nanite` on large environmental assets to eliminate LOD management work entirely on PC."
        />
      </SectionCard>

      <SectionCard title="Nanite Limitations & Costs" icon={Activity} color={COLORS.status.warning}>
        <p className="text-sm text-kingfisher-muted mb-3">Nanite is not a magic bullet. Beware of these performance killers:</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li><strong className="text-amber-400">Masked Materials:</strong> Alpha testing adds <span className="font-mono text-xs">2.5ms+</span> in dense forests.</li>
          <li><strong className="text-amber-400">World Position Offset:</strong> Swaying grass can cost <span className="font-mono text-xs">3.0–6.0ms</span> at scale.</li>
        </ul>
        <HighlightBox type="success" className="mt-4 text-xs">
          <strong>Mobile Fix:</strong> Disable Nanite on mobile and use standard LODs + HISM. Budget <span className="text-amber-400">&lt; 1M Triangles</span> per frame.
        </HighlightBox>
      </SectionCard>
    </div>
  </div>
);
