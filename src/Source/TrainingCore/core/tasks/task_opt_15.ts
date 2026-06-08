import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_opt_15: UTaskDefinition = {
    id: 'task_opt_15',
    title: '62. Template Metaprogramming & Compile-Time Registry Sieves',
    category: 'Stage 16: Deep Dive C++ Optimization',
    objective: `# Template Metaprogramming & Compile-Time Registry Sieves ($O(1)$ Caching)

In complex, systems-dense role-playing games like *Baldur's Gate 3* or *Path of Exile*, dynamic spell and gear modification engines constantly query variable registries (e.g. "Get my current Magic Damage Multiplier", "Read Fire Spell Pierce Chance"). 

If you use standard reflection libraries or string lookups (\`Map["FireDamage"]\`) inside combat ticks, the CPU must invoke hash comparisons, resolve memory addresses, or walk reflection trees. This runtime lookup cost of **120ns to 1200ns** per attribute query, when compounded across hundreds of active entities executing ticks, spikes cpu frames by **-4.5ms**, creating severe stutter.

**Compile-Time Template Metaprogramming** completely eliminates this runtime cost. By registering distinct variables as C++ types directly at compile-time, the compiler assigns an immutable, unique integer ID (\`Index\`) to each attribute. 

Querying an attribute then compiles directly into a simple, single-cycle constant-offset array lookup: **\`MyAttributes[Index]\`**! This takes **less than 0.2 nanoseconds**, with absolute zero runtime hashing overhead and zero memory allocation.

---

## 🛠️ Deep Dive: RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-3.8ms to -5.5ms)**: Bypassing dynamic gameplay string checks drops hot-path tick operations inside massive isometric combat scenarios by up to **-5.5ms**. Lookups execute in literally **one CPU assembly command**, eliminating CPU waiting cycles entirely.
*   **GPU Impact (0.0ms directly)**: CPU frame time optimizations keep the rendering thread fully fed.
*   **RAM Impact (Saves 40MB+ System RAM)**: Eliminates millions of dynamic temporary heap string buffers generated during dynamic tag or category lookups. Maintains combat records inside tightly packed, flat arrays.
*   **VRAM Impact (0.0ms)**: Purely cpu cache and instruction optimization.
*   **Latency & Ping Impact (0.0ms)**: Bypasses network packet serialization delays since static indices are trivial to pack compared to verbose nested strings.

---

## ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**:
    1.  \`TIsSame<A, B>\` and standard C++ Type Traits templates to compare compiler-level classes.
    2.  \`TStaticArray<T, Size>\` which guarantees compilation-ready array sizes packed continuously in physical memory.
*   ⚠️ **What UE5 Lacks**:
    1.  **No Safe Compile-Time Registration of Blueprints variables**: Every variable declared inside blueprints is handled dynamically at runtime via the Reflection Engine, which consumes heavy memory lookup cycles.
    2.  **No Type-Safe Static Gameplay Ability registries**: Default GAS attributes rely on dynamic runtime registration classes, leading to initialization delays of up to hundreds of milliseconds.
*   🛠️ **How to Use / Workaround**:
    Create an abstract base helper class using C++ templates. Create a static counter template that increments per type queried, assigning unique sequential IDs to distinct custom struct rows. Store them inside standard C++ \`constexpr\` arrays or \`TStaticArray\`. This merges the flexibility of a dynamic variable system with the speed of static-aligned arrays!

---

## Your Task
Implement a compile-time static type counter registry:
1. Complete the template class \`TAttributeIdRegister<T>\` which auto-generates a unique structural ID for any passed type \`T\`.
2. Implement a static integer \`Counter\` in \`FAttributeRegistryCore\` to keep track of the cumulative registration offsets.
3. Call \`Counter++\` during initialization of the specific type's lookup to assign a unique index to \`TAttributeIdRegister<T>::Id\`, and return this index.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"

class FAttributeRegistryCore
{
public:
    static int32 Counter;
};

// Ensure our static counter starts at 0
int32 FAttributeRegistryCore::Counter = 0;

template <typename T>
struct TAttributeIdRegister
{
    static int32 Id;
};

// TODO: Initialize the template's static integer "Id" variable!
// Hint: It should invoke our registry Counter and assign a unique incremented index.
// Format: template <typename T> int32 TAttributeIdRegister<T>::Id = FAttributeRegistryCore::Counter++;
`,
    },
    hiddenTests: ['FAttributeRegistryCore', 'Counter', 'TAttributeIdRegister', 'Id', 'Counter++'],
    successCriteria: [
        'Understand and apply template metaprogramming',
        'Auto-generate unique structural indices for template types',
        'Eliminate runtime string / hash map comparisons',
        'Exposes static O(1) query heights to high-frequency gameloops'
    ],
    rules: [
      {
        id: 'r_opt15_template_sieve',
        type: 'unreal',
        description: 'Verify template static Id is incremented and assigned uniquely per type',
        evaluate: (code) => {
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
          const hasTemplateInit = stripped.includes('template<typenameT>int32TAttributeIdRegister<T>::Id=');
          const hasIncrement = stripped.includes('Counter++') || stripped.includes('Counter=Counter+1');

          if (!hasTemplateInit) return { passed: false, error: 'Must initialize the template variable static int32 TAttributeIdRegister<T>::Id.', fix: 'template <typename T> int32 TAttributeIdRegister<T>::Id = ...' };
          if (!hasIncrement) return { passed: false, error: 'Must assign the dynamic static counter dynamically (Counter++) so every template type receives a unique incremental index.', fix: 'template <typename T> int32 TAttributeIdRegister<T>::Id = FAttributeRegistryCore::Counter++;' };

          return { passed: true, error: '', fix: '' };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_opt15',
        title: 'Static Compile-Time Sieve',
        code: {
          'Source.h': `class FAttributeRegistryCore
{
public:
    static int32 Counter;
};

int32 FAttributeRegistryCore::Counter = 0;

template <typename T>
struct TAttributeIdRegister
{
    static int32 Id;
};

template <typename T>
int32 TAttributeIdRegister<T>::Id = FAttributeRegistryCore::Counter++;
`,
        },
        explanation: 'By leveraging template static variable initializations, every distinct type T passed assigns itself a cumulative unique index at application startup. Lookups resolve into a single-cycle indices lookup (O(1)), completely skipping dynamic map checks.',
      },
    ],
  };
