import React from 'react';
import { PageHeader, SectionCard, StatRow, CodeBlock, HighlightBox } from './OptimizationHelpers';
import { TreePine, Footprints, HardDrive, Cpu, Monitor, Database, Settings } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';

export const OpenWorldSystemsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Open World 3D RPG Deep Systems" 
        subtitle="Crucial sub-systems for managing massive scale: Procedural Biomes (PCG), Next-Gen Locomotion (Motion Matching), and Branching State Persistence (BG3 style)." 
      />

      {/* 1. Procedural Content Generation (PCG) */}
      <div id="pcg-foliage-framework" className="scroll-mt-24">
        <SectionCard title="Procedural Content Generation (PCG) & Foliage" icon={TreePine} color={COLORS.kingfisher.warm}>
          <div className="space-y-4">
            <p className="text-kingfisher-muted text-sm leading-relaxed">
              When building massive outdoor biomes (inspired by The Witcher 3's Velen), hand-placing foliage is impossible and static HISM arrays aren't dynamic enough. Unreal Engine 5's PCG framework allows for rule-based, deterministic generation of billions of instances on the fly without massive save-file footprint.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
              <StatRow label="GPU Impact" value="-3.5ms" note="Hardware instances" color="text-emerald-400" />
              <StatRow label="CPU Impact" value="-6.8ms" note="PCG Async Generation" color="text-amber-400" />
              <StatRow label="RAM Impact" value="-1.2GB" note="Deleted level bounds" color="text-blue-400" />
              <StatRow label="VRAM Impact" value="+150MB" note="Streaming textures" color="text-purple-400" />
              <StatRow label="Latency" value="0 ms" note="Visual only" color="text-gray-400" />
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-kingfisher-border/50">
              <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                <Settings className="w-4 h-4 text-kingfisher-blue" />
                Unreal Engine Features Toolkit
              </h4>
              <ul className="space-y-2 text-sm text-kingfisher-muted/90">
                <li><strong className="text-emerald-400">UE Has:</strong> PCG Graph rule nodes, Spatial queries, Runtime generation on Background Threads, seamless integration with Nanite fallback distances.</li>
                <li><strong className="text-red-400">UE Lacks:</strong> Built-in complex physics interactions for millions of trees simultaneously (bending from wind/magic). Requires custom RVT (Runtime Virtual Texture) logic.</li>
                <li><strong className="text-kingfisher-blue">How to Use:</strong> Create a PCG Volume in World Partition. Drop a PCG Graph that reads `GetLandscapeData -&gt; Surface Sampler -&gt; Density Filter -&gt; StaticMeshSpawner`. Tie it to active grid cells streaming in.</li>
              </ul>
            </div>

            <h5 className="text-white font-bold text-sm mt-4 mb-2">C++ Custom PCG RVT Tracing Push</h5>
            <CodeBlock language="cpp" code={`
// Custom integration to push character overlap data into an RVT for massive amounts of grass to bend away
// (Without taxing CPU physics sweeps)
void UCharacterFoliagePusherBlock::TickComponent(float DeltaTime, ...)
{
    // Write current world location of character into a specific Render Target / RVT index
    // Material on grass instances simply reads this RVT and offsets WorldPositionOffset (WPO)
    // O(1) CPU cost regardless of 1 million or 10 million grass blades
    if (RVT_MaterialRef) {
        FVector PlayerPos = GetOwner()->GetActorLocation();
        ENQUEUE_RENDER_COMMAND(PushPlayerPosToFoliageRVT)(
            [PlayerPos](FRHICommandListImmediate& RHICmdList) {
                // ... Dispatch direct to GPU ...
            }
        );
    }
}
`} />
          </div>
        </SectionCard>
      </div>

      {/* 2. Motion Matching Locomotion */}
      <div id="motion-matching-locomotion" className="scroll-mt-24">
        <SectionCard title="Motion Matching & Fluid Locomotion" icon={Footprints} color={COLORS.kingfisher.blue}>
          <div className="space-y-4">
            <p className="text-kingfisher-muted text-sm leading-relaxed">
              Third-person open world RPGs depend heavily on fluid, non-robotic movement (inspired by Geralt's turning and transitioning in combat). Traditional State Machines become spaghetti logic. UE5 Motion Matching queries a massive database of raw MoCap data at runtime, finding the perfect next pose using Pose Search.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
              <StatRow label="GPU Impact" value="+0.2ms" note="Anim evaluation" color="text-emerald-400" />
              <StatRow label="CPU Impact" value="-4.2ms" note="Eliminates state machines" color="text-amber-400" />
              <StatRow label="RAM Impact" value="+180MB" note="Pose Database" color="text-blue-400" />
              <StatRow label="VRAM Impact" value="0.0ms" note="" color="text-purple-400" />
              <StatRow label="Latency" value="O(Log N)" note="KD-Tree lookups" color="text-gray-400" />
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-kingfisher-border/50">
              <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                <Settings className="w-4 h-4 text-kingfisher-blue" />
                Unreal Engine Features Toolkit
              </h4>
              <ul className="space-y-2 text-sm text-kingfisher-muted/90">
                <li><strong className="text-emerald-400">UE Has:</strong> Pose Search plugin, Chooser Tables, KD-Tree continuous querying, trajectory prediction built into Character Movement Component.</li>
                <li><strong className="text-red-400">UE Lacks:</strong> Perfect predictive networking for Motion Matching (server and client trajectories can desync under high packet loss).</li>
                <li><strong className="text-kingfisher-blue">How to Use:</strong> Enable `PoseSearch` plugin. Input raw MoCap data into a Pose Search Database. Define a Trajectory, and inside the AnimGraph, use the single `Motion Matching` node pointing to your database. Use `Chooser` nodes to switch between Combat/Relaxed databases.</li>
              </ul>
            </div>

            <h5 className="text-white font-bold text-sm mt-4 mb-2">AnimGraph Equivalent (Conceptual)</h5>
            <CodeBlock language="cpp" code={`
// Replaces 50+ transition rules in an AnimGraph, executing in O(Log N) via KD-Trees
void URPGAnimInstance::UpdateMotionMatchingTrajectory(float DeltaTime)
{
    // Predict future path 1 second ahead based on analog stick input
    FTrajectorySample FutureSample = UTrajectoryPrediction::Predict(
        GetOwningCharacter(), 
        CurrentVelocity, 
        AnalogStickVector, 
        TimeHorizon = 1.0f
    );
    
    // Provide trajectory to the Pose Search node
    CurrentTrajectory = FutureSample;
}
`} />
          </div>
        </SectionCard>
      </div>

      {/* 3. Open World State Persistence */}
      <div id="branching-world-persistence" className="scroll-mt-24">
        <SectionCard title="Branching Delta-Persistence (BG3 Style)" icon={Database} color={COLORS.status.warning}>
          <div className="space-y-4">
            <p className="text-kingfisher-muted text-sm leading-relaxed">
              RPGs like Baldur's Gate 3 remember every moved cup, looted chest, and slain goblin across massive maps. Unreal's USaveGame object saving everything outright creates 200MB+ save files and heavy serialization hitches. We must use a deterministic base state, and only save Delta-Overrides (what changed).
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
              <StatRow label="GPU Impact" value="0.0ms" note="" color="text-emerald-400" />
              <StatRow label="CPU Impact" value="-250ms+" note="Eliminates hitching" color="text-amber-400" />
              <StatRow label="RAM Impact" value="-50MB" note="Delta struct packing" color="text-blue-400" />
              <StatRow label="VRAM Impact" value="0.0ms" note="" color="text-purple-400" />
              <StatRow label="Latency/Ping" value="0 ms" note="" color="text-gray-400" />
            </div>

            <div className="bg-black/30 p-4 rounded-xl border border-kingfisher-border/50">
              <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                <Settings className="w-4 h-4 text-kingfisher-blue" />
                Unreal Engine Features Toolkit
              </h4>
              <ul className="space-y-2 text-sm text-kingfisher-muted/90">
                <li><strong className="text-emerald-400">UE Has:</strong> FArchive byte serialization, PrimaryAssetIds, Data Registries, Guid generation.</li>
                <li><strong className="text-red-400">UE Lacks:</strong> Out-of-the-box level delta-saving architecture for World Partition. Base World Partition discards dynamic object states when cells unload.</li>
                <li><strong className="text-kingfisher-blue">How to Use:</strong> Intercept `EndPlay` / `Unload` for dynamic actors. Serialize their Guid and modified properties (Location, Health) to a central `UGlobalSaveSubsystem`. Upon cell stream-in (`BeginPlay`), query Guid; if a delta exists, apply and overwrite defaults instantly.</li>
              </ul>
            </div>

            <h5 className="text-white font-bold text-sm mt-4 mb-2">C++ Core Delta Packer</h5>
            <CodeBlock language="cpp" code={`
USTRUCT()
struct FStateDelta
{
    GENERATED_BODY()
    UPROPERTY() FVector SavedLocation;
    UPROPERTY() uint8 StateBitmask; // e.g. B isLooted, isDead
};

void UGlobalSaveSubsystem::RecordActorDelta(AActor* Actor)
{
    // Instead of saving 200 variables per actor, we save a 13-byte struct
    IRPGPersistentInterface* PInterface = Cast<IRPGPersistentInterface>(Actor);
    if (PInterface && PInterface->HasStateModified())
    {
        FStateDelta Delta;
        Delta.SavedLocation = Actor->GetActorLocation();
        Delta.StateBitmask = PInterface->GetPackedState();
        
        // Hash map O(1) saving
        WorldDeltaMap.Add(PInterface->GetUniqueGuid(), Delta);
    }
}
`} />
          </div>
        </SectionCard>
      </div>

    </div>
  );
};
