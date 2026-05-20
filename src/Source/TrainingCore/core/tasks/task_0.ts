import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_0: UTaskDefinition = {
    id: 'task_0',
    title: '0. Your RPG Optimization Goals',
    category: 'Stage 0: RPG Foundation',
    objective: `# Building Your Open World 3D RPG

Before we dive into C++ syntax, let's contextualize **why** we are learning these tools. You are building an open world 3D RPG inspired by **The Witcher 3**, **Path of Exile**, and **Baldur's Gate 3**. 

This means your architecture must handle:
- **Massive Open Worlds (The Witcher 3):** Thousands of streaming objects, requiring World Partition grids, Hierarchical Level of Detail (HLODs), and dynamic draw call batching (Instanced Static Meshes).
- **Fast Action Combat (Path of Exile):** 100+ spells triggering simultaneously. Standard O(N^2) traces will freeze your Game Thread. We must utilize O(1) Spatial Hash tracing and parallel Multithreaded C++.
- **Deep States & Persistency (Baldur's Gate 3):** Hundreds of nested inventories, branching dialogues, and status rules. We must rely on robust memory structures (Structs), FastArray serializers, and event-driven Multicast Delegates rather than ticking actors.

## 🌍 Hardware Budget Strictness
To ensure this runs smoothly (Targeting 16.6ms / 60 FPS):
- **CPU:** Standard Actor polling must be eradicated. We map calculations onto worker threads via Mass Entity or the Task Graph.
- **GPU:** We bypass extreme shader costs by carefully profiling Materials and implementing Global Dynamic GI Caching offline instead of raw Lumen where needed (-6.0ms savings).
- **RAM / VRAM:** Contiguous memory packing on the CPU, Texture Streaming on the GPU.

## Your Task
Let's verify your C++ setup. Write an empty placeholder function \`void BootRPGEngine(){}\` to initialize your knowledge journey.

Inside \`Source.cpp\`:
1. Declare \`void BootRPGEngine(){}\`
`,
    starterCode: {
      'Source.cpp': `// Ready to build the RPG engine.
`,
    },
    hiddenTests: ['void BootRPGEngine'],
    successCriteria: [
      'Declare void BootRPGEngine(){}',
    ],
    rules: [
      {
        id: 'r0_boot',
        type: 'exercise',
        description: 'void BootRPGEngine(){}',
        evaluate: (code) => ({
          passed: condense(code).includes('voidBootRPGEngine(){}'),
          error: 'Missing: void BootRPGEngine(){}', 
          fix: 'void BootRPGEngine(){}'
        }),
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_1',
        title: 'Empty function',
        code: {
          'Source.cpp': `void BootRPGEngine(){}`
        }
      }
    ]
  };
