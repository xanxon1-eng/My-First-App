const fs = require('fs');

const path = './src/Source/TrainingCore/core/Curriculum.ts';
let code = fs.readFileSync(path, 'utf8');

// The file ends with:
//   },
// ];
// 

const insertionIndex = code.lastIndexOf('];');

if (insertionIndex === -1) {
  console.error("Could not find the end of the array.");
  process.exit(1);
}

const newTasks = `
  // =========================================================================
  // STAGE 13 — THE OPTIMIZATION GUIDE: AAA AAA MASTERCLASS
  // =========================================================================

  {
    id: 'task_opt_1',
    title: '48. Cache Coherent Memory & Data-Oriented Design',
    category: 'Stage 13: AAA Optimization (CPU/RAM)',
    objective: \`# Cache Coherent Memory Architecture

Deep dive into L1, L2, and L3 cache-coherent memory layouts for open-world RPG systems like The Witcher 3 or Baldur's Gate 3. 
RAM fetch latency is ~100ns. If 10,000 active items are scattered randomly across the heap (as AActors usually are), the CPU spends 95% of its time stalled waiting for RAM, causing massive frame-rate drops.

By designing contiguous memory layouts using custom struct packing (Data-Oriented Design), we transform memory access overhead from 8.2ms down to under 1.4ms!

### Hardware Impact (Concrete Metrics)
- **CPU:** Reduces Game Thread memory fetch stalls. Tick execution drops from 12.0ms to 4.5ms by eliminating L2 Cache-misses.
- **GPU:** Indirect. Faster CPU draw call assembly avoids GPU starvation.
- **RAM:** Saves up to 12% System RAM by eliminating struct padding overhead.
- **VRAM:** 0.0ms impact.
- **Latency / Ping:** Stabilizes frame latency variance to within 0.2ms, assuring a smooth 0.0ms tick delay.

### What Unreal Engine Has / Needs
✅ **Has:** \`TArray\` and \`FMemory::Malloc\` allocate contiguous blocks. \`TInlineAllocator\` keeps stack records in-cache.
❌ **Missing:** Automated pointer sorting inside nested UCLASS arrays; automatic cache-miss profilers built into the compiler (requires Intel VTune).

### How to use
Order member variables in USTRUCTs from largest (64-bit pointers) to smallest (bools) to eliminate struct padding. 

## Your Task
Declare a struct \`FRPGItemData\`. To optimize cache alignment (preventing padding waste), place the 64-bit \`double\` or pointer FIRST, then \`int32\`, then \`bool\`.
1. Declare \`double Weight;\`
2. Declare \`int32 Value;\`
3. Declare \`bool bIsQuestItem;\`\`,
    starterCode: {
      'Source.h': \`#pragma once
#include "CoreMinimal.h"

USTRUCT()
struct FRPGItemData
{
    GENERATED_BODY()

    // TODO: Order these members strictly from largest data type to smallest data type!
    // double Weight;
    // int32 Value;
    // bool bIsQuestItem;
};
\`,
    },
    hiddenTests: ['FRPGItemData', 'double', 'int32', 'bool'],
    successCriteria: [
      'Declare double Weight first (8 bytes)',
      'Declare int32 Value second (4 bytes)',
      'Declare bool bIsQuestItem third (1 byte)',
    ],
    rules: [
      {
        id: 'r_opt1_order',
        type: 'unreal',
        description: 'Variables declared in correct sizing order',
        evaluate: (code) => {
          const stripped = code.replace(/\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\//g, "").replace(/\\s+/g, "");
          const weightIdx = stripped.indexOf('doubleWeight;');
          const valueIdx = stripped.indexOf('int32Value;');
          const boolIdx = stripped.indexOf('boolbIsQuestItem;');
          
          if (weightIdx === -1 || valueIdx === -1 || boolIdx === -1) {
             return { passed: false, error: 'All three variables must be declared.', fix: 'Add variables.' };
          }
          if (weightIdx < valueIdx && valueIdx < boolIdx) {
             return { passed: true, error: '', fix: '' };
          }
          return {
            passed: false,
            error: 'For perfect CPU cache packing, order must be: double (8 bytes) -> int32 (4 bytes) -> bool (1 byte).',
            fix: 'Move double Weight to the top.'
          };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_opt1',
        title: 'Optimized Struct Padding',
        code: {
          'Source.h': \`USTRUCT()
struct FRPGItemData
{
    GENERATED_BODY()

    double Weight;      // 8 bytes
    int32 Value;        // 4 bytes
    bool bIsQuestItem;  // 1 byte
};
\`,
        },
        explanation: 'By ordering large to small, the compiler does not insert invisible padding bytes to align the memory, reducing the struct footprint and saving CPU RAM fetches (cache misses).',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_opt_2',
    title: '49. Multithreading & Async Tasks',
    category: 'Stage 13: AAA Optimization (CPU/RAM)',
    objective: \`# Multithreading / Async Background Tasks

Moving heavy data operations (procedural generation, save file compression, Path of Exile style pathfinding) off the Main Game Thread. Doing heavy synchronous operations on the Game Thread causes massive drops in FPS locking the client.

### Hardware Impact (Concrete Metrics)
- **CPU:** Distributes thread load to background worker processors. Reduces Game Thread freezes by -250ms when writing massive BG3-style saves.
- **GPU:** Prevents GPU stalling. If the CPU takes 250ms, the GPU drops to 0% utilization waiting for draw commands.
- **RAM:** Requires ~+15MB buffer memory to manage concurrent thread task queues.
- **VRAM:** 0.0ms.
- **Latency / Ping:** Eliminates frame delays and network packet drops caused by Main Thread stalls completely (0ms disruption).

### What Unreal Engine Has / Needs
✅ **Has:** \`AsyncTask\` and \`GraphTask\` APIs to queue short-lived logic to safe background thread pools.
❌ **Missing:** Thread-safe UObject manipulation. Garbage collection and UProperties are STRICTLY limited to the Game Thread. Mutex lock debuggers.

### How to use
Wrap operations in \`AsyncTask(ENamedThreads::AnyBackgroundThreadSafeTask, []() { ... });\`.

## Your Task
Write a background task using \`AsyncTask\` targeting \`ENamedThreads::AnyBackgroundThreadSafeTask\`. 
Inside its lambda, simply assign \`true\` to a boolean named \`bIsDone\` (in reality, you'd do heavy math here).
\`,
    starterCode: {
      'Source.cpp': \`#include "Async/Async.h"

void ProcessHeavyInventoryLogic(bool& bIsDone)
{
    // TODO: Dispatch an AsyncTask to ENamedThreads::AnyBackgroundThreadSafeTask
    // Inside the lambda, set bIsDone = true;
}
\`,
    },
    hiddenTests: ['AsyncTask', 'ENamedThreads::AnyBackgroundThreadSafeTask', 'bIsDone'],
    successCriteria: [
      'Call AsyncTask',
      'Use ENamedThreads::AnyBackgroundThreadSafeTask',
      'Set bIsDone inside the lambda',
    ],
    rules: [
      {
        id: 'r_opt2_async',
        type: 'unreal',
        description: 'AsyncTask syntax validation',
        evaluate: (code) => {
          const stripped = code.replace(/\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\//g, "").replace(/\\s+/g, "");
          return {
            passed: stripped.includes('AsyncTask(ENamedThreads::AnyBackgroundThreadSafeTask'),
            error: 'Must call AsyncTask targeting AnyBackgroundThreadSafeTask.',
            fix: 'AsyncTask(ENamedThreads::AnyBackgroundThreadSafeTask, [&bIsDone]() { bIsDone = true; });'
          };
        }
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_opt2',
        title: 'Background Thread Dispatch',
        code: {
          'Source.cpp': \`void ProcessHeavyInventoryLogic(bool& bIsDone)
{
    AsyncTask(ENamedThreads::AnyBackgroundThreadSafeTask, [&bIsDone]()
    {
        // Heavy work here, unblocks the Game Thread!
        bIsDone = true; 
    });
}
\`,
        },
        explanation: 'We capture the variable by reference and execute it off the Game Thread, preventing the game from freezing during intense logic.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_opt_3',
    title: '50. MassEntity / ECS in Unreal',
    category: 'Stage 14: Algorithms & Simulation',
    objective: \`# MassEntity & Data-Oriented Design

Standard \`AActor\` ticks cost massive CPU overhead due to virtual functions and physical transform hierarchies. 
Using Unreal's modern **MassEntity** (Entity Component System), we pack entity logic strictly into structs (Fragments) simulating thousands of agents extremely fast (like Path of Exile swarms).

### Hardware Impact (Concrete Metrics)
- **CPU:** Speeds up crowd evaluation by 4.4ms CPU. Ticking 10,000 entities drops from 15.0ms down to 1.8ms!
- **GPU:** +0.5ms GPU cost to draw thousands of proxy Instance Static Meshes simultaneously.
- **RAM:** Saves ~450MB of RAM. Compacts 10,000 entities into just 12MB. 
- **VRAM:** +40MB VRAM to manage Instance Static Mesh transform tables.
- **Latency / Ping:** Massive CPU savings ensure network ticks stay at 0ms delay.

### What Unreal Engine Has / Needs
✅ **Has:** \`MassProcessor\` pipelines and \`MassEntityTraits\` to execute parallel block arrays cleanly.
❌ **Missing:** Standard physics colliders (must use custom Hash Grids) and complex skeletal animation bone structures on entities.

## Your Task
To start making an ECS struct in Unreal, we declare a Fragment. 
Declare a USTRUCT named \`FMassHealthFragment\` that inherits from \`FMassFragment\`. Add a single \`float CurrentHealth\` variable.
\`,
    starterCode: {
      'Source.h': \`#pragma once
#include "CoreMinimal.h"
#include "MassEntityTypes.h"

// TODO: Declare a USTRUCT FMassHealthFragment inheriting from FMassFragment
// TODO: Include a float CurrentHealth;
\`,
    },
    hiddenTests: ['FMassHealthFragment', 'FMassFragment', 'CurrentHealth'],
    successCriteria: [
      'Declare FMassHealthFragment struct',
      'Inherit from FMassFragment',
      'Add float CurrentHealth',
    ],
    rules: [
      {
        id: 'r_opt3_fragment',
        type: 'unreal',
        description: 'FMassFragment structure created',
        evaluate: (code) => {
          const stripped = code.replace(/\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\//g, "").replace(/\\s+/g, "");
          return {
            passed: stripped.includes('structFMassHealthFragment:publicFMassFragment') || stripped.includes('structFMassHealthFragment:FMassFragment'),
            error: 'Must declare FMassHealthFragment inheriting from FMassFragment.',
            fix: 'USTRUCT()\\nstruct FMassHealthFragment : public FMassFragment'
          };
        }
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_opt3',
        title: 'Basic Mass Fragment',
        code: {
          'Source.h': \`USTRUCT()
struct FMassHealthFragment : public FMassFragment
{
    GENERATED_BODY()

    float CurrentHealth = 100.0f;
};
\`,
        },
        explanation: 'Fragments hold PURE DATA. A MassProcessor will iterate over thousands of these in contiguous memory arrays, achieving incredible CPU speeds by fully utilizing the CPU L1/L2 cache.',
      },
    ],
  },
  
  // -------------------------------------------------------------------------
  {
    id: 'task_opt_4',
    title: '51. UMG Invalidation & Slate Optimization',
    category: 'Stage 14: Algorithms & Simulation',
    objective: \`# UMG UI Optimization & Invalidation

Eradicating Slate tick overhead for complex RPG HUDs. Baldur's Gate 3 features complex HUD panels showing multiple dynamic stat bars and items. By default, UMG widgets recalculate layout matrices on *every frame*, costing multiple ms on the CPU.

### Hardware Impact (Concrete Metrics)
- **CPU:** Reduces UMG layout pre-passes from 4.8ms to under 0.2ms during passive screens!
- **GPU:** +0.2ms allocation step for GPU Slate cached vertex drawings.
- **RAM:** Consumes ~18MB to store widget hierarchies in active cache panels.
- **VRAM:** +25MB to retain compiled Slate UI texture channels in VRAM cache.
- **Latency / Ping:** Eliminates layout stutter peaks, leading to stable button press response under 10ms.

### What Unreal Engine Has / Needs
✅ **Has:** \`Invalidation Box\` wrapper caching Slate drawings and skipping Tick pre-passes entirely.
❌ **Missing:** Automatic dynamic dirtying inside nested object data bindings (must manually mark widgets as dirty from C++).

## Your Task
To manually invalidate a widget (forcing it to re-draw only when health changes, rather than every frame), call \`InvalidateLayoutAndVolatility()\` on a \`UWidget\`.
In the function \`UpdateHealthDisplay\`, call that method on the provided \`HealthBarWidget\`.
\`,
    starterCode: {
      'Source.cpp': \`#include "Blueprint/UserWidget.h"
#include "Components/ProgressBar.h"

void UpdateHealthDisplay(UProgressBar* HealthBarWidget, float NewHealth)
{
    HealthBarWidget->SetPercent(NewHealth);

    // TODO: Force Slate to redraw this specifically and bypass frame ticking!
    // Call InvalidateLayoutAndVolatility() on HealthBarWidget.
}
\`,
    },
    hiddenTests: ['InvalidateLayoutAndVolatility'],
    successCriteria: [
      'Call InvalidateLayoutAndVolatility() on the widget',
    ],
    rules: [
      {
        id: 'r_opt4_inval',
        type: 'unreal',
        description: 'Layout Invalidated manually',
        evaluate: (code) => {
          const stripped = code.replace(/\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\//g, "").replace(/\\s+/g, "");
          return {
            passed: stripped.includes('HealthBarWidget->InvalidateLayoutAndVolatility();'),
            error: 'Must call HealthBarWidget->InvalidateLayoutAndVolatility();',
            fix: 'HealthBarWidget->InvalidateLayoutAndVolatility();'
          };
        }
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_opt4',
        title: 'Manual Slate Invalidation',
        code: {
          'Source.cpp': \`void UpdateHealthDisplay(UProgressBar* HealthBarWidget, float NewHealth)
{
    HealthBarWidget->SetPercent(NewHealth);
    HealthBarWidget->InvalidateLayoutAndVolatility();
}
\`,
        },
        explanation: 'By using an Invalidation Box in UMG and triggering manual C++ invalidation calls ONLY when numbers change, we save massive amounts of CPU time compared to Event Tick bindings.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_opt_5',
    title: '52. World Partition, Streaming & IRIS Replication',
    category: 'Stage 15: Open World & Multiplayer Netcode',
    objective: \`# World Partition & Fast Replication

Managing massive RPG open maps like the Witcher 3 or Baldur's Gate 3. 
**World Partition** divides the world into spatial grids that stream automatically based on proximity.
**IRIS Replication** (UE5.1+) processes connection scoping on background threads in O(1) data loops, vastly outperforming the legacy sequential O(N) Netcode. 

### Hardware Impact (Concrete Metrics)
- **CPU:** World partition completely disables ticks for distant actors (saving 4.2ms). IRIS lowers server serialization threads by 5.9ms.
- **GPU:** Saves up to 4.5ms GPU rendering time by unloading distant geometric meshes.
- **RAM:** Saves up to 1.8GB of System RAM by streaming only nearby active grid assets.
- **VRAM:** Saves up to 2.2GB VRAM caching textures aggressively.
- **Latency / Ping:** Keeps network ping under 25ms during rapid world exploration by saving server bandwidth limits.

### What Unreal Engine Has / Needs
✅ **Has:** \`NetDormancy\` flags to sleep untampered objects (like closed chests). \`FFastArraySerializer\` to transmit array deltas elegantly.
❌ **Missing:** Automated server-side partition scaling matching network bandwidth parameters (must be tuned manually).

## Your Task
To utilize Replication Dormancy (Interest Management), set an actor's \`NetDormancy\` to \`DORM_DormantAll\` inside a \`AChestActor\` constructor. This tells the server to NEVER send network updates for this chest until a player interacts with it, saving extreme amounts of bandwidth!
\`,
    starterCode: {
      'Source.cpp': \`#include "GameFramework/Actor.h"

// Imagine this is a passive treasure chest in the open world
AChestActor::AChestActor()
{
    bReplicates = true;

    // TODO: Set NetDormancy to DORM_DormantAll
}
\`,
    },
    hiddenTests: ['NetDormancy', 'DORM_DormantAll'],
    successCriteria: [
      'Set NetDormancy = DORM_DormantAll',
    ],
    rules: [
      {
        id: 'r_opt5_dormancy',
        type: 'unreal',
        description: 'Actor Dormancy Set',
        evaluate: (code) => {
          const stripped = code.replace(/\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\//g, "").replace(/\\s+/g, "");
          return {
            passed: stripped.includes('NetDormancy=DORM_DormantAll;'),
            error: 'You must set NetDormancy = DORM_DormantAll;',
            fix: 'NetDormancy = DORM_DormantAll;'
          };
        }
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_opt5',
        title: 'Initial Dormancy State',
        code: {
          'Source.cpp': \`AChestActor::AChestActor()
{
    bReplicates = true;
    NetDormancy = DORM_DormantAll;
}
\`,
        },
        explanation: 'When 50,000 chests are spawned across an open world map, keeping them strictly Dormant prevents the server CPU from scanning them every network tick, massively optimizing the game.',
      },
    ],
  }
`;

const updatedCode = code.slice(0, insertionIndex) + newTasks + '\n];\n';

fs.writeFileSync(path, updatedCode, 'utf8');
console.log('Curriculum updated successfully.');
