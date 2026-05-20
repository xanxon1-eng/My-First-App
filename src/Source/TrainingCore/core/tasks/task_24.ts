import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_24: UTaskDefinition = {
    id: 'task_24',
    title: '24. Async Asset Loading — FStreamableManager',
    category: 'Stage 5: UE5 Pro Features',
    objective: `# Async Asset Loading

Soft references prevent assets from loading instantly, avoiding memory bloat and long load times. But how do you actually load them when needed without "hitching" the game?

Using \`FStreamableManager\` allows the engine to load the asset in the background and fire a callback (delegate) when it finishes.

\`\`\`cpp
UAssetManager::GetStreamableManager().RequestAsyncLoad(
    IconRef.ToSoftObjectPath(),
    FStreamableDelegate::CreateUObject(this, &UMyUI::OnIconLoaded)
);
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Write a function \`LoadIconAsync()\` that uses \`RequestAsyncLoad\` on \`IconRef\`, binding the callback to \`UMyUI::OnIconLoaded\`.
`,
    starterCode: {
      'Source.cpp': `#include "MyUI.h"
#include "Engine/AssetManager.h"

void UMyUI::LoadIconAsync()
{
    // TODO: Call RequestAsyncLoad on UAssetManager::GetStreamableManager()
    // Pass IconRef.ToSoftObjectPath() and a delegate bound to OnIconLoaded
}
`,
    },
    hiddenTests: ['GetStreamableManager', 'RequestAsyncLoad', 'IconRef.ToSoftObjectPath()', 'OnIconLoaded'],
    successCriteria: [
      'Access StreamableManager from UAssetManager',
      'Call RequestAsyncLoad with IconRef path',
      'Bind delegate to OnIconLoaded',
    ],
    rules: [
      {
        id: 'r_new_5_1_manager',
        type: 'unreal',
        description: 'UAssetManager::GetStreamableManager().RequestAsyncLoad(...)',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('UAssetManager::GetStreamableManager().RequestAsyncLoad('),
            error: 'Must use UAssetManager::GetStreamableManager().RequestAsyncLoad(...)',
            fix: 'UAssetManager::GetStreamableManager().RequestAsyncLoad(...);',
          };
        },
      },
      {
        id: 'r_new_5_1_path_delegate',
        type: 'unreal',
        description: 'Path and Delegate bound correctly',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('IconRef.ToSoftObjectPath()') && c.includes('FStreamableDelegate::CreateUObject(this,&UMyUI::OnIconLoaded)'),
            error: 'Must supply IconRef.ToSoftObjectPath() and FStreamableDelegate::CreateUObject(this, &UMyUI::OnIconLoaded)',
            fix: 'IconRef.ToSoftObjectPath(), FStreamableDelegate::CreateUObject(this, &UMyUI::OnIconLoaded)',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_new_5_1',
        title: 'Async load with UObject delegate',
        code: {
          'Source.cpp': `void UMyUI::LoadIconAsync()
{
    UAssetManager::GetStreamableManager().RequestAsyncLoad(
        IconRef.ToSoftObjectPath(),
        FStreamableDelegate::CreateUObject(this, &UMyUI::OnIconLoaded)
    );
}

void UMyUI::OnIconLoaded()
{
    UTexture2D* LoadedTex = IconRef.Get(); // Now it's safely loaded
}`,
        },
        explanation: 'Background loading ensures the frame rate doesn\'t drop. FStreamableDelegate can bind to UObjects, raw C++ pointers, or lambdas.',
      },
    ],
  };
