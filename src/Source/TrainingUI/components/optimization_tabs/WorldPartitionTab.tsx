
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const WorldPartitionTab = () => (
  <div className="space-y-6">
    <PageHeader title="World Partition Sub-Relevancy" subtitle="Aggressive culling of network updates across massive open-world grid cells." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Spatial Hash algorithms and Quadtree data structures for localized actor streaming.</p>
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Spatial Grid Hashing" icon={Map} color={COLORS.status.success}>
        <p className="text-sm mb-3">
          Standard replication checks every actor against every client connection (O(N*M) scaling problem).
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li><strong>Replication Graph / World Partition:</strong> Divides the world into static grid cells.</li>
          <li><strong>Grid Subscriptions:</strong> A client only "subscribes" to the network channel of the grid cell they are standing in, and immediate neighbors.</li>
          <li><strong>Server CPU Savings:</strong> The server doesn't even evaluate replication relevancy for actors in distant cells.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Dynamic Relevancy Distance" icon={Eye} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">Adapt relevancy radii dynamically based on actor type.</p>
        <div className="space-y-2 text-sm mt-3">
          <div className="bg-black/20 p-2 rounded border border-kingfisher-border/30">
            <strong className="text-emerald-400 block">Distant Relevancy (Sniper Bullet)</strong>
            <span className="text-kingfisher-muted text-xs">Forced to be relevant further away due to extremely high velocity.</span>
          </div>
          <div className="bg-black/20 p-2 rounded border border-kingfisher-border/30">
            <strong className="text-amber-400 block">Short Relevancy (Dropped Item)</strong>
            <span className="text-kingfisher-muted text-xs">Dropped loot only replicates if players are within a 10-meter radius, masking server load.</span>
          </div>
        </div>
      </SectionCard>
    </div>
  </div>
);
