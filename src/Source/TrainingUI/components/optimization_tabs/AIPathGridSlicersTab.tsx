import React, { useState, useEffect } from 'react';
import { PageHeader, HighlightBox, SectionCard, MultiplayerImpact, FeatureMatrix, CodeBlock } from './OptimizationHelpers';
import { 
  Grid, Cpu, HardDrive, Terminal, Code, Zap, Play, 
  Layers, Settings, Activity, CheckCircle2, RefreshCw
} from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { motion, AnimatePresence } from 'motion/react';

export const AIPathGridSlicersTab: React.FC = () => {
  // Navigation tabs for the intelligent simulators
  const [activeTab, setActiveTab] = useState<'comparison' | 'interactive_grid' | 'async_baker'>('comparison');

  // Multi-Topic states
  // 1. Comparison Tab
  const [aiCount, setAiCount] = useState<number>(500);
  const [useGridSlicing, setUseGridSlicing] = useState<boolean>(true);
  const [combatComplexity, setCombatComplexity] = useState<'flat' | 'ruins' | 'vertical_fortress'>('ruins');

  // Recast A* stats vs Grid Slicer stats
  const recastCpuTime = (aiCount * 0.016 * (combatComplexity === 'flat' ? 1.0 : combatComplexity === 'ruins' ? 2.2 : 4.5)).toFixed(2);
  const recastRam = (60 + aiCount * 0.15 * (combatComplexity === 'flat' ? 1 : 2.5)).toFixed(1);
  const recastStutterRate = Math.min(98, Math.round(aiCount * 0.15 * (combatComplexity === 'flat' ? 0.3 : combatComplexity === 'ruins' ? 1.0 : 2.5)));

  const slicerCpuTime = (aiCount * 0.0006).toFixed(2);
  const slicerRam = (12.5).toFixed(1); // Flat allocation mapping static grids
  const slicerStutterRate = Math.min(1.5, Math.round(aiCount * 0.0002 * 10) / 10);

  // 2. Interactive Grid Tab
  const gridWidth = 10;
  const gridHeight = 10;
  // Initialize a 10x10 grid. Some default obstacles.
  const [gridCells, setGridCells] = useState<Array<{ id: number, x: number, y: number, isWalkable: boolean, zHeight: number }>>(() => {
    const cells = [];
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        // Some obstacles
        const isObstacle = (x === 3 && y < 7) || (x === 7 && y > 2) || (x === 5 && y === 5);
        // Realistic height variations representing hilly landscape
        const baseZ = 200 + Math.sin(x * 0.5) * 40 + Math.cos(y * 0.5) * 80;
        cells.push({
          id: y * gridWidth + x,
          x,
          y,
          isWalkable: !isObstacle,
          zHeight: isObstacle ? 0 : Math.round(baseZ),
        });
      }
    }
    return cells;
  });

  const [selectedCellId, setSelectedCellId] = useState<number | null>(44); // Default select middle area
  const selectedCell = selectedCellId !== null ? gridCells.find(c => c.id === selectedCellId) : null;

  // Query simulator states
  const [searchQueryX, setSearchQueryX] = useState<number>(450); // meters/unreal units scale
  const [searchQueryY, setSearchQueryY] = useState<number>(450);
  const [queryResult, setQueryResult] = useState<{ index: number; x: number; y: number; walkable: boolean; z: number; lookupTimeNs: number } | null>(null);

  // Calculate coordinates query mapping
  const runCoordinateQuery = () => {
    // 1 unit on grid is 100 unreal units (1 meter)
    // Map bounds: 0 to 1000 unreal units
    const cellX = Math.floor(Math.max(0, Math.min(999, searchQueryX)) / 100);
    const cellY = Math.floor(Math.max(0, Math.min(999, searchQueryY)) / 100);
    const index = cellY * gridWidth + cellX;
    const targetCell = gridCells.find(c => c.x === cellX && c.y === cellY);

    if (targetCell) {
      setQueryResult({
        index,
        x: cellX,
        y: cellY,
        walkable: targetCell.isWalkable,
        z: targetCell.zHeight,
        lookupTimeNs: Math.round(4 + Math.random() * 8), // highly fast O(1) CPU cache execution
      });
    }
  };

  const toggleCellWalkable = (id: number) => {
    setGridCells(prev => prev.map(cell => {
      if (cell.id === id) {
        return {
          ...cell,
          isWalkable: !cell.isWalkable,
          zHeight: cell.isWalkable ? 0 : 250 + Math.round(Math.random() * 50)
        };
      }
      return cell;
    }));
  };

  // 3. Thread Baker Tab
  const [bakeThreads, setBakeThreads] = useState<number>(4);
  const [chunkSize, setChunkSize] = useState<number>(64); // Chunks count
  const [bakingPriority, setBakingPriority] = useState<'low' | 'normal' | 'above_normal' | 'critical'>('above_normal');
  const [isBakingInProgress, setIsBakingInProgress] = useState<boolean>(false);
  const [bakingProgress, setBakingProgress] = useState<number>(0);
  const [bakerLogs, setBakerLogs] = useState<string[]>([]);

  // Telemetry estimations
  const threadOverlapEst = (bakeThreads * 0.12 * (bakingPriority === 'critical' ? 1.8 : 1)).toFixed(2);
  const totalBakeTimeMs = (chunkSize * 15 * (1 / (bakeThreads * 0.85))).toFixed(0);

  const startAsynchronousBake = () => {
    if (isBakingInProgress) return;
    setIsBakingInProgress(true);
    setBakingProgress(0);
    setBakerLogs([]);

    const log = (msg: string) => setBakerLogs(prev => [...prev, msg]);

    log(`[THREADING] Spawning ${bakeThreads} asynchronous FRunnableWorker worker pools...`);
    log(`[SCHEDULER] Priority flagged: UE_THREAD_PRIORITY_${bakingPriority.toUpperCase()}.`);
    log(`[MEM] Allocating virtual bake buffers holding ${chunkSize} high-density landscape chunks.`);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.round(5 + Math.random() * 15);
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        log(`[WORKER #1] Done tracing sectors 0 - ${Math.round(chunkSize/2)}.`);
        log(`[WORKER #2] Ground intersections solved on world partition grids.`);
        log(`[SCHEDULER] Aggregating chunks into a single non-fragmented TArray...`);
        log(`[MEM] Slicing Finished successfully. Packed ${chunkSize} Chunks into flat binary file: world_ai_slices.bin`);
        log(`[SUCCESS] CPU Slicers idle. Game Thread safe from any runtime Recast calculations.`);
        setIsBakingInProgress(false);
      } else {
        log(`[SCHEDULER] Tracing and projecting Chunks ${Math.round(currentProgress * chunkSize / 100)} / ${chunkSize} (${currentProgress}%)...`);
      }
      setBakingProgress(Math.min(100, currentProgress));
    }, 400);
  };

  return (
    <div className="space-y-6 select-none">
      <PageHeader 
        title="Procedural AI Path-Grid Slicers" 
        subtitle="Multi-threaded terrain height-projection generators slicing dense Recast navigation data into localized O(1) 2D vector array maps." 
      />

      {/* Simulator Nav Bar */}
      <div className="flex flex-wrap p-1 gap-1 bg-black/40 rounded-xl border border-kingfisher-border/30">
        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex-grow sm:flex-grow-0 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeTab === 'comparison' 
              ? 'bg-[#4da6ff]/15 border border-[#4da6ff] text-[#4da6ff]' 
              : 'border border-transparent text-kingfisher-muted hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Horde Pathfinding Comparison
        </button>

        <button
          onClick={() => setActiveTab('interactive_grid')}
          className={`flex-grow sm:flex-grow-0 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeTab === 'interactive_grid' 
              ? 'bg-[#ffe14d]/15 border border-[#ffe14d] text-[#ffe14d]' 
              : 'border border-transparent text-kingfisher-muted hover:text-white'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          Interactive O(1) Grid Mapper
        </button>

        <button
          onClick={() => setActiveTab('async_baker')}
          className={`flex-grow sm:flex-grow-0 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeTab === 'async_baker' 
              ? 'bg-emerald-500/15 border border-emerald-500 text-emerald-400' 
              : 'border border-transparent text-kingfisher-muted hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          Async FRunnable Slice Baker
        </button>
      </div>

      {/* RENDER ACTIVE TAB */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >

          {/* TAB 1: Recast Navmesh vs O(1) Slicers Performance Comparison */}
          {activeTab === 'comparison' && (
            <div className="space-y-6">
              <HighlightBox type="info">
                <strong>Why Pathfind via Slices?</strong> Standard Recast dynamic tile rebaking or simultaneous polygon routing on high-fidelity terrain degrades servers. In AAA multiplayer games, flat pre-projected coordinate slices replace polygons. A character queries walkable coordinates directly using a single vector-to-index calculation, resulting in constant-time <strong>O(1) execution limits</strong>.
              </HighlightBox>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-black/25 p-5 rounded-2xl border border-kingfisher-border/50">
                {/* Controls Area */}
                <div className="lg:col-span-4 space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#4da6ff] block">
                    Pathfinding Simulation Parameters
                  </span>

                  {/* Slider: AI Count */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-white">
                      <span>Simulated Active Mobs:</span>
                      <span className="font-mono font-bold text-[#4da6ff]">{aiCount} AI</span>
                    </div>
                    <input 
                      type="range" min="50" max="2500" step="50" value={aiCount} 
                      onChange={(e) => setAiCount(Number(e.target.value))}
                      className="w-full h-1 bg-kingfisher-border rounded cursor-pointer"
                    />
                  </div>

                  {/* Dropdown: Terrain Complexity */}
                  <div className="space-y-1">
                    <label className="text-xs text-kingfisher-muted block">Navigation Map Geometry:</label>
                    <select
                      value={combatComplexity}
                      onChange={(e: any) => setCombatComplexity(e.target.value)}
                      className="w-full bg-kingfisher-dark/90 border border-kingfisher-border/40 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#4da6ff]"
                    >
                      <option value="flat">Standard Open Flat Fields (High Cache Coherency)</option>
                      <option value="ruins">Segmented Ruins & Dungeons (Medium Ray Breaks)</option>
                      <option value="vertical_fortress">Complex Multi-Layered Vertical Forts (Dense Nodes)</option>
                    </select>
                  </div>

                  <div className="pt-2 border-t border-kingfisher-border/20">
                    <div className="bg-black/30 p-3 rounded-lg border border-kingfisher-border/20 text-xs space-y-2">
                      <div className="text-white font-bold mb-1 uppercase tracking-wider text-[10px] text-[#ffd700]">
                        Algorithm Core Profile
                      </div>
                      <div className="flex justify-between">
                        <span className="text-kingfisher-muted">Complexity Index:</span>
                        <span className="font-mono text-emerald-400">
                          {combatComplexity === 'flat' ? 'O(N)' : combatComplexity === 'ruins' ? 'O(N * log N)' : 'O(N²)'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-kingfisher-muted">Max Async Queue depth:</span>
                        <span className="font-mono text-pink-400">128 operations</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparative Analytics Area */}
                <div className="lg:col-span-8 flex flex-col justify-between border-l border-kingfisher-border/30 pl-0 lg:pl-6 space-y-4 mt-6 lg:mt-0">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffd700] block">
                    Comparative Physics / Mechanics Hardware Budget Costs
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Column A: Recast Detour */}
                    <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/20 space-y-3">
                      <div className="flex items-center gap-1.5 border-b border-red-500/10 pb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
                          Unreal Recast Navmesh A*
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] text-kingfisher-muted block">CPU Frame Time Impact</span>
                          <span className="text-xl font-mono font-bold text-red-400">{recastCpuTime} ms</span>
                          <span className="text-[9px] text-kingfisher-muted/50 block">Game thread blocks during path solve</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-kingfisher-muted block">RAM / VRAM Footprint</span>
                          <span className="text-sm font-mono text-white">{recastRam} MB</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-kingfisher-muted block">Frame Drop Probability</span>
                          <span className="text-sm font-mono text-rose-500">{recastStutterRate}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Column B: Slice Grid */}
                    <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20 space-y-3">
                      <div className="flex items-center gap-1.5 border-b border-emerald-500/10 pb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-none" />
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                          Baked O(1) Slice Slicer
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] text-kingfisher-muted block">CPU Frame Time Impact</span>
                          <span className="text-xl font-mono font-bold text-emerald-400">{slicerCpuTime} ms</span>
                          <span className="text-[9px] text-kingfisher-muted/50 block">Instant coordinate offset fetching</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-kingfisher-muted block">RAM / VRAM Footprint</span>
                          <span className="text-sm font-mono text-white">{slicerRam} MB <span className="text-[9px] text-emerald-400">(Constant)</span></span>
                        </div>
                        <div>
                          <span className="text-[10px] text-kingfisher-muted block">Frame Drop Probability</span>
                          <span className="text-sm font-mono text-emerald-400">{slicerStutterRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <HighlightBox type="success" className="py-2.5">
                    <p className="text-xs leading-relaxed text-emerald-200">
                      📊 <strong>Hardware Optimization Summary:</strong> Switching to Baked Slices reduces Game Thread latency by active margins of up to <strong>{(Number(recastCpuTime) - Number(slicerCpuTime)).toFixed(2)} ms</strong> on identical hordes. By caching flat primitive arrays cleanly in L2 cache lines, VRAM/RAM allocations freeze at a constant <strong>12.5 MB</strong>, eliminating system page fault locks.
                    </p>
                  </HighlightBox>
                </div>
              </div>

              {/* Static Analysis Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="The Navmesh A* Bottleneck" icon={Terminal} color={COLORS.status.warning}>
                  <p className="text-sm mb-3 text-kingfisher-muted">
                    Unreal Engine's default <strong>Recast/Detour Navmesh</strong> uses polygons to determine walkable space. When you instruct 500 AI mobs to path towards a player, the engine fires hundreds of asynchronous A* polygon queries.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-4">
                    <li><strong>Polygonal Complexity:</strong> Calculating intersections against multi-level 3D polygons scales exponentially (O(K * N log N)).</li>
                    <li><strong>Game Thread Flooding:</strong> Even if async, the callback structures requesting navigation points flood the Game Thread queues causing 6ms+ stalls during horde spawns.</li>
                  </ul>
                  <MultiplayerImpact 
                     gpu="0ms (CPU bound operation)" 
                     cpu="+8.5ms (Game Thread lockups during simultaneous AArch query waves)" 
                     ram="+60MB Allocation" 
                     latency="Server stutters during mass combat, dropping tickrate below 30Hz." 
                  />
                </SectionCard>

                <SectionCard title="Grid Slicing Architecture" icon={Grid} color={COLORS.kingfisher.blue}>
                  <p className="text-sm mb-3">
                    O(1) Vector Arrays replace polygon pathfinding. On boot, we instantiate <code>FRunnable</code> threads to <strong>raycast 2D grids</strong> directly onto the Recast Navmesh, storing walkability and Z-height in flat <code>TArray&lt;uint8&gt;</code> structures.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-4">
                    <li><strong>Bit-packed State:</strong> Each cell simply stores <code>0</code> or <code>1</code> for walkability, preventing heavy pointer hopping.</li>
                    <li><strong>O(1) Direct Indexing:</strong> AI characters divide their World Transform X/Y by grid-cell size to fetch walking permissions instantly sequentially cache.</li>
                    <li><strong>Cache Friendliness:</strong> A linear <code>TArray</code> fits neatly into CPU L1/L2 caches compared to linked-list Recast polygons.</li>
                  </ul>
                  <MultiplayerImpact 
                     gpu="0ms" 
                     cpu="-8.2ms (Replaces A* queries with instant flat array lookups taking 0.3ms for thousands of entities)" 
                     ram="-120MB (Drops massive runtime rebuilt array structures needed by dynamic Detour tiles)" 
                     latency="Keeps server tick safely beneath 33.3ms, stabilizing combat rollbacks." 
                  />
                </SectionCard>
              </div>
            </div>
          )}


          {/* TAB 2: Interactive O(1) Grid & Height projection Slicer */}
          {activeTab === 'interactive_grid' && (
            <div className="space-y-6">
              <HighlightBox type="success">
                <strong>O(1) Memory Indexing Visualizer:</strong> Live projection map representing a baked 1000m x 1000m Unreal Engine zone. Click cells to toggle walkability stencils or modify heights. Notice how coordinates divide directly into flat index offsets without searching or sorting algorithms.
              </HighlightBox>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visual Projection Cells (Grid) */}
                <div className="lg:col-span-7 bg-black/35 border border-kingfisher-border/50 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-kingfisher-border/30 pb-3">
                    <div>
                      <span className="text-[10px] text-[#ffe14d] uppercase font-bold tracking-widest block">World Coordinate Projection Grid</span>
                      <span className="text-xs text-kingfisher-muted">10x10 Matrix Cells (1 Tile = 100 unreal units / 1m)</span>
                    </div>
                    <button
                      onClick={() => {
                        // Reset Grid default obstacles
                        setGridCells(prev => prev.map(c => {
                          const isObstacle = (c.x === 3 && c.y < 7) || (c.x === 7 && c.y > 2) || (c.x === 5 && c.y === 5);
                          const baseZ = 200 + Math.sin(c.x * 0.5) * 40 + Math.cos(c.y * 0.5) * 80;
                          return {
                            ...c,
                            isWalkable: !isObstacle,
                            zHeight: isObstacle ? 0 : Math.round(baseZ),
                          };
                        }));
                      }}
                      className="p-1 px-2.5 bg-black/40 hover:bg-black/60 text-[10px] font-mono border border-kingfisher-border/40 text-kingfisher-muted hover:text-white rounded"
                    >
                      Reset Grid State
                    </button>
                  </div>

                  {/* Matrix Renderer */}
                  <div className="grid grid-cols-10 gap-1.5 aspect-square max-w-md mx-auto">
                    {gridCells.map((cell) => {
                      const isSelected = selectedCellId === cell.id;
                      return (
                        <div
                          key={cell.id}
                          onClick={() => setSelectedCellId(cell.id)}
                          className={`relative aspect-square border-2 rounded-md flex flex-col justify-between p-1 cursor-pointer transition-all select-none ${
                            !cell.isWalkable 
                              ? 'bg-rose-950/40 border-rose-800 text-rose-300' 
                              : isSelected
                              ? 'bg-[#ffe14d]/10 border-[#ffe14d] text-white shadow-md'
                              : 'bg-kingfisher-dark/50 border-kingfisher-border/25 hover:border-kingfisher-border/60 text-kingfisher-muted'
                          }`}
                        >
                          <span className="font-mono text-[9px] absolute top-0.5 left-0.5 opacity-50">
                            {cell.y},{cell.x}
                          </span>
                          
                          <div className="flex-grow flex items-center justify-center">
                            {cell.isWalkable ? (
                              <span className="font-mono text-[9px] font-bold text-emerald-400">
                                {cell.zHeight}z
                              </span>
                            ) : (
                              <span className="font-sans text-[9px] font-extrabold text-red-400 uppercase tracking-tighter">
                                BLOCK
                              </span>
                            )}
                          </div>

                          <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-zinc-700">
                            {isSelected && <div className="w-full h-full rounded-full bg-[#ffe14d] animate-ping" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-kingfisher-dark/50 border border-kingfisher-border/40 rounded" />
                      <span className="text-kingfisher-muted">Walkable Lands</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-rose-950/40 border border-rose-800 rounded" />
                      <span className="text-rose-400">Blocked / Obstacle Colliders</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 border-2 border-[#ffe14d] rounded bg-[#ffe14d]/15" />
                      <span className="text-[#ffe14d]">Currently Selected cell</span>
                    </div>
                  </div>
                </div>

                {/* Slicer Query & Vector Engine details */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                  
                  {/* Info Card on Current Selected Cell */}
                  <div className="bg-black/35 border border-kingfisher-border/50 rounded-2xl p-5 space-y-4">
                    <span className="text-[10px] text-[#ffd700] uppercase font-bold tracking-widest block">Cell Memory Properties</span>

                    {selectedCell ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          <div className="bg-kingfisher-dark/60 p-2 rounded border border-kingfisher-border/20">
                            <span className="text-[10px] text-kingfisher-muted block">Cell coordinates</span>
                            <span className="text-white font-bold">{selectedCell.x}, {selectedCell.y}</span>
                          </div>
                          <div className="bg-kingfisher-dark/60 p-2 rounded border border-kingfisher-border/20">
                            <span className="text-[10px] text-kingfisher-muted block">Array Memory Offset Index</span>
                            <span className="text-[#ffe14d] font-bold">Index: {selectedCell.id}</span>
                          </div>
                        </div>

                        <div className="p-3 bg-black/50 border border-kingfisher-border/30 rounded-lg space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-kingfisher-muted">IsWalkable Flag:</span>
                            <span className={selectedCell.isWalkable ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                              {selectedCell.isWalkable ? 'TRUE (0x01)' : 'FALSE (0x00)'}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-kingfisher-muted">Height projection (Z):</span>
                            <span className="text-blue-300 font-mono font-bold">{selectedCell.zHeight} cm</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-kingfisher-muted">Binary Bitmask Layout:</span>
                            <span className="text-purple-400 font-mono text-[11px]">
                              {selectedCell.isWalkable ? '00000001' : '00000000'} | {selectedCell.zHeight.toString(2).padStart(24, '0')}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Toggle for Walkability */}
                        <button
                          onClick={() => toggleCellWalkable(selectedCell.id)}
                          className="w-full py-2.5 px-3 rounded-lg text-xs font-bold border transition-all text-white border-kingfisher-border/60 hover:border-white bg-black/20 hover:bg-black/40"
                        >
                          Modify Cell Walkable State
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-kingfisher-muted italic">Click any cell to query memory boundaries.</p>
                    )}
                  </div>

                  {/* Slicing Formula Query Simulator */}
                  <div className="bg-black/35 border border-kingfisher-border/50 rounded-2xl p-5 space-y-4">
                    <span className="text-[10px] text-[#4da6ff] uppercase font-bold tracking-widest block">O(1) World Coordinate Vector Lookup Engine</span>
                    
                    <div className="space-y-2 text-xs text-sans">
                      <p className="text-kingfisher-muted text-xs">
                        Enter a simulated player's absolute World position vectors to extract ground-height and walking boundaries instantaneously:
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <label className="text-[10px] text-kingfisher-muted uppercase font-mono">World X Coordinate (0-999):</label>
                          <input 
                            type="number" min="0" max="999" value={searchQueryX}
                            onChange={(e) => setSearchQueryX(Number(e.target.value))}
                            className="w-full bg-kingfisher-dark border border-kingfisher-border/40 hover:border-[#4da6ff] focus:border-[#4da6ff] rounded p-1.5 font-mono text-white text-xs focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-kingfisher-muted uppercase font-mono">World Y Coordinate (0-999):</label>
                          <input 
                            type="number" min="0" max="999" value={searchQueryY}
                            onChange={(e) => setSearchQueryY(Number(e.target.value))}
                            className="w-full bg-kingfisher-dark border border-kingfisher-border/40 hover:border-[#4da6ff] focus:border-[#4da6ff] rounded p-1.5 font-mono text-white text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <button
                        onClick={runCoordinateQuery}
                        className="w-full py-2 bg-gradient-to-r from-[#4da6ff] to-blue-500 text-black text-xs font-bold hover:brightness-110 rounded-lg flex items-center justify-center gap-2 mt-2"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Solve Math Offset Lookup
                      </button>

                      {queryResult && (
                        <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-1.5 mt-2 animate-fadeIn">
                          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex justify-between">
                            <span>O(1) QUERY COMPLETE</span>
                            <span className="font-mono text-blue-300">Took {queryResult.lookupTimeNs} nanoseconds</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                            <div>
                              <span className="text-[10px] text-kingfisher-muted block">Bake Index:</span>
                              <span className="text-white">{queryResult.index}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-kingfisher-muted block">Terrain Height:</span>
                              <span className="text-blue-300">{queryResult.z} cm</span>
                            </div>
                            <div className="col-span-2 border-t border-kingfisher-border/10 pt-1 flex justify-between">
                              <span className="text-[10px] text-kingfisher-muted">Lookup Result</span>
                              <span className={`font-bold ${queryResult.walkable ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {queryResult.walkable ? '✅ WALKABLE TILE' : '❌ CHASM BLOCK'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}


          {/* TAB 3: Multi-Threaded Async FRunnable Slice Baker */}
          {activeTab === 'async_baker' && (
            <div className="space-y-6">
              <HighlightBox type="success">
                <strong>Multi-threaded Grid-Slicing Scheduler:</strong> Simulates slicing a massive open-world dynamic zone asynchronously without freezing game frames. Configure your thread pools and triggers underneath, then monitor logs inside the virtual scheduler shell.
              </HighlightBox>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-black/25 p-5 rounded-2xl border border-kingfisher-border/50">
                {/* Controls Left */}
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#4da6ff] block">
                    Bake Task Configurations
                  </span>

                  {/* Slider Thread Count */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-white">
                      <span>Worker Thread Allocation:</span>
                      <span className="font-mono font-bold text-emerald-400">{bakeThreads} Threads (FRunnable)</span>
                    </div>
                    <input 
                      type="range" min="1" max="16" value={bakeThreads} 
                      onChange={(e) => setBakeThreads(Number(e.target.value))}
                      disabled={isBakingInProgress}
                      className="w-full h-1 bg-kingfisher-border rounded cursor-pointer disabled:opacity-40"
                    />
                  </div>

                  {/* Slider Landscape Chunk Size */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-white">
                      <span>Zone Terrain Chunks (Slices):</span>
                      <span className="font-mono font-bold text-pink-400">{chunkSize} Chunks</span>
                    </div>
                    <input 
                      type="range" min="16" max="256" step="16" value={chunkSize} 
                      onChange={(e) => setChunkSize(Number(e.target.value))}
                      disabled={isBakingInProgress}
                      className="w-full h-1 bg-kingfisher-border rounded cursor-pointer disabled:opacity-40"
                    />
                  </div>

                  {/* Thread Priority selection */}
                  <div className="space-y-1.5">
                    <span className="text-xs text-kingfisher-muted">Thread Priority Context:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {['low', 'normal', 'above_normal', 'critical'].map((priority) => (
                        <button
                          key={priority}
                          onClick={() => setBakingPriority(priority as any)}
                          disabled={isBakingInProgress}
                          className={`text-[10px] p-2 rounded-lg font-bold border transition-all uppercase tracking-wider disabled:opacity-40 ${
                            bakingPriority === priority 
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400' 
                              : 'bg-black/30 border-transparent text-kingfisher-muted hover:text-white'
                          }`}
                        >
                          {priority.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Run button */}
                  <button
                    onClick={startAsynchronousBake}
                    disabled={isBakingInProgress}
                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 ${
                      isBakingInProgress 
                        ? 'bg-black/40 text-kingfisher-muted cursor-not-allowed border border-kingfisher-border/20' 
                        : 'bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer shadow-lg'
                    }`}
                  >
                    {isBakingInProgress ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Generating Slice Grids...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        Execute Background Raycast Slicer
                      </>
                    )}
                  </button>
                </div>

                {/* Telemetry and Logs Right */}
                <div className="lg:col-span-7 flex flex-col justify-between border-l border-kingfisher-border/30 pl-0 lg:pl-6 space-y-4 mt-6 lg:mt-0">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffd700] block">
                    Telemetry Estimations & Background Shell Output
                  </span>

                  {/* Quick stats on schedule */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-kingfisher-dark/80 p-2.5 rounded-lg border border-kingfisher-border/20 text-center">
                      <span className="text-[9px] text-kingfisher-muted uppercase font-bold block">Thread Overlap Cost</span>
                      <span className="text-sm font-mono font-bold text-pink-400">{threadOverlapEst}ms</span>
                    </div>
                    <div className="bg-kingfisher-dark/80 p-2.5 rounded-lg border border-kingfisher-border/20 text-center">
                      <span className="text-[9px] text-kingfisher-muted uppercase font-bold block">Estimated Bake Duration</span>
                      <span className="text-sm font-mono font-bold text-[#4da6ff]">{totalBakeTimeMs}ms</span>
                    </div>
                    <div className="bg-kingfisher-dark/80 p-2.5 rounded-lg border border-kingfisher-border/20 text-center">
                      <span className="text-[9px] text-kingfisher-muted uppercase font-bold block">Game Thread Impact</span>
                      <span className="text-sm font-mono font-bold text-emerald-400">0.02ms</span>
                    </div>
                  </div>

                  {/* ProgressBar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-kingfisher-muted mb-1">
                      <span>Baking Progression Status:</span>
                      <span className="font-bold text-white">{bakingProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-kingfisher-border/30">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${bakingProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Virtual Console logs */}
                  <div className="p-3 bg-black/60 border border-kingfisher-border/30 rounded-xl">
                    <div className="text-[10px] text-kingfisher-muted uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${isBakingInProgress ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                      <span>FRunnable Background Thread Pipeline Logs</span>
                    </div>
                    <div className="font-mono text-[10.5px] max-h-36 overflow-y-auto custom-scrollbar space-y-1 text-slate-300 pr-1 select-text">
                      {bakerLogs.length === 0 ? (
                        <div className="text-kingfisher-muted italic">Ready to trace pathfinder sectors. Click Execute to begin.</div>
                      ) : (
                        bakerLogs.map((log, index) => (
                          <div key={index} className="leading-snug">
                            <span className="text-kingfisher-muted/50 mr-1.5">&gt;</span> {log}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      <SectionCard title="O(1) Memory Mapping C++ Core" icon={Code} color={COLORS.status.info}>
        <p className="text-sm text-kingfisher-muted mb-3">
          The core logic structure defining the baked map. By keeping the map entirely integer and vector-free internally, we achieve massive speeds.
        </p>
        <CodeBlock code={`// AIPathGridManager.h
#pragma once
#include "CoreMinimal.h"

USTRUCT()
struct FWalkableGridCell 
{
    GENERATED_BODY()
    
    // Condensed data: 24 bits for height, 8 bits for Flags (Walkable, Water, Fire)
    uint32 CompressedData;

    FORCEINLINE float GetZHeight() const { return (float)(CompressedData & 0xFFFFFF) * 0.1f; }
    FORCEINLINE bool IsWalkable() const { return (CompressedData >> 24) & 0x01; }
};

class FPathGridSlicer 
{
public:
    TArray<FWalkableGridCell> GlobalGrid;
    int32 MapWidth, MapHeight;

    // Evaluated directly on the memory buffer in nanoseconds
    bool CheckTileWalkable(const FVector2D& WorldPos) const 
    {
        int32 GridX = FMath::FloorToInt(WorldPos.X / 100.f);
        int32 GridY = FMath::FloorToInt(WorldPos.Y / 100.f);
        int32 Index = GridY * MapWidth + GridX;
        
        return GlobalGrid.IsValidIndex(Index) ? GlobalGrid[Index].IsWalkable() : false;
    }
};`} />
      </SectionCard>

      <FeatureMatrix 
         has={["Recast & Detour Polygon Generator", "Dynamic Navmesh rebuild around level instances", "Asynchronous Navigation Task queries (still locks Main Thread on dispatch callbacks)"]} 
         missing={["O(1) Flat Array Map Evaluator (Forces custom Data Arrays)", "Multi-threaded offline baking into 2D memory arrays", "Cache-aligned primitive routing (Requires manually bypassing standard UAITask components)"]} 
         howToUse="Bypass standard `MoveTo` nodes for your dense hordes. Instead, write custom AI Controllers that tick directly from the `FPathGridSlicer` subsystem using fixed vector offsets."
      />
    </div>
  );
};
