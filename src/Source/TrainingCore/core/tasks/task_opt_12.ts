import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_opt_12: UTaskDefinition = {
    id: 'task_opt_12',
    title: '59. High-Performance Linear Arena Memory Allocators',
    category: 'Stage 16: Deep Dive C++ Optimization',
    objective: `# High-Performance Linear Arena Memory Allocators (Zero-Malloc Lifetimes)

In high-performance gaming systems—like *Path of Exile's* massive instanced combat sweeps or *The Witcher 3's* dynamic foliage spawning—dynamic heap allocation (\`malloc\` or \`new\`) is a catastrophic performance bottleneck on your main Game Thread.

Operating system memory managers must search standard page tables, handle thread lock contention, and sometimes run heap compaction. This can take anywhere from **15ns to over 2000ns** per allocation. In an intense combat scene spawning 5,000 active visual modifiers, collision rays, or effect tickets per frame, raw heap allocation overhead alone can consume **8.5ms of frame time**, dropping you from 60 FPS to an unplayable, hitchy stutter.

A **Linear Arena Allocator** (sometimes called a static bump or stack allocator) solves this. By pre-allocating one contiguous block (e.g., 4MB) of memory at boot, allocations simply advance a single "bump pointer." Deallocation of individual objects is a zero-cost operation, and the entire block is wiped and reset in a single clock cycle at the end of the frame!

---

## 🛠️ Deep Dive: RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-4.5ms to -8.2ms)**: Bypassing the standard heap and thread-congested OS locks drops dynamic simulation times by up to **-8.2ms**. Advancing a bump pointer takes exactly 1-2 CPU clock cycles (less than **0.2 nanoseconds**), preventing Game Thread execution stalls completely.
*   **GPU Impact (-1.2ms)**: By finishing frame calculations far sooner, the CPU dispatches coordinate transforms to the rendering pipeline without hesitation, eliminating driver-level GPU bubbles and optimizing graphics command loops.
*   **RAM Impact (Saves 100MB+ in Heap Fragmentation)**: Eliminates millions of small, scattered pointer blocks that cause operating system cache thrashing and heap fragmentation. Caches performance data in contiguous regions, increasing L1 cache line hit rates (1.2ns fetch) past **98%**.
*   **VRAM Impact (0.0ms directly)**: Pure engine execution architecture; however, rapid allocations allow visual emitters and G-Buffer decals to copy descriptor states synchronously without stalling.
*   **Latency & Ping Impact (0.0ms)**: Bypasses network deserialization buffer stalls.

---

## ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**:
    1.  \`TMemStack<T>\` which allows rapid bump allocations on a shared thread-local memory stack, routinely used in rendering scene passes.
    2.  \`FMemStack\` system providing simple stack-based memory segments.
*   ⚠️ **What UE5 Lacks**:
    1.  **No Type-Safe, Multi-Threaded General-Purpose Arenas**: Standard game logic and container allocations default to \`FMemory::Malloc\`, which routes through heavy OS thread-safe lock pools.
    2.  **No Safe Blueprints Support**: Dynamic structs built in Blueprints are always instantiated on the standard garbage-collected object heap, meaning dynamic visual scripting heavily stalls CPU frame bounds.
*   🛠️ **How to Use / Workaround**:
    Create custom C++ classes that inherit from \`FRunnable\` or execute within a custom \`UWorldSubsystem\`. Provide a pre-allocated \`TArray<uint8>\` buffer representing your thread-safe arena, and use **In-place New (\`placement new\`)** to construct structures directly inside this buffer. At the end of the frame, simply reset your offset counter to 0, completely avoiding standard destructors if variables are primitive!

---

## Your Task
Implement a lightweight C++ Arena Allocator structure:
1. Declare a variable \`uint8* BackingBuffer;\` representing our continuous memory space.
2. Declare an integer offset tracking the bump pointer: \`int32 Offset;\`
3. Complete the function \`void* Allocate(int32 Size)\` which aligns \`Size\` to 8-byte boundaries, verifies there is enough space, bumps \`Offset\` forward, and returns the pointer to the aligned memory block.

*Hint:*
- 8-byte alignment can be achieved by: \`int32 AlignedSize = (Size + 7) & ~7;\`
- The current pointer is calculated by: \`void* Result = BackingBuffer + Offset;\`
- After updating \`Offset\` with \`AlignedSize\`, return \`Result\`.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"

struct FArenaAllocator
{
    uint8* BackingBuffer;
    int32 Capacity;
    int32 Offset;

    void Initialize(int32 InCapacity)
    {
        Capacity = InCapacity;
        Offset = 0;
        BackingBuffer = new uint8[Capacity];
    }

    void* Allocate(int32 Size)
    {
        // TODO: Align the requested size to an 8-byte boundary
        // TODO: Verify (Offset + AlignedSize <= Capacity)
        // TODO: Compute the allocated pointer (BackingBuffer + Offset)
        // TODO: Update Offset with AlignedSize
        // TODO: Return the calculated pointer (or nullptr if out of space)
        return nullptr;
    }

    void Reset()
    {
        Offset = 0;
    }

    ~FArenaAllocator()
    {
        delete[] BackingBuffer;
    }
};
`,
    },
    hiddenTests: ['FArenaAllocator', 'BackingBuffer', 'Offset', 'Allocate', 'AlignedSize'],
    successCriteria: [
        'Understand and implement 8-byte stack memory alignment',
        'Directly bump offset pointer dynamically in standard C++',
        'Incorporate heap-overflow exhaustion safety guards',
        'Construct lightweight zero-malloc allocators tailored for RPG systems'
    ],
    rules: [
      {
        id: 'r_opt12_arena',
        type: 'unreal',
        description: 'Verify 8-byte alignment math and offset mutation checks',
        evaluate: (code) => {
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
          const hasAlignMath = stripped.includes('&~7') || stripped.includes('Size+7') || stripped.includes('%8');
          const hasOffsetCheck = stripped.includes('Offset+') || stripped.includes('+Offset') || stripped.includes('<=Capacity');
          const hasBackingPlusOffset = stripped.includes('BackingBuffer+Offset') || stripped.includes('&BackingBuffer[Offset]');
          const hasOffsetMutation = stripped.includes('Offset+=') || stripped.includes('Offset=Offset+');

          if (!hasAlignMath) return { passed: false, error: 'Must apply 8-byte boundary alignment math to the requested Size.', fix: 'int32 AlignedSize = (Size + 7) & ~7;' };
          if (!hasOffsetCheck) return { passed: false, error: 'Must check if the allocation fits within the arena Capacity before shifting pointers.', fix: 'if (Offset + AlignedSize <= Capacity) { ... }' };
          if (!hasBackingPlusOffset) return { passed: false, error: 'Must return the allocated memory address based on BackingBuffer + current Offset.', fix: 'void* Result = BackingBuffer + Offset;' };
          if (!hasOffsetMutation) return { passed: false, error: 'Must increment the Offset by the AlignedSize.', fix: 'Offset += AlignedSize;' };

          return { passed: true, error: '', fix: '' };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_opt12',
        title: 'Lightweight C++ Arena Allocator',
        code: {
          'Source.h': `struct FArenaAllocator
{
    uint8* BackingBuffer;
    int32 Capacity;
    int32 Offset;

    void Initialize(int32 InCapacity)
    {
        Capacity = InCapacity;
        Offset = 0;
        BackingBuffer = new uint8[Capacity];
    }

    void* Allocate(int32 Size)
    {
        int32 AlignedSize = (Size + 7) & ~7;
        if (Offset + AlignedSize <= Capacity)
        {
            void* Result = BackingBuffer + Offset;
            Offset += AlignedSize;
            return Result;
        }
        return nullptr;
    }

    void Reset()
    {
        Offset = 0;
    }

    ~FArenaAllocator()
    {
        delete[] BackingBuffer;
    }
};
`,
        },
        explanation: 'By aligning elements to 8 bytes, we fulfill the target alignment of standard CPU architecture architectures, enabling single-cycle loading. Bump allocation behaves as a simple index increment, bypassing all dynamic heap searches completely.',
      },
    ],
  };
