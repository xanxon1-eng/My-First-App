
import React, { useState } from 'react';
import { 
  CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, 
  Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, 
  Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, 
  Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, 
  TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, 
  Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, 
  Users, Clock, Sun, Settings, Grid, Network, Filter, FastForward, Key,
  Layers as LayersIcon, Search
} from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const AITab = () => (
  <div className="space-y-6">
    <PageHeader 
      title="World AI Simulation, Slicing & Scheduling" 
      subtitle="Architecting scalable Open-World NPC logic, virtualization layers, event-driven Behavior Trees, HTN planning, and grid-based perception to prevent Game Thread saturation in massive RPGs." 
    />
    
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">AAA Simulation Paradigm (Witcher 3 / PoE / BG3)</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Never calculate logic on entities that do not physically matter to the player at this exact millisecond. AI entities must fluidly transition between fully Rendered Actor, Simulated math spline, and fully Virtualized database ID. Every check must be asynchronous, buffered, or aggressively sliced.</p>
    </HighlightBox>
    
    <div className="flex flex-col gap-6">
      
      {/* 1. Virtualization */}
      <div id="ai-virtualization-lods">
        <SectionCard title="1. AI Virtualization Tiers (Simulation LOD)" icon={LayersIcon} color={COLORS.kingfisher.blue}>
          <p className="text-sm text-kingfisher-muted mb-3">
            Spawning 10,000 real <code>ACharacter</code> actors in a seamless world instantly collapses the Game Thread.
            We use <strong>Simulation LODs</strong> (Level of Detail) to offload actors into raw memory structures when out of sight.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-3">
            <li>
              <strong className="text-white">Tier 0: Fully Rendered (&lt; 60m):</strong> Real <code>ACharacter</code>, ticking animations, Recast Navmesh, full physics capsule. <em>(Cost: ~0.15ms per actor, up to 100 on screen)</em>
            </li>
            <li>
              <strong className="text-white">Tier 1: Mathematically Simulated (60m - 150m):</strong> Meshes are hidden. Pathing reverts to simple 2D spline curves (no obstacle avoidance). Animations are completely disabled via Significance Manager. Collision narrowed to a single sphere raycast. <em>(Cost: ~0.02ms per unit)</em>
            </li>
            <li>
              <strong className="text-white">Tier 2: Fully Virtualized (&gt; 150m):</strong> Actor is completely deleted from the World. Its stats, coordinates, inventory, and schedule exist only as a lightweight C++ <code>struct</code> (e.g., MassEntity) updated once every 5-10 seconds. When the player approaches, a new visual Actor is dynamically spawned and injected with this struct's state. <em>(Cost: ~0.001ms CPU, -450MB VRAM globally)</em>
            </li>
          </ul>
          <HighlightBox type="info" className="mb-3">
            <strong className="text-[11px] uppercase tracking-wider text-blue-300">Save State Serialization:</strong> Virtualized struct data is serialized instantly into memory chunks. If the player Quick-Saves, these contiguous structs are packed instantly to disk (0.5ms bottleneck), bypassing thousands of heavy UObject `Serialize` overrides.
          </HighlightBox>
          <MultiplayerImpact 
            gpu="-14.5ms (Culls millions of animated vertices and shadow cascade draws entirely)" 
            cpu="-9.8ms (Stops UCharacterMovementComponent, Anim Ticks, and Navmesh queries on Game Thread)" 
            ram="-350MB (Deleting redundant instances reclaims 1.5KB+ per unit; struct replacements take <32 bytes)" 
            latency="0ms" 
          />
        </SectionCard>
      </div>

      {/* 2. MassEntity / ECS */}
      <div id="mass-entity-ecs" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title="2. MassEntity (ECS) vs. UObject Overhead" icon={Database} color={COLORS.status.warning}>
          <p className="text-sm text-kingfisher-muted mb-3">
            Standard UE5 <code>AActor</code> and <code>UObject</code> instantiation is slow. They rely on scattered memory allocations (pointer chasing) and garbage collection tracking. In a PoE-style ARPG with 800+ enemies active, looping them kills L1/L2 CPU Cache.
          </p>
          <p className="text-sm text-kingfisher-muted mb-3">
            <strong>Data-Oriented Design (ECS)</strong> using Unreal's <code>MassEntity</code> breaks AI down into component Arrays (e.g., an array of generic Health floats, an array of Location vectors) processed by vectorized parallel systems.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-3">
            <li><strong>Contiguous Memory:</strong> CPUs fetch memory in 64-byte chunks. Array-based ECS guarantees cache hits (no L1 cache misses).</li>
            <li><strong>Parallelization:</strong> <code>MassMovementProcessor</code> can run 10,000 movement vectors on a background worker thread seamlessly.</li>
            <li><strong>Bypass Garbage Collection:</strong> <code>FMassEntityHandle</code> is just an integer ID. No GC stutter spikes ever.</li>
          </ul>
          <MultiplayerImpact 
            gpu="0ms" 
            cpu="-18.2ms under peak load (Iterating 10,000 entities drops from 22ms per frame down to 3.8ms on a 16-core CPU)" 
            ram="-125MB (Eliminates UObject header overheads and pointer tables)" 
            latency="Strips dynamic allocations, securing zero-jitter locksteps." 
          />
        </SectionCard>

        {/* 3. Event-Driven BTs */}
        <div id="event-bts">
          <SectionCard title="3. Event-Driven Behavior Trees" icon={Activity} color={COLORS.kingfisher.warm}>
            <p className="text-sm text-kingfisher-muted mb-3">
              By default, Unreal Behavior Tree (BT) services and Decorators constantly poll conditional states (e.g., "Is Health &lt; 20%?"). This O(N) ticking across 100 NPCs consumes over <strong>5.5ms CPU</strong>.
            </p>
            <p className="text-sm text-kingfisher-muted mb-3">
              <strong>Optimization:</strong> Use Observer aborts based on explicit Blackboard changes rather than relying on Tick polling.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-3">
              <li><strong>Event Senders:</strong> The C++ Health component pushes an event explicitly upon taking damage: <code>Blackboard-&gt;SetValueAsBool("IsDying", true)</code>.</li>
              <li><strong>Event Receivers:</strong> BT Decorator set to <code>Observer Aborts: Standard</code> instantly triggers a branch switch <em>only when notified</em> without ever ticking passively.</li>
            </ul>
            <MultiplayerImpact 
              gpu="0ms" 
              cpu="-4.2ms (Strips passive observer loops across hundreds of Tree executions)" 
              ram="-8MB (Drops BT execution stack memory overhead)" 
              latency="-2.5ms (Combat reactions feel sharper as they trigger explicitly on-hit rather than waiting for next AI tick)" 
            />
          </SectionCard>
        </div>
      </div>
      
      {/* 4. HTN vs BTs */}
      <div id="htn-vs-bt">
        <SectionCard title="4. Hierarchical Task Networks (HTN) vs. Behavior Trees" icon={ShieldAlert} color={COLORS.status.info}>
          <p className="text-sm text-kingfisher-muted mb-3">
            Traditional Behavior Trees (BTs) are purely reactive (Left-to-Right evaluation every frame). For complex RPGs like <em>Baldur's Gate 3</em>, reactive checking creates erratic, short-sighted AI and wastes massive CPU checking paths that fail halfway.
          </p>
          <p className="text-sm text-kingfisher-muted mb-3">
            <strong>Hierarchical Task Networks (HTN)</strong> are planning-based. They simulate a chain of potential actions into the future, modifying a "simulated world state", to find a valid route to a goal <em>before</em> executing standard logic.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/20 p-3 rounded-lg border border-kingfisher-border/30">
              <strong className="text-[11px] text-kingfisher-muted uppercase tracking-wider block mb-2">Behavior Tree</strong>
              <p className="text-xs text-white/80">Checks "Can I Attack?" every frame. If True, moves to enemy. Fails if blocked halfway. Recalculates completely.</p>
              <div className="mt-2 text-red-400 font-bold text-xs uppercase tracking-wider">High Game Thread Poll Cost</div>
            </div>
            <div className="bg-black/20 p-3 rounded-lg border border-kingfisher-border/30">
              <strong className="text-[11px] text-kingfisher-muted uppercase tracking-wider block mb-2">HTN Planner</strong>
              <p className="text-xs text-white/80">Calculates a full "Plan" (Move to X -&gt; Pick up explosive -&gt; Throw at player). Stores the Plan. Executes commands sequentially until physical state diverges.</p>
              <div className="mt-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">Deep Tactical Planning</div>
            </div>
          </div>
          <MultiplayerImpact 
            gpu="0ms" 
            cpu="-7.5ms (Plans are baked in background threads and executed blindly on the Main Thread for 5-10 seconds, stripping constant conditional evaluations)" 
            ram="+12MB (Requires storing dynamic string 'world states' and heuristic history buffers)" 
            latency="Adds async background planning latency (maybe 100ms before move), easily masked by 'thinking' animations." 
          />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 5. EQS Time-Slicing */}
        <div id="eqs-caching">
          <SectionCard title="5. Environment Query System (EQS) Caching" icon={Search} color={COLORS.status.successLight}>
            <p className="text-sm text-kingfisher-muted mb-3">
              Unreal's EQS generates grid points (e.g., to find cover) and runs traces against them. A complex query (finding a sniper spot evaluating line-of-sight and path distance) can take <strong>8.0ms+ CPU</strong> if executed synchronously during combat.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-3">
              <li><strong>Time-Slicing:</strong> Never execute EQS instantly. Spread the query over 3 frames (e.g., <code>Set Max Time Slice: 2ms</code>). The AI simply stands still 50ms longer.</li>
              <li><strong>Dynamic Point Caching:</strong> Generate global "Tactical Points" once at level load. Instead of checking 500 generated circle points dynamically, query distances to the nearest 10 pre-compiled NavLink smart objects.</li>
              <li><strong>Raycast Load Shedding:</strong> Limit visibility traces inside EQS to <code>AsyncTrace</code> channels, processing results on standard Task Graph Workers rather than blocking standard execution.</li>
            </ul>
            <MultiplayerImpact 
              gpu="0ms" 
              cpu="-6.8ms Hitches (Transfers brute-force search spikes to background threads)" 
              ram="-4MB (Avoids allocating temporary physics spheres dynamically)" 
              latency="0ms" 
            />
          </SectionCard>
        </div>

        {/* 6. Tick Slicing */}
        <div id="tick-slicing">
          <SectionCard title="6. Round-Robin Tick Slicing" icon={Clock} color={COLORS.kingfisher.blue}>
            <p className="text-sm text-kingfisher-muted mb-3">
              If 200 zombies decide to calculate an expensive path to the player on the exact same frame, it creates a massive 25ms stutter. 
              <strong>Tick Manager Subsystems</strong> slice workloads natively.
            </p>
            <p className="text-xs italic text-kingfisher-muted mb-3">Instead of ticking 100 AIs in 1 frame, we tick 20 AIs per frame over 5 frames.</p>
            <CodeBlock code={`// C++ Round Robin Setup
void FRoundRobinAI::Tick(float DeltaTime)
{
    // Total units: 500, Batch Size: 50
    int32 StartIdx = CurrentBatchIndex * 50;
    int32 EndIdx = StartIdx + 50;
    
    for (int32 i = StartIdx; i < EndIdx; ++i)
    {
        if (RegisteredAIs.IsValidIndex(i))
            RegisteredAIs[i]->EvaluateSlowPerception();
    }
    
    // Cycle frames seamlessly
    CurrentBatchIndex = (CurrentBatchIndex + 1) % TotalBatches;
}`} />
            <MultiplayerImpact 
              gpu="0ms" 
              cpu="-12.8ms Peak Hitches (Spreads a single 15ms spike into smooth 1.5ms overheads per frame)" 
              ram="-4MB" 
              latency="Adds negligible logical delay (~60ms to notice player) matching human vision limits." 
            />
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 7. Spatial Hashing */}
        <div id="spatial-hash">
          <SectionCard title="7. Spatial Hashing (O(1) Queries)" icon={Grid} color={COLORS.status.info}>
            <p className="text-sm text-kingfisher-muted mb-3">
              Checking "Who can I see?" via raw array loops &lt;O(N^2)&gt; or physics Multi-Sphere Traces is disastrous overhead for massive crowds.
            </p>
            <p className="text-xs text-kingfisher-muted mb-3">
               Implement an abstract <strong>TMap Spatial Grid</strong> (Cells 20x20m wide). When an enemy spawns/moves, they register their ID into cell <code>X,Y</code>. When querying targets, an NPC calculates its own cell index and immediately iterates <em>only</em> the adjacent 8 cell lists globally.
            </p>
            <MultiplayerImpact 
              gpu="0ms" 
              cpu="-8.1ms (Bypasses PhysX/Chaos broadphase overhead completely, eliminating bounding-box tests)" 
              ram="-15MB (Stores integers rather than heavy collision hulls)" 
              latency="0ms" 
            />
          </SectionCard>
        </div>

        {/* 8. Flow Fields */}
        <div id="flow-fields">
          <SectionCard title="8. Flow Field Vector Iteration vs A*" icon={Navigation} color={COLORS.kingfisher.warm}>
            <p className="text-sm mb-3 text-kingfisher-muted">
              Traditional <strong>A* Pathfinding</strong> runs 500 unique Graph traversals when 500 enemies path to one player.
            </p>
            <p className="text-xs text-kingfisher-muted mb-3">
              <strong>Flow Fields</strong> flip this. Apply Dijkstra outward from the local player location <em>once</em> to generate a direction-vector hash map. All 500 enemies read their exact local grid coordinates to find their directional heading instantly. Converts O(N) path-finding back to O(1) reads!
            </p>
            <CodeBlock code={`// Instantly retrieve pre-integrated vector
FVector2D FlowDir = Cells[(Y * GridWidth) + X].FlowDir;
Velocity = FlowDir * Speed;`} />
            <MultiplayerImpact 
              gpu="0ms" 
              cpu="-9.4ms (Drops crowd search times from 9.8ms down to a flat 0.4ms spatial read)" 
              ram="-24MB (Flow Fields store 2D vectors vs massive thread navigation nodes)" 
              latency="0ms" 
            />
          </SectionCard>
        </div>
      </div>

      {/* 9. Async NavMesh */}
      <div id="async-navmesh">
        <SectionCard title="9. Dynamic NavMesh & Async Generation" icon={FastForward} color={COLORS.kingfisher.blue}>
          <p className="text-sm text-kingfisher-muted mb-3">
            In seamless open worlds using World Partition, NavMesh bounds (Recast) must be streamed and dynamically generated when building structures or streaming tiles, which historically blocks the Main Thread (causing horrific 200ms freezes).
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-3">
            <li><strong>Async Builder Tasks:</strong> Enable <code>bAsyncNavBuild</code> in Project Settings. NavMesh tiles compute dynamically inside FTaskGraph background threads.</li>
            <li><strong>Data Chunks (NavData Streaming):</strong> Bake standard NavMesh completely offline. When a World Partition tile is loaded, stream the pre-compiled NavData byte array into memory rather than rebuilding collision nodes in real-time.</li>
            <li><strong>Nav Invokers:</strong> Attach standard <code>UNavigationInvokerComponent</code> only to active players, restricting dynamic Navmesh rebuild distances exclusively to a 3,000 unit radius around the camera, leaving the rest of the world dormant.</li>
          </ul>
          <MultiplayerImpact 
            gpu="0ms" 
            cpu="-110.0ms Hitches (Strips massive map-chunk collision rendering bounds delays)" 
            ram="-125MB (Only stores active tile logic in volatile memory)" 
            latency="Stops server rubber-banding completely during map traversal." 
          />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 10. NavMesh Cover Generators */}
        <div id="navmesh-cover-generators">
          <SectionCard title="10. NavMesh Cover Generators & Tactical Positioning" icon={Mountain} color={COLORS.kingfisher.warm}>
            <p className="text-sm text-kingfisher-muted mb-3">
              Standard MassEntity implementations require smart geometric raycasting to find cover in active combat, but reactive geometry traces on 500 enemies spike CPU severely.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-3">
              <li><strong>Procedural Cover Evaluation:</strong> Run an offline or load-time generator that raycasts across NavMesh edges to find discrete points (e.g., behind rocks, walls).</li>
              <li><strong>Baking Cover-Point Heuristics:</strong> Bake these points into global node networks (or a spatial hash grid) with pre-evaluated safety metrics (e.g. valid angles, crouch/stand height).</li>
              <li><strong>O(1) Tactical Fetch:</strong> MassEntities bypass reactive line traces during combat. They query their nearest node cell integer and extract a safe tactical position instantly, converting heavy physics overlap traces to immediate O(1) reads.</li>
            </ul>
            <MultiplayerImpact 
              gpu="0ms" 
              cpu="-14.5ms (Eliminates reactive raycasting combat traces across 500+ enemies)" 
              ram="+25MB (Storage for the pre-baked tactical navigation mesh grid)" 
              latency="0ms" 
            />
          </SectionCard>
        </div>

        {/* 11. Virtual Economy Slicers */}
        <div id="virtual-economy-slicers">
          <SectionCard title="11. Virtual Background Economy & Society Slicers" icon={GitBranch} color={COLORS.kingfisher.blue}>
            <p className="text-sm text-kingfisher-muted mb-3">
              RPG worlds depend on dynamic economies (merchants regenerating stock, factions fighting off-screen). Ticking these behaviors via standard game loops across 5,000 NPCs is impossible.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-3">
              <li><strong>Macro-Simulation Engine:</strong> Create a decoupled background time-slicing engine using basic UObject subsystems.</li>
              <li><strong>Deterministic Mathematical Projections:</strong> 5,000 dormant world NPCs exist entirely as lightweight data entries. To simulate an economy, you don't 'spawn' an NPC to travel and trade. You simply interpolate timestamps calculating deterministic projected outcomes (e.g. <code>`Goods = Base * TimeDelta`</code>) in a round-robin background thread slice.</li>
              <li><strong>Scale independent from Frame Rate:</strong> Process 100 economy entity math equations per frame asynchronously without single visual representation in the world.</li>
            </ul>
            <MultiplayerImpact 
              gpu="0ms" 
              cpu="-28.0ms (Bypasses rendering, animation, and standard actor ticking completely for the active background world)" 
              ram="-2.5GB (Prevents loading character meshes or logic controllers for the open world)" 
              latency="0ms" 
            />
          </SectionCard>
        </div>
      </div>

      <div id="ai-ceilings">
        <SectionCard title="Unreal Engine AI Feature Ceilings & Workarounds" id="ai-feature-ceilings" icon={Shield} color={COLORS.status.info}>
          <FeatureMatrix 
            has={[
              "Recast & Detour System (Best for Bosses/Hero units)",
              "Significance Manager module (To scale anim tiers down with distance)",
              "MassEntity (ECS framework for massive crowd physics)",
              "AIPerception (Provides built-in visual & hearing spheres)",
              "FTaskGraph implementations (for simple async offloading)"
            ]}
            missing={[
              "A native Hierarchical Task Network (HTN) implementation (must write your own C++ planner)",
              "Flow-Field pathfinding swarms out-of-the-box",
              "Out-of-the-box Simulation LOD state machines (actors have to be manually tracked and despawned)",
              "Non-stuttering synchronous EQS default configurations",
              "Data-oriented spatial hashing modules built securely outside of PhysX overlaps"
            ]}
            howToUse="Reserve Navmesh A*, EQS, and generic ticking controllers solely for 'Tier 0' (hero units and bosses). For huge ambients swarms (e.g. Witcher 3 Drowners, Baldur's Gate generic civilian crowds), heavily migrate logic locally: use 'MassEntity' ECS chunks to serialize positions, Flow Fields for paths, HTN for tactical planning over time, and time-slice any raycasting checks rigidly."
          />
        </SectionCard>
      </div>
      
    </div>
  </div>
);


