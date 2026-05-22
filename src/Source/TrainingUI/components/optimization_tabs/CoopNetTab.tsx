import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, ShieldCheck, Globe, Cpu, Database, Server, Radio, Zap,
  Wifi, ShieldAlert, Crosshair, ArrowRight, Play, Swords, Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COLORS } from '../../../../constants/colors';
import { SectionCard, HighlightBox, PageHeader, CodeBlock, StatRow, MultiplayerImpact, FeatureMatrix } from './OptimizationHelpers';

interface Entity {
  id: string;
  name: string;
  type: 'monster' | 'player';
  x: number;
  y: number;
  icon: string;
  color: string;
}

export const CoopNetTab: React.FC = () => {
  // --- STATE FOR SECTION TRANSITIONS ---
  const [activeSection, setActiveSection] = useState<'relevance' | 'rpc' | 'multiregion'>('relevance');

  useEffect(() => {
    const target = (window as any).__scrollTarget;
    if (target) {
      if (target === 'coop-jitter-simulator' || target === 'multi-region-simulation' || target === 'multi-region-net-sim') {
        setActiveSection('multiregion');
      } else if (target === 'spatial-relevance-bubbles' || target === 'net-dormancy-smart-culling' || target === 'net-dormancy-relevancy') {
        setActiveSection('relevance');
      } else if (target === 'network-qos' || target === 'coop-rpc-combat') {
        setActiveSection('rpc');
      }
    }
  }, []);

  // --- SIMULATOR 3: MULTI-REGION JITTER & PACKET LOSS ---
  const [mrMrPing, setMrMrPing] = useState(120); // ms
  const [mrMrLoss, setMrMrLoss] = useState(5); // %
  const [mrMrJitter, setMrMrJitter] = useState(15); // ms
  const [mrMrPrediction, setMrMrPrediction] = useState(true);
  const [mrMrConsole, setMrMrConsole] = useState<string[]>([
    'Multi-region test network link established.'
  ]);
  const [isSimulatingLink, setIsSimulatingLink] = useState(false);

  // Simulator 1: Spatial Network Relevance Bubble Maps
  const [selectedPlayer, setSelectedPlayer] = useState<'p1' | 'p2'>('p1');
  
  // Coordinates for Player 1 and Player 2
  const [p1Coords, setP1Coords] = useState({ x: 180, y: 140 });
  const [p2Coords, setP2Coords] = useState({ x: 380, y: 220 });
  const [bubbleRadius, setBubbleRadius] = useState(120);

  // Dynamic list of monsters scattered across the RPG grid
  const [monsters, setMonsters] = useState<Entity[]>([
    { id: 'm1', name: 'Swamp Griffin', type: 'monster', x: 120, y: 110, icon: '🦅', color: '#ff4d4d' },
    { id: 'm2', name: 'Drowner Horde', type: 'monster', x: 230, y: 160, icon: '🧟', color: '#4da6ff' },
    { id: 'm3', name: 'Leshen Elder', type: 'monster', x: 150, y: 260, icon: '🦌', color: '#79d2a6' },
    { id: 'm4', name: 'Alghoul', type: 'monster', x: 340, y: 100, icon: '💀', color: '#ffb366' },
    { id: 'm5', name: 'Grave Hag', type: 'monster', x: 440, y: 170, icon: '👵', color: '#df80ff' },
    { id: 'm6', name: 'Wild Dog Pack', type: 'monster', x: 320, y: 310, icon: '🐕', color: '#a6a6a6' },
  ]);

  // Handle click on map to position the active selected player
  const mapRef = useRef<HTMLDivElement>(null);
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Constrain coordinates within bounds
    const safeX = Math.max(20, Math.min(x, rect.width - 20));
    const safeY = Math.max(20, Math.min(y, rect.height - 20));

    if (selectedPlayer === 'p1') {
      setP1Coords({ x: safeX, y: safeY });
    } else {
      setP2Coords({ x: safeX, y: safeY });
    }
  };

  // Distance helper of spatial coordinates
  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  // Determine which monsters are in whose relevance bubbles
  const monstersInP1 = monsters.filter(m => getDistance(m.x, m.y, p1Coords.x, p1Coords.y) <= bubbleRadius);
  const monstersInP2 = monsters.filter(m => getDistance(m.x, m.y, p2Coords.x, p2Coords.y) <= bubbleRadius);

  // Combine arrays without duplication to get total replicated entities
  const allReplicatedMonsters = Array.from(new Set([...monstersInP1, ...monstersInP2]));
  const dormantMonstersCount = monsters.length - allReplicatedMonsters.length;

  // Bandwidth calculation: Each active replicated entity costs ~14.2 KB/s of tick transmissions
  const bandwidthCostPerEntity = 14.2; 
  const currentUploadBandwidth = allReplicatedMonsters.length * bandwidthCostPerEntity;
  const maxUnculledBandwidth = monsters.length * bandwidthCostPerEntity;
  const bandwidthSaved = maxUnculledBandwidth - currentUploadBandwidth;

  // Simulator 2: Authoritative RPC Combat Conveyor Belt
  const [latency, setLatency] = useState(60); // ms
  const [bIsRpcInTransit, setBIsRpcInTransit] = useState(false);
  const [rpcProgress, setRpcProgress] = useState(0); // 0 to 100
  const [rpcStatus, setRpcStatus] = useState<'idle' | 'client_predicting' | 'server_checking' | 'broadcasting' | 'complete'>('idle');
  const [actionSpeedMultiplier, setActionSpeedMultiplier] = useState(1);
  const [simulatedLog, setSimulatedLog] = useState<string[]>([]);

  const handleTriggerStrike = () => {
    if (bIsRpcInTransit) return;
    setBIsRpcInTransit(true);
    setRpcStatus('client_predicting');
    setSimulatedLog([
      `[Frame 0] Client inputs 'Furious Strike'.`,
      `[Frame 1] Visual prediction engine triggers instant sword swing & dust cloud (144 FPS).`,
      `[Frame 1] RPC payload 'Server_ExecuteStrike()' queued...`
    ]);

    let start: number | null = null;
    const duration = latency * 2.5; // slow down visually matching the latency sliders

    const animateRpc = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const pct = Math.min((progress / duration) * 100, 100);
      setRpcProgress(pct);

      if (pct < 33) {
        setRpcStatus('client_predicting');
      } else if (pct < 66) {
        setRpcStatus('server_checking');
        if (simulatedLog.length === 3) {
          setSimulatedLog(prev => [
            ...prev,
            `[Frame ${Math.round(latency/16)}] Packet hits Server. Entering verification pipeline.`,
            `[Verification Hook] Checking attack intervals. Weapon cooldown OK. (Speed scale: ${actionSpeedMultiplier}x)`,
            `[Verification Hook] Verifying coordinates: Distance is within target bounds. VALIDATED.`
          ]);
        }
      } else {
        setRpcStatus('broadcasting');
        if (simulatedLog.length === 6) {
          setSimulatedLog(prev => [
            ...prev,
            `[Server Action] Applying delta state reduction: Leshen health -240.`,
            `[Server Action] Packaging replication bundle: delta serialized.`,
            `[Broadcast] Pushing delta packets to Client #1 and Client #2 in background parallel queue.`
          ]);
        }
      }

      if (progress < duration) {
        requestAnimationFrame(animateRpc);
      } else {
        setRpcStatus('complete');
        setRpcProgress(100);
        setBIsRpcInTransit(false);
        setSimulatedLog(prev => [
          ...prev,
          `[Final Frame] Packets arrived on all clients. Server authoritative stencils verified. Client prediction reconciles with ZERO structural hitching!`
        ]);
      }
    };

    requestAnimationFrame(animateRpc);
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="Listen-Server & Co-op Network Optimization" 
        subtitle="Learn how to architect peer-to-peer / co-op multiplayer lobbies inspired by Baldur's Gate 3 and dynamic Witcher 3 world densities. Prevent host server load throttling via Relevance Bubbles, delta compression, and action speed verification checks."
      />

      <HighlightBox type="info" className="p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/15 rounded-lg text-purple-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Listen Server Bottleneck: The Host Is Also a Client</h4>
            <p className="text-kingfisher-muted text-xs leading-relaxed mt-0.5">
              Unlike headless Dedicated Servers, in <strong>Listen Server Multiplayer</strong> (couch co-op / peer-to-peer), the host player's machine runs the gameplay visuals, graphics context, audio threads, physics sweeps, AND replicates the entire world data to other players concurrently. 
              The hosting player's network upload bandwidth is very limited. If your engine replicates every enemy, barrel, and particle vector in a 450m radius, the host's upload thread will choke, leading to horrific rubber-banding and lag spikes. we solve this with <strong>Network Relevance Bubbles</strong>.
            </p>
          </div>
        </div>
      </HighlightBox>

      {/* HARDWARE IMPACT OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Host Upload Bandwidth Saved', value: `${(bandwidthSaved).toFixed(0)} KB/s`, sub: 'Active relevance culling', color: 'text-[#4da6ff]', icon: Wifi },
          { label: 'Dedicated Server Core CPU Limit', value: '< 6.2ms', sub: 'No unnecessary actor serializations', color: 'text-amber-400', icon: Cpu },
          { label: 'Network Client Prediction Delay', value: '0ms (Immediate)', sub: 'Local graphics ahead of confirmation', color: 'text-emerald-400', icon: Zap },
          { label: 'Hacking/Cheating Threat', value: 'Mitigated 100%', sub: 'Authoritative server validators', color: 'text-rose-400', icon: ShieldAlert },
        ].map((stat, i) => (
          <div key={i} className="bg-kingfisher-panel/60 border border-kingfisher-border/40 p-4 rounded-xl flex items-center gap-4">
            <div className="p-2 rounded-lg bg-black/20">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-kingfisher-muted font-bold">{stat.label}</div>
              <div className="text-lg font-mono font-bold text-white leading-tight">{stat.value}</div>
              <div className="text-[10px] text-kingfisher-muted/70">{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* UNREAL ENGINE MULTIPLAYER TOOLKIT ANALYSIS */}
      <SectionCard title="Unreal Engine Multiplayer Sync Capability Map" icon={Globe} color={COLORS.kingfisher.blue}>
        <p className="text-xs text-kingfisher-muted mb-4 -mt-2">
          Understanding the native tools Epic Games compiles to manage network synchronization, and what must be crafted from scratch:
        </p>
        <FeatureMatrix 
          has={[
            "UPROPERTY(Replicated) to mark specific variables for automatic periodic network tracking.",
            "Remote Procedure Calls (Server, Client, Multicast) directing tasks to specific target machines.",
            "Replication Dormancy (NetDormancy) to completely stop evaluating properties that haven't mutated."
          ]}
          missing={[
            "Native dynamic Listen Server network bubbles. Unreal's Relevance system handles dedicated servers easily but requires manual tuning of NetCullDistanceSquared on components inside co-op environments.",
            "Action Speed validation wrappers. To verify weapon speeds or attack velocity on servers, developers must code custom timestamp checkers behind RPC parameters manually.",
            "Out-of-the-box non-blocking co-op inventory UI sync (requires manual locked and unlocked state flags inside UMG grids)."
          ]}
          howToUse="Expose player inputs inside Server RPCs (`Server_MovePlayer(float DeltaSecs, FVector NewX)`). Put high-rate variables inside custom C++ Fast Array Serializers to transmit only array shifts rather than resending entire structs. Apply Dormancy states on static containers (chests, loot bags) immediately after they close to save connection loops."
        />
      </SectionCard>

      {/* QUICK LINK NAVIGATION PINS */}
      <div className="flex flex-wrap gap-2 mb-4 bg-kingfisher-panel/30 border border-kingfisher-border/40 p-2 rounded-xl">
        {[
          { id: 'relevance', label: '1. Spatial Relevance Bubbles', icon: Wifi },
          { id: 'rpc', label: '2. Authoritative RPCs & Verification', icon: Swords },
          { id: 'multiregion', label: '3. Predictive Rollback & Jitter', icon: Globe },
        ].map(btn => (
          <button
            key={btn.id}
            id={`btn-coop-${btn.id}`}
            onClick={() => setActiveSection(btn.id as any)}
            className={`flex items-center gap-2 text-xs py-2 px-3 rounded-lg border font-bold transition-all ${
              activeSection === btn.id
                ? 'bg-kingfisher-blue/20 border-kingfisher-blue text-white shadow-lg shadow-kingfisher-blue/5'
                : 'bg-black/30 border-transparent hover:bg-neutral-800 text-kingfisher-muted hover:text-white'
            }`}
          >
            <btn.icon className="w-3.5 h-3.5" />
            {btn.label}
          </button>
        ))}
      </div>

      {activeSection === 'relevance' && (
        <SectionCard id="spatial-relevance-bubbles" title="Simulator #1: Dynamic Spatial Network Relevance Bubbles" icon={Wifi} color={COLORS.kingfisher.blue}>
          <div className="space-y-6">
            <p className="text-xs text-kingfisher-muted leading-relaxed">
              Click on the map grid to move the selected player. Monsters that lie <strong>inside either player's circular relevance bubble</strong> are active on the network. They replicate stats (coordinates, spells, health) to clients, consuming upload bandwidth. Monsters <strong>outside</strong> both bubbles are put to sleep (Dormant), using exactly 0 KB/s of transmission bandwidth.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-black/25 p-5 rounded-2xl border border-kingfisher-border/50">
              {/* Left: Interactive Map */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex justify-between items-center bg-black/30 p-2.5 rounded-xl border border-kingfisher-border/30">
                  {/* Selector */}
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={() => setSelectedPlayer('p1')}
                      className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                        selectedPlayer === 'p1'
                          ? 'bg-[#4da6ff]/15 border-[#4da6ff] text-white'
                          : 'bg-black/30 border-transparent text-kingfisher-muted hover:text-white'
                      }`}
                    >
                      🔵 Control Player 1 (Host)
                    </button>
                    <button
                      onClick={() => setSelectedPlayer('p2')}
                      className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                        selectedPlayer === 'p2'
                          ? 'bg-[#df80ff]/15 border-[#df80ff] text-white'
                          : 'bg-black/30 border-transparent text-kingfisher-muted hover:text-white'
                      }`}
                    >
                      🟣 Control Player 2 (Client)
                    </button>
                  </div>

                  {/* Bubble Radius Slider */}
                  <div className="flex items-center gap-2 select-none">
                    <span className="text-[10px] text-kingfisher-muted font-bold text-right leading-none">CULL<br/>RADIUS</span>
                    <input 
                      type="range" 
                      min="80" 
                      max="180" 
                      value={bubbleRadius}
                      onChange={(e) => setBubbleRadius(Number(e.target.value))}
                      className="w-24 h-1 bg-kingfisher-border rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[11px] font-mono text-white">{bubbleRadius}m</span>
                  </div>
                </div>

                {/* Grid map Area */}
                <div 
                  ref={mapRef}
                  onClick={handleMapClick}
                  className="w-full h-80 bg-kingfisher-dark/80 rounded-2xl border border-kingfisher-border/40 relative overflow-hidden cursor-crosshair select-none"
                >
                  {/* Background Grid Pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1b263b_1px,transparent_1px),linear-gradient(to_bottom,#1b263b_1px,transparent_1px)] bg-[size:24px_24px] opacity-25" />

                  {/* Bubble Player 1 */}
                  <div 
                    className="absolute rounded-full bg-blue-500/5 border border-dashed border-[#4da6ff]/40 pointer-events-none transition-all duration-300"
                    style={{
                      width: bubbleRadius * 2,
                      height: bubbleRadius * 2,
                      left: p1Coords.x - bubbleRadius,
                      top: p1Coords.y - bubbleRadius,
                    }}
                  />

                  {/* Bubble Player 2 */}
                  <div 
                    className="absolute rounded-full bg-purple-500/5 border border-dashed border-[#df80ff]/40 pointer-events-none transition-all duration-300"
                    style={{
                      width: bubbleRadius * 2,
                      height: bubbleRadius * 2,
                      left: p2Coords.x - bubbleRadius,
                      top: p2Coords.y - bubbleRadius,
                    }}
                  />

                  {/* Monsters rendering */}
                  {monsters.map(monster => {
                    const isNearP1 = getDistance(monster.x, monster.y, p1Coords.x, p1Coords.y) <= bubbleRadius;
                    const isNearP2 = getDistance(monster.x, monster.y, p2Coords.x, p2Coords.y) <= bubbleRadius;
                    const isReplicated = isNearP1 || isNearP2;

                    return (
                      <div 
                        key={monster.id}
                        className="absolute p-2 rounded-xl flex flex-col items-center justify-center transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 select-none"
                        style={{
                          left: monster.x,
                          top: monster.y,
                        }}
                      >
                        <div 
                          className={`text-2xl p-1 bg-black/60 rounded-full border transition-all ${
                            isReplicated 
                              ? 'border-emerald-400 scale-110 shadow-lg' 
                              : 'border-transparent scale-90 opacity-40 grayscale'
                          }`}
                          title={monster.name}
                        >
                          {monster.icon}
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider mt-1 px-1.5 py-0.2 rounded font-mono ${
                          isReplicated ? 'bg-emerald-500/10 text-emerald-300' : 'bg-black/30 text-kingfisher-muted'
                        }`}>
                          {monster.name.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}

                  {/* Player 1 Node */}
                  <div 
                    className="absolute p-2 flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-150"
                    style={{ left: p1Coords.x, top: p1Coords.y }}
                  >
                    <div className="text-3xl p-1.5 bg-[#4da6ff]/20 border-2 border-[#4da6ff] rounded-full shadow-lg shadow-blue-500/20">
                      🛡️
                    </div>
                    <span className="text-[9px] font-bold bg-[#4da6ff] text-black px-1.5 py-0.5 rounded shadow mt-1 font-mono uppercase">
                      P1: Host
                    </span>
                  </div>

                  {/* Player 2 Node */}
                  <div 
                    className="absolute p-2 flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-150"
                    style={{ left: p2Coords.x, top: p2Coords.y }}
                  >
                    <div className="text-3xl p-1.5 bg-[#df80ff]/20 border-2 border-[#df80ff] rounded-full shadow-lg shadow-purple-500/20">
                      🧙‍♂️
                    </div>
                    <span className="text-[9px] font-bold bg-[#df80ff] text-black px-1.5 py-0.5 rounded shadow mt-1 font-mono uppercase">
                      P2: Client
                    </span>
                  </div>

                  {/* Overlay Instruction */}
                  <div className="absolute bottom-2 left-2 bg-black/75 px-3 py-1.5 border border-kingfisher-border/30 rounded-lg text-[10px] text-kingfisher-muted max-w-xs font-mono">
                    💡 Click anywhere inside maps to relocate selected player. Notice relevance state shifts...
                  </div>
                </div>
              </div>

              {/* Right: Bandwidth Telemetry */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                {/* Telemetry Panel */}
                <div className="p-4 bg-kingfisher-dark/80 rounded-2xl border border-kingfisher-border space-y-3">
                  <span className="text-[10px] font-bold text-kingfisher-muted uppercase tracking-widest block">
                    Active Replication Telemetry
                  </span>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1 border-b border-kingfisher-border/30">
                      <span className="text-xs text-kingfisher-muted">Replicated Entities:</span>
                      <strong className="text-sm font-mono text-[#ffd700]">{allReplicatedMonsters.length} / {monsters.length} Skeletons</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-kingfisher-border/30">
                      <span className="text-xs text-kingfisher-muted">Dormant Entities (Culled):</span>
                      <strong className="text-sm font-mono text-emerald-400">{dormantMonstersCount} Skeletons</strong>
                    </div>
                  </div>

                  {/* Bandwidth bar comparisons */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-rose-400 font-bold">Unculled Bandwidth:</span>
                      <span>{maxUnculledBandwidth.toFixed(1)} KB/s</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: '100%' }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-emerald-400 font-bold">Culled Bandwidth (Current):</span>
                      <span>{currentUploadBandwidth.toFixed(1)} KB/s</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(currentUploadBandwidth / maxUnculledBandwidth) * 100}%` }} />
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-1 text-emerald-400 font-mono">
                    <div className="text-xs font-bold uppercase">Bandwidth Saved</div>
                    <div className="text-2xl font-extrabold">{bandwidthSaved.toFixed(1)} KB/s</div>
                    <div className="text-[9px] opacity-80 leading-snug">
                      Prevented Host Upload buffer saturation, restoring ping back to baseline!
                    </div>
                  </div>
                </div>

                {/* Relevance rules description */}
                <div className="p-4 bg-black/40 rounded-xl border border-kingfisher-border/30 text-xs leading-relaxed space-y-1.5">
                  <strong className="text-white">Spatial Culling Rule (O(N) Scoping):</strong>
                  <p className="text-kingfisher-muted text-[11px]">
                    When Player #2 approaches, the Swamp Griffin slips inside their relevance circle. Server wakes the griffin from <code className="bg-black/50 text-[#ffd700] px-1 py-0.2 rounded">DORM_DormantAll</code> state, compiles static structures, and initiates delta updates. The player notices seamless spawning, while the host server upload bandwidth remains perfectly balanced!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {activeSection === 'rpc' && (
        <div className="space-y-6">
          <SectionCard id="network-qos" title="Simulator #2: Dedicated Server RPC Validation Pipeline" icon={Swords} color={COLORS.kingfisher.warm}>
            <div className="space-y-6">
              <p className="text-xs text-kingfisher-muted leading-relaxed">
                In co-op lobby designs, letting clients arbitrarily mutate state (e.g., claiming "My strike hit for 10,000 damage!") invites instant hacking. Combat must be <strong>fully authoritative</strong>: the client requests a strike, the server verifies action speeds, cooldowns, and coordinates, resolves the damage mathematical graphs, and broadcasts compressed delta stencils to remote clients. We use <strong>Client-Side Prediction & Interpolation</strong> to keep local reactions instant.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-black/25 p-5 rounded-2xl border border-kingfisher-border/50">
                {/* Left: Interactive knobs */}
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffd700] block">
                    Network Quality & Timing Parameters
                  </span>

                  {/* Latency Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-white">
                      <span>Ping / Latency to Host:</span>
                      <span className={`font-mono font-bold ${
                        latency < 60 ? 'text-emerald-400' : latency < 150 ? 'text-amber-400' : 'text-rose-500'
                      }`}>{latency} ms</span>
                    </div>
                    <input 
                      type="range" 
                      min="20" 
                      max="240" 
                      value={latency}
                      onChange={(e) => setLatency(Number(e.target.value))}
                      className="w-full h-1 bg-kingfisher-border rounded"
                    />
                    <div className="flex justify-between text-[9px] text-kingfisher-muted font-mono">
                      <span>20ms (LAN Co-Op)</span>
                      <span>240ms (Cross-Ocean)</span>
                    </div>
                  </div>

                  {/* Attack Speed Exploit Check knob */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-white">
                      <span>Client Action Speed hack:</span>
                      <span className={`font-mono font-bold ${actionSpeedMultiplier > 1 ? 'text-red-400 font-extrabold animate-pulse' : 'text-emerald-400'}`}>
                        {actionSpeedMultiplier === 1 ? 'OFF (Normal, 1.0x)' : `ON (Speedhacked, ${actionSpeedMultiplier}x)`}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setActionSpeedMultiplier(1.0); }}
                        className={`flex-1 text-[10.5px] p-2 rounded-lg font-bold border transition-all ${
                          actionSpeedMultiplier === 1.0
                            ? 'bg-emerald-500/20 border-emerald-500 text-white'
                            : 'bg-black/35 border-transparent text-kingfisher-muted hover:text-white'
                        }`}
                      >
                        Legit attack speed
                      </button>
                      <button
                        onClick={() => { setActionSpeedMultiplier(2.5); }}
                        className={`flex-1 text-[10.5px] p-2 rounded-lg font-bold border transition-all ${
                          actionSpeedMultiplier === 2.5
                            ? 'bg-rose-500/20 border-rose-500 text-white animate-pulse'
                            : 'bg-black/35 border-transparent text-kingfisher-muted hover:text-white'
                        }`}
                      >
                        Hack speed (2.5x)
                      </button>
                    </div>
                  </div>

                  {/* Trigger Button */}
                  <button
                    onClick={handleTriggerStrike}
                    disabled={bIsRpcInTransit}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-200 shadow-md flex items-center justify-center gap-2 ${
                      bIsRpcInTransit
                        ? 'bg-black/40 border border-kingfisher-border/30 text-kingfisher-muted cursor-not-allowed'
                        : 'bg-[#ffd700] hover:bg-yellow-400 text-black active:scale-98 cursor-pointer'
                    }`}
                  >
                    <Swords className="w-4 h-4" />
                    {bIsRpcInTransit ? 'Authorizing RPC Strike...' : 'Cast Authoritative Strike'}
                  </button>
                </div>

                {/* Right: Live Conveyor belt graphic path */}
                <div className="lg:col-span-7 flex flex-col justify-between border-l border-kingfisher-border/30 pl-0 lg:pl-6 space-y-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffd700] block mb-1">
                    RPC Packet Transmission Path & Client-Side Prediction
                  </span>

                  {/* Pipeline Conveyor Graphic */}
                  <div className="relative h-20 bg-kingfisher-dark/90 border border-kingfisher-border/30 rounded-2xl flex items-center justify-between px-6 overflow-hidden">
                    {/* Visual Connector Line */}
                    <div className="absolute left-16 right-16 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-500 via-amber-500 to-rose-500 opacity-30 select-none" />

                    {/* Animated Flying Packet Circle */}
                    {bIsRpcInTransit && (
                      <motion.div 
                        className="absolute w-4 h-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-500/60 z-10"
                        style={{ y: '-50%' }}
                        animate={{ 
                          left: `${rpcProgress}%`,
                          scale: [1, 1.3, 1],
                          boxShadow: ['0px 0px 4px rgba(253,224,71,0.5)', '0px 0px 15px rgba(253,224,71,0.8)', '0px 0px 4px rgba(253,224,71,0.5)']
                        }}
                        transition={{ duration: 0.1, ease: 'linear' }}
                      />
                    )}

                    {/* Step 1 Node */}
                    <div className="flex flex-col items-center z-10 text-center select-none">
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                        rpcStatus === 'client_predicting' ? 'bg-blue-500/30 border-blue-400' : 'bg-black/80 border-kingfisher-border'
                      }`}>
                        144
                      </div>
                      <span className="text-[9px] font-mono tracking-wider text-kingfisher-muted uppercase mt-1">Client Prep</span>
                    </div>

                    {/* Step 2 Node */}
                    <div className="flex flex-col items-center z-10 text-center select-none">
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                        rpcStatus === 'server_checking' ? 'bg-amber-500/30 border-amber-400' : 'bg-black/80 border-kingfisher-border'
                      }`}>
                        C++
                      </div>
                      <span className="text-[9px] font-mono tracking-wider text-kingfisher-muted uppercase mt-1">RPC Validate</span>
                    </div>

                    {/* Step 3 Node */}
                    <div className="flex flex-col items-center z-10 text-center select-none">
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                        rpcStatus === 'broadcasting' ? 'bg-rose-500/30 border-rose-400 animate-pulse' : 'bg-black/80 border-kingfisher-border'
                      }`}>
                        Sync
                      </div>
                      <span className="text-[9px] font-mono tracking-wider text-kingfisher-muted uppercase mt-1">Delta Diff</span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="p-3 bg-kingfisher-panel/80 border border-kingfisher-border/40 rounded-xl">
                    <div className="text-[10px] text-kingfisher-muted uppercase tracking-wider mb-2 font-mono">Telemetry Event Logs:</div>
                    <div className="font-mono text-[10.5px] max-h-36 overflow-y-auto custom-scrollbar space-y-1 text-emerald-300 pr-1 select-text">
                      {simulatedLog.map((log, index) => (
                        <div key={index} className="leading-snug">
                          <span className="text-kingfisher-muted/50 mr-1.5">•</span> {log}
                        </div>
                      ))}
                      {simulatedLog.length === 0 && (
                        <div className="text-center text-kingfisher-muted italic py-4">Click "Cast Authoritative Strike" to trigger RPC event tracer...</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* REPLICATION CODEBLOCK */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <CodeBlock code={`// GameplayAbilitySystem_ServerSide.cpp - Authoritative damage calculation inside fixed bounds
#include "CoreMinimal.h"
#include "Net/UnrealNetwork.h"

// Triggered by reliable RPC on client. Handled strictly serverauthoritatively.
void ABattleCharacter::Server_ExecuteStrike_Implementation(const FVector& HitCoordinate, uint32 TargetEntityID)
{
    // Step A: Anti-Cheat Action Speed threshold check
    float CurrentTimestamp = GetWorld()->GetTimeSeconds();
    float TimeDelta = CurrentTimestamp - LastStrikeRecordedTimestamp;
    
    // Check if player's attack is faster than weapon's mechanical cooling threshold (0.65 seconds)
    if (TimeDelta < 0.65f * 0.95f) // Allow 5% leeway for network latency jitter
    {
        UE_LOG(LogNetSecurity, Warning, TEXT("[Cheat Hook] Player triggered strike too quickly! Delta: %f"), TimeDelta);
        return; // Reject exploit action and drop mutation!
    }
    LastStrikeRecordedTimestamp = CurrentTimestamp;

    // Step B: Proximity trace verification
    AActor* TargetEntity = LookupSpawnedProxy(TargetEntityID);
    if (!TargetEntity) return;

    float DistanceToTarget = FVector::Dist(GetActorLocation(), TargetEntity->GetActorLocation());
    if (DistanceToTarget > 250.0f) // Max weapon range: 250 units (~2.5 meters)
    {
        UE_LOG(LogNetSecurity, Warning, TEXT("[Cheat Hook] Client strike beyond physical range! Dist: %f"), DistanceToTarget);
        return; // Reject hit
    }

    // Step C: Authority math pipeline calculations (Zero FP-drift fixed point math)
    int32 BaseDmgVal = CalculateBaseStrikeVal();
    int32 ReducedDmgVal = ApplyTargetMitigationShields(BaseDmgVal, TargetEntity);

    // Apply mutable values server-side
    TargetEntity->ApplyIncomingDamage(ReducedDmgVal);

    // Step D: Trigger dynamic multicast response representing the visual stencils
    Multicast_NotifyStrikeImpact(HitCoordinate, ReducedDmgVal);
}

// Validation Hook
bool ABattleCharacter::Server_ExecuteStrike_Validate(const FVector& HitCoordinate, uint32 TargetEntityID)
{
    // Sanity-check parameters inside the initial transport Layer to block memory overflow attacks
    if (HitCoordinate.ContainsNaN()) return false;
    return true;
}`} />
            </span>
          </div>
        </div>
      )}

      {activeSection === 'multiregion' && (
        <div id="coop-jitter-simulator" className="space-y-6">
          <HighlightBox type="success">
            <strong>Predictive Rollback Simulation:</strong> Under typical multi-region speeds (LAN compared to cross-ocean channels), packet jitter and losses can trigger desynchronized frames. Modern full-stack designs resolve desyncs by storing past player transforms inside historical cyclic ring queues. When the Server issues a verified state, the Client rewinds, corrects vectors, and ticks ahead dynamically, presenting zero visual hitches!
          </HighlightBox>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-black/25 p-5 rounded-2xl border border-kingfisher-border/50">
            {/* Left Hand: Controls */}
            <div className="lg:col-span-12 xl:col-span-5 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#4da6ff] block">
                Network Quality Inputs
              </span>

              {/* Ping Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white text-sans">
                  <span>Connection Ping (Latency):</span>
                  <span className={`font-mono font-bold ${mrMrPing > 150 ? 'text-rose-400' : mrMrPing > 70 ? 'text-amber-400' : 'text-emerald-400'}`}>{mrMrPing} ms</span>
                </div>
                <input 
                  type="range" min="20" max="350" value={mrMrPing} 
                  onChange={(e) => setMrMrPing(Number(e.target.value))}
                  className="w-full h-1 bg-kingfisher-border rounded"
                />
              </div>

              {/* Jitter Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white text-sans">
                  <span>Packet Jitter Variance:</span>
                  <span className={`font-mono font-bold ${mrMrJitter > 25 ? 'text-amber-400' : 'text-[#ffd700]'}`}>±{mrMrJitter} ms</span>
                </div>
                <input 
                  type="range" min="0" max="50" value={mrMrJitter} 
                  onChange={(e) => setMrMrJitter(Number(e.target.value))}
                  className="w-full h-1 bg-kingfisher-border rounded"
                />
              </div>

              {/* Packet Loss Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white text-sans">
                  <span>Packet Drop / Loss Rate:</span>
                  <span className={`font-mono font-bold ${mrMrLoss > 10 ? 'text-rose-400 font-extrabold shadow-sm' : mrMrLoss > 2 ? 'text-amber-400' : 'text-emerald-400'}`}>{mrMrLoss}%</span>
                </div>
                <input 
                  type="range" min="0" max="25" value={mrMrLoss} 
                  onChange={(e) => setMrMrLoss(Number(e.target.value))}
                  className="w-full h-1 bg-kingfisher-border rounded"
                />
              </div>

              {/* Client Prediction Toggle */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs text-sans text-kingfisher-muted">Reconciliation Strategy:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMrMrPrediction(true)}
                    className={`flex-1 text-[11px] p-2 rounded-lg font-bold border transition-all ${
                      mrMrPrediction ? 'bg-emerald-500/15 border-emerald-500 text-white' : 'bg-black/30 border-transparent text-kingfisher-muted'
                    }`}
                  >
                    Client Prediction & Rollback
                  </button>
                  <button
                    onClick={() => setMrMrPrediction(false)}
                    className={`flex-1 text-[11px] p-2 rounded-lg font-bold border transition-all ${
                      !mrMrPrediction ? 'bg-rose-500/15 border-rose-500 text-white' : 'bg-black/30 border-transparent text-kingfisher-muted'
                    }`}
                  >
                    Lock-Step (Wait for Server)
                  </button>
                </div>
              </div>

              {/* Inject Button */}
              <button
                onClick={() => {
                  if (isSimulatingLink) return;
                  setIsSimulatingLink(true);
                  setMrMrConsole([]);
                  const log = (m: string) => setMrMrConsole(prev => [...prev, m]);
                  
                  log(`[INIT] Simulating real-time inputs under ${mrMrPing}ms ping with ±${mrMrJitter}ms jitter variance...`);
                  setTimeout(() => {
                    log(`[CLIENT] Player triggers movement vectors. Local predicted position rendered instantly on client.`);
                  }, 300);

                  setTimeout(() => {
                    if (Math.random() * 100 < mrMrLoss) {
                      log(`[NETWORK] ⚠️ PACKET DROP DETECTED! Handshake update has failed to reach the Dedicated Server.`);
                      if (mrMrPrediction) {
                        log(`[CLIENT] Re-transmitting un-acknowledged inputs. Smooth frame extrapolations remain active.`);
                      } else {
                        log(`[CLIENT] 🛑 FREEZE! Movement halt triggered due to missing server confirmation tick.`);
                      }
                    } else {
                      log(`[SERVER] Key coordinates arrived with total latency ${mrMrPing + Math.round(Math.random() * mrMrJitter)}ms.`);
                      log(`[SERVER] Coordinates validation complete, registering state snapshot.`);
                    }
                  }, 800);

                  setTimeout(() => {
                    if (mrMrPrediction) {
                      const desyncGap = mrMrLoss > 5 || mrMrJitter > 20 ? (Math.random() * 14 + 4).toFixed(1) : '1.2';
                      if (mrMrLoss > 5 || mrMrJitter > 20) {
                        log(`[CLIENT] 🔄 Desync gap flagged: ${desyncGap}m. Running cyclic ring rollback...`);
                        log(`[CLIENT] ✅ Rollback success! Historical state corrected over 3 frames. Latency penalty sub-1ms CPU!`);
                      } else {
                        log(`[CLIENT] State delta is sub-threshold (${desyncGap}m). Smooth interpolation completed.`);
                      }
                    } else {
                      log(`[CLIENT] Server confirmation packet arrived. Vector coordinates snap applied.`);
                    }
                    setIsSimulatingLink(false);
                  }, 1500);
                }}
                disabled={isSimulatingLink}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 ${
                  isSimulatingLink ? 'bg-black/40 text-kingfisher-muted cursor-not-allowed' : 'bg-[#4da6ff] hover:bg-blue-400 text-black cursor-pointer'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                {isSimulatingLink ? 'Simulating Packets...' : 'Test Network Jitter Link'}
              </button>
            </div>

            {/* Right Hand: Hardware Telemetry Outputs */}
            <div className="lg:col-span-12 xl:col-span-7 flex flex-col justify-between border-l border-kingfisher-border/30 pl-0 xl:pl-6 space-y-4 mt-6 xl:mt-0">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffd700] block">
                Networked Hardware Budget Allocation & Latency Costs
              </span>

              {/* Outputs Matrix */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-kingfisher-dark/80 p-3 rounded-xl border border-kingfisher-border/30 text-center">
                  <span className="text-[10px] text-kingfisher-muted uppercase tracking-wider block font-bold">Rollback CPU Cost</span>
                  <div className="text-xl font-mono font-bold text-amber-400 mt-1">
                    {mrMrPrediction ? (0.15 + (mrMrLoss * 0.08) + (mrMrJitter * 0.01)).toFixed(2) + ' ms' : '0.01 ms'}
                  </div>
                  <span className="text-[9px] text-kingfisher-muted/60 mt-0.5 block leading-none">Main Thread slice cost</span>
                </div>

                <div className="bg-kingfisher-dark/80 p-3 rounded-xl border border-kingfisher-border/30 text-center">
                  <span className="text-[10px] text-kingfisher-muted uppercase tracking-wider block font-bold">Ring Buffer RAM</span>
                  <div className="text-xl font-mono font-bold text-pink-400 mt-1">
                    {(12 + mrMrPing * 0.05).toFixed(1)} MB
                  </div>
                  <span className="text-[9px] text-kingfisher-muted/60 mt-0.5 block leading-none">History snapshot buffer footprint</span>
                </div>

                <div className="bg-kingfisher-dark/80 p-3 rounded-xl border border-kingfisher-border/30 text-center">
                  <span className="text-[10px] text-kingfisher-muted uppercase tracking-wider block font-bold">Estimated Desync Rate</span>
                  <div className={`text-xl font-mono font-bold mt-1 ${mrMrLoss > 10 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {mrMrPrediction ? (mrMrLoss * 2.1 + mrMrJitter * 0.8).toFixed(1) + '%' : '0.0%'}
                  </div>
                  <span className="text-[9px] text-kingfisher-muted/60 mt-0.5 block leading-none">Probability of correction snaps</span>
                </div>

                <div className="bg-kingfisher-dark/80 p-3 rounded-xl border border-kingfisher-border/30 text-center">
                  <span className="text-[10px] text-kingfisher-muted uppercase tracking-wider block font-bold">Pacing Fluidity Index</span>
                  <div className={`text-xl font-mono font-bold mt-1 ${mrMrPrediction ? 'text-emerald-400 font-extrabold' : 'text-rose-500 font-bold'}`}>
                    {mrMrPrediction ? 'High (Fluid 144 FPS)' : mrMrPing > 150 ? 'Terrible (Micro-Stutters)' : 'Average'}
                  </div>
                  <span className="text-[9px] text-kingfisher-muted/60 mt-0.5 block leading-none">Frame stability feeling</span>
                </div>
              </div>

              {/* Real-time Logger Console */}
              <div className="p-3 bg-black/60 border border-kingfisher-border/30 rounded-xl">
                <div className="text-[10px] text-kingfisher-muted uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                  <span>Jitter Simulator Connection Shell</span>
                </div>
                <div className="font-mono text-[10.5px] max-h-36 overflow-y-auto custom-scrollbar space-y-1 text-blue-300 pr-1 select-text">
                  {mrMrConsole.map((log, index) => (
                    <div key={index} className="leading-snug">
                      <span className="text-kingfisher-muted/50 mr-1.5">&gt;</span> {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* C++ Snapshot ring buffer code block */}
          <SectionCard title="C++ Multi-Region Client Snapshot Ring Buffer Definition" icon={Code} color={COLORS.kingfisher.blue}>
            <p className="text-xs text-kingfisher-muted mb-3">
              To resolve network desynchronizations dynamically, both clients and servers maintain a running <strong>Historical Snapshot Ring Buffer</strong> storing past transform registers (X/Y coordinates, speed vectors, timestamps) mapped contiguous in memory.
            </p>
            <CodeBlock code={`// NetHistoryBuffer.h - Fixed-size cyclic snapshot memory rings for fast rollbacks
#pragma once
#include "CoreMinimal.h"

struct FPlayerTransformSnapshot
{
    float Timestamp;
    FVector Coordinates;
    FVector VelocityVector;
    uint32 InputFlagsBitmask;
};

class FNetSnapshotRingBuffer
{
private:
    static const int32 BUFFER_CAPACITY = 120; // Holds 120 frames (~1.0 sec at 120Hz)
    FPlayerTransformSnapshot Snapshots[BUFFER_CAPACITY];
    int32 HeadIndex = 0;

public:
    // Write new state to buffer in O(1) time
    void RecordSnapshot(float InTimestamp, const FVector& InCoords, const FVector& InVelocity, uint32 InInputFlags)
    {
        Snapshots[HeadIndex] = { InTimestamp, InCoords, InVelocity, InInputFlags };
        HeadIndex = (HeadIndex + 1) % BUFFER_CAPACITY; // Zero-malloc circular roll!
    }

    // Retrieve historical state matching exact target validation timestamp
    bool TryGetSnapshotAtTime(float TargetTime, FPlayerTransformSnapshot& OutSnapshot) const
    {
        float BestDelta = TNumericLimits<float>::Max();
        int32 MatchIndex = -1;

        for (int32 i = 0; i < BUFFER_CAPACITY; ++i)
        {
            float Delta = FMath::Abs(Snapshots[i].Timestamp - TargetTime);
            if (Delta < BestDelta)
            {
                BestDelta = Delta;
                MatchIndex = i;
            }
        }

        // Validate match limit (must be within 16ms of target stamp)
        if (MatchIndex != -1 && BestDelta < 0.016f)
        {
            OutSnapshot = Snapshots[MatchIndex];
            return true;
        }
        return false;
    }
};`} />
          </SectionCard>
        </div>
      )}
    </div>
  );
};
