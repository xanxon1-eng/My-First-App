import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_NEW_LIGHTING: UTaskDefinition = {
    id: 'task_NEW_LIGHTING',
    title: '47. Light & Shadows Optimization',
    category: 'Stage 12: Rendering & Graphics',
    objective: `# Light & Shadows: Efficient & Powerful Methods

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
Declare a \`UDirectionalLightComponent*\` named \`SunLight\`. Then, enable Distance Field Shadows.
\`\`\`cpp
// Assume inside a constructor
SunLight = CreateDefaultSubobject<UDirectionalLightComponent>(TEXT("SunLight"));
SunLight->bCastDistanceFieldShadows = true;
\`\`\`
`,
    starterCode: {
      'Source.cpp': `void AWeatherManager::InitLight()
{
    // TODO 1: CreateDefaultSubobject for UDirectionalLightComponent
    // TODO 2: Set bCastDistanceFieldShadows to true
}
`,
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
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
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
          'Source.cpp': `void AWeatherManager::InitLight()
{
    SunLight = CreateDefaultSubobject<UDirectionalLightComponent>(TEXT("SunLight"));
    SunLight->bCastDistanceFieldShadows = true;
}
`,
        },
        explanation: 'Enabling distance fields on the directional light provides cheap, soft shadows in the mid-to-far distance.',
      },
    ],
  };
