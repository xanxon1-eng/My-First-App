import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock, Collapsible } from './OptimizationHelpers';
import tabData from '../../../TrainingCore/core/optimization_tabs_data.json';

const COMPONENTS: Record<string, any> = {
  div: 'div',
  span: 'span',
  p: 'p',
  ul: 'ul',
  li: 'li',
  strong: 'strong',
  code: 'code',
  pre: 'pre',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  br: 'br',
  a: 'a',
  FeatureMatrix,
  MultiplayerImpact,
  SectionCard,
  HighlightBox,
  StatRow,
  PageHeader,
  CodeBlock,
  Collapsible,
};

function resolveValue(val: string) {
    if (val === undefined) return undefined;
    if (typeof val !== 'string') return val;
    
    const trimmed = val.trim();

    if (trimmed.startsWith('COLORS.')) {
        const parts = trimmed.split('.');
        if (parts.length === 3) {
            return (COLORS as any)[parts[1]][parts[2]];
        }
        if (parts.length === 2) {
            return (COLORS as any)[parts[1]];
        }
    }
    
    if ((Icons as any)[trimmed]) {
        return (Icons as any)[trimmed];
    }

    // Handle style objects like "{ color: COLORS.kingfisher.warm }"
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        const styleObj: any = {};
        const pairs = trimmed.slice(1, -1).split(',');
        for (let pair of pairs) {
            const [k, v] = pair.split(':').map(s => s.trim());
            if (k && v) {
                styleObj[k] = resolveValue(v);
            }
        }
        if (Object.keys(styleObj).length > 0) return styleObj;
        
        try {
            return JSON.parse(trimmed.replace(/'/g, '"'));
        } catch(e) {}
    }

    // Check if it looks like a JSON array expression
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
       try {
           return JSON.parse(trimmed);
       } catch(e) {
           try {
               const cleaned = trimmed.replace(/'/g, '"').replace(/\\"/g, '"');
               return JSON.parse(cleaned);
           } catch(e2) {}
       }
    }
    return val;
}

function renderNode(node: any, index: number): React.ReactNode {
    if (!node) return null;
    if (node.type === 'text') return node.value;
    if (node.type === 'expression') return null;

    const Comp = COMPONENTS[node.type] || (Icons as any)[node.type] || node.type;
    const resolvedProps: any = {};
    
    if (node.props) {
        for (const [key, value] of Object.entries(node.props)) {
            if (key === 'key') continue;
            resolvedProps[key] = resolveValue(value as string);
        }
    }

    if (!node.children || node.children.length === 0) {
        return <Comp key={index} {...resolvedProps} />;
    }

    return (
        <Comp key={index} {...resolvedProps}>
            {node.children.map((child: any, i: number) => renderNode(child, i))}
        </Comp>
    );
}

// -------------------------------------------------------------
// UNIVERSAL REAL-TIME HARDWARE BUDGET SIMULATOR DEFINITIONS
// -------------------------------------------------------------

interface SectorSpec {
    title: string;
    description: string;
    icon: any;
    options: {
        id: string;
        label: string;
        choices: string[];
    }[];
    calculate: (selections: Record<string, string>) => {
        cpu: number;
        gpu: number;
        ram: number;
        vram: number;
        latency: number;
        verdict: string;
        ueHas: string[];
        ueLacks: string[];
        customWorkaround: string;
        designNote: string;
    };
}

const SECTOR_DATA: Record<number, SectorSpec> = {
    1: {
        title: "CPU Cache Alignment & Memory Allocation",
        description: "Diagnose L1/L2 cache locality, object allocations, Game Thread ticking queues, and memory structures.",
        icon: Icons.Cpu,
        options: [
            { id: "align", label: "Struct Variable Layout", choices: ["Default Padding Offset", "Contiguous Size-Packed Packing"] },
            { id: "tick", label: "Ticking Orchestration", choices: ["Individual Actor Tick()", "Central WorldSubsystem Pass"] },
            { id: "gc", label: "Garbage Collector Scheme", choices: ["Standard Mark-Sweep Cycles", "FGCCluster Object Grouping"] }
        ],
        calculate: (selections) => {
            const isPacked = selections.align === "Contiguous Size-Packed Packing";
            const isBatchedTick = selections.tick === "Central WorldSubsystem Pass";
            const isGCClustered = selections.gc === "FGCCluster Object Grouping";
            
            let cpu = 14.5;
            let ram = 2.45;
            let gpu = 5.2;
            let vram = 1.8;
            let latency = 0;

            if (isPacked) { cpu -= 3.8; ram -= 0.45; }
            if (isBatchedTick) { cpu -= 5.2; }
            if (isGCClustered) { cpu -= 3.5; ram -= 0.35; } // GC Spikes eliminated

            return {
                cpu: Math.max(0.4, cpu),
                gpu,
                ram: Math.max(0.5, ram),
                vram,
                latency,
                verdict: `Variable layout aligned Largest-to-Smallest speeds L1 CPU retrieval. Central ${isBatchedTick ? "UWorldSubsystem" : "Actor tick pool"} reduces thread instruction pointer updates. ${isGCClustered ? "GC frame-sweeping is completely eliminated in bulk" : "Standard Mark-Sweep collection retains a risk of 15ms spikes during massive spell spawns"}.`,
                ueHas: [
                    "Dynamic Multicast Delegates (decouples signal ticks)",
                    "UWorldSubsystem & UGameInstanceSubsystem (tick encapsulation)",
                    "gc.CreateGCClusters=1 console clustering overrides"
                ],
                ueLacks: [
                    "Native runtime compiler diagnostics highlighting padding byte-waste",
                    "Automated reference sweep leakage visualizer inside local editor"
                ],
                customWorkaround: "Ensure all custom gameplay records (e.g. Loot modifiers) are structured inside tight size-aligned USTRUCTs without compiler gap-bytes. Run Memreport dump dumps quarterly.",
                designNote: "Inspired by Baldur's Gate 3 multi-page UI load speeds. Reducing reflection memory lookups ensures immediate container opening frames."
            };
        }
    },
    2: {
        title: "Crowd ECS & Flowfield AI Simulator",
        description: "Configure behavior ticking limits, spatial search patterns, and crowd animation sharing bounds.",
        icon: Icons.Users,
        options: [
            { id: "pipeline", label: "NPC Actor Framework", choices: ["Standard ticking Blueprints", "MassEntity contiguous fragments"] },
            { id: "path", label: "Spatial Pathfinding Search", choices: ["Standard A* Navmesh sweep", "Hierarchical Flowfields Grid"] },
            { id: "anim", label: "Animation Bone Evaluation", choices: ["Rigid mesh evaluations", "Significance Distance scale"] }
        ],
        calculate: (selections) => {
            const isMass = selections.pipeline === "MassEntity contiguous fragments";
            const isFlow = selections.path === "Hierarchical Flowfields Grid";
            const isSignif = selections.anim === "Significance Distance scale";

            let cpu = 24.8;
            let gpu = 8.4;
            let ram = 2.85;
            let vram = 2.1;
            let latency = 12; // ping impact on tick sync

            if (isMass) { cpu -= 14.2; ram -= 0.65; latency -= 8; }
            if (isFlow) { cpu -= 5.5; }
            if (isSignif) { cpu -= 4.1; vram -= 0.35; }

            return {
                cpu: Math.max(0.6, cpu),
                gpu,
                ram: Math.max(0.8, ram),
                vram: Math.max(0.4, vram),
                latency: Math.max(0, latency),
                verdict: `Simulating town civilians via ${isMass ? "Data-Oriented MassEntity slices" : "individual Blueprint actors"} keeps memory layout contiguous. Routing crowds using a shared ${isFlow ? "Flowfield Hash matrix" : "A* path query search"} changes navigation to O(1). Animation updating culls bone ticks successfully.`,
                ueHas: [
                    "UMassEntitySubsystem & FMassEntityManager",
                    "USignificanceManager tick scaling managers",
                    "Animation Sharing Subsystem bone caching grids"
                ],
                ueLacks: [
                    "Out-of-the-box Mass-compatible dynamic Behavior Trees (forces custom state machines)",
                    "Native dynamic crowd avoidances on Mass threads"
                ],
                customWorkaround: "Host background flocking crowds directly on parallel C++ worker threads using simple Boids math, feeding location endpoints to instanced GPU meshes, completely bypassing AActor ticks.",
                designNote: "Developed to emulate The Witcher 3 Novigrad street crowd scheduling, letting 200+ citizens render simultaneously with a CPU budget of sub-1.0ms."
            };
        }
    },
    3: {
        title: "Dedicated Server Netcode & Client Prediction",
        description: "Tune RPC packet sizes, Iris scoping frequencies, and client predictive packet latency buffers.",
        icon: Icons.Radio,
        options: [
            { id: "framework", label: "Connection Net Replication", choices: ["Legacy NetChannels channels", "IRIS Parallelised scoping"] },
            { id: "dormancy", label: "Actor Network Dormancy", choices: ["Active every-frame replications", "Dynamic NetDormancy triggers"] },
            { id: "sync", label: "Lag Correction & Prediction", choices: ["Authoritative absolute sweeps", "Lag Rewind history tracers"] }
        ],
        calculate: (selections) => {
            const isIris = selections.framework === "IRIS Parallelised scoping";
            const isDormant = selections.dormancy === "Dynamic NetDormancy triggers";
            const isPredicted = selections.sync === "Lag Rewind history tracers";

            let cpu = 18.2;
            let gpu = 4.5;
            let ram = 1.95;
            let vram = 1.1;
            let latency = 210; // simulated packet-load ping delay

            if (isIris) { cpu -= 5.4; }
            if (isDormant) { cpu -= 2.8; latency -= 60; }
            if (isPredicted) { cpu += 1.2; latency -= 130; } // predictive saves feel: -130ms ping feel

            return {
                cpu: Math.max(0.4, cpu),
                gpu,
                ram,
                vram,
                latency: Math.max(10, latency),
                verdict: `Parallelizing connection scoping via ${isIris ? "IRIS scoping rings" : "Standard legacy channels"} offloads networking computation out of the main thread. ${isDormant ? "NetDormancy disables passive object checks" : "Static containers consume socket checks"}. ${isPredicted ? "Historical circular location arrays allow zero-lag weapon hit verification on high latency connections" : "Standard absolute sweeping triggers desyncs beyond 100ms ping"}.`,
                ueHas: [
                    "IRIS Replication Engine (available in modern UE5 builds)",
                    "Replication Graph spatial cluster culling structures",
                    "NetDormancy states (DORM_Initial, DORM_DormantAll)"
                ],
                ueLacks: [
                    "Integrated 3D rollback physics tracing libraries",
                    "Dedicated dynamic packet jitter simulators within editor boundaries"
                ],
                customWorkaround: "Wrap cosmetic inventories inside compressed raw C++ FArchive binary serialize streams to stop UProperty metadata bloat. Ensure chests set dorm state immediately on game-start.",
                designNote: "Directly mimics Path of Exile skill execution mechanics. Lag rewinds keep combat feeling responsive, even if real connections have massive jitter."
            };
        }
    },
    4: {
        title: "Open-World Partition & Saving I/O",
        description: "Benchmark disk serialization pipelines, save game file compression, and tile streaming bounds.",
        icon: Icons.HardDrive,
        options: [
            { id: "stream", label: "Tile Streaming System", choices: ["Synchronous physical blocking", "Asynchronous FStreamableManager"] },
            { id: "bubble", label: "Loading Cell Radius", choices: ["Wide Static (500 meters)", "Adaptive Cameratrigger (250m)"] },
            { id: "save", label: "Disk Save Game Format", choices: ["Reflection-based JSON fields", "Byte-aligned Binary FArchive"] }
        ],
        calculate: (selections) => {
            const isAsync = selections.stream === "Asynchronous FStreamableManager";
            const isAdaptive = selections.bubble === "Adaptive Cameratrigger (250m)";
            const isBinary = selections.save === "Byte-aligned Binary FArchive";

            let cpu = 22.1;
            let gpu = 9.2;
            let ram = 3.4;
            let vram = 4.2;
            let latency = 0;

            if (isAsync) { cpu -= 10.8; }
            if (isAdaptive) { cpu -= 2.5; vram -= 1.4; }
            if (isBinary) { cpu -= 4.2; ram -= 0.35; } // prevents 400ms saves-write hitch

            return {
                cpu: Math.max(0.5, cpu),
                gpu,
                ram: Math.max(0.4, ram),
                vram: Math.max(0.4, vram),
                latency,
                verdict: `${isAsync ? "FStreamableManager runs disk requests asynchronously on worker threads" : "Blocking file loading hitches main thread gameplay"}. Adaptive streaming bubble restricts asset allocations dynamically. Serialization via ${isBinary ? "raw operator<< streams bypasses reflection" : "heavy property string maps duplicates heap variables"}.`,
                ueHas: [
                    "World Partition grid stream buffers",
                    "FStreamableManager and async package asset handles",
                    "FArchive memory writer arrays"
                ],
                ueLacks: [
                    "Native dynamic memory sweeping compression models for in-RAM saves",
                    "Integrated sector tile pre-caching heuristics"
                ],
                customWorkaround: "Bypass standard UGameplayStatics SaveGame classes. Serialize nested equipment records directly to packed byte arrays. Run loading commands inside dedicated Async Task pools.",
                designNote: "Bypasses Baldur's Gate 3 style inventory save freezes, compressing files by 85% to guarantee saving completes in under 2.0ms."
            };
        }
    },
    5: {
        title: "GPU Vertex Output & Geometry Instancing",
        description: "Benchmark micro-polygon rendering, mesh draw batching, and GPU visibility occlusion.",
        icon: Icons.Monitor,
        options: [
            { id: "engine", label: "Foliage Geometry System", choices: ["Standard Meshes with LODs", "Nanite Micro-polygon Streaming"] },
            { id: "batch", label: "Mesh Draw Dispatching", choices: ["Individual Actor Mesh loops", "Hierarchical Instanced Component (HISM)"] },
            { id: "cull", label: "Occlusion Query Method", choices: ["Basic Distance Culling volume", "Asynchronous GPU HZB Occlusion"] }
        ],
        calculate: (selections) => {
            const isNanite = selections.engine === "Nanite Micro-polygon Streaming";
            const isHism = selections.batch === "Hierarchical Instanced Component (HISM)";
            const isHZB = selections.cull === "Asynchronous GPU HZB Occlusion";

            let cpu = 12.8;
            let gpu = 23.5;
            let ram = 2.1;
            let vram = 3.65;
            let latency = 0;

            if (isNanite) { gpu -= 6.4; vram -= 1.15; }
            if (isHism) { cpu -= 5.2; gpu -= 2.4; }
            if (isHZB) { gpu -= 3.8; }

            return {
                cpu: Math.max(0.3, cpu),
                gpu: Math.max(0.5, gpu),
                ram,
                vram: Math.max(0.3, vram),
                latency,
                verdict: `Drawing repeating debris props as a unified ${isHism ? "HISM dynamic instanced array" : "individual draw calls pool"} collapses CPU call submissions. Utilizing ${isNanite ? "Nanite virtualized pipelines" : "traditional LOD bands"} speeds polygon delivery. Occl_culling checks hides offscreen vertices asynchronously on custom GPU pipelines.`,
                ueHas: [
                    "Nanite virtualized geometry compression engine",
                    "UHierarchicalInstancedStaticMeshComponent classes",
                    "Hierarchical Z-Buffer occlusion passes"
                ],
                ueLacks: [
                    "Deformable skin meshes Nanite support (skeletal monsters need legacy chains)",
                    "Native vertex sorting tools representing transparency orders"
                ],
                customWorkaround: "Group identical static elements (such as boulders and ruins) into unified HISM grids. Set foliage systems to automatically switch dynamically based on distance bounds.",
                designNote: "Resolves performance bottlenecks in Witcher 3-style dense forests. Instancing foliage assets keeps drawer overhead lightweight."
            };
        }
    },
    6: {
        title: "Shader Compilers & Pixel Pipeline",
        description: "Simulate Pipeline State Object (PSO) baking, material instruction complexity, and foliage wind sway constraints.",
        icon: Icons.Flame,
        options: [
            { id: "pso", label: "Shader Compilation Mode", choices: ["Dynamic Runtime compiling", "PSO Cache pre-compiled loading"] },
            { id: "sway", label: "Foliage Wind Displacement", choices: ["Full distance vertex sways", "Wind material locks (>45m)"] },
            { id: "blend", label: "Particle Blend Strategy", choices: ["Translucent overlapping sprites", "Opaque blocks with depth offsets"] }
        ],
        calculate: (selections) => {
            const isPSO = selections.pso === "PSO Cache pre-compiled loading";
            const isLocked = selections.sway === "Wind material locks (>45m)";
            const isOpaque = selections.blend === "Opaque blocks with depth offsets";

            let cpu = 8.5; // compilation freezes
            let gpu = 18.4;
            let ram = 2.15;
            let vram = 2.45;
            let latency = 0;

            if (isPSO) { cpu -= 1.0; } // cancels 250ms render-thread stall hitches on spells
            if (isLocked) { gpu -= 3.4; } // Virtual Shadow Map hits stabilized
            if (isOpaque) { gpu -= 4.2; vram -= 0.35; }

            return {
                cpu,
                gpu: Math.max(0.4, gpu),
                ram: isPSO ? ram + 0.15 : ram, // minor cache overhead
                vram,
                latency,
                verdict: `${isPSO ? "Baking PSOs during initial loading maps cancels the 250ms compile hitches on spell casting" : "Dynamic runtime compiling risks constant stutter stutters during elemental spills"}. Locking wind sway calculations beyond 45m stabilizes the shadow cache. Replacing transparent planes prevents severe overdraw.`,
                ueHas: [
                    "Pipeline State Object (PSO) baking compilation hooks",
                    "Virtual Shadow Maps Shadow Cache tracking",
                    "Material Parameter Collection buffers"
                ],
                ueLacks: [
                    "Dynamic automated shader permutations pruning heuristics in-editor",
                    "Out-of-the-box transparent sorting on complex custom pixel nodes"
                ],
                customWorkaround: "Generate specific `.rec.upso` files by running playtests inside shipping setups. Lock wind material positions beyond a specific distance to keep shadow map cache hits above 95%.",
                designNote: "Optimized for Path of Exile elemental spills, where multiple rapid spellcasts can trigger overlaps leading to GPU overdraw bottlenecks."
            };
        }
    },
    7: {
        title: "Dynamic Global Illumination & Lumen",
        description: "Test diffuse ambient lighting, radiance cache grids, and stochastic direct ray distribution.",
        icon: Icons.Sun,
        options: [
            { id: "gi", label: "Indirect Light System", choices: ["Hardware Ray-Traced Lumen GI", "Sparse Camera-Targeted Radiance Cascades"] },
            { id: "direct", label: "Direct Lights Renderer", choices: ["Standard Deferred light overlaps", "Stochastic Sampling (MegaLights)"] },
            { id: "preset", label: "Baked Legacy Interpolation", choices: ["Dynamic Real-time Lumen passes", "Stationary Lightmass + Probe grid"] }
        ],
        calculate: (selections) => {
            const isRC = selections.gi === "Sparse Camera-Targeted Radiance Cascades";
            const isMega = selections.direct === "Stochastic Sampling (MegaLights)";
            const isBaked = selections.preset === "Stationary Lightmass + Probe grid";

            let cpu = 7.2;
            let gpu = 25.8;
            let ram = 1.9;
            let vram = 3.8;
            let latency = 0;

            if (isRC) { gpu -= 6.2; }
            if (isMega) { gpu -= 3.8; }
            if (isBaked) { gpu -= 14.5; vram -= 1.5; }

            return {
                cpu,
                gpu: Math.max(0.5, gpu),
                ram,
                vram: Math.max(0.3, vram),
                latency,
                verdict: `${isBaked ? "Baking stationary lightmaps guarantees sub-1.5ms render costs" : "Lumen dynamic real-time tracing runs ray checks on GPU pipelines"}. Camera-targeted ${isRC ? "Radiance Cascades caches dynamic irradiance diffuse GI" : "Lumen arrays trace global volumes"}. ${isMega ? "Stochastic sampling checks point lights per-pixel" : "Standard overlapping deferred channels overloads shader pools"}.`,
                ueHas: [
                    "Lumen Real-time GI volume maps",
                    "MegaLights stochastic emitters (UE 5.5+)",
                    "Volumetric Lightmap Probe interpolation systems"
                ],
                ueLacks: [
                    "Seamless live mixing from fully-baked lightmaps to real-time RT GI",
                    "Native dynamic Radiance Cascades integration (requires custom HLSL shaders)"
                ],
                customWorkaround: "Use baked static lightmaps paired with Volumetric Lightmap probe grids for mid-range platforms and handheld devices to secure solid frames.",
                designNote: "Provides dynamic Witcher 3-style day-night cycles on consoles by bypassing expensive hardware raytracing in deep-swamp locations."
            };
        }
    },
    8: {
        title: "Audio Priority & Slate UI Layout",
        description: "Review MetaSound channels culling, HUD redrawing, and sub-stepped physics.",
        icon: Icons.Music,
        options: [
            { id: "audio", label: "Acoustic Prioritisation", choices: ["Distance volume checks", "Obstacle-tracking Raycast Culler"] },
            { id: "ui", label: "HUD Slate Redrawing", choices: ["Redraw every-frame (Default)", "UMG Slate Invalidation Box"] },
            { id: "phys", label: "Physics Solver Rate", choices: ["Standard synchronous tick", "Chaos Async Sub-stepping"] }
        ],
        calculate: (selections) => {
            const isCullSound = selections.audio === "Obstacle-tracking Raycast Culler";
            const isInvalidated = selections.ui === "UMG Slate Invalidation Box";
            const isSubstepped = selections.phys === "Chaos Async Sub-stepping";

            let cpu = 15.8;
            let gpu = 6.2;
            let ram = 1.85;
            let vram = 1.15;
            let latency = 0;

            if (isCullSound) { cpu -= 1.4; } // MetaSounds channel saving
            if (isInvalidated) { cpu -= 3.8; } // UMG ticking saving
            if (isSubstepped) { cpu -= 2.5; }

            return {
                cpu: Math.max(0.4, cpu),
                gpu,
                ram,
                vram,
                latency,
                verdict: `Wrapping bloated interface components within ${isInvalidated ? "UMG Invalidation Boxes" : "dynamic Slate canvases"} prevents redundant redraw updates. MetaSounds acoustic rays cull obscured enemy sound buffers. Async substepped Chaos loops drop blocking main thread delays.`,
                ueHas: [
                    "UMG UI Invalidation Box frameworks",
                    "MetaSound procedural mixing tracks",
                    "Chaos Physics asynchronously substepped substeppers"
                ],
                ueLacks: [
                    "Automatic smart sound cleanup beyond active screen spaces",
                    "Integrated vector layout optimization monitors"
                ],
                customWorkaround: "Encapsulate static inventories inside self-invalidating wrapper controls. Track combat elements inside dynamic sound rings, capping active spatial audio channels to 32 players.",
                designNote: "Directly minimizes Baldur's Gate 3-style interface lag where active menus can trigger heavy draw calls on thousands of inventory items."
            };
        }
    }
};

const getSectorForTab = (tabId: string): number => {
    const cpumem = ['PipelineTab', 'ArchitectureTab', 'CppOptimalTab', 'MemoryStateTab', 'SubsystemsTab', 'HeadManagerTab', 'MultithreadingTab'];
    const ai = ['MassEntityTab', 'AITab', 'BoidsFlockingTab', 'CollisionTab', 'OptimalAlgorithmsTab'];
    const net = ['NetworkingPhysicsTab', 'RewindPhysicsTab', 'IrisReplicationTab', 'ServerProtocolTab', 'DecoupledBackendTab', 'DeterministicSyncTab', 'ClientPredictionTab', 'FastArrayTab', 'InterestManagementTab'];
    const world = ['WorldPartitionTab', 'OcclusionTab', 'AssetManagerTab', 'GCClusteringTab', 'StorageTab'];
    const geo = ['GeometryTab', 'LODTab', 'DrawCallsTab'];
    const shader = ['MaterialsTab', 'ShaderPermutationsTab', 'TexturesTab'];
    const gi = ['GICachingTab', 'PostProcessTab'];
    
    if (cpumem.includes(tabId)) return 1;
    if (ai.includes(tabId)) return 2;
    if (net.includes(tabId)) return 3;
    if (world.includes(tabId)) return 4;
    if (geo.includes(tabId)) return 5;
    if (shader.includes(tabId)) return 6;
    if (gi.includes(tabId)) return 7;
    return 8; 
};

export const UniversalSimulator: React.FC<{ tabId: string }> = ({ tabId }) => {
    const sectorId = getSectorForTab(tabId);
    const spec = SECTOR_DATA[sectorId] || SECTOR_DATA[8];

    // Initialize state with default choices on mount or tab transition
    const [selections, setSelections] = useState<Record<string, string>>({});

    useEffect(() => {
        const defaults: Record<string, string> = {};
        spec.options.forEach(opt => {
            defaults[opt.id] = opt.choices[0];
        });
        setSelections(defaults);
    }, [tabId, sectorId]);

    const handleChoiceChange = (optId: string, value: string) => {
        setSelections(prev => ({
            ...prev,
            [optId]: value
        }));
    };

    const metrics = spec.calculate(selections);
    const isCpuTargetMet = metrics.cpu <= 16.67;
    const isGpuTargetMet = metrics.gpu <= 16.67;

    return (
        <div className="bg-kingfisher-panel/90 border border-kingfisher-border rounded-xl p-6 shadow-xl mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 bg-blue-500/10 text-blue-400 border-l border-b border-kingfisher-border text-[9px] font-mono uppercase tracking-widest rounded-bl-xl font-bold flex items-center gap-1.5">
                <Icons.Terminal className="w-3" /> Real-time Budget Engine
            </div>

            <h3 className="text-white text-lg font-bold tracking-wide mb-1 flex items-center gap-2">
                <Icons.Sliders className="w-5 h-5 text-blue-400" /> Interactive Optimization Simulator
            </h3>
            <p className="text-kingfisher-muted text-xs mb-6">
                Change specific architectural configurations below. Observe real-time budget impacts on CPU timers, G-Buffer rasters, memory envelopes, and client-server ping coordinates.
            </p>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* SELECTORS WRAP */}
                <div className="xl:col-span-5 space-y-4">
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-4">
                        <div className="text-xs font-bold uppercase tracking-wider text-kingfisher-muted/80 flex items-center justify-between border-b border-white/5 pb-2">
                            <span>Diagnostic Domain options</span>
                            <span className="text-[10px] text-amber-500 font-mono">&#x25C9; Active Sandbox</span>
                        </div>
                        
                        <div className="space-y-3 pt-1">
                            {spec.options.map((opt) => (
                                <div key={opt.id} className="space-y-1.5">
                                    <label className="text-[11px] font-semibold text-white/80 block">{opt.label}</label>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {opt.choices.map((choice) => {
                                            const isSelected = selections[opt.id] === choice;
                                            return (
                                                <button
                                                    key={choice}
                                                    onClick={() => handleChoiceChange(opt.id, choice)}
                                                    className={`text-[10px] py-2 px-3 rounded-md transition-all font-medium border text-center ${
                                                        isSelected
                                                            ? 'bg-blue-500/15 text-blue-300 border-blue-500/40'
                                                            : 'bg-black/30 text-kingfisher-muted hover:text-white border-transparent hover:bg-neutral-800'
                                                    }`}
                                                >
                                                    {choice.split(' (')[0]}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-3.5 bg-black/40 rounded-xl border border-yellow-500/10 text-[11px] text-amber-400 font-mono">
                        <strong className="text-yellow-500 flex items-center gap-1 uppercase tracking-wider text-[10px] mb-1.5">
                            <Icons.AlertTriangle className="w-3.5 h-3.5" /> Project Design Sandbox Note
                        </strong>
                        {metrics.designNote}
                    </div>
                </div>

                {/* METRICS RESULTS */}
                <div className="xl:col-span-7 flex flex-col justify-between bg-black/30 border border-white/5 p-5 rounded-2xl">
                    <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-kingfisher-muted flex items-center gap-1.5">
                            <Icons.Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> Diagnostic Telemetry Visualizer
                        </span>
                        <div className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Preset Active
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* CPU */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <Icons.Cpu className="w-3.5 h-3.5 text-amber-400" /> CPU Game Thread Frame Budget
                                </span>
                                <span className={`font-mono text-sm font-bold ${isCpuTargetMet ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {metrics.cpu.toFixed(1)} ms {isCpuTargetMet ? '(Target Met)' : '(Spiking Overhead)'}
                                </span>
                            </div>
                            <div className="h-2.5 w-full bg-black/80 rounded-full overflow-hidden border border-white/5 relative">
                                <div 
                                    className={`h-full transition-all duration-300 rounded-full ${isCpuTargetMet ? 'bg-emerald-500' : 'bg-red-500'}`}
                                    style={{ width: `${Math.min(100, (metrics.cpu / 35) * 100)}%` }}
                                />
                                <div className="absolute left-[47.6%] top-0 h-full w-[2px] bg-yellow-500/60" title="16.67ms (60 FPS Limit)" />
                            </div>
                        </div>

                        {/* GPU */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <Icons.Monitor className="w-3.5 h-3.5 text-blue-400" /> GPU Draw Pipeline Overhead
                                </span>
                                <span className={`font-mono text-sm font-bold ${isGpuTargetMet ? 'text-blue-400' : 'text-purple-400'}`}>
                                    {metrics.gpu.toFixed(1)} ms
                                </span>
                            </div>
                            <div className="h-2.5 w-full bg-black/80 rounded-full overflow-hidden border border-white/5 relative">
                                <div 
                                    className={`h-full transition-all duration-300 rounded-full ${isGpuTargetMet ? 'bg-blue-500' : 'bg-purple-500'}`}
                                    style={{ width: `${Math.min(100, (metrics.gpu / 35) * 100)}%` }}
                                />
                                <div className="absolute left-[47.6%] top-0 h-full w-[2px] bg-yellow-500/60" title="16.67ms (60 FPS Limit)" />
                            </div>
                        </div>

                        {/* COLUMN DETAILS */}
                        <div className="grid grid-cols-3 gap-3 pt-3">
                            <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
                                <div className="flex items-center justify-center gap-1.5 mb-1 text-purple-400">
                                    <Icons.Database className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase text-kingfisher-muted">System RAM</span>
                                </div>
                                <div className="text-base font-mono font-bold text-white">{metrics.ram.toFixed(2)} GB</div>
                            </div>

                            <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
                                <div className="flex items-center justify-center gap-1.5 mb-1 text-pink-400">
                                    <Icons.HardDrive className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase text-kingfisher-muted">GPU VRAM</span>
                                </div>
                                <div className="text-base font-mono font-bold text-white">{metrics.vram.toFixed(2)} GB</div>
                            </div>

                            <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
                                <div className="flex items-center justify-center gap-1.5 mb-1 text-emerald-400">
                                    <Icons.Radio className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase text-kingfisher-muted">Net Latency</span>
                                </div>
                                <div className="text-base font-mono font-bold text-white">{metrics.latency} ms</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-3 rounded-xl bg-black/50 border border-white/5">
                        <div className="text-[10px] font-mono text-emerald-400 mb-1 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            <span>DYNAMIC CONTEXT REPORT LOG</span>
                        </div>
                        <p className="text-[11px] font-mono text-kingfisher-muted leading-relaxed">
                            {metrics.verdict}
                        </p>
                    </div>
                </div>
            </div>

            {/* UNREAL ENGINE COMPATIBILITY MAPPINGS */}
            <div className="mt-6 border-t border-kingfisher-border/40 pt-5">
                <span className="text-white font-bold text-xs uppercase tracking-wider block mb-3">
                    Unreal Engine 5 Core Alignment Configuration Summary
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-2">
                        <span className="text-emerald-400 font-bold uppercase tracking-widest text-[9px] flex items-center gap-1">
                            <Icons.CheckCircle className="w-3.5 h-3.5 shrink-0" /> Unreal Has Out-of-the-Box
                        </span>
                        <ul className="text-xs text-kingfisher-muted space-y-1.5">
                            {metrics.ueHas.map((h, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                    <span className="text-emerald-500 font-bold select-none">•</span>
                                    <span>{h}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-2">
                        <span className="text-amber-400 font-bold uppercase tracking-widest text-[9px] flex items-center gap-1">
                            <Icons.XCircle className="w-3.5 h-3.5 shrink-0" /> Unreal Lacks & Needs Workarounds
                        </span>
                        <ul className="text-xs text-kingfisher-muted space-y-1.5">
                            {metrics.ueLacks.map((l, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                    <span className="text-amber-400 font-bold select-none">•</span>
                                    <span>{l}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-4 p-3.5 bg-blue-500/5 border border-blue-500/10 rounded-xl space-y-1 text-xs">
                    <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                        <Icons.CheckSquare className="w-3.5 h-3.5" /> High-Performance C++ Workaround Procedure
                    </span>
                    <p className="text-kingfisher-muted leading-relaxed">
                        {metrics.customWorkaround}
                    </p>
                </div>
            </div>
        </div>
    );
};

// -------------------------------------------------------------
// DYNAMIC TAB INTEGRATION
// -------------------------------------------------------------

interface DynamicTabProps {
   tabId: string;
}

export const DynamicTab: React.FC<DynamicTabProps> = ({ tabId }) => {
    const data = (tabData as any)[tabId];
    if (!data) return <div className="p-10 text-white">Tab Data Not Found for {tabId}</div>;

    // Utilize split visual layout injection so that page headers load natively with the simulator underneath
    return (
        <div className="dynamic-tab-container">
             {(() => {
                if (data.type === 'div' && data.children && data.children.length > 0) {
                    const firstChild = data.children[0];
                    const isPageHeader = firstChild && firstChild.type === 'PageHeader';
                    const pageHeaderNode = isPageHeader ? renderNode(firstChild, 0) : null;
                    const remainingNodes = isPageHeader 
                        ? data.children.slice(1).map((child: any, i: number) => renderNode(child, i + 1))
                        : data.children.map((child: any, i: number) => renderNode(child, i));
                        
                    return (
                        <div className="space-y-6">
                            {pageHeaderNode}
                            <UniversalSimulator tabId={tabId} />
                            {remainingNodes}
                        </div>
                    );
                }
                
                return (
                    <div className="space-y-6">
                        <UniversalSimulator tabId={tabId} />
                        {renderNode(data, 0)}
                    </div>
                );
             })()}
        </div>
    );
};
