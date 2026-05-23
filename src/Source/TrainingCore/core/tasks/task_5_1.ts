import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_5_1: UTaskDefinition = {
    id: 'task_5_1',
    title: '5.1. Dynamic Arrays — TArray Reserve & TInlineAllocator',
    category: 'Stage 1: The Raw Metal',
    objective: `# Dynamic Arrays: TArray Reserve & TInlineAllocator

When building high-performance systems like inventory or combat modifiers, dynamically growing arrays like default \`TArray\` or \`std::vector\` cause expensive heap allocations when they hit capacity limits.

### 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-1.5ms to -4.5ms)**: Moving dynamic resizing structures into pre-allocated memory or high-speed CPU Stack blocks prevents dynamic resizing and copy overhead, dropping Game Thread costs under heavy loops.
*   **GPU Impact (Indirectly -2.0ms)**: Bypassing heap allocations on thread hot-paths enables stable, high-cadence draw dispatches to keep the Render Pipeline saturated.
*   **RAM Impact (Saves 80MB+ across levels)**: Minimises internal array slack buffers.
*   **VRAM Impact (0.0ms directly)**: Non-GPU structures.
*   **Latency & Ping Impact (-15ms)**: Skipping pointer-chasing and dynamic allocations inside networking loops.

### ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**: \`TArray<Type, TInlineAllocator<N>>\` which stores elements on the fast stack, and \`Reserve(N)\` to pre-size heap vectors up-front.
*   ⚠️ **What UE5 Lacks**: Native tracking of array slack waste; developer must profile allocations to spot bloat.

## Your Task
Write a function \`TArray<int32, TInlineAllocator<8>> PrepareScores()\` that:
1. Declares a \`TArray<int32, TInlineAllocator<8>> Scores;\`
2. Reserves \`8\` spaces up front to avoid resizing costs.
3. Adds \`100\`, \`200\`, and \`300\` via \`Scores.Add()\`.
4. Returns \`Scores\`.
`,
    starterCode: {
      'Source.cpp': `TArray<int32, TInlineAllocator<8>> PrepareScores()
{
    // TODO 1: Declare Scores with TInlineAllocator<8>
    // TODO 2: Reserve 8 elements
    // TODO 3: Add 100, 200, 300
    // TODO 4: Return Scores
}
`,
    },
    hiddenTests: ['TInlineAllocator<8>', 'Reserve(8)', 'Add(100)', 'Add(200)', 'Add(300)'],
    successCriteria: [
      'Declare TArray<int32, TInlineAllocator<8>> Scores',
      'Call Scores.Reserve(8) to pre-allocate',
      'Add values and return Scores'
    ],
    rules: [
      {
        id: 'r5_1_decl',
        type: 'exercise',
        description: 'TArray<int32, TInlineAllocator<8>> Scores declared',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('TArray<int32,TInlineAllocator<8>>Scores;'),
            error: 'Declare TArray<int32, TInlineAllocator<8>> Scores;',
            fix: 'TArray<int32, TInlineAllocator<8>> Scores;'
          };
        }
      },
      {
        id: 'r5_1_res',
        type: 'exercise',
        description: 'Scores.Reserve(8) is called',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('Scores.Reserve(8);'),
            error: 'You must call Scores.Reserve(8); before adding elements to avoid runtime heap resizing.',
            fix: 'Scores.Reserve(8);'
          };
        }
      },
      {
        id: 'r5_1_adds',
        type: 'exercise',
        description: 'Adds 100, 200, 300',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('Scores.Add(100);') && c.includes('Scores.Add(200);') && c.includes('Scores.Add(300);'),
            error: 'You must add 100, 200, and 300 to dynamic Scores using Scores.Add().',
            fix: 'Scores.Add(100);\nScores.Add(200);\nScores.Add(300);'
          };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_5_1',
        title: 'Contiguous Inline Allocated Array',
        explanation: 'Inline Allocator structures pre-allocate array blocks in high-speed local stack memory, dodging structural heap allocation stalls completely.',
        code: {
          'Source.cpp': `TArray<int32, TInlineAllocator<8>> PrepareScores()
{
    TArray<int32, TInlineAllocator<8>> Scores;
    Scores.Reserve(8);
    Scores.Add(100);
    Scores.Add(200);
    Scores.Add(300);
    return Scores;
}
`
        }
      }
    ]
};
