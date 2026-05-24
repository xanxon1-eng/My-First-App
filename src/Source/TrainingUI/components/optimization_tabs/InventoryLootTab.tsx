import React from 'react';
import { PageHeader, SectionCard, StatRow, CodeBlock, HighlightBox } from './OptimizationHelpers';
import { Package, Grid, Cpu, Monitor, Database, Settings, ShieldAlert, FastForward, HardDrive } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';

export const InventoryLootTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Inventory & Loot Architecture" 
        subtitle="O(1) Grid Placements, Pointer-based Affix Rollers, and high-frequency Mass Drop optimizers inspired by Path of Exile." 
      />

      {/* 1. Massive Loot Drops (PoE) */}
      <div id="mass-loot-drops" className="scroll-mt-24">
        <SectionCard title="Mass Loot Drops & Instancing" icon={Package} color={COLORS.kingfisher.blue}>
          <div className="space-y-4">
            <p className="text-kingfisher-muted text-sm leading-relaxed">
              When a boss dies in Path of Exile, they can drop up to 100+ items simultaneously. Standard blueprint actors (`AActor`) spawning on the Game Thread will instantly lock up the CPU for ~25ms. You must use HISM (Hierarchical Instanced Static Meshes) with detached Data structures, and only spawn actual AActors when the player gets within interaction range.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
              <StatRow label="GPU Impact" value="-2.8ms" note="Single Draw Call" color="text-emerald-400" />
              <StatRow label="CPU Impact" value="-16.5ms" note="Actor limits bypassed" color="text-amber-400" />
              <StatRow label="RAM Impact" value="-40MB" note="UObject overhead" color="text-blue-400" />
              <StatRow label="VRAM Impact" value="0.0ms" note="" color="text-purple-400" />
              <StatRow label="Latency" value="-15ms" note="Server Spawning" color="text-gray-400" />
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-kingfisher-border/50">
              <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                <Settings className="w-4 h-4 text-kingfisher-blue" />
                Unreal Engine Features Toolkit
              </h4>
              <ul className="space-y-2 text-sm text-kingfisher-muted/90">
                <li><strong className="text-emerald-400">UE Has:</strong> `UHierarchicalInstancedStaticMeshComponent` (HISM), Primary Asset IDs, Asset Manager.</li>
                <li><strong className="text-red-400">UE Lacks:</strong> Built-in structural replication across clients for HISM instances mapping to gameplay data out-of-the-box (requires custom FastArray serializers).</li>
                <li><strong className="text-kingfisher-blue">How to Use:</strong> Create a global `ULootManagerSubsystem`. When an item drops, push a lightweight `FItemDropData` struct to an array. Find the correct HISM component based on the item's Mesh ID, and call `AddInstance()`. Use a Background Task to raycast UI labels.</li>
              </ul>
            </div>

            <h5 className="text-white font-bold text-sm mt-4 mb-2">C++ Fast Array Loot Manager</h5>
            <CodeBlock language="cpp" code={`
// Replaces 100 SpawnActor calls with a single Array add and 1 HISM update
void ULootManagerSubsystem::SpawnBossLoot(const TArray<FPrimaryAssetId>& Items, FVector BossLocation)
{
    for (const FPrimaryAssetId& ItemId : Items)
    {
        // 1. Fetch Item Data (O(1) Map lookup)
        const UItemDataAsset* Data = FetchItemData(ItemId);
        
        // 2. Add visual instance to global HISM map
        FTransform DropTransform = CalculateScatteredTransform(BossLocation);
        GetVisualHISM(Data->VisualMesh)->AddInstance(DropTransform);
        
        // 3. Store purely in C++ structs, ZERO UObjects spawned
        FLootRecord Record;
        Record.Id = ItemId;
        Record.Transform = DropTransform;
        ActiveLootDrops.Add(Record); // Track for player pickup
    }
}
`} />
          </div>
        </SectionCard>
      </div>

      {/* 2. Grid Inventory Algorithms */}
      <div id="grid-inventory" className="scroll-mt-24">
        <SectionCard title="O(1) Grid Inventory Spatial Algorithms" icon={Grid} color={COLORS.kingfisher.warm}>
          <div className="space-y-4">
            <p className="text-kingfisher-muted text-sm leading-relaxed">
              Diablo/Tarkov/PoE style Tetris grid inventories often suffer from intense Game Thread stutter when picking up items, if they use O(N^2) brute-force searches to find an empty spot. Represent the inventory not as UI Widgets, but as a flattened 1D C++ Bitmask or Boolean Array (Data-Oriented).
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
              <StatRow label="GPU Impact" value="-1.0ms" note="Slate Redraws" color="text-emerald-400" />
              <StatRow label="CPU Impact" value="-4.5ms" note="Search Complexity" color="text-amber-400" />
              <StatRow label="RAM Impact" value="-5MB" note="Widget stripping" color="text-blue-400" />
              <StatRow label="VRAM Impact" value="0.0ms" note="" color="text-purple-400" />
              <StatRow label="Latency" value="0 ms" note="" color="text-gray-400" />
            </div>

            <h5 className="text-white font-bold text-sm mt-4 mb-2">C++ 1D Grid Search</h5>
            <CodeBlock language="cpp" code={`
// Searching for a 2x3 item inside a 10x10 grid using a 1D Bool array
bool UInventoryComponent::FindEmptySlot(int32 ItemWidth, int32 ItemHeight, int32& OutIndex)
{
    // O(N) max, fast hardware prefetching on 1D continuous array
    for (int32 Index = 0; Index < GridFlags.Num(); ++Index)
    {
        if (CanFitAt(Index, ItemWidth, ItemHeight))
        {
            OutIndex = Index;
            return true;
        }
    }
    return false;
}

// 1D check using simple math row-wrapping
bool UInventoryComponent::CanFitAt(int32 StartIndex, int32 Width, int32 Height)
{
    int32 StartX = StartIndex % GridWidth;
    int32 StartY = StartIndex / GridWidth;
    
    if (StartX + Width > GridWidth || StartY + Height > GridHeight) return false;
    
    for (int32 y = 0; y < Height; ++y) {
        for (int32 x = 0; x < Width; ++x) {
            if (GridFlags[StartIndex + (y * GridWidth) + x]) return false; // Blocked
        }
    }
    return true;
}
`} />
          </div>
        </SectionCard>
      </div>

    </div>
  );
};
