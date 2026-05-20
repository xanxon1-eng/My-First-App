import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_27: UTaskDefinition = {
    id: 'task_27',
    title: '27. USTRUCT — Blueprint Data Containers',
    category: 'Stage 6: Blueprint Integration',
    objective: `# USTRUCT — Plain Data for Blueprint

When you want to group related data (item name, weight, durability) into a single Blueprint variable, use \`USTRUCT\`.

Unlike \`UCLASS\`:
- Structs have **no garbage collector**. They hold data, not UObject ownership.
- Structs are **copied** when passed by value — cheap for small data, expensive for large.
- Use \`F\` prefix (Unreal convention for structs).

\`\`\`cpp
USTRUCT(BlueprintType)
struct FItemData
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FName ItemName;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    float Weight = 1.0f;
};
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Declare \`FItemData\` with \`USTRUCT(BlueprintType)\` and \`GENERATED_BODY()\`. Add at least one UPROPERTY member.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "ItemData.generated.h"

// TODO: Declare FItemData struct with USTRUCT(BlueprintType)
`,
    },
    hiddenTests: ['USTRUCT(BlueprintType)', 'struct FItemData', 'GENERATED_BODY()'],
    successCriteria: [
      'USTRUCT(BlueprintType) macro',
      'struct FItemData declared',
      'GENERATED_BODY() present',
    ],
    rules: [
      {
        id: 'r25_struct_decl',
        type: 'unreal',
        description: 'USTRUCT(BlueprintType) struct FItemData',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('USTRUCT(BlueprintType)') && c.includes('structFItemData{'),
            error: 'Declare USTRUCT(BlueprintType) struct FItemData',
            fix: 'USTRUCT(BlueprintType)\nstruct FItemData { ... };',
          };
        },
      },
      {
        id: 'r25_gen',
        type: 'unreal',
        description: 'GENERATED_BODY() inside struct',
        evaluate: (code) => ({
          passed: condense(code).includes('GENERATED_BODY()'),
          error: 'Structs used with UHT must contain GENERATED_BODY().',
          fix: 'GENERATED_BODY()',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_25a',
        title: 'FItemData with two members',
        code: {
          'Source.h': `USTRUCT(BlueprintType)
struct FItemData
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Item")
    FName ItemName;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Item")
    float Weight = 1.0f;
};
`,
        },
        explanation: 'struct members must also be decorated with UPROPERTY() to be visible in Blueprint. Structs without UPROPERTY members are still useful in C++ but invisible to BP.',
      },
    ],
  };
