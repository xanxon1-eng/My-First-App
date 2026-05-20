
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const ProjectApplicationTab = () => (
  <div className="space-y-6">
    <PageHeader title="RPG Goals Application" subtitle="How all of these optimizations and systems combine to build an open world 3D RPG inspired by The Witcher 3, Path of Exile, and Baldur's Gate 3." />
    
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <Sword className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Your Project Foundation</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">This curriculum is not generic. The systems map exactly 1:1 to the technical hurdles of building dense fantasy worlds, massive crowd simulations, and synchronous multiplayer spell combat.</p>
    </HighlightBox>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Massive Open Worlds (Witcher 3)" icon={Map} color={COLORS.kingfisher.blue}>
        <p className="text-sm text-kingfisher-muted mb-3">To build Novigrad or the deep forests of Velen, you cannot load every actor. The architecture must heavily leverage:</p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-4">
          <li><strong>World Partition & Level Streaming:</strong> Culls 1.8GB RAM by unloading distant zones.</li>
          <li><strong>Global Dynamic GI Caching:</strong> Recovers up to 6.0ms of GPU rendering time, bypassing Lumen on lower end hardware so massive outdoor horizons render at 60 FPS.</li>
          <li><strong>Head Manager Pattern & Instancing:</strong> Keeps distant NPC ticks to zero and bundles trees into 1 draw call, saving ~7.0ms CPU.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Action / Top-Down Combat (Path of Exile)" icon={Activity} color={COLORS.status.warning}>
        <p className="text-sm text-kingfisher-muted mb-3">Spamming 100+ spells per second requires an engine that never hitches. The core features handling this are:</p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-4">
          <li><strong>Spatial Hash Traces & Collision:</strong> Using O(1) grid checks instead of standard Sweeps drops Game Thread trace spikes from 8.8ms down to 0.9ms.</li>
          <li><strong>Asynchronous Threaded Physics:</strong> Ragdolling 50 enemies at once happens on a separate worker thread, taking 0ms on the main thread.</li>
          <li><strong>Network Prediction:</strong> Bypasses network latency (+60ms ping) locally so clicking an ability triggers visual feedback instantly.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Deep Subsystems & Save Persistence (Baldur's Gate 3)" icon={Database} color={COLORS.status.info}>
        <p className="text-sm text-kingfisher-muted mb-3">Managing thousands of persistent chests, dynamic dialogues, and deeply stacked turn-based rules.</p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-4">
          <li><strong>Decoupled Backend Serialization:</strong> Saving massive states with a C++ async task avoids freezing the local Game Thread by 300ms.</li>
          <li><strong>Subsystems & Multicast Delegates:</strong> Items in chests sleep at 0Hz. They only update via event delegates when opened, skipping polling checks completely.</li>
          <li><strong>GC Clustered Reference Sweeping:</strong> Bypassing Garbage Collection for static world assets ensures that when loading large map interiors, the game doesn't stutter heavily.</li>
        </ul>
      </SectionCard>
      
      <SectionCard title="Optimization is not optional" icon={Activity} color={COLORS.status.success}>
        <p className="text-sm text-kingfisher-muted mb-3">By default, Unreal Engine is configured for small, highly-detailed cinematic arenas or Fortnite levels. For an expansive RPG, it natively wastes over 20-30ms combined CPU/GPU time ticking objects you can't even see.</p>
        <p className="text-sm text-kingfisher-muted mb-3">Applying these 47 topics fundamentally shifts your game from an unplayable 20 FPS prototype that crashes after 1 hour, to a solid, stable 60 FPS commercial product that can handle 10,000+ entities simultaneously via Task Graph and Mass.</p>
      </SectionCard>
    </div>
  </div>
);
