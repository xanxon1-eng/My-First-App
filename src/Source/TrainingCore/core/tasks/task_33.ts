import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_33: UTaskDefinition = {
    id: 'task_33',
    title: '33. Naming Conventions — Hungarian Prefixes',
    category: 'Stage 8: Unreal Workflows',
    objective: `# Naming Conventions in Unreal Engine

UHT and the engine rely on prefix conventions for reflection and code generation:

| Prefix | Class type | Example |
|--------|-----------|---------|
| \`A\` | Actor | \`APlayerCharacter\` |
| \`U\` | UObject component | \`UHealthComponent\` |
| \`F\` | Struct / value type | \`FVector\`, \`FHitResult\` |
| \`E\` | Enum | \`EPlayerState\` |
| \`I\` | Interface | \`IDamageable\` |
| \`T\` | Template | \`TArray<T>\` |
| \`b\` | Boolean member | \`bIsJumping\` |
| \`G\` | Global | \`GEngine\` |

Violating naming conventions causes UHT compilation errors.

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Declare a boolean member variable for "is the player jumping" using the correct Unreal prefix. Initialise it to \`false\`.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "Player.generated.h"

UCLASS()
class APlayer : public ACharacter
{
    GENERATED_BODY()
public:
    // TODO: Declare a bool with correct UE naming for "is jumping", set to false
};
`,
    },
    hiddenTests: ['bool bIsJumping', 'false'],
    successCriteria: [
      'Variable named bIsJumping (b prefix)',
      'Type bool',
      'Initialised to false',
    ],
    rules: [
      {
        id: 'r30_name_init',
        type: 'exercise',
        description: 'bool bIsJumping = false',
        evaluate: (code) => ({
          passed: condense(code).includes('boolbIsJumping=false;'),
          error: 'Variable must be named bIsJumping (Unreal boolean prefix b) and initialised to false.',
          fix: 'bool bIsJumping = false;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_30a',
        title: 'Correct boolean with UPROPERTY',
        code: {
          'Source.h': `class APlayer : public ACharacter
{
    GENERATED_BODY()
public:
    UPROPERTY(BlueprintReadOnly, Category = "Movement")
    bool bIsJumping = false;
};
`,
        },
        explanation: 'The b prefix is mandatory — UHT enforces it and other engineers rely on it for quick type identification at a glance.',
      },
    ],
  };
