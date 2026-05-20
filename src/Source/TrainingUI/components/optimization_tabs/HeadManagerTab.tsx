
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock, Collapsible } from './OptimizationHelpers';

export const HeadManagerTab = () => (
  <div className="space-y-6 text-slate-200 font-sans">

    {/* ════════════════════════════════════════════════
        ORIGINAL CONTENT — unchanged
    ════════════════════════════════════════════════ */}

    <PageHeader
      title="The Head Manager Pattern"
      subtitle="Data-Oriented Design for AAA-scale systems. Why your CPU idles for 12ms every frame — and how one architectural decision eliminates it entirely."
    />

    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Data-Oriented design loops prioritizing contiguous array iteration over pointer chasing.</p>
    </HighlightBox>

    <HighlightBox type="info">
      <strong>The Core Insight:</strong> The Head Manager is not primarily about saving RAM. Modern games have gigabytes of RAM capacity. The real killer is <em>RAM latency</em> — the time a CPU spends doing nothing while the RAM hunts for scattered data across different memory aisles. The Head Manager eliminates that wait by packing all related data into one unbroken, sequential block that loads directly into the CPU's L1 Cache.
    </HighlightBox>

    <SectionCard title="The Cache Miss Problem: Why 200 Blueprints Costs 25ms" icon={Cpu} color={COLORS.status.error}>
      <p className="text-sm mb-3">Consider 200 enemies in a combat zone, each with a Blueprint Actor managing its own poison timer. The CPU needs to process damage every frame. Here is what actually happens in hardware:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">❌ Blueprint Scatter Pattern</div>
          <CodeBlock language="memory layout" code={`[RAM Aisle 4]   → Enemy1.PoisonTimer = 3.2f
[RAM Aisle 92]  → Enemy2.PoisonTimer = 1.8f
[RAM Aisle 203] → Enemy3.PoisonTimer = 0.5f
... (each Blueprint stores data
     in a random heap location)

CPU asks for Enemy1 data:
  → RAM hunts Aisle 4 ... delivers (slow)
CPU asks for Enemy2 data:
  → RAM hunts Aisle 92 ... delivers (slow)
  → CPU idles 400+ clock cycles each time

200 enemies = 200 cache misses
→ Wasted time: 10-15ms of idle CPU`} />
        </div>
        <div className="space-y-2">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">✅ Head Manager Array Pattern</div>
          <CodeBlock language="memory layout" code={`[RAM Aisle 10] → [P1][P2][P3][P4]...[P200]
// All 200 poison structs packed
// in one contiguous memory block

CPU asks for Poison Array:
  → RAM delivers the ENTIRE block at once
  → Loaded directly into L1 Cache chip

CPU processes in cache:
  [P1][P2][P3]... already right there
  No round-trips to RAM whatsoever

200 enemies = ~0.4ms total`} />
        </div>
      </div>
      <MultiplayerImpact
        gpu="0ms"
        cpu="-10ms savings vs scatter"
        ram="~1.6MB per 100k instances"
        latency="0ms (Pure Server Logic)"
      />
    </SectionCard>

    <div>
      <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
        <Hexagon className="w-5 h-5" style={{ color: COLORS.kingfisher.warm }} />
        The Three-Layer Architecture
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          {
            layer: "Layer 1", name: "The Component", subtitle: "The Mailbox",
            color: "border-blue-500/40 bg-blue-500/5", headerColor: "text-blue-400", icon: "📬",
            points: [
              "Sits on each individual enemy Actor.",
              "Has zero Tick logic — zero CPU cost per frame.",
              "Registers itself with the Head Manager on BeginPlay.",
              "Receives callback events when the Head Manager computes results (e.g. OnTakeStatusDamage, ToggleStatusEffectVisual).",
              "Is purely a data mailbox and a Bridge to the Blueprint visual layer.",
            ],
          },
          {
            layer: "Layer 2", name: "The Worker Structs", subtitle: "The Middle Managers",
            color: "border-amber-500/40 bg-amber-500/5", headerColor: "text-amber-400", icon: "⚙️",
            points: [
              "Plain C++ structs that live inside the Head Manager.",
              "Each worker owns a flat TArray<FXData> for one system (FPoisonWorker, FBurnWorker, FProjectileWorker).",
              "Runs its own TickX(DeltaTime) method processing every item in the array in one sequential pass.",
              "Uses RemoveAtSwap() for O(1) item removal without restructuring the array.",
              "Sends results directly down to the Component layer, never back up to the Head Manager.",
            ],
          },
          {
            layer: "Layer 3", name: "The Head Manager", subtitle: "The Orchestrator",
            color: "border-emerald-500/40 bg-emerald-500/5", headerColor: "text-emerald-400", icon: "🧠",
            points: [
              "A UWorldSubsystem — auto-created and destroyed by Unreal.",
              "Holds a TSet<> master registry of all registered enemy components.",
              "Owns all Worker Structs as plain member variables.",
              "Runs a single centralized Tick() that calls each worker sequentially.",
              "Exposes the public API for gameplay code: ApplyPoison(), ApplyBurn(), FireProjectile().",
            ],
          },
        ].map(item => (
          <div key={item.layer} className={`border ${item.color} rounded-xl p-4`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{item.icon}</span>
              <div>
                <div className={`text-[10px] font-bold uppercase tracking-widest ${item.headerColor}`}>{item.layer}</div>
                <div className="text-white font-semibold text-sm">{item.name}</div>
                <div className="text-slate-400 text-xs italic">{item.subtitle}</div>
              </div>
            </div>
            <ul className="mt-3 space-y-2">
              {item.points.map((p, i) => (
                <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                  <span className={`mt-0.5 ${item.headerColor}`}>→</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <SectionCard title="Data Flow: How Information Actually Moves" icon={GitBranch} color={COLORS.kingfisher.blue}>
      <p className="text-sm text-slate-400 mb-4">A critical misconception is that middle managers "mail info back to the Head Manager." In reality, the flow is strictly <strong>downward and outward</strong>:</p>
      <div className="bg-black/40 rounded-xl p-4 border border-slate-700/30 font-mono text-xs overflow-x-auto">
        <div className="space-y-2 text-center min-w-[400px]">
          {[
            { bg: "bg-purple-900/40 border-purple-500/40 text-purple-300", text: "🗡️ Player Weapon / Spell → calls ApplyPoison(Target, DPS, Duration)" },
            { arrow: true, text: "↓ One function call on the Head Manager" },
            { bg: "bg-amber-900/30 border-amber-500/30 text-amber-300", text: "🧠 Head Manager → validates Target exists in registry → adds FPoisonData to FPoisonWorker.ActivePoisonPool" },
            { arrow: true, text: "↓ Next frame, Head Manager.Tick() fires" },
            { bg: "bg-blue-900/30 border-blue-500/30 text-blue-300", text: "⚙️ FPoisonWorker.TickPoison(DeltaTime) → loops the flat array → deducts health" },
            { arrow: true, text: "↓ Worker calls down to Component directly" },
            { bg: "bg-emerald-900/30 border-emerald-500/30 text-emerald-300", text: "📬 Component.OnTakeStatusDamage() fires → Blueprint displays damage number" },
            { arrow: true, text: "↓ Worker tells Component to toggle visual" },
            { bg: "bg-green-900/30 border-green-500/30 text-green-300", text: "📬 Component.ToggleStatusEffectVisual('Poison', true) → green smoke particle activates" },
          ].map((row, i) =>
            row.arrow
              ? <div key={i} className="text-slate-500">{row.text}</div>
              : <div key={i} className={`inline-block px-4 py-2 border rounded-lg ${row.bg}`}>{row.text}</div>
          )}
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-3 italic">No upward mail chains. No round-trips. The Head Manager is not a middleman — it is the owner. Workers are its organs, not its colleagues.</p>
    </SectionCard>

    <SectionCard title="Core C++ Implementation" icon={Code} color={COLORS.kingfisher.warm}>
      <div className="space-y-4">
        <div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Worker Struct (Middle Manager)</div>
          <CodeBlock code={`// CombatStatusStructures.h
struct FPoisonData
{
    TWeakObjectPtr<UHealthAndStatusComponent> TargetComponent;
    float DamagePerSecond;
    float TimeRemaining;
    // Total size: ~16-24 bytes. 100,000 stacks = only 1.6MB RAM!
};

struct FPoisonWorker
{
    TArray<FPoisonData> ActivePoisonPool;

    void TickPoison(float DeltaTime)
    {
        // Loop BACKWARDS so we can safely remove expired items
        for (int32 i = ActivePoisonPool.Num() - 1; i >= 0; --i)
        {
            FPoisonData& Data = ActivePoisonPool[i];

            // Auto-cleanup if the enemy was destroyed elsewhere
            if (!Data.TargetComponent.IsValid())
            {
                ActivePoisonPool.RemoveAtSwap(i); // O(1) — no array restructure
                continue;
            }

            Data.TimeRemaining -= DeltaTime;
            UHealthAndStatusComponent* Comp = Data.TargetComponent.Get();
            Comp->CurrentHealth -= Data.DamagePerSecond * DeltaTime;
            Comp->OnTakeStatusDamage(Data.DamagePerSecond * DeltaTime, FName("Poison"));

            if (Data.TimeRemaining <= 0.0f)
            {
                Comp->ToggleStatusEffectVisual(FName("Poison"), false);
                ActivePoisonPool.RemoveAtSwap(i); // Remove expired
            }
        }
    }
};`} />
        </div>

        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Head Manager Subsystem</div>
          <CodeBlock code={`// CombatMasterSubsystem.h
UCLASS()
class UCombatMasterSubsystem : public UWorldSubsystem, public FTickableGameObject
{
    GENERATED_BODY()
public:
    virtual void Tick(float DeltaTime) override;
    virtual ETickableTickType GetTickableTickType() const override
        { return ETickableTickType::Conditional; }
    virtual bool IsTickable() const override { return !IsTemplate(); }
    virtual TStatId GetStatId() const override
        { RETURN_QUICK_DECLARE_CYCLE_STAT(UCombatMasterSubsystem, STATCAT_Advanced); }

    void RegisterEnemy(UHealthAndStatusComponent* Enemy);
    void UnregisterEnemy(UHealthAndStatusComponent* Enemy);

    UFUNCTION(BlueprintCallable, Category="Combat")
    void ApplyPoison(UHealthAndStatusComponent* Target, float DPS, float Duration);

private:
    TSet<TWeakObjectPtr<UHealthAndStatusComponent>> MasterEnemyRegistry;

    FPoisonWorker PoisonWorker;
    // FBurnWorker  BurnWorker;  // Add more workers here — zero refactor needed!
    // FProjectileWorker ProjectileWorker;
};

// CombatMasterSubsystem.cpp
void UCombatMasterSubsystem::Tick(float DeltaTime)
{
    PoisonWorker.TickPoison(DeltaTime);
    // BurnWorker.TickBurn(DeltaTime);
}

void UCombatMasterSubsystem::ApplyPoison(
    UHealthAndStatusComponent* Target, float DPS, float Duration)
{
    if (!Target || !MasterEnemyRegistry.Contains(Target)) return;

    // Refresh if already poisoned instead of stacking duplicates
    for (FPoisonData& Existing : PoisonWorker.ActivePoisonPool)
    {
        if (Existing.TargetComponent.Get() == Target)
        {
            Existing.TimeRemaining = FMath::Max(Existing.TimeRemaining, Duration);
            return;
        }
    }

    FPoisonData NewPoison{ Target, DPS, Duration };
    PoisonWorker.ActivePoisonPool.Add(NewPoison);
    Target->ToggleStatusEffectVisual(FName("Poison"), true);
}`} />
        </div>
      </div>
    </SectionCard>

    <SectionCard title="Context 2: Projectile & Ballistics Manager" icon={Zap} color={COLORS.status.info}>
      <p className="text-sm mb-3">If 50 arrows are each separate AActor instances with collision components, the CPU explodes. A Projectile Head Manager manages all ballistics as pure math in a flat array, then feeds positions to a single Instanced Static Mesh Component (ISMC) — one GPU draw call for all 50 arrows simultaneously.</p>
      <CodeBlock code={`struct FProjectileData
{
    FVector  Position;
    FVector  Velocity;
    float    Gravity;       // e.g. -980.0f (cm/s²)
    float    LifeRemaining;
    int32    InstigatorID;
    float    BaseDamage;
};

// In the ProjectileWorker::Tick():
Data.Position   += Data.Velocity * DeltaTime;
Data.Velocity.Z += Data.Gravity  * DeltaTime; // arc

// Then push all transforms to the ISMC in one batch:
ProjectileMeshISMC->UpdateInstanceTransforms(TransformArray, true);
// → Single draw call. 50 arrows. 0.01ms GPU cost.`} />
      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg text-xs text-slate-400">
        <strong className="text-blue-300">Multiplayer Note:</strong> The server runs the math worker authoritatively. Clients receive position snapshots and interpolate visually. Never trust the client for projectile hit detection — always validate on the server's math array.
      </div>
    </SectionCard>

    <SectionCard title="Context 3: Spatial Grid Hazard Manager" icon={Map} color={COLORS.status.warning}>
      <p className="text-sm mb-3">Area-of-effect zones (fire fields, oil puddles, blizzard areas) should never use <code className="text-amber-300">OnComponentBeginOverlap</code> — per-frame overlap checks on dozens of zones melt the physics thread. Instead, use a spatial grid hash.</p>
      <CodeBlock code={`// The world map is divided into an invisible 2D grid
// e.g. 256x256 grid cells, each 200x200 cm

// When a fire storm hits the ground:
FIntPoint GridCell = WorldToGrid(ImpactLocation); // ~O(1) math
HazardGrid[GridCell] = EHazardType::Fire;

// Every 0.5 seconds (not every frame!) the worker checks
// which registered characters occupy flagged cells:
FIntPoint CharCell = WorldToGrid(Comp->GetLocation());
if (HazardGrid.Contains(CharCell))
{
    ApplyBurnToTarget(Comp, BurnDPS, 3.0f);
}
// Cost: ~0.1ms for 500 entities vs 5-8ms via collision overlap events`} />
      <div className="mt-4 p-3 bg-amber-900/20 border border-amber-500/20 rounded-lg text-xs text-slate-400">
        <strong className="text-amber-300">Multiplayer Note:</strong> The grid state is owned exclusively by the server. Clients only receive visual confirmation (particle systems) via NetMulticast when a hazard is placed or expires. The tick rate can be server-throttled to 10Hz without any player-facing quality loss.
      </div>
    </SectionCard>

    <SectionCard title="Context 4: Global NPC World Simulation (The 4,800 Merchants)" icon={Users} color={COLORS.kingfisher.warm}>
      <p className="text-sm mb-3">The most powerful Head Manager application is simulating an <em>entire living world</em> — merchants traveling between towns, bandits patrolling roads, caravans following trade routes — without spawning a single 3D Actor for distant entities.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-black/20 rounded-lg border border-slate-700/30">
          <div className="text-xs font-bold text-emerald-400 mb-2">4,800 Global NPCs as Pure Data</div>
          <CodeBlock code={`struct FWorldNPCData
{
    int32     NPCID;
    FVector   CurrentPosition;  // World-space
    float     CurrentDistance;  // Progress along spline
    int32     CurrentSplineIdx; // Which road segment
    float     MovementSpeed;
    float     TerrainMultiplier; // 1.0=road, 0.4=swamp
};
// One flat TArray in the World Head Manager
// ~60 bytes × 4,800 NPCs = only 280 KB RAM`} />
        </div>
        <div className="p-3 bg-black/20 rounded-lg border border-slate-700/30">
          <div className="text-xs font-bold text-blue-400 mb-2">Per-Frame Math (Full World Tick)</div>
          <CodeBlock code={`void FWorldNPCWorker::TickNPCs(float DeltaTime)
{
    for (FWorldNPCData& NPC : ActiveNPCPool)
    {
        float AdvanceDist = NPC.MovementSpeed
            * NPC.TerrainMultiplier * DeltaTime;
        NPC.CurrentDistance += AdvanceDist;

        NPC.CurrentPosition =
            RoadSplines[NPC.CurrentSplineIdx]
            ->GetLocationAtDistanceAlongSpline(
                NPC.CurrentDistance,
                ESplineCoordinateSpace::World);
    }
    // Cost: ~0.4-0.6ms for 4,800 NPCs
}`} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { title: "Spawn Threshold", desc: "When the player enters 200m of an NPC data entry, the Head Manager spawns a 3D Actor and hands it the current position. The data entry becomes 'tracked by actor' and stops updating in the array.", color: "border-emerald-500/30 text-emerald-400" },
          { title: "Terrain Speed",   desc: "Each road segment has a terrain multiplier float. Highways = 1.0x. Muddy swamps = 0.4x. Mountain passes = 0.6x. The math is one multiply per NPC — negligible.", color: "border-blue-500/30 text-blue-400" },
          { title: "Time Skip Math",  desc: "Player was offline 2 hours? Instead of simulating 7,200 frames, run one equation: NewDistance = OldDistance + (Speed × TerrainMult × 7200). The world catches up instantly.", color: "border-amber-500/30 text-amber-400" },
        ].map(item => (
          <div key={item.title} className={`p-3 rounded-lg border ${item.color} bg-black/10`}>
            <div className={`text-xs font-bold mb-1 ${item.color.split(" ")[1]}`}>{item.title}</div>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/20 rounded-lg text-xs text-slate-400">
        <strong className="text-purple-300">Multiplayer Note:</strong> The global NPC simulation is server-authoritative. Clients only receive the spawned 3D Actor data when within relevancy range. The 4,800 data entries never replicate — only spawned Actors do, and only when relevant to at least one player connection.
      </div>
    </SectionCard>

    <SectionCard title="Context 5: The Math Behind Smooth Trajectories" icon={Map} color={COLORS.kingfisher.blue}>
      <p className="text-sm mb-4">Eliminating jagged pathing networks without blowing up the 16.7ms frame budget requires leveraging polynomials instead of stepped array distance tracking.</p>
      
      <MultiplayerImpact 
        gpu="0ms" 
        cpu="~0.48ms for 4.8k NPCs" 
        ram="~0.2MB (Spline Data)" 
        latency="0ms (Server Owned)" 
      />

      <FeatureMatrix 
        has={[
          "USplineComponent (Bézier Evaluation)",
          "GetLocationAtDistanceAlongSpline Node/C++"
        ]}
        missing={[
          "String Pulling / Smoothing algorithm on standard UE A* results (Must be hand-written via Catmull-Rom)",
          "Automatic switching between Pathfinding and Spline algorithms based on LOD."
        ]}
        howToUse="When far away, lock NPCs to standard Splines evaluating the Cubic Bézier formula. When close, use NavMesh Pathfinding, but run the result through Catmull-Rom String Pulling into an ORCA Local Avoidance loop."
      />

      <div className="space-y-6 mt-6">
        <div>
          <h4 className="text-white font-bold text-md mb-2 flex items-center gap-2">
             <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs">1</span> 
             The Math of a Real Curve (Cubic Bézier)
          </h4>
          <p className="text-sm text-slate-300 mb-3 leading-relaxed">
            When your 4,800 global data NPCs move along a curved road, the Head Manager evaluates a mathematical polynomial formula rather than counting straight steps. To find the exact 3D position of an NPC at any given moment, the engine uses the Bézier Formula:
          </p>
          <div className="p-4 bg-black/40 border border-slate-700/50 rounded-xl mb-4 overflow-x-auto text-center font-mono text-emerald-300 text-sm">
            B(t) = (1-t)³ P₀ + 3(1-t)² t T₀ + 3(1-t) t² T₁ + t³ P₁
          </div>
          <ul className="list-disc pl-5 text-sm text-slate-400 space-y-1 mb-4">
            <li><strong>P₀ and P₁</strong> are the start and end points of the road segment.</li>
            <li><strong>T₀ and T₁</strong> are the curved tangent handles you drew in the editor.</li>
            <li><strong>t</strong> is the percentage of completion along that segment (from 0.0 to 1.0).</li>
          </ul>
          
          <CodeBlock language="plaintext" code={`       [Tangent T0]             [Tangent T1]
           o                           o
          . .                         . .
         .   .                       .   .
[Point P0]    . . . . . . . . . . . .     [Point P1]
              ^
        (NPC Real Position at t = 0.5)`} />
        
          <p className="text-sm text-slate-300 my-4 leading-relaxed">
            When an NPC travels at 5 meters per second, the Head Manager simply updates their distance value. It calls a single C++ function:
          </p>
          <CodeBlock code={`FVector RealCurvedPosition = RoadSpline->GetLocationAtDistanceAlongSpline(CurrentDistance, ESplineCoordinateSpace::World);`} />
          <p className="text-sm text-slate-300 italic mt-3 leading-relaxed border-l-2 border-blue-500 pl-3">
            This returns the mathematically precise point on that smooth curve down to the millimeter. There are no straight lines, no jagged angles, and no approximations. It is a true, perfect curve.
          </p>
        </div>

        <div className="border-t border-slate-700/50 pt-6">
          <h4 className="text-white font-bold text-md mb-2 flex items-center gap-2">
             <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs">2</span> 
             Real Pathfinding vs. Spline Traversal
          </h4>
          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            It is important to distinguish how these two systems handle curves differently:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-black/20 border border-slate-700/50 rounded-xl">
              <h5 className="font-bold text-amber-400 text-sm mb-2 uppercase tracking-wide">Far Distance (The Spline)</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                When NPCs are far away, they are completely locked to your predetermined road networks. They use the smooth Bézier math shown above. This means they perfectly follow the curves of your mountain passes, wrapping tightly around cliffs and bending through valley roads exactly as you designed them.
              </p>
            </div>
            
            <div className="p-4 bg-black/20 border border-slate-700/50 rounded-xl">
              <h5 className="font-bold text-emerald-400 text-sm mb-2 uppercase tracking-wide">Local Pathfinding (The NavMesh)</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                When NPCs are close to the player and get into combat, they break off the roads. They navigate using the 3D NavMesh. A standard NavMesh path is a string of straight lines connecting polygons. A standard path looks like a jagged hexagon:
              </p>
              <div className="mt-3">
                <CodeBlock language="plaintext" code={`Standard Path:   [A]--->[B]--->[C]--->[D]  (Jagged)`} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl mt-4">
            <p className="text-sm text-slate-300 leading-relaxed">
              To turn those jagged path lines into real, organic curves, the Head Manager runs a path-smoothing algorithm called <strong>String Pulling</strong> or <strong>Catmull-Rom Spline Generation</strong> over the raw path.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed mt-2">
              It takes those rigid corner points (A, B, C) and dynamically calculates curved trajectories between them. When you feed those curved paths into your ORCA Local Avoidance loops, the NPCs precisely glide around circular fountains in a perfect arc, never turning at rigid angles.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-6">
          <h4 className="text-white font-bold text-md mb-2 flex items-center gap-2">
             <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs">3</span> 
             How Much Does This Real Curve Math Cost?
          </h4>
          <p className="text-sm text-slate-300 mb-3 leading-relaxed">
            Evaluating a cubic equation (t³) is slightly heavier than adding flat numbers, but modern CPUs have hardware-accelerated floating-point math units (FPUs) specifically designed to process polynomials instantly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-black/30 p-4 border border-slate-700/50 rounded-xl">
                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Single Point Spline Check</div>
                <div className="text-xl text-emerald-400 font-mono font-bold">~0.0001 ms</div>
                <div className="text-xs text-slate-500 mt-1">Evaluated on a modern CPU FPU</div>
             </div>
             
             <div className="bg-black/30 p-4 border border-slate-700/50 rounded-xl">
                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">4,800 Global NPCs</div>
                <div className="text-xl text-amber-400 font-mono font-bold">~0.48 - 0.6 ms</div>
                <div className="text-xs text-slate-500 mt-1">Per frame over the entire continent</div>
             </div>
          </div>
          
          <div className="mt-4 p-3 bg-emerald-900/20 border border-emerald-500/20 rounded-lg flex items-start gap-3">
             <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
             <p className="text-sm text-emerald-200/90 leading-relaxed">
               This fits comfortably within your 2.0ms budget, giving you a completely real, continuous, and flawlessly curved simulation world.
             </p>
          </div>
        </div>
      </div>
    </SectionCard>

    <SectionCard title="Context 6: Head Manager in a Multiplayer Server Context" icon={Globe} color={COLORS.status.success}>
      <p className="text-sm mb-3">In a dedicated server deployment, the Head Manager runs exclusively on the server. This is the correct architecture — the server owns all game-state math, clients only visualize results via replicated variables and RPCs.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Server-Side Head Manager</div>
          <ul className="space-y-2 text-xs text-slate-400">
            {[
              "Runs all math workers (Poison, Burn, Projectile, Hazard)",
              "Holds all entity registries",
              "Calls Component events (OnTakeStatusDamage) which trigger RepNotify replicated variables",
              "Has zero GPU footprint — runs headless",
              "Can tick at 30Hz or 60Hz independently of the render pipeline",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>{t}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Client Receives (Visuals Only)</div>
          <ul className="space-y-2 text-xs text-slate-400">
            {[
              { t: "Replicated Health float → OnRep_Health() updates UI",        ok: true },
              { t: "NetMulticast_PlayHitFX → spawns local particle effect",       ok: true },
              { t: "Status effect visual toggling via BlueprintImplementableEvent",ok: true },
              { t: "Never touches the math arrays directly",                       ok: false },
              { t: "Never calls ApplyPoison() — that is a server-only API",        ok: false },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className={item.ok ? "text-blue-400" : "text-red-400"} style={{ marginTop: 2 }}>
                  {item.ok ? "✓" : "✗"}
                </span>
                {item.t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <CodeBlock code={`// The replicated bridge between server math and client visuals:
UPROPERTY(ReplicatedUsing = OnRep_Health)
float CurrentHealth = 100.0f;

UFUNCTION()
void OnRep_Health()
{
    UpdateHealthBar();
    if (CurrentHealth <= 0.f) PlayDeathVFX();
}

// The Server Head Manager modifies CurrentHealth directly:
Comp->CurrentHealth -= Data.DamagePerSecond * DeltaTime;
// Unreal's replication system picks up the dirty property
// and pushes the delta to all relevant clients automatically.`} />
    </SectionCard>

    <SectionCard title="Decision Matrix: When to Use the Head Manager" icon={CheckCircle} color={COLORS.kingfisher.blue}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">✅ Use Head Manager When:</div>
          <ul className="space-y-2 text-xs text-slate-400">
            {[
              "System affects 20+ entities simultaneously (status effects, projectiles, hazards)",
              "Math must run every frame with low ms cost (ballistics, world simulation)",
              "You need O(1) removal without array restructuring (combat with rapid state changes)",
              "Building action RPGs (Diablo/Path of Exile style, 100+ on-screen enemies)",
              "Simulating a living world: merchants, patrols, caravans (4,800+ data NPCs)",
              "Server-side game state that clients only visualize (multiplayer-first)",
            ].map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 shrink-0">→</span><span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
          <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3">❌ Skip Head Manager When:</div>
          <ul className="space-y-2 text-xs text-slate-400">
            {[
              "Slow-paced games with 3-4 enemies maximum (Dark Souls, Witcher style)",
              "One-off interactions: quest NPCs, dialogue, shop transactions",
              "Door/chest/lever logic (simple OnInteract Blueprint is fine)",
              "UI systems — Slate/UMG are single-thread only, cannot be passed to workers",
              "Animation state machines — engine already optimizes these internally",
              "Any system running < 10x per game session (not worth the architectural complexity)",
            ].map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0">✗</span><span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4 p-3 bg-amber-900/20 border border-amber-500/20 rounded-lg text-xs text-slate-400">
        <strong className="text-amber-300">The Alternative (Slow-Paced Games):</strong> Use the <em>Component-Driven Passive</em> pattern instead. Give enemies a lightweight C++ component whose Tick runs at 0.1Hz when far away, ramping to full speed when the player is close. You get 90% of the performance benefit with 30% of the Head Manager's architectural complexity.
      </div>
    </SectionCard>

    <SectionCard title="Honest Downsides & Trade-offs" icon={ShieldAlert} color={COLORS.status.error}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: "Cognitive Overhead", severity: "High", color: "text-red-400",
            desc: "In a Blueprint, poisoning an enemy is three nodes. In the Head Manager, you must bridge Data (worker array) ↔ Visuals (component callbacks). Expect 3-4x more code per feature during initial setup.",
          },
          {
            title: "Rigid Rule Exceptions", severity: "Medium", color: "text-amber-400",
            desc: "Adding 'Chain Poison to Beast-type enemies at night' forces you to expose world state (time of day, monster type flags) into your pure math manager. Complex conditional rules fight the flat-data philosophy.",
          },
          {
            title: "Server-Visual Split", severity: "High", color: "text-red-400",
            desc: "If you mix math and visuals in the same manager initially, converting to multiplayer requires violent surgery: one manager becomes two (server math + client visuals). Design the split from day one.",
          },
        ].map(item => (
          <div key={item.title} className="p-3 bg-black/20 rounded-lg border border-slate-700/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold text-sm">{item.title}</span>
              <span className={`text-[9px] font-bold uppercase ${item.color}`}>{item.severity}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </SectionCard>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { label: "200 Blueprint enemies (status tick)", value: "10–15ms", color: "text-red-400",     sub: "CPU Game Thread" },
        { label: "200 Head Manager entries (status tick)", value: "~0.4ms", color: "text-emerald-400", sub: "CPU Game Thread" },
        { label: "4,800 NPC world simulation",           value: "~0.5ms", color: "text-emerald-400", sub: "CPU per frame" },
        { label: "50 arrow ISMC draw call",              value: "1 call",  color: "text-emerald-400", sub: "GPU draw calls" },
      ].map(item => (
        <div key={item.label} className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-4">
          <div className={`text-xl font-mono font-bold ${item.color}`}>{item.value}</div>
          <div className="text-[10px] text-slate-500 uppercase mt-1">{item.sub}</div>
          <div className="text-xs text-white mt-2 leading-tight">{item.label}</div>
        </div>
      ))}
    </div>

    <HighlightBox type="success">
      <strong>The Bottom Line:</strong> The Head Manager does not save RAM capacity — it saves CPU time by preventing the processor from idling while RAM hunts for scattered data. You trade a small amount of extra code complexity for up to a 30× reduction in per-frame combat calculation cost. For action RPGs, open-world simulations, or any multiplayer game where the server must process hundreds of simultaneous entities, it is not optional — it is the architectural foundation everything else builds on.
    </HighlightBox>


    {/* ════════════════════════════════════════════════
        NEW ADDITIONS — Open World RPG Systems
    ════════════════════════════════════════════════ */}

    <div className="pt-6 border-t-2 border-slate-700/60">
      <h2 className="text-xl font-bold text-white mb-1">Open World RPG — Full Systems Implementation</h2>
      <p className="text-slate-400 text-sm mb-6">
        The Head Manager pattern is the foundation. Everything below builds directly on it, extending the same data-oriented principles to cover every major system an open-world RPG requires at AAA scale.
      </p>
    </div>

    {/* ── LOD & Streaming ── */}
    <Collapsible title="System A: World Partition & Streaming LOD Manager" icon={Layers} color={COLORS.kingfisher.blue} badge="Critical">
      <HighlightBox type="info">
        <strong>The Problem:</strong> Unreal's default World Partition loads entire streaming cells synchronously on the game thread, causing hitches whenever a cell boundary is crossed. The solution is a custom Streaming Head Manager that pre-fetches cells asynchronously based on player velocity, and manages five LOD tiers as pure data flags — no Blueprint involved.
      </HighlightBox>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Five-Tier LOD Data Table</div>
          <CodeBlock code={`// StreamingTypes.h
enum class EEntityLODTier : uint8
{
    FullSim       = 0, // 0–150m  — AI, physics, anim, VFX
    ReducedSim    = 1, // 150–400m — AI only, no physics, LOD mesh
    DataOnly      = 2, // 400–800m — position math only, no Actor
    StaticGhost   = 3, // 800–2km  — last known position, frozen
    Unloaded      = 4, // >2km     — removed from all workers
};

struct FStreamedEntityData
{
    uint32         EntityID;
    FVector        LastKnownPosition;
    EEntityLODTier CurrentTier;
    float          DistanceToNearestPlayer;
    bool           bIsActorSpawned;
    AActor*        SpawnedActorPtr; // null when Tier >= DataOnly
};`} />
        </div>
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Velocity-Predictive Pre-fetch</div>
          <CodeBlock code={`// StreamingSubsystem.cpp — runs at 4Hz (every 0.25s)
void UStreamingHeadManager::TickStreaming(float Delta)
{
    FVector PlayerVel   = PlayerController->GetVelocity();
    FVector PredictedPos = PlayerPos + PlayerVel * 3.0f;
    // Look 3 seconds ahead at current travel speed

    for (FStreamedEntityData& E : EntityPool)
    {
        float Dist = FVector::Dist(PredictedPos, E.LastKnownPosition);
        EEntityLODTier NewTier = ClassifyTier(Dist);

        if (NewTier != E.CurrentTier)
            EnqueueTierTransition(E, NewTier); // async, no hitch
    }
}

// Tier transition is staggered: max 8 per frame to cap spike
void ProcessTransitionQueue()
{
    int32 Budget = 8;
    while (Budget-- > 0 && TransitionQueue.Num() > 0)
        ExecuteTransition(TransitionQueue.Dequeue());
}`} />
        </div>
      </div>

      <SectionCard title="Async Asset Loading Pattern" icon={HardDrive} color={COLORS.kingfisher.warm}>
        <p className="text-sm mb-3">Never call <code className="text-amber-300">StaticLoadObject()</code> or <code className="text-amber-300">LoadObject()</code> on the game thread — they block for 5–30ms. Always use <code className="text-emerald-300">UAssetManager</code> with async handles:</p>
        <CodeBlock code={`// Correct: Non-blocking async asset request
void UStreamingHeadManager::RequestActorSpawn(FStreamedEntityData& Entity)
{
    FSoftObjectPath MeshPath = GetMeshPathForEntity(Entity.EntityID);

    UAssetManager::Get().GetStreamableManager().RequestAsyncLoad(
        MeshPath,
        FStreamableDelegate::CreateLambda([this, EntityID = Entity.EntityID]()
        {
            // Called on game thread AFTER mesh is in memory — zero hitch
            SpawnActorForEntity(EntityID);
        }),
        FStreamableManager::AsyncLoadHighPriority
    );
}

// WRONG — never do this:
// UStaticMesh* Mesh = Cast<UStaticMesh>(StaticLoadObject(
//     UStaticMesh::StaticClass(), nullptr, TEXT("/Game/...")));
// → Blocks game thread for up to 30ms. Frame drop guaranteed.`} />
      </SectionCard>

      <MultiplayerImpact
        gpu="Up to -40% draw calls via tier gating"
        cpu="~0.3ms at 4Hz for 10,000 entities"
        ram="~3.2MB for 50,000 entity records"
        latency="Zero — client predicts locally"
      />
    </Collapsible>

    {/* ── AI Perception ── */}
    <Collapsible title="System B: Mass AI Perception & Threat Assessment Manager" icon={Eye} color={COLORS.status.warning} badge="Critical">
      <HighlightBox type="warning">
        <strong>Why Not Unreal's AIPerception Component?</strong> UE's built-in AIPerceptionComponent runs a separate overlap query per AI actor per sense (sight, hearing, damage). With 200 AI actors and 3 senses each, that's 600 overlap queries per tick. The Mass Perception Manager replaces all of them with one unified spatial database.
      </HighlightBox>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Unified Threat Record</div>
          <CodeBlock code={`// AIPerceptionTypes.h
struct FAIThreatData
{
    uint32   ObserverID;    // Which AI is perceiving
    uint32   ThreatID;      // Which entity is perceived
    float    SightAwareness;  // 0.0–1.0
    float    SoundAwareness;  // 0.0–1.0
    float    LastKnownTime;   // game time of last confirmed sighting
    FVector  LastKnownPos;
    bool     bLineOfSightCached; // recomputed once per 0.1s, not every frame
};

// One TArray<FAIThreatData> in the Perception Head Manager
// 200 AIs × 5 potential threats each = 1,000 records
// = ~80 KB total. Fits in L2 cache.`} />
        </div>
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Spatial Bucket Optimization</div>
          <CodeBlock code={`// Divide world into 500×500cm spatial buckets
// Only check sight between entities in adjacent buckets

void FPerceptionWorker::TickPerception(float Delta)
{
    // Step 1: Rebuild spatial buckets (0.05ms)
    RebuildSpatialBuckets(AllRegisteredEntities);

    // Step 2: For each AI, only evaluate threats in
    // its bucket + the 8 surrounding buckets (not ALL entities)
    for (FAIRecord& AI : AIPool)
    {
        TArray<uint32>& NearbyIDs =
            GetBucketNeighbors(AI.Position);

        for (uint32 ThreatID : NearbyIDs)
            EvaluateThreat(AI, ThreatID, Delta);
    }
    // 200 AIs, 500 total entities → ~0.2ms vs 8ms naive
}`} />
        </div>
      </div>

      <SectionCard title="Line-of-Sight as a Rate-Limited Batch Job" icon={Activity} color={COLORS.status.info}>
        <p className="text-sm mb-3">LineTrace calls are expensive (<code className="text-amber-300">~0.04ms each</code>). With 200 AIs potentially tracing every frame, that's 8ms in traces alone. The solution: batch all LOS requests into a 0.1-second rolling budget.</p>
        <CodeBlock code={`// LOSBatcher.h — processes N traces per frame to hit a time budget
struct FLOSRequest
{
    uint32   ObserverID;
    uint32   TargetID;
    FVector  From;
    FVector  To;
};

void FLOSBatcher::ProcessBudget(float MaxMs)
{
    double StartTime = FPlatformTime::Seconds();

    while (PendingRequests.Num() > 0)
    {
        double Elapsed = (FPlatformTime::Seconds() - StartTime) * 1000.0;
        if (Elapsed >= MaxMs) break; // Never exceed budget

        FLOSRequest Req = PendingRequests.Dequeue();
        FHitResult Hit;
        bool bBlocked = GetWorld()->LineTraceSingleByChannel(
            Hit, Req.From, Req.To, ECC_Visibility);

        // Write result back into the threat record
        UpdateSightCache(Req.ObserverID, Req.TargetID, !bBlocked);
    }
}

// Called from the Perception Head Manager tick:
// LOSBatcher.ProcessBudget(0.5f); // Never spend more than 0.5ms on LOS`} />
      </SectionCard>

      <div className="p-3 bg-slate-800/40 border border-slate-600/30 rounded-lg text-xs text-slate-400">
        <strong className="text-white">Behavior Tree Integration:</strong> When <code className="text-amber-300">SightAwareness &gt;= 0.8</code>, the Perception Manager sends a <code className="text-emerald-300">UAIMessage</code> to the AI's Behavior Tree blackboard (<code className="text-blue-300">TargetActor</code> key). The BT never polls; it only reacts to messages. This eliminates all BT service overhead for unaware AI.
      </div>
    </Collapsible>

    {/* ── Inventory & Economy ── */}
    <Collapsible title="System C: Flat-Array Inventory & Global Economy Manager" icon={Database} color={COLORS.status.success} badge="Important">
      <HighlightBox type="success">
        <strong>The Anti-Pattern:</strong> Storing inventory as <code className="text-emerald-300">TArray&lt;UInventoryItem*&gt;</code> (an array of UObject pointers) forces a UObject allocation per item, triggers GC pressure, and scatters item data across the heap. With 10 players each carrying 80 items, that's 800 heap allocations the garbage collector must track. Instead: flat structs, one array, zero GC overhead.
      </HighlightBox>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Flat Item Struct (No UObject)</div>
          <CodeBlock code={`// InventoryTypes.h
struct FInventorySlot
{
    int32   ItemDefID;      // Index into a global data table
    int32   Quantity;
    float   Durability;     // 0.0–1.0
    uint8   SlotIndex;
    bool    bIsEquipped;
    // Size: ~20 bytes. 80 slots = 1.6KB per player inventory.
};

// The global data table (loaded once at startup, read-only):
// DataTable: DT_ItemDefinitions
// Columns: Name, BaseDamage, Weight, MeshPath, IconPath, MaxStack
// Never replicate the DataTable — clients have a local copy.
// Only replicate the FInventorySlot array.

UPROPERTY(Replicated)
TArray<FInventorySlot> InventorySlots;
// ~1.6KB × 10 players = 16KB total replicated inventory state.
// Each dirty slot sends only a 20-byte delta to clients.`} />
        </div>
        <div>
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Economy Head Manager</div>
          <CodeBlock code={`// EconomySubsystem.h — tracks global supply/demand
struct FMarketListing
{
    int32   ItemDefID;
    int32   QuantityAvailable;
    float   BasePrice;
    float   CurrentPriceMultiplier; // driven by supply/demand
};

void UEconomySubsystem::TickEconomy(float Delta)
{
    AccumulatedTime += Delta;
    if (AccumulatedTime < 30.0f) return; // recalculate every 30s
    AccumulatedTime = 0.f;

    for (FMarketListing& Listing : MarketListings)
    {
        // Simple supply-demand curve:
        float Demand = GetRecentSalesVolume(Listing.ItemDefID);
        float Supply = Listing.QuantityAvailable;
        Listing.CurrentPriceMultiplier =
            FMath::Clamp(Demand / FMath::Max(Supply, 1.f), 0.5f, 3.0f);
    }
    // Broadcast price update to relevant merchant UI widgets
    OnMarketPricesUpdated.Broadcast();
}`} />
        </div>
      </div>

      <SectionCard title="Loot Table: Weighted Random Without Branching" icon={Shuffle} color={COLORS.kingfisher.warm}>
        <p className="text-sm mb-3">Classic loot tables use nested if-chains or switch statements. At scale (enemy death events firing 60× per second in a horde fight), these branch mispredictions add up. The optimal pattern pre-builds a cumulative weight array.</p>
        <CodeBlock code={`// Build once when the loot table asset loads:
struct FLootEntry { int32 ItemDefID; float CumulativeWeight; };

void ULootTableAsset::BuildCumulativeWeights()
{
    float Running = 0.f;
    for (FLootEntry& E : Entries)
    {
        Running += E.RawWeight;
        E.CumulativeWeight = Running;
    }
    TotalWeight = Running;
}

// On enemy death — branch-free O(log N) lookup via binary search:
int32 ULootTableAsset::RollItem() const
{
    float Roll = FMath::FRand() * TotalWeight;

    // std::lower_bound on the cumulative array — one binary search
    int32 Idx = Algo::LowerBound(Entries, Roll,
        [](const FLootEntry& E, float V){ return E.CumulativeWeight < V; });

    return Entries.IsValidIndex(Idx) ? Entries[Idx].ItemDefID : INDEX_NONE;
}
// 50 loot table entries → 6 comparisons max (log₂ 50 ≈ 5.6)
// vs naïve loop: up to 50 comparisons`} />
      </SectionCard>
    </Collapsible>

    {/* ── Quest & Narrative ── */}
    <Collapsible title="System D: Quest State Machine & Narrative Event Bus" icon={Navigation} color={COLORS.kingfisher.warm} badge="Important">
      <HighlightBox type="warning">
        <strong>The Blueprint Event Problem:</strong> Quest logic wired entirely in Blueprint Event Graphs creates spaghetti that breaks when objectives change. A data-driven quest state machine stores all quest progress as plain integers and strings in a flat struct, with transitions driven by a C++ event bus. Blueprints only handle visuals (journal UI updates, map markers).
      </HighlightBox>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Quest State Struct</div>
          <CodeBlock code={`// QuestTypes.h
enum class EQuestState : uint8
{ NotStarted, Active, Completed, Failed };

struct FQuestObjectiveData
{
    FName    ObjectiveID;
    int32    CurrentCount;
    int32    RequiredCount;
    bool     bIsCompleted;
};

struct FQuestRecord
{
    FName                          QuestID;
    EQuestState                    State;
    TArray<FQuestObjectiveData>    Objectives;
    float                          StartTime; // game time
    float                          CompletionTime;
    // ~200 bytes per quest. 100 active quests = 20KB total.

    bool AllObjectivesComplete() const
    {
        return Objectives.FindByPredicate(
            [](const FQuestObjectiveData& O){ return !O.bIsCompleted; })
            == nullptr;
    }
};`} />
        </div>
        <div>
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Event Bus (Zero Coupling)</div>
          <CodeBlock code={`// QuestSubsystem.h — the event bus
DECLARE_MULTICAST_DELEGATE_TwoParams(
    FOnQuestEvent, FName /*QuestID*/, FName /*EventTag*/);

UCLASS()
class UQuestSubsystem : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    // Any system fires events; the quest manager listens:
    FOnQuestEvent OnQuestEvent;

    void FireEvent(FName QuestID, FName EventTag)
    {
        OnQuestEvent.Broadcast(QuestID, EventTag);
    }

    // Called from anywhere (AI death, item pickup, area enter):
    // QuestSubsystem->FireEvent("Q_BanditCamp", "BanditKilled");
    // The quest manager handles the count internally.
    // The caller has zero knowledge of quest state.
};`} />
        </div>
      </div>

      <CodeBlock code={`// Objective progression — called from QuestSubsystem listener:
void UQuestSubsystem::HandleQuestEvent(FName QuestID, FName EventTag)
{
    FQuestRecord* Quest = ActiveQuests.FindByPredicate(
        [&](const FQuestRecord& Q){ return Q.QuestID == QuestID; });
    if (!Quest || Quest->State != EQuestState::Active) return;

    // Update matching objectives
    for (FQuestObjectiveData& Obj : Quest->Objectives)
    {
        if (Obj.ObjectiveID == EventTag && !Obj.bIsCompleted)
        {
            Obj.CurrentCount = FMath::Min(Obj.CurrentCount + 1, Obj.RequiredCount);
            Obj.bIsCompleted = (Obj.CurrentCount >= Obj.RequiredCount);
            OnObjectiveUpdated.Broadcast(QuestID, Obj); // → UI journal refresh
        }
    }

    if (Quest->AllObjectivesComplete())
    {
        Quest->State          = EQuestState::Completed;
        Quest->CompletionTime = GetWorld()->GetTimeSeconds();
        OnQuestCompleted.Broadcast(QuestID); // → Blueprint handles reward screen
    }
}`} />
    </Collapsible>

    {/* ── Save System ── */}
    <Collapsible title="System E: Binary Save System with Async Write & Checksum" icon={HardDrive} color={COLORS.status.error} badge="Critical">
      <HighlightBox type="error">
        <strong>The SaveGame UObject Trap:</strong> <code className="text-red-300">UGameplayStatics::SaveGameToSlot()</code> serializes to a binary archive on the game thread, blocking for 40–200ms depending on save size. In an open-world RPG, that stutter is unacceptable. The correct pattern: snapshot all save data to a flat struct buffer in &lt;1ms, then write to disk asynchronously on a background thread.
      </HighlightBox>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Save Data Snapshot Struct</div>
          <CodeBlock code={`// SaveTypes.h
struct FOpenWorldSaveData
{
    // Header
    uint32  SaveVersion    = 3;
    uint32  Checksum       = 0; // CRC32 of all following data
    int64   RealWorldTime;      // For offline time-skip math

    // Player
    FVector PlayerPosition;
    FRotator PlayerFacing;
    float   PlayerHealth;
    float   PlayerStamina;
    TArray<FInventorySlot> Inventory; // flat array, ~1.6KB

    // World State
    TArray<FQuestRecord>     ActiveQuests;
    TArray<uint32>           KilledNamedEnemyIDs; // bitfield cheaper
    TArray<FWorldNPCData>    NPCPositions;
    TMap<FName, bool>        GlobalFlags; // "TutorialDone", "GateBroken"
};
// Total for a typical save: 100–500KB depending on world complexity.`} />
        </div>
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Async Write Pattern</div>
          <CodeBlock code={`// SaveSubsystem.cpp
void USaveSubsystem::SaveGame(bool bAutoSave)
{
    // Step 1: Snapshot all state on Game Thread (<1ms)
    FOpenWorldSaveData Snapshot = BuildSaveSnapshot();

    // Step 2: Compute CRC32 checksum for corruption detection
    Snapshot.Checksum = FCrc::MemCrc32(
        &Snapshot, sizeof(Snapshot));

    // Step 3: Serialize to byte array (still on game thread, ~2ms)
    TArray<uint8> Bytes;
    FMemoryWriter Writer(Bytes);
    Writer << Snapshot;

    // Step 4: Hand off to background thread — game thread is free
    AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask,
    [Bytes = MoveTemp(Bytes), SlotName = GetSaveSlotPath(bAutoSave)]()
    {
        FFileHelper::SaveArrayToFile(Bytes, *SlotName);
        // Disk write happens here — completely off the game thread
    });
}`} />
        </div>
      </div>

      <div className="p-3 bg-slate-800/40 border border-slate-600/30 rounded-lg text-xs text-slate-400 mt-2">
        <strong className="text-white">Checksum Validation on Load:</strong> On <code className="text-emerald-300">LoadGame()</code>, deserialize the struct, then recompute CRC32 over the payload bytes (excluding the stored checksum field). If the values differ, the save file is corrupt — show the player a graceful "save data is corrupted, loading last backup" message and fall back to an auto-backup slot. Always maintain three rotating auto-save slots for this reason.
      </div>
    </Collapsible>

    {/* ── Dialogue & Interaction ── */}
    <Collapsible title="System F: Dialogue Graph & Interaction Subsystem" icon={Radio} color={COLORS.kingfisher.blue} badge="Important">
      <p className="text-sm text-slate-400">Dialogue is not combat — it does not need per-frame iteration. But it does need a clean data structure that supports branching, conditions, and voice line management without coupling to Blueprint.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Dialogue Node Data Asset</div>
          <CodeBlock code={`// DialogueTypes.h
struct FDialogueResponse
{
    FText    ResponseText;
    FName    NextNodeID;      // Jump to another node
    FName    RequiredFlag;    // "" = always available
    bool     bFlagValue;      // Must GlobalFlags[RequiredFlag] == bFlagValue
    FName    SetFlagOnChoose; // Set a world flag when player picks this
};

struct FDialogueNode
{
    FName                     NodeID;
    FName                     SpeakerID;      // "Innkeeper", "BanditChief"
    FText                     SpeakerLine;
    TSoftObjectPtr<USoundBase> VoiceLine;      // Async-loaded on demand
    TArray<FDialogueResponse> Responses;
    FName                     OnEnterEvent;   // Quest event to fire on arrival
};

// Stored in a UDataAsset → one flat TArray<FDialogueNode>
// The graph is just FNames pointing at each other.`} />
        </div>
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Interaction Subsystem</div>
          <CodeBlock code={`// InteractionSubsystem.cpp
// Runs at 4Hz — not every frame
void UInteractionSubsystem::TickInteractables(float Delta)
{
    AccumulatedTime += Delta;
    if (AccumulatedTime < 0.25f) return;
    AccumulatedTime = 0.f;

    FVector PlayerPos = GetPlayerPosition();

    // Find the single closest interactable within 3m radius
    IInteractable* BestTarget = nullptr;
    float          BestDist   = 300.0f; // 3m in cm

    for (IInteractable* Candidate : RegisteredInteractables)
    {
        float D = FVector::Dist(PlayerPos, Candidate->GetPosition());
        if (D < BestDist) { BestDist = D; BestTarget = Candidate; }
    }

    if (BestTarget != CurrentFocusTarget)
    {
        if (CurrentFocusTarget) CurrentFocusTarget->OnFocusLost();
        if (BestTarget)         BestTarget->OnFocusGained();
        CurrentFocusTarget = BestTarget;
    }
}`} />
        </div>
      </div>
    </Collapsible>

    {/* ── Weather ── */}
    <Collapsible title="System G: Procedural Weather & Environmental Systems Manager" icon={Wind} color={COLORS.status.info} badge="Optional">
      <HighlightBox type="info">
        <strong>Architecture Note:</strong> Weather is a great example of a system that looks like it needs Blueprint visual scripting but actually benefits from a math-only Head Manager backend. The weather manager drives pure float state (WindSpeed, RainIntensity, TemperatureC). Blueprints and Niagara systems just read those floats via parameter bindings.
      </HighlightBox>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Weather State (Interpolated)</div>
          <CodeBlock code={`// WeatherTypes.h
struct FWeatherState
{
    float RainIntensity;    // 0.0–1.0
    float WindSpeed;        // cm/s
    FVector WindDirection;  // normalized
    float FogDensity;       // 0.0–1.0
    float LightningProbability; // per 5s window
    float TemperatureC;
    float CloudCoverage;    // 0.0–1.0
    float SnowAccumulation; // 0.0–1.0 (landscape layer weight)
};

// WeatherSubsystem holds two states and lerps between them:
FWeatherState CurrentWeather;
FWeatherState TargetWeather;
float         TransitionDuration = 300.f; // 5-minute gradual change
float         TransitionElapsed  = 0.f;`} />
        </div>
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Gameplay Impact Worker</div>
          <CodeBlock code={`void FWeatherImpactWorker::TickImpact(
    float Delta, const FWeatherState& Weather)
{
    // Apply movement penalties to outdoor entities
    if (Weather.RainIntensity > 0.5f)
    {
        for (FAIRecord& AI : OutdoorAIPool)
        {
            // Wet ground slows movement
            AI.SpeedMultiplier = FMath::Lerp(
                1.0f, 0.7f, (Weather.RainIntensity - 0.5f) * 2.0f);

            // Rain masks AI hearing
            AI.HearingRangeMult = 1.0f - (Weather.RainIntensity * 0.4f);
        }
    }

    // Freeze standing water at low temp — update Physics Material
    if (Weather.TemperatureC < 0.f && !bIceApplied)
    {
        ApplyIcePhysicsMaterial(IcePhysMat);
        bIceApplied = true;
    }
}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
        {[
          { title: "Niagara Binding", color: "text-purple-400", desc: "Niagara systems read RainIntensity and WindSpeed directly via a User Parameter binding updated once per frame. No Blueprint middleman — the weather manager pushes to a shared UNiagaraParameterCollectionInstance." },
          { title: "Landscape Snow",  color: "text-blue-400",   desc: "SnowAccumulation drives a Landscape Layer Weight blend. At 0.8+ coverage, the landscape material blends to the snow layer. The weather manager calls SetLandscapeEditLayerWeight() asynchronously at 1Hz to prevent hitches." },
          { title: "Biome Zones",     color: "text-emerald-400", desc: "The world is divided into biome data zones (Desert, Tundra, Rainforest). Each zone has min/max target weather ranges. When the player crosses a zone boundary, the weather manager begins a new lerp toward that biome's weather profile." },
        ].map(item => (
          <div key={item.title} className="p-3 rounded-lg border border-slate-600/30 bg-black/20">
            <div className={`text-xs font-bold mb-1 ${item.color}`}>{item.title}</div>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </Collapsible>

    {/* ── Procedural Dungeons ── */}
    <Collapsible title="System H: Procedural Dungeon & Point-of-Interest Generator" icon={Grid} color={COLORS.status.warning} badge="Optional">
      <p className="text-sm text-slate-400 mb-3">Procedural dungeon generation in UE5 is most robust when separated into three phases: <strong>data generation</strong> (pure math, no Unreal objects), <strong>blueprint instantiation</strong> (place modules), and <strong>decoration pass</strong> (enemy spawns, loot, narrative hooks). Each phase runs independently and can be called over multiple frames to avoid hitches.</p>

      <CodeBlock code={`// Phase 1 — Pure data generation (no Unreal objects created yet)
// Can run on any thread, even a background task
struct FDungeonCell
{
    FIntPoint GridPos;
    EDungeonCellType Type; // Corridor, Room, Stairs, Boss, Empty
    int32 RoomID;          // Which room cluster this cell belongs to
    uint8 Connections;     // Bitmask: N=bit0, E=bit1, S=bit2, W=bit3
};

TArray<FDungeonCell> UDungeonGeneratorSubsystem::GenerateLayout(
    FIntPoint GridSize, int32 RoomCount, int32 Seed)
{
    FRandomStream Rand(Seed);
    TArray<FDungeonCell> Grid;
    Grid.SetNum(GridSize.X * GridSize.Y);

    // BSP partition into room rectangles
    TArray<FIntRect> Partitions = BSPSplit(GridSize, RoomCount, Rand);

    // Carve rooms and connect with corridors (pure integer math)
    for (const FIntRect& Room : Partitions)
        CarveRoom(Grid, Room);

    ConnectRooms(Grid, Partitions, Rand);     // Minimum spanning tree
    PlaceStairsAndBoss(Grid, Partitions, Rand);
    return Grid; // ~50ms for 100×100 grid on background thread
}

// Phase 2 — Instantiation (must be game thread, stagger over 10 frames)
void UDungeonGeneratorSubsystem::SpawnModulesFromLayout(
    const TArray<FDungeonCell>& Layout)
{
    for (const FDungeonCell& Cell : Layout)
    {
        if (Cell.Type == EDungeonCellType::Empty) continue;

        TSoftClassPtr<AActor> ModuleClass = SelectModule(Cell);
        FVector WorldPos = GridToWorld(Cell.GridPos);

        // Stagger: spawn max 20 modules per frame
        SpawnQueue.Enqueue({ ModuleClass, WorldPos,
            ConnectionsToRotation(Cell.Connections) });
    }
    GetWorld()->GetTimerManager().SetTimer(
        SpawnTimerHandle, this,
        &UDungeonGeneratorSubsystem::ProcessSpawnQueue, 0.05f, true);
}

// Phase 3 — Decoration (run after Phase 2 completes)
// Scatter enemies, chests, and quest hooks based on room roles
void UDungeonGeneratorSubsystem::DecorateRooms(
    const TArray<FDungeonCell>& Layout)
{
    for (const FIntRect& Room : CachedRooms)
    {
        ERoomRole Role = AssignRoomRole(Room); // Treasure, Combat, Puzzle
        SpawnRoomContents(Room, Role);
        // Fires QuestSubsystem events if this room is a quest dungeon
        if (Role == ERoomRole::QuestTarget)
            QuestSubsystem->FireEvent(ActiveQuestID, "DungeonRoomFound");
    }
}`} />
    </Collapsible>

    {/* ── Ability System ── */}
    <Collapsible title="System I: Custom Ability System (Lightweight GAS Alternative)" icon={Sword} color={COLORS.status.error} badge="Critical">
      <HighlightBox type="error">
        <strong>On Gameplay Ability System (GAS):</strong> Unreal's GAS is powerful but adds 30–50KB of overhead per actor, requires extensive setup, and abstracts CPU profiling behind 5+ layers of indirection. For a solo or small-team project, a custom flat-struct ability system gives you 90% of GAS's features at 10% of the complexity — and it integrates directly with your Head Manager.
      </HighlightBox>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Ability Data (Static Definition)</div>
          <CodeBlock code={`// AbilityTypes.h
struct FAbilityDefinition
{
    FName    AbilityID;
    float    ManaCost;
    float    StaminaCost;
    float    Cooldown;
    float    CastTime;
    float    Range;           // 0 = melee / self
    float    BaseDamage;
    bool     bRequiresTarget;
    bool     bIsChanneled;
    FName    ProjectileType;  // "" = instant hit
    FName    StatusEffectID;  // "Poison", "Burn", "" = none
    float    StatusDuration;
    // ~80 bytes. All 200 abilities = 16KB. One read from disk at startup.
};

// Runtime cast record (lives in the Ability Head Manager):
struct FActiveCast
{
    uint32   CasterID;
    FName    AbilityID;
    float    CastTimeRemaining;
    uint32   TargetID;        // 0 = AoE/self
    FVector  TargetLocation;  // For AoE abilities
};`} />
        </div>
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Cooldown Worker (Array of Structs)</div>
          <CodeBlock code={`// Cooldowns: flat array, ticked by the Ability Head Manager
struct FCooldownRecord
{
    uint32  EntityID;
    FName   AbilityID;
    float   TimeRemaining;
};

struct FCooldownWorker
{
    TArray<FCooldownRecord> ActiveCooldowns;

    void TickCooldowns(float DeltaTime)
    {
        for (int32 i = ActiveCooldowns.Num() - 1; i >= 0; --i)
        {
            ActiveCooldowns[i].TimeRemaining -= DeltaTime;
            if (ActiveCooldowns[i].TimeRemaining <= 0.f)
                ActiveCooldowns.RemoveAtSwap(i);
        }
    }

    bool IsOnCooldown(uint32 EntityID, FName AbilityID) const
    {
        return ActiveCooldowns.FindByPredicate([&](const FCooldownRecord& R){
            return R.EntityID == EntityID && R.AbilityID == AbilityID;
        }) != nullptr;
    }
};`} />
        </div>
      </div>

      <SectionCard title="Resource Pool System (Mana / Stamina / Rage)" icon={Activity} color={COLORS.status.info}>
        <p className="text-sm mb-3">Resource pools (mana, stamina, rage, heat, corruption) follow an identical pattern. One struct per resource type, one array in the Ability Head Manager, one tick method. No UObject, no component tick, no Blueprint overhead.</p>
        <CodeBlock code={`struct FResourcePool
{
    uint32  EntityID;
    float   CurrentValue;
    float   MaxValue;
    float   RegenRate;        // per second, can be negative (drain)
    float   RegenDelay;       // seconds after last spend before regen starts
    float   TimeSinceLastSpend;
    bool    bIsRegenEnabled;
};

void FResourceWorker::TickResources(float DeltaTime)
{
    for (FResourcePool& Pool : ActivePools)
    {
        Pool.TimeSinceLastSpend += DeltaTime;

        if (Pool.bIsRegenEnabled &&
            Pool.TimeSinceLastSpend > Pool.RegenDelay)
        {
            Pool.CurrentValue = FMath::Clamp(
                Pool.CurrentValue + Pool.RegenRate * DeltaTime,
                0.f, Pool.MaxValue);
        }
    }
}

bool FResourceWorker::SpendResource(uint32 EntityID, float Amount)
{
    FResourcePool* Pool = FindPool(EntityID);
    if (!Pool || Pool->CurrentValue < Amount) return false;
    Pool->CurrentValue        -= Amount;
    Pool->TimeSinceLastSpend   = 0.f; // reset regen delay
    return true;
}`} />
      </SectionCard>
    </Collapsible>

    {/* ── Threaded TaskGraph ── */}
    <Collapsible title="System J: Parallel Task Graph — Offloading Workers to Background Threads" icon={Server} color={COLORS.status.success} badge="Advanced">
      <HighlightBox type="success">
        <strong>When to Parallelize:</strong> Individual workers (PoisonWorker, CooldownWorker) are fast enough to stay on the game thread. But when you have 10+ workers each processing 1,000+ entities, the combined 60Hz tick budget becomes tight. UE5's TaskGraph lets you dispatch all workers simultaneously and join before the frame ends — effectively multiplying your CPU throughput by the number of physical cores.
      </HighlightBox>

      <CodeBlock code={`// CombatMasterSubsystem.cpp — parallel worker dispatch
void UCombatMasterSubsystem::Tick(float DeltaTime)
{
    // Launch all independent workers as parallel tasks
    // (workers that share no data can run simultaneously)

    FGraphEventRef PoisonTask = FFunctionGraphTask::CreateAndDispatchWhenReady(
        [this, DeltaTime]() { PoisonWorker.TickPoison(DeltaTime); },
        TStatId(), nullptr, ENamedThreads::AnyBackgroundThreadNormalTask);

    FGraphEventRef BurnTask = FFunctionGraphTask::CreateAndDispatchWhenReady(
        [this, DeltaTime]() { BurnWorker.TickBurn(DeltaTime); },
        TStatId(), nullptr, ENamedThreads::AnyBackgroundThreadNormalTask);

    FGraphEventRef ProjectileTask = FFunctionGraphTask::CreateAndDispatchWhenReady(
        [this, DeltaTime]() { ProjectileWorker.TickProjectiles(DeltaTime); },
        TStatId(), nullptr, ENamedThreads::AnyBackgroundThreadNormalTask);

    // Wait for all parallel tasks to complete before the frame ends
    // (must happen before any results are read by game thread)
    FGraphEventArray Tasks = { PoisonTask, BurnTask, ProjectileTask };
    FTaskGraphInterface::Get().WaitUntilTasksComplete(
        Tasks, ENamedThreads::GameThread);

    // Now safe to read results and update replicated variables
    FlushResultsToComponents();
}

// CRITICAL SAFETY RULE:
// Workers running in parallel MUST NOT access:
//  - UObject methods (not thread-safe)
//  - UWorld queries (physics, overlaps)
//  - Replicated variable writes
// Workers may safely READ FVector/float data from the flat arrays
// because each entry is owned by exactly one worker.`} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {[
          { title: "Thread Safety Checklist", color: "text-emerald-400", items: ["✓ Read/write only your own TArray entries", "✓ Use FPlatformAtomics for shared counters", "✓ Lock-free via non-overlapping data ownership", "✓ Write results to a local buffer, flush on game thread"] },
          { title: "What to Keep on Game Thread", color: "text-red-400", items: ["✗ All UObject method calls", "✗ Blueprint event dispatches", "✗ World queries (traces, overlaps)", "✗ Replicated property mutations"] },
          { title: "Profiling Parallel Work", color: "text-blue-400", items: ["→ stat ParallelFor in Unreal Insights", "→ Look for worker imbalance (one task 10× others)", "→ Ideal: all tasks finish within 1ms of each other", "→ Use Unreal Insights' Task Graph visualizer"] },
        ].map(item => (
          <div key={item.title} className="p-3 rounded-lg border border-slate-600/30 bg-black/20">
            <div className={`text-xs font-bold mb-2 ${item.color}`}>{item.title}</div>
            {item.items.map((t, i) => (
              <div key={i} className="text-xs text-slate-400 mb-1">{t}</div>
            ))}
          </div>
        ))}
      </div>
    </Collapsible>

    {/* ── Full Subsystem Map ── */}
    <Collapsible title="System K: Complete Subsystem Architecture Map" icon={Box} color={COLORS.kingfisher.warm} badge="Reference">
      <p className="text-sm text-slate-400 mb-4">How all subsystems connect. Each column represents a different USubsystem (UWorldSubsystem or UGameInstanceSubsystem). Arrows show direction of data flow — always downward, never circular.</p>

      <div className="bg-black/50 rounded-xl p-4 border border-slate-700/30 overflow-x-auto">
        <div className="min-w-[700px] space-y-3 font-mono text-xs">
          {/* Row 1 — Game Instance Subsystems */}
          <div className="text-[9px] text-slate-500 uppercase tracking-widest">Game Instance Subsystems (persist across level loads)</div>
          <div className="flex gap-2 flex-wrap">
            {[
              { name: "UQuestSubsystem",    color: "bg-amber-900/40 border-amber-500/30 text-amber-300"   },
              { name: "UEconomySubsystem",  color: "bg-purple-900/40 border-purple-500/30 text-purple-300"},
              { name: "USaveSubsystem",     color: "bg-red-900/40 border-red-500/30 text-red-300"         },
              { name: "UIInteractionSub",   color: "bg-blue-900/40 border-blue-500/30 text-blue-300"      },
            ].map(s => (
              <div key={s.name} className={`px-3 py-1.5 border rounded-lg ${s.color}`}>{s.name}</div>
            ))}
          </div>
          <div className="text-slate-500 text-center">↓ write world-persistent state</div>

          {/* Row 2 — World Subsystems */}
          <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-2">World Subsystems (created per level)</div>
          <div className="flex gap-2 flex-wrap">
            {[
              { name: "UCombatMasterSubsystem",   color: "bg-emerald-900/40 border-emerald-500/30 text-emerald-300"},
              { name: "UAbilitySubsystem",         color: "bg-rose-900/40 border-rose-500/30 text-rose-300"         },
              { name: "UStreamingSubsystem",       color: "bg-sky-900/40 border-sky-500/30 text-sky-300"            },
              { name: "UPerceptionSubsystem",      color: "bg-orange-900/40 border-orange-500/30 text-orange-300"   },
              { name: "UWeatherSubsystem",         color: "bg-indigo-900/40 border-indigo-500/30 text-indigo-300"   },
              { name: "UWorldNPCSubsystem",        color: "bg-teal-900/40 border-teal-500/30 text-teal-300"         },
              { name: "UDungeonGeneratorSubsystem",color: "bg-yellow-900/40 border-yellow-500/30 text-yellow-300"   },
            ].map(s => (
              <div key={s.name} className={`px-3 py-1.5 border rounded-lg ${s.color}`}>{s.name}</div>
            ))}
          </div>
          <div className="text-slate-500 text-center">↓ fire events / set replicated properties on Components</div>

          {/* Row 3 — Components */}
          <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-2">Actor Components (bridges to Blueprint visual layer)</div>
          <div className="flex gap-2 flex-wrap">
            {[
              { name: "UHealthAndStatusComponent", color: "bg-emerald-900/30 border-emerald-600/30 text-emerald-400" },
              { name: "UAbilityComponent",          color: "bg-rose-900/30 border-rose-600/30 text-rose-400"          },
              { name: "UInventoryComponent",        color: "bg-amber-900/30 border-amber-600/30 text-amber-400"       },
              { name: "UAIPerceptionBridge",        color: "bg-orange-900/30 border-orange-600/30 text-orange-400"    },
            ].map(s => (
              <div key={s.name} className={`px-3 py-1.5 border rounded-lg ${s.color}`}>{s.name}</div>
            ))}
          </div>
          <div className="text-slate-500 text-center">↓ trigger BlueprintImplementableEvents / RepNotify</div>

          {/* Row 4 — Blueprint Visual Layer */}
          <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-2">Blueprint / UMG Layer (visuals, sound, UI — no logic)</div>
          <div className="flex gap-2 flex-wrap">
            {["BP_EnemyCharacter", "BP_PlayerCharacter", "WBP_HUD", "WBP_QuestJournal", "BP_WeatherController"].map(name => (
              <div key={name} className="px-3 py-1.5 border border-slate-600/30 rounded-lg text-slate-300 bg-slate-800/30">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <HighlightBox type="warning" className="mt-4">
        <strong>The Golden Rule of This Architecture:</strong> Data flows in one direction — from Subsystems down to Blueprints. A Blueprint never calls a subsystem's private logic directly. It calls a <code className="text-amber-300">UFUNCTION(BlueprintCallable)</code> on the component, which delegates up to the subsystem's public API. This one-way contract is what makes the entire stack testable, serializable, and multiplayer-ready.
      </HighlightBox>
    </Collapsible>

    {/* ── Network Optimization ── */}
    <Collapsible title="System L: Multiplayer Network Optimization — Bandwidth & Relevancy" icon={Wifi} color={COLORS.status.info} badge="Advanced">
      <HighlightBox type="info">
        <strong>Default Unreal Replication is Expensive:</strong> With 64 players each owning 10 Actors, default replication broadcasts every dirty property to every connection every frame. At 60Hz with 64 players, that is a waterfall of redundant data. These optimizations cut bandwidth by 60–80% in a typical open-world RPG scenario.
      </HighlightBox>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Adaptive Network Update Rate</div>
          <CodeBlock code={`// Set per-actor based on distance to nearest player
void UStreamingSubsystem::UpdateNetworkRates()
{
    for (AActor* Actor : SpawnedActors)
    {
        float Dist = GetDistanceToNearestPlayer(Actor);

        float NetRate;
        if      (Dist < 300.f)  NetRate = 60.f; // nearby: full rate
        else if (Dist < 800.f)  NetRate = 20.f; // mid:    3× reduction
        else if (Dist < 1500.f) NetRate = 5.f;  // far:    12× reduction
        else                    NetRate = 1.f;  // very far: 60× reduction

        Actor->NetUpdateFrequency    = NetRate;
        Actor->MinNetUpdateFrequency = NetRate * 0.25f;
    }
    // Run this every 2 seconds — not every frame
}`} />
        </div>
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Push-Model Replication</div>
          <CodeBlock code={`// Enable Push Model in DefaultGame.ini:
// [/Script/Engine.GameNetworkManager]
// bUseAdaptiveNetUpdateFrequency=true

// In code: mark properties dirty ONLY when changed
// (instead of engine polling every property every tick)

#include "Net/UnrealNetwork.h"
#include "Net/Core/PushModel/PushModel.h"

// In the component, when health actually changes:
void UHealthComponent::SetHealth(float NewHealth)
{
    if (CurrentHealth == NewHealth) return;
    CurrentHealth = NewHealth;

    MARK_PROPERTY_DIRTY_FROM_NAME(
        UHealthComponent, CurrentHealth, this);
    // Replication system now knows EXACTLY which property
    // changed and sends only that delta. Zero polling overhead.
}`} />
        </div>
      </div>

      <SectionCard title="Relevancy Filtering — Never Send What the Client Can't See" icon={Eye} color={COLORS.status.warning}>
        <CodeBlock code={`// Override in your base enemy class:
bool ABaseEnemy::IsNetRelevantFor(
    const AActor* RealViewer,
    const AActor* ViewTarget,
    const FVector& SrcLocation) const
{
    // Never relevant if further than 2km
    if (FVector::Dist(GetActorLocation(), SrcLocation) > 200000.f)
        return false;

    // Never relevant if in a different dungeon floor
    if (CurrentFloorLevel != Cast<APlayerCharacter>(ViewTarget)->CurrentFloorLevel)
        return false;

    // Standard distance relevancy for everything within range
    return Super::IsNetRelevantFor(RealViewer, ViewTarget, SrcLocation);
}

// Also: set bAlwaysRelevant = false and bOnlyRelevantToOwner where appropriate
// Example: UI Actors, personal quest markers, inventory previews
// → Only the owning player ever receives updates for these.`} />
      </SectionCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {[
          { label: "Bandwidth without optimizations",     value: "~180KB/s",  color: "text-red-400"     },
          { label: "With adaptive rates + push model",    value: "~42KB/s",   color: "text-amber-400"   },
          { label: "With relevancy filtering added",      value: "~28KB/s",   color: "text-emerald-400" },
          { label: "Final saving vs baseline (64 players)",value: "−84%",     color: "text-emerald-400" },
        ].map(item => (
          <div key={item.label} className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-3">
            <div className={`text-lg font-mono font-bold ${item.color}`}>{item.value}</div>
            <div className="text-xs text-slate-400 mt-1 leading-tight">{item.label}</div>
          </div>
        ))}
      </div>
    </Collapsible>

    {/* ── Profiling & Debugging ── */}
    <Collapsible title="System M: Profiling, Debugging, and Console Commands" icon={Activity} color={COLORS.status.success} badge="Reference">
      <p className="text-sm text-slate-400 mb-4">The Head Manager pattern's flat arrays are exceptionally easy to profile. Unlike Blueprint spaghetti where cost is distributed across hundreds of Event Graphs, all CPU cost concentrates in a handful of named Tick functions you can instrument once.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">DECLARE_CYCLE_STAT in Every Worker</div>
          <CodeBlock code={`// Enables tracking in Unreal Insights & stat commands
DECLARE_CYCLE_STAT(TEXT("PoisonWorker::Tick"),
    STAT_PoisonWorkerTick, STATGROUP_Combat);

DECLARE_CYCLE_STAT(TEXT("ProjectileWorker::Tick"),
    STAT_ProjectileWorkerTick, STATGROUP_Combat);

void FPoisonWorker::TickPoison(float DeltaTime)
{
    SCOPE_CYCLE_COUNTER(STAT_PoisonWorkerTick);
    // ... your loop here
}

// In-game: type "stat Combat" in the console
// Renders live ms cost for each named stat group
// Type "stat startfile" → "stat stopfile" to capture
// an Unreal Insights session for offline analysis.`} />
        </div>
        <div>
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Debug Console Commands</div>
          <CodeBlock code={`// Register debug commands in your subsystem:
void UCombatMasterSubsystem::Initialize(FSubsystemCollectionBase& C)
{
    Super::Initialize(C);

#if !UE_BUILD_SHIPPING
    IConsoleManager::Get().RegisterConsoleCommand(
        TEXT("Combat.DumpPoisonPool"),
        TEXT("Dumps all active poison entries to log"),
        FConsoleCommandDelegate::CreateLambda([this]()
        {
            UE_LOG(LogTemp, Warning,
                TEXT("Active poison entries: %d"),
                PoisonWorker.ActivePoisonPool.Num());
            for (auto& D : PoisonWorker.ActivePoisonPool)
                UE_LOG(LogTemp, Log,
                    TEXT("  → DPS=%.1f Remaining=%.2f"),
                    D.DamagePerSecond, D.TimeRemaining);
        }));
#endif
}`} />
        </div>
      </div>

      <div className="mt-3 p-4 bg-slate-800/40 border border-slate-600/30 rounded-xl">
        <div className="text-xs font-bold text-white uppercase tracking-wider mb-3">Essential Console Commands for This Architecture</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { cmd: "stat Combat",               desc: "Live ms cost for all STATGROUP_Combat stats" },
            { cmd: "stat Game",                 desc: "Game thread breakdown — see all Tick costs" },
            { cmd: "stat Memory",               desc: "Heap allocations — verify array sizes" },
            { cmd: "memreport -full",           desc: "Full memory report, TArray sizes included" },
            { cmd: "net.ShowRelevancy 1",       desc: "Visualize actor relevancy radius in-world" },
            { cmd: "p.NetShowCorrections 1",    desc: "Show client-side position corrections" },
            { cmd: "t.MaxFPS 0",                desc: "Uncap framerate to see true CPU headroom" },
            { cmd: "r.streaming.PoolSize 2048", desc: "Set texture streaming pool to 2GB" },
          ].map(item => (
            <div key={item.cmd} className="flex items-start gap-2 text-xs">
              <code className="text-emerald-400 font-mono shrink-0 bg-black/40 px-1.5 py-0.5 rounded">{item.cmd}</code>
              <span className="text-slate-400">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </Collapsible>

    {/* ── Final Summary ── */}
    <div className="pt-6 border-t border-slate-700/50 space-y-4">
      <h2 className="text-lg font-bold text-white">Complete System Performance Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Combat: 200 status-effected enemies",    value: "~0.4ms",  color: "text-emerald-400", sub: "Game Thread" },
          { label: "Perception: 200 AI sight evaluations",   value: "~0.2ms",  color: "text-emerald-400", sub: "Budget-limited" },
          { label: "Streaming: 10,000 entity LOD updates",   value: "~0.3ms",  color: "text-emerald-400", sub: "4Hz cadence" },
          { label: "NPC World Sim: 4,800 entities",          value: "~0.5ms",  color: "text-emerald-400", sub: "Full frame tick" },
          { label: "Abilities: 500 active cooldown records",  value: "~0.05ms", color: "text-emerald-400", sub: "Game Thread" },
          { label: "50 ballistic projectiles (ISMC)",        value: "1 draw",  color: "text-emerald-400", sub: "GPU calls" },
          { label: "Quest event resolution",                 value: "<0.01ms", color: "text-emerald-400", sub: "Event bus" },
          { label: "Network bandwidth (64 players, optimised)", value: "~28KB/s", color: "text-emerald-400", sub: "Per player" },
        ].map(item => (
          <div key={item.label} className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-3">
            <div className={`text-base font-mono font-bold ${item.color}`}>{item.value}</div>
            <div className="text-[9px] text-slate-500 uppercase mt-0.5">{item.sub}</div>
            <div className="text-xs text-white mt-2 leading-tight">{item.label}</div>
          </div>
        ))}
      </div>

      <HighlightBox type="success">
        <strong>Architectural North Star:</strong> Every system in this guide follows the same three rules: (1) <em>Math lives in flat C++ structs, never in UObjects.</em> (2) <em>UObjects are bridges — they receive results and fire Blueprint events.</em> (3) <em>The server owns all state; clients own only pixels.</em> A codebase that never violates these three rules will profile cleanly, scale to any entity count, and convert to multiplayer without surgery.
      </HighlightBox>
    </div>

  </div>
);
