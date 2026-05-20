
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const DrawCallsTab = () => (
  <div className="space-y-6">
    <PageHeader title="Draw Calls & Instancing" subtitle="Every unique mesh submission is a CPU-to-GPU command. Too many commands starve the bus and cripple frame rates." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">GPU-driven culling algorithms (Frustum, Occlusion, Detail) and spatial clustering for instancing.</p>
    </HighlightBox>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Performance Constraints" icon={BarChart3} color={COLORS.status.error}>
        <p className="text-sm mb-3">On PC, Direct3D 12 reduces call cost, but Mobile (Vulkan/OpenGL ES) still suffers massive CPU penalties per unique mesh.</p>
        <MultiplayerImpact 
          gpu="High (Vertex Bound)" 
          cpu="Critical (Draw Thread)" 
          ram="+150MB (Batches)" 
          latency="+0.5ms per 1k calls" 
        />
        <div className="mt-4 p-3 bg-red-950/30 border border-red-500/20 rounded text-xs">
          <strong className="text-red-400">The 1,000 Rule:</strong> Target &lt; 1,000 calls on mobile and &lt; 3,000 on PC for 60 FPS.
        </div>
      </SectionCard>

      <SectionCard title="Instancing (HISM / ISM)" icon={Layers} color={COLORS.status.success}>
        <p className="text-sm mb-3">Hierarchical Instanced Static Meshes allow one draw call for thousands of identical items (Foliage/Rocks).</p>
        <FeatureMatrix 
          has={[
            "Automated Instancing (HISM)",
            "LOD support for instances",
            "Distance-based cluster culling"
          ]}
          missing={[
            "Auto-merging of unique meshes",
            "Multi-Material instancing batching",
            "GPU-driven occlusion for HISM"
          ]}
          howToUse="Use the `Merge Actors` tool to bake different props into a single HISM set to reduce draws by up to 80%."
        />
      </SectionCard>
    </div>
  </div>
);
