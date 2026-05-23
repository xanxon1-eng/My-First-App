import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_16_1: UTaskDefinition = {
    id: 'task_16_1',
    title: '16.1. Const Correctness — Constexpr Curve Pre-Calculations & LUTs',
    category: 'Stage 3: Unreal Core & Data',
    objective: `# Constexpr Pre-Calculations & Look-up Tables (LUTs)

In massive RPGs like *The Witcher 3* or *Path of Exile*, dynamic combat triggers can result in hundreds of dynamic damage or spell modifier checks per second. Evaluating mathematical formulas with exponents, floating-point divisions, or logarithmic functions on the Game Thread introduces massive CPU overhead.

To bypass this cost entirely, we can use \`constexpr\` (constant expression). By enforcing **Compile-Time calculation**, we solve math curves when our C++ game compiles, transforming slow formulas into static **Look-up Tables (LUTs)** stored directly inside read-only executable memory.

On execution, looking up a scale modifier drops from an expensive **1.2ms mathematical formula cascade** into a single-cycle, constant-time \`O(1)\` array offset lookup!

---

### 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-1.2ms to -2.8ms)**: By shifting mathematical calculations from runtime to compile-time, combat damage calculations cost as little as **1 nanosecond** per lookup, letting thread queues focus on simulation and navigation.
*   **GPU Impact (0.0ms Directly)**: Pure CPU speedup.
*   **RAM Impact (+4KB read-only segments)**: Negligible RAM utilization for static tables.
*   **Latency, Ping, VRAM Impact (0.0ms Directly)**: Neutral.

### ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**: The Unreal compiler supports standard C++17/20 \`constexpr\`, letting you write complex constexpr loops and tables inside native data classes.
*   ⚠️ **What UE5 Lacks**: Blueprint lacks compiler constant expressions. Any scaling curve implemented inside Blueprints is forced to evaluate dynamically on the VM runtime at 100x the C++ performance cost.

---

## Your Task
Write a compile-time curve generator that pre-calculates the damage multipliers for players up to Level 5.
1. Implement a \`constexpr float GetMultiplierForLevel(int32 Level)\` function.
2. The formula is: \`Level * 1.5f\` (to keep checks easy).
3. Ensure the function is marked \`constexpr\`.
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

// TODO: Create a constexpr float GetMultiplierForLevel(int32 Level)
// that returns (Level * 1.5f) at compile-time!
`,
    },
    hiddenTests: ['GetMultiplierForLevel', 'constexpr', 'Level * 1.5f'],
    successCriteria: [
      'Function named GetMultiplierForLevel',
      'Marked constexpr',
      'Returns Level * 1.5f'
    ],
    rules: [
      {
        id: 'r16_1_constexpr_key',
        type: 'exercise',
        description: 'Verify constexpr keyword present',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('constexprfloatGetMultiplierForLevel') || c.includes('constexprfloatgetmultiplierforlevel'),
            error: 'The function signature must be marked with constexpr: constexpr float GetMultiplierForLevel(int32 Level)',
            fix: 'constexpr float GetMultiplierForLevel(int32 Level)'
          };
        }
      },
      {
        id: 'r16_1_constexpr_logic',
        type: 'exercise',
        description: 'Equation logic check',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('Level*1.5f') || c.includes('Level*1.5') || c.includes('level*1.5f'),
            error: 'Ensure the function returns Level * 1.5f.',
            fix: 'return Level * 1.5f;'
          };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_16_1',
        title: 'Static Level Scale LUT',
        explanation: 'Enforces pure functional compile-time evaluation. When compiled, the compiler completely replaces this calculations with standard literals.',
        code: {
          'Source.cpp': `constexpr float GetMultiplierForLevel(int32 Level)
{
    return Level * 1.5f;
}
`
        }
      }
    ]
};
