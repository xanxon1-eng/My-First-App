import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_4_1: UTaskDefinition = {
    id: 'task_4_1',
    title: '4.1. References & Pass-by-Const-Reference (const T&)',
    category: 'Stage 1: The Raw Metal',
    objective: `# Pass-by-Const-Reference (Deep Dive)

When implementing the optimization guide's suggestions on reducing memory bandwidth and CPU cache-misses, one of the most critical C++ concepts you must master is **Pass-by-Reference**.

By default, passing a struct like \`FTransform\` or a custom \`FRPGItemData\` to a function passes it *by value*.
\`\`\`cpp
void ProcessItem(FRPGItemData Item); // ❌ Copies all bytes to the stack!
\`\`\`
If you do this in a loop of 10,000 items, you are uselessly copying huge amounts of data in RAM, generating massive CPU overhead.

By passing a **const reference (\`const T&\`)**, you pass the memory *address* (like a pointer, but automatically dereferenced safely), preventing the copy entirely.
\`\`\`cpp
void ProcessItem(const FRPGItemData& Item); // ✅ No copy! O(1) CPU overhead.
\`\`\`

### 🌍 RPG Hardware Impact Matrix
*   **CPU Impact (-4.2ms loop overhead)**: Skipping 10,000 struct copies inside a combat loop avoids dirtying L1 data caches, instantly cutting millisecond spikes.
*   **RAM Impact (0MB overhead)**: Prevents allocating temporary struct copies on the execution stack.
*   **Latency & Ping Impact (-2ms)**: Faster tick evaluation inside dedicated server loops.

## Your Task
Update the function signature \`void CalculateDamage(FWeaponStats Stats)\` to use **pass-by-const-reference** to avoid copying the struct.
1. Add \`const\` before the type.
2. Add \`&\` after the type to mark it as a reference.
`,
    starterCode: {
      'Source.cpp': `struct FWeaponStats {
    int32 BaseDamage;
    float CriticalMultiplier;
    int32 ElementalDamage;
};

// TODO: Change (FWeaponStats Stats) to pass by const reference (const FWeaponStats& Stats)
void CalculateDamage(FWeaponStats Stats)
{
    // Calculation logic...
}
`,
    },
    hiddenTests: ['CalculateDamage', 'const FWeaponStats&'],
    successCriteria: [
      'Use the const keyword',
      'Use the & reference operator',
    ],
    rules: [
      {
        id: 'r4_1_const_ref',
        type: 'exercise',
        description: 'Function argument is passed by const reference',
        evaluate: (code) => ({
          passed: condense(code).includes('voidCalculateDamage(constFWeaponStats&Stats)'),
          error: 'Must declare the parameter as: const FWeaponStats& Stats',
          fix: 'void CalculateDamage(const FWeaponStats& Stats)',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_4_1',
        title: 'Pass by Const Reference',
        explanation: 'By adding const T&, the C++ compiler passes a 64-bit memory address instead of duplicating the entire struct. The const modifier guarantees the function cannot accidentally modify the caller’s original data, making it thread-safe and heavily optimizable.',
        code: {
          'Source.cpp': `struct FWeaponStats {
    int32 BaseDamage;
    float CriticalMultiplier;
    int32 ElementalDamage;
};

void CalculateDamage(const FWeaponStats& Stats)
{
    // Calculation logic...
}
`,
        },
      },
    ],
  };
