import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_37: UTaskDefinition = {
    id: 'task_37',
    title: '37. TWeakPtr — Breaking Reference Cycles',
    category: 'Stage 9: Enterprise Architecture',
    objective: `# TWeakPtr — Safety Without Ownership

Memory leaks in shared pointer architectures usually stem from **cyclic references** (A points to B, and B points to A). Because their reference counts can never hit 0, neither gets deleted.

\`TWeakPtr<T>\` solves this. It observes a \`TSharedPtr\` but does *not* increment its reference count.

\`\`\`cpp
TSharedPtr<FNode> NodeA = MakeShared<FNode>();
TWeakPtr<FNode>   SafeRef = NodeA; // Ref count stays 1

if (TSharedPtr<FNode> PinnedNode = SafeRef.Pin())
{
    // Object still exists, safe to use PinnedNode
}
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Inside \`FObserver\`, declare a \`TWeakPtr<FData>\` named \`DataRef\`. Then in \`PrintData()\`, try to \`.Pin()\` it and verify it's valid before using.
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

struct FData { void DoSomething(){} };

class FObserver
{
    // TODO 1: Declare TWeakPtr<FData> DataRef;
public:
    void PrintData()
    {
        // TODO 2: Call Pin() on DataRef, check if valid, then use
    }
};
`,
    },
    hiddenTests: ['TWeakPtr<FData>', 'DataRef.Pin()'],
    successCriteria: [
      'Declare TWeakPtr<FData> DataRef',
      'Pin it before accessing it via if (...)',
    ],
    rules: [
      {
        id: 'r_new_9_1_weak',
        type: 'exercise',
        description: 'TWeakPtr<FData> DataRef declared',
        evaluate: (code) => ({
          passed: condense(code).includes('TWeakPtr<FData>DataRef;'),
          error: 'Must declare TWeakPtr<FData> DataRef;',
          fix: 'TWeakPtr<FData> DataRef;',
        }),
      },
      {
        id: 'r_new_9_1_pin',
        type: 'exercise',
        description: 'Pin() used properly in an if statement',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('if(TSharedPtr<FData>') && c.includes('=DataRef.Pin())'),
            error: 'You must lock/pin a weak pointer inside an if statement to elevate it.',
            fix: 'if (TSharedPtr<FData> Pinned = DataRef.Pin()) { /* do stuff */ }',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_new_9_1',
        title: 'Proper Pinning Pattern',
        code: {
          'Source.cpp': `class FObserver
{
    TWeakPtr<FData> DataRef;

public:
    void PrintData()
    {
        if (TSharedPtr<FData> Pinned = DataRef.Pin())
        {
            // Pinned guarantees FData stays alive during this block
            // Pinned->DoSomething();
        }
    }
};`,
        },
        explanation: 'Pin() atomically checks if the object is alive and temporarily increments the reference count. If the object was already deleted, Pin() returns nullptr.',
      },
    ],
  };
