
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const BoidsFlockingTab = () => (
  <div className="space-y-6">
    <PageHeader title="Boids Flocking AI Migration" subtitle="Migrating cosmetic background AI (birds, fish, non-interactive town crowds in Novigrad) from heavy Behavior Trees to cheap C++ Boids algorithms on worker threads." />
    
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Craig Reynolds' Boids Algorithm (Separation, Alignment, Cohesion) written purely in C++ worker threads bypassing AActor ticking entirely.</p>
    </HighlightBox>

    <SectionCard title="Performance Transition" icon={Trees} color={COLORS.status.info}>
      <p className="text-sm mb-2">Unreal Engine’s Behavior Tree & CharacterMovement component are designed for heroes and complex enemies, not decorative flocks. A single ACharacter ticks its Capsule, Mesh, Movement component, and AI controller, costing heavily on the game thread. Replacing 500 birds with a single Manager Actor updating Instanced Static Meshes via Boids rules saves massive CPU time.</p>
    </SectionCard>

    <SectionCard title="Algorithmic Impact" icon={Cpu} color={COLORS.kingfisher.warm}>
      <MultiplayerImpact 
        gpu="+0.5ms (Single Instanced Static Mesh draw call with 500 instance matrices)" 
        cpu="-3.0ms to -8.5ms (Game thread completely relieved. 500 calculations happen in 0.1ms on TaskGraph worker thread)" 
        ram="-120MB (500 Instanced matrices instead of 500 UObject heavy actors)" 
        vram="0.0ms" 
        latency="None (Decorative Boids should not be replicated at all. Server sends flock bounding box once, clients simulate visually)." 
      />
      <FeatureMatrix 
        has={[
          "UHierarchicalInstancedStaticMeshComponent (HISM) for drawing 1000s of objects cheaply",
          "ParallelFor loops for updating math arrays concurrently"
        ]}
        missing={[
          "Built-in Boids system (must code Separation, Alignment, Cohesion manually)",
          "Collision-aware instancing (Must manually sweep lines to avoid flying through buildings)"
        ]}
        howToUse="Create a single 'AFlockManager' actor. Allocate array of FTransforms. Every Tick, dispatch a ParallelFor loop to update transforms using Boids math. Update the HISM transform array, passing 'bMarkRenderStateDirty=true'."
      />
    </SectionCard>
  </div>
);
