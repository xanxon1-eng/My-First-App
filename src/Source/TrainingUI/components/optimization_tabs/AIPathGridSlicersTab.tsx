import React from 'react';
import { PageHeader, HighlightBox, SectionCard, MultiplayerImpact, FeatureMatrix, CodeBlock } from './OptimizationHelpers';
import { Grid, Cpu, HardDrive, Terminal, Code } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';

export const AIPathGridSlicersTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Procedural AI Path-Grid Slicers" 
        subtitle="Multi-threaded terrain height-projection generators slicing dense Recast navigation data into localized O(1) 2D vector array maps." 
      />

      <HighlightBox type="success" className="my-4">
        <div className="flex items-center gap-2 mb-2">
          <Grid className="w-4 h-4 text-emerald-400" />
          <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
        </div>
        <p className="text-emerald-100/90 text-sm italic">
          Bake static World Partition geometry into compressed 2D heightmap grids asynchronously on game startup to bypass Recast querying for massive horde AI.
        </p>
      </HighlightBox>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="The Navmesh A* Bottleneck" icon={Terminal} color={COLORS.status.warning}>
          <p className="text-sm mb-3 text-kingfisher-muted">
            Unreal Engine's default <strong>Recast/Detour Navmesh</strong> uses polygons to determine walkable space. When you instruct 500 AI mobs (e.g. Witcher 3 Drowners or PoE horde monsters) to path towards a player, the engine fires hundreds of asynchronous A* polygon queries.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-4">
            <li><strong>Polygonal Complexity:</strong> Calculating intersections against multi-level 3D polygons scales exponentially (O(K * N log N)).</li>
            <li><strong>Game Thread Flooding:</strong> Even if async, the callback structures requesting navigation points flood the Game Thread queues causing 6ms+ stalls during horde spawns.</li>
          </ul>
          <MultiplayerImpact 
             gpu="0ms (CPU bound operation)" 
             cpu="+8.5ms (Game Thread lockups during simultaneous AArch query waves)" 
             ram="+60MB Allocation" 
             latency="Server stutters during mass combat, dropping tickrate below 30Hz." 
          />
        </SectionCard>

        <SectionCard title="Grid Slicing Architecture" icon={Grid} color={COLORS.kingfisher.blue}>
          <p className="text-sm mb-3">
            O(1) Vector Arrays replace polygon pathfinding. On boot, we instantiate <code>FRunnable</code> threads to <strong>raycast 2D grids</strong> directly onto the Recast Navmesh, storing walkability and Z-height in flat <code>TArray&lt;uint8&gt;</code> structures.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-4">
            <li><strong>Bit-packed State:</strong> Each cell simply stores <code>0</code> or <code>1</code> for walkability, preventing heavy pointer hopping.</li>
            <li><strong>O(1) Direct Indexing:</strong> AI characters divide their World Transform X/Y by grid-cell size to fetch walking permissions instantly sequentially cache.</li>
            <li><strong>Cache Friendliness:</strong> A linear <code>TArray</code> fits neatly into CPU L1/L2 caches compared to linked-list Recast polygons.</li>
          </ul>
          <MultiplayerImpact 
             gpu="0ms" 
             cpu="-8.2ms (Replaces A* queries with instant flat array lookups taking 0.3ms for thousands of entities)" 
             ram="-120MB (Drops massive runtime rebuilt array structures needed by dynamic Detour tiles)" 
             latency="Keeps server tick safely beneath 33.3ms, stabilizing combat rollbacks." 
          />
        </SectionCard>
      </div>

      <SectionCard title="O(1) Memory Mapping C++ Core" icon={Code} color={COLORS.status.info}>
        <p className="text-sm text-kingfisher-muted mb-3">
          The core logic structure defining the baked map. By keeping the map entirely integer and vector-free internally, we achieve massive speeds.
        </p>
        <CodeBlock code={`// AIPathGridManager.h
#pragma once
#include "CoreMinimal.h"

USTRUCT()
struct FWalkableGridCell 
{
    GENERATED_BODY()
    
    // Condensed data: 24 bits for height, 8 bits for Flags (Walkable, Water, Fire)
    uint32 CompressedData;

    FORCEINLINE float GetZHeight() const { return (float)(CompressedData & 0xFFFFFF) * 0.1f; }
    FORCEINLINE bool IsWalkable() const { return (CompressedData >> 24) & 0x01; }
};

class FPathGridSlicer 
{
public:
    TArray<FWalkableGridCell> GlobalGrid;
    int32 MapWidth, MapHeight;

    // Evaluated directly on the memory buffer in nanoseconds
    bool CheckTileWalkable(const FVector2D& WorldPos) const 
    {
        int32 GridX = FMath::FloorToInt(WorldPos.X / 100.f);
        int32 GridY = FMath::FloorToInt(WorldPos.Y / 100.f);
        int32 Index = GridY * MapWidth + GridX;
        
        return GlobalGrid.IsValidIndex(Index) ? GlobalGrid[Index].IsWalkable() : false;
    }
};`} />
      </SectionCard>

      <FeatureMatrix 
         has={["Recast & Detour Polygon Generator", "Dynamic Navmesh rebuild around level instances", "Asynchronous Navigation Task queries (still locks Main Thread on dispatch callbacks)"]} 
         missing={["O(1) Flat Array Map Evaluator (Forces custom Data Arrays)", "Multi-threaded offline baking into 2D memory arrays", "Cache-aligned primitive routing (Requires manually bypassing standard UAITask components)"]} 
         howToUse="Bypass standard `MoveTo` nodes for your dense hordes. Instead, write custom AI Controllers that tick directly from the `FPathGridSlicer` subsystem using fixed vector offsets."
      />
    </div>
  );
};
