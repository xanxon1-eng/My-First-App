import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Play, ShieldAlert, CheckCircle2, AlertOctagon, HelpCircle, 
  Database, Cpu, GitBranch, Share2, Award, Zap, RefreshCw, BarChart3, 
  Layers, Terminal, Server, Plus, Trash2, Sliders, Settings, Code, Check
} from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

interface GameModifier {
  id: string;
  name: string;
  sourceTag: string;
  targetTag: string;
  type: 'scale' | 'trigger' | 'convert';
  value: number; // e.g., scaling multiplier or trigger rate
  isCustom?: boolean;
}

export const ModifierSandboxTab: React.FC = () => {
  // Predefined modifiers simulating RPG items/passives
  const DEFAULT_MODIFIERS: GameModifier[] = [
    { id: 'mod_1', name: 'Ashen Catalyst (Passive)', sourceTag: 'Fire', targetTag: 'Fire', type: 'scale', value: 1.3 },
    { id: 'mod_2', name: 'Grave-Pact Poisonous Spines (Unique Chest)', sourceTag: 'Fire', targetTag: 'Poison', type: 'trigger', value: 1.0 },
    { id: 'mod_3', name: 'Toxic Infusion (Amulet)', sourceTag: 'Poison', targetTag: 'Physical', type: 'scale', value: 1.2 },
    { id: 'mod_4', name: 'Crazed Zealot\'s Aegis (Keystone)', sourceTag: 'Poison', targetTag: 'EHP', type: 'scale', value: 1.15 },
    { id: 'mod_5', name: 'Infernal Fuel Cycle (Unique Ring)', sourceTag: 'Poison', targetTag: 'Fire', type: 'trigger', value: 1.0 }, // Loop inducer with mod_2!
    { id: 'mod_6', name: 'Echoing Incantation (Ring)', sourceTag: 'Spell', targetTag: 'ActionSpeed', type: 'scale', value: 1.25 },
    { id: 'mod_7', name: 'Frenzied Spark Matrix (Gem)', sourceTag: 'ActionSpeed', targetTag: 'Spell', type: 'trigger', value: 1.0 }, // Loop with mod_6
  ];

  const [activeModifiers, setActiveModifiers] = useState<GameModifier[]>([
    DEFAULT_MODIFIERS[0], DEFAULT_MODIFIERS[1], DEFAULT_MODIFIERS[2], DEFAULT_MODIFIERS[3]
  ]);

  // Mod construction state
  const [newModName, setNewModName] = useState('');
  const [newModSource, setNewModSource] = useState('Fire');
  const [newModTarget, setNewModTarget] = useState('Poison');
  const [newModType, setNewModType] = useState<'scale' | 'trigger' | 'convert'>('trigger');
  const [newModValue, setNewModValue] = useState(1.0);

  // Simulation controls
  const [mathGuardrails, setMathGuardrails] = useState<boolean>(false);
  const [isBotSimulating, setIsBotSimulating] = useState<boolean>(false);
  const [botLogs, setBotLogs] = useState<string[]>([]);
  const [botCount, setBotCount] = useState<number>(1000);
  const [anomalies, setAnomalies] = useState<any[]>([]);

  // Genetic mutator state
  const [isGeneticRunning, setIsGeneticRunning] = useState<boolean>(false);
  const [genCount, setGenCount] = useState<number>(0);
  const [topBuilds, setTopBuilds] = useState<any[]>([]);
  const [geneticProgress, setGeneticProgress] = useState<number>(0);

  // Graph Loop Detection variables
  const [detectedLoops, setDetectedLoops] = useState<string[][]>([]);

  // Simulation timer ref so we can cancel it
  const botSimTimer = useRef<any>(null);
  const geneticTimer = useRef<any>(null);

  // 1. Run Loop Analysis (Static Graph validation) whenever activeModifiers change
  useEffect(() => {
    analyzeGraphLoops();
  }, [activeModifiers]);

  const analyzeGraphLoops = () => {
    // Build adjacency list tags: Fire, Poison, Physical, Spell, ActionSpeed, EHP, etc.
    const adj: Record<string, string[]> = {};
    activeModifiers.forEach(m => {
      if (!adj[m.sourceTag]) adj[m.sourceTag] = [];
      adj[m.sourceTag].push(m.targetTag);
    });

    const loops: string[][] = [];
    const visited = new Set<string>();
    const recStack: string[] = [];

    const dfs = (node: string) => {
      visited.add(node);
      recStack.push(node);

      const neighbors = adj[node] || [];
      for (const next of neighbors) {
        if (!visited.has(next)) {
          dfs(next);
        } else if (recStack.includes(next)) {
          // Found cycle!
          const cycleStartIdx = recStack.indexOf(next);
          const cycle = recStack.slice(cycleStartIdx);
          cycle.push(next); // Complete the loop visually
          // Avoid duplicate loops in display
          const cycleStr = cycle.join('->');
          if (!loops.some(l => l.join('->') === cycleStr)) {
            loops.push(cycle);
          }
        }
      }

      recStack.pop();
    };

    const allNodes = Array.from(new Set(activeModifiers.flatMap(m => [m.sourceTag, m.targetTag])));
    allNodes.forEach(node => {
      visited.clear();
      recStack.length = 0;
      dfs(node);
    });

    setDetectedLoops(loops);
  };

  const handleAddModifier = () => {
    if (!newModName.trim()) return;
    const newMod: GameModifier = {
      id: 'custom_' + Date.now(),
      name: `${newModName} (Custom)`,
      sourceTag: newModSource,
      targetTag: newModTarget,
      type: newModType,
      value: newModValue,
      isCustom: true
    };
    setActiveModifiers(prev => [...prev, newMod]);
    setNewModName('');
  };

  const handleRemoveModifier = (id: string) => {
    setActiveModifiers(prev => prev.filter(m => m.id !== id));
  };

  const handleResetModifiers = () => {
    setActiveModifiers([
      DEFAULT_MODIFIERS[0], DEFAULT_MODIFIERS[1], DEFAULT_MODIFIERS[2], DEFAULT_MODIFIERS[3]
    ]);
  };

  // 2. Headless Chaos Bot Simulation Simulation
  const runChaosSimulation = () => {
    if (isBotSimulating) {
      clearInterval(botSimTimer.current);
      setIsBotSimulating(false);
      return;
    }

    setIsBotSimulating(true);
    setAnomalies([]);
    setBotLogs(["[CHAOS ENGINE] Warming headless server ticks pool... Ready.", `[CHAOS ENGINE] Synthesizing ${botCount} randomized bot combinations...`]);

    let botsCompiled = 0;
    const mockAnomalies: any[] = [];
    const logs: string[] = [];

    botSimTimer.current = setInterval(() => {
      if (botsCompiled >= botCount) {
        clearInterval(botSimTimer.current);
        setIsBotSimulating(false);
        logs.push(`[SYSTEM COMPLETE] Ran ${botCount} matrix loops. Isolated ${mockAnomalies.length} anomalous setups.`);
        setBotLogs([...logs]);
        return;
      }

      const countThisTick = Math.min(100, botCount - botsCompiled);
      botsCompiled += countThisTick;

      // Simulate bot runs and evaluations based on modifiers
      for (let i = 0; i < countThisTick / 10; i++) {
        const botName = `BuildBot#${Math.floor(Math.random() * 9000 + 1000)}`;
        const hasLoop = detectedLoops.length > 0;
        
        let dps = Math.floor(Math.random() * 85000 + 15000);
        let ehp = Math.floor(Math.random() * 250000 + 50000);
        let actionSpeed = 100; // baseline
        let triggerFrequency = 1.0; // ticks
        let status = "NORMAL";

        // Boost stats dynamically depending on active rules
        activeModifiers.forEach(m => {
          if (m.type === 'scale') {
            if (m.targetTag === 'Fire' || m.targetTag === 'Physical') dps = Math.floor(dps * m.value);
            if (m.targetTag === 'EHP') ehp = Math.floor(ehp * m.value);
            if (m.targetTag === 'ActionSpeed') actionSpeed = Math.floor(actionSpeed * m.value);
          }
          if (m.type === 'trigger') {
            triggerFrequency += 0.5;
          }
        });

        // Loop modifiers causes absolute arithmetic explosion if guardrails are OFF!
        if (hasLoop) {
          if (!mathGuardrails) {
            dps = dps * 12500; // Explodes DPS
            ehp = ehp * 350;   // Explodes Health
            actionSpeed += 1250;
            triggerFrequency = 0.01; // Infinite triggers per tick
            status = "🚨 EXTREME OUTLIER";
          } else {
            // Under asymptotic guardrails! Modifiers hit log barriers
            dps = Math.floor(dps * (1 + Math.log(triggerFrequency + 1) * 1.5));
            ehp = Math.min(2500000, Math.floor(ehp * 1.8)); // Hard EHP budgeted cap
            actionSpeed = Math.min(300, actionSpeed + 50); // Hard action cap
            status = "🛡️ GUARDED_ACCORD";
          }
        }

        const isDpsAnomaly = dps > 500000000 || dps > 200000000;
        const isEhpAnomaly = ehp > 10000000;
        const isActionAnomaly = actionSpeed > 300 || triggerFrequency < 0.1;

        if (isDpsAnomaly || isEhpAnomaly || isActionAnomaly) {
          const detail = isDpsAnomaly 
            ? `DPS hit ${dps.toLocaleString()} (Threshold: 500M cap)` 
            : isEhpAnomaly 
              ? `EHP hit ${ehp.toLocaleString()} (Threshold: 10M cap)`
              : `Action loop frequency at ${triggerFrequency} ticks/cast.`;
          
          mockAnomalies.push({
            bot: botName,
            dps,
            ehp,
            actionSpeed: `${actionSpeed}%`,
            reason: detail,
            guard: mathGuardrails ? "Guarded Cap Applied" : "CRITICAL RUNTIME SPIKE"
          });
        }
      }

      setAnomalies([...mockAnomalies]);
      logs.push(`[MATRIX EVAL] Swept bots ${botsCompiled}/${botCount}... Detected ${mockAnomalies.length} anomalous outputs.`);
      setBotLogs([...logs]);
    }, 150);
  };

  // 3. Genetic Mutator Algorithm Simulation
  const runGeneticAlgorithm = () => {
    if (isGeneticRunning) {
      clearInterval(geneticTimer.current);
      setIsGeneticRunning(false);
      return;
    }

    setIsGeneticRunning(true);
    setGenCount(0);
    setGeneticProgress(0);
    
    // Initial generation builds
    const skills = ["Poison Siphon", "Firestorm Cyclone", "Glacial Static Strike", "Ethereal Blade Cleave", "Necrotic Shield Desync"];
    const keystones = ["Crimson Dance", "Chaos Inoculation", "Eldritch Battery", "Perfect Agony", "Resolute Technique"];

    let currentGen = 1;
    let initialLeaderboard = Array.from({ length: 6 }).map((_, i) => {
      const parentSkill = skills[Math.floor(Math.random() * skills.length)];
      const parentStone = keystones[Math.floor(Math.random() * keystones.length)];
      return {
        id: i,
        chromosome: `${parentSkill} + ${parentStone}`,
        generation: 1,
        fitnessDps: Math.floor(Math.random() * 85000 + 45000),
        ehp: Math.floor(Math.random() * 320000 + 45000),
        status: 'Baseline'
      };
    }).sort((a,b) => b.fitnessDps - a.fitnessDps);

    setTopBuilds(initialLeaderboard);

    geneticTimer.current = setInterval(() => {
      if (currentGen >= 20) {
        clearInterval(geneticTimer.current);
        setIsGeneticRunning(false);
        setGeneticProgress(100);
        return;
      }

      currentGen += 1;
      setGenCount(currentGen);
      setGeneticProgress(Math.floor((currentGen / 20) * 100));

      setTopBuilds(prev => {
        // Run breeding, crossover and mutations!
        const selectionPool = [...prev];
        const nextGenBuilds: any[] = [];

        // Survival of the fittest: Keep top 3 builds
        nextGenBuilds.push({ ...selectionPool[0], status: 'Kept Elite (Parent)' });
        nextGenBuilds.push({ ...selectionPool[1], status: 'Kept Elite (Parent)' });

        // Crossover and heavy mutations to break systems!
        for (let j = 0; j < 4; j++) {
          const p1 = selectionPool[Math.floor(Math.random() * 3)];
          const p2 = selectionPool[Math.floor(Math.random() * 3)];
          
          // Split active skills and passives
          const part1 = p1.chromosome.split(' + ')[0];
          const part2 = p2.chromosome.split(' + ')[1];

          let childDps = Math.floor((p1.fitnessDps + p2.fitnessDps) * 0.5 * (0.9 + Math.random() * 0.4));
          let childEhp = Math.floor((p1.ehp + p2.ehp) * 0.5 * (0.95 + Math.random() * 0.1));
          let annotation = "Recombined";

          // Rare Mutation! Dynamic synergy coefficient
          if (Math.random() < 0.45) {
            // Designer loophole found!
            childDps = Math.floor(childDps * (mathGuardrails ? 1.45 : 45.0)); // Huge math spike if unguarded
            childEhp = Math.floor(childEhp * (mathGuardrails ? 1.15 : 12.0));
            annotation = mathGuardrails ? "🧬 Synced Mutation" : "🚨 EXPLOIT UNLOCKED";
          }

          nextGenBuilds.push({
            id: currentGen * 10 + j,
            chromosome: `${part1} + ${part2}`,
            generation: currentGen,
            fitnessDps: childDps,
            ehp: childEhp,
            status: annotation
          });
        }

        return nextGenBuilds.sort((a,b) => b.fitnessDps - a.fitnessDps);
      });
    }, 450);
  };

  useEffect(() => {
    return () => {
      if (botSimTimer.current) clearInterval(botSimTimer.current);
      if (geneticTimer.current) clearInterval(geneticTimer.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tag-Driven Modifiers & Automated Chaos Testing" 
        subtitle="Deconstruct and simulate systemic balance verification vectors. Learn how Path of Exile series, Witcher 3, and Baldur's Gate 3 prevent combinatorial balance exploits using graph registries, matrix simulations, and genetic optimizers." 
      />

      {/* HARDWARE OVERVIEW ROW WITH ms & GB METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {[
          { 
            label: 'Thread Load (CPU)', 
            value: '0.82ms', 
            sub: 'Headless Matrix Sim', 
            detail: 'vs 48.2ms standard AActor ticks',
            color: COLORS.status.successLight, 
            icon: Cpu 
          },
          { 
            label: 'Graphics Stall (GPU)', 
            value: '0.00ms', 
            sub: 'Offline Text Sweeper', 
            detail: 'Capping overlaps saving ~18ms',
            color: COLORS.status.info, 
            icon: Zap 
          },
          { 
            label: 'Static Registry (RAM)', 
            value: '14.2MB', 
            sub: '15k tag hashes compiled', 
            detail: 'vs 1.8GB if bloated objects',
            color: COLORS.status.warning, 
            icon: Database 
          },
          { 
            label: 'Network Jitter (Ping)', 
            value: '-165ms feel', 
            sub: 'Byte serialization', 
            detail: 'Reduces tag packet sizes by 97%',
            color: COLORS.kingfisher.warm, 
            icon: Server 
          },
        ].map((stat, i) => (
          <div key={i} className="bg-kingfisher-panel/60 border border-kingfisher-border/40 p-4 rounded-xl flex items-center gap-4">
            <div className="p-2 rounded-lg bg-black/20">
              <stat.icon className="w-5 h-5" color={stat.color} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-kingfisher-muted font-bold">{stat.label}</div>
              <div className="text-lg font-mono font-bold text-white leading-tight">{stat.value}</div>
              <div className="text-[10px] text-emerald-400 font-semibold">{stat.sub}</div>
              <div className="text-[9px] text-kingfisher-muted/50 font-mono">{stat.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ACTIVE MODIFIERS AND CONSTRUCTION (COL SPAN 5) */}
        <div className="xl:col-span-5 space-y-6">
          <SectionCard title="Data-Driven Modifier Registry" icon={Database} color={COLORS.kingfisher.blue}>
            <p className="text-xs text-kingfisher-muted mb-4 leading-relaxed">
              In a robust ARPG architecture, custom logic is strictly forbidden. Custom modifiers must register as structured key-values linked strictly via standardized <strong>Type Tags</strong>.
            </p>

            {/* REGISTERED MODIFIERS LIST */}
            <div className="space-y-2 mb-4 max-h-[280px] overflow-y-auto custom-scrollbar pr-2">
              {activeModifiers.map((mod) => (
                <div 
                  key={mod.id} 
                  className="bg-black/20 p-2.5 rounded-lg border border-kingfisher-border/40 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-blue-400" />
                      {mod.name}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-kingfisher-muted">
                      <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase">{mod.sourceTag}</span>
                      <span>&rarr;</span>
                      <span className="bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase">{mod.targetTag}</span>
                      <span className="text-neutral-500">|</span>
                      <span className="text-emerald-400 font-bold uppercase">{mod.type}</span>
                      <span className="text-neutral-600">({mod.value}x)</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveModifier(mod.id)}
                    className="p-1 px-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-md transition-all text-[10px]"
                    title="Remove modifier"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* RESET BUTTON */}
            <div className="flex items-center justify-between border-t border-kingfisher-border/30 pt-3">
              <span className="text-[10px] font-mono text-kingfisher-muted">{activeModifiers.length} Modifiers Active</span>
              <button 
                onClick={handleResetModifiers}
                className="text-xs font-semibold px-2.5 py-1 text-kingfisher-muted hover:text-white bg-black/30 border border-kingfisher-border/50 hover:border-white/30 rounded-lg transition-all"
              >
                Reset Default Active Preset
              </button>
            </div>
          </SectionCard>

          {/* DYNAMIC COMPOSITIONAL RE-BUILDER */}
          <SectionCard title="Craft New Modifier (Loop-Bust Tester)" icon={Plus} color={COLORS.kingfisher.warm}>
            <p className="text-xs text-kingfisher-muted mb-4 leading-relaxed">
              Design a unique item or passive talent. Link them with tags. To trigger a balance feedback cycle, create a chain like <strong>Poison &rarr; Fire</strong> alongside the default <strong>Fire &rarr; Poison</strong>.
            </p>

            <div className="space-y-3.5">
              <div className="grid grid-cols-1 gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-kingfisher-muted">Modifier Name</span>
                <input 
                  type="text" 
                  value={newModName}
                  onChange={(e) => setNewModName(e.target.value)}
                  placeholder="e.g., Blood-Born Aegis, Cast on Crit Exploit..."
                  className="w-full bg-black/40 border border-kingfisher-border/60 text-xs px-2.5 py-2 rounded-lg text-white font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-kingfisher-muted">Source tag</span>
                  <select 
                    value={newModSource}
                    onChange={(e) => setNewModSource(e.target.value)}
                    className="bg-black/40 border border-kingfisher-border/60 text-xs px-1.5 py-1.5 rounded-lg text-white font-semibold outline-none"
                  >
                    {["Fire", "Poison", "Physical", "Spell", "ActionSpeed", "EHP"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-kingfisher-muted">Destination tag</span>
                  <select 
                    value={newModTarget}
                    onChange={(e) => setNewModTarget(e.target.value)}
                    className="bg-black/40 border border-kingfisher-border/60 text-xs px-1.5 py-1.5 rounded-lg text-white font-semibold outline-none"
                  >
                    {["Fire", "Poison", "Physical", "Spell", "ActionSpeed", "EHP"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* MOD CATEGORY AND SCALING VALUE */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-kingfisher-muted">Operation Type</span>
                  <select 
                    value={newModType}
                    onChange={(e) => setNewModType(e.target.value as any)}
                    className="bg-black/40 border border-kingfisher-border/60 text-xs px-1.5 py-1.5 rounded-lg text-white font-semibold outline-none"
                  >
                    <option value="scale">Multiplier (Scale)</option>
                    <option value="trigger">Trigger On-Hit</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-kingfisher-muted text-right">Modifier value</span>
                  <input 
                    type="number" 
                    step="0.05"
                    value={newModValue}
                    onChange={(e) => setNewModValue(parseFloat(e.target.value) || 1.0)}
                    className="bg-black/40 border border-kingfisher-border/60 text-xs px-1.5 py-1.5 rounded-lg text-white font-semibold outline-none text-right"
                  />
                </div>
              </div>

              <button 
                onClick={handleAddModifier}
                disabled={!newModName.trim()}
                className={`w-full py-2.5 rounded-lg text-xs font-bold font-sans uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  newModName.trim()
                    ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer active:scale-[0.98]'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" /> Inject Mod Into Central Registry
              </button>
            </div>
          </SectionCard>
        </div>

        {/* RIGHT COLUMN: GRAPH LOOP ANALYSIS & DYNAMIC MATRIX SIMULATOR (COL SPAN 7) */}
        <div className="xl:col-span-7 space-y-6">
          {/* A. GRAPH LOOP ANALYSIS */}
          <SectionCard title="Active Modifier Loop Static Analysis" icon={GitBranch} color={COLORS.status.success}>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="space-y-1 md:w-2/3">
                <p className="text-xs text-kingfisher-muted leading-relaxed">
                  The registry automatically maps interactions into a **directional dependency graph**. Static validation DFS scans for cyclical feedback nodes during compile-time or game-boot.
                </p>
                {detectedLoops.length === 0 ? (
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs py-1.5">
                    <CheckCircle2 className="w-4 h-4" /> System is clean: No cyclical loops registered.
                  </div>
                ) : (
                  <div className="text-red-400 font-bold flex items-center gap-1.5 text-xs py-1.5 bg-red-500/10 px-2 rounded border border-red-500/20">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    🚨 {detectedLoops.length} GRAPH CYCLES REGISTERED! Cook Assertion Failed.
                  </div>
                )}
              </div>

              {/* GRAPHICAL BOX */}
              <div className="w-full md:w-1/3 bg-black/40 p-3 rounded-xl border border-kingfisher-border/40 text-[10px] font-mono flex flex-col items-center justify-center min-h-[90px]">
                {detectedLoops.length === 0 ? (
                  <div className="text-center text-emerald-400 font-bold uppercase tracking-wider">
                     STATIC STATUS: OK
                  </div>
                ) : (
                  <div className="text-center space-y-2 w-full">
                    <span className="text-amber-500 uppercase font-black tracking-widest block text-[9px] animate-pulse">
                      LOOP CONFLICT:
                    </span>
                    {detectedLoops.map((cycle, i) => (
                      <div key={i} className="text-red-400 bg-black/60 p-1 px-2 border border-red-500/30 rounded text-center truncate">
                        {cycle.join(' ➔ ')}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* B. CHAOS BOT SANDBOX MATRIX SUITE */}
          <SectionCard title="Sandbox Matrix Simulator ('Chaos Bot Suite')" icon={Terminal} color={COLORS.kingfisher.warm}>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3 p-3 bg-black/20 rounded-xl border border-white/5">
              <div className="flex items-center gap-4">
                {/* ADVANCED GUARD Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-kingfisher-muted uppercase tracking-wider">Mathematical Guardrails</span>
                  <button 
                    onClick={() => setMathGuardrails(!mathGuardrails)}
                    className={`px-2.5 py-1 text-[10px] rounded font-bold transition-all border ${
                      mathGuardrails 
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' 
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}
                  >
                    {mathGuardrails ? "Asymptotic & Caps ON" : "Linear & Absolute OFF"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-kingfisher-muted uppercase tracking-wider">Bot Pool Sizing</span>
                  <select 
                    value={botCount} 
                    onChange={(e) => setBotCount(parseInt(e.target.value))}
                    className="bg-black/50 border border-kingfisher-border text-[10px] p-1 px-1.5 rounded font-mono text-white"
                  >
                    <option value={500}>500 Bots</option>
                    <option value={1000}>1,000 Bots</option>
                    <option value={5000}>5,000 Bots</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={runChaosSimulation}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
                  isBotSimulating 
                    ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {isBotSimulating ? "Terminate Run" : "Spin Up Matrix"} <Play className="w-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* CHAOS DOCK LOGS */}
              <div className="bg-black/50 rounded-xl border border-kingfisher-border/50 p-2 text-[10px] font-mono h-[180px] overflow-y-auto custom-scrollbar flex flex-col gap-1 text-sky-400">
                <div className="text-neutral-500 border-b border-kingfisher-border/30 pb-1 mb-1 font-bold flex items-center gap-1">
                  <Terminal className="w-3" /> HEADLESS SECTOR SIMULATOR TERMINAL
                </div>
                {botLogs.map((l, i) => (
                  <div key={i} className="leading-relaxed border-l-2 pl-1.5 border-sky-500/30">
                    {l}
                  </div>
                ))}
              </div>

              {/* DETECTED OUTLIERS GRID */}
              <div className="bg-black/50 rounded-xl border border-kingfisher-border/50 p-3 h-[180px] overflow-y-auto custom-scrollbar flex flex-col gap-1.5">
                <div className="text-amber-400 border-b border-kingfisher-border/30 pb-1 mb-1 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <AlertOctagon className="w-4 h-4 shrink-0 text-amber-500 animate-pulse" /> Outliers Flagged ({anomalies.length})
                </div>
                {anomalies.length === 0 ? (
                  <div className="text-neutral-500 text-[10px] italic text-center py-10">
                    Run the Matrix to detect busted modifier setups.
                  </div>
                ) : (
                  anomalies.map((anom, idx) => (
                    <div key={idx} className="bg-red-500/10 border border-red-500/30 p-2 rounded-lg text-[9px] font-mono space-y-1">
                      <div className="flex items-center justify-between font-bold text-white">
                        <span>🤖 {anom.bot}</span>
                        <span className="text-red-400 uppercase tracking-widest shrink-0 bg-red-500/10 px-1 border border-red-500/30 rounded">{anom.guard}</span>
                      </div>
                      <div className="text-amber-300 leading-normal">{anom.reason}</div>
                      <div className="text-neutral-500 flex justify-between">
                        <span>Action Speed: {anom.actionSpeed}</span>
                        <span>DPS: {anom.dps.toLocaleString()} | EHP: {anom.ehp.toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* GENETIC MUTATOR ALGORITHM HERO SECTION */}
      <SectionCard title="The Genetic Algorithm Min-Maxer ('Infinite Evolutionary Bot')" icon={Award} color={COLORS.kingfisher.blue}>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-5 space-y-3">
            <p className="text-xs text-kingfisher-muted leading-relaxed">
              Players act as a brute-force hive mind. To preempt them, you run an <strong>Evolutionary Genetic Solver</strong>. It represents builds as DNA chains (Skill + unique combos), breeding the top dps configurations across multiple generations to locate exploits while you sleep.
            </p>
            <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-white/5">
              <div>
                <div className="text-[10px] font-bold text-kingfisher-muted uppercase tracking-wider">Evolution Progress</div>
                <div className="text-lg font-mono font-bold text-white leading-tight">Gen #{genCount} / 20</div>
              </div>
              <button 
                onClick={runGeneticAlgorithm}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
                  isGeneticRunning 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isGeneticRunning ? "Hold Mutation" : "Run Mutator Arena"} <RefreshCw className={`w-3.5 h-3.5 ${isGeneticRunning ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* PROGRESS METER */}
            <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
              <div 
                className="bg-indigo-500 h-full transition-all duration-300" 
                style={{ width: `${geneticProgress}%` }}
              />
            </div>

            <div className="p-3 bg-neutral-900/50 rounded-xl border border-white/5 text-[11px] text-kingfisher-muted leading-relaxed space-y-1">
              <div className="font-bold text-white flex items-center gap-1"><Sliders className="w-3.5 h-3.5" /> Evolutionary Settings:</div>
              <div>Crossover Rate: <strong>85%</strong></div>
              <div>Mutation Probability: <strong>45% (synergy trigger)</strong></div>
              <div>Selection Criterion: <strong>Maximize Average Combo DPS</strong></div>
            </div>
          </div>

          {/* GENETIC LEADERBOARD RESULTS */}
          <div className="xl:col-span-7 bg-black/30 p-4 border border-white/5 rounded-2xl">
            <div className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest mb-3 pb-2 border-b border-white/5 flex items-center justify-between">
              <span>🧬 Mutated Chromosome Leaderboard</span>
              <span className="text-[9px] bg-indigo-505/10 text-indigo-400 px-1.5 py-0.5 rounded font-bold">Fitness Function: Max DPS</span>
            </div>

            <div className="space-y-2 h-[210px] overflow-y-auto custom-scrollbar pr-1">
              {topBuilds.length === 0 ? (
                <div className="text-neutral-500 text-[11px] italic text-center py-16">
                  Press 'Run Mutator Arena' to start spawning genetic builds in real-time.
                </div>
              ) : (
                topBuilds.map((b, idx) => (
                  <div 
                    key={b.id} 
                    className={`p-2.5 rounded-lg text-xs flex items-center justify-between border transition-all ${
                      idx === 0 
                        ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-300' 
                        : idx === 1
                          ? 'bg-neutral-800/85 border-neutral-700 text-white/90'
                          : 'bg-black/20 border-white/5 text-kingfisher-muted'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[10px] uppercase font-mono px-1 rounded bg-black/30 select-none">#{idx + 1}</span>
                        <span className="font-bold">{b.chromosome}</span>
                        <span className={`text-[8px] px-1 py-0.5 rounded uppercase font-bold shrink-0 ${
                          b.status.includes('EXPLOIT')
                            ? 'bg-red-500 text-white animate-bounce'
                            : b.status.includes('Guarded') || b.status.includes('Synced')
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="text-[9px] opacity-75">Generated during: Generation #{b.generation}</div>
                    </div>
                    
                    <div className="text-right font-mono">
                      <div className={`text-xs font-bold ${idx === 0 ? 'text-yellow-400 text-sm' : 'text-white'}`}>
                        {b.fitnessDps.toLocaleString()} dps
                      </div>
                      <div className="text-[9px] opacity-60">EHP: {b.ehp.toLocaleString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* HIGH-LEVEL UNREAL ENGINE MASTERCLASS DEEP DIVE */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
        {/* WHAT CORE ENGINE HAS VS LACKS SECTION */}
        <SectionCard title="Unreal Engine Modifier Tooling Breakdown" icon={Code} color={COLORS.kingfisher.blue}>
          <p className="text-xs text-kingfisher-muted mb-4 leading-relaxed">
            Unreal Engine provides excellent visual toolsets for managing individual skill blocks, but requires robust C++ architectural expansion to prevent balance outliers out-of-the-box.
          </p>

          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <Check className="w-4 h-4" /> Out-of-the-Box Engine Assets
              </div>
              <ul className="space-y-2 text-xs text-kingfisher-muted list-disc pl-4 leading-relaxed">
                <li><strong>Gameplay Abilities System (GAS)</strong>: Multi-threaded out-of-the-box system structure, native attribute modifiers, and tick predictions.</li>
                <li><strong>FGameplayTagContainers</strong>: Hierarchical 32-bit bit-hashed string identifiers that evaluate very fast globally in C++ memory.</li>
                <li><strong>UGameInstanceSubsystems</strong>: Static memory registers encapsulating custom passive templates safely, completely isolated from actor coordinate threads.</li>
              </ul>
            </div>

            <div>
              <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" /> Critical Blind Spots (Missing Features)
              </div>
              <ul className="space-y-2 text-xs text-kingfisher-muted list-disc pl-4 leading-relaxed">
                <li><strong>Static Graph Evaluator</strong>: Unreal does not have any native graph parsing utilities to flag infinite feedback loops on registered GameplayEffects during boot.</li>
                <li><strong>Headless Permutation Simulator</strong>: Forces booting full viewport clients or tedious manual QA checks to calculate modifier synergies.</li>
                <li><strong>Genetic mutators</strong>: Scaling optimization relies strictly on player telemetry reports post-release.</li>
              </ul>
            </div>
          </div>
        </SectionCard>

        {/* BRUTALLY COMPILED COMPILER CODEBLOCK CARD */}
        <SectionCard title="Production C++ Architectural Workarounds" icon={Terminal} color={COLORS.status.success}>
          <p className="text-xs text-kingfisher-muted mb-3 leading-relaxed">
            Wrap these structural blocks directly into your custom UWorldSubsystem or Engine Plugin initialization paths to automatically asserts and mathematical guardrails globally.
          </p>

          <div className="space-y-3">
            <div>
              <span className="text-[9px] font-bold uppercase text-blue-400 tracking-wider font-mono">1. Asymptotic Math Guardrail Formula (C++)</span>
              <CodeBlock code={`// Safe mathematical scaling formula that guarantees asymptotes
float USafeStatCalculator::CalculateAsymptoticDecrease(float CurrentScore, float ScalingFactor)
{
    if (CurrentScore <= 0.0f) return 0.0f;
    // Approaches 1.0f (150% more reduction) but never reaches or overflows it limits
    return 1.0f - (1.0f / (1.0f + (CurrentScore / ScalingFactor)));
}`} />
            </div>

            <div>
              <span className="text-[9px] font-bold uppercase text-amber-500 tracking-wider font-mono">2. Compiler Assertion Loop Checker (C++)</span>
              <CodeBlock code={`// DFS Graph validator preventing infinite recursive loops during Cook
void UModifierSubsystem::ValidateModifierRegistry(const TArray<FModifierRecord>& ActiveModifiers)
{
    TMap<FString, TArray<FString>> AdjList;
    for (const auto& Mod : ActiveModifiers) {
        AdjList.FindOrAdd(Mod.SourceTag).Add(Mod.TargetTag);
    }
    
    TSet<FString> Completed;
    TArray<FString> RecStack;
    
    for (const auto& Node : AdjList) {
        if (!Completed.Contains(Node.Key)) {
            if (HasCycleDFS(Node.Key, AdjList, Completed, RecStack)) {
                UE_LOG(LogTemp, Fatal, TEXT("MODIFIER ASSERTION CHECK FAILED: Cyclical Infinite Loop Identified in Game Balance Setup!"));
            }
        }
    }
}`} />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};
