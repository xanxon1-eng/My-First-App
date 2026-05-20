
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const AssetManagerTab = () => (
  <div className="space-y-6">
    <PageHeader title="Asset Manager Chunk & Async Loading" subtitle="Explicit Asset Manager Primary/Secondary Chunk distribution." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Algorithmic garbage identification and dependency walking (Graph Traversal).</p>
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="The Asset Manager Singleton" icon={Database} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">Centralized asynchronous loading of assets replacing fragmented manual SoftPointers scattered in Blueprints.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li><strong>Primary Asset IDs:</strong> Give weapons, characters, or maps universal tag IDs (e.g. `Weapon:AssaultRifle`).</li>
          <li><strong>StreamableManager:</strong> Handles RAM caching securely. Prevents assets from constantly getting memory flushed and re-loaded abruptly.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Chunking for Deployment" icon={HardDrive} color={COLORS.kingfisher.warm}>
        <p className="text-sm mb-3">For games shipped via Steam or mobile stores, do not put all 50GB into a single `.pak` file.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li>Assign Asset Manager Primary Data to specific <strong>Chunks</strong> (0 = core, 1 = desert map, 2 = snow map).</li>
          <li>Allows players to download updates in small patches, or load only Map 1 into RAM, completely skipping data for Map 2.</li>
        </ul>
      </SectionCard>
    </div>
  </div>
);
