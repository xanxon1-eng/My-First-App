import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_17: UTaskDefinition = {
    id: 'task_17',
    title: '17. Core UObject Hierarchy',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: `# UObject vs AActor

| Class | Can be placed in world? | Has Transform? | GC? |
|-------|------------------------|----------------|-----|
| \`UObject\` | ❌ | ❌ | ✅ |
| \`AActor\` | ✅ | ✅ (via root component) | ✅ |

Use \`UObject\` for pure data/logic systems (inventory data, ability configurations). Use \`AActor\` when you need a physical presence in the level.

\`\`\`cpp
UCLASS()
class UInventorySystem : public UObject
{
    GENERATED_BODY()
    // Pure logic — no transform, never placed directly
};
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Declare class \`UInventorySystem\` inheriting from \`UObject\`. Include \`UCLASS()\` macro and \`GENERATED_BODY()\`.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"
#include "InventorySystem.generated.h"

// TODO: Declare UInventorySystem inheriting from UObject

`,
    },
    hiddenTests: ['class UInventorySystem', 'public UObject', 'GENERATED_BODY()'],
    successCriteria: [
      'UCLASS() macro present',
      'class UInventorySystem : public UObject',
      'GENERATED_BODY() inside class',
    ],
    rules: [
      {
        id: 'r17_uclass',
        type: 'unreal',
        description: 'UCLASS() macro present',
        evaluate: (code) => ({
          passed: condense(code).includes('UCLASS()'),
          error: 'UObject subclasses require the UCLASS() macro directly above the class.',
          fix: 'UCLASS()',
        }),
      },
      {
        id: 'r17_decl',
        type: 'unreal',
        description: 'class UInventorySystem : public UObject',
        evaluate: (code) => ({
          passed: condense(code).includes('classUInventorySystem:publicUObject{'),
          error: 'Declare UInventorySystem inheriting publicly from UObject.',
          fix: 'class UInventorySystem : public UObject',
        }),
      },
      {
        id: 'r17_gen',
        type: 'unreal',
        description: 'GENERATED_BODY() inside class',
        evaluate: (code) => ({
          passed: condense(code).includes('GENERATED_BODY()'),
          error: 'All UCLASS types must include GENERATED_BODY() inside the class.',
          fix: 'GENERATED_BODY()',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_17a',
        title: 'Minimal UObject subclass',
        code: {
          'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"
#include "InventorySystem.generated.h"

UCLASS()
class UInventorySystem : public UObject
{
    GENERATED_BODY()
public:
    // Inventory operations go here
};
`,
        },
        explanation: 'GENERATED_BODY() is inserted by UHT to add reflection boilerplate. The .generated.h include is mandatory and auto-created.',
      },
    ],
  };
