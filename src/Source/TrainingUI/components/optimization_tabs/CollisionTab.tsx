
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const CollisionTab = () => (
  <div className="space-y-6">
    <PageHeader title="Collision, Overlaps & Physics Traces" subtitle="Optimizing physics queries to handle massive PoE-style mob counts and interactive RPG world tracing without choking the Game Thread." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Bounding Volume Hierarchies (BVH) and Sweep-and-Prune (SAP) algorithms for broad-phase collision filtering.</p>
    </HighlightBox>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="RPG Context: The PoE/BG3 Collision Disaster" icon={ShieldAlert} color={COLORS.status.error}>
        <p className="text-sm mb-3">
          In games like <strong>Path of Exile</strong>, a single Area-of-Effect (AoE) fireball spell can explode inside a tight pack of 100 skeletons. If implemented naively via synchronous overlap sweeps, the engine performs up to <strong className="text-red-400">10,000 collision tests (K * N scaling)</strong>, locking the Game Thread.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted">
          <li><strong>Virtual Poly Bloat:</strong> Querying against a weapon mesh's true complex tri-mesh instead of simple box proxies costs up to <strong className="text-red-400">1.8ms per trace</strong>.</li>
          <li><strong>Overlap Ticks (The Silent Killer):</strong> Setting <code className="text-white">bGenerateOverlapEvents = true</code> on 200 dynamic loot-drops and 100 enemies forces Chaos to evaluate overlap arrays every single frame, causing <strong className="text-red-400">5.0ms+ Game Thread spikes</strong>.</li>
          <li><strong>Stealth Traces in BG3:</strong> Line of sight calculations for AI perception or turn-based stealth cones require dozens of raycasts. Sweeping multi-polygon walls causes immediate CPU cache misses.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Broadphase Filtering & Query Channels" icon={Radio} color={COLORS.status.success}>
        <p className="text-sm mb-3 text-kingfisher-surface">
          <strong>The Cure: Broadphase Pruning.</strong> Before performing a precise line trace, Chaos sweeps a fast Sweep-and-Prune structure to group actors in multi-meter buckets. We can optimize this by keeping Collision Profiles extremely strict.
        </p>
        <div className="space-y-2 text-xs">
          <div className="p-2 bg-black/20 rounded border border-emerald-500/20">
            <strong className="text-emerald-400 text-xs">Rule 1: Always use Object Channels over Trace Channels</strong>
            <p className="text-kingfisher-muted mt-1">Instead of shooting a ray on the general "Visibility" channel (which tests *every* cup, wall, and weapon), define a custom object type (e.g. `ECC_GameNPC`) and do a targeted Sweep Single of that channel. Chaos immediately skips static walls and clutter!</p>
          </div>
          <div className="p-2 bg-black/20 rounded border border-blue-500/20">
            <strong className="text-blue-400 text-xs">Rule 2: Restrict overlapping indicators</strong>
            <p className="text-kingfisher-muted mt-1">Keep <code className="text-white">bGenerateOverlapEvents = false</code> on all props, dropped loot, and static decor. Turn on overlap checks ONLY for active player characters or immediate projectile sphere colliders.</p>
          </div>
        </div>
      </SectionCard>
    </div>

    <SectionCard title="Combat Physics & Trace Hardware Impacts" icon={Monitor} color={COLORS.kingfisher.blue}>
      <p className="text-sm text-kingfisher-muted mb-4 font-medium italic">How heavy collision sweeps impact the target hardware budgets:</p>
      <MultiplayerImpact 
        gpu="0.0ms (No GPU overhead; collision structures and Raycast trees are pure CPU operations in Chaos)" 
        cpu="-3.2ms (Bypassing synchronous sweeps reduces Game Thread time from 4.2ms to 0.4ms via offloaded Async traces)" 
        ram="+28MB System RAM / 0MB GPU VRAM (Physics Broadphase octree nodes and simple proxy primitives stored in RAM)" 
        latency="Avoids high-frequency ping spikes (Synchronous Game Thread locks stall network packet dispatches, causing +35ms network jitter)" 
      />
    </SectionCard>

    <SectionCard title="C++ Implementation: Non-Blocking Async Line Trace" icon={Code} color={COLORS.status.info}>
      <p className="text-sm text-kingfisher-muted mb-3">
        Using Unreal's <code>FTraceDelegate</code> to queue physics sweeps to auxiliary threads, capturing callbacks in a non-blocking asynchronous cycle:
      </p>
      <CodeBlock code={`// Queue non-blocking Async Raycast for PoE style spell projectile intersections
void ASpellcasterCharacter::CastProjectilesAsync(const FVector& StartPos, const FVector& EndPos)
{
    UWorld* World = GetWorld();
    if (!World) return;

    // 1. Declare Collision Profiles
    FCollisionQueryParams Params;
    Params.AddIgnoredActor(this);
    Params.bTraceComplex = false; // Force simple/primitive proxy colliders instead of raw trimeshes!

    // 2. Set up dynamic callback listener
    FTraceDelegate TraceCallback;
    TraceCallback.BindUObject(this, &ASpellcasterCharacter::OnTraceCompleted);

    // 3. Dispatch trace to Chaos Physics worker thread thread pool
    // Returns a trace handle immediately, completely leaving the Game Thread free!
    FTraceHandle Handle = World->AsyncLineTraceByChannel(
        EAsyncTraceType::Single,
        StartPos,
        EndPos,
        ECC_WorldDynamic, // custom object channel for NPC collision
        Params,
        FCollisionResponseParams::DefaultResponseParam,
         &TraceCallback
    );
}

// 4. Callback evaluated cleanly a frame later on the Game Thread
void ASpellcasterCharacter::OnTraceCompleted(const FTraceHandle& Handle, FTraceDatum& Data)
{
    if (Data.OutHits.Num() > 0)
    {
        const FHitResult& Hit = Data.OutHits[0];
        if (AActor* HitActor = Hit.GetActor())
        {
            // Apply spell damage & combat logic asynchronously
            UGameplayStatics::ApplyDamage(HitActor, 120.f, GetController(), this, UDamageType::StaticClass());
        }
    }
}`} />
    </SectionCard>

    <SectionCard title="Unreal Engine Chaos & Collision Feature Matrix" icon={Shield} color={COLORS.kingfisher.blue}>
      <FeatureMatrix 
        has={[
          "Chaos Async Trace API (executes queries safely across multi-core physics worker threads)",
          "Collision Presets and dynamic Object Channels configured directly via Project Settings",
          "Dynamic rigid body sleep systems automatically turning off immobile physics actors"
        ]}
        missing={[
          "Native Rollback State Buffer for Chaos (If doing client predicted abilities, you must manually cache and rewind bone/capsule positions for lag compensation)",
          "GPU-Driven spatial sweeps for complex particle-physics intersections",
          "Automatic runtime capsule merging (UE doesn't group 5 nearby enemies into a single giant capsule boundary automatically)"
        ]}
        howToUse="To integrate: In your Project Settings > Collision, establish custom collision filtering (e.g. Loot, Projectile, EnemyNPC). Never use complex collision traces for dynamic triggers. Inherit from 'AsyncLineTraceByChannel' inside C++ combat managers to prevent core framing stalls."
      />
    </SectionCard>
  </div>
);
