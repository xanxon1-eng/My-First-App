import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_6: UTaskDefinition = {
    id: 'task_6',
    title: '6. Control Flow — if / else / switch',
    category: 'Stage 1: The Raw Metal',
    objective: `# Control Flow

Programs make decisions. C++ provides:

- **if / else if / else** — condition-based branching
- **switch** — multi-way dispatch on an integer or enum

\`\`\`cpp
if (Health > 50)
{
    State = TEXT("Healthy");
}
else if (Health > 0)
{
    State = TEXT("Wounded");
}
else
{
    State = TEXT("Dead");
}
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Write a function \`FString GetHealthState(int32 Health)\` that:
- Returns \`TEXT("Healthy")\` if \`Health > 50\`
- Returns \`TEXT("Wounded")\` if \`Health > 0\`
- Returns \`TEXT("Dead")\` otherwise
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

// Return a string describing the health state.
FString GetHealthState(int32 Health)
{
    // TODO: implement if/else chain and return appropriate FString
    return TEXT("");
}
`,
    },
    hiddenTests: ['GetHealthState', 'Healthy', 'Wounded', 'Dead'],
    successCriteria: [
      'Return "Healthy" when Health > 50',
      'Return "Wounded" when Health > 0',
      'Return "Dead" otherwise',
    ],
    rules: [
      {
        id: 'r6_healthy',
        type: 'exercise',
        description: '"Healthy" branch correct',
        evaluate: (code) => ({
          passed: condense(code).includes('if(Health>50){returnTEXT("Healthy");}') || condense(code).includes('if(Health>50)returnTEXT("Healthy");'),
          error: 'Missing or incorrect "Healthy" return path.',
          fix: 'if (Health > 50) return TEXT("Healthy");',
        }),
      },
      {
        id: 'r6_wounded',
        type: 'exercise',
        description: '"Wounded" branch correct',
        evaluate: (code) => ({
          passed: condense(code).includes('if(Health>0){returnTEXT("Wounded");}') || condense(code).includes('if(Health>0)returnTEXT("Wounded");'),
          error: 'Missing or incorrect "Wounded" return path.',
          fix: 'else if (Health > 0) return TEXT("Wounded");',
        }),
      },
      {
        id: 'r6_dead',
        type: 'exercise',
        description: '"Dead" branch correct',
        evaluate: (code) => ({
          passed: condense(code).includes('returnTEXT("Dead");'),
          error: 'Missing "Dead" return path.',
          fix: 'return TEXT("Dead");',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_6a',
        title: 'if / else if / else chain',
        explanation: 'Conditions are evaluated top-to-bottom. We guard the widest net last to avoid false positives.',
        code: {
          'Source.cpp': `FString GetHealthState(int32 Health)
{
    if (Health > 50)
        return TEXT("Healthy");
    else if (Health > 0)
        return TEXT("Wounded");
    else
        return TEXT("Dead");
}
`,
        },
      },
    ],
  };
