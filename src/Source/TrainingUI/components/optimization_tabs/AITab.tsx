
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const AITab = () => (
  <div className="space-y-6">
    <PageHeader title="World AI Simulation Scaling & Flow Fields" subtitle="Managing dynamic AI agent pathfinding populations without drowning the Game Thread." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Dijkstra-based Volumetric Flow Field vector integration replacing standard A* pathfinding for crowd simulation.</p>
    </HighlightBox>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="A* vs. Flow Field Crowd Scaling" icon={Users} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">
          Traditional <strong>A* Pathfinding</strong> calculates individual paths from each agent (O(K * N log N)). When 500 enemies path to a player, 500 raw graph searches run on the Game Thread, causing severe stutters.
        </p>
        <p className="text-xs text-kingfisher-muted mb-3">
          <strong>Flow Fields</strong> flip this upside down. By treating the map as a coordinate grid and applying Dijkstra outward from the target location once, we generate a <em>direction-vector field</em>. All 500 agents simply read their local grid coordinates to find their heading—converting O(N) searching to O(1) direct offset reads!
        </p>
        <MultiplayerImpact 
          gpu="0ms (Processed purely on Game Thread / async workers)" 
          cpu="-2.4ms (Drops crowd search times for 500 characters from 8.2ms down to a flat 0.4ms spatial read)" 
          ram="Saves -14MB (Flow Fields store simple 2D direction grids vs massive thread-allocated A* nodes)" 
          latency="0ms (No network variance; vector lookup is evaluated on the client/server instantly)" 
        />
      </SectionCard>

      <SectionCard title="Significance Manager Engineering" icon={Activity} color={COLORS.status.success}>
        <p className="text-sm text-kingfisher-muted mb-3">
          Unreal's <strong>Significance Manager</strong> tracks which characters are crucial (e.g., currently onscreen, close to the player, or emitting combat sounds) vs. cosmetic actors far away.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted">
          <li><strong>On-Screen Hero NPCs:</strong> Ticks and animates at full rate: <strong>60Hz</strong>.</li>
          <li><strong>Out-of-Frame NPCs (&gt;35m):</strong> Animation evaluation turns off. Ticks at <strong>5Hz</strong>.</li>
          <li><strong>Far-Distance NPCs (&gt;80m):</strong> Movement is simulated using simple Catmull-Rom math splines; dynamic Skeletal Mesh elements are hidden completely (saves over <strong>~4.2ms of Game Thread</strong> processing).</li>
        </ul>
      </SectionCard>
    </div>

    <SectionCard title="C++ Volumetric Flow Field Cell Query" icon={Code} color={COLORS.status.info}>
      <p className="text-sm text-kingfisher-muted mb-3">
        Implementation of an O(1) Flow Field grid coordinate to direction vector lookup for AI steering adjustments:
      </p>
      <CodeBlock code={`// FlowFieldGrid.h - Spatial direction queries
#pragma once
#include "CoreMinimal.h"

struct FFlowFieldCell
{
    FVector2D WorldPos;
    FVector2D FlowDirection; // Precalculated Dijkstra gradient vector towards target
    uint8 Cost;              // 255 = unwalkable wall
};

class FWorldFlowFieldGrid
{
public:
    TArray<FFlowFieldCell> Cells;
    float GridCellSize = 100.f; // 1 meter per cell
    int32 GridWidth = 1000;
    int32 GridHeight = 1000;

    // Get steering vector in O(1) constant time
    FVector2D GetSteeringDirection(const FVector& AgentWorldPos) const
    {
        // 1. Translate 3D world space coordinates to 2D grid index
        int32 XIndex = FMath::FloorToInt(AgentWorldPos.X / GridCellSize);
        int32 YIndex = FMath::FloorToInt(AgentWorldPos.Y / GridCellSize);

        // Bounds validation
        if (XIndex < 0 || XIndex >= GridWidth || YIndex < 0 || YIndex >= GridHeight)
        {
            return FVector2D::ZeroVector;
        }

        int32 FlatIndex = (YIndex * GridWidth) + XIndex;
        if (Cells.IsValidIndex(FlatIndex) && Cells[FlatIndex].Cost < 255)
        {
            // 2. Instantly retrieve pre-integrated Dijkstra direction vector
            return Cells[FlatIndex].FlowDirection;
        }

        return FVector2D::ZeroVector;
    }
};`} />
    </SectionCard>

    <SectionCard title="Unreal Engine Navigation Feature Options" icon={Shield} color={COLORS.kingfisher.blue}>
      <FeatureMatrix 
        has={[
          "Recast & Detour Navigation System (AActors and CrowdManager integrations)",
          "Significance Manager module ready to register custom importance criteria",
          "Navmesh walking-mesh boundaries dynamically rebuilt around level streamer partitions"
        ]}
        missing={[
          "Native Flow-Field pathfinding generators (you must manually write grid maps and Dijkstra arrays)",
          "Vectorized AI Crowd collisions (Recast uses RVO avoidance which runs on a single thread sequentially)",
          "Out of the box 3D pathfinders for swimming or winged creatures (requires voxel volumetric grids)"
        ]}
        howToUse="Use standard Recast A* Navmesh queries for single-boss pathing logic to preserve high-fidelity maneuvering. For massive waves of cosmetic zombie-mobs, switch off Actor Nav-Ticking and let them steer using a pre-calculated C++ FWorldFlowFieldGrid."
      />
    </SectionCard>
  </div>
);
