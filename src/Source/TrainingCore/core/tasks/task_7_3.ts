import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_7_3: UTaskDefinition = {
    id: 'task_7_3',
    title: '7.3. Loops — Range-For Loop',
    category: 'Stage 1: The Raw Metal',
    objective: `# Range-For Loop

Iterating over dynamic arrays is so common that modern C++ added a special syntax for it: the **range-for** loop (C++11).

\`\`\`cpp
TArray<int32> Arr = {1, 2, 3};
for (const int32& Val : Arr) 
{ 
    // Val is 1, then 2, then 3
}
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
In \`SumArray()\`:
1. Use a **range-for** loop to iterate over the provided \`TArray<int32> Numbers\`.
2. Accumulate the total into an \`int32 Total\` variable.
3. Return \`Total\`.
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

int32 SumArray(const TArray<int32>& Numbers)
{
    int32 Total = 0;

    // TODO: use a range-for to accumulate Total

    return Total;
}
`,
    },
    hiddenTests: ['Total', 'for', 'Numbers'],
    successCriteria: [
      'Use a range-for loop over Numbers',
      'Accumulate into Total',
      'Return Total',
    ],
    rules: [
      {
        id: 'r7_3_loop',
        type: 'exercise',
        description: 'Range-for loop over Numbers exists',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('for(int32Val:Numbers)') || c.includes('for(constint32&Val:Numbers)') || c.includes('for(autoVal:Numbers)') || c.includes('for(auto&Val:Numbers)'),
            error: 'Must use a range-based for loop syntax.',
            fix: 'for (const int32& Val : Numbers) { ... }',
          };
        },
      },
      {
        id: 'r7_3_accum',
        type: 'exercise',
        description: 'Total is accumulated',
        evaluate: (code) => ({
          passed: condense(code).includes('Total+='),
          error: 'Must add each element to Total using +=.',
          fix: 'Total += Val;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_7_3a',
        title: 'Range-for accumulation',
        explanation: 'const int32& Val borrows each element without copying. += accumulates. This pattern is identical for std::vector or TArray.',
        code: {
          'Source.cpp': `int32 SumArray(const TArray<int32>& Numbers)
{
    int32 Total = 0;
    for (const int32& Val : Numbers)
    {
        Total += Val;
    }
    return Total;
}
`,
        },
      },
    ],
  };
