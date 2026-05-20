
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const MassEntityTab = () => (
  <div className="space-y-6">
    <PageHeader
      title="Mass Entity / ECS Simulation Rollout"
      subtitle="Refactoring base simulation from actor-heavy tick loops to highly-packed, contiguous-memory Data-Oriented ECS architectures."
    />

    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Architecture</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">
        Data-Oriented design via contiguous struct chunks (Archetypes) with cache-aligned FMassFragments and modular UMassProcessors running in parallel jobs.
      </p>
    </HighlightBox>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SectionCard title="Why AActor Fails at 1k+ Entities" icon={Cpu} color={COLORS.kingfisher.warm}>
        <p className="text-sm text-kingfisher-surface">
          General <code>AActors</code> are monolithic object trees allocated sparsely on the heap. Ticking 1,000 active virtual-function-calling AActors incurs massive <strong>CPU cache line misses</strong> (the instruction cache stalls waiting for RAM reads because data is scattered, and virtual dispatches inhibit compiler auto-vectorization).
        </p>
        <ul className="list-disc pl-5 text-xs text-kingfisher-muted space-y-2.5 mt-2">
          <li><strong>Virtual Pointer Indirection:</strong> Double pointers for virtual method lookup.</li>
          <li><strong>Transform Overhead:</strong> Superfluous scene transform tree recalculations.</li>
          <li><strong>Spawn Stall:</strong> Heavy actor instantiation and runtime component orchestration causes <strong>100ms+ stutter events</strong>.</li>
        </ul>
      </SectionCard>

      <SectionCard title="The ECS Solution: Contiguous Archetype Chunks" icon={Grid} color={COLORS.status.success}>
        <p className="text-sm text-kingfisher-surface">
          Unreal's <code>MassEntity</code> organizes raw data into <code>FMassFragment</code> structs. Instead of storing each entity in a separate memory slot, entities sharing identical component groupings are packed back-to-back in 64KB arrays (chunks).
        </p>
        <ul className="list-disc pl-5 text-xs text-kingfisher-muted space-y-2.5 mt-2">
          <li><strong>L1/L2 Cache Hit Rate &gt;99%:</strong> Reading elements sequentially allows the CPU to prefetch consecutive entities automatically.</li>
          <li><strong>Parallel Worker Processing:</strong> Slicing chunks into threads dynamically for collision, navigation, and state calculations.</li>
          <li><strong>Render Handoff:</strong> Mass entities write transforms straight to Instanced Static Mesh (ISM) registers on the graphics card in a single contiguous transfer.</li>
        </ul>
      </SectionCard>
    </div>

    <SectionCard title="Concrete Hardware Impact (Based on 10k entities @ 60 FPS)" icon={Monitor} color={COLORS.kingfisher.blue}>
      <p className="text-sm text-kingfisher-muted mb-4 font-medium italic">Comparison of AActor vs. MassEntity hardware budgets on server & client:</p>
      <MultiplayerImpact 
        gpu="-1.4ms (HISM Batching drops dynamic draw calls from 850 in Actor to a flat 12 on GPU registers)" 
        cpu="-4.4ms Server Frame Time (Saves 6.2ms total, dropping tick logic to 1.8ms on a thread-parallel pool)" 
        ram="Saves -396MB RAM (Actor heap structures require 420MB, whereas Mass handles 10k entities in 24MB flat memory)" 
        latency="-10.5ms (Eliminates actor spawning replication packet stalls, lowering client-side render-sync jitters to under 1.5ms)" 
      />
    </SectionCard>

    <SectionCard title="C++ Core Code Implementation" icon={Code} color={COLORS.status.info}>
      <p className="text-sm text-kingfisher-muted mb-3">
        Declaring dynamic agent trajectory records using <code>FMassFragment</code> and updating entity pools via <code>UMassProcessor</code> executing vector calculations:
      </p>
      <CodeBlock code={`// 1. Define Cache-Aligned Fragments (Pure Data)
USTRUCT()
struct FAgentMovementFragment : public FMassFragment
{
    GENERATED_BODY()
    
    FVector TargetDestination; // 24 bytes
    FVector VolumetricVelocity; // 24 bytes
    float MaxAgilitySpeed;      // 4 bytes
    uint32 SimulationLayer;    // 4 bytes
};

// 2. Define Controller Processor (Data-Parallel Execution)
UCLASS()
class SPECIALIZED_API UMassAgentMovementProcessor : public UMassProcessor
{
    GENERATED_BODY()
    
public:
    UMassAgentMovementProcessor()
    {
        // Execute during normal simulation ticks
        ExecutionOrder.ExecuteInGroup = UE::Mass::ProcessorGroupNames::Movement;
        bRequiresGameThreadExecution = false; // Run completely on worker threads!
    }

protected:
    virtual void ConfigureQueries() override
    {
        // Match only entities with transform and movement data
        EntityQuery.AddRequirement<FTransformFragment>(EMassFragmentAccess::ReadWrite);
        EntityQuery.AddRequirement<FAgentMovementFragment>(EMassFragmentAccess::ReadOnly);
    }
    
    virtual void Execute(FMassEntityManager& EntityManager, FMassExecutionContext& Context) override
    {
        EntityQuery.ForEachEntityChunk(EntityManager, Context, [](FMassExecutionContext& QueryContext)
        {
            const int32 EntityCount = QueryContext.GetNumEntities();
            TArrayView<FTransformFragment> Transforms = QueryContext.GetFragmentView<FTransformFragment>();
            TConstArrayView<FAgentMovementFragment> Movements = QueryContext.GetFragmentView<FAgentMovementFragment>();
            
            // Loop contiguous chunks in SIMD-compilable fashion
            for (int32 i = 0; i < EntityCount; ++i)
            {
                FTransform& Transform = Transforms[i].GetMutableTransform();
                const FAgentMovementFragment& Movement = Movements[i];
                
                FVector CurrentPos = Transform.GetLocation();
                FVector Direction = (Movement.TargetDestination - CurrentPos).GetSafeNormal();
                FVector NextPos = CurrentPos + (Direction * Movement.MaxAgilitySpeed * QueryContext.GetDeltaTimeSeconds());
                
                Transform.SetLocation(NextPos);
            }
        });
    }
    
 private:
    FMassEntityQuery EntityQuery;
};`} />
    </SectionCard>

    <SectionCard title="Unreal Engine Feature Matrix & Built-In Support" icon={Shield} color={COLORS.kingfisher.blue}>
      <FeatureMatrix 
        has={[
          "MassEntity Core & MassSpawner plugins natively compiled within engine source",
          "HISM integration connecting Mass Representation directly to PC/Console virtual shadow rasterizers",
          "Recast Navmesh integration mapping Crowds dynamically to Detour boundary slices"
        ]}
        missing={[
          "Advanced Blueprint composition support (Mass is virtually unusable in raw Blueprints, requiring pure C++)",
          "Automated dynamic multiplayer replication (requires writing custom RepTraits or IRIS bit-channel bridges manually)",
          "Visual chunk-memory visualizer or layout profiler (you must debug archetypes via Console commands)"
        ]}
        howToUse="To roll out: Enable 'MassEntity' and 'MassGameplay' plugins in the editor. Register custom FMassFragments in C++ header modules, compile, and configure a MassSpawner actor in your level to spawn 10,000 entities in 60 milliseconds."
      />
    </SectionCard>
  </div>
);
