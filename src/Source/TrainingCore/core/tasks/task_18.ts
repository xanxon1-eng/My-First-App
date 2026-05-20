import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_18: UTaskDefinition = {
    id: 'task_18',
    title: '18. Unreal Delegates — Event Broadcasting',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: `# Delegates — The Observer Pattern in UE

Delegates decouple event sources from listeners. Instead of a hard call (\`UI->UpdateHealth(100)\`), you broadcast to whoever is subscribed:

\`\`\`cpp
// Declare the delegate type (outside any class)
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnPlayerDiedSignature);

// Inside a UCLASS:
UPROPERTY(BlueprintAssignable)
FOnPlayerDiedSignature OnPlayerDied;

// Broadcasting:
OnPlayerDied.Broadcast();
\`\`\`

| Macro prefix | Multi-listener? | Blueprint bindable? |
|---|---|---|
| DECLARE_DELEGATE | ❌ | ❌ |
| DECLARE_MULTICAST_DELEGATE | ✅ | ❌ |
| DECLARE_DYNAMIC_MULTICAST_DELEGATE | ✅ | ✅ |

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Declare \`FOnPlayerDiedSignature\` using the correct multicast dynamic macro.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"

// TODO: Declare FOnPlayerDiedSignature using DECLARE_DYNAMIC_MULTICAST_DELEGATE
`,
    },
    hiddenTests: ['DECLARE_DYNAMIC_MULTICAST_DELEGATE', 'FOnPlayerDiedSignature'],
    successCriteria: [
      'Use DECLARE_DYNAMIC_MULTICAST_DELEGATE macro',
      'Name the type FOnPlayerDiedSignature',
    ],
    rules: [
      {
        id: 'r18_macro_name',
        type: 'unreal',
        description: 'DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnPlayerDiedSignature);',
        evaluate: (code) => ({
          passed: condense(code).includes('DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnPlayerDiedSignature);'),
          error: 'Syntax must be exactly: DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnPlayerDiedSignature);',
          fix: 'DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnPlayerDiedSignature);',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_18a',
        title: 'Minimal delegate declaration',
        code: {
          'Source.h': `// Declares a delegate signature with no payload parameters
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnPlayerDiedSignature);

// To pass data, use the parameterised form:
// DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnHealthChangedSignature, float, NewHealth);
`,
        },
        explanation: 'Delegate types are declared once (often in the class header) and then instantiated as UPROPERTY members. BlueprintAssignable lets designers bind functions in the BP graph.',
      },
    ],
  };
