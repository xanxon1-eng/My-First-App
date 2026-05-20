
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const PipelineTab = () => (
  <div className="space-y-6">
    <PageHeader title="The 16.7ms Pipeline" subtitle="Understanding 60 FPS parallel engine architecture. 13.5ms targets with 3ms buffer per thread. Tailored for open-world AAA games." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Task-Graph scheduling algorithms (Directed Acyclic Graphs) for parallel dispatch across 16.7ms.</p>
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SectionCard title="Game Thread (CPU)" icon={Activity} color={COLORS.status.info}>
        <p className="text-sm mb-2"><strong>Frame N (The Brain):</strong> Calculates AI pathfinding, physics sweeps, skeletal state evaluation, and gameplay scripts.</p>
        <div className="p-3 bg-black/20 rounded border border-blue-500/10 text-xs mb-3">
          <strong className="text-blue-400 block mb-1">RPG Core Bottle-Necks:</strong>
          <ul className="list-disc pl-4 space-y-1 text-kingfisher-muted font-sans">
            <li><strong>Witcher 3 Novigrad crowds:</strong> Evaluation of 150+ NPC tickers spikes CPU by <span className="text-red-400">~6.5ms</span>.</li>
            <li><strong>BG3 Turn Resolution:</strong> AI grids and state queries sweep 1,000+ objects, halting threads for up to <span className="text-red-400">30ms</span>.</li>
          </ul>
        </div>
        <div className="mt-3 space-y-1 animate-fadeIn">
          <StatRow label="World Logic (Quest/Stats)" value="~3.0ms" />
          <StatRow label="AI & Crowd pathing" value="~3.5ms" />
          <StatRow label="Anim Evaluation (URO off)" value="~2.5ms" />
          <StatRow label="Physics Sweeps / Audio" value="~2.0ms" />
          <StatRow label="Game Thread Ceiling" value="13.50ms" color="text-emerald-400" />
        </div>
      </SectionCard>
      <SectionCard title="Draw Thread (CPU)" icon={LayoutTemplate} color={COLORS.status.warning}>
        <p className="text-sm mb-2"><strong>Frame N-1 (The Coordinator):</strong> Performs visibility testing, frustum culling, distance culling, and builds Draw Calls.</p>
        <div className="p-3 bg-black/20 rounded border border-amber-500/10 text-xs mb-3">
          <strong className="text-amber-400 block mb-1">RPG Core Bottle-Necks:</strong>
          <ul className="list-disc pl-4 space-y-1 text-kingfisher-muted font-sans">
            <li><strong>Path of Exile Spell Spams:</strong> Spawning 120 fireballs with individual dynamics triggers draw call spikes (instancing fails, adding <span className="text-red-400">~5.2ms</span>).</li>
            <li><strong>Witcher 3 Forests:</strong> Over 10,000 foliage instances must be culled/sorted, eating draw thread limits.</li>
          </ul>
        </div>
        <div className="mt-3 space-y-1 animate-fadeIn">
          <StatRow label="Frustum / Occlusion Cull" value="~4.0ms" />
          <StatRow label="HISM Batch Processing" value="~5.0ms" />
          <StatRow label="Shadow Pass Setup (VSM)" value="~3.0ms" />
          <StatRow label="Draw Thread Ceiling" value="13.50ms" color="text-amber-400" />
        </div>
      </SectionCard>
      <SectionCard title="GPU" icon={Monitor} color={COLORS.status.success}>
        <p className="text-sm mb-2"><strong>Frame N-2 (The Artist):</strong> Rasterizes geometry vertices, resolves G-Buffers, evaluates Lumen GI reflections, and computes post-process upscaling.</p>
        <div className="p-3 bg-black/20 rounded border border-emerald-500/10 text-xs mb-3">
          <strong className="text-emerald-400 block mb-1">RPG Core Bottle-Necks:</strong>
          <ul className="list-disc pl-4 space-y-1 text-kingfisher-muted font-sans">
            <li><strong>PoE Shaders:</strong> Complex alpha blends on overlapping fire/ice particles cause overdraw cascades (GPU cost spikes up to <span className="text-red-400">~22ms</span>).</li>
            <li><strong>BG3 Dark Caverns:</strong> High depth complexity of interior details eating pixel pixel pipelines.</li>
          </ul>
        </div>
        <div className="mt-3 space-y-1 animate-fadeIn">
          <StatRow label="Base Pass / Geometry" value="~3.5ms" />
          <StatRow label="VSM Shadow Maps" value="~3.5ms" />
          <StatRow label="Lumen Reflection & GI" value="~4.5ms" />
          <StatRow label="Post-Process (TSR/DLSS)" value="~1.5ms" />
          <StatRow label="GPU Total Frame Allocation" value="13.00ms" color="text-emerald-400" />
        </div>
      </SectionCard>
    </div>

    <SectionCard title="16.7ms Framework Hardware Impact & Engine Support" icon={Globe} color={COLORS.kingfisher.warm}>
      <p className="text-sm text-kingfisher-muted mb-4 font-medium italic">Comparison of pipeline performance targets across threads:</p>
      <MultiplayerImpact 
        gpu="Saves -5.5ms GPU (Dynamic upscaling such as TSR scales GPU frame times back to 10.5ms under heavy scene load)" 
        cpu="-6.0ms CPU Game Thread (Allocating tick loops across parallel worker tasks drops Game Thread work to 7.0ms)" 
        ram="Occupies ~142MB System RAM (Pipelining variables for triple buffering buffers data safely across game cycles)" 
        vram="Allocates +85MB VRAM (Required for GPU Command Buffers holding Draw dispatches across pipelines)" 
        latency="Reduces latency/ping from +60ms to flat <15ms (Bypassing thread synchronisation buffers guarantees instant network packet evaluations)" 
      />
      <FeatureMatrix 
        has={[
          "Task-Graph Command Scheduler (auto-disperses Game logical operations to all physical CPU cores)",
          "Draw/Render thread decoupling (enables rendering and drawing concurrently to Game updates out of the box)",
          "NullRHI execution parameters (completely disengages GPU compilation for headless Dedicated Servers, saving 100% graphics overhead)"
        ]}
        missing={[
          "Native synchronization lock-free atomic gameplay templates (you must write custom wrappers around tick groups)",
          "Automated dynamic CPU/GPU resolution scaling scripts (you must bound ResolutionQuality to frame budget averages manually)"
        ]}
        howToUse="To integrate: Open 'Project Settings' and ensure Tick Groups such as TG_PrePhysics and TG_DuringPhysics are assigned to separate Task Graph cores. Use command line option '-NullRHI' when launching Dedicated Servers on Cloud platforms."
      />
    </SectionCard>

    <HighlightBox type="success">
      <strong>The Parallel Secret:</strong> Game Thread (10ms) + Draw Thread (10ms) + GPU (10ms) = 30ms of work delivered simultaneously every 10ms. Frame rate is determined by the <em>slowest individual thread</em> — not the sum.
    </HighlightBox>
  </div>
);
