import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_20: UTaskDefinition = {
    id: 'task_20',
    title: '20. Interface Classes (UInterface)',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: `# Interface Classes — Decoupling with IInterface

Without interfaces: a \`Bullet\` would \`Cast<ACharacter>\` and \`Cast<ABarrel>\` and \`Cast<AWindow>\` — the list grows forever.

With interfaces: anything that can take damage implements \`IDamageable\`. The bullet calls \`Execute_TakeHit(HitActor)\` — it doesn't know or care what type \`HitActor\` is.

Unreal requires **two** classes for each interface:
\`\`\`cpp
// UDamageable — for the reflection system (no changes needed)
UINTERFACE(MinimalAPI, Blueprintable)
class UDamageable : public UInterface { GENERATED_BODY() };

// IDamageable — where you define the contract
class IDamageable
{
    GENERATED_BODY()
public:
    virtual void TakeHit() = 0;   // pure virtual
};
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
The \`UDamageable\` shell is provided. Declare \`class IDamageable\` with a pure virtual \`TakeHit()\`.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "UObject/Interface.h"
#include "Damageable.generated.h"

UINTERFACE(MinimalAPI, Blueprintable)
class UDamageable : public UInterface { GENERATED_BODY() };

// TODO: Implement class IDamageable with GENERATED_BODY() and pure virtual TakeHit()
`,
    },
    hiddenTests: ['class IDamageable', 'virtual void TakeHit() = 0;'],
    successCriteria: [
      'Declare class IDamageable',
      'Add pure virtual TakeHit() = 0',
    ],
    rules: [
      {
        id: 'r20_class',
        type: 'unreal',
        description: 'class IDamageable declared',
        evaluate: (code) => ({
          passed: condense(code).includes('classIDamageable{'),
          error: 'Declare class IDamageable.',
          fix: 'class IDamageable { GENERATED_BODY() public: virtual void TakeHit() = 0; };',
        }),
      },
      {
        id: 'r20_pv',
        type: 'unreal',
        description: 'virtual void TakeHit() = 0 present',
        evaluate: (code) => ({
          passed: condense(code).includes('virtualvoidTakeHit()=0;'),
          error: 'Must declare: virtual void TakeHit() = 0;',
          fix: 'virtual void TakeHit() = 0;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_20a',
        title: 'Complete UInterface pair',
        code: {
          'Source.h': `UINTERFACE(MinimalAPI, Blueprintable)
class UDamageable : public UInterface { GENERATED_BODY() };

class IDamageable
{
    GENERATED_BODY()
public:
    virtual void TakeHit()         = 0;
    virtual void TakeHit(float Dmg) { TakeHit(); }  // optional overload with default
};
`,
        },
        explanation: 'The I-prefixed class is where your logic lives. Implement with _Implementation suffix in the .cpp: void AMyActor::TakeHit_Implementation() { ... }',
      },
    ],
  };
