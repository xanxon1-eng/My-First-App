import { create } from 'zustand';

export interface FTrainingDocument {
  id: string;
  filePath: string;
  textBuffer: string;
  version: number;
  isDirty: boolean;
  languageKind: 'cpp' | 'header';
}

export interface FDiagnostic {
  id: string;
  severity: 'error' | 'warning' | 'info';
  category: string;
  file: string;
  line: number;
  message: string;
  explanation?: string;
  suggestedFix?: string;
}

export interface FTaskRule {
  id: string;
  type: 'compiler' | 'semantic' | 'unreal' | 'exercise' | 'behavior';
  description: string;
  evaluate: (submissionInfo: any) => boolean;
}

export interface UTaskDefinition {
  id: string;
  title: string;
  category: string;
  objective: string;
  starterCode: Record<string, string>; // filename -> code
  hiddenTests: string[];
  successCriteria: string[];
  rules: FTaskRule[];
}

export interface UTaskSession {
  taskId: string;
  attemptCount: number;
  currentSourceState: Record<string, string>;
  compileStatus: 'none' | 'compiling' | 'success' | 'failed';
  testStatus: 'none' | 'testing' | 'success' | 'failed';
  hintUsage: number;
  completionState: 'in_progress' | 'completed';
}

export interface FSemanticSnapshot {
  parsedSymbols: string[];
  types: string[];
  scopes: string[];
  diagnostics: FDiagnostic[];
  references: string[];
  includeGraph: Record<string, string[]>;
}

export interface FBuildJob {
  taskId: string;
  tempProjectPath: string;
  targetModule: string;
  buildConfiguration: string;
  commandLine: string;
  startTime: number;
  endTime?: number;
  exitCode?: number;
  outputLog: string[];
}

export interface FFeedbackItem {
  severity: 'error' | 'warning' | 'info';
  category: string;
  file?: string;
  line?: number;
  message: string;
  explanation: string;
  suggestedFix?: string;
  relatedTaskTag?: string;
}

interface TrainingState {
  currentTask: UTaskDefinition | null;
  currentSession: UTaskSession | null;
  documents: FTrainingDocument[];
  activeDocumentId: string | null;
  diagnostics: FDiagnostic[];
  consoleOutput: string[];
  isCompiling: boolean;
  isTesting: boolean;
  masteryState: Record<string, 'locked' | 'available' | 'completed'>;

  // Actions
  selectTask: (task: UTaskDefinition) => void;
  updateDocument: (id: string, text: string) => void;
  setActiveDocument: (id: string) => void;
  compileAndTest: () => Promise<void>;
  resetTask: () => void;
}

const mockRules: FTaskRule[] = [
  {
    id: 'rule_use_super',
    type: 'unreal',
    description: 'Must call Super::BeginPlay()',
    evaluate: (code: string) => code.includes('Super::BeginPlay()')
  }
];

const mockTasks: UTaskDefinition[] = [
  {
    id: 'basics_1',
    title: '1. Variables & Types',
    category: 'Stage 1: C++ Basics',
    objective: 'Declare a standard int, float, and FString variable correctly.',
    starterCode: {
      'Variables.h': 'class UVariablesDemo {\npublic:\n    // Add variables here\n};\n',
      'Variables.cpp': '#include "Variables.h"\n\n// Implement functions here\n'
    },
    hiddenTests: ['TestIntExists', 'TestFloatExists', 'TestFStringExists'],
    successCriteria: ['Must declare int', 'Must declare float', 'Must declare FString'],
    rules: [
      { id: 'has_int', type: 'semantic', description: 'Declare an int', evaluate: (code) => code.includes('int ') },
      { id: 'has_float', type: 'semantic', description: 'Declare a float', evaluate: (code) => code.includes('float ') },
      { id: 'has_fstring', type: 'unreal', description: 'Declare an FString', evaluate: (code) => code.includes('FString ') },
    ]
  },
  {
    id: 'mem_1',
    title: '1. Smart Pointers',
    category: 'Stage 2: Memory and Lifetime',
    objective: 'Use a smart pointer to create an object instead of a raw pointer to avoid memory leaks.',
    starterCode: {
      'Memory.cpp': 'void AllocateObject() {\n    // Create an object dynamically, make sure it is cleaned up automatically.\n    MyStruct* obj = new MyStruct();\n}\n'
    },
    hiddenTests: ['TestLeakDetected'],
    successCriteria: ['Must use TSharedPtr or TUniquePtr', 'Must not use raw new without delete'],
    rules: [
      { id: 'use_smart_ptr', type: 'semantic', description: 'Use TUniquePtr or TSharedPtr', evaluate: (code) => code.includes('TUniquePtr') || code.includes('TSharedPtr') || code.includes('MakeShared') || code.includes('MakeUnique') },
      { id: 'no_raw_new', type: 'exercise', description: 'Do not use raw owning pointers', evaluate: (code) => !code.includes('new ') || (code.includes('new ') && code.includes('TSharedPtr')) }
    ]
  },
  {
    id: 'oop_1',
    title: '1. Interfaces',
    category: 'Stage 3: OOP and Abstraction',
    objective: 'Use an interface instead of a direct cast.',
    starterCode: {
      'Interaction.cpp': 'void InteractWithTarget(AActor* Target) {\n    // Cast to specific class and interact\n    ASpecificDoor* Door = Cast<ASpecificDoor>(Target);\n    if (Door) {\n        Door->Open();\n    }\n}\n'
    },
    hiddenTests: ['TestInterfaceCall'],
    successCriteria: ['Must cast to IInteractable', 'Must call Execute_Interact'],
    rules: [
      { id: 'use_interface', type: 'exercise', description: 'Use an interface instead of direct cast', evaluate: (code) => !code.includes('Cast<ASpecificDoor>') && (code.includes('IInteractable') || code.includes('Execute_')) }
    ]
  },
  {
    id: 'unreal_1',
    title: '1. Actor Lifecycle',
    category: 'Stage 4: Unreal Basics',
    objective: 'Implement BeginPlay correctly and call Super::BeginPlay()',
    starterCode: {
      'MyActor.h': '#include "CoreMinimal.h"\n#include "GameFramework/Actor.h"\n#include "MyActor.generated.h"\n\nUCLASS()\nclass AMyActor : public AActor {\n    GENERATED_BODY()\npublic:\n    AMyActor();\nprotected:\n    virtual void BeginPlay() override;\n};\n',
      'MyActor.cpp': '#include "MyActor.h"\n\nAMyActor::AMyActor() {\n    PrimaryActorTick.bCanEverTick = true;\n}\n\nvoid AMyActor::BeginPlay() {\n    // Implement BeginPlay here\n}\n'
    },
    hiddenTests: [],
    successCriteria: ['Must call Super::BeginPlay()'],
    rules: mockRules
  },
  {
    id: 'gameplay_1',
    title: '1. Delegates and Events',
    category: 'Stage 5: Gameplay Patterns',
    objective: 'Broadcast an event when health reaches zero.',
    starterCode: {
      'HealthComponent.cpp': 'void UHealthComponent::TakeDamage(float Amount) {\n    Health -= Amount;\n    if (Health <= 0.0f) {\n         // Broadcast death event\n    }\n}\n'
    },
    hiddenTests: ['TestDelegateFired'],
    successCriteria: ['Must invoke delegate Broadcast method'],
    rules: [
      { id: 'broadcast_event', type: 'unreal', description: 'Broadcast the OnDeath delegate', evaluate: (code) => code.includes('Broadcast') }
    ]
  }
];

export const useTrainingCore = create<TrainingState>((set, get) => ({
  currentTask: null,
  currentSession: null,
  documents: [],
  activeDocumentId: null,
  diagnostics: [],
  consoleOutput: [],
  isCompiling: false,
  isTesting: false,
  masteryState: {
    'basics_1': 'available',
    'mem_1': 'locked',
    'oop_1': 'locked',
    'unreal_1': 'available',
    'gameplay_1': 'locked',
  },

  selectTask: (task) => {
    const docs: FTrainingDocument[] = Object.entries(task.starterCode).map(([filename, code], idx) => ({
      id: `${task.id}_${idx}`,
      filePath: filename,
      textBuffer: code,
      version: 1,
      isDirty: false,
      languageKind: filename.endsWith('.h') ? 'header' : 'cpp'
    }));

    set({ 
      currentTask: task, 
      currentSession: {
        taskId: task.id,
        attemptCount: 0,
        currentSourceState: task.starterCode,
        compileStatus: 'none',
        testStatus: 'none',
        hintUsage: 0,
        completionState: 'in_progress'
      },
      documents: docs,
      activeDocumentId: docs.length > 0 ? docs[0].id : null,
      diagnostics: [],
      consoleOutput: [`Loaded task: ${task.title}`]
    });
  },

  updateDocument: (id, text) => {
    set((state) => ({
      documents: state.documents.map(d => 
        d.id === id ? { ...d, textBuffer: text, isDirty: true, version: d.version + 1 } : d
      )
    }));
  },

  setActiveDocument: (id) => {
    set({ activeDocumentId: id });
  },

  resetTask: () => {
    const task = get().currentTask;
    if (task) {
      get().selectTask(task);
    }
  },

  compileAndTest: async () => {
    const state = get();
    if (!state.currentTask || state.isCompiling) return;

    // Increment attempt count on session
    set((s) => ({
      currentSession: s.currentSession ? { 
        ...s.currentSession, 
        attemptCount: s.currentSession.attemptCount + 1,
        compileStatus: 'compiling'
      } : null,
      isCompiling: true, 
      diagnostics: [], 
      consoleOutput: ['[Build Worker] Starting UBT Build...', '[Clangd Bridge] Analyzing semantic snapshot...'] 
    }));

    // Mock compile delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const activeDocContent = get().documents.find(d => d.filePath.endsWith('.cpp'))?.textBuffer || '';

    const newDiagnostics: FDiagnostic[] = [];
    const newLogs: string[] = ['[Build Worker] Compilation finished in 1.42s'];

    // Evaluate rules mapped to the current task
    const failedRules = state.currentTask.rules.filter(r => !r.evaluate(activeDocContent));

    if (failedRules.length > 0) {
      failedRules.forEach((rule, idx) => {
        newDiagnostics.push({
          id: `err_${idx}`,
          severity: 'error',
          category: `Layer ${rule.type === 'unreal' ? '3' : '2'}: ${rule.type}-specific rules`,
          file: 'ActiveDocument.cpp',
          line: 1, 
          message: `Rule failed: ${rule.description}`,
          explanation: `The evaluator determined that the specific rule '${rule.description}' was not satisfied by your implementation.`,
          suggestedFix: `Check the requirements for ${rule.description} again.`
        });
      });
      newLogs.push('[Evaluator] Compilation Failed! Task Rules Violated.');
    } else {
      newLogs.push('[Evaluator] Compilation Success.');
    }

    set((s) => ({ 
      currentSession: s.currentSession ? {
        ...s.currentSession,
        compileStatus: failedRules.length > 0 ? 'failed' : 'success'
      } : null,
      isCompiling: false, 
      isTesting: failedRules.length === 0, 
      diagnostics: newDiagnostics, 
      consoleOutput: [...get().consoleOutput, ...newLogs] 
    }));

    if (failedRules.length > 0) {
      return; // Stop if compile failed
    }

    // Mock testing delay
    set((s) => ({
      currentSession: s.currentSession ? { ...s.currentSession, testStatus: 'testing' } : null
    }));
    await new Promise(resolve => setTimeout(resolve, 800)); 

    set((s) => ({ 
      currentSession: s.currentSession ? { ...s.currentSession, testStatus: 'success', completionState: 'completed' } : null,
      isTesting: false, 
      consoleOutput: [...get().consoleOutput, '[Test Flow] Evaluator ran hidden tests.', '[Test Flow] All success criteria met.'],
      masteryState: s.currentTask ? { ...s.masteryState, [s.currentTask.id]: 'completed' } : s.masteryState
    }));
  }
}));

export const getMockTasks = () => mockTasks;
