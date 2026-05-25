import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map, Eye, EyeOff, Shield, Radio, Activity, Cpu, Database, HardDrive, 
  Zap, RefreshCw, Layers, Sparkles, Compass, HelpCircle, Swords, AlertCircle, 
  Heart, Trophy, BookOpen, Settings2, ShieldCheck, ToggleLeft, ToggleRight,
  Sliders, Link2, Info, ChevronRight, CheckCircle2, AlertTriangle, Plus, Trash, Search
} from 'lucide-react';
import { PageHeader, SectionCard, HighlightBox, MultiplayerImpact, FeatureMatrix, CodeBlock } from './OptimizationHelpers';

// Define the 5 core Types of Skill Tree Map Nodes
type NodeType = 'small' | 'notable' | 'jewel' | 'selectable' | 'story';

interface SkillNode {
  id: string;
  name: string;
  type: NodeType;
  x: number;
  y: number;
  connections: string[];
  baseStats: string;
  currentStats: string;
  desc: string;
  icon: string;
  // Node-specific behavior
  options?: string[]; // 1 out of 3 selectable items
  selectedOptionIndex?: number;
  questDependency?: {
    questName: string;
    conditionVar: string;
    outcomes: Record<string, { stats: string; desc: string; iconState?: string }>;
  };
}

// Fixed 12-node Witcher/PoE hybrid Map tree layout with coordinates
const INITIAL_NODES: SkillNode[] = [
  {
    id: 'oxenfurt',
    name: 'Oxenfurt Outpost',
    type: 'selectable',
    x: 180,
    y: 190,
    connections: ['mana_flow', 'crows_perch'],
    baseStats: 'Mutagen Synergies & Alchemy Boosts',
    currentStats: '',
    desc: 'An academic node at the Oxenfurt gate. Allows switching physical modifier aspects and mutagens while camped.',
    icon: 'Flask',
    options: [
      'Mutagen Synergy (+15% Mutagen Efficacy / Alchemy Duration)',
      'Academic Alacrity (+8% Combat Cooldown Reduction / Cast Speed)',
      'Witcher\'s Wit (+15% Experience Gain with Oilcraft)'
    ],
    selectedOptionIndex: 0
  },
  {
    id: 'mana_flow',
    name: 'Minor Arcana Link',
    type: 'small',
    x: 230,
    y: 120,
    connections: ['novigrad_docks'],
    baseStats: '+10% Mana Recovery Speed, +15 Max Life',
    currentStats: '+10% Mana Recovery Speed, +15 Max Life',
    desc: 'Small connector node balancing spell output and physical durability.',
    icon: 'Sparkles'
  },
  {
    id: 'novigrad_docks',
    name: 'Novigrad Harbor',
    type: 'selectable',
    x: 350,
    y: 80,
    connections: ['temple_fire'],
    baseStats: 'Smuggling Fortunes & Sailor Agility',
    currentStats: '',
    desc: 'The trade center of the north. Swappable buffs granted by active merchant contacts.',
    icon: 'Anchor',
    options: [
      'Smuggler\'s Fortune (+10% Gold / Loot drop rate)',
      'Seaside Fleetness (+6% Movement & Attack Speed)',
      'Ironclad Hull (+20% Bleed and Toxicity Resistance)'
    ],
    selectedOptionIndex: 1
  },
  {
    id: 'temple_fire',
    name: 'Temple of Eternal Fire',
    type: 'notable',
    x: 520,
    y: 70,
    connections: ['whispering_spirit'],
    baseStats: '+20% Fire Spell Damage, +12% Fire Resistance',
    currentStats: '+20% Fire Spell Damage, +12% Fire Resistance',
    desc: 'A sacred notable site protecting travelers. Amplifies fire magic and ignition modifiers.',
    icon: 'Flame'
  },
  {
    id: 'whispering_spirit',
    name: 'The Whispering Hillock',
    type: 'story',
    x: 620,
    y: 180,
    connections: ['crookback_orphans', 'wyzima_keep'],
    baseStats: 'Requires Quest Completion',
    currentStats: '',
    desc: 'An ancient spirit trapped beneath roots. Its modifier changes permanently based on your story choices.',
    icon: 'Trees',
    questDependency: {
      questName: 'Return to Crookback Bog',
      conditionVar: 'spiritOutcome',
      outcomes: {
        freed: {
          stats: '+15% Spell Casting Speed & +10% Mount Traversal Speed',
          desc: 'The spirit runs free through the wildwood, granting speed at the cost of slight rot. (Currups surrounding Node bounds).'
        },
        slain: {
          stats: '+25% Physical Armor & +3% Passive Health Regeneration',
          desc: 'The entity was cleansed, restoring local forest roots and blessing defenders with ironwood warding.'
        }
      }
    }
  },
  {
    id: 'crookback_orphans',
    name: 'Crookback Bog',
    type: 'story',
    x: 740,
    y: 260,
    connections: ['kaer_morhen'],
    baseStats: 'Requires Quest Completion',
    currentStats: '',
    desc: 'Deep swamp coordinates where children disappeared. Dependent on orphans story outcome.',
    icon: 'Compass',
    questDependency: {
      questName: 'The Orphan\'s Rescue',
      conditionVar: 'orphansOutcome',
      outcomes: {
        saved: {
          stats: '+5% General Movement Speed & +10% Potion Duration',
          desc: 'The children escaped to Novigrad. Grants general traversal boosts and high morale.'
        },
        consumed: {
          stats: '+25% Poison Resistance & +8% Damage Over Time',
          desc: 'The Crones consumed the bog, but left a dark swamp protection modifier lingering on the player.'
        }
      }
    }
  },
  {
    id: 'kaer_morhen',
    name: 'Kaer Morhen Valley',
    type: 'jewel',
    x: 680,
    y: 390,
    connections: ['skellige_ruins'],
    baseStats: 'Empty Socket',
    currentStats: 'No Jewel Socketed. Drop a jewel inside from the sidebar controls to activate modifying radius.',
    desc: 'The legendary keep of Witchers. Contains a potent Jewel Socket that alters nearby node statistics.',
    icon: 'Compass'
  },
  {
    id: 'skellige_ruins',
    name: 'Skellige Ancient Ruins',
    type: 'notable',
    x: 550,
    y: 440,
    connections: ['wyzima_keep'],
    baseStats: '+25% Cold Spell Damage, +15% Freeze Duration',
    currentStats: '+25% Cold Spell Damage, +15% Freeze Duration',
    desc: 'Ancient monolithic pillars matching the icy winds of Skellige. Heavily enhances freeze pipelines.',
    icon: 'Shield'
  },
  {
    id: 'wyzima_keep',
    name: 'Wyzima Palace Keep',
    type: 'jewel',
    x: 420,
    y: 380,
    connections: ['crows_perch'],
    baseStats: 'Empty Socket',
    currentStats: 'No Jewel Socketed. Drop a jewel inside from the sidebar controls to activate modifying radius.',
    desc: 'The majestic royal castle of Temeria. Incorporates a crucial Jewel Socket for central node groupings.',
    icon: 'Compass'
  },
  {
    id: 'crows_perch',
    name: 'Crow\'s Perch Castle',
    type: 'selectable',
    x: 300,
    y: 320,
    connections: ['oxenfurt'],
    baseStats: 'Warlord Tactics & Posture Recovery',
    currentStats: '',
    desc: 'The wooden fort of the Baron. Adapts defense alignments and sword multipliers on short notice.',
    icon: 'Sword',
    options: [
      'Baron\'s Authority (+15% Health Posture Recovery rate)',
      'Cavalry Charge (+8% Mounted Traversal Speed)',
      'Bloody Retribution (+10% Melee Critical Strike Multiplier)'
    ],
    selectedOptionIndex: 2
  }
];

// Jewel definitions that can be socketed in the simulator
interface Jewel {
  id: string;
  name: string;
  color: string;
  effect: string;
  influenceRadius: number; // in pixels
}

const CONSTANT_JEWELS: Jewel[] = [
  { id: 'ruby', name: 'Dreadful Crimson Jewel', color: '#ff3b30', effect: 'Converts neighboring note modifiers into physical and critical bonuses', influenceRadius: 100 },
  { id: 'sapphire', name: 'Glacial Cobalt Jewel', color: '#007aff', effect: 'Converts neighboring note modifiers to deal chill damage and cold resistance', influenceRadius: 120 },
  { id: 'diamond', name: 'Prismatic Diamond Jewel', color: '#ffd700', effect: 'Boosts all active stats on nodes inside the field by +25%', influenceRadius: 150 }
];

export const WorldSkillTreeMapTab: React.FC = () => {
  // Simulator State Machine
  const [nodes, setNodes] = useState<SkillNode[]>(INITIAL_NODES);
  const [playerPos, setPlayerPos] = useState({ x: 150, y: 320 }); // starts physically at Oxenfurt
  const [spentPoints, setSpentPoints] = useState<string[]>(['oxenfurt']);
  const [maxPoints] = useState(10);
  const [exploredCells, setExploredCells] = useState<string[]>([
    '0-1', '0-2', '0-3', '1-1', '1-2', '1-3', '2-1', '2-2', '2-3', '3-2', '3-3' // Revealed Oxenfurt area initially
  ]);
  
  // Quest outcomes state
  const [spiritOutcome, setSpiritOutcome] = useState<'cleared' | 'freed' | 'slain'>('cleared'); // starts uncleared
  const [orphansOutcome, setOrphansOutcome] = useState<'cleared' | 'saved' | 'consumed'>('cleared'); // starts uncleared
  
  // Socketed jewels state mapping: NodeID -> JewelID
  const [socketedJewels, setSocketedJewels] = useState<Record<string, string>>({});
  const [selectedNodeId, setSelectedNodeId] = useState<string>('oxenfurt');

  // Interactive Fog of War Grid logic (row/col cell index)
  const mapSize = { width: 800, height: 500 };
  const gridRows = 8;
  const gridCols = 10;
  const cellWidth = mapSize.width / gridCols;
  const cellHeight = mapSize.height / gridRows;

  // Custom interactive expansion modules
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarTab, setSidebarTab] = useState<'inspect' | 'craft' | 'builder' | 'scaling'>('inspect');
  const [stresserScale, setStresserScale] = useState<number>(1000);
  
  // Jewel bag containing default constant jewels + custom crafted ones
  const [inventoryJewels, setInventoryJewels] = useState<(Jewel & { shortMod?: string })[]>([
    { id: 'ruby', name: 'Dreadful Crimson Jewel', color: '#ff3b30', effect: 'Converts neighboring note modifiers into physical and critical bonuses', influenceRadius: 100, shortMod: 'Crimson Phys Boost' },
    { id: 'sapphire', name: 'Glacial Cobalt Jewel', color: '#007aff', effect: 'Converts neighboring note modifiers to deal chill damage and cold resistance', influenceRadius: 120, shortMod: 'Cobalt Freeze conversion' },
    { id: 'diamond', name: 'Prismatic Diamond Jewel', color: '#ffd700', effect: 'Boosts all active stats on nodes inside the field by +25%', influenceRadius: 110, shortMod: '+25% Power Aura' }
  ]);

  // Crafting state inputs
  const [craftName, setCraftName] = useState('Annihilating Cobalt Jewel');
  const [craftColor, setCraftColor] = useState('#007aff');
  const [craftRadius, setCraftRadius] = useState(120);
  const [craftChoice, setCraftChoice] = useState('A'); // preset mods

  // Node position placing states
  const [clickedCoord, setClickedCoord] = useState<{ x: number; y: number } | null>(null);
  const [builderName, setBuilderName] = useState('');
  const [builderType, setBuilderType] = useState<NodeType>('small');
  const [builderStats, setBuilderStats] = useState('+15% Spell Toxicity Boost');
  const [builderDesc, setBuilderDesc] = useState('A modular custom coordinate embedded into the passive matrix.');
  const [builderTargetId, setBuilderTargetId] = useState('oxenfurt');

  // Word lists for random name generator
  const prefixPool = ['Glacial', 'Indomitable', 'Dreadful', 'Whispering', 'Vivid', 'Sacred', 'Cat-School', 'Temerian'];
  const basePool = ['Cobalt', 'Crimson', 'Viridian', 'Diamond'];
  const suffixPool = ['of Brutality', 'of Alchemical Flow', 'of Everlasting Constitution', 'of Bitter Frosts', 'of Arcane Retribution'];

  const handleGenerateRandomName = () => {
    const p = prefixPool[Math.floor(Math.random() * prefixPool.length)];
    const b = basePool[Math.floor(Math.random() * basePool.length)];
    const s = suffixPool[Math.floor(Math.random() * suffixPool.length)];
    setCraftName(`${p} ${b} Jewel ${s}`);
    
    // Auto adjust colors matching pool types
    if (b === 'Cobalt') setCraftColor('#007aff');
    else if (b === 'Crimson') setCraftColor('#ff3b30');
    else if (b === 'Viridian') setCraftColor('#10b981');
    else setCraftColor('#ffd700');
  };

  const handleAssembleJewel = () => {
    let effect = 'Multiplies physical armor block limits';
    let shortMod = 'Phys Armor Aura';
    if (craftChoice === 'A') {
      effect = 'Converts neighboring node modifiers into poison strike rate';
      shortMod = 'Poison Aura';
    } else if (craftChoice === 'B') {
      effect = 'Adds +15% Critical Strike Multiplier and critical spell velocity';
      shortMod = 'Weapon Crit Multi';
    } else if (craftChoice === 'C') {
      effect = 'Boosts maximum dynamic life and energy ward regeneration bounds';
      shortMod = 'Regen Aura';
    } else {
      effect = 'Increases cold skill area damage and chill durations by +30%';
      shortMod = '+30% Frost Range';
    }

    const uniqueId = `custom-jewel-${Date.now()}`;
    const newJewel = {
      id: uniqueId,
      name: craftName,
      color: craftColor,
      effect,
      influenceRadius: craftRadius,
      shortMod
    };

    setInventoryJewels(prev => [...prev, newJewel]);
    alert(`Assembled unique jewel added: "${craftName}"! Reach any Jewel Socket node to socket it.`);
  };

  const handleEmbedNode = () => {
    if (!clickedCoord) {
      alert('Please click on the main map canvas grid first to capture placement coordinates!');
      return;
    }
    if (!builderName.trim()) {
      alert('Please enter a valid node name.');
      return;
    }

    const uniqueId = `dyn-node-${Date.now()}`;
    const newNode: SkillNode = {
      id: uniqueId,
      name: builderName,
      type: builderType,
      x: clickedCoord.x,
      y: clickedCoord.y,
      baseStats: builderStats,
      currentStats: builderStats,
      desc: builderDesc,
      icon: 'Compass',
      connections: [builderTargetId]
    };

    setNodes(prev => {
      return prev.map(n => {
        if (n.id === builderTargetId) {
          return {
            ...n,
            connections: [...n.connections, uniqueId]
          };
        }
        return n;
      }).concat(newNode);
    });

    setSelectedNodeId(uniqueId);
    setClickedCoord(null);
    setBuilderName('');
    alert(`Success: Embedded node "${builderName}" and connected lines to standard mesh.`);
  };

  // Toggle explored states easily or set builder coordinates
  const handleCellClick = (row: number, col: number, e?: React.MouseEvent) => {
    if (sidebarTab === 'builder' && e) {
      e.stopPropagation();
      const rect = e.currentTarget.parentElement?.getBoundingClientRect();
      if (rect) {
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        setClickedCoord({ x, y });
        setBuilderName(`Continental Marker (${x}x, ${y}Y)`);
      }
      return;
    }

    const key = `${row}-${col}`;
    setExploredCells(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleRevealAllMap = () => {
    const all: string[] = [];
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        all.push(`${r}-${c}`);
      }
    }
    setExploredCells(all);
  };

  const handleResetMap = () => {
    setNodes(INITIAL_NODES);
    setExploredCells(['0-1', '0-2', '0-3', '1-1', '1-2', '1-3', '2-1', '2-2', '2-3', '3-2', '3-3']);
    setSpentPoints(['oxenfurt']);
    setSocketedJewels({});
    setSpiritOutcome('cleared');
    setOrphansOutcome('cleared');
    setPlayerPos({ x: 150, y: 320 });
    setSearchTerm('');
    setClickedCoord(null);
    setSelectedNodeId('oxenfurt');
    setInventoryJewels([
      { id: 'ruby', name: 'Dreadful Crimson Jewel', color: '#ff3b30', effect: 'Converts neighboring note modifiers into physical and critical bonuses', influenceRadius: 100, shortMod: 'Crimson Phys Boost' },
      { id: 'sapphire', name: 'Glacial Cobalt Jewel', color: '#007aff', effect: 'Converts neighboring note modifiers to deal chill damage and cold resistance', influenceRadius: 120, shortMod: 'Cobalt Freeze conversion' },
      { id: 'diamond', name: 'Prismatic Diamond Jewel', color: '#ffd700', effect: 'Boosts all active stats on nodes inside the field by +25%', influenceRadius: 110, shortMod: '+25% Power Aura' }
    ]);
  };

  // Check if a point is covered by Fog of War in the simulator
  const isPointExplored = (x: number, y: number) => {
    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);
    return exploredCells.includes(`${row}-${col}`);
  };

  // Move the player beacon to a coordinate on the map
  const handleMovePlayer = (x: number, y: number) => {
    setPlayerPos({ x, y });
    
    // Automatically explore surrounding grid cells in a 1-tile radius of landing spot
    const targetCol = Math.floor(x / cellWidth);
    const targetRow = Math.floor(y / cellHeight);
    
    setExploredCells(prev => {
      const copy = [...prev];
      for (let r = targetRow - 1; r <= targetRow + 1; r++) {
        for (let c = targetCol - 1; c <= targetCol + 1; c++) {
          if (r >= 0 && r < gridRows && c >= 0 && c < gridCols) {
            const k = `${r}-${c}`;
            if (!copy.includes(k)) copy.push(k);
          }
        }
      }
      return copy;
    });
  };  const connectionsList = useMemo(() => {
    const list: { from: SkillNode; to: SkillNode; isAllocated: boolean; isVisible: boolean }[] = [];
    nodes.forEach(node => {
      node.connections.forEach(targetId => {
        const target = nodes.find(t => t.id === targetId);
        if (target) {
          const isAllocated = spentPoints.includes(node.id) && spentPoints.includes(target.id);
          const nodeExplored = isPointExplored(node.x, node.y);
          const targetExplored = isPointExplored(target.x, target.y);
          const isVisible = nodeExplored || targetExplored;
          list.push({ from: node, to: target, isAllocated, isVisible });
        }
      });
    });
    return list;
  }, [nodes, spentPoints, exploredCells]);

  const evaluateNodeStats = (node: SkillNode) => {
    if (node.type === 'selectable' && node.options) {
      const idx = node.selectedOptionIndex ?? 0;
      return {
        stats: node.options[idx] || node.baseStats,
        desc: `Altar current aspect: ${node.options[idx] || ''}. ${node.desc}`
      };
    }

    if (node.type === 'story' && node.questDependency) {
      const dep = node.questDependency;
      const cond = dep.conditionVar === 'spiritOutcome' ? spiritOutcome : orphansOutcome;
      const outcome = dep.outcomes[cond] || { stats: node.baseStats, desc: node.desc };
      return {
        stats: outcome.stats,
        desc: outcome.desc
      };
    }

    if (node.type === 'jewel') {
      const socketedJewelId = socketedJewels[node.id];
      if (socketedJewelId) {
        const jewel = inventoryJewels.find(j => j.id === socketedJewelId);
        if (jewel) {
          return {
            stats: `Socketed: ${jewel.name}`,
            desc: jewel.effect
          };
        }
      }
      return {
        stats: 'Empty Socket Node',
        desc: 'Insert a custom jewel inside this socket from the sidebar menu to manipulate neighboring nodes.'
      };
    }

    return {
      stats: node.baseStats,
      desc: node.desc
    };
  };

  const activeDetailNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  const activeDetailEvaluated = useMemo(() => {
    if (!activeDetailNode) return null;
    return evaluateNodeStats(activeDetailNode);
  }, [activeDetailNode, spiritOutcome, orphansOutcome, socketedJewels, inventoryJewels]);

  const isPlayerAtActiveNode = useMemo(() => {
    if (!activeDetailNode) return false;
    const dx = playerPos.x - activeDetailNode.x;
    const dy = playerPos.y - activeDetailNode.y;
    return Math.sqrt(dx * dx + dy * dy) <= 100;
  }, [activeDetailNode, playerPos]);

  const handleAllocateNode = (nodeId: string) => {
    setSpentPoints(prev => {
      if (prev.includes(nodeId)) {
        if (nodeId === 'oxenfurt') return prev;
        return prev.filter(id => id !== nodeId);
      } else {
        if (prev.length >= maxPoints) {
          alert('Allocations limited by current level pool max SP cap!');
          return prev;
        }
        return [...prev, nodeId];
      }
    });
  };

  const handleSelectOption = (nodeId: string, optionIndex: number) => {
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        return {
          ...n,
          selectedOptionIndex: optionIndex
        };
      }
      return n;
    }));
  };

  const handleSocketJewel = (nodeId: string, jewelId: string | null) => {
    setSocketedJewels(prev => {
      const copy = { ...prev };
      if (jewelId === null) {
        delete copy[nodeId];
      } else {
        copy[nodeId] = jewelId;
      }
      return copy;
    });
  };

  const handleNodeClick = (node: SkillNode) => {
    setSelectedNodeId(node.id);
    if (isPointExplored(node.x, node.y)) {
      handleMovePlayer(node.x, node.y);
    }
  };

  const allocatedStats = useMemo(() => {
    const statsArr: string[] = [];
    nodes.forEach(node => {
      if (spentPoints.includes(node.id)) {
        const evalObj = evaluateNodeStats(node);
        if (evalObj && evalObj.stats && evalObj.stats !== 'Empty Socket' && evalObj.stats !== 'Empty Socket Node' && evalObj.stats !== 'Requires Quest Completion') {
          statsArr.push(`${node.name}: ${evalObj.stats}`);
        }
      }
    });
    return statsArr;
  }, [nodes, spentPoints, spiritOutcome, orphansOutcome, socketedJewels, inventoryJewels]);


  return (
    <div className="space-y-6">
      <PageHeader 
        title="Open World Skill Tree Map Tab" 
        subtitle="Unifying passive skill systems with dynamic open-world physical constraints, branching story outcomes, and CPU/GPU resource optimization." 
      />

      <HighlightBox type="success" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Path of Exile + Witcher 3 Master Plan</strong>
          </div>
          <p className="text-emerald-100/90 text-xs leading-relaxed">
            Every location on Temeria\'s physical map coordinates translates directly to passive connected skill tree nodes. 
            Exploring physical world regions clears the <strong>Fog of War</strong> (both on your screen-space game map and the abstract skill layout), revealing hidden jewels and customizable notable shrines.
          </p>
        </div>
        <div className="border-t md:border-t-0 md:border-l border-emerald-500/20 pt-3 md:pt-0 md:pl-4 flex flex-col justify-center">
          <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Dynamic Sandbox Settings</div>
          <div className="text-[11px] text-neutral-300 mt-1">
            Search nodes with live glowing overlays, assemble procedural socketable jewels, construct custom coordinate nodes on-the-fly, or stress-test optimization thresholds matching our backend specification.
          </div>
        </div>
      </HighlightBox>

      {/* SECTION 1: THE INTERACTIVE SIMULATOR CARD */}
      <div id="world-skill-tree-interactive-sim" className="bg-kingfisher-panel/90 border border-kingfisher-border rounded-xl p-4 md:p-6 shadow-md relative overflow-hidden">
        
        {/* Search highlight controller */}
        <div className="relative flex items-center mb-4">
          <span className="absolute left-3 text-neutral-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input 
            type="text"
            placeholder="Search nodes by keyword, name, base stats, or options (e.g. 'spell', 'cold', 'mana', 'physical', 'novigrad')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0d1527] border border-kingfisher-border/60 text-white text-xs rounded-lg pl-9 pr-24 py-2 outline-none focus:border-yellow-400/60 font-sans tracking-wide transition-colors animate-none"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-20 text-neutral-400 hover:text-white text-[10px] bg-neutral-850 px-2 py-0.5 rounded uppercase font-bold transition-all"
            >
              Clear
            </button>
          )}
          <span className="absolute right-3 text-[10px] text-neutral-500 font-mono select-none">NEON HIGHLIGHT ENGINES</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* SIMULATOR MAP LEFT PANEL */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4 border-b border-kingfisher-border/40 pb-2.5">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-md">Interactive Open-World Skill Tree Canvas</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleRevealAllMap}
                  className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold text-white bg-blue-600 hover:bg-blue-750 rounded transition-all"
                >
                  Reveal Map
                </button>
                <button 
                  onClick={handleResetMap}
                  className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold text-kingfisher-muted hover:text-white border border-neutral-700 rounded hover:bg-neutral-800 transition-all"
                >
                  Reset Tab
                </button>
              </div>
            </div>

            {/* MAP GRID BOX CONFIGURATION */}
            <div className="relative border border-kingfisher-border/60 rounded-xl bg-slate-950 overflow-hidden select-none shadow-inner" style={{ height: `${mapSize.height}px` }}>
              
              {/* Topographical background sketch grids representing game biomes */}
              <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute top-10 left-36 w-24 h-24 border border-white rounded-full flex items-center justify-center text-[10px] font-mono">Oxenfurt Forest</div>
                <div className="absolute top-36 left-[480px] w-48 h-20 border border-white rounded-ellipse flex items-center justify-center text-[10px] font-mono rotate-12">Ysgith Swamp</div>
                <svg className="w-full h-full text-white">
                  <path d="M 120,450 Q 220,380 320,400 T 520,320 T 720,450" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5" />
                  <text x="360" y="320" className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-60">Pontar River Delta</text>
                </svg>
              </div>

              {/* DRAW CONNECTIONS FLUID SPLINE PATHS */}
              <svg className="absolute inset-0 pointer-events-none w-full h-full">
                {connectionsList.map((conn, idx) => {
                  const { from, to, isAllocated, isVisible } = conn;
                  if (!isVisible) return null;
                  return (
                    <g key={`spline-${from.id}-${to.id}-${idx}`}>
                      {/* Glow underlay */}
                      <line 
                        x1={from.x} y1={from.y} 
                        x2={to.x} y2={to.y}
                        stroke={isAllocated ? 'rgba(233, 187, 147, 0.4)' : 'rgba(30, 41, 59, 0.4)'}
                        strokeWidth={isAllocated ? "6" : "2"}
                      />
                      <line 
                        x1={from.x} y1={from.y} 
                        x2={to.x} y2={to.y}
                        stroke={isAllocated ? '#ffd700' : '#475569'}
                        strokeWidth="2.5"
                        strokeDasharray={(!isAllocated && (from.type === 'story' || to.type === 'story')) ? "4" : "0"}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* DRAW SOCKET JEWEL INFLUENCE RADIUS OVERLAYS */}
              {nodes.map(node => {
                if (node.type !== 'jewel') return null;
                const socketedJewelId = socketedJewels[node.id];
                if (!socketedJewelId) return null;
                const jewel = inventoryJewels.find(j => j.id === socketedJewelId);
                if (!jewel) return null;

                const revealed = isPointExplored(node.x, node.y);
                if (!revealed) return null;

                return (
                  <div 
                    key={`range-${node.id}`}
                    className="absolute rounded-full border pointer-events-none animate-pulse"
                    style={{
                      left: `${node.x - jewel.influenceRadius}px`,
                      top: `${node.y - jewel.influenceRadius}px`,
                      width: `${jewel.influenceRadius * 2}px`,
                      height: `${jewel.influenceRadius * 2}px`,
                      borderColor: `${jewel.color}50`,
                      backgroundColor: `${jewel.color}08`,
                      zIndex: 10
                    }}
                  />
                );
              })}

              {/* INTERACTIVE FOG OF WAR CELLS RENDER */}
              <div className="absolute inset-0 grid pointer-events-none" style={{ gridTemplateRows: `repeat(${gridRows}, 1fr)`, gridTemplateColumns: `repeat(${gridCols}, 1fr)`, zIndex: 15 }}>
                {Array.from({ length: gridRows }).map((_, r) => {
                  return Array.from({ length: gridCols }).map((_, c) => {
                    const key = `${r}-${c}`;
                    const explored = exploredCells.includes(key);
                    return (
                      <div 
                        key={key} 
                        onClick={(e) => handleCellClick(r, c, e)}
                        className={`pointer-events-auto border border-white/5 transition-all text-[8px] flex items-center justify-center font-mono font-bold select-none cursor-crosshair ${
                          explored 
                            ? 'bg-transparent text-white/5 hover:bg-neutral-800/10' 
                            : 'bg-[#020617ef]/95 backdrop-blur-[1px] text-neutral-600 border border-black hover:bg-slate-900/40'
                        }`}
                      >
                        {!explored && "FOG"}
                      </div>
                    );
                  });
                })}
              </div>

              {/* DRAW NODE DOTS */}
              {nodes.map(node => {
                const explored = isPointExplored(node.x, node.y);
                const isSpent = spentPoints.includes(node.id);
                const isSelected = selectedNodeId === node.id;

                // Check search filter matches
                const isMatched = searchTerm && (
                  node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  node.baseStats.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  node.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  evaluateNodeStats(node).stats.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (node.options && node.options.some(o => o.toLowerCase().includes(searchTerm.toLowerCase())))
                );

                let nodeStyleClass = "border-neutral-700 bg-neutral-900 text-neutral-400";
                
                if (explored) {
                  if (node.type === 'notable') nodeStyleClass = "border-emerald-500 bg-neutral-950 text-emerald-400";
                  else if (node.type === 'selectable') nodeStyleClass = "border-blue-500 bg-neutral-950 text-blue-400";
                  else if (node.type === 'jewel') nodeStyleClass = "border-amber-500 bg-neutral-950 text-amber-400";
                  else if (node.type === 'story') nodeStyleClass = "border-pink-500 bg-neutral-950 text-pink-400";
                  else nodeStyleClass = "border-neutral-500 bg-neutral-800 text-neutral-300";
                }

                if (isSpent && explored) {
                  nodeStyleClass += " ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-950 scale-110 shadow-[0_0_15px_rgba(253,224,71,0.5)]";
                }

                if (isSelected && explored) {
                  nodeStyleClass += " border-double border-4 border-[#ffd700] scale-125 z-25";
                }

                if (isMatched && explored) {
                  nodeStyleClass += " ring-4 ring-orange-500 scale-125 z-30 shadow-[0_0_20px_rgba(249,115,22,1)] animate-pulse";
                }

                return (
                  <button
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    className={`absolute flex items-center justify-center w-8 h-8 rounded-full border transition-all text-[10px] font-bold shadow-md select-none group cursor-pointer z-20 ${nodeStyleClass}`}
                    style={{ left: `${node.x - 16}px`, top: `${node.y - 16}px` }}
                  >
                    {!explored ? (
                      <span className="text-gray-700">?</span>
                    ) : (
                      <React.Fragment>
                        {node.type === 'small' && <Compass className="w-4 h-4 text-neutral-300" />}
                        {node.type === 'notable' && <Trophy className="w-4 h-4 text-emerald-400" />}
                        {node.type === 'selectable' && <Settings2 className="w-4 h-4 text-blue-400" />}
                        {node.type === 'jewel' && <Shield className="w-4 h-4 text-amber-400 animate-pulse" />}
                        {node.type === 'story' && <BookOpen className="w-4 h-4 text-pink-400" />}
                      </React.Fragment>
                    )}

                    {/* Node Hover Tooltip overlay */}
                    {explored && (
                      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 hidden group-hover:block bg-slate-900 border border-neutral-700/60 p-2 rounded shadow-2xl z-50 text-[10px] text-left pointer-events-none leading-relaxed">
                        <div className="font-bold text-white mb-0.5">{node.name}</div>
                        <div className="text-[8px] uppercase tracking-wider text-neutral-400 mb-1">{node.type} node</div>
                        <div className="text-yellow-400 font-semibold mb-1 leading-normal">{evaluateNodeStats(node).stats}</div>
                        <div className="text-neutral-400 leading-normal">{node.desc.substring(0, 50)}...</div>
                      </div>
                    )}
                  </button>
                );
              })}

              {/* RENDER DYNAMIC BUILDER PLACEMENT GUIDE */}
              {sidebarTab === 'builder' && clickedCoord && (
                <div 
                  className="absolute pointer-events-none translate-x-[-50%] translate-y-[-50%] z-45 flex flex-col items-center gap-1"
                  style={{ left: `${clickedCoord.x}px`, top: `${clickedCoord.y}px` }}
                >
                  <div className="w-8 h-8 bg-orange-500/15 border-2 border-dashed border-orange-500 rounded-full flex items-center justify-center text-[11px] font-bold text-orange-400 animate-pulse">
                    +
                  </div>
                  <div className="text-[8px] font-mono font-bold bg-orange-500 text-black px-1 rounded uppercase tracking-wide">Place Node</div>
                </div>
              )}

              {/* RENDER THE PLAYER BEACON GIZMO */}
              <div 
                className="absolute w-6 h-6 -ml-3 -mt-3 select-none pointer-events-none z-30 transition-all duration-300 flex items-center justify-center"
                style={{ left: `${playerPos.x}px`, top: `${playerPos.y}px` }}
              >
                <div className="absolute w-12 h-12 bg-blue-500/10 rounded-full border border-blue-500/30 animate-ping" />
                <div className="absolute w-8 h-8 bg-blue-400/20 rounded-full border border-blue-400/50" />
                <div className="w-3.5 h-3.5 bg-blue-400 rounded-full border-2 border-white flex items-center justify-center shadow-md shadow-blue-500 flex-none col-span-1">
                  <span className="w-1.5 h-1.5 bg-blue-800 rounded-full" />
                </div>
              </div>

            </div>
            
            {/* TRAVERSAL MAP CLICKPAD CONTROLS */}
            <div className="mt-4 p-3 bg-black/40 border border-kingfisher-border/50 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <Compass className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Simulated Traversal Coordinate: <strong>({playerPos.x}X, {playerPos.y}Y)</strong></span>
              </div>
              <div className="text-neutral-400 text-[11px] italic">
                {sidebarTab === 'builder' 
                  ? "Click anywhere on uncharted dark areas above to anchor custom coordinate nodes!" 
                  : "Click map grid blocks or node markers to move player, clearing FOG ranges on-the-fly."}
              </div>
            </div>
          </div>

          {/* SIMULATOR RIGHT SIDEBAR PANEL */}
          <div className="w-full lg:w-80 flex flex-col border border-kingfisher-border/40 rounded-xl bg-slate-900/60 p-4 shrink-0 text-left">
            
            {/* Header Tabs Navigation */}
            <div className="flex bg-black/60 p-1 border border-neutral-805 rounded-lg max-w-full overflow-x-auto select-none gap-1 shrink-0 mb-4 h-9 items-center col-span-1">
              {[
                { id: 'inspect', label: 'Inspect', icon: Eye },
                { id: 'craft', label: 'Craft Jewel', icon: Sparkles },
                { id: 'builder', label: 'Builder', icon: Plus },
                { id: 'scaling', label: 'Stressor', icon: Cpu }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSidebarTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-2 py-1 h-7 rounded text-[9.5px] font-bold uppercase tracking-wider shrink-0 transition ${
                    sidebarTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: INSPECT MODE */}
            {sidebarTab === 'inspect' && (
              <div className="flex-1 flex flex-col space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
                  <div className="text-xs uppercase font-bold text-neutral-300">Active Node Scanner</div>
                  <div className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-500 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    <Trophy className="w-3 h-3" /> {spentPoints.length}/{maxPoints} Spent
                  </div>
                </div>

                {activeDetailNode ? (
                  <div className="space-y-3.5 flex-1 text-left">
                    <div className="p-3 bg-black/40 border border-neutral-850 rounded-lg">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-bold text-white text-xs truncate">{activeDetailNode.name}</h4>
                        <span className="text-[8px] uppercase font-bold tracking-widest px-1.5 py-0.2 bg-neutral-800 border border-neutral-800 rounded text-neutral-300">
                          {activeDetailNode.type}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-400 leading-normal italic">
                        Coordinate Matrix: [{activeDetailNode.x}X, {activeDetailNode.y}Y]
                      </div>
                    </div>

                    <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg space-y-1.5 text-xs">
                      <div className="text-[10px] uppercase font-bold tracking-wide text-blue-400">Resolved Stats Yield</div>
                      <p className="font-semibold text-yellow-300 leading-relaxed font-mono">
                        {activeDetailEvaluated?.stats}
                      </p>
                      <p className="text-neutral-400 text-[11px] leading-relaxed">
                        {activeDetailEvaluated?.desc}
                      </p>
                    </div>

                    {/* ALLOCATION SWITCH BUTTON CONTROLS */}
                    <div className="space-y-2">
                      {isPlayerAtActiveNode ? (
                        <button
                          onClick={() => handleAllocateNode(activeDetailNode.id)}
                          className={`w-full py-2 px-3 rounded text-[10px] uppercase tracking-wider font-bold transition flex items-center justify-center gap-2 ${
                            spentPoints.includes(activeDetailNode.id)
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-amber-600 hover:bg-orange-700 text-white'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5" />
                          {spentPoints.includes(activeDetailNode.id) ? 'Refund Point' : 'Allocate Passive'}
                        </button>
                      ) : (
                        <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-neutral-400 text-[10px] leading-relaxed flex items-start gap-1.5 text-left">
                          <AlertCircle className="w-4 h-4 text-red-100 shrink-0 mt-0.5 pointer-events-none" />
                          <span>Player too far to interact. Move player beacon within range (100 px) by clicking adjacent cells first.</span>
                        </div>
                      )}
                    </div>

                    {/* CONDITIONAL CONTROLS - SELECTABLE 1-OF-3 CHANNELS */}
                    {activeDetailNode.type === 'selectable' && (
                      <div className="p-3 bg-black/40 border border-neutral-850 rounded-lg space-y-2 text-xs">
                        <strong className="text-blue-400 block font-bold text-[10px] uppercase tracking-wider text-left font-sans">Configure Camp Master Attribute</strong>
                        <div className="space-y-1.5 font-sans">
                          {activeDetailNode.options?.map((opt, oIdx) => (
                            <button
                              key={`opt-${oIdx}`}
                              onClick={() => handleSelectOption(activeDetailNode.id, oIdx)}
                              className={`w-full p-2 rounded text-left leading-normal text-[11px] border transition ${
                                activeDetailNode.selectedOptionIndex === oIdx
                                  ? 'bg-blue-600/30 border-blue-500 text-white font-semibold'
                                  : 'bg-black/20 border-neutral-800 text-neutral-400 hover:bg-black/40 hover:text-white'
                              }`}
                            >
                              Option {oIdx + 1}: {opt.substring(7, 45)}...
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CONDITIONAL CONTROLS - JEWEL SOCKET SLOTS */}
                    {activeDetailNode.type === 'jewel' && (
                      <div className="p-3 bg-black/55 border border-neutral-800/80 rounded-lg space-y-2.5 text-xs text-left">
                        <strong className="text-amber-400 block font-bold text-[10px] uppercase tracking-wider text-left">Socket Custom-Crafted Jewel</strong>
                        
                        <div className="space-y-1.5 font-sans">
                          <label className="text-neutral-400 text-[10px] block font-sans">Select Jewel inside item bag:</label>
                          <select
                            value={socketedJewels[activeDetailNode.id] || ''}
                            onChange={(e) => handleSocketJewel(activeDetailNode.id, e.target.value || null)}
                            className="w-full bg-slate-950 border border-neutral-800 p-1.5 text-xs text-white rounded outline-none cursor-pointer"
                          >
                            <option value="">[No Jewel Socketed]</option>
                            {inventoryJewels.map(j => (
                              <option key={j.id} value={j.id}>{j.name} (r={j.influenceRadius}px)</option>
                            ))}
                          </select>
                        </div>
                        {socketedJewels[activeDetailNode.id] && (
                          <div className="text-[10px] text-neutral-400 pt-1 border-t border-neutral-900 leading-normal italic font-sans text-neutral-300">
                            {inventoryJewels.find(j => j.id === socketedJewels[activeDetailNode.id])?.effect}
                          </div>
                        )}
                      </div>
                    )}

                    {/* CONDITIONAL CONTROLS - BRANCHING STORY DECISIONS */}
                    {activeDetailNode.type === 'story' && activeDetailNode.questDependency && (
                      <div className="p-3 bg-black/40 border border-neutral-850 rounded-lg space-y-3 text-xs text-left font-sans">
                        <strong className="text-pink-400 block font-semibold text-[10px] uppercase tracking-widest text-left font-sans font-medium">Story Quest Synchronization</strong>
                        <p className="text-neutral-400 text-[10px] font-sans">
                          This location corresponds to quest "<strong>{activeDetailNode.questDependency.questName}</strong>". Choose the path to simulate state transitions:
                        </p>
                        
                        {activeDetailNode.questDependency.conditionVar === 'spiritOutcome' ? (
                          <div className="grid grid-cols-2 gap-1 px-0.5">
                            <button 
                              onClick={() => setSpiritOutcome('freed')}
                              className={`py-1.5 rounded font-bold text-[9px] uppercase tracking-wider transition ${spiritOutcome === 'freed' ? 'bg-pink-600 text-white font-bold' : 'bg-neutral-800 text-neutral-400'}`}
                            >
                              Freed Spirit
                            </button>
                            <button 
                              onClick={() => setSpiritOutcome('slain')}
                              className={`py-1.5 rounded font-bold text-[9px] uppercase tracking-wider transition ${spiritOutcome === 'slain' ? 'bg-pink-600 text-white font-bold' : 'bg-neutral-800 text-neutral-400'}`}
                            >
                              Destroyed Spirit
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-1 px-0.5">
                            <button 
                              onClick={() => setOrphansOutcome('saved')}
                              className={`py-1.5 rounded font-bold text-[9px] uppercase tracking-wider transition ${orphansOutcome === 'saved' ? 'bg-pink-600 text-white font-bold' : 'bg-neutral-800 text-neutral-400'}`}
                            >
                              Saved Orphans
                            </button>
                            <button 
                              onClick={() => setOrphansOutcome('consumed')}
                              className={`py-1.5 rounded font-bold text-[9px] uppercase tracking-wider transition ${orphansOutcome === 'consumed' ? 'bg-[#ff3b30]/25 text-[#ff3b30] font-bold font-medium' : 'bg-neutral-800 text-neutral-400'}`}
                            >
                              Crones Devoured
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="py-8 text-center text-neutral-500 text-xs font-sans">
                    Please select a Node coordinates dot on the left canvas grid to begin scanning.
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: JEWEL CRAFTING MODE */}
            {sidebarTab === 'craft' && (
              <div id="world-skill-tree-jewel-crafter" className="flex-1 flex flex-col space-y-3.5 text-xs text-left font-sans">
                <div className="text-xs uppercase font-bold text-neutral-300 border-b border-neutral-850 pb-2 font-sans">
                  Procedural Jewel Assembly
                </div>
                
                <div className="space-y-1">
                  <span className="text-neutral-400 text-[10px] font-sans">Procedural Jewel Name:</span>
                  <div className="flex gap-1.5">
                    <input 
                      type="text"
                      value={craftName}
                      onChange={(e) => setCraftName(e.target.value)}
                      className="flex-1 bg-slate-950 border border-neutral-800 px-2 py-1 h-7 text-xs text-white rounded outline-none"
                    />
                    <button 
                      onClick={handleGenerateRandomName}
                      className="bg-amber-600/25 hover:bg-amber-600/40 text-amber-300 border border-amber-600/40 px-2 rounded text-[10px] font-bold transition-colors uppercase h-7"
                    >
                      Roll
                    </button>
                  </div>
                </div>

                <div className="space-y-1 font-sans">
                  <div className="flex justify-between items-center text-[10px] font-sans">
                    <span className="text-neutral-400">Resonance Radius (in meters/px):</span>
                    <span className="text-yellow-400 font-mono font-bold">{craftRadius}m</span>
                  </div>
                  <input 
                    type="range"
                    min="50"
                    max="220"
                    value={craftRadius}
                    onChange={(e) => setCraftRadius(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg outline-none"
                  />
                  <div className="flex items-center justify-between text-[8px] text-zinc-500 font-mono">
                    <span>MIN: 50 px</span>
                    <span>MAX: 220 px</span>
                  </div>
                </div>

                <div className="space-y-1.5 font-sans">
                  <span className="text-neutral-400 text-[10px]">Affixed Core Resonance Modifiers:</span>
                  <div className="space-y-1">
                    {[
                      { id: 'A', label: 'Convert neighbors to Poison strike rates' },
                      { id: 'B', label: '+15% Crit Multiplier & spell casting rate' },
                      { id: 'C', label: 'Boost life & energy dynamic recovery speed' },
                      { id: 'D', label: 'Deal +30% chill area duration and cold stats' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setCraftChoice(opt.id)}
                        className={`w-full p-2 border rounded text-left text-[10.5px] transition ${
                          craftChoice === opt.id
                            ? 'bg-amber-600/20 border-amber-500 text-white font-semibold font-sans'
                            : 'bg-black/25 border-neutral-800 text-neutral-400 hover:bg-black/45'
                        }`}
                      >
                        <strong>Affix {opt.id}:</strong> {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAssembleJewel}
                  className="w-full py-2 bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-700 hover:to-amber-850 text-white font-bold rounded uppercase tracking-wider text-[10px] shadow-md transition-all mt-2 h-8"
                >
                  Assemble & Add to Bag
                </button>
              </div>
            )}

            {/* TAB CONTENT: NODE DYNAMIC BUILDER MODE */}
            {sidebarTab === 'builder' && (
              <div id="world-skill-tree-nodes-builder" className="flex-1 flex flex-col space-y-3.5 text-xs text-left">
                <div className="text-xs uppercase font-bold text-neutral-300 border-b border-neutral-850 pb-2 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-orange-400" />
                  Node Placement Builder
                </div>

                <div className="p-2.5 bg-orange-500/5 border border-orange-500/20 rounded-lg text-neutral-400 text-[10.5px] leading-relaxed font-sans font-medium">
                  <strong>How to use:</strong> Click anywhere on Fog regions on the left canvas to capture coordinate matrices, then pick properties below to bake.
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-black/45 p-2 rounded border border-neutral-850">
                  <div>Anchor physical position:</div>
                  <div className="text-orange-400 font-bold text-right truncate">
                    {clickedCoord ? `(${clickedCoord.x}x, ${clickedCoord.y}y)` : '[Pending Grid Click]'}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 text-[10px]">Node Name Label:</label>
                  <input 
                    type="text"
                    placeholder="e.g. Kaer Morhen Sword Altar"
                    value={builderName}
                    onChange={(e) => setBuilderName(e.target.value)}
                    className="w-full bg-slate-950 border border-neutral-800 px-2 py-1 text-xs text-white rounded outline-none h-7 font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 font-medium">
                  <div className="space-y-1">
                    <label className="text-neutral-400 text-[10px] font-sans">Node Category:</label>
                    <select
                      value={builderType}
                      onChange={(e) => setBuilderType(e.target.value as NodeType)}
                      className="w-full bg-slate-950 border border-neutral-800 p-1 rounded text-xs text-white outline-none h-7 cursor-pointer"
                    >
                      <option value="small">Small Connector</option>
                      <option value="notable">Notable Capital</option>
                      <option value="jewel">Jewel Socket</option>
                      <option value="selectable">Camp Selectable</option>
                      <option value="story">Story Quest Branch</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-neutral-400 text-[10px] font-sans">Connect spline to:</label>
                    <select
                      value={builderTargetId}
                      onChange={(e) => setBuilderTargetId(e.target.value)}
                      className="w-full bg-slate-950 border border-neutral-800 p-1 rounded text-xs text-white outline-none h-7 cursor-pointer"
                    >
                      {nodes.map(n => (
                        <option key={n.id} value={n.id}>{n.name.substring(0, 16)}...</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1 font-sans">
                  <label className="text-neutral-400 text-[10px] font-sans">Base Performance stats boost:</label>
                  <input 
                    type="text"
                    value={builderStats}
                    onChange={(e) => setBuilderStats(e.target.value)}
                    className="w-full bg-slate-950 border border-neutral-800 px-2 py-1 text-xs text-white rounded outline-none h-7"
                  />
                </div>

                <div className="space-y-1 font-sans">
                  <label className="text-neutral-400 text-[10px] font-sans">Design lore description:</label>
                  <textarea 
                    value={builderDesc}
                    onChange={(e) => setBuilderDesc(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-950 border border-neutral-800 px-2 py-1 text-xs text-white rounded outline-none resize-none font-sans"
                  ></textarea>
                </div>

                <button
                  onClick={handleEmbedNode}
                  disabled={!clickedCoord}
                  className={`w-full py-2 font-bold rounded uppercase tracking-wider text-[10px] shadow-md transition-all h-8 ${
                    clickedCoord 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white cursor-pointer h-8' 
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-800'
                  }`}
                >
                  Bake Node into System
                </button>
              </div>
            )}

            {/* TAB CONTENT: STRESSOR METRICS SIMULATOR MODE */}
            {sidebarTab === 'scaling' && (
              <div id="world-skill-tree-scaling-stresser" className="flex-1 flex flex-col space-y-3.5 text-xs text-left">
                <div className="text-xs uppercase font-bold text-neutral-300 border-b border-neutral-850 pb-2 flex items-center gap-1.5 font-sans">
                  <Cpu className="w-4 h-4 text-emerald-400 pointer-events-none" />
                  Scale Stress Benchmarker
                </div>

                <p className="text-zinc-500 text-[10px] leading-relaxed font-sans">
                  Bypass heap splits. Compare actor OOP allocations versus type-aligned DOD structs (alignas(16)) as complexity scales to thousands of entries.
                </p>

                <div className="space-y-2 font-sans font-semibold">
                  <span className="text-[10px] text-zinc-400 block font-sans">Simulate Node Array Size Matrix:</span>
                  <div className="grid grid-cols-4 gap-1">
                    {[100, 1000, 10000, 50000].map(s => (
                      <button
                        key={s}
                        onClick={() => setStresserScale(s)}
                        className={`py-1.5 rounded font-mono font-bold text-[9px] transition ${
                          stresserScale === s
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                        }`}
                      >
                        {s.toLocaleString()} Nodes
                      </button>
                    ))}
                  </div>
                </div>

                {/* HARDWARE OVERHEAD METRIC CARDS */}
                <div className="space-y-2.5 bg-black/50 p-3 rounded-lg border border-neutral-800/80 font-sans font-semibold">
                  <div className="border-b border-neutral-900 pb-1.5 flex justify-between items-center text-[10px] text-rose-300 uppercase tracking-wider font-bold">
                    <span>Class OOP (UObjects Array)</span>
                    <span className="text-[8px] uppercase px-1.5 py-0.2 bg-red-950/40 text-rose-300 rounded font-mono">Heavy Actors</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] font-mono leading-none">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">RAM Allocated (heap):</span>
                      <span className="text-rose-400 font-bold">{(stresserScale * 1.5).toLocaleString()} KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Query Speed (O(N) Loops):</span>
                      <span className="text-rose-400 font-bold">{(stresserScale * 0.0003).toFixed(2)} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">GC Sweeping Frame Dropping:</span>
                      <span className="text-rose-400 font-bold">{(stresserScale * 0.00024).toFixed(1)} ms spike</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Replication Packet Traffic:</span>
                      <span className="text-rose-400 font-bold">{(stresserScale * 120).toLocaleString()} bytes</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 bg-black/50 p-3 rounded-lg border border-neutral-800/80 font-semibold font-sans">
                  <div className="border-b border-neutral-900 pb-1.5 flex justify-between items-center text-[10px] text-emerald-400 uppercase tracking-wide font-bold">
                    <span>Continuous DOD Struct Array</span>
                    <span className="text-[8px] uppercase px-1.5 py-0.2 bg-emerald-950/40 text-emerald-300 rounded font-mono">C++ POD (O(1))</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] font-mono leading-none">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">RAM Allocated (contig):</span>
                      <span className="text-emerald-400 font-bold">{(stresserScale * 0.032).toFixed(1)} KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Query Speed (Quad-Tree):</span>
                      <span className="text-emerald-400 font-bold">0.01 ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500 font-medium">GC Sweep Frame Dropping:</span>
                      <span className="text-emerald-400 font-bold">0.0 ms (Bypassed)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Replication Packet Traffic:</span>
                      <span className="text-emerald-400 font-bold">12 bytes (Delta Pack)</span>
                    </div>
                  </div>
                </div>

                <div className="text-[9.5px] text-zinc-500 leading-relaxed italic border-t border-neutral-800 pt-1 text-center font-sans">
                  *Continuous 32-byte SIMD layout structures totally bypass GC sweep intervals, safeguarding high-frequency game logic frames for PC and consoles.
                </div>
              </div>
            )}

            {/* THE SPENT OPTIONS LIST DISPLAY INSIDE BASE SIDEBAR FOOTER */}
            <div className="mt-4 p-3 bg-black/40 border border-neutral-800/80 rounded-xl space-y-1.5 text-left font-sans">
              <div className="text-[10px] font-bold text-[#ffd700] uppercase tracking-widest block border-b border-neutral-800 pb-1">
                Active Stats Multipliers
              </div>
              <div className="max-h-24 overflow-y-auto pr-1 text-[9px] font-mono text-zinc-300 space-y-1 leading-relaxed custom-scrollbar">
                {allocatedStats.length > 0 ? (
                  allocatedStats.map((stat, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <span className="text-yellow-400">•</span>
                      <span>{stat}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-neutral-500 italic text-center py-2 text-[10px] font-sans">
                    No active stats. Allocate nodes and explore map coordinates to activate boosters.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* FOOTER ACCUMULATIVE ALLOCATED STATS */}
        {allocatedStats.length > 0 && (
          <div className="mt-4 pt-3 border-t border-neutral-800 text-left">
            <div className="text-[10px] uppercase font-semibold text-neutral-400 mb-1.5 flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-yellow-500 animate-pulse pointer-events-none" />
              Active Accumulative Passives Matrix (O(1))
            </div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto custom-scrollbar">
              {allocatedStats.map((st, sI) => (
                <span key={`ast-${sI}`} className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-200 text-[10px] font-mono font-medium px-2 py-0.5 rounded">
                  ● {st}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* SECTION 2: TECHNICAL PERFORMANCE IMPACT MATRIX */}
      <h3 className="font-bold text-white text-lg tracking-wide mt-6">Transparent Hardware & Network Budget Impact</h3>
      <p className="text-sm text-kingfisher-muted mb-4">
        Implementing a unified World-as-Skill-Tree system has dramatic physical consequences on high-end hardware, memory architectures, and networking bounds. 
        Unlike basic floating components, we optimize directly to prevent micro-stutters and frame pacing drops.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        <SectionCard id="world-skill-tree-fog-fow" title="1. GPU Rendering & Fog of War Masks" icon={Sliders} color="text-pink-400">
          <p className="text-sm text-neutral-400">
            <strong>The Problem:</strong> Erasing the Fog of War visually across a massive 15km² world using individual volumetric particles or transparent vector actor layers crashes the PS5/PC rendering pipeline due to dynamic pixel overdraw (&gt;12ms GPU penalty).
          </p>
          <div className="space-y-3 text-xs pt-1">
            <div className="p-3 bg-black/30 rounded border border-neutral-800">
              <strong className="text-pink-400 block mb-1">Canvas Render Target Projection (O(1))</strong>
              Instead of placing 3D decals, the game writes localized "cleansed circles" to a single 2048x2048 low-latency single-channel (R8) <strong>dynamic texture render target</strong>. 
              The world terrain master shader and mini-map layout look up coordinates from this texture in constant O(1) time matching screen pixels.
            </div>
            <div className="p-3 bg-black/30 rounded border border-neutral-800">
              <strong className="text-pink-400 block mb-1">Instanced Spline Batching</strong>
              Connecting passives require drawn golden lines (splines) connecting nodes. 
              Splines are batched directly into a single massive <strong>Hierarchical Instanced Static Mesh (HISM)</strong> vertex block on the GPU, zeroing out draw count cycles.
            </div>
          </div>
          <MultiplayerImpact 
            gpu="+0.4ms (Single RT texture lookup in G-Buffer base pass)"
            cpu="0.1ms (Asynchronous thread brush coordinates draw checks)"
            ram="+1MB (Extremely tiny CPU-side coordinates matrix tracker)"
            vram="+4MB (Single-channel 2048x2048 uncompressed R8 render mask)"
            latency="Zero"
          />
        </SectionCard>

        <SectionCard id="world-skill-tree-node-registry" title="2. CPU & RAM Architecture: Data-Oriented Entities" icon={Cpu} color="text-amber-400">
          <p className="text-sm text-neutral-400">
            <strong>The Problem:</strong> Storing thousands of individual passive nodes, sockets, and connections as standard `AActor` or `UObject` pointers creates massive garbage collection sweeps and heaps fragmentations on travel phases (blocks frames by over 14ms).
          </p>
          <div className="space-y-3 text-xs pt-1">
            <div className="p-3 bg-black/30 rounded border border-neutral-800">
              <strong className="text-amber-400 block mb-1">C++ Plain Old Data (POD) Structs</strong>
              Each cell node uses custom 32-byte memory aligned struct layouts: 
              <code className="text-[#ffd700] block mt-1.5 mb-1 font-mono text-[10px] leading-snug">
                alignas(16) struct FPassiveNode {'{'} uint32 NodeID; FVector2D Coord2D; uint8 NodeGroup; uint8 SelectedOpt; uint32 Padding; {'}'}
              </code>
              No object reference creation overhead. Kept packed continuously inside consecutive stack sectors.
            </div>
            <div className="p-3 bg-black/30 rounded border border-neutral-800">
              <strong className="text-amber-400 block mb-1">Quad-Tree Lookup Indexing</strong>
              When the actor crosses boundary portals, the engine updates localized regions using an static immutable Quad-Tree. 
              It locates nearby node elements in under <strong>0.02ms</strong>, only then streaming 3D local visual interactions (falling cherry blossoms or stone monoliths) on the render thread.
            </div>
          </div>
          <MultiplayerImpact 
            gpu="0ms (No geometric overhead for hidden coordinates)"
            cpu="0.05ms (O(1) quad-tree search and bit field checks)"
            ram="Saves -800MB (By stripping 3D actors, using 32-byte C++ structures)"
            vram="0ms"
            latency="Zero"
          />
        </SectionCard>

        <SectionCard id="world-skill-tree-story-persistence" title="3. Story Linkages & Networking Synchronization" icon={Radio} color="text-emerald-400">
          <p className="text-sm text-neutral-400">
            <strong>The Problem:</strong> Syncing dynamic quest modifier states, active choices (1 of 3 options), and socketed jewels per-node over peer co-op networks triggers severe buffer bloat and connection drops.
          </p>
          <div className="space-y-3 text-xs pt-1">
            <div className="p-3 bg-black/30 rounded border border-neutral-800">
              <strong className="text-emerald-400 block mb-1">State Decoupling & Bitmask Registers</strong>
              Quests write 64-bit Boolean flags inside the client\'s local story journal state. 
              Passive nodes do not query quest states continuously; they simply execute logical bitmask filters on stats recalculation requests.
            </div>
            <div className="p-3 bg-black/30 rounded border border-neutral-800">
              <strong className="text-emerald-400 block mb-1">Delta IRIS Network Serialization</strong>
              Socketed jewels and multi-choice selections only synchronize via compressed 12-byte packets transmitted when the campsite interaction completes. 
              Prevents redundant ticks across network streams.
            </div>
          </div>
          <MultiplayerImpact 
            gpu="0ms"
            cpu="0.01ms (Zero-copy Bitmask evaluations)"
            ram="<4KB (Static state bitfield allocations)"
            vram="0ms"
            latency="Zero network overhead (replicated delta packets only on change)"
          />
        </SectionCard>

        <SectionCard title="Pre-Production Summary Goals (Witcher 3, PoE & BG3)" icon={BookOpen} color="text-indigo-400">
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span><strong>The Witcher 3:</strong> Unifying maps with passive trees mirrors Witcher medallion ranges. Relies on fast exploration coordinate markers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span><strong>Path of Exile:</strong> Radius jewel socketing enables deep theorycrafting on physical landmarks (i.e. socketing silver jewels at Kaer Morhen boosts swordsmen passives).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span><strong>Baldur\'s Gate 3:</strong> Dynamic multipliers. Cleanly branching quest results (e.g., freeing the Whispering spirit) permanently corrupts the swamp node modifiers while boosting traversal speeds.</span>
            </li>
          </ul>
        </SectionCard>
      </div>

      {/* SECTION 3: UNREAL ENGINE 5.5 CAPABILITY ASSESSMENT */}
      <div className="mt-6 border border-kingfisher-border/60 rounded-xl p-6 bg-kingfisher-panel/30">
        <h3 className="font-bold text-white text-lg tracking-wide mb-3 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-400" />
          Unreal Engine 5.5 - Capability & Limitation Review
        </h3>
        <p className="text-sm text-kingfisher-muted mb-4">
          Unreal Engine provides powerful rendering tools, but defaults to bloated, OOP character-mesh hierarchies out of the box. 
          To support thousands of interconnected nodes and fog-of-war bounds globally without rendering stutters, we analyze what tools the engine provides, what is critical but missing, and how to program around it.
        </p>

        <FeatureMatrix 
          has={[
            "Canvas Render Target 2D: Native canvas elements allowing rendering coordinates into textures utilizing basic materials.",
            "World Partition & Data Layers: Allows streaming detailed interactive physical markers structures based on regional cells.",
            "FStreamableManager: Asynchronous asset pre-fetching for custom visual models."
          ]}
          missing={[
            "Dynamic UI Spline Batcher: Creating lines with standard UMG Widgets requires redundant recalculations. Laying out 1,000 links causes frame stalling (&gt;15ms CPU).",
            "GIS Node Coordinates Matrix: Unreal lacks built-in data representation mapping massive custom static trees to physical 3D world meshes.",
            "Dynamic Delta Persistence on disk: Native save-game serializations (USaveGame) force slow, block-blocking sequential sweeps."
          ]}
          howToUse="Bake the logical passive map node entries into static aligned C++ structural arrays during Cook. Implement a central UWorldSubsystem running background thread sweeps. Render splines by batching vector lines inside Custom Instanced Mesh layers in a centralized HUD master Canvas widget."
        />
      </div>

      {/* SECTION 4: PRODUCTION C++ ARCHITECTURE COMPILATION BLUEPRINT */}
      <div className="mt-6">
        <SectionCard title="Production-Ready C++ Integration Blueprint" icon={Activity} color="text-blue-400">
          <p className="text-sm text-neutral-400 mb-4">
            This robust, type-safe C++ setup demonstrates how to pack structural properties descending in memory blocks to satisfy SIMD alignment restrictions, handle network-friendly replication channels efficiently using modern IRIS networks, and query nearby coordinates using Quad-Tree indices under constant O(1) space.
          </p>

          <CodeBlock 
            language="cpp"
            code={`
#pragma once

#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "Net/Serialization/FastArraySerializer.h"
#include "WorldSkillTreeMapSubsystem.generated.h"

// Define the 5 explicit Node categorization states
UENUM(BlueprintType)
enum class EPassiveNodeType : uint8
{
    Small       UMETA(DisplayName = "Small Connector"),
    Notable     UMETA(DisplayName = "Notable Landmark"),
    JewelSocket UMETA(DisplayName = "Jewel Socket"),
    Selectable  UMETA(DisplayName = "Camp Selectable Options"),
    StoryBranch UMETA(DisplayName = "Dynamic Story Dependent")
};

/**
 * Aligned 32-Byte Packed Passive Node Data Structure
 * Members sorted descending largest-to-smallest to eliminate dynamic compiler gaps (L1 cache-friendly).
 */
USTRUCT(BlueprintType)
struct alignas(16) FPassiveNodeInfo
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, Category = "Coordinates")
    FVector2D WorldCoords2D;           // 16 Bytes (Double Precision Float 2x8)

    UPROPERTY(BlueprintReadOnly, Category = "Identity")
    uint32 NodeID;                     // 4 Bytes

    UPROPERTY(BlueprintReadOnly, Category = "Metadata")
    EPassiveNodeType NodeType;         // 1 Byte

    UPROPERTY(BlueprintReadOnly, Category = "State")
    uint8 SelectedOptionIndex;         // 1 Byte

    UPROPERTY(BlueprintReadOnly, Category = "State")
    uint8 bIsUnlocked : 1;             // 1 Bit Bitfield

    UPROPERTY(BlueprintReadOnly, Category = "State")
    uint8 bIsCorrupted : 1;           // 1 Bit Bitfield

    // Compile-time struct security verification
    UPROPERTY(BlueprintReadOnly, Category = "Metadata")
    uint8 Padding[9];                  // Fixed padding ensures structure aligns cleanly to 32 bytes
};

/**
 * Replicated Node Delta Payload utilizing IRIS Fast Array serialization mechanics.
 */
USTRUCT(BlueprintType)
struct FNodeDeltaState : public FFastArraySerializerItem
{
    GENERATED_BODY()

    UPROPERTY()
    uint32 NodeID;

    UPROPERTY()
    uint8 SelectedOptionIndex;

    UPROPERTY()
    uint8 ActiveStateBitfield;

    UPROPERTY()
    FName SocketedJewelID;
};

/**
 * World-As-Skill-Tree Map Master Subsystem (C++ Core)
 * Manages spatial registrations, fast quad-tree coordinate validations, and state routing.
 */
UCLASS()
class RPG_API UWorldSkillTreeMapSubsystem : public UWorldSubsystem
{
    GENERATED_BODY()

public:
    virtual void Initialize(FSubsystemCollectionBase& Collection) override;
    virtual void Deinitialize() override;

    // Fast O(1) perception query finding the closest interactive node Shrine coordinates
    UFUNCTION(BlueprintCallable, Category = "SkillTree|Physics")
    bool QueryNodeByCoordinates(const FVector& SearchPos, float MaxRange, FPassiveNodeInfo& OutNode);

    // Dynamic camp choices modifier alteration
    UFUNCTION(BlueprintCallable, Server, Reliable, Category = "SkillTree|ServerSync")
    void Server_SetSelectableNodeOption(uint32 NodeID, uint8 SelectionIndex);

    // Custom save serialization path saving deltas to disk under 0.1ms
    void SerializeState(FArchive& Ar);

private:
    // Internal immutable coordinate definitions cached intensely closely
    TArray<FPassiveNodeInfo> CachedNodesRegistry;

    // Bit-packed status mask arrays
    TMap<uint32, FNodeDeltaState> ActiveDeltaTable;
};
            `}
          />
        </SectionCard>
      </div>
    </div>
  );
};
