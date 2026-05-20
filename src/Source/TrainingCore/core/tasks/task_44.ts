import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_44: UTaskDefinition = {
    id: 'task_44',
    title: '44. GameMode Architecture',
    category: 'Stage 11: Framework Architecture',
    objective: `# GameMode — The Rules of the Match

\`AGameModeBase\` defines *how* the game is played:
- Which Pawn class is used
- Which PlayerController class is used
- Win/loss conditions
- Match state

It exists **only on the server** (or in single-player). Never put client-side UI logic here.

\`AGameMode\` extends \`AGameModeBase\` with multiplayer-specific features (match states, ready-to-start checks). For simpler games, \`AGameModeBase\` is sufficient.

\`\`\`cpp
UCLASS()
class AMyGameMode : public AGameModeBase
{
    GENERATED_BODY()
public:
    AMyGameMode();
    virtual void PostLogin(APlayerController* NewPlayer) override;
};
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Declare \`AMyGameMode\` inheriting from \`AGameModeBase\` with \`UCLASS()\` and \`GENERATED_BODY()\`.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "GameFramework/GameModeBase.h"
#include "MyGameMode.generated.h"

// TODO: Declare AMyGameMode inheriting from AGameModeBase
`,
    },
    hiddenTests: ['class AMyGameMode', 'AGameModeBase', 'GENERATED_BODY()'],
    successCriteria: [
      'UCLASS() macro',
      'class AMyGameMode : public AGameModeBase',
      'GENERATED_BODY()',
    ],
    rules: [
      {
        id: 'r39_decl_full',
        type: 'unreal',
        description: 'Complete UCLASS AMyGameMode declaration',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('UCLASS()classAMyGameMode:publicAGameModeBase{GENERATED_BODY()'),
            error: 'Ensure you have UCLASS(), class AMyGameMode : public AGameModeBase, and GENERATED_BODY().',
            fix: 'UCLASS()\nclass AMyGameMode : public AGameModeBase\n{\nGENERATED_BODY()\n};',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_39a',
        title: 'AMyGameMode with override',
        code: {
          'Source.h': `UCLASS()
class AMyGameMode : public AGameModeBase
{
    GENERATED_BODY()
public:
    AMyGameMode();

    virtual void PostLogin(APlayerController* NewPlayer) override;
    virtual void Logout(AController* Exiting)             override;
};
`,
        },
        explanation: 'PostLogin fires when a player joins. Logout fires when they disconnect. These are common hooks for match tracking in multiplayer.',
      },
    ],
  };
