const fs = require('fs');
const path = './src/Source/TrainingCore/core/Curriculum.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Add Light & Shadows task
const lightShadowsTask = `
  // -------------------------------------------------------------------------
  {
    id: 'task_NEW_LIGHTING',
    title: '47. Light & Shadows Optimization',
    category: 'Stage 12: Rendering & Graphics',
    objective: \`# Light & Shadows: Efficient & Powerful Methods

Lighting can severely impact game performance. Understanding the different methods, their efficiency, and when to use them is key.

1. **Static Lighting (Lightmaps):** 
Precalculated during compilation. Extremely efficient at runtime (zero cost), used for static environment geometry. Does not update dynamically.
2. **Lumen:** 
Real-time dynamic global illumination and reflections. Powerful for dynamic scenes but computationally expensive; best for current-gen hardware.
3. **Virtual Shadow Maps (VSMs):** 
High-resolution shadows for dynamic objects combined with Nanite. Scalable but has memory overhead.
4. **Distance Field Shadows:** 
Uses Mesh Distance Fields to trace efficient soft shadows. Excellent for foliage or distant objects where standard cascaded shadows become too expensive.
5. **Contact Shadows:** 
Screen-space micro-shadows added on top of standard shadows to ground small props (e.g. grass, pebbles) at very low cost.

## 🌍 Multiplayer Consideration
Lighting and rendering are exclusively **client-side** operations. The server does not render graphics (Dedicated Servers run headlessly) and does not care about Lumen, shadows, or materials. Never trigger visual-only lighting changes via costly RPCs unless gameplay relies on it; instead, replicate the *state* (e.g., "bIsDaytime") and let clients update their lights independently.

## Your Task
Declare a \\\`UDirectionalLightComponent*\\\` named \\\`SunLight\\\`. Then, enable Distance Field Shadows.
\\\`\\\`\\\`cpp
// Assume inside a constructor
SunLight = CreateDefaultSubobject<UDirectionalLightComponent>(TEXT("SunLight"));
SunLight->bCastDistanceFieldShadows = true;
\\\`\\\`\\\`
\`,
    starterCode: {
      'Source.cpp': \`void AWeatherManager::InitLight()
{
    // TODO 1: CreateDefaultSubobject for UDirectionalLightComponent
    // TODO 2: Set bCastDistanceFieldShadows to true
}
\`,
    },
    hiddenTests: ['CreateDefaultSubobject', 'UDirectionalLightComponent', 'bCastDistanceFieldShadows'],
    successCriteria: [
      'Create the directional light component',
      'Enable distance field shadows',
    ],
    rules: [
      {
        id: 'r_light_create',
        type: 'unreal',
        description: 'Directional Light created',
        evaluate: (code) => {
          const stripped = code.replace(/\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\//g, "").replace(/\\s+/g, "");
          return {
            passed: stripped.includes('CreateDefaultSubobject<UDirectionalLightComponent>'),
            error: 'Must create a UDirectionalLightComponent.',
            fix: 'SunLight = CreateDefaultSubobject<UDirectionalLightComponent>(TEXT("SunLight"));'
          };
        }
      },
      {
        id: 'r_light_df',
        type: 'unreal',
        description: 'Distance Field Shadows enabled',
        evaluate: (code) => {
           return {
             passed: code.includes('bCastDistanceFieldShadows'),
             error: 'Must enable bCastDistanceFieldShadows.',
             fix: 'SunLight->bCastDistanceFieldShadows = true;'
           };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_light_df',
        title: 'DF Shadows creation',
        code: {
          'Source.cpp': \`void AWeatherManager::InitLight()
{
    SunLight = CreateDefaultSubobject<UDirectionalLightComponent>(TEXT("SunLight"));
    SunLight->bCastDistanceFieldShadows = true;
}
\`,
        },
        explanation: 'Enabling distance fields on the directional light provides cheap, soft shadows in the mid-to-far distance.',
      },
    ],
  },
];
`;

content = content.replace(/  \},\n\];/g, "  }," + lightShadowsTask);

// 2. Add Multiplayer Considerations to all remaining tasks (if not already there)
const multiplayerText = `## 🌍 Multiplayer Consideration\nWhen writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.\n\n## Your Task`;

content = content.split('## Your Task').join(multiplayerText);
// But wait, the new Light & shadows task already has ## Your Task and we just replaced it. 
// We will replace it back for just that task or just make sure it's acceptable.
// The new task has:
// ` + "## 🌍 Multiplayer Consideration\n..." + `\n## Your Task
// So replacing `## Your Task` with `## 🌍 Multiplayer ... \n\n## Your Task` will double it for Lighting. Let's fix that.
content = content.replace(/## 🌍 Multiplayer Consideration\nWhen writing C\+\+ for Unreal[^\n]+\n\n## 🌍 Multiplayer Consideration/g, "## 🌍 Multiplayer Consideration");

fs.writeFileSync(path, content, 'utf8');
console.log('Update complete!');
