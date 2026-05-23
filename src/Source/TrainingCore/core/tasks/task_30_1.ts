import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_30_1: UTaskDefinition = {
    id: 'task_30_1',
    title: '30.1. Assertions — Release-Build Overhead Culling & checkCode',
    category: 'Stage 7: Production Standards',
    objective: `# Release-Build Assertion Gates (checkCode & compile-out culling)

In AAA projects like *The Witcher 3* or *Baldur's Gate 3*, security checks and data validation are crucial during development to catch bugs early. Developers write macros to test inventory bounds, integrity pointers, and data structures.

However, executing thousands of assertions *inside shipping/retail gold builds* wastes valuable CPU frame time. If a validation check traverses an array containing **500 inventory items**, doing this on every frame can drain up to **3.0ms CPU**.

Unreal Engine solves this via compile-time assertion hierarchies:
- \`check(Condition)\`: Hard assert. Crashes instantly in editor/debug, but is **100% stripped from compiled Shipping builds** (runs at absolute zero runtime overhead).
- \`ensure(Condition)\`: Soft assert. Does not crash, prints static registers to the log once, and continues.
- \`checkCode(CodeConstruct)\`: Allows executing custom validation code *only* in build configurations where \`check\` is enabled. If compiling in Shipping, both the check *and* the code body inside are completely omitted from the compiler output!

---

### 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-2.5ms to -3.8ms)**: Completely strips validation math from the product binary. Hot path code runs at bare-metal speeds in Shipping without debug validation bloat.
*   **GPU, RAM, VRAM Impact (0.0ms Directly)**: Neutral.
*   **Latency & Ping Impact (0.0ms Directly)**: Pure local client/server process optimization.

---

## Your Task
Write a compiler-safe assertion validation function \`void ValidateIndexSafety(int32 TargetIndex, int32 MaxItems)\`:
1. Use the \`check(Condition)\` macro to verify that \`TargetIndex >= 0\`.
2. Use the \`check(Condition)\` macro to verify that \`TargetIndex < MaxItems\`.
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

void ValidateIndexSafety(int32 TargetIndex, int32 MaxItems)
{
    // TODO: Use check() to enforce bounds safety
}
`,
    },
    hiddenTests: ['ValidateIndexSafety', 'check', 'TargetIndex >= 0', 'TargetIndex < MaxItems'],
    successCriteria: [
      'Function named ValidateIndexSafety',
      'Uses check() for lower bounds check',
      'Uses check() for upper bounds check'
    ],
    rules: [
      {
        id: 'r30_1_lower',
        type: 'exercise',
        description: 'Verify lower bounds checklist',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('check(TargetIndex>=0)') || c.includes('check(targetindex>=0)'),
            error: 'You must assert using check(TargetIndex >= 0) to cull retail index validation.',
            fix: 'check(TargetIndex >= 0);'
          };
        }
      },
      {
        id: 'r30_1_upper',
        type: 'exercise',
        description: 'Verify upper bounds checklist',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('check(TargetIndex<MaxItems)') || c.includes('check(targetindex<maxitems)'),
            error: 'You must assert using check(TargetIndex < MaxItems) to guard upper index zones.',
            fix: 'check(TargetIndex < MaxItems);'
          };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_30_1',
        title: 'Zero Overhead Compiler Assertions',
        explanation: 'Enforces complete compiler stripping on Shipping targets, keeping editor debug safety without any runtime retail penalty.',
        code: {
          'Source.cpp': `void ValidateIndexSafety(int32 TargetIndex, int32 MaxItems)
{
    check(TargetIndex >= 0);
    check(TargetIndex < MaxItems);
}
`
        }
      }
    ]
};
