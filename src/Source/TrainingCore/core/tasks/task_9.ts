import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_9: UTaskDefinition = {
    id: 'task_9',
    title: '9. Garbage Collection — Protecting UObject Pointers',
    category: 'Stage 2: Code Structure & Memory',
    objective: `# Garbage Collection & UPROPERTY Pointers

Unreal's GC scans memory every 30–60 seconds and **destroys any UObject that has no strong references**. A "naked" (non-UPROPERTY) pointer is not a strong reference — the GC cannot see it, so it may delete the object while your pointer still holds the address. This is a classic **dangling pointer** scenario → crash.

The fix: decorate every UObject pointer with \`UPROPERTY()\`.

\`\`\`cpp
// ❌ GC-invisible — will crash
UWeapon* CurrentWeapon;

// ✅ GC-aware — safe
UPROPERTY()
UWeapon* CurrentWeapon = nullptr;
\`\`\`

Also initialise to \`nullptr\`. Un-initialised pointers hold a random address — accessing them is undefined behaviour.

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Declare a \`UWeapon*\` named \`CurrentWeapon\` inside \`APlayer\`:
1. Add \`UPROPERTY()\` above it.
2. Initialise it to \`nullptr\`.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "Weapon.h"
#include "Player.generated.h"

UCLASS()
class APlayer : public ACharacter
{
    GENERATED_BODY()

public:
    // TODO: Declare UWeapon* CurrentWeapon with UPROPERTY() and = nullptr
};
`,
    },
    hiddenTests: ['UPROPERTY', 'UWeapon*', 'CurrentWeapon', 'nullptr'],
    successCriteria: [
      'Add UPROPERTY() decorator',
      'Declare UWeapon* CurrentWeapon',
      'Initialise to nullptr',
    ],
    rules: [
      {
        id: 'r9_prop',
        type: 'unreal',
        description: 'UPROPERTY() present',
        evaluate: (code) => ({
          passed: condense(code).includes('UPROPERTY('),
          error: 'Missing UPROPERTY() macro.',
          fix: 'UPROPERTY()',
        }),
      },
      {
        id: 'r9_ptr',
        type: 'unreal',
        description: 'UWeapon* CurrentWeapon declared & initialized',
        evaluate: (code) => ({
          passed: condense(code).includes('UWeapon*CurrentWeapon=nullptr;'),
          error: 'Must declare UWeapon* CurrentWeapon = nullptr;',
          fix: 'UWeapon* CurrentWeapon = nullptr;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_9a',
        title: 'GC-safe pointer declaration',
        explanation: 'UPROPERTY() with no specifiers is sufficient for GC visibility. The pointer will be set to nullptr by the GC when the pointed-to object is collected.',
        code: {
          'Source.h': `UCLASS()
class APlayer : public ACharacter
{
    GENERATED_BODY()
public:
    UPROPERTY()
    UWeapon* CurrentWeapon = nullptr;
};
`,
        },
      },
    ],
  };
