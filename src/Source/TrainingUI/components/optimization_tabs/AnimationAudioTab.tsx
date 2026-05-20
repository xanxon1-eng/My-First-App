
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const AnimationAudioTab = () => (
  <div className="space-y-6">
    <PageHeader title="Animation & Audio Concurrency" subtitle="Optimizing bone evaluation and audio channels to handle dense Witcher 3-style movements and PoE-style magic explosions." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Skeletal Mesh component update throttling (UpdateRateOptimizations - URO) paired with binary-heap sound channel sorting.</p>
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Skeletal Animation Culling & URO" icon={Activity} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">
          Evaluating 120+ skeletal bones per character for 100 active enemies on-screen blocks the Game Thread. In <strong>The Witcher 3</strong>, Novigrad crowds are dynamically throttled based on relevance.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-4">
          <li><strong>Update Rate Optimization (URO):</strong> Skips bone evaluations on distant characters. An enemy 25 meters away only updates every 2 frames, and at 50 meters updates every 4 frames (saves <span className="text-emerald-400">~2.5ms CPU</span>).</li>
          <li><strong>Fast-Path BlendGraphs:</strong> Bypasses heavy Blueprint node interpretation, calculating active animation values using direct compiler C++ math pathways.</li>
          <li><strong>Root Motion Decoupling:</strong> Use Root Motion only for close-quarter combat. Switch to cheap kinematic capsule sweeps for distant movement navigation.</li>
        </ul>
        <MultiplayerImpact 
          gpu="0.0ms (No GPU overhead; animation evaluation and blend ticks are pure Game Thread CPU tasks)" 
          cpu="-3.0ms (Swapping raw blend trees to URO and AnimSharing cuts Game Thread evaluation times from 4.5ms to 1.5ms)" 
          ram="+108MB System RAM (Loaded animation sequence curves and composite blend state tables in memory)" 
          latency="0.0ms (Visual-only; animations do not influence server physics validation ticks directly)" 
        />
        <FeatureMatrix 
          has={[
            "URO (Update Rate Optimization API throttling frames natively)",
            "Animation Sharing Plugin (allowing hundreds of NPCs to share a single skinning evaluation frame)",
            "Anim Fast-Path Compiler validation in AnimBlueprints"
          ]}
          missing={[
            "Automatic distance-based BlendGraph branch optimization",
            "Hardware-accelerated skeletal bone interpolation",
            "Out-of-the-box ML Deformer rigs for multi-species RPG meshes"
          ]}
          howToUse="To integrate: Open your AnimGP and click the lightning icon to ensure all variables use Anim Fast-Path. Enable URO inside your Character Blueprint's SkeletalMesh component, and set Update Rate thresholds based on screen-space camera percentages."
        />
      </SectionCard>

      <SectionCard title="Audio Voice Concurrency & Throttling" icon={Music} color={COLORS.status.success}>
        <p className="text-sm mb-3">
          In games like <strong>Path of Exile</strong>, casting a chain-lightning spell on 50 monsters simultaneously triggers <strong className="text-red-400">dozens of overlapping thunder audio cues</strong>, causing clipping and overloading the CPU Audio Thread.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-4">
          <li><strong>Strict Concurrency Limits:</strong> Set custom sound groups with maximum concurrency caps (e.g., maximum 4 simultaneous Lightning crack audio voices). New sparks cull the oldest, protecting hardware limits.</li>
          <li><strong>Dynamic Volume Ducking:</strong> Submix systems automatically duck background ambient music and crowd chatter during heavy spell casting to preserve visual and audit audio clarity.</li>
          <li><strong>Decompress on Load vs Stream:</strong> Small sound effects (sword hits, grunts) should remain decompressed in RAM. Heavy soundscapes or voice lines are streamed dynamically from disk to conserve memory.</li>
        </ul>
        <MultiplayerImpact 
          gpu="0.0ms (Audio processing executes completely outside graphics card pipelines)" 
          cpu="-1.8ms (Limiting active audio channels prevents hardware-sweitzer audio buffers from blocking CPU execution)" 
          ram="+45MB System RAM (Small audio cues decompressed to memory for Zero-latency playback)" 
          latency="Avoids audio-thread bottlenecks (keeps standard system latency low and avoids frame drops during magic bursts)" 
        />
        <FeatureMatrix 
          has={[
            "Sound Concurrency Settings Assets in UE5 Editor",
            "Audio Submix ducking and real-time DSP modulation pipelines",
            "MetaSound modular compiler logic (interactive sound graphs)"
          ]}
          missing={[
            "Automatic crowd-density sound source pooling",
            "Auto-scaling sampling rates based on frame budgets",
            "Native 3D HRTF virtualization for low-end mobile devices without CPU penalties"
          ]}
          howToUse="To integrate: Create a `SoundConcurrency` asset in your project. Set 'Max Voices' to 4 and choose resolution rule 'Stop Oldest'. Assign this setting to all combat effects. Small, repetitive weapon strikes should be marked as 'Decompress On Load' in their Sound Wave panels."
        />
      </SectionCard>

      <SectionCard title="Skeletal Deformer: Pose Space Deformation (PSD) & ML Deformer" icon={Activity} color={COLORS.kingfisher.warm} className="md:col-span-2">
        <p className="text-sm mb-3">
          To simulate anatomical flexing (muscle bulging) on characters like Geralt during raw attack swings, standard morph targets are extremely slow. We can optimize this by shifting muscle deformation calculations to the GPU.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-kingfisher-muted mb-4">
          <div className="p-3 bg-black/30 rounded border border-blue-500/20">
            <strong className="text-blue-400 block mb-1">Method A: Pose Space Deformation (Normal Blends)</strong>
            <p className="leading-relaxed">Read bone angle rotations in the C++ AnimGraph using cheap Pose Drivers. Pass muscle tension values as a float parameter into the character material, blending a high-rez muscle Normal map. Completely bypasses slow CPU-computed vertex offsets!</p>
          </div>
          <div className="p-3 bg-black/30 rounded border border-purple-500/20">
            <strong className="text-purple-400 block mb-1">Method B: ML Deformer (GPU Vertex Interpolation)</strong>
            <p className="leading-relaxed">Pre-train a Neural Network with offline soft-body physics. At runtime, the ML Deformer evaluates bone transforms on the GPU, outputting dense vertex offsets directly to the pixel shader skinning processor. Saves over 3.0ms of Game Thread CPU time!</p>
          </div>
        </div>
        <MultiplayerImpact 
          gpu="+0.4ms GPU Overhead (ML Deformer neural passes run as pixel shaders inside the rendering pipeline)" 
          cpu="-2.8ms CPU Saving (Offloading mesh vertex deformation saves massive Game Thread animation tick budgets)" 
          ram="+8MB System RAM / +22MB GPU VRAM (Deformer coefficient matrices and high-contrast normal maps loaded to VRAM)" 
          latency="0.0ms (Purely visual cosmetic optimization; maintains perfect server-client movement synchrony)" 
        />
        <FeatureMatrix 
          has={[
            "Pose Driver Node (converts raw joint angles directly to 0-1 parameter float values in the AnimGraph)",
            "ML Deformer Plugin with real-time neural model runtime evaluators",
            "Vertex Shader Material parameters linked automatically to mesh skinning matrices"
          ]}
          missing={[
            "Automatic mesh-to-rig muscle weight generation (requires manual Maya/Z-Brush authoring)",
            "Dynamic bones pruning in materials (unreferenced skeleton groups still execute shader paths)"
          ]}
          howToUse="Use standard Pose Space Deformation (Method A) for grunts and standard combat NPCs (zero CPU cost, cheap material cost). For major hero models like Geralt or bosses, enable ML Deformer. Set up LOD rules to deactivate the ML Deformer completely at LOD 2+ (beyond 15 meters) to preserve GPU pipelines."
        />
      </SectionCard>
    </div>
  </div>
);
