import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_46: UTaskDefinition = {
    id: 'task_46',
    title: '46. Gameplay Timers — SetTimer',
    category: 'Stage 11: Framework Architecture',
    objective: `# Gameplay Timers — Scheduled Callbacks

\`Tick\` fires every frame. For "execute something in 2 seconds", Timers are far better:

\`\`\`cpp
// Setup
FTimerHandle AttackTimerHandle;

void AEnemy::StartAttack()
{
    // Call PerformAttack after 1.5 seconds, once
    GetWorldTimerManager().SetTimer(
        AttackTimerHandle,
        this,
        &AEnemy::PerformAttack,
        1.5f,           // delay in seconds
        false           // bLooping
    );
}

void AEnemy::PerformAttack()
{
    UE_LOG(LogTemp, Log, TEXT("Attack!"));
}
\`\`\`

Timers are invalidated automatically if the owning actor is destroyed.

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Implement \`AEnemy::StartAttack()\` that uses \`GetWorldTimerManager().SetTimer\` to call \`PerformAttack\` after **2.0** seconds, **non-looping**.
`,
    starterCode: {
      'Source.cpp': `#include "Enemy.h"
#include "TimerManager.h"

void AEnemy::StartAttack()
{
    // TODO: Set a timer to call PerformAttack in 2.0 seconds (non-looping)
    // Use GetWorldTimerManager().SetTimer(AttackTimerHandle, this, &AEnemy::PerformAttack, 2.0f, false)
}
`,
    },
    hiddenTests: ['SetTimer', 'AttackTimerHandle', 'PerformAttack', '2.0f'],
    successCriteria: [
      'Call GetWorldTimerManager().SetTimer',
      'Pass AttackTimerHandle',
      'Target function &AEnemy::PerformAttack',
      'Delay 2.0f, bLooping false',
    ],
    rules: [
      {
        id: 'r41_settimer',
        type: 'unreal',
        description: 'Complete GetWorldTimerManager().SetTimer call',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('GetWorldTimerManager().SetTimer(AttackTimerHandle,this,&AEnemy::PerformAttack,2.0f,false);'),
            error: 'Parameters must exactly match: AttackTimerHandle, this, &AEnemy::PerformAttack, 2.0f, false',
            fix: 'GetWorldTimerManager().SetTimer(AttackTimerHandle, this, &AEnemy::PerformAttack, 2.0f, false);',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_41a',
        title: 'SetTimer + cancel on end',
        code: {
          'Source.cpp': `void AEnemy::StartAttack()
{
    GetWorldTimerManager().SetTimer(
        AttackTimerHandle,
        this,
        &AEnemy::PerformAttack,
        2.0f,    // delay in seconds
        false    // not looping — fires once
    );
}

void AEnemy::PerformAttack()
{
    UE_LOG(LogTemp, Log, TEXT("Attack executed!"));
    // AttackTimerHandle is now invalid — don't check IsBound after a one-shot timer
}

void AEnemy::StopAttack()
{
    // Cancel if the enemy dies before the timer fires
    GetWorldTimerManager().ClearTimer(AttackTimerHandle);
}
`,
        },
        explanation: 'Always store the handle if you might need to cancel. ClearTimer is safe to call even if the timer has already fired.',
      },
    ],
  };
