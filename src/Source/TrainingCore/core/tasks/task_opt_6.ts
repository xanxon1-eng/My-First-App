import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_opt_6: UTaskDefinition = {
    id: 'task_opt_6',
    title: '53. Draw Calls, PSO & Material Packing',
    category: 'Stage 15: Open World & Multiplayer Netcode',
    objective: `# Draw Calls, PSO Caches & Shader Complexity

A single high-detail character in BG3 can issue 50+ Draw Calls. Sending these individually across thousands of items starves the GPU. We batch with **Instanced Static Meshes**.
Furthermore, dynamic shader compilation drops frames by 250ms+ (Stutters). We resolve this with **PSO (Pipeline State Object) Caching**.

### Hardware Impact (Concrete Metrics)
- **CPU:** Reduces Draw Thread overhead from 9.4ms to under 2.1ms (Instancing). 
- **GPU:** PSOs save up to 250ms of major GPU block stutter spikes, guaranteeing frame completion under 16.7ms.
- **RAM:** +12MB storage for instanced coordinate transform matrices.
- **VRAM:** Saves up to 600MB VRAM by packing individual Roughness, Metallic, AO, and Height maps into single RGBA textures (Channel Packing).
- **Latency / Ping:** Guarantees a stable local client processing loop, keeping server synchronization tight (15ms).

### What Unreal Engine Has / Needs
✅ **Has:** \`FShaderPipelineCache\` to preload textures, \`HISM\` (Hierarchical Instanced Static Meshes).
❌ **Missing:** Automatic channel packing (materials must be composed in Photoshop/Substance).

## Your Task
To batch massive amounts of arrows or loot into ONE Draw Call, we use \`UInstancedStaticMeshComponent\` (ISM).
1. Declare a pointer to \`UInstancedStaticMeshComponent\` named \`LootManager\`.
2. Add a \`UPROPERTY()\` decorator.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/InstancedStaticMeshComponent.h"
#include "MyLoot.generated.h"

UCLASS()
class AMyLootSystem : public AActor
{
    GENERATED_BODY()

public:
    // TODO: Add UPROPERTY()
    // TODO: Declare a UInstancedStaticMeshComponent* LootManager;
};
`,
    },
    hiddenTests: ['UInstancedStaticMeshComponent', 'LootManager', 'UPROPERTY'],
    successCriteria: [
      'Add UPROPERTY() macro',
      'Declare UInstancedStaticMeshComponent* LootManager',
    ],
    rules: [
      {
        id: 'r_opt6_ism',
        type: 'unreal',
        description: 'ISM Component correctly declared',
        evaluate: (code) => {
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
          return {
            passed: stripped.includes('UPROPERTY') && stripped.includes('UInstancedStaticMeshComponent*LootManager'),
            error: 'You must declare UInstancedStaticMeshComponent* LootManager; with a UPROPERTY()',
            fix: 'UPROPERTY()\nUInstancedStaticMeshComponent* LootManager;'
          };
        }
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_opt6',
        title: 'ISM Declaration',
        code: {
          'Source.h': `UCLASS()
class AMyLootSystem : public AActor
{
    GENERATED_BODY()

public:
    UPROPERTY(VisibleAnywhere)
    UInstancedStaticMeshComponent* LootManager;
};
`,
        },
        explanation: 'By routing thousands of static loot drops into a single ISM Component instead of spawning thousands of AActor loot boxes, you reduce CPU Draw threading overhead staggeringly (from ~8.0ms to <0.5ms).',
      },
    ],
  };
