import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_1: UTaskDefinition = {
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

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

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
        evaluate: (code) => ({
          passed: condense(code).includes('int32Health=100;'),
          error: 'Missing: int32 Health = 100;', 
          fix: 'int32 Health = 100;'
        }),
      },
      {
        id: 'r1_damage',
        type: 'exercise',
        description: 'float Damage = 45.5f',
        evaluate: (code) => ({
          passed: condense(code).includes('floatDamage=45.5f;'),
          error: 'Missing: float Damage = 45.5f; (remember the f suffix)', 
          fix: 'float Damage = 45.5f;'
        }),
      },
      {
        id: 'r1_alive',
        type: 'exercise',
        description: 'bool bIsAlive = true',
        evaluate: (code) => ({
          passed: condense(code).includes('boolbIsAlive=true;'),
          error: 'Missing: bool bIsAlive = true; (UE boolean prefix is lowercase b)', 
          fix: 'bool bIsAlive = true;'
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_1a',
        title: 'Standard solution',
        explanation: 'All three variables are declared with explicit initializers. The float uses the mandatory f suffix to avoid an implicit narrowing from double.',
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
  };
