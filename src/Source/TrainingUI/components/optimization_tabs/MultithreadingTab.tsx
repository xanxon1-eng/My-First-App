
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const MultithreadingTab = () => (
  <div className="space-y-6">
    <PageHeader title="Multithreading & Async" subtitle="Using UE-native concurrency models to keep the Game Thread perfectly clean." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Work-stealing queue algorithms balancing loads across generic CPU worker threads.</p>
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="When to use Multithreading? (Do's)" icon={Network} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">Not everything needs its own thread. Use Task Graphs organically when:</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li><strong>Heavy Server Math:</strong> Trajectory prediction, custom rule validation, or procedurally calculating nav-graphs.</li>
          <li><strong>Batch Array Processing:</strong> Looping over 10,000 grid nodes. Use `ParallelFor`.</li>
          <li><strong>Rule of thumb:</strong> If a task takes longer than ~0.5ms and its results aren't strictly required to render the very next frame, push it to an Async Task.</li>
          <li><strong className="text-red-400">Avoid:</strong> Modifying `UObjects` directly or calling `SpawnActor` on async threads. Always pipe results back to the Game Thread via `FFunctionGraphTask::CreateAndDispatchWhenReady`.</li>
        </ul>
        <MultiplayerImpact gpu="0ms" cpu="-6.0ms (Game Thread offloaded to Worker threads)" ram="+1MB (Task queues)" latency="0ms" />
      </SectionCard>
      <SectionCard title="UE Native Architectures (Do's)" icon={Database} color={COLORS.status.success}>
        <ul className="list-disc pl-5 space-y-4 text-sm text-kingfisher-muted">
          <li>
            <strong className="text-emerald-400">UE::Tasks::Launch (Modern TaskGraph):</strong> 
            Modern replacement for Async. Short, heavily interdependent tasks. Very low thread-spawning overhead.
          </li>
          <li>
            <strong className="text-emerald-400">ParallelFor (O(n) Scalability):</strong> 
            Perfect for iterating over massive arrays (e.g., updating 5,000 simulation actors). Blocks the current thread until all chunked iterations finish across worker cores.
          </li>
          <li>
            <strong className="text-emerald-400">FRunnable:</strong> 
            For infinite, continuous loops (e.g., a custom background WebSocket server or chunk loader).
          </li>
        </ul>
      </SectionCard>
      <SectionCard title="Risks of Manual Replacements" icon={Flame} color={COLORS.status.error}>
        <p className="text-sm mb-3">If you bypass Unreal's thread pool and use raw <code>std::thread</code>:</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li><strong>Oversubscription:</strong> Unreal already scales its TaskGraph worker threads to the CPU's physical core count. Adding custom threads causes context switching, lowering overall FPS.</li>
          <li><strong>Garbage Collection:</strong> Standard threads don't know about Unreal's GC. If a UObject is collected while your thread reads it, you crash.</li>
          <li><strong>Deadlocks:</strong> Manual mutex locks can easily stall the Game Thread if you wait for a background process that is waiting on Game Thread data.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Safe Data Passing" icon={Database} color={COLORS.kingfisher.warm}>
        <p className="text-sm text-kingfisher-muted mb-2">How to interact with the Game Thread safely:</p>
        <div className="space-y-2 text-sm font-mono mt-3">
          <div className="p-3 bg-black/20 rounded border border-kingfisher-border/30">
            <span className="text-blue-400">{"AsyncTask(ENamedThreads::GameThread, []() { ... });"}</span>
            <p className="text-kingfisher-muted text-xs mt-1">Schedules UI updates or UObject mutations back on the main thread safely.</p>
          </div>
          <div className="p-3 bg-black/20 rounded border border-kingfisher-border/30">
            <span className="text-emerald-400">Pass structs/primitives by value.</span>
            <p className="text-kingfisher-muted text-xs mt-1">Do not pass UObject pointers to background threads.</p>
          </div>
        </div>
      </SectionCard>
    </div>
  </div>
);
