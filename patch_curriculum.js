const fs = require('fs');
const path = './src/Source/TrainingCore/core/Curriculum.ts';
let content = fs.readFileSync(path, 'utf8');

const insertions = [
  {
    afterId: 'task_23',
    code: `  // -------------------------------------------------------------------------
  {
    id: 'task_NEW_5_1',
    title: 'NEW. Async Asset Loading — FStreamableManager',
    category: 'Stage 5: UE5 Pro Features',
    objective: \`# Async Asset Loading

Soft references prevent assets from loading instantly, avoiding memory bloat and long load times. But how do you actually load them when needed without "hitching" the game?

Using \\\`FStreamableManager\\\` allows the engine to load the asset in the background and fire a callback (delegate) when it finishes.

\\\`\\\`\\\`cpp
UAssetManager::GetStreamableManager().RequestAsyncLoad(
    IconRef.ToSoftObjectPath(),
    FStreamableDelegate::CreateUObject(this, &UMyUI::OnIconLoaded)
);
\\\`\\\`\\\`

## Your Task
Write a function \\\`LoadIconAsync()\\\` that uses \\\`RequestAsyncLoad\\\` on \\\`IconRef\\\`, binding the callback to \\\`UMyUI::OnIconLoaded\\\`.
\`,
    starterCode: {
      'Source.cpp': \`void UMyUI::LoadIconAsync()
{
    // TODO: Call RequestAsyncLoad on UAssetManager::GetStreamableManager()
    // Pass IconRef.ToSoftObjectPath() and a delegate bound to OnIconLoaded
}
\`,
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
        description: 'GetStreamableManager() called',
        evaluate: (code) => ({
          passed: code.includes('GetStreamableManager') && code.includes('RequestAsyncLoad'),
          error: 'Must use UAssetManager::GetStreamableManager().RequestAsyncLoad(...)',
          fix: 'UAssetManager::GetStreamableManager().RequestAsyncLoad(...);',
        }),
      },
      {
        id: 'r_new_5_1_path',
        type: 'unreal',
        description: 'IconRef path passed',
        evaluate: (code) => ({
          passed: code.includes('IconRef.ToSoftObjectPath()'),
          error: 'Must supply the soft object path via IconRef.ToSoftObjectPath()',
          fix: 'IconRef.ToSoftObjectPath(),',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_new_5_1',
        title: 'Async load with UObject delegate',
        code: {
          'Source.cpp': \`void UMyUI::LoadIconAsync()
{
    UAssetManager::GetStreamableManager().RequestAsyncLoad(
        IconRef.ToSoftObjectPath(),
        FStreamableDelegate::CreateUObject(this, &UMyUI::OnIconLoaded)
    );
}

void UMyUI::OnIconLoaded()
{
    UTexture2D* LoadedTex = IconRef.Get(); // Now it's safely loaded
}\`,
        },
        explanation: 'Background loading ensures the frame rate doesn\\'t drop. FStreamableDelegate can bind to UObjects, raw C++ pointers, or lambdas.',
      },
    ],
  },
  // -------------------------------------------------------------------------
  {
    id: 'task_NEW_5_2',
    title: 'NEW. Data Assets — UPrimaryDataAsset',
    category: 'Stage 5: UE5 Pro Features',
    objective: \`# UDataAsset — Data-Driven Design

Instead of hardcoding stats (Damage=10, Speed=50) entirely into Blueprints or C++, you can define a \\\`UPrimaryDataAsset\\\`. Designers then create instances of this asset in the editor to define items, weapons, or enemy classes.

\\\`\\\`\\\`cpp
UCLASS()
class UWeaponData : public UPrimaryDataAsset
{
    GENERATED_BODY()
public:
    UPROPERTY(EditDefaultsOnly)
    float Damage;
};
\\\`\\\`\\\`
Players can then simply store a \\\`TObjectPtr<UWeaponData>\\\`.

## Your Task
Declare a \\\`UWeaponData\\\` class inheriting from \\\`UPrimaryDataAsset\\\`. Add a \\\`Damage\\\` float property.
\`,
    starterCode: {
      'Source.h': \`// TODO: Declare UWeaponData inheriting from UPrimaryDataAsset with a Damage property
\`,
    },
    hiddenTests: ['UWeaponData', 'UPrimaryDataAsset', 'float Damage'],
    successCriteria: [
      'Inherit from UPrimaryDataAsset',
      'Declare float Damage',
    ],
    rules: [
      {
        id: 'r_new_5_2_class',
        type: 'unreal',
        description: 'UPrimaryDataAsset subclass',
        evaluate: (code) => ({
          passed: code.includes('class UWeaponData : public UPrimaryDataAsset'),
          error: 'Must declare class UWeaponData : public UPrimaryDataAsset',
          fix: 'class UWeaponData : public UPrimaryDataAsset',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_new_5_2',
        title: 'Minimal Data Asset',
        code: {
          'Source.h': \`UCLASS()
class UWeaponData : public UPrimaryDataAsset
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, BlueprintReadOnly)
    float Damage = 10.0f;
};
\`,
        },
        explanation: 'Data assets keep project architecture clean by decoupling logic (Actors) from configuration (Data Assets).',
      },
    ],
  },
`
  },
  {
    afterId: 'task_26',
    code: `  // -------------------------------------------------------------------------
  {
    id: 'task_NEW_6_1',
    title: 'NEW. BlueprintNativeEvent',
    category: 'Stage 6: Blueprint Integration',
    objective: \`# BlueprintNativeEvent — The Fallback Pattern

If you want a function to have a default C++ behavior, but allow Blueprint to completely override it if needed, use \\\`BlueprintNativeEvent\\\`.

In the Header:
\\\`\\\`\\\`cpp
UFUNCTION(BlueprintNativeEvent)
void Interact();
\\\`\\\`\\\`

In the CPP, you implement the \\\`_Implementation\\\` suffixed version:
\\\`\\\`\\\`cpp
void ADoor::Interact_Implementation()
{
    // Default C++ logic here
}
\\\`\\\`\\\`
Do NOT manually write the non-suffixed \\\`Interact()\\\` body; UHT generates it to route the call to Blueprint first, then fallback to your \\\`_Implementation\\\`.

## Your Task
Declare \\\`void Interact();\\\` as a \\\`BlueprintNativeEvent\\\`. Then, write the \\\`void AMyActor::Interact_Implementation()\\\` definition in the C++ file.
\`,
    starterCode: {
      'Source.h': \`class AMyActor : public AActor
{
    // TODO: Declare Interact() with BlueprintNativeEvent
};
\`,
      'Source.cpp': \`// TODO: Implement AMyActor::Interact_Implementation()

\`,
    },
    hiddenTests: ['BlueprintNativeEvent', 'Interact_Implementation'],
    successCriteria: [
      'Header has UFUNCTION(BlueprintNativeEvent) void Interact();',
      'CPP has void AMyActor::Interact_Implementation()',
    ],
    rules: [
      {
        id: 'r_new_6_1_macro',
        type: 'unreal',
        description: 'BlueprintNativeEvent used',
        evaluate: (code) => ({
          passed: code.includes('BlueprintNativeEvent') && code.includes('void Interact()'),
          error: 'Must declare void Interact(); with BlueprintNativeEvent.',
          fix: 'UFUNCTION(BlueprintNativeEvent)\\nvoid Interact();',
        }),
      },
      {
        id: 'r_new_6_1_impl',
        type: 'unreal',
        description: 'Interact_Implementation defined',
        evaluate: (code) => ({
          passed: code.includes('Interact_Implementation'),
          error: 'Must define void AMyActor::Interact_Implementation() in CPP.',
          fix: 'void AMyActor::Interact_Implementation() {}',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_new_6_1',
        title: 'Native Event Implementation',
        code: {
          'Source.h': \`class AMyActor : public AActor
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintNativeEvent, Category = "Interaction")
    void Interact();
};\`,
          'Source.cpp': \`void AMyActor::Interact_Implementation()
{
    UE_LOG(LogTemp, Log, TEXT("Default C++ Interaction"));
}\`,
        },
        explanation: 'When calling Interact() from C++, Unreal checks if Blueprint has overridden it. If so, BP runs. If not, Interact_Implementation() runs.',
      },
    ],
  },
`
  },
  {
    afterId: 'task_33',
    code: `  // -------------------------------------------------------------------------
  {
    id: 'task_NEW_9_1',
    title: 'NEW. TWeakPtr — Breaking Reference Cycles',
    category: 'Stage 9: Enterprise Architecture',
    objective: \`# TWeakPtr — Safety Without Ownership

Memory leaks in shared pointer architectures usually stem from **cyclic references** (A points to B, and B points to A). Because their reference counts can never hit 0, neither gets deleted.

\\\`TWeakPtr<T>\\\` solves this. It observes a \\\`TSharedPtr\\\` but does *not* increment its reference count.

\\\`\\\`\\\`cpp
TSharedPtr<FNode> NodeA = MakeShared<FNode>();
TWeakPtr<FNode>   SafeRef = NodeA; // Ref count stays 1

if (TSharedPtr<FNode> PinnedNode = SafeRef.Pin())
{
    // Object still exists, safe to use PinnedNode
}
\\\`\\\`\\\`

## Your Task
Inside \\\`FObserver\\\`, declare a \\\`TWeakPtr<FData>\\\` named \\\`DataRef\\\`. Then in \\\`PrintData()\\\`, try to \\\`.Pin()\\\` it and verify it's valid before using.
\`,
    starterCode: {
      'Source.cpp': \`class FObserver
{
    // TODO 1: Declare TWeakPtr<FData> DataRef;
public:
    void PrintData()
    {
        // TODO 2: Call Pin() on DataRef, check if valid, then use
    }
};
\`,
    },
    hiddenTests: ['TWeakPtr<FData>', 'DataRef.Pin()'],
    successCriteria: [
      'Declare TWeakPtr<FData> DataRef',
      'Pin it before accessing it via if (...)',
    ],
    rules: [
      {
        id: 'r_new_9_1_weak',
        type: 'exercise',
        description: 'TWeakPtr declared',
        evaluate: (code) => ({
          passed: /TWeakPtr\\s*<\\s*FData\\s*>/.test(code),
          error: 'Must declare TWeakPtr<FData> DataRef.',
          fix: 'TWeakPtr<FData> DataRef;',
        }),
      },
      {
        id: 'r_new_9_1_pin',
        type: 'exercise',
        description: 'Pin() used properly',
        evaluate: (code) => ({
          passed: code.includes('Pin()'),
          error: 'You must lock/pin a weak pointer to elevate it to a temporary shared pointer before accessing.',
          fix: 'if (TSharedPtr<FData> Pinned = DataRef.Pin()) { /* do stuff */ }',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_new_9_1',
        title: 'Proper Pinning Pattern',
        code: {
          'Source.cpp': \`class FObserver
{
    TWeakPtr<FData> DataRef;

public:
    void PrintData()
    {
        if (TSharedPtr<FData> Pinned = DataRef.Pin())
        {
            // Pinned guarantees FData stays alive during this block
            // Pinned->DoSomething();
        }
    }
};\`,
        },
        explanation: 'Pin() atomically checks if the object is alive and temporarily increments the reference count. If the object was already deleted, Pin() returns nullptr.',
      },
    ],
  },
  // -------------------------------------------------------------------------
  {
    id: 'task_NEW_9_2',
    title: 'NEW. Async Tasks — GameThread Offloading',
    category: 'Stage 9: Enterprise Architecture',
    objective: \`# AsyncTasks — Running Work in the Background

Heavy computations (pathfinding, chunk generation) cause the game to freeze if run on the main \\\`GameThread\\\`. Unreal provides \\\`AsyncTask\\\` to easily push work to background threads.

\\\`\\\`\\\`cpp
AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask, []()
{
    // Heavy work here...
    
    // Hop back to GameThread if you need to spawn actors or update UI
    AsyncTask(ENamedThreads::GameThread, []()
    {
        // Safe to modify UObjects here
    });
});
\\\`\\\`\\\`

## Your Task
Use \\\`AsyncTask\\\` to run a background lambda (\\\`ENamedThreads::AnyBackgroundThreadNormalTask\\\`). Inside the lambda, write a nested \\\`AsyncTask\\\` that hops back to \\\`ENamedThreads::GameThread\\\`.
\`,
    starterCode: {
      'Source.cpp': \`void PerformHeavyWork()
{
    // TODO: Write an AsyncTask targeting AnyBackgroundThreadNormalTask
    // TODO: Inside it, write another AsyncTask targeting GameThread
}
\`,
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
          passed: code.includes('AsyncTask(') && code.includes('AnyBackgroundThreadNormalTask'),
          error: 'Must dispatch to AnyBackgroundThreadNormalTask.',
          fix: 'AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask, []() { ... });',
        }),
      },
      {
        id: 'r_new_9_2_game',
        type: 'unreal',
        description: 'GameThread Hop',
        evaluate: (code) => ({
          passed: code.includes('GameThread'),
          error: 'Must hop back to ENamedThreads::GameThread for UI/UObject updates.',
          fix: 'AsyncTask(ENamedThreads::GameThread, []() { ... });',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_new_9_2',
        title: 'Task dispatch & GameThread resume',
        code: {
          'Source.cpp': \`void PerformHeavyWork()
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
}\`,
        },
        explanation: 'UObjects, Actors, and UMG UI elements can GENERALLY ONLY be manipulated on the GameThread. Doing background work requires this hop-back pattern.',
      },
    ],
  },
`
  }
];

for (const ins of insertions) {
  const regex = new RegExp("id:\\s*['\"]" + ins.afterId + "['\"][\\s\\S]*?^  },", "m");
  const match = content.match(regex);
  if (match) {
    const endIdx = match.index + match[0].length;
    content = content.slice(0, endIdx) + "\\n" + ins.code + content.slice(endIdx);
  } else {
    console.warn("Could not find", ins.afterId);
  }
}

let taskIndex = 1;
content = content.replace(/id:\s*['"]task_[^'"]+['"]/g, () => {
  const replacement = "id: 'task_" + taskIndex + "'";
  taskIndex++;
  return replacement;
});

taskIndex = 1;
content = content.replace(/title:\s*['"](?:NEW\.)?(?:\d+\.)?([^'"]+)['"]/g, (match, rest) => {
  const cleanTitle = rest.trim().replace(/^\\s*\\.\\s*/, "");
  const replacement = "title: '" + taskIndex + ". " + cleanTitle + "'";
  taskIndex++;
  return replacement;
});

fs.writeFileSync(path, content, 'utf8');
console.log("Success");
