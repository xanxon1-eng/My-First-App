import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_7_4: UTaskDefinition = {
    id: 'task_7_4',
    title: '7.4. Loops — Break and Continue',
    category: 'Stage 1: The Raw Metal',
    objective: `# Flow Control inside Loops

You can alter the natural flow of a loop:
- **\`break;\`** — Exits the loop immediately, continuing with the code after the loop.
- **\`continue;\`** — Skips the rest of the current iteration and jumps straight to the next iteration.

\`\`\`cpp
for (int32 i = 0; i < 10; ++i)
{
    if (i == 2) continue; // skips 2
    if (i == 5) break;    // stops entirely when 5 is reached
}
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Write a function \`int32 SumPositiveUntilZero(const TArray<int32>& Numbers)\` that:
1. Iterates over \`Numbers\`.
2. If it encounters a zero (\`0\`), it should stop iterating entirely (\`break\`).
3. If it encounters a negative number (\`< 0\`), it should skip it (\`continue\`).
4. Otherwise, it adds the positive number to a \`Total\`.
5. Returns the \`Total\`.
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

int32 SumPositiveUntilZero(const TArray<int32>& Numbers)
{
    int32 Total = 0;

    // TODO: iterate over Numbers
    // TODO: break on 0
    // TODO: continue on negative numbers
    // TODO: accumulate positive numbers

    return Total;
}
`,
    },
    hiddenTests: ['break', 'continue', 'Total', 'for'],
    successCriteria: [
      'Use a break statement for zero',
      'Use a continue statement for negative values',
      'Accumulate positive values into Total',
    ],
    rules: [
      {
        id: 'r7_4_break',
        type: 'exercise',
        description: 'break statement used on 0',
        evaluate: (code) => ({
          passed: condense(code).includes('==0){break;}') || condense(code).includes('==0)break;'),
          error: 'Must break when the value is zero.',
          fix: 'if (Val == 0) break;',
        }),
      },
      {
        id: 'r7_4_continue',
        type: 'exercise',
        description: 'continue statement used on < 0',
        evaluate: (code) => ({
          passed: condense(code).includes('<0){continue;}') || condense(code).includes('<0)continue;'),
          error: 'Must use continue for negative values.',
          fix: 'if (Val < 0) continue;',
        }),
      },
      {
        id: 'r7_4_accum',
        type: 'exercise',
        description: 'Total accumulation',
        evaluate: (code) => ({
          passed: condense(code).includes('Total+='),
          error: 'Total must accumulate the valid iterations.',
          fix: 'Total += Val;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_7_4a',
        title: 'Filtering with break and continue',
        explanation: 'We skip negative values using continue, and stop the entire loop process hitting 0 using break.',
        code: {
          'Source.cpp': `int32 SumPositiveUntilZero(const TArray<int32>& Numbers)
{
    int32 Total = 0;
    for (int32 Val : Numbers)
    {
        if (Val == 0)
        {
            break;
        }
        if (Val < 0)
        {
            continue;
        }
        Total += Val;
    }
    return Total;
}
`,
        },
      },
    ],
  };
