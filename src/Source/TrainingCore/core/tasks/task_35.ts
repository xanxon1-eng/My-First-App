import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_35: UTaskDefinition = {
    id: 'task_35',
    title: '35. TMap — Hash-Map Lookups',
    category: 'Stage 8: Unreal Workflows',
    objective: `# TMap — O(1) Key→Value Lookup

\`TArray\` gives O(n) search. When you need instant lookup by key, use \`TMap\`:

\`\`\`cpp
TMap<FName, int32> PlayerScores;
PlayerScores.Add(TEXT("Alice"), 1200);
PlayerScores.Add(TEXT("Bob"),   980);

int32* Score = PlayerScores.Find(TEXT("Alice")); // O(1) lookup
if (Score) { UE_LOG(LogTemp, Log, TEXT("Score: %d"), *Score); }
\`\`\`

Common operations:
- \`Add(Key, Value)\` — insert or overwrite
- \`Find(Key)\` — returns \`T*\` (nullptr if missing)
- \`Remove(Key)\` — delete entry
- \`Contains(Key)\` — boolean check

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Inside \`AGameState\`, declare \`TMap<FName, float> PlayerScores\` with \`UPROPERTY()\`.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "GameFramework/GameStateBase.h"
#include "MyGameState.generated.h"

UCLASS()
class AMyGameState : public AGameStateBase
{
    GENERATED_BODY()
public:
    // TODO: Declare TMap<FName, float> PlayerScores with UPROPERTY()
};
`,
    },
    hiddenTests: ['TMap<FName, float>', 'PlayerScores', 'UPROPERTY'],
    successCriteria: [
      'UPROPERTY() macro present',
      'TMap<FName, float> PlayerScores declared',
    ],
    rules: [
      {
        id: 'r32_prop_tmap',
        type: 'unreal',
        description: 'UPROPERTY() TMap<FName, float> PlayerScores',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('UPROPERTY(') && c.includes('TMap<FName,float>PlayerScores;'),
            error: 'Declare TMap<FName, float> PlayerScores; decorated with UPROPERTY().',
            fix: 'UPROPERTY()\nTMap<FName, float> PlayerScores;',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_32a',
        title: 'TMap with UPROPERTY',
        code: {
          'Source.h': `class AGameState : public AInfo
{
    GENERATED_BODY()
public:
    UPROPERTY(BlueprintReadOnly, Category = "Scores")
    TMap<FName, float> PlayerScores;
};
`,
        },
        explanation: 'Note: TMap is not replicatable out-of-the-box for networking. For replicated dictionaries, consider a TArray of custom structs with a NetSerialize function.',
      },
    ],
  };
