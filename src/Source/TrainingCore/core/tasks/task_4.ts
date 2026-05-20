import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_4: UTaskDefinition = {
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

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

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
        evaluate: (code) => ({
          passed: condense(code).includes('int32*AmmoPtr=&Ammo;') || condense(code).includes('int32*AmmoPtr;AmmoPtr=&Ammo;'),
          error: 'Must declare int32* AmmoPtr = &Ammo;',
          fix: 'int32* AmmoPtr = &Ammo;',
        }),
      },
      {
        id: 'r4_deref',
        type: 'exercise',
        description: 'Dereference write via *AmmoPtr',
        evaluate: (code) => ({
          passed: condense(code).includes('*AmmoPtr=15;'),
          error: 'Must write exactly 15 through the pointer using *AmmoPtr = 15;',
          fix: '*AmmoPtr = 15;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_4a',
        title: 'Pointer declaration + dereference write',
        explanation: '& gives us the address of Ammo. The * in the type declaration marks AmmoPtr as a pointer. The * in *AmmoPtr = ... dereferences — follow the address and write.',
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
  };
