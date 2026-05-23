import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_opt_10: UTaskDefinition = {
    id: 'task_opt_10',
    title: '57. Compile-Time Fowler-Noll-Vo Hashing (FNV-1a)',
    category: 'Stage 16: Deep Dive C++ Optimization',
    objective: `# Compile-Time Fowler-Noll-Vo Hashing (FNV-1a)

In open-world game engines, looking up items, bone transform states, or dialog IDs by string is incredibly slow. Characters are stored in dynamic RAM heaps; comparing them forces the CPU to iterate byte-by-byte, stalls the execution pipelines.

By computing strings into fast 32-bit integers at compile-time using a **constexpr Fowler-Noll-Vo (FNV-1a)** hash function, the compiler completely replaces literal strings with compact integers (\`0x8C1B4E85\`). Runtime lookups then compile down into a single-cycle O(1) CPU register comparison!

---

## 🛠️ Deep Dive: Baldur's Gate 3-Scale dialogue ID and Modder Lookups
When managing thousands of voice assets, dialog indices, or active mod variables (*Baldur's Gate 3* or *The Witcher 3* scaling), string comparators (\`strcmp\`) will degrade your Game Thread runtime performance.

### 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-1.2ms to -2.8ms)**: Dynamic string comparison forces the CPU to chase string pointers across heap memory boundaries, causing severe instruction-pipeline bubbles. At 1,000 checks per frame (searching state maps or skill tables), raw string parsing spikes CPU overhead by **+2.8ms**. A constexpr FNV-1a hash evaluates all literal lookups at compile-time down to a single 32-bit unsigned integer, compiling comparisons down to a single assembly \`cmp\` register instruction that executes in **under 1 nanosecond (0.0ms CPU)**.
*   **GPU Impact (0.0ms; keeps the CPU render-command thread moving)**: Reducing game thread overhead ensures smooth drawing command dispatch, avoiding GPU starvation spikes.
*   **RAM Impact (~50MB saved in open-world play)**: Completely eliminates the need to allocate and cache massive dynamic string tables in system RAM, preventing memory leaks and fragmentations during prolonged travel sessions.
*   **VRAM Impact (0.0ms direct)**: Pure CPU instruction optimization.
*   **Latency & Ping Impact (-15ms reduction)**: Fast database and transaction ID checks speed up co-op lockstep authorizations, reducing packet processing lag on dedicated servers.

### ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**: 
    1.  \`FName\`: Hashes strings at runtime on first lookup and registers them inside an global name table. This is extremely efficient for engine-internal systems.
*   ⚠️ **What UE5 Lacks**: 
    1.  No native out-of-the-box system for strict compile-time \`constexpr\` string hashing in custom modded dictionaries, meaning modular mod assets must register items at runtime, incurring heap allocation delays.
*   🛠️ **How to Use / Workaround**: 
    Implement a custom compile-time FNV-1a hash operator. In C++, you can write a raw literal operator helper (\`constexpr uint32 operator""_hash(const char* Str, size_t Size)\`). This lets you write code like \`switch (HashFNV1a(SkillName)) { case "Slash"_hash: ... }\`. This compiles down to a direct jump table of integers in standard assembly output, utilizing zero heap buffers and bypassing string comparisons entirely.

---

## Your Task
Let's build a C++ \`constexpr\` algorithm. 
Write a \`constexpr uint32 HashFNV1a(const char* Str, uint32 Hash = 2166136261u)\` function that calculates the hash of string \`Str\` recursively:
- If \`*Str == '\\0'\`, return the accumulated \`Hash\`.
- Else, return recursive call to \`HashFNV1a(Str + 1, (Hash ^ (uint8)(*Str)) * 16777619u)\`.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"

// TODO: Define constexpr uint32 HashFNV1a(const char* Str, uint32 Hash = 2166136261u)
// TODO: Recursively compile: if *Str is \\0, return Hash; else evaluate next char
`,
    },
    hiddenTests: ['HashFNV1a', 'constexpr', 'const char*', 'uint32', '2166136261', '16777619'],
    successCriteria: [
      'Define constexpr uint32 HashFNV1a',
      'Initialize with offset hash anchor 2166136261u',
      'Use the FNV prime multiplier 16777619u',
      'Compile-time string traversal recursion or loop',
    ],
    rules: [
      {
        id: 'r_opt10_constexpr',
        type: 'unreal',
        description: 'Constexpr compile-time string hashing function defined',
        evaluate: (code) => {
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
          const hasConstexpr = stripped.includes('constexpruint32HashFNV1a') || stripped.includes('constexprunsignedintHashFNV1a');
          const hasPrime = stripped.includes('16777619');
          const hasAnchor = stripped.includes('2166136261');
          
          if (!hasConstexpr) return { passed: false, error: 'Must specify a constexpr uint32 HashFNV1a function signature.', fix: 'constexpr uint32 HashFNV1a(const char* Str, uint32 Hash = 2166136261u)' };
          if (!hasPrime || !hasAnchor) return { passed: false, error: 'Must utilize standard FNV-1a parameters (2166136261 offset basis and 16777619 multiplier).', fix: '(Hash ^ *Str) * 16777619u' };
          
          return { passed: true, error: '', fix: '' };
        }
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_opt10',
        title: 'FNV1a Hashing',
        code: {
          'Source.h': `constexpr uint32 HashFNV1a(const char* Str, uint32 Hash = 2166136261u)
{
    return *Str == '\\0' ? Hash : HashFNV1a(Str + 1, (Hash ^ static_cast<uint8>(*Str)) * 16777619u);
}
`,
        },
        explanation: 'By writing constexpr, the compiler fully evaluates HashFNV1a at compilation time if the input is a string literal, baking the final 32-bit integer directly into your machine output.',
      },
    ],
  };
