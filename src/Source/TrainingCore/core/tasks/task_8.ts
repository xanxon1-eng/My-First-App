import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_8: UTaskDefinition = {
    id: 'task_8',
    title: '8. UPROPERTY Macro Specifiers',
    category: 'Stage 2: Code Structure & Memory',
    objective: `# UPROPERTY — Exposing Variables to the Engine

A plain C++ member variable inside a UCLASS is **invisible** to:
- The Unreal Editor details panel
- Blueprint visual scripting
- The Garbage Collector

\`UPROPERTY()\` tells the Unreal Header Tool (UHT) to register the variable with the reflection system.

Common specifiers:
| Specifier | Effect |
|-----------|--------|
| \`EditAnywhere\` | Editable in the editor on any instance or default |
| \`BlueprintReadWrite\` | Readable and writable from Blueprint graphs |
| \`Category = "Name"\` | Groups the property in the details panel |

\`\`\`cpp
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Combat")
int32 Health = 100;
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
The class has a bare \`int32 Health\`. Add a \`UPROPERTY\` macro above it that includes **both** \`EditAnywhere\` and \`BlueprintReadWrite\`.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "MyCharacter.generated.h"

UCLASS()
class AMyCharacter : public ACharacter
{
    GENERATED_BODY()

public:
    // TODO: Add UPROPERTY(EditAnywhere, BlueprintReadWrite) above Health
    int32 Health = 100;
};
`,
    },
    hiddenTests: ['UPROPERTY', 'EditAnywhere', 'BlueprintReadWrite'],
    successCriteria: [
      'Add UPROPERTY() macro',
      'Include EditAnywhere specifier',
      'Include BlueprintReadWrite specifier',
    ],
    rules: [
      {
        id: 'r8_macro',
        type: 'unreal',
        description: 'UPROPERTY macro present',
        evaluate: (code) => ({
          passed: condense(code).includes('UPROPERTY('),
          error: 'Missing UPROPERTY macro.',
          fix: 'UPROPERTY(EditAnywhere, BlueprintReadWrite)',
        }),
      },
      {
        id: 'r8_edit_bp',
        type: 'unreal',
        description: 'EditAnywhere & BlueprintReadWrite specifiers',
        evaluate: (code) => ({
          passed: hasStr(code, 'EditAnywhere') && hasStr(code, 'BlueprintReadWrite'),
          error: 'Missing EditAnywhere or BlueprintReadWrite specifiers inside the macro.',
          fix: 'UPROPERTY(EditAnywhere, BlueprintReadWrite)',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_8a',
        title: 'Minimal UPROPERTY',
        explanation: 'The macro goes on the line directly above the member. UHT reads the .h file to generate reflection data.',
        code: {
          'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "MyCharacter.generated.h"

UCLASS()
class AMyCharacter : public ACharacter
{
    GENERATED_BODY()

public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Combat")
    int32 Health = 100;
};
`,
        },
      },
    ],
  };
