import React, { useState } from 'react';
import { FrameworkSystem } from '../types/frameworkTypes';
import { Box, Share2, Map as MapIcon, Save, FastForward, Video, Image as ImageIcon, BrainCircuit, Cpu, Code, Activity, Ghost, Users, Zap, Radio, Scroll, BarChart3, Layout, Layers, Lock, MessageSquare, Globe, Users2, Gamepad2, Archive, Crosshair } from 'lucide-react';
import HoverableLine from '../components/HoverableLine';
import LiveStructView from '../components/LiveStructView';
import { motion, AnimatePresence } from 'motion/react';
import ItemCraftingPlayground from '../components/ItemCraftingPlayground';
import DialoguePlayground from '../components/DialoguePlayground';
import WorldMapPlayground from '../components/WorldMapPlayground';
import PerformancePlayground from '../components/PerformancePlayground';
import PassiveTreePlayground from '../components/PassiveTreePlayground';
import InventoryPlayground from '../components/InventoryPlayground';
import EventBusPlayground from '../components/EventBusPlayground';

export const frameworkSystems: FrameworkSystem[] = [
  {
    id: 'dialogue-narrative',
    name: 'Dialogue & Narrative',
    icon: <MessageSquare className="w-4 h-4" />,
    category: 'Core Architecture',
    title: 'Branching Narrative Graphs',
    description: 'Witcher-quality storytelling requires complex graph logic. This system manages UDialogueWave, custom graph editors, and condition evaluation. Pro Tip: Use the persistable WorldState to lock/unlock branches based on previous choices, reputation, or inventory state.',
    problem: 'Beginner: Hardcoding dialogue into UI widgets or strings. Pro: Static conversations lack the depth of branching consequences and fail to persist player choices across acts.',
    optimizedFoundation: 'Beginner: We use a Visual Dialogue Graph where each node is a "Wave" of data. Pro: A dedicated Narrative Subsystem evaluates logical conditions (has_item, quest_step) before generating the UI response.',
    pillars: ['Scalability', 'Memory'],
    initialState: {},
    optimizedCode: `
// Narrative Graph Node & World State Integration
UCLASS(BlueprintType)
class UDialogueGraphNode : public UEdGraphNode {
    UPROPERTY(EditAnywhere)
    UDialogueWave* DialogueData; // UE5 base struct for Voice/Subtitles

    UPROPERTY(EditAnywhere)
    TArray<FDialogueOption> Choices;

    // Evaluates conditions against global WorldState
    bool IsOptionAvailable(const FDialogueOption& Option, UWorldStateSubsystem* WS) {
        return Option.Condition.Evaluate(WS);
    }
    
    // Custom Graph Editor hook
    #if WITH_EDITOR
    virtual FText GetNodeTitle(ENodeTitleType::Type TitleType) const override;
    #endif
};`,
    lineByLineContent: [
      { code: "class UDialogueGraphNode : public UEdGraphNode", explanation: "Integrates with UE5's custom Graph Editor framework to allow visual node-based authoring." },
      { code: "    UDialogueWave* DialogueData;", explanation: "Uses standard UE5 UDialogueWave for robust audio, subtitle localization, and lip-sync." },
      { code: "    TArray<FDialogueOption> Choices;", explanation: "Branching paths the player can take from this node." },
      { code: "    bool IsOptionAvailable()", explanation: "Runtime check to see if a Choice should be hidden or locked." },
      { code: "    {", explanation: "" },
      { code: "        return Option.Condition.Evaluate(WS);", explanation: "Queries the WorldStateSubsystem for flags like 'Reputation > 50'. This is how your choices lock/unlock the narrative graph." },
      { code: "    }", explanation: "" },
      { code: "};", explanation: "" }
    ],
    playground: ({ onEvent }) => <DialoguePlayground onEvent={onEvent} />,
    visualExample: {
      title: "Dialogue Graph Node",
      description: "Visualizes the branching logic of a single narrative node.",
      visualization: (
        <div className="flex flex-col gap-2 p-2">
          <div className="bg-purple-900 border border-purple-500 rounded p-1.5 text-[10px] text-purple-200">DialogueNode</div>
          <div className="flex justify-between items-center text-[8px] text-gray-400 font-mono">
            <span>Branch_A</span>
            <span>Branch_B</span>
          </div>
        </div>
      )
    },
    codeView: () => (
      <LiveStructView title="UDialogueGraph">
        <HoverableLine code={<span className="text-green-300">"CurrentNode": "G_Intro_01",</span>} explanation="Current active node in the graph." />
        <HoverableLine code={<span className="text-green-300">"ConditionResult": "MET"</span>} explanation="Evaluation of the last option clicked." />
      </LiveStructView>
    )
  },
  {
    id: 'world-state',
    name: 'World State/Consequence',
    icon: <Globe className="w-4 h-4" />,
    category: 'Engine Subsystems',
    title: 'Persistent Consequence Registry',
    description: 'Actions in Act 1 must have consequences in Act 3. The WorldStateSubsystem stores key-value flags (bools, ints, enums) that represent the state of the world persistent across saves.',
    problem: 'Beginner: NPCs only know what is in their local variables. Pro: Localized data prevents global cause-effect logic (e.g., if you burn a bridge, the trade route system should break globally).',
    optimizedFoundation: 'Beginner: We use a "Global Memory" that any actor can read from. Pro: A centralized WorldStateSubsystem ensures that narrative consequences are archived, replicated, and queried efficiently.',
    pillars: ['Scalability', 'Networking'],
    initialState: {},
    optimizedCode: `
// Global K-V Persistence
UCLASS()
class UWorldStateSubsystem : public UWorldSubsystem {
    UPROPERTY()
    TMap<FName, int32> StateFlags;

    void SetStateFlag(FName Key, int32 Value);
    int32 GetStateFlag(FName Key) const;

    // Triggered when key consequences occur
    void OnConsequenceBroadcast(FName ActionID);
};`,
    lineByLineContent: [
      { code: "class UWorldStateSubsystem", explanation: "The brain of the game's long-term memory." },
      { code: "    TMap<FName, int32> StateFlags;", explanation: "Fast lookup map for world flags (e.g., 'Mayor_Dead', 'Reputation_Level')." },
      { code: "    void SetStateFlag()", explanation: "Writes a new consequence to the global registry." },
      { code: "    void OnConsequenceBroadcast()", explanation: "Notifies other systems (Dialogue, Quests) that the world has changed." }
    ],
    playground: ({ onEvent }) => (
      <div className="p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Active World State</span>
            <span className="text-xs text-blue-400 font-mono">B_Village_Status: SAVED</span>
          </div>
          <Globe className="w-5 h-5 text-blue-500 animate-spin-slow" />
        </div>
        <button onClick={() => onEvent('WorldState: PERSIST_EVENT(B_Village_Status, BURNED)')} className="py-2 bg-red-900/20 border border-red-500/50 rounded text-red-200 text-[10px] font-bold uppercase">Simulate Consequence</button>
      </div>
    ),
    visualExample: {
      title: "State Persistence",
      description: "Maps a key (ID) to a value (State) and persists it.",
      visualization: (
        <div className="flex justify-center p-2 font-mono text-[10px]">
          <div className="border border-blue-500 rounded p-1 text-blue-300">{"{ 'QuestA': 1, 'Mayor': 'Dead' }"}</div>
        </div>
      )
    },
    codeView: () => (
      <LiveStructView title="UWorldStateSubsystem">
        <HoverableLine code={<span className="text-green-300">"RegistrySize": 1420,</span>} explanation="Number of persistent flags currently tracked." />
        <HoverableLine code={<span className="text-green-300">"DirtyFlagsCount": 12</span>} explanation="Flags modified since last save." />
      </LiveStructView>
    )
  },
  {
    id: 'npc-scheduling',
    name: 'NPC Schedules & Behavior',
    icon: <Users2 className="w-4 h-4" />,
    category: 'AI Architecture',
    title: 'Daily Schedules & Perception',
    description: 'NPCs aren\'t static; they live lives. This involves daily scheduling (Tavern at 18:00, Sleep at 22:00) and complex perception systems (sight cones, hearing radii, alertness states).',
    problem: 'Beginner: NPCs stand in one spot forever. Pro: Static world actors ruin immersion and simplify stealth mechanics to basic "behind the back" checks.',
    optimizedFoundation: 'Beginner: We give NPCs a "To-Do List" based on time. Pro: Advanced AI uses a ScheduleSubsystem to update Behavior Tree goals based on the global clock and perception stimuli.',
    pillars: ['Performance', 'Scalability'],
    initialState: {},
    optimizedCode: `
// NPC Perception & Schedule Logic
USTRUCT()
struct FNPCScheduleEntry {
    int32 StartHour;
    FName TargetAction; // 'Eat', 'Work', 'Patrol'
};

class ANPCAIController : public AAIController {
    // Hearing & Sight
    void OnTargetPerceived(AActor* Actor, FAIStimulus Stimulus) {
        if (Stimulus.WasSuccessfullySensed()) {
            Blackboard->SetValueAsObject("LastKnownTarget", Actor);
            Blackboard->SetValueAsEnum("AlertState", EAlert::Searching);
        }
    }
};`,
    lineByLineContent: [
      { code: "struct FNPCScheduleEntry", explanation: "Data defining what an NPC should be doing at a specific time." },
      { code: "void OnTargetPerceived()", explanation: "Perception Hook: Triggered by sight cones or noise radii." },
      { code: "    if (Stimulus.WasSuccessfullySensed())", explanation: "Differentiates between direct sight and lingering memory or sound." },
      { code: "    Blackboard->SetValueAsEnum()", explanation: "Updates the AI brain to move from 'Idle' to 'Searching' or 'Combat'." }
    ],
    playground: ({ onEvent }) => (
      <div className="p-4 flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-red-500/30 flex items-center justify-center relative">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <div className="absolute inset-0 bg-red-500/10 rounded-full animate-pulse" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-[10px]">
               <span className="text-gray-400">Current Time:</span>
               <span className="text-blue-400 font-mono">18:45</span>
            </div>
            <div className="p-1 px-2 bg-slate-800 rounded text-[9px] text-gray-300 border border-white/5">SCHEDULE: GO_TO_TAVERN</div>
          </div>
        </div>
        <button onClick={() => onEvent('AI: Perception Stimulus (NOISE) Detected at Location X')} className="py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-[9px] text-gray-300 font-bold uppercase">Trigger Distraction</button>
      </div>
    ),
    visualExample: {
      title: "NPC Daily Schedule",
      description: "Visualizes the AI's goal transition based on time and stimuli.",
      visualization: (
        <div className="flex flex-col gap-2 p-2">
          <div className="bg-slate-800 border border-slate-600 rounded p-1 text-[9px] text-slate-300">Patrol (12:00)</div>
          <div className="bg-red-900 border border-red-500 rounded p-1 text-[9px] text-red-100">Hunt (Perceived Stimulus!)</div>
        </div>
      )
    },
    codeView: () => (
      <LiveStructView title="UAIPerceptionComponent">
        <HoverableLine code={<span className="text-green-300">"SightRadius": 1500.0,</span>} explanation="Max distance for visual lock." />
        <HoverableLine code={<span className="text-green-300">"HearingThreshold": 0.4</span>} explanation="Sensitivity to noise (Steps vs. Combat)." />
      </LiveStructView>
    )
  },
  {
    id: 'enhanced-input',
    name: 'Enhanced Input System',
    icon: <Gamepad2 className="w-4 h-4" />,
    category: 'Core Architecture',
    title: 'Modern Modular Bindings',
    description: 'UE5 deprecated the old input system. Enhanced Input uses UInputAction and UInputMappingContext to allow dynamic remapping, complex modifiers (Shift+Click), and game-state dependent input profiles.',
    problem: 'Beginner: Hardcoding "Space" to "Jump" in the project settings. Pro: Fixed bindings break when switching to Inventory menus or adding complex modifier logic like "Tap vs Hold".',
    optimizedFoundation: 'Beginner: We treat keys as "Signals" that our character interprets. Pro: Decoupling physical keys from logical actions using Mapping Contexts allows for seamless switching between Gameplay, UI, and Vehicle modes.',
    pillars: ['Scalability', 'Performance'],
    initialState: {},
    optimizedCode: `
// UE5 Enhanced Input Pattern
void APlayerChar::SetupInput(UInputComponent* PlayerInput) {
    if (UEnhancedInputComponent* EIP = Cast<UEnhancedInputComponent>(PlayerInput)) {
        // Bind logical Action (UInputAction*) to C++ function
        EIP->BindAction(IA_Jump, ETriggerEvent::Triggered, this, &AChar::Jump);
        
        // Add mapping context (UInputMappingContext*) for current game state
        Subsystem->AddMappingContext(GameplayContext, 0);
        
        // Complex Modifiers (UInputModifier*) like "Hold", "Tap", "Double Tap", "Chord/Shift"
        // are defined in the Mapping Context asset, completely decoupling logic from code.
    }
};`,
    lineByLineContent: [
      { code: "void SetupInput()", explanation: "Initializes the modern input pipeline for the player." },
      { code: "BindAction(IA_Jump, ...)", explanation: "Maps a logical 'Action' (UInputAction) data asset to a code function." },
      { code: "AddMappingContext(GameplayContext, 0);", explanation: "Enables a specific map (UInputMappingContext). Contexts can be swapped at runtime (e.g. entering a vehicle)." },
      { code: "// Complex Modifiers (UInputModifier*)", explanation: "Allows the engine to handle Input combinations (Shift+Click, Hold for 1 second) via Modifiers. Ensures code is logic-only." }
    ],
    playground: ({ onEvent }) => (
      <div className="p-4 grid grid-cols-2 gap-2">
        <div className="col-span-2 p-2 bg-blue-900/10 border border-blue-500/30 rounded text-[9px] text-blue-300 font-mono text-center">Active_Context: GAMEPLAY</div>
        <button onClick={() => onEvent('Input: IA_PrimaryAttack (LeftClick) -> Triggered')} className="p-3 bg-slate-800 rounded border border-white/5 text-[10px] text-gray-400 hover:text-white uppercase font-bold flex flex-col items-center gap-1"><Crosshair className="w-4 h-4" /> Click</button>
        <button onClick={() => onEvent('Input: IA_SpecialAction (Shift+Click) -> Triggered')} className="p-3 bg-slate-800 rounded border border-white/5 text-[10px] text-gray-400 hover:text-white uppercase font-bold flex flex-col items-center gap-1"><Zap className="w-4 h-4" /> Shift+Click</button>
      </div>
    ),
    visualExample: {
      title: "Input Mapping",
      description: "Visualizes the mapping between inputs and actions.",
      visualization: (
        <div className="flex gap-2 p-2 text-[10px] font-mono">
          <div className="bg-slate-800 border p-1 rounded">Shift+C</div>
          <span className="text-gray-500">→</span>
          <div className="bg-blue-900 border border-blue-500 p-1 rounded text-blue-200">InvokeAbility</div>
        </div>
      )
    },
    codeView: () => (
      <LiveStructView title="UInputMappingContext">
        <HoverableLine code={<span className="text-green-300">"Mappings": 12,</span>} explanation="Number of active key-to-action pairs." />
        <HoverableLine code={<span className="text-green-300">"Priority": 0</span>} explanation="Layering depth (UI > Gameplay)." />
      </LiveStructView>
    )
  },
  {
    id: 'inventory-system',
    name: 'Inventory Subsystem',
    icon: <Archive className="w-4 h-4" />,
    category: 'Core Architecture',
    title: 'Container & Equipment Containers',
    description: 'Beyond just item data, a true inventory handles weight limits, equipment slots, stack logic, and affix pools. It is the bridge between Item Data and character stats.',
    problem: 'Beginner: Treating inventory as a single array of ItemObjects. Pro: Flat arrays make equipment slot management, weight calculations, and item stacking a nightmare of "if" statements.',
    optimizedFoundation: 'Beginner: We use a "Container" system with specific slots. Pro: A dedicated inventory component manages byte-packed item structs and broadcasts state changes to the GAS AttributeSet.',
    pillars: ['Memory', 'Networking', 'Scalability'],
    initialState: {},
    optimizedCode: `
// Inventory Container C++
UCLASS()
class UInventoryComponent : public UActorComponent {
    UPROPERTY(ReplicatedUsing = OnRep_Items)
    TArray<FItemInstance> Items;

    UPROPERTY(EditAnywhere)
    int32 MaxWeight = 100;

    // Weight calculation using byte-memory scan
    float GetCurrentWeight() const;

    // Equipment slot mapping (Head, Chest, Hands)
    UPROPERTY()
    TMap<EEquipSlot, FItemInstance> EquipmentSlots;
};`,
    lineByLineContent: [
      { code: "class UInventoryComponent", explanation: "Actor component managing the player's physical items." },
      { code: "TArray<FItemInstance> Items;", explanation: "A lean array of USTRUCTs to minimize memory and GC traffic." },
      { code: "TMap<EEquipSlot, FItemInstance>", explanation: "Specific slots for Head/Chest/Armor, allowing O(1) equipment lookup." },
      { code: "float GetCurrentWeight()", explanation: "Efficiently sums item weights to enforce movement penalties." }
    ],
    playground: ({ onEvent }) => <InventoryPlayground onEvent={onEvent} />,
    codeView: () => (
      <LiveStructView title="UInventoryComponent">
        <HoverableLine code={<span className="text-green-300">"SlotCount": 32,</span>} explanation="Current grid dimensions." />
        <HoverableLine code={<span className="text-green-300">"Weight": 42.5kg</span>} explanation="Dynamic sum of all item weights." />
      </LiveStructView>
    )
  },
  {
    id: 'item-data',
    name: 'Item Data',
    icon: <Box className="w-4 h-4" />,
    category: 'Core Architecture',
    title: 'Data-Driven Items',
    description: 'Think of items as "Recipes" (DataAssets) and "Physical Items" (Structs). To make a game with thousands of items, you cannot afford to waste memory. Optimization: We use Structs for the 99% of item logic to avoid "Garbage Collection" hitches. Pro Tip: Use FName for ID lookups; it converts strings to integers under the hood, making comparisons nearly instant during inventory searches.',
    problem: 'Beginner: Creating 1,000 "Object" items is like giving each item its own separate car—it clogs up the road. Pro: Massive GC overhead and cache misses occur when metadata is scattered across the heap as UObjects.',
    optimizedFoundation: 'Beginner: We pack items into tiny, efficient "Envelopes" (USTRUCTs). Pro: Decoupling static UDataAssets from lean value-type structs keeps the per-item footprint < 64 bytes, staying within a single Cache Line.',
    pillars: ['Memory', 'Performance'],
    initialState: { rarity: 'Normal', prefixes: 0, suffixes: 0 },
    optimizedCode: `
// Optimized Item Representation
USTRUCT(BlueprintType)
struct FItemInstance
{
    GENERATED_BODY()

    UPROPERTY()
    FName ItemID; // Faster than FString for repetitive lookups

    UPROPERTY()
    TSharedPtr<FItemStats> DynamicStats; // Shared memory to prevent data bloat

    // Use bitfield for boolean flags to save bytes
    uint8 bIsIdentified : 1;
    uint8 bIsLocked : 1;

    FItemInstance() : bIsIdentified(0), bIsLocked(0) {}
};`,
    lineByLineContent: [
      { code: "USTRUCT(BlueprintType)", explanation: "Exposes the struct to Blueprints and the Unreal Header Tool (UHT)." },
      { code: "struct FItemInstance", explanation: "The lean runtime representation of a specific item in memory." },
      { code: "{", explanation: "Start of the struct definition." },
      { code: "    GENERATED_BODY()", explanation: "Macro required by UE to inject reflection and serialization code." },
      { code: "", explanation: "Spacing for readability." },
      { code: "    UPROPERTY()", explanation: "Flag for the Garbage Collector and Reflection system." },
      { code: "    FName ItemID;", explanation: "Fixed-size string reference. Much faster for lookups and comparisons than FString." },
      { code: "", explanation: "Spacing." },
      { code: "    UPROPERTY()", explanation: "Ensures the shared pointer is tracked by the system if it points to UObjects." },
      { code: "    TSharedPtr<FItemStats> DynamicStats;", explanation: "Thread-safe shared pointer to data that might be used by multiple items (e.g. base stats)." },
      { code: "", explanation: "Spacing." },
      { code: "    uint8 bIsIdentified : 1;", explanation: "Bitfield: Stores a boolean in exactly 1 bit, packing 8 bools into 1 byte." },
      { code: "    uint8 bIsLocked : 1;", explanation: "Another bitfield to optimize memory footprint in large inventories." },
      { code: "", explanation: "Spacing." },
      { code: "    FItemInstance() : bIsIdentified(0), bIsLocked(0) {}", explanation: "Constructor initializing bitfields to zero." },
      { code: "};", explanation: "End of struct." }
    ],
    playground: ({ onEvent }) => <ItemCraftingPlayground onEvent={onEvent} />,
    codeView: (state) => (
      <LiveStructView title="USTRUCT FItemInstance">
        <HoverableLine code={<span className="text-green-300">"Id": "8f2a1b9c..."</span>} explanation="Unique runtime ID." />
        <HoverableLine code={<span className="text-green-300">"Rarity": "Rare"</span>} explanation="Enum determining affix count." />
      </LiveStructView>
    )
  },
  {
    id: 'passive-tree',
    name: 'Passive Skill Trees',
    icon: <Share2 className="w-4 h-4" />,
    category: 'Optimization',
    title: 'Spatial Skill Graph Architecture',
    description: 'A massive web of choices. Instead of checking every node individually, we treat the whole tree as a single number (a Bitmask). Optimization: Graph Traversal (DFS) ensures players cannot "Cheat" by unlocking disconnected nodes. Pro Tip: jewels act as "Spatial Injectors," modifying the stats of all nodes within a specific radius based on a pre-computed grid.',
    problem: 'Beginner: Storing 500 "Yes/No" answers for every skill is like carrying 500 separate slips of paper. Pro: Serializing 500 booleans wastes bandwidth and creates O(N) lookup overhead during stat calculation.',
    optimizedFoundation: 'Beginner: We store the entire tree state as bits (0 and 1) in one tiny container. Pro: A fixed-sized Bitmask (uint32[N]) allows O(1) checks and ensures the entire tree state fits in a single UDP packet.',
    pillars: ['Networking', 'Memory', 'Scalability'],
    initialState: { mask: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    optimizedCode: `
// Replicated Bitmask & Dev Tool Logic
USTRUCT()
struct FPassiveTreeMask {
    GENERATED_BODY()

    UPROPERTY(Replicated)
    uint32 Mask[16]; // 512 nodes

    void SetNode(int32 NodeID, bool bState);
    
    // Server-side validation of the allocation graph
    bool IsPathToRootValid(int32 NodeID) {
        // Perform DFS/BFS to ensure the node is reachable from "Start"
        // This prevents "Floating Islands" of skills if a middle node is refunded
        // Complex calculation: Jewel radius injection checks
        return TraversalCheck(NodeID, RootNode);
    }
};

// Slate Rendering Optimizer
class SSkillTreeWidget : public SCompoundWidget {
    // Custom OnPaint to batch draw 10,000 nodes in one pass
    virtual int32 OnPaint(...) const override;
};`,
    lineByLineContent: [
      { code: "struct FPassiveTreeMask", explanation: "Bitset representation for efficient memory and networking." },
      { code: "    uint32 Mask[16];", explanation: "Packs 512 boolean values into just 64 bytes of replicated data." },
      { code: "", explanation: "" },
      { code: "    bool IsPathToRootValid()", explanation: "Graph traversal logic to ensure connectivity on the server." },
      { code: "    {", explanation: "" },
      { code: "        // Prevents 'Island' exploits", explanation: "Validates that every point is connected to the Start node using a BFS/DFS approach." },
      { code: "        return TraversalCheck();", explanation: "Standard Graph search against the current bitmask state." },
      { code: "    }", explanation: "" },
      { code: "", explanation: "" },
      { code: "    // Spatial Jewel Injection", explanation: "Calculates which nodes fall within X units of a socketed jewel." },
      { code: "    void UpdateJewelRadius(FVector2D SocketPos, float Radius);", explanation: "Spatial query that applies 'questModifiers' to nodes in the overlap zone." },
      { code: "};", explanation: "" },
      { code: "", explanation: "" },
      { code: "virtual int32 OnPaint()", explanation: "Low-level Slate rendering to draw thousands of nodes efficiently without UObject overhead." }
    ],
    playground: ({ onEvent }) => <PassiveTreePlayground onEvent={onEvent} />,
    codeView: (state) => {
      return (
        <LiveStructView title="UPROPERTY() uint32 NodeMask[4]">
          <HoverableLine 
            code={<span className="text-green-300">NodeAllocationMask[0] = 0b00101011;</span>} 
            explanation="Each bit represents one node. Extremely fast to replicate over the network." 
          />
          <HoverableLine 
            code={<span className="text-green-300">ActiveJewelRadius = 120.0f;</span>} 
            explanation="Pre-computed radius for spatial stat injection." 
          />
        </LiveStructView>
      )
    }
  },
  {
    id: 'world-maps',
    name: 'World Maps',
    icon: <MapIcon className="w-4 h-4" />,
    category: 'Visual Systems',
    title: 'Procedural Fog of War',
    description: 'Dynamic World Maps create "Vision" by drawing on a texture. Optimization: Use a Quadtree to "Cull" the map, so the game only thinks about the parts you can see. Pro Tip: Use a Distance Field or a low-res Bitset for the Fog of War to allow tens of thousands of dynamic units to reveal the map without killing the CPU.',
    problem: 'Beginner: Looking at every pixel on a 4,000-pixel map every frame is too slow. Pro: O(N^2) complexity in visibility checks causes a CPU bottleneck on the main Game Thread.',
    optimizedFoundation: 'Beginner: We divide the map into "Folders" (Quadtrees) and only open the ones near the player. Pro: Hierarchical Spatial Partitioning reduces lookup complexity to O(log N), keeping the Tick-rate steady.',
    pillars: ['Performance', 'Scalability'],
    initialState: {},
    optimizedCode: `
// Quadtree for Map Culling
class FMapQuadtree {
    struct FNode {
        FBox2D Bounds;
        TArray<FMapTile*> Tiles;
        FNode* Children[4];
    };
    
    void UpdateVision(FVector2D Pos, float Radius) {
        // Only update texture data in relevant quadtree nodes
        // Prevents O(N) lookup on every frame
    }
};`,
    lineByLineContent: [
      { code: "class FMapQuadtree {", explanation: "Data structure for spatial partitioning of map tiles." },
      { code: "    struct FNode {", explanation: "A single node in the tree, representing a rectangular region." },
      { code: "        FBox2D Bounds;", explanation: "The 2D area covered by this node." },
      { code: "        TArray<FMapTile*> Tiles;", explanation: "Tiles contained within this specific quad." },
      { code: "        FNode* Children[4];", explanation: "Four sub-quadrants for recursive division." },
      { code: "    };", explanation: "" },
      { code: "", explanation: "" },
      { code: "    void UpdateVision(FVector2D Pos, float Radius) {", explanation: "Efficiently marks tiles as visible using culling." },
      { code: "        // Only update relevant quadtree nodes", explanation: "Avoids iterating through thousands of off-screen tiles." },
      { code: "    }", explanation: "" },
      { code: "};", explanation: "" }
    ],
    playground: ({ onEvent }) => <WorldMapPlayground onEvent={onEvent} />,
    codeView: (state) => (
      <LiveStructView title="FWorldMapData">
        <HoverableLine code={<span className="text-green-300">"CurrentSector": 14,</span>} explanation="Current grid coordinate." />
        <HoverableLine code={<span className="text-green-300">"ExploredMask": 0xFFFF...</span>} explanation="Compressed exploration bitset." />
      </LiveStructView>
    )
  },
  {
    id: 'save-load',
    name: 'Save/Load Gen',
    icon: <Save className="w-4 h-4" />,
    category: 'Engine Subsystems',
    title: 'Advanced Persistence Architectures',
    description: 'Saving a game is like "Freezing" time. To do this efficiently, we convert game objects into a stream of raw bits. Optimization: Use a "Rolling Buffer" for autosave slots—if one save fails (crash), the others stay safe. Pro Tip: Use Delta-Saving (only save what changed) for massive open worlds to minimize disk I/O latency.',
    problem: 'Beginner: Saving in a format like JSON (readable text) makes files huge and slow to load. Pro: Text-based serialization causes massive heap allocations and string concatenation hitches during the save process.',
    optimizedFoundation: 'Beginner: We use "Binary Archives"—raw computer data that loads instantly. Pro: Using FArchive for binary serialization allows multi-megabyte snapshots to be deserialized in milliseconds without string overhead.',
    pillars: ['Performance', 'Memory'],
    initialState: {},
    optimizedCode: `
// Delta Serialization System
struct FSaveSnapshot {
    TMap<FName, FString> Values;
};

// Unified Persistence Subsystem
class USaveLoadSubsystem : public UGameInstanceSubsystem {
    const int32 MAX_AUTOSAVE_SLOTS = 3;
    
    // 1. Optimal Auto-Save Trigger
    void OnAnchorReached(FName AnchorID) {
        // Use a Rolling Buffer for autosaves to prevent data loss if crash during write
        int32 SlotIndex = CurrentAutosaveIndex % MAX_AUTOSAVE_SLOTS;
        SaveGameToSlot(FString::Printf(TEXT("AutoSave_%d"), SlotIndex));
        CurrentAutosaveIndex++;
    }

    // 2. Infinite Manual Slots (UUID/Timestamp based)
    void CreateManualSave(FString UserLabel) {
        FString UniqueID = FGuid::NewGuid().ToString();
        // Save metadata (Label, Level, Timestamp) to a central Index file
        // Save actual state to a separate binary blob
        SerializeStateToDisk(UniqueID); 
    }

    // 3. Serialization Rules (What to include)
    void Serialize(FArchive& Ar) {
        // [YES] Persistent stats & unlocks
        Ar << PlayerStats; 
        Ar << UnlockedNodes;
        
        // [NO] Do NOT save pointers to transient actors or ephemeral VFX state
        // [NO] Do NOT save current UI focus or sound playback positions
    }
};`,
    lineByLineContent: [
      { code: "class USaveLoadSubsystem", explanation: "Manages all disk I/O and state persistence logic." },
      { code: "    void OnAnchorReached(FName ID)", explanation: "Auto-save trigger point (End of level, Boss down)." },
      { code: "    {", explanation: "" },
      { code: "        int32 SlotIndex = Current % MAX;", explanation: "Cycles through a few slots to prevent save corruption." },
      { code: "        SaveGameToSlot(SlotID);", explanation: "Fires off the binary archiving process." },
      { code: "    }", explanation: "" },
      { code: "", explanation: "" },
      { code: "    void CreateManualSave(UserLabel)", explanation: "Allows player to create named checkpoints." },
      { code: "    {", explanation: "" },
      { code: "        FString UniqueID = FGuid::New().ToString();", explanation: "Generate unique filenames to allow infinite slots." },
      { code: "    }", explanation: "" },
      { code: "", explanation: "" },
      { code: "    void Serialize(FArchive& Ar)", explanation: "The actual packing logic for binary conversion." },
      { code: "    {", explanation: "" },
      { code: "        Ar << PlayerStats;", explanation: "Writes bits directly to the disk stream." },
      { code: "        // [NO] Ephemeral state", explanation: "Don't save things like current music or VFX." },
      { code: "    }", explanation: "" },
      { code: "};", explanation: "" }
    ],
    playground: ({ onEvent }) => (
      <div className="p-4 flex flex-col gap-2">
        <button onClick={() => onEvent('SaveSystem: USaveGame::CreateSaveGameObject')} className="p-2 bg-green-900/30 border border-green-500/50 rounded text-green-200 text-xs text-left flex justify-between items-center">
          <span>Snapshot State</span>
          <Save className="w-3 h-3" />
        </button>
        <button onClick={() => onEvent('SaveSystem: UGameplayStatics::LoadGameFromSlot')} className="p-2 bg-blue-900/30 border border-blue-500/50 rounded text-blue-200 text-xs text-left flex justify-between items-center">
          <span>Deserialized Slot 0</span>
          <Activity className="w-3 h-3" />
        </button>
      </div>
    ),
    codeView: () => (
      <LiveStructView title="FArchive (Memory Serializer)">
        <HoverableLine code={<span className="text-green-300">{"Ar << Health;"}</span>} explanation="Bitwise streaming of primitive types." />
        <HoverableLine code={<span className="text-green-300">{"Ar << Inventory;"}</span>} explanation="Iterative recursive serialization of arrays." />
      </LiveStructView>
    )
  },
  {
    id: 'data-streaming',
    name: 'Data Streaming',
    icon: <FastForward className="w-4 h-4" />,
    category: 'Optimization',
    title: 'Asynchronous Loading',
    description: 'Loading things in the background so the game never "Freezes." Optimization: Soft Object Pointers (TSoftObjectPtr) act as "IOUs"—the game knows where the asset is but doesn\'t load it until you get close. Pro Tip: Group your assets into "Streaming Bundles" to minimize the number of separate disk requests.',
    problem: 'Beginner: Loading every character at once makes your game take 5 minutes to start. Pro: Hard-referencing assets at the class level forces the engine to bloat the Resident Set Size (RSS) and causes startup stalls.',
    optimizedFoundation: 'Beginner: We only "Open the Box" (load the asset) when the player is nearby. Pro: Asynchronous Loader threads and TSoftObjectPtr allow for seamless memory management without blocking the Game Thread.',
    pillars: ['Memory', 'Performance'],
    initialState: {},
    optimizedCode: `
// Asynchronous Asset Management
class FAssetStreamingManager {
    // 1. Declare Soft Pointers to avoid memory bloat
    UPROPERTY(EditAnywhere)
    TSoftObjectPtr<UStaticMesh> MassiveStatueHandle;

    void RequestAsyncLoad() {
        // 2. Load in background thread (Non-blocking)
        StreamableManager.RequestAsyncLoad(Handle.ToSoftObjectPath(), 
            FStreamableDelegate::CreateUObject(this, &FAssetManager::OnLoadComplete));
    }

    void OnLoadComplete() {
        // 3. Resolve the pointer to usable memory
        UStaticMesh* LoadedMesh = MassiveStatueHandle.Get();
    }
};`,
    lineByLineContent: [
      { code: "TSoftObjectPtr<UStaticMesh> Handle;", explanation: "Defines an 'IOU' for an asset. It contains the path but doesn't load the binary data into RAM until requested." },
      { code: "RequestAsyncLoad(...);", explanation: "Initiates a background disk-to-memory transfer on a dedicated I/O thread." },
      { code: "FStreamableDelegate::CreateUObject()", explanation: "Registers a callback function that fires exactly when the asset is ready for use." },
      { code: "Handle.Get();", explanation: "Synchronously resolves the soft pointer. Safe because we know the load task is finished." }
    ],
    playground: ({ onEvent }) => {
      const [loading, setLoading] = useState(false);
      const startLoad = () => {
        setLoading(true);
        onEvent('AssetManager: Requesting Async Load for "DA_Elite_Boss"');
        setTimeout(() => {
          setLoading(false);
          onEvent('AssetManager: Async Load Finish - Object Ready');
        }, 2000);
      };
      return (
        <div className="p-4 flex flex-col items-center gap-4 w-full">
          <div className="text-[10px] text-gray-500 mb-1">PROXIMITY BASED STREAMING BUDGET</div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <motion.div 
              animate={loading ? { x: ['-100%', '100%'] } : { x: '-100%' }}
              transition={loading ? { duration: 1.5, repeat: Infinity } : {}}
              className="w-full h-full bg-blue-500"
            />
          </div>
          <button onClick={startLoad} disabled={loading} className="px-4 py-2 bg-blue-600 rounded text-xs font-bold disabled:opacity-50">
            {loading ? 'Streaming...' : 'Async Load Resource'}
          </button>
        </div>
      );
    },
    codeView: () => (
      <LiveStructView title="FStreamableHandle">
        <HoverableLine code={<span className="text-green-300">"bIsActive": true,</span>} explanation="Handle currently managing a load request." />
        <HoverableLine code={<span className="text-green-300">"Progress": 0.42</span>} explanation="0-1 float for asset preparation status." />
      </LiveStructView>
    )
  },
  {
    id: 'cutscenes',
    name: 'Fluid Cutscenes',
    icon: <Video className="w-4 h-4" />,
    category: 'Visual Systems',
    title: 'Sequencer Integration',
    description: 'Smoothly entering a cinematic. Optimization: Prerender your shadows and pre-cache your character models *before* the camera starts moving. Pro Tip: Use "Level Visibility Tracks" in Sequencer to swap low-poly gameplay models for high-fidelity cinematic versions during a camera wipe.',
    problem: 'Beginner: Cutscenes that "pop in" characters look unprofessional. Pro: Instant loading of heavy skeletal meshes during a sequence trigger causes a significant frame-time spike (Rendering Thread stall).',
    optimizedFoundation: 'Beginner: We prepare the "Actors" behind the curtain before the show starts. Pro: Using the Unreal Sequencer with pre-cached skeletal assets ensures seamless transitions without modifying base actor logic.',
    pillars: ['Scalability', 'Performance'],
    initialState: {},
    optimizedCode: `
// Cinematic Memory Pre-caching
class FCutsceneOptimizer {
    void PrecacheSkeletalMeshes(ULevelSequence* Sequence) {
        // Scans Sequencer tracks for high-fidelity assets
        for (FMovieSceneBinding& Binding : Sequence->GetMovieScene()->GetBindings()) {
            // Force-load hidden models 1 second before camera activation
            AsyncLoadAsset(Binding.GetReferencedAsset());
        }
    }
};`,
    lineByLineContent: [
      { code: "class FCutsceneOptimizer", explanation: "Helper system to manage memory spikes during cinematics." },
      { code: "PrecacheSkeletalMeshes()", explanation: "Analyzes the upcoming sequence to identify which high-poly models will be needed." },
      { code: "Sequence->GetBindings()", explanation: "Retrieves all actors and assets controlled by the cutscene." },
      { code: "AsyncLoadAsset()", explanation: "Ensures heavy cinematic models are in RAM before the cutscene starts to avoid 'pop-in'." }
    ],
    playground: ({ onEvent }) => (
      <div className="p-4 bg-black/50 border border-gray-700 rounded relative group overflow-hidden h-32 flex items-center justify-center">
        <div className="absolute top-2 left-2 flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[8px] text-gray-500 font-mono">REC</span>
        </div>
        <button onClick={() => onEvent('Sequencer: Jump to Frame 0 (Intro)')} className="p-2 hover:bg-white/10 rounded transition-colors">
          <Video className="w-8 h-8 text-white opacity-80 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    ),
    codeView: () => (
      <LiveStructView title="ULevelSequencePlayer">
        <HoverableLine code={<span className="text-green-300">"PlaybackStatus": "Playing",</span>} explanation="Current engine state (Playing, Paused, Stopped)." />
        <HoverableLine code={<span className="text-green-300">"Time": 4.5s</span>} explanation="Precise float for synchronizing sound/VFX." />
      </LiveStructView>
    )
  },
  {
    id: 'world-partition',
    name: 'World Partition',
    icon: <Layers className="w-4 h-4" />,
    category: 'Optimization',
    title: 'Grid-Based Streaming',
    description: 'Massive world technology. The game world is a grid; we only load the square you are in and the 8 around it. Optimization: Use HLODs (Hierarchical Level of Detail) to replace a forest of 1000 trees with a single "Fake" 3D mesh at a distance. Pro Tip: "Spatially Loaded" actors prevent NPCs in faraway cities from eating your CPU cycles.',
    problem: 'Beginner: Computers can\'t handle entire planets at once; they run out of memory. Pro: Maintaining thousands of "Tickable" actors across a 10km world causes an unmanageable Draw Call and CPU overhead.',
    optimizedFoundation: 'Beginner: We only "Build" the world where you can see it. Pro: World Partition uses a spatial grid to unload distant cells while HLODs maintain the visual horizon using combined mesh proxies.',
    pillars: ['Scalability', 'Memory'],
    initialState: {},
    optimizedCode: `
// Spatially Loaded World Layout
UCLASS()
class UWorldPartitionOptimizer : public UObject {
    // Defines the grid cell size (e.g., 2048 units)
    UPROPERTY(EditAnywhere)
    float GridSize = 2048.0f;

    void OnCellLoaded(FWorldPartitionCell& Cell) {
        // Hook for post-load logic (e.g., spawning dynamic persistence)
    }

    // HLOD generation logic
    void BuildHLODs() {
        // Merges 1000 meshes into 1 proxy at distance
    }
};`,
    lineByLineContent: [
      { code: "float GridSize = 2048.0f;", explanation: "Sets the size of each streamable 'chunk' in the world." },
      { code: "void OnCellLoaded()", explanation: "Runtime event triggered when a new world region enters memory." },
      { code: "void BuildHLODs()", explanation: "Optimization process that combines distant geometry into single, simple meshes." },
      { code: "Spatially Loaded Actors", explanation: "Configures which NPCs should 'hibernate' when the player moves far away." }
    ],
    playground: ({ onEvent }) => (
      <div className="grid grid-cols-3 gap-1 p-4">
        {[1,2,3,4,5,6,7,8,9].map(i => (
          <button 
            key={i} 
            onClick={() => onEvent(`WorldPartition: Loading Cell [${i%3}, ${Math.floor(i/3)}]`)}
            className="w-10 h-10 bg-slate-800 border border-gray-700 hover:bg-blue-900/50 hover:border-blue-500 transition-all rounded"
          />
        ))}
      </div>
    ),
    codeView: () => (
      <LiveStructView title="UWorldPartitionRuntimeHash">
        <HoverableLine code={<span className="text-green-300">"CellSize": 1024.0,</span>} explanation="Dimensions of a single grid cell." />
        <HoverableLine code={<span className="text-green-300">"ActiveCells": 9</span>} explanation="Count of cells currently occupying memory." />
      </LiveStructView>
    )
  },
  {
    id: 'multiplayer',
    name: 'Multiplayer Arch',
    icon: <Users className="w-4 h-4" />,
    category: 'Core Architecture',
    title: 'Client-Server Authority',
    description: 'The "Referee" of the match. The server is the only one who knows the "Truth." Optimization: "Replication Culling" means you don\'t receive data about players 10 miles away. Pro Tip: Use "SkipOwner" on predicted variables to prevent the server from wasting bandwidth sending you data you already changed locally.',
    problem: 'Beginner: Without a server "Referee," players can lie about their health. Pro: Replicating every movement variable every tick creates a network bottleneck (Bandwidth saturation) and jitter.',
    optimizedFoundation: 'Beginner: The Server makes the rules; the Clients just follow. Pro: Server-Authority with Property Replication and RPC validation ensures state integrity while minimizing per-packet overhead.',
    pillars: ['Networking', 'Scalability'],
    initialState: {},
    optimizedCode: `
// Replicated Property Pattern
void AMyCharacter::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const {
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);

    // Only replicate to other clients, NOT the owner (saves bandwidth if owner predicts)
    DOREPLIFETIME_CONDITION(AMyCharacter, Health, COND_SkipOwner);
}

// Validation-First Server RPC
UFUNCTION(Server, Reliable, WithValidation)
void Server_UpdateTarget(AActor* NewTarget);

bool AMyCharacter::Server_UpdateTarget_Validate(AActor* NewTarget) {
    if (!NewTarget) return true;
    // Server-side distance check to prevent "infinite range" cheats
    return FVector::Dist(GetActorLocation(), NewTarget->GetActorLocation()) < 1000.0f;
}`,
    lineByLineContent: [
      { code: "void GetLifetimeReplicatedProps()", explanation: "Entry point for setting up network synchronization rules." },
      { code: "DOREPLIFETIME_CONDITION(..., COND_SkipOwner);", explanation: "Critical Optimization: Don't send data back to the person who triggered it (they usually already have the predicted value)." },
      { code: "UFUNCTION(Server, Reliable, WithValidation)", explanation: "Standard for secure commands. 'WithValidation' is the foundation of anti-cheat." },
      { code: "bool Server_UpdateTarget_Validate()", explanation: "Force-check of client parameters on the server to ensure logical validity." }
    ],
    playground: ({ onEvent }) => (
      <div className="p-4 flex gap-4">
        <button onClick={() => onEvent('Net: ServerRPC_RequestJump()')} className="flex-1 py-1 px-2 bg-orange-950 border border-orange-500 rounded text-[10px] text-orange-200">Server RPC</button>
        <button onClick={() => onEvent('Net: Multicast_PlayFlash()')} className="flex-1 py-1 px-2 bg-blue-950 border border-blue-500 rounded text-[10px] text-blue-200">Multicast</button>
      </div>
    ),
    codeView: () => (
      <LiveStructView title="AActor::GetLifetimeReplicatedProps">
        <HoverableLine code={<span className="text-green-300">DOREPLIFETIME(AChar, Health);</span>} explanation="Marking variables for automatic network sync." />
        <HoverableLine code={<span className="text-green-300">REPLICATION_SUCCESS</span>} explanation="Condition reported by NetDriver." />
      </LiveStructView>
    )
  },
  {
    id: 'complex-ai',
    name: 'Complex AI',
    icon: <BrainCircuit className="w-4 h-4" />,
    category: 'Engine Subsystems',
    title: 'Behavior Trees & EQS',
    description: 'Complex AI needs to "Think" without slowing down the game. Optimization: Environment Query System (EQS) is a "Search Party" that finds the best spot to stand in. Pro Tip: Run your EQS queries on a Background Thread so the AI\'s "Thinking" doesn\'t cause your character\'s "Moving" to stutter.',
    problem: 'Beginner: Using "If/Then" for every AI choice makes them look stupid and slow. Pro: Constant "Physics Overlap" checks in the AI Tick loop cause massive CPU spikes when 100+ enemies are active.',
    optimizedFoundation: 'Beginner: We use a "Tree of Decisions" (Behavior Trees) that only acts when things change. Pro: Event-driven Behavior Trees combined with Async EQS queries offload heavy spatial reasoning from the main Game Thread.',
    pillars: ['Performance', 'Scalability'],
    initialState: {},
    optimizedCode: `
// Complex AI Decision Logic
class UMyAIController : public AAIController {
    // Run EQS asynchronously
    void RunAsyncEQS() {
        FEnvQueryRequest QueryRequest(FindEnemyQuery, GetPawn());
        QueryRequest.Execute(EEnvQueryRunMode::SingleResult, 
            this, &UMyAIController::OnQueryFinished);
    }

    void OnQueryFinished(TSharedPtr<FEnvQueryResult> Result) {
        // Handle result on main thread safely
    }
};`,
    lineByLineContent: [
      { code: "class UMyAIController : public AAIController {", explanation: "Custom AI brain extending the base Unreal AI Controller." },
      { code: "    void RunAsyncEQS() {", explanation: "Initiates an Environment Query System (EQS) search." },
      { code: "        FEnvQueryRequest QueryRequest(FindEnemyQuery, GetPawn());", explanation: "Packages the query criteria and the searcher (the Pawn)." },
      { code: "        QueryRequest.Execute(EEnvQueryRunMode::SingleResult, ", explanation: "Tells the system to run in the background and return one best spot." },
      { code: "            this, &UMyAIController::OnQueryFinished);", explanation: "Registers a callback to be called when the task finishes." },
      { code: "    }", explanation: "" },
      { code: "", explanation: "" },
      { code: "    void OnQueryFinished(TSharedPtr<FEnvQueryResult> Result) {", explanation: "The callback where we receive the computed navigation point." },
      { code: "        // Handle result on main thread safely", explanation: "Update the Behavior Tree blackboard with the new target." },
      { code: "    }", explanation: "" },
      { code: "};", explanation: "" }
    ],
    playground: ({ onEvent }) => (
      <div className="p-4 flex flex-col items-center">
        <div className="flex gap-2 mb-4">
          <div className="w-px h-10 bg-gray-700"></div>
          <div className="flex flex-col gap-2">
            <div className="px-2 py-1 bg-yellow-900 border border-yellow-500 rounded text-[8px] text-yellow-200">Selector</div>
            <div className="flex gap-2">
              <button onClick={() => onEvent('AI: Task_Attack Executed')} className="px-2 py-1 bg-red-900 border border-red-500 rounded text-[8px] text-red-200">Attack</button>
              <button onClick={() => onEvent('AI: Task_Patrol Executed')} className="px-2 py-1 bg-gray-700 border border-gray-500 rounded text-[8px] text-gray-200">Patrol</button>
            </div>
          </div>
        </div>
      </div>
    ),
    codeView: () => (
      <LiveStructView title="UBehaviorTree">
        <HoverableLine code={<span className="text-green-300">"Blackboard": "BB_Orc",</span>} explanation="The memory used by the AI brain." />
        <HoverableLine code={<span className="text-green-300">"ActiveTask": "FindCover"</span>} explanation="Current leaf node in execution." />
      </LiveStructView>
    )
  },
  {
    id: 'gameplay-abilities',
    name: 'Gameplay Abilities',
    icon: <Zap className="w-4 h-4" />,
    category: 'Engine Subsystems',
    title: 'Gameplay Ability System (GAS)',
    description: 'The "Heart" of combat logic. A unified system for HP, Mana, and Skills. Optimization: Gameplay Tags ("State.Frozen", "Status.Invulnerable") are faster than strings or enums for checking character states. Pro Tip: Use "Predictive Attributes" to show health numbers changing instantly on the client while waiting for the server to confirm.',
    problem: 'Beginner: Writing custom code for every single spell leads to "Spaghetti Code" that breaks constantly. Pro: Managing attribute modifiers across multiple systems creates dependency hell and race conditions during stat calculation.',
    optimizedFoundation: 'Beginner: A single "Rulebook" (GAS) handles all skills and stats in one place. Pro: A consolidated AttributeSet and GameplayTag system provides a scalable, network-ready framework for complex status interactions.',
    pillars: ['Scalability', 'Networking'],
    initialState: {},
    optimizedCode: `
// Data-Driven Attribute Management
UCLASS()
class UMyAttributeSet : public UAttributeSet {
    UPROPERTY(BlueprintReadOnly, ReplicatedUsing = OnRep_Health)
    FGameplayAttributeData Health;

    // Attribute modification logic
    virtual void PreAttributeChange(const FGameplayAttribute& Attribute, float& NewValue) override {
        if (Attribute == GetHealthAttribute()) {
            // Clamp value foundation: prevent HP from exceeding MaxHP or dropping below 0
            NewValue = FMath::Clamp(NewValue, 0.0f, MaxHealth.GetCurrentValue());
        }
    }
};`,
    lineByLineContent: [
      { code: "class UMyAttributeSet", explanation: "The centralized hub for all mutable stats (HP, Mana, STR)." },
      { code: "FGameplayAttributeData Health;", explanation: "A complex struct that tracks 'Base' vs 'Current' values, allowing temporary buffs to be calculated cleanly." },
      { code: "void PreAttributeChange()", explanation: "The perfect hook for 'Hard Clamping' stats before they reach other systems." },
      { code: "NewValue = FMath::Clamp(...)", explanation: "Enforcing absolute game rules at the lowest level of the engine." }
    ],
    playground: ({ onEvent }) => (
      <div className="p-4 grid grid-cols-2 gap-2">
        <button onClick={() => onEvent('GAS: ActivateAbility(Fireball)')} className="aspect-square bg-orange-600 rounded flex items-center justify-center hover:opacity-80"><Zap className="w-6 h-6 text-white" /></button>
        <button onClick={() => onEvent('GAS: ApplyEffect(Slow)')} className="aspect-square bg-blue-600 rounded flex items-center justify-center hover:opacity-80"><Activity className="w-6 h-6 text-white" /></button>
      </div>
    ),
    codeView: () => (
      <LiveStructView title="UAbilitySystemComponent">
        <HoverableLine code={<span className="text-green-300">"Tags": ["State.Frozen"],</span>} explanation="Current gameplay tags affecting logic." />
        <HoverableLine code={<span className="text-green-300">"ModifiedAttr": "Strength"</span>} explanation="Attribute adjusted by active effects." />
      </LiveStructView>
    )
  },
  {
    id: 'event-bus',
    name: 'Event Bus',
    icon: <Radio className="w-4 h-4" />,
    category: 'Engine Subsystems',
    title: 'Global Messaging System',
    description: 'A "Loudspeaker" for your game systems. When a player levels up, the Level System "Broadcasts" it, and the UI System "Listens" for it. Optimization: Decoupling—the UI doesn\'t need to know the Player even exists to show a level-up alert. Pro Tip: Use a "Priority Queue" in your bus to ensure critical messages (Death) reach systems before secondary ones (EXP Gain).',
    problem: 'Beginner: Connecting every UI button directly to your player code makes your project impossible to clean up. Pro: Hard-references between unrelated systems create massive "Load Chains" that bloat memory and increase compile times.',
    optimizedFoundation: 'Beginner: We use a Global Radio that any system can tune into. Pro: An Event-Driven messaging architecture removes cyclic dependencies and allows for isolated system testing and modular expansion.',
    pillars: ['Scalability', 'Performance'],
    initialState: {},
    optimizedCode: `
// Global Messaging Architecture
DECLARE_MULTICAST_DELEGATE_OneParam(FOnLevelUp, int32 /* NewLevel */);

class UGameEventBus : public UGameInstanceSubsystem {
public:
    // Global broadcasting delegate
    FOnLevelUp OnLevelUp;

    void BroadcastLevelUp(int32 NewLevel) {
        // UI, Audio, and Rewards systems all listen to this one call
        OnLevelUp.Broadcast(NewLevel);
    }
};`,
    lineByLineContent: [
      { code: "DECLARE_MULTICAST_DELEGATE", explanation: "Defines a signal that multiple systems can listen to simultaneously." },
      { code: "class UGameEventBus", explanation: "A specialized subsystem that acts as a global post office." },
      { code: "OnLevelUp.Broadcast()", explanation: "Sends the signal. No caller needs to know WHO is listening, only that the event happened." },
      { code: "Subsystem Pattern", explanation: "Ensures the event bus persists across level changes and is accessible project-wide." }
    ],
    playground: ({ onEvent }) => <EventBusPlayground onEvent={onEvent} />,
    codeView: () => (
      <LiveStructView title="FEventBus">
        <HoverableLine code={<span className="text-green-300">"ListenersCount": 24,</span>} explanation="Systems currently monitoring the bus." />
        <HoverableLine code={<span className="text-green-300">"Priority": 1</span>} explanation="Importance level of the last broadcast." />
      </LiveStructView>
    )
  },
  {
    id: 'quest-systems',
    name: 'Quest Systems',
    icon: <Scroll className="w-4 h-4" />,
    category: 'Core Architecture',
    title: 'Stateful Objectives',
    description: 'Tracking what you need to do next. Optimization: Quest states are stored as a single number (Bitmask). If bit #5 is "1", the quest is done. Pro Tip: Use "Quest Graph Caching" to avoid searching the entire level for the "Quest Giver" NPC every time the quest updates.',
    problem: 'Beginner: Searching a list of 100 quests every time a player talks to an NPC makes the game hitch. Pro: Storing full quest objects in a replicated array wastes network bandwidth and creates O(N) lookup overhead.',
    optimizedFoundation: 'Beginner: We compress quest progress into tiny "Switches" that are instant to check. Pro: Staging quest progress in bitmasks inside the PlayerState ensures O(1) retrieval and minimal network replication latency.',
    pillars: ['Performance', 'Memory'],
    initialState: {},
    optimizedCode: `
// Optimized Quest Progress Tracking
USTRUCT()
struct FQuestProgress {
    GENERATED_BODY()

    // 1. Bitmask for completed objectives
    UPROPERTY()
    uint32 ObjectiveBitmask;

    // 2. Efficient enum status
    UPROPERTY()
    EQuestStatus Status;

    bool IsObjectiveDone(int32 Index) const {
        return (ObjectiveBitmask & (1 << Index)) != 0;
    }
};`,
    lineByLineContent: [
      { code: "struct FQuestProgress", explanation: "The lean status of a single quest in the player's journal." },
      { code: "uint32 ObjectiveBitmask;", explanation: "Packs 32 separate yes/no goals into a single integer." },
      { code: "EQuestStatus Status;", explanation: "Simple enum (NotStarted, InProgress, Failed, Completed)." },
      { code: "ObjectiveBitmask & (1 << Index)", explanation: "O(1) logical AND check to see if a specific task is finished." }
    ],
    playground: ({ onEvent }) => (
      <div className="p-4 space-y-2">
        <div className="p-2 border border-gray-700 rounded bg-slate-900/50 flex justify-between items-center">
          <span className="text-[10px] text-gray-300 italic">Slay 10 Wolves</span>
          <button onClick={() => onEvent('Quest: Objective "Wolves" 1/10')} className="px-2 py-0.5 bg-blue-900 text-[8px] rounded">+1</button>
        </div>
        <div className="p-2 border border-gray-700 rounded bg-slate-900/50 flex justify-between items-center opacity-50">
          <span className="text-[10px] text-gray-300 italic">Report to Mayor</span>
          <Lock className="w-2.5 h-2.5" />
        </div>
      </div>
    ),
    codeView: () => (
      <LiveStructView title="FQuestState">
        <HoverableLine code={<span className="text-green-300">"Status": "InProgress",</span>} explanation="Enum tracking current quest phase." />
        <HoverableLine code={<span className="text-green-300">"VisibleInJournal": true</span>} explanation="UI visibility flag for the player." />
      </LiveStructView>
    )
  },
  {
    id: 'performance',
    name: 'Performance Scaling',
    icon: <BarChart3 className="w-4 h-4" />,
    category: 'Optimization',
    title: 'Dynamic Resolution & Culling',
    description: 'Making the game run fast on everyone\'s computer. Optimization: Dynamic Resolution Scaling (DSR) lowers the picture quality *just enough* during explosions so the game stays smooth. Pro Tip: Use GPU Culling to "Delete" triangles that are behind walls before the computer even tries to draw them.',
    problem: 'Beginner: Your game works for you but crashes for someone with a slower computer. Pro: Uncapped triangle counts and heavy pixel shaders lead to GPU stalls and uncontrolled frame-time variance.',
    optimizedFoundation: 'Beginner: We have a "Budget" of time; if we use too much, we automatically lower the graphics. Pro: A Global Performance Budgeter scales engine parameters (LOD, Resolution, Tick-rates) to maintain a rock-solid 60 FPS foundation.',
    pillars: ['Performance', 'Scalability'],
    initialState: {},
    optimizedCode: `
// GPU Culling & Frame Budgeting
class FPerformanceManager {
    void TickBudget(float DeltaTime) {
        float CurrentFPS = 1.0f / DeltaTime;
        if (CurrentFPS < TargetFPS) {
            // 1. Lower Resolution (DSR)
            SetResolutionScale(0.85f);
            // 2. Cull distant shadow casters
            CullShadowCascades(2);
            // 3. Force lower animation LODs
            GAnimBudgetSubsystem->SetUrgency(High);
        }
    }
};`,
    lineByLineContent: [
      { code: "class FPerformanceManager", explanation: "Global observer that monitors frame-time and health." },
      { code: "    void TickBudget(float DeltaTime)", explanation: "Calculates current millisecond usage per frame." },
      { code: "    {", explanation: "" },
      { code: "        if (CurrentFPS < TargetFPS)", explanation: "Trigger for emergency optimization strategies." },
      { code: "        {", explanation: "" },
      { code: "            SetResolutionScale(0.85f);", explanation: "Dynamic Resolution: reduces GPU pixel pressure instantly." },
      { code: "            CullShadowCascades(2);", explanation: "Aggressive Shadow Culling to save Draw Calls." },
      { code: "        }", explanation: "" },
      { code: "    }", explanation: "" },
      { code: "};", explanation: "" }
    ],
    playground: ({ onEvent }) => <PerformancePlayground onEvent={onEvent} />,
    codeView: () => (
      <LiveStructView title="FPerformanceBudget">
        <HoverableLine code={<span className="text-green-300">"TargetFPS": 60,</span>} explanation="Target frame time (16.6ms)." />
        <HoverableLine code={<span className="text-green-300">"MemoryUsed": 842MB</span>} explanation="Current process memory consumption." />
      </LiveStructView>
    )
  },
  {
    id: 'ui-serialization',
    name: 'UI & Custom Serialization',
    icon: <Layout className="w-4 h-4" />,
    category: 'Core Architecture',
    title: 'UMG Reflection Arch',
    description: 'Connecting the "Engine Brain" to the "Menu Screen." Optimization: Use ViewModels—the UI only updates when the actual HP number changes. Pro Tip: Use "FProperty Reflection" to batch-update UI fields instead of manually writing "UpdateHP()" functions for every single bar.',
    problem: 'Beginner: Checking the UI every frame ("Tick Bindings") kills performance. Pro: UMG bindings that execute every frame cause significant rendering overhead and prevent the UI from being cached.',
    optimizedFoundation: 'Beginner: We tell the UI "Hey, the HP changed!" instead of the UI asking "Is the HP changed yet?" Pro: The ViewModel pattern ensures that only dirty properties are synchronized, minimizing the communication cost between C++ and UI.',
    pillars: ['Performance', 'Scalability'],
    initialState: {},
    optimizedCode: `
// ViewModel & Property Reflection
UCLASS()
class UCharacterViewModel : public UMVVMViewModelBase {
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly, FieldNotify)
    float CurrentHealth;

    void SetHealth(float NewHealth) {
        // Only notifies UI if the value actually changed
        UE_MVVM_SET_PROPERTY_VALUE(CurrentHealth, NewHealth);
    }
};`,
    lineByLineContent: [
      { code: "class UCharacterViewModel", explanation: "An intermediate 'Presenter' that isolates UI from character logic." },
      { code: "FieldNotify", explanation: "Macro that informs the reflection system this property is observable by UI." },
      { code: "UE_MVVM_SET_PROPERTY_VALUE", explanation: "Optimized setter that performs a comparison check before triggering a UI redrawing." },
      { code: "Reduces Tick Overhead", explanation: "Eliminates the need for 'Tick' or 'Timer' based UI updates entirely." }
    ],
    playground: ({ onEvent }) => (
      <div className="p-4 flex flex-col gap-2">
        <div className="w-full h-8 bg-slate-800 border border-gray-700 rounded-lg flex items-center px-3 gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <div className="h-1 bg-gray-600 flex-1 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-blue-500" />
          </div>
        </div>
        <button onClick={() => onEvent('UI: Serialize Layout Settings -> SlotA')} className="text-[10px] text-blue-400 hover:underline">Flush Widget State to Disk</button>
      </div>
    ),
    codeView: () => (
      <LiveStructView title="UWidgetViewModel">
        <HoverableLine code={<span className="text-green-300">"BindableProperty": "CurHP",</span>} explanation="Property tracked by the UI reflection layer." />
        <HoverableLine code={<span className="text-green-300">"UpdateFreq": "EveryFrame"</span>} explanation="Tick handling policy for this widget." />
      </LiveStructView>
    )
  },
  {
    id: 'physics',
    name: 'Physics & Collision',
    icon: <Activity className="w-4 h-4" />,
    category: 'Engine Subsystems',
    title: 'Trace vs. Projectile Overlap',
    description: 'How things "Hit" each other. Optimization: Line Traces (Hitscan) are instant and cheap. Use them for fast bullets. Pro Tip: For slow spells, use "Sub-Stepping" to check for collisions many times per frame so the spell doesn\'t "Phase Through" a wall.',
    problem: 'Beginner: Fast bullets sometimes fly right through walls without hitting them. Pro: At high velocities (> 5000 units/s), a projectile can move past a thin collision volume between frames, missing the hit entirely.',
    optimizedFoundation: 'Beginner: We use "Invisible Lasers" (Traces) for fast things and "Checked Steps" for slow things. Pro: Leveraging Hitscan traces for high-speed interactions avoids physics-engine overhead while Sub-Stepping ensures sweep-integrity for projectiles.',
    pillars: ['Performance', 'Scalability'],
    initialState: { active: false },
    optimizedCode: `
// High-Speed Collision Detection
void AWeapon::FireHitscan() {
    FHitResult Hit;
    FVector Start = GetActorLocation();
    FVector End = Start + (GetActorForwardVector() * 10000.0f);

    // 1. Instant mathematical laser (O(1) complexity)
    if (GetWorld()->LineTraceSingleByChannel(Hit, Start, End, ECC_Visibility)) {
        // Handle impact
    }
}

// 2. Continuous Collision Detection (CCD)
// Enabled in Bullet Body settings to prevent 'tunneling'
Projectile->BodyInstance.bUseCCD = true;`,
    lineByLineContent: [
      { code: "GetWorld()->LineTraceSingleByChannel()", explanation: "Simulates an light-speed line that stops at the first thing it touches." },
      { code: "FHitResult Hit;", explanation: "Data container populated with impact location, normal, and the actor grazed." },
      { code: "ECC_Visibility", explanation: "The 'Channel' to check against (e.g., skip ghosts, hit walls)." },
      { code: "bUseCCD = true;", explanation: "Continuous Collision Detection: performs 'sweep' checks to stop fast objects from phasing through walls." }
    ],
    playground: ({ onEvent }) => {
      const [type, setType] = useState<'Trace' | 'Overlap'>('Trace');
      return (
        <div className="p-4 flex flex-col gap-4">
          <div className="flex gap-2">
            <button onClick={() => setType('Trace')} className={`flex-1 py-2 rounded text-xs font-bold border ${type === 'Trace' ? 'bg-red-900/40 border-red-500 text-red-200' : 'bg-slate-800 border-gray-700 text-gray-500'}`}>Line Trace</button>
            <button onClick={() => setType('Overlap')} className={`flex-1 py-2 rounded text-xs font-bold border ${type === 'Overlap' ? 'bg-blue-900/40 border-blue-500 text-blue-200' : 'bg-slate-800 border-gray-700 text-gray-500'}`}>Overlap (PhysX)</button>
          </div>
          <div className="h-32 bg-black/40 rounded border border-gray-800 relative flex items-center justify-center overflow-hidden">
             <div className="w-8 h-8 rounded-full bg-slate-700 border border-gray-500 z-10"></div>
             {type === 'Trace' ? (
               <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 1 }} className="absolute left-0 h-px bg-red-500 shadow-[0_0_8px_red]"></motion.div>
             ) : (
               <motion.div initial={{ x: -100 }} animate={{ x: 200 }} transition={{ duration: 1, repeat: Infinity }} className="absolute w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_8px_blue]"></motion.div>
             )}
          </div>
          <button 
            onClick={() => onEvent(type === 'Trace' ? 'FHitResult generated via LineTraceSingleByChannel' : 'OnComponentBeginOverlap triggered')}
            className="w-full py-2 bg-slate-800 rounded text-xs text-gray-400 hover:text-white"
          >
            Simulate Attack
          </button>
        </div>
      )
    },
    codeView: (state) => (
      <LiveStructView title="FHitResult (Physics Feedback)">
        <HoverableLine code={<span className="text-green-300">"bBlockingHit": true,</span>} explanation="Did we hit something solid?" />
        <HoverableLine code={<span className="text-green-300">"Actor": 0x7FFA12 (BP_Orc_C),</span>} explanation="Pointer to the actual object hit in world space." />
        <HoverableLine code={<span className="text-green-300">"ImpactNormal": (0, 0, 1)</span>} explanation="Direction of the surface we hit for logic like ricochets." />
      </LiveStructView>
    )
  },
  {
    id: 'animation',
    name: 'Animation Logic',
    icon: <Ghost className="w-4 h-4" />,
    category: 'Visual Systems',
    title: 'AnimBlueprints & Thread-Safety',
    description: 'Visuals should be separate from Logic. Animation math happens on "Worker Threads" so the game stays smooth. Optimization: Use Animation Budgeting to make distant characters move at 15 FPS while close ones move at 60 FPS. Pro Tip: Use "Thread-Safe Property Access" to avoid the AnimBlueprint locking the Main Thread while it calculates your character\'s walk speed.',
    problem: 'Beginner: Too many moving characters make the game laggy. Pro: Accessing character actor data directly in the Animation update creates a multi-threaded "Race Condition" and locks the Game Thread.',
    optimizedFoundation: 'Beginner: We "Draft" the animation math on a different part of the brain (Worker Threads). Pro: The Thread-Safe Proxy pattern allows the GPU to receive skeletal transforms without ever waiting for the main Game logic to finish its Tick.',
    pillars: ['Performance', 'Scalability'],
    initialState: { walking: true },
    optimizedCode: `
// Thread-Safe Animation Logic
USTRUCT()
struct FAnimProxy : public FAnimInstanceProxy {
    // 1. Copy data from Actor to Proxy in "Safe" zone
    virtual void Update(...) override {
        bIsMoving = Character->GetVelocity().Size() > 0;
    }

    // 2. AnimGraph reads only from this Proxy (Background Thread)
    bool bIsMoving;
};`,
    lineByLineContent: [
      { code: "struct FAnimProxy", explanation: "A lean copy of animation variables that lives on the Animation Thread." },
      { code: "void Update()", explanation: "The 'Safe' bridge where data is copied from the Game Thread to the Anim Thread once per tick." },
      { code: "bIsMoving = ...", explanation: "Calculated only once, preventing recursive calls inside the complex AnimGraph." },
      { code: "Thread-Safe Access", explanation: "Ensures the UI doesn't hitch even if the animation system is under heavy load." }
    ],
    playground: ({ onEvent }) => {
      const [action, setAction] = useState('Idle');
      return (
        <div className="p-4 flex flex-col gap-4 items-center">
          <div className="flex gap-2 w-full">
            <button onClick={() => { setAction('Attack'); onEvent('Montage_Play: Slot_Melee_Attack'); }} className="flex-1 py-1 px-2 bg-orange-900 border border-orange-500 text-orange-200 text-[10px] rounded">Attack</button>
            <button onClick={() => { setAction('Hurt'); onEvent('ABP_Main: SetState(Hurt)'); }} className="flex-1 py-1 px-2 bg-red-900 border border-red-500 text-red-200 text-[10px] rounded">React</button>
          </div>
          <div className="relative w-24 h-24 border border-gray-700 bg-slate-900 flex items-center justify-center rounded-lg overflow-hidden">
             <motion.div animate={action === 'Attack' ? { scale: [1, 1.5, 1], rotate: [0, 45, 0] } : action === 'Hurt' ? { x: [-5, 5, -5, 5, 0] } : { y: [0, -5, 0] }} transition={{ duration: action === 'Idle' ? 2 : 0.4, repeat: action === 'Idle' ? Infinity : 0 }} className="w-8 h-12 bg-indigo-500 rounded-lg flex flex-col items-center p-1">
               <div className="w-4 h-4 bg-indigo-200 rounded-full mb-1"></div>
               <div className="w-full h-1 bg-indigo-400 rounded"></div>
             </motion.div>
             <div className="absolute bottom-1 text-[8px] text-gray-500 uppercase font-bold tracking-widest">{action}</div>
          </div>
        </div>
      )
    },
    codeView: (state) => (
      <LiveStructView title="UAnimInstance Property View">
        <HoverableLine code={<span className="text-green-300">"bIsMoving": true,</span>} explanation="Calculated on worker thread to avoid UI hitching." />
        <HoverableLine code={<span className="text-green-300">"GroundedWeight": 1.0</span>} explanation="Blending factor for feet placement IK logic." />
      </LiveStructView>
    )
  },
];

