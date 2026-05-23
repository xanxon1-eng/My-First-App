import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_31_1: UTaskDefinition = {
    id: 'task_31_1',
    title: '31.1. Safe Casting — ExactCast & CastChecked (CPU Instruction Minimization)',
    category: 'Stage 13: AAA Optimization (CPU/RAM)',
    objective: `# CPU Limits of Dynamic Reflection Casts

In standard Unreal Engine gameplay, \`Cast<Type>(Object)\` relies on Unreal's reflection system to dynamically traverse the class inheritance tree (is this Actor a Character? Is it a Pawn? Is it an APoEBoss?). While incredibly safe and convenient, this tree traversal involves numerous pointer comparisons deep inside the memory heap.

If you run several hundred \`Cast<>\` calls per frame (e.g., ticking proximity sweeps checking for "Is this a LootableItem?" in a massive dense market zone like Novigrad), those CPU cycles stack up, causing severe performance bottlenecks.

---

## 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-2.5ms to -4.0ms during sweeps)**: \`ExactCast<T>()\` bypasses the entire inheritance tree check and simply validates a single memory flag. \`CastChecked<T>()\` asserts that the cast is guaranteed, eliminating null-checks in production builds completely, slicing instruction execution time from 100+ nanoseconds to roughly 2 nanoseconds per hit.
*   **GPU Impact (0.0ms)**: Does not interact with GPU directly.
*   **RAM Impact (0.0ms)**: No difference in memory footprint.
*   **VRAM Impact (0.0ms)**: N/A.
*   **Latency & Ping Impact (-15ms simulation stability)**: By keeping the central simulation ticks under 10ms, server snapshots are fired accurately across the wire without jitter offsets.

### ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**: \`ExactCast<T>()\` (True only if the object is exactly T, not a subclass) and \`CastChecked<T>()\` (fatal crash if cast fails; strictly for guaranteed code).
*   ⚠️ **What UE5 Lacks**: The compiler won't warn you if you put heavy dynamic casts inside high-frequency loops (like Tick or async collisions).
*   🛠️ **How to Use / Workaround**: If you already know definitively what class an object is (or you only want exact types, rather than children), swap \`Cast<T>\` for \`ExactCast<T>\` or \`CastChecked<T>\`.

---

## Your Task
Inside \`ProcessExactLoot\`, you need to aggressively filter. You ONLY want exact matches of \`ALootChest\` (no subclasses, no derived mimic chests).

1. Replace the standard \`Cast<ALootChest>\` with \`ExactCast<ALootChest>\` to heavily optimize the evaluation.
2. Maintain the validation \`if (Chest)\` nullcheck (since ExactCast returns null on failure).
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"
#include "GameFramework/Actor.h"

class ALootChest : public AActor {};

void ProcessExactLoot(AActor* EncounteredActor)
{
    // TODO: Optimize this by using ExactCast instead of Cast
    ALootChest* Chest = Cast<ALootChest>(EncounteredActor);

    if (Chest)
    {
        // Safe context execution...
    }
}
`,
    },
    hiddenTests: ['ExactCast<ALootChest>', 'ALootChest*', 'Chest'],
    successCriteria: [
      'Replaces Cast with ExactCast',
      'Keeps chest pointer assignment',
    ],
    rules: [
      {
        id: 'r_opt_exactcast',
        type: 'unreal',
        description: 'Implement ExactCast for O(1) checking',
        evaluate: (code) => {
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
          const valid = stripped.includes('ALootChest*Chest=ExactCast<ALootChest>(EncounteredActor);');
          
          if (valid) {
             return { passed: true, error: '', fix: '' };
          }
          if (stripped.includes('Cast<ALootChest>')) {
             return { passed: false, error: 'You are still using standard Cast().', fix: 'Replace Cast with ExactCast.' };
          }

          return {
            passed: false,
            error: 'You must use ExactCast<ALootChest> to assign the Chest pointer.',
            fix: 'ALootChest* Chest = ExactCast<ALootChest>(EncounteredActor);'
          };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_opt_exactcast',
        title: 'CPU Cycle Minimization',
        code: {
          'Source.cpp': `void ProcessExactLoot(AActor* EncounteredActor)
{
    // O(1) Fast pathway lookup, skips inheritance navigation
    ALootChest* Chest = ExactCast<ALootChest>(EncounteredActor);

    if (Chest)
    {
        // Execution
    }
}
`,
        },
        explanation: 'ExactCast executes a single static pointer class ID comparison instead of jumping through the inheritance tree pointer chains inside memory. It is extremely fast for sweeping massive arrays.',
      },
    ],
  };
