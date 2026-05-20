import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_36: UTaskDefinition = {
    id: 'task_36',
    title: '36. Smart Pointers — TSharedPtr & TUniquePtr',
    category: 'Stage 9: Enterprise Architecture',
    objective: `# Smart Pointers for Non-UObject Code

UObject subclasses use the GC. For **plain C++ classes** (not UObject), manual memory management → leaks. Smart pointers automate this:

| Type | Ownership | Nullable | Thread-safe ref count |
|------|-----------|----------|-----------------------|
| \`TUniquePtr<T>\` | Exclusive | yes | — |
| \`TSharedPtr<T>\` | Shared (ref-counted) | yes | optional |
| \`TWeakPtr<T>\` | Observer (no ownership) | yes | — |

\`\`\`cpp
TUniquePtr<FMyData> Unique = MakeUnique<FMyData>();
TSharedPtr<FMyData> Shared = MakeShared<FMyData>();
TWeakPtr<FMyData>   Weak   = Shared;  // doesn't increment ref count
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Inside \`FDataManager\`, declare a \`TSharedPtr<FMyData>\` named \`DataPtr\`.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"

struct FMyData { int32 Value; };

class FDataManager
{
    // TODO: Declare TSharedPtr<FMyData> DataPtr
};
`,
    },
    hiddenTests: ['TSharedPtr<FMyData>', 'DataPtr'],
    successCriteria: [
      'TSharedPtr<FMyData> declared',
      'Named DataPtr',
    ],
    rules: [
      {
        id: 'r33_type_name',
        type: 'exercise',
        description: 'TSharedPtr<FMyData> DataPtr;',
        evaluate: (code) => ({
          passed: condense(code).includes('TSharedPtr<FMyData>DataPtr;'),
          error: 'Must declare TSharedPtr<FMyData> DataPtr;',
          fix: 'TSharedPtr<FMyData> DataPtr;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_33a',
        title: 'TSharedPtr with initialisation',
        code: {
          'Source.h': `struct FMyData { int32 Value = 0; };

class FDataManager
{
public:
    TSharedPtr<FMyData> DataPtr;

    FDataManager()
        : DataPtr(MakeShared<FMyData>())   // initialise immediately
    {}
};
`,
        },
        explanation: 'MakeShared<T>() is preferred over TSharedPtr<T>(new T()) — it allocates the object and ref-count block in a single allocation.',
      },
    ],
  };
