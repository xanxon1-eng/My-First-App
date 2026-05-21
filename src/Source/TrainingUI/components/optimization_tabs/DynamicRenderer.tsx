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
    const [platform, setPlatform] = useState<"mobile" | "console" | "pc_ultra">("console");
    const [scenario, setScenario] = useState<"novigrad" | "swamp" | "coop_boss" | "dungeon">("novigrad");
    const [selectedMetricTab, setSelectedMetricTab] = useState<"frame" | "memory" | "network">("frame");

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

    // Calculate core metrics using SECTOR_DATA as starting point
    const baseMetrics = spec.calculate(selections);

    // Apply advanced RPG workloads and platform constraints
    let rawCpu = baseMetrics.cpu;
    let rawGpu = baseMetrics.gpu;
    let rawRam = baseMetrics.ram;
    let rawVram = baseMetrics.vram;
    let rawLatency = baseMetrics.latency;

    // Apply Scenario baselines
    let scenarioCpuBonus = 0;
    let scenarioGpuBonus = 0;
    let scenarioRamBonus = 0;
    let scenarioVramBonus = 0;
    let scenarioNetBonus = 0;

    if (scenario === "novigrad") {
        scenarioCpuBonus = 12.5; // Novigrad High NPC actor ticking desyncs
        scenarioRamBonus = 1.25;
        scenarioGpuBonus = 2.0;
        scenarioVramBonus = 0.40;
        scenarioNetBonus = 15;
    } else if (scenario === "swamp") {
        scenarioCpuBonus = 1.5;
        scenarioRamBonus = 0.50;
        scenarioGpuBonus = 14.5; // Dense swamp foliage overdraw + VSM Cache misses
        scenarioVramBonus = 2.45;
    } else if (scenario === "coop_boss") {
        scenarioCpuBonus = 9.5; // PoE style extreme elements, area overlaps & physics sweeps
        scenarioRamBonus = 0.40;
        scenarioGpuBonus = 6.5;
        scenarioVramBonus = 0.55;
        scenarioNetBonus = 160; // Desync packet queues congestion
    } else if (scenario === "dungeon") {
        scenarioCpuBonus = 0.5;
        scenarioRamBonus = 0.10;
        scenarioGpuBonus = 1.5;
        scenarioVramBonus = 0.15;
        scenarioNetBonus = 5;
    }

    rawCpu += scenarioCpuBonus;
    rawGpu += scenarioGpuBonus;
    rawRam += scenarioRamBonus;
    rawVram += scenarioVramBonus;
    rawLatency += scenarioNetBonus;

    // Apply target platform modifiers
    let platformCpuScale = 1.0;
    let platformGpuScale = 1.0;
    let ramCap = 12.0;
    let vramCap = 8.0;
    let frameBudgetLimit = 16.67; // 60 FPS standard target
    let targetFpsText = "60 FPS Target (Console)";

    if (platform === "mobile") {
        platformCpuScale = 2.1; // Mobile CPUs have slow single-thread ticking
        platformGpuScale = 1.7; // Mobile graphics chipsets lack high compute ALUs
        ramCap = 3.5; // Tight standard pocket memory allocation limit
        vramCap = 1.5;
        frameBudgetLimit = 33.33; // 30 FPS console target
        targetFpsText = "30 FPS Target (Mobile/Switch)";
    } else if (platform === "console") {
        platformCpuScale = 1.0;
        platformGpuScale = 1.0;
        ramCap = 12.0;
        vramCap = 8.0;
        frameBudgetLimit = 16.67;
        targetFpsText = "60 FPS Target (Console Standard)";
    } else if (platform === "pc_ultra") {
        platformCpuScale = 0.55; // Fast core multi-threaded i9/Ryzen CPUs
        platformGpuScale = 0.45; // RTX 4095 / 7900XT high raster power
        ramCap = 32.0;
        vramCap = 16.0;
        frameBudgetLimit = 8.33; // 120 FPS target
        targetFpsText = "120 FPS Target (High End PC Ultra)";
    }

    let cpuTotal = Math.max(0.4, rawCpu * platformCpuScale);
    let gpuTotal = Math.max(0.5, rawGpu * platformGpuScale);
    let ramTotal = Math.max(0.5, rawRam);
    let vramTotal = Math.max(0.3, rawVram);
    let latencyTotal = Math.max(10, rawLatency);

    // Apply Memory / VRAM Caps warning & severe penalties (Thermal Throttling or page swaps)
    let isRamExceeded = ramTotal > ramCap;
    let isVramExceeded = vramTotal > vramCap;
    let pagingPenaltyCpu = 0;
    let pagingPenaltyGpu = 0;

    if (isRamExceeded || isVramExceeded) {
        // Exceeding memory caps causes paging thrashing, adding instant massive timings penalty!
        pagingPenaltyCpu = isRamExceeded ? (platform === "mobile" ? 18.0 : 8.5) : 3.0;
        pagingPenaltyGpu = isVramExceeded ? (platform === "mobile" ? 15.0 : 6.0) : 2.5;
        cpuTotal += pagingPenaltyCpu;
        gpuTotal += pagingPenaltyGpu;
    }

    const isCpuTargetMet = cpuTotal <= frameBudgetLimit;
    const isGpuTargetMet = gpuTotal <= frameBudgetLimit;

    const metrics = {
        cpu: cpuTotal,
        gpu: gpuTotal,
        ram: ramTotal,
        vram: vramTotal,
        latency: latencyTotal,
        verdict: baseMetrics.verdict,
        ueHas: baseMetrics.ueHas,
        ueLacks: baseMetrics.ueLacks,
        customWorkaround: baseMetrics.customWorkaround,
        designNote: baseMetrics.designNote
    };

    // Advanced breakdowns - direct, concrete, transparent metrics in ms/GB
    // CPU breakdown calculations
    const cpuTicking = Number((cpuTotal * 0.42).toFixed(2));
    const cpuPhysics = Number((cpuTotal * 0.28).toFixed(2));
    const cpuAnim = Number((cpuTotal * 0.20).toFixed(2));
    const cpuAudioUI = Number((cpuTotal * 0.10).toFixed(2));

    // GPU breakdown calculations
    const gpuBasePass = Number((gpuTotal * 0.35).toFixed(2));
    const gpuLumenGI = Number((gpuTotal * 0.25).toFixed(2));
    const gpuVSMShadows = Number((gpuTotal * 0.22).toFixed(2));
    const gpuOverdraw = Number((gpuTotal * 0.11).toFixed(2));
    const gpuPostprocess = Number((gpuTotal * 0.07).toFixed(2));

    // System RAM detailed allocations
    const ramAssetPool = Number((ramTotal * 0.48).toFixed(2));
    const ramHeapUObjects = Number((ramTotal * 0.36).toFixed(2));
    const ramReflectionGC = Number((ramTotal * 0.16).toFixed(2));

    // VRAM detailed allocations
    const vramTextures = Number((vramTotal * 0.55).toFixed(2));
    const vramGBuffer = Number((vramTotal * 0.25).toFixed(2));
    const vramShadowProbes = Number((vramTotal * 0.20).toFixed(2));

    // Network delay breakdown
    const netPingBase = Number((latencyTotal * 0.65).toFixed(0));
    const netSerializationQueue = Number((latencyTotal * 0.35).toFixed(0));

    // Recommended Console Variables (CVars) for alignment based on active tab
    const getRecommendedCVars = (sectId: number): string[] => {
        switch (sectId) {
            case 1: return ["gc.CreateGCClusters=1", "gc.MaxObjectsNotSpanned=65536", "t.MaxFPS=60"];
            case 2: return ["ai.MassEntityEnabled=1", "Mass.MaxEntityTicksPerFrame=250", "USignificanceManager.Enabled=1"];
            case 3: return ["net.Iris.ParallelScoping=1", "net.DormancyEnabled=1", "net.DORM_Initial=1"];
            case 4: return ["wp.Runtime.CellLoadingRadius=250", "f.StreamableManager.Async=1", "f.MaxFileReadsPerFrame=24"];
            case 5: return ["r.Nanite=1", "r.HZBOcclusion=1", "r.Nanite.MaxPixelsPerEdge=1.0"];
            case 6: return ["r.ShaderPipelineCache.Enabled=1", "r.Shadow.Virtual.Cache=1", "r.TranslucencySortWidth=150"];
            case 7: return ["r.Lumen.HardwareRayTracing=0", "r.MegaLights=1", "r.Lumen.DiffuseFilterFrequency=1"];
            default: return ["au.MetaSoundEnabled=1", "Slate.InvalidationDebugging=0", "p.Chaos.AsyncSubstepping=1"];
        }
    };

    const cVars = getRecommendedCVars(sectorId);

    return (
        <div className="bg-kingfisher-panel/95 border border-kingfisher-border rounded-2xl p-4 sm:p-6 shadow-2xl mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 bg-blue-500/10 text-blue-400 border-l border-b border-kingfisher-border text-[9px] font-mono uppercase tracking-widest rounded-bl-xl font-bold flex items-center gap-1.5">
                <Icons.Terminal className="w-3" /> Real-time Budget Engine v2.0
            </div>

            <div className="mb-6 font-sans">
                <h3 className="text-white text-lg font-extrabold tracking-wide mb-1 flex items-center gap-2">
                    <Icons.Sliders className="w-5 h-5 text-blue-400" /> Interactive Optimization Simulator
                </h3>
                <p className="text-kingfisher-muted text-xs leading-relaxed max-w-4xl">
                    Configure active target performance profiles, global RPG scene workloads, and architectural algorithms. Witness dynamic, microsecond-accurate physical thread and G-Buffer raster changes inspired by <em>The Witcher 3</em>, <em>Path of Exile</em>, and <em>Baldur's Gate 3</em> optimization methods.
                </p>
            </div>

            {/* SELECTION ROW 1: TABS FOR PLATFORMS AND SCENARIOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* PLATFORM SELECTOR */}
                <div className="bg-black/20 p-3.5 rounded-xl border border-white/5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                        <Icons.Smartphone className="w-3.5 h-3.5" /> 1. Target Hardware Profile
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: "mobile", name: "Mobile / Switch", icon: Icons.Smartphone, desc: "30Hz limit, 3GB RAM cap" },
                            { id: "console", name: "Console / PS5", icon: Icons.Layers, desc: "60Hz limit, 12GB RAM cap" },
                            { id: "pc_ultra", name: "PC Ultra High", icon: Icons.Monitor, desc: "120Hz limit, 32GB RAM cap" }
                        ].map(p => (
                            <button
                                key={p.id}
                                onClick={() => setPlatform(p.id as any)}
                                className={`p-2 rounded-lg border text-left transition-all ${
                                    platform === p.id 
                                        ? "bg-blue-500/15 border-blue-500/40 text-white" 
                                        : "bg-black/30 border-transparent hover:bg-neutral-800 text-kingfisher-muted hover:text-white"
                                }`}
                            >
                                <div className="text-xs font-bold leading-tight flex items-center gap-1">
                                    <Icons.Check className={`w-3 h-3 ${platform === p.id ? "opacity-100" : "opacity-0"}`} />
                                    {p.name}
                                </div>
                                <div className="text-[9px] opacity-60 font-mono mt-0.5">{p.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* RPG WORKLOAD SCENARIOS SELECTOR */}
                <div className="bg-black/20 p-3.5 rounded-xl border border-white/5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Icons.Sword className="w-3.5 h-3.5" /> 2. RPG Active Scene Workload
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                        {[
                            { id: "novigrad", name: "Novigrad Crowd", label: "CPU Limit" },
                            { id: "swamp", name: "Swamp Forest", label: "Shading Limit" },
                            { id: "coop_boss", name: "Spells Raid", label: "Net & Ping" },
                            { id: "dungeon", name: "Opt Dungeon", label: "Optimized" }
                        ].map(s => (
                            <button
                                key={s.id}
                                onClick={() => setScenario(s.id as any)}
                                className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between ${
                                    scenario === s.id 
                                        ? "bg-amber-500/15 border-amber-500/40 text-white" 
                                        : "bg-black/30 border-transparent hover:bg-neutral-800 text-kingfisher-muted hover:text-white"
                                }`}
                            >
                                <span className="text-xs font-bold leading-tight truncate">{s.name}</span>
                                <span className="text-[8px] opacity-65 uppercase font-mono tracking-wide mt-1 block">
                                    {s.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* SELECTION ROW 2: PARAMETERS & BREAKDOWNS MAIN GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* SELECTORS WRAP */}
                <div className="xl:col-span-5 space-y-4">
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-4">
                        <div className="text-xs font-extrabold uppercase tracking-wider text-kingfisher-muted/80 flex items-center justify-between border-b border-white/5 pb-2">
                            <span>Tab-Specific Controls</span>
                            <span className="text-[9px] text-emerald-500 font-mono animate-pulse">&#x25C9; Core Align System</span>
                        </div>
                        
                        <div className="space-y-4 pt-1">
                            {spec.options.map((opt) => (
                                <div key={opt.id} className="space-y-2">
                                    <label className="text-[11px] font-bold text-white/90 block">
                                        <span>{opt.label}</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {opt.choices.map((choice) => {
                                            const isSelected = selections[opt.id] === choice;
                                            return (
                                                <button
                                                    key={choice}
                                                    onClick={() => handleChoiceChange(opt.id, choice)}
                                                    className={`text-[10px] py-2 px-3 rounded-md transition-all font-semibold border text-left leading-normal ${
                                                        isSelected
                                                            ? 'bg-blue-500/15 text-blue-300 border-blue-500/40 shadow-sm'
                                                            : 'bg-black/30 text-kingfisher-muted hover:text-white border-transparent hover:bg-neutral-800/80'
                                                    }`}
                                                >
                                                    <div className="truncate">{choice.split(' (')[0]}</div>
                                                    <div className="text-[8px] opacity-55 font-mono font-normal truncate mt-0.5">
                                                        {choice.includes("(") ? "(" + choice.split(' (')[1] : "Active Preset"}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-3.5 bg-black/40 rounded-xl border border-yellow-500/10 text-[11px] text-amber-400 font-mono leading-relaxed relative">
                        <strong className="text-yellow-500 flex items-center gap-1 uppercase tracking-wider text-[10px] mb-1.5">
                            <Icons.AlertTriangle className="w-3.5 h-3.5" /> Project Design Sandbox Note
                        </strong>
                        {metrics.designNote}
                    </div>
                </div>

                {/* METRICS RESULTS AND EXPLICIT BREAKDOWNS */}
                <div className="xl:col-span-7 flex flex-col justify-between bg-black/30 border border-white/5 p-4 sm:p-5 rounded-2xl min-h-[480px]">
                    <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-kingfisher-muted flex items-center gap-1.5">
                            <Icons.Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> Telemetry Breakdown Dashboard
                        </span>
                        <div className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {targetFpsText}
                        </div>
                    </div>

                    {/* METRIC TYPE TOGGLE BAR */}
                    <div className="grid grid-cols-3 gap-1 mb-4 p-1 bg-black/40 rounded-lg border border-white/5">
                        {[
                            { id: "frame", name: "Frame Budget", desc: "CPU/GPU (ms)" },
                            { id: "memory", name: "Memory Footprint", desc: "RAM/VRAM (GB)" },
                            { id: "network", name: "Network Sync", desc: "Late/Ping (ms)" }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setSelectedMetricTab(t.id as any)}
                                className={`py-1.5 rounded text-center transition-all ${
                                    selectedMetricTab === t.id 
                                        ? "bg-neutral-800 text-white shadow font-semibold" 
                                        : "text-kingfisher-muted hover:text-white"
                                }`}
                            >
                                <div className="text-[11px] leading-tight">{t.name}</div>
                                <div className="text-[8px] opacity-40 font-mono">{t.desc}</div>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-5 flex-1 pr-1 font-sans">
                        {/* TAB CONTENT 1: FRAME BUDGET (CPU AND GPU DETAILS WITH SUB-SYSTEM BREAKDOWNS) */}
                        {selectedMetricTab === "frame" && (
                            <div className="space-y-4">
                                {/* CPU CORE BAR */}
                                <div className="p-3 bg-black/20 rounded-xl border border-white/5 space-y-1.5">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                            <Icons.Cpu className="w-3.5 h-3.5 text-amber-400" /> CPU Core Game Thread
                                        </span>
                                        <span className={`font-mono text-xs font-semibold ${isCpuTargetMet ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {cpuTotal.toFixed(2)} ms / {frameBudgetLimit.toFixed(2)}ms {isCpuTargetMet ? '(Matched)' : '(Spike Threshold exceeded)'}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-black rounded-full overflow-hidden relative">
                                        <div 
                                            className={`h-full transition-all duration-300 rounded-full ${isCpuTargetMet ? 'bg-emerald-500' : 'bg-red-500'}`}
                                            style={{ width: `${Math.min(100, (cpuTotal / (frameBudgetLimit * 2)) * 100)}%` }}
                                        />
                                        <div className="absolute left-[50%] top-0 h-full w-[2px] bg-yellow-500/80" title="Target Line" />
                                    </div>
                                    {/* Detailed CPU Sub-System Calculations */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                                        {[
                                            { label: "Actor Ticking", ms: cpuTicking, percent: 42, color: "bg-blue-500" },
                                            { label: "Chaos Physics", ms: cpuPhysics, percent: 28, color: "bg-amber-500" },
                                            { label: "Skeletal Anim", ms: cpuAnim, percent: 20, color: "bg-pink-500" },
                                            { label: "Subsystem UI", ms: cpuAudioUI, percent: 10, color: "bg-emerald-500" }
                                        ].map((item, idx) => (
                                            <div key={idx} className="bg-black/30 p-1.5 rounded border border-white/5 text-left font-mono">
                                                <div className="text-[8px] uppercase tracking-wider text-kingfisher-muted truncate">{item.label}</div>
                                                <div className="text-xs font-bold text-white mt-0.5">{item.ms} ms</div>
                                                <div className="w-full bg-black/60 h-1 rounded overflow-hidden mt-1">
                                                    <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {pagingPenaltyCpu > 0 && (
                                        <div className="text-[10px] text-red-400 font-mono p-1 bg-red-500/10 rounded flex items-center gap-1 mt-1">
                                            <Icons.AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                                            Platform RAM Throttling Overhead Penalty: +{pagingPenaltyCpu}ms applied
                                        </div>
                                    )}
                                </div>

                                {/* GPU RASTER BAR */}
                                <div className="p-3 bg-black/20 rounded-xl border border-white/5 space-y-1.5">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                            <Icons.Monitor className="w-3.5 h-3.5 text-blue-400" /> GPU Draw & Raster Pipeline
                                        </span>
                                        <span className={`font-mono text-xs font-semibold ${isGpuTargetMet ? 'text-blue-400' : 'text-purple-400'}`}>
                                            {gpuTotal.toFixed(2)} ms / {frameBudgetLimit.toFixed(2)}ms {isGpuTargetMet ? '(Matched)' : '(Overdraw stall detected)'}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-black rounded-full overflow-hidden relative">
                                        <div 
                                            className={`h-full transition-all duration-300 rounded-full ${isGpuTargetMet ? 'bg-blue-500' : 'bg-purple-500'}`}
                                            style={{ width: `${Math.min(100, (gpuTotal / (frameBudgetLimit * 2)) * 100)}%` }}
                                        />
                                        <div className="absolute left-[50%] top-0 h-full w-[2px] bg-yellow-500/80" title="Target Line" />
                                    </div>
                                    {/* Detailed GPU pipeline Calculations */}
                                    <div className="grid grid-cols-5 gap-1 pt-1">
                                        {[
                                            { label: "Base Pass", ms: gpuBasePass, color: "bg-blue-500" },
                                            { label: "Lumen GI", ms: gpuLumenGI, color: "bg-purple-500" },
                                            { label: "VSM Shadows", ms: gpuVSMShadows, color: "bg-yellow-500" },
                                            { label: "Trans Over", ms: gpuOverdraw, color: "bg-red-500" },
                                            { label: "TSR Post", ms: gpuPostprocess, color: "bg-teal-500" }
                                        ].map((item, idx) => (
                                            <div key={idx} className="bg-black/30 p-1 rounded border border-white/5 text-center font-mono">
                                                <div className="text-[7px] uppercase tracking-wider text-kingfisher-muted truncate" title={item.label}>{item.label}</div>
                                                <div className="text-[10px] font-bold text-white mt-0.5 truncate">{item.ms}ms</div>
                                                <div className="w-full bg-black/60 h-0.5 rounded overflow-hidden mt-1">
                                                    <div className={`h-full ${item.color}`} style={{ width: "100%" }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {pagingPenaltyGpu > 0 && (
                                        <div className="text-[10px] text-red-400 font-mono p-1 bg-red-500/10 rounded flex items-center gap-1 mt-1">
                                            <Icons.AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                                            Platform VRAM Saturated Overdraw Penalty: +{pagingPenaltyGpu}ms applied
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT 2: MEMORY ENVELOPES (RAM AND VRAM DETAILS WITH ALLOCATION SUB-CATEGORIES) */}
                        {selectedMetricTab === "memory" && (
                            <div className="space-y-4">
                                <div className="p-4 bg-black/20 rounded-xl border border-white/5 space-y-4">
                                    {/* SYSTEM HEAP RAM */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-end text-xs font-bold text-white mb-1">
                                            <span className="flex items-center gap-1.5">
                                                <Icons.Database className="w-3.5 h-3.5 text-purple-400" /> System Heap RAM Envelope
                                            </span>
                                            <span className={`font-mono ${isRamExceeded ? "text-red-400" : "text-white"}`}>
                                                {ramTotal.toFixed(2)} GB / {ramCap.toFixed(1)} GB {isRamExceeded ? "(OOM Thread Pool Paged)" : "(Secure)"}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-black rounded-full overflow-hidden relative">
                                            <div 
                                                className={`h-full transition-all duration-300 rounded-full ${isRamExceeded ? 'bg-red-500' : 'bg-purple-500'}`}
                                                style={{ width: `${Math.min(100, (ramTotal / ramCap) * 100)}%` }}
                                            />
                                        </div>
                                        {/* RAM Breakdown */}
                                        <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1">
                                            <div className="bg-black/35 p-2 rounded border border-white/5">
                                                <span className="text-[8px] text-kingfisher-muted uppercase block">Core Binary Pool</span>
                                                <strong className="text-white text-xs block mt-0.5">{ramAssetPool} GB</strong>
                                            </div>
                                            <div className="bg-black/35 p-2 rounded border border-white/5">
                                                <span className="text-[8px] text-kingfisher-muted uppercase block">UObject Actor Heap</span>
                                                <strong className="text-white text-xs block mt-0.5">{ramHeapUObjects} GB</strong>
                                            </div>
                                            <div className="bg-black/35 p-2 rounded border border-white/5">
                                                <span className="text-[8px] text-kingfisher-muted uppercase block">GC Reflection Maps</span>
                                                <strong className="text-white text-xs block mt-0.5">{ramReflectionGC} GB</strong>
                                            </div>
                                        </div>
                                    </div>

                                    {/* GPU VRAM ALLOCATIONS */}
                                    <div className="space-y-1.5 border-t border-kingfisher-border/30 pt-3">
                                        <div className="flex justify-between items-end text-xs font-bold text-white mb-1">
                                            <span className="flex items-center gap-1.5">
                                                <Icons.HardDrive className="w-3.5 h-3.5 text-pink-400" /> GPU VRAM Allocation
                                            </span>
                                            <span className={`font-mono ${isVramExceeded ? "text-red-400" : "text-white"}`}>
                                                {vramTotal.toFixed(2)} GB / {vramCap.toFixed(1)} GB {isVramExceeded ? "(VRAM Saturated - Swapping)" : "(Secure)"}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-black rounded-full overflow-hidden relative">
                                            <div 
                                                className={`h-full transition-all duration-300 rounded-full ${isVramExceeded ? 'bg-red-500' : 'bg-pink-500'}`}
                                                style={{ width: `${Math.min(100, (vramTotal / vramCap) * 100)}%` }}
                                            />
                                        </div>
                                        {/* VRAM Breakdown */}
                                        <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1">
                                            <div className="bg-black/35 p-2 rounded border border-white/5">
                                                <span className="text-[8px] text-kingfisher-muted uppercase block font-sans">MIP Texture Cache</span>
                                                <strong className="text-white text-xs block mt-0.5">{vramTextures} GB</strong>
                                            </div>
                                            <div className="bg-black/35 p-2 rounded border border-white/5">
                                                <span className="text-[8px] text-kingfisher-muted uppercase block font-sans">G-Buffer Targets</span>
                                                <strong className="text-white text-xs block mt-0.5">{vramGBuffer} GB</strong>
                                            </div>
                                            <div className="bg-black/35 p-2 rounded border border-white/5">
                                                <span className="text-[8px] text-kingfisher-muted uppercase block font-sans">Lumen & Shadows Cache</span>
                                                <strong className="text-white text-xs block mt-0.5">{vramShadowProbes} GB</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT 3: NETWORK & PING DESYNCS */}
                        {selectedMetricTab === "network" && (
                            <div className="space-y-4">
                                <div className="p-4 bg-black/20 rounded-xl border border-white/5 space-y-3">
                                    <div className="flex justify-between items-end text-xs font-bold text-white mb-1">
                                        <span className="flex items-center gap-1.5">
                                            <Icons.Radio className="w-3.5 h-3.5 text-emerald-400" /> Client-to-Dedicated-Server Ping Latency
                                        </span>
                                        <span className="font-mono text-white text-sm">
                                            {latencyTotal} ms
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-black rounded-full overflow-hidden relative">
                                        <div 
                                            className="h-full transition-all duration-300 rounded-full bg-emerald-500"
                                            style={{ width: `${Math.min(100, (latencyTotal / 320) * 100)}%` }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-2">
                                        <div className="bg-black/35 p-2.5 rounded border border-white/5 flex justify-between items-center">
                                            <span className="text-kingfisher-muted truncate text-[10px]">Real Connection Ping Delay:</span>
                                            <strong className="text-white font-bold ml-1">{netPingBase} ms</strong>
                                        </div>
                                        <div className="bg-black/35 p-2.5 rounded border border-white/5 flex justify-between items-center">
                                            <span className="text-kingfisher-muted truncate text-[10px]">RPC NetGUID Queue Stalls:</span>
                                            <strong className="text-white font-bold ml-1">{netSerializationQueue} ms</strong>
                                        </div>
                                    </div>

                                    <div className="text-[11px] text-kingfisher-muted leading-relaxed pt-2 border-t border-kingfisher-border/30 font-sans">
                                        {latencyTotal > 150 ? (
                                            <span className="text-red-400 font-medium flex items-center gap-1">
                                                <Icons.XCircle className="w-3.5 h-3.5 shrink-0" />
                                                Severe desync rubber-banding! Hit-registration verification will fail, requiring rollback C++ historical traces.
                                            </span>
                                        ) : (
                                            <span className="text-emerald-400 font-medium flex items-center gap-1">
                                                <Icons.CheckCircle className="w-3.5 h-3.5 shrink-0" />
                                                Stable network synchronization! Latency buffers are under desync limits safely.
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CONTEXT LOG REPORT OUT (MAPPED TO SELECTED OPTIONS & MATH VERDICTS) */}
                    <div className="mt-4 p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs">
                        <div className="text-[10px] text-emerald-400 mb-1.5 flex items-center gap-1.5 font-bold">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            <span>DYNAMIC PERFORMANCE AUDIT LOG</span>
                        </div>
                        <p className="text-[11px] text-kingfisher-muted leading-relaxed">
                            {metrics.verdict}
                        </p>
                    </div>
                </div>
            </div>

            {/* UNREAL ENGINE COMPATIBILITY MAPPINGS */}
            <div className="mt-6 border-t border-kingfisher-border/40 pt-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <span className="text-white font-extrabold text-xs uppercase tracking-wider block">
                        Unreal Engine 5 Core Alignment Configuration Summary
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-kingfisher-muted font-bold block uppercase tracking-wider font-sans">Recommended CVars Config:</span>
                        <div className="flex flex-wrap gap-1">
                            {cVars.map((cv, idx) => (
                                <code key={idx} className="bg-black/50 border border-white/10 text-blue-300 rounded px-1.5 py-0.5 text-[9px] font-mono leading-none select-all">{cv}</code>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-2.5">
                        <span className="text-emerald-400 font-bold uppercase tracking-widest text-[9px] flex items-center gap-1.5 font-sans">
                            <Icons.CheckCircle className="w-4 h-4 shrink-0" /> Unreal Has Out-of-the-Box
                        </span>
                        <ul className="text-xs text-kingfisher-muted space-y-1.5 leading-relaxed font-sans">
                            {metrics.ueHas.map((h, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                    <span className="text-emerald-500 font-bold select-none">•</span>
                                    <span>{h}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-2.5">
                        <span className="text-amber-400 font-bold uppercase tracking-widest text-[9px] flex items-center gap-1.5 font-sans">
                            <Icons.XCircle className="w-4 h-4 shrink-0" /> Unreal Lacks & Needs Workarounds
                        </span>
                        <ul className="text-xs text-kingfisher-muted space-y-1.5 leading-relaxed font-sans">
                            {metrics.ueLacks.map((l, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                    <span className="text-amber-400 font-bold select-none">•</span>
                                    <span>{l}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-4 p-3.5 bg-blue-500/5 border border-blue-500/10 rounded-xl space-y-1 text-xs leading-relaxed font-sans">
                    <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                        <Icons.CheckSquare className="w-3.5 h-3.5" /> High-Performance C++ Workaround Procedure
                    </span>
                    <p className="text-kingfisher-muted">
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
