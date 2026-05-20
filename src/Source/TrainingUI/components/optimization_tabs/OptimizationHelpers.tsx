
import React, { useState } from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, ChevronDown, ChevronRight, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
export const FeatureMatrix = ({ has = [], missing = [], howToUse }: { has?: string[]; missing?: string[]; howToUse: string }) => {
  const safeHas = Array.isArray(has) ? has : [];
  const safeMissing = Array.isArray(missing) ? missing : [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
        <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-[10px] uppercase">
          <CheckCircle className="w-3 h-3" /> UE Built-in Features
        </div>
        <ul className="space-y-1">
          {safeHas.map((item, i) => (
            <li key={i} className="text-xs text-kingfisher-muted flex items-start gap-2">
              <span className="text-emerald-500 mt-1">•</span> {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
        <div className="flex items-center gap-2 mb-2 text-red-400 font-bold text-[10px] uppercase">
          <X className="w-3 h-3" /> Missing / Needs Custom
        </div>
        <ul className="space-y-1">
          {safeMissing.map((item, i) => (
            <li key={i} className="text-xs text-kingfisher-muted flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span> {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="md:col-span-2 p-3 rounded-lg bg-kingfisher-blue/5 border border-kingfisher-blue/20 text-xs text-kingfisher-surface italic">
        <strong>Implementation:</strong> {howToUse}
      </div>
    </div>
  );
};
export const MultiplayerImpact = ({ gpu, cpu, ram, vram, latency }: { gpu: string; cpu: string; ram: string; vram?: string; latency: string }) => (
  <div className={`grid grid-cols-2 ${vram ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-3 mt-4`}>
    {[
      { label: 'GPU Demand', value: gpu, icon: Monitor, color: 'text-blue-400' },
      { label: 'CPU Load', value: cpu, icon: Cpu, color: 'text-amber-400' },
      { label: 'System RAM', value: ram, icon: Database, color: 'text-purple-400' },
      ...(vram ? [{ label: 'VRAM Usage', value: vram, icon: HardDrive, color: 'text-pink-400' }] : []),
      { label: 'Ping / Latency', value: latency, icon: Radio, color: 'text-emerald-400' },
    ].map((item, i) => (
      <div key={i} className="bg-black/20 p-2 rounded-lg border border-white/5">
        <div className="flex items-center gap-1.5 mb-1">
          <item.icon className={`w-3 h-3 ${item.color}`} />
          <span className="text-[9px] uppercase font-bold text-kingfisher-muted/70">{item.label}</span>
        </div>
        <div className="text-xs font-mono font-bold text-white leading-tight">{item.value}</div>
      </div>
    ))}
  </div>
);
export const SectionCard = ({ title, icon: Icon, color = COLORS.kingfisher.blue, children, className = '' }: any) => (
  <div className={`bg-kingfisher-panel/80 border border-kingfisher-border rounded-xl p-6 shadow-md ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      {Icon && <div className="p-2 rounded-lg bg-black/20"><Icon className="w-5 h-5" color={color} /></div>}
      <h3 className="font-semibold text-white text-lg tracking-wide">{title}</h3>
    </div>
    <div className="text-sm text-kingfisher-surface space-y-4 leading-relaxed">{children}</div>
  </div>
);
export const HighlightBox = ({ children, type = 'info', className = '' }: any) => {
  const colors: Record<string, string> = {
    info:    'border-blue-500/30 bg-blue-500/10 text-blue-100',
    warning: 'border-amber-500/30 bg-amber-500/10 text-amber-100',
    danger:  'border-red-500/30 bg-red-500/10 text-red-100',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100',
  };
  return (
    <div className={`p-4 rounded-lg border ${colors[type]} text-sm font-medium leading-relaxed ${className}`}>
      {children}
    </div>
  );
};
export const StatRow = ({ label, value, note, color = 'text-white' }: { label: string; value: string; note?: string; color?: string }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-kingfisher-border/40 last:border-0">
    <span className="text-kingfisher-muted text-sm">{label}</span>
    <div className="text-right">
      <span className={`font-mono text-sm font-semibold ${color}`}>{value}</span>
      {note && <span className="text-xs text-kingfisher-muted ml-2">({note})</span>}
    </div>
  </div>
);
export const PageHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
    <p className="text-kingfisher-muted">{subtitle}</p>
  </div>
);
export const CodeBlock = ({ code, language = 'cpp' }: { code: string; language?: string }) => (
  <div className="relative">
    <div className="absolute top-2 right-2 text-[9px] font-mono text-kingfisher-muted/50 uppercase tracking-widest">{language}</div>
    <pre className="bg-black/50 border border-kingfisher-border/40 rounded-xl p-4 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
      {code.trim()}
    </pre>
  </div>
);

export const Collapsible = ({ title, icon: Icon, color, badge, children }: any) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-kingfisher-border/50 rounded-2xl overflow-hidden shadow-sm bg-kingfisher-panel/30 mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-black/30 hover:bg-black/50 transition-colors border-b border-kingfisher-border/30"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5" color={color} />}
          <span className="text-white font-bold text-base">{title}</span>
          {badge && (
            <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center justify-center bg-black/60 shadow-inner" style={{ color }}>
              {badge}
            </span>
          )}
        </div>
        <div className="p-1 rounded bg-black/40 border border-white/5">
        {open ? (
          <ChevronDown className="w-4 h-4 text-kingfisher-muted" />
        ) : (
          <ChevronRight className="w-4 h-4 text-kingfisher-muted" />
        )}
        </div>
      </button>
      {open && (
        <div className="p-5">
          {children}
        </div>
      )}
    </div>
  );
};
