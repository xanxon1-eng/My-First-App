
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const TexturesTab = () => (
  <div className="space-y-6">
    <PageHeader 
      title="Textures, Streaming & Channel Packing" 
      subtitle="Architecting VRAM budgets, compression formats, and DirectStorage streaming pools for massive PC/Console Open-World RPGs (Witcher 3, BG3)." 
    />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">AAA Paradigm (No Mobile Focus)</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">In seamless open worlds, textures are the #1 cause of micro-stutters during fast travel and PCIe bus flooding. VRAM must be rigorously managed via Runtime Virtual Textures (RVT), Oodle Texture (BC7/BC5), and Channel Packing.</p>
    </HighlightBox>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="1. Oodle Texture & BC7/BC5 Compression" icon={Package} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3 text-kingfisher-muted">
          Raw 4K textures consume 64MB of VRAM uncompressed. In a single street scene in Novigrad, loading 500 uncompressed 4K textures demands 32GB of VRAM and paralyzes the render thread.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-3">
          <li><strong className="text-white">Albedo (Color):</strong> Compress using <strong>BC7</strong>. It provides incredibly high quality for RGB data while compressing 4K textures down to ~16MB.</li>
          <li><strong className="text-white">Normal Maps:</strong> Compress using <strong>BC5</strong>. It discards the B (Blue) channel and purely encodes Red and Green at higher bits (Z is mathematically reconstructed in the shader).</li>
          <li><strong className="text-white">Oodle Kraken:</strong> During game packaging, use Oodle to crush these BC7 textures even further for disk storage, significantly boosting SSD read speeds before decompression.</li>
        </ul>
        <MultiplayerImpact 
          gpu="-2.1ms (Reduces Texture Fetch bus latency in shader passes by utilizing compressed hardware samplers)" 
          cpu="-9.5ms (Lowers PCIe bus transfer lockups during level streaming)" 
          ram="-1.5GB System Cache" 
          vram="-4.5GB VRAM across heavy scenes"
          latency="0ms" 
        />
      </SectionCard>

      <SectionCard title="2. Optimal Channel Packing (ARM)" icon={Layers} color={COLORS.status.warning}>
        <p className="text-sm text-kingfisher-muted mb-3">Loading separate Grayscale textures for Ambient Occlusion, Roughness, and Metallic requires 3 individual <code>TextureSample</code> nodes in your material, costing shader instructions and eating memory bandwidth.</p>
        <p className="text-sm text-kingfisher-muted mb-3"><strong>Optimization:</strong> Combine them into a single texture asset (the ARM map). Read one texture, split the output.</p>
        <div className="bg-black/20 p-3 rounded-lg border border-kingfisher-border/30 text-xs text-kingfisher-muted mb-3 space-y-2 font-mono">
          <div className="flex gap-2"><span className="text-red-400 font-bold w-16">RED =</span> Ambient Occlusion</div>
          <div className="flex gap-2"><span className="text-emerald-400 font-bold w-16">GREEN =</span> Roughness</div>
          <div className="flex gap-2"><span className="text-blue-400 font-bold w-16">BLUE =</span> Metallic</div>
        </div>
        <MultiplayerImpact 
          gpu="-1.2ms (Cuts shader memory bandwidth fetches by 66% for PBR params)" 
          cpu="0ms" 
          ram="0MB" 
          vram="-1.8GB (Combines three 2K maps into one 2K map across thousands of materials)"
          latency="0ms"
        />
      </SectionCard>

      <SectionCard title="3. Runtime Virtual Textures (RVT) for Landscapes" icon={Map} color={COLORS.status.success}>
        <p className="text-sm text-kingfisher-muted mb-3">
          Detailed RPG terrains blend 10+ layers (Grass, Dirt, Mud, Rocks). Sampling 10 materials concurrently per-pixel causes massive overdraw and stalls hardware registers.
        </p>
        <p className="text-sm text-kingfisher-muted mb-3">
          <strong>RVT:</strong> The landscape renders all 10 layers once into a massive Virtual Texture (paged in memory). Grass meshes sticking out of the mud can sample the exact color of the ground underneath them using just <em>1 texture sample</em> to blend their roots seamlessly.
        </p>
        <div className="p-3 bg-emerald-500/5 rounded border border-emerald-500/20 text-xs text-emerald-100/90 mb-3">
          <strong>Result:</strong> Landscape Shader Complexity drops from Dark Red to Green. Shader instruction count drops from 450 to 90.
        </div>
        <MultiplayerImpact 
          gpu="-4.8ms GPU (Eliminates multi-layer landscape pixel overdraw and complex material math)" 
          cpu="0ms" 
          ram="-350MB System Caching" 
          vram="+128MB (Allocated RVT caching pool)"
          latency="0ms"
        />
      </SectionCard>

      <SectionCard title="4. Texture Streaming Pool & DirectStorage" icon={HardDrive} color={COLORS.kingfisher.warm}>
        <p className="text-sm text-kingfisher-muted mb-3">
          Riding a horse at high speeds causes massive stuttering if the CPU is forced to decode textures. Texture Pool thrashing (blurriness) occurs when VRAM limit is hit.
        </p>
        <CodeBlock code={`// DefaultEngine.ini
[/Script/Engine.RendererSettings]
r.Streaming.PoolSize=4000
r.Streaming.UseFixedPoolSize=1
r.Streaming.NumStaticComponentsProcessedPerFrame=50`} />
        <ul className="list-disc pl-5 mt-3 space-y-2 text-xs text-kingfisher-muted mb-3">
          <li><strong>Virtual Texture Streaming:</strong> Enable VT on most props to stream textures mathematically via tiles (pages) rather than loading entire megatextures simultaneously.</li>
          <li><strong>DirectStorage API (DX12):</strong> Use the GPU to decompress GDeflate assets directly from the NVMe SSD into VRAM. Bypasses the CPU completely.</li>
        </ul>
        <MultiplayerImpact 
          gpu="+0.3ms (Compute overhead during active async decompression)" 
          cpu="-12.0ms (Bypasses CPU decompression threads, eliminating navigation traversal hitches)" 
          ram="0MB" 
          vram="0MB"
          latency="0ms"
        />
      </SectionCard>
    </div>

    <SectionCard title="Texture Resolution Decision Matrix" icon={Monitor} color={COLORS.kingfisher.blue}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-kingfisher-muted">
        <div className="bg-black/20 p-3 rounded-lg border border-kingfisher-border/30">
          <strong className="text-white block mb-2 border-b border-kingfisher-border/50 pb-1">4K (4096×4096)</strong>
          <ul className="list-disc pl-5 space-y-1 mt-2 text-xs">
            <li>Main Hero Character (Cinematic cutscenes)</li>
            <li>Gigantic hero architectures (e.g. Castle Gates)</li>
            <li>Only ~20-30 permitted in VRAM simultaneously.</li>
          </ul>
        </div>
        <div className="bg-black/20 p-3 rounded-lg border border-kingfisher-border/30">
          <strong className="text-white block mb-2 border-b border-kingfisher-border/50 pb-1">2K (2048×2048)</strong>
          <ul className="list-disc pl-5 space-y-1 mt-2 text-xs">
            <li>Primary enemies and bosses</li>
            <li>Weapons and critical gear</li>
            <li>Standard building walls and large terrain features</li>
          </ul>
        </div>
        <div className="bg-black/20 p-3 rounded-lg border border-kingfisher-border/30">
          <strong className="text-white block mb-2 border-b border-kingfisher-border/50 pb-1">1K (1024×1024)</strong>
          <ul className="list-disc pl-5 space-y-1 mt-2 text-xs">
            <li>Standard environmental props (tables, chairs, chests)</li>
            <li>Most normal maps for secondary assets</li>
            <li>Background NPCs</li>
          </ul>
        </div>
        <div className="bg-black/20 p-3 rounded-lg border border-kingfisher-border/30">
          <strong className="text-white block mb-2 border-b border-kingfisher-border/50 pb-1">≤ 512×512</strong>
          <ul className="list-disc pl-5 space-y-1 mt-2 text-xs">
            <li>VFX Sprites, tiny debris (coins, rings)</li>
            <li>LOD3+ proxy meshes</li>
            <li>UI Elements (keep as vectors where possible)</li>
          </ul>
        </div>
      </div>
    </SectionCard>

    <div className="mt-6">
      <SectionCard title="Unreal Engine Workflow Constraints" icon={ShieldAlert} color={COLORS.status.info}>
        <FeatureMatrix 
          has={[
            "Oodle Data Compression plugin included by default",
            "Runtime Virtual Textures (RVT) available for direct landscape caching",
            "Streaming Virtual Texturing (SVT) reducing memory usage by paging tiles"
          ]}
          missing={[
            "Native auto-channel packer inside the engine (must pack in Substance/Photoshop first)",
            "Automatic texture resizing algorithms detecting screen-space density (you must manually downscale source files)",
            "DirectStorage integration without custom Github source builds or specific C++ pipeline overrides"
          ]}
          howToUse="Bake all complex materials (AO, Roughness, Metallic) into a single TGA file externally. Enable Virtual Texturing in Project Settings, and assign RVT Volumes physically spanning your landscape levels. Set up `r.VT.PoolSize` carefully in your configuration files based on the target 8GB/12GB VRAM console baseline."
        />
      </SectionCard>
    </div>
  </div>
);
