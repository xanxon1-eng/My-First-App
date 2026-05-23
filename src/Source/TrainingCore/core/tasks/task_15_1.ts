import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_15_1: UTaskDefinition = {
    id: 'task_15_1',
    title: '15.1. Reference vs Pointer — Input Parameter Aliasing & RESTRICT',
    category: 'Stage 3: Unreal Core & Data',
    objective: `# Pointer Aliasing & RESTRICT Macro

When writing high-frequency combat calculations or sweeping thousands of entities inside open-world RPG systems (like *The Witcher 3* and *Path of Exile*), pointer aliasing can quietly destroy compiler optimization.

**Pointer Aliasing** occurs when two or more pointers (or references) of the same type point to the same memory address. Because the compiler cannot prove they don't overlap, it must generate safe, repetitive memory load instructions:
- On *every write* through Pointer A, the compiler forces a *re-load* of Pointer B from slow system RAM, just in case A was secretly pointing to B's health variable!
- This completely disables SSE/AVX vectorization and loop-unrolling, leading to severe CPU stalling.

To solve this, Unreal Engine provides the \`RESTRICT\` macro (which maps to \`__restrict\` or \`__restrict__\` depending on GCC, Clang, or MSVC pipelines). This is a strong contract telling the optimizer: *These pointers will never point to overlapping memory registers*.

---

### 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-2.5ms to -4.5ms)**: Enabling compiler restrict optimizations allows data to be kept strictly inside CPU registers, maximizing instruction pipe utilization. Sequential array computations accelerate by up to **3x-4x**.
*   **GPU, RAM, VRAM Impact (0.0ms directly)**: Secondary impacts are neutral.
*   **Latency & Ping Impact (0.0ms)**: Isolates local hardware calculations.

### ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**: The \`RESTRICT\` macro located in compiler-agnostic platform headers.
*   ⚠️ **What UE5 Lacks**: Automated analysis for pointer overlap in custom systems. If you write aliasing code with \`RESTRICT\`, the compiler will generate corrupt/broken builds without warnings.

---

## Your Task
Write a high-performance vector calculation function \`void AccumulateStats(float* RESTRICT OutModifiers, const float* RESTRICT InMultipliers, int32 Count)\` inside source file.
1. Declare the first parameter as a \`RESTRICT\` pointer to mutable \`float\` named \`OutModifiers\`.
2. Declare the second parameter as a \`RESTRICT\` pointer to read-only (\`const\`) \`float\` named \`InMultipliers\`.
3. Inside the loop, multiply \`OutModifiers[i]\` by \`InMultipliers[i]\` up to \`Count\`.
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

// TODO: Write AccumulateStats with RESTRICT parameters and update modifiers in a loop
`,
    },
    hiddenTests: ['AccumulateStats', 'RESTRICT', 'OutModifiers', 'InMultipliers', 'Count'],
    successCriteria: [
      'Function named AccumulateStats',
      'Uses RESTRICT macro on both pointers',
      'OutModifiers is a float* RESTRICT',
      'InMultipliers is a const float* RESTRICT',
    ],
    rules: [
      {
        id: 'r15_1_restrict_sig',
        type: 'exercise',
        description: 'Verify restrict usage in signature',
        evaluate: (code) => {
          const c = condense(code);
          const hasFloatRestrict = c.includes('float*RESTRICTOutModifiers') || c.includes('float*__restrictOutModifiers');
          const hasConstFloatRestrict = c.includes('constfloat*RESTRICTInMultipliers') || c.includes('constfloat*__restrictInMultipliers');
          return {
            passed: hasFloatRestrict && hasConstFloatRestrict,
            error: 'You must declare OutModifiers as float* RESTRICT and InMultipliers as const float* RESTRICT to unblock registration sweeps.',
            fix: 'void AccumulateStats(float* RESTRICT OutModifiers, const float* RESTRICT InMultipliers, int32 Count)'
          };
        }
      },
      {
        id: 'r15_1_restrict_loop',
        type: 'exercise',
        description: 'Process array accumulation inside restricted loop',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('OutModifiers[i]*=InMultipliers[i];') || c.includes('OutModifiers[i]=OutModifiers[i]*InMultipliers[i];'),
            error: 'Must accumulate InMultipliers inside OutModifiers in a classic loop.',
            fix: 'for (int32 i = 0; i < Count; ++i) { OutModifiers[i] *= InMultipliers[i]; }'
          };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_15_1',
        title: 'Cache Aligned Restrict Sweeper',
        explanation: 'Utilizes restricted memory contract constraints, enabling compiler-specific loop unrolling and parallel SIMD vectorization lines.',
        code: {
          'Source.cpp': `void AccumulateStats(float* RESTRICT OutModifiers, const float* RESTRICT InMultipliers, int32 Count)
{
    for (int32 i = 0; i < Count; ++i)
    {
        OutModifiers[i] *= InMultipliers[i];
    }
}
`
        }
      }
    ]
};
