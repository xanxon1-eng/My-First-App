export interface OptimizationTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  gpuImpact: string;
  cpuImpact: string;
  ramImpact: string;
  vramImpact: string;
  latencyImpact: string;
  hasFeatures: string[];
  missingFeatures: string[];
  howToUse: string;
  concreteMsNumber: string;
}

export const OPTIMIZATION_KNOWLEDGE_BASE: OptimizationTopic[] = [
  {
    id: "pipeline",
    title: "16.7ms Pipeline Parallelism",
    category: "Architecture & CPU",
    description: "Understanding 60 FPS parallel engine architecture. Modern game engines process game logic, drawing commands, and GPU shading in a parallelized pipeline across frames. To hit a stable 60 FPS (16.67ms frame times), the Game Thread, Draw Thread, and GPU must each complete their respective work in under 13.5ms, leaving a 3.0ms hardware buffer.",
    gpuImpact: "Requires completion within 13.0ms. Driven by base pass depth, shadow maps, and screen processing.",
    cpuImpact: "Game Thread allocations must stay under 13.5ms. Processed on thread worker pools.",
    ramImpact: "Consumes ~142MB of buffer allocation memory to store Triple Buffered state frames safely.",
    vramImpact: "Uses +85MB of GPU Command Buffer states to cache draw dispatches between rendering threads.",
    latencyImpact: "Total hardware latency is 2-3 frames (~33ms to ~50ms) plus networking ping under 15ms.",
    hasFeatures: [
      "Task Graph Command Scheduler to auto-disperse Game threads to physical CPU cores.",
      "Asynchronous Draw/Render Thread decoupling allowing Game logic to run ahead of drawing.",
      "NullRHI execution parameters to completely strip rendering overhead on dedicated servers."
    ],
    missingFeatures: [
      "Built-in lock-free atomic gameplay templates (must wrap custom Tick Groups).",
      "Automated dynamic CPU/GPU matching bounds (resolution limits must be coded manually)."
    ],
    howToUse: "Assign Tick Groups (TG_PrePhysics, TG_DuringPhysics) to separate Task Graph priorities. Launch dedicated server containers with the '-NullRHI' command-line flag.",
    concreteMsNumber: "-5.5ms GPU via Dynamic resolution scaling / -6.0ms CPU Game Thread via parallelizing workers."
  },
  {
    id: "architecture",
    title: "CPU & RAM Memory Architecture",
    category: "Architecture & CPU",
    description: "Deep dive into L1, L2, and L3 cache-coherent memory layouts for open-world RPG systems. Memory latency (RAM fetch at ~100ns) is the hidden performance killer in modern AAA games. Witcher 3 and Baldur's Gate 3 process thousands of active items and stats. If these are scattered randomly across the heap, the CPU spends 95% of its time stalled waiting for RAM. We design contiguous memory layouts using custom struct packing.",
    gpuImpact: "Indirect. Cache-coherent CPU codes assemble Draw Calls faster, avoiding GPU starvation hitches.",
    cpuImpact: "Reduces Game Thread memory fetch stalls. Transforms memory access overhead from 8.2ms to under 1.4ms.",
    ramImpact: "Saves up to 12% overall System RAM by eliminating struct padding overhead.",
    vramImpact: "No direct VRAM impact; isolates physical CPU cache. Memory alignments reside strictly in system heap.",
    latencyImpact: "Reduces game processing micro-jitches, stabilizing frame latency variance to within 0.2ms.",
    hasFeatures: [
      "FMemory and FMemory_Alloca memory allocators optimized for linear scratchpad arrays.",
      "TArray heap allocations packing structures sequentially into contiguous slots.",
      "Fixed-size memory arenas (TInlineAllocator) to keep stack records close to the calling register."
    ],
    missingFeatures: [
      "Automated cache-miss profilers built into the compiler (requires external CPU samplers like Intel VTune).",
      "Automatic pointer sorting inside nested UCLASS arrays."
    ],
    howToUse: "Order member variables in USTRUCTs from largest memory foot print (p64 pointers, doubles) to smallest (bools, uint8) to eliminate compiler struct padding. Avoid loading scattered individual TMap queries inside Tick loops, opting for linear array iterations.",
    concreteMsNumber: "Drops CPU tick execution from 12.0ms to 4.5ms by eliminating L2 Cache-miss stalls."
  },
  {
    id: "mass_entity",
    title: "Mass Entity / ECS Rollout",
    category: "Architecture & CPU",
    description: "Data-Oriented design using Unreal's MassEntity framework to manage massive item pools, active ambient crowds, or thousands of trajectory calculations in Path of Exile style game loops. Moving away from heavy, heap-scattered Actors (AActor overhead is 1.5KB+ with physical transform hierarchies), MassEntity stores data in continuous memory chunks (Fragments), skipping Tick wrappers entirely.",
    gpuImpact: "+0.5ms GPU cost if drawing thousands of proxy meshes in close proximity.",
    cpuImpact: "Dramatically reduces CPU execution times. Renders over 10,000 entities in under 1.8ms CPU.",
    ramImpact: "Saves ~450MB of RAM. Compacts 10,000 entities into just 12MB of RAM, compared to 150MB using Actors.",
    vramImpact: "Allocates +40MB VRAM to manage Instance Static Mesh (ISM) transform tables on the GPU.",
    latencyImpact: "Massive CPU savings ensure smooth network ticks, dropping local latency bottlenecks to 0ms.",
    hasFeatures: [
      "MassProcessor pipeline dispatching parallel computations over contiguous arrays in worker threads.",
      "MassEntityTraits grouping data fragments cleanly into reusable archetype tables.",
      "State-tree logic controllers to execute decision chains for thousands of agents without Behavior Trees."
    ],
    missingFeatures: [
      "Standard physics colliders on Mass Entities. Collisions must be simulated using mathematical Hash Grids.",
      "No support for complex actor-level visual effects or animated bones on proxy agents."
    ],
    howToUse: "Install the MassEntity and MassCrowd plugins. Configure an Entity Archetype containing dynamic position, speed, and health fragments. Run MassProcessors to tick health and coordinates in parallel, and bind to Niagara/HISM components for drawing.",
    concreteMsNumber: "Speeds up crowd evaluation by 4.4ms CPU compared to regular AActors ticking."
  },
  {
    id: "head_manager",
    title: "Head Manager Pattern",
    category: "Architecture & CPU",
    description: "The Head Manager pattern decouples complex visual representation from gameplay simulation. RPG systems like Witcher 3 don't need highly complex physics/anim skeletal structures calculated on tick for far-away mobs. Decouple by running pure numeric stats simulations (health, position, target) on background threads, and only spawn physical Unreal Actors and meshes when the player gets within visual range.",
    gpuImpact: "Reduces GPU geometry rendering and skeletal skinning overhead in crowded areas by up to 50%.",
    cpuImpact: "Cuts Game Thread CPU animation and bone evaluation times by up to -6.5ms.",
    ramImpact: "Saves ~120MB System RAM. Offloads bloated actor definitions from memory for non-visible mobs.",
    vramImpact: "Saves up to 400MB VRAM by unloading complex proxy skeletal meshes, dynamic materials, and texture layers.",
    latencyImpact: "Ensures Dedicated Servers process world logic quickly without physical Actor dependencies.",
    hasFeatures: [
      "Level Streaming and World Partition to coordinate the activation and spawning of actors.",
      "Significance Manager to track visible screenspace coordinates and prioritize nearby components."
    ],
    missingFeatures: [
      "Automatic decoupled replication. Running raw stats without physical actors forces custom RPC proxy routing.",
      "Built-in data state serialization between proxy stats and final spawned structural meshes."
    ],
    howToUse: "Model characters into two records: a lightweight C++ structure holding standard statistics (FEnemyStats) and a heavy AActor (AEnemyVisual). Hold the raw stats in a World Subsystem. When the player approaches a coordinate, spawn the AEnemyVisual actor and map the stats pointer.",
    concreteMsNumber: "Saves 6.8ms of Game Thread CPU by throttling far-away mob meshes and anim calculations."
  },
  {
    id: "multithreading",
    title: "Multithreading & Async Tasks",
    category: "Architecture & CPU",
    description: "Moving heavy data operations (procedural generation, save file compression, complex target pathfinding, inventory DB parsing) off the Main Game Thread. The Game Thread must execute on a tight frame budget. Doing heavy synchronous operations causes noticeable frame drops or complete system halts.",
    gpuImpact: "None directly, but prevents GPU stalling while waiting for Draw Thread commands.",
    cpuImpact: "Fully utilizes modern multi-core CPUs. Distributes thread load to background worker processors.",
    ramImpact: "Requires +15MB RAM buffer size to manage concurrent thread stacks and task queues.",
    vramImpact: "None. Direct GPU memory must be manipulated strictly on the Render Thread.",
    latencyImpact: "Completely eliminates frame delays and network packet drops caused by Main Thread stalls.",
    hasFeatures: [
      "FRunnable thread abstraction wrappers to create persistent custom worker threads.",
      "AsyncTask and GraphTask APIs to queue short-lived tasks onto safe background threadpools.",
      "Lock-free double-buffered lists to push data back to the Game Thread safely."
    ],
    missingFeatures: [
      "Thread-safe UObject manipulation. Garbage collection and UProperties are strictly limited to the Game Thread.",
      "Automated critical section debugger in the editor (forces manual sync lock checks)."
    ],
    howToUse: "Wrap operations in an `AsyncTask(ENamedThreads::AnyBackgroundThreadSafeTask, [Data]() { ... });`. When completed, push results back to the Main Thread via `AsyncTask(ENamedThreads::GameThread, [Result]() { ... });`.",
    concreteMsNumber: "Reduces Main Thread freezes by -250ms when writing massive BG3-style save states."
  },
  {
    id: "cpp_optimal",
    title: "Optimal C++ Architectural Workflows",
    category: "Architecture & CPU",
    description: "Optimizing code structures for L1/L2 cache and compiler optimizations. Brute-force pointer chasing is extremely slow. We write contiguous memory blocks, restrict virtual function lookups in critical tic loops, utilize reference parameters instead of copies, and use inline functions for small mathematical operations.",
    gpuImpact: "Saves up to 1.2ms by resolving rendering matrices and transform data faster on the CPU.",
    cpuImpact: "Boosts execution speed of game calculations by 300% to 500% in loop operations.",
    ramImpact: "Minimizes stack allocations and heap garbage objects, improving memory footprint stability.",
    vramImpact: "None.",
    latencyImpact: "Drops tick execution variation to <0.1ms, eliminating intermittent micro-stutters.",
    hasFeatures: [
      "FORCEINLINE compiler instruction flags to skip frame call overhead for micro-getters.",
      "TStaticArray offering highly optimized stacked arrays with zero heap allocation costs.",
      "Struct memory copying using optimized SIMD-aligned block transfers."
    ],
    missingFeatures: [
      "Protection against unsafe raw C++ pointer misuse (requires manual use of smart pointer templates)."
    ],
    howToUse: "Use `const FVector&` instead of `FVector` in function parameters to avoid copying 12 bytes of coordinates. Mark standard math tick helper methods as FORCEINLINE. In critical loops, replace virtual overrides with direct template lookups.",
    concreteMsNumber: "Saves 3.5ms on Game Thread during dense Path of Exile combat sequences with overlapping hits."
  },
  {
    id: "network_physics",
    title: "Networking & Physics Sync",
    category: "Multiplayer & Netcode",
    description: "Managing physics simulation synchronicity in multiplayer RPGs. Real-time physics (ragdolls, dynamic debris, collision queries) is notoriously difficult to synchronize across players. Witcher 3 style physics must be simulated server-authoritatively to prevent hacking, while using client-side prediction to keep animations instantly responsive.",
    gpuImpact: "Requires +0.5ms GPU processing to render predicted physical meshes in dynamic coordinates.",
    cpuImpact: "Increases Server CPU load by simulating physics sweeps, while client reconciles predicted curves.",
    ramImpact: "Allocates +28MB RAM to hold history states for client rollback and server verification.",
    vramImpact: "Minor (+10MB) to cache simulated particle systems and impact geometries on local GPUs.",
    latencyImpact: "Ensures physics matches server state, eliminating rubber-banding for up to 150ms ping delay.",
    hasFeatures: [
      "Network Physics Prediction subsystem to log movement physics commands and simulate replays.",
      "Async Physics ticking running on a separate hardware thread to reduce Game Thread locking."
    ],
    missingFeatures: [
      "Deterministic physics out of the box (Chaos Physics runs semi-deterministically by default).",
      "Automatic client-only cosmetic ragdoll sync (ragdoll limbs are completely distinct locally)."
    ],
    howToUse: "Configure physics calculations to tick asynchronously via Project Settings -> Physics. Use Server-Authoritative prediction models inside character components to store client coordinates and blend correction histories in case of server rejection.",
    concreteMsNumber: "Restricts server tick costs to under 1.8ms while synchronizing 64 overlapping spells."
  },
  {
    id: "iris_replication",
    title: "IRIS Replication Engine",
    category: "Multiplayer & Netcode",
    description: "Migrating from legacy UE replication (FObjectReplicationManager) to the modern high-performance IRIS Replication Engine (introduced in UE5.1). Legacy replication scans every actor sequentially on the game thread (O(N) scaling), causing massive server CPU bottlenecking. IRIS processes connection scoping, data filtering, and serialization on separate parallel background threads, resulting in a dramatic performance leap.",
    gpuImpact: "0.0ms. IRIS is a dedicated CPU/Network engine subsystem.",
    cpuImpact: "Reduces Server CPU replication overhead by up to 70%. Moves replication entirely off the Main Thread.",
    ramImpact: "Requires +64MB RAM to cache replication states, dependency maps, and connection scopes.",
    vramImpact: "0.0ms.",
    latencyImpact: "Stabilizes network send rates, eliminating server-side tick delay spikes by over 80%.",
    hasFeatures: [
      "Dynamic Connection Scoping performing interest management on background parallel workers.",
      "Delta compression and packet prioritization decoupled from individual AActor ticks.",
      "Replication Groups to bundle related variables (e.g. inventory structures) into single serialization updates."
    ],
    missingFeatures: [
      "Easy Blueprint toggling. IRIS configurations require explicitly structured C++ replication descriptors."
    ],
    howToUse: "Configure `Network.UseIris=1` in the system config. Declare Replication Descriptors for your Custom UCLASS. Set up Replication Groups inside your Network subsystem to bundle active items and mobs.",
    concreteMsNumber: "Saves 5.9ms of server CPU tick times when synchronizing 100 active combat players."
  },
  {
    id: "world_partition",
    title: "World Partition Culling & Caching",
    category: "Multiplayer & Netcode",
    description: "Managing actor streaming and dynamic data transmission in massive open worlds like Witcher 3. Standard level streaming forces loading entire maps at once, causing memory spikes and network latency drops. World Partition divides the world into a grid of cells. Cells stream in and out automatically based on proximity, while 'Replication Dormancy' reduces network load for inactive objects.",
    gpuImpact: "Saves up to 4.5ms GPU rendering time by unloading distant geometric meshes, actors, and foliage.",
    cpuImpact: "Reduces Game Thread load by completely disabling updates and ticks for distant actors.",
    ramImpact: "Saves up to 1.8GB of System RAM by streaming only nearby active grid assets.",
    vramImpact: "Saves up to 2.2GB VRAM by aggressively caching texture mipmaps and streaming meshes.",
    latencyImpact: "Drops connection scoping times on servers. Keeps network ping under 25ms during rapid world exploration.",
    hasFeatures: [
      "Dynamic cell streaming grids dividing levels into interactive spatial slots.",
      "Actor NetDormancy (DORM_DormantAll) to halt client replication for unmutated items (chests, items).",
      "Grid Culling and HLOD (Hierarchical Level of Detail) to replace complex geometries with cheap proxies."
    ],
    missingFeatures: [
      "Automated server-side partition scaling matching network bandwidth parameters (must be tuned manually)."
    ],
    howToUse: "Enable World Partition in the level options. Group passive containers (chests, static decorations) into distant cells and set their NetDormancy to DORM_DormantAll. Call `ForceNetDormancy` when an inventory state changes.",
    concreteMsNumber: "Saves 4.2ms of Game Thread CPU and reduces local RAM consumption by 1.2GB in open terrain."
  },
  {
    id: "gi_caching",
    title: "Global Dynamic GI Caching",
    category: "Rendering & Graphics",
    description: "Building an offline probe grid system combined with runtime irradiance caching to bypass Lumen hardware raytracing costs. This is critical for scaling an open-world RPG like The Witcher 3 or Baldur's Gate 3 down to lower-end hardware and solo dev scopes. Pros: Reclaims massive GPU budgets, enabling 60fps on mid-range hardware. Cons: Requires authoring offline light builds and sacrifices real-time dynamic time-of-day accuracy.",
    gpuImpact: "Reduces Lumen raytracing overhead by up to -6.0ms on standard terrains.",
    cpuImpact: "Adds minor Game Thread overhead (+0.2ms) for interpolation probe fetching loops.",
    ramImpact: "Increases system heap by +65MB to hold static irradiance vectors.",
    vramImpact: "Requires +120MB allocation to store baked spherical harmonic texture grids.",
    latencyImpact: "Ensures smoother frame pacing by eliminating hardware ray traversal stalls.",
    hasFeatures: [
      "Lightmass static baking built-in for rigid offline environments.",
      "Precomputed Visibility Volumes natively mapping localized static bounds."
    ],
    missingFeatures: [
      "Dynamic day/night cycle integrations over pre-baked grids (custom probe blending algorithms must be authored).",
      "Seamless blending between Lumen high-end profiles and pre-cached irradiance fallbacks."
    ],
    howToUse: "Bake indirect lighting onto a sparse Volumetric Lightmap using CPU Lightmass. Switch dynamic objects to sample lighting from interpolation probes at runtime rather than executing hardware raytracing.",
    concreteMsNumber: "Restores -6.0ms GPU budget by replacing Lumen Hardware Raytracing with cached probe sampling in dense open environments."
  },
  {
    id: "draw_calls",
    title: "Draw Calls & Instancing",
    category: "Rendering & Graphics",
    description: "Optimizing the Draw Thread by batching static geometries. Witcher 3's Novigrad and Baldur's Gate 3's cities feature thousands of repeating objects (barrels, fences, lamps, stones). Sending each object individually, even with identical meshes, triggers a heavy API Draw Call on the CPU, starving the GPU. We use Instanced Static Meshes (ISM) and Hierarchical ISMs (HISM) to batch identical objects into a single Draw Call.",
    gpuImpact: "Improves GPU rasterization throughput. Avoids GPU waiting for command dispatches.",
    cpuImpact: "Reduces Draw Thread overhead from 9.4ms to under 2.1ms by combining visual entities.",
    ramImpact: "+12MB RAM storage allocation for instanced coordinate transform matrices.",
    vramImpact: "Saves up to 120MB VRAM by reusing GPU model vertex arrays instead of duplicating meshes.",
    latencyImpact: "Guarantees a stable Draw Thread, avoiding micro-stutter screen freezes.",
    hasFeatures: [
      "Dynamic Mesh Instancing automatically grouping identical static meshes into single draws.",
      "HISM support providing distance-based LOD transitions and parent culling for instanced groups."
    ],
    missingFeatures: [
      "Support for differing dynamic materials per instance (individual instances must share identical textures).",
      "Dynamic skinned bony animations on instanced groups (instances are strictly static meshes)."
    ],
    howToUse: "Replace standalone StaticMeshActors with a single InstancedStaticMeshComponent actor. Use HISMs for dense foliage systems to enable LOD transitions and cluster occlusion culling automatically.",
    concreteMsNumber: "Saves 7.3ms of Draw Thread CPU by batching 5,000 foliage and building items."
  },
  {
    id: "materials",
    title: "Material & Shader Optimizations",
    category: "Rendering & Graphics",
    description: "Creating highly performant pixel shaders for RPG terrains. Dynamic wind, grass swaying, and blended layers in Witcher 3-style woods require highly complex shader logic. Materials with heavy instruction counts (200+ instructions, multiple texture fetches, transparent blending cascades) cause severe GPU bottlenecking. We optimize materials by packing maps into vector channels, utilizing static switches, and locking dynamic vertex transformations at a distance via scalar loops.",
    gpuImpact: "Reduces base pass pixel shader execution times from 9.2ms to under 4.0ms on modern GPUs.",
    cpuImpact: "Saves Draw Thread parsing times during complex material instances setup.",
    ramImpact: "No direct impact on RAM.",
    vramImpact: "Saves up to 600MB VRAM by packing individual Roughness, Metallic, AO, and Height maps into single RGBA composite textures.",
    latencyImpact: "Guarantees a smooth GPU pipeline, avoiding screen tear and rendering lag.",
    hasFeatures: [
      "Material Parameter Collections enabling global variable updates (e.g., wind speed) across all shaders on a single write.",
      "Shared Samplers to exceed the standard DirectX 16-texture sampler limit safely.",
      "Material Quality Switches to strip complex instruction graphs on low-end hardware profiles."
    ],
    missingFeatures: [
      "Automatic Channel Packer. Textures must be composed in external tools (Photoshop, Substance Painter)."
    ],
    howToUse: "Pack textures: Red = Ambient Occlusion, Green = Roughness, Blue = Metallic, Alpha = Height. Disable dynamic vertex wind sway (e.g. World Position Offset) on distant assets (beyond 45 meters) by writing a distance-based scalar fade in the material graph.",
    concreteMsNumber: "Lowers baseline GPU rendering overhead by 5.2ms in dense grassland biomes."
  },
  {
    id: "postprocess",
    title: "Post-Process & Upscaling (TSR/DLSS)",
    category: "Rendering & Graphics",
    description: "Maximizing image quality while maintaining frame budgets in complex RPG scenes. Running games at native 4K resolution (8.3 million pixels per frame) is extremely demanding, often dropping frame rates below 30 FPS. We render the base pass at a lower resolution (e.g., 1080p, 2.07 million pixels) and use intelligent temporal upscaling methods like Unreal's Temporal Super Resolution (TSR), NVIDIA DLSS, or AMD FSR to upscale the image to 4K.",
    gpuImpact: "Saves up to 6.5ms GPU processing by drastically reducing base pass pixel shader loads.",
    cpuImpact: "Adds a slight CPU overhead (~0.1ms) to coordinate upscaling matrices on the Game Thread.",
    ramImpact: "Allocates +45MB RAM to hold temporal image cache buffers across sequential frames.",
    vramImpact: "Requires +120MB VRAM to store deep motion vectors and high-precision velocity charts on the GPU.",
    latencyImpact: "Guarantees faster frame completion, dropping output display lag by over 16ms.",
    hasFeatures: [
      "Temporal Super Resolution (TSR) native integration upscaling images elegantly in standard pipelines.",
      "PostProcessVolumes allowing granular contrast, color correction, and dynamic tone mapping rules."
    ],
    missingFeatures: [
      "Automatic profile adjustments. Scalability states must be connected to hardware profiles manually."
    ],
    howToUse: "Configure scalability groups: set `r.AntiAliasingMethod=4` to select native TSR. Use custom console commands (`r.TSR.History.ScreenPercentage=67`) to scale internal render resolutions dynamically based on scene complexity.",
    concreteMsNumber: "Boosts overall GPU output speeds by 5.0ms on 4K screens while preserving rendering detail."
  },
  {
    id: "collision",
    title: "Collision & Sweeping Traces",
    category: "Algorithm & Simulation",
    description: "Optimizing collision queries for high-frequency spell overlaps. In games inspired by Path of Exile, when 100+ spells hit a mob group, the CPU sweeps hundreds of bounding boxes. Under simple O(N^2) checks, this freezes the Game Thread. We leverage O(1) broadphase filtering, async Line Traces, and spatial hash triggers to manage high-rate intersections.",
    gpuImpact: "+0.1ms; minor draw thread checks for collider boundaries under debug states.",
    cpuImpact: "Reduces Game Thread trace logic from 8.8ms to under 0.9ms for overlapping spell groups.",
    ramImpact: "Consumes +16MB of contiguous heap to hold static and dynamic spatial hash colliders.",
    vramImpact: "0.0ms.",
    latencyImpact: "Guarantees that active combat actions resolve in the current frame, keeping ping stable.",
    hasFeatures: [
      "Overlap multi-threading support running tracing queries in parallel across worker task nodes.",
      "Trace Channels allowing custom, tight filtering to bypass passive scenery assets (trees, rocks)."
    ],
    missingFeatures: [
      "Self-balancing dynamic hash grids (hash cell sizes must be manual coordinates based on spell radius)."
    ],
    howToUse: "Create custom Physics Collision Channels. Move generic trace sweeps from synchronous tick checks to asynchronous triggers via `GetWorld()->AsyncLineTraceByChannel` callback listeners.",
    concreteMsNumber: "Reduces Game Thread Trace bottlenecks by 4.8ms under overlapping combat sequences."
  },
  {
    id: "npc",
    title: "Volumetric Flow Fields & Crowd AI",
    category: "Algorithm & Simulation",
    description: "Managing dense Novigrad-style crowds as seen in The Witcher 3. Standard Unreal Behavior Trees and Reciprocal Velocity Obstacles (RVO) cost up to 12.5ms CPU when managing 200+ agents. Each agent runs individual pathfinding queries continuously. We optimize this by using shared Volumetric Flow Fields: compiling a single vector grid direction pointing toward a target, and having all crowd agents read from it in O(1) speed.",
    gpuImpact: "+0.4ms to skin anim matrices for hundreds of characters on close screens.",
    cpuImpact: "Saves massive thread computation cycles. Reduces navigation costs from 10.2ms to under 1.6ms.",
    ramImpact: "Allocates +48MB RAM to hold static flow field grids and directional vector tables.",
    vramImpact: "None.",
    latencyImpact: "Ensures the main server processes world simulation ticks on time, avoiding movement jitters.",
    hasFeatures: [
      "MassCrowd navigation pipelines reading directional vector arrays inside continuous memory chunks.",
      "Detour Crowds to handle individual local pushing and dynamic avoidance."
    ],
    missingFeatures: [
      "Flow field path compilation for differing vertical tiers (e.g. spiral multi-level structures require separate grids)."
    ],
    howToUse: "Generate a vector-field navigation mesh representing paths to active targets. Have crowd managers query dynamic entity velocities by looking up coordinates on the shared mesh, avoiding individual paths.",
    concreteMsNumber: "Dashes Game Thread Crowd navigation costs by 6.2ms CPU while ticking 250 active actors."
  },
  {
    id: "ui_umg",
    title: "UMG UI Optimization & Invalidation",
    category: "Rendering & Graphics",
    description: "Eradicating Slate tick overhead for complex RPG HUDs. Baldur's Gate 3 features complex HUD panels showing multiple dynamic stat bars, active combat turns, and character slots. By default, UMG widgets recalculate layout matrices on every frame (pre-pass, layout, paint). We leverage UMG Invalidation Boxes to cache the widget geometry directly on the GPU, completely avoiding Slate CPU ticks unless a variable dirty flag triggers.",
    gpuImpact: "+0.2ms allocation step for GPU Slate cached vertex drawings.",
    cpuImpact: "Reduces UMG layout pre-passes from 4.8ms to under 0.2ms during passive screens.",
    ramImpact: "Consumes ~18MB to store widget hierarchies in active cache panels.",
    vramImpact: "+25MB to retain compiled Slate UI texture channels in VRAM cache.",
    latencyImpact: "Eliminated layout stutter peaks, leading to stable button press response under 10ms.",
    hasFeatures: [
      "Invalidation Box wrapper caching Slate drawings and skipping Tick pre-passes.",
      "Retainer Boxes to cache widget renders and update them only at lower rates (e.g. 30Hz inside 60Hz games)."
    ],
    missingFeatures: [
      "Automatic dynamic dirtying inside nested data bindings (must manually mark widgets as dirty)."
    ],
    howToUse: "Wrap static and dynamic UI blocks inside an Invalidation Box. Bind variable updates representing health, items, and spells to C++ Multicast Delegates, which trigger `Invalidate` calls only when values change.",
    concreteMsNumber: "Saves 3.5ms on Game Thread by keeping Slate rendering cached on the GPU."
  },
  {
    id: "subsystems",
    title: "Subsystems & Multicast C++ Delegates",
    category: "Architecture & CPU",
    description: "Eradicating expensive polling loops across thousands of Actors. Checking variables (e.g. checking player stance inside every tick of 200 mob actors) kills Game Thread throughput. We move dynamic states to C++ Multicast Delegates inside persistent, lightweight UWorld or UGameInstance Subsystems, allowing actors to sleep until an event explicitly signals them.",
    gpuImpact: "None.",
    cpuImpact: "Dramatically cuts CPU tick overhead. Reduces active ticking actor count by up to 90%.",
    ramImpact: "Saves up to 80MB RAM by replacing heavy tick-checking actors with event queues.",
    vramImpact: "0.0ms.",
    latencyImpact: "Massive drop in Game Thread overhead, eliminating frame pacing spikes and stabilizing performance.",
    hasFeatures: [
      "UWorldSubsystem static life cycle hooks managing safe global instances cleanly in C++.",
      "DECLARE_MULTICAST_DELEGATE macros declaring type-safe, multi-listener event channels."
    ],
    missingFeatures: [
      "Native visual delegates debugging in details panels (listeners must be tracked with debug logs)."
    ],
    howToUse: "Declare a world subsystem. Create delegates representing player state shifts (e.g. OnPlayerDied). Subscribe active mobs to this Delegate, disabling their standard tick loops completely.",
    concreteMsNumber: "Restores up to 4.2ms of CPU frame budget by converting ticking loops into event-driven architecture."
  },
  {
    id: "gc_clustering",
    title: "GC Clustered Reference Sweeping",
    category: "Memory & State Arch",
    description: "Preventing Garbage Collection framerate freezes in large RPGs. When a player opens a chest or loads a new zone, thousands of UObjects are created and discarded. The standard Unreal GC sweeps all UObjects sequentially (O(N)), resulting in a 10ms+ freeze. We construct 'GC Clusters' on boot: grouping related static asset arrays into single clustered blocks, completely skipping detailed GC sweeps.",
    gpuImpact: "None.",
    cpuImpact: "Reduces Garbage Collection sweeps from 12.2ms to under 1.1ms during active exploration.",
    ramImpact: "Requires +24MB RAM to store GC Cluster indexing matrices.",
    vramImpact: "None.",
    latencyImpact: "Guarantees zero micro-stutter spikes, eliminating GC hitching during exploration.",
    hasFeatures: [
      "Garbage Collection Clustering (FGCCluster) grouping UObject hierarchies sequentially.",
      "ForceGCReferencer structures to lock static visual components from GC sweep loops entirely."
    ],
    missingFeatures: [
      "Automatic dynamic cluster merging (must structure cluster definitions manually on load states)."
    ],
    howToUse: "Mark static game assets (such as visual map textures, passive level structures) as clustered using `CreateCluster` flags, allowing the garbage collector to skip scanning their inner properties.",
    concreteMsNumber: "Eradicates 8.5ms frame pacing hitches caused by standard garbage collection sweeps."
  },
  {
    id: "decoupled_backend",
    title: "Decoupled Server Backend & Save Serialization",
    category: "Memory & State Arch",
    description: "Preventing write-freezes during BG3-style saves or PoE item trading transactions. Writing large structures (such as player inventories with thousands of parameters and stats) directly to disk on the game thread freezes the game for up to 300ms. We offload these database writes and player state caches to an asynchronous background C++ node/redis worker queue.",
    gpuImpact: "None.",
    cpuImpact: "Saves up to 100% of Game Thread disk write-freeze cycles.",
    ramImpact: "+36MB RAM to cache the state arrays temporarily during worker transfers.",
    vramImpact: "None.",
    latencyImpact: "Completely eliminates save-game stuttering, stabilizing local thread times to under 1ms.",
    hasFeatures: [
      "FArchive C++ binary memory packers compiling complex hierarchies to micro-byte byte streams.",
      "Async File Writer APIs writing raw data directly to storage disks in background worker loops."
    ],
    missingFeatures: [
      "Integrated secure encryption. Save security must be manually handled using secure hash headers."
    ],
    howToUse: "Implement custom serialization overrides inside your USTRUCT databases using the `<<` stream operator. Offload the resulting byte array off the Game Thread to an asynchronous FRunnable thread helper.",
    concreteMsNumber: "Saves up to 250ms of Main Thread freezing during active world saves and item transactions."
  },
  {
    id: "physics_stepping",
    title: "Threaded Physics Sub-Stepping",
    category: "Algorithm & Simulation",
    description: "Decoupling complex physical collision, sweep queries, and skeletal ragdoll calculations to a dedicated asynchronous sub-stepped physics thread running lockstep with physical ticks. Witcher 3 style active debris and foliage colliders can congest the Game Thread if computed synchronously. Sub-stepping solves this by evaluating physics updates at higher rates inside partitioned time buffers.",
    gpuImpact: "Minor collision query debug renderer visualizer draw overhead (+0.1ms).",
    cpuImpact: "Saves up to 3.8ms CPU from the Game Thread by executing Chaos physics sweeps on async task graph workers.",
    ramImpact: "+18MB RAM allocation to maintain historical physics snapshot buffers for client backtracking.",
    vramImpact: "0.0ms.",
    latencyImpact: "Substantially stabilizes physics computation timing, eliminating movement packet jitters.",
    hasFeatures: [
      "Chaos Physics asynchronous ticking enabling decoupling of physics scenes from the main frame tick.",
      "SubStepping dynamic thresholds in Chaos enabling custom solver iteration counts for dense areas."
    ],
    missingFeatures: [
      "Automated thermal-throttling responsive scaling (physics rates must be lowered manually during high CPU load)."
    ],
    howToUse: "Enable Async Physics Tick in project parameters. Implement FPhysicsInterface structures inside customized physics loops. Adjust solver frequency thresholds using `UWorld::GetPhysicsScene()->SetSolverIterations()`.",
    concreteMsNumber: "Dashes Game Thread physics processing limits by 3.8ms during intensive explosions."
  },
  {
    id: "pso_cache",
    title: "PSO Caching & Pre-Compile (DX12/Vulkan)",
    category: "Rendering & Graphics",
    description: "Resolving severe DX12 and Vulkan rendering freezes ('stutters') during explosive combat or rapid camera pans. Drawing dynamic spell particles or new monster models triggers a runtime graphics pipeline compiling process. Compiling shaders on-the-fly stalls the CPU for up to 250ms. We construct a pre-compiled Pipeline State Object (PSO) cache during initial game loading screens.",
    gpuImpact: "Saves up to 250ms of major GPU block stutter spikes, guaranteeing frame completion under 16.7ms.",
    cpuImpact: "Reduces Game Thread material instance lookup and registration costs from 8.2ms down to 0.1ms.",
    ramImpact: "Utilizes +14MB of pre-allocated system memory to store compiled shader state descriptors.",
    vramImpact: "Requires +112MB of active graphics VRAM memory to register bound compiled pipeline layouts on boot.",
    latencyImpact: "Reduces local frame time variance (stdeviation) to under 0.1ms, eliminating stuttering micro-hitches.",
    hasFeatures: [
      "FShaderPipelineCache API managing compiled graphics pipeline states elegantly from memory disks.",
      "UE Command-Line PSO recording tools (-PSOFileCache) write state files during live playtests."
    ],
    missingFeatures: [
      "Automatic passive scanning inside Editor (developers must manually launch device tests to build stable caches)."
    ],
    howToUse: "Run standard device test builds with the '-RecordPSO' command parameter. Gather the output `.upipelinecache` lists, bundle them in the shipping layout directory, and trigger load states on game boot.",
    concreteMsNumber: "Eliminates DX12/Vulkan micro-hitch spikes of up to 250ms during dynamic spell casting."
  },
  {
    id: "sound_decoupler",
    title: "MetaSound Dynamic Auditory Prioritizer",
    category: "Algorithm & Simulation",
    description: "Eradicating heavy multi-source audio synthesis, mixing, and dynamic filtering overflows in crowded RPG environments. Simulating hundreds of combat spell sounds (fire flares, sword slashes, monster roars) can starve the CPU of dynamic mixing buses. We construct real-time MetaSound channels with dynamic prioritization bounds: de-prioritizing and muting distant and visually occluded acoustic emitters.",
    gpuImpact: "0.0ms. Complete auditory and mixing pipeline isolation.",
    cpuImpact: "Saves +1.4ms of Game Thread audio tick thread dispatch overhead in multi-target zones.",
    ramImpact: "Saves up to 32MB RAM by stream-loading PCM slices rather than caching full raw clips in memory.",
    vramImpact: "0.0ms.",
    latencyImpact: "Guarantees auditory buffers compile on schedule, avoiding frame pacing hiccups.",
    hasFeatures: [
      "MetaSounds procedural voice nodes utilizing modular graph execution trees in separate threads.",
      "Sound Concurrency volumes prioritizing nearby audio sources based on spatial range ratios."
    ],
    missingFeatures: [
      "Dynamic screenspace mesh occlusion weighting (dynamic structural obstacle occlusion must be ray-traced manually)."
    ],
    howToUse: "Declare a MetaSound graph of characters. Adjust priority weights using visual occlusion rates calculated from camera trace hits. Limit simultaneously playing channels via SoundConcurrency settings.",
    concreteMsNumber: "Saves 1.4ms of Game Thread main processing loop lines under massive crowd triggers."
  },
  {
    id: "server_protocol",
    title: "Full Authoritative Server Protocol",
    category: "Multiplayer & Netcode",
    description: "Enforcing absolute server-authority over state and transactions. Standalone local execution models are converted into headless Dedicated Server simulation nodes. By verifying every action with validation filters, systems prevent unauthorized client mutations.",
    gpuImpact: "0.0ms on server (headless NullRHI removes graphics context). +0.1ms client-side processing state packets.",
    cpuImpact: "Increases Server CPU load. Evaluates movement, combat logic, and verification routines in under 6.5ms.",
    ramImpact: "Server consumes ~1.2GB memory space to host deep replication lists and actor graphs in MMO headless environments.",
    vramImpact: "0.0ms (No VRAM impact since dedicated servers run headless).",
    latencyImpact: "Imposes up to 1 network tick delay (~16.7ms at 60Hz) which is fully masked by client prediction engines.",
    hasFeatures: [
      "Reliable and Unreliable Network RPC channels out-of-the-box in Unreal Engine.",
      "Automatically generated validation interfaces (_Validate function hooks) for server RPC verification.",
      "Connection-based Player State tracking to map client network ownership securely."
    ],
    missingFeatures: [
      "Native anti-cheat systems. Direct code injection checks must be handled by packaging external SDKs (EAC/BattlEye).",
      "Dynamic multiplayer matchmaking pools (must build a custom separate session hosting layer)."
    ],
    howToUse: "Declare RPC methods with 'WithValidation, Server' keywords. Enforce strict distance coordinates and state validation inside logical `_Validate()` implementations before applying character updates.",
    concreteMsNumber: "Validating input vectors server-side prevents hackers, maintaining reliable multi-client game ticks at 15.0ms."
  },
  {
    id: "deterministic",
    title: "Deterministic Frame Sync",
    category: "Multiplayer & Netcode",
    description: "Achieving execution parity across all hardware. Standard IEEE-754 floating-point calculations drift between compiler architectures (AMD vs. Intel). To build stable rollback netcode, the simulation must advance with fixed-timestep physics and fixed-point math representations.",
    gpuImpact: "0.0ms.",
    cpuImpact: "Reduces CPU Game Thread math calculations from 4.8ms to under 1.5ms by bypassing float-point register emulations.",
    ramImpact: "+14MB allocation size to record snapshot history tables and client-side replay buffers.",
    vramImpact: "0.0ms.",
    latencyImpact: "Restores local frame replication synchronicity, bringing ping variance close to 0.0ms.",
    hasFeatures: [
      "Chaos Physics Fixed-Timestep configuration parameters to force identical tick updates.",
      "Async Physics simulation threads decoupled from variable framerate visual threads."
    ],
    missingFeatures: [
      "Cross-platform float determinism. Unreal uses single-precision float structures by default. Fixed-point libraries must be custom crafted.",
      "Synchronized deterministic random number triggers (FMath::FRand is non-deterministic crossplay)."
    ],
    howToUse: "Enable fixed physics tick limits in Project Settings. Create an int64-based fixed-point representation for character coordinates. Utilize synchronized RNG seed instances to resolve random encounters on both client and server.",
    concreteMsNumber: "Locks simulation delta variation to 0.0ms, resolving multiplayer float discrepancies."
  },
  {
    id: "client_pred",
    title: "Client-Side Prediction & Interpolation",
    category: "Multiplayer & Netcode",
    description: "Eliminating immediate visual lag of client inputs. Playback response feels laggy if abilities wait for server confirmation. We execute visual and movement cues immediately locally, saving server coordinates on separate history grids, and apply smooth correction blends if server packet rejection happens.",
    gpuImpact: "+0.3ms to render active predictive trails, animations, and sound echoes.",
    cpuImpact: "-1.5ms Game Thread processing by interpolating remote proxies instead of checking server matrices directly.",
    ramImpact: "Requires +36MB heap memory size to cache character velocity, position, and input buffers.",
    vramImpact: "0.0ms.",
    latencyImpact: "-60ms to -120ms (Bypasses network roundtrip lag for the client's local game feel).",
    hasFeatures: [
      "Adaptive prediction built-in inside CharacterMovementComponent for movement ticks.",
      "Snapshot buffer history interpolation for remote client replication ticks."
    ],
    missingFeatures: [
      "Generic client-side prediction loops for non-character components (spells, doors, combat swings must be manual)."
    ],
    howToUse: "Design a circular queue archiving local character transforms and inputs with timestamps. Upon server rejection, snap character coordinate to last verified location and fast-forward simulate remaining predictive inputs.",
    concreteMsNumber: "-100% immediate interaction delay, shielding players from up to 250ms of network latency."
  },
  {
    id: "fast_array",
    title: "Fast Array Serializers",
    category: "Multiplayer & Netcode",
    description: "Delta-synced FFastArraySerializer structures replacing raw TArray replication, dropping network bandwidth dramatically during item transactions.",
    gpuImpact: "0.0ms.",
    cpuImpact: "Lowers server-side serialization thread load by 3.5ms on active network thread updates.",
    ramImpact: "Saves up to 18MB heap by preventing complete array re-allocation.",
    vramImpact: "0.0ms.",
    latencyImpact: "Limits network packet size, avoiding buffer congestion spikes and keeping latency under 35ms.",
    hasFeatures: [
      "FFastArraySerializerItem base parent structures carrying custom Replication IDs.",
      "NetDeltaSerialize algorithms optimized to find shifted array indexes."
    ],
    missingFeatures: [
      "Automatic handling of highly nested dynamic arrays within custom structures (must separate nested variables)."
    ],
    howToUse: "Inherit FFastArraySerializerItem inside custom structural item entries. Call MarkItemDirty on changes. Override NetDeltaSerialize inside parent array structs.",
    concreteMsNumber: "Compresses network replication packet sizes by 92% during intense combat loot updates."
  },
  {
    id: "interest_mgmt",
    title: "Interest Management Culling",
    category: "Multiplayer & Netcode",
    description: "Bandwidth throttling via dynamic replication culling. We configure Network Dormancy so that unchanged environmental containers consume zero packet checks, and set owned-relevancy so attachments inherit network status from their parent actors.",
    gpuImpact: "0.0ms.",
    cpuImpact: "Reclaims 4.2ms of server main thread loop processing by avoiding redundant actor scan checks.",
    ramImpact: "+12MB allocation size to hold interest grids and replication graph tracking lists.",
    vramImpact: "0.0ms.",
    latencyImpact: "Cuts peer packet loss to 0%, maximizing bandwidth capacity for critical combat events.",
    hasFeatures: [
      "Actor Dormancy flags (DORM_Initial, DORM_DormantAll) to halt network update sweeps.",
      "bNetUseOwnerRelevancy allowing attached child actors to share parental replication scoping."
    ],
    missingFeatures: [
      "Dynamic relevance scaling matching client bandwidth capacity (must be manually written inside custom net drivers)."
    ],
    howToUse: "Set NetDormancy to DORM_Initial for chests and static interactive world objects. Call FlushNetDormancy from C++ to push inventory changes when opened.",
    concreteMsNumber: "Recovers 4.2ms server ticking budget under heavy environments by sleeping 85% of inactive interactive actors."
  },
  {
    id: "asset_manager",
    title: "Asset Manager Chunk & Async Loading",
    category: "Architecture & CPU",
    description: "Explicit Primary Asset distribution grids and asynchronous load streams to bypass frame-drop stalls during level streaming and exploration.",
    gpuImpact: "0.0ms (Avoids GPU stalls waiting for CPU thread allocation).",
    cpuImpact: "Reduces Game Thread load spikes by 12.0ms, avoiding frame-drop freezes while crossing boundaries.",
    ramImpact: "Caches asset records in memory securely under a StreamableManager.",
    vramImpact: "Reduces VRAM consumption by 1.2GB by unloading unreferenced regional character meshes and textures.",
    latencyImpact: "0.0ms.",
    hasFeatures: [
      "Centralized AssetManager engine structures with PrimaryAssetId matching tags.",
      "StreamableManager supporting asynchronous memory loading callbacks."
    ],
    missingFeatures: [
      "Automated unused asset reference garbage collection (references must be cleared manually)."
    ],
    howToUse: "Define items and weapons as Primary Data Assets. Load assets asynchronously using `LoadPrimaryAsset` and configure chunk mapping files inside project packaging settings.",
    concreteMsNumber: "Eradicates 15.0ms Game Thread loading stutters by streaming asset pak chunks asynchronously in background processes."
  },
  {
    id: "memory_state",
    title: "Memory & State Arch",
    category: "Architecture & CPU",
    description: "Rigorous state management and heap packing. Standard AAA open world systems manage massive actor state queues. We layout memory packing patterns, Order fields to prevent structural compilers alignment gaps, and leverage fixed arenas to eliminate random allocations.",
    gpuImpact: "0.0ms.",
    cpuImpact: "Resolves memory access delays, reducing CPU execution times by 4.5ms during main update loops.",
    ramImpact: "Saves up to 15% System RAM by eliminating compiler alignment struct padding.",
    vramImpact: "0.0ms.",
    latencyImpact: "Zeroes out micro-hitch delays, maintaining continuous frame execution paces.",
    hasFeatures: [
      "FMemory heap allocator wrappers built inside Unreal Engine.",
      "TInlineAllocator enabling small array indexing strictly on local stack memory layers."
    ],
    missingFeatures: [
      "Automated structural packing optimizer. Developers must manually align fields from largest to smallest memory size."
    ],
    howToUse: "Arrange member variables in custom structures: place pointers and large double numbers first, floats next, and boolean registers last to prevent compiler-enforced struct packing gaps.",
    concreteMsNumber: "Speeds up C++ structure parsing loops from 6.0ms down to 1.5ms by matching compiler L1/L2 cache shapes."
  },
  {
    id: "gpu",
    title: "GPU Geometry & Nanite",
    category: "Rendering & Graphics",
    description: "Modern virtualized geometry pipeline. Traditional LOD meshes cause visible visual popping and high CPU draw call preparation queues. Nanite renders micro-polygon triangles directly, resolving CPU-side culling and batching overhead entirely.",
    gpuImpact: "-4.5ms GPU processing in dense geometric environments by optimizing vertex rasterization.",
    cpuImpact: "Saves up to -5.0ms Draw Thread preparation calculations by moving mesh culling to the GPU.",
    ramImpact: "Requires +120MB System RAM to keep Nanite spatial streaming trees loaded.",
    vramImpact: "Uses +450MB graphics memory to store Nanite virtualized texture and vertex buffer coordinates.",
    latencyImpact: "Improves rendering pipeline stability, keeping frame times balanced.",
    hasFeatures: [
      "Nanite virtualized geometry engine streaming micro-triangles at runtime.",
      "Built-in rasterization fallbacks for older hardware devices."
    ],
    missingFeatures: [
      "Support for complex skinned bony assemblies (skeletal meshes are incompatible with Nanite in current engine iterations).",
      "Dynamic voxel deformers (meshes are static representations)."
    ],
    howToUse: "Enable Nanite in the settings of your Static Mesh asset. Configure cull distances and leverage Nanite streaming pools to balance graphics memory budgets.",
    concreteMsNumber: "Reclaims 5.0ms CPU and 4.5ms GPU by shifting massive open terrain geometry processing directly into virtualized hardware pipelines."
  },
  {
    id: "lod",
    title: "LOD Systems",
    category: "Rendering & Graphics",
    description: "Distance-based geometric culling. Highly complex meshes are rendered as detailed models near the player, but are automatically swapped with cheaper low-resolution proxies as distance grows.",
    gpuImpact: "Saves up to 3.8ms GPU rendering in open areas by culling billions of redundant polygons.",
    cpuImpact: "Reduces Draw Thread evaluation times by -1.8ms per frame in dense regions.",
    ramImpact: "+48MB buffer space to store multiple geometric levels in memory.",
    vramImpact: "Saves up to 550MB of VRAM by unloading rich LOD0 vertex lists for far-away objects.",
    latencyImpact: "0.0ms.",
    hasFeatures: [
      "Auto-generated LOD systems built inside the Static Mesh Compiler.",
      "Screen-size threshold metrics regulating LOD transitions automatically."
    ],
    missingFeatures: [
      "Deterministic visual blending between LOD stages (causes visual popping unless custom dithering materials are wrapped)."
    ],
    howToUse: "Open static mesh parameters, configure the LOD Group (e.g. Foliage, LargeProp), set custom screen sizes, and enable dithered LOD transition material parameters inside shader graphs.",
    concreteMsNumber: "Lowers VRAM footprint by 450MB and cuts GPU processing costs by 3.8ms in open forest levels."
  },
  {
    id: "shader_permutations",
    title: "Shader Permutations",
    category: "Rendering & Graphics",
    description: "Limiting material compiler bloat. Every static switch parameter inside a material graph doubles the compiled permutations of that shader. If left unchecked, this causes massive disk sizes, high memory loading costs, and severe runtime freezes.",
    gpuImpact: "0.0ms (Shader rendering remains optimized).",
    cpuImpact: "Reduces Game Thread material instantiation delays by 3.8ms on load states.",
    ramImpact: "Saves up to 140MB RAM by preventing redundant shader execution templates from staying in memory.",
    vramImpact: "Saves +220MB VRAM on graphics cards by unloading unused pipeline states.",
    latencyImpact: "Prevents compilation micro-micro stutters, holding stable frame paces.",
    hasFeatures: [
      "Global Material Quality Switches to strip complex instructions across target platforms.",
      "Shader Permutation Reduction options in the packaging command arrays."
    ],
    missingFeatures: [
      "Automatic detection of redundant material nodes (requires manual inspection of compilation sheets)."
    ],
    howToUse: "Minimize static switches in master material layouts. Replace static parameters with dynamic scalar or vector parameters where possible, and use material quality nodes to strip features for low-end devices.",
    concreteMsNumber: "Compresses total packed game size by 1.8GB and avoids compile-stutter hitches of up to 120ms."
  },
  {
    id: "textures",
    title: "Textures & Streaming",
    category: "Rendering & Graphics",
    description: "Dynamic texture MIP-map allocation. Loading full 4K resolutions for all assets leads to immediate graphics card crashes (VRAM overflow). We stream texture layers dynamically based on camera visibility and relative screen size.",
    gpuImpact: "Reduces texture coordinate mapping lookup overhead by 1.2ms on average GPUs.",
    cpuImpact: "0.0ms (Streamed in background asynchronous threads).",
    ramImpact: "Saves +80MB system memory usage.",
    vramImpact: "Saves up to 1.5GB VRAM by streaming only regional texture mipmaps.",
    latencyImpact: "0.0ms.",
    hasFeatures: [
      "Unreal Texture Streaming Engine managing mip maps based on camera frustums.",
      "Texture Group presets to enforce strict maximum limits across various design groups."
    ],
    missingFeatures: [
      "Auto-balancing streaming speeds matching solid-state drive (SSD) versus mechanical hard-drive throughput (manual tuning required)."
    ],
    howToUse: "Assign all textures to correct Texture Groups (e.g., World, UI, Character). Never disable mips on high-resolution maps. Configure texture streaming pools in config files.",
    concreteMsNumber: "Cuts local VRAM footprints by 1.5GB, maintaining seamless performance on mainstream graphics hardware."
  },
  {
    id: "lighting",
    title: "Light & Shadows",
    category: "Rendering & Graphics",
    description: "Unreal Engine 5 dynamic global illumination (Lumen) combined with Virtual Shadow Maps. Real-time shadows represent extreme GPU rendering costs. We configure occlusion bounds, shadow caching grids, and distance-based light culling to hit performance targets.",
    gpuImpact: "Saves up to -5.5ms GPU processing by caching static virtual shadows and limiting dynamic light overlaps.",
    cpuImpact: "Cuts Draw Thread shadow evaluation routines by 2.2ms per frame.",
    ramImpact: "+28MB allocation capacity to record shadow caching maps.",
    vramImpact: "Saves up to 280MB of active GPU VRAM by culling distant shadows dynamically.",
    latencyImpact: "0.0ms.",
    hasFeatures: [
      "Virtual Shadow Maps (VSM) caching static shadow segments dynamically.",
      "Lumen dynamic global illumination with adaptive hardware tracing fallbacks."
    ],
    missingFeatures: [
      "Automatic dynamic resolution matching for dynamic global illumination during extreme frame rate drops."
    ],
    howToUse: "Enable dynamic shadow caching. Set Max Dynamic Shadow resolution caps. Limit the quantity of overlapping shadow-casting dynamic lights and cull light assets beyond 30 meters.",
    concreteMsNumber: "Reclaims 5.5ms of graphics hardware processing, enabling beautiful real-time shadows at 60 FPS."
  },
  {
    id: "optimal_algorithms",
    title: "Optimal Game Algorithms",
    category: "Algorithm & Simulation",
    description: "Designing high-speed math algorithms for massive RPG loops. Standard O(N^2) brute-force updates (such as checking spell overlaps or searching monster grids) freeze the Game Thread. We leverage spatial sorting hashes and contiguous arrays to solve these challenges in O(1) time.",
    gpuImpact: "0.0ms.",
    cpuImpact: "Cuts Game Thread CPU logical loop executions from 11.0ms down to 1.8ms in dense zones.",
    ramImpact: "Allocates +22MB memory size to store spatial hash indexes and grid reference tables.",
    vramImpact: "0.0ms.",
    latencyImpact: "Ensures thread simulation finishes on time, preventing frame stutters.",
    hasFeatures: [
      "TStaticArray offering stacked local allocations without heap performance costs.",
      "TMap data structures with high-speed key hashing algorithms."
    ],
    missingFeatures: [
      "Spatial HashMap out-of-the-box templates (must custom code coordinates spatial grid mappings in C++)."
    ],
    howToUse: "Build a spatial hash grid index: map character coordinates to a 10-meter cell index integer. Limit collision sweeps strictly to character lists in neighboring cells.",
    concreteMsNumber: "Saves 9.2ms CPU during combat sequences, allowing safe processing of 200 overlapping spells."
  },
  {
    id: "occlusion",
    title: "Occlusion & Visibility",
    category: "Algorithm & Simulation",
    description: "Unreal’s hardware occlusion querying. GPU rendering must skip objects blocked by walls or terrain. We configure pre-computed visibility volumes, software occlusion grids (masked software culling), and distance bounds to reduce draw calls.",
    gpuImpact: "Saves up to 4.2ms GPU rendering time by skipping hidden assets.",
    cpuImpact: "Reduces Draw Thread evaluation by 2.5ms by weeding out hidden models.",
    ramImpact: "+14MB memory size to store precomputed visibility lookup tables.",
    vramImpact: "Saves up to 350MB of VRAM by unloading meshes and mip textures in occluded spaces.",
    latencyImpact: "0.0ms.",
    hasFeatures: [
      "Precomputed Visibility Volumes for static indoor level structures.",
      "Hardware Occlusion Queries detecting screen-space bounding boxes."
    ],
    missingFeatures: [
      "Software occlusion templates for dynamic destructible objects (colliders must be custom checked)."
    ],
    howToUse: "Place Precomputed Occlusion Volumes across the level. Set up dynamic culling thresholds to ignore small interactive assets at a distance, and configure software masking for heavy city centers.",
    concreteMsNumber: "Lowers GPU costs by 4.2ms in complex city regions (Novigrad-style) by culling occluded graphics objects."
  },
  {
    id: "animation_audio",
    title: "Animation & Audio",
    category: "Game Systems & Logic",
    description: "Multi-threaded skeletal animations and dynamic voice managers. Anim evaluation represents heavy CPU loads in crowded zone grids. We leverage thread-safe update loops (Anim Dynamics) and MetaSound prioritized voice systems to limit overhead.",
    gpuImpact: "+0.2ms GPU to compute Pose Space Deformation joint matrices on vertex shaders.",
    cpuImpact: "Saves up to 5.2ms of Game Thread animation evaluation times by parallelizing worker tasks.",
    ramImpact: "Reduces RAM footprint by 32MB by streaming auditory pcm slices instead of pre-loading full clips.",
    vramImpact: "0.0ms.",
    latencyImpact: "0.0ms.",
    hasFeatures: [
      "AnimInstance Thread-Safe update steps executing skeletal logic on separate threads.",
      "MetaSound dynamic prioritisers de-activating voice channels beyond specific radii."
    ],
    missingFeatures: [
      "Dynamic skeletal bone mesh culling based on screen real-estate ratios (must write custom level-of-detail triggers)."
    ],
    howToUse: "Set up thread-safe animation blueprints. Bound dynamic parameters to member variables outside the Game Thread loop. Configure Sound Concurrency parameters inside MetaSound audio graphs.",
    concreteMsNumber: "Reclaims 5.2ms of Game Thread CPU execution time when rendering 100+ active characters."
  },
  {
    id: "aaa_profiling",
    title: "AAA Quality Profiling",
    category: "Profiling & Tools",
    description: "Modern engine diagnostics. When optimization targets are missed, we run Unreal Insights logs and stat trace markers to diagnose performance bottlenecks.",
    gpuImpact: "0.0ms (Profiling adds a minor 0.1ms instrumentation overhead to the GPU).",
    cpuImpact: "Identifies precise functions causing CPU thread freezes of up to 45.0ms.",
    ramImpact: "+48MB of analysis buffer memory to store active diagnostic recordings.",
    vramImpact: "0.0ms.",
    latencyImpact: "Pinpoints and eliminates latency spikes, restoring execution fluidities.",
    hasFeatures: [
      "Unreal Insights compiler trace streams recording tick, render, and asset cycles.",
      "Stat CPU Profiling console commands (stat game, stat init, stat render) for live analysis."
    ],
    missingFeatures: [
      "Automatic code performance remediation (must manual-fix bottlenecks indicated inside profiling reports)."
    ],
    howToUse: "Launch the build with the `-TraceSelect=cpu,frame,bookmark` command. Import the resulting `.utrace` file into Unreal Insights to identify heavy ticking functions.",
    concreteMsNumber: "Pinpoints CPU freezes of up to 45ms, giving engineering teams precise data directions for refactoring."
  },
  {
    id: "tools_overview",
    title: "Debug & Test Tools",
    category: "Profiling & Tools",
    description: "Standard testing layouts inside Unreal Engine. We run automated functional tests, coordinate compiler output profiles, and program command line triggers to gather continuous diagnostic reports.",
    gpuImpact: "0.0ms.",
    cpuImpact: "Automates game play testing loops to record execution timelines in under 1.5ms per frame.",
    ramImpact: "+8MB allocation to run testing harnesses.",
    vramImpact: "0.0ms.",
    latencyImpact: "0.0ms.",
    hasFeatures: [
      "Functional Testing Subsystem executing automated player action blueprints.",
      "Automation Tool (UAT) compiling package logs and testing reports automatically."
    ],
    missingFeatures: [
      "Multiplayer automated replication sync testing (must run manual multiplayer test clients)."
    ],
    howToUse: "Implement C++ subclasses inheriting `AAutomationTestCommon`. Build scripted actions (e.g. equipping weapons, spawning mobs) and assert expected performance metrics.",
    concreteMsNumber: "Reduces manual playtesting schedules by 75% while compiling performance logs automatically."
  },
  {
    id: "live_memory",
    title: "Live Memory Connect",
    category: "Profiling & Tools",
    description: "Heap allocation monitoring. Persistent structural memory leaks are the primary cause of game crashes during long play sessions. We link diagnostic memory allocators (LLM) to record allocations in real-time.",
    gpuImpact: "0.0ms.",
    cpuImpact: "Adds a tiny 0.2ms task query overhead to classify dynamic memory allocations.",
    ramImpact: "Monitors and groups all RAM allocations, classifying up to 16GB of system memory usage.",
    vramImpact: "0.0ms.",
    latencyImpact: "0.0ms.",
    hasFeatures: [
      "Low Level Memory Tracker (LLM) sorting heap allocations into distinct tags (e.g., Audio, Foliage, UObject).",
      "Memreport utilities writing comprehensive memory summaries to storage logs."
    ],
    missingFeatures: [
      "Auto-cleanup of third-party memory heap leaks (requires manual integration of custom pointer deallocators)."
    ],
    howToUse: "Launch standalone test builds with the `-LLM` parameter. Query active category footprints using the console command `stat LLM` or call `memreport -full` to dump memory trees.",
    concreteMsNumber: "Detects hidden structural pointer memory leaks, preventing game crashes after 3+ hours of play."
  },
  {
    id: "debug_overlays",
    title: "Visual Debug Overlays",
    category: "Profiling & Tools",
    description: "Visual runtime overlays highlighting system data. We draw thread heatmaps, color-coded bounding boxes for collision channels, and AI NavMesh path vectors directly inside the development viewport is essential.",
    gpuImpact: "+0.4ms GPU drawing costs to compose visual 2D and 3D lines over the screen.",
    cpuImpact: "0.0ms (Drawn asynchronously).",
    ramImpact: "+4MB stack memory size.",
    vramImpact: "0.0ms.",
    latencyImpact: "0.0ms.",
    hasFeatures: [
      "Visual Logger (VLog) recording and drawing actor coordinates, velocity, and AI paths.",
      "DrawDebug Helpers supporting visual lines, circles, and bounding boxes in real-time."
    ],
    missingFeatures: [
      "Viewport overlay drawing in shipping builds (debug drawing methods are completely stripped out by compiler optimization definitions)."
    ],
    howToUse: "Open the Visual Logger inside the editor. Trace dynamic actions using `UE_VLOG` macros, and tap coordinate paths on screen to read historic parameters during playback.",
    concreteMsNumber: "Accelerates collision and AI search bug discovery timelines from days to instant visual inspections."
  },
  {
    id: "scalability",
    title: "Scalability & CVars",
    category: "Profiling & Tools",
    description: "Hardware scaling options via Console Variables (CVars). Standard games must scale to support various GPUs. We create custom graphics settings, bind parameters to distinct scalability tiers, and use CVars to dynamically lower features.",
    gpuImpact: "Scales GPU execution times from 22.0ms down to 8.5ms on lower-end devices.",
    cpuImpact: "Scales Draw Thread workloads from 9.5ms down to 3.2ms per frame.",
    ramImpact: "Saves up to 600MB System RAM by lowering character and asset pool limits.",
    vramImpact: "Saves up to 1.8GB VRAM by lowering dynamic target resolutions, shadows, and texture scales.",
    latencyImpact: "Reduces display latency on lower-end graphics devices by up to 30ms.",
    hasFeatures: [
      "Scalability Settings grouping engine parameters (shadows, view distance, postprocess) into simple tiers.",
      "Console Variable system permitting dynamic tuning of parameters inside shipping builds."
    ],
    missingFeatures: [
      "Automated adaptive CVar throttling based on real-time device battery thermals (must write custom device listeners)."
    ],
    howToUse: "Configure DefaultScalability.ini. Group levels into low, medium, high, and epic. Bind options menu UI triggers to execute console command strings (e.g. `sg.ShadowQuality 0`).",
    concreteMsNumber: "Restores playability on legacy GPUs, scaling framerates from 18 FPS up to a stable 60 FPS."
  },
  {
    id: "budgets",
    title: "Budgets & Tools",
    category: "Profiling & Tools",
    description: "Establishing resource boundaries. Graphics and development teams must coordinate with engineering to enforce strict performance quotas. We program limits inside asset compilers and setup warning triggers for over-budget meshes.",
    gpuImpact: "Ensures the total GPU baseline rendering time stays within the mandatory 13.5ms target budget.",
    cpuImpact: "Ensures Game Thread processing loops never exceed the allocated 13.5ms framework budget.",
    ramImpact: "Locks aggregate system heap consumption within strict platforms thresholds.",
    vramImpact: "Fails mesh builds if VRAM polygon or material thresholds are exceeded.",
    latencyImpact: "0.0ms.",
    hasFeatures: [
      "Size Map utility in Unreal Engine visualising memory footprints of assets and dependencies.",
      "Asset Audit modules reporting over-budget textures and non-instanced materials."
    ],
    missingFeatures: [
      "Automated mesh decimation during design compilation (artists must adjust poly targets manually)."
    ],
    howToUse: "Setup custom validation scripts in target compilers. Group assets inside the Size Map to locate large textures (e.g., >2048px on minor props) and trigger build warnings.",
    concreteMsNumber: "Enforces strict AAA team guidelines, keeping aggregate project memory overhead within target budgets."
  },
  {
    id: "storage",
    title: "Storage & Disk I/O",
    category: "Profiling & Tools",
    description: "Optimizing package layouts and data streaming speeds. RPG games inspired by Witcher 3 load massive files during fast-travel. We leverage compression algorithms, asset de-duplication, and structural pak layout files to minimize loading times on SSDs.",
    gpuImpact: "0.0ms.",
    cpuImpact: "Reduces asset loading de-compression times by 3.4ms CPU.",
    ramImpact: "Reduces heap footprint during load cycles by streaming compressed paks sequentially.",
    vramImpact: "Reduces texture loading bottlenecks in GPU memory structures by 1.2ms.",
    latencyImpact: "0.0ms.",
    hasFeatures: [
      "Oodle Data compression integrated natively in Unreal Engine packaging processes.",
      "IoStore container files (.utoc, .ucas) optimized for high-speed Solid-State Drive I/O pipelines."
    ],
    missingFeatures: [
      "Automatic physical sorting of assets inside HDD blocks (forces developers to package files sequentially)."
    ],
    howToUse: "Select Oodle Kraken or Selene compression algorithms in package parameters. Enable IoStore inside target build options and run the packaging system to bundle the game into contiguous storage structures.",
    concreteMsNumber: "Reduces fast-travel loading screens from 18.0 seconds down to 2.4 seconds on NVMe storage."
  },
  {
    id: "hlod_aggregator",
    title: "Dynamic HLOD Proximity Aggregator",
    category: "Rendering & Graphics",
    description: "Baking distant foliage and houses into unified Hierarchical Level of Detail billboards on background worker loops. Rather than rendering 5,000 distinct low-resolution meshes in the distance, the system bakes visual clusters into massive, single-texture proxy meshes. This slashes draw calls and vertex counts to almost zero for the far horizon.",
    gpuImpact: "Reclaims up to 4.5ms GPU rendering time by converting complex horizon rasterization to flat proxy billboards.",
    cpuImpact: "Saves ~3.1ms on the Draw Thread by culling thousands of draw call dispatches into a single proxy mesh per grid.",
    ramImpact: "+250MB System RAM during baking processes; saves ~300MB RAM runtime by unloading raw assets.",
    vramImpact: "Saves roughly 400MB VRAM by collapsing unique distant textures into shared atlas materials.",
    latencyImpact: "Maintains smooth 60 FPS output, eliminating frame drops when viewing massive landscapes from high elevations.",
    hasFeatures: [
      "World Partition HLOD Layers for automated grid-based proxy generation.",
      "Simplified Mesh Bake and Texture Atlasing integration."
    ],
    missingFeatures: [
      "Dynamic real-time generation during gameplay (HLODs must be baked strictly offline in the editor)."
    ],
    howToUse: "Assign static meshes to an HLOD layer inside the Details Panel. Use the 'Build HLODs' commandlet to generate proxy meshes for all World Partition cells, ensuring the material proxy instances use flat atlases.",
    concreteMsNumber: "Claws back exactly 4.5ms GPU raster time during sweeping panoramic camera pans over forested mountains."
  },
  {
    id: "async_inventory",
    title: "Lock-Free Async Inventory Streamers",
    category: "Memory & State Arch",
    description: "Dynamic inventory transaction systems utilizing lock-free concurrent queues. Traditional MMO and RPG database updates parse thousands of item stats on the Game Thread, creating catastrophic 60ms stutter traps (network timeout kicks). We decouple all loot parsing via concurrent arrays streaming to Node.js/Redis backends.",
    gpuImpact: "0.0ms.",
    cpuImpact: "Prevents entire Game Thread freezes. Stabilizes active combat ticking under 13ms even during mass item explosions.",
    ramImpact: "+45MB RAM to maintain double-buffered item transaction queues.",
    vramImpact: "0.0ms.",
    latencyImpact: "Eradicates 120ms network delay spikes during transaction phases, securing 0% packet loss.",
    hasFeatures: [
      "TQueue: lock-free, thread-safe single-producer single-consumer queues.",
      "Asynchronous C++ task graphs to perform bulk JSON or binary parsing on worker threads."
    ],
    missingFeatures: [
      "Multi-producer multi-consumer guaranteed determinism (requires manual critical sections or mutex locking constructs)."
    ],
    howToUse: "Push picked-up item structs into a TQueue. A background worker thread continually dequeues items, runs heavy FArchive serialization, and dispatches HTTP/WebSocket payloads to the master server without interrupting the Game Thread.",
    concreteMsNumber: "Eliminates ~65ms GC and parsing stutters, securing a stable 1.2ms server ticking limit during massive 10,000+ item loot drops."
  },
  {
    id: "spatial_grid_replication",
    title: "Spatial Grid Network Replication",
    category: "Multiplayer & Netcode",
    description: "Offloading dynamic player interest updates inside dense RPG hubs to a dedicated thread-safe spatial network replication grid. Instead of polling every entity globally, the replication graph divides the server world into grid nodes. Only entities physically crossing Node boundaries trigger relevancy updates, scaling networking from O(N^2) to O(1).",
    gpuImpact: "0.0ms.",
    cpuImpact: "Saves up to 6.2ms Server Game Thread overhead during densely populated multiplayer hubs (e.g., Novigrad with 100 players).",
    ramImpact: "+80MB RAM required on dedicated servers to host spatial grids and active client sub-connection lists.",
    vramImpact: "0.0ms.",
    latencyImpact: "Significantly reduces server simulation latency, pulling tick speeds down from 35ms back to a tight 16ms.",
    hasFeatures: [
      "Replication Graph plugin natively dividing worlds into spatialized node trees.",
      "GridSpatialization2D nodes capable of bucketing actors precisely based on 2D coordinates."
    ],
    missingFeatures: [
      "Full Blueprint integration (Replication Graph must be written and customized strictly in C++).",
      "Dynamic Z-axis separating (3D grid spatialization requires custom grid node overrides)."
    ],
    howToUse: "Derive a custom UReplicationGraph. Implement a UReplicationGraphNode_GridSpatialization2D for the main persistent levels. Route dynamic entities to the spatial node, and static entities (like doors) to 'AlwaysRelevant' nodes for localized clients.",
    concreteMsNumber: "Restores exactly 6.2ms of server ticking budget by discarding remote client packet dispatches in crowded MMO zones."
  },
  {
    id: "dynamic_sound_raycaster",
    title: "Dynamic Sound Prioritization Raycaster",
    category: "Algorithm & Simulation",
    description: "Cull far-away or fully obstructed sound sources (mobs fighting, sword impacts, magical fire storms) by raycasting obstacle geometries and material thicknesses between the camera and emitters. Witcher 3, PoE, and BG3 feature intense overlapping soundscapes that can exhaust audio mixing buffers. This prioritizer dynamically trims channels and avoids synthesising inaudible waves.",
    gpuImpact: "0.0ms; complete auditory and mixing pipeline isolation.",
    cpuImpact: "Saves up to -1.2ms CPU on the Game Thread audio tick processing by eliminating unnecessary sound card submissions.",
    ramImpact: "Saves ~20MB of heap by unloading inactive and culled audio clip streams.",
    vramImpact: "0.0ms.",
    latencyImpact: "-0.2ms total system latency by freeing thread schedules.",
    hasFeatures: [
      "UE Audio Virtualisation to drop volume or fade sound cues when concurrency lists are full.",
      "MetaSounds procedural graph system capable of low-level dynamic gain attenuation."
    ],
    missingFeatures: [
      "Real-time geometric material density testing (sound volume is based purely on distance rather than physical obstruction)."
    ],
    howToUse: "Run low-cost asynchronous multi-line raycasts from the camera position to active MetaSound emitters. Calculate thickness vectors, attenuate volume, and dynamically trigger 'Virtualize' when obstruction ratio crosses 80%.",
    concreteMsNumber: "-1.2ms CPU Game Thread under dense mob combat loops with active spell audio lines."
  },
  {
    id: "physics_substepper_scheduler",
    title: "Adaptive Physics Substepper Scheduler",
    category: "Algorithm & Simulation",
    description: "Dynamically throttle and scale down physics tick rates of inactive or distant non-combat objects (colliders, ropes, hanging props, broken tables) based on camera projection bounds. High-rate sub-stepped physics on static assets during combat wastes valuable CPU cycles in games like Baldur's Gate 3. Throttling reduces evaluations to 10-15Hz cleanly.",
    gpuImpact: "0.0ms.",
    cpuImpact: "Claws back -1.5ms server and client CPU times by avoiding redundant rigid-body state evaluations.",
    ramImpact: "Allocates +5MB RAM to hold spatial scheduling maps of active items.",
    vramImpact: "0.0ms.",
    latencyImpact: "Guarantees cleaner physics sync pacing, bringing overall jitter variance down to <0.3ms.",
    hasFeatures: [
      "Chaos Substepping to compute high-frequency simulation sub-timesteps.",
      "Significance Manager to track visible screenspace coordinates and prioritize nearby components."
    ],
    missingFeatures: [
      "Adaptive frequency scaling for Chaos physics solvers based on viewport significance arrays (must be engineered manually)."
    ],
    howToUse: "Create a Custom Physics Controller. Map active physical actors to significance bins. Calculate Significance based on screen-size screen ratio, and adjust solver steps per actor using UWorld::GetPhysicsScene()->SetSolverIterations().",
    concreteMsNumber: "Saves -1.5ms CPU by dynamically down-scheduling non-combat dynamic physics boxes."
  },
  {
    id: "multi_region_network_sim",
    title: "Multi-region Network Simulation",
    category: "Multiplayer & Netcode",
    description: "Stress-testing multiplayer clients by injecting artificial network QoS patterns, including latency jitter (10ms to 80ms) and burst packet losses (up to 15%). Essential for validating client-side prediction, rollback reconciliations, and rubberband blending in high-action RPGs like Path of Exile or Witcher 3 multiplayer prototypes.",
    gpuImpact: "0.0ms.",
    cpuImpact: "Adds negligible CPU overhead (~0.1ms) to manage network packet delay queues.",
    ramImpact: "Requires +12MB RAM representation to buffer delayed packets and replication histories.",
    vramImpact: "0.0ms.",
    latencyImpact: "Simulates actual global internet latencies (e.g. Europe to US East at 120ms ping) directly in local diagnostic builders.",
    hasFeatures: [
      "NetEmulationSettings inside DefaultEngine.ini to force static ping and drop rates.",
      "Console command shortcuts (Net.PacketLoss, Net.Lag) for developer on-the-fly network testing."
    ],
    missingFeatures: [
      "Dynamic, region-based multi-profile wave simulations (legitimate jitter networks require manual code handlers)."
    ],
    howToUse: "Implement a custom Network Driver class or utilize Packet Simulation variables inside settings. Toggle jitter wave profiles dynamically through debug overlays to test predictive reconciliations under stressful connectivity.",
    concreteMsNumber: "Simulates up to 350ms peak latencies with 15% packet drops, proving predictive robustness."
  },
  {
    id: "hardware_anim_sharing",
    title: "Hardware-Accelerated Animation Sharing",
    category: "Architecture & CPU",
    description: "Bypass CPU-bound skeletal joint evaluations for hundreds of distant proxy crowd mobs by transferring joint skinning matrices directly onto GPU-allocated shared skinning buffers. Perfect for Witcher 3 massive city crowds or dense PoE swarm arenas. Rather than evaluating standard C++ bone trees, proxy characters read from shared motion tracks.",
    gpuImpact: "Adds minor +0.15ms GPU vertex shader load using instanced rendering buffers.",
    cpuImpact: "Saves -1.0ms CPU Game Thread execution time by offloading skeletal skinning translations entirely to WebGL/DirectX hardware.",
    ramImpact: "Reduces heap footprint by 150MB by bypassing individual actor AnimInstance structures.",
    vramImpact: "Requires +25MB VRAM allocation to store shared anim texture registers on the GPU.",
    latencyImpact: "Reduces frame time variance to <0.1ms.",
    hasFeatures: [
      "Animation Sharing System (UAnimSharingStateProcessor) to evaluate skeleton positions once per crowd state.",
      "Skeletal Mesh merging interfaces to combine dynamic skeletal arrays."
    ],
    missingFeatures: [
      "Direct GPU skinning cache sharing out-of-the-box (custom shader vertex factories must be coded to translate indices)."
    ],
    howToUse: "Activate the Animation Sharing plugin. Group identical mob categories into states (Walk, Active, Idle). Run active joint updates once on a master mesh, and feed the generated joint bone transform textures directly into the materials of far-away proxy skeletons.",
    concreteMsNumber: "Recovers -1.0ms main CPU time when evaluating over 150 distant active mob actors simultaneously."
  },
  {
    id: "dynamic_gpu_occlusion_pools",
    title: "Dynamic GPU Occlusion Query Pools",
    category: "Rendering & Graphics",
    description: "Implement real-time visual bounding-box visibility sweeps leveraging asynchronous GPU Hierarchical Z-Buffer (HZB) occlusion query pools to aggressively cull off-camera visual models on mobile/handheld chipsets. This avoids overloading mobile dynamic layout raster capacity and G-Buffer filling pipelines.",
    gpuImpact: "Saves -1.8ms of GPU raster capacity. Reduces pixel fillrate congestion by completely avoiding off-camera geometry drawing.",
    cpuImpact: "Adds up to +0.3ms of Draw Thread scheduling overhead to manage queue sweeps and state pools.",
    ramImpact: "Saves up to 120MB System RAM by enabling streaming textures and models to stay in virtual storage.",
    vramImpact: "Consumes +15MB VRAM to allocate visibility query queues and hierarchical MIP buffers on the hardware.",
    latencyImpact: "Improves overall graphics processing responsiveness, decreasing frame time latency variance.",
    hasFeatures: [
      "HZB (Hierarchical Z-Buffer) Occlusion Culling to test bounding volumes against low-resolution depth textures.",
      "Occlusion Query volumes specifying manual static structures that block visibility."
    ],
    missingFeatures: [
      "Dynamic resizing and load-balancing of culling query pools on a per-frame basis (must be written manually in HLSL)."
    ],
    howToUse: "Enable r.HZBOcclusion=1 in device configurations. Create custom visual meshes inside bounding-box structures. Dispatch visibility queries asynchronously, utilizing dual-buffered results to update actor visibility states in the next frame to prevent stall pipelines.",
    concreteMsNumber: "-1.8ms GPU savings in graphic-heavy swamp environments with dense complex overlapping trees."
  }
];

