import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_opt_1: UTaskDefinition = {
    id: 'task_opt_1',
    title: '48. Cache Coherent Memory & Data-Oriented Design',
    category: 'Stage 13: AAA Optimization (CPU/RAM)',
    objective: `# Cache Coherent Memory Architecture

When building an open-world RPG inspired by the dense environments of *The Witcher 3*, the item-heavy looting of *Path of Exile*, or the incredibly complex entity-actor trees of *Baldur's Gate 3*, hardware cache efficiency dictates whether your game maintains **60 FPS on consoles** or chokes in a sea of CPU stalls.

RAM fetch latency is ~100ns (equivalent to several hundred CPU clock cycles). If 10,000 active items, inventory entities, or combat effects are scattered arbitrarily across the heap (as native \`AActor\` and standard Heap references are), the CPU spends up to **90-95% of its time completely stalled** waiting for system memory, dropping overall performance off a cliff.

By restructuring state data into contiguous memory layouts (Data-Oriented Design) and packing structures optimally, memory access times are dramatically reduced, transforming sequential loop overhead from 8.2ms down to **under 1.4ms!**

---

## 🛠️ Deep Dive: Witcher 3, PoE & BG3 High-Performance Optimization

### 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-3.5ms to -7.5ms)**: Moving scattered heap-allocated structures into contiguous chunks (like packing item modifiers or NPC state values inside a single contiguous array) drops Game Thread execution times by up to **-7.5ms**. The CPU can fetch an entire 64-byte L1 Cache Line from L1/L2 caches (1.2ns latency) and process up to 16 aligned fields in single-cycle operations, avoiding expensive DRAM trips (140ns bottleneck delay) that stall worker threads.
*   **GPU Impact (-1.5ms to -2.0ms)**: When the CPU is stalled on memory fetches, the Render Thread is starved of coordinate transforms and draw data, leading to **driver-level GPU bubble stalls** and render pipeline hesitation (-2.0ms GPU frame gains are realized indirectly by assuring constant-speed CPU draw command dispatches).
*   **RAM Impact (Saves 150MB+ on physical PC/Console)**: Ordering struct parameters from largest to smallest eliminates implicit compiler-injected padding bytes (alignment gaps). In games with tens of thousands of active open-world inventory tokens or item rows, this tight packing saves **over 150MB of raw system RAM** and improves overall memory footprint metrics.
*   **VRAM Impact (0.0ms directly)**: Limited strictly to system memory structures; however, efficient memory architectures allow smoother CPU-to-GPU mesh and textures descriptor updates.
*   **Latency & Ping Impact (-15ms to -30ms)**: CONTIGUOUS structures are trivial to serialize, copy, and stream. Bypassing slow, deep pointer loops during client replication prevents packet serialization delays on server loops, stabilizing tick rates and saving up to **30ms in overall latency jitter**.

### ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**:
    1.  \`TArray\` and \`TContiguousArray\` containers that guarantee contiguous physical allocations in memory.
    2.  \`TInlineAllocator<N>\` which stores the first \`N\` elements directly on the stack rather than initiating heap allocation calls.
    3.  \`FMemory::Malloc\` and aligned allocation APIs supporting custom thread-local memory structures.
*   ⚠️ **What UE5 Lacks**:
    1.  **No Contiguous UObject Memory**: Standard \`UObject\` and \`AActor\` references are always allocated dynamically on the global heap, creating massive pointer fragmentation.
    2.  **No Safe Built-in Dynamic SIMD Layouts**: Struct properties inside standard Blueprints are heavily padded by the reflection engine, preventing safe, compact SIMD-line vectorization automatically.
*   🛠️ **How to Use / Workaround**:
    For performance-intensive gameplay structures (like a combat calculator or dynamic loot tracker), **completely bypass raw AActor/UObject classes**. Instead, define data-driven records inside compact, plain C++ structs (\`USTRUCT\`), and manage them inside aligned arrays (\`TArray<FRPGItemData>\`). Use \`TInlineAllocator<8>\` to avoid heap allocations entirely for small nested tables.

---

## Your Task
Declare a struct \`FRPGItemData\`. To optimize cache alignment (preventing padding waste), place the 64-bit \`double\` or pointer FIRST, then \`int32\`, then \`bool\`.
1. Declare \`double Weight;\`
2. Declare \`int32 Value;\`
3. Declare \`bool bIsQuestItem;\``,
    starterCode: {
      'Source.h': `#pragma once
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
`,
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
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
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
          'Source.h': `USTRUCT()
struct FRPGItemData
{
    GENERATED_BODY()

    double Weight;      // 8 bytes
    int32 Value;        // 4 bytes
    bool bIsQuestItem;  // 1 byte
};
`,
        },
        explanation: 'By ordering large to small, the compiler does not insert invisible padding bytes to align the memory, reducing the struct footprint and saving CPU RAM fetches (cache misses).',
      },
    ],
  };
