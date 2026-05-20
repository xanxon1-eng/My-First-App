import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_25: UTaskDefinition = {
    id: 'task_25',
    title: '25. Data Assets — UPrimaryDataAsset',
    category: 'Stage 5: UE5 Pro Features',
    objective: `# UDataAsset — Data-Driven Design

Instead of hardcoding stats (Damage=10, Speed=50) entirely into Blueprints or C++, you can define a \`UPrimaryDataAsset\`. Designers then create instances of this asset in the editor to define items, weapons, or enemy classes.

\`\`\`cpp
UCLASS()
class UWeaponData : public UPrimaryDataAsset
{
    GENERATED_BODY()
public:
    UPROPERTY(EditDefaultsOnly)
    float Damage;
};
\`\`\`
Players can then simply store a \`TObjectPtr<UWeaponData>\`.

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Declare a \`UWeaponData\` class inheriting from \`UPrimaryDataAsset\`. Add a \`Damage\` float property.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "Engine/DataAsset.h"
#include "WeaponData.generated.h"

// TODO: Declare UWeaponData inheriting from UPrimaryDataAsset with a Damage property
`,
    },
    hiddenTests: ['UWeaponData', 'UPrimaryDataAsset', 'float Damage'],
    successCriteria: [
      'Inherit from UPrimaryDataAsset',
      'Declare float Damage',
    ],
    rules: [
      {
        id: 'r_new_5_2_class',
        type: 'unreal',
        description: 'UPrimaryDataAsset subclass with float Damage',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('classUWeaponData:publicUPrimaryDataAsset{') && c.includes('floatDamage;'),
            error: 'Must declare class UWeaponData : public UPrimaryDataAsset and include float Damage;',
            fix: 'class UWeaponData : public UPrimaryDataAsset { GENERATED_BODY() public: float Damage; };',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_new_5_2',
        title: 'Minimal Data Asset',
        code: {
          'Source.h': `UCLASS()
class UWeaponData : public UPrimaryDataAsset
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    float Damage = 10.0f;
};
`,
        },
        explanation: 'Data assets keep project architecture clean by decoupling logic (Actors) from configuration (Data Assets).',
      },
    ],
  };
