
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const DebugOverlaysTab = () => (
  <div className="space-y-6">
    <PageHeader title="Deep Visual Debug Overlays" subtitle="In-game drawing overlays corresponding to Bitmask states or AI NavMesh traces." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Algorithmic heatmap generation tracing execution frequency across level sectors.</p>
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="DrawDebugHelpers" icon={EyeOff} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">Visualize AI logic and Bitmask states instantly without entering blueprints.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li>Use <code className="text-white">DrawDebugSphere()</code> and <code className="text-white">DrawDebugLine()</code>.</li>
          <li>Only execute code inside <code className="text-white">#if !UE_BUILD_SHIPPING</code> blocks to ensure zero cost in the final game.</li>
          <li>Map specific colors to Bitmask states (e.g. Red for attacking, Green for idle).</li>
        </ul>
      </SectionCard>
      <SectionCard title="Implementation Example" icon={Terminal} color={COLORS.kingfisher.warm}>
        <p className="text-sm mb-3">Drawing a NavMesh Path:</p>
        <div className="p-3 bg-black/40 rounded border border-kingfisher-border/30 font-mono text-xs text-kingfisher-surface overflow-x-auto whitespace-pre">
{`#if !UE_BUILD_SHIPPING
for (int i = 0; i < Path->PathPoints.Num() - 1; i++) {
    DrawDebugLine(
        GetWorld(), 
        Path->PathPoints[i], 
        Path->PathPoints[i + 1], 
        FColor::Green, 
        false, 0.1f, 0, 5.0f
    );
}
#endif`}
        </div>
      </SectionCard>
    </div>
  </div>
);
