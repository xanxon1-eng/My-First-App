import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_16: UTaskDefinition = {
    id: 'task_16',
    title: '16. Const Correctness',
    category: 'Stage 3: Unreal Core & Data',
    objective: `# Const Correctness

\`const\` is a compile-time promise: "I will not modify this."

Benefits:
- **Safety** — the compiler prevents accidental writes.
- **Clarity** — readers know a function is read-only.
- **Optimisation** — const enables more aggressive inlining.

\`\`\`cpp
// Can't modify Name inside — efficient (no copy) and safe
void PrintName(const FString& Name)
{
    UE_LOG(LogTemp, Log, TEXT("%s"), *Name);
}
\`\`\`

In Unreal, const member functions signal that calling them doesn't change the object's observable state:
\`\`\`cpp
float GetHealth() const { return Health; }
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Write \`void PrintName(const FString& Name)\`. The body can be empty.
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

// TODO: Write PrintName that takes a const FString& Name
`,
    },
    hiddenTests: ['PrintName', 'const FString&', 'Name'],
    successCriteria: [
      'Function PrintName exists',
      'Parameter is const FString& Name',
    ],
    rules: [
      {
        id: 'r16_fn',
        type: 'exercise',
        description: 'void PrintName(const FString& Name)',
        evaluate: (code) => ({
          passed: condense(code).includes('voidPrintName(constFString&Name)'),
          error: 'Function signature must exactly match: void PrintName(const FString& Name)',
          fix: 'void PrintName(const FString& Name) { }',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_16a',
        title: 'Const reference parameter with logging',
        code: {
          'Source.cpp': `void PrintName(const FString& Name)
{
    // *Name converts FString to TCHAR* for UE_LOG
    UE_LOG(LogTemp, Log, TEXT("Player name: %s"), *Name);
}
`,
        },
        explanation: 'The * before Name dereferences the FString into a raw TCHAR* which UE_LOG expects for %s format specifiers.',
      },
    ],
  };
