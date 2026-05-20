import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_22: UTaskDefinition = {
    id: 'task_22',
    title: '22. Subsystems — The Pro Singleton',
    category: 'Stage 5: UE5 Pro Features',
    objective: `# Subsystems — Auto-Managed Global Services

The old way to make a global system was a Singleton stored on GameMode or GameInstance — one god-class with thousands of lines. Subsystems fix this by auto-creating separate objects scoped to their lifetime:

| Subsystem type | Lifetime |
|---|---|
| \`UEngineSubsystem\` | Engine |
| \`UGameInstanceSubsystem\` | Game session |
| \`UWorldSubsystem\` | Level/World |
| \`ULocalPlayerSubsystem\` | Per local player |

Subsystems are automatically created and destroyed — you never call \`new\` or \`delete\`.

\`\`\`cpp
// Access from anywhere:
UQuestManager* QM = GetGameInstance()->GetSubsystem<UQuestManager>();
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Declare \`UQuestManager\` inheriting from \`UGameInstanceSubsystem\`. Include \`UCLASS()\` and \`GENERATED_BODY()\`.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "QuestManager.generated.h"

// TODO: Declare UQuestManager : public UGameInstanceSubsystem
`,
    },
    hiddenTests: ['class UQuestManager', 'UGameInstanceSubsystem', 'GENERATED_BODY()'],
    successCriteria: [
      'UCLASS() macro',
      'UQuestManager inherits from UGameInstanceSubsystem',
      'GENERATED_BODY() present',
    ],
    rules: [
      {
        id: 'r22_decl',
        type: 'unreal',
        description: 'UCLASS() class UQuestManager : public UGameInstanceSubsystem',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('UCLASS()classUQuestManager:publicUGameInstanceSubsystem{GENERATED_BODY()'),
            error: 'Declare class UQuestManager : public UGameInstanceSubsystem with UCLASS() and GENERATED_BODY().',
            fix: 'UCLASS()\nclass UQuestManager : public UGameInstanceSubsystem\n{\nGENERATED_BODY()\n};',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_22a',
        title: 'Minimal UGameInstanceSubsystem',
        code: {
          'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "QuestManager.generated.h"

UCLASS()
class UQuestManager : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    virtual void Initialize(FSubsystemCollectionBase& Collection) override;
    virtual void Deinitialize() override;
};
`,
        },
        explanation: 'Override Initialize/Deinitialize instead of BeginPlay/EndPlay — these are the subsystem lifecycle callbacks. The engine calls them automatically.',
      },
    ],
  };
