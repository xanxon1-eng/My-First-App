import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_opt_10: UTaskDefinition = {
    id: 'task_opt_10',
    title: '57. Compile-Time Fowler-Noll-Vo Hashing (FNV-1a)',
    category: 'Stage 16: Deep Dive C++ Optimization',
    objective: `# Compile-Time Fowler-Noll-Vo Hashing (FNV-1a)

In open-world game engines, looking up items, bone transform states, or dialog IDs by string is incredibly slow. Characters are stored in dynamic RAM heaps; comparing them forces the CPU to iterate byte-by-byte, stalls the execution pipelines.

By computing strings into fast 32-bit integers at compile-time using a **constexpr Fowler-Noll-Vo (FNV-1a)** hash function, the compiler completely replaces literal strings with compact integers (\`0x8C1B4E85\`). Runtime lookups then compile down into a single-cycle O(1) CPU register comparison!

### Hardware Impact (Concrete Metrics)
- **CPU:** Saves -1.2ms of CPU time across thousands of inventory and dialog ID comparisons.
- **GPU:** Indirect. Frees up processing budgets for game thread rendering setups.
- **RAM:** Zero runtime dynamic character string duplication or heap copying.
- **VRAM:** No impact.
- **Latency / Ping:** Reductions in lookup latency from microsecond scans to sub-nanosecond direct integer comparisons.

### What Unreal Engine Has / Needs
✅ **Has:** \`FName\` symbols system, which hashes strings at runtime on first lookup.
❌ **Missing:** Strict standard compile-time \`constexpr\` string hashing functions out-of-the-box for custom lookup keys or modder indexes.

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
