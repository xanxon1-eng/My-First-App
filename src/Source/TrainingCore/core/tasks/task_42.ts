import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_42: UTaskDefinition = {
    id: 'task_42',
    title: '42. Move Semantics — MoveTemp',
    category: 'Stage 10: Modern C++ Features',
    objective: `# Move Semantics — Steal, Don't Copy

When you assign one \`FString\` to another, the internal character buffer is **copied** — an allocation + byte-copy. For megabyte strings, this is expensive.

**Move semantics** transfer ownership of the internal buffer — no allocation, no copy:
\`\`\`cpp
FString Source = TEXT("Very Long String...");
FString Target = MoveTemp(Source);   // buffer ownership transferred
// Source is now empty (valid but unspecified state)
\`\`\`

Unreal's \`MoveTemp()\` is equivalent to \`std::move()\`.

Use it when you're done with a variable and want to hand its data to another without copying (e.g., building a string then passing it to a function that stores it).

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Given \`FString SourceInfo\`, declare \`FString TargetInfo\` and initialise it by *moving* from \`SourceInfo\` using \`MoveTemp\`.
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

void SetupStrings()
{
    FString SourceInfo = TEXT("Heavy Data Payload");

    // TODO: Declare FString TargetInfo using MoveTemp(SourceInfo)
}
`,
    },
    hiddenTests: ['FString TargetInfo', 'MoveTemp(SourceInfo)'],
    successCriteria: [
      'Declare FString TargetInfo',
      'Use MoveTemp(SourceInfo) to initialise it',
    ],
    rules: [
      {
        id: 'r37_target_move',
        type: 'exercise',
        description: 'FString TargetInfo = MoveTemp(SourceInfo);',
        evaluate: (code) => ({
          passed: condense(code).includes('FStringTargetInfo=MoveTemp(SourceInfo);'),
          error: 'Must declare FString TargetInfo = MoveTemp(SourceInfo);',
          fix: 'FString TargetInfo = MoveTemp(SourceInfo);',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_37a',
        title: 'MoveTemp initialisation',
        code: {
          'Source.cpp': `void SetupStrings()
{
    FString SourceInfo = TEXT("Heavy Data Payload");
    FString TargetInfo = MoveTemp(SourceInfo);

    // SourceInfo is now empty:
    ensure(SourceInfo.IsEmpty());
    // TargetInfo holds the original buffer:
    UE_LOG(LogTemp, Log, TEXT("TargetInfo: %s"), *TargetInfo);
}
`,
        },
        explanation: 'After MoveTemp, SourceInfo is in a "valid but unspecified" state — always treat it as empty. Use MoveTemp when returning large locals from a function to avoid a copy.',
      },
    ],
  };
