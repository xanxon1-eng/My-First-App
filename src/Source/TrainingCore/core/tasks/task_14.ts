import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_14: UTaskDefinition = {
    id: 'task_14',
    title: '14. Tick & DeltaTime',
    category: 'Stage 3: Unreal Core & Data',
    objective: `# Tick & Frame-Rate Independence

\`Tick(float DeltaTime)\` is called every frame. \`DeltaTime\` is the seconds elapsed since the last frame.

**Why DeltaTime matters:**
- At 60 FPS: DeltaTime ≈ 0.0167 s
- At 30 FPS: DeltaTime ≈ 0.0333 s

If you move an object by a fixed amount each tick, it moves *twice as fast* at 60 FPS. Multiply by DeltaTime to make movement frame-rate independent:

\`\`\`cpp
float Speed = 500.0f;              // cm/s
float DistanceMoved = Speed * DeltaTime;  // correct distance this frame
\`\`\`

⚠️ Tick runs every frame — keep it lean. Use delegates, timers, or event-driven code when possible.

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Implement \`AMyActor::Tick(float DeltaTime)\`:
1. Call \`Super::Tick(DeltaTime);\`
2. Declare \`float Speed = 500.0f;\`
3. Declare \`float DistanceMoved = Speed * DeltaTime;\`
`,
    starterCode: {
      'Source.cpp': `#include "MyActor.h"

void AMyActor::Tick(float DeltaTime)
{
    // TODO 1: Call Super::Tick(DeltaTime)
    // TODO 2: Declare float Speed = 500.0f
    // TODO 3: Declare float DistanceMoved = Speed * DeltaTime
}
`,
    },
    hiddenTests: ['Super::Tick', 'Speed * DeltaTime'],
    successCriteria: [
      'Call Super::Tick(DeltaTime)',
      'Declare Speed = 500.0f',
      'Compute DistanceMoved = Speed * DeltaTime',
    ],
    rules: [
      {
        id: 'r14_super',
        type: 'unreal',
        description: 'Super::Tick(DeltaTime) called',
        evaluate: (code) => ({
          passed: condense(code).includes('Super::Tick(DeltaTime);'),
          error: 'Must call Super::Tick(DeltaTime);',
          fix: 'Super::Tick(DeltaTime);',
        }),
      },
      {
        id: 'r14_distance',
        type: 'exercise',
        description: 'DistanceMoved = Speed * DeltaTime',
        evaluate: (code) => ({
          passed: condense(code).includes('floatDistanceMoved=Speed*DeltaTime;'),
          error: 'Must explicitly compute: float DistanceMoved = Speed * DeltaTime;',
          fix: 'float DistanceMoved = Speed * DeltaTime;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_14a',
        title: 'Frame-rate independent movement',
        code: {
          'Source.cpp': `void AMyActor::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    const float Speed         = 500.0f;              // cm per second
    const float DistanceMoved = Speed * DeltaTime;   // correct per-frame distance
}
`,
        },
        explanation: 'const is preferred for values that won\'t change in the frame. The compiler may optimise them away entirely.',
      },
    ],
  };
