import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_15: UTaskDefinition = {
    id: 'task_15',
    title: '15. Reference vs Pointer — Pass by Reference',
    category: 'Stage 3: Unreal Core & Data',
    objective: `# Reference vs Pointer

Copying large objects into functions is slow. C++ offers two ways to pass "by address":

| | Pointer \`T*\` | Reference \`T&\` |
|-|--------------|----------------|
| Can be null | ✅ yes | ❌ never null |
| Can be reassigned | ✅ yes | ❌ no |
| Syntax at call site | \`Fn(&val)\` | \`Fn(val)\` |
| Out-parameter idiom | common | preferred in UE |

\`const T&\` = read-only reference (no copy, no modification).
\`T&\` = mutable reference — acts as an **out parameter**.

\`\`\`cpp
void TakeDamage(int32& OutHealth)
{
    OutHealth -= 10;   // modifies the caller's variable
}
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Implement \`void TakeDamage(int32& OutHealth)\`. Inside, subtract **10** from \`OutHealth\`.
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

// TODO: Implement TakeDamage that takes int32 by mutable reference and subtracts 10
`,
    },
    hiddenTests: ['TakeDamage', 'int32&', 'OutHealth'],
    successCriteria: [
      'Function named TakeDamage',
      'Parameter is int32& OutHealth (mutable reference)',
      'Subtract 10 from OutHealth',
    ],
    rules: [
      {
        id: 'r15_sig',
        type: 'exercise',
        description: 'TakeDamage(int32& OutHealth) signature',
        evaluate: (code) => ({
          passed: condense(code).includes('voidTakeDamage(int32&OutHealth)'),
          error: 'Function signature must be: void TakeDamage(int32& OutHealth)',
          fix: 'void TakeDamage(int32& OutHealth) { ... }',
        }),
      },
      {
        id: 'r15_sub',
        type: 'exercise',
        description: 'OutHealth reduced by 10',
        evaluate: (code) => ({
          passed: condense(code).includes('OutHealth-=10;') || condense(code).includes('OutHealth=OutHealth-10;'),
          error: 'Must subtract 10 from OutHealth.',
          fix: 'OutHealth -= 10;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_15a',
        title: 'Mutable reference out-parameter',
        code: {
          'Source.cpp': `void TakeDamage(int32& OutHealth)
{
    OutHealth -= 10;
}
`,
        },
        explanation: 'Because OutHealth is a reference, -= modifies the variable the *caller* passed in — no copy, no return value needed.',
      },
    ],
  };
