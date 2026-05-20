import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_10: UTaskDefinition = {
    id: 'task_10',
    title: '10. FString & the TEXT() Macro',
    category: 'Stage 2: Code Structure & Memory',
    objective: `# FString and TEXT()

Unreal has three string types. Pick the right one:

| Type | Use when… |
|------|-----------|
| \`FName\` | Identifying objects (fast hash, immutable) |
| \`FText\` | Displaying text to the player (localisable) |
| \`FString\` | General runtime string manipulation |

Every string literal in Unreal **must** be wrapped in \`TEXT()\`:
\`\`\`cpp
FString Name = TEXT("Commando");
\`\`\`

Without \`TEXT()\` the literal is ANSI-encoded. On certain platforms (or with certain compilers), this breaks Unicode characters and potentially causes encoding mismatches at runtime.

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Declare an \`FString\` named \`PlayerName\` and set it to \`TEXT("Commando")\`.
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

void Practice()
{
    // TODO: Declare FString PlayerName = TEXT("Commando")
}
`,
    },
    hiddenTests: ['FString PlayerName', 'TEXT(', '"Commando"'],
    successCriteria: [
      'Declare FString PlayerName',
      'Use the TEXT() macro',
      'Value is "Commando"',
    ],
    rules: [
      {
        id: 'r10_fstring',
        type: 'unreal',
        description: 'FString PlayerName declared',
        evaluate: (code) => ({
          passed: condense(code).includes('FStringPlayerName='),
          error: 'Must declare FString PlayerName.',
          fix: 'FString PlayerName = TEXT("Commando");',
        }),
      },
      {
        id: 'r10_text',
        type: 'unreal',
        description: 'TEXT() macro used with "Commando"',
        evaluate: (code) => ({
          passed: condense(code).includes('TEXT("Commando");'),
          error: 'Set the value to TEXT("Commando"). Make sure casing is exact.',
          fix: 'FString PlayerName = TEXT("Commando");',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_10a',
        title: 'Standard FString declaration',
        code: {
          'Source.cpp': `void Practice()
{
    FString PlayerName = TEXT("Commando");
}
`,
        },
        explanation: 'TEXT() wraps the literal in the correct Unicode encoding macro for the current platform.',
      },
    ],
  };
