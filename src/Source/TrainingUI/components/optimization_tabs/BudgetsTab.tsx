
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const BudgetsTab = () => (
  <div className="space-y-6">
    <PageHeader title="Hardware Budgets" subtitle="Concrete benchmarks ensuring strict memory scaling checks." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Critical path analysis algorithms finding standard deviations in hardware timings.</p>
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Frame Time" icon={Clock} color={COLORS.kingfisher.blue}>
        <div className="space-y-2">
          <StatRow label="60 FPS Target" value="16.67ms" color="text-emerald-400" />
          <StatRow label="30 FPS Target (Mobile)" value="33.33ms" color="text-amber-400" />
          <p className="text-xs text-kingfisher-muted mt-2 italic">If you exceed 33ms, input lag on mobile becomes unbearable.</p>
        </div>
      </SectionCard>
      
      <SectionCard title="Memory Budget" icon={Database} color={COLORS.kingfisher.warm}>
        <div className="space-y-2">
          <StatRow label="Mobile (Android/iOS)" value="~3GB Total" color="text-red-400" />
          <StatRow label="Console (PS5)" value="~16GB Total" color="text-emerald-400" />
        </div>
      </SectionCard>
    </div>
  </div>
);
