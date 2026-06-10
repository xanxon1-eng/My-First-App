// Copyright XanXon Open World RPG. All Rights Reserved.
import React, { useState, useEffect, useRef } from 'react';
import { PageHeader, SectionCard, StatRow, CodeBlock, HighlightBox, FeatureMatrix } from './OptimizationHelpers';
import { 
  ShieldAlert, Zap, Cpu, Monitor, Database, HardDrive, Shield, 
  Layers, HelpCircle, Activity, Settings, EyeOff, Play, Pause, 
  RotateCcw, Sliders, CheckCircle, AlertTriangle 
} from 'lucide-react';
import { COLORS } from '../../../../constants/colors';

export const EquipmentPhysicsTab: React.FC = () => {
  // Simulator 1: Modular Assembly State
  const [optMode1, setOptMode1] = useState<'naive' | 'leader' | 'merge'>('leader');
  const [actorsCount1, setActorsCount1] = useState<number>(50);
  const [equippedSlots, setEquippedSlots] = useState({
    head: true,
    torso: true,
    shoulders: true,
    gauntlets: true,
    legs: true,
    boots: true,
    scabbard: true,
    weapon: true
  });

  // Simulator 2: Clothing Clipping State
  const [optMode2, setOptMode2] = useState<'none' | 'section' | 'mask' | 'psd'>('section');
  const [bendAngle, setBendAngle] = useState<number>(45); // 0 to 110 degrees

  // Simulator 3: Anim Dynamics State
  const [optMode3, setOptMode3] = useState<'chaos' | 'dynamics'>('dynamics');
  const [cameraDistance, setCameraDistance] = useState<number>(10); // 1 to 150 meters
  const [windStrength, setWindStrength] = useState<string>('gale'); // calm, breeze, gale, storm

  // Physics animation ref variables for Simulator 3
  const sim3CanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sim3StateRef = useRef({
    nodes: [
      { x: 150, y: 30, fx: true }, // Fixed pivot
      { x: 150, y: 75, vx: 0, vy: 0, m: 1.0 },
      { x: 150, y: 120, vx: 0, vy: 0, m: 1.0 },
      { x: 150, y: 165, vx: 0, vy: 0, m: 1.0 }
    ],
    time: 0,
    draggingIndex: -1
  });

  // UI interaction for dragging simulator nodes
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Handle active equipment toggle
  const toggleEquipmentSlot = (slot: keyof typeof equippedSlots) => {
    setEquippedSlots(prev => ({ ...prev, [slot]: !prev[slot] }));
  };

  // Run Physics Loop for Simulator 3 on canvas
  useEffect(() => {
    const canvas = sim3CanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const tick = () => {
      sim3StateRef.current.time += 0.05;
      const t = sim3StateRef.current.time;
      const nodes = sim3StateRef.current.nodes;

      // 1. Determine wind force based on UI state
      let windForce = 0;
      if (windStrength === 'breeze') {
        windForce = 1.2 * Math.sin(t * 1.5) + 0.4;
      } else if (windStrength === 'gale') {
        windForce = 4.5 * Math.sin(t * 2.5) + 2.0;
      } else if (windStrength === 'storm') {
        windForce = 12.0 * Math.sin(t * 4.0) + Math.cos(t * 8.0) * 3.5 + 4.0;
      }

      // 2. Determine tick rate or decimation based on Distance & Mode
      let shouldUpdate = true;
      let frameDecimation = 1; // 1 = update every frame, 2 = every 2nd frame, etc.

      if (optMode3 === 'dynamics') {
        if (cameraDistance > 60) {
          shouldUpdate = false; // Frozen (LOD Max)
        } else if (cameraDistance > 30) {
          frameDecimation = 4; // Tick update every 4th frame (15Hz update)
        } else if (cameraDistance > 15) {
          frameDecimation = 2; // Tick update every 2nd frame (30Hz update)
        }
      }

      const frameCount = Math.round(t / 0.05);

      // Perform Verlet/Simple Euler iteration if updating this frame
      if (shouldUpdate && (frameCount % frameDecimation === 0)) {
        // Physics constants
        const gravity = 0.5;
        const dt = 1.0;
        const springK = 0.15;
        const damping = 0.92;
        const restLength = 40;

        // Apply forces & update positions
        for (let i = 1; i < nodes.length; i++) {
          if (sim3StateRef.current.draggingIndex === i) continue;

          // Gravity forces
          let ax = windForce / nodes[i].m;
          let ay = gravity;

          // Spring forces from parent
          const p = nodes[i - 1];
          const currX = nodes[i].x;
          const currY = nodes[i].y;

          const dx = currX - p.x;
          const dy = currY - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 0.001) {
            const forceSpring = -springK * (distance - restLength);
            ax += (forceSpring * (dx / distance)) / nodes[i].m;
            ay += (forceSpring * (dy / distance)) / nodes[i].m;
          }

          // Spring forces from child if exists
          if (i < nodes.length - 1) {
            const c = nodes[i + 1];
            const cdx = currX - c.x;
            const cdy = currY - c.y;
            const cDistance = Math.sqrt(cdx * cdx + cdy * cdy);
            if (cDistance > 0.001) {
              const cForceSpring = -springK * (cDistance - restLength);
              ax += (cForceSpring * (cdx / cDistance)) / nodes[i].m;
              ay += (cForceSpring * (cdy / cDistance)) / nodes[i].m;
            }
          }

          // Update velocities and positions
          nodes[i].vx = (nodes[i].vx + ax) * damping;
          nodes[i].vy = (nodes[i].vy + ay) * damping;

          nodes[i].x += nodes[i].vx * dt;
          nodes[i].y += nodes[i].vy * dt;
        }
      }

      // 3. Clear canvas & Draw physical chain
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw wind indicators on background
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.08)';
      ctx.lineWidth = 2;
      for (let row = 1; row < 6; row++) {
        const speedOffset = (t * (windStrength === 'storm' ? 12 : windStrength === 'gale' ? 6 : 2)) % 60;
        ctx.beginPath();
        ctx.moveTo(10 + speedOffset, row * 35);
        ctx.lineTo(50 + speedOffset, row * 35);
        ctx.stroke();
      }

      // Draw anchor ceiling
      ctx.strokeStyle = '#2d3748';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(30, 20);
      ctx.lineTo(270, 20);
      ctx.stroke();

      // Draw connectors (spring lines)
      ctx.strokeStyle = !shouldUpdate ? '#4a5568' : (frameDecimation === 4 ? '#e2e8f0' : (frameDecimation === 2 ? '#63b3ed' : '#3182ce'));
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      for (let i = 1; i < nodes.length; i++) {
        ctx.lineTo(nodes[i].x, nodes[i].y);
      }
      ctx.stroke();

      // Draw nodes
      nodes.forEach((node, idx) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, idx === 0 ? 6 : 8, 0, 2 * Math.PI);
        if (idx === 0) {
          ctx.fillStyle = '#4a5568';
        } else {
          ctx.fillStyle = !shouldUpdate 
            ? '#a0aec0' 
            : (sim3StateRef.current.draggingIndex === idx 
              ? '#f6e05e' 
              : (frameDecimation === 4 ? '#ecc94b' : (frameDecimation === 2 ? '#4299e1' : '#3182ce')));
        }
        ctx.fill();
        ctx.strokeStyle = '#1a202c';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Node index text for clear debugging
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '8px monospace';
        ctx.fillText(`J${idx}`, node.x + 12, node.y + 3);
      });

      // Overlay status indicator text onto canvas
      ctx.fillStyle = '#718096';
      ctx.font = '9px monospace';
      ctx.fillText(`LOD Mode: ${!shouldUpdate ? 'Frozen (LOD Max)' : `Unreal Decimation (1/${frameDecimation} frames)`}`, 15, canvas.height - 25);
      ctx.fillText(`Solver Update: ${!shouldUpdate ? 'CULL' : `${Math.round(60 / frameDecimation)} Hz`}`, 15, canvas.height - 12);

      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => cancelAnimationFrame(animId);
  }, [optMode3, cameraDistance, windStrength]);

  // Handle canvas mouse dragging to interact with spring physics
  const handleSim3MouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = sim3CanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Detect if we clicked any joints
    const nodes = sim3StateRef.current.nodes;
    for (let i = 1; i < nodes.length; i++) {
      const dx = nodes[i].x - mx;
      const dy = nodes[i].y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 12) {
        sim3StateRef.current.draggingIndex = i;
        break;
      }
    }
  };

  const handleSim3MouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const dragIdx = sim3StateRef.current.draggingIndex;
    if (dragIdx === -1) return;
    const canvas = sim3CanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    sim3StateRef.current.nodes[dragIdx].x = e.clientX - rect.left;
    sim3StateRef.current.nodes[dragIdx].y = e.clientY - rect.top;
  };

  const handleSim3MouseUp = () => {
    sim3StateRef.current.draggingIndex = -1;
  };

  const activeSlotsCount = Object.values(equippedSlots).filter(Boolean).length;

  // Simulator Metrics calculations
  const calculateModularMetrics = () => {
    let cpuCode = 0;
    let drawCalls = 0;
    let ramUsage = 0;
    let vramUsage = 0;
    let pciOverhead = 0; // ms

    if (optMode1 === 'naive') {
      // Each slot has fully active skeletal component ticks
      cpuCode = 0.24 * activeSlotsCount * actorsCount1;
      drawCalls = activeSlotsCount * actorsCount1;
      ramUsage = 1.8 * activeSlotsCount * actorsCount1 + 32; // KB per actor
      vramUsage = 8.5 * activeSlotsCount * actorsCount1 + 120; // VRAM skeletal cache rows
      pciOverhead = 0.08 * activeSlotsCount * actorsCount1;
    } else if (optMode1 === 'leader') {
      // Child elements follow direct leader, culling standalone skeletal ticks
      cpuCode = 0.16 * actorsCount1 + 0.01 * activeSlotsCount * actorsCount1;
      drawCalls = activeSlotsCount * actorsCount1; // Still individual draw tasks unless combined
      ramUsage = 0.4 * activeSlotsCount * actorsCount1 + 15;
      vramUsage = 3.2 * activeSlotsCount * actorsCount1 + 60;
      pciOverhead = 0.02 * activeSlotsCount * actorsCount1;
    } else {
      // Skeletal Merge: Fused in unified draw loops
      cpuCode = 0.11 * actorsCount1;
      drawCalls = 1 * actorsCount1; // Exactly 1 draw call per actor!
      ramUsage = 0.6 * activeSlotsCount * actorsCount1 + 45; // Merged asset allocates slightly more stack on swap
      vramUsage = 2.1 * activeSlotsCount * actorsCount1 + 40;
      pciOverhead = 0.005 * actorsCount1;
    }

    return {
      cpuMs: cpuCode.toFixed(2),
      drawCalls: Math.round(drawCalls),
      ramMb: (ramUsage / 10).toFixed(1),
      vramMb: (vramUsage / 10).toFixed(1),
      latencyMs: (pciOverhead + cpuCode * 0.15).toFixed(2)
    };
  };

  const metrics1 = calculateModularMetrics();

  // Dynamic physics metrics for clipping simulator
  const calculateClippingMetrics = () => {
    let cpuMs = 0;
    let gpuMs = 0;
    let vramMb = 0;
    let clippingIndex = 0; // 0 = Clean, 1 = Minimal, 2 = Severe Visual Glitch

    // Simulate 100 character items
    if (optMode2 === 'none') {
      cpuMs = 14.5; // Running real-time mesh physical overlaps triggers synchronous line traces
      gpuMs = 4.2; // Extra vertex operations and pixel z-shading rejects
      vramMb = 85.0; // High body geometry loaded underclothes
      clippingIndex = bendAngle > 25 ? 2 : (bendAngle > 10 ? 1 : 0);
    } else if (optMode2 === 'section') {
      cpuMs = 0.0; // Standard O(1) visibility toggles (zero sweeps)
      gpuMs = 1.1; // Mesh sections culled (fewer dynamic drawing pixels)
      vramMb = 48.0; // Inactive mesh blocks stripped from GPU skinned buffers
      clippingIndex = 0;
    } else if (optMode2 === 'mask') {
      cpuMs = 0.02; // Minor uniform shader parameters lookup
      gpuMs = 1.4; // Pixel alpha discarding overdraw has slight impact
      vramMb = 55.0;
      clippingIndex = 0;
    } else {
      cpuMs = 0.35; // Morph target blends evaluation on anim thread
      gpuMs = 2.1; // Normal vertex deformation sweeps on GPU vertex engine
      vramMb = 65.0;
      clippingIndex = 0;
    }

    return {
      cpuMs,
      gpuMs,
      vramMb,
      clippingIndex
    };
  };

  const metrics2 = calculateClippingMetrics();

  // Dynamic physics metrics for joint simulator
  const calculateDynamicsMetrics = () => {
    let cpuMs = 0;
    let activeHz = 60;
    let stateStyle = 'text-emerald-400';

    if (optMode3 === 'chaos') {
      cpuMs = 18.2; // Complex multi-tris collision sweeps
      activeHz = 60;
      stateStyle = 'text-red-400 font-bold';
    } else {
      if (cameraDistance > 60) {
        cpuMs = 0.01;
        activeHz = 0;
        stateStyle = 'text-gray-500';
      } else if (cameraDistance > 30) {
        cpuMs = 0.15;
        activeHz = 15;
        stateStyle = 'text-yellow-400';
      } else if (cameraDistance > 15) {
        cpuMs = 0.28;
        activeHz = 30;
        stateStyle = 'text-blue-400';
      } else {
        cpuMs = 0.42;
        activeHz = 60;
        stateStyle = 'text-emerald-400';
      }
    }

    return {
      cpuMs,
      activeHz,
      stateStyle
    };
  };

  const metrics3 = calculateDynamicsMetrics();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="3D Equipment, Clothing & Weapon Physics" 
        subtitle="Optimizing multi-piece armor assemblies, dynamic cloth solvers, and rigid-body sways without skeletal mesh clipping or performance overload." 
      />

      <HighlightBox type="success" className="my-2">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Architectural Best Practice</strong>
        </div>
        <p className="text-emerald-100/90 text-sm leading-relaxed">
          For RPGs inspired by <em>The Witcher 3</em>, <em>Baldur's Gate 3</em>, and <em>Path of Exile</em>, modular armor swapping is a massive performance threat. Swapping raw individual component ticks to a unified <strong>Leader Pose Component</strong> shares skinned joint calculation pools, while <strong>Mesh Section Invisibility</strong> or <strong>Vertex Opacity Masking</strong> completely eliminates underlying body clipping at 0.0ms GPU cost. For physics sways, running localized <strong>Anim Dynamics</strong> inside Anim Graphs replaces expensive global world physics collisions with lightweight parallel spring solvers.
        </p>
      </HighlightBox>

      {/* SECTION 1: Modular Skeletal Assemblies & Leader Pose Component */}
      <div id="equipment-skeletal-mesh-overhead" className="scroll-mt-24">
        <SectionCard title="1. 3D Equipment & Modular Skeletal Assemblies" icon={Cpu} color={COLORS.kingfisher.blue}>
          <div className="space-y-4">
            <p className="text-kingfisher-muted text-sm leading-relaxed">
              When a character equips separate head, neck, shoulder, chest, glove, leg, boot, weapon, and shield pieces, instantiating these as individual <code>USkeletalMeshComponent</code> blocks is catastrophic. Doing so scales Game Thread skeleton evaluation cost linearly, locking up CPU cores. Bypassing this bottleneck requires sharing skinned state caches or executing runtime skeletal merges into a single vertex draw.
            </p>

            {/* HARDAWRE METRIC DEEP ANALYSIS */}
            <div className="p-4 bg-black/40 rounded-xl border border-kingfisher-border/30 space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider text-kingfisher-blue">Hardcore RPG Hardware Budgets Impact Evaluated</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <div className="text-[9px] uppercase font-bold text-kingfisher-muted/80">CPU Impact</div>
                  <div className="text-sm font-mono font-bold text-emerald-400">-{metrics1.cpuMs} ms</div>
                  <div className="text-[9px] text-kingfisher-muted">Skel Joint Ticks</div>
                </div>
                <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <div className="text-[9px] uppercase font-bold text-kingfisher-muted/80">GPU Draw Calls</div>
                  <div className="text-sm font-mono font-bold text-blue-400">{metrics1.drawCalls} calls</div>
                  <div className="text-[9px] text-kingfisher-muted">PCIe State Binds</div>
                </div>
                <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <div className="text-[9px] uppercase font-bold text-kingfisher-muted/80">System RAM</div>
                  <div className="text-sm font-mono font-bold text-purple-400">+{metrics1.ramMb} MB</div>
                  <div className="text-[9px] text-kingfisher-muted">UObject Pointers</div>
                </div>
                <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <div className="text-[9px] uppercase font-bold text-kingfisher-muted/80">VRAM Footprint</div>
                  <div className="text-sm font-mono font-bold text-pink-400">~{metrics1.vramMb} MB</div>
                  <div className="text-[9px] text-kingfisher-muted">Dynamic Bone Matrix</div>
                </div>
                <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <div className="text-[9px] uppercase font-bold text-kingfisher-muted/80">Latency / Jitter</div>
                  <div className="text-sm font-mono font-bold text-amber-500">+{metrics1.latencyMs} ms</div>
                  <div className="text-[9px] text-kingfisher-muted">Render Thread Sync</div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE WORKLOAD SIMULATOR */}
            <div className="bg-kingfisher-panel/40 border border-kingfisher-border/50 p-5 rounded-xl space-y-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                <div>
                  <h4 className="text-white font-bold text-sm flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-kingfisher-blue" />
                    Interactive Modular Skinned Assembly Mesh Simulator
                  </h4>
                  <p className="text-xs text-kingfisher-muted">Simulate joint sweep ticks and draw calls on a high-density target matching PC or PS5/XSX baseline configurations.</p>
                </div>
                <div className="flex gap-1.5 self-end lg:self-auto">
                  <button
                    onClick={() => setOptMode1('naive')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${optMode1 === 'naive' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-black/30 text-kingfisher-muted border border-transparent hover:text-white'}`}
                  >
                    Naive Tickers
                  </button>
                  <button
                    onClick={() => setOptMode1('leader')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${optMode1 === 'leader' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-black/30 text-kingfisher-muted border border-transparent hover:text-white'}`}
                  >
                    Leader Pose [Shared Tick]
                  </button>
                  <button
                    onClick={() => setOptMode1('merge')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${optMode1 === 'merge' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-black/30 text-kingfisher-muted border border-transparent hover:text-white'}`}
                  >
                    Dynamic Skeletal Merge
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 bg-black/40 p-4 rounded-xl border border-kingfisher-border/30">
                {/* Configuration Panel */}
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <label className="text-white text-xs font-bold block mb-1 flex justify-between">
                      <span>Simulated On-Screen Skeletal Entities</span>
                      <span className="text-kingfisher-blue font-mono">{actorsCount1} Actors</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="150"
                      value={actorsCount1}
                      onChange={(e) => setActorsCount1(parseInt(e.target.value))}
                      className="w-full accent-kingfisher-blue"
                    />
                  </div>

                  <div>
                    <span className="text-white text-xs font-bold block mb-2">Equipped Multi-Piece Armor Layers</span>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(equippedSlots).map((slot) => (
                        <button
                          key={slot}
                          onClick={() => toggleEquipmentSlot(slot as keyof typeof equippedSlots)}
                          className={`flex items-center justify-between p-2 rounded-lg text-xs border text-left capitalize transition-all ${equippedSlots[slot as keyof typeof equippedSlots] ? 'bg-kingfisher-blue/15 border-kingfisher-blue/40 text-blue-200' : 'bg-black/30 border-white/5 text-kingfisher-muted'}`}
                        >
                          <span>{slot}</span>
                          <span className={equippedSlots[slot as keyof typeof equippedSlots] ? 'text-emerald-400 text-[9px]' : 'text-zinc-500 text-[9px]'}>
                            {equippedSlots[slot as keyof typeof equippedSlots] ? 'Equipped' : 'Dormant'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Simulated Wireframe Display */}
                <div className="lg:col-span-7 flex flex-col justify-between border-l border-kingfisher-border/30 pl-0 lg:pl-5">
                  <div className="grid grid-cols-2 gap-3 mb-2 flex-1">
                    <div className="p-3 bg-black/40 rounded-lg border border-white/5 flex flex-col justify-center">
                      <span className="text-[10px] text-kingfisher-muted uppercase tracking-wider block">Game Thread Skeletons Evaluation</span>
                      <strong className={`text-xl font-mono ${parseFloat(metrics1.cpuMs) > 10 ? 'text-red-400' : parseFloat(metrics1.cpuMs) > 4 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {metrics1.cpuMs}ms
                      </strong>
                      <span className="text-[9px] text-kingfisher-muted leading-tight mt-1">
                        {optMode1 === 'naive' && '⚠️ 8 distinct matrix calculations loops evaluated sequentially.'}
                        {optMode1 === 'leader' && '✅ Child ticks frozen. Matrix buffers read from leader body.'}
                        {optMode1 === 'merge' && '🔥 Single draw block parsed in continuous memory bounds.'}
                      </span>
                    </div>

                    <div className="p-3 bg-black/40 rounded-lg border border-white/5 flex flex-col justify-center">
                      <span className="text-[10px] text-kingfisher-muted uppercase tracking-wider block">Render Command Draw Calls</span>
                      <strong className={`text-xl font-mono ${metrics1.drawCalls > 300 ? 'text-red-400' : metrics1.drawCalls > 100 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {metrics1.drawCalls} dispatches
                      </strong>
                      <span className="text-[9px] text-kingfisher-muted leading-tight mt-1">
                        {optMode1 === 'naive' && `${activeSlotsCount} individual calls dispatched per skeletal character.`}
                        {optMode1 === 'leader' && 'Separate material offsets still bound individually on mesh nodes.'}
                        {optMode1 === 'merge' && '1 single direct skeletal draw dispatched. Ideal pipeline state!'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-black/60 rounded-xl border border-kingfisher-border/40 text-xs font-mono space-y-1">
                    <div className="text-zinc-400 text-[10px] uppercase font-bold border-b border-kingfisher-border/30 pb-0.5 mb-1 text-kingfisher-blue">Live Telemetry Diagnostics Console</div>
                    <div className="flex justify-between flex-wrap gap-2 text-[11px]">
                      <span>Mesh Bounds Check: <strong className={optMode1 === 'naive' ? 'text-red-400' : 'text-emerald-400'}>{optMode1 === 'naive' ? 'Separate Overlaps' : 'Bypassed Parent'}</strong></span>
                      <span>Skinned Verts Calc: <strong className="text-white">{actorsCount1 * activeSlotsCount * 850} rows</strong></span>
                      <span>Pipeline Flow: <strong className={parseFloat(metrics1.cpuMs) > 10 ? 'text-red-400' : 'text-emerald-400'}>{parseFloat(metrics1.cpuMs) > 10 ? 'CPU Throttling Render Thread' : 'Dynamic Saturated'}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* THEORETICAL EXPANSION AND UE EVALUATION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 rounded-xl border border-kingfisher-border/40">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider text-blue-400 mb-2">The Architecture Demystified</h4>
                <ul className="space-y-2 text-xs text-kingfisher-muted leading-relaxed">
                  <li>
                    <strong className="text-white">The Naive Approach (Individual Components):</strong> Eight separate mesh segments ticking independently. This generates over <span className="text-red-400">14.2ms CPU time</span> for 50 active on-screen actors as the Render Thread triggers individual draw dispatches, stalling the hardware pipelines.
                  </li>
                  <li>
                    <strong className="text-white">The Leader Pose Component Solution:</strong> Keeps child equipment meshes (such as boots, gauntlets, and coats) attached to the main Body Mesh skeleton, but strips their independent tickers. Children read the final transform cache of the Main Body skeleton directly, completely skipping duplicate skeletal sweeps. Slices Game CPU to <span className="text-emerald-400">1.1ms</span>!
                  </li>
                  <li>
                    <strong className="text-white">Runtime Skeletal Mesh Merging:</strong> Combines multiple mesh layouts into a unified raw mesh vertex list. One dynamic Skeletal Mesh triggers exactly one draw call. Optimizes GPU rasterizer fillrate but adds a slight CPU hitch on the moment of item swap.
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-black/40 rounded-xl border border-kingfisher-border/40">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider text-amber-400 mb-2">Unreal Engine Feature Grid</h4>
                <FeatureMatrix 
                  has={[
                    "SetLeaderPoseComponent (formerly SetMasterPoseComponent) ensuring sub-mesh joint arrays replicate leader bones instantly.",
                    "FSkeletalMeshMerge API to programmatically merge bones, vertices, and material channels into a standalone asset in memory.",
                    "Skeletal Mesh merging utility library out-of-the-box (C++ and Blueprints support)."
                  ]}
                  missing={[
                    "Real-time material dynamic atlasing/baking on the Game Thread without causing a noticeable frame-freeze.",
                    "Automated skin-weight bone reductions when fusing non-matching skeletal rigs dynamically."
                  ]}
                  howToUse="Implement SetLeaderPoseComponent in C++ inside your Character constructor. The Body Mesh acts as parent, and armor pieces act as children with bUseAttachParentBound = true. For ambient citizens/crowds, utilize the FSkeletalMeshMerge API at runtime to build unified assets, stripping the structural UObject component overhead completely."
                />
              </div>
            </div>

            <h5 className="text-white font-bold text-sm mt-4 mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4 text-kingfisher-blue" />
              C++ High-Performance Character Equipment Constructor
            </h5>
            <CodeBlock language="cpp" code={`// Copyright XanXon Open World RPG. All Rights Reserved.
#include "ModularCharacter.h"
#include "Components/SkeletalMeshComponent.h"
#include "SkeletalMeshMerge.h"

AModularCharacter::AModularCharacter()
{
    PrimaryActorTick.bCanEverTick = true;

    // 1. Establish the Main Body Mesh as the Master/Leader Pose holder
    LeaderBodyMesh = GetMesh();
    LeaderBodyMesh->SetGenerateOverlapEvents(true);
    LeaderBodyMesh->SetCollisionProfileName(TEXT("CharacterMesh"));

    // 2. Initialize modular equipment sockets
    TorsoArmorMesh = CreateDefaultSubobject<USkeletalMeshComponent>(TEXT("TorsoArmorMesh"));
    TorsoArmorMesh->SetupAttachment(LeaderBodyMesh);
    
    BootsMesh = CreateDefaultSubobject<USkeletalMeshComponent>(TEXT("BootsMesh"));
    BootsMesh->SetupAttachment(LeaderBodyMesh);

    // 3. CRITICAL OPTIMIZATION: Attach bounds to Parent to skip bounding box evaluations
    TorsoArmorMesh->bUseAttachParentBound = true;
    BootsMesh->bUseAttachParentBound = true;
}

void AModularCharacter::EquipArmorModule(USkeletalMesh* NewArmorMesh, EEquipSlot Slot)
{
    USkeletalMeshComponent* TargetComp = nullptr;
    switch (Slot)
    {
        case EEquipSlot::Torso:  TargetComp = TorsoArmorMesh; break;
        case EEquipSlot::Boots:  TargetComp = BootsMesh;      break;
        default: break;
    }

    if (TargetComp && NewArmorMesh)
    {
        TargetComp->SetSkeletalMesh(NewArmorMesh);
        
        // 4. Force Child Mesh to evaluate animations straight from Leader's cached matrices
        // Completely disables redundant independent bone-ticks on child meshes! (Saves -12.1ms CPU across crowd)
        TargetComp->SetLeaderPoseComponent(LeaderBodyMesh);
        
        // Disable individual tick evaluation explicitly
        TargetComp->SetComponentTickEnabled(false);
    }
}`} />
          </div>
        </SectionCard>
      </div>

      {/* SECTION 2: Dynamic Cloth Mechanics & Collision Masking */}
      <div id="clothing-clipping-prevention" className="scroll-mt-24">
        <SectionCard title="2. 3D Dynamic Cloth Mechanics & Collision Masking (Clipping Guard)" icon={Shield} color={COLORS.kingfisher.warm}>
          <div className="space-y-4">
            <p className="text-kingfisher-muted text-sm leading-relaxed">
              Long coats, boots, and capes inevitably slide beneath underlying body geometry during wide combat strides, producing distracting clipping. Standard real-time collision sweeping is incredibly slow. Instead, use the industry-standard <strong>Modular Body Hiding (Section opacity masking)</strong> technique: dynamically disabling the visibility of skin sections hidden by equipped items.
            </p>

            {/* HARDAWRE METRIC DEEP ANALYSIS */}
            <div className="p-4 bg-black/40 rounded-xl border border-kingfisher-border/30 space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider text-kingfisher-warm">Pre-baked Clipping-Guard Hardware Footprint</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <div className="text-[9px] uppercase font-bold text-kingfisher-muted/80">CPU Impact</div>
                  <div className="text-sm font-mono font-bold text-emerald-400">-{metrics2.cpuMs} ms</div>
                  <div className="text-[9px] text-kingfisher-muted">No Collision Solves</div>
                </div>
                <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <div className="text-[9px] uppercase font-bold text-kingfisher-muted/80">GPU Base Pass</div>
                  <div className="text-sm font-mono font-bold text-blue-400">{metrics2.gpuMs} ms</div>
                  <div className="text-[9px] text-kingfisher-muted">Pixel Shader Rejections</div>
                </div>
                <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <div className="text-[9px] uppercase font-bold text-kingfisher-muted/80">System RAM</div>
                  <div className="text-sm font-mono font-bold text-purple-400">+4.1 MB</div>
                  <div className="text-[9px] text-kingfisher-muted">Skelet Bone Curve</div>
                </div>
                <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <div className="text-[9px] uppercase font-bold text-kingfisher-muted/80">VRAM Allocation</div>
                  <div className="text-sm font-mono font-bold text-pink-400">{metrics2.vramMb} MB</div>
                  <div className="text-[9px] text-kingfisher-muted">Fewer Skinned Triangles</div>
                </div>
                <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <div className="text-[9px] uppercase font-bold text-kingfisher-muted/80">Latency / Jitter</div>
                  <div className="text-sm font-mono font-bold text-emerald-400">0.00 ms</div>
                  <div className="text-[9px] text-kingfisher-muted">Purely Client-Side visual</div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE WORKLOAD SIMULATOR */}
            <div className="bg-kingfisher-panel/40 border border-kingfisher-border/50 p-5 rounded-xl space-y-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                <div>
                  <h4 className="text-white font-bold text-sm flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-kingfisher-warm" />
                    Interactive Leg joint Flexion & Armor Clipping Guard Simulator
                  </h4>
                  <p className="text-xs text-kingfisher-muted">Flex leg limb bone rotation vectors in real-time. Compare unoptimized raw clipping states against high-performance masking workarounds.</p>
                </div>
                <div className="flex gap-1.5 self-end lg:self-auto">
                  <button
                    onClick={() => setOptMode2('none')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${optMode2 === 'none' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-black/30 text-kingfisher-muted border border-transparent hover:text-white'}`}
                  >
                    No Guard (Severe Clipping)
                  </button>
                  <button
                    onClick={() => setOptMode2('section')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${optMode2 === 'section' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-black/30 text-kingfisher-muted border border-transparent hover:text-white'}`}
                  >
                    Section Invisibility [O(1) C++]
                  </button>
                  <button
                    onClick={() => setOptMode2('mask')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${optMode2 === 'mask' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-black/30 text-kingfisher-muted border border-transparent hover:text-white'}`}
                  >
                    Vertex Alpha Mask shader
                  </button>
                  <button
                    onClick={() => setOptMode2('psd')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${optMode2 === 'psd' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-black/30 text-kingfisher-muted border border-transparent hover:text-white'}`}
                  >
                    Corrective Morph target
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 bg-black/40 p-4 rounded-xl border border-kingfisher-border/30">
                {/* Configuration Panel */}
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <label className="text-white text-xs font-bold block mb-1 flex justify-between">
                      <span>Limb Flexion Rotation Angle</span>
                      <span className="text-kingfisher-warm font-mono">{bendAngle}° Range</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="110"
                      value={bendAngle}
                      onChange={(e) => setBendAngle(parseInt(e.target.value))}
                      className="w-full accent-kingfisher-warm"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                      <span>0° (Standing)</span>
                      <span>55° (Jogging)</span>
                      <span>110° (Deep Bow/Combat stride)</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-black/30 border border-white/5 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-kingfisher-warm block">Simulation Assessment</span>
                    {optMode2 === 'none' && (
                      <div className="space-y-1.5 text-xs text-red-300">
                        <p className="flex items-center gap-1.5 font-bold"><AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" /> CLIPPING WARNING!</p>
                        <p className="text-kingfisher-muted text-[11px] leading-tight">Without masking guards, the inner muscle body skin pierces through the armored boot geometry. Running real-time dynamic collision sweeps consumes <span className="text-red-400 font-bold">14.5ms CPU</span>, stalling processing budgets.</p>
                      </div>
                    )}
                    {optMode2 === 'section' && (
                      <div className="space-y-1.5 text-xs text-emerald-300">
                        <p className="flex items-center gap-1.5 font-bold"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> SEC-INVISIBILITY ON</p>
                        <p className="text-kingfisher-muted text-[11px] leading-tight">Lower leg skin material indices are flagged invisible in C++. Culled completely before the base pass. Consumes exactly <span className="text-emerald-400 font-bold">0.0ms CPU</span> and eliminates visual overlap glitches.</p>
                      </div>
                    )}
                    {optMode2 === 'mask' && (
                      <div className="space-y-1.5 text-xs text-blue-300">
                        <p className="flex items-center gap-1.5 font-bold"><CheckCircle className="w-3.5 h-3.5 text-blue-400" /> VERTEX OPACITY MASK ON</p>
                        <p className="text-kingfisher-muted text-[11px] leading-tight">A pre-painted alpha channel inside the master material turns skin transparent beneath the boot collar. Smooth visual blending on the joint with minimal shader overhead.</p>
                      </div>
                    )}
                    {optMode2 === 'psd' && (
                      <div className="space-y-1.5 text-xs text-purple-300">
                        <p className="flex items-center gap-1.5 font-bold"><CheckCircle className="w-3.5 h-3.5 text-purple-400" /> POSE SPACE DEFORMATION ACTIVE</p>
                        <p className="text-kingfisher-muted text-[11px] leading-tight">As the joint angle increases, corrective morph shapes are fired in the AnimGraph. Armored boot vertices expand outward dynamically, maintaining a perfect clearance envelope.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Simulated Wireframe Display */}
                <div className="lg:col-span-7 flex flex-col items-center justify-center p-3 bg-black/60 rounded-xl relative min-h-[220px]">
                  {/* Top-down leg joint projection on 2D vectors block */}
                  <div className="w-full flex justify-between absolute top-2 px-3 text-[10px] text-zinc-500 font-mono">
                    <span>LEG ROT RECORD EXPORT</span>
                    <span>{metrics2.clippingIndex === 2 ? '⚠️ CLIPPING DETECTED' : '✅ COLLISION IMMUNE'}</span>
                  </div>

                  <svg viewBox="0 0 300 180" className="w-full max-w-[340px] drop-shadow-lg">
                    {/* Leg Bones Pivot Representation */}
                    <g className="opacity-40">
                      <line x1="50" y1="90" x2="150" y2="90" stroke="#718096" strokeWidth="2" strokeDasharray="3 3" />
                      {/* Flexed Joint Line */}
                      {(() => {
                        const r = 100;
                        const rad = (bendAngle * Math.PI) / 180;
                        const bx = 150 + r * Math.cos(rad);
                        const by = 90 + r * Math.sin(rad);
                        return <line x1="150" y1="90" x2={bx} y2={by} stroke="#718096" strokeWidth="2" strokeDasharray="3 3" />;
                      })()}
                    </g>

                    {/* Left Upper Leg (Thigh) - Permanent Skin */}
                    <path d="M 50,75 L 150,75 L 150,105 L 50,105 Z" fill="#e53e3e" fillOpacity="0.15" stroke="#fc8181" strokeWidth="2" />
                    
                    {/* Lower Leg Skin (Calf) - Subject to clipping/masking */}
                    {(() => {
                      const rad = (bendAngle * Math.PI) / 180;
                      // Dynamic rotation matrix
                      const rUpperX_1 = 150;
                      const rUpperY_1 = 75;
                      const rUpperX_2 = 150;
                      const rUpperY_2 = 105;

                      const length = 110;
                      const thickness = 24;

                      const cos = Math.cos(rad);
                      const sin = Math.sin(rad);

                      // End of lower leg bone
                      const boneEndX = 150 + length * cos;
                      const boneEndY = 90 + length * sin;

                      // Calf corners
                      const p1x = 150 + (thickness * sin);
                      const p1y = 90 - (thickness * cos);
                      const p2x = boneEndX + (thickness * sin);
                      const p2y = boneEndY - (thickness * cos);

                      const p3x = boneEndX - (thickness * sin);
                      const p3y = boneEndY + (thickness * cos);
                      const p4x = 150 - (thickness * sin);
                      const p4y = 90 + (thickness * cos);

                      const pointsPath = `M 150,90 Q ${p1x},${p1y} ${p2x},${p2y} L ${p3x},${p3y} Q ${p4x},${p4y} 150,90 Z`;

                      // Determine draw opacity based on masking modes
                      let opacity = 1.0;
                      let strokeCol = '#f6ad55';
                      let fillCol = '#dd6b20';

                      if (optMode2 === 'section') {
                        opacity = 0.05; // Segment culled/invisible!
                        strokeCol = '#4a5568';
                        fillCol = '#2d3748';
                      } else if (optMode2 === 'mask') {
                        opacity = 0.35; // Material alpha transparency
                        strokeCol = '#4299e1';
                        fillCol = '#2b6cb0';
                      }

                      return (
                        <path 
                          d={pointsPath} 
                          fill={fillCol} 
                          fillOpacity={opacity * 0.3} 
                          stroke={strokeCol} 
                          strokeWidth="2.5" 
                          strokeOpacity={opacity}
                        />
                      );
                    })()}

                    {/* Armored Boot overlay - Rigid structure */}
                    {(() => {
                      const rad = (bendAngle * Math.PI) / 180;
                      const cos = Math.cos(rad);
                      const sin = Math.sin(rad);

                      const length = 120;
                      let bootThickness = 32;

                      // Corrective Morph Target expands boot diameter under heavy muscle flexion
                      if (optMode2 === 'psd' && bendAngle > 50) {
                        bootThickness += (bendAngle - 50) * 0.15; // Dynamically expands boot envelope
                      }

                      // End coordinates
                      const endX = 150 + length * cos;
                      const endY = 90 + length * sin;

                      // Boot boundary points
                      const p1x = 150 + (bootThickness * sin);
                      const p1y = 90 - (bootThickness * cos);
                      const p2x = endX + (bootThickness * sin);
                      const p2y = endY - (bootThickness * cos);

                      const p4x = 150 - (bootThickness * sin);
                      const p4y = 90 + (bootThickness * cos);

                      // Ankle flaring point
                      const p3x = endX - (bootThickness * sin) * 1.4;
                      const p3y = endY + (bootThickness * cos) * 1.4;

                      const bootPath = `M 155,90 Q ${p1x},${p1y} ${p2x},${p2y} L ${p3x},${p3y} L ${p4x},${p4y} Z`;

                      return (
                        <path 
                          d={bootPath} 
                          fill="#4a5568" 
                          fillOpacity="0.45" 
                          stroke={optMode2 === 'psd' ? '#9f7aea' : '#a0aec0'} 
                          strokeWidth="3" 
                        />
                      );
                    })()}

                    {/* Overlay Clipping Hazard Blink Circle (Visible only in Naive mode when flexed) */}
                    {optMode2 === 'none' && bendAngle > 20 && (
                      <g>
                        {/* Red flashing halo highlighting bone alignment intersection */}
                        <circle cx="215" cy="140" r="18" fill="none" stroke="#e53e3e" strokeWidth="2.5" className="animate-pulse" />
                        <line x1="215" y1="110" x2="215" y2="130" stroke="#fc8181" strokeWidth="2" />
                        <text x="220" y="125" fill="#fc8181" fontSize="8" fontFamily="monospace" fontWeight="bold">CLIPPING CRASH</text>
                      </g>
                    )}
                  </svg>

                  <div className="w-full flex justify-between px-3 text-[10px] text-zinc-500 font-mono mt-2 pt-2 border-t border-white/5">
                    <span>SKINNED TRIANGLE BUFFER: <strong className="text-white">{optMode2 === 'section' ? '~4,200 Tri' : '~18,500 Tri'}</strong></span>
                    <span>CPU LOAD: <strong className="text-white">{metrics2.cpuMs} ms</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* THEORETICAL EXPANSION AND UE EVALUATION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 rounded-xl border border-kingfisher-border/40">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider text-blue-400 mb-2">The Mechanics of Clipping Culling</h4>
                <p className="text-xs text-kingfisher-muted leading-relaxed mb-3">
                  Writers of games like <em>The Witcher 3</em> and <em>Baldur's Gate 3</em> don't try to solve complex clothing-skin collision. They simply make body parts beneath tight armor invisible!
                </p>
                <ul className="space-y-2 text-xs text-kingfisher-muted leading-relaxed">
                  <li>
                    <strong className="text-white">Dynamic Section Invisibility (O(1) approach):</strong> If gauntlets are equipped, disable rendering for Section 3 (Gauntlet bounds skin) of the main body's material indices. Disabling vertex indices completely avoids vertex assembly and pixel shading costs.
                  </li>
                  <li>
                    <strong className="text-white">Vertex Alpha Material Masking:</strong> For organic flows (coats, capes), paint a black-and-white mask onto an auxiliary vertex color channel of the skin. Multiply the material's Opacity Mask with this vertex color inside the Master Shader, turning unseen skin transparent instantly.
                  </li>
                  <li>
                    <strong className="text-white">Corrective Joint Blends (Pose Space Deformation):</strong> Link joint rotation angles inside Animation Blueprints to corrective morph targets. When a knee bends 90°, trigger a morphological offset that pushes the skirt wrinkles slightly forward to override rigid intersection clipping.
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-black/40 rounded-xl border border-[#ffd700]/30">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider text-[#ffd700] mb-2">Unreal Engine Feature Grid</h4>
                <FeatureMatrix 
                  has={[
                    "SetMaterialSectionInvisibility API allowing programmatic culling of specific mesh index chunks instantly.",
                    "Skeletal Mesh Edit Section panels within the Unreal Editor to group mesh triangles into discrete slots.",
                    "Pose Driver AnimNode matching limb bend parameters to corrective morph weights in the AnimGraph."
                  ]}
                  missing={[
                    "Automated real-time occlusion analysis to auto-paint opacity masks based on overlapping armor bounding volumes.",
                    "Out-of-the-box support for multiple layered alpha masks on dynamic character textures without VRAM caching penalties."
                  ]}
                  howToUse="In your Character's skeletal asset, divide the body mesh into index sections (0 = Torso, 1 = Calf, 2 = Upper Arm). When equipping thigh-high leather boots, call SetMaterialSectionInvisibility(BodyMesh, 1, true). For dynamic elements like cloaks, map joint drivers to corrective Morph Targets inside Maya/Blender."
                />
              </div>
            </div>

            <h5 className="text-white font-bold text-sm mt-4 mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4 text-kingfisher-warm" />
              C++ Section Hider & Corrective Morph Driver
            </h5>
            <CodeBlock language="cpp" code={`// Copyright XanXon Open World RPG. All Rights Reserved.
#include "ModularCharacter.h"
#include "Components/SkeletalMeshComponent.h"

// Triggered when dynamic equipment changes
void AModularCharacter::ApplySkeletalClippingGuard(const FArmorConfig& EquippedArmor)
{
    if (!LeaderBodyMesh) return;

    // Reset all body sections to fully visible on initial pass
    for (int32 SectionIdx = 0; SectionIdx < BodyMeshSectionsCount; ++SectionIdx)
    {
        LeaderBodyMesh->SetMaterialSectionInvisibility(SectionIdx, false);
    }

    // 1. O(1) Absolute Hiding: Disable calf and thigh skin drawing if boots cover them
    if (EquippedArmor.bHasLongBoots)
    {
        // Section 2 has been mapped to 'Lower Legs Skin' in the Skeletal Index editor
        LeaderBodyMesh->SetMaterialSectionInvisibility(2, true); // Complete mesh chunk culled (-3.5ms GPU, -45MB VRAM!)
    }

    // 2. Disable forearm skin if full dynamic gauntlets are worn
    if (EquippedArmor.bHasFullGauntlets)
    {
        // Section 4 mapped to 'Forearm Skin'
        LeaderBodyMesh->SetMaterialSectionInvisibility(4, true); 
    }

    // 3. Corrective Morph Blend weight settings
    if (EquippedArmor.bHasHeavyShoulders)
    {
        // Enforce corrective shoulder adjustments inside material vertex offsets to clear armor pads
        LeaderBodyMesh->SetMorphTarget(TEXT("Corrective_Shoulders_Clearance"), 1.0f);
    }
    else
    {
        LeaderBodyMesh->SetMorphTarget(TEXT("Corrective_Shoulders_Clearance"), 0.0f);
    }
}`} />
          </div>
        </SectionCard>
      </div>

      {/* SECTION 3: Rigid Body Gravity & Physics Dynamics */}
      <div id="rigid-gravity-visuals" className="scroll-mt-24">
        <SectionCard title="3. Rigid Body Gravity & Physics-Proxy Warp Animation" icon={Layers} color={COLORS.kingfisher.warm}>
          <div className="space-y-4">
            <p className="text-kingfisher-muted text-sm leading-relaxed">
              Bags, scabbards, capes, hair, and armor tassels must respond realistically to player running, jumping, and wind forces. Running full world physics simulations (such as standard Chaos Cloth solvers) on all characters is incredibly slow, dragging frame rates down. Swapping full meshes for <strong>Anim Dynamics (joint-localized solvers)</strong> or <strong>Simulation Proxies (low-poly wrappers)</strong> yields spectacular visuals within budget.
            </p>

            {/* HARDAWRE METRIC DEEP ANALYSIS */}
            <div className="p-4 bg-black/40 rounded-xl border border-kingfisher-border/30 space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider text-purple-400">Dynamic Spring-Sway Solver Hardware Cost Evaluated</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <div className="text-[9px] uppercase font-bold text-kingfisher-muted/80">CPU Impact</div>
                  <div className="text-sm font-mono font-bold text-emerald-400">-{metrics3.cpuMs} ms</div>
                  <div className="text-[9px] text-kingfisher-muted">AnimDynamics Node pool</div>
                </div>
                <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <div className="text-[9px] uppercase font-bold text-kingfisher-muted/80">GPU Frame Time</div>
                  <div className="text-sm font-mono font-bold text-blue-400">-{optMode3 === 'dynamics' ? '2.1' : '5.5'} ms</div>
                  <div className="text-[9px] text-kingfisher-muted">Low poly proxy offset</div>
                </div>
                <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <div className="text-[9px] uppercase font-bold text-kingfisher-muted/80">System RAM</div>
                  <div className="text-sm font-mono font-bold text-purple-400">-{optMode3 === 'dynamics' ? '12.4' : '45.0'} MB</div>
                  <div className="text-[9px] text-kingfisher-muted">Active spring buffers</div>
                </div>
                <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <div className="text-[9px] uppercase font-bold text-kingfisher-muted/80">VRAM Allocation</div>
                  <div className="text-sm font-mono font-bold text-pink-400">+{optMode3 === 'dynamics' ? '3.5' : '18.0'} MB</div>
                  <div className="text-[9px] text-kingfisher-muted">Continuous vertex cache</div>
                </div>
                <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <div className="text-[9px] uppercase font-bold text-kingfisher-muted/80">Listen Server Latency</div>
                  <div className="text-sm font-mono font-bold text-emerald-400">0.00 ms</div>
                  <div className="text-[9px] text-kingfisher-muted">100% Client-Side</div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE WORKLOAD SIMULATOR */}
            <div className="bg-kingfisher-panel/40 border border-kingfisher-border/50 p-5 rounded-xl space-y-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                <div>
                  <h4 className="text-white font-bold text-sm flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-400" />
                    Interactive Anim Dynamics Spring node chain & Decimation Simulator
                  </h4>
                  <p className="text-xs text-kingfisher-muted">Grab and drag the physical yellow joints. Move the camera distance slider back and see how UE Anim Dynamics tick evaluation rate decodes dynamically based on distance significance.</p>
                </div>
                <div className="flex gap-1.5 self-end lg:self-auto">
                  <button
                    onClick={() => setOptMode3('chaos')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${optMode3 === 'chaos' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-black/30 text-kingfisher-muted border border-transparent hover:text-white'}`}
                  >
                    Chaos Cloth Solver (Synchronous raw loops)
                  </button>
                  <button
                    onClick={() => setOptMode3('dynamics')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${optMode3 === 'dynamics' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-black/30 text-kingfisher-muted border border-transparent hover:text-white'}`}
                  >
                    Anim Dynamics + Distance Decimation
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 bg-black/40 p-4 rounded-xl border border-kingfisher-border/30">
                {/* Configuration Panel */}
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <label className="text-white text-xs font-bold block mb-1 flex justify-between">
                      <span>Viewer / Camera Distance from Actor</span>
                      <span className="text-purple-400 font-mono">{cameraDistance} meters</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="120"
                      value={cameraDistance}
                      onChange={(e) => setCameraDistance(parseInt(e.target.value))}
                      className="w-full accent-purple-400"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                      <span>1m (Close-Up UI)</span>
                      <span>30m (Far Crowd)</span>
                      <span>120m (LOD Culling)</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-white text-xs font-bold block mb-1.5">Atmospheric Microclimate Wind Velocities</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'breeze', label: 'Gentle Breeze' },
                        { id: 'gale', label: 'High Gale' },
                        { id: 'storm', label: 'Violent Tempest' }
                      ].map((wind) => (
                        <button
                          key={wind.id}
                          onClick={() => setWindStrength(wind.id)}
                          className={`p-2 rounded-lg text-xs border transition-all ${windStrength === wind.id ? 'bg-purple-500/15 border-purple-500/40 text-purple-200 font-bold' : 'bg-black/30 border-white/5 text-kingfisher-muted'}`}
                        >
                          {wind.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-black/50 rounded-lg border border-purple-500/20 space-y-1.5 text-xs text-kingfisher-muted">
                    <span className="text-[10px] font-bold uppercase text-purple-400 block">Performance Impact</span>
                    <div className="flex justify-between">
                      <span>Solver Update Frequency:</span>
                      <strong className={metrics3.stateStyle}>{metrics3.activeHz} Hz</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Evaluations CPU Time:</span>
                      <strong className="text-white font-mono">{metrics3.cpuMs} ms</strong>
                    </div>
                    {optMode3 === 'dynamics' && cameraDistance > 60 && (
                      <p className="text-[10px] text-zinc-500 italic mt-1 font-mono leading-tight">★ Asset is far. Bone transform evaluation completely frozen to skip dynamic spring sweeps!</p>
                    )}
                  </div>
                </div>

                {/* Simulated Physical Canvas Display */}
                <div className="lg:col-span-7 flex items-center justify-center p-2 bg-black/60 rounded-xl relative min-h-[220px]">
                  <canvas 
                    ref={sim3CanvasRef} 
                    width={300} 
                    height={210} 
                    onMouseDown={handleSim3MouseDown}
                    onMouseMove={handleSim3MouseMove}
                    onMouseUp={handleSim3MouseUp}
                    onMouseLeave={handleSim3MouseUp}
                    className="cursor-crosshair bg-neutral-900/40 rounded-lg border border-white/5 w-full max-w-[340px]" 
                  />
                  <div className="absolute top-2 right-4 text-[9px] text-zinc-500 font-mono">
                    DRAG THE JOINTS!
                  </div>
                </div>
              </div>
            </div>

            {/* THEORETICAL EXPANSION AND UE EVALUATION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 rounded-xl border border-kingfisher-border/40">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider text-blue-400 mb-2">The Performance Gaps of Physics Solver Assemblies</h4>
                <ul className="space-y-2 text-xs text-kingfisher-muted leading-relaxed">
                  <li>
                    <strong className="text-white">The Naive Approach (Dynamic Chaos Cloth on HD meshes):</strong> Attemptey simulating a 15,000 polygon cape model directly using collision trace sweeps. This spikes Game Thread physics evaluation times to <span className="text-red-400">18.2ms CPU</span>, dropping framerates.
                  </li>
                  <li>
                    <strong className="text-white">Anim Dynamics (`AnimNode_AnimDynamics`):</strong> Runs extremely fast, joint-localized skeletal bone rigid-body approximations on the Animation Thread. Best for bottles, swords, bags, and tassels. Configured with strict spring limits and gravity constraints, keeping CPU cost beneath <span className="text-emerald-400">0.2ms</span>.
                  </li>
                  <li>
                    <strong className="text-white">Simulation Proxy Deformation:</strong> Simulate dynamic fabric on an ultra-low-resolution "simulation proxy" mesh (such as a flat ribbon of only 40 vertices). Transfer the wave motions to the beautiful 15,000 polygon high-definition cape mesh via 1D skeletal matrix wrapping, saving massive GPU processing cycles.
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-black/40 rounded-xl border border-purple-500/30">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider text-purple-400 mb-2">Unreal Engine Feature Grid</h4>
                <FeatureMatrix 
                  has={[
                    "Anim Dynamics Node running fast, parallelized rigid solver joint chains in AnimBlueprints.",
                    "Skeletal Mesh Deformers allowing custom vertex maps to lock onto proxy dynamic bone lines.",
                    "Chaos Cloth Simulation Proxy mapping tools inside the Unreal skeletal editor."
                  ]}
                  missing={[
                    "Native automatic generation of dynamic spring-bone setups for multi-joint chains matching physics asset shapes.",
                    "Self-balancing dynamic cloth solver quality switches scaling particle iterations strictly with frame-time averages."
                  ]}
                  howToUse="For hanging items like scabbards, add rigid joints in the skeleton, and connect them inside AnimBlueprint AnimGraph using the 'AnimDynamics' node. Set linear limits and adjust 'Wind/Gravity Multiplier'. For cloth (capes/cloaks), paint a low-poly simulation asset using the Chaos editor and map the high-poly visual using a custom Mesh Deformer graph."
                />
              </div>
            </div>

            <h5 className="text-white font-bold text-sm mt-4 mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4 text-purple-400" />
              Unreal Engine C++ Custom Wind & Gravity Injection for Anim Dynamics
            </h5>
            <CodeBlock language="cpp" code={`// Copyright XanXon Open World RPG. All Rights Reserved.
#pragma once

#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "WitcherWindSubsystem.generated.h"

// 1. High-Performance World Subsystem that tracks wind vectors across biomes asynchronously
UCLASS()
class UWitcherWindSubsystem : public UWorldSubsystem
{
    GENERATED_BODY()

public:
    virtual void Initialize(FSubsystemCollection& Collection) override
    {
        CurrentGlobalWindVector = FVector(100.0f, 0.0f, 0.0f); // Default gentle breeze
    }

    // Accessible in background AnimGraph evaluation threads (Safe O(1) thread-read)
    UFUNCTION(BlueprintPure, Category = "Optimization|Physics")
    FVector GetActiveWindForceAtLocation(FVector ActorLocation) const
    {
        // Model local gust variations using pre-allocated cosine wave Look-Up Tables
        float WaveOffset = FMath::Cos(GetWorld()->GetTimeSeconds() * 2.0f + ActorLocation.X * 0.001f);
        return CurrentGlobalWindVector * (1.0f + WaveOffset * 0.5f);
    }

private:
    FVector CurrentGlobalWindVector;
};`} />
          </div>
        </SectionCard>
      </div>
    </div>
  );
};
