import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_12_1: UTaskDefinition = {
    id: 'task_12_1',
    title: '12.1. Fast Type Checking (ExactCast vs Cast)',
    category: 'Stage 2: Code Structure & Memory',
    objective: `# Fast Type Checking (Deep Dive)

Standard C++ RTTI (Run-Time Type Information) \`dynamic_cast<>&\` is notoriously slow and disabled in Unreal by default. Unreal implements its own \`Cast<Type>()\` macro.
While \`Cast<Type>()\` is safer, doing it recursively or on 1,000 actors in a physics sweep can throttle the CPU.

If you don't need inheritance checking (e.g. you know the object is EXACTLY a \`A Goblin\` and not a \`A SuperGoblin\`), you can use \`ExactCast<T>()\` to slash the execution overhead from pointer iterations down to a single memory offset check.
Or, even better, check \`IsA(AGoblin::StaticClass())\` for lightning-fast comparisons.

### 🌍 RPG Hardware Impact Matrix
*   **CPU Impact (-3.0ms per frame)**: Swapping out legacy dynamic casts with pointer-value or exact memory offset checks inside spatial overlap volumes bypasses the reflection subsystem completely.
*   **RAM/Latency**: N/A - Pure operation pipeline fix.

## Your Task
We have a broad pointer \`AActor* HitActor\`. We want to do the fastest check possible to see if its exact class matches \`AWeapon\`.
1. Call \`HitActor->IsA(AWeapon::StaticClass())\` instead of a heavy \`Cast<AWeapon>()\`.
2. Wrap it inside the \`if ( ... )\` statement.
`,
    starterCode: {
      'Source.cpp': `#include "Weapon.h"
#include "GameFramework/Actor.h"

void CheckHit(AActor* HitActor)
{
    // TODO: Write if ( HitActor->IsA(AWeapon::StaticClass()) )
    // {
    //      // exact match logic here
    // }
}
`,
    },
    hiddenTests: ['IsA', 'AWeapon::StaticClass()'],
    successCriteria: [
      'Write an if statement',
      'Call HitActor->IsA(...)',
      'Pass AWeapon::StaticClass()',
    ],
    rules: [
      {
        id: 'r12_1_isa',
        type: 'exercise',
        description: 'HitActor->IsA used with AWeapon::StaticClass()',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('if(HitActor->IsA(AWeapon::StaticClass()))'),
            error: 'You must use if (HitActor->IsA(AWeapon::StaticClass()))',
            fix: 'if (HitActor->IsA(AWeapon::StaticClass())) { }',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_12_1',
        title: 'Optimized Reflection Type Check',
        explanation: 'Cast<> recursively runs up the class tree matching reflection data. IsA checks a stored integer pointer offset against the global engine registry. It is magnitudes faster.',
        code: {
          'Source.cpp': `#include "Weapon.h"
#include "GameFramework/Actor.h"

void CheckHit(AActor* HitActor)
{
    if (HitActor->IsA(AWeapon::StaticClass()))
    {
        // Verified faster than Cast!
    }
}
`,
        },
      },
    ],
  };
