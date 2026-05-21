import React, { useState } from 'react';
import {
  Settings, ArrowLeft, Activity, Cpu, Monitor, Sun, Database, Network,
  Clock, HardDrive, Zap, LayoutTemplate, Box, Waves, CheckCircle, CircleDashed,
  ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Shield, Radio,
  Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music,
  Package, Eye, TrendingDown, Flame, GitBranch, Terminal, ShieldAlert, Smartphone, Map, Trash2, Code, Menu, X, Users, Grid,
  Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, ChevronDown, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COLORS } from '../../../constants/colors';
import { getEmbeddedTasks } from '../../TrainingCore/core/TrainingCore';
import { OPTIMIZATION_KNOWLEDGE_BASE } from '../../TrainingCore/core/OptimizationData';
import { OverviewTab, ProjectApplicationTab, LightingTab, AAAQualityProfilingTab, ModifierSandboxTab, AspectOverlapsTab } from "./optimization_tabs";
import { DynamicTab } from "./optimization_tabs/DynamicRenderer";

const TAB_TO_COMPONENT_NAME: Record<string, string> = {
  pipeline: 'PipelineTab',
  architecture: 'ArchitectureTab',
  mass_entity: 'MassEntityTab',
  cpp_optimal: 'CppOptimalTab',
  head_manager: 'HeadManagerTab',
  draw_calls: 'DrawCallsTab',
  gpu: 'GeometryTab',
  lod: 'LODTab',
  materials: 'MaterialsTab',
  textures: 'TexturesTab',
  lighting: 'LightingTab',
  postprocess: 'PostProcessTab',
  gi_caching: 'GICachingTab',
  occlusion: 'OcclusionTab',
  collision: 'CollisionTab',
  memory_state: 'MemoryStateTab',
  network_physics: 'NetworkingPhysicsTab',
  rewind_physics: 'RewindPhysicsTab',
  iris_replication: 'IrisReplicationTab',
  server_protocol: 'ServerProtocolTab',
  decoupled_backend: 'DecoupledBackendTab',
  deterministic: 'DeterministicSyncTab',
  world_partition: 'WorldPartitionTab',
  client_pred: 'ClientPredictionTab',
  fast_array: 'FastArrayTab',
  interest_mgmt: 'InterestManagementTab',
  asset_manager: 'AssetManagerTab',
  gc_clustering: 'GCClusteringTab',
  boids_flocking: 'BoidsFlockingTab',
  npc: 'AITab',
  animation_audio: 'AnimationAudioTab',
  scalability: 'ScalabilityTab',
  budgets: 'BudgetsTab',
  storage: 'StorageTab',
  aaa_profiling: 'AAAQualityProfilingTab',
  tools_overview: 'ProfilingDebugTestingTab',
  live_memory: 'LiveMemoryTab',
  debug_overlays: 'DebugOverlaysTab',
  multithreading: 'MultithreadingTab',
  subsystems: 'SubsystemsTab',
  shader_permutations: 'ShaderPermutationsTab',
  ui_umg: 'UIUMGTab',
  optimal_algorithms: 'OptimalAlgorithmsTab'
};

interface OptimizationGuideProps {
  onBack: () => void;
}

const TAB_GROUPS = [
  {
    title: 'Status & Overview',
    tabs: [
      { id: 'overview',         label: 'Implementation Status',    icon: ClipboardList },
      { id: 'aspect_overlaps',  label: 'Aspect Overlaps Analysis', icon: Shuffle },
      { id: 'project_appl',     label: 'RPG Goal Application',     icon: Sword },
    ]
  },
  {
    title: 'Architecture & CPU',
    tabs: [
      { id: 'pipeline',         label: '16.7ms Pipeline',          icon: Activity },
      { id: 'architecture',     label: 'CPU & RAM Architecture',   icon: Cpu },
      { id: 'mass_entity',      label: 'Mass Entity / ECS Rollout',icon: Grid },
      { id: 'head_manager',     label: 'Head Manager Pattern',     icon: Hexagon },
      { id: 'multithreading',   label: 'Multithreading & Async',   icon: Network },
      { id: 'cpp_optimal',      label: 'Optimal C++ Practices',    icon: Code },
      { id: 'memory_state',     label: 'Memory & State Arch',      icon: Folder },
      { id: 'gc_clustering',    label: 'GC Object Clustering',     icon: Trash2 },
      { id: 'asset_manager',    label: 'Asset Manager Chunks',     icon: Database },
      { id: 'subsystems',       label: 'Subsystems Architecture',  icon: Database },
    ]
  },
  {
    title: 'Multiplayer & Netcode',
    tabs: [
      { id: 'network_physics',  label: 'Networking & Physics',     icon: Globe },
      { id: 'rewind_physics',   label: 'Server Rewind Physics',    icon: Radio },
      { id: 'iris_replication', label: 'IRIS Replication Engine',  icon: Wifi },
      { id: 'server_protocol',  label: 'Auth Server Protocol',     icon: ShieldAlert },
      { id: 'decoupled_backend',label: 'Decoupled Backend Node',   icon: Server },
      { id: 'deterministic',    label: 'Deterministic Sync',       icon: Clock },
      { id: 'client_pred',      label: 'Client-Side Prediction',   icon: Zap },
      { id: 'fast_array',       label: 'Fast Array Serializers',   icon: Layers },
      { id: 'interest_mgmt',    label: 'Interest Management',      icon: Crosshair },
      { id: 'world_partition',  label: 'World Partition Culling',  icon: Map },
    ]
  },
  {
    title: 'Rendering & Graphics',
    tabs: [
      { id: 'draw_calls',       label: 'Draw Calls & Instancing',  icon: BarChart3 },
      { id: 'gpu',              label: 'GPU Geometry & Nanite',    icon: Box },
      { id: 'lod',              label: 'LOD Systems',              icon: Triangle },
      { id: 'materials',        label: 'Materials & Shaders',      icon: Palette },
      { id: 'shader_permutations', label: 'Shader Permutations',   icon: Layers },
      { id: 'textures',         label: 'Textures & Streaming',     icon: Image },
      { id: 'lighting',         label: 'Light & Shadows',          icon: Sun },
      { id: 'postprocess',      label: 'Post-Process & Upscaling', icon: Monitor },
      { id: 'gi_caching',       label: 'GI Dynamic Caching',       icon: Waves },
    ]
  },
  {
    title: 'Game Systems & Logic',
    tabs: [
      { id: 'modifier_sandbox', label: 'Modifier Balance & Chaos Bot', icon: Shield },
      { id: 'optimal_algorithms', label: 'Optimal Algorithms',       icon: GitBranch },
      { id: 'collision',        label: 'Collision & Traces',       icon: Crosshair },
      { id: 'occlusion',        label: 'Occlusion & Visibility',   icon: Eye },
      { id: 'boids_flocking',   label: 'Boids Flocking AI bg',     icon: Trees },
      { id: 'npc',              label: 'World AI Simulation',      icon: Network },
      { id: 'animation_audio',  label: 'Animation & Audio',        icon: Music },
      { id: 'ui_umg',           label: 'UI & UMG Optimization',    icon: LayoutTemplate },
    ]
  },
  {
    title: 'Profiling & Tools',
    tabs: [
      { id: 'aaa_profiling',    label: 'AAA Quality Profiling',    icon: Zap },
      { id: 'tools_overview',   label: 'Debug & Test Tools',       icon: Terminal },
      { id: 'live_memory',      label: 'Live Memory Connect',      icon: Radio },
      { id: 'debug_overlays',   label: 'Visual Debug Overlays',    icon: EyeOff },
      { id: 'scalability',      label: 'Scalability & CVars',      icon: Sliders },
      { id: 'budgets',          label: 'Budgets & Tools',          icon: Database },
      { id: 'storage',          label: 'Disk / Install Storage',   icon: HardDrive },
    ]
  }
];

export const OptimizationGuide: React.FC<OptimizationGuideProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState(TAB_GROUPS[0].tabs[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleTabSelect = (id: string) => {
    setActiveTab(id);
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    if (activeTab === 'overview') return <OverviewTab onNavigate={setActiveTab} />;
    if (activeTab === 'aspect_overlaps') return <AspectOverlapsTab />;
    if (activeTab === 'project_appl') return <ProjectApplicationTab />;
    if (activeTab === 'lighting') return <LightingTab />;
    if (activeTab === 'aaa_profiling') return <AAAQualityProfilingTab />;
    if (activeTab === 'modifier_sandbox') return <ModifierSandboxTab />;
    
    const componentName = TAB_TO_COMPONENT_NAME[activeTab];
    if (componentName) {
        return <DynamicTab tabId={componentName} />;
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full w-full bg-kingfisher-dark text-kingfisher-surface font-sans overflow-hidden">
      <header className="h-14 border-b border-kingfisher-border bg-kingfisher-panel flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 -ml-2 text-kingfisher-muted hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={toggleSidebar} 
            className="p-2 lg:hidden text-kingfisher-muted hover:text-white transition-colors"
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-3 ml-1 sm:ml-2">
            <div className="w-8 h-8 bg-kingfisher-deep rounded-md flex items-center justify-center text-white shadow-md shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="font-semibold tracking-wide text-sm text-white truncate max-w-[150px] sm:max-w-none">
              Optimization <span style={{ color: COLORS.kingfisher.warm }}>Guide</span>
            </h1>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Multiplayer Optimized</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            />
          )}
        </AnimatePresence>

        <aside className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-kingfisher-dark lg:relative lg:bg-kingfisher-panel/30
          border-r border-kingfisher-border flex flex-col p-4 shrink-0 overflow-y-auto custom-scrollbar
          transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="flex flex-col gap-6 pt-14 lg:pt-0">
            {TAB_GROUPS.map((group, groupIdx) => (
              <div key={groupIdx} className="flex flex-col">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-kingfisher-muted/60 mb-3 pl-2 flex items-center gap-2">
                  <div className="h-px flex-1 bg-kingfisher-border/30" />
                  {group.title}
                  <div className="h-px w-4 bg-kingfisher-border/30" />
                </div>
                <div className="flex flex-col gap-1">
                  {group.tabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabSelect(tab.id)}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-kingfisher-blue/20 text-white shadow-[0_0_15px_-5px_rgba(120,127,178,0.4)] border border-kingfisher-blue/40'
                            : 'text-kingfisher-muted hover:bg-white/5 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-kingfisher-blue/30 text-white' : 'text-kingfisher-muted group-hover:text-white'}`}>
                          <Icon className="w-4 h-4 shrink-0" />
                        </div>
                        <span className="truncate">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar bg-kingfisher-dark/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="max-w-6xl mx-auto"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default OptimizationGuide;