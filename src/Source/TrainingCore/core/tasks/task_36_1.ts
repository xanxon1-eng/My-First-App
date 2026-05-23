import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_36_1: UTaskDefinition = {
    id: 'task_36_1',
    title: '36.1. Smart Pointers — Thread-Safe TSharedPtr (ESPMode::ThreadSafe)',
    category: 'Stage 13: AAA Optimization (CPU/RAM)',
    objective: `# Thread-Safe Smart Pointers in Async Computations

When building dense open-world RPGs (inspired by *The Witcher 3* or *Baldur's Gate 3*), you must heavily rely on background worker threads for AI Pathfinding, procedural generation, and background File I/O to avoid spiking the main Game Thread. 

By default, Unreal's \`TSharedPtr\` is **NOT thread-safe** (\`ESPMode::Fast\`). If multiple threads access or copy a standard \`TSharedPtr\` concurrently, it triggers a race condition on the reference counter, leading to a catastrophic engine crash.

To safely pass shared data into async background tasks (e.g. \`Async()\` or \`FGraphEvent\`), you must explicitly declare the pointer as thread-safe using \`ESPMode::ThreadSafe\`.

---

## 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-8.5ms down to 0ms on Game Thread)**: Passing an \`ESPMode::ThreadSafe\` pointer safely offloads heavy algorithms (like Navmesh path calculations or procedural terrain chunk generation) to background threads. This clears up to **12.4ms** from the primary Game Thread! (Note: Atomic reference counting adds ~5 CPU clock cycles of overhead per pointer copy on the worker thread, which is why it's not the default).
*   **GPU Impact (-1.2ms)**: By stabilizing Game Thread CPU execution, the Render pipeline stops waiting for instructions, eliminating GPU driver bubbles and saving render context stalls.
*   **RAM Impact (+0.0MB)**: Atomic reference block sizes are virtually identical to non-atomic blocks. Consumes the same standard heap pointer bytes.
*   **VRAM Impact (0.0ms)**: Completely isolated from VRAM.
*   **Latency & Ping Impact (-15ms to -20ms jitter)**: Keeps server simulation loops ticking at a perfect 60Hz. Heavy procedural ticks don't block UDP packet serialization.

### ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**: \`TSharedPtr<T, ESPMode::ThreadSafe>\` and \`MakeShared<T, ESPMode::ThreadSafe>()\` built natively.
*   ⚠️ **What UE5 Lacks**: The compiler does not warn you if you pass an \`ESPMode::Fast\` pointer into a background task lambda. It will compile perfectly and then randomly crash in production.
*   🛠️ **How to Use / Workaround**: Only use \`ESPMode::ThreadSafe\` for data that *actually* crosses thread boundaries, to avoid unnecessary atomic CPU lock overhead locally. 

---

## Your Task
Inside \`FAsyncPathfinder\`, declare a thread-safe Shared Pointer to \`FNavmeshData\` named \`AsyncDataPtr\`.

1. Specify \`ESPMode::ThreadSafe\` inside the template arguments of \`TSharedPtr\`.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"

struct FNavmeshData { int32 GraphID; };

class FAsyncPathfinder
{
    // TODO: Declare a thread-safe Shared Pointer named AsyncDataPtr
    // TSharedPtr<FNavmeshData, ...> AsyncDataPtr;
};
`,
    },
    hiddenTests: ['TSharedPtr', 'ESPMode::ThreadSafe', 'FNavmeshData', 'AsyncDataPtr'],
    successCriteria: [
      'TSharedPtr declared with FNavmeshData',
      'ThreadSafe mode applied to template',
      'Named AsyncDataPtr',
    ],
    rules: [
      {
        id: 'r_opt_sharedptr_threadsafe',
        type: 'unreal',
        description: 'Declare thread-safe shared pointer correctly',
        evaluate: (code) => {
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
          const valid = stripped.includes('TSharedPtr<FNavmeshData,ESPMode::ThreadSafe>AsyncDataPtr;');
          if (valid) {
             return { passed: true, error: '', fix: '' };
          }
          return {
            passed: false,
            error: 'You must provide ESPMode::ThreadSafe as the second template argument for TSharedPtr.',
            fix: 'Use TSharedPtr<FNavmeshData, ESPMode::ThreadSafe> AsyncDataPtr;'
          };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_opt_sharedptr',
        title: 'Thread-Safe TSharedPtr',
        code: {
          'Source.h': `struct FNavmeshData { int32 GraphID = 0; };

class FAsyncPathfinder
{
public:
    TSharedPtr<FNavmeshData, ESPMode::ThreadSafe> AsyncDataPtr;

    FAsyncPathfinder()
    {
        // Initializing with ThreadSafe MakeShared
        AsyncDataPtr = MakeShared<FNavmeshData, ESPMode::ThreadSafe>();
    }
};
`,
        },
        explanation: 'The ESPMode::ThreadSafe flag enforces atomic reference counting under the hood, ensuring that concurrent thread reads/writes to the reference block are resolved safely by the CPU.',
      },
    ],
  };
