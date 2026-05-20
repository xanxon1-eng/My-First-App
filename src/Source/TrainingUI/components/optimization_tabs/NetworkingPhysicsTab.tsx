
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const NetworkingPhysicsTab = () => (
  <div className="space-y-6">
    <PageHeader title="AAA Multiplayer Foundations" subtitle="Building a local game with zero-refactor scalability for massive Dedicated Server deployments." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Lag compensation algorithms (Rewind) and Snapshot Interpolation algorithms.</p>
    </HighlightBox>
    <HighlightBox type="info" className="mb-4">
      <strong>The "Just-In-Case" Paradox:</strong> Grafting multiplayer onto an existing single-player codebase usually requires a complete 100% rewrite of the logic layer. By adopting <em>Server Authority</em> and <em>RPC decoupling</em> from Day 1—even for offline play—you future-proof your IP, saving years of development while incidentally resulting in cleaner, event-driven single-player code.
    </HighlightBox>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="The Authority Hierarchy" icon={Globe} color={COLORS.kingfisher.blue}>
        <p className="mb-2 text-sm"><strong>Rule: The client lies. The server governs.</strong> Even offline, pretend a malicious client is trying to cheat.</p>
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>Input Only:</strong> PlayerControllers should only capture keystrokes and forward them via <code>Server_</code> RPCs. They never modify <code>Health</code> directly.</li>
          <li><strong>Simulated Proxies:</strong> All non-player characters are updated by the server. Clients just interpolate their transforms (Smooth Sync).</li>
          <li><strong>Offline Benefit:</strong> Single-player runs as a "Listen Server". Pushing logic strictly to the GameMode (server only) and PlayerState prevents spaghetti code in character blueprints.</li>
        </ul>
      </SectionCard>
      
      <SectionCard title="RPC (Remote Procedure Call) Taxonomy" icon={Network} color={COLORS.status.warning}>
        <p className="mb-2 text-sm">How execution jumps between network boundaries.</p>
        <div className="space-y-2 text-sm">
          <div className="p-2 bg-amber-950/20 border border-amber-500/20 rounded">
            <strong className="text-amber-400">Server RPC:</strong> Client asks to do something. <code>Server_EquipWeapon()</code>. Used for inputs, purchases, attacks.
          </div>
          <div className="p-2 bg-emerald-900/20 border border-emerald-500/20 rounded">
            <strong className="text-emerald-400">Client/Owning RPC:</strong> Server tells a specific player something. <code>Client_ShowDamageNumber()</code>.
          </div>
          <div className="p-2 bg-purple-900/20 border border-purple-500/20 rounded">
            <strong className="text-purple-400">NetMulticast:</strong> Server tells everyone nearby. <code>Multicast_PlayExplosion()</code>. Never use for persistent state (late joiners miss it).
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Variable Replication via RepNotify" icon={Layers} color={COLORS.status.success}>
        <p className="mb-2 text-sm"><strong>The Core State Engine:</strong> Instead of RPCs, sync State via replicated variables.</p>
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong>UPROPERTY(ReplicatedUsing):</strong> When the server changes health, the network automatically pushes the new value to all clients and calls <code>OnRep_Health()</code>.</li>
          <li><strong>VFX Binding:</strong> Bind your UI updates, blood splatters, and screen shakes to the <code>OnRep_</code> function.</li>
          <li><strong>Offline Benefit:</strong> In standalone, ensure your server-side logic manually calls the <code>OnRep_</code> function after changing the value to synthesize the network cycle. This unifies visual execution logic completely.</li>
        </ul>
      </SectionCard>

      <SectionCard title="Advanced Optimization: Dormancy & Relevancy" icon={ShieldAlert} color={COLORS.kingfisher.warm}>
        <p className="mb-2 text-sm">In a 100-player AAA map, tracking every object melts the CPU. Culling network traffic is mandatory.</p>
        <ul className="list-disc pl-5 space-y-2 text-kingfisher-muted text-sm">
          <li><strong className="text-white">Net Relevancy (Spatial):</strong> Objects over 10,000 units away are culled from a client's network stream. Only replicate what clients can see.</li>
          <li><strong className="text-white">Net Dormancy (Temporal):</strong> A dropped sword isn't moving. Set to <code>DORM_Initial</code>. The server permanently stops checking it. If picked up, call <code>FlushNetDormancy</code>. Saves monumental CPU cycles vs <code>NetUpdateFrequency=0.1</code>.</li>
          <li><strong className="text-white">Update Frequency:</strong> Set default Actors to 2-5Hz. Only active Player Pawns need 30-60Hz bandwidth polling.</li>
        </ul>
      </SectionCard>

      <SectionCard className="md:col-span-2" title="Character Movement Component (CMC) Protocol" icon={Activity} color={COLORS.status.info}>
        <p className="mb-2 text-sm"><strong>The gold standard of Unreal Engine Netcode.</strong> The CMC handles lag compensation inherently so clients never feel latency.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <div className="bg-black/20 p-3 rounded border border-blue-500/20 text-sm">
            <strong className="text-white block mb-1">1. Client Prediction</strong>
            <span className="text-kingfisher-muted">When moving locally, the client <em>predicts</em> success instantly, moving their mesh without waiting for server permission round-trips.</span>
          </div>
          <div className="bg-black/20 p-3 rounded border border-amber-500/20 text-sm">
            <strong className="text-white block mb-1">2. Server Validation</strong>
            <span className="text-kingfisher-muted">Server receives timestamps and movement vectors. Re-simulates the move. If collision or speedhacks detected, server rejects it.</span>
          </div>
          <div className="bg-black/20 p-3 rounded border border-red-500/20 text-sm">
            <strong className="text-white block mb-1">3. Rubberbanding (Correction)</strong>
            <span className="text-kingfisher-muted">If server rejects, it forces an authoritative override to the client. The client snaps back (rubberbands) to the server's absolute true position.</span>
          </div>
        </div>
      </SectionCard>
      
      <SectionCard title="Generic Prediction & Frame Rollback" icon={Activity} color={COLORS.kingfisher.warm}>
        <p className="mb-2 text-sm"><strong>Beyond the CMC: Prediction for Custom Abilities.</strong></p>
        <ul className="list-disc pl-5 space-y-3 text-kingfisher-muted text-sm">
          <li><strong className="text-white">Deterministic Sync:</strong> In combat, the client simulates instantly (like firing a dash or projectile), while logging the exact Frame ID and Input block.</li>
          <li><strong className="text-white">Rollback Re-simulation:</strong> If the server's authoritative state update differs from the client's past prediction, the client rolls back its state to that frame, applies the server's update, and rapidly re-simulates all inputs between that past frame and the present.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Payload Compression Check" icon={Database} color={COLORS.status.error}>
        <p className="mb-2 text-sm"><strong>Bandwidth Optimization (The 1KB/s Target):</strong></p>
        <ul className="list-disc pl-5 space-y-3 text-kingfisher-muted text-sm">
          <li><strong className="text-white">Bitmask Compression:</strong> Quest steps and unlock grids map into bitwise integers (e.g., <code>uint32</code>), syncing 4 bytes instead of 32 booleans.</li>
          <li><strong className="text-white">Fast Array Serializer:</strong> Unreal’s <code>FFastArraySerializer</code> is mandatory for inventory management, syncing only the delta diffs for mutated indexes.</li>
          <li><strong className="text-white">Skip Owner Optimization:</strong> Prevent ghost echo jitter via <code>COND_SkipOwner</code>.</li>
        </ul>
      </SectionCard>
    </div>
  </div>
);
