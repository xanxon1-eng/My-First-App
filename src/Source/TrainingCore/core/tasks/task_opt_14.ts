import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_opt_14: UTaskDefinition = {
    id: 'task_opt_14',
    title: '61. SIMD Loop Autovectorization & Strict Pointer Aliasing (__restrict)',
    category: 'Stage 16: Deep Dive C++ Optimization',
    objective: `# SIMD Loop Autovectorization & Strict Pointer Aliasing

When optimizing compute-intensive game logic—like *Shallow Water Momentum Equations* for realistic rivers or massive coordinates sweeps for *Path of Exile* style projectile arrays—compiling clean C++ is only half the battle. To run on high-end PC and Console platforms, you need your loops to compile into **SIMD (Single Instruction Multiple Data)** vector registers (AVX on PC, NEON on Console).

A standard loop processes elements sequentially. A SIMD register can load and process **4, 8, or even 16 float elements simultaneously in a single clock cycle!** This can make your equations **400% to 800% faster**.

However, the compiler is often **forbidden** from autovectorizing your loop. If you write:
\`\`\`cpp
void ScaleValues(float* Out, const float* In, float Mult, int32 Size)
{
    for (int32 i = 0; i < Size; ++i) {
        Out[i] = In[i] * Mult;
    }
}
\`\`\`
The compiler must assume **"Pointer Aliasing."** It assumes \`Out\` and \`In\` might overlap. If they overlap, writing to \`Out[0]\` could change \`In[1]\`. Because of this fear of overlap, the compiler cannot safely load 8 values from \`In\` at once. It is forced to fall back to slow, sequential L1-RAM loads and stores!

We cure this using strict pointer aliasing qualifiers: **\`__restrict\`** (or the platform equivalent). This tells the compiler "I promise these pointers of memory never overlap," triggering instant SIMD register loop optimization!

---

## 🛠️ Deep Dive: RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-4.8ms to -7.5ms on Physics/Solver Loops)**: Enabling SIMD register autovectorization speeds up sequential calculations past **-4.8ms**, turning intensive mathematical sweeps like water simulation wave grids or skeletal joint updates from frame-stuttering bottlenecks into rapid operations.
*   **GPU Impact (-0.5ms)**: More efficient CPU simulation speeds mean coordinates and collision matrices are sent to vertex pipelines sooner, minimizing wait stalls on GPU registers.
*   **RAM Impact (0.0ms)**: Pure instruction-level CPU register optimization.
*   **VRAM Impact (0.0ms)**: Separated from rendering footprint.
*   **Latency & Ping Impact (0.0ms)**: Reduces game loop execution overhead, leading to exceptionally smooth frame times on PC and console.

---

## ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**:
    1.  \`RESTRICT\` macro defined natively as a platform-agnostic wrapper for compiler-specific dynamic restrict keys (\`__restrict\` on MSVC/Clang).
    2.  Vector execution math arrays (\`DirectXMath\` or specialized SIMD modules like \`FVector\`).
*   ⚠️ **What UE5 Lacks**:
    1.  **No Automatic Autovectorization for Generic Layouts**: Standard C++ arrays inside general actor scripts do not use restrict markers, causing compiler fallback loops.
    2.  **No Safe Parallel Restricting in Blueprints**: TArray references in Blueprint variables always resolve under full aliasing hazards.
*   🛠️ **How to Use / Workaround**:
    Any time you write performance-critical math functions processing arrays of floats or integers (like checking status attributes, calculating wind speeds, or simulating particle advections), **always declare arrays with raw pointer interfaces and mark them as \`RESTRICT\`**. This instructs compilers (MSVC/Clang) to safely vectorize loops into high-performance AVX/NEON registers.

---

## Your Task
Write an optimized C++ math vector loop:
1. Complete the function \`void FastAddVectors(float* RESTRICT Target, const float* RESTRICT AddendA, const float* RESTRICT AddendB, int32 VectorCount)\` 
2. Use the Unreal engine macro keyword \`RESTRICT\` on all three float arrays to enable vectorization.
3. Write a simple loop adding elements of \`AddendA\` and \`AddendB\` together and saving the output inside \`Target\`.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"

// Note: Under Unreal, RESTRICT is defined for platform-agnostic restrict checks.

class FFastMathHelper
{
public:
    static void FastAddVectors(float* Target, const float* AddendA, const float* AddendB, int32 VectorCount)
    {
        // TODO: Pass arguments utilizing the RESTRICT macro keyword!
        // Hint: Format should be: (float* RESTRICT Target, const float* RESTRICT AddendA, ...)
        
        // TODO: Implement the sequential loop adding elements from AddendA and AddendB into Target:
        // Target[i] = AddendA[i] + AddendB[i]
    }
};
`,
    },
    hiddenTests: ['FFastMathHelper', 'FastAddVectors', 'RESTRICT', 'Target', 'AddendA', 'AddendB', 'VectorCount'],
    successCriteria: [
        'Understand and apply pointer RESTRICT attributes',
        'Verify array pointer declarations safely bypass Compiler Aliasing checks',
        'Leverage sequential, vectorizable layouts',
        'Unlocks high-end AVX / NEON CPU processor instruction pipelines'
    ],
    rules: [
      {
        id: 'r_opt14_restrict',
        type: 'unreal',
        description: 'Verify pointers are marked as RESTRICT and sequential sums are computed',
        evaluate: (code) => {
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
          const hasRestrictWord = code.includes('RESTRICT') || code.includes('__restrict');
          const hasThreeRestricts = (code.match(/RESTRICT|__restrict/g) || []).length >= 3;
          const hasLoop = stripped.includes('for(int32i=0;i<VectorCount;') || stripped.includes('for(inti=0;i<VectorCount;');
          const hasAddMat = stripped.includes('Target[i]=AddendA[i]+AddendB[i]');

          if (!hasRestrictWord) return { passed: false, error: 'Must use the Unreal RESTRICT macro (or C++ __restrict) keyword to tell the compiler pointer arrays do not overlap.', fix: 'Add RESTRICT to the pointer parameters.' };
          if (!hasThreeRestricts) return { passed: false, error: 'All three pointers (Target, AddendA, and AddendB) must be flagged as RESTRICT.', fix: 'float* RESTRICT Target, const float* RESTRICT AddendA, const float* RESTRICT AddendB' };
          if (!hasLoop) return { passed: false, error: 'Must write a loop passing from 0 up to VectorCount.', fix: 'for (int32 i = 0; i < VectorCount; ++i)' };
          if (!hasAddMat) return { passed: false, error: 'Loop must sum elements: Target[i] = AddendA[i] + AddendB[i];', fix: 'Target[i] = AddendA[i] + AddendB[i];' };

          return { passed: true, error: '', fix: '' };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_opt14',
        title: 'SIMD Aligned Vector Adder',
        code: {
          'Source.h': `class FFastMathHelper
{
public:
    static void FastAddVectors(float* RESTRICT Target, const float* RESTRICT AddendA, const float* RESTRICT AddendB, int32 VectorCount)
    {
        for (int32 i = 0; i < VectorCount; ++i)
        {
            Target[i] = AddendA[i] + AddendB[i];
        }
    }
};
`,
        },
        explanation: 'By declaring all pointers as RESTRICT, you prove that memory spaces do not overlap. The compiler safely schedules SIMD instructions loading four separate 32-bit float channels sequentially in single cycles, avoiding aliasing safety traps.',
      },
    ],
  };
