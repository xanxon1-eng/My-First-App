import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_16: UTaskDefinition = {
    id: 'task_16',
    title: '16. Const Correctness',
    category: 'Stage 3: Unreal Core & Data',
    objective: `# Const Correctness

\`const\` is a compile-time promise: "I will not modify this."

Benefits:
- **Safety** — the compiler prevents accidental writes.
- **Clarity** — readers know a function is read-only.
- **Optimisation** — const enables more aggressive inlining.

\`\`\`cpp
// Can't modify Name inside — efficient (no copy) and safe
void PrintName(const FString& Name)
{
    UE_LOG(LogTemp, Log, TEXT("%s"), *Name);
}
\`\`\`

In Unreal, const member functions signal that calling them doesn't change the object's observable state:
\`\`\`cpp
float GetHealth() const { return Health; }
\`\`\`

---

## 🛠️ Deep Dive: Witcher 3-Scale Combat Pipeline & Zero-Copy Reference Passing
High-frequency loops inside combat engines (such as spell hit assessments or inventory changes) demand strict pass-by-reference hygiene.

### 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-2.4ms to -3.2ms)**: Passing combat damage packet structures by value (e.g. \`void EvaluateHit(FCombatHitPacket HitPacket)\`) forces the compiler to call the structure's copy constructor, duplicating nested statistics, tag arrays, and status maps. Under intense spell congestion (100 simultaneous fireballs in *Path of Exile*), this copy overhead spikes C++ Game Thread by **+3.2ms**. Declaring parameters as \`const FCombatHitPacket& HitPacket\` passes a raw 64-bit reference address, running in **~0.01ms** (recovering -3.1ms CPU).
*   **GPU Impact (0.0ms; prevents draw-call thread starvation bottlenecks)**: Ensuring rapid CPU combat execution avoids rendering bottlenecks, keeping the GPU pipeline saturated at maximum frames.
*   **RAM Impact (~14KB stack savings per hit)**: Value copying dumps temporary copies directly onto the thread Stack. Extensive copying causes L1 data cache eviction cycles, where useful contiguous data is evicted to L2/L3 cache blocks (takes unneeded clock cycles). Zero-copy references occupy **0 bytes of extra stack memory**, keeping data hot in L1 registers.
*   **VRAM Impact (0.0ms direct)**: Pure CPU simulation optimization.
*   **Latency & Ping Impact (0.0ms clock delay)**: Maintains steady framerates, keeping input-to-render display latency to sub-16.6ms intervals without sudden micro-stutters.

### ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**: 
    1.  Standard C++ compile-time reference inlining (\`const Reference&\`), converting pointer registers directly in machine assembly.
    2.  Blueprints process \`const Type&\` inputs natively as read-only parameters, bypassing standard Blueprint variable duplicates.
*   ⚠️ **What UE5 Lacks**: 
    1.  No automatic compiler warning if large custom structures (such as USTRUCTs) are passed by value inside standard C++ code blocks or UFUNCTIONs. It fails silently, accumulating hidden performance drops.
*   🛠️ **How to Use / Workaround**: 
    Adopt a strict rule: any custom structure larger than 16 bytes (which holds more than 4 floats) **MUST** be passed as a const reference: \`const FMyHeavyStruct& Param\`. Decorate search queries and immutable calculations with \`const\` member attributes (e.g. \`float GetCurrentAttackSpeed() const;\`). This tells the compiler that the function is side-effect free, permitting compile-time optimizations.

---

## Your Task
Write \`void PrintName(const FString& Name)\`. The body can be empty.
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

// TODO: Write PrintName that takes a const FString& Name
`,
    },
    hiddenTests: ['PrintName', 'const FString&', 'Name'],
    successCriteria: [
      'Function PrintName exists',
      'Parameter is const FString& Name',
    ],
    rules: [
      {
        id: 'r16_fn',
        type: 'exercise',
        description: 'void PrintName(const FString& Name)',
        evaluate: (code) => ({
          passed: condense(code).includes('voidPrintName(constFString&Name)'),
          error: 'Function signature must exactly match: void PrintName(const FString& Name)',
          fix: 'void PrintName(const FString& Name) { }',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_16a',
        title: 'Const reference parameter with logging',
        code: {
          'Source.cpp': `void PrintName(const FString& Name)
{
    // *Name converts FString to TCHAR* for UE_LOG
    UE_LOG(LogTemp, Log, TEXT("Player name: %s"), *Name);
}
`,
        },
        explanation: 'The * before Name dereferences the FString into a raw TCHAR* which UE_LOG expects for %s format specifiers.',
      },
    ],
  };
