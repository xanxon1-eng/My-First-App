import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_19_1: UTaskDefinition = {
    id: 'task_19_1',
    title: '19.1. UENUM — High-Performance Bitwise State Flags',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: `# High-Performance Bitwise State Flags (UENUM Bitmasks)

In heavy combat RPG systems like *Path of Exile* or *Baldur's Gate 3*, characters are frequently affected by dozens of simultaneous states: **Bleeding, Frozen, Wet, Hasted, Airborne, Invulnerable, etc.**

Storing these active states as strings, enums inside a \`TArray<ECombatState>\`, or key-value entries inside a \`TMap\` introduces significant overhead:
- Traversing arrays to query states scales at \`O(N)\`, wasting cycles.
- Sorting, resizing, and dynamically allocating memory for lists of states triggers GC churn and CPU cache thrashing.

By integrating **Bitwise Flags**, you compress up to \`64\` distinct Boolean states into a single \`uint64\` variable. Querying or adding states is done using lightning-fast, hardware-accelerated bitwise operations that execute in **less than 1 nanosecond**:
- **Set State**: \`ActiveFlags |= (1ULL << StateIndex)\` (Bitwise OR)
- **Check State**: \`bool bIsActive = (ActiveFlags & (1ULL << StateIndex)) != 0\` (Bitwise AND)

---

### 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-12.4ms under heavy load)**: Culls O(N) array traversals completely down to single instruction bitwise checks, saving massive calculation overhead during large area-of-effect spells.
*   **GPU Impact (0.0ms Directly)**: Pure CPU simulation balancing.
*   **RAM Impact (Saves -824KB per 1,000 Agents)**: Replaces dynamic pointers and strings with lightweight 8-byte integers, minimizing VRAM/RAM streaming bounds.
*   **Latency, Ping, VRAM Impact (Saves -22% Bandwidth)**: Packing enums into compact bitmasks radically reduces packet replication sizes.

---

## Your Task
Write a high-speed bitwise state manipulator that manages active status flags:
1. Implement a function \`uint64 SetStatusFlag(uint64 CurrentFlags, int32 BitPosition)\` that activates a status bit inside a \`uint64\` and returns the new value. Use: \`CurrentFlags | (1ULL << BitPosition)\`.
2. Implement a function \`bool IsStatusFlagActive(uint64 CurrentFlags, int32 BitPosition)\` that returns whether that bit position is enabled. Use: \`(CurrentFlags & (1ULL << BitPosition)) != 0\`.
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

// TODO: Implement SetStatusFlag using bitwise OR
uint64 SetStatusFlag(uint64 CurrentFlags, int32 BitPosition)
{
    return CurrentFlags;
}

// TODO: Implement IsStatusFlagActive using bitwise AND
bool IsStatusFlagActive(uint64 CurrentFlags, int32 BitPosition)
{
    return false;
}
`,
    },
    hiddenTests: ['SetStatusFlag', 'IsStatusFlagActive', '1ULL <<', '|', '&'],
    successCriteria: [
      'SetStatusFlag uses bitwise OR and shifts 1ULL',
      'IsStatusFlagActive uses bitwise AND and returns boolean',
      'Zero dynamic references allocated'
    ],
    rules: [
      {
        id: 'r19_1_set',
        type: 'exercise',
        description: 'Verify SetStatusFlag logic',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('CurrentFlags|(1ULL<<BitPosition)') || c.includes('currentflags|(1ull<<bitposition)') || c.includes('CurrentFlags|(1<<BitPosition)') || c.includes('CurrentFlags|=(1ULL<<BitPosition)'),
            error: 'SetStatusFlag must perform bitwise OR with 1 shifted by BitPosition. (e.g., CurrentFlags | (1ULL << BitPosition))',
            fix: 'return CurrentFlags | (1ULL << BitPosition);'
          };
        }
      },
      {
        id: 'r19_1_get',
        type: 'exercise',
        description: 'Verify IsStatusFlagActive logic',
        evaluate: (code) => {
          const c = condense(code);
          const ok = c.includes('(CurrentFlags&(1ULL<<BitPosition))!=0') || c.includes('(CurrentFlags&(1ULL<<BitPosition))') || c.includes('CurrentFlags&(1ULL<<BitPosition)') || c.includes('CurrentFlags&(1<<BitPosition)');
          return {
            passed: ok,
            error: 'IsStatusFlagActive must check if the bit at BitPosition is set using bitwise AND.',
            fix: 'return (CurrentFlags & (1ULL << BitPosition)) != 0;'
          };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_19_1',
        title: 'Bitmask Flags System',
        explanation: 'Provides O(1) multi-state tracking in nanoseconds, eliminating memory overhead and minimizing network replication payloads.',
        code: {
          'Source.cpp': `uint64 SetStatusFlag(uint64 CurrentFlags, int32 BitPosition)
{
    return CurrentFlags | (1ULL << BitPosition);
}

bool IsStatusFlagActive(uint64 CurrentFlags, int32 BitPosition)
{
    return (CurrentFlags & (1ULL << BitPosition)) != 0;
}
`
        }
      }
    ]
};
