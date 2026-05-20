import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_opt_1: UTaskDefinition = {
    id: 'task_opt_1',
    title: '48. Cache Coherent Memory & Data-Oriented Design',
    category: 'Stage 13: AAA Optimization (CPU/RAM)',
    objective: `# Cache Coherent Memory Architecture

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
