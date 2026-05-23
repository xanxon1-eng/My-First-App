import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_14_2: UTaskDefinition = {
    id: 'task_14_2',
    title: '14.2. Inlining & FORCEINLINE',
    category: 'Stage 3: Unreal Core & Data',
    objective: `# Inlining & FORCEINLINE (Deep Dive)

Calling a function in C++ isn't free. The CPU has to save the current execution state, context-switch to the function's memory block, execute, and return.
If you have a tiny math function being called ten thousand times a frame (like checking distance vectors or retrieving health stats), this context-switching overhead completely outweighs the calculation itself!

Adding the \`FORCEINLINE\` macro instructs the compiler to take the code *inside* the function and physically paste it wherever the function is called, avoiding the jump completely.

### 🌍 RPG Hardware Impact Matrix
*   **CPU Impact (-1.5ms logic time)**: Removes jump instruction stalls from the instruction pipeline. Extremely valuable for math calculation libraries.
*   **RAM Impact (+0.2MB build size)**: Inlining duplicates code in the final binary (since it "pastes" everywhere), leading to slightly larger executables—a trivial tradeoff for execution speed.

## Your Task
We have a getter function: \`int32 GetHealth() const { return Health; }\`.
Since it's tiny, we should force inline it.
1. Add the \`FORCEINLINE\` macro before the return type \`int32\`.
`,
    starterCode: {
      'Source.h': `#pragma once

class APlayer
{
private:
    int32 Health = 100;

public:
    // TODO: Add FORCEINLINE immediately before int32
    int32 GetHealth() const { return Health; }
};
`,
    },
    hiddenTests: ['FORCEINLINE', 'GetHealth'],
    successCriteria: [
      'Add FORCEINLINE before the return type',
    ],
    rules: [
      {
        id: 'r14_2_inline',
        type: 'exercise',
        description: 'FORCEINLINE applied correctly',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('FORCEINLINEint32GetHealth()const'),
            error: 'You must add FORCEINLINE immediately before int32 GetHealth()',
            fix: 'FORCEINLINE int32 GetHealth() const',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_14_2',
        title: 'Forced Inline Header Definition',
        explanation: 'Because the getter does exactly one assignment operation, the instruction cycle cost of jumping to the function address is drastically larger than the code itself. FORCEINLINE is crucial here.',
        code: {
          'Source.h': `#pragma once

class APlayer
{
private:
    int32 Health = 100;

public:
    FORCEINLINE int32 GetHealth() const { return Health; }
};
`,
        },
      },
    ],
  };
