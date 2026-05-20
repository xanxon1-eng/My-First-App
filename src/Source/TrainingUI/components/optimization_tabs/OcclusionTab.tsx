
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const OcclusionTab = () => (
  <div className="space-y-6">
    <PageHeader title="Occlusion & Visibility Culling" subtitle="Don't render what the player can't see. Culling is free performance — it eliminates work entirely before the GPU touches it." />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Hardware Occlusion Queries (HOQ)" icon={Eye} color={COLORS.status.info}>
        <p className="font-semibold text-white mb-2">GPU Asks: Is This Object Behind Something?</p>
        <p className="text-sm text-kingfisher-muted mb-3">UE5 submits lightweight bounding box tests to the GPU before the full draw call. If the box is entirely behind other geometry, the full mesh is skipped.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li>Cost: ~0.5ms per frame for the query pass.</li>
          <li>Benefit: Can save 30–60% draw calls in dense urban environments with lots of interior occlusion.</li>
          <li>Latency: Results arrive one frame late — tiny objects may flicker when emerging from occlusion.</li>
          <li>Enable: <code>r.HZBOcclusion=1</code> (default on), use Hierarchical Z-Buffer for the query.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Precomputed Visibility (PVS)" icon={Layers} color={COLORS.status.success}>
        <p className="font-semibold text-white mb-2">Bake Visibility for Fixed Camera Paths</p>
        <p className="text-sm text-kingfisher-muted mb-3">For level corridors, interiors, or any scene with known camera positions, PVS pre-calculates exactly which objects are visible from each cell — zero runtime cost.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li>Enable: Place <code>PrecomputedVisibilityVolume</code> actors over playable areas.</li>
          <li>Build: Lighting build pipeline includes PVS calculation.</li>
          <li>Result: Each camera cell has a precomputed list of visible actors. Query = array lookup (nanoseconds).</li>
          <li>Limitation: Not useful for fully open-world games with no fixed paths.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Cull Distance Volumes" icon={TrendingDown} color={COLORS.kingfisher.warm}>
        <p className="font-semibold text-white mb-2">Force Distance-Based Culling per Zone</p>
        <p className="text-sm text-kingfisher-muted mb-3">Place <code>CullDistanceVolume</code> actors to override the default Max Draw Distance for objects inside the volume — aggressive culling for dense interior areas.</p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-kingfisher-muted">
          <li>Small props (cups, papers): cull at 15m max.</li>
          <li>Medium props (furniture): cull at 40m max.</li>
          <li>Architecture elements: cull at 200m.</li>
          <li>Skybox / atmospheric elements: never cull.</li>
        </ul>
        <div className="mt-3 p-2 bg-black/20 rounded text-xs font-mono text-amber-300 border border-amber-500/20">
          r.MaxAnisotropy applies per-texture. Cull Distances apply per-actor-class.
        </div>
      </SectionCard>
      <SectionCard title="Frustum Culling & Distance Cull" icon={Monitor} color={COLORS.kingfisher.blue}>
        <p className="font-semibold text-white mb-2">Built-In Culling (Always Active)</p>
        <div className="space-y-3 text-sm text-kingfisher-muted">
          <div className="p-2 bg-black/20 rounded">
            <strong className="text-white">Frustum Culling:</strong> Objects entirely outside the camera's view frustum (FOV cone) are instantly skipped. Zero cost. Always enabled.
          </div>
          <div className="p-2 bg-black/20 rounded">
            <strong className="text-white">Distance Culling:</strong> Objects beyond their Max Draw Distance are removed from the render queue. Set per-mesh in Static Mesh settings or via Cull Distance Volume.
          </div>
          <div className="p-2 bg-black/20 rounded">
            <strong className="text-white">Significance Manager:</strong> Unreal's higher-level system that controls LOD, tick rate, and culling based on player distance + screen importance. Essential for open-world NPC optimization.
          </div>
        </div>
      </SectionCard>
    </div>

    <SectionCard title="Occlusion & Visibility Hardware Impact Masterclass" icon={Monitor} color={COLORS.kingfisher.blue} className="mt-6">
      <p className="text-sm text-kingfisher-muted mb-4 font-medium italic">Detailed analysis of how occlusion queries and spatial caching affect game execution:</p>
      <MultiplayerImpact 
        gpu="-3.5ms (Culling over 60% of background mesh polygons prevents vertex/pixel shader overload)" 
        cpu="+0.8ms CPU (Hardware Occlusion Queries and HZB mipmap construction require Render Thread time)" 
        ram="+12MB (Stores active Hierarchical Z-Buffer textures and distance volume boundaries)" 
        vram="+35MB (Active Depth and Stencil buffers used to mask off-screen geometry rendering)"
        latency="0ms (No net impact; occlusion is completely handled on the local drawing thread)" 
      />
      <FeatureMatrix 
        has={[
          "HZB Occlusion Queries (combines Draw calls into parent bounding representations to save roundtrips)",
          "Distance Field Occlusion (uses global Signed Distance Fields to cull grass and pebbles cheaply)",
          "Precomputed Visibility Volumes (cell-based visibility lists for small and medium static items)"
        ]}
        missing={[
          "Dynamic portals for moving doorways in open worlds (cannot easily transition static volumes around elevators)",
          "Automatic foliage-frustum alignment (dense grass still processes index arrays before rejection)"
        ]}
        howToUse="Place a 'Cull Distance Volume' overlaying your densely packed RPG hubs like Novigrad or Baldur's Gate streets. Set size arrays (e.g. Size 10 @ 1500m, Size 50 @ 4000m). For high-performance open worlds, ensure 'HZB Occlusion' is enabled via console command r.HZBOcclusion=1 to query occlusion on the GPU instead of incurring Game Thread stall roundtrips."
      />
    </SectionCard>
  </div>
);
