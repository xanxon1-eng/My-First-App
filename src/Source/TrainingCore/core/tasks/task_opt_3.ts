import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_opt_3: UTaskDefinition = {
    id: 'task_opt_3',
    title: '50. MassEntity / ECS in Unreal',
    category: 'Stage 14: Algorithms & Simulation',
    objective: `# MassEntity & Data-Oriented Design

Standard \`AActor\` ticks cost massive CPU overhead due to virtual functions and physical transform hierarchies. 
Using Unreal's modern **MassEntity** (Entity Component System), we pack entity logic strictly into structs (Fragments) simulating thousands of agents extremely fast (like Path of Exile swarms).

### Hardware Impact (Concrete Metrics)
- **CPU:** Speeds up crowd evaluation by 4.4ms CPU. Ticking 10,000 entities drops from 15.0ms down to 1.8ms!
- **GPU:** +0.5ms GPU cost to draw thousands of proxy Instance Static Meshes simultaneously.
- **RAM:** Saves ~450MB of RAM. Compacts 10,000 entities into just 12MB. 
- **VRAM:** +40MB VRAM to manage Instance Static Mesh transform tables.
- **Latency / Ping:** Massive CPU savings ensure network ticks stay at 0ms delay.

### What Unreal Engine Has / Needs
✅ **Has:** \`MassProcessor\` pipelines and \`MassEntityTraits\` to execute parallel block arrays cleanly.
❌ **Missing:** Standard physics colliders (must use custom Hash Grids) and complex skeletal animation bone structures on entities.

## Your Task
To start making an ECS struct in Unreal, we declare a Fragment. 
Declare a USTRUCT named \`FMassHealthFragment\` that inherits from \`FMassFragment\`. Add a single \`float CurrentHealth\` variable.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "MassEntityTypes.h"

// TODO: Declare a USTRUCT FMassHealthFragment inheriting from FMassFragment
// TODO: Include a float CurrentHealth;
`,
    },
    hiddenTests: ['FMassHealthFragment', 'FMassFragment', 'CurrentHealth'],
    successCriteria: [
      'Declare FMassHealthFragment struct',
      'Inherit from FMassFragment',
      'Add float CurrentHealth',
    ],
    rules: [
      {
        id: 'r_opt3_fragment',
        type: 'unreal',
        description: 'FMassFragment structure created',
        evaluate: (code) => {
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
          return {
            passed: stripped.includes('structFMassHealthFragment:publicFMassFragment') || stripped.includes('structFMassHealthFragment:FMassFragment'),
            error: 'Must declare FMassHealthFragment inheriting from FMassFragment.',
            fix: 'USTRUCT()\nstruct FMassHealthFragment : public FMassFragment'
          };
        }
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_opt3',
        title: 'Basic Mass Fragment',
        code: {
          'Source.h': `USTRUCT()
struct FMassHealthFragment : public FMassFragment
{
    GENERATED_BODY()

    float CurrentHealth = 100.0f;
};
`,
        },
        explanation: 'Fragments hold PURE DATA. A MassProcessor will iterate over thousands of these in contiguous memory arrays, achieving incredible CPU speeds by fully utilizing the CPU L1/L2 cache.',
      },
    ],
  };
