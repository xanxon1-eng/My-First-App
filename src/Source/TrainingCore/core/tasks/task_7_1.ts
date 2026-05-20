import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_7_1: UTaskDefinition = {
    id: 'task_7_1',
    title: '7.1. Loops — Classic For Loop',
    category: 'Stage 1: The Raw Metal',
    objective: `# Classic For Loop

The standard indexed \`for\` loop is used when you know exactly how many times you want to iterate or need the current index.

\`\`\`cpp
for (int32 i = 0; i < 5; ++i) 
{ 
    // i goes from 0 to 4
}
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Write a function \`int32 SumFirstN(int32 N)\` that:
1. Uses a classic \`for\` loop to iterate from \`1\` up to and including \`N\`.
2. Accumulates these values into a \`Total\` variable.
3. Returns \`Total\`.
(If N is 3, it should return 1 + 2 + 3 = 6).
`,
    starterCode: {
      'Source.cpp': `int32 SumFirstN(int32 N)
{
    int32 Total = 0;

    // TODO: use a for loop from 1 to N to accumulate Total

    return Total;
}
`,
    },
    hiddenTests: ['SumFirstN', 'for', 'Total'],
    successCriteria: [
      'Use a for loop',
      'Accumulate the index into Total',
      'Return Total',
    ],
    rules: [
      {
        id: 'r7_1_loop',
        type: 'exercise',
        description: 'A classic for loop from 1 to N',
        evaluate: (code) => {
          const c = condense(code);
          const ok = c.includes('for(int32i=1;i<=N;++i)') || c.includes('for(int32i=1;i<=N;i++)');
          return {
            passed: ok,
            error: 'Must use a for loop specifically from 1 up to and including N ( i <= N ).',
            fix: 'for (int32 i = 1; i <= N; ++i)',
          };
        },
      },
      {
        id: 'r7_1_accum',
        type: 'exercise',
        description: 'Total is accumulated inside the loop',
        evaluate: (code) => ({
          passed: condense(code).includes('Total+=i;') || condense(code).includes('Total=Total+i;'),
          error: 'Must add the loop index (i) to Total.',
          fix: 'Total += i;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_7_1a',
        title: 'Standard sequential accumulation',
        explanation: 'We iterate from 1 up to N (inclusive) by checking i <= N.',
        code: {
          'Source.cpp': `int32 SumFirstN(int32 N)
{
    int32 Total = 0;
    for (int32 i = 1; i <= N; ++i)
    {
        Total += i;
    }
    return Total;
}
`,
        },
      },
    ],
  };
