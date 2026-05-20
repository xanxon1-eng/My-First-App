
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const UIUMGTab = () => (
  <div className="space-y-6">
    <PageHeader title="UI & UMG Optimization" subtitle="Migrating to push-based delegates to alleviate Game Thread frame tick overhead." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Retained-mode UI diffing algorithms (similar to React's Virtual DOM) to minimize slate redraws.</p>
    </HighlightBox>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Slate/UMG Constraints" icon={Activity} color={COLORS.status.success}>
        <p className="mb-2 text-sm">Every visible UI element ticks. Fifty bound widgets consume 3ms+ of Game Thread time.</p>
        <MultiplayerImpact 
          gpu="Low (Overdraw)" 
          cpu="High (Tick/Layout)" 
          ram="+100MB (Atlasing)" 
          latency="+16ms Input Lag" 
        />
        <FeatureMatrix 
          has={[
            "Invalidation Boxes",
            "Retainer Boxes",
            "Slate Pre-Pass culling"
          ]}
          missing={[
            "Native Dynamic Font Batching",
            "Automated UI Overdraw Viewmode",
            "Replication-aware Widget lifecycle"
          ]}
          howToUse="Wrap complicated inventory screens in `InvalidationBox` to cache geometry and skip layout calculations."
        />
      </SectionCard>

      <SectionCard title="Mobile UI Best Practices" icon={Smartphone} color={COLORS.kingfisher.warm}>
        <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted">
          <li><strong>Touch Targets:</strong> Minimum <span className="text-white">44x44px</span> for all buttons.</li>
          <li><strong>Text Clarity:</strong> Use high-contrast dropshadows for mobile outdoors legibility.</li>
          <li><strong>Optimization:</strong> Use <strong>UserInterface2D</strong> compression to avoid BC texture artifacts on Android.</li>
        </ul>
      </SectionCard>
    </div>
  </div>
);
