import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_40_1: UTaskDefinition = {
    id: 'task_40_1',
    title: '40.1. Lambdas — Capture Hazards in Async Threading (TWeakObjectPtr)',
    category: 'Stage 13: AAA Optimization (CPU/RAM)',
    objective: `# Capturing the Game Thread Context Safely

When dealing with asynchronous multithreading (offloading jobs via \`Async(EAsyncExecution::TaskGraph, ...)\` to hit frame-time goals), C++ Lambda expressions are incredibly powerful. However, memory capture hazards are the #1 cause of silent project crashes in AAA game development.

If a Game Thread object (like an \`AMonsterData\`) launches an async lambda and passes its own memory pointer (\`[this]\`) into the background thread, a race condition is born: if the monster is blown up and deleted by Garbage Collection *before* the async thread finishes its work, the background thread will attempt to write data to \`this\`, hitting **dead memory** and immediately crashing the entire engine.

---

## 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-4.2ms overall efficiency)**: Using \`TWeakObjectPtr\` inside a lambda allows you to securely lock and sync results back into Game Thread logic without creating blocking MUTEX locks. You skip stalling thread context switches (saving cycles) while ensuring thread-safety.
*   **GPU Impact (0.0ms)**: Async task completion doesn't directly interact with GPU memory. 
*   **RAM Impact (+0.0MB)**: Minimal footprint addition (only storing a 32-bit integer index flag).
*   **VRAM Impact (0.0ms)**: N/A.
*   **Latency & Ping Impact (0.0ms)**: Ensures server node execution avoids catastrophic crashes during high-concurrency event handling.

### ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**: \`TWeakObjectPtr<T>\` tracks object validity dynamically via the global \`GUObjectArray\`, returning \`nullptr\` safely if the host was deleted.
*   ⚠️ **What UE5 Lacks**: The compiler will happily let you capture \`[this]\` inside an async Lambda, creating a ticking time bomb.
*   🛠️ **How to Use / Workaround**: Never capture \`[this]\` in asynchronous thread delegates. Always create a \`TWeakObjectPtr\` copy of \`this\` locally, capture the weak pointer by value in the lambda, and check \`.IsValid()\` when the thread resolves.

---

## Your Task
Inside the \`ExecuteHeavyMath\` function, you must prepare a safe reference for the async lambda.

1. Declare a \`TWeakObjectPtr<AMyActor>\` named \`WeakThis\` and assign it to \`this\`.
2. The Lambda currently captures the dangerous \`[this]\`. Change it to capture \`[WeakThis]\` by value.
3. Inside the lambda, add an \`if (WeakThis.IsValid())\` check before attempting to modify \`WeakThis->CalculatedResult\`.
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"
#include "Async/Async.h"

class AMyActor
{
public:
    int32 CalculatedResult = 0;

    void ExecuteHeavyMath()
    {
        // TODO: 1. Declare TWeakObjectPtr<AMyActor> WeakThis = this;
        
        // TODO: 2. Replace [this] with [WeakThis]
        AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask, [this]()
        {
            // TODO: 3. Null-check WeakThis.IsValid() before executing
            // WeakThis->CalculatedResult = 9000;
        });
    }
};
`,
    },
    hiddenTests: ['TWeakObjectPtr<AMyActor>', 'WeakThis', 'IsValid()'],
    successCriteria: [
      'Declares TWeakObjectPtr',
      'Captures WeakThis in the lambda',
      'Checks IsValid before modifying',
    ],
    rules: [
      {
        id: 'r_opt_async_lambda_weak',
        type: 'unreal',
        description: 'Implement TWeakObjectPtr in async lambda',
        evaluate: (code) => {
           const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
           
           if (!stripped.includes('TWeakObjectPtr<AMyActor>WeakThis=this;')) {
              return { passed: false, error: 'You must declare TWeakObjectPtr<AMyActor> WeakThis = this;', fix: 'Add the weak pointer definition.' };
           }

           if (stripped.includes('[this]')) {
              return { passed: false, error: 'Never capture [this] in an AsyncTask! Use [WeakThis] instead.', fix: 'Change [this] to [WeakThis].' };
           }

           if (!stripped.includes('[WeakThis]')) {
             return { passed: false, error: 'Capture [WeakThis] by value in the lambda.', fix: 'Ensure it is written as [WeakThis]()' };
           }

           if (!stripped.includes('if(WeakThis.IsValid())')) {
              return { passed: false, error: 'You must check if(WeakThis.IsValid()) before executing logic.', fix: 'Wrap the pointer usage in an validity check.' };
           }

           if (!stripped.includes('WeakThis->CalculatedResult=9000;')) {
              return { passed: false, error: 'Modify the object using WeakThis->', fix: 'WeakThis->CalculatedResult = 9000;' };
           }

           return { passed: true, error: '', fix: '' };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_opt_lambda',
        title: 'Bulletproof Thread Capture',
        code: {
          'Source.cpp': `void ExecuteHeavyMath()
{
    // Create a thread-safe tracker
    TWeakObjectPtr<AMyActor> WeakThis = this;
    
    // Pass by value safely
    AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask, [WeakThis]()
    {
        // Engine GC might have deleted the actor while we were sleeping!
        if (WeakThis.IsValid())
        {
            WeakThis->CalculatedResult = 9000;
        }
    });
}
`,
        },
        explanation: 'By copying the TWeakObjectPtr index into the background thread stack, you safely decouple runtime execution memory paths. If the Actor gets wiped out by Garbage Collection, IsValid() drops to false smoothly instead of triggering a fatal CPU null-execution exception.',
      },
    ],
  };
