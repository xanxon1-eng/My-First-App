import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_39: UTaskDefinition = {
    id: 'task_39',
    title: '39. The auto Keyword',
    category: 'Stage 10: Modern C++ Features',
    objective: `# auto — Type Deduction

\`auto\` tells the compiler to deduce the type from the initialiser. It removes redundancy:

\`\`\`cpp
// Verbose:
TMap<FName, TArray<FHitResult>>::TIterator It = Map.CreateIterator();

// auto:
auto It = Map.CreateIterator();   // same type, less noise
\`\`\`

**When to use auto** (Unreal style guide):
- ✅ Iterator types / range-for variables
- ✅ When the type appears on the same line (e.g., casts, MakeShared)
- ❌ Function return types visible to callers (hides the return type)
- ❌ UPROPERTY members (UHT needs explicit types)

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Declare a variable named \`MyAutoVar\` using \`auto\` and set it to \`100.5f\`.
`,
    starterCode: {
      'Source.cpp': `void Practice()
{
    // TODO: Declare auto MyAutoVar = 100.5f
}
`,
    },
    hiddenTests: ['auto MyAutoVar', '100.5f'],
    successCriteria: [
      'Use the auto keyword',
      'Variable named MyAutoVar',
      'Initialised to 100.5f',
    ],
    rules: [
      {
        id: 'r34_auto_val',
        type: 'exercise',
        description: 'auto MyAutoVar = 100.5f;',
        evaluate: (code) => ({
          passed: condense(code).includes('autoMyAutoVar=100.5f;'),
          error: 'Declare: auto MyAutoVar = 100.5f; (remember the f suffix)',
          fix: 'auto MyAutoVar = 100.5f;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_34a',
        title: 'auto with float literal',
        code: {
          'Source.cpp': `void Practice()
{
    auto MyAutoVar = 100.5f;  // deduced as float

    // auto is especially useful with complex iterator types:
    TArray<int32> Arr = {1, 2, 3};
    for (auto& Val : Arr) { Val *= 2; }
}
`,
        },
        explanation: 'Without the f suffix, 100.5 would be a double literal and MyAutoVar would be deduced as double — a subtle type mismatch.',
      },
    ],
  };
