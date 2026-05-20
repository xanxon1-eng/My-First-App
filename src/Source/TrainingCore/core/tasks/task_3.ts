import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_3: UTaskDefinition = {
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

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

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
      'Use std::cout',
      'Print the exact string "Hello Unreal"',
      'Flush with std::endl',
    ],
    rules: [
      {
        id: 'r3_cout',
        type: 'exercise',
        description: 'std::cout used',
        evaluate: (code) => ({
          passed: condense(code).includes('std::cout<<'),
          error: 'Must use std::cout (not printf or UE_LOG for this exercise).',
          fix: 'std::cout << "Hello Unreal" << std::endl;',
        }),
      },
      {
        id: 'r3_text',
        type: 'exercise',
        description: '"Hello Unreal" present in output',
        evaluate: (code) => ({
          passed: hasStr(code, '"Hello Unreal"'),
          error: 'The string literal "Hello Unreal" must appear exactly (case sensitive).',
          fix: 'std::cout << "Hello Unreal" << std::endl;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_3a',
        title: 'Using std::cout with endl',
        explanation: 'std::cout is the standard output stream. << chains output. std::endl flushes the buffer and appends a newline.',
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
  };
