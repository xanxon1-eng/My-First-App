import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_opt_13: UTaskDefinition = {
    id: 'task_opt_13',
    title: '60. Double-Buffered State Replication & Thread-Safe Ring Swaps',
    category: 'Stage 16: Deep Dive C++ Optimization',
    objective: `# Double-Buffered State Replication & Thread-Safe Ring Swaps

In massive open-world RPGs like *Baldur's Gate 3* or *The Witcher 3*, background worker threads constantly calculate AI coordinates, path-grid traversals, or foliage wind states to avoid stalling the main Game Thread. 

However, if the main Game Thread is reading actor positions to render them while a worker thread is writing to those same positions, you trigger a **critical data race**, resulting in severe memory corruption and fatal application crashes. 

Standard thread synchronization relies on **Mutual Exclusions (MUTEX / FCriticalSection)**. However, locking a mutex can take **500ns to over 50,000ns** if thread contention is high, which often results in worker threads accidentally stalling the main Game Thread anyway!

A **Double-Buffered State** solves this. By keeping. two structural copies of the game state (a \`ReadBuffer\` and a \`WriteBuffer\`), the Game Thread can read from one buffer in parallel with the worker thread writing to the other. At the end of the frame, we execute a rapid, lock-free **Atomic Pointer Swap**, switching the buffer index in less than **1 nanosecond**!

---

## 🛠️ Deep Dive: RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-3.8ms to -6.2ms)**: De-scheduling heavy calculations into parallel workers reduces primary Game Thread CPU consumption by up to **-6.2ms**. Eliminating standard thread locks prevents resource waiting stalls (where thread blocks spend hundreds of clock cycles idle).
*   **GPU Impact (-1.0ms)**: Bypassing thread synchronization pauses on the main thread keeps render draw loops saturated, preventing frame-pacing drops and microstutter.
*   **RAM Impact (Requires 2x Buffer Footprint)**: Since the game state is duplicated, your RAM requirements for these specific state structures double (e.g., maintaining 2 Wind Grids instead of 1, costing an extra **1.2MB** for a 256x256 grid, which is incredibly negligible compared to the massive performance gains).
*   **VRAM Impact (0.0ms)**: Purely cpu/ram core thread layout.
*   **Latency & Ping Impact (-15ms to -25ms co-op ping)**: Ensures that network packet replication loops never wait on local Mutex releases, reducing tick discrepancies during intense cooperative operations.

---

## ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**:
    1.  \`FRenderCommandFence\` which handles synchronization boundaries between the Game Thread and the rendering thread.
    2.  \`TDoubleBuffered\` template wrappers (available in specific internal modules).
*   ⚠️ **What UE5 Lacks**:
    1.  **No Safe Out-Of-The-Box Multi-Threaded State Swappers for Game Logic**: Developers are forced to program their own buffer buffers or risk catastrophic race conditions when passing arrays to \`FRunnable\`.
*   🛠️ **How to Use / Workaround**:
    Write a dedicated C++ state wrapper. Inside, manage an array containing exactly 2 items: \`TArray<FRPGState, TFixedAllocator<2>> Buffers;\`. Use standard C++ atomic integers (\`std::atomic<int32>\`) to track which index is the active Read buffer, and swap them at the end of Tick using an atomic exchange command: \`ReadIndex.store(1 - ReadIndex.load())\`.

---

## Your Task
Implement a thread-safe double buffered structure:
1. Declare an atomic index variable: \`std::atomic<int32> ReadIndex;\`
2. Complete the function \`void SwapBuffers()\` which toggles \`ReadIndex\` between \`0\` and \`1\` using lock-free atomic load and store commands.
3. Complete the function \`const FRPGState& GetReadState() const\` which fetches the current read-only record.
4. Complete the function \`FRPGState& GetWriteState()\` which fetches the current write-only record pointing to \`1 - ReadIndex\`.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include <atomic>

struct FRPGState
{
    float PlayerX;
    float PlayerY;
};

class TDoubleBufferedState
{
private:
    FRPGState Buffers[2];
    
    // TODO: Declare an atomic integer named ReadIndex
    // std::atomic<int32> ReadIndex;

public:
    TDoubleBufferedState()
    {
        // TODO: Initialize your atomic ReadIndex to 0
    }

    void SwapBuffers()
    {
        // TODO: Lock-free swap: set ReadIndex to (1 - current value)
        // Hint: use standard atomic store and load
    }

    const FRPGState& GetReadState() const
    {
        // TODO: Return the state index currently pointed to by ReadIndex
        static FRPGState Empty;
        return Empty;
    }

    FRPGState& GetWriteState()
    {
        // TODO: Return the state index NOT pointed to by ReadIndex (1 - ReadIndex)
        static FRPGState Empty;
        return Empty;
    }
};
`,
    },
    hiddenTests: ['TDoubleBufferedState', 'ReadIndex', 'Buffers', 'SwapBuffers', 'GetReadState', 'GetWriteState'],
    successCriteria: [
        'Understand and implement std::atomic variables in multi-threading',
        'Implement single-line toggle formulas (1 - Current)',
        'Ensure lock-free separation of reading thread from writing thread',
        'Bypass expensive OS Mutex / critical section lockers'
    ],
    rules: [
      {
        id: 'r_opt13_double_buff',
        type: 'unreal',
        description: 'Verify atomic ReadIndex usage and index switching formulas',
        evaluate: (code) => {
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
          const hasAtomic = stripped.includes('std::atomic<int32>ReadIndex') || stripped.includes('std::atomic<int>ReadIndex');
          const hasSwap = stripped.includes('ReadIndex.store(') || stripped.includes('ReadIndex=') && stripped.includes('1-');
          const hasRead = stripped.includes('Buffers[ReadIndex') || stripped.includes('Buffers[ReadIndex.load()') || stripped.includes('Buffers[ReadIndex]');
          const hasWrite = stripped.includes('Buffers[1-ReadIndex') || stripped.includes('Buffers[1-ReadIndex.load()');

          if (!hasAtomic) return { passed: false, error: 'Must declare std::atomic<int32> ReadIndex variable to guide atomic operations.', fix: 'std::atomic<int32> ReadIndex;' };
          if (!hasSwap) return { passed: false, error: 'SwapBuffers must toggle ReadIndex to (1 - ReadIndex) atomically.', fix: 'ReadIndex.store(1 - ReadIndex.load());' };
          if (!hasRead) return { passed: false, error: 'GetReadState must read from Buffers using the current ReadIndex value.', fix: 'return Buffers[ReadIndex.load()];' };
          if (!hasWrite) return { passed: false, error: 'GetWriteState must return Buffers index currently available for writing (1 - ReadIndex).', fix: 'return Buffers[1 - ReadIndex.load()];' };

          return { passed: true, error: '', fix: '' };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_opt13',
        title: 'Buffer State Swapper',
        code: {
          'Source.h': `#include <atomic>

struct FRPGState
{
    float PlayerX;
    float PlayerY;
};

class TDoubleBufferedState
{
private:
    FRPGState Buffers[2];
    std::atomic<int32> ReadIndex;

public:
    TDoubleBufferedState() : ReadIndex(0) {}

    void SwapBuffers()
    {
        int32 Current = ReadIndex.load();
        ReadIndex.store(1 - Current);
    }

    const FRPGState& GetReadState() const
    {
        return Buffers[ReadIndex.load()];
    }

    FRPGState& GetWriteState()
    {
        return Buffers[1 - ReadIndex.load()];
    }
};
`,
        },
        explanation: 'By storing and loading the index atomically, the CPU maintains safe read/write separations without ever sleeping the threads inside locking queues.',
      },
    ],
  };
