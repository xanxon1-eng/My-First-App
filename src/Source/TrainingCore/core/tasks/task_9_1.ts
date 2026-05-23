import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_9_1: UTaskDefinition = {
    id: 'task_9_1',
    title: '9.1. Object Pools vs Full GC Destruction',
    category: 'Stage 2: Code Structure & Memory',
    objective: `# Object Pooling (Deep Dive)

The garbage collector (GC) is extremely slow when destroying/instantiating thousands of dense \`UObjects\` (like arrow projectiles, damage text, or particle hits).
Instead of dynamically spawning and then destroying these objects (which triggers costly heap allocations and GC node removals), you should **Pool** them.

In an Object Pool, you pre-allocate a massive array of inactive actors at level start. When you need an arrow:
1. Grab a dormant one from the array.
2. Un-hide it and reset its tracking values.
3. On impact, hide it and flag it "free" instead of destroying it.

### 🌍 RPG Hardware Impact Matrix
*   **CPU Impact (-14.0ms GC Spikes)**: Erases the 60-second synchronous UI stutter completely by never giving the GC any dead pointers to clean up.
*   **Latency Impact (-10ms tick jitter)**: Dedicated servers process tick frames consistently.

## Your Task
Update \`AArrowManager::ReturnArrow\` to "pool" the arrow instead of destroying it.
1. Call \`Arrow->SetActorHiddenInGame(true);\`
2. Add the Arrow back to the \`InactiveArrows\` array using \`.Add(Arrow);\`.
(Do NOT use \`Destroy()\`).
`,
    starterCode: {
      'Source.cpp': `#include "ArrowManager.h"
#include "Arrow.h"

void AArrowManager::ReturnArrow(AArrow* Arrow)
{
    // TODO: Hide the actor in the world
    // TODO: Append the Arrow back to the InactiveArrows TArray.
}
`,
    },
    hiddenTests: ['ReturnArrow', 'SetActorHiddenInGame', 'InactiveArrows.Add'],
    successCriteria: [
      'Call SetActorHiddenInGame(true)',
      'Add the pointer back to InactiveArrows',
    ],
    rules: [
      {
        id: 'r9_1_hide',
        type: 'exercise',
        description: 'SetActorHiddenInGame used',
        evaluate: (code) => ({
          passed: condense(code).includes('Arrow->SetActorHiddenInGame(true);'),
          error: 'You must hide the actor using Arrow->SetActorHiddenInGame(true);',
          fix: 'Arrow->SetActorHiddenInGame(true);',
        }),
      },
      {
        id: 'r9_1_add',
        type: 'exercise',
        description: 'Pushed back into the array pool',
        evaluate: (code) => ({
          passed: condense(code).includes('InactiveArrows.Add(Arrow);') || condense(code).includes('InactiveArrows.push_back(Arrow);'),
          error: 'You must append Arrow to the InactiveArrows array.',
          fix: 'InactiveArrows.Add(Arrow);',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_9_1',
        title: 'Basic Returning Pool Mechanics',
        explanation: 'We effectively fake destruction. We preserve the pointer, save the instantiation cost, keep the GC nodes active, and instantly reuse the memory block later.',
        code: {
          'Source.cpp': `#include "ArrowManager.h"
#include "Arrow.h"

void AArrowManager::ReturnArrow(AArrow* Arrow)
{
    Arrow->SetActorHiddenInGame(true);
    InactiveArrows.Add(Arrow);
}
`,
        },
      },
    ],
  };
