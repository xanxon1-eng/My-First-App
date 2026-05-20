import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_45: UTaskDefinition = {
    id: 'task_45',
    title: '45. Math Data Types — FVector & FRotator',
    category: 'Stage 11: Framework Architecture',
    objective: `# 3D Math Types

| Type | Represents | Components |
|------|-----------|-----------|
| \`FVector\` | Position or direction | X, Y, Z |
| \`FRotator\` | Euler rotation | Pitch (Y), Yaw (Z), Roll (X) |
| \`FQuat\` | Quaternion rotation | X, Y, Z, W |
| \`FTransform\` | Full transform | Location + Rotation + Scale |

\`\`\`cpp
FVector  Origin   = FVector::ZeroVector;  // (0,0,0)
FRotator Facing   = FRotator(0.f, 90.f, 0.f); // face right
FVector  Forward  = Facing.Vector();       // → unit vector facing right
\`\`\`

In UE5, all math types default to \`double\` backend for Large World Coordinates support.

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Inside \`ASpawner\`, declare:
1. \`FVector SpawnLocation;\` (default-initialised)
2. \`FRotator SpawnRotation;\` (default-initialised)
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
    // TODO: Declare FVector SpawnLocation and FRotator SpawnRotation
};
`,
    },
    hiddenTests: ['FVector SpawnLocation', 'FRotator SpawnRotation'],
    successCriteria: [
      'Declare FVector SpawnLocation',
      'Declare FRotator SpawnRotation',
    ],
    rules: [
      {
        id: 'r40_vec',
        type: 'unreal',
        description: 'FVector SpawnLocation declared',
        evaluate: (code) => ({
          passed: condense(code).includes('FVectorSpawnLocation'),
          error: 'Declare FVector SpawnLocation;',
          fix: 'FVector SpawnLocation = FVector::ZeroVector;',
        }),
      },
      {
        id: 'r40_rot',
        type: 'unreal',
        description: 'FRotator SpawnRotation declared',
        evaluate: (code) => ({
          passed: condense(code).includes('FRotatorSpawnRotation'),
          error: 'Declare FRotator SpawnRotation;',
          fix: 'FRotator SpawnRotation = FRotator::ZeroRotator;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_40a',
        title: 'UPROPERTY math members',
        code: {
          'Source.h': `class ASpawner : public AActor
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, Category = "Spawn")
    FVector SpawnLocation = FVector::ZeroVector;

    UPROPERTY(EditAnywhere, Category = "Spawn")
    FRotator SpawnRotation = FRotator::ZeroRotator;
};
`,
        },
        explanation: 'FVector::ZeroVector and FRotator::ZeroRotator are convenient named constants. Use them over FVector(0,0,0) for clarity and to avoid typos.',
      },
    ],
  };
