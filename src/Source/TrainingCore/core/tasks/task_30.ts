import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_30: UTaskDefinition = {
    id: 'task_30',
    title: '30. Assertions — check, ensure, verify',
    category: 'Stage 7: Production Standards',
    objective: `# Assertions in Unreal Engine

Assertions catch programmer mistakes at the earliest possible point:

| Macro | Shipping? | Behaviour on failure |
|-------|-----------|----------------------|
| \`check(cond)\` | ❌ stripped | Crash immediately (fatal) |
| \`verify(cond)\` | ✅ kept | Crash (evaluates the expression in shipping) |
| \`ensure(cond)\` | ✅ kept | Log + continue (non-fatal) |

\`\`\`cpp
void Heal()
{
    ensure(Health > 0);   // warn if already dead, but don't crash
    check(HealComponent); // fatal: we cannot proceed without HealComponent
    Health += 50;
}
\`\`\`

Use \`ensure\` for "this shouldn't happen, but we can recover." Use \`check\` for "this is impossible and continuing would corrupt state."

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Inside \`APlayer::Heal()\`, add \`ensure(Health > 0);\` **before** any healing logic.
`,
    starterCode: {
      'Source.cpp': `#include "Player.h"

void APlayer::Heal()
{
    // TODO: Add ensure(Health > 0) before healing
    Health += 50;
}
`,
    },
    hiddenTests: ['ensure', 'Health > 0'],
    successCriteria: ['Write ensure(Health > 0); before modifying Health'],
    rules: [
      {
        id: 'r27_ensure_order',
        type: 'unreal',
        description: 'ensure(Health > 0) exists BEFORE Health is modified',
        evaluate: (code) => {
          const c = condense(code);
          const idxEnsure = c.indexOf('ensure(Health>0);');
          const idxHealth = c.indexOf('Health+=50;');
          return {
            passed: idxEnsure !== -1 && idxEnsure < idxHealth,
            error: 'Must add ensure(Health > 0); before the Health += 50; line.',
            fix: 'ensure(Health > 0);\nHealth += 50;',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_27a',
        title: 'ensure before healing',
        code: {
          'Source.cpp': `void APlayer::Heal()
{
    ensure(Health > 0);        // non-fatal warning if health is already 0 or negative
    check(Health <= MaxHealth); // fatal: healing above max is a logic error
    Health += 50;
}
`,
        },
        explanation: 'Layered assertions: ensure logs and continues so QA can report the state; check halts on impossible states where continuing is dangerous.',
      },
    ],
  };
