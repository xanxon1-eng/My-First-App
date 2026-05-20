import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_19: UTaskDefinition = {
    id: 'task_19',
    title: '19. UENUM — Strongly Typed State Machines',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: `# UENUM — Strongly Typed Enumerations

Raw integers for state (0=Idle, 1=Running, …) cause bugs: what does state \`3\` mean? Enumerations bind states to meaningful names.

Unreal's \`UENUM(BlueprintType)\` exposes them as dropdown menus in Blueprint:
\`\`\`cpp
UENUM(BlueprintType)
enum class EPlayerState : uint8
{
    Idle      UMETA(DisplayName = "Idle"),
    Running   UMETA(DisplayName = "Running"),
    Attacking UMETA(DisplayName = "Attacking"),
};
\`\`\`

Key points:
- \`enum class\` (scoped enum) prevents accidental integer promotion.
- \`: uint8\` keeps the size to one byte — UHT requires a \`uint8\` backing type.
- \`UMETA(DisplayName = "…")\` sets the text shown in the Blueprint dropdown.

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Declare \`EPlayerState\` with the exact structure above.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"

// TODO: Declare UENUM(BlueprintType) EPlayerState with Idle, Running, Attacking
`,
    },
    hiddenTests: ['UENUM(BlueprintType)', 'enum class EPlayerState : uint8', 'Idle', 'Running', 'Attacking'],
    successCriteria: [
      'UENUM(BlueprintType) macro',
      'enum class EPlayerState : uint8',
      'Values Idle, Running, Attacking defined with UMETA',
    ],
    rules: [
      {
        id: 'r19_decl',
        type: 'unreal',
        description: 'enum class EPlayerState : uint8',
        evaluate: (code) => ({
          passed: condense(code).includes('enumclassEPlayerState:uint8{'),
          error: 'Must use: enum class EPlayerState : uint8',
          fix: 'enum class EPlayerState : uint8 { ... }',
        }),
      },
      {
        id: 'r19_values',
        type: 'unreal',
        description: 'All 3 UMETA states defined',
        evaluate: (code) => {
          const c = condense(code);
          const ok = c.includes('IdleUMETA(DisplayName="Idle")') && 
                     c.includes('RunningUMETA(DisplayName="Running")') && 
                     c.includes('AttackingUMETA(DisplayName="Attacking")');
          return {
            passed: ok,
            error: 'Must define Idle, Running, and Attacking using UMETA.',
            fix: 'Idle UMETA(DisplayName = "Idle"), etc.',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_19a',
        title: 'Full EPlayerState with UMETA',
        code: {
          'Source.h': `UENUM(BlueprintType)
enum class EPlayerState : uint8
{
    Idle      UMETA(DisplayName = "Idle"),
    Running   UMETA(DisplayName = "Running"),
    Attacking UMETA(DisplayName = "Attacking"),
};
`,
        },
        explanation: 'UMETA DisplayName controls what designers see in the BP dropdown. Always add MAX at the end if you need to range-check: Idle=0, Running=1, Attacking=2.',
      },
    ],
  };
