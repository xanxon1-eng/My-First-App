
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const DeterministicSyncTab = () => (
  <div className="space-y-6">
    <PageHeader title="Deterministic Frame Sync" subtitle="Physics determinism established for tight lockstep syncing and advanced rollback Netcode." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Fixed-Point arithmetic emulation algorithms replacing floating-point drift.</p>
    </HighlightBox>
    <HighlightBox type="warning" className="mb-4">
      <strong>Determinism Warning:</strong> Standard float math and physics in UE5 are NOT naturally deterministic across different hardware/compilers. You must enforce it manually.
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Fixed Timestep Logic" icon={Clock} color={COLORS.status.info}>
        <p className="text-sm mb-3">To stay synced, the simulation must advance by identical micro-deltas on all clients.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li><strong>Decouple from Render:</strong> Simulation ticks at 60Hz fixed, while rendering might run at 144Hz with extrapolation.</li>
          <li><strong>Math Libraries:</strong> Use fixed-point math (`int64` representing decimals) instead of IEEE floats to guarantee identical results on AMD vs Intel CPUs.</li>
          <li><strong>Random Seeds:</strong> Action logic needing randomness must use synchronized explicit RNG seed instances on both ends rather than `FMath::FRand()`.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Rollback & Reconciliation" icon={Activity} color={COLORS.status.warning}>
        <p className="text-sm text-kingfisher-muted mb-3">
          If a client receives a state from the server that contradicts their local prediction (e.g. they got stunned mid-swing), they must perform Reconciliation.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li><strong>Snap and Discard:</strong> Snap the client entity back to the verified Server snapshot location.</li>
          <li><strong>Input Buffer:</strong> Retain all predictive inputs that occurred after the server's snapshot timestamp in an array buffer.</li>
          <li><strong>Fast-Forward:</strong> Resimulate all saved physical inputs over the new verified state in one giant jump, rendering the corrected path smoothly via visual interpolation to hide the rubber-banding snap.</li>
        </ul>
      </SectionCard>
    </div>
  </div>
);
