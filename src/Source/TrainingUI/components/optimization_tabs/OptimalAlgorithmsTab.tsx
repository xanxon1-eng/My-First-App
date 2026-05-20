
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const OptimalAlgorithmsTab = () => (
  <div className="space-y-6">
    <PageHeader
      title="Optimal Game Algorithms"
      subtitle="Most optimal approaches for critical game loops. Stop writing brute-force arrays. Focus on data-oriented and spatial algorithms."
    />

    <HighlightBox type="info">
      <strong>The Optimization Mindset (Multiplayer Focus):</strong> Instead of focusing on what NOT to do, focus on the structures that inherently prevent bottlenecks. In multiplayer, algorithms must gracefully scale memory vs. CPU tradeoffs without blowing up bandwidth.
    </HighlightBox>

    <SectionCard title="1. Spatial Partitioning: The Hash Grid" icon={Grid} color={COLORS.status.success}>
      <p className="text-sm mb-3"><strong>Do: Use implicit Hash Grids or Octrees for proximity.</strong> Instead of brute-force O(N²) array checks to see "who is near me" for AOE damage or AI aggro, store entity IDs in a spatial grid. You instantly know who is in the same cell.</p>
      <div className="p-3 bg-black/20 rounded border border-emerald-500/10 text-xs mb-3">
        <strong className="text-emerald-400 block mb-1">PoE-style AOE Spells:</strong>
        <p className="text-kingfisher-muted text-xs leading-normal">Casting a massive Poison Blast into 150 monsters in PoE. Instead of sweeping all world actors against physics spheres, calculate their relative cell IDs on a flat mathematical grid. This drops the tick cost from over <span className="text-red-400">5.5ms</span> to flat <span className="text-emerald-400">0.2ms</span>.</p>
      </div>
      <CodeBlock code={`// Spatial Hash Grid (O(1) insertion, O(K) lookup)
int32 GetCellID(FVector Position, float CellSize) {
    return FMath::FloorToInt(Position.X / CellSize) * 73856093 ^
           FMath::FloorToInt(Position.Y / CellSize) * 19349663;
}

// In Tick: Get only players in the current and adjacent cells
TArray<AActor*> NearbyEnemies = SpatialGrid.GetActorsInRadius(GetCellID(MyPos), Radius);`} />
      <MultiplayerImpact 
        gpu="0.0ms" 
        cpu="-5.0ms (Converts exponential array searches to instant O(1) hash math lookup checks)" 
        ram="+4.5MB Spatial table memory" 
        vram="0ms" 
        latency="0ms" 
      />
      <FeatureMatrix 
        has={[
          "Unreal MassEntity (Mass Spatial Hash)",
          "Collision Octrees (`UWorld::FindPositions`)",
          "World Partition Grid (Streaming)"
        ]}
        missing={[
          "Out-of-the-box non-physics logical spatial grids (Must write custom Hash Grid)",
          "Native delta-sync for massive client cell networks"
        ]}
        howToUse="When writing custom serverside rules (e.g. 'are 50 players standing in poison?'), DO NOT use physics overlapping spheres. Calculate the grid hash mathematics mathematically!"
      />
    </SectionCard>

    <SectionCard title="2. Navigation & Pathfinding: Hierarchical NavMesh" icon={Map} color={COLORS.kingfisher.blue}>
      <p className="text-sm mb-3"><strong>Do: Use Hierarchical NavMesh queries instead of raw A* Grids.</strong> Voxel Pathfinding (raw A*) explodes in memory and CPU in 3D open worlds. Navmesh reduces walking areas into gigantic polygons. H-Navmesh adds 'rooms/chunks', turning 50,000 nodes into 50 chunks.</p>
      <div className="p-3 bg-black/20 rounded border border-blue-500/10 text-xs mb-3">
        <strong className="text-blue-400 block mb-1">Witcher 3-style Novigrad City Paths:</strong>
        <p className="text-kingfisher-muted text-xs leading-normal">Novigrad has hundreds of narrow streets and dynamic path options. Running pure A* per NPC stalls frames. H-Navmesh groups city districts into high-level grids and evaluates paths in a multi-tiered query pipeline, shaving CPU time.</p>
      </div>
      <MultiplayerImpact 
        gpu="0.0ms (Navigation calculation runs 100% on CPU cores)" 
        cpu="-2.8ms CPU (Offloading heavy path-searches to background workers ensures fluid gameplay frame rates)" 
        ram="+38MB Nav bounds cache memory" 
        vram="0ms" 
        latency="0ms" 
      />
      <FeatureMatrix 
        has={[
          "Recast & Detour Navmesh integration",
          "NavMesh Bounds Volumes",
          "Hierarchical Pathfinding (Enabled via Recast Project Settings)"
        ]}
        missing={[
          "True 3D Volume Pathfinding (Flying/Swimming is lacking)",
          "Fully Deterministic Navmesh generation across clients"
        ]}
        howToUse="Enable `bEnableDrawingHierarchicalPath` in Editor to debug. Only run 'Find Path' asynchronously using `UNavigationSystemV1::FindPathAsync`, never block the Main Thread for 100 NPCs at once."
      />
    </SectionCard>

    <SectionCard title="3. Rapid Math: High-Speed Vectors & SIMD" icon={Cpu} color={COLORS.status.warning}>
      <p className="text-sm mb-3"><strong>Do: Batch math logic using Vectorized SIMD & Intrinsics.</strong> In multiplayer, you often calculate trajectories for 500 bullets. Don't process them 1 by 1. Use SIMD (Single Instruction, Multiple Data) to process 4 or 8 vectors simultaneously on the CPU register.</p>
      <CodeBlock code={`// Using UE's VectorRegister math (SIMD)
// Processes 4 float calculations in a single CPU instruction!
VectorRegister A = VectorLoadAligned(ArrayA);
VectorRegister B = VectorLoadAligned(ArrayB);
VectorRegister Result = VectorAdd(A, B);
VectorStoreAligned(Result, ArrayOut);`} />
      <MultiplayerImpact 
        gpu="0.0ms" 
        cpu="-1.8ms CPU Math Ticking (4x speedup on pure vector math clusters during chaotic wizard spells)" 
        ram="0ms (Direct CPU registers utilized)" 
        vram="0ms" 
        latency="0ms" 
      />
      <FeatureMatrix 
        has={[
          "GlobalMath.h and UnrealMath.h optimizations",
          "VectorRegister types (FVector4 optimizations)",
          "ISPC (Intel Implicit SPMD Program Compiler) integration"
        ]}
        missing={[
          "Easy Blueprint wrappers for SIMD math blocks",
          "Automated fallback if CPU lacks AVX512 (you must handle branching)"
        ]}
        howToUse="When doing massive calculations (like custom wind physics on 10,000 grass blades), wrap it in an ISPC kernel or use VectorRegister types."
      />
    </SectionCard>

    <SectionCard title="4. Logic State Machines: Behavior Trees over Tick" icon={GitBranch} color={COLORS.kingfisher.warm}>
      <p className="text-sm mb-3"><strong>Do: Event-Driven Behavior Trees.</strong> A standard 'Switch' statement in a Tick function wastes CPU running the check every frame. Behavior Trees sleep natively until a Blackboard condition explicitly wakes them up.</p>
      <CodeBlock code={`// Blackboards act as event dispatchers
// AI only recalculates pathing when TargetLocation actively changes
BlackboardComp->SetValueAsVector("TargetLocation", NewLocation); // Wakes up the BT instantly!`} />
      <MultiplayerImpact 
        gpu="0ms" 
        cpu="-3.1ms Game Thread CPU (Saves massive cycles by converting hundreds of tick-monitoring loops to event alerts)" 
        ram="+18MB System RAM (Contains behavior trees, nodes, and blackboard structures)" 
        vram="0ms" 
        latency="0ms" 
      />
    </SectionCard>
  </div>
);
