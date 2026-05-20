
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const FastArrayTab = () => (
  <div className="space-y-6">
    <PageHeader title="Fast Array Serializers" subtitle="Delta-synced FFastArraySerializer logic for inventory grids." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Delta-compression algorithms identifying modified sequence bits.</p>
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="The Problem with TArray Replication" icon={Database} color={COLORS.status.error}>
        <p className="text-sm mb-3">Standard `TArray` replication forces the engine to hash the <strong>entire</strong> array whenever elements change. If your MMO player has 200 inventory slots and picks up 1 item, Unreal serializes all 200 slots.</p>
      </SectionCard>
      <SectionCard title="FFastArraySerializer Solution" icon={Layers} color={COLORS.status.success}>
        <p className="text-sm mb-3">Implements delta compression for array items.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li>Each item inherits `FFastArraySerializerItem` which contains a unique `ReplicationID`.</li>
          <li><strong>Delta Updates:</strong> Only the single changed, added, or removed struct is sent over the network.</li>
          <li>Essential for Inventories, Status Effect lists, and buff stacks exceeding 10 items.</li>
        </ul>
      </SectionCard>
    </div>
  </div>
);
