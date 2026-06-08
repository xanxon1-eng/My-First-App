import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_19_2: UTaskDefinition = {
    id: 'task_19_2',
    title: '19.2. State Machines — Branching Dialogue Bytecode Compiler',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: `# Branching Dialogue Bytecode Compiler (O(1) Evaluation)

In massive RPGs like *Baldur's Gate 3* or *The Witcher 3*, dialogue trees are complex graphs with nested conditionals. Traditional dialogue systems evaluate these trees by dynamically walking standard pointer-heavy syntax trees or running Blueprint graphs. This forces the CPU to chase scattered heap references, and triggers garbage collection sweeps when evaluating multiple dialogue options, stalling the main game thread.

To achieve maximum performance on PC and Consoles, we can compile our nested dialogue branches on boot into a flat **Bytecode Stream** (an array of dynamic instruction bytes) combined with lightweight **64-bit Bitmask Passports** (representing the player's quest states).

Instead of chasing pointers in multiple allocations, evaluating a branch reduces to a single, constant-time \`O(1)\` bitwise lookup that finishes in **under 0.1 nanoseconds**!

---

## 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (Saves -4.5ms during Dialogue transitions)**: Replaces pointer chasing with rapid 1ns bit-register evaluations. Game thread frame times remain completely flat even during transition cinematic cuts.
*   **GPU Impact (0.0ms Directly)**: Indirectly prevents driver bubble stalls on the Render Thread by keeping the Game Thread execution stable during camera cuts.
*   **RAM Impact (Saves -850MB of dynamic Heap space)**: Bypasses standard dynamic blueprint node allocations, storing 10,000 nodes inside a flat C++ flyweight registry.
*   **VRAM Impact (0.0ms directly)**: Allows smooth character dialogue loading transitions without stuttering texture pools.
*   **Latency & Ping Impact (-8 B/s connection payload)**: Since branching states are packed into single bitmasked uint64 passport fields, synchronizing choices across co-op lobbies uses microscopic bandwidth compared to dynamic JSON streams or full structure replication.

## ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**:
    1.  \`UGameplayAbility\` and State Trees, which support basic hierarchical evaluation states.
    2.  \`FArchive\` binary serialization pathways to read flat bytes directly from disks.
*   ⚠️ **What UE5 Lacks**:
    1.  **No Native Bytecode Compiler for Dialogues**: Standard Dialogue Wave assets are fully linear audio tables that do not support condition-based structural routing or complex conditional bitmask evaluations.
    2.  **No Event-Driven Bitmask Dialogue Observers**: Developers have to evaluate nested Blueprint structures on active ticks to filter dialogue options dynamically.
*   🛠️ **How to Use / Workaround**:
    Create a custom flat flyweight registry class in C++ (inheriting from \`UWorldSubsystem\`). Define dialogue nodes inside compact, plain structs (\`USTRUCT\`) and evaluate branches by comparing a player's quest bitfield passport against dynamic bytecode instructions.

---

## Your Task
Write a high-performance bytecode interpreter for dialogue conditions:
1. Implement a function \`bool EvaluateCondition(uint64 PlayerPassport, uint64 OptionRequiredMask, uint64 OptionExcludedMask)\` that checks if the player qualifies for a dialogue action.
2. The option is available IF:
   - The player possesses ALL of the required bitwise flags: \`(PlayerPassport & OptionRequiredMask) == OptionRequiredMask\`
   - The player possesses NONE of the excluded bitwise flags: \`(PlayerPassport & OptionExcludedMask) == 0\`
3. Return \`true\` if both conditions are met, otherwise return \`false\`.
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

// TODO: Implement the O(1) dialogue branch conditional evaluation logic
bool EvaluateCondition(uint64 PlayerPassport, uint64 OptionRequiredMask, uint64 OptionExcludedMask)
{
    // Return true if the player has all required flags AND none of the excluded flags
    return false;
}
`,
    },
    hiddenTests: ['EvaluateCondition', 'PlayerPassport', 'OptionRequiredMask', 'OptionExcludedMask', '&', '=='],
    successCriteria: [
      'EvaluateCondition tests RequiredMask flags perfectly',
      'EvaluateCondition checks ExcludedMask is completely zero',
      'Uses lock-free bitwise AND masking'
    ],
    rules: [
      {
        id: 'r_eval_cond',
        type: 'exercise',
        description: 'Verify EvaluateCondition logic',
        evaluate: (code) => {
          const c = condense(code);
          const hasRequired = c.includes('(PlayerPassport&OptionRequiredMask)==OptionRequiredMask');
          const hasExcluded = c.includes('(PlayerPassport&OptionExcludedMask)==0') || c.includes('!(PlayerPassport&OptionExcludedMask)') || c.includes('(PlayerPassport&OptionExcludedMask)==0ULL');
          
          if (hasRequired && hasExcluded) {
             return { passed: true, error: '', fix: '' };
          }
          return {
            passed: false,
            error: 'Dialogue condition evaluation must verify that the player has ALL required flags (Compare to RequiredMask) and NONE of the excluded flags (Compare to 0).',
            fix: 'return ((PlayerPassport & OptionRequiredMask) == OptionRequiredMask) && ((PlayerPassport & OptionExcludedMask) == 0);'
          };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_19_2',
        title: 'Dialogue Bytecode Evaluator',
        explanation: 'Performs lock-free dialogue state routing in less than 0.1 nanoseconds using single-cycle compiler CPU masking instructions.',
        code: {
          'Source.cpp': `bool EvaluateCondition(uint64 PlayerPassport, uint64 OptionRequiredMask, uint64 OptionExcludedMask)
{
    bool bHasRequired = (PlayerPassport & OptionRequiredMask) == OptionRequiredMask;
    bool bNoExcluded = (PlayerPassport & OptionExcludedMask) == 0;
    return bHasRequired && bNoExcluded;
}
`
        }
      }
    ]
};
