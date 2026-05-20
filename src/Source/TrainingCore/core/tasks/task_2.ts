import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_2: UTaskDefinition = {
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

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

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
          const c = condense(code);
          return {
            passed: c.includes('Health-=Damage;') || c.includes('Health=Health-Damage;'),
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
          const c = condense(code);
          return {
            passed: c.includes('bIsAlive=Health>0;') || c.includes('bIsAlive=(Health>0);'),
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
  };
