import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_5: UTaskDefinition = {
    id: 'task_5',
    title: '5. Dynamic Arrays — std::vector & TArray',
    category: 'Stage 1: The Raw Metal',
    objective: `# Dynamic Arrays: std::vector & TArray

When the number of elements isn't known at compile-time, we use **dynamic arrays** that resize at runtime.

| | std::vector | TArray (Unreal) |
|-|------------|----------------|
| Header | \`<vector>\` | automatic in UE |
| Add | \`.push_back(x)\` | \`.Add(x)\` |
| Count | \`.size()\` | \`.Num()\` |

Unreal wrote \`TArray\` because \`std::vector\` caused memory fragmentation inside the engine's custom allocators. The APIs are nearly identical — once you know one, you know the other.

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
1. Declare \`std::vector<int32> Scores;\`
2. Add \`100\`, \`200\`, and \`300\` using \`.push_back()\`.
`,
    starterCode: {
      'Source.cpp': `#include <vector>

void Practice()
{
    // TODO 1: Declare std::vector<int32> Scores
    // TODO 2: Add 100, 200, 300 via push_back
}
`,
    },
    hiddenTests: ['std::vector<int32> Scores', 'push_back'],
    successCriteria: [
      'Declare std::vector<int32> Scores',
      'Call push_back to add at least three values',
    ],
    rules: [
      {
        id: 'r5_vec',
        type: 'exercise',
        description: 'std::vector<int32> Scores declared',
        evaluate: (code) => ({
          passed: condense(code).includes('std::vector<int32>Scores;'),
          error: 'Declare std::vector<int32> Scores;',
          fix: 'std::vector<int32> Scores;',
        }),
      },
      {
        id: 'r5_push',
        type: 'exercise',
        description: 'push_back called with correct values',
        evaluate: (code) => {
          const c = condense(code);
          const passed = c.includes('Scores.push_back(100);') && 
                         c.includes('Scores.push_back(200);') && 
                         c.includes('Scores.push_back(300);');
          return {
            passed,
            error: `Need to push_back 100, 200, and 300 specifically.`,
            fix: `Scores.push_back(100);\nScores.push_back(200);\nScores.push_back(300);`,
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_5a',
        title: 'Sequential push_back',
        explanation: 'Each push_back appends one element to the heap-allocated internal buffer.',
        code: {
          'Source.cpp': `#include <vector>

void Practice()
{
    std::vector<int32> Scores;
    Scores.push_back(100);
    Scores.push_back(200);
    Scores.push_back(300);
}
`,
        },
      },
    ],
  };
