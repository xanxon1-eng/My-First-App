import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_21: UTaskDefinition = {
    id: 'task_21',
    title: '21. TSubclassOf — Class References',
    category: 'Stage 5: UE5 Pro Features',
    objective: `# TSubclassOf — Blueprint-Assignable Class References

There is a critical distinction:
- \`AActor* Weapon\` — a **live instance** of a weapon already spawned.
- \`TSubclassOf<AActor> WeaponClass\` — a **template** (Blueprint class asset) to spawn from.

\`TSubclassOf<T>\` enforces that only classes inheriting from T can be assigned. This lets designers pick from a dropdown list in the editor, and your C++ code spawns from it:

\`\`\`cpp
GetWorld()->SpawnActor<AActor>(SpawnTemplate, SpawnLocation, SpawnRotation);
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Inside \`ASpawner\`, declare \`TSubclassOf<AActor> SpawnTemplate\` with \`UPROPERTY(EditAnywhere)\`.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Spawner.generated.h"

UCLASS()
class ASpawner : public AActor
{
    GENERATED_BODY()
public:
    // TODO: Declare UPROPERTY(EditAnywhere) TSubclassOf<AActor> SpawnTemplate
};
`,
    },
    hiddenTests: ['TSubclassOf<AActor>', 'SpawnTemplate', 'EditAnywhere'],
    successCriteria: [
      'UPROPERTY(EditAnywhere)',
      'TSubclassOf<AActor> SpawnTemplate declared',
    ],
    rules: [
      {
        id: 'r21_prop_sub',
        type: 'unreal',
        description: 'UPROPERTY(EditAnywhere) TSubclassOf<AActor> SpawnTemplate',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('EditAnywhere') && c.includes('TSubclassOf<AActor>SpawnTemplate;'),
            error: 'Declare TSubclassOf<AActor> SpawnTemplate with EditAnywhere.',
            fix: 'UPROPERTY(EditAnywhere)\nTSubclassOf<AActor> SpawnTemplate;',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_21a',
        title: 'SpawnTemplate property',
        code: {
          'Source.h': `class ASpawner : public AActor
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, Category = "Spawning")
    TSubclassOf<AActor> SpawnTemplate;
};
`,
        },
        explanation: 'TSubclassOf<AActor> prevents designers from accidentally assigning a non-Actor class. At runtime: GetWorld()->SpawnActor<AActor>(SpawnTemplate, ...);',
      },
    ],
  };
