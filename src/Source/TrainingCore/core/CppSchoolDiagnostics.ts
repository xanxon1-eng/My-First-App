/**
 * CppSchoolDiagnostics.ts
 * Handcrafted, highly granular diagnostic metadata customized individually for each C++ school learning module.
 * Provides bespoke CPU/GPU metrics, Unreal Engine limits, and architectural workarounds inspired by the technical designs
 * of The Witcher 3 (Novigrad crowds, streaming), Path of Exile (modifiers systems, spatial hashes), and Baldur's Gate 3 (save-game serialization, state loops).
 */

export interface UTaskDiagnostic {
  gpu: string;
  cpu: string;
  ram: string;
  vram: string;
  ping: string;
  info: string;
  ueFeatures: string[];
  missingFeatures: string[];
}

const diagnosticsMap: Record<string, UTaskDiagnostic> = {
  // --- STAGE 1: RAW METAL ---
  'task_0': {
    gpu: '0.00ms (Compiling interface context)',
    cpu: '0.15ms (Prepass compiling precompiled headers)',
    ram: '14MB (UObject reflection tracking map)',
    vram: '0.00ms',
    ping: 'None',
    info: 'Evaluating C++ native compilation boundaries. Blueprints run on virtual machine bytecode interpreter (high CPU callstack overhead); native C++ compiles straight to raw x86/ARM hardware instructions (10x to 150x faster execution).',
    ueFeatures: ['Unreal Header Tool (UHT) reflections compiler', 'Live Coding compiler hot reload'],
    missingFeatures: ['Automatic Blueprint-to-C++ compiler (deprecated in Unreal Engine 5.1; requires manual porting to secure performance)']
  },
  'task_1': {
    gpu: '0.12ms (Skinned mesh bone position rendering limits)',
    cpu: '0.05ms (Core integer and floating-point CPU register steps)',
    ram: '9 bytes (Naked variable RAM allocations)',
    vram: '32MB (Shader constant buffer vertex attributes)',
    ping: 'None',
    info: 'Witcher 3 style stat variables (int32 Health, float Toxicity, bool bIsCombatActive). Primitives allocate discrete byte blocks in adjacent stack alignments to prevent cache leaks.',
    ueFeatures: ['int32/uint32 explicit size bit representation', 'float32 single precision registers alignment'],
    missingFeatures: ['Variable network value quantization out-of-the-box (requires manual net serialize compression to prevent band saturation)']
  },
  'task_2': {
    gpu: '0.00ms',
    cpu: '1.25ms (Evaluating Path of Exile-inspired stat modifiers lists)',
    ram: '16 bytes (Local stacks storage)',
    vram: '0.00ms',
    ping: 'None',
    info: 'Path of Exile style character modifier logic (Base Stats modified by dynamic increases and reductions under strict arithmetic hierarchies). Compound assignments bypass secondary operations by modifying CPU register segments directly.',
    ueFeatures: ['C++ operator overloading rules', 'FMath math assembly helper utilities'],
    missingFeatures: ['Native fast-array attribute evaluation frameworks (Unreal GAS system contains massive 4.5ms overhead; custom lightweight subsystems are preferred)']
  },
  'task_3': {
    gpu: '0.00ms (Text-heavy translation bypasses GPU rasterizers)',
    cpu: '0.85ms (Baldur\'s Gate 3 style localized dialogue FText translations lookup)',
    ram: '3.2MB (Global string hashing and local character string pools)',
    vram: '1.5MB (Unicode character caching inside GPU)',
    ping: 'None',
    info: 'Contrasts FString (dynamic, mutable dynamic heap allocations), FName (O(1) global symbol hash mapping), and FText (immutable localization wrapper with key lookups). BG3 dialogues leverage FText to prevent string-copy garbage spikes.',
    ueFeatures: ['FName global string dictionary index map', 'FText localization lookup tables'],
    missingFeatures: ['Localized dictionary memory culling (inactive languages sit permanently in RAM unless purged via low-level packages)']
  },
  'task_4': {
    gpu: '0.00ms',
    cpu: '0.02ms (O(1) dereference pointer write to system storage segments)',
    ram: '8 bytes (Pointer reference cell segment)',
    vram: '0.00ms',
    ping: 'None',
    info: 'Witcher 3 inventory pointer management. Pointers write directly to physical memory locations (0x7FFF9A...). Accessing unprotected null pointers triggers immediate CPU ACCESS_VIOLATION segment execution freezes.',
    ueFeatures: ['FMemory::Memcpy hardware accelerated block moves', 'Alignof struct padding align structures'],
    missingFeatures: ['Naked raw pointer tracking protection in Unreal Engine (Garbage collection ignores raw variables, leading to silent crash loops)']
  },
  'task_5': {
    gpu: '0.00ms',
    cpu: 'O(1) hash coordinate lookup (vs O(N) linear array iterations)',
    ram: '48KB (TMap lookup bucket grids and dynamic elements allocation)',
    vram: '0.00ms',
    ping: 'None',
    info: 'Path of Exile loot system. Checking if item key exist in inventory using TMap is ultra-fast O(1) via hashing. Using standard arrays (TArray) forces linear search O(N), locking threads if scanning wide inventories.',
    ueFeatures: ['TMap hash-map buckets serialization', 'TArray contiguous memory reallocation blocks'],
    missingFeatures: ['Thread-safe lock-free Map lookups (locks must be handled manually via FCriticalSection queues)']
  },
  'task_6': {
    gpu: '0.00ms',
    cpu: '0.04ms (Switch execution instruction register offsets)',
    ram: '4 bytes (Byte-packed UENUM enum tracking state)',
    vram: '0.00ms',
    ping: '+35ms (Server State replication and desync recovery interval)',
    info: 'Baldur\'s Gate 3 turn-based states (IDLE, PLANNING, ATTACKING, RESOLVING). Switch structures compile to hardware jump registers (faster than nested nested if/else statements). Asserts (check/ensure) capture states in debug compiles.',
    ueFeatures: ['check(), ensure(), verify() error handlers', 'UENUM byte-serialization macros'],
    missingFeatures: ['Automated player state rollback validation (requires custom predictor state wrappers if handling fast latency transitions)']
  },

  // --- STAGE 7: LOOPS & NESTED SCANS ---
  'task_7_1': {
    gpu: '0.00ms',
    cpu: '0.12ms (Linear O(N) evaluation loop for active components list)',
    ram: '128 bytes (Tick stack counters)',
    vram: '0.00ms',
    ping: 'None',
    info: 'Witcher 3 Novigrad active NPC coordinates iteration. Linear for() loops process contiguous blocks, maximizing L1 cache-line hitrates.',
    ueFeatures: ['Fast range-based TArray iterators', 'Pre-allocated heap arrays'],
    missingFeatures: ['Loop auto-vectorization alerts (requires manual compiler optimizations to compile dynamic vectors to raw SSE lanes)']
  },
  'task_7_2': {
    gpu: '0.00ms',
    cpu: '0.15ms (Linear array sweep)',
    ram: '128 bytes (Loop registers)',
    vram: '0.00ms',
    ping: 'None',
    info: 'Conditional loop sweep. Ideal for streaming distance checks of passive point objects.',
    ueFeatures: ['TArray range operators', 'FVector::DistSquared fast spatial checks'],
    missingFeatures: ['Auto-parallelizing loops processor (must handoff tasks manually via AsyncTask for multi-core scaling)']
  },
  'task_7_3': {
    gpu: '0.00ms',
    cpu: '0.10ms (Linear iteration)',
    ram: '256 bytes',
    vram: '0.00ms',
    ping: 'None',
    info: 'Iterative calculation blocks. Demonstrates optimizing incrementing loop arrays to bypass deep callstacks.',
    ueFeatures: ['TArray::Num() inlined cached parameters', 'Pre-increment operators optimizations'],
    missingFeatures: ['Range indexing boundaries safety (requires manual index clamping to prevent out-of-bounds memories faults)']
  },
  'task_7_4': {
    gpu: '0.00ms',
    cpu: '0.08ms (Early loop termination)',
    ram: '64 bytes',
    vram: '0.00ms',
    ping: 'None',
    info: 'Loop execution with early breaks and conditional skipping. Substantially reduces redundant item calculations when target condition is resolved in mid-loop.',
    ueFeatures: ['Break statement register branching', 'Continue statement loop skips'],
    missingFeatures: ['Structured multi-break loops optimizer (forces manual nesting blocks)']
  },
  'task_7_5': {
    gpu: '0.00ms (Text simulation bounds)',
    cpu: '8.50ms O(N^2) (Extremely heavy CPU cost! Stalls main thread execution directly)',
    ram: '256 bytes (Index caches)',
    vram: '0.00ms',
    ping: '+45ms network jitter (stalls input message queues on clients)',
    info: 'Path of Exile style spell overlap detection. Comparing 100+ dynamic fireballs against 300+ incoming targets inside nested O(n2) loops blocks threads entirely. Spatial Hash Grid reduces evaluation to fast O(1) or O(N).',
    ueFeatures: ['TArray contiguous memory registers', 'Fast iterators'],
    missingFeatures: ['Built-in spatial hashing containers out-of-the-box (requires manual implement of Octrees or Grid hash registries)']
  },

  // --- STAGE 8: MACROS & REFLECTION ---
  'task_8': {
    gpu: '0.15ms (Blueprint graph line drawing overloads)',
    cpu: '0.35ms (Bypassing reflection translation layers via inline calls)',
    ram: '240KB (Reflection registry dynamic arrays)',
    vram: '1.2MB (Node visual graphs caching)',
    ping: 'None',
    info: 'Unreal macro system (UPROPERTY, UFUNCTION, UCLASS). Injects variables into global reflection layouts, making C++ variables visible to Blueprint wires and editor inspectors (EditAnywhere).',
    ueFeatures: ['UHT pre-compiler code injector', 'UProperty reflection tree headers'],
    missingFeatures: ['Compile-time Blueprint binding compiler validations (dynamic visual binders fail silently at runtime during execution)']
  },

  // --- STAGE 9: GARBAGE COLLECTION SECURES ---
  'task_9': {
    gpu: '0.00ms',
    cpu: '0.12ms (Evaluating GC reference tree structures during ticking pauses)',
    ram: '320 bytes (GC tracking nodes inside global object array)',
    vram: '0.00ms',
    ping: 'None',
    info: 'Witcher 3 dynamic quest actors allocation. Standard pointers get swept by GC on loading frames if unreferenced, turning references into dangerous dangling addresses. Registering pointers to UPROPERTY() protects them in reference trees.',
    ueFeatures: ['UObject hash table registration', 'FGCCollector reference sweeping loops'],
    missingFeatures: ['Incremental progressive micro-sweeping (Garbage collection runs in massive blocking frames, causing 10ms spikes)']
  },

  // --- STAGE 10: STRING CONCATENATIONS ---
  'task_10': {
    gpu: '0.00ms',
    cpu: '0.55ms (Heap fragmentation delays during character dialog builds)',
    ram: '4.8MB (Dynamic string variables accumulating in active heaps)',
    vram: '0.00ms',
    ping: 'None',
    info: 'Dialogue buffer builders. Concatening FStrings dynamically inside loops triggers continuous allocation re-allocs, locking memory segments. Builders allocate static segments beforehand to skip fragmentation.',
    ueFeatures: ['StringBuilder dynamic allocation caching', 'Static string memory allocations'],
    missingFeatures: ['Compile-time string literal optimization in standard templates (requires manual character poolings)']
  },

  // --- STAGE 11: MULTIPLAYER NETCODE ---
  'task_11': {
    gpu: '0.12ms (Rendering proxy meshes)',
    cpu: '3.85ms (Server side character movement replication loops)',
    ram: '45MB (Connection structures storage table)',
    vram: '8MB (Proxy transforms indexes)',
    ping: 'Stabilizes ping under ~25ms via UDP bandwidth compressions',
    info: 'Replicated movement and prediction. Synchronizes client transforms with Server authority, running local prediction to hide server delays. Unlocks smooth Witcher-style exploration over TCP/UDP routes.',
    ueFeatures: ['CharacterMovementComponent adaptive networking', 'Server validation RPC calls'],
    missingFeatures: ['Client-to-client direct P2P connection optimizations (limits net architectures to standard client-server models)']
  },

  'task_NEW_LIGHTING': {
    gpu: '1.45ms (Direct-Mesh global radiance cascading - saves ~5.0ms on high-end GPUs)',
    cpu: '0.12ms (Main thread dispatch prepass)',
    ram: '45MB (Irradiance probe tables)',
    vram: '120MB (32-bit dynamic sparse radiance cascades map)',
    ping: 'None',
    info: 'Dynamic time-of-day diffuse GI lighting. Replaces heavy Hardware Lumen raytracing (5.5ms GPU) with an optimized, screen-space targeted direct-mesh sparse 3D GPU hash map (1.45ms GPU) caching diffuse indirect bounds.',
    ueFeatures: ['Virtual Shadow Maps cache configurations', 'Distance Fields dynamic tracing'],
    missingFeatures: ['Automated dynamic probe density culling (requires manual script parameter overrides depending on scene occlusion metrics)']
  },

  // --- MASTERCLASS STAGE 13 (AAA OPTIMIZATION CPU/RAM) ---
  'task_opt_1': {
    gpu: '0.00ms (Core instruction caching optimization)',
    cpu: '-3.20ms (Replaces L2 cache-miss stalls with contiguous linear sweeps - O(1) packing)',
    ram: '-15MB (Restructures USTRUCT alignment to eliminate invisible compiler byte padding)',
    vram: '0.00ms',
    ping: 'None',
    info: 'Cache-coherent Memory architecture. Packs elements inside data-oriented structures largest-to-smallest (double/pointer -> int32 -> bool) to prevent byte strides, allowing multi-core CPUs to read entities without stalling on RAM fetches.',
    ueFeatures: ['USTRUCT byte alignment models', 'TInlineAllocator cache storage caches'],
    missingFeatures: ['Automated structural variable order analyzer (requires external profile pipelines like Intel VTune inside execution workflows)']
  },
  'task_opt_2': {
    gpu: '0.00ms',
    cpu: '-5.80ms (Offloads calculation vectors off the critical Main Game Thread)',
    ram: '12MB (Multithreading task runner buffer space allocations)',
    vram: '0.00ms',
    ping: 'None',
    info: 'Path of Exile style dynamic path calculations. Offloads expensive algorithmic checks to safe background thread worker pools via AsyncTask, preventing frame drops during player spell action spikes.',
    ueFeatures: ['AsyncTask / GraphTask background workers', 'ENamedThreads background schedules'],
    missingFeatures: ['Thread-safe dynamic object creation inside parallel threads (UProperties and GC are strictly bonded to the Game Thread)']
  },
  'task_opt_3': {
    gpu: '+0.50ms (Dynamic Instance Static Mesh bone skin rendering bounds)',
    cpu: '-8.50ms (Process 10,000 dynamic entities in contiguous contiguous RAM chunks)',
    ram: '-120MB (Eradicates standard UObject and AActor memory overhead limits)',
    vram: '45MB (Dynamic transforms tracking table for ISM instances)',
    ping: 'None',
    info: 'Unreal MassEntity (ECS) integration. Replaces standard heavy AActors (which carry heavy overhead and 500+ dynamic virtual ticks) with packed data fragments, letting Witcher-style crowds process Novigrad AI at sub-millisecond rates.',
    ueFeatures: ['MassEntity ECS Trait architecture', 'MassProcessor parallel pipelines'],
    missingFeatures: ['Complex skeletal bone blend animation loops for entities out-of-the-box (requires custom Vertex Shader GPU skinning)']
  },
  'task_opt_4': {
    gpu: '+0.15ms (GPU retained composition panel layers)',
    cpu: '-2.40ms (Eradicates passive Slate tick pre-passes on UI updates)',
    ram: '8MB (Widget hierarchy caching blocks)',
    vram: '4MB (Retained Slate UI atlas dynamic caches)',
    ping: 'None',
    info: 'Baldur\'s Gate 3-style dynamic spell hotbars. Instead of scanning dynamic variables every frame, Invalidation Box caching locks visual components, bypassing layout sweeps until C++ explicitly updates metrics.',
    ueFeatures: ['UMG Invalidation Box modules', 'Retainer Box cached paint sweeps'],
    missingFeatures: ['Automatic system-level dirtying inside nested object data bindings (C++ developers must invoke InvalidateLayoutAndVolatility manually)']
  },
  'task_opt_5': {
    gpu: '0.00ms',
    cpu: '-4.60ms (IRIS Parallel RPC streaming sweeps)',
    ram: '110MB (Connection channels registry tables)',
    vram: '0.00ms',
    ping: 'Restores ping variance to within <25ms by preventing RPC congestion',
    info: 'Multiplayer World partition replication. Employs NetDormancy on treasure chest actors to skip server replication passes until a player interacts with them, dropping network packet sizes by up to 85% during combat queues.',
    ueFeatures: ['Unreal IRIS Parallel Replication System', 'NetDormancy dormancy states'],
    missingFeatures: ['Dynamic server-side replication culling based on bandwidth limits (you must tune limits manually in DefaultEngine.ini)']
  },
  'task_opt_6': {
    gpu: '-6.20ms (Bypasses DX12 compiler pipeline state object crashes on dynamic spawns)',
    cpu: '-3.50ms (Lowers dynamic draw threads execution lines)',
    ram: '48MB (System RAM compiled object tracking libraries)',
    vram: '-250MB (Recycles dynamic materials using Instancing)',
    ping: 'None',
    info: 'Optimizing graphics pipelines. pre-compiling PSOs (Pipeline State Objects) during initial loading cards completely mitigates 250ms DX12 compilation frame hitchings on casting spells, and HISM groups repetitive assets.',
    ueFeatures: ['Hierarchical Instanced Static Mesh (HISM) batches', 'DX12 PSO Cache compilations'],
    missingFeatures: ['Automated shader permutation optimization (unused static switches compile and consume GPU memory unless culled manually via CVar overrides)']
  },
  'task_opt_7': {
    gpu: '0.00ms',
    cpu: '-1.80ms (Eradicates duplicate memory fetches via custom cache line alignment)',
    ram: '-10MB (Saves variable spacing padding byte waste within structs)',
    vram: '0.00ms',
    ping: 'None',
    info: 'Memory alignas(16) optimization. Forces the compilers to pack properties inside exact standard CPU vector sizes, preventing redundant memory fetch subdivisions.',
    ueFeatures: ['explicit alignas(16) boundary mapping', 'MS_ALIGN memory pack attributes'],
    missingFeatures: ['Automatic alignment padding analysis inside native IDE tools (requires external profilers like Intel VTune)']
  },
  'task_opt_8': {
    gpu: '0.00ms (Bypasses CPU wait locks)',
    cpu: '-3.50ms (Zeroes down multi-thread synchronization wait times)',
    ram: '0.00MB (Preallocated static circular array bounds)',
    vram: '0.00ms',
    ping: '<1ns delay (Immediate index update thread operations)',
    info: 'Lock-free thread communication format. Employs std::atomic head and tail pointers on circular buffers, bypassing operating-system mutex context-switches completely.',
    ueFeatures: ['std::atomic standard thread checks', 'TQueue Lock-Free FIFO concurrency modes'],
    missingFeatures: ['Standard variable dynamic sizing under atomic locks (requires manual lock controllers if sizes expand)']
  },
  'task_opt_9': {
    gpu: '0.00ms',
    cpu: '-8.50ms (Eradicates string-handling and layout serialization overheads)',
    ram: '-120MB (By-passes high dynamic memory copy allocations)',
    vram: '0.00ms',
    ping: 'None',
    info: 'Low-level FArchive saving and loading paths. Replaces heavy dynamic structures and JSON string transformations with compact, zero-copy byte streams.',
    ueFeatures: ['FArchive output byte operations', 'Unified << streaming operators'],
    missingFeatures: ['Automatic save compilation pruning (redundant fields write to files unless managed by developers)']
  },
  'task_opt_10': {
    gpu: '0.00ms',
    cpu: '-1.20ms (Removes runtime character lookup loops entirely)',
    ram: '0.00MB (Bakes static integers directly into execution vectors)',
    vram: '0.00ms',
    ping: 'None',
    info: 'Compile-time FNV-1a constexpr hashing. Computes static text characters to 32-bit integers during compilers run, allowing O(1) integer checks at play-time.',
    ueFeatures: ['constexpr compile-time function evaluations', 'FName string dictionary hashing'],
    missingFeatures: ['Dynamic run-time string caching via constexpr (constexpr parameters MUST be static literals)']
  },
  'task_opt_11': {
    gpu: '0.00ms',
    cpu: '-1.50ms (Packs multiple boolean checks into singular register operations)',
    ram: '-8 bytes (Replaces multiple individual class storage spaces)',
    vram: '0.00ms',
    ping: 'None',
    info: 'Bitmask tagging flags structures. Collapses 64 distinct boolean states into static uint64 integers, checking active properties in under a single clock cycle.',
    ueFeatures: ['enum class : uint64 explicit memory specifications', 'ENUM_CLASS_FLAGS bitwise operation handlers'],
    missingFeatures: ['Native Blueprint interface support for bitwise arithmetic (requires C++ helper nodes)']
  },
  'task_opt_12': {
    gpu: '0.00ms (Indirect render pipeline gains of -1.2ms by saving CPU draw stall gaps)',
    cpu: '-8.20ms (Bypasses operating system heap allocation search loops and thread locks)',
    ram: '-100MB+ (Eradicates dynamic heap memory fragmentation and cache thrashing)',
    vram: '0.00ms',
    ping: 'None (Stabilizes co-op server ticking frames)',
    info: 'Linear Arena Allocator. Pre-allocates single big contiguous blocks, advancing a bump pointer inside x86 registers in 0.2ns instead of invoking stalling Heap memory mallocs.',
    ueFeatures: ['TMemStack<T> thread-local helper stacks', 'FMemStack frame block memory segments'],
    missingFeatures: ['Automatic multi-threaded continuous Arenas in general game classes (standard UObjects always malloc on Heap)']
  },
  'task_opt_13': {
    gpu: '0.00ms (Indirect rendering stabilizer of -1.0ms by preserving constant Game Thread throughputs)',
    cpu: '-6.20ms (FRunnable background worker thread calculations never stall or wait on Game Thread MUTEXes)',
    ram: 'Doubles RAM usage for the specific decoupled state buffers, e.g. +1.2MB for two 256x256 grids (completely negligible)',
    vram: '0.00ms',
    ping: '-25ms (Ensures packet replication sweeps never stall waiting for resource lock releases)',
    info: 'Double-Buffered State. Keeps a ReadBuffer and a WriteBuffer, letting workers write asynchronously while Game Thread reads safely in parallel; swaps index via atomic exchange in 1ns.',
    ueFeatures: ['FRenderCommandFence sync boundaries', 'Lock-Free atomic registers std::atomic_exchange'],
    missingFeatures: ['Out-of-the-box safe double-buffering wrappers for game systems template collections']
  },
  'task_opt_14': {
    gpu: '-0.50ms (Faster simulation calculations expedite coords dispatches to the GPU vertex engines)',
    cpu: '-4.80ms (MSVC / Clang safely vectorizes sum arrays into SIMD AVX / NEON hardware registers)',
    ram: '0.00MB (No extra allocation costs)',
    vram: '0.00ms',
    ping: 'None',
    info: 'SIMD Loop Autovectorization. Applying strict RESTRICT pointer declarations promises to the compiler that arrays do not overlap in memory, unlocking vector registers that process 4, 8, or 16 floats in one cycle.',
    ueFeatures: ['Platform-agnostic RESTRICT macro wrapper', 'Built-in vectorized math struct types (FVector/FPlane)'],
    missingFeatures: ['Automated compile-time autovectorization alerts inside standard Unreal Build Tool out logging']
  },
  'task_opt_15': {
    gpu: '0.00ms',
    cpu: '-5.50ms (Replaces runtime string/hash map key lookups with continuous array constant-offset indices)',
    ram: 'Saves 40MB+ globally by preventing temporary dynamic heap string buffers allocations',
    vram: '0.00ms',
    ping: 'None',
    info: 'Compile-Time Template Registry. Automatically assigns incremental unique integer indices to distinct types at application boot-time, converting gameplay queries into single-cycle O(1) actions.',
    ueFeatures: ['TIsSame<A, B> type traits templates', 'TStaticArray compile-time continuous tables'],
    missingFeatures: ['Compile-time static layout trackers for Blueprints assets and properties']
  }
};

/**
 * Returns customized, highly detailed, RPG-oriented hardware metrics and architectural notes for a specific task ID.
 * Falls back gracefully to structured mode metrics if individual task mapping is not defined.
 */
export const getIndividualTaskDiagnostic = (taskId: string, currentModeFallback: string): UTaskDiagnostic => {
  if (diagnosticsMap[taskId]) {
    return diagnosticsMap[taskId];
  }

  // Fallback to rich, intelligent, structured templates based on current visualizer mode if task-specific mapping is not registered
  switch (currentModeFallback) {
    case 'combat':
      return {
        gpu: '0.12ms (Skinned meshes bone updates)',
        cpu: '1.45ms (Collision traces and character state evaluations)',
        ram: '84MB (Hero meshes, animations, skeletal weights)',
        vram: '32MB (Shader skeleton buffers)',
        ping: 'Average +2.5ms (UDP Net packet evaluations)',
        info: 'Witcher 3 action mechanics. Handles direct dynamic hitbox sweep collisions in O(1) space, mapping health mutations and particle hits.',
        ueFeatures: ['SkeletalMeshComponent dynamic morph bounds', 'PoseableMesh attachments'],
        missingFeatures: ['Automatic broadphase hitbox collision pruning (requires spatial hashing logic)']
      };
    case 'console':
      return {
        gpu: '0.00ms (Text-heavy simulation)',
        cpu: '0.45ms (Overhead string copies in memory heap)',
        ram: '320KB (Accumulates heap memory stutters via FStrings)',
        vram: '0.5MB (Unicode character caching inside GPU)',
        ping: 'None',
        info: 'Dialogue logging system. Comparing string formats: dynamic strings, lightweight symbol names, and localized texts.',
        ueFeatures: ['String localization lookup tables', 'FName global string dictionary indexing'],
        missingFeatures: ['Automated string-duplication memory sweeping (forces manual use of String Tables)']
      };
    case 'pointers':
      return {
        gpu: '0.00ms',
        cpu: '0.05ms (O(1) direct address memory dereferencing)',
        ram: '16 bytes (Naked memory allocation without class blocks, highly fragmented under high loops)',
        vram: '0.00ms',
        ping: 'None',
        info: 'Deref pointers write straight to RAM coordinate segments. GC sweep recycles blocks without macros.',
        ueFeatures: ['Unreal Garbage Collector reference trees', 'UProperty reflection tree headers'],
        missingFeatures: ['Naked C++ raw pointers memory protections (GC ignores naked objects completely)']
      };
    case 'arrays':
      return {
        gpu: '0.00ms',
        cpu: 'O(1) instant hash lookup (vs O(N) linear iteration for simple vectors)',
        ram: '32KB (Bucket registry and hash maps arrays)',
        vram: '0.00ms',
        ping: 'None',
        info: 'TMap lookup performs key symbol hashing, resolving target bucket instantly without sweeping elements.',
        ueFeatures: ['TMap hash-map buckets serialization', 'TArray contiguous dynamic memory reallocation'],
        missingFeatures: ['Multi-threaded atomic map lookups (you must implement critical locks manually)']
      };
    case 'control_flow':
      return {
        gpu: '0.00ms',
        cpu: '0.01ms (Simple branch registers)',
        ram: '4 bytes (UENUM state tracking blocks)',
        vram: '0.00ms',
        ping: '+1.5ms (Server State replication interval)',
        info: 'State evaluation is handled via local conditional nodes. Assertions prevent thread violations.',
        ueFeatures: ['check(), ensure(), verify() error handlers', 'UENUM byte-serialization macros'],
        missingFeatures: ['Automatic player state rollback validation (requires custom predictor state wrappers)']
      };
    case 'loops':
    case 'nested_loops':
      const isNested = currentModeFallback === 'nested_loops';
      return {
        gpu: '0.00ms',
        cpu: isNested ? '8.50ms O(N^2) (Very heavy on wide inventories!)' : '0.12ms O(N) (Linear sum evaluations)',
        ram: '128 bytes (Registers stack storage)',
        vram: '0.00ms',
        ping: 'None',
        info: 'Inventories loops. O(n2) double loops lock execution pipelines directly, requiring O(N) spatial lookup or key hashing caches in high-density games.',
        ueFeatures: ['Fast range-based TArray iterators', 'Pre-allocated heap structures'],
        missingFeatures: ['O(N) unique array lookup hashing (must implement custom spatial registry)']
      };
    case 'actor_lifecycle':
      return {
        gpu: '1.20ms (FVector transform evaluations)',
        cpu: '1.80ms (Frame independent movement ticks using DeltaTime)',
        ram: '24KB (Kinematic positional buffers)',
        vram: '8MB (Positional buffer matrices)',
        ping: '+12ms (Network replication tick checks)',
        info: 'Updates transform matrices. Scale movement matching DeltaTime to stabilize speed under high and low frame fluctuations.',
        ueFeatures: ['Component Ticking sharing loops', 'FTimerManager gameplay callbacks register'],
        missingFeatures: ['Automatic sub-stepped physics sync under high server loops (must enable async physics manually)']
      };
    case 'reflection_bp':
      return {
        gpu: '0.22ms (Visual Node wires dynamic shader lines)',
        cpu: '1.45ms (Dynamic event binding execution delegates list)',
        ram: '640KB (Event listener registry vectors)',
        vram: '1.2MB (Node graph graphics cache)',
        ping: '+15ms (Multicast delegate RPCs)',
        info: 'Unreal' + 's event framework. Multicast delegates broadcast game-events directly to dynamic Blueprint functions.',
        ueFeatures: ['Unreal Header Tool (UHT) macros generating metadata', 'Multicast dynamic delegate bindings'],
        missingFeatures: ['Dynamic delegate compile-time type-safety warnings (fails at runtime unless properly bound)']
      };
    case 'optimization_pro':
      return {
        gpu: '-6.20ms (PSO caching and HISM mesh grouping)',
        cpu: '-3.50ms (Optimized drawing threads execution loops)',
        ram: '48MB',
        vram: '-250MB (Texture reuse limits)',
        ping: 'None',
        info: 'Critical optimization routines. Bakes Pipeline State Objects and groups instanced static structures to stabilize graphics budgets.',
        ueFeatures: ['HISM dynamic instancing', 'PSO compiler cache managers'],
        missingFeatures: ['Native auto-pruner for material switches (requires manual pipeline profiling)']
      };
    default:
      return {
        gpu: '1.85ms (LOD and shader caches evaluation)',
        cpu: '0.15ms (Worker pool offloads)',
        ram: '12.4MB (Asynchronous assets streaming heap pools)',
        vram: '46.0MB (Async texture allocations)',
        ping: 'None',
        info: 'Soft references and dynamic asynchronous streamable packages loading. Spawns structures off-thread.',
        ueFeatures: ['FStreamableManager async loading system', 'TaskGraph parallel worker threads'],
        missingFeatures: ['Automated automatic cache sweep collectors (must write custom memory unloaders)']
      };
  }
};
