import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_5: UTaskDefinition = {
    id: 'task_5',
    title: '5. Dynamic Arrays — std::vector & TArray',
    category: 'Stage 1: The Raw Metal',
    objective: `# Dynamic Arrays: std::vector & TArray

When the number of elements isn't known at compile-time, we use **dynamic arrays** that resize at runtime.

| | std::vector | TArray (Unreal) |
|-|------------|----------------|
| Header | \`<vector>\` | automatic in UE |
| Add | \`.push_back(x)\` | \`.Add(x)\` |
| Count | \`.size()\` | \`.Num()\` |

Unreal wrote \`TArray\` because \`std::vector\` caused memory fragmentation inside the engine's custom allocators. The APIs are nearly identical — once you know one, you know the other.

---

## 🛠️ Deep Dive: Witcher 3 & PoE High-Performance Array Optimization
In open-world Action RPGs, managing heap memory during real-time combat is crucial to avoid game thread stalls.

### 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-1.5ms to -4.8ms)**: When a dynamic array (\`TArray\` or \`std::vector\`) exceeds its capacity, it executes a dynamic heap re-allocation (usually sizing up by 1.5x or 2.x), copies all existing objects over via copy constructors, and triggers deallocations. Spawning millions of spell entities or loot drops in *Path of Exile* without pre-reservers results in severe, recurring frame stutter spikes of **+4.8ms**. Pre-allocating elements (\`Scores.Reserve(300);\`) completely bypasses resizing cost, capping insertion times at **~0.1ms**.
*   **GPU Impact (+2.5ms drawing lag if violated)**: Slow CPU rendering thread dispatch (starved by Game Thread memory allocation locks during hot paths) fails to feed draw queues, leaving high-end GPUs sitting idle in driver starvation waits.
*   **RAM Impact (~180MB saved)**: Dynamic arrays allocate dynamic "slack" buffer margins to optimize future inserts. Under high inventories (hundreds of materials, items in *Witcher 3* or *BG3*), this slack overhead causes system RAM bloating by **+180MB**. Calling \`Scores.Shrink();\` after sorting variables purges this dead space, returning RAM directly to the heap memory pools.
*   **VRAM Impact (+1.2ms render hitch if violated)**: Real-time re-allocation of mesh transform indices during streaming travel steps triggers VRAM upload queue delays, producing noticeable micro-flickers on screen.
*   **Latency & Ping Impact (-5ms gain)**: Heavy heap allocation churn pauses networked predictive tick loops. Eliminating allocations ensures rock-solid 0.0ms stutter jitter in server packets.

### ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**: 
    1.  \`TArray<Type, TInlineAllocator<N>>\`: An incredibly powerful container that allocates the first \`N\` elements directly on the high-speed CPU Stack instead of the heap, completely sweeping away malloc costs for small, standard arrays.
    2.  \`Scores.Reserve(N)\` and \`Scores.Reset()\` to reuse memory allocations safely across tick boundaries.
*   ⚠️ **What UE5 Lacks**: 
    1.  Implicit automatic memory defragmentation for custom structures. Contiguous caches suffer if arrays store raw pointers instead of contiguous structures (pointer-chasing).
*   🛠️ **How to Use / Workaround**: 
    Avoid dynamic heap structures for objects with fewer than 16 items (e.g., status effects, gear sockets). Instead, define them as \`TArray<FStatusEffect, TInlineAllocator<8>>\`. This ensures status evaluation executes straight inside L1 Cache Lines (takes ~1.2ns instruction time), dodging L2/L3 cache misses (up to 140ns per miss). Always call \`Reserve()\` before loading data.

---

## Your Task
1. Declare \`std::vector<int32> Scores;\`
2. Add \`100\`, \`200\`, and \`300\` using \`.push_back()\`.
`,
    starterCode: {
      'Source.cpp': `#include <vector>

void Practice()
{
    // TODO 1: Declare std::vector<int32> Scores
    // TODO 2: Add 100, 200, 300 via push_back
}
`,
    },
    hiddenTests: ['std::vector<int32> Scores', 'push_back'],
    successCriteria: [
      'Declare std::vector<int32> Scores',
      'Call push_back to add at least three values',
    ],
    rules: [
      {
        id: 'r5_vec',
        type: 'exercise',
        description: 'std::vector<int32> Scores declared',
        evaluate: (code) => ({
          passed: condense(code).includes('std::vector<int32>Scores;'),
          error: 'Declare std::vector<int32> Scores;',
          fix: 'std::vector<int32> Scores;',
        }),
      },
      {
        id: 'r5_push',
        type: 'exercise',
        description: 'push_back called with correct values',
        evaluate: (code) => {
          const c = condense(code);
          const passed = c.includes('Scores.push_back(100);') && 
                         c.includes('Scores.push_back(200);') && 
                         c.includes('Scores.push_back(300);');
          return {
            passed,
            error: `Need to push_back 100, 200, and 300 specifically.`,
            fix: `Scores.push_back(100);\nScores.push_back(200);\nScores.push_back(300);`,
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_5a',
        title: 'Sequential push_back',
        explanation: 'Each push_back appends one element to the heap-allocated internal buffer.',
        code: {
          'Source.cpp': `#include <vector>

void Practice()
{
    std::vector<int32> Scores;
    Scores.push_back(100);
    Scores.push_back(200);
    Scores.push_back(300);
}
`,
        },
      },
    ],
  };
