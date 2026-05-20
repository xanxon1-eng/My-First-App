import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_23: UTaskDefinition = {
    id: 'task_23',
    title: '23. Soft References — TSoftObjectPtr',
    category: 'Stage 5: UE5 Pro Features',
    objective: `# Soft vs Hard References

**Hard reference** (\`UTexture2D*\`) — the asset loads *immediately* when the class is loaded, regardless of whether it's needed. With 500 enemy types, that's 500 textures in RAM at spawn.

**Soft reference** (\`TSoftObjectPtr<UTexture2D>\`) — stores only the *asset path*. You load manually when needed:

\`\`\`cpp
TSoftObjectPtr<UTexture2D> IconRef;

// Load on demand (causes a short hitch — prefer async):
UTexture2D* Tex = IconRef.LoadSynchronous();

// Async load:
StreamableManager.RequestAsyncLoad(IconRef.ToSoftObjectPath(), ...);
\`\`\`

Use soft references for content that isn't always needed (character skins, level-specific assets).

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Inside \`UInventoryItem\`, declare a soft pointer to \`UTexture2D\` named \`IconRef\`.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"
#include "InventoryItem.generated.h"

UCLASS()
class UInventoryItem : public UObject
{
    GENERATED_BODY()
public:
    // TODO: Declare TSoftObjectPtr<UTexture2D> IconRef
};
`,
    },
    hiddenTests: ['TSoftObjectPtr<UTexture2D>', 'IconRef'],
    successCriteria: [
      'TSoftObjectPtr<UTexture2D> declared',
      'Named IconRef',
    ],
    rules: [
      {
        id: 'r23_soft',
        type: 'unreal',
        description: 'TSoftObjectPtr<UTexture2D> IconRef;',
        evaluate: (code) => ({
          passed: condense(code).includes('TSoftObjectPtr<UTexture2D>IconRef;'),
          error: 'Must use TSoftObjectPtr<UTexture2D> IconRef;',
          fix: 'TSoftObjectPtr<UTexture2D> IconRef;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_23a',
        title: 'Soft pointer with UPROPERTY',
        code: {
          'Source.h': `UCLASS()
class UInventoryItem : public UObject
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, Category = "Visuals")
    TSoftObjectPtr<UTexture2D> IconRef;
};
`,
        },
        explanation: 'UPROPERTY is still needed so the GC tracks the soft path string and doesn\'t garbage-collect the path data itself.',
      },
    ],
  };
