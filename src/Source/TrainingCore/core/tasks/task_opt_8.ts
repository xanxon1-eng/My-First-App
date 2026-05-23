import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_opt_8: UTaskDefinition = {
    id: 'task_opt_8',
    title: '55. Lock-Free Atomic Queues & Ring Buffers',
    category: 'Stage 16: Deep Dive C++ Optimization',
    objective: `# Lock-Free Atomic Queues & Ring Buffers

In AAA multiplayer RPGs, threads need to communicate millions of events per second (damage ticks, client RPC streams, combat logs). Using operating-system mutexes or standard critical sections triggers expensive context switches (costing thousands of CPU cycles), severely freezing the Game Thread.

By using **atomic index variables** (\`std::atomic<int32>\`), we coordinate thread reads and writes lock-free. Using a **Circular Ring Buffer** format, threads write elements in a continuous memory array with zero dynamic memory allocation overhead and zero thread locking states.

### Hardware Impact (Concrete Metrics)
- **CPU:** Speeds up thread communications by -3.5ms. Eradicates thread-sleep and wakeup overheads completely on task pools.
- **GPU:** Bypasses thread stalls, reducing GPU starvation and eliminating micro-stutters during intense spell-casting.
- **RAM:** Zero auxiliary heap allocations; ring buffers operate on preallocated contiguous memory blocks.
- **VRAM:** No direct impact.
- **Latency / Ping:** Dramatically improves throughput latency from ~5.5 microseconds down to single-cycle nanoseconds.

### What Unreal Engine Has / Needs
✅ **Has:** \`TQueue<T, EQueueMode::Mpsc>\` which implements lock-free atomic multi-producer single-consumer buffers under the hood.
❌ **Missing:** Hardware ring buffers out-of-the-box in basic containers (TArray relocates size dynamically, causing locks).

## Your Task
Let's build a static atomic ring buffer controller.
Declare a class named \`FRingBufferController\` with standard public visibility. Create two discrete variables: \`std::atomic<int32> Head;\` and \`std::atomic<int32> Tail;\`. Note: Make sure to include \`#include <atomic>\` at the top.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include <atomic>

// TODO: Create class FRingBufferController containing public std::atomic<int32> Head and Tail
`,
    },
    hiddenTests: ['FRingBufferController', 'std::atomic<int32>', 'Head', 'Tail'],
    successCriteria: [
      'Create class FRingBufferController',
      'Declare std::atomic<int32> Head',
      'Declare std::atomic<int32> Tail',
    ],
    rules: [
      {
        id: 'r_opt8_atomic',
        type: 'unreal',
        description: 'FRingBufferController class declaration with atomic fields',
        evaluate: (code) => {
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
          const hasClass = stripped.includes('classFRingBufferController');
          const hasHead = stripped.includes('std::atomic<int32>Head') || stripped.includes('std::atomic<int>Head');
          const hasTail = stripped.includes('std::atomic<int32>Tail') || stripped.includes('std::atomic<int>Tail');
          
          if (!hasClass) return { passed: false, error: 'Must declare class FRingBufferController.', fix: 'class FRingBufferController { ... };' };
          if (!hasHead || !hasTail) return { passed: false, error: 'Must include std::atomic<int32> Head; and std::atomic<int32> Tail; with atomic headers.', fix: 'std::atomic<int32> Head;\nstd::atomic<int32> Tail;' };
          
          return { passed: true, error: '', fix: '' };
        }
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_opt8',
        title: 'Atomic Queue Controller',
        code: {
          'Source.h': `class FRingBufferController
{
public:
    std::atomic<int32> Head{0};
    std::atomic<int32> Tail{0};
};
`,
        },
        explanation: 'By using std::atomic, modifications to Head and Tail are atomic operations that prevent CPU race conditions on indices. Threads write to (Tail) and read from (Head) independently in O(1) lock-free instruction speeds.',
      },
    ],
  };
