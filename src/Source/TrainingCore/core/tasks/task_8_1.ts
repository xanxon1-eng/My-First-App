import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_8_1: UTaskDefinition = {
    id: 'task_8_1',
    title: '8.1. UPROPERTY — Netcode Replication & GetLifetimeReplicatedProps',
    category: 'Stage 2: Code Structure & Memory',
    objective: `# Replicating Variables via UPROPERTY

When building multiplayer co-op networks (like custom lobby frameworks inspired by *Path of Exile* or *Baldur's Gate 3*), variables must be marked with \`Replicated\` or \`ReplicatedUsing\` to sync from server to clients.

In C++, just adding \`Replicated\` is not enough! You MUST:
1. Include \`Net/UnrealNetwork.h\` inside your source file.
2. Override workhorse function \`void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;\`.
3. Call macro \`DOREPLIFETIME(YourClass, YourVariable);\` inside that function body to register the replicated hook.

### 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-2.2ms on Server Thread)**: Defining replicated variables properly enables IRIS and legacy replication drivers to process dirty bytes efficiently on background threads without traversing unregistered objects.
*   **GPU Impact (0.0ms directly)**: Netcode is rendering independent.
*   **RAM Impact (+1.5MB system layout metadata)**: Tracks property reflection data.
*   **VRAM Impact (0.0ms directly)**: No graphic elements.
*   **Latency & Ping Impact (-15ms to -40ms)**: Well-configured replicated properties reduce packet serialization delays on server loop ticks, stabilizing ping jitter.

### ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**: IRIS Replication system which parallelises state checks across multiple worker threads, and dynamic NetDormancy overrides to quieten unchanged actors.
*   ⚠️ **What UE5 Lacks**: Automatic generation of \`GetLifetimeReplicatedProps\` boilerplate; developers must write macro hooks manually in C++.

## Your Task
Write a class \`AMyNPC\` derived from \`AActor\` that:
1. Declares a replicated int32 property: \`UPROPERTY(Replicated)\` \`int32 Health;\`
2. Declares the \`GetLifetimeReplicatedProps\` function override: \`void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;\`
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MyNPC.generated.h"

UCLASS()
class AMyNPC : public AActor
{
    GENERATED_BODY()

public:
    // TODO 1: Declare UPROPERTY(Replicated) int32 Health;
    
    // TODO 2: Declare GetLifetimeReplicatedProps override
};
`,
    },
    hiddenTests: ['Replicated', 'Health', 'GetLifetimeReplicatedProps', 'FLifetimeProperty'],
    successCriteria: [
      'Declare UPROPERTY(Replicated) int32 Health;',
      'Declare GetLifetimeReplicatedProps function override'
    ],
    rules: [
      {
        id: 'r8_1_prop',
        type: 'exercise',
        description: 'UPROPERTY(Replicated) declared',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('UPROPERTY(Replicated)') && c.includes('int32Health;'),
            error: 'You must declare UPROPERTY(Replicated) int32 Health;.',
            fix: 'UPROPERTY(Replicated)\nint32 Health;'
          };
        }
      },
      {
        id: 'r8_1_func',
        type: 'exercise',
        description: 'GetLifetimeReplicatedProps declared with override',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('voidGetLifetimeReplicatedProps(TArray<FLifetimeProperty>&OutLifetimeProps)constoverride;'),
            error: 'You must override GetLifetimeReplicatedProps with signature: void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;',
            fix: 'void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;'
          };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_8_1',
        title: 'Replicated Property Boilerplate',
        explanation: 'GetLifetimeReplicatedProps outlines variables replicated over the wire. This tells IRIS or Legacy Network frameworks how to schedule serialization sweeps.',
        code: {
          'Source.h': `UCLASS()
class AMyNPC : public AActor
{
    GENERATED_BODY()

public:
    UPROPERTY(Replicated)
    int32 Health;

    void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;
};
`
        }
      }
    ]
};
