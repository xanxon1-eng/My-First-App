import React, { useState } from 'react';
import {
  Shuffle, CheckCircle, AlertTriangle, Play, RefreshCw, Cpu, Monitor, Database,
  HardDrive, Radio, Info, ChevronRight, Activity, Zap, ClipboardList, Layers, Users, Sword, Flame, Grid, Shield, Map
} from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { SectionCard, PageHeader, HighlightBox } from './OptimizationHelpers';

interface OverlapCard {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  inspiration: string;
  description: string;
  switches: {
    id: string;
    label: string;
    choices: { label: string; desc: string; val: boolean }[];
  }[];
  calculateMetrics: (states: Record<string, boolean>) => {
    cpu: number;
    gpu: number;
    ram: number;
    vram: number;
    ping: number;
    breakdowns: {
      cpu: string[];
      gpu: string[];
      ram: string[];
      vram: string[];
      ping: string[];
    };
    ueHas: string[];
    ueLacks: string[];
    workaround: string;
    notes: string;
  };
}

const OVERLAPS_DATA: OverlapCard[] = [
  {
    id: "novigrad_crowd",
    title: "Civilian Crowd vs Skeletal Skinning & Audio",
    subtitle: "Intersection of CPU Entity ticking, GPU Pose Space Deformation, and MetaSound occlusion channels.",
    icon: Users,
    inspiration: "The Witcher 3: Wild Hunt (Novigrad Streets Scheduling)",
    description: "Ticking thousands of civilians in dense city hubs consumes major CPU performance. When crowd animation bone solvers and spatial SFX channels are evaluated simultaneously on traditional actor systems, thread congestion cascades rapidly.",
    switches: [
      {
        id: "mass_ecs",
        label: "Civilian Entity Framework",
        choices: [
          { label: "Legacy AActor Blueprints", desc: "Heavy heap pointer overhead", val: false },
          { label: "MassEntity ECS Arrays", desc: "Contiguous, cache-friendly CPU memory allocation", val: true }
        ]
      },
      {
        id: "anim_gpu",
        label: "Animation Skinning Thread",
        choices: [
          { label: "CPU Skeletal Node Solver", desc: "Main thread bones evaluation", val: false },
          { label: "GPU Shared skinning buffer", desc: "Vertex shader instanced bone sharing", val: true }
        ]
      },
      {
        id: "audio_prioritize",
        label: "MetaSound Auditory Priority",
        choices: [
          { label: "Standard Distance Falloff", desc: "Unchecked audio channels mixing", val: false },
          { label: "Obstacle Raycast Ray Culler", desc: "Mutes fully occluded distant SFX sources", val: true }
        ]
      }
    ],
    calculateMetrics: (states) => {
      const isMass = states.mass_ecs;
      const isAnimGpu = states.anim_gpu;
      const isSoundCull = states.audio_prioritize;

      let cpu = 18.5;  // Baseline heavy CPU congestion (ms)
      let gpu = 4.2;   // Base draw costs
      let ram = 1.95;  // Heap pointer allocations (GB)
      let vram = 1.25; // Vertex structures (GB)
      let ping = 0;    // Offline system

      if (isMass) {
        cpu -= 9.5;
        ram -= 0.55;
      }
      if (isAnimGpu) {
        cpu -= 4.2;
        gpu += 0.8;
        vram += 0.18;
      }
      if (isSoundCull) {
        cpu -= 1.8;
      }

      return {
        cpu: Math.max(0.6, cpu),
        gpu: Math.max(0.5, gpu),
        ram: Math.max(0.4, ram),
        vram: Math.max(0.3, vram),
        ping,
        breakdowns: {
          cpu: [
            isMass ? "MassEntity Chunk ticks: 1.2ms (O(1) parallel slice loops)" : "AActor ticking loop: 10.7ms (O(N) virtual heap lookups and desyncs)",
            isAnimGpu ? "Skeletal evaluations: 0.1ms (Fully offloaded to GPU matrix registers)" : "Skeletal node evaluations: 4.3ms (Main Game Thread bone matrix updates)",
            isSoundCull ? "MetaSound priority cull: 0.2ms (Mutes fully blocked sound sources)" : "Audio engine mixer: 2.0ms (Procedural decoding for obscured channels)"
          ],
          gpu: [
            isAnimGpu ? "Instanced bone matrices draw: 1.2ms (+0.8ms GPU compute cost)" : "Mesh renderer: 0.4ms (Only vertex attributes and texture lookups)",
            "G-Buffer base passes: 3.0ms (Draw call geometry overhead)"
          ],
          ram: [
            isMass ? "Continuous entity slice tables: ~500MB (Zero heap garbage layout)" : "AActor heap allocations: ~1050MB (Massive pointer fragments and reflection overhead)",
            "Skeletal mesh data assets: ~400MB"
          ],
          vram: [
            isAnimGpu ? "Static vertex skinning: ~350MB (+180MB for dynamic animation texture maps)" : "Skeletal bone maps: ~170MB",
            "Foliage shader buffers: ~600MB"
          ],
          ping: ["N/A - System runs under local singleplayer client authority."]
        },
        ueHas: [
          "UMassEntitySubsystem and FMassEntityManager arrays",
          "Animation Sharing Subsystem for bulk static skin caching",
          "USignificanceManager tick scaling intervals on dynamic indices"
        ],
        ueLacks: [
          "Lack of direct Mass-compatible default Behavior Trees (forces custom state machine structures)",
          "No native in-editor diagnostics analyzing memory padding byte-waste nested inside USTRUCTs"
        ],
        workaround: "Design lightweight civilian logic as decoupled Mass Fragment scripts. Store state variables in Size-Packed C++ USTRUCTs aligned largest-to-smallest to eliminate compiler padding bytes. Offload movement sweeps to a single parallelized World Subsystem.",
        notes: "Moving civilians to MassEntity removes standard actor Tick() overhead. Offloading bone evaluations to GPU skinning buffers and raycast-protecting MetaSound nodes recovers over 15.5ms CPU, stabilizing frame delivery inside high-density Novigrad city squares."
      };
    }
  },
  {
    id: "poe_spells",
    title: "Action Spell Storm vs Net Rollback",
    subtitle: "Overlap of high-frequency broadphase collisions, IRIS connection scoping, and lag rollback physics.",
    icon: Sword,
    inspiration: "Path of Exile (AoE Spell Storms under Packet Jitter)",
    description: "Casting dozens of overlapping Area-of-Effect combat spells triggers geometric collision sweeps on the server, while sending dynamic updates to the clients. Intersecting with active jitter leads to desyncs, desync state corrections, and severe packet loss.",
    switches: [
      {
        id: "spatial_hash",
        label: "Collision Sweep Finder",
        choices: [
          { label: "O(N^2) Overlap Sweeps", desc: "Unfiltered actor tracing bounds", val: false },
          { label: "O(1) Spatial Hash Grid", desc: "Bucket indexed broadphase culling", val: true }
        ]
      },
      {
        id: "iris_net",
        label: "Unreal Network Engine",
        choices: [
          { label: "Legacy NetChannels system", desc: "Serial actor property parsing", val: false },
          { label: "IRIS Parallel Scoping Engine", desc: "Multi-threaded state serialization and priorities", val: true }
        ]
      },
      {
        id: "pred_rollback",
        label: "Lag State Sync",
        choices: [
          { label: "Absolute Server Sweeping", desc: "Client cursor positions snap on desyncs", val: false },
          { label: "Server-Side Lag Rewind", desc: "Tracks 1000ms history to replay past trace states", val: true }
        ]
      }
    ],
    calculateMetrics: (states) => {
      const isHash = states.spatial_hash;
      const isIris = states.iris_net;
      const isPredicted = states.pred_rollback;

      let cpu = 19.8;  // Server tick load (ms)
      let gpu = 5.5;   // G-Buffer pass
      let ram = 1.45;  // Packet buffers (GB)
      let vram = 0.85; // Textures (GB)
      let ping = 145;  // Baseline latency client-to-server with jitter (ms)

      if (isHash) cpu -= 8.5;
      if (isIris) {
        cpu -= 4.5;
        ping -= 45;
      }
      if (isPredicted) {
        cpu += 1.1; // Minor prediction loop overhead
        ping = Math.max(12, ping - 75); // Perceived ping feels instant
      }

      return {
        cpu: Math.max(0.4, cpu),
        gpu,
        ram,
        vram,
        ping: Math.max(5, ping),
        breakdowns: {
          cpu: [
            isHash ? "Collision broadphase: 0.3ms (O(1) Spatial Grid cell checks)" : "Collision traces: 8.8ms (O(N^2) pairwise boundary overlap checks)",
            isIris ? "IRIS Serialization: 1.0ms (Processed in parallel on thread pools)" : "Property replicator: 5.5ms (Main Thread blocking actor sweeps)",
            isPredicted ? "Historical trace rollback: 1.2ms (Circular state buffer traversals)" : "Trace sweeps: 0.1ms (Direct static trace evaluations)"
          ],
          gpu: [
            "Spell visual effects drawing: 3.5ms (Niagara particle systems)",
            "Base deferred UI pass: 2.0ms"
          ],
          ram: [
            isPredicted ? "Lag rollback buffer space: ~350MB (Retains 1000ms of transform states)" : "State history cache: 50MB",
            "Network packet structures: ~150MB"
          ],
          vram: [
            "Visual FX buffers: ~400MB",
            "General UI models: ~450MB"
          ],
          ping: [
            isIris ? "Replication sync: 15ms (Optimal connection scope culling)" : "Replication sync: 60ms (Heavy RPC queue congestion desyncs)",
            isPredicted ? "Acoustic hit correction desync rate: < 1% (Instant Server Rollback traces)" : "Hit correction desync rate: 85% (Client-predicted misalignments snapped)"
          ]
        },
        ueHas: [
          "IRIS Parallel Replication Engine (highly parallel replication scoping)",
          "Replication Graph for custom geographic client scoping",
          "Chaos Broadphase Filtering parameters"
        ],
        ueLacks: [
          "Lacks native out-of-the-box 3D physics rollback trace buffers",
          "No built-in packet loss/network jitter emulator within local shipping builds"
        ],
        workaround: "Implement a lightweight C++ Spatial Hash Grid for high-frequency projectile overlaps, completely bypassing the Chaos physical world thread. Register projectiles inside custom USTRUCT streams, serializing via packed binary byte-aligned FArchive pools, saving network bandwidth.",
        notes: "Replacing brute-force trace sweeps with Spatial Grid Hashes drops server CPU usage dramatically. Running IRIS multi-threaded scoping and server-side client rewind physics ensures desync feels non-existent even on connections experiencing heavy packet delays."
      };
    }
  },
  {
    id: "bg3_inventory",
    title: "World Partition Loading vs Saving & GC",
    subtitle: "Overlays of World Partition cell radius dynamic streaming, binary saves serialization, and GC sweeps.",
    icon: Map,
    inspiration: "Baldur's Gate 3 (Lower City Cell Loading and Inventory States)",
    description: "Exploring massive, highly populated RPG hubs triggers cell streaming allocations, instantiating thousands of inventory objects. This triggers deep Garbage Collector Mark-Sweep sweeps, leading to persistent frame rate freezes.",
    switches: [
      {
        id: "async_stream",
        label: "Cell Loading Mode",
        choices: [
          { label: "Blocking Map Loading", desc: "Main thread synchronously holds disk requests", val: false },
          { label: "Asynchronous Package FStreamable", desc: "Background thread asset pre-caching", val: true }
        ]
      },
      {
        id: "binary_save",
        label: "Inventory Save Files",
        choices: [
          { label: "UProperty Reflection Maps", desc: "Deep property hierarchy parsing", val: false },
          { label: "Binary Byte FArchive operator<<", desc: "Raw byte-aligned stream saving", val: true }
        ]
      },
      {
        id: "gc_cluster",
        label: "Garbage Collector Scheme",
        choices: [
          { label: "Standard GC Reference Sweep", desc: "Iterates through all allocated UObjects on tick", val: false },
          { label: "FGCCluster Object Group", desc: "Consolidates static libraries into unified skipped pools", val: true }
        ]
      }
    ],
    calculateMetrics: (states) => {
      const isAsync = states.async_stream;
      const isBinary = states.binary_save;
      const isGCClustered = states.gc_cluster;

      let cpu = 21.4;  // Baseline explore CPU timing (ms)
      let gpu = 6.4;   // Draw calls
      let ram = 3.65;  // Memory allocation (GB)
      let vram = 3.4;  // Textures cache (GB)
      let ping = 0;

      if (isAsync) cpu -= 8.5;
      if (isBinary) {
        cpu -= 4.2;
        ram -= 0.45;
      }
      if (isGCClustered) {
        cpu -= 5.5;
        ram -= 0.25;
      }

      return {
        cpu: Math.max(0.4, cpu),
        gpu,
        ram: Math.max(0.5, ram),
        vram,
        ping,
        breakdowns: {
          cpu: [
            isAsync ? "Asset streaming: 0.1ms (Asynchronous streaming on worker task pools)" : "Asset loading: 8.6ms (Main Game Thread blocking disk I/O requests)",
            isGCClustered ? "GC Sweep cost: 0.2ms (Bypasses clustered static libraries)" : "GC Mark-Sweep: 5.7ms (Deep object reference traversal pauses)",
            isBinary ? "Binary save saving: 1.8ms (Bypasses metadata map fields)" : "Property serialization: 6.0ms (Deep metadata reflection writes)"
          ],
          gpu: [
            "General environment rendering: 4.4ms",
            "UMG HUD and inventory sheets: 2.0ms"
          ],
          ram: [
            isBinary ? "Active heap saves allocations: ~250MB" : "Reflection property maps: ~700MB (High overhead representing meta fields)",
            isGCClustered ? "Static asset allocation pools: ~1500MB (Consolidated blocks)" : "Asset allocation: ~1750MB (Fragmented pointer heaps)"
          ],
          vram: [
            "Level materials and models: ~2200MB",
            "Inventory dynamic dynamic icons: ~1200MB"
          ],
          ping: ["N/A - Offline save-state subsystem."]
        },
        ueHas: [
          "World Partition hierarchical streaming grids",
          "FStreamableManager async loading structures",
          "FGCCluster configurations supporting console-variable overrides"
        ],
        ueLacks: [
          "Lacks native automatic in-RAM compression models for bulk item states",
          "No built-in automated sector cell file pre-caching heuristics nested inside editors"
        ],
        workaround: "Avoid creating standard dynamic AActors for item slots; store loot as pure binary struct records. Serialize inventory arrays directly to custom byte streams by overriding operator<<. Execute saving operations on background task pools.",
        notes: "Transitioning to asynchronous package models combined with FArchive binary savers and FGCCluster groups reduces explore hitches to zero. This completely prevents Baldur's Gate 3 style saving stutters or cell streaming freezes."
      };
    }
  },
  {
    id: "gi_materials",
    title: "Global Illumination vs Foliage Wind Sway",
    subtitle: "Interaction of Virtual Shadow Maps shadow maps, wind sway shaders, and Lumen dynamic raytracing.",
    icon: Flame,
    inspiration: "The Witcher 3 / Next-Gen (Dense Swamp Environments with Lumen RT)",
    description: "Virtual Shadow Maps (VSMs) cache shadows of static meshes. Dynamically animating foliage wind sway via material vertex displacements constantly invalidates VSM caches on every single frame, causing severe GPU G-Buffer bottlenecks.",
    switches: [
      {
        id: "wind_lock",
        label: "Wind Sway Range Lock",
        choices: [
          { label: "Global Unlimited Sway", desc: "Animates all foliage at full camera range", val: false },
          { label: "Distance-Scale Sway Lock (>45m)", desc: "Programmatically disables vertex displacements beyond threshold", val: true }
        ]
      },
      {
        id: "lumen_cache",
        label: "Lumen Dynamic Illumination",
        choices: [
          { label: "Hardware Ray-Traced Lumen GI", desc: "Calculates rays per-polygon in real-time, high pipeline load", val: false },
          { label: "Sparse Radiance Cascades Grid", desc: "Caches dynamic diffuse ambient light rays in a GPU Hash map", val: true }
        ]
      },
      {
        id: "vsm_cache",
        label: "Virtual Shadow Maps Settings",
        choices: [
          { label: "Default Dynamic Invalidation", desc: "Forces shadow recalculations when geometry shifts", val: false },
          { label: "Caching Static Shadows Locks", desc: "Overrides invalidation pools for distant foliage meshes", val: true }
        ]
      }
    ],
    calculateMetrics: (states) => {
      const isWindLocked = states.wind_lock;
      const isRCCache = states.lumen_cache;
      const isVSMCached = states.vsm_cache;

      let cpu = 6.2;   // Main thread frame overhead (ms)
      let gpu = 26.8;  // Baseline heavy G-Buffer congestion! (ms)
      let ram = 1.9;   // Mesh data allocation (GB)
      let vram = 4.2;  // Shadow maps & G-Buffer targets (GB)
      let ping = 0;

      if (isWindLocked) {
        gpu -= 4.5;
      }
      if (isRCCache) {
        gpu -= 9.5;
        vram -= 1.1;
      }
      if (isVSMCached) {
        gpu -= 6.2;
        vram += 0.25; // Minor shadow cache map buffering
      }

      return {
        cpu,
        gpu: Math.max(0.5, gpu),
        ram,
        vram: Math.max(0.4, vram),
        ping,
        breakdowns: {
          cpu: [
            "Main Game Thread frame compilation: 1.8ms",
            "Mesh render submission ticks: 4.4ms"
          ],
          gpu: [
            isRCCache ? "Indirect Ray GI: 1.8ms (Using camera-targeted diffuse sparse radiance caches)" : "Lumen hardware tracing: 11.3ms (Probing real-time triangle paths)",
            isVSMCached ? "Virtual Shadow Maps recalculations: 1.2ms (Cache invalidation locked)" : "Virtual Shadow Maps calculations: 7.4ms (Forced full-frame cache invalidations)",
            isWindLocked ? "VSM shadow cache fillrate: >95% (Foliage distance locks active)" : "VSM shadow cache fillrate: <5% (Constant wind-sway map cache flushes)"
          ],
          ram: [
            "Foliage landscape data assets: ~1400MB",
            "Lumen scene volume structures: ~500MB"
          ],
          vram: [
            isRCCache ? "Radiance Cascades sparse arrays: ~350MB" : "Lumen trace structures: ~1450MB (Huge volume cache footprint)",
            isVSMCached ? "Virtual Shadow Maps page buffers: ~1200MB (+250MB locked cache allocations)" : "Virtual Shadow Maps page maps: ~950MB",
            "General scene textures: ~1400MB"
          ],
          ping: ["N/A - Geometry rendering pipeline."]
        },
        ueHas: [
          "Virtual Shadow Maps Shadow Cache tracking framework",
          "Material Parameter Collections for global parameters",
          "Lumen Dynamic Illumination and Reflection pipelines"
        ],
        ueLacks: [
          "No native dynamic automated shader permutations pruning tool inline within standard editors",
          "Lacks out-of-the-box sparse camera-targeted Radiance Cascades (requires custom HLSL shader injection)"
        ],
        workaround: "Manage foliage vertex animations using a central dynamic Material Parameter Collection. Disable wind sways beyond 45m programmatically. Re-allocate shadow invalidation scales via console command `r.Shadow.Virtual.Cache.InvalidateMethod 1`.",
        notes: "Locking wind material displace calculations beyond 45 meters keeps the shadow map cache hit rates above 95%. Coupling this with a sparse camera-targeted Radiance Cascades grid reduces GPU rendering load by over 20.2ms, restoring flawless 60 FPS gameplay."
      };
    }
  }
];

export const AspectOverlapsTab: React.FC = () => {
  const [activeOverlap, setActiveOverlap] = useState(OVERLAPS_DATA[0].id);
  const [selections, setSelections] = useState<Record<string, Record<string, boolean>>>(() => {
    const defaults: Record<string, Record<string, boolean>> = {};
    OVERLAPS_DATA.forEach(overlap => {
      defaults[overlap.id] = {};
      overlap.switches.forEach(opt => {
        // Initialize all parameters as "false" (unoptimized baseline) to let users toggle them on
        defaults[overlap.id][opt.id] = false;
      });
    });
    return defaults;
  });

  const [activeMetricTab, setActiveMetricTab] = useState<"cpu" | "gpu" | "memory">("cpu");

  // Retrieve current active record and calculated performance data
  const overlap = OVERLAPS_DATA.find(o => o.id === activeOverlap) || OVERLAPS_DATA[0];
  const activeSelections = selections[overlap.id] || {};
  const metrics = overlap.calculateMetrics(activeSelections);

  // Compute calculated statistics
  const totalFrameTimeMax = Math.max(metrics.cpu, metrics.gpu);
  const calculatedFPS = Math.min(120, Math.floor(1000 / Math.max(8.33, totalFrameTimeMax)));

  const handleToggle = (switchId: string) => {
    setSelections(prev => {
      const currentSelections = prev[overlap.id];
      const nextSelections = {
        ...currentSelections,
        [switchId]: !currentSelections[switchId]
      };
      return {
        ...prev,
        [overlap.id]: nextSelections
      };
    });
  };

  // Turn all toggles in scenario with ONE CLICK
  const optimizeAll = () => {
    setSelections(prev => {
      const nextSelections = { ...prev[overlap.id] };
      overlap.switches.forEach(opt => {
        nextSelections[opt.id] = true;
      });
      return {
        ...prev,
        [overlap.id]: nextSelections
      };
    });
  };

  const resetAll = () => {
    setSelections(prev => {
      const nextSelections = { ...prev[overlap.id] };
      overlap.switches.forEach(opt => {
        nextSelections[opt.id] = false;
      });
      return {
        ...prev,
        [overlap.id]: nextSelections
      };
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Aspect Overlaps & Overlap Analysis"
        subtitle="Intelligent performance deep-dive mapping how separate RPG mechanics, shaders, rendering systems, and netcode parameters intercept, conflict, and compound under extreme hardware pressures."
      />

      <HighlightBox type="info" className="mb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <Info className="w-4 h-4 text-sky-400" />
          <strong className="text-sky-400 text-xs uppercase tracking-widest font-bold font-mono">Architectural Rule of Overlaps</strong>
        </div>
        <p className="text-sky-100/95 text-xs leading-relaxed">
          In Unreal Engine, performance constraints are rarely isolated. Shaders impact CPU dispatch sequences; garbage collection clusters intersect level streaming; network client calculations scale physics costs. Leverage this interactive sandbox to visualize compounding synergies, mapping custom strategies directly to <strong>The Witcher 3</strong>, <strong>Path of Exile</strong>, and <strong>Baldur's Gate 3</strong> references.
        </p>
      </HighlightBox>

      {/* OVERLAP SELECTOR HEAD BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-black/20 p-2.5 rounded-xl border border-kingfisher-border/30">
        {OVERLAPS_DATA.map(o => {
          const isActive = activeOverlap === o.id;
          const Icon = o.icon;
          return (
            <button
              key={o.id}
              onClick={() => setActiveOverlap(o.id)}
              className={`p-3 rounded-lg text-left transition-all border flex flex-col justify-between ${
                isActive
                  ? "bg-kingfisher-blue/20 border-kingfisher-blue/50 text-white shadow-md shadow-kingfisher-blue/15"
                  : "bg-black/30 border-transparent hover:bg-neutral-850 text-kingfisher-muted hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5 border-b border-white/5 pb-1 w-full">
                <div className={`p-1 rounded-md ${isActive ? 'bg-kingfisher-blue/30 text-white' : 'bg-black/40 text-kingfisher-muted'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-bold truncate max-w-[140px]">{o.id.replace('_', ' ')}</span>
              </div>
              <span className="text-xs font-bold truncate leading-tight w-full">{o.title}</span>
            </button>
          );
        })}
      </div>

      {/* OVERLAP MATRIX INTERACTIVE GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* LEFT COLUMN: CONTROLS & DESCRIPTION */}
        <div className="xl:col-span-5 space-y-4">
          <SectionCard title="Topic Selection & Switches" icon={Shuffle} color={COLORS.kingfisher.warm}>
            <div className="space-y-3.5">
              <div className="border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-kingfisher-muted block mb-1">Inspiration Target</span>
                <span className="text-xs font-extrabold text-white flex items-center gap-1.5 font-mono">
                  <Sword className="w-3.5 h-3.5 text-blue-400" /> {overlap.inspiration}
                </span>
              </div>

              <p className="text-xs text-kingfisher-muted leading-relaxed">
                {overlap.description}
              </p>

              {/* DYNAMIC SWITCHES */}
              <div className="space-y-4 pt-3 border-t border-white/5">
                <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-amber-400 block pb-1 border-b border-amber-400/10">Interactive Architecture Switches</span>
                {overlap.switches.map(sw => (
                  <div key={sw.id} className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-white/95 block">{sw.label}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {sw.choices.map(choice => {
                        const isValActive = activeSelections[sw.id] === choice.val;
                        return (
                          <button
                            key={choice.label}
                            onClick={() => {
                              if (activeSelections[sw.id] !== choice.val) {
                                handleToggle(sw.id);
                              }
                            }}
                            className={`text-[10px] p-2 rounded-md border text-left transition-all flex flex-col justify-between ${
                              isValActive
                                ? "bg-blue-500/15 border-blue-500/40 text-blue-300"
                                : "bg-black/30 border-transparent hover:bg-neutral-800 text-kingfisher-muted hover:text-white"
                            }`}
                          >
                            <span className="font-bold truncate">{choice.label}</span>
                            <span className="text-[8px] opacity-65 font-mono mt-0.5 leading-tight line-clamp-2">{choice.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* ACTION QUICK OPTIMIZE BUTTONS */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/5">
                <button
                  onClick={optimizeAll}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Apply Synergy
                </button>
                <button
                  onClick={resetAll}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Baseline Reset
                </button>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* RIGHT COLUMN: CORE HARDWARE SIMULATOR */}
        <div className="xl:col-span-7 space-y-4">
          <div className="bg-kingfisher-panel/95 border border-kingfisher-border rounded-xl p-4 sm:p-5 shadow-inner space-y-4 relative">
            <div className="absolute top-0 right-0 p-2.5 bg-blue-500/10 text-blue-400 border-l border-b border-kingfisher-border text-[9px] font-mono uppercase tracking-widest rounded-bl-xl font-bold flex items-center gap-1.5">
              <Activity className="w-3" /> Live Interdependence Metrics
            </div>

            <div className="border-b border-white/5 pb-2.5">
              <h3 className="text-white text-base font-bold tracking-wide flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" /> Overlap Performance Metrics
              </h3>
              <p className="text-[11px] text-kingfisher-muted leading-relaxed">
                Compounded metrics calculation comparing relative systems alignment. Performance and allocation metrics dynamically shift with specific switch modifications.
              </p>
            </div>

            {/* RADAR METRICS GAUGES */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-kingfisher-muted/60 font-bold mb-0.5 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-amber-400" /> CPU Load
                </div>
                <div className="text-lg font-mono font-bold text-white leading-tight">
                  {metrics.cpu.toFixed(1)}ms
                </div>
                <div className="text-[9px] text-kingfisher-muted/70 flex items-center gap-0.5 mt-0.5">
                  Target Limit: <span className="font-mono text-emerald-400 font-semibold">{totalFrameTimeMax <= 16.67 ? "<16.7ms" : "Exceeded"}</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-kingfisher-muted/60 font-bold mb-0.5 flex items-center gap-1">
                  <Monitor className="w-3 h-3 text-sky-400" /> GPU Load
                </div>
                <div className="text-lg font-mono font-bold text-white leading-tight">
                  {metrics.gpu.toFixed(1)}ms
                </div>
                <div className="text-[9px] text-kingfisher-muted/70 flex items-center gap-0.5 mt-0.5">
                  Target Limit: <span className="font-mono text-emerald-400 font-semibold">{totalFrameTimeMax <= 16.67 ? "<16.7ms" : "Exceeded"}</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-kingfisher-muted/60 font-bold mb-0.5 flex items-center gap-1">
                  <Database className="w-3 h-3 text-purple-400" /> RAM Buffers
                </div>
                <div className="text-lg font-mono font-bold text-white leading-tight">
                  {metrics.ram.toFixed(2)} GB
                </div>
                <div className="text-[9px] text-kingfisher-muted/70 flex items-center gap-0.5 mt-0.5">
                  Static Baseline: <span className="font-mono text-purple-400">Custom Pool</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-kingfisher-muted/60 font-bold mb-0.5 flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-pink-400" /> VRAM Usage
                </div>
                <div className="text-lg font-mono font-bold text-white leading-tight">
                  {metrics.vram.toFixed(2)} GB
                </div>
                <div className="text-[9px] text-kingfisher-muted/70 flex items-center gap-0.5 mt-0.5">
                  Limit Ceiling: <span className="font-mono text-pink-400 font-semibold">4.00 GB</span>
                </div>
              </div>
            </div>

            {/* THE COMPILATION VERDICT INDICATOR */}
            <div className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 font-bold font-mono text-xs">
                  {calculatedFPS}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Estimated Compelling Frame Rate</div>
                  <div className="text-[9px] text-kingfisher-muted/80">Calculated dynamic frame loop capability</div>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 uppercase tracking-widest font-mono">
                {totalFrameTimeMax <= 16.67 ? "STABLE Performance" : "PERFORMANCE BOTTLENECK"}
              </div>
            </div>

            {/* DETAILED EXPLICIT SUB-SYSTEM BREAKDOWNS (GPU/CPU/RAM/VRAM TABBED VIEW) */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-blue-400 block pb-1 border-b border-blue-400/10">Under-the-Hood Interdependence Breakdown</span>
              <div className="flex gap-2">
                {(["cpu", "gpu", "memory"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveMetricTab(tab)}
                    className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md border transition-all ${
                      activeMetricTab === tab
                        ? 'bg-kingfisher-blue/20 border-kingfisher-blue/40 text-white'
                        : 'bg-black/30 border-transparent hover:bg-neutral-800 text-kingfisher-muted hover:text-white'
                    }`}
                  >
                    {tab} impact
                  </button>
                ))}
              </div>

              {/* ACTIVE TAB BREAKDOWNS */}
              <div className="bg-black/30 border border-white/5 rounded-lg p-3 space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                {activeMetricTab === "cpu" && (
                  <div className="space-y-1.5 font-mono text-[10.5px]">
                    <div className="text-[9px] uppercase font-semibold text-amber-400/80 mb-1 border-b border-white/5 pb-1">Detailed CPU Allocation Breakdowns</div>
                    {metrics.breakdowns.cpu.map((line, i) => (
                      <div key={i} className="text-kingfisher-muted leading-relaxed flex items-center gap-1.5">
                        <span className="text-blue-500">&#x25B8;</span> {line}
                      </div>
                    ))}
                    {overlap.id === "poe_spells" && (
                      <div className="text-[9px] font-semibold text-emerald-400/80 mt-2 border-t border-white/5 pt-1">
                        Network serialization accounts for extra processing delay during packet bursts.
                      </div>
                    )}
                  </div>
                )}

                {activeMetricTab === "gpu" && (
                  <div className="space-y-1.5 font-mono text-[10.5px]">
                    <div className="text-[9px] uppercase font-semibold text-sky-400/80 mb-1 border-b border-white/5 pb-1">Detailed GPU G-Buffer Breakdowns</div>
                    {metrics.breakdowns.gpu.map((line, i) => (
                      <div key={i} className="text-kingfisher-muted leading-relaxed flex items-center gap-1.5">
                        <span className="text-sky-400">&#x25B8;</span> {line}
                      </div>
                    ))}
                  </div>
                )}

                {activeMetricTab === "memory" && (
                  <div className="space-y-2 font-mono text-[10.5px]">
                    <div className="space-y-1">
                      <div className="text-[9px] uppercase font-semibold text-purple-400/80 mb-1 border-b border-white/5 pb-1">System RAM Allocation</div>
                      {metrics.breakdowns.ram.map((line, i) => (
                        <div key={i} className="text-kingfisher-muted leading-relaxed flex items-center gap-1.5">
                          <span className="text-purple-400">&#x25B8;</span> {line}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1 border-t border-white/5 pt-2">
                      <div className="text-[9px] uppercase font-semibold text-pink-400/80 mb-1 border-b border-white/5 pb-1">Dynamic Video Memory (VRAM) Allocation</div>
                      {metrics.breakdowns.vram.map((line, i) => (
                        <div key={i} className="text-kingfisher-muted leading-relaxed flex items-center gap-1.5">
                          <span className="text-pink-400">&#x25B8;</span> {line}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* UNREAL ENGINE HAS / HASN'T MATRIX FOR INTERSECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/5">
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-3.5 rounded-xl">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                  <CheckCircle className="w-3.5 h-3.5" /> Built-In Unreal Tools
                </span>
                <ul className="space-y-1 text-[11px] text-kingfisher-muted">
                  {metrics.ueHas.map((item, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-emerald-500">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 p-3.5 rounded-xl">
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5" /> Gaps & Hard Limits
                </span>
                <ul className="space-y-1 text-[11px] text-kingfisher-muted">
                  {metrics.ueLacks.map((item, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-red-500">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* THE WORKAROUND PLAN SUMMARY */}
            <div className="p-3 bg-kingfisher-blue/5 border border-kingfisher-blue/20 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-white uppercase tracking-widest text-[9px] text-kingfisher-blue">Actionable C++ Workaround Plan</div>
              <p className="text-kingfisher-muted leading-relaxed">{metrics.workaround}</p>
            </div>
          </div>
        </div>

      </div>

      {/* DETAILED VERIFIABLE CHECKLIST FOR PERFORMANCE PROOFS */}
      <SectionCard title="Performance Synergy Verification Checklists" icon={CheckCircle} color={COLORS.kingfisher.blue}>
        <div className="text-xs text-kingfisher-muted space-y-4">
          <p className="leading-relaxed">
            Verify the diagnostic and mathematical logic below. Compounding performance synergic optimizations guarantee perfect frames under intensive conditions:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
            <div className="p-4 rounded-xl border border-white/5 bg-black/25">
              <div className="text-xs font-extrabold text-white uppercase tracking-wider mb-2 border-b border-white/5 pb-1 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" /> Frame Time Diagnostics Proof
              </div>
              <ul className="space-y-2.5 font-mono text-[11px] text-kingfisher-muted">
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span>Standard Tick Baseline Target:</span>
                  <span className="text-white">16.67 ms (60 FPS)</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span>Current Calculated Frame Delay:</span>
                  <span className={`${totalFrameTimeMax <= 16.67 ? "text-emerald-400" : "text-amber-400"}`}>{totalFrameTimeMax.toFixed(2)} ms</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span>Unused Timing Headroom Safety:</span>
                  <span className="text-blue-400 font-bold">{(16.67 - totalFrameTimeMax).toFixed(2)} ms</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span>Compounding Memory Pool State:</span>
                  <span className="text-purple-400">{metrics.ram.toFixed(2)}GB RAM / {metrics.vram.toFixed(2)}GB VRAM</span>
                </li>
                <li className="text-[10px] text-kingfisher-muted/60 font-sans pt-1 leading-normal italic">
                  Compounded calculations verify that activating complementary performance architectures resolves bottlenecks by tackling thread dependencies on a binary level.
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-white/5 bg-black/25">
              <div className="text-xs font-extrabold text-white uppercase tracking-wider mb-2 border-b border-white/5 pb-1 flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-amber-400" /> Overlap Solution Checklists
              </div>
              <ul className="space-y-2 font-sans text-xs">
                {[
                  "Verify that spatial thread allocations avoid standard actor Tick() desync loops.",
                  "Enforce size-packed, cache-aligned USTRUCT structs programmatically inside compilers.",
                  "Protect heavy lighting/shadow caching lines by applying G-buffer sways distance scale caps.",
                  "Mitigate high network latency desync spikes using Server-Side historical physics re-simulation.",
                  "Utilize dedicated FGCCluster sweeps to avoid mark-sweep search stalls during level streams."
                ].map((cli, i) => (
                  <li key={i} className="flex items-start gap-2 text-kingfisher-muted leading-snug">
                    <span className="text-emerald-500 font-bold">&#x2713;</span> {cli}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default AspectOverlapsTab;
