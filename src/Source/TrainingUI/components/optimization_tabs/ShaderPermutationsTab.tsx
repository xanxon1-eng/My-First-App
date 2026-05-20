
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const ShaderPermutationsTab = () => (
  <div className="space-y-6">
    <PageHeader title="Shader Permutation Profiling" subtitle="Shader compilation times, permutation reduction strategies for shipping builds." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Algorithm</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Algorithmic shader stripping to remove unused shader complexity at compile time.</p>
    </HighlightBox>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="What is a Permutation?" icon={Layers} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">A single Material generates multiple shaders under the hood based on:</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li>Static Switch Parameters (each combination is a separate shader).</li>
          <li>Usage flags (Used with Skeletal Mesh, Used with Instanced Static Mesh).</li>
          <li>Lighting scenarios (Point Lights, Directional Lights, CSM).</li>
        </ul>
        <HighlightBox type="warning" className="mt-3">
          1 Material with 3 Static Switches = 2^3 = 8 Permutations. 
          8 Permutations x 3 Usage Flags = 24 Shaders generated.
          This math scales exponentially!
        </HighlightBox>
      </SectionCard>
      <SectionCard title="Reduction Strategy" icon={Zap} color={COLORS.status.success}>
        <p className="text-sm mb-3">Massive permutation counts cause "Compiling Shaders..." delays and bloat game size.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-kingfisher-muted">
          <li><strong>Consolidate:</strong> Uncheck unused Material usage flags.</li>
          <li><strong>Avoid Static Switches:</strong> Use dynamic branches (lerps) if the shader is relatively cheap, sacrificing minor GPU cycles to save hundreds of permutations.</li>
          <li><strong>Review:</strong> Check Project Settings &gt; Cooker &gt; Material Shader Permutation count.</li>
        </ul>
      </SectionCard>
    </div>

    <SectionCard title="Shader Permutation Multi-Platform Cost & Hardware Impact" icon={Monitor} color={COLORS.kingfisher.blue}>
      <p className="text-sm text-kingfisher-muted mb-4 font-medium italic">Real hardware implications of heavy shader compiler permutations:</p>
      <MultiplayerImpact 
        gpu="Saves G-Buffer texture binding registers & avoids pipeline hazards" 
        cpu="Reduces local shader hitches (by up to 250ms per mesh spawn) and decreases Cook timings by minutes" 
        ram="Saves +85MB memory payload by unloading redundant PSO caches at engine boot" 
        latency="0ms (Prevents frame-rate stuttering during high-frequency asset spawning)" 
      />
      <FeatureMatrix 
        has={[
          "Material Shader cooking exclusion tables (Platform-specific target filters)",
          "Global shader permutation stripping toggles in project configuration menus",
          "Procedural pipeline state caching (PSO) for pre-compilation during loading screens"
        ]}
        missing={[
          "Dynamic run-time permutation unloading based on level load criteria (all compiled shaders remain resident in cooked packages)"
        ]}
        howToUse="Disable 'Support Point Lights' or 'Support Skeletal Meshes' in target material asset parameters to immediately collapse permutation variants by over 50% per Material template."
      />
    </SectionCard>
  </div>
);
