import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_26: UTaskDefinition = {
    id: 'task_26',
    title: '26. UFUNCTION Blueprint Specifiers',
    category: 'Stage 6: Blueprint Integration',
    objective: `# UFUNCTION — Exposing C++ Functions to Blueprint

| Specifier | Behaviour |
|-----------|-----------|
| \`BlueprintCallable\` | Has an execution pin; can cause side effects |
| \`BlueprintPure\` | No execution pin; cached result; should be a getter |
| \`BlueprintImplementableEvent\` | No C++ body; *must* be implemented in Blueprint |
| \`BlueprintNativeEvent\` | C++ body is the default; Blueprint can override |

\`\`\`cpp
// Read-only getter — pure (no state change)
UFUNCTION(BlueprintPure)
float GetCurrentHealth() const { return Health; }

// Mutation — needs exec pin
UFUNCTION(BlueprintCallable)
void AddHealth(float Amount) { Health += Amount; }
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Declare both functions inside \`APlayer\`:
1. \`GetCurrentHealth()\` as \`BlueprintPure\`, returns \`float\`, marked \`const\`.
2. \`AddHealth(float Amount)\` as \`BlueprintCallable\`, returns \`void\`.
`,
    starterCode: {
      'Source.h': `class APlayer : public ACharacter
{
    GENERATED_BODY()
public:
    // TODO: Declare GetCurrentHealth as BlueprintPure
    // TODO: Declare AddHealth as BlueprintCallable
};
`,
    },
    hiddenTests: ['BlueprintPure', 'BlueprintCallable', 'GetCurrentHealth', 'AddHealth'],
    successCriteria: [
      'GetCurrentHealth declared with BlueprintPure',
      'AddHealth declared with BlueprintCallable',
    ],
    rules: [
      {
        id: 'r24_pure',
        type: 'unreal',
        description: 'UFUNCTION(BlueprintPure) float GetCurrentHealth() const',
        evaluate: (code) => ({
          passed: condense(code).includes('BlueprintPure') && condense(code).includes('floatGetCurrentHealth()const'),
          error: 'Declare GetCurrentHealth with UFUNCTION(BlueprintPure). Ensure it returns float and is const.',
          fix: `UFUNCTION(BlueprintPure)\nfloat GetCurrentHealth() const;`,
        }),
      },
      {
        id: 'r24_callable',
        type: 'unreal',
        description: 'UFUNCTION(BlueprintCallable) void AddHealth(float Amount)',
        evaluate: (code) => ({
          passed: condense(code).includes('BlueprintCallable') && condense(code).includes('voidAddHealth(floatAmount)'),
          error: 'Declare AddHealth with UFUNCTION(BlueprintCallable).',
          fix: `UFUNCTION(BlueprintCallable)\nvoid AddHealth(float Amount);`,
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_24a',
        title: 'Pure getter + callable setter',
        code: {
          'Source.h': `class APlayer : public ACharacter
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintPure, Category = "Health")
    float GetCurrentHealth() const { return Health; }

    UFUNCTION(BlueprintCallable, Category = "Health")
    void AddHealth(float Amount);

private:
    float Health = 100.0f;
};
`,
        },
        explanation: 'BlueprintPure functions must be const. Non-const functions default to BlueprintCallable. If you mark a const function as BlueprintCallable with BlueprintPure=false, UE will still expose the exec pin.',
      },
    ],
  };
