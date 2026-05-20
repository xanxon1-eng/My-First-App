
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const StorageTab = () => (
  <div className="space-y-6">
    <PageHeader title="Storage & Disk I/O" subtitle="Algorithmic chunk streaming and Kraken compression." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Oodle & Kraken Compression" icon={HardDrive} color={COLORS.kingfisher.warm}>
        <p className="text-sm mb-3">Uses advanced dictionary compression (Oodle Kraken) to decompress VRAM and system assets asynchronously on the CPU during dynamic level loads.</p>
        <div className="p-3 bg-black/20 rounded border border-amber-500/10 text-xs mb-3">
          <strong className="text-amber-400 block mb-1">RPG Streaming Use-Case:</strong>
          <p className="text-kingfisher-muted text-xs leading-normal">Massive RPGs like The Witcher 3 feature huge landscapes. Compacting world partition grids into separate Pak chunks compressed with Kraken guarantees smooth, hitch-free level loading at 100MB/s speeds.</p>
        </div>
        <MultiplayerImpact 
          gpu="0ms (GPU completely bypassed for decompression pipelines)" 
          cpu="-4.0ms saving on CPU I/O Thread (Kraken decodes up to 40% faster than standard zlib)" 
          ram="+250MB System load buffer cache" 
          vram="0ms" 
          latency="0ms" 
        />
        <FeatureMatrix 
          has={["Oodle Kraken & Oodle Texture built-in configurations", "ZenLoader Async serialization loader"]}
          missing={["Procedural texture generator wrappers", "VRAM garbage purger (requires manual asset unloading rules)"]}
          howToUse="Navigate to 'Project Settings' -> 'Packaging'. In Compression settings, check 'Enable Oodle' and select 'Kraken' with compression level set to 5."
        />
      </SectionCard>

      <SectionCard title="Asset Pack Chunking (PAK)" icon={Layers} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">Divide your 60GB RPG assets into localized chunks. Avoid packing everything into a single massive file which slows patch updates and loads.</p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted">
          <li><strong>Chunk 1 (Core):</strong> Essential boot assets, primary hero model (Geralt), UI assets. Always loaded.</li>
          <li><strong>Chunk 2 (Velen):</strong> Regional textures, local monster meshes, region audio. Loaded only in Velen.</li>
          <li><strong>Chunk 3 (Skellige):</strong> Mountain rocks, ocean materials, Skellige NPC armor. Offloaded completely while inside Velen.</li>
        </ul>
        <MultiplayerImpact 
          gpu="0ms" 
          cpu="0ms" 
          ram="Saves -820MB RAM (By loading only active region dependencies)" 
          vram="Saves -1.4GB VRAM (Avoids staging irrelevant foliage/rock textures)" 
          latency="0ms" 
        />
      </SectionCard>
    </div>
  </div>
);
