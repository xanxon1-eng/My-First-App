import { UTaskDefinition } from './TrainingCore';

export const embeddedTasks: UTaskDefinition[] = [
  {
    id: 'task_1',
    title: '1. Raw Variables & Primitive Bits',
    category: 'Stage 1: The Raw Metal',
    objective: `# Raw Variables & Primitive Bits
Welcome to C++. Hardware is dumb. It only knows 1s and 0s. Variables are how we give meaning to those bits. 
In C++, you must explicitly declare *what* type of memory you are allocating before you use it. 

### Why is this important?
Unlike Python or JavaScript, C++ does not guess your data types. You are manually carving out space in RAM. A boolean is 1 byte, an integer is 4 bytes, a float is 4 bytes. 

In this task, we will create some variables.
1. Declare an integer \`Health\` and set it to 100.
2. Declare a float \`Damage\` and set it to 45.5.
3. Declare a boolean \`bIsAlive\` and set it to true.
`,
    starterCode: {
      'Source.cpp': 'void Practice() {\n    // TODO: Declare Health, Damage, and bIsAlive\n    \n}\n'
    },
    hiddenTests: ['Health = 100', 'Damage = 45.5', 'bIsAlive = true'],
    successCriteria: [
      'Declare an int named Health initialized to 100',
      'Declare a float named Damage initialized to 45.5',
      'Declare a bool named bIsAlive initialized to true'
    ],
    rules: [
      {
        id: 'rule_task_1',
        type: 'exercise',
        description: 'Variables must be declared correctly.',
        evaluate: (code) => {
          const hasHealth = /int\s+Health\s*=\s*100\s*;/.test(code);
          const hasDamage = /float\s+Damage\s*=\s*45\.5f?\s*;/.test(code);
          const hasBool = /bool\s+bIsAlive\s*=\s*true\s*;/.test(code);
          if (!hasHealth) return { passed: false, error: "Missing Health integer.", fix: "int Health = 100;" };
          if (!hasDamage) return { passed: false, error: "Missing Damage float.", fix: "float Damage = 45.5f;" };
          if (!hasBool) return { passed: false, error: "Missing bIsAlive boolean.", fix: "bool bIsAlive = true;" };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_2',
    title: '2. Logic & Bit Manipulation',
    category: 'Stage 1: The Raw Metal',
    objective: `# Logic & Operations
Now that we have variables, let's mutate them. In games, logic is everything. Determining if a player has enough mana, or if they took fatal damage, requires simple math and logical operators (\`&&\` for AND, \`||\` for OR).

### Operations
You can use standard mathematical operators: \`+\`, \`-\`, \`*\`, \`/\`.
Remember that assigning a value uses \`=\`. Checking for equality uses \`==\`.

In this task:
1. Subtract \`Damage\` from \`Health\` (store the result back in \`Health\`).
2. Update \`bIsAlive\` to be true ONLY IF \`Health\` is greater than 0.
`,
    starterCode: {
      'Source.cpp': 'void Practice() {\n    int Health = 100;\n    int Damage = 45;\n    bool bIsAlive = true;\n    \n    // TODO: Apply Damage to Health\n    // TODO: Update bIsAlive based on Health > 0\n}\n'
    },
    hiddenTests: ['Health = Health - Damage', 'bIsAlive = Health > 0'],
    successCriteria: [
      'Subtract Damage from Health',
      'Update bIsAlive using a comparison (Health > 0)'
    ],
    rules: [
      {
        id: 'rule_task_2',
        type: 'exercise',
        description: 'Logic correctly implemented.',
        evaluate: (code) => {
          const hasMinus = code.includes('Health - Damage') || code.includes('Health -= Damage');
          const hasComparison = code.includes('Health > 0') || code.includes('0 < Health');
          if (!hasMinus) return { passed: false, error: "Health must be reduced by Damage.", fix: "Health -= Damage;" };
          if (!hasComparison) return { passed: false, error: "bIsAlive must check if Health > 0.", fix: "bIsAlive = Health > 0;" };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_3',
    title: '3. Scope Resolution & Namespaces',
    category: 'Stage 1: The Raw Metal',
    objective: `# Namespaces & Scope
In C++, multiple libraries might use the same name for a function. To prevent clashes, we use **namespaces**.
The standard C++ library lives in the \`std\` namespace. 
To print to the console, we use \`cout\` from the \`std\` namespace.
We write this as \`std::cout\`. The \`::\` is the **Scope Resolution Operator**.

### Your Task
1. Use \`std::cout\` to print "Hello Unreal".
2. You will need to use \`<<\` to push the string into \`std::cout\`.
`,
    starterCode: {
      'Source.cpp': '#include <iostream>\n\nvoid Practice() {\n    // TODO: Print "Hello Unreal" using std::cout\n    \n}\n'
    },
    hiddenTests: ['std::cout', '"Hello Unreal"'],
    successCriteria: [
      'Print "Hello Unreal" using std::cout'
    ],
    rules: [
      {
        id: 'rule_task_3',
        type: 'exercise',
        description: 'Print text successfully.',
        evaluate: (code) => {
          const hasCout = code.includes('std::cout');
          const hasText = code.includes('Hello Unreal');
          if (!hasCout) return { passed: false, error: "Did you use std::cout?", fix: "std::cout << \"Hello Unreal\";" };
          if (!hasText) return { passed: false, error: "Did you print 'Hello Unreal'?", fix: "Ensure exact string spelling." };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_4',
    title: '4. Memory Addresses & Raw Math',
    category: 'Stage 1: The Raw Metal',
    objective: `# Memory Addresses
A variable is just a human-readable name for a physical location in your computer's RAM. 
In C++, you can literally see what memory address the computer assigned to your variable using the **Address-Of Operator (\`&\`)**.

### Understanding Pointers (The Basics)
If \`Health\` is a variable, \`&Health\` gives us the exact hex address (e.g., \`0x7ffeefbff5a8\`) where \`Health\` lives.
This is the foundational secret to Unreal Engine's performance.

### Your Task
1. Declare an \`int\` called \`Ammo\`.
2. Extract its memory address into a new pointer variable called \`AmmoPtr\`.
*(Hint: A pointer variable type is declared like \`int* AmmoPtr = &Ammo;\`)*
`,
    starterCode: {
      'Source.cpp': 'void Practice() {\n    int Ammo = 30;\n    // TODO: Create a pointer named AmmoPtr pointing to Ammo\n    \n}\n'
    },
    hiddenTests: ['int* AmmoPtr', '&Ammo'],
    successCriteria: [
      'Create an int pointer named AmmoPtr',
      'Assign the memory address of Ammo to AmmoPtr'
    ],
    rules: [
      {
        id: 'rule_task_4',
        type: 'exercise',
        description: 'Pointer accurately created.',
        evaluate: (code) => {
          const hasPointer = code.includes('int* AmmoPtr') || code.includes('int *AmmoPtr') || code.includes('int * AmmoPtr');
          const hasAddress = code.includes('=&Ammo') || code.includes('= &Ammo');
          if (!hasPointer) return { passed: false, error: "You must declare an int pointer.", fix: "int* AmmoPtr = ..." };
          if (!hasAddress) return { passed: false, error: "You must use the & operator.", fix: "... = &Ammo;" };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_5',
    title: '5. Data Structures (std::vector vs Unreal TArray)',
    category: 'Stage 1: The Raw Metal',
    objective: `# Dynamic Arrays
When you need a list of things (like items in an inventory), you use an array. 
In standard C++, we use \`std::vector\`. In Unreal Engine, we use \`TArray\`.
Unreal wrote their own Array class (\`TArray\`) because standard C++ \`vector\` was too slow and caused fragmentation for game engines.

However, learning the syntax is identical!

### Your Task
1. Declare an \`std::vector<int>\` called \`Scores\`.
2. Use the \`.push_back()\` method to add the numbers 100, 200, and 300 to the array.
`,
    starterCode: {
      'Source.cpp': '#include <vector>\n\nvoid Practice() {\n    // TODO: Declare a vector of integers named Scores\n    // TODO: Add 100, 200, and 300 to the vector\n}\n'
    },
    hiddenTests: ['std::vector<int> Scores', 'Scores.push_back'],
    successCriteria: [
      'Declare std::vector<int> Scores',
      'Push 100, 200, and 300'
    ],
    rules: [
      {
        id: 'rule_task_5',
        type: 'exercise',
        description: 'Vector implemented correctly.',
        evaluate: (code) => {
          const hasVector = code.includes('std::vector<int> Scores');
          const hasPush = code.includes('Scores.push_back');
          if (!hasVector) return { passed: false, error: "Declare the vector correctly.", fix: "std::vector<int> Scores;" };
          if (!hasPush) return { passed: false, error: "Use push_back to add items.", fix: "Scores.push_back(100);" };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_6',
    title: '6. Unreal Macro Specifiers',
    category: 'Stage 2: Code Structure & Memory',
    objective: `# The Magic of Unreal Macros
Unreal Engine uses heavily customized macros to integrate C++ code into the Editor (Blueprints) and the automatic memory management system (Garbage Collection). 

If you just write a normal C++ variable in an Unreal class, the Editor won't see it, and worse, the Garbage Collector might delete it from RAM while you're still playing!

### Macros
- \`UPROPERTY()\` - Tells the engine to manage this variable.
- \`UFUNCTION()\` - Exposes a function to the engine.

Inside the parenthesis, you add **Specifiers**:
- \`EditAnywhere\` - Editable in the literal editor properties panel.
- \`BlueprintReadWrite\` - Can be used in Blueprints.

### Your Task
We have a variable \`Health\`. Add the \`UPROPERTY\` macro above it with \`EditAnywhere\` and \`BlueprintReadWrite\`.
`,
    starterCode: {
      'Source.h': 'class ACharacter {\n    // TODO: Add UPROPERTY macro here\n    int32 Health = 100;\n};\n'
    },
    hiddenTests: ['UPROPERTY', 'EditAnywhere', 'BlueprintReadWrite'],
    successCriteria: [
      'Add UPROPERTY macro',
      'Include EditAnywhere',
      'Include BlueprintReadWrite'
    ],
    rules: [
      {
        id: 'rule_task_6',
        type: 'exercise',
        description: 'Properly decorate with UPROPERTY',
        evaluate: (code) => {
          if (!code.includes('UPROPERTY')) return { passed: false, error: 'Missing UPROPERTY macro.' };
          if (!code.includes('EditAnywhere')) return { passed: false, error: 'Missing EditAnywhere specifier.' };
          if (!code.includes('BlueprintReadWrite')) return { passed: false, error: 'Missing BlueprintReadWrite specifier.' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_7',
    title: '7. Garbage Collection & Memory Leaks',
    category: 'Stage 2: Code Structure & Memory',
    objective: `# Handling Pointers safely
In Raw C++, when you create an object using \`new\`, you MUST call \`delete\` or the memory leaks permanently.
In Unreal, the engine has a Garbage Collector (GC). The GC scans memory every 60 seconds and deletes objects that are no longer referenced.

To let the GC know an object exists, it MUST have a \`UPROPERTY()\` macro. If you store a pointer without \`UPROPERTY()\`, the GC will aggressively delete it while you're still using it, causing the game to **CRASH**.

### Your Task
Declare an Unreal object pointer: \`UWeapon* CurrentWeapon;\`
Make sure to protect it from Garbage Collection by adding a \`UPROPERTY()\` macro above it.
`,
    starterCode: {
      'Source.h': 'class APlayer {\n    // TODO: Declare a UWeapon pointer called CurrentWeapon and protect it with UPROPERTY()\n    \n};\n'
    },
    hiddenTests: ['UPROPERTY()', 'UWeapon*', 'CurrentWeapon;'],
    successCriteria: [
      'Declare UWeapon* CurrentWeapon',
      'Add UPROPERTY() to protect it'
    ],
    rules: [
      {
        id: 'rule_task_7',
        type: 'exercise',
        description: 'Protect pointer with UPROPERTY',
        evaluate: (code) => {
          if (!code.includes('UPROPERTY()') && !code.includes('UPROPERTY(')) return { passed: false, error: 'Missing UPROPERTY macro.' };
          if (!code.includes('UWeapon*') && !code.includes('UWeapon *')) return { passed: false, error: 'Missing UWeapon* declaration.' };
          if (!code.includes('CurrentWeapon')) return { passed: false, error: 'Name the variable CurrentWeapon.' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_8',
    title: '8. Standardize Your Name (F Strings)',
    category: 'Stage 2: Code Structure & Memory',
    objective: `# String Classes in Unreal
Standard C++ uses \`std::string\`. Unreal uses its own string classes because text encoding and UI rendering are complex.
The primary string class in Unreal is \`FString\`. 

To define a literal string in Unreal, you must wrap the quotes in the \`TEXT()\` macro. This ensures the string is compiled as UTF-16, which is required for Unreal's cross-platform text system.

### Your Task
Create an \`FString\` named \`PlayerName\` and set it to \`TEXT("Commando")\`.
`,
    starterCode: {
      'Source.cpp': 'void Practice() {\n    // TODO: Declare FString PlayerName\n    \n}\n'
    },
    hiddenTests: ['FString', 'PlayerName', 'TEXT("Commando")'],
    successCriteria: [
      'Declare an FString called PlayerName',
      'Initialize it using the TEXT() macro'
    ],
    rules: [
      {
        id: 'rule_task_8',
        type: 'exercise',
        description: 'Correctly implement an FString with TEXT macro.',
        evaluate: (code) => {
          if (!code.includes('FString PlayerName')) return { passed: false, error: 'Missing FString declaration.' };
          if (!code.includes('TEXT(')) return { passed: false, error: 'Must use the TEXT() macro for the string value.' };
          if (!code.includes('"Commando"')) return { passed: false, error: 'The string value should be "Commando".' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_9',
    title: '9. Header & Source Files (.h / .cpp)',
    category: 'Stage 2: Code Structure & Memory',
    objective: `# Splitting Code
In C++, code is split into two files:
1. **Header (.h)**: The Table of Contents. It declares *what* exists (functions, variables).
2. **Source (.cpp)**: The actual novel. It contains the *implementation* (the logic) of those functions.

When implementing a function in the \`.cpp\` file, you must prefix the function name with the Class Name and scope resolution operator: \`void AMyActor::BeginPlay()\`.

### Your Task
We have a class \`AMyActor\` defined in a header. Implement the \`BeginPlay()\` function in the \`.cpp\` file.
`,
    starterCode: {
      'Source.cpp': '// AMyActor has a function called BeginPlay() defined in its header.\n// TODO: Implement AMyActor::BeginPlay()\n\n'
    },
    hiddenTests: ['AMyActor::BeginPlay', '{', '}'],
    successCriteria: [
      'Implement AMyActor::BeginPlay',
      'Ensure standard block syntax {}'
    ],
    rules: [
      {
        id: 'rule_task_9',
        type: 'exercise',
        description: 'Implement method using class scope.',
        evaluate: (code) => {
          if (!code.includes('void AMyActor::BeginPlay()')) return { passed: false, error: 'Missing void AMyActor::BeginPlay()' };
          if (!code.includes('{') || !code.includes('}')) return { passed: false, error: 'Missing function body braces {}' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_10',
    title: '10. Actor Lifecycle (BeginPlay)',
    category: 'Stage 3: Unreal Core & Data',
    objective: `# The Unreal Actor
Everything that can process logic or be placed in a Level is derived from \`AActor\`.

Every Actor has a lifecycle. The most important event is \`BeginPlay()\`.
\`BeginPlay()\` is called by the Engine the exact moment the game starts, or the moment the Actor is spawned into the world.

**CRITICAL RULE:** If you override \`BeginPlay()\`, you MUST call the parent class's version (\`Super::BeginPlay();\`), otherwise the engine will break and core initialization code will not run.

### Your Task
1. Implement \`BeginPlay()\` for \`AMyPlayer\`.
2. As the very first line of your implementation, call \`Super::BeginPlay();\`.
`,
    starterCode: {
      'Source.cpp': 'void AMyPlayer::BeginPlay() {\n    // TODO: Call Super::BeginPlay\n    \n}\n'
    },
    hiddenTests: ['Super::BeginPlay();'],
    successCriteria: [
      'Add Super::BeginPlay(); inside the method'
    ],
    rules: [
      {
        id: 'rule_task_10',
        type: 'exercise',
        description: 'Super method called.',
        evaluate: (code) => {
          if (!code.includes('Super::BeginPlay()')) return { passed: false, error: 'You MUST call Super::BeginPlay();' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_11',
    title: '11. Actor Tick (Performance Killer)',
    category: 'Stage 3: Unreal Core & Data',
    objective: `# The Tick Callback
While \`BeginPlay\` happens once, \`Tick(float DeltaTime)\` happens *every single frame*.
If your game runs at 60 FPS, Tick is called 60 times a second.

Because of this, you should **AVOID** putting heavy logic in Tick.

### DeltaTime
\`DeltaTime\` is the amount of time (in seconds) that has passed since the last frame. You use this to make movement frame-rate independent.

### Your Task
1. Implement \`Tick(float DeltaTime)\` for \`AMyActor\`.
2. Inside, add a float \`Speed = 500.0f;\`
3. Multiply \`Speed\` by \`DeltaTime\` and store it in \`DistanceMoved\`.
4. Remember to call \`Super::Tick(DeltaTime);\`!
`,
    starterCode: {
      'Source.cpp': 'void AMyActor::Tick(float DeltaTime) {\n    // TODO: Implement Tick Logic\n    \n}\n'
    },
    hiddenTests: ['Super::Tick', 'Speed * DeltaTime'],
    successCriteria: [
      'Call Super::Tick(DeltaTime)',
      'Calculate DistanceMoved = Speed * DeltaTime'
    ],
    rules: [
      {
        id: 'rule_task_11',
        type: 'exercise',
        description: 'Tick implementation correct.',
        evaluate: (code) => {
          if (!code.includes('Super::Tick(DeltaTime)')) return { passed: false, error: 'Must call Super::Tick(DeltaTime);' };
          if (!code.includes('Speed * DeltaTime')) return { passed: false, error: 'Must multiply Speed by DeltaTime.' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_12',
    title: '12. Inheritance & Polymorphism',
    category: 'Stage 3: Unreal Core & Data',
    objective: `# Class Hierarchies
C++ leverages Inheritance. A \`Car\` is a type of \`Vehicle\`. 
In Unreal, a \`ACharacter\` is a type of \`APawn\`, which is a type of \`AActor\`.

To create a new class that inherits from another in C++, we use the \`:\` syntax.

### Your Task
Create a class called \`AMonster\` that inherits publicly from \`ACharacter\`.
`,
    starterCode: {
      'Source.h': '// TODO: Create the AMonster class that inherits from ACharacter\n\n'
    },
    hiddenTests: ['class AMonster : public ACharacter', '{', '};'],
    successCriteria: [
      'Class AMonster',
      'Inherit public ACharacter',
      'Include a closing semicolon for the class definition'
    ],
    rules: [
      {
        id: 'rule_task_12',
        type: 'exercise',
        description: 'Valid inheritance syntax.',
        evaluate: (code) => {
          if (!code.includes('class AMonster')) return { passed: false, error: 'Declare class AMonster' };
          if (!code.includes(': public ACharacter') && !code.includes(':public ACharacter')) return { passed: false, error: 'Must inherit publicly from ACharacter.' };
          if (!code.includes('};')) return { passed: false, error: 'Classes must end heavily with a semicolon: };' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_13',
    title: '13. Reference vs Pointer (The Deep Truth)',
    category: 'Stage 3: Unreal Core & Data',
    objective: `# Memory Efficiency
Passing entire objects (like a massive \`Player\` object) to a function by value copies the entire object in memory. This is slow!
Instead, we pass by **Pointer (*)** or **Reference (&)**.

- **Pointer (*)**: "Here is the memory address of the object. Look it up." (Can be null)
- **Reference (&)**: "I am literally an alias for the existing object." (Never null)

### Your Task
Write a function signature \`void TakeDamage(int32& OutHealth)\` that takes an integer reference.
Subtract 10 from \`OutHealth\` inside the function.
`,
    starterCode: {
      'Source.cpp': '// TODO: Write TakeDamage function taking an int32 reference\n\n'
    },
    hiddenTests: ['void TakeDamage', 'int32&', 'OutHealth -= 10'],
    successCriteria: [
      'Implement TakeDamage',
      'Parameter is int32& OutHealth',
      'Subtract 10 from OutHealth'
    ],
    rules: [
      {
        id: 'rule_task_13',
        type: 'exercise',
        description: 'Correct use of pass-by-reference.',
        evaluate: (code) => {
          if (!code.includes('TakeDamage(int32& OutHealth)') && !code.includes('TakeDamage(int32 &OutHealth)')) return { passed: false, error: 'Function signature must contain int32& OutHealth.' };
          if (!code.includes('OutHealth -') && !code.includes('-= 10')) return { passed: false, error: 'Subtract from OutHealth.' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_14',
    title: '14. Const Correctness',
    category: 'Stage 3: Unreal Core & Data',
    objective: `# The Protective Shield
\`const\` is a promise. It tells the compiler "I promise I will not modify this variable."
This is crucial in large team projects to prevent accidental bugs.

If you pass a parameter as \`const Type&\`, you get the performance of passing a reference, but the safety of ensuring the function cannot change it.

### Your Task
Write a function \`void PrintName(const FString& Name)\`.
Try to change \`Name\` to "Hacked!" inside the function. Wait, you can't! (For this task, just extract the parameter properly and leave the body empty).
`,
    starterCode: {
      'Source.cpp': '// TODO: Write PrintName that takes a const FString reference\n\n'
    },
    hiddenTests: ['void PrintName', 'const FString&', 'Name'],
    successCriteria: [
      'Implement PrintName',
      'Parameter must be const FString& Name'
    ],
    rules: [
      {
        id: 'rule_task_14',
        type: 'exercise',
        description: 'Correct use of const reference parameter.',
        evaluate: (code) => {
          if (!code.includes('const FString& Name') && !code.includes('const FString &Name')) return { passed: false, error: 'You must use a const FString reference.' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_15',
    title: '15. Core Unreal Classes (UObject vs AActor)',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: `# The Engine Class Hierarchy
- \`UObject\`: The base class of ALL Unreal classes that use the garbage collector. They cannot be placed in the physical world. (e.g. Data assets, Inventories).
- \`AActor\`: Inherits from \`UObject\`. Actors HAVE a transform (Location, Rotation, Scale). They CAN be placed in the game world.

### Your Task
Declare a class \`UInventorySystem\` that inherits from \`UObject\`.
`,
    starterCode: {
      'Source.h': '// TODO: Declare UInventorySystem inheriting from UObject\n\n'
    },
    hiddenTests: ['class UInventorySystem : public UObject'],
    successCriteria: [
      'Create class UInventorySystem',
      'Inherit publicly from UObject'
    ],
    rules: [
      {
        id: 'rule_task_15',
        type: 'exercise',
        description: 'Class hierarchy correct.',
        evaluate: (code) => {
          if (!code.includes('class UInventorySystem')) return { passed: false, error: 'Declare UInventorySystem.' };
          if (!code.includes('public UObject')) return { passed: false, error: 'Inherit from UObject.' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_16',
    title: '16. Unreal Delegates (Events)',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: `# The Observer Pattern
Unreal uses Delegates to handle events. You define an event (e.g., \`OnHealthChanged\`), and other systems (like the UI) "bind" to it and listen.
When you "Broadcast" the event, all listening functions are executed immediately.

### Types of Delegates
- Single or Multi-cast
- Dynamic (Can be used in Blueprints) vs Static (C++ only)

We usually use \`DECLARE_DYNAMIC_MULTICAST_DELEGATE\`.

### Your Task
Declare a dynamic multicast delegate named \`FOnPlayerDiedSignature\`.
(Hint: use the macro \`DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnPlayerDiedSignature);\`)
`,
    starterCode: {
      'Source.h': '// TODO: Declare FOnPlayerDiedSignature\n\n'
    },
    hiddenTests: ['DECLARE_DYNAMIC_MULTICAST_DELEGATE', 'FOnPlayerDiedSignature'],
    successCriteria: [
      'Call the exact DECLARE_DYNAMIC_MULTICAST_DELEGATE macro',
      'Name it FOnPlayerDiedSignature'
    ],
    rules: [
      {
        id: 'rule_task_16',
        type: 'exercise',
        description: 'Delegate declared correctly.',
        evaluate: (code) => {
          if (!code.includes('DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnPlayerDiedSignature);')) return { passed: false, error: 'Use the correct macro and syntax.' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_17',
    title: '17. UENUM — Strongly Typed State Machines',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: `# Enumerations
Using integers for state (0=Idle, 1=Run, 2=Jump) is dangerous.
Enumerations bind these states to actual named words.

Unreal extends this with \`UENUM(BlueprintType)\` so Blueprints can use them as Dropdown menus!

### Your Task
Create a \`UENUM(BlueprintType)\` named \`EPlayerState\`.
Give it three values: \`Idle\`, \`Running\`, and \`Attacking\`.
Wrap the enum in the \`enum class EPlayerState : uint8\` layout.
`,
    starterCode: {
      'Source.h': '// TODO: Declare the UENUM EPlayerState\n\n'
    },
    hiddenTests: ['UENUM(BlueprintType)', 'enum class EPlayerState : uint8', 'Idle', 'Running', 'Attacking'],
    successCriteria: [
      'Use UENUM(BlueprintType)',
      'Declare enum class EPlayerState : uint8',
      'Define Idle, Running, Attacking'
    ],
    rules: [
      {
        id: 'rule_task_17',
        type: 'exercise',
        description: 'Enum correctly configured.',
        evaluate: (code) => {
          if (!code.includes('UENUM(BlueprintType)')) return { passed: false, error: 'Include UENUM(BlueprintType)' };
          if (!code.includes('enum class EPlayerState') || !code.includes('uint8')) return { passed: false, error: 'Must use enum class EPlayerState : uint8' };
          if (!code.includes('Idle') || !code.includes('Running') || !code.includes('Attacking')) return { passed: false, error: 'Include the 3 stated properties.' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_18',
    title: '18. Interface Classes (UInterface)',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: `# Decoupling Logic
If a Bullet hits a Wall, a Player, or a Destructible Barrel, how does it know to deal damage?
We could cast to 15 different classes. But that's terrible architecture.
Instead, we use an **Interface**. Any object that implements \`IDamageable\` can take damage, regardless of its specific base class.

### Your Task
Interfaces in Unreal require TWO classes for reflection to work:
1. \`UDamageable\` inheriting from \`UInterface\`
2. \`IDamageable\` class (where you actually define the methods).

Define \`class IDamageable\` with a virtual function \`void TakeHit() = 0;\`.
`,
    starterCode: {
      'Source.h': 'class UDamageable : public UInterface {};\n\n// TODO: Implement class IDamageable\n'
    },
    hiddenTests: ['class IDamageable', 'virtual void TakeHit() = 0;'],
    successCriteria: [
      'Declare class IDamageable',
      'Add pure virtual TakeHit function'
    ],
    rules: [
      {
        id: 'rule_task_18',
        type: 'exercise',
        description: 'Interface created.',
        evaluate: (code) => {
          if (!code.includes('class IDamageable')) return { passed: false, error: 'Declare IDamageable.' };
          if (!code.includes('virtual void TakeHit() = 0;')) return { passed: false, error: 'Must add the pure virtual TakeHit() method.' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_19',
    title: '19. Instanced Arrays vs TSubclassOf',
    category: 'Stage 5: UE5 Pro Features',
    objective: `# Class References vs Instantiated Objects
In Unreal, there is a massive difference between an Object and the *Blueprint Class* of that Object.

- \`UWeapon*\` - An actual physical weapon in the world. (Instance)
- \`TSubclassOf<UWeapon>\` - A reference to the Weapon Asset/Class in the content browser so we can SPAWN it later!

If your designer wants to select a template to spawn from a drop-down menu, you DO NOT use an instance pointer. You use \`TSubclassOf\`.

### Your Task
Declare a \`TSubclassOf<AActor>\` called \`SpawnTemplate\`. Add the \`UPROPERTY(EditAnywhere)\` macro so it shows as a dropdown in the editor.
`,
    starterCode: {
      'Source.h': 'class ASpawner : public AActor {\n    // TODO: Declare SpawnTemplate\n};\n'
    },
    hiddenTests: ['TSubclassOf<AActor>', 'SpawnTemplate', 'UPROPERTY(EditAnywhere)'],
    successCriteria: [
      'EditAnywhere UPROPERTY macro',
      'Use TSubclassOf<AActor>',
      'Variable named SpawnTemplate'
    ],
    rules: [
      {
        id: 'rule_task_19',
        type: 'exercise',
        description: 'SubclassOf correctly implemented.',
        evaluate: (code) => {
          if (!code.includes('UPROPERTY(EditAnywhere)')) return { passed: false, error: 'Use EditAnywhere' };
          if (!code.includes('TSubclassOf<AActor>')) return { passed: false, error: 'Use TSubclassOf<AActor>' };
          if (!code.includes('SpawnTemplate')) return { passed: false, error: 'Name it SpawnTemplate' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_20',
    title: '20. Subsystems (The Pro Singleton)',
    category: 'Stage 5: UE5 Pro Features',
    objective: `# Subsystems
Traditionally, developers used the GameMode or GameInstance to store global variables (like Player Score or Inventory). This led to bloated "God Classes" with 10,000 lines of code.

Unreal Engine 4.22 introduced **Subsystems**. Subsystems are automatically created and managed by the engine. They have lifecycles based on the Engine, the GameInstance, the World, or the LocalPlayer.

### Your Task
Create a \`UGameInstanceSubsystem\` named \`UQuestManager\`.
`,
    starterCode: {
      'Source.h': '// TODO: Create class UQuestManager that inherits from UGameInstanceSubsystem\n\n'
    },
    hiddenTests: ['class UQuestManager : public UGameInstanceSubsystem'],
    successCriteria: [
      'Name class UQuestManager',
      'Inherit from UGameInstanceSubsystem'
    ],
    rules: [
      {
        id: 'rule_task_20',
        type: 'exercise',
        description: 'Subsystem layout correct.',
        evaluate: (code) => {
          if (!code.includes('class UQuestManager')) return { passed: false, error: 'Declare UQuestManager.' };
          if (!code.includes(': public UGameInstanceSubsystem')) return { passed: false, error: 'Inherit publicly from UGameInstanceSubsystem.' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_21',
    title: '21. Blueprint Function Exposure',
    category: 'Stage 6: Integrating with Blueprints',
    objective: `# Exposing C++ to Blueprints
Because designers work in Blueprints, you need to expose your C++ mechanics.
Using the \`UFUNCTION\` macro, we can expose functions to Blueprint nodes.

- \`BlueprintCallable\`: Can be executed as a regular execution node.
- \`BlueprintPure\`: A "getter" node with no execution pins.

### Your Task
Declare a public function \`float GetCurrentHealth() const\` and make it a pure blueprint node.
Also declare \`void AddHealth(float Amount)\` and make it a callable blueprint node.
`,
    starterCode: {
      'Source.h': 'class APlayer : public ACharacter {\npublic:\n    // TODO: Declare GetCurrentHealth as BlueprintPure\n    \n    // TODO: Declare AddHealth as BlueprintCallable\n    \n};\n'
    },
    hiddenTests: ['BlueprintPure', 'BlueprintCallable'],
    successCriteria: [
      'Use UFUNCTION(BlueprintPure) for GetCurrentHealth',
      'Use UFUNCTION(BlueprintCallable) for AddHealth'
    ],
    rules: [
      {
        id: 'rule_task_21',
        type: 'exercise',
        description: 'UFUNCTION specifiers correct.',
        evaluate: (code) => {
          if (!code.includes('UFUNCTION(BlueprintPure)')) return { passed: false, error: 'Missing BlueprintPure UFUNCTION.', fix: 'UFUNCTION(BlueprintPure)' };
          if (!code.includes('UFUNCTION(BlueprintCallable)')) return { passed: false, error: 'Missing BlueprintCallable UFUNCTION.', fix: 'UFUNCTION(BlueprintCallable)' };
          if (!/float\s+GetCurrentHealth/.test(code)) return { passed: false, error: 'Missing GetCurrentHealth float function.' };
          if (!/void\s+AddHealth/.test(code)) return { passed: false, error: 'Missing AddHealth void function.' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_22',
    title: '22. Unreal Structs (USTRUCT)',
    category: 'Stage 6: Integrating with Blueprints',
    objective: `# Structs
When you have grouped data, like an item's durability, name, and weight, you should use a struct.
In Unreal, structs need the \`USTRUCT(BlueprintType)\` macro so they can be exposed to Blueprints.
Unlike \`UCLASS\`, a \`USTRUCT\` does not use the garbage collector, so it is just plain data!

We prefix structs with \`F\` (for Float, standard Unreal convention).
A struct must include \`GENERATED_BODY()\` at the very top.

### Your Task
Create a struct named \`FItemData\`.
Decorate it with \`USTRUCT(BlueprintType)\`.
Include the \`GENERATED_BODY()\` macro inside.
`,
    starterCode: {
      'Source.h': '// TODO: Declare FItemData struct with USTRUCT(BlueprintType)\n\n'
    },
    hiddenTests: ['USTRUCT(BlueprintType)', 'struct FItemData', 'GENERATED_BODY()'],
    successCriteria: [
      'Create FItemData struct',
      'Use USTRUCT(BlueprintType)',
      'Include GENERATED_BODY()'
    ],
    rules: [
      {
        id: 'rule_task_22',
        type: 'exercise',
        description: 'USTRUCT implemented correctly.',
        evaluate: (code) => {
          if (!code.includes('USTRUCT(BlueprintType)')) return { passed: false, error: 'Missing USTRUCT(BlueprintType).' };
          if (!code.includes('struct FItemData')) return { passed: false, error: 'Declare struct FItemData.' };
          if (!code.includes('GENERATED_BODY()')) return { passed: false, error: 'Struct must contain GENERATED_BODY() at the top.' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_23',
    title: '23. Debugging (Assertions)',
    category: 'Stage 7: Production Standards',
    objective: `# Assertions
Assertions are ways to test code logic in development. If an assumption fails, what happens?

- \`check(condition)\`: Stops the engine instantly (fatal crash). Use when continuing would corrupt data.
- \`ensure(condition)\`: Throws a bright red error in the log, but allows the engine to keep running.

### Your Task
You are writing a function that expects \`Health\` to be greater than 0.
Write an \`ensure(Health > 0);\` check before continuing.
`,
    starterCode: {
      'Source.cpp': 'void APlayer::Heal() {\n    // TODO: Ensure Health is greater than 0\n    \n}\n'
    },
    hiddenTests: ['ensure', 'Health > 0'],
    successCriteria: [
      'Write an ensure statement checking if Health > 0'
    ],
    rules: [
      {
        id: 'rule_task_23',
        type: 'exercise',
        description: 'Ensure statement used.',
        evaluate: (code) => {
          if (!code.includes('ensure(Health > 0)') && !code.includes('ensure( Health > 0 )')) return { passed: false, error: 'Use ensure(Health > 0);' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_24',
    title: '24. Safe Casting',
    category: 'Stage 7: Production Standards',
    objective: `# Type Casting
In C++, casting lets you treat a variable of one type as another type.
But standard C++ \`dynamic_cast\` is disabled in Unreal Engine for performance!

Unreal provides its own casting template: \`Cast<TargetType>(ObjectToCast)\`.
If the cast fails (the object wasn't actually that type), it returns \`nullptr\`.

### Your Task
You are given a generic \`AActor* HitActor\`.
Use \`Cast<AMonster>(HitActor)\` and assign it to a new pointer variable named \`MonsterTarget\`.
`,
    starterCode: {
      'Source.cpp': 'void OnHit(AActor* HitActor) {\n    // TODO: Cast HitActor to AMonster* and store it in MonsterTarget\n    \n}\n'
    },
    hiddenTests: ['AMonster*', 'Cast<AMonster>', 'HitActor'],
    successCriteria: [
      'Call Cast<AMonster>(HitActor)',
      'Assign it to a pointer named MonsterTarget'
    ],
    rules: [
      {
        id: 'rule_task_24',
        type: 'exercise',
        description: 'Correctly casted.',
        evaluate: (code) => {
          if (!code.includes('Cast<AMonster>')) return { passed: false, error: 'You must use Cast<AMonster>' };
          if (!code.includes('MonsterTarget')) return { passed: false, error: 'Name the variable MonsterTarget' };
          if (!/AMonster\s*\*\s*MonsterTarget/.test(code) && !/auto\s*MonsterTarget/.test(code)) return { passed: false, error: 'Declare MonsterTarget as an AMonster pointer.' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_25',
    title: '25. UE_LOG Logging',
    category: 'Stage 7: Production Standards',
    objective: `# Logging
Printing to the screen with \`std::cout\` doesn't work in Unreal Engine because there is no terminal attached to the final game!
You must use Unreal's built-in macro: \`UE_LOG\`.

Syntax: \`UE_LOG(LogCategory, Verbosity, TEXT("Your message here"));\`
A common default category is \`LogTemp\`, and common verbosity is \`Warning\`.

### Your Task
Write a log statement using \`UE_LOG\` on category \`LogTemp\` with verbosity \`Warning\`.
Make the message \`TEXT("Booting Sequence Initiated")\`.
`,
    starterCode: {
      'Source.cpp': 'void Practice() {\n    // TODO: Write a UE_LOG statement\n    \n}\n'
    },
    hiddenTests: ['UE_LOG', 'LogTemp', 'Warning', 'TEXT("Booting Sequence Initiated")'],
    successCriteria: [
      'Use the UE_LOG macro',
      'Category: LogTemp',
      'Verbosity: Warning',
      'Message: TEXT("Booting Sequence Initiated")'
    ],
    rules: [
      {
        id: 'rule_task_25',
        type: 'exercise',
        description: 'UE_LOG used correctly.',
        evaluate: (code) => {
          if (!code.includes('UE_LOG(')) return { passed: false, error: 'Use the UE_LOG macro.' };
          if (!code.includes('LogTemp')) return { passed: false, error: 'Category should be LogTemp.' };
          if (!code.includes('Warning')) return { passed: false, error: 'Verbosity should be Warning.' };
          if (!code.includes('TEXT("Booting Sequence Initiated")')) return { passed: false, error: 'Check string format (needs TEXT macro).' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_26',
    title: '26. Naming Conventions',
    category: 'Stage 8: Unreal Workflows',
    objective: `# Naming Conventions
Unreal Header Tool requires strict naming conventions for classes and variables. If you break them, your code won't compile!

- \`A\`: Actors (e.g. APlayer)
- \`U\`: Objects/Components (e.g. UInventoryComponent)
- \`F\`: Structs / plain data (e.g. FVector)
- \`E\`: Enums (e.g. EGameState)
- \`b\`: Booleans (e.g. bIsDead)
- \`T\`: Templates (e.g. TArray)

### Your Task
Declare a boolean variable for if the player is jumping. It MUST be named following Unreal conventions (start with 'b', so \`bIsJumping\`). Initialize it to false.
`,
    starterCode: {
      'Source.h': 'class APlayer : public ACharacter {\n    // TODO: Declare a boolean with the correct prefix for "is jumping"\n    \n};\n'
    },
    hiddenTests: ['bIsJumping = false', 'bool '],
    successCriteria: [
      'Declare a boolean',
      'Name it bIsJumping',
      'Set it to false'
    ],
    rules: [
      {
        id: 'rule_task_26',
        type: 'exercise',
        description: 'Checked for boolean prefix.',
        evaluate: (code) => {
          if (!code.includes('bool bIsJumping')) return { passed: false, error: 'Declare bool bIsJumping.', fix: 'bool bIsJumping = false;' };
          if (!code.includes('false')) return { passed: false, error: 'Must be set to false.' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_27',
    title: '27. String Types (FName vs FText)',
    category: 'Stage 8: Unreal Workflows',
    objective: `# Strings in Unreal
\`FString\` is the standard string, but Unreal uses two other strings heavily:
- \`FName\`: A super-lightweight string for identification (like Hash Maps or Tag names). They are case-insensitive and cannot be modified.
- \`FText\`: Used FOR VISUAL TEXT ONLY! If the user sees it (UI, Subtitles), it MUST be \`FText\` so the engine can localize it for different languages.

### Your Task
1. Declare an \`FName\` called \`PlayerTag\` and set it to \`"Player"\`.
2. Declare an \`FText\` called \`Greeting\` and set it to \`FText::FromString("Hello")\`. (In real games, we use \`NSLOCTEXT\`).
`,
    starterCode: {
      'Source.cpp': 'void SetupStrings() {\n    // TODO: Declare FName PlayerTag\n    \n    // TODO: Declare FText Greeting\n    \n}\n'
    },
    hiddenTests: ['FName PlayerTag', 'FText Greeting'],
    successCriteria: [
      'Create FName PlayerTag set to "Player"',
      'Create FText Greeting set to FText::FromString("Hello")'
    ],
    rules: [
      {
        id: 'rule_task_27',
        type: 'exercise',
        description: 'FName and FText implementation.',
        evaluate: (code) => {
          if (!code.includes('FName PlayerTag')) return { passed: false, error: 'Missing FName PlayerTag.' };
          if (!code.includes('"Player"')) return { passed: false, error: 'Set PlayerTag to "Player".' };
          if (!code.includes('FText Greeting')) return { passed: false, error: 'Missing FText Greeting.' };
          if (!code.includes('FText::FromString("Hello")')) return { passed: false, error: 'Set Greeting using FText::FromString("Hello").' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_28',
    title: '28. Dictionaries (TMap)',
    category: 'Stage 8: Unreal Workflows',
    objective: `# Hash Maps
When you need to look up data instantly via a Key rather than an Index, you use a Map.
Standard C++ uses \`std::map\` or \`std::unordered_map\`. Unreal uses \`TMap\`.

Example: \`TMap<FString, int32> Inventory;\`
This maps an Item Name to a Quantity.

### Your Task
Declare a \`TMap\` that links an \`FName\` (Key) to a \`float\` (Value). Name the variable \`PlayerScores\`.
Add the \`UPROPERTY()\` macro above it to protect it with garbage collection.
`,
    starterCode: {
      'Source.h': 'class AGameState : public AInfo {\n    // TODO: Declare TMap PlayerScores\n    \n};\n'
    },
    hiddenTests: ['TMap<FName, float>', 'PlayerScores', 'UPROPERTY()'],
    successCriteria: [
      'Declare TMap<FName, float> PlayerScores',
      'Add UPROPERTY()'
    ],
    rules: [
      {
        id: 'rule_task_28',
        type: 'exercise',
        description: 'TMap implemented correctly.',
        evaluate: (code) => {
          if (!code.includes('UPROPERTY()') && !code.includes('UPROPERTY(')) return { passed: false, error: 'Missing UPROPERTY.' };
          if (!code.includes('TMap<FName, float>') && !code.includes('TMap<FName,float>')) return { passed: false, error: 'Must use TMap<FName, float>.' };
          if (!code.includes('PlayerScores')) return { passed: false, error: 'Name it PlayerScores.' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_29',
    title: '29. Hard vs Soft References',
    category: 'Stage 9: Enterprise Architecture',
    objective: `# Asset Loading
If your Player class has a hard pointer to a \`UTexture2D* PlayerIcon\`, then the MOMENT the player class is loaded, the texture is loaded into RAM.
If you have an array of 500 enemies, and each has hard references to their meshes, your game will freeze on startup while 2GB of assets load instantly.

Instead, use **Soft References**. A Soft Reference only stores the *String Path* to the asset, and you load it manually when needed!

### Your Task
Declare a soft object pointer to a Texture2D called \`IconRef\`.
Syntax: \`TSoftObjectPtr<UTexture2D> IconRef;\`
`,
    starterCode: {
      'Source.h': 'class UInventoryItem : public UObject {\n    // TODO: Declare soft object reference to a UTexture2D\n    \n};\n'
    },
    hiddenTests: ['TSoftObjectPtr<UTexture2D>', 'IconRef'],
    successCriteria: [
      'Declare TSoftObjectPtr<UTexture2D>',
      'Name it IconRef'
    ],
    rules: [
      {
        id: 'rule_task_29',
        type: 'exercise',
        description: 'TSoftObjectPtr implemented correctly.',
        evaluate: (code) => {
          if (!code.includes('TSoftObjectPtr<UTexture2D>')) return { passed: false, error: 'Missing TSoftObjectPtr<UTexture2D>.' };
          if (!code.includes('IconRef')) return { passed: false, error: 'Name it IconRef.' };
          return { passed: true };
        }
      }
    ]
  },
  {
    id: 'task_30',
    title: '30. Smart Pointers (Unreal C++)',
    category: 'Stage 9: Enterprise Architecture',
    objective: `# Smart Pointers
When writing standard C++ code (outside of UObject classes that have Garbage Collection), raw pointers cause memory leaks.
You must manually \`delete\` them.

Using Smart Pointers (\`TSharedPtr\`, \`TUniquePtr\`, \`TWeakPtr\`), the pointer automatically zeroes its own memory when it goes out of scope!

### Your Task
Declare a Shared Pointer to a standard generic struct \`FMyData\`.
Syntax: \`TSharedPtr<FMyData> DataPtr;\`
`,
    starterCode: {
      'Source.h': 'struct FMyData { int Value; };\n\nclass FDataManager {\n    // TODO: Declare TSharedPtr to FMyData\n    \n};\n'
    },
    hiddenTests: ['TSharedPtr<FMyData>', 'DataPtr'],
    successCriteria: [
      'Declare TSharedPtr<FMyData>',
      'Name it DataPtr'
    ],
    rules: [
      {
        id: 'rule_task_30',
        type: 'exercise',
        description: 'TSharedPtr implemented correctly.',
        evaluate: (code) => {
          if (!code.includes('TSharedPtr<FMyData>')) return { passed: false, error: 'Missing TSharedPtr<FMyData>.' };
          if (!code.includes('DataPtr')) return { passed: false, error: 'Name it DataPtr.' };
          return { passed: true };
        }
      }
    ]
  }
];
