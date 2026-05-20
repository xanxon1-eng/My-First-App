import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_13: UTaskDefinition = {
    id: 'task_13',
    title: '13. Actor Lifecycle — BeginPlay & Super',
    category: 'Stage 3: Unreal Core & Data',
    objective: `# Actor Lifecycle

Every \`AActor\` goes through a defined lifecycle:

\`PostSpawnInitialize → PreInitializeComponents → InitializeComponent → PostInitializeComponents → **BeginPlay** → Tick → EndPlay\`

**BeginPlay** is your "Start" / "Awake" — it fires once when the actor enters the world.

## The Super Rule
If you override a virtual Unreal function, you **must** call the parent's version:
\`\`\`cpp
void AMyActor::BeginPlay()
{
    Super::BeginPlay();   // ← always first
    // your code here
}
\`\`\`

Skipping \`Super::BeginPlay()\` leaves engine systems (replication, component initialisation, blueprint BeginPlay) un-initialised → subtle, hard-to-find bugs.

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Implement \`AMyPlayer::BeginPlay()\`. The **first** statement inside the body must be \`Super::BeginPlay();\`.
`,
    starterCode: {
      'Source.cpp': `#include "MyPlayer.h"

void AMyPlayer::BeginPlay()
{
    // TODO: Call Super::BeginPlay() as the FIRST statement
}
`,
    },
    hiddenTests: ['Super::BeginPlay()'],
    successCriteria: ['Call Super::BeginPlay(); as the first statement'],
    rules: [
      {
        id: 'r13_super',
        type: 'unreal',
        description: 'Super::BeginPlay() is called strictly as the first statement',
        evaluate: (code) => ({
          passed: condense(code).includes('voidAMyPlayer::BeginPlay(){Super::BeginPlay();'),
          error: 'You MUST call Super::BeginPlay(); as the very first line inside the curly braces.',
          fix: 'void AMyPlayer::BeginPlay() { Super::BeginPlay(); }',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_13a',
        title: 'Correct BeginPlay override',
        code: {
          'Source.cpp': `void AMyPlayer::BeginPlay()
{
    Super::BeginPlay();

    // Safe to do your own initialisation here
    UE_LOG(LogTemp, Log, TEXT("AMyPlayer has entered the world!"));
}
`,
        },
        explanation: 'Super:: calls the parent class version. Because of multiple-inheritance depth in UE, many engine subsystems rely on BeginPlay propagating up the chain.',
      },
    ],
  };
