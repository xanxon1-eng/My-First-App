import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_32: UTaskDefinition = {
    id: 'task_32',
    title: '32. UE_LOG — Structured Logging',
    category: 'Stage 7: Production Standards',
    objective: `# UE_LOG — Structured Game Logging

\`std::cout\` doesn't work in shipped games. UE_LOG writes to:
- The Output Log panel in the editor
- \`YourProject/Saved/Logs/\` on disk
- The screen (via \`GEngine->AddOnScreenDebugMessage\`)

\`\`\`cpp
UE_LOG(LogCategory, Verbosity, TEXT("format %s"), *SomeString);
\`\`\`

Verbosity levels: \`Fatal\`, \`Error\`, \`Warning\`, \`Display\`, \`Log\`, \`Verbose\`.

In UE5.2+ prefer \`UE_LOGFMT\` which avoids the \`TEXT()\` wrapper and is type-safe:
\`\`\`cpp
#include "Logging/StructuredLog.h"
UE_LOGFMT(LogTemp, Warning, "Loading '{Name}' failed", Package->GetName());
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Write a \`UE_LOG\` call with:
- Category: \`LogTemp\`
- Verbosity: \`Warning\`
- Message: \`TEXT("Booting Sequence Initiated")\`
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

void Practice()
{
    // TODO: Write a UE_LOG statement per the spec
}
`,
    },
    hiddenTests: ['UE_LOG', 'LogTemp', 'Warning', 'TEXT("Booting Sequence Initiated")'],
    successCriteria: [
      'Use UE_LOG macro',
      'Category LogTemp',
      'Verbosity Warning',
      'Message TEXT("Booting Sequence Initiated")',
    ],
    rules: [
      {
        id: 'r29_macro',
        type: 'unreal',
        description: 'Complete UE_LOG macro usage',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('UE_LOG(LogTemp,Warning,TEXT("BootingSequenceInitiated"));'),
            error: 'Ensure syntax matches exactly: UE_LOG(LogTemp, Warning, TEXT("Booting Sequence Initiated"));',
            fix: 'UE_LOG(LogTemp, Warning, TEXT("Booting Sequence Initiated"));',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_29a',
        title: 'Standard UE_LOG call',
        code: {
          'Source.cpp': `void Practice()
{
    UE_LOG(LogTemp, Warning, TEXT("Booting Sequence Initiated"));
}
`,
        },
        explanation: 'For format arguments use %s (FString — dereference with *), %d (int32), %f (float). Example: UE_LOG(LogTemp, Log, TEXT("HP: %d"), Health);',
      },
    ],
  };
