import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_28: UTaskDefinition = {
    id: 'task_28',
    title: '28. BlueprintImplementableEvent',
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

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Declare \`void OnTakeDamage();\` with \`UFUNCTION(BlueprintImplementableEvent)\`. No function body in C++.
`,
    starterCode: {
      'Source.h': `class APlayer : public ACharacter
{
    GENERATED_BODY()
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
        id: 'r26_macro_decl',
        type: 'unreal',
        description: 'BlueprintImplementableEvent declaration without a body',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('BlueprintImplementableEvent') && c.includes('voidOnTakeDamage();'),
            error: 'Declare void OnTakeDamage(); — note the semicolon, absolutely no curly brace body.',
            fix: `UFUNCTION(BlueprintImplementableEvent)\nvoid OnTakeDamage();`,
          };
        },
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
  };
