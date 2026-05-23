import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_5_2: UTaskDefinition = {
    id: 'task_5_2',
    title: '5.2. Arrays: Memory Pre-allocation (Reserve)',
    category: 'Stage 1: The Raw Metal',
    objective: `# TArray Memory Pre-allocation (Deep Dive)

The AAA Optimization Guides mention using contiguous arrays (like \`TArray\` or \`std::vector\`) properly to minimize heap allocation. When you call \`.Add()\`, if the array is full, the engine must:
1. Ask the OS for a new, larger block of RAM.
2. Copy every existing element to the new block.
3. Delete the old block.

If you add 1,000 monsters to a dungeon array one by one, the array will aggressively resize, hitching the CPU for **several milliseconds**.

To fix this, if you know roughly how many items you need, call \`.Reserve(N)\` first. This pre-allocates the contiguous block of memory **once**.

### 🌍 RPG Hardware Impact Matrix
*   **CPU Impact (-6.5ms drop)**: Bypasses repeated dynamic resizing hooks and struct copy-contructors during heavy loads (like spawning 10,000 loot items on boss kill).
*   **RAM Impact (~50MB saved)**: Shrink and Reserve eliminate "allocator fragmentation" and "slack" slack space padding.

## Your Task
An array of 5,000 loot drops is going to be populated.
1. Before adding to \`LootDrops\`, call \`Reserve(5000)\` to pre-allocate memory in one single CPU instruction.
`,
    starterCode: {
      'Source.cpp': `#include <vector>

void SpawnDungeonLoot()
{
    std::vector<int32> LootDrops;
    
    // TODO: Call Reserve on LootDrops with a capacity of 5000
    
    // ... loop that adds items later
}
`,
    },
    hiddenTests: ['LootDrops', 'reserve', '5000'],
    successCriteria: [
      'Call reserve() (or Reserve() in UE)',
      'Pass 5000 as the capacity',
    ],
    rules: [
      {
        id: 'r5_2_reserve',
        type: 'exercise',
        description: 'Reserve memory for 5000 elements',
        evaluate: (code) => {
          const c = condense(code.toLowerCase());
          return {
            passed: c.includes('lootdrops.reserve(5000);'),
            error: 'You must call LootDrops.reserve(5000); before appending items.',
            fix: 'LootDrops.reserve(5000);',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_5_2',
        title: 'Pre-allocating Array Capacity',
        explanation: 'reserve(5000) requests a single monolithic block of RAM for 5000 ints instantly. When the loop later fires .push_back or .Add, it works identically to a hyper-fast C array pointer increment, completely removing the OS memory manager overhead.',
        code: {
          'Source.cpp': `#include <vector>

void SpawnDungeonLoot()
{
    std::vector<int32> LootDrops;
    
    LootDrops.reserve(5000);
    
    // ... loop that adds items later
}
`,
        },
      },
    ],
  };
