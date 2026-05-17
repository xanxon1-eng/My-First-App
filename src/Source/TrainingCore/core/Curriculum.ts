/**
 * Curriculum.ts — Improved UE5 C++ Training Curriculum
 *
 * KEY IMPROVEMENTS OVER ORIGINAL:
 *  1. Every task has at least one `exampleSolutions` entry with annotated code.
 *  2. Rules are split into granular checks so the diagnostics panel pinpoints
 *     exactly which requirement is missing, not just "task failed".
 *  3. Rule `evaluate` returns a rich { passed, error, fix } object consistently.
 *  4. Objectives include inline code fences so Monaco syntax-highlighting works
 *     in the markdown panel.
 *  5. Category progression follows the guide: Raw Metal → Memory → UE Core →
 *     Advanced Architecture → UE5 Pro → Blueprint Integration → Production →
 *     Framework → Modern C++ → Enterprise.
 *  6. The final few trivially-easy tasks (e.g. "write a comment") have been
 *     rewritten into real exercises with meaningful validation.
 *  7. `hiddenTests` strings are kept consistent with what `UTestFrameworkBindings`
 *     checks (substring presence in code) so they actually gate completion.
 */

import { UTaskDefinition } from './TrainingCore';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Trim, remove all whitespace, lowercase — normalises code before regex tests. */
const norm = (code: string) => code.replace(/\s+/g, ' ').toLowerCase();

/** Returns true if pattern exists anywhere in the normalised code. */
const has = (code: string, pattern: string | RegExp) =>
  typeof pattern === 'string'
    ? norm(code).includes(norm(pattern))
    : pattern.test(code);

// ---------------------------------------------------------------------------
// Curriculum
// ---------------------------------------------------------------------------

export const embeddedTasks: UTaskDefinition[] = [
  // =========================================================================
  // STAGE 1 — THE RAW METAL
  // =========================================================================

  {
    id: 'task_1',
    title: '1. Raw Variables & Primitive Types',
    category: 'Stage 1: The Raw Metal',
    objective: `# Raw Variables & Primitive Types

C++ is a **statically typed** language: you must declare the type of every variable before you can use it. The compiler uses that information to decide exactly how many bytes to reserve in RAM.

| Type | Typical size | Range |
|------|-------------|-------|
| \`bool\` | 1 byte | true / false |
| \`int32\` | 4 bytes | ±2.1 billion |
| \`float\` | 4 bytes | ~7 significant digits |

In Unreal we prefer \`int32\` over bare \`int\` because the Standard doesn't guarantee \`int\` is 32-bit on every platform.

## Your Task
Inside \`Practice()\`:
1. Declare \`int32 Health = 100;\`
2. Declare \`float Damage = 45.5f;\` — note the **\`f\`** suffix; without it the literal is \`double\`.
3. Declare \`bool bIsAlive = true;\` — UE convention: booleans start with lowercase **b**.
`,
    starterCode: {
      'Source.cpp': `void Practice()
{
    // TODO 1: Declare int32 Health = 100
    // TODO 2: Declare float Damage = 45.5f
    // TODO 3: Declare bool bIsAlive = true
}
`,
    },
    hiddenTests: ['int32 Health', 'float Damage', 'bool bIsAlive'],
    successCriteria: [
      'Declare int32 Health initialized to 100',
      'Declare float Damage initialized to 45.5f',
      'Declare bool bIsAlive initialized to true',
    ],
    rules: [
      {
        id: 'r1_health',
        type: 'exercise',
        description: 'int32 Health = 100',
        evaluate: (code) => {
          const ok = /int32\s+Health\s*=\s*100\s*;/.test(code);
          return { passed: ok, error: 'Missing: int32 Health = 100;', fix: 'int32 Health = 100;' };
        },
      },
      {
        id: 'r1_damage',
        type: 'exercise',
        description: 'float Damage = 45.5f',
        evaluate: (code) => {
          const ok = /float\s+Damage\s*=\s*45\.5f?\s*;/.test(code);
          return { passed: ok, error: 'Missing: float Damage = 45.5f; (remember the f suffix)', fix: 'float Damage = 45.5f;' };
        },
      },
      {
        id: 'r1_alive',
        type: 'exercise',
        description: 'bool bIsAlive = true',
        evaluate: (code) => {
          const ok = /bool\s+bIsAlive\s*=\s*true\s*;/.test(code);
          return { passed: ok, error: 'Missing: bool bIsAlive = true; (UE boolean prefix is lowercase b)', fix: 'bool bIsAlive = true;' };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_1a',
        title: 'Standard solution',
        explanation:
          'All three variables are declared with explicit initializers. The float uses the mandatory f suffix to avoid an implicit narrowing from double.',
        code: {
          'Source.cpp': `void Practice()
{
    int32  Health   = 100;
    float  Damage   = 45.5f;
    bool   bIsAlive = true;
}
`,
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_2',
    title: '2. Arithmetic & Logic Operators',
    category: 'Stage 1: The Raw Metal',
    objective: `# Arithmetic & Logic Operators

With variables declared you can mutate them. Unreal gameplay logic is full of:
- **Arithmetic**: \`+\`, \`-\`, \`*\`, \`/\`, compound assignment \`-=\`
- **Comparison**: \`>\`, \`<\`, \`==\`, \`!=\`
- **Logical**: \`&&\` (AND), \`||\` (OR), \`!\` (NOT)

\`\`\`cpp
Health -= Damage;          // subtract and assign back
bIsAlive = Health > 0;     // comparison returns bool
\`\`\`

## Your Task
Given the starter variables:
1. Subtract \`Damage\` from \`Health\` using a compound assignment.
2. Set \`bIsAlive\` to \`true\` only when \`Health > 0\`.
`,
    starterCode: {
      'Source.cpp': `void Practice()
{
    int32 Health  = 100;
    int32 Damage  = 45;
    bool  bIsAlive = true;

    // TODO 1: Subtract Damage from Health
    // TODO 2: Update bIsAlive based on Health > 0
}
`,
    },
    hiddenTests: ['Health - Damage', 'Health > 0'],
    successCriteria: [
      'Subtract Damage from Health (use -= or Health = Health - Damage)',
      'Assign bIsAlive using Health > 0 comparison',
    ],
    rules: [
      {
        id: 'r2_subtract',
        type: 'exercise',
        description: 'Health reduced by Damage',
        evaluate: (code) => {
          const ok =
            /Health\s*-=\s*Damage\s*;/.test(code) ||
            /Health\s*=\s*Health\s*-\s*Damage\s*;/.test(code);
          return {
            passed: ok,
            error: 'Health must be reduced by Damage.',
            fix: 'Health -= Damage;',
          };
        },
      },
      {
        id: 'r2_alive',
        type: 'exercise',
        description: 'bIsAlive reflects Health > 0',
        evaluate: (code) => {
          const ok =
            /bIsAlive\s*=\s*\(?Health\s*>\s*0\)?/.test(code) ||
            /bIsAlive\s*=\s*\(?0\s*<\s*Health\)?/.test(code);
          return {
            passed: ok,
            error: 'bIsAlive must be set using a Health > 0 comparison.',
            fix: 'bIsAlive = Health > 0;',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_2a',
        title: 'Compound assignment + direct comparison',
        explanation: '-= is idiomatic. Assigning a comparison result to a bool is safe and concise.',
        code: {
          'Source.cpp': `void Practice()
{
    int32 Health   = 100;
    int32 Damage   = 45;
    bool  bIsAlive = true;

    Health  -= Damage;        // Health == 55
    bIsAlive = Health > 0;    // bIsAlive == true
}
`,
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_3',
    title: '3. Scope Resolution & Namespaces',
    category: 'Stage 1: The Raw Metal',
    objective: `# Scope Resolution & Namespaces

When two libraries define a function with the same name, the compiler needs a way to pick the right one. **Namespaces** solve this by creating named scopes.

The C++ standard library lives in the \`std\` namespace. Printing to the console uses:
\`\`\`cpp
std::cout << "Hello, World!" << std::endl;
//    ^^                        ^^
//  namespace separator      end-of-line flush
\`\`\`

The **scope resolution operator \`::\`** reads as *"the thing named X inside namespace Y"*.

> In Unreal Engine code you will almost never use \`std::cout\`; \`UE_LOG\` is the correct tool. But understanding \`::\` is essential because Unreal uses it constantly: \`Super::BeginPlay()\`, \`FMath::Clamp()\`, etc.

## Your Task
In \`Practice()\`, use \`std::cout\` to print exactly the string \`"Hello Unreal"\` followed by \`std::endl\`.
`,
    starterCode: {
      'Source.cpp': `#include <iostream>

void Practice()
{
    // TODO: Print "Hello Unreal" using std::cout and std::endl
}
`,
    },
    hiddenTests: ['std::cout', 'Hello Unreal'],
    successCriteria: [
      'Use std::cout (not printf or UE_LOG)',
      'Print the exact string "Hello Unreal"',
      'Flush with std::endl or "\\n"',
    ],
    rules: [
      {
        id: 'r3_cout',
        type: 'exercise',
        description: 'std::cout used',
        evaluate: (code) => ({
          passed: code.includes('std::cout'),
          error: 'Must use std::cout (not printf or UE_LOG for this exercise).',
          fix: 'std::cout << "Hello Unreal" << std::endl;',
        }),
      },
      {
        id: 'r3_text',
        type: 'exercise',
        description: '"Hello Unreal" present in output',
        evaluate: (code) => ({
          passed: code.includes('"Hello Unreal"'),
          error: 'The string literal "Hello Unreal" must appear exactly (case sensitive).',
          fix: 'std::cout << "Hello Unreal" << std::endl;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_3a',
        title: 'Using std::cout with endl',
        explanation:
          'std::cout is the standard output stream. << chains output. std::endl flushes the buffer and appends a newline.',
        code: {
          'Source.cpp': `#include <iostream>

void Practice()
{
    std::cout << "Hello Unreal" << std::endl;
}
`,
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_4',
    title: '4. Pointers & the Address-Of Operator',
    category: 'Stage 1: The Raw Metal',
    objective: `# Pointers & the Address-Of Operator

A variable occupies physical bytes in RAM. A **pointer** stores the *address* of those bytes — essentially a GPS coordinate for memory.

\`\`\`cpp
int32 Ammo   = 30;
int32* AmmoPtr = &Ammo;   // AmmoPtr holds the address of Ammo
         //  ^  ^
         //  |  address-of operator
         //  pointer type
\`\`\`

To read or write through a pointer, you **dereference** it with \`*\`:
\`\`\`cpp
*AmmoPtr = 15;   // Ammo is now 15
\`\`\`

Pointers are the foundation of everything in Unreal: component attachment, UObject ownership, GC relationships. Nail this.

## Your Task
1. \`int32 Ammo = 30;\` is already provided.
2. Declare an \`int32*\` named \`AmmoPtr\` that points to \`Ammo\`.
3. Use \`*AmmoPtr\` to set \`Ammo\`'s value to **15** (dereference write).
`,
    starterCode: {
      'Source.cpp': `void Practice()
{
    int32 Ammo = 30;

    // TODO 1: Declare int32* AmmoPtr pointing to Ammo
    // TODO 2: Use *AmmoPtr to change Ammo's value to 15
}
`,
    },
    hiddenTests: ['int32* AmmoPtr', '&Ammo', '*AmmoPtr'],
    successCriteria: [
      'Declare int32* AmmoPtr = &Ammo;',
      'Use *AmmoPtr to write a new value',
    ],
    rules: [
      {
        id: 'r4_ptr',
        type: 'exercise',
        description: 'int32* AmmoPtr declared and assigned &Ammo',
        evaluate: (code) => {
          const ok =
            /(int32\*|int32 \*)\s*AmmoPtr\s*=\s*&Ammo/.test(code) ||
            (code.includes('AmmoPtr') && code.includes('&Ammo'));
          return {
            passed: ok,
            error: 'Must declare int32* AmmoPtr = &Ammo;',
            fix: 'int32* AmmoPtr = &Ammo;',
          };
        },
      },
      {
        id: 'r4_deref',
        type: 'exercise',
        description: 'Dereference write via *AmmoPtr',
        evaluate: (code) => ({
          passed: /\*AmmoPtr\s*=/.test(code),
          error: 'Must write through the pointer with *AmmoPtr = someValue;',
          fix: '*AmmoPtr = 15;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_4a',
        title: 'Pointer declaration + dereference write',
        explanation:
          '& gives us the address of Ammo. The * in the type declaration marks AmmoPtr as a pointer. The * in *AmmoPtr = ... dereferences — follow the address and write.',
        code: {
          'Source.cpp': `void Practice()
{
    int32  Ammo    = 30;
    int32* AmmoPtr = &Ammo;   // AmmoPtr holds address of Ammo

    *AmmoPtr = 15;            // Ammo is now 15 via pointer write
}
`,
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_5',
    title: '5. Dynamic Arrays — std::vector & TArray',
    category: 'Stage 1: The Raw Metal',
    objective: `# Dynamic Arrays: std::vector & TArray

When the number of elements isn't known at compile-time, we use **dynamic arrays** that resize at runtime.

| | std::vector | TArray (Unreal) |
|-|------------|----------------|
| Header | \`<vector>\` | automatic in UE |
| Add | \`.push_back(x)\` | \`.Add(x)\` |
| Count | \`.size()\` | \`.Num()\` |

Unreal wrote \`TArray\` because \`std::vector\` caused memory fragmentation inside the engine's custom allocators. The APIs are nearly identical — once you know one, you know the other.

## Your Task
1. Declare \`std::vector<int32> Scores;\`
2. Add \`100\`, \`200\`, and \`300\` using \`.push_back()\`.
`,
    starterCode: {
      'Source.cpp': `#include <vector>

void Practice()
{
    // TODO 1: Declare std::vector<int32> Scores
    // TODO 2: Add 100, 200, 300 via push_back
}
`,
    },
    hiddenTests: ['std::vector<int32> Scores', 'push_back'],
    successCriteria: [
      'Declare std::vector<int32> Scores',
      'Call push_back to add at least three values',
    ],
    rules: [
      {
        id: 'r5_vec',
        type: 'exercise',
        description: 'std::vector<int32> Scores declared',
        evaluate: (code) => ({
          passed: /std::vector\s*<\s*int32\s*>\s*Scores/.test(code),
          error: 'Declare std::vector<int32> Scores;',
          fix: 'std::vector<int32> Scores;',
        }),
      },
      {
        id: 'r5_push',
        type: 'exercise',
        description: 'push_back called at least three times',
        evaluate: (code) => {
          const matches = (code.match(/push_back/g) || []).length;
          return {
            passed: matches >= 3,
            error: `push_back found ${matches} time(s); need at least 3 (one per value: 100, 200, 300).`,
            fix: 'Scores.push_back(100);\nScores.push_back(200);\nScores.push_back(300);',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_5a',
        title: 'Sequential push_back',
        explanation: 'Each push_back appends one element to the heap-allocated internal buffer.',
        code: {
          'Source.cpp': `#include <vector>

void Practice()
{
    std::vector<int32> Scores;
    Scores.push_back(100);
    Scores.push_back(200);
    Scores.push_back(300);
    // Scores.size() == 3
}
`,
        },
      },
      {
        id: 'sol_5b',
        title: 'Brace-initializer list (C++11)',
        explanation: 'You can initialise with a braced list — the compiler constructs the vector with all three elements in one shot.',
        code: {
          'Source.cpp': `#include <vector>

void Practice()
{
    std::vector<int32> Scores = {100, 200, 300};
    // push_back still needed to satisfy the rule engine
    // in a real codebase this form is more concise
}
`,
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_6',
    title: '6. Control Flow — if / else / switch',
    category: 'Stage 1: The Raw Metal',
    objective: `# Control Flow

Programs make decisions. C++ provides:

- **if / else if / else** — condition-based branching
- **switch** — multi-way dispatch on an integer or enum

\`\`\`cpp
if (Health > 50)
{
    State = TEXT("Healthy");
}
else if (Health > 0)
{
    State = TEXT("Wounded");
}
else
{
    State = TEXT("Dead");
}
\`\`\`

## Your Task
Write a function \`FString GetHealthState(int32 Health)\` that:
- Returns \`TEXT("Healthy")\` if \`Health > 50\`
- Returns \`TEXT("Wounded")\` if \`Health > 0\`
- Returns \`TEXT("Dead")\` otherwise
`,
    starterCode: {
      'Source.cpp': `// Return a string describing the health state.
FString GetHealthState(int32 Health)
{
    // TODO: implement if/else chain and return appropriate FString
    return TEXT("");
}
`,
    },
    hiddenTests: ['GetHealthState', 'Healthy', 'Wounded', 'Dead'],
    successCriteria: [
      'Return "Healthy" when Health > 50',
      'Return "Wounded" when Health > 0',
      'Return "Dead" otherwise',
    ],
    rules: [
      {
        id: 'r6_func',
        type: 'exercise',
        description: 'GetHealthState function exists',
        evaluate: (code) => ({
          passed: code.includes('GetHealthState'),
          error: 'Implement a function named GetHealthState.',
          fix: 'FString GetHealthState(int32 Health) { ... }',
        }),
      },
      {
        id: 'r6_healthy',
        type: 'exercise',
        description: '"Healthy" branch present',
        evaluate: (code) => ({
          passed: code.includes('Healthy'),
          error: 'Missing "Healthy" return path.',
          fix: 'if (Health > 50) return TEXT("Healthy");',
        }),
      },
      {
        id: 'r6_wounded',
        type: 'exercise',
        description: '"Wounded" branch present',
        evaluate: (code) => ({
          passed: code.includes('Wounded'),
          error: 'Missing "Wounded" return path.',
          fix: 'else if (Health > 0) return TEXT("Wounded");',
        }),
      },
      {
        id: 'r6_dead',
        type: 'exercise',
        description: '"Dead" branch present',
        evaluate: (code) => ({
          passed: code.includes('Dead'),
          error: 'Missing "Dead" return path.',
          fix: 'return TEXT("Dead");',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_6a',
        title: 'if / else if / else chain',
        explanation:
          'Conditions are evaluated top-to-bottom. We guard the widest net last to avoid false positives.',
        code: {
          'Source.cpp': `FString GetHealthState(int32 Health)
{
    if (Health > 50)
        return TEXT("Healthy");
    else if (Health > 0)
        return TEXT("Wounded");
    else
        return TEXT("Dead");
}
`,
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_7',
    title: '7. Loops — for, while, range-for',
    category: 'Stage 1: The Raw Metal',
    objective: `# Loops

Three loop forms in C++:

\`\`\`cpp
// Classic indexed loop
for (int32 i = 0; i < 5; ++i) { ... }

// While — condition checked before each iteration
int32 i = 0;
while (i < 5) { ++i; }

// Range-for (C++11) — iterate over a container
TArray<int32> Arr = {1, 2, 3};
for (const int32& Val : Arr) { ... }
\`\`\`

## Your Task
In \`SumArray()\`:
1. Use a **range-for** loop to iterate over the provided \`TArray<int32> Numbers\`.
2. Accumulate the total into an \`int32 Total\` variable.
3. Return \`Total\`.
`,
    starterCode: {
      'Source.cpp': `int32 SumArray(const TArray<int32>& Numbers)
{
    int32 Total = 0;

    // TODO: use a range-for to accumulate Total

    return Total;
}
`,
    },
    hiddenTests: ['Total', 'for', 'Numbers'],
    successCriteria: [
      'Use a for loop (any form) over Numbers',
      'Accumulate into Total',
      'Return Total',
    ],
    rules: [
      {
        id: 'r7_loop',
        type: 'exercise',
        description: 'A for loop body present',
        evaluate: (code) => ({
          passed: /for\s*\(/.test(code),
          error: 'Must use a for loop to iterate.',
          fix: 'for (const int32& Val : Numbers) { Total += Val; }',
        }),
      },
      {
        id: 'r7_accum',
        type: 'exercise',
        description: 'Total is accumulated inside the loop',
        evaluate: (code) => ({
          passed: /Total\s*\+=/.test(code) || /Total\s*=\s*Total\s*\+/.test(code),
          error: 'Must add each element to Total.',
          fix: 'Total += Val;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_7a',
        title: 'Range-for accumulation',
        explanation:
          'const int32& Val borrows each element without copying. += accumulates. This pattern is identical for std::vector or TArray.',
        code: {
          'Source.cpp': `int32 SumArray(const TArray<int32>& Numbers)
{
    int32 Total = 0;
    for (const int32& Val : Numbers)
    {
        Total += Val;
    }
    return Total;
}
`,
        },
      },
    ],
  },

  // =========================================================================
  // STAGE 2 — CODE STRUCTURE & MEMORY
  // =========================================================================

  {
    id: 'task_8',
    title: '8. UPROPERTY Macro Specifiers',
    category: 'Stage 2: Code Structure & Memory',
    objective: `# UPROPERTY — Exposing Variables to the Engine

A plain C++ member variable inside a UCLASS is **invisible** to:
- The Unreal Editor details panel
- Blueprint visual scripting
- The Garbage Collector

\`UPROPERTY()\` tells the Unreal Header Tool (UHT) to register the variable with the reflection system.

Common specifiers:
| Specifier | Effect |
|-----------|--------|
| \`EditAnywhere\` | Editable in the editor on any instance or default |
| \`BlueprintReadWrite\` | Readable and writable from Blueprint graphs |
| \`Category = "Name"\` | Groups the property in the details panel |

\`\`\`cpp
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Combat")
int32 Health = 100;
\`\`\`

## Your Task
The class has a bare \`int32 Health\`. Add a \`UPROPERTY\` macro above it that includes **both** \`EditAnywhere\` and \`BlueprintReadWrite\`.
`,
    starterCode: {
      'Source.h': `class ACharacter
{
    // TODO: Add UPROPERTY(EditAnywhere, BlueprintReadWrite) above Health
    int32 Health = 100;
};
`,
    },
    hiddenTests: ['UPROPERTY', 'EditAnywhere', 'BlueprintReadWrite'],
    successCriteria: [
      'Add UPROPERTY() macro',
      'Include EditAnywhere specifier',
      'Include BlueprintReadWrite specifier',
    ],
    rules: [
      {
        id: 'r8_macro',
        type: 'unreal',
        description: 'UPROPERTY macro present',
        evaluate: (code) => ({
          passed: code.includes('UPROPERTY'),
          error: 'Missing UPROPERTY macro.',
          fix: 'UPROPERTY(EditAnywhere, BlueprintReadWrite)',
        }),
      },
      {
        id: 'r8_edit',
        type: 'unreal',
        description: 'EditAnywhere specifier',
        evaluate: (code) => ({
          passed: code.includes('EditAnywhere'),
          error: 'Missing EditAnywhere specifier.',
          fix: 'UPROPERTY(EditAnywhere, BlueprintReadWrite)',
        }),
      },
      {
        id: 'r8_bp',
        type: 'unreal',
        description: 'BlueprintReadWrite specifier',
        evaluate: (code) => ({
          passed: code.includes('BlueprintReadWrite'),
          error: 'Missing BlueprintReadWrite specifier.',
          fix: 'UPROPERTY(EditAnywhere, BlueprintReadWrite)',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_8a',
        title: 'Minimal UPROPERTY',
        explanation: 'The macro goes on the line directly above the member. UHT reads the .h file to generate reflection data.',
        code: {
          'Source.h': `class ACharacter
{
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Combat")
    int32 Health = 100;
};
`,
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_9',
    title: '9. Garbage Collection — Protecting UObject Pointers',
    category: 'Stage 2: Code Structure & Memory',
    objective: `# Garbage Collection & UPROPERTY Pointers

Unreal's GC scans memory every 30–60 seconds and **destroys any UObject that has no strong references**. A "naked" (non-UPROPERTY) pointer is not a strong reference — the GC cannot see it, so it may delete the object while your pointer still holds the address. This is a classic **dangling pointer** scenario → crash.

The fix: decorate every UObject pointer with \`UPROPERTY()\`.

\`\`\`cpp
// ❌ GC-invisible — will crash
UWeapon* CurrentWeapon;

// ✅ GC-aware — safe
UPROPERTY()
UWeapon* CurrentWeapon = nullptr;
\`\`\`

Also initialise to \`nullptr\`. Un-initialised pointers hold a random address — accessing them is undefined behaviour.

## Your Task
Declare a \`UWeapon*\` named \`CurrentWeapon\` inside \`APlayer\`:
1. Add \`UPROPERTY()\` above it.
2. Initialise it to \`nullptr\`.
`,
    starterCode: {
      'Source.h': `class APlayer
{
    // TODO: Declare UWeapon* CurrentWeapon with UPROPERTY() and = nullptr
};
`,
    },
    hiddenTests: ['UPROPERTY', 'UWeapon*', 'CurrentWeapon', 'nullptr'],
    successCriteria: [
      'Add UPROPERTY() decorator',
      'Declare UWeapon* CurrentWeapon',
      'Initialise to nullptr',
    ],
    rules: [
      {
        id: 'r9_prop',
        type: 'unreal',
        description: 'UPROPERTY() present',
        evaluate: (code) => ({
          passed: /UPROPERTY\s*\(/.test(code),
          error: 'Missing UPROPERTY() macro.',
          fix: 'UPROPERTY()',
        }),
      },
      {
        id: 'r9_ptr',
        type: 'unreal',
        description: 'UWeapon* CurrentWeapon declared',
        evaluate: (code) => ({
          passed: /UWeapon\s*\*/.test(code) && code.includes('CurrentWeapon'),
          error: 'Must declare UWeapon* CurrentWeapon.',
          fix: 'UWeapon* CurrentWeapon = nullptr;',
        }),
      },
      {
        id: 'r9_null',
        type: 'unreal',
        description: 'Pointer initialised to nullptr',
        evaluate: (code) => ({
          passed: /CurrentWeapon\s*=\s*nullptr/.test(code),
          error: 'Initialise CurrentWeapon to nullptr to prevent undefined behaviour.',
          fix: 'UWeapon* CurrentWeapon = nullptr;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_9a',
        title: 'GC-safe pointer declaration',
        explanation: 'UPROPERTY() with no specifiers is sufficient for GC visibility. The pointer will be set to nullptr by the GC when the pointed-to object is collected.',
        code: {
          'Source.h': `class APlayer
{
    UPROPERTY()
    UWeapon* CurrentWeapon = nullptr;
};
`,
        },
      },
      {
        id: 'sol_9b',
        title: 'With editor visibility',
        explanation: 'Adding VisibleAnywhere lets designers inspect the pointer in the details panel without being able to change it directly.',
        code: {
          'Source.h': `class APlayer
{
    UPROPERTY(VisibleAnywhere, Category = "Equipment")
    UWeapon* CurrentWeapon = nullptr;
};
`,
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_10',
    title: '10. FString & the TEXT() Macro',
    category: 'Stage 2: Code Structure & Memory',
    objective: `# FString and TEXT()

Unreal has three string types. Pick the right one:

| Type | Use when… |
|------|-----------|
| \`FName\` | Identifying objects (fast hash, immutable) |
| \`FText\` | Displaying text to the player (localisable) |
| \`FString\` | General runtime string manipulation |

Every string literal in Unreal **must** be wrapped in \`TEXT()\`:
\`\`\`cpp
FString Name = TEXT("Commando");
\`\`\`

Without \`TEXT()\` the literal is ANSI-encoded. On certain platforms (or with certain compilers), this breaks Unicode characters and potentially causes encoding mismatches at runtime.

## Your Task
Declare an \`FString\` named \`PlayerName\` and set it to \`TEXT("Commando")\`.
`,
    starterCode: {
      'Source.cpp': `void Practice()
{
    // TODO: Declare FString PlayerName = TEXT("Commando")
}
`,
    },
    hiddenTests: ['FString PlayerName', 'TEXT(', '"Commando"'],
    successCriteria: [
      'Declare FString PlayerName',
      'Use the TEXT() macro',
      'Value is "Commando"',
    ],
    rules: [
      {
        id: 'r10_fstring',
        type: 'unreal',
        description: 'FString PlayerName declared',
        evaluate: (code) => ({
          passed: code.includes('FString PlayerName'),
          error: 'Must declare FString PlayerName.',
          fix: 'FString PlayerName = TEXT("Commando");',
        }),
      },
      {
        id: 'r10_text',
        type: 'unreal',
        description: 'TEXT() macro used',
        evaluate: (code) => ({
          passed: code.includes('TEXT('),
          error: 'String literals in Unreal must use the TEXT() macro.',
          fix: 'FString PlayerName = TEXT("Commando");',
        }),
      },
      {
        id: 'r10_val',
        type: 'unreal',
        description: 'Value is "Commando"',
        evaluate: (code) => ({
          passed: code.includes('"Commando"'),
          error: 'Set the value to "Commando".',
          fix: 'FString PlayerName = TEXT("Commando");',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_10a',
        title: 'Standard FString declaration',
        code: {
          'Source.cpp': `void Practice()
{
    FString PlayerName = TEXT("Commando");
}
`,
        },
        explanation: 'TEXT() wraps the literal in the correct Unicode encoding macro for the current platform.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_11',
    title: '11. Header & Source Files (.h / .cpp)',
    category: 'Stage 2: Code Structure & Memory',
    objective: `# Header & Source Files

C++ compilation works in two stages:
1. **Header (.h)** — declarations. The *interface* others can see.
2. **Source (.cpp)** — definitions. The *implementation* no one else compiles directly.

To implement a member function in the .cpp file, you must prefix the function name with the class name and \`::\`:
\`\`\`cpp
// MyActor.h
void BeginPlay();

// MyActor.cpp
void AMyActor::BeginPlay()
{
    Super::BeginPlay();
}
\`\`\`

This design keeps compile times fast: changing the .cpp of one class doesn't force every other file that includes the header to recompile.

## Your Task
Implement \`AMyActor::BeginPlay()\` in the .cpp file. The function body can be empty (or call Super).
`,
    starterCode: {
      'Source.cpp': `// AMyActor declares BeginPlay() in its header.
// TODO: implement void AMyActor::BeginPlay() with curly braces

`,
    },
    hiddenTests: ['AMyActor::BeginPlay', '{', '}'],
    successCriteria: [
      'Write void AMyActor::BeginPlay()',
      'Include an opening and closing brace',
    ],
    rules: [
      {
        id: 'r11_sig',
        type: 'exercise',
        description: 'AMyActor::BeginPlay() function signature',
        evaluate: (code) => ({
          passed: /void\s+AMyActor::BeginPlay\s*\(\s*\)/.test(code),
          error: 'Must write: void AMyActor::BeginPlay()',
          fix: 'void AMyActor::BeginPlay() { }',
        }),
      },
      {
        id: 'r11_body',
        type: 'exercise',
        description: 'Function has a body {}',
        evaluate: (code) => ({
          passed: code.includes('{') && code.includes('}'),
          error: 'Function must have a body delimited by { }.',
          fix: 'void AMyActor::BeginPlay() { Super::BeginPlay(); }',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_11a',
        title: 'Minimal implementation',
        explanation: 'The scope-resolution prefix AMyActor:: is mandatory. UHT and the linker both rely on it.',
        code: {
          'Source.cpp': `void AMyActor::BeginPlay()
{
    Super::BeginPlay();
}
`,
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_12',
    title: '12. Inheritance & Polymorphism',
    category: 'Stage 2: Code Structure & Memory',
    objective: `# Inheritance & Polymorphism

C++ inheritance creates an **is-a** relationship: \`AMonster\` *is a* \`ACharacter\`.

\`\`\`cpp
class AMonster : public ACharacter
{
    // AMonster has all of ACharacter's members + its own
};
\`\`\`

**Virtual functions** allow overriding behaviour:
\`\`\`cpp
virtual void Attack() override;
\`\`\`

Unreal's class tree is deeply hierarchical: \`AActor → APawn → ACharacter → AMyCharacter\`. Understanding where your class sits determines what functions are available to you.

## Your Task
Declare class \`AMonster\` that **publicly** inherits from \`ACharacter\`. Include the class body \`{}\` and closing semicolon.
`,
    starterCode: {
      'Source.h': `// TODO: Declare class AMonster that inherits publicly from ACharacter

`,
    },
    hiddenTests: ['class AMonster', 'public ACharacter', '};'],
    successCriteria: [
      'Declare class AMonster',
      'Inherit publicly from ACharacter',
      'Close with };',
    ],
    rules: [
      {
        id: 'r12_class',
        type: 'exercise',
        description: 'class AMonster declared',
        evaluate: (code) => ({
          passed: code.includes('class AMonster'),
          error: 'Must declare class AMonster.',
          fix: 'class AMonster : public ACharacter { };',
        }),
      },
      {
        id: 'r12_inherit',
        type: 'exercise',
        description: 'public ACharacter in inheritance list',
        evaluate: (code) => ({
          passed: /:\s*public\s+ACharacter/.test(code),
          error: 'Must inherit publicly from ACharacter.',
          fix: ': public ACharacter',
        }),
      },
      {
        id: 'r12_semi',
        type: 'exercise',
        description: 'Class closed with };',
        evaluate: (code) => ({
          passed: code.includes('};'),
          error: 'Class definitions must end with };',
          fix: '};',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_12a',
        title: 'Minimal class declaration',
        code: {
          'Source.h': `class AMonster : public ACharacter
{
public:
    // Monster-specific members go here
};
`,
        },
        explanation: 'public ACharacter means AMonster can be used anywhere ACharacter is expected (Liskov substitution).',
      },
    ],
  },

  // =========================================================================
  // STAGE 3 — UNREAL CORE & DATA
  // =========================================================================

  {
    id: 'task_13',
    title: '13. Actor Lifecycle — BeginPlay & Super',
    category: 'Stage 3: Unreal Core & Data',
    objective: `# Actor Lifecycle

Every \`AActor\` goes through a defined lifecycle:

\`PostSpawnInitialize → PreInitializeComponents → InitializeComponent → PostInitializeComponents → **BeginPlay** → Tick → EndPlay\`

**BeginPlay** is your "Start" / "Awake" — it fires once when the actor enters the world.

## The Super Rule
If you override a virtual Unreal function, you **must** call the parent's version:
\`\`\`cpp
void AMyActor::BeginPlay()
{
    Super::BeginPlay();   // ← always first
    // your code here
}
\`\`\`

Skipping \`Super::BeginPlay()\` leaves engine systems (replication, component initialisation, blueprint BeginPlay) un-initialised → subtle, hard-to-find bugs.

## Your Task
Implement \`AMyPlayer::BeginPlay()\`. The **first** statement inside the body must be \`Super::BeginPlay();\`.
`,
    starterCode: {
      'Source.cpp': `void AMyPlayer::BeginPlay()
{
    // TODO: Call Super::BeginPlay() as the FIRST statement
}
`,
    },
    hiddenTests: ['Super::BeginPlay()'],
    successCriteria: ['Call Super::BeginPlay(); as the first statement'],
    rules: [
      {
        id: 'r13_super',
        type: 'unreal',
        description: 'Super::BeginPlay() called',
        evaluate: (code) => ({
          passed: code.includes('Super::BeginPlay()'),
          error: 'You MUST call Super::BeginPlay(); — the engine depends on it.',
          fix: 'Super::BeginPlay();',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_13a',
        title: 'Correct BeginPlay override',
        code: {
          'Source.cpp': `void AMyPlayer::BeginPlay()
{
    Super::BeginPlay();

    // Safe to do your own initialisation here
    UE_LOG(LogTemp, Log, TEXT("AMyPlayer has entered the world!"));
}
`,
        },
        explanation: 'Super:: calls the parent class version. Because of multiple-inheritance depth in UE, many engine subsystems rely on BeginPlay propagating up the chain.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_14',
    title: '14. Tick & DeltaTime',
    category: 'Stage 3: Unreal Core & Data',
    objective: `# Tick & Frame-Rate Independence

\`Tick(float DeltaTime)\` is called every frame. \`DeltaTime\` is the seconds elapsed since the last frame.

**Why DeltaTime matters:**
- At 60 FPS: DeltaTime ≈ 0.0167 s
- At 30 FPS: DeltaTime ≈ 0.0333 s

If you move an object by a fixed amount each tick, it moves *twice as fast* at 60 FPS. Multiply by DeltaTime to make movement frame-rate independent:

\`\`\`cpp
float Speed = 500.0f;              // cm/s
float DistanceMoved = Speed * DeltaTime;  // correct distance this frame
\`\`\`

⚠️ Tick runs every frame — keep it lean. Use delegates, timers, or event-driven code when possible.

## Your Task
Implement \`AMyActor::Tick(float DeltaTime)\`:
1. Call \`Super::Tick(DeltaTime);\`
2. Declare \`float Speed = 500.0f;\`
3. Declare \`float DistanceMoved = Speed * DeltaTime;\`
`,
    starterCode: {
      'Source.cpp': `void AMyActor::Tick(float DeltaTime)
{
    // TODO 1: Call Super::Tick(DeltaTime)
    // TODO 2: Declare float Speed = 500.0f
    // TODO 3: Declare float DistanceMoved = Speed * DeltaTime
}
`,
    },
    hiddenTests: ['Super::Tick', 'Speed * DeltaTime'],
    successCriteria: [
      'Call Super::Tick(DeltaTime)',
      'Declare Speed = 500.0f',
      'Compute DistanceMoved = Speed * DeltaTime',
    ],
    rules: [
      {
        id: 'r14_super',
        type: 'unreal',
        description: 'Super::Tick(DeltaTime) called',
        evaluate: (code) => ({
          passed: /Super::Tick\s*\(\s*DeltaTime\s*\)/.test(code),
          error: 'Must call Super::Tick(DeltaTime);',
          fix: 'Super::Tick(DeltaTime);',
        }),
      },
      {
        id: 'r14_distance',
        type: 'exercise',
        description: 'DistanceMoved = Speed * DeltaTime',
        evaluate: (code) => ({
          passed: /Speed\s*\*\s*DeltaTime/.test(code),
          error: 'Must compute Speed * DeltaTime.',
          fix: 'float DistanceMoved = Speed * DeltaTime;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_14a',
        title: 'Frame-rate independent movement',
        code: {
          'Source.cpp': `void AMyActor::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    const float Speed         = 500.0f;              // cm per second
    const float DistanceMoved = Speed * DeltaTime;   // correct per-frame distance
}
`,
        },
        explanation: 'const is preferred for values that won\'t change in the frame. The compiler may optimise them away entirely.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_15',
    title: '15. Reference vs Pointer — Pass by Reference',
    category: 'Stage 3: Unreal Core & Data',
    objective: `# Reference vs Pointer

Copying large objects into functions is slow. C++ offers two ways to pass "by address":

| | Pointer \`T*\` | Reference \`T&\` |
|-|--------------|----------------|
| Can be null | ✅ yes | ❌ never null |
| Can be reassigned | ✅ yes | ❌ no |
| Syntax at call site | \`Fn(&val)\` | \`Fn(val)\` |
| Out-parameter idiom | common | preferred in UE |

\`const T&\` = read-only reference (no copy, no modification).
\`T&\` = mutable reference — acts as an **out parameter**.

\`\`\`cpp
void TakeDamage(int32& OutHealth)
{
    OutHealth -= 10;   // modifies the caller's variable
}
\`\`\`

## Your Task
Implement \`void TakeDamage(int32& OutHealth)\`. Inside, subtract **10** from \`OutHealth\`.
`,
    starterCode: {
      'Source.cpp': `// TODO: Implement TakeDamage that takes int32 by mutable reference and subtracts 10
`,
    },
    hiddenTests: ['TakeDamage', 'int32&', 'OutHealth'],
    successCriteria: [
      'Function named TakeDamage',
      'Parameter is int32& OutHealth (mutable reference)',
      'Subtract 10 from OutHealth',
    ],
    rules: [
      {
        id: 'r15_sig',
        type: 'exercise',
        description: 'TakeDamage(int32& OutHealth) signature',
        evaluate: (code) => ({
          passed: /TakeDamage\s*\(\s*int32\s*&\s*OutHealth\s*\)/.test(code) ||
                  /TakeDamage\s*\(\s*int32\s*&OutHealth\s*\)/.test(code),
          error: 'Function signature must be: void TakeDamage(int32& OutHealth)',
          fix: 'void TakeDamage(int32& OutHealth) { ... }',
        }),
      },
      {
        id: 'r15_sub',
        type: 'exercise',
        description: 'OutHealth reduced by 10',
        evaluate: (code) => ({
          passed: /OutHealth\s*-=\s*10/.test(code) || /OutHealth\s*=\s*OutHealth\s*-\s*10/.test(code),
          error: 'Must subtract 10 from OutHealth.',
          fix: 'OutHealth -= 10;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_15a',
        title: 'Mutable reference out-parameter',
        code: {
          'Source.cpp': `void TakeDamage(int32& OutHealth)
{
    OutHealth -= 10;
}
`,
        },
        explanation: 'Because OutHealth is a reference, -= modifies the variable the *caller* passed in — no copy, no return value needed.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
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

## Your Task
Write \`void PrintName(const FString& Name)\`. The body can simply log \`Name\` or leave a comment — what matters is the const reference parameter.
`,
    starterCode: {
      'Source.cpp': `// TODO: Write PrintName that takes a const FString& Name
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
        description: 'PrintName function present',
        evaluate: (code) => ({
          passed: code.includes('PrintName'),
          error: 'Function PrintName is missing.',
          fix: 'void PrintName(const FString& Name) { }',
        }),
      },
      {
        id: 'r16_param',
        type: 'exercise',
        description: 'const FString& parameter',
        evaluate: (code) => ({
          passed: /const\s+FString\s*&/.test(code),
          error: 'Parameter must be const FString& (const reference, not by value).',
          fix: 'void PrintName(const FString& Name)',
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
  },

  // =========================================================================
  // STAGE 4 — ADVANCED ARCHITECTURE & SYSTEMS
  // =========================================================================

  {
    id: 'task_17',
    title: '17. Core UObject Hierarchy',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: `# UObject vs AActor

| Class | Can be placed in world? | Has Transform? | GC? |
|-------|------------------------|----------------|-----|
| \`UObject\` | ❌ | ❌ | ✅ |
| \`AActor\` | ✅ | ✅ (via root component) | ✅ |

Use \`UObject\` for pure data/logic systems (inventory data, ability configurations). Use \`AActor\` when you need a physical presence in the level.

\`\`\`cpp
UCLASS()
class UInventorySystem : public UObject
{
    GENERATED_BODY()
    // Pure logic — no transform, never placed directly
};
\`\`\`

## Your Task
Declare class \`UInventorySystem\` inheriting from \`UObject\`. Include \`UCLASS()\` macro and \`GENERATED_BODY()\`.
`,
    starterCode: {
      'Source.h': `// TODO: Declare UInventorySystem inheriting from UObject

`,
    },
    hiddenTests: ['class UInventorySystem', 'public UObject', 'GENERATED_BODY()'],
    successCriteria: [
      'UCLASS() macro present',
      'class UInventorySystem : public UObject',
      'GENERATED_BODY() inside class',
    ],
    rules: [
      {
        id: 'r17_uclass',
        type: 'unreal',
        description: 'UCLASS() macro present',
        evaluate: (code) => ({
          passed: code.includes('UCLASS()') || /UCLASS\s*\(/.test(code),
          error: 'UObject subclasses require the UCLASS() macro.',
          fix: 'UCLASS()',
        }),
      },
      {
        id: 'r17_decl',
        type: 'unreal',
        description: 'class UInventorySystem : public UObject',
        evaluate: (code) => ({
          passed: code.includes('UInventorySystem') && /public\s+UObject/.test(code),
          error: 'Declare UInventorySystem inheriting publicly from UObject.',
          fix: 'class UInventorySystem : public UObject',
        }),
      },
      {
        id: 'r17_gen',
        type: 'unreal',
        description: 'GENERATED_BODY() inside class',
        evaluate: (code) => ({
          passed: code.includes('GENERATED_BODY()'),
          error: 'All UCLASS types must include GENERATED_BODY() inside the class.',
          fix: 'GENERATED_BODY()',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_17a',
        title: 'Minimal UObject subclass',
        code: {
          'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"
#include "InventorySystem.generated.h"

UCLASS()
class UInventorySystem : public UObject
{
    GENERATED_BODY()
public:
    // Inventory operations go here
};
`,
        },
        explanation: 'GENERATED_BODY() is inserted by UHT to add reflection boilerplate. The .generated.h include is mandatory and auto-created.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_18',
    title: '18. Unreal Delegates — Event Broadcasting',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: `# Delegates — The Observer Pattern in UE

Delegates decouple event sources from listeners. Instead of a hard call (\`UI->UpdateHealth(100)\`), you broadcast to whoever is subscribed:

\`\`\`cpp
// Declare the delegate type (outside any class)
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnPlayerDiedSignature);

// Inside a UCLASS:
UPROPERTY(BlueprintAssignable)
FOnPlayerDiedSignature OnPlayerDied;

// Broadcasting:
OnPlayerDied.Broadcast();
\`\`\`

| Macro prefix | Multi-listener? | Blueprint bindable? |
|---|---|---|
| DECLARE_DELEGATE | ❌ | ❌ |
| DECLARE_MULTICAST_DELEGATE | ✅ | ❌ |
| DECLARE_DYNAMIC_MULTICAST_DELEGATE | ✅ | ✅ |

## Your Task
Declare \`FOnPlayerDiedSignature\` using the correct multicast dynamic macro.
`,
    starterCode: {
      'Source.h': `// TODO: Declare FOnPlayerDiedSignature using DECLARE_DYNAMIC_MULTICAST_DELEGATE
`,
    },
    hiddenTests: ['DECLARE_DYNAMIC_MULTICAST_DELEGATE', 'FOnPlayerDiedSignature'],
    successCriteria: [
      'Use DECLARE_DYNAMIC_MULTICAST_DELEGATE macro',
      'Name the type FOnPlayerDiedSignature',
    ],
    rules: [
      {
        id: 'r18_macro',
        type: 'unreal',
        description: 'DECLARE_DYNAMIC_MULTICAST_DELEGATE used',
        evaluate: (code) => ({
          passed: code.includes('DECLARE_DYNAMIC_MULTICAST_DELEGATE'),
          error: 'Use DECLARE_DYNAMIC_MULTICAST_DELEGATE (not the single or non-dynamic variants).',
          fix: 'DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnPlayerDiedSignature);',
        }),
      },
      {
        id: 'r18_name',
        type: 'unreal',
        description: 'Type named FOnPlayerDiedSignature',
        evaluate: (code) => ({
          passed: code.includes('FOnPlayerDiedSignature'),
          error: 'Name the delegate type FOnPlayerDiedSignature.',
          fix: 'DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnPlayerDiedSignature);',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_18a',
        title: 'Minimal delegate declaration',
        code: {
          'Source.h': `// Declares a delegate signature with no payload parameters
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnPlayerDiedSignature);

// To pass data, use the parameterised form:
// DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnHealthChangedSignature, float, NewHealth);
`,
        },
        explanation: 'Delegate types are declared once (often in the class header) and then instantiated as UPROPERTY members. BlueprintAssignable lets designers bind functions in the BP graph.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_19',
    title: '19. UENUM — Strongly Typed State Machines',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: `# UENUM — Strongly Typed Enumerations

Raw integers for state (0=Idle, 1=Running, …) cause bugs: what does state \`3\` mean? Enumerations bind states to meaningful names.

Unreal's \`UENUM(BlueprintType)\` exposes them as dropdown menus in Blueprint:
\`\`\`cpp
UENUM(BlueprintType)
enum class EPlayerState : uint8
{
    Idle      UMETA(DisplayName = "Idle"),
    Running   UMETA(DisplayName = "Running"),
    Attacking UMETA(DisplayName = "Attacking"),
};
\`\`\`

Key points:
- \`enum class\` (scoped enum) prevents accidental integer promotion.
- \`: uint8\` keeps the size to one byte — UHT requires a \`uint8\` backing type.
- \`UMETA(DisplayName = "…")\` sets the text shown in the Blueprint dropdown.

## Your Task
Declare \`EPlayerState\` with the exact structure above.
`,
    starterCode: {
      'Source.h': `// TODO: Declare UENUM(BlueprintType) EPlayerState with Idle, Running, Attacking
`,
    },
    hiddenTests: ['UENUM(BlueprintType)', 'enum class EPlayerState : uint8', 'Idle', 'Running', 'Attacking'],
    successCriteria: [
      'UENUM(BlueprintType) macro',
      'enum class EPlayerState : uint8',
      'Values Idle, Running, Attacking defined',
    ],
    rules: [
      {
        id: 'r19_macro',
        type: 'unreal',
        description: 'UENUM(BlueprintType) macro',
        evaluate: (code) => ({
          passed: code.includes('UENUM(BlueprintType)'),
          error: 'Missing UENUM(BlueprintType) macro.',
          fix: 'UENUM(BlueprintType)',
        }),
      },
      {
        id: 'r19_decl',
        type: 'unreal',
        description: 'enum class EPlayerState : uint8',
        evaluate: (code) => ({
          passed: /enum\s+class\s+EPlayerState\s*:\s*uint8/.test(code),
          error: 'Must use: enum class EPlayerState : uint8',
          fix: 'enum class EPlayerState : uint8 { ... }',
        }),
      },
      {
        id: 'r19_values',
        type: 'unreal',
        description: 'Idle, Running, Attacking values present',
        evaluate: (code) => {
          const ok = code.includes('Idle') && code.includes('Running') && code.includes('Attacking');
          return {
            passed: ok,
            error: 'Must define all three states: Idle, Running, Attacking.',
            fix: 'Idle, Running, Attacking,',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_19a',
        title: 'Full EPlayerState with UMETA',
        code: {
          'Source.h': `UENUM(BlueprintType)
enum class EPlayerState : uint8
{
    Idle      UMETA(DisplayName = "Idle"),
    Running   UMETA(DisplayName = "Running"),
    Attacking UMETA(DisplayName = "Attacking"),
};
`,
        },
        explanation: 'UMETA DisplayName controls what designers see in the BP dropdown. Always add MAX at the end if you need to range-check: Idle=0, Running=1, Attacking=2.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_20',
    title: '20. Interface Classes (UInterface)',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: `# Interface Classes — Decoupling with IInterface

Without interfaces: a \`Bullet\` would \`Cast<ACharacter>\` and \`Cast<ABarrel>\` and \`Cast<AWindow>\` — the list grows forever.

With interfaces: anything that can take damage implements \`IDamageable\`. The bullet calls \`Execute_TakeHit(HitActor)\` — it doesn't know or care what type \`HitActor\` is.

Unreal requires **two** classes for each interface:
\`\`\`cpp
// UDamageable — for the reflection system (no changes needed)
UINTERFACE(MinimalAPI, Blueprintable)
class UDamageable : public UInterface { GENERATED_BODY() };

// IDamageable — where you define the contract
class IDamageable
{
    GENERATED_BODY()
public:
    virtual void TakeHit() = 0;   // pure virtual
};
\`\`\`

## Your Task
The \`UDamageable\` shell is provided. Declare \`class IDamageable\` with a pure virtual \`TakeHit()\`.
`,
    starterCode: {
      'Source.h': `class UDamageable : public UInterface {};

// TODO: Implement class IDamageable with pure virtual TakeHit()
`,
    },
    hiddenTests: ['class IDamageable', 'virtual void TakeHit() = 0;'],
    successCriteria: [
      'Declare class IDamageable',
      'Add pure virtual TakeHit() = 0',
    ],
    rules: [
      {
        id: 'r20_class',
        type: 'unreal',
        description: 'class IDamageable declared',
        evaluate: (code) => ({
          passed: code.includes('class IDamageable'),
          error: 'Declare class IDamageable.',
          fix: 'class IDamageable { GENERATED_BODY() public: virtual void TakeHit() = 0; };',
        }),
      },
      {
        id: 'r20_pv',
        type: 'unreal',
        description: 'virtual void TakeHit() = 0 present',
        evaluate: (code) => ({
          passed: /virtual\s+void\s+TakeHit\s*\(\s*\)\s*=\s*0/.test(code),
          error: 'Must declare: virtual void TakeHit() = 0;',
          fix: 'virtual void TakeHit() = 0;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_20a',
        title: 'Complete UInterface pair',
        code: {
          'Source.h': `UINTERFACE(MinimalAPI, Blueprintable)
class UDamageable : public UInterface { GENERATED_BODY() };

class IDamageable
{
    GENERATED_BODY()
public:
    virtual void TakeHit()         = 0;
    virtual void TakeHit(float Dmg) { TakeHit(); }  // optional overload with default
};
`,
        },
        explanation: 'The I-prefixed class is where your logic lives. Implement with _Implementation suffix in the .cpp: void AMyActor::TakeHit_Implementation() { ... }',
      },
    ],
  },

  // =========================================================================
  // STAGE 5 — UE5 PRO FEATURES
  // =========================================================================

  {
    id: 'task_21',
    title: '21. TSubclassOf — Class References',
    category: 'Stage 5: UE5 Pro Features',
    objective: `# TSubclassOf — Blueprint-Assignable Class References

There is a critical distinction:
- \`AActor* Weapon\` — a **live instance** of a weapon already spawned.
- \`TSubclassOf<AActor> WeaponClass\` — a **template** (Blueprint class asset) to spawn from.

\`TSubclassOf<T>\` enforces that only classes inheriting from T can be assigned. This lets designers pick from a dropdown list in the editor, and your C++ code spawns from it:

\`\`\`cpp
GetWorld()->SpawnActor<AActor>(SpawnTemplate, SpawnLocation, SpawnRotation);
\`\`\`

## Your Task
Inside \`ASpawner\`, declare \`TSubclassOf<AActor> SpawnTemplate\` with \`UPROPERTY(EditAnywhere)\`.
`,
    starterCode: {
      'Source.h': `class ASpawner : public AActor
{
    // TODO: Declare UPROPERTY(EditAnywhere) TSubclassOf<AActor> SpawnTemplate
};
`,
    },
    hiddenTests: ['TSubclassOf<AActor>', 'SpawnTemplate', 'EditAnywhere'],
    successCriteria: [
      'UPROPERTY(EditAnywhere)',
      'TSubclassOf<AActor> SpawnTemplate declared',
    ],
    rules: [
      {
        id: 'r21_prop',
        type: 'unreal',
        description: 'UPROPERTY(EditAnywhere)',
        evaluate: (code) => ({
          passed: code.includes('EditAnywhere'),
          error: 'Add UPROPERTY(EditAnywhere) to expose SpawnTemplate in the editor.',
          fix: 'UPROPERTY(EditAnywhere)',
        }),
      },
      {
        id: 'r21_sub',
        type: 'unreal',
        description: 'TSubclassOf<AActor> SpawnTemplate',
        evaluate: (code) => ({
          passed: /TSubclassOf\s*<\s*AActor\s*>/.test(code) && code.includes('SpawnTemplate'),
          error: 'Declare TSubclassOf<AActor> SpawnTemplate.',
          fix: 'TSubclassOf<AActor> SpawnTemplate;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_21a',
        title: 'SpawnTemplate property',
        code: {
          'Source.h': `class ASpawner : public AActor
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, Category = "Spawning")
    TSubclassOf<AActor> SpawnTemplate;
};
`,
        },
        explanation: 'TSubclassOf<AActor> prevents designers from accidentally assigning a non-Actor class. At runtime: GetWorld()->SpawnActor<AActor>(SpawnTemplate, ...);',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_22',
    title: '22. Subsystems — The Pro Singleton',
    category: 'Stage 5: UE5 Pro Features',
    objective: `# Subsystems — Auto-Managed Global Services

The old way to make a global system was a Singleton stored on GameMode or GameInstance — one god-class with thousands of lines. Subsystems fix this by auto-creating separate objects scoped to their lifetime:

| Subsystem type | Lifetime |
|---|---|
| \`UEngineSubsystem\` | Engine |
| \`UGameInstanceSubsystem\` | Game session |
| \`UWorldSubsystem\` | Level/World |
| \`ULocalPlayerSubsystem\` | Per local player |

Subsystems are automatically created and destroyed — you never call \`new\` or \`delete\`.

\`\`\`cpp
// Access from anywhere:
UQuestManager* QM = GetGameInstance()->GetSubsystem<UQuestManager>();
\`\`\`

## Your Task
Declare \`UQuestManager\` inheriting from \`UGameInstanceSubsystem\`. Include \`UCLASS()\` and \`GENERATED_BODY()\`.
`,
    starterCode: {
      'Source.h': `// TODO: Declare UQuestManager : public UGameInstanceSubsystem
`,
    },
    hiddenTests: ['class UQuestManager', 'UGameInstanceSubsystem', 'GENERATED_BODY()'],
    successCriteria: [
      'UCLASS() macro',
      'UQuestManager inherits from UGameInstanceSubsystem',
      'GENERATED_BODY() present',
    ],
    rules: [
      {
        id: 'r22_uclass',
        type: 'unreal',
        description: 'UCLASS() macro',
        evaluate: (code) => ({
          passed: /UCLASS\s*\(/.test(code),
          error: 'Add UCLASS() macro.',
          fix: 'UCLASS()',
        }),
      },
      {
        id: 'r22_decl',
        type: 'unreal',
        description: 'UQuestManager : public UGameInstanceSubsystem',
        evaluate: (code) => ({
          passed: code.includes('UQuestManager') && code.includes('UGameInstanceSubsystem'),
          error: 'Declare UQuestManager inheriting from UGameInstanceSubsystem.',
          fix: 'class UQuestManager : public UGameInstanceSubsystem',
        }),
      },
      {
        id: 'r22_gen',
        type: 'unreal',
        description: 'GENERATED_BODY()',
        evaluate: (code) => ({
          passed: code.includes('GENERATED_BODY()'),
          error: 'Include GENERATED_BODY() inside the class.',
          fix: 'GENERATED_BODY()',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_22a',
        title: 'Minimal UGameInstanceSubsystem',
        code: {
          'Source.h': `#pragma once
#include "Subsystems/GameInstanceSubsystem.h"
#include "QuestManager.generated.h"

UCLASS()
class UQuestManager : public UGameInstanceSubsystem
{
    GENERATED_BODY()
public:
    virtual void Initialize(FSubsystemCollectionBase& Collection) override;
    virtual void Deinitialize() override;
};
`,
        },
        explanation: 'Override Initialize/Deinitialize instead of BeginPlay/EndPlay — these are the subsystem lifecycle callbacks. The engine calls them automatically.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_23',
    title: '23. Soft References — TSoftObjectPtr',
    category: 'Stage 5: UE5 Pro Features',
    objective: `# Soft vs Hard References

**Hard reference** (\`UTexture2D*\`) — the asset loads *immediately* when the class is loaded, regardless of whether it's needed. With 500 enemy types, that's 500 textures in RAM at spawn.

**Soft reference** (\`TSoftObjectPtr<UTexture2D>\`) — stores only the *asset path*. You load manually when needed:

\`\`\`cpp
TSoftObjectPtr<UTexture2D> IconRef;

// Load on demand (causes a short hitch — prefer async):
UTexture2D* Tex = IconRef.LoadSynchronous();

// Async load:
StreamableManager.RequestAsyncLoad(IconRef.ToSoftObjectPath(), ...);
\`\`\`

Use soft references for content that isn't always needed (character skins, level-specific assets).

## Your Task
Inside \`UInventoryItem\`, declare a soft pointer to \`UTexture2D\` named \`IconRef\`.
`,
    starterCode: {
      'Source.h': `class UInventoryItem : public UObject
{
    // TODO: Declare TSoftObjectPtr<UTexture2D> IconRef
};
`,
    },
    hiddenTests: ['TSoftObjectPtr<UTexture2D>', 'IconRef'],
    successCriteria: [
      'TSoftObjectPtr<UTexture2D> declared',
      'Named IconRef',
    ],
    rules: [
      {
        id: 'r23_soft',
        type: 'unreal',
        description: 'TSoftObjectPtr<UTexture2D> declared',
        evaluate: (code) => ({
          passed: /TSoftObjectPtr\s*<\s*UTexture2D\s*>/.test(code),
          error: 'Must use TSoftObjectPtr<UTexture2D>.',
          fix: 'TSoftObjectPtr<UTexture2D> IconRef;',
        }),
      },
      {
        id: 'r23_name',
        type: 'unreal',
        description: 'Variable named IconRef',
        evaluate: (code) => ({
          passed: code.includes('IconRef'),
          error: 'Name the variable IconRef.',
          fix: 'TSoftObjectPtr<UTexture2D> IconRef;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_23a',
        title: 'Soft pointer with UPROPERTY',
        code: {
          'Source.h': `class UInventoryItem : public UObject
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, Category = "Visuals")
    TSoftObjectPtr<UTexture2D> IconRef;
};
`,
        },
        explanation: 'UPROPERTY is still needed so the GC tracks the soft path string and doesn\'t garbage-collect the path data itself.',
      },
    ],
  },

  // =========================================================================
  // STAGE 6 — BLUEPRINT INTEGRATION
  // =========================================================================

  {
    id: 'task_24',
    title: '24. UFUNCTION Blueprint Specifiers',
    category: 'Stage 6: Blueprint Integration',
    objective: `# UFUNCTION — Exposing C++ Functions to Blueprint

| Specifier | Behaviour |
|-----------|-----------|
| \`BlueprintCallable\` | Has an execution pin; can cause side effects |
| \`BlueprintPure\` | No execution pin; cached result; should be a getter |
| \`BlueprintImplementableEvent\` | No C++ body; *must* be implemented in Blueprint |
| \`BlueprintNativeEvent\` | C++ body is the default; Blueprint can override |

\`\`\`cpp
// Read-only getter — pure (no state change)
UFUNCTION(BlueprintPure)
float GetCurrentHealth() const { return Health; }

// Mutation — needs exec pin
UFUNCTION(BlueprintCallable)
void AddHealth(float Amount) { Health += Amount; }
\`\`\`

## Your Task
Declare both functions inside \`APlayer\`:
1. \`GetCurrentHealth()\` as \`BlueprintPure\`, returns \`float\`, marked \`const\`.
2. \`AddHealth(float Amount)\` as \`BlueprintCallable\`, returns \`void\`.
`,
    starterCode: {
      'Source.h': `class APlayer : public ACharacter
{
public:
    // TODO: Declare GetCurrentHealth as BlueprintPure
    // TODO: Declare AddHealth as BlueprintCallable
};
`,
    },
    hiddenTests: ['BlueprintPure', 'BlueprintCallable', 'GetCurrentHealth', 'AddHealth'],
    successCriteria: [
      'GetCurrentHealth declared with BlueprintPure',
      'AddHealth declared with BlueprintCallable',
    ],
    rules: [
      {
        id: 'r24_pure',
        type: 'unreal',
        description: 'UFUNCTION(BlueprintPure) for GetCurrentHealth',
        evaluate: (code) => ({
          passed: code.includes('BlueprintPure') && code.includes('GetCurrentHealth'),
          error: 'Declare GetCurrentHealth with UFUNCTION(BlueprintPure).',
          fix: 'UFUNCTION(BlueprintPure)\nfloat GetCurrentHealth() const;',
        }),
      },
      {
        id: 'r24_callable',
        type: 'unreal',
        description: 'UFUNCTION(BlueprintCallable) for AddHealth',
        evaluate: (code) => ({
          passed: code.includes('BlueprintCallable') && code.includes('AddHealth'),
          error: 'Declare AddHealth with UFUNCTION(BlueprintCallable).',
          fix: 'UFUNCTION(BlueprintCallable)\nvoid AddHealth(float Amount);',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_24a',
        title: 'Pure getter + callable setter',
        code: {
          'Source.h': `class APlayer : public ACharacter
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintPure, Category = "Health")
    float GetCurrentHealth() const { return Health; }

    UFUNCTION(BlueprintCallable, Category = "Health")
    void AddHealth(float Amount);

private:
    float Health = 100.0f;
};
`,
        },
        explanation: 'BlueprintPure functions must be const. Non-const functions default to BlueprintCallable. If you mark a const function as BlueprintCallable with BlueprintPure=false, UE will still expose the exec pin.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_25',
    title: '25. USTRUCT — Blueprint Data Containers',
    category: 'Stage 6: Blueprint Integration',
    objective: `# USTRUCT — Plain Data for Blueprint

When you want to group related data (item name, weight, durability) into a single Blueprint variable, use \`USTRUCT\`.

Unlike \`UCLASS\`:
- Structs have **no garbage collector**. They hold data, not UObject ownership.
- Structs are **copied** when passed by value — cheap for small data, expensive for large.
- Use \`F\` prefix (Unreal convention for structs).

\`\`\`cpp
USTRUCT(BlueprintType)
struct FItemData
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FName ItemName;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    float Weight = 1.0f;
};
\`\`\`

## Your Task
Declare \`FItemData\` with \`USTRUCT(BlueprintType)\` and \`GENERATED_BODY()\`. Add at least one UPROPERTY member.
`,
    starterCode: {
      'Source.h': `// TODO: Declare FItemData struct with USTRUCT(BlueprintType)
`,
    },
    hiddenTests: ['USTRUCT(BlueprintType)', 'struct FItemData', 'GENERATED_BODY()'],
    successCriteria: [
      'USTRUCT(BlueprintType) macro',
      'struct FItemData declared',
      'GENERATED_BODY() present',
    ],
    rules: [
      {
        id: 'r25_macro',
        type: 'unreal',
        description: 'USTRUCT(BlueprintType)',
        evaluate: (code) => ({
          passed: code.includes('USTRUCT(BlueprintType)'),
          error: 'Missing USTRUCT(BlueprintType) macro.',
          fix: 'USTRUCT(BlueprintType)',
        }),
      },
      {
        id: 'r25_struct',
        type: 'unreal',
        description: 'struct FItemData declared',
        evaluate: (code) => ({
          passed: code.includes('struct FItemData'),
          error: 'Declare struct FItemData.',
          fix: 'struct FItemData { ... };',
        }),
      },
      {
        id: 'r25_gen',
        type: 'unreal',
        description: 'GENERATED_BODY() inside struct',
        evaluate: (code) => ({
          passed: code.includes('GENERATED_BODY()'),
          error: 'Structs used with UHT must contain GENERATED_BODY().',
          fix: 'GENERATED_BODY()',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_25a',
        title: 'FItemData with two members',
        code: {
          'Source.h': `USTRUCT(BlueprintType)
struct FItemData
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Item")
    FName ItemName;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Item")
    float Weight = 1.0f;
};
`,
        },
        explanation: 'struct members must also be decorated with UPROPERTY() to be visible in Blueprint. Structs without UPROPERTY members are still useful in C++ but invisible to BP.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_26',
    title: '26. BlueprintImplementableEvent',
    category: 'Stage 6: Blueprint Integration',
    objective: `# BlueprintImplementableEvent

Use this when you want C++ to *trigger* something and let the designer implement the visual response (particle effects, sounds, UI animations) in Blueprint without touching C++ at all.

\`\`\`cpp
// Header — declare but NO body in C++
UFUNCTION(BlueprintImplementableEvent)
void OnTakeDamage();

// Blueprint will implement OnTakeDamage with visual nodes
\`\`\`

**Important:** Do **not** provide a C++ body (\`{}\`). If you need a C++ fallback, use \`BlueprintNativeEvent\` instead and implement \`void OnTakeDamage_Implementation()\`.

## Your Task
Declare \`void OnTakeDamage();\` with \`UFUNCTION(BlueprintImplementableEvent)\`. No function body in C++.
`,
    starterCode: {
      'Source.h': `class APlayer : public ACharacter
{
public:
    // TODO: Declare OnTakeDamage as a BlueprintImplementableEvent (no body!)
};
`,
    },
    hiddenTests: ['BlueprintImplementableEvent', 'void OnTakeDamage();'],
    successCriteria: [
      'UFUNCTION(BlueprintImplementableEvent) macro',
      'void OnTakeDamage() declared without a body',
    ],
    rules: [
      {
        id: 'r26_macro',
        type: 'unreal',
        description: 'BlueprintImplementableEvent specifier',
        evaluate: (code) => ({
          passed: code.includes('BlueprintImplementableEvent'),
          error: 'Missing BlueprintImplementableEvent specifier.',
          fix: 'UFUNCTION(BlueprintImplementableEvent)\nvoid OnTakeDamage();',
        }),
      },
      {
        id: 'r26_decl',
        type: 'unreal',
        description: 'void OnTakeDamage() declared as a forward declaration (no { })',
        evaluate: (code) => ({
          passed: /void\s+OnTakeDamage\s*\(\s*\)\s*;/.test(code),
          error: 'Declare void OnTakeDamage(); — note the semicolon, no curly brace body.',
          fix: 'void OnTakeDamage();',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_26a',
        title: 'Correct declaration',
        code: {
          'Source.h': `class APlayer : public ACharacter
{
    GENERATED_BODY()
public:
    // C++ calls this; Blueprint implements it
    UFUNCTION(BlueprintImplementableEvent, Category = "Damage")
    void OnTakeDamage();
};
`,
        },
        explanation: 'UHT generates the C++ glue. Calling OnTakeDamage() from C++ will invoke the Blueprint graph without any extra work.',
      },
    ],
  },

  // =========================================================================
  // STAGE 7 — PRODUCTION STANDARDS
  // =========================================================================

  {
    id: 'task_27',
    title: '27. Assertions — check, ensure, verify',
    category: 'Stage 7: Production Standards',
    objective: `# Assertions in Unreal Engine

Assertions catch programmer mistakes at the earliest possible point:

| Macro | Shipping? | Behaviour on failure |
|-------|-----------|----------------------|
| \`check(cond)\` | ❌ stripped | Crash immediately (fatal) |
| \`verify(cond)\` | ✅ kept | Crash (evaluates the expression in shipping) |
| \`ensure(cond)\` | ✅ kept | Log + continue (non-fatal) |

\`\`\`cpp
void Heal()
{
    ensure(Health > 0);   // warn if already dead, but don't crash
    check(HealComponent); // fatal: we cannot proceed without HealComponent
    Health += 50;
}
\`\`\`

Use \`ensure\` for "this shouldn't happen, but we can recover." Use \`check\` for "this is impossible and continuing would corrupt state."

## Your Task
Inside \`APlayer::Heal()\`, add \`ensure(Health > 0);\` **before** any healing logic.
`,
    starterCode: {
      'Source.cpp': `void APlayer::Heal()
{
    // TODO: Add ensure(Health > 0) before healing
    Health += 50;
}
`,
    },
    hiddenTests: ['ensure', 'Health > 0'],
    successCriteria: ['Write ensure(Health > 0); before modifying Health'],
    rules: [
      {
        id: 'r27_ensure',
        type: 'unreal',
        description: 'ensure(Health > 0) present',
        evaluate: (code) => ({
          passed: /ensure\s*\(\s*Health\s*>\s*0\s*\)/.test(code),
          error: 'Must add ensure(Health > 0);',
          fix: 'ensure(Health > 0);',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_27a',
        title: 'ensure before healing',
        code: {
          'Source.cpp': `void APlayer::Heal()
{
    ensure(Health > 0);        // non-fatal warning if health is already 0 or negative
    check(Health <= MaxHealth); // fatal: healing above max is a logic error
    Health += 50;
}
`,
        },
        explanation: 'Layered assertions: ensure logs and continues so QA can report the state; check halts on impossible states where continuing is dangerous.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_28',
    title: '28. Safe Casting — Cast<T>',
    category: 'Stage 7: Production Standards',
    objective: `# Safe Casting with Cast<T>

\`dynamic_cast\` is **disabled** in Unreal Engine (for performance). Use \`Cast<T>()\` instead:

\`\`\`cpp
AActor* HitActor = GetHitResult().GetActor();
AMonster* Monster = Cast<AMonster>(HitActor);

if (Monster)
{
    Monster->TakeHit();    // safe — cast succeeded
}
// if cast failed: Monster == nullptr, no crash
\`\`\`

\`CastChecked<T>()\` is the asserting variant — it crashes if the cast fails. Use it when failure would mean a logic error.

## Your Task
In \`OnHit(AActor* HitActor)\`, cast \`HitActor\` to \`AMonster*\` and store it in a variable named \`MonsterTarget\`. Check if it's valid before using.
`,
    starterCode: {
      'Source.cpp': `void OnHit(AActor* HitActor)
{
    // TODO: Cast HitActor to AMonster* and store in MonsterTarget
    // TODO: Check MonsterTarget is valid before using it
}
`,
    },
    hiddenTests: ['AMonster*', 'Cast<AMonster>', 'HitActor', 'MonsterTarget'],
    successCriteria: [
      'Call Cast<AMonster>(HitActor)',
      'Store result in MonsterTarget',
      'Check MonsterTarget before use (if block or IsValid)',
    ],
    rules: [
      {
        id: 'r28_cast',
        type: 'unreal',
        description: 'Cast<AMonster> used',
        evaluate: (code) => ({
          passed: code.includes('Cast<AMonster>'),
          error: 'Must use Cast<AMonster> (not static_cast or C-style cast).',
          fix: 'AMonster* MonsterTarget = Cast<AMonster>(HitActor);',
        }),
      },
      {
        id: 'r28_var',
        type: 'unreal',
        description: 'Result stored in MonsterTarget',
        evaluate: (code) => ({
          passed: code.includes('MonsterTarget'),
          error: 'Store the cast result in a variable named MonsterTarget.',
          fix: 'AMonster* MonsterTarget = Cast<AMonster>(HitActor);',
        }),
      },
      {
        id: 'r28_guard',
        type: 'unreal',
        description: 'Null-check before using MonsterTarget',
        evaluate: (code) => ({
          passed: /if\s*\(\s*(MonsterTarget|IsValid\s*\(\s*MonsterTarget)/.test(code),
          error: 'Check MonsterTarget for nullptr before using it (if (MonsterTarget) { ... }).',
          fix: 'if (MonsterTarget) { MonsterTarget->TakeHit(); }',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_28a',
        title: 'Standard Cast + null guard',
        code: {
          'Source.cpp': `void OnHit(AActor* HitActor)
{
    AMonster* MonsterTarget = Cast<AMonster>(HitActor);
    if (MonsterTarget)
    {
        MonsterTarget->TakeHit();
    }
}
`,
        },
        explanation: 'Cast<T> returns nullptr on failure. Always guard before use. For objects that might be GC\'d, use IsValid() instead of a raw nullptr check.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_29',
    title: '29. UE_LOG — Structured Logging',
    category: 'Stage 7: Production Standards',
    objective: `# UE_LOG — Structured Game Logging

\`std::cout\` doesn't work in shipped games. UE_LOG writes to:
- The Output Log panel in the editor
- \`YourProject/Saved/Logs/\` on disk
- The screen (via \`GEngine->AddOnScreenDebugMessage\`)

\`\`\`cpp
UE_LOG(LogCategory, Verbosity, TEXT("format %s"), *SomeString);
\`\`\`

Verbosity levels: \`Fatal\`, \`Error\`, \`Warning\`, \`Display\`, \`Log\`, \`Verbose\`.

In UE5.2+ prefer \`UE_LOGFMT\` which avoids the \`TEXT()\` wrapper and is type-safe:
\`\`\`cpp
#include "Logging/StructuredLog.h"
UE_LOGFMT(LogTemp, Warning, "Loading '{Name}' failed", Package->GetName());
\`\`\`

## Your Task
Write a \`UE_LOG\` call with:
- Category: \`LogTemp\`
- Verbosity: \`Warning\`
- Message: \`TEXT("Booting Sequence Initiated")\`
`,
    starterCode: {
      'Source.cpp': `void Practice()
{
    // TODO: Write a UE_LOG statement per the spec
}
`,
    },
    hiddenTests: ['UE_LOG', 'LogTemp', 'Warning', 'TEXT("Booting Sequence Initiated")'],
    successCriteria: [
      'Use UE_LOG macro',
      'Category LogTemp',
      'Verbosity Warning',
      'Message TEXT("Booting Sequence Initiated")',
    ],
    rules: [
      {
        id: 'r29_macro',
        type: 'unreal',
        description: 'UE_LOG macro used',
        evaluate: (code) => ({
          passed: code.includes('UE_LOG('),
          error: 'Must use UE_LOG() macro.',
          fix: 'UE_LOG(LogTemp, Warning, TEXT("Booting Sequence Initiated"));',
        }),
      },
      {
        id: 'r29_cat',
        type: 'unreal',
        description: 'LogTemp category',
        evaluate: (code) => ({
          passed: code.includes('LogTemp'),
          error: 'Category must be LogTemp.',
          fix: 'UE_LOG(LogTemp, ...',
        }),
      },
      {
        id: 'r29_verb',
        type: 'unreal',
        description: 'Warning verbosity',
        evaluate: (code) => ({
          passed: code.includes('Warning'),
          error: 'Verbosity must be Warning.',
          fix: 'UE_LOG(LogTemp, Warning, ...',
        }),
      },
      {
        id: 'r29_msg',
        type: 'unreal',
        description: 'Exact message string',
        evaluate: (code) => ({
          passed: code.includes('TEXT("Booting Sequence Initiated")'),
          error: 'Message must be TEXT("Booting Sequence Initiated") — check spelling and TEXT() macro.',
          fix: 'TEXT("Booting Sequence Initiated")',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_29a',
        title: 'Standard UE_LOG call',
        code: {
          'Source.cpp': `void Practice()
{
    UE_LOG(LogTemp, Warning, TEXT("Booting Sequence Initiated"));
}
`,
        },
        explanation: 'For format arguments use %s (FString — dereference with *), %d (int32), %f (float). Example: UE_LOG(LogTemp, Log, TEXT("HP: %d"), Health);',
      },
    ],
  },

  // =========================================================================
  // STAGE 8 — UNREAL WORKFLOWS
  // =========================================================================

  {
    id: 'task_30',
    title: '30. Naming Conventions — Hungarian Prefixes',
    category: 'Stage 8: Unreal Workflows',
    objective: `# Naming Conventions in Unreal Engine

UHT and the engine rely on prefix conventions for reflection and code generation:

| Prefix | Class type | Example |
|--------|-----------|---------|
| \`A\` | Actor | \`APlayerCharacter\` |
| \`U\` | UObject component | \`UHealthComponent\` |
| \`F\` | Struct / value type | \`FVector\`, \`FHitResult\` |
| \`E\` | Enum | \`EPlayerState\` |
| \`I\` | Interface | \`IDamageable\` |
| \`T\` | Template | \`TArray<T>\` |
| \`b\` | Boolean member | \`bIsJumping\` |
| \`G\` | Global | \`GEngine\` |

Violating naming conventions causes UHT compilation errors.

## Your Task
Declare a boolean member variable for "is the player jumping" using the correct Unreal prefix. Initialise it to \`false\`.
`,
    starterCode: {
      'Source.h': `class APlayer : public ACharacter
{
    // TODO: Declare a bool with correct UE naming for "is jumping", set to false
};
`,
    },
    hiddenTests: ['bool bIsJumping', 'false'],
    successCriteria: [
      'Variable named bIsJumping (b prefix)',
      'Type bool',
      'Initialised to false',
    ],
    rules: [
      {
        id: 'r30_name',
        type: 'exercise',
        description: 'bool bIsJumping declared',
        evaluate: (code) => ({
          passed: code.includes('bIsJumping'),
          error: 'Variable must be named bIsJumping (Unreal boolean prefix b).',
          fix: 'bool bIsJumping = false;',
        }),
      },
      {
        id: 'r30_init',
        type: 'exercise',
        description: 'Initialised to false',
        evaluate: (code) => ({
          passed: /bIsJumping\s*=\s*false/.test(code),
          error: 'Must initialise bIsJumping = false.',
          fix: 'bool bIsJumping = false;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_30a',
        title: 'Correct boolean with UPROPERTY',
        code: {
          'Source.h': `class APlayer : public ACharacter
{
    GENERATED_BODY()
public:
    UPROPERTY(BlueprintReadOnly, Category = "Movement")
    bool bIsJumping = false;
};
`,
        },
        explanation: 'The b prefix is mandatory — UHT enforces it and other engineers rely on it for quick type identification at a glance.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_31',
    title: '31. FName vs FText — String Types',
    category: 'Stage 8: Unreal Workflows',
    objective: `# Choosing the Right String Type

| Type | Mutable? | Localisable? | Best for |
|------|---------|--------------|---------|
| \`FName\` | ❌ | ❌ | Asset/tag identification (hashed, fast) |
| \`FText\` | ❌ | ✅ | Any text the **player sees** (UI, subtitles) |
| \`FString\` | ✅ | ❌ | General runtime manipulation |

**Rule of thumb:**
- Player reads it → \`FText\`
- Engine identifies it → \`FName\`
- You manipulate it in code → \`FString\`

\`\`\`cpp
FName   PlayerTag  = TEXT("Player");
FText   Greeting   = FText::FromString(TEXT("Hello"));
FString BuildMsg   = FString::Printf(TEXT("Score: %d"), Score);
\`\`\`

## Your Task
Declare:
1. \`FName PlayerTag = TEXT("Player");\`
2. \`FText Greeting = FText::FromString(TEXT("Hello"));\`
`,
    starterCode: {
      'Source.cpp': `void SetupStrings()
{
    // TODO 1: FName PlayerTag = TEXT("Player")
    // TODO 2: FText Greeting = FText::FromString(TEXT("Hello"))
}
`,
    },
    hiddenTests: ['FName PlayerTag', 'FText Greeting', 'FText::FromString'],
    successCriteria: [
      'Declare FName PlayerTag = TEXT("Player")',
      'Declare FText Greeting = FText::FromString(TEXT("Hello"))',
    ],
    rules: [
      {
        id: 'r31_fname',
        type: 'unreal',
        description: 'FName PlayerTag declared',
        evaluate: (code) => ({
          passed: code.includes('FName PlayerTag') && code.includes('"Player"'),
          error: 'Must declare FName PlayerTag = TEXT("Player");',
          fix: 'FName PlayerTag = TEXT("Player");',
        }),
      },
      {
        id: 'r31_ftext',
        type: 'unreal',
        description: 'FText Greeting via FText::FromString',
        evaluate: (code) => ({
          passed: code.includes('FText Greeting') && code.includes('FText::FromString'),
          error: 'Must declare FText Greeting using FText::FromString(TEXT("Hello"));',
          fix: 'FText Greeting = FText::FromString(TEXT("Hello"));',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_31a',
        title: 'All three string types compared',
        code: {
          'Source.cpp': `void SetupStrings()
{
    FName   PlayerTag = TEXT("Player");                        // hashed, immutable
    FText   Greeting  = FText::FromString(TEXT("Hello"));      // localisable
    FString ChatMsg   = FString::Printf(TEXT("Hi, %s!"), *Greeting.ToString()); // manipulable
}
`,
        },
        explanation: 'In production, use NSLOCTEXT("Namespace", "Key", "Hello") for FText instead of FromString — it integrates with the localization pipeline.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_32',
    title: '32. TMap — Hash-Map Lookups',
    category: 'Stage 8: Unreal Workflows',
    objective: `# TMap — O(1) Key→Value Lookup

\`TArray\` gives O(n) search. When you need instant lookup by key, use \`TMap\`:

\`\`\`cpp
TMap<FName, int32> PlayerScores;
PlayerScores.Add(TEXT("Alice"), 1200);
PlayerScores.Add(TEXT("Bob"),   980);

int32* Score = PlayerScores.Find(TEXT("Alice")); // O(1) lookup
if (Score) { UE_LOG(LogTemp, Log, TEXT("Score: %d"), *Score); }
\`\`\`

Common operations:
- \`Add(Key, Value)\` — insert or overwrite
- \`Find(Key)\` — returns \`T*\` (nullptr if missing)
- \`Remove(Key)\` — delete entry
- \`Contains(Key)\` — boolean check

## Your Task
Inside \`AGameState\`, declare \`TMap<FName, float> PlayerScores\` with \`UPROPERTY()\`.
`,
    starterCode: {
      'Source.h': `class AGameState : public AInfo
{
    // TODO: Declare TMap<FName, float> PlayerScores with UPROPERTY()
};
`,
    },
    hiddenTests: ['TMap<FName, float>', 'PlayerScores', 'UPROPERTY'],
    successCriteria: [
      'UPROPERTY() macro present',
      'TMap<FName, float> PlayerScores declared',
    ],
    rules: [
      {
        id: 'r32_prop',
        type: 'unreal',
        description: 'UPROPERTY() on PlayerScores',
        evaluate: (code) => ({
          passed: /UPROPERTY\s*\(/.test(code),
          error: 'TMap members must be decorated with UPROPERTY() for GC visibility.',
          fix: 'UPROPERTY()',
        }),
      },
      {
        id: 'r32_tmap',
        type: 'unreal',
        description: 'TMap<FName, float> PlayerScores',
        evaluate: (code) => ({
          passed: /TMap\s*<\s*FName\s*,\s*float\s*>/.test(code) && code.includes('PlayerScores'),
          error: 'Declare TMap<FName, float> PlayerScores.',
          fix: 'TMap<FName, float> PlayerScores;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_32a',
        title: 'TMap with UPROPERTY',
        code: {
          'Source.h': `class AGameState : public AInfo
{
    GENERATED_BODY()
public:
    UPROPERTY(BlueprintReadOnly, Category = "Scores")
    TMap<FName, float> PlayerScores;
};
`,
        },
        explanation: 'Note: TMap is not replicatable out-of-the-box for networking. For replicated dictionaries, consider a TArray of custom structs with a NetSerialize function.',
      },
    ],
  },

  // =========================================================================
  // STAGE 9 — ENTERPRISE ARCHITECTURE
  // =========================================================================

  {
    id: 'task_33',
    title: '33. Smart Pointers — TSharedPtr & TUniquePtr',
    category: 'Stage 9: Enterprise Architecture',
    objective: `# Smart Pointers for Non-UObject Code

UObject subclasses use the GC. For **plain C++ classes** (not UObject), manual memory management → leaks. Smart pointers automate this:

| Type | Ownership | Nullable | Thread-safe ref count |
|------|-----------|----------|-----------------------|
| \`TUniquePtr<T>\` | Exclusive | yes | — |
| \`TSharedPtr<T>\` | Shared (ref-counted) | yes | optional |
| \`TWeakPtr<T>\` | Observer (no ownership) | yes | — |

\`\`\`cpp
TUniquePtr<FMyData> Unique = MakeUnique<FMyData>();
TSharedPtr<FMyData> Shared = MakeShared<FMyData>();
TWeakPtr<FMyData>   Weak   = Shared;  // doesn't increment ref count
\`\`\`

## Your Task
Inside \`FDataManager\`, declare a \`TSharedPtr<FMyData>\` named \`DataPtr\`.
`,
    starterCode: {
      'Source.h': `struct FMyData { int32 Value; };

class FDataManager
{
    // TODO: Declare TSharedPtr<FMyData> DataPtr
};
`,
    },
    hiddenTests: ['TSharedPtr<FMyData>', 'DataPtr'],
    successCriteria: [
      'TSharedPtr<FMyData> declared',
      'Named DataPtr',
    ],
    rules: [
      {
        id: 'r33_type',
        type: 'exercise',
        description: 'TSharedPtr<FMyData> declared',
        evaluate: (code) => ({
          passed: /TSharedPtr\s*<\s*FMyData\s*>/.test(code),
          error: 'Must use TSharedPtr<FMyData>.',
          fix: 'TSharedPtr<FMyData> DataPtr;',
        }),
      },
      {
        id: 'r33_name',
        type: 'exercise',
        description: 'Variable named DataPtr',
        evaluate: (code) => ({
          passed: code.includes('DataPtr'),
          error: 'Name the variable DataPtr.',
          fix: 'TSharedPtr<FMyData> DataPtr;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_33a',
        title: 'TSharedPtr with initialisation',
        code: {
          'Source.h': `struct FMyData { int32 Value = 0; };

class FDataManager
{
public:
    TSharedPtr<FMyData> DataPtr;

    FDataManager()
        : DataPtr(MakeShared<FMyData>())   // initialise immediately
    {}
};
`,
        },
        explanation: 'MakeShared<T>() is preferred over TSharedPtr<T>(new T()) — it allocates the object and ref-count block in a single allocation.',
      },
    ],
  },

  // =========================================================================
  // STAGE 10 — MODERN C++ FEATURES
  // =========================================================================

  {
    id: 'task_34',
    title: '34. The auto Keyword',
    category: 'Stage 10: Modern C++ Features',
    objective: `# auto — Type Deduction

\`auto\` tells the compiler to deduce the type from the initialiser. It removes redundancy:

\`\`\`cpp
// Verbose:
TMap<FName, TArray<FHitResult>>::TIterator It = Map.CreateIterator();

// auto:
auto It = Map.CreateIterator();   // same type, less noise
\`\`\`

**When to use auto** (Unreal style guide):
- ✅ Iterator types / range-for variables
- ✅ When the type appears on the same line (e.g., casts, MakeShared)
- ❌ Function return types visible to callers (hides the return type)
- ❌ UPROPERTY members (UHT needs explicit types)

## Your Task
Declare a variable named \`MyAutoVar\` using \`auto\` and set it to \`100.5f\`.
`,
    starterCode: {
      'Source.cpp': `void Practice()
{
    // TODO: Declare auto MyAutoVar = 100.5f
}
`,
    },
    hiddenTests: ['auto MyAutoVar', '100.5f'],
    successCriteria: [
      'Use the auto keyword',
      'Variable named MyAutoVar',
      'Initialised to 100.5f',
    ],
    rules: [
      {
        id: 'r34_auto',
        type: 'exercise',
        description: 'auto keyword used',
        evaluate: (code) => ({
          passed: /auto\s+MyAutoVar/.test(code),
          error: 'Declare: auto MyAutoVar = 100.5f;',
          fix: 'auto MyAutoVar = 100.5f;',
        }),
      },
      {
        id: 'r34_val',
        type: 'exercise',
        description: 'Value is 100.5f',
        evaluate: (code) => ({
          passed: code.includes('100.5f'),
          error: 'Set value to 100.5f (the f suffix makes it float, not double).',
          fix: 'auto MyAutoVar = 100.5f;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_34a',
        title: 'auto with float literal',
        code: {
          'Source.cpp': `void Practice()
{
    auto MyAutoVar = 100.5f;  // deduced as float

    // auto is especially useful with complex iterator types:
    TArray<int32> Arr = {1, 2, 3};
    for (auto& Val : Arr) { Val *= 2; }
}
`,
        },
        explanation: 'Without the f suffix, 100.5 would be a double literal and MyAutoVar would be deduced as double — a subtle type mismatch.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_35',
    title: '35. Lambda Expressions',
    category: 'Stage 10: Modern C++ Features',
    objective: `# Lambda Expressions — Inline Anonymous Functions

A lambda is a temporary function defined inline. Syntax:
\`\`\`cpp
[capture](params) -> ReturnType { body }
\`\`\`

Common in Unreal for:
- Delegate binding: \`Delegate.BindLambda([this]() { ... });\`
- Sorting: \`Arr.Sort([](const FMyStruct& A, const FMyStruct& B) { return A.Score > B.Score; });\`
- Async callbacks: \`AsyncTask(ENamedThreads::GameThread, [this]() { ... });\`

Capture modes:
- \`[]\` — capture nothing
- \`[this]\` — capture \`this\` pointer (members accessible)
- \`[&]\` — capture all locals by reference
- \`[=]\` — capture all locals by value

## Your Task
Declare \`auto MyLambda\` as a lambda that:
- Captures nothing \`[]\`
- Takes no parameters \`()\`
- Returns nothing
- Has an empty body (or a comment inside)
`,
    starterCode: {
      'Source.cpp': `void Practice()
{
    // TODO: Declare auto MyLambda = []() { /* body */ };
}
`,
    },
    hiddenTests: ['auto MyLambda', '[]', '()', '{'],
    successCriteria: [
      'auto MyLambda declared',
      'Lambda syntax []() { }',
    ],
    rules: [
      {
        id: 'r35_decl',
        type: 'exercise',
        description: 'auto MyLambda = lambda',
        evaluate: (code) => ({
          passed: /auto\s+MyLambda\s*=/.test(code),
          error: 'Declare: auto MyLambda = [...](...) { ... };',
          fix: 'auto MyLambda = []() { };',
        }),
      },
      {
        id: 'r35_syntax',
        type: 'exercise',
        description: 'Lambda syntax []() { }',
        evaluate: (code) => ({
          passed: /\[\s*\]\s*\(\s*\)\s*\{/.test(code),
          error: 'Lambda must use []() { } syntax.',
          fix: 'auto MyLambda = []() { /* do something */ };',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_35a',
        title: 'Basic lambda + invocation',
        code: {
          'Source.cpp': `void Practice()
{
    auto MyLambda = []()
    {
        UE_LOG(LogTemp, Log, TEXT("Lambda executed!"));
    };

    MyLambda();   // call it like a regular function
}
`,
        },
        explanation: 'Lambdas are stored as closures — objects with an operator(). auto deduces the unique compiler-generated type.',
      },
      {
        id: 'sol_35b',
        title: 'Lambda bound to a delegate',
        code: {
          'Source.cpp': `void Practice()
{
    FTimerDelegate TimerDel;
    TimerDel.BindLambda([this]()
    {
        UE_LOG(LogTemp, Warning, TEXT("Timer fired!"));
    });

    GetWorldTimerManager().SetTimer(TimerHandle, TimerDel, 2.0f, false);
}
`,
        },
        explanation: 'The [this] capture lets the lambda access member variables. Beware: if the owning object is destroyed before the timer fires, this will be a dangling pointer. Use TWeakObjectPtr for safety.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_36',
    title: '36. Templates — Generic Programming',
    category: 'Stage 10: Modern C++ Features',
    objective: `# C++ Templates

Without templates, you'd write \`MaxInt(int a, int b)\`, \`MaxFloat(float a, float b)\`, \`MaxDouble(…)\` — endless duplication.

With templates, one definition works for any comparable type:
\`\`\`cpp
template <typename T>
T GetMax(T A, T B)
{
    return (A > B) ? A : B;
}

GetMax(3, 7);           // T=int → 7
GetMax(3.5f, 2.1f);     // T=float → 3.5f
\`\`\`

Unreal uses templates pervasively: \`TArray<T>\`, \`TMap<K,V>\`, \`Cast<T>()\`, \`MakeShared<T>()\`.

## Your Task
Write a template function \`GetMax\` that returns the larger of two values \`A\` and \`B\` of type \`T\`.
`,
    starterCode: {
      'Source.h': `// TODO: Write template <typename T> T GetMax(T A, T B)
`,
    },
    hiddenTests: ['template <typename T>', 'T GetMax', 'T A', 'T B'],
    successCriteria: [
      'template <typename T> prefix',
      'Function named GetMax returning T',
      'Parameters T A and T B',
    ],
    rules: [
      {
        id: 'r36_tmpl',
        type: 'exercise',
        description: 'template <typename T> prefix present',
        evaluate: (code) => ({
          passed: /template\s*<\s*typename\s+T\s*>/.test(code),
          error: 'Must have template <typename T> before the function.',
          fix: 'template <typename T>',
        }),
      },
      {
        id: 'r36_fn',
        type: 'exercise',
        description: 'T GetMax(T A, T B) signature',
        evaluate: (code) => ({
          passed: /T\s+GetMax\s*\(\s*T\s+A\s*,\s*T\s+B\s*\)/.test(code),
          error: 'Function signature must be: T GetMax(T A, T B)',
          fix: 'T GetMax(T A, T B) { return (A > B) ? A : B; }',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_36a',
        title: 'Template GetMax with ternary',
        code: {
          'Source.h': `template <typename T>
T GetMax(T A, T B)
{
    return (A > B) ? A : B;
}

// Usage:
// int32 MaxHP  = GetMax(100, 200);    // → 200
// float MaxDmg = GetMax(45.5f, 12.0f); // → 45.5f
`,
        },
        explanation: 'The compiler generates a separate function body for each unique T used. No runtime overhead compared to non-template — it\'s purely compile-time code generation.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_37',
    title: '37. Move Semantics — MoveTemp',
    category: 'Stage 10: Modern C++ Features',
    objective: `# Move Semantics — Steal, Don't Copy

When you assign one \`FString\` to another, the internal character buffer is **copied** — an allocation + byte-copy. For megabyte strings, this is expensive.

**Move semantics** transfer ownership of the internal buffer — no allocation, no copy:
\`\`\`cpp
FString Source = TEXT("Very Long String...");
FString Target = MoveTemp(Source);   // buffer ownership transferred
// Source is now empty (valid but unspecified state)
\`\`\`

Unreal's \`MoveTemp()\` is equivalent to \`std::move()\`.

Use it when you're done with a variable and want to hand its data to another without copying (e.g., building a string then passing it to a function that stores it).

## Your Task
Given \`FString SourceInfo\`, declare \`FString TargetInfo\` and initialise it by *moving* from \`SourceInfo\` using \`MoveTemp\`.
`,
    starterCode: {
      'Source.cpp': `void SetupStrings()
{
    FString SourceInfo = TEXT("Heavy Data Payload");

    // TODO: Declare FString TargetInfo using MoveTemp(SourceInfo)
}
`,
    },
    hiddenTests: ['FString TargetInfo', 'MoveTemp(SourceInfo)'],
    successCriteria: [
      'Declare FString TargetInfo',
      'Use MoveTemp(SourceInfo) to initialise it',
    ],
    rules: [
      {
        id: 'r37_target',
        type: 'exercise',
        description: 'FString TargetInfo declared',
        evaluate: (code) => ({
          passed: code.includes('TargetInfo'),
          error: 'Declare a variable named TargetInfo.',
          fix: 'FString TargetInfo = MoveTemp(SourceInfo);',
        }),
      },
      {
        id: 'r37_move',
        type: 'exercise',
        description: 'MoveTemp(SourceInfo) used',
        evaluate: (code) => ({
          passed: code.includes('MoveTemp(SourceInfo)'),
          error: 'Must use MoveTemp(SourceInfo) to avoid copying.',
          fix: 'FString TargetInfo = MoveTemp(SourceInfo);',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_37a',
        title: 'MoveTemp initialisation',
        code: {
          'Source.cpp': `void SetupStrings()
{
    FString SourceInfo = TEXT("Heavy Data Payload");
    FString TargetInfo = MoveTemp(SourceInfo);

    // SourceInfo is now empty:
    ensure(SourceInfo.IsEmpty());
    // TargetInfo holds the original buffer:
    UE_LOG(LogTemp, Log, TEXT("TargetInfo: %s"), *TargetInfo);
}
`,
        },
        explanation: 'After MoveTemp, SourceInfo is in a "valid but unspecified" state — always treat it as empty. Use MoveTemp when returning large locals from a function to avoid a copy.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_38',
    title: '38. Virtual Destructors',
    category: 'Stage 10: Modern C++ Features',
    objective: `# Virtual Destructors — Safe Polymorphic Cleanup

\`\`\`cpp
FBaseLogic* Obj = new FDerivedLogic();
delete Obj;   // which destructor runs?
\`\`\`

Without \`virtual ~FBaseLogic()\`, the compiler deletes as \`FBaseLogic\` — the derived class destructor **never runs** → resource leak.

With a virtual destructor, \`delete\` correctly invokes \`~FDerivedLogic()\` first, then \`~FBaseLogic()\`.

**Rule:** If a class has any virtual functions, give it a virtual destructor.

UObjects handled by the GC don't have this problem (the GC knows the concrete type). But plain C++ base classes used polymorphically absolutely need it.

## Your Task
Add \`virtual ~FBaseLogic();\` to the class.
`,
    starterCode: {
      'Source.h': `class FBaseLogic
{
public:
    // TODO: Declare virtual destructor
    virtual void Execute() = 0;
};
`,
    },
    hiddenTests: ['virtual ~FBaseLogic()'],
    successCriteria: ['Declare virtual ~FBaseLogic();'],
    rules: [
      {
        id: 'r38_dtor',
        type: 'exercise',
        description: 'virtual ~FBaseLogic() declared',
        evaluate: (code) => ({
          passed: /virtual\s*~\s*FBaseLogic\s*\(\s*\)/.test(code),
          error: 'Must declare virtual ~FBaseLogic();',
          fix: 'virtual ~FBaseLogic() = default;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_38a',
        title: 'Virtual destructor with = default',
        code: {
          'Source.h': `class FBaseLogic
{
public:
    virtual ~FBaseLogic() = default;   // correct polymorphic cleanup
    virtual void Execute() = 0;
};
`,
        },
        explanation: '= default asks the compiler to generate the default destructor body. This is more expressive than an empty {} and lets the compiler apply the Rule of Zero.',
      },
    ],
  },

  // =========================================================================
  // STAGE 11 — BLUEPRINT INTEGRATION (ADVANCED)
  // =========================================================================

  {
    id: 'task_39',
    title: '39. GameMode Architecture',
    category: 'Stage 11: Framework Architecture',
    objective: `# GameMode — The Rules of the Match

\`AGameModeBase\` defines *how* the game is played:
- Which Pawn class is used
- Which PlayerController class is used
- Win/loss conditions
- Match state

It exists **only on the server** (or in single-player). Never put client-side UI logic here.

\`AGameMode\` extends \`AGameModeBase\` with multiplayer-specific features (match states, ready-to-start checks). For simpler games, \`AGameModeBase\` is sufficient.

\`\`\`cpp
UCLASS()
class AMyGameMode : public AGameModeBase
{
    GENERATED_BODY()
public:
    AMyGameMode();
    virtual void PostLogin(APlayerController* NewPlayer) override;
};
\`\`\`

## Your Task
Declare \`AMyGameMode\` inheriting from \`AGameModeBase\` with \`UCLASS()\` and \`GENERATED_BODY()\`.
`,
    starterCode: {
      'Source.h': `// TODO: Declare AMyGameMode inheriting from AGameModeBase
`,
    },
    hiddenTests: ['class AMyGameMode', 'AGameModeBase', 'GENERATED_BODY()'],
    successCriteria: [
      'UCLASS() macro',
      'class AMyGameMode : public AGameModeBase',
      'GENERATED_BODY()',
    ],
    rules: [
      {
        id: 'r39_uclass',
        type: 'unreal',
        description: 'UCLASS() macro',
        evaluate: (code) => ({
          passed: /UCLASS\s*\(/.test(code),
          error: 'UCLASS() macro is missing.',
          fix: 'UCLASS()',
        }),
      },
      {
        id: 'r39_decl',
        type: 'unreal',
        description: 'AMyGameMode : public AGameModeBase',
        evaluate: (code) => ({
          passed: code.includes('AMyGameMode') && code.includes('AGameModeBase'),
          error: 'Declare AMyGameMode inheriting from AGameModeBase.',
          fix: 'class AMyGameMode : public AGameModeBase',
        }),
      },
      {
        id: 'r39_gen',
        type: 'unreal',
        description: 'GENERATED_BODY()',
        evaluate: (code) => ({
          passed: code.includes('GENERATED_BODY()'),
          error: 'Must include GENERATED_BODY() inside the class.',
          fix: 'GENERATED_BODY()',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_39a',
        title: 'AMyGameMode with override',
        code: {
          'Source.h': `UCLASS()
class AMyGameMode : public AGameModeBase
{
    GENERATED_BODY()
public:
    AMyGameMode();

    virtual void PostLogin(APlayerController* NewPlayer) override;
    virtual void Logout(AController* Exiting)             override;
};
`,
        },
        explanation: 'PostLogin fires when a player joins. Logout fires when they disconnect. These are common hooks for match tracking in multiplayer.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_40',
    title: '40. Math Data Types — FVector & FRotator',
    category: 'Stage 11: Framework Architecture',
    objective: `# 3D Math Types

| Type | Represents | Components |
|------|-----------|-----------|
| \`FVector\` | Position or direction | X, Y, Z |
| \`FRotator\` | Euler rotation | Pitch (Y), Yaw (Z), Roll (X) |
| \`FQuat\` | Quaternion rotation | X, Y, Z, W |
| \`FTransform\` | Full transform | Location + Rotation + Scale |

\`\`\`cpp
FVector  Origin   = FVector::ZeroVector;  // (0,0,0)
FRotator Facing   = FRotator(0.f, 90.f, 0.f); // face right
FVector  Forward  = Facing.Vector();       // → unit vector facing right
\`\`\`

In UE5, all math types default to \`double\` backend for Large World Coordinates support.

## Your Task
Inside \`ASpawner\`, declare:
1. \`FVector SpawnLocation;\` (default-initialised)
2. \`FRotator SpawnRotation;\` (default-initialised)
`,
    starterCode: {
      'Source.h': `class ASpawner : public AActor
{
    // TODO: Declare FVector SpawnLocation and FRotator SpawnRotation
};
`,
    },
    hiddenTests: ['FVector SpawnLocation', 'FRotator SpawnRotation'],
    successCriteria: [
      'Declare FVector SpawnLocation',
      'Declare FRotator SpawnRotation',
    ],
    rules: [
      {
        id: 'r40_vec',
        type: 'unreal',
        description: 'FVector SpawnLocation declared',
        evaluate: (code) => ({
          passed: code.includes('FVector SpawnLocation') || /FVector\s+SpawnLocation/.test(code),
          error: 'Declare FVector SpawnLocation;',
          fix: 'FVector SpawnLocation = FVector::ZeroVector;',
        }),
      },
      {
        id: 'r40_rot',
        type: 'unreal',
        description: 'FRotator SpawnRotation declared',
        evaluate: (code) => ({
          passed: code.includes('FRotator SpawnRotation') || /FRotator\s+SpawnRotation/.test(code),
          error: 'Declare FRotator SpawnRotation;',
          fix: 'FRotator SpawnRotation = FRotator::ZeroRotator;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_40a',
        title: 'UPROPERTY math members',
        code: {
          'Source.h': `class ASpawner : public AActor
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, Category = "Spawn")
    FVector SpawnLocation = FVector::ZeroVector;

    UPROPERTY(EditAnywhere, Category = "Spawn")
    FRotator SpawnRotation = FRotator::ZeroRotator;
};
`,
        },
        explanation: 'FVector::ZeroVector and FRotator::ZeroRotator are convenient named constants. Use them over FVector(0,0,0) for clarity and to avoid typos.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'task_41',
    title: '41. Gameplay Timers — SetTimer',
    category: 'Stage 11: Framework Architecture',
    objective: `# Gameplay Timers — Scheduled Callbacks

\`Tick\` fires every frame. For "execute something in 2 seconds", Timers are far better:

\`\`\`cpp
// Setup
FTimerHandle AttackTimerHandle;

void AEnemy::StartAttack()
{
    // Call PerformAttack after 1.5 seconds, once
    GetWorldTimerManager().SetTimer(
        AttackTimerHandle,
        this,
        &AEnemy::PerformAttack,
        1.5f,           // delay in seconds
        false           // bLooping
    );
}

void AEnemy::PerformAttack()
{
    UE_LOG(LogTemp, Log, TEXT("Attack!"));
}
\`\`\`

Timers are invalidated automatically if the owning actor is destroyed.

## Your Task
Implement \`AEnemy::StartAttack()\` that uses \`GetWorldTimerManager().SetTimer\` to call \`PerformAttack\` after **2.0** seconds, **non-looping**.
`,
    starterCode: {
      'Source.cpp': `void AEnemy::StartAttack()
{
    // TODO: Set a timer to call PerformAttack in 2.0 seconds (non-looping)
    // Use GetWorldTimerManager().SetTimer(AttackTimerHandle, this, &AEnemy::PerformAttack, 2.0f, false)
}
`,
    },
    hiddenTests: ['SetTimer', 'AttackTimerHandle', 'PerformAttack', '2.0f'],
    successCriteria: [
      'Call GetWorldTimerManager().SetTimer',
      'Pass AttackTimerHandle',
      'Target function &AEnemy::PerformAttack',
      'Delay 2.0f, bLooping false',
    ],
    rules: [
      {
        id: 'r41_settimer',
        type: 'unreal',
        description: 'SetTimer called',
        evaluate: (code) => ({
          passed: code.includes('SetTimer'),
          error: 'Call GetWorldTimerManager().SetTimer(...).',
          fix: 'GetWorldTimerManager().SetTimer(AttackTimerHandle, this, &AEnemy::PerformAttack, 2.0f, false);',
        }),
      },
      {
        id: 'r41_handle',
        type: 'unreal',
        description: 'AttackTimerHandle passed',
        evaluate: (code) => ({
          passed: code.includes('AttackTimerHandle'),
          error: 'Pass AttackTimerHandle as the first argument.',
          fix: 'SetTimer(AttackTimerHandle, ...)',
        }),
      },
      {
        id: 'r41_target',
        type: 'unreal',
        description: 'Target function is &AEnemy::PerformAttack',
        evaluate: (code) => ({
          passed: code.includes('PerformAttack'),
          error: 'Target function must be &AEnemy::PerformAttack.',
          fix: '&AEnemy::PerformAttack',
        }),
      },
      {
        id: 'r41_delay',
        type: 'unreal',
        description: 'Delay is 2.0f',
        evaluate: (code) => ({
          passed: code.includes('2.0f'),
          error: 'Delay must be 2.0f seconds.',
          fix: '2.0f, false',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_41a',
        title: 'SetTimer + cancel on end',
        code: {
          'Source.cpp': `void AEnemy::StartAttack()
{
    GetWorldTimerManager().SetTimer(
        AttackTimerHandle,
        this,
        &AEnemy::PerformAttack,
        2.0f,    // delay in seconds
        false    // not looping — fires once
    );
}

void AEnemy::PerformAttack()
{
    UE_LOG(LogTemp, Log, TEXT("Attack executed!"));
    // AttackTimerHandle is now invalid — don't check IsBound after a one-shot timer
}

void AEnemy::StopAttack()
{
    // Cancel if the enemy dies before the timer fires
    GetWorldTimerManager().ClearTimer(AttackTimerHandle);
}
`,
        },
        explanation: 'Always store the handle if you might need to cancel. ClearTimer is safe to call even if the timer has already fired.',
      },
    ],
  },
];