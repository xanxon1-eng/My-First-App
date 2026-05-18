import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Box, Terminal, ChevronRight, Info, AlertTriangle, ShieldCheck, Cpu, Database, Network, TrendingUp, Layers, FileWarning, Hexagon, Component, Waypoints, ArrowRight, XCircle, Crosshair } from 'lucide-react';
import { frameworkSystems } from '../data/frameworkRegistry';
import HoverableLine from './HoverableLine';
import GlossaryToggle from './GlossaryToggle';
import HoverableTerm from './HoverableTerm';

const PillarIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Performance': return <Cpu className="w-3 h-3 text-red-400" />;
    case 'Memory': return <Database className="w-3 h-3 text-green-400" />;
    case 'Networking': return <Network className="w-3 h-3 text-blue-400" />;
    case 'Scalability': return <TrendingUp className="w-3 h-3 text-purple-400" />;
    default: return null;
  }
};

const getLayerForSystem = (id: string) => {
  const core = ['save-load', 'world-partition', 'data-streaming', 'multiplayer', 'performance', 'event-bus'];
  const data = ['item-data', 'passive-tree', 'world-maps'];
  const simulation = ['inventory-system', 'physics', 'world-state'];
  const gameplay = ['gameplay-abilities', 'quest-systems', 'dialogue-narrative', 'npc-scheduling', 'complex-ai'];
  const presentation = ['cutscenes', 'animation', 'ui-serialization', 'enhanced-input'];

  if (core.includes(id)) return 'Core';
  if (data.includes(id)) return 'Data';
  if (simulation.includes(id)) return 'Simulation';
  if (gameplay.includes(id)) return 'Gameplay';
  if (presentation.includes(id)) return 'Presentation';
  return 'Simulation'; // Default fallback
};

const fundamentalExplanations: Record<string, string> = {
  // 1
  "Clear ownership": "Every concept must have exactly one place that owns it. Quest progress belongs to the quest subsystem; item instances to the inventory. If two systems own the same truth, you get drift, bugs, and confusion.",
  "3-Layer Separation": "Split into Definition (Template/Rules), Runtime state (What is true right now), and Presentation (Visuals/VFX). This ensures performance, persistence, and decoupling.",
  "Stable IDs everywhere": "Use FNames or GUIDs. Memory pointers change; stable IDs persist across sessions and network packets, ensuring references never break after a save/load.",
  "One-way dependencies": "Maintain a strict hierarchy (Core -> Data -> Sim -> Game -> UI). Circular dependencies bloat compile times and cause fragile 'spaghetti' logic.",
  "Data-driven structure": "Architect for flexibility. Designers should change behavior by editing assets (Data Assets), not by requesting C++ changes. Code provides the engine; data provides the game.",
  "Versioned Serialization": "Crucial for live products. Every structure must be versioned so that updates to the data format don't corrupt or wipe existing player save files.",
  "Debug Visibility": "If you can't see the internal state via a console command or overlay, you can't debug it. Every system needs a 'Dump' and 'View' mode.",
  "Explicit event flow": "Use an Event Bus or Delegates. Avoid tight coupling where System A must 'know' System B exists to communicate. Broadcast signals, don't ping internals.",
  "Authority boundaries": "In multiplayer, strictly define what the client can suggest (Intents) and what the server must verify (Truth). Never trust the client with gameplay math.",
  "Cheap local change": "Optimizing for scalability. Changing one item shouldn't require re-calculating the entire world state. Aim for O(1) or O(log N) operations.",
  
  // 2
  "A unique stable ID": "The anchor for all logic. Must be permanent and predictable (often an FName generated from the asset path).",
  "A clear type": "Categorization for filtering, factory patterns, and validation. Helps the system know *how* to process the data asset.",
  "Sensible defaults": "Reduces designer error. If a field is missing, the system should behave safely and predictably rather than crashing.",
  "Validator rules": "Automated checks (Data Validation) that run on save to catch circular references, missing assets, or invalid ranges early in the pipeline.",
  "Tags/Categories": "Allows for flexible querying and dynamic behavior based on labels (e.g., 'Status.Fire', 'Weapon.Dagger') without hardcoding classes.",
  "Editable without code updates": "Empowering designers to balance the game and add content without needing a programmer or a full recompile of the project.",
  "Localized text support": "Use FText in Unreal. Ensure the game is ready for global markets by keeping display names and descriptions separate from pure data IDs.",
  "Reference safety": "Prefer Soft Object Pointers. Loading one small item definition shouldn't force the engine to load a 4K boss texture or a massive audio bank.",

  // 3
  "Instance identity": "Every live object needs a unique runtime ID to be tracked, even if multiple are of the same Type (e.g., two identical 'Iron Swords').",
  "Clear hierarchical ownership": "An item belongs to a slot, in a container, on an actor. Never allow 'orphaned' data that floats in memory without an owner.",
  "Strict lifecycle rules": "Define clearly when an object is created, pooled, and destroyed. Prevents memory leaks and 'Dangling Pointer' crashes.",
  "Minimal redundant data": "Don't save what you can calculate. If you have BaseStats and Modifiers, calculate FinalStats at runtime instead of saving it and risking desync.",
  "Derived state reconstruction": "Cache is for performance, not storage. Upon loading, rebuild caches and UI view-models from the raw source of truth.",
  "Dirty/changed tracking": "Only sync or save what changed since the last update. Essential for networking bandwidth and autosave performance.",
  "Safe mutation rules": "Force all changes through a single API (e.g., 'DamageTarget') to ensure validation, logging, and authority checks aren't bypassed.",

  // 4
  "READ-ONLY relation to truth": "UI is a mirror. It should never decide a player died; it should merely reflect that the Health reached zero in the simulation.",
  "Fast state reflection": "Updates must be snappy. Use Push-Notifications (Delegates) or ViewModels instead of polling the entire system every frame (Tick).",
  "Separation between display and preview": "The code for a tooltip is different from a 3D ground mesh. Decouple the 'Look' from the 'Logic' of the item.",
  "Latency tolerance": "Multiplayer-ready visuals. Use interpolation and prediction to mask network lag while waiting for server authority.",
  "Accessibility and clarity": "Communicating data instantly. High contrast, intuitive layout, and clear feedback loops (Sounds/VFX) for every state change.",

  // 5
  "Distinct Item Def vs Runtime Instance": "The 'Steel Sword' template vs 'My Sharpened Steel Sword +1'. Never mix static asset data with runtime durability/rolls.",
  "Abstract Container Model": "Inventory, Chests, and Trade Windows should use the same logic template for movement, sorting, and validation.",
  "Location is just state; identity persists": "Moving an item from Slot A to Slot B shouldn't change its unique ID or its properties. Index is relative; identity is absolute.",
  "Stack and split rules": "Standardized logic for consumables and materials. Ensures that '10 potions' are handled as a single stack with a 'Count' property.",
  "Strict Modifier Pipelines": "A sequential order for applying stats (Base -> Additive -> Multiplicative). Prevents 'Double Dipping' or inconsistent math.",
  "First-class Sockets / Links": "Support for item nesting (gems, enchantments) as a core part of the structure, not a tacked-on afterthought.",
  "Simulation-led crafting resolution": "Crafting results must be deterministic and server-authoritative to prevent 'Save-Scumming' or client cheats.",
  "Tooltips derived from truth": "Tooltip text should be generated by functions reading the actual stats, never stored as hardcoded strings in the data.",
  "Full tag-filtered search": "Enable players and subsystems to query items by tags (e.g., 'Weapon', 'Ranged', 'Fire') for dynamic inventory filtering.",
  "Strict anti-duplication prevention": "Transactional logic for movement. An item MUST be successfully removed from Source before it is Added to Target.",

  // 6
  "Graph structure (no nested if-statements).": "Use nodes and edges. Linear code for branching quests quickly becomes unreadable and buggy.",
  "Quest stage tracking.": "Explicitly mark where the player is. 'Kill 10 wolves' should have a counter and a completed state.",
  "Consequence logging.": "Record player choices. If they killed the mayor, this history must be queryable by any future system.",
  "Reusable evaluation conditions.": "Conditions like 'Has Item' or 'Is Dead' should be snippets of data that any quest or dialogue node can use.",
  "Traceable branch outcomes.": "Every path through the story should be visible in debug tools to ensure no dead-ends exist.",
  "Fail-state awareness (not just success trails).": "Handle what happens if a player 'fails' a quest. The world must react to failure, not just wait.",

  // 7
  "Central truth storage (K/V maps).": "A single source for global flags. 'Day_Night_Cycle', 'City_A_Status', 'Player_Reputation'.",
  "Macro and micro state regions.": "Distinguish between global changes and things that only matter in a single house or town.",
  "History of major consequences and causes.": "Tracking *why* a state changed makes debugging narrative bugs much easier.",
  "Strict notification of changes to active AI/Dialogue.": "When the bridge burns, every AI currently using that bridge must be notified immediately to re-route.",
  "Consistency with visuals.": "If the world state says 'Town Destroyed', the map must show a ruin, not a thriving city.",

  // 8
  "Schedule models (where, when, what).": "NPCs need to move between locations based on time to feel alive (Tavern at 7 PM, Bed at 11 PM).",
  "Separation of current task and long-term memory.": "AI should react to a punch right now, but remember who punched them for several hours.",
  "Decision structure (Behavior Trees / Utility).": "Use proven AI patterns. Behavior Trees for structured tasks; Utility AI for complex personality-driven choices.",
  "Interrupt escalation rules.": "What happens if a quest conversation is interrupted by an arrow? AI must handle transitions between states.",
  "Fallbacks to prevent freezing.": "If an AI can't find a path, it should 'Wait' or 'Panic', never just stand still and do nothing.",
  "Debug replayability for 'why did they do this?'": "Record a history of AI decisions so you can see exactly which condition triggered a weird behavior.",

  // 9
  "Body part definitions and multipliers.": "Define Head, Torso, Limbs. Each must have different damage weights and armor ratings.",
  "Separate runtime injury states (bleeding, crippled).": "Specific conditions for parts. A 'Crippled Leg' reduces move speed; a 'Bleeding Head' adds a visual filter.",
  "Clean hit-resolution pipelines.": "The order of operations: Collision -> Part Identification -> Armor Calc -> Damage Apply -> Reaction.",
  "Explicit visual mappings of wounds.": "Ensure the art matches the state. A broken arm should look broken or have a visible bandage/VFX.",
  "AI reaction hooks to limb loss/pain.": "AI shouldn't just lose HP. It should drop its sword, flee, or change its attack pattern when injured.",

  // 10
  "Versioned byte chunks.": "Pack data into sections. Allows you to update the 'Inventory' format without needing to touch the 'Quest' format.",
  "Migration paths for updates.": "Code that 'upgrades' a version 1 save to version 2 during the loading process.",
  "No direct memory pointer reliance.": "Never save '0x123456'. Save 'Actor_ID_789'. Pointers are useless after a restart.",
  "Reconstruction pipelines for complex systems.": "A clear set of steps to rebuild the game world from the saved numbers after a load.",
  "Data validation post-load.": "Check that the loaded data is sane. If a player somehow has -500 HP, fix it immediately to prevent crashes.",

  // 11
  "Server Authority boundaries established day 1.": "Decide early what the client is trusted with. Usually: Movement (predicted), nothing else.",
  "Client intents vs Server resolutions.": "Client says 'I want to swing'. Server says 'You hit' or 'You missed'. Never trust the client's 'I hit'.",
  "Replication-safe properties.": "Use Unreal's built-in replication system. Only sync what is absolutely necessary for other players to see.",
  "Zero gameplay logic trapped in UMG.": "UI is for display only. If you put combat logic in a button click, you will have cheats on day one.",
  "Deterministic foundations.": "Ensure that the same inputs on the same state produce the same output across different machines.",

  // 12
  "Visual graph editors.": "Don't force designers to look at spreadsheets. Visual nodes for quests and dialogue prevent mental mapping errors.",
  "Content validators detecting broken links or circular refs.": "Automated tests within the editor that stop a user from saving 'broken' content.",
  "Live Debug views.": "The ability to 'see' the quest graph and which node is active while the game is running in the editor.",
  "Deep searchable registries.": "A way to find every quest that uses a specific NPC or every item that has 'Burn' damage.",

  // 13
  "Asynchronous soft-loading (Data streaming).": "Load assets on background threads. Never stop the game for a loading screen if you can avoid it.",
  "Data-driven activation (Hibernate distant objects).": "Actors 2km away shouldn't Tick. Turn off their logic when the player is gone to save CPU.",
  "Minimal Tick usage (Event-driven).": "Don't ask 'Is it done?' every frame. Wait for a signal that says 'It is done!'",
  "Pointers converted to IDs for batched registry lookups.": "Processing items by ID in a flat array is hundreds of times faster than chasing pointers through memory.",
  "Avoidance of deep dependency chains.": "Loading a cup shouldn't load the house, which loads the city, which loads the entire world.",

  // 14
  "Logic unit tests for dangerous subsystems (Crafting, Save).": "Small, fast tests that verify the 'math' of your game is correct and hasn't changed.",
  "Asset validation passes.": "Bulk checks on all assets to find missing textures, broken links, or invalid collision.",
  "Regression protection for verified logic leaks.": "When you fix a bug, add a test to ensure that specific bug never comes back.",

  // 15
  "Architectural Decision Records (ADR).": "Maintain a 'Why' log. Document the reasoning behind every major architectural choice to prevent future regressions.",
  "Zero-Tolerance for Circular References.": "Strict module boundaries. Systems must always follow the Core -> Data -> Simulation -> Presentation hierarchy.",
  "Self-Documenting API Design.": "Clear naming and interface contracts. A new developer should understand a system's intent just by reading its public headers.",
  "Technical Debt Expiration.": "All 'hacks' or temporary fixes must be tagged with a date and a Jira task for permanent resolution.",
  "Knowledge Redundancy (Bus Factor).": "Ensure critical system knowledge is shared across the team. No system should have a 'single point of failure' in human knowledge.",
  "Automated Architecture Audits.": "Regularly scan the codebase for architecture rot and unauthorized dependency leaks between layers.",
};

const getSystemQuestions = (id: string) => {
  const defaultAnswers = {
    q1: "A framework subsystem managing a specific slice of game functionality.",
    q2: "Its isolated runtime memory footprint, free from visual data.",
    q3: "Through decoupled UI ViewModels or spatial presentation rendering.",
    q4: "The relevant GameInstance, World Subsystem, or specific Actor Component.",
    q5: "Through strictly validated transactions, RPCs, or explicit commanded events.",
    q6: "Serialized into version-controlled binary chunks using stable identifiers.",
    q7: "Via offline tool validation or compile-time static type checking.",
    q8: "Through dedicated debug overlays or console dump commands.",
    q9: "By strictly avoiding N² spatial checks and utilizing spatial partitioning or bitmasks.",
    q10: "The server acts as authority, validating intent before mutating state, while the client predicts."
  };

  const specificAnswers: Record<string, Partial<typeof defaultAnswers>> = {
    'item-data': {
      q1: "Item Definition (Recipe) and Item Instance (The exact physical object).",
      q2: "The lightweight FItemInstance struct, its tracked ID, and its unique runtime modifiers.",
      q3: "Through 3D meshes on the ground, or icons/tooltips in UI, entirely derived from the instance state.",
      q4: "The specific Container it currently sits in (Inventory, Ground Box, Stash).",
      q5: "By explicit transaction functions (Drop, Consume, Equip, Split).",
      q6: "Saved by its stable Definition ID and list of rolled modifiers.",
      q7: "Tools verify modifiers belong to valid pools for the base item type.",
      q8: "Dumping the container ID and evaluating the packed structs in memory.",
      q9: "Structs (not UObjects) avoid GC overhead, allowing millions of items.",
      q10: "The server executes all container transactions; client instantly predicts moving the icon."
    },
    'world-state': {
      q1: "The global memory mapping consequence keys to integer/boolean states.",
      q2: "Only the modified keys that branch from the initial game state.",
      q3: "Through reactive NPC dialogues, unlocked regions, and UI quest objectives.",
      q4: "The UWorldStateSubsystem, an engine-level singleton.",
      q5: "When quests complete or explicit narrative nodes broadcast a state change.",
      q6: "A single chunk of a TMap<FName, int32> binary packed upon saving.",
      q7: "Script tools test that states cannot enter conflicting loops.",
      q8: "Via the global state debugger overlay or log filters.",
      q9: "FName to int32 maps provide O(1) instant lookup.",
      q10: "The server holds global state and seamlessly replicates relevant map deltas to clients."
    },
    'inventory-system': {
      q1: "A generic robust container model that holds items and resolves stack logic.",
      q2: "The flat array of slot-index mapped instances and computed total weight.",
      q3: "As a grid UI that observes the container's structural changes.",
      q4: "The player character, an NPC, a chest, or the world itself.",
      q5: "Exclusively via validated Swap/Merge/Split commands.",
      q6: "As a sequenced array of Item chunks owned by the save file.",
      q7: "Validation enforces that total weight cannot exceed limits and slots are valid.",
      q8: "Dumping container contents and verifying index bounds.",
      q9: "Container logic is unified so 10,000 chests cost the same logical overhead.",
      q10: "Container states are authority-owned; unauthorized client drops are rejected."
    },
    'passive-tree': {
      q1: "A colossal web of skill variations represented as a compact spatial graph.",
      q2: "A minimal Bitmask (e.g., uint32 array) denoting allocated node indices.",
      q3: "A sprawling UI canvas that renders cached coordinates.",
      q4: "The player's Progression Component.",
      q5: "Allocating points triggers a BFS validation check for connectivity.",
      q6: "As pure bits, saving requires merely a few bytes.",
      q7: "Graph tools check for unbreakable islands or orphaned nodes.",
      q8: "By reading the 16-byte mask and evaluating the math.",
      q9: "Bitwise logic means checking if you have a skill is a single CPU instruction.",
      q10: "The server simply multicasts the bitmask whenever it officially updates."
    }
  };

  return { ...defaultAnswers, ...(specificAnswers[id] || {}) };
};


export default function FrameworkTab() {
  const [activeSystemId, setActiveSystemId] = useState<string>('philosophy');

  const activeSystem = frameworkSystems.find(s => s.id === activeSystemId);
  const questions = activeSystem ? getSystemQuestions(activeSystem.id) : null;
  const systemLayer = activeSystem ? getLayerForSystem(activeSystem.id) : null;

  return (
    <div className="flex flex-col h-full text-sm overflow-hidden relative">
      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 overflow-hidden pb-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-rpg-panel border border-rpg-border rounded-lg overflow-hidden flex flex-col flex-shrink-0 max-h-[300px] md:max-h-full shadow-lg">
          
          <div className="flex-1 overflow-y-auto p-2 space-y-4 scrollbar-hide py-4">
            
            <div className="space-y-1">
              <h4 className="text-[9px] uppercase tracking-widest text-[#d4af37] font-bold px-2 py-2 border-b border-[#d4af37]/20 mb-2">The Golden Master</h4>
              {[
                { id: 'philosophy', name: 'Philosophy & Rules', icon: <Hexagon className="w-4 h-4 text-[#d4af37]" /> }
              ].map(sys => (
                <button
                  key={sys.id}
                  onClick={() => setActiveSystemId(sys.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-left transition-all relative group ${
                    activeSystemId === sys.id 
                      ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]' 
                      : 'text-gray-400 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {activeSystemId === sys.id && (
                    <motion.div layoutId="sysIndicator" className="absolute left-0 w-1 h-4 bg-[#d4af37] rounded-r shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                  )}
                  <div className={`transition-transform group-hover:scale-110 ${activeSystemId === sys.id ? 'text-[#d4af37]' : 'text-gray-500'}`}>
                    {sys.icon}
                  </div>
                  <span className="font-medium text-xs flex-1 truncate">{sys.name}</span>
                  {activeSystemId === sys.id && <ChevronRight className="w-3 h-3 opacity-50" />}
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <h4 className="text-[9px] uppercase tracking-widest text-[#d4af37] font-bold px-2 py-2 border-b border-[#d4af37]/20 mb-2 mt-4">Deep Dives</h4>
              {[
                { id: 'example-poe-items', name: 'PoE Item Architecture', icon: <Box className="w-4 h-4" /> },
                { id: 'example-limb-target', name: 'Limb Targeting System', icon: <Crosshair className="w-4 h-4" /> }
              ].map(sys => (
                <button
                  key={sys.id}
                  onClick={() => setActiveSystemId(sys.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-left transition-all relative group ${
                    activeSystemId === sys.id 
                      ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]' 
                      : 'text-gray-400 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {activeSystemId === sys.id && (
                    <motion.div layoutId="sysIndicator" className="absolute left-0 w-1 h-4 bg-[#d4af37] rounded-r shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                  )}
                  <div className={`transition-transform group-hover:scale-110 ${activeSystemId === sys.id ? 'text-[#d4af37]' : 'text-gray-500'}`}>
                    {sys.icon}
                  </div>
                  <span className="font-medium text-xs flex-1 truncate">{sys.name}</span>
                  {activeSystemId === sys.id && <ChevronRight className="w-3 h-3 opacity-50" />}
                </button>
              ))}
            </div>

            {/* Group systems by category */}
            {Array.from(new Set(frameworkSystems.map(s => s.category))).map(cat => (
              <div key={cat} className="space-y-1">
                <h4 className="text-[9px] uppercase tracking-widest text-gray-500 font-bold px-2 py-2 mt-2">{cat}</h4>
                {frameworkSystems.filter(s => s.category === cat).map(sys => {
                  return (
                    <button
                      key={sys.id}
                      onClick={() => setActiveSystemId(sys.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-left transition-all relative group ${
                        activeSystemId === sys.id 
                          ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]' 
                          : 'text-gray-400 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {activeSystemId === sys.id && (
                        <motion.div layoutId="sysIndicator" className="absolute left-0 w-1 h-4 bg-blue-500 rounded-r shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                      )}
                      <div className={`transition-transform group-hover:scale-110 ${activeSystemId === sys.id ? 'text-blue-400' : 'text-gray-500'}`}>
                        {sys.icon}
                      </div>
                      <span className="font-medium text-xs flex-1 truncate">{sys.name}</span>
                      {activeSystemId === sys.id && <ChevronRight className="w-3 h-3 opacity-50" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 h-full overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            
            {/* MASTER PHILOSOPHY VIEW */}
            {activeSystemId === 'philosophy' && (
              <motion.div key="philosophy" data-glossary-id="philosophy" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 flex flex-col bg-rpg-panel border border-[#d4af37]/30 rounded-lg overflow-y-auto shadow-2xl relative scrollbar-hide">
                <div className="absolute top-2 right-2 z-20">
                  <GlossaryToggle id="philosophy" />
                </div>
                <div className="p-8 pb-4 flex flex-col gap-12">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 blur-[80px] pointer-events-none rounded-full" />
                  
                  {/* PHILOSOPHY: 3-LAYER */}
                  <div className="flex flex-col relative">
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-2 flex items-center gap-4">
                      <Layers className="text-[#d4af37] w-8 h-8" />
                      The 3-Layer Separation
                    </h2>
                    <p className="text-gray-400 text-sm mb-8 max-w-3xl">The single most important structural rule in this open-world architecture. Every major mechanic MUST heavily enforce the split between its definition, its active memory, and what the player perceives. Mixing these three causes irreparable technical debt.</p>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                      <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />
                        <h3 className="text-xl font-bold text-green-400 mb-2">1. DEFINITION</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4">"The Template / The Rules"</p>
                        <p className="text-sm text-gray-300 leading-relaxed mb-4">Hard Data that never changes during runtime. Authored by designers using offline tools.</p>
                        <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                          <li>Base sword stats</li>
                          <li>Quest conditions</li>
                          <li>Dialogue branching paths</li>
                          <li>Passive node layout</li>
                          <li>Enemy hit-zone multipliers</li>
                        </ul>
                        <div className="mt-6 p-3 bg-black/40 rounded border border-gray-800 text-[11px] font-mono text-green-300/80">Asset: UPrimaryDataAsset</div>
                      </div>

                      <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
                        <h3 className="text-xl font-bold text-blue-400 mb-2">2. RUNTIME STATE</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4">"The Source of Truth"</p>
                        <p className="text-sm text-gray-300 leading-relaxed mb-4">Lightweight memory tracking what is actually happening <i>right now</i>. Contains no graphics. Serialized for saving.</p>
                        <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                          <li>This specific sword's durability</li>
                          <li>Current quest stage completion</li>
                          <li>Which dialogue branch was chosen</li>
                          <li>Bitmask of allocated passives</li>
                          <li>Current HP per enemy body part</li>
                        </ul>
                        <div className="mt-6 p-3 bg-black/40 rounded border border-gray-800 text-[11px] font-mono text-blue-300/80">Asset: USTRUCT / Bitmask</div>
                      </div>

                      <div className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-purple-500" />
                        <h3 className="text-xl font-bold text-purple-400 mb-2">3. PRESENTATION</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4">"The Mirage / The Feedback"</p>
                        <p className="text-sm text-gray-300 leading-relaxed mb-4">A read-only viewer that observes the Runtime State. Responsible for visuals, sounds, and input routing.</p>
                        <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                          <li>Hover tooltip and mesh rendering</li>
                          <li>Journal checklist UI</li>
                          <li>Camera cutscene and voice audio</li>
                          <li>Skill tree glowing lines</li>
                          <li>Limping animation</li>
                        </ul>
                        <div className="mt-6 p-3 bg-black/40 rounded border border-gray-800 text-[11px] font-mono text-purple-300/80">Asset: UUserWidget / Niagara / AnimBP</div>
                      </div>
                    </div>

                    <div className="mt-8 bg-black/30 p-6 border border-gray-800 rounded-xl">
                      <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">Data Flow Example</h4>
                      <div className="flex items-center gap-4 text-xs font-mono text-gray-400 overflow-x-auto">
                        <span className="shrink-0 text-green-400">DA_IronSword (Def)</span>
                        <ArrowRight className="shrink-0 w-4 h-4" />
                        <span className="shrink-0 text-blue-400">FItemInstance[Durability: 50] (State)</span>
                        <ArrowRight className="shrink-0 w-4 h-4" />
                        <span className="shrink-0 text-purple-400">BP_HUD_Tooltip (Visual)</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-rpg-border/50" />

                  {/* PHILOSOPHY: MODULE ARCHITECTURE */}
                  <div className="flex flex-col relative">
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-2 flex items-center gap-4">
                      <Box className="text-[#d4af37] w-8 h-8" />
                      Module Architecture
                    </h2>
                    <p className="text-gray-400 text-sm mb-8 max-w-3xl">The right Unreal Engine module structure avoids spaghetti code. For a project this size, separate into 6 runtime modules and specific editor tools.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-[#d4af37] font-bold text-lg uppercase tracking-widest border-b border-[#d4af37]/20 pb-2">Runtime Modules</h3>
                        
                        <div className="bg-slate-900/50 p-4 border border-slate-700 rounded-lg">
                          <h4 className="text-white font-bold mb-1 w-full text-sm">ProjectCore</h4>
                          <p className="text-xs text-gray-400">IDs, tags, common structs, event payloads, generic interfaces. Knows nothing about game features.</p>
                        </div>
                        
                        <div className="bg-slate-900/50 p-4 border border-slate-700 rounded-lg">
                          <h4 className="text-emerald-400 font-bold mb-1 w-full text-sm">ProjectData</h4>
                          <p className="text-xs text-gray-400">All content definitions: items, quests, dialogue graphs, passive nodes, NPCs. Uses Core.</p>
                        </div>
                        
                        <div className="bg-slate-900/50 p-4 border border-slate-700 rounded-lg">
                          <h4 className="text-amber-500 font-bold mb-1 w-full text-sm">ProjectSimulation</h4>
                          <p className="text-xs text-gray-400">The core game rules layer. Quest logic, narrative branching, world state, combat resolution.</p>
                        </div>

                        <div className="bg-slate-900/50 p-4 border border-slate-700 rounded-lg">
                          <h4 className="text-rose-400 font-bold mb-1 w-full text-sm">ProjectAI</h4>
                          <p className="text-xs text-gray-400">NPC schedules, StateTree logic, perception, combat decisions.</p>
                        </div>
                        
                        <div className="bg-slate-900/50 p-4 border border-slate-700 rounded-lg">
                          <h4 className="text-purple-400 font-bold mb-1 w-full text-sm">ProjectPresentation</h4>
                          <p className="text-xs text-gray-400">Enhanced Input adapters, UI, tooltips, animation triggers, VFX/audio.</p>
                        </div>
                        
                        <div className="bg-slate-900/50 p-4 border border-slate-700 rounded-lg">
                          <h4 className="text-sky-400 font-bold mb-1 w-full text-sm">ProjectPersistence & ProjectOnline</h4>
                          <p className="text-xs text-gray-400">Save/load, replication contracts, multi-player session logic.</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-orange-400 font-bold text-lg uppercase tracking-widest border-b border-orange-500/20 pb-2">Editor Modules</h3>
                        <p className="text-xs text-gray-400 mb-4">Tools, not gameplay. The runtime should never depend on editor tools. Their job is to edit data assets and validate relationships.</p>
                        
                        {[
                          'ProjectDialogueEditor',
                          'ProjectQuestEditor',
                          'ProjectPassiveTreeEditor',
                          'ProjectItemEditor',
                          'ProjectWorldStateEditor'
                        ].map(mod => (
                          <div key={mod} className="bg-orange-950/20 p-3 border border-orange-900/30 rounded-lg flex items-center gap-3">
                            <Terminal className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-gray-300 font-mono">{mod}</span>
                          </div>
                        ))}

                        <div className="mt-8 bg-slate-950 rounded-xl border border-gray-800 p-6 shadow-inner">
                          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ArrowRight className="w-4 h-4" />
                            Dependency Flow
                          </h3>
                          <div className="text-[11px] font-mono text-gray-400 flex flex-col gap-2">
                            <div className="flex bg-slate-900 p-2 rounded justify-center border border-slate-700">ProjectCore</div>
                            <div className="text-center text-gray-600">↓</div>
                            <div className="flex bg-emerald-900/30 p-2 rounded justify-center border border-emerald-900">ProjectData</div>
                            <div className="text-center text-gray-600">↓</div>
                            <div className="flex bg-amber-900/30 p-2 rounded justify-center border border-amber-900">ProjectSimulation</div>
                            <div className="text-center text-gray-600">↓</div>
                            <div className="flex bg-purple-900/30 p-2 rounded justify-center border border-purple-900">ProjectPresentation</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-rpg-border/50" />

                  {/* PHILOSOPHY: 10 SCALABILITY RULES */}
                  <div className="flex flex-col relative">
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-2 flex items-center gap-4">
                      <ShieldCheck className="text-[#d4af37] w-8 h-8" />
                      10 Scalability Rules
                    </h2>
                    <p className="text-gray-400 text-sm mb-8 pb-6">The specific high-level rules to follow when making complex systems like Passive Trees and Quest branching to ensure the project doesn't turn into a knot.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { 
                          title: "1. One source of truth", 
                          desc: "Pick exactly one system that owns each truth. No duplicate truth in UI or actors.",
                          explanation: "Avoid state synchronization nightmares by ensuring each piece of data is owned by exactly one system. For example, if a player's HP is in a Subsystem, the UI and the Actor should only read from that Subsystem, never store their own private copies of HP. This prevents 'desync' bugs where the health bar shows 100 but the player is actually dead."
                        },
                        { 
                          title: "2. Split Def, State, Pres", 
                          desc: "Definition = Data assets. State = Subsystems. Presentation = UI/VFX.",
                          explanation: "The 3-Layer separation keeps logic clean. Definition (UDataAsset) stores constant data like item names and base damage. State (Subsystem/USTRUCT) stores runtime changes like current durability. Presentation (UWidget/VFX) is a 'mirage' that only reads state to show feedback. Never put logic in the Presentation layer."
                        },
                        { 
                          title: "3. No hidden coupling", 
                          desc: "Use interfaces, events, and tags. Do not reach into internals.",
                          explanation: "Systems should communicate without knowing each other's inner workings. Instead of casting to a specific class and accessing its variables, use Interfaces, Gameplay Tags, or an Event Bus. This ensures that removing or changing one system doesn't break ten others through secret dependencies."
                        },
                        { 
                          title: "4. Debug lenses everywhere", 
                          desc: "Every system needs a debug screen, dump function, and validator.",
                          explanation: "Complex systems become black boxes without visibility. Every major system should have a visual overlay (Debug Screen), a console command to dump its current memory (Dump Function), and a startup check (Validator) to ensure its data is sane. If you can't see the state, you can't fix the bug."
                        },
                        { 
                          title: "5. Tags and IDs everywhere", 
                          desc: "Never rely on fragile references. Use stable FNames and Gameplay Tags.",
                          explanation: "References to memory addresses (Pointers) are fragile—they can be garbage collected or become invalid after a save. Use stable identifiers like FNames or Gameplay Tags to link objects. They are robust, easy to serialize for saves, and can be easily synced over a network."
                        },
                        { 
                          title: "6. Data-driven graphs", 
                          desc: "For quests, crafting, dialogue: define as assets, resolve at runtime. Not hardcoded.",
                          explanation: "Hardcoded if/else chains for quests or dialogue lead to 'Spaghetti Code'. Instead, define the logic branch as a Data Asset (a Graph). The engine resolves the path at runtime. This allows designers to add content and complex branches without a single line of C++ or a recompile."
                        },
                        { 
                          title: "7. Build validators early", 
                          desc: "Automatic checks for broken references, missing conditions, orphan nodes.",
                          explanation: "Don't wait for a crash to find out a designer forgot to link an item. Write automated checks that run when an asset is saved or when the game boots. Validators catch orphan nodes, broken references, or missing data immediately, keeping the build stable for the whole team."
                        },
                        { 
                          title: "8. One-way dependencies", 
                          desc: "UI should not call quest internals. Animation should not decide quest outcomes.",
                          explanation: "Maintain a strict hierarchy: Core → Data → Simulation → Presentation. UI should observe the Quest system, but the Quest system should never know the UI exists. Animation shouldn't decide if an enemy dies; it should just react to the death state. This prevents circular dependencies that cause infinite loops."
                        },
                        { 
                          title: "9. Write dumpable state", 
                          desc: "Every important runtime structure should be serializable, inspectable, versioned.",
                          explanation: "Every runtime structure (Inventory, World State) must be serializable (savable to bytes) and versioned. This ensures that save files can be migrated when the game updates. If a system's state is 'dumpable', you can easily recreate a user's exact crash scenario by loading their state snippet."
                        },
                        { 
                          title: "10. Test where bugs are expensive", 
                          desc: "Test branching, crafting resolution, and save migrations. Don't test everything.",
                          explanation: "Automated testing is a resource. Focus it on 'Point of No Return' logic like item crafting, currency transactions, and save file migrations. A visual bug in a tree is cheap to fix, but a bug that wipes a player's 100-hour save file or duplicates currency is catastrophic."
                        }
                      ].map((rule, idx) => {
                        const cleanTerm = rule.title.replace(/^\d+\.\s*/, '').replace(/:$/, '');
                        return (
                          <HoverableTerm key={idx} term={cleanTerm} explanation={rule.explanation} category="Architecture">
                            <div className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/50 hover:border-[#d4af37]/30 transition-colors w-full h-full">
                              <h3 className="text-[#d4af37] font-bold text-sm mb-2">{rule.title}</h3>
                              <p className="text-gray-300 text-xs leading-relaxed">{rule.desc}</p>
                            </div>
                          </HoverableTerm>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-rpg-border/50" />

                  {/* PHILOSOPHY: 15 RULES */}
                  <div className="flex flex-col relative bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-2xl p-4 md:p-8 shadow-[0_0_50px_rgba(212,175,55,0.05)] overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#d4af37]/10 blur-[100px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
                    
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-2 flex items-center gap-4 relative z-10">
                      <Waypoints className="text-[#d4af37] w-8 h-8" />
                      The 15 Framework Fundamentals
                    </h2>
                    <p className="text-gray-400 text-sm mb-8 pb-6 border-b border-[#d4af37]/20 relative z-10">The authoritative architecture rules for building an open-world RPG capable of handling complex quest chains, PoE-style itemization, and deep reactive environments.</p>
                    
                    <div className="space-y-8 pr-4 relative z-10">
                      {[
                        { title: "1. Fundamentals every system must have", rules: ["Clear ownership", "3-Layer Separation", "Stable IDs everywhere", "One-way dependencies", "Data-driven structure", "Versioned Serialization", "Debug Visibility", "Explicit event flow", "Authority boundaries", "Cheap local change"] },
                        { title: "2. Fundamentals every definition asset must have", rules: ["A unique stable ID", "A clear type", "Sensible defaults", "Validator rules", "Tags/Categories", "Editable without code updates", "Localized text support", "Reference safety"] },
                        { title: "3. Fundamentals every runtime-state system must have", rules: ["Instance identity", "Clear hierarchical ownership", "Strict lifecycle rules", "Minimal redundant data", "Derived state reconstruction", "Dirty/changed tracking", "Safe mutation rules"] },
                        { title: "4. Fundamentals every presentation layer must have", rules: ["READ-ONLY relation to truth", "Fast state reflection", "Separation between display and preview", "Latency tolerance", "Accessibility and clarity"] },
                        { title: "5. Inventory / item / crafting system must have", rules: ["Distinct Item Def vs Runtime Instance", "Abstract Container Model", "Location is just state; identity persists", "Stack and split rules", "Strict Modifier Pipelines", "First-class Sockets / Links", "Simulation-led crafting resolution", "Tooltips derived from truth", "Full tag-filtered search", "Strict anti-duplication prevention"] },
                        { title: "6. Quest / narrative / dialogue system must have", rules: ["Graph structure (no nested if-statements).", "Quest stage tracking.", "Consequence logging.", "Reusable evaluation conditions.", "Traceable branch outcomes.", "Fail-state awareness (not just success trails)."] },
                        { title: "7. World state / consequences system must have", rules: ["Central truth storage (K/V maps).", "Macro and micro state regions.", "History of major consequences and causes.", "Strict notification of changes to active AI/Dialogue.", "Consistency with visuals."] },
                        { title: "8. AI / NPC behavior must have", rules: ["Schedule models (where, when, what).", "Separation of current task and long-term memory.", "Decision structure (Behavior Trees / Utility).", "Interrupt escalation rules.", "Fallbacks to prevent freezing.", "Debug replayability for 'why did they do this?'"] },
                        { title: "9. Combat / enemy body-part system must have", rules: ["Body part definitions and multipliers.", "Separate runtime injury states (bleeding, crippled).", "Clean hit-resolution pipelines.", "Explicit visual mappings of wounds.", "AI reaction hooks to limb loss/pain."] },
                        { title: "10. Save / load / persistence must have", rules: ["Versioned byte chunks.", "Migration paths for updates.", "No direct memory pointer reliance.", "Reconstruction pipelines for complex systems.", "Data validation post-load."] },
                        { title: "11. Networking / multiplayer readiness must have", rules: ["Server Authority boundaries established day 1.", "Client intents vs Server resolutions.", "Replication-safe properties.", "Zero gameplay logic trapped in UMG.", "Deterministic foundations."] },
                        { title: "12. Editor/tooling must have", rules: ["Visual graph editors.", "Content validators detecting broken links or circular refs.", "Live Debug views.", "Deep searchable registries."] },
                        { title: "13. Performance / scalability must have", rules: ["Asynchronous soft-loading (Data streaming).", "Data-driven activation (Hibernate distant objects).", "Minimal Tick usage (Event-driven).", "Pointers converted to IDs for batched registry lookups.", "Avoidance of deep dependency chains."] },
                        { title: "14. Testing / correctness must have", rules: ["Logic unit tests for dangerous subsystems (Crafting, Save).", "Asset validation passes.", "Regression protection for verified logic leaks."] },
                        { title: "15. Technical Integrity & Knowledge Redundancy", rules: ["Architectural Decision Records (ADR).", "Zero-Tolerance for Circular References.", "Self-Documenting API Design.", "Technical Debt Expiration.", "Knowledge Redundancy (Bus Factor).", "Automated Architecture Audits."] }
                      ].map((group, idx) => (
                        <div key={idx} className="bg-slate-900/40 p-6 rounded-xl border border-slate-800/50 hover:border-[#d4af37]/40 transition-all group/card shadow-lg hover:shadow-[#d4af37]/5">
                          <h3 className="text-[#d4af37] font-display font-bold text-lg mb-4 tracking-tight flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[10px] text-[#d4af37] border border-[#d4af37]/30">{idx + 1}</span>
                            {group.title}
                          </h3>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            {group.rules.map((rule, ridx) => {
                              const cleanTerm = rule.replace(/\.$/, '').replace(/\s*\(.*\)$/, ''); // Strip trailing period and parenthetical notes
                              return (
                                <li key={ridx} className="text-sm text-gray-300 flex items-start gap-2 group/item">
                                  <span className="text-[#d4af37] opacity-40 mt-1 transition-opacity group-hover/item:opacity-100 uppercase font-bold text-[8px] tracking-tight">[{String.fromCharCode(65 + ridx)}]</span>
                                  <HoverableTerm 
                                    term={cleanTerm} 
                                    explanation={fundamentalExplanations[rule] || fundamentalExplanations[rule.trim()] || fundamentalExplanations[rule.replace(/\.$/, '')] || "Advanced architectural concept for robust game systems."} 
                                    category="Architecture"
                                  >
                                    <span className="leading-snug cursor-help border-b border-transparent group-hover/item:border-[#d4af37]/40 transition-all duration-300 group-hover/item:text-white font-medium text-gray-400">{rule}</span>
                                  </HoverableTerm>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-rpg-border/50" />

                  {/* PHILOSOPHY: RED LINES */}
                  <div className="flex flex-col bg-red-950/20 border border-red-900/50 rounded-lg p-8 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[80px] pointer-events-none rounded-full" />
                    <h2 className="text-3xl font-display font-bold text-red-500 tracking-tight mb-2 flex items-center gap-4">
                      <XCircle className="text-red-500 w-8 h-8" />
                      The "Should Absolutely Never Happen" List
                    </h2>
                    <p className="text-red-300/80 text-sm mb-8 pb-6 border-b border-red-900/30">Immediate critical architecture failures. If any of these are present in a Pull Request, the codebase is compromised.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "UI directly mutates core truth.",
                        "The same item instance exists in two places at once.",
                        "Quest logic is duplicated in multiple systems.",
                        "Save data is not versioned.",
                        "Definitions contain live runtime state.",
                        "Runtime state contains duplicated definition truth unnecessarily.",
                        "Dependencies are circular (SystemA <-> SystemB).",
                        "Content cannot be validated automatically.",
                        "Important game state cannot be dumped/inspected via console.",
                        "A feature cannot be explained strictly in one place.",
                        "You cannot tell who owns a specific mechanic.",
                        "Multiplayer authority boundaries are fuzzy.",
                        "One-off hacks become the core design pattern."
                      ].map((line, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-4 bg-red-950/40 border border-red-900/50 rounded-lg shadow-sm">
                          <FileWarning className="w-5 h-5 text-red-500 shrink-0" />
                          <span className="text-red-200 text-sm leading-relaxed">{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* DEEP DIVE: POE ITEMS */}
            {activeSystemId === 'example-poe-items' && (
              <motion.div key="poe-items" data-glossary-id="poe-items" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 flex flex-col bg-rpg-panel border border-[#d4af37]/30 rounded-lg p-8 overflow-y-auto shadow-2xl relative">
                <div className="absolute top-2 right-2 z-20">
                   <GlossaryToggle id="poe-items" />
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 blur-[80px] pointer-events-none rounded-full" />
                <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-2 flex items-center gap-4">
                  <Box className="text-[#d4af37] w-8 h-8" />
                  Deep Dive: PoE-Style Inventory
                </h2>
                <p className="text-gray-400 text-sm mb-8 max-w-3xl">Applying the 3-Layer separation to a deeply complex item ecosystem with dragging, orbs, and visual changes.</p>
                
                <div className="space-y-6">
                  <div className="bg-slate-900/50 border-l-4 border-emerald-500 p-5 rounded-r-lg">
                    <h3 className="uppercase text-[11px] font-bold tracking-widest text-emerald-400 mb-2">1. The Definition (Template)</h3>
                    <p className="text-xs text-gray-300 mb-2">Knows what the item CAN be. Answers: What modifier pools can roll on it? What is the base appearance?</p>
                    <code className="text-[10px] text-gray-400 bg-black/40 p-2 rounded block font-mono">UDataAsset: "Iron Sword", allowed sockets, possible modifier pools, art style.</code>
                    <p className="text-[10px] text-gray-500 mt-2 italic">It does NOT know who owns it or if it is on the ground.</p>
                  </div>

                  <div className="bg-slate-900/50 border-l-4 border-blue-500 p-5 rounded-r-lg">
                    <h3 className="uppercase text-[11px] font-bold tracking-widest text-blue-400 mb-2">2. The Runtime State (Instance)</h3>
                    <p className="text-xs text-gray-300 mb-2">The actual live item instance. Answers: What are its current rolled modifiers? Where is it located?</p>
                    <code className="text-[10px] text-gray-400 bg-black/40 p-2 rounded block font-mono">Struct: Instance ID, current rolled modifiers, sockets/links, owner reference, grid slot.</code>
                    <p className="text-[10px] text-gray-500 mt-2 italic">If dropped from Inventory to Stash, the definition doesn't change—only the assigned "container ID" changes.</p>
                  </div>

                  <div className="bg-slate-900/50 border-l-4 border-purple-500 p-5 rounded-r-lg">
                    <h3 className="uppercase text-[11px] font-bold tracking-widest text-purple-400 mb-2">3. Presentation (Visuals)</h3>
                    <p className="text-xs text-gray-300 mb-2">How it is shown. Answers: What tooltip do I show? What drag preview do I render?</p>
                    <code className="text-[10px] text-gray-400 bg-black/40 p-2 rounded block font-mono">UI Widget / Dynamic Material: Ground floating text, inventory icon, tooltip.</code>
                    <p className="text-[10px] text-gray-500 mt-2 italic">Drag and drop is a UI request. Only when dropped successfully does Simulation change the container.</p>
                  </div>
                  
                  <div className="bg-amber-950/20 border border-amber-900/30 p-5 rounded-lg mt-6">
                     <h3 className="uppercase text-[11px] font-bold tracking-widest text-amber-500 mb-2">Crafting with Orbs</h3>
                     <p className="text-xs text-gray-300">
                       Using an Orb of Alchemy:
                       <br/><b>Input:</b> Player clicks orb, clicks item.
                       <br/><b>Simulation:</b> Crafting resolver checks rules, generates a new runtime state (new modifiers, rarity).
                       <br/><b>Presentation:</b> UI refreshes tooltip and color based on new state. The orb never directly "paints" the item.
                     </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* DEEP DIVE: LIMB TARGETING */}
            {activeSystemId === 'example-limb-target' && (
              <motion.div key="limb-target" data-glossary-id="limb-target" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 flex flex-col bg-rpg-panel border border-[#d4af37]/30 rounded-lg p-8 overflow-y-auto shadow-2xl relative">
                <div className="absolute top-2 right-2 z-20">
                   <GlossaryToggle id="limb-target" />
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 blur-[80px] pointer-events-none rounded-full" />
                <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-2 flex items-center gap-4">
                  <Crosshair className="text-[#d4af37] w-8 h-8" />
                  Deep Dive: Limb Targeting
                </h2>
                <p className="text-gray-400 text-sm mb-8 max-w-3xl">Implementing advanced combat mechanics cleanly to prevent physics colliders, UI, and logic from merging catastrophically.</p>
                
                <div className="space-y-6">
                  <div className="bg-slate-900/50 border-l-4 border-emerald-500 p-5 rounded-r-lg">
                    <h3 className="uppercase text-[11px] font-bold tracking-widest text-emerald-400 mb-2">1. The Definition (Anatomy)</h3>
                    <code className="text-[10px] text-gray-400 bg-black/40 p-2 rounded block font-mono mb-2">UEnemyBodyDefinition</code>
                    <ul className="text-[10px] space-y-1 text-gray-400 list-disc list-inside">
                      <li>Body parts: Head, torso, left leg...</li>
                      <li>Hitbox shape, damage multiplier, status effect sensitivity.</li>
                    </ul>
                    <p className="text-[10px] text-gray-500 mt-2 italic">It does NOT know that "this specific wolf is currently limping."</p>
                  </div>

                  <div className="bg-slate-900/50 border-l-4 border-blue-500 p-5 rounded-r-lg">
                    <h3 className="uppercase text-[11px] font-bold tracking-widest text-blue-400 mb-2">2. The Runtime State (Status)</h3>
                    <p className="text-xs text-gray-300 mb-2">The actual enemy taking the hit.</p>
                    <code className="text-[10px] text-gray-400 bg-black/40 p-2 rounded block font-mono mb-2">Struct: current HP per part, wound severity, crippled flags, animation overrides.</code>
                    <p className="text-[10px] text-gray-500 italic">If the leg is hit: leg HP decreases, limp state triggers, AI stops sprinting.</p>
                  </div>

                  <div className="bg-slate-900/50 border-l-4 border-purple-500 p-5 rounded-r-lg">
                    <h3 className="uppercase text-[11px] font-bold tracking-widest text-purple-400 mb-2">3. Presentation (Feedback)</h3>
                    <p className="text-xs text-gray-300 mb-2">Visual overlays and animation graphs.</p>
                    <code className="text-[10px] text-gray-400 bg-black/40 p-2 rounded block font-mono mb-2">UI: Weak-point hover ring, damage numbers, limp animation, blood VFX.</code>
                  </div>
                  
                  <div className="bg-black/30 border border-gray-700 p-5 rounded-lg mt-6">
                     <h3 className="uppercase text-[11px] font-bold tracking-widest text-gray-300 mb-2">The Hit Flow</h3>
                     <ol className="text-xs text-gray-400 space-y-2 list-decimal list-inside">
                       <li><b>Presentation:</b> Player moves mouse over the leg.</li>
                       <li><b>Targeting:</b> Game checks part under cursor (Aim Assist/Precision rules).</li>
                       <li><b>Simulation:</b> Attack connects → checks part multiplier → HP decreases → injury updates.</li>
                       <li><b>Presentation:</b> Animation graph picks 'limp', UI shows damage.</li>
                     </ol>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SYSTEM REGISTRY VIEW */}
            {activeSystem && !activeSystemId.startsWith('philosophy') ? (
              <motion.div 
                key={activeSystem.id}
                data-glossary-id={activeSystem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col xl:flex-row gap-6 bg-rpg-panel border border-rpg-border rounded-lg p-6 overflow-hidden shadow-2xl relative"
              >
                <div className="absolute top-2 right-2 z-20">
                   <GlossaryToggle id={activeSystem.id} />
                </div>
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] pointer-events-none rounded-full" />
                
                <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-rpg-border gap-4 shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-900/30 rounded-xl text-blue-400 border border-blue-500/20 shadow-inner">
                        {React.cloneElement(activeSystem.icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
                      </div>
                      <div>
                        <h2 className="text-2xl font-display font-bold text-white tracking-tight">{activeSystem.title}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500 flex items-center gap-1"><Terminal className="w-3 h-3" /> Layer: </span>
                          <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${
                            systemLayer === 'Core' ? 'bg-slate-800 text-slate-300 border-slate-600' :
                            systemLayer === 'Data' ? 'bg-emerald-900/50 text-emerald-400 border-emerald-700/50' :
                            systemLayer === 'Simulation' ? 'bg-amber-900/50 text-amber-500 border-amber-700/50' :
                            systemLayer === 'Gameplay' ? 'bg-purple-900/50 text-purple-400 border-purple-700/50' :
                            'bg-sky-900/50 text-sky-400 border-sky-700/50'
                          }`}>{systemLayer}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeSystem.pillars.map(pillar => (
                        <div key={pillar} className="flex items-center gap-2 px-2.5 py-1.5 bg-black/40 rounded-full border border-rpg-border text-[9px] font-bold text-gray-300 uppercase tracking-widest shadow-sm">
                          <PillarIcon type={pillar} />
                          {pillar}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto scrollbar-hide pr-2 space-y-8">
                    <div className="text-gray-300 text-base leading-relaxed max-w-3xl font-light">
                      {activeSystem.description}
                    </div>

                    {/* Problem/Solution Overrides to add teaching depth */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-5 relative overflow-hidden group hover:border-red-500/50 transition-colors">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20" />
                        <div className="flex items-center gap-2 mb-3 text-red-500 font-bold text-[10px] uppercase tracking-[0.2em]">
                          <AlertTriangle className="w-4 h-4" /> The Arch Problem
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed font-normal">
                          {activeSystem.id === 'item-data' ? <span><strong>Beginner Mistake:</strong> Storing durability, enchantments, and the item's icon/mesh inside a single "Sword" Actor class. Every drop becomes a massive memory allocation, and the UI must dig into physically spawned objects to read stats.</span> :
                           activeSystem.id === 'inventory-system' ? <span><strong>Beginner Mistake:</strong> Treating Inventory as an array of UObjects where "Location" dictates what an item is. Stacking and splitting items requires deep-copying memory.</span> :
                           activeSystem.id === 'passive-tree' ? <span><strong>Beginner Mistake:</strong> Passing massive JSON arrays or full node lists over the network to synchronize active passives. Graph checks (DFS) run on every UI click leading to O(N) stalls.</span> :
                           activeSystem.id === 'save-load' ? <span><strong>Beginner Mistake:</strong> Storing pointers to memory actors instead of stable IDs. Trying to load a save means hoping the exact same UObject structure exists. Using huge unversioned JSON text files.</span> :
                           activeSystem.id === 'quest-systems' ? <span><strong>Beginner Mistake:</strong> hardcoding quest stages via boolean flags distributed across five different NPC blueprints.</span> :
                           activeSystem.id === 'dialogue-narrative' ? <span><strong>Beginner Mistake:</strong> using switch/if statements for branching conversations and tightly coupling the UI widget to the quest logic.</span> :
                           activeSystem.problem}
                        </p>
                      </div>
                      <div className="bg-green-950/10 border border-green-900/30 rounded-xl p-5 relative overflow-hidden group hover:border-green-500/50 transition-colors">
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-500/20" />
                        <div className="flex items-center gap-2 mb-3 text-green-500 font-bold text-[10px] uppercase tracking-[0.2em]">
                          <ShieldCheck className="w-4 h-4" /> The Architect Solution
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed font-normal">
                          {activeSystem.id === 'item-data' ? <span><strong>Pro Architecture:</strong> The 3-Layer Split. <br/><br/>1. <b>Definition (UDataAsset):</b> "Iron Sword" name, icon, base damage.<br/>2. <b>Runtime (USTRUCT):</b> 32-byte instance holding a stable ID and durability.<br/>3. <b>Presentation (UWidget):</b> Reactively observes the Runtime block to fetch Definition visuals.</span> :
                           activeSystem.id === 'inventory-system' ? <span><strong>Pro Architecture:</strong> Abstract Container Model. Items are mere structs. Grid location is just X/Y integer state. Stack operations simply update an integer count. <i>There is no physical sword until it hits the ground.</i></span> :
                           activeSystem.id === 'passive-tree' ? <span><strong>Pro Architecture:</strong> The entire allocation map is a <code>uint32</code> bitmask. Validation is strictly server-authoritative BFS traversal. The client merely predicts the connection UI, but doesn't decide it.</span> :
                           activeSystem.id === 'save-load' ? <span><strong>Pro Architecture:</strong> Chunked & Versioned Binary Archives. Save files are partitioned into streams (PlayerState, Inventory, WorldState). If WorldState fails serialization, the character is NOT wiped. Stable IDs reconstruct objects post-load.</span> :
                           activeSystem.id === 'quest-systems' ? <span><strong>Pro Architecture:</strong> Global node-graph state machine. Transitions are validated against a central WorldState, meaning UI merely reads the active quest node, it never advances it.</span> :
                           activeSystem.id === 'dialogue-narrative' ? <span><strong>Pro Architecture:</strong> Narrative subsystems independently evaluate abstract Logic Conditions (Reputation {'>'} 50) and output a read-only View Model for the UI.</span> :
                           activeSystem.optimizedFoundation}
                        </p>
                      </div>
                    </div>

                    {/* NEW: STRICT RED LINES (What should never happen) */}
                    <div className="bg-red-950/20 rounded-xl border border-red-900/40 p-4">
                      <h4 className="text-[10px] text-red-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                         <XCircle className="w-4 h-4" /> Red Line: Should Absolutely Never Happen
                      </h4>
                      <p className="text-xs text-red-300/80 leading-relaxed">
                        {activeSystem.id === 'item-data' ? "A runtime item struct contains the text string of its own name or stores a direct pointer to its UMG UI tooltip widget." :
                         activeSystem.id === 'inventory-system' ? "An item instance naturally exists in two separate container arrays simultaneously while only possessing one unique ID." :
                         activeSystem.id === 'passive-tree' ? "A passive node decides it is unlocked without asking the Server to traverse the bitmask path back to the Start node." :
                         activeSystem.id === 'save-load' ? "The serialization archive crashes upon loading an older game version because it lacked a versioned migration step." :
                         "A presentation layer (UI/VFX) directly mutates the foundational state and assumes authority over the simulation."}
                      </p>
                    </div>

                    {/* NEW: Dependency Flow Visualization */}
                    <div className="bg-slate-950 rounded-xl border border-gray-800 p-6 shadow-inner">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        Strict Dependency Direction
                      </h3>
                      <div className="flex items-center justify-between text-[11px] font-mono w-full">
                        {['Core', 'Data', 'Simulation', 'Gameplay', 'Presentation'].map((layer, index) => (
                           <React.Fragment key={layer}>
                             <div className={`px-3 py-1.5 rounded-lg border ${
                               layer === systemLayer 
                                ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] transform scale-110' 
                                : 'bg-slate-900 border-slate-700 text-slate-500'
                             }`}>
                               {layer}
                             </div>
                             {index < 4 && <div className="flex-1 h-px bg-slate-800 mx-2 relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-slate-700"></div>
                             </div>}
                           </React.Fragment>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-4 text-center italic">This system sits on the <span className="font-bold text-gray-300">{systemLayer}</span> layer. It may NEVER depend on layers to its right.</p>
                    </div>

                    {/* NEW: 10 Fundamental Questions */}
                    <div className="bg-black/40 rounded-xl border border-gray-800 p-6 overflow-hidden">
                       <h3 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-[#d4af37]/20 pb-2">
                        <Info className="w-4 h-4" />
                        The 10 Architectural Answers
                      </h3>
                      <div className="px-2 space-y-4">
                        {[
                          {q: "What is it?", a: questions?.q1},
                          {q: "What is true right now?", a: questions?.q2},
                          {q: "How is it shown?", a: questions?.q3},
                          {q: "Who owns it?", a: questions?.q4},
                          {q: "How does it change?", a: questions?.q5},
                          {q: "How is it saved?", a: questions?.q6},
                          {q: "How is it validated?", a: questions?.q7},
                          {q: "How do I inspect it?", a: questions?.q8},
                          {q: "How does it scale?", a: questions?.q9},
                          {q: "How would multiplayer fit into it?", a: questions?.q10},
                        ].map((item, idx) => (
                          <div key={idx} className="flex flex-col md:flex-row md:gap-4 items-start border-b border-white/5 pb-3 last:border-0 last:pb-0">
                            <span className="text-xs font-semibold text-gray-400 w-48 shrink-0">{idx + 1}. {item.q}</span>
                            <span className="text-sm text-gray-300">{item.a}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-black/60 rounded-2xl border border-rpg-border p-6 relative flex flex-col items-center justify-center min-h-[280px] shadow-inner mt-6 overflow-hidden">
                      <div className="absolute top-4 left-6 text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Cpu className="w-3 h-3 text-gray-500" /> Interactive Simulation Lab
                      </div>
                      
                      {/* NEW: Contextual Lab Headers to fix teaching gaps */}
                      {activeSystem.id === 'passive-tree' && (
                        <div className="absolute top-12 left-6 right-6 flex gap-4 text-xs">
                          <div className="flex-1 bg-blue-900/10 border border-blue-900/30 p-2 rounded text-blue-200/70">
                            <strong className="text-blue-400 block mb-1">Ownership & Validation</strong>
                            The <code className="text-gray-400">ProgressionComponent</code> owns this bitmask. Clicking a node requests an allocation to the Server. The Server performs a <strong>BFS Validation</strong> from the Start node to ensure the clicked node isn't an invalid "island", then replicates the updated bitmask.
                          </div>
                          <div className="flex-1 bg-purple-900/10 border border-purple-900/30 p-2 rounded text-purple-200/70">
                            <strong className="text-purple-400 block mb-1">Quest-Reactive Nodes</strong>
                            If you complete a major world quest, it can flag a node ID as "Unlocked". The UI re-evaluates the definition map and swaps the visual node type dynamically.
                          </div>
                        </div>
                      )}

                      {activeSystem.id === 'save-load' && (
                        <div className="absolute top-12 left-6 right-6 flex gap-4 text-xs">
                          <div className="flex-1 bg-green-900/10 border border-green-900/30 p-2 rounded text-green-200/70">
                            <strong className="text-green-400 block mb-1">Chunked + Versioned Structure</strong>
                            Saves are NOT single monolithic files. They are byte-chunked.
                            <br/><br/>
                            <code className="text-green-300/80 bg-green-950/40 p-1 block">
                              [Header: Ver 4.2]<br/>
                              [Chunk 0: PlayerState_Blob]<br/>
                              [Chunk 1: WorldState_Blob]<br/>
                              [Chunk 2: Inventory_Blob]
                            </code>
                            If Chunk 1 fails to deserialize due to an old version, Chunk 0 and 2 are preserved.
                          </div>
                        </div>
                      )}

                      <div className={`w-full h-full flex items-center justify-center ${
                         (activeSystem.id === 'passive-tree' || activeSystem.id === 'save-load') ? 'pt-24' : ''
                      }`}>
                        <activeSystem.playground onEvent={() => {}} state={activeSystem.initialState} setState={() => {}} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side Code Panel */}
                <div className="w-full xl:w-[400px] flex flex-col gap-4 flex-shrink-0 relative z-10 shrink-0">
                   <div className="h-full flex flex-col gap-4">
                     {activeSystem.lineByLineContent ? (
                       <div className="flex-1 bg-slate-950/80 p-5 rounded-xl border border-rpg-border flex flex-col min-h-0 overflow-hidden shadow-xl backdrop-blur-sm">
                          <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-3">
                            <h4 className="text-[10px] uppercase font-bold text-blue-400 tracking-[0.2em] flex items-center gap-2">
                              <Terminal className="w-3.5 h-3.5" /> Core Implementation
                            </h4>
                            <div className="flex gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-red-500/40" />
                              <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                              <div className="w-2 h-2 rounded-full bg-green-500/40" />
                            </div>
                          </div>
                          
                          {/* NEW: Explicit Architectural Context for the code */}
                          <div className="mb-4 p-3 bg-blue-950/20 border border-blue-900/30 rounded text-xs text-blue-200/80 leading-relaxed font-light">
                            <strong className="text-blue-400 block mb-1 text-[10px] uppercase tracking-widest">Architectural Context</strong>
                            {activeSystem.id === 'item-data' ? "We use a USTRUCT here instead of a Class to ensure this memory is managed directly on the stack/array contiguous blocks, bypassing the Garbage Collector completely. This is how ARPGs manage millions of items." :
                             activeSystem.id === 'passive-tree' ? "We use a uint32 bitmask because Bitwise operations natively execute in a single CPU clock cycle, meaning validating 1000 nodes takes fractions of a millisecond." :
                             activeSystem.id === 'inventory-system' ? "We implement container grids as flat arrays rather than 2D arrays because it guarantees contiguous memory and Cache Line optimization." :
                             activeSystem.id === 'world-state' ? "A flat TMap using FName is used because FName string lookups are technically integer ID lookups under the hood, making huge narrative checks completely frictionless." :
                             activeSystem.id === 'save-load' ? "The FArchive bypasses generic reflection serialization (like JSON) and streams binary bytes directly. It is explicitly immune to versioning drift if structured properly." :
                             "This pattern enforces a strict separation of 'Definition' and 'State'. Notice how it never holds pointers to UI Widgets or hardcoded strings."}
                          </div>

                          <div className="flex-1 overflow-y-auto scrollbar-hide font-mono text-[11px] space-y-0.5 pr-2">
                            {activeSystem.lineByLineContent.map((line, idx) => (
                              <HoverableLine 
                                key={idx} 
                                code={<span className="text-orange-100/90 whitespace-pre-wrap break-all leading-relaxed">{line.code || " "}</span>} 
                                explanation={line.explanation} 
                              />
                            ))}
                          </div>
                        </div>
                     ) : (
                       activeSystem.codeView && (
                         <div className="flex-1 bg-slate-950/80 rounded-2xl border border-rpg-border overflow-hidden shadow-xl backdrop-blur-sm">
                           {activeSystem.codeView(null)}
                         </div>
                       )
                     )}
                     {activeSystem.visualExample && (
                       <div className="bg-slate-900 border border-rpg-border rounded-lg overflow-hidden flex flex-col flex-shrink-0">
                         <div className="bg-slate-800 p-2 border-b border-gray-700 flex items-center gap-2">
                            <Cpu className="w-3 h-3 text-blue-400" />
                             <h4 className="font-semibold text-gray-200 text-[11px] uppercase tracking-wider truncate">Architecture: {activeSystem.visualExample.title}</h4>
                         </div>
                         <div className="p-3">
                           <p className="text-[10px] text-gray-400 mb-2 leading-relaxed">{activeSystem.visualExample.description}</p>
                           <div className="bg-black/40 border border-gray-800 rounded p-1.5 ">
                             {activeSystem.visualExample.visualization}
                           </div>
                         </div>
                       </div>
                     )}
                   </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


