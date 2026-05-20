import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_38: UTaskDefinition = {
    id: 'task_38',
    title: '38. Async Tasks — GameThread Offloading',
    category: 'Stage 9: Enterprise Architecture',
    objective: `# AsyncTasks — Running Work in the Background

Heavy computations (pathfinding, chunk generation) cause the game to freeze if run on the main \`GameThread\`. Unreal provides \`AsyncTask\` to easily push work to background threads.

\`\`\`cpp
AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask, []()
{
    // Heavy work here...
    
    // Hop back to GameThread if you need to spawn actors or update UI
    AsyncTask(ENamedThreads::GameThread, []()
    {
        // Safe to modify UObjects here
    });
});
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Use \`AsyncTask\` to run a background lambda (\`ENamedThreads::AnyBackgroundThreadNormalTask\`). Inside the lambda, write a nested \`AsyncTask\` that hops back to \`ENamedThreads::GameThread\`.
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"
#include "Async/Async.h"

void PerformHeavyWork()
{
    // TODO: Write an AsyncTask targeting AnyBackgroundThreadNormalTask
    // TODO: Inside it, write another AsyncTask targeting GameThread
}
`,
    },
    hiddenTests: ['AsyncTask(', 'AnyBackgroundThreadNormalTask', 'GameThread'],
    successCriteria: [
      'Launch AsyncTask on AnyBackgroundThreadNormalTask',
      'Nested AsyncTask on GameThread',
    ],
    rules: [
      {
        id: 'r_new_9_2_bg',
        type: 'unreal',
        description: 'Background Thread AsyncTask',
        evaluate: (code) => ({
          passed: condense(code).includes('AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask,') || condense(code).includes('AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask,'),
          error: 'Must dispatch to AnyBackgroundThreadNormalTask.',
          fix: 'AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask, []() { ... });',
        }),
      },
      {
        id: 'r_new_9_2_game',
        type: 'unreal',
        description: 'GameThread Hop',
        evaluate: (code) => ({
          passed: condense(code).includes('AsyncTask(ENamedThreads::GameThread,'),
          error: 'Must hop back to ENamedThreads::GameThread inside the first task.',
          fix: 'AsyncTask(ENamedThreads::GameThread, []() { ... });',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_new_9_2',
        title: 'Task dispatch & GameThread resume',
        code: {
          'Source.cpp': `void PerformHeavyWork()
{
    AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask, []()
    {
        // 1. Heavy computation (doesn't block game)
        FPlatformProcess::Sleep(2.0f);
        
        // 2. Dispatch back to main thread to apply results safely
        AsyncTask(ENamedThreads::GameThread, []()
        {
            UE_LOG(LogTemp, Log, TEXT("Work finished!"));
        });
    });
}`,
        },
        explanation: 'UObjects, Actors, and UMG UI elements can GENERALLY ONLY be manipulated on the GameThread. Doing background work requires this hop-back pattern.',
      },
    ],
  };
