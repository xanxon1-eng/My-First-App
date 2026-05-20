
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const GCClusteringTab = () => (
  <div className="space-y-6">
    <PageHeader title="Garbage Collection Object Clustering" subtitle="Group thousands of related data assets into single reference checks, skipping deep sweeps." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Tri-color marking algorithms optimized by clustering reachability graphs.</p>
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Cluster Hierarchies" icon={Layers} color={COLORS.status.warning}>
        <p className="text-sm mb-3">When the GC runs, it follows pointer chains to see what is still alive.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li><strong>Deep Chains:</strong> Checking an actor with 100 sub-components takes real CPU time.</li>
          <li><strong>FGCCluster:</strong> Mark a group of objects as a single cluster. The GC only checks the ROOT of the cluster. If the root is alive, it assumes all 100 components are alive instantly, bypassing the chain.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Implementation Use Case" icon={Code} color={COLORS.status.success}>
        <p className="text-sm text-kingfisher-muted mb-3">
          Extremely useful for thousands of passive UObjects, DataAssets, or large hierarchy arrays loaded via the Asset Manager.
        </p>
        <p className="text-sm text-kingfisher-muted">
          Use the `bCanHaveBindings` flag carefully — only static, non-blueprint-event-bound objects should be heavily clustered into a proxy root.
        </p>
      </SectionCard>
    </div>
  </div>
);
