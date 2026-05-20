import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_opt_2: UTaskDefinition = {
    id: 'task_opt_2',
    title: '49. Multithreading & Async Tasks',
    category: 'Stage 13: AAA Optimization (CPU/RAM)',
    objective: `# Multithreading / Async Background Tasks

Moving heavy data operations (procedural generation, save file compression, Path of Exile style pathfinding) off the Main Game Thread. Doing heavy synchronous operations on the Game Thread causes massive drops in FPS locking the client.

### Hardware Impact (Concrete Metrics)
- **CPU:** Distributes thread load to background worker processors. Reduces Game Thread freezes by -250ms when writing massive BG3-style saves.
- **GPU:** Prevents GPU stalling. If the CPU takes 250ms, the GPU drops to 0% utilization waiting for draw commands.
- **RAM:** Requires ~+15MB buffer memory to manage concurrent thread task queues.
- **VRAM:** 0.0ms.
- **Latency / Ping:** Eliminates frame delays and network packet drops caused by Main Thread stalls completely (0ms disruption).

### What Unreal Engine Has / Needs
✅ **Has:** \`AsyncTask\` and \`GraphTask\` APIs to queue short-lived logic to safe background thread pools.
❌ **Missing:** Thread-safe UObject manipulation. Garbage collection and UProperties are STRICTLY limited to the Game Thread. Mutex lock debuggers.

### How to use
Wrap operations in \`AsyncTask(ENamedThreads::AnyBackgroundThreadSafeTask, []() { ... });\`.

## Your Task
Write a background task using \`AsyncTask\` targeting \`ENamedThreads::AnyBackgroundThreadSafeTask\`. 
Inside its lambda, simply assign \`true\` to a boolean named \`bIsDone\` (in reality, you'd do heavy math here).
`,
    starterCode: {
      'Source.cpp': `#include "Async/Async.h"

void ProcessHeavyInventoryLogic(bool& bIsDone)
{
    // TODO: Dispatch an AsyncTask to ENamedThreads::AnyBackgroundThreadSafeTask
    // Inside the lambda, set bIsDone = true;
}
`,
    },
    hiddenTests: ['AsyncTask', 'ENamedThreads::AnyBackgroundThreadSafeTask', 'bIsDone'],
    successCriteria: [
      'Call AsyncTask',
      'Use ENamedThreads::AnyBackgroundThreadSafeTask',
      'Set bIsDone inside the lambda',
    ],
    rules: [
      {
        id: 'r_opt2_async',
        type: 'unreal',
        description: 'AsyncTask syntax validation',
        evaluate: (code) => {
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
          return {
            passed: stripped.includes('AsyncTask(ENamedThreads::AnyBackgroundThreadSafeTask'),
            error: 'Must call AsyncTask targeting AnyBackgroundThreadSafeTask.',
            fix: 'AsyncTask(ENamedThreads::AnyBackgroundThreadSafeTask, [&bIsDone]() { bIsDone = true; });'
          };
        }
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_opt2',
        title: 'Background Thread Dispatch',
        code: {
          'Source.cpp': `void ProcessHeavyInventoryLogic(bool& bIsDone)
{
    AsyncTask(ENamedThreads::AnyBackgroundThreadSafeTask, [&bIsDone]()
    {
        // Heavy work here, unblocks the Game Thread!
        bIsDone = true; 
    });
}
`,
        },
        explanation: 'We capture the variable by reference and execute it off the Game Thread, preventing the game from freezing during intense logic.',
      },
    ],
  };
