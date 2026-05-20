import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_11: UTaskDefinition = {
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

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Implement \`AMyActor::BeginPlay()\` in the .cpp file. The function body can be empty (or call Super).
`,
    starterCode: {
      'Source.cpp': `#include "MyActor.h"

// AMyActor declares BeginPlay() in its header.
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
        description: 'AMyActor::BeginPlay() function body defined',
        evaluate: (code) => ({
          passed: condense(code).includes('voidAMyActor::BeginPlay(){'),
          error: 'Must write: void AMyActor::BeginPlay() { ... }',
          fix: 'void AMyActor::BeginPlay() { }',
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
  };
