import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_opt_5: UTaskDefinition = {
    id: 'task_opt_5',
    title: '52. World Partition, Streaming & IRIS Replication',
    category: 'Stage 15: Open World & Multiplayer Netcode',
    objective: `# World Partition & Fast Replication

Managing massive RPG open maps like the Witcher 3 or Baldur's Gate 3. 
**World Partition** divides the world into spatial grids that stream automatically based on proximity.
**IRIS Replication** (UE5.1+) processes connection scoping on background threads in O(1) data loops, vastly outperforming the legacy sequential O(N) Netcode. 

### Hardware Impact (Concrete Metrics)
- **CPU:** World partition completely disables ticks for distant actors (saving 4.2ms). IRIS lowers server serialization threads by 5.9ms.
- **GPU:** Saves up to 4.5ms GPU rendering time by unloading distant geometric meshes.
- **RAM:** Saves up to 1.8GB of System RAM by streaming only nearby active grid assets.
- **VRAM:** Saves up to 2.2GB VRAM caching textures aggressively.
- **Latency / Ping:** Keeps network ping under 25ms during rapid world exploration by saving server bandwidth limits.

### What Unreal Engine Has / Needs
✅ **Has:** \`NetDormancy\` flags to sleep untampered objects (like closed chests). \`FFastArraySerializer\` to transmit array deltas elegantly.
❌ **Missing:** Automated server-side partition scaling matching network bandwidth parameters (must be tuned manually).

## Your Task
To utilize Replication Dormancy (Interest Management), set an actor's \`NetDormancy\` to \`DORM_DormantAll\` inside a \`AChestActor\` constructor. This tells the server to NEVER send network updates for this chest until a player interacts with it, saving extreme amounts of bandwidth!
`,
    starterCode: {
      'Source.cpp': `#include "GameFramework/Actor.h"

// Imagine this is a passive treasure chest in the open world
AChestActor::AChestActor()
{
    bReplicates = true;

    // TODO: Set NetDormancy to DORM_DormantAll
}
`,
    },
    hiddenTests: ['NetDormancy', 'DORM_DormantAll'],
    successCriteria: [
      'Set NetDormancy = DORM_DormantAll',
    ],
    rules: [
      {
        id: 'r_opt5_dormancy',
        type: 'unreal',
        description: 'Actor Dormancy Set',
        evaluate: (code) => {
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
          return {
            passed: stripped.includes('NetDormancy=DORM_DormantAll;'),
            error: 'You must set NetDormancy = DORM_DormantAll;',
            fix: 'NetDormancy = DORM_DormantAll;'
          };
        }
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_opt5',
        title: 'Initial Dormancy State',
        code: {
          'Source.cpp': `AChestActor::AChestActor()
{
    bReplicates = true;
    NetDormancy = DORM_DormantAll;
}
`,
        },
        explanation: 'When 50,000 chests are spawned across an open world map, keeping them strictly Dormant prevents the server CPU from scanning them every network tick, massively optimizing the game.',
      },
    ],
  };
