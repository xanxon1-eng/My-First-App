import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_35_1: UTaskDefinition = {
    id: 'task_35_1',
    title: '35.1. TMap & TSet — Hash Collisions & Reserve (Memory Reallocation Culling)',
    category: 'Stage 13: AAA Optimization (CPU/RAM)',
    objective: `# Optimizing TMap & TSet for O(1) Data-Oriented Design

In large-scale RPGs, dictionaries (hash maps) are frequently used for Inventory lookup systems, Attribute scales, or fast Quest status lookups. While \`TMap\` targets O(1) query speeds, **dynamic insertion overhead** can quietly drain your CPU budget if done blindly.

When a \`TMap\` or \`TArray\` exceeds its internal capacity, it executes a heavy memory reallocation: it halts execution, copies all existing items to a new expanded memory address on the heap, re-hashes elements, and deletes the old block. If you dynamically insert 2,000 Loot items during a chest explosion, this triggers multiple reallocations, devastating framerates.

---

## 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-4.5ms during burst loads)**: Pre-reserving the exact needed memory completely bypasses dynamic memory allocations. Halting a level-loading loop to expand arrays 15 times can cause a nasty **4.5ms micro-stutter** on the Game Thread.
*   **GPU Impact (0.0ms)**: Primarily CPU/Memory bound.
*   **RAM Impact (+0.0MB)**: In fact, it effectively stops memory fragmentation (where small unused memory holes dot the system RAM because old blocks were released).
*   **VRAM Impact (0.0ms)**: N/A.
*   **Latency & Ping Impact (-8ms on replication scans)**: Prevents garbage-collection hitches server-side, speeding up the serialization passes needed to beam loot spawns to cooperative clients.

### ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**: \`Reserve(int32 Number)\` and \`Empty(int32 ExpectedElements)\`. \`TSparseArray\` for extremely contiguous memory with lookup speeds.
*   ⚠️ **What UE5 Lacks**: The engine does not automatically guess your future required size based on gameplay context.
*   🛠️ **How to Use / Workaround**: Always call \`MyMap.Reserve(ExpectedSize)\` before entering \`for\` loops that insert masses of data.

---

## Your Task
Inside the \`InitializeInventory\` function, you are about to insert 10,000 items into \`ItemDatabase\`.
Before the loop starts, use the **\`Reserve()\`** function to allocate memory for 10,000 items directly, eliminating multiple memory allocations.

1. Call \`ItemDatabase.Reserve(10000);\`.
`,
    starterCode: {
      'Source.cpp': `void InitializeInventory()
{
    TMap<int32, FString> ItemDatabase;

    // TODO: Reserve memory for 10000 items to prevent reallocations
    // ...

    for (int32 i = 0; i < 10000; i++)
    {
        ItemDatabase.Add(i, TEXT("Generic RPG Item"));
    }
}
`,
    },
    hiddenTests: ['ItemDatabase', 'Reserve', '10000'],
    successCriteria: [
      'Calls Reserve on ItemDatabase',
      'Uses 10000 as the parameter',
    ],
    rules: [
      {
        id: 'r_opt_tmap_reserve',
        type: 'unreal',
        description: 'Properly reserves TMap memory',
        evaluate: (code) => {
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
          const valid = stripped.includes('ItemDatabase.Reserve(10000);');
          
          let beforeLoop = true;
          if (valid) {
             const reserveIdx = stripped.indexOf('ItemDatabase.Reserve(10000);');
             const loopIdx = stripped.indexOf('for(int32i=0;i<10000;i++)');
             if (reserveIdx > loopIdx && loopIdx !== -1) {
                 beforeLoop = false;
             }
          }

          if (valid && beforeLoop) {
             return { passed: true, error: '', fix: '' };
          }
          if (valid && !beforeLoop) {
              return { passed: false, error: 'Reserve() must be called BEFORE the loop starts.', fix: 'Move Reserve above the for-loop.' };
          }
          return {
            passed: false,
            error: 'You must call ItemDatabase.Reserve(10000); to pre-allocate memory.',
            fix: 'Add ItemDatabase.Reserve(10000);'
          };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_opt_tmap',
        title: 'TMap Memory Cultivation',
        code: {
          'Source.cpp': `void InitializeInventory()
{
    TMap<int32, FString> ItemDatabase;

    // Allocate continuous memory up-front
    ItemDatabase.Reserve(10000);

    for (int32 i = 0; i < 10000; i++)
    {
        ItemDatabase.Add(i, TEXT("Generic RPG Item"));
    }
}
`,
        },
        explanation: 'By reserving space for 10,000 records simultaneously, the operating system finds an exact block size, eliminating progressive stuttering reallocation checks on each loop iteration.',
      },
    ],
  };
