import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_7_5: UTaskDefinition = {
    id: 'task_7_5',
    title: '7.5. Loops — Nested Loops & 2D Data',
    category: 'Stage 1: The Raw Metal',
    objective: `# Nested Loops

Sometimes you need to iterate through data that has multiple dimensions, like a grid of pixels or a map of tiles. You can place one loop inside another.

\`\`\`cpp
for (int32 y = 0; y < Height; ++y)
{
    for (int32 x = 0; x < Width; ++x)
    {
        // Executes Width * Height times total
    }
}
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Write a function \`bool HasDuplicate(const TArray<int32>& Numbers)\` that checks if the array contains any duplicate values.
1. Use an outer loop to pick the first number.
2. Use an inner loop to compare it against the rest of the numbers.
3. If they match, return \`true\`.
4. If you finish checking everything with no matches, return \`false\`.

*(Hint: to avoid comparing the element to itself, your inner loop should start at \`i + 1\` if using a classic \`for\` loop).*
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

bool HasDuplicate(const TArray<int32>& Numbers)
{
    // TODO: use nested loops to find if any two numbers are identical
    
    return false;
}
`,
    },
    hiddenTests: ['for', 'Numbers', 'true', 'false'],
    successCriteria: [
      'Two nested loops are present',
      'Compare elements',
      'Return true when a match is found',
      'Return false if no matches',
    ],
    rules: [
      {
        id: 'r7_5_nested',
        type: 'exercise',
        description: 'Nested loops used (for inside another for)',
        evaluate: (code) => {
           const c = condense(code);
           // Robust AST-lite check: find a 'for(' that is followed by another 'for(' before its closing brace.
           const match = c.match(/for\([^)]*\)\s*\{[^{}]*for\(/);
           // Also allow the no-brace single-line version
           const matchNoBrace = c.match(/for\([^)]*\)\s*for\(/);
           return {
               passed: match !== null || matchNoBrace !== null,
               error: 'You need an inner loop inside the outer loop.',
               fix: 'for(...) { for(...) { ... } }'
           };
        },
      },
      {
        id: 'r7_5_compare',
        type: 'exercise',
        description: 'Comparison between two array elements',
        evaluate: (code) => ({
          passed: condense(code).includes('Numbers[i]==Numbers[j]') || condense(code).includes('Numbers[j]==Numbers[i]'),
          error: 'Must compare two elements of the array using ==.',
          fix: 'if (Numbers[i] == Numbers[j]) return true;',
        }),
      },
      {
        id: 'r7_5_return_true',
        type: 'exercise',
        description: 'Returns true on match',
        evaluate: (code) => ({
          passed: condense(code).includes('returntrue;'),
          error: 'Must return true when a duplicate is matched.',
          fix: 'return true;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_7_5a',
        title: 'Classic nested index matching (O(N^2))',
        explanation: 'We test each element against every subsequent element. If a match is found, we immediately exit the function with true.',
        code: {
          'Source.cpp': `bool HasDuplicate(const TArray<int32>& Numbers)
{
    int32 Count = Numbers.Num();
    for (int32 i = 0; i < Count; ++i)
    {
        for (int32 j = i + 1; j < Count; ++j)
        {
            if (Numbers[i] == Numbers[j])
            {
                return true;
            }
        }
    }
    return false;
}
`,
        },
      },
    ],
  };
