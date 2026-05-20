import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_31: UTaskDefinition = {
    id: 'task_31',
    title: '31. Safe Casting — Cast<T>',
    category: 'Stage 7: Production Standards',
    objective: `# Safe Casting with Cast<T>

\`dynamic_cast\` is **disabled** in Unreal Engine (for performance). Use \`Cast<T>()\` instead:

\`\`\`cpp
AActor* HitActor = GetHitResult().GetActor();
AMonster* Monster = Cast<AMonster>(HitActor);

if (Monster)
{
    Monster->TakeHit();    // safe — cast succeeded
}
// if cast failed: Monster == nullptr, no crash
\`\`\`

\`CastChecked<T>()\` is the asserting variant — it crashes if the cast fails. Use it when failure would mean a logic error.

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
In \`OnHit(AActor* HitActor)\`, cast \`HitActor\` to \`AMonster*\` and store it in a variable named \`MonsterTarget\`. Check if it's valid before using.
`,
    starterCode: {
      'Source.cpp': `#include "MyActor.h"
#include "Monster.h"

void OnHit(AActor* HitActor)
{
    // TODO: Cast HitActor to AMonster* and store in MonsterTarget
    // TODO: Check MonsterTarget is valid before using it
}
`,
    },
    hiddenTests: ['AMonster*', 'Cast<AMonster>', 'HitActor', 'MonsterTarget'],
    successCriteria: [
      'Call Cast<AMonster>(HitActor)',
      'Store result in MonsterTarget',
      'Check MonsterTarget before use (if block or IsValid)',
    ],
    rules: [
      {
        id: 'r28_cast',
        type: 'unreal',
        description: 'Cast<AMonster> stored in MonsterTarget',
        evaluate: (code) => ({
          passed: condense(code).includes('AMonster*MonsterTarget=Cast<AMonster>(HitActor);'),
          error: 'Must declare AMonster* MonsterTarget = Cast<AMonster>(HitActor);',
          fix: 'AMonster* MonsterTarget = Cast<AMonster>(HitActor);',
        }),
      },
      {
        id: 'r28_guard',
        type: 'unreal',
        description: 'Null-check before using MonsterTarget',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('if(MonsterTarget)') || c.includes('if(IsValid(MonsterTarget))') || c.includes('if(MonsterTarget!=nullptr)'),
            error: 'Check MonsterTarget for nullptr before using it (if (MonsterTarget) { ... }).',
            fix: 'if (MonsterTarget) { MonsterTarget->TakeHit(); }',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_28a',
        title: 'Standard Cast + null guard',
        code: {
          'Source.cpp': `void OnHit(AActor* HitActor)
{
    AMonster* MonsterTarget = Cast<AMonster>(HitActor);
    if (MonsterTarget)
    {
        MonsterTarget->TakeHit();
    }
}
`,
        },
        explanation: 'Cast<T> returns nullptr on failure. Always guard before use. For objects that might be GC\'d, use IsValid() instead of a raw nullptr check.',
      },
    ],
  };
