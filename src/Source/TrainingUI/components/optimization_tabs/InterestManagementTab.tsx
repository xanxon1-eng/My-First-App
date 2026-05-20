
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const InterestManagementTab = () => (
  <div className="space-y-6">
    <PageHeader title="Interest Management Culling" subtitle="Network Dormancy and spatial dependency for heavily clustered interactive actors." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Relevancy algorithms sorting actors by distance/visibility graph.</p>
    </HighlightBox>
    <HighlightBox type="success" className="mb-4">
      <strong>Network Dormancy:</strong> The ultimate server CPU saver. If an actor's state isn't changing, the network subsystem shouldn't even check it. This is not optional for MMO-scale player counts.
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="DORM_Initial" icon={Clock} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">For actors like chests, doors, or dropped items. They spawn, replicate their initial state once to clients, and then go completely dormant.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li>They consume absolutely zero server CPU for replication checks while dormant.</li>
          <li>When a player opens the chest, call `FlushNetDormancy()` to temporarily wake it up, send the "Open" state, and put it back to sleep.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Dependent Actors" icon={Network} color={COLORS.status.info}>
        <p className="text-sm text-kingfisher-muted mb-3">
          If a weapon is attached to a player, you don't need the server to check relevancy for the weapon independently.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li>Set `bNetUseOwnerRelevancy = true`. If the player is relevant to a remote client, the weapon is automatically relevant. Saves hundreds of bounds-checks per frame.</li>
          <li>Weapons, projectiles, and particle effects spawned by characters must explicitly inherit relevancy from the instigator actor to prevent disjointed culling edge cases.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Role/Priority Scaling based on Distance" icon={Zap} color={COLORS.kingfisher.warm} className="col-span-1 md:col-span-2">
        <p className="text-sm mb-3">Not all relevant actors are equally critical to bandwidth.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-black/20 p-2 rounded border border-kingfisher-border/30">
            <strong className="text-emerald-400 block text-xs">Distance-Based Tick Rate</strong>
            <span className="text-kingfisher-muted text-xs">Players nearest to the camera are evaluated at 60Hz. Players 100m away are dropped to `NetUpdateFrequency = 5` (5Hz) dynamically, saving 90% bandwidth. Client-side interpolation catches the visual slack.</span>
          </div>
          <div className="bg-black/20 p-2 rounded border border-kingfisher-border/30">
            <strong className="text-amber-400 block text-xs">AlwaysRelevant vs NetCull</strong>
            <span className="text-kingfisher-muted text-xs">A player's OWN `PlayerState` and `PlayerController` are `bAlwaysRelevant` because their integrity is vital. Everything else relies on `NetCullDistanceSquared`.</span>
          </div>
          <div className="bg-black/20 p-2 rounded border border-kingfisher-border/30">
            <strong className="text-blue-400 block text-xs">Significance Manager</strong>
            <span className="text-kingfisher-muted text-xs">An external C++ subsystem that groups actors into buckets (critical, normal, background) based on camera view and distance, globally regulating tick rates and anim update frequencies.</span>
          </div>
        </div>
      </SectionCard>
    </div>
  </div>
);
