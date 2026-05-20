import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_43: UTaskDefinition = {
    id: 'task_43',
    title: '43. Virtual Destructors',
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

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

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
          passed: condense(code).includes('virtual~FBaseLogic();') || condense(code).includes('virtual~FBaseLogic()=default;') || condense(code).includes('virtual~FBaseLogic(){}'),
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
  };
