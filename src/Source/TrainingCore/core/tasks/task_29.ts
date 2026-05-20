import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_29: UTaskDefinition = {
    id: 'task_29',
    title: '29. BlueprintNativeEvent',
    category: 'Stage 6: Blueprint Integration',
    objective: `# BlueprintNativeEvent — The Fallback Pattern

If you want a function to have a default C++ behavior, but allow Blueprint to completely override it if needed, use \`BlueprintNativeEvent\`.

In the Header:
\`\`\`cpp
UFUNCTION(BlueprintNativeEvent)
void Interact();
\`\`\`

In the CPP, you implement the \`_Implementation\` suffixed version:
\`\`\`cpp
void ADoor::Interact_Implementation()
{
    // Default C++ logic here
}
\`\`\`
Do NOT manually write the non-suffixed \`Interact()\` body; UHT generates it to route the call to Blueprint first, then fallback to your \`_Implementation\`.

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Declare \`void Interact();\` as a \`BlueprintNativeEvent\`. Then, write the \`void AMyActor::Interact_Implementation()\` definition in the C++ file.
`,
    starterCode: {
      'Source.h': `class AMyActor : public AActor
{
    GENERATED_BODY()
public:
    // TODO: Declare Interact() with BlueprintNativeEvent
};
`,
      'Source.cpp': `#include "MyActor.h"

// TODO: Implement AMyActor::Interact_Implementation()

`,
    },
    hiddenTests: ['BlueprintNativeEvent', 'Interact_Implementation'],
    successCriteria: [
      'Header has UFUNCTION(BlueprintNativeEvent) void Interact();',
      'CPP has void AMyActor::Interact_Implementation()',
    ],
    rules: [
      {
        id: 'r_new_6_1_macro',
        type: 'unreal',
        description: 'BlueprintNativeEvent void Interact();',
        evaluate: (code) => ({
          passed: condense(code).includes('BlueprintNativeEvent') && condense(code).includes('voidInteract();'),
          error: 'Must declare void Interact(); with BlueprintNativeEvent in the header.',
          fix: `UFUNCTION(BlueprintNativeEvent)\nvoid Interact();`,
        }),
      },
      {
        id: 'r_new_6_1_impl',
        type: 'unreal',
        description: 'Interact_Implementation defined in CPP',
        evaluate: (code) => ({
          passed: condense(code).includes('voidAMyActor::Interact_Implementation(){'),
          error: 'Must define void AMyActor::Interact_Implementation() in CPP.',
          fix: 'void AMyActor::Interact_Implementation() {}',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_new_6_1',
        title: 'Native Event Implementation',
        code: {
          'Source.h': `class AMyActor : public AActor
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintNativeEvent, Category = "Interaction")
    void Interact();
};`,
          'Source.cpp': `void AMyActor::Interact_Implementation()
{
    UE_LOG(LogTemp, Log, TEXT("Default C++ Interaction"));
}`,
        },
        explanation: 'When calling Interact() from C++, Unreal checks if Blueprint has overridden it. If so, BP runs. If not, Interact_Implementation() runs.',
      },
    ],
  };
