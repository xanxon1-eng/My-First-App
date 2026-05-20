import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_12: UTaskDefinition = {
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

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Declare class \`AMonster\` that **publicly** inherits from \`ACharacter\`. Include the class body \`{}\` and closing semicolon.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "Monster.generated.h"

// TODO: Declare class AMonster that inherits publicly from ACharacter

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
        id: 'r12_class_inherit',
        type: 'exercise',
        description: 'class AMonster : public ACharacter',
        evaluate: (code) => ({
          passed: condense(code).includes('classAMonster:publicACharacter{'),
          error: 'Must declare class AMonster inheriting publicly from ACharacter.',
          fix: 'class AMonster : public ACharacter { };',
        }),
      },
      {
        id: 'r12_semi',
        type: 'exercise',
        description: 'Class closed with };',
        evaluate: (code) => ({
          passed: condense(code).includes('};'),
          error: 'Class definitions must end with a semicolon.',
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
  };
