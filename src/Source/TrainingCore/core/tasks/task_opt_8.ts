import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_opt_8: UTaskDefinition = {
    id: 'task_opt_8',
    title: '55. Lock-Free Atomic Queues & Ring Buffers',
    category: 'Stage 16: Deep Dive C++ Optimization',
    objective: `# Lock-Free Atomic Queues & Ring Buffers

In AAA multiplayer RPGs where high-end networks serialize thousands of actions per second (co-op damage events, skill triggers in *Path of Exile*, dynamic combat logs, or fast-firing actor replication packet streaming), threads must communicate millions of times per second. 

Using standard operating system synchronization primitive locks (like Mutexes, Semaphores, or heavy Critical Sections) triggers expensive **Thread Context Switches (costing thousands of CPU cycles)**. This sleeps the calling thread and forces OS wakeups, completely choking the Main Game Thread frame-pacing.

By using **Hardware-level Atomic Index Variables** (\`std::atomic<int32>\` or platform lock-free intrinsics), threads can coordinate parallel reads/writes without sleeping. Paired with a preallocated contiguous **Circular Ring Buffer**, threads can securely queue and dequeue messages with absolutely zero dynamic memory allocations and zero locking states.

---

## 🛠️ Deep Dive: Witcher 3, PoE & BG3 High-Performance Optimization

### 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-3.5ms to -6.8ms)**: Replacing classic mutex-guarded queues with lock-free atomic buffers across thread boundary systems (like sound loading, asset streamer threads, or network deserialization) recovers up to **-6.8ms CPU**. Eliminates kernel-mode context switches, keeping worker cores saturated with real arithmetic tasks instead of stalling in low-power sleep states.
*   **GPU Impact (-1.5ms to -2.0ms)**: Bypasses Game Thread lock hiccups. This prevents temporary frame stutters or hitch drops, assuring that the Render thread receives constant frame-by-frame draw commands for smooth rendering on high-frequency monitors.
*   **RAM Impact (Zero Auxiliary Allocations)**: Pre-allocates active ring slots in a static continuous layout on initialization, avoiding run-time heap allocation and fragmentation completely, and securing predictable RAM sizes over intense multi-hour play play sessions.
*   **VRAM Impact (0.0ms directly)**: Indirectly prevents shader compilation threads or texture-loading requests from clogging the main thread pipeline.
*   **Latency & Ping Impact (-15ms to -45ms)**: Dramatically improves multi-threaded data throughput latency. Transfers packets from a background network dispatcher to active gameplay controllers with negligible transit latency (sub-5 nanoseconds vs 5.5 microseconds using standard mutexes), preventing packet accumulation and reducing overall ping variance by **up to 45ms**!

### ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**:
    1.  \`TQueue<T, EQueueMode::Mpsc>\` and \`TQueue<T, EQueueMode::Spsc>\` that implement lock-free thread exchange mechanisms directly.
    2.  \`std::atomic\` and portable macros such as \`FPlatformAtomics\` to execute lightning-fast hardware compare-and-swap operations without kernel locks.
*   ⚠️ **What UE5 Lacks**:
    1.  **No Native Blueprint Concurrency**: Unreal Engine Blueprints can only execute on the Main Game Thread. There is zero lock-free or multi-threaded logic capability inside Blueprint graphs.
    2.  **No Safe Circular Ring Containers**: Standard containers like \`TArray\` do not partition indices or wrap structures automatically; if sizes change, they execute standard synchronous dynamic allocations, which cause momentary locks.
*   🛠️ **How to Use / Workaround**:
    For cross-thread communication systems (like sending dynamic logs, telemetry, or network replication streams from background IO threads), **always implement a custom lock-free queue or ring buffer in C++**. Manage access indices with atomics (\`std::atomic<int32>\`). Let background threads stream data straight into pre-allocated ring-buffer locations, and read entries sequentially on the Game Thread during tick cycles.

---

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
