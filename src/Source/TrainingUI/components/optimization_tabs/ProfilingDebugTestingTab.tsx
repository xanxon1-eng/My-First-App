
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const ProfilingDebugTestingTab = () => (
  <div className="space-y-6">
    <PageHeader title="Debug & Test Tools" subtitle="Algorithmic test pipelines and built-in engine tools for logical verification." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Visual Logger (VisLog)" icon={Terminal} color={COLORS.status.info}>
        <p className="text-sm mb-2">Record historical game states for visual playback. Uses spatial sampling algorithms to map AI decision paths.</p>
        <div className="p-3 bg-black/20 rounded border border-blue-500/10 text-xs mb-3">
          <strong className="text-blue-400 block mb-1">RPG Debug Use-Case:</strong>
          <p className="text-kingfisher-muted text-xs leading-normal">Perfect for tracking Witcher 3-style city crowd route choices or Baldur's Gate-style tactical grid AI decisions. Records sensory sight spheres, path lines, and state weights on an interactive timeline.</p>
        </div>
        <MultiplayerImpact 
          gpu="0.0ms (Disabled on final GPU pipeline)" 
          cpu="+1.2ms CPU recording cost (Exclude entirely from your shipping build configuration)" 
          ram="+110MB System RAM (Caches historical world snapshots for debug reviewing)" 
          vram="0.0ms" 
          latency="0.0ms" 
        />
        <FeatureMatrix 
          has={["AI Pathfinding Vector Logs", "Combat Target & Sight Area drawings", "Interactive scrubbing timeline UI"]}
          missing={["Real-time client-to-server visual syncing", "Automatic pathing block repair advice"]}
          howToUse="Type 'VisLog' in the console during play. Choose your character actor from the list to view its decision history."
        />
      </SectionCard>

      <SectionCard title="Gameplay Debugger Tool (GDT)" icon={Activity} color={COLORS.kingfisher.warm}>
        <p className="text-sm mb-2">Real-time overlay showing actor properties directly above their heads in the 3D viewport.</p>
        <p className="text-xs text-kingfisher-muted mb-3">Indispensable for testing Path of Exile-style active buffs, aggro ranges, and AI state machine weights directly on simulated game targets.</p>
        <div className="p-2 bg-black/25 rounded border border-kingfisher-border/20 text-[10px] font-mono mb-4 text-blue-300">
          gdt.ToggleCategory BehaviourTree / gdt.ToggleCategory EqS
        </div>
        <MultiplayerImpact 
          gpu="0ms" 
          cpu="+0.8ms CPU draw cost on Viewport" 
          ram="+5MB (Negligible)" 
          vram="0ms" 
          latency="0ms" 
        />
      </SectionCard>
    </div>
  </div>
);
