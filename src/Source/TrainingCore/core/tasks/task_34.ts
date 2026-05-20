import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_34: UTaskDefinition = {
    id: 'task_34',
    title: '34. FName vs FText — String Types',
    category: 'Stage 8: Unreal Workflows',
    objective: `# Choosing the Right String Type

| Type | Mutable? | Localisable? | Best for |
|------|---------|--------------|---------|
| \`FName\` | ❌ | ❌ | Asset/tag identification (hashed, fast) |
| \`FText\` | ❌ | ✅ | Any text the **player sees** (UI, subtitles) |
| \`FString\` | ✅ | ❌ | General runtime manipulation |

**Rule of thumb:**
- Player reads it → \`FText\`
- Engine identifies it → \`FName\`
- You manipulate it in code → \`FString\`

\`\`\`cpp
FName   PlayerTag  = TEXT("Player");
FText   Greeting   = FText::FromString(TEXT("Hello"));
FString BuildMsg   = FString::Printf(TEXT("Score: %d"), Score);
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Declare:
1. \`FName PlayerTag = TEXT("Player");\`
2. \`FText Greeting = FText::FromString(TEXT("Hello"));\`
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

void SetupStrings()
{
    // TODO 1: FName PlayerTag = TEXT("Player")
    // TODO 2: FText Greeting = FText::FromString(TEXT("Hello"))
}
`,
    },
    hiddenTests: ['FName PlayerTag', 'FText Greeting', 'FText::FromString'],
    successCriteria: [
      'Declare FName PlayerTag = TEXT("Player")',
      'Declare FText Greeting = FText::FromString(TEXT("Hello"))',
    ],
    rules: [
      {
        id: 'r31_fname',
        type: 'unreal',
        description: 'FName PlayerTag declared',
        evaluate: (code) => ({
          passed: condense(code).includes('FNamePlayerTag=TEXT("Player");'),
          error: 'Must declare FName PlayerTag = TEXT("Player");',
          fix: 'FName PlayerTag = TEXT("Player");',
        }),
      },
      {
        id: 'r31_ftext',
        type: 'unreal',
        description: 'FText Greeting via FText::FromString',
        evaluate: (code) => ({
          passed: condense(code).includes('FTextGreeting=FText::FromString(TEXT("Hello"));'),
          error: 'Must declare FText Greeting using FText::FromString(TEXT("Hello"));',
          fix: 'FText Greeting = FText::FromString(TEXT("Hello"));',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_31a',
        title: 'All three string types compared',
        code: {
          'Source.cpp': `void SetupStrings()
{
    FName   PlayerTag = TEXT("Player");                        // hashed, immutable
    FText   Greeting  = FText::FromString(TEXT("Hello"));      // localisable
    FString ChatMsg   = FString::Printf(TEXT("Hi, %s!"), *Greeting.ToString()); // manipulable
}
`,
        },
        explanation: 'In production, use NSLOCTEXT("Namespace", "Key", "Hello") for FText instead of FromString — it integrates with the localization pipeline.',
      },
    ],
  };
