import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_opt_11: UTaskDefinition = {
    id: 'task_opt_11',
    title: '58. Fast Bitwise Flag Combat Convenor Pipelines',
    category: 'Stage 16: Deep Dive C++ Optimization',
    objective: `# Fast Bitwise Flag Combat Convenor Pipelines

In Path of Exile-style fast action RPGs, a single hit may pass along dozens of conditional options (\`bIsAttack\`, \`bIsSpell\`, \`bIsCritical\`, \`bIsPoisoned\`, \`bIsStunned\`). Creating and copying large classes to pass these parameters creates severe RAM allocations and hurts CPU execution speeds.

By packing all states inside a singular 64-bit integer mask (\`uint64\`), the CPU evaluates multiple active properties simultaneously in a single clock cycle using register instructions (\`AND\`, \`OR\`). This dramatically simplifies your combat event evaluations.

### Hardware Impact (Concrete Metrics)
- **CPU:** Speeds up combat evaluation logic by -1.5ms Game Thread times during swarm calculations.
- **GPU:** Bypasses thread queues, maintaining stable frame rates.
- **RAM:** Substantially packs 64 Boolean elements into a simple 8-byte register.
- **VRAM:** 0ms.
- **Latency / Ping:** Slashes networking packet footprints by up to 90%, preventing buffer saturation.

### What Unreal Engine Has / Needs
✅ **Has:** \`ENUM_CLASS_FLAGS\` helper macros that automatically generate bitwise overload parameters for custom C++ enums.
❌ **Missing:** Automatic bitwise compiler mappings for standard Blueprints variables (Blueprints does not natively support bitwise operations on enums without slow utility libraries).

## Your Task
Let's pack combat modifiers in a custom bitmask.
1. Declare a standard \`enum class ECombatState : uint64\` containing two flags:
   - \`IS_ATTACK = 1ULL << 0\`
   - \`IS_CRIT = 1ULL << 1\`
2. Write a static or regular function:
   \`bool IsCriticalAttack(uint64 Mask)\`
   It should return \`true\` if BOTH \`IS_ATTACK\` (which is \`1ULL\`) and \`IS_CRIT\` (\`2ULL\`) are set inside \`Mask\`. Hint: evaluate binary state using \`(Mask & 1ULL) && (Mask & 2ULL)\` or \`(Mask & (1ULL | 2ULL)) == (1ULL | 2ULL)\`.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"

// TODO: Declare enum class ECombatState : uint64
// TODO: Write bool IsCriticalAttack(uint64 Mask) checking both bits are active
`,
    },
    hiddenTests: ['ECombatState', 'uint64', 'IS_ATTACK', 'IS_CRIT', 'IsCriticalAttack', 'Mask'],
    successCriteria: [
      'Declare enum class ECombatState : uint64',
      'Add IS_ATTACK = 1ULL << 0 and IS_CRIT = 1ULL << 1 flags',
      'Create IsCriticalAttack(uint64 Mask) function check',
      'Evaluate mask bits using binary & operators',
    ],
    rules: [
      {
        id: 'r_opt11_bitwise',
        type: 'unreal',
        description: 'Bitwise tag check evaluation constructed securely',
        evaluate: (code) => {
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
          const hasEnum = stripped.includes('enumclassECombatState:uint64');
          const hasFlags = stripped.includes('IS_ATTACK=1ULL<<0') && stripped.includes('IS_CRIT=1ULL<<1') || stripped.includes('IS_ATTACK=1') && stripped.includes('IS_CRIT=2');
          const hasFunc = stripped.includes('boolIsCriticalAttack(uint64Mask)');
          const hasAnd = stripped.includes('&3') || stripped.includes('&') && stripped.includes('IS_ATTACK') && stripped.includes('IS_CRIT') || stripped.includes('&1ULL') && stripped.includes('&2ULL');
          
          if (!hasEnum) return { passed: false, error: 'Must declare enum class ECombatState of type uint64.', fix: 'enum class ECombatState : uint64' };
          if (!hasFlags) return { passed: false, error: 'Must define IS_ATTACK = 1ULL << 0 and IS_CRIT = 1ULL << 1 fields inside the enum.', fix: 'IS_ATTACK = 1ULL << 0,\nIS_CRIT = 1ULL << 1' };
          if (!hasFunc) return { passed: false, error: 'Must write IsCriticalAttack(uint64 Mask) function.', fix: 'bool IsCriticalAttack(uint64 Mask)' };
          
          return { passed: true, error: '', fix: '' };
        }
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_opt11',
        title: 'Bitwise Combat Evaluation',
        code: {
          'Source.h': `enum class ECombatState : uint64
{
    IS_ATTACK = 1ULL << 0,
    IS_CRIT   = 1ULL << 1
};

bool IsCriticalAttack(uint64 Mask)
{
    const uint64 Target = static_cast<uint64>(ECombatState::IS_ATTACK) | static_cast<uint64>(ECombatState::IS_CRIT);
    return (Mask & Target) == Target;
}
`,
        },
        explanation: 'By using the static bitwise operations and bitwise flags, combat status states are evaluated at hard registers heights, eliminating classes, references, or dynamic allocations of variables.',
      },
    ],
  };
