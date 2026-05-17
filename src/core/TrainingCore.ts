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

export interface UTaskDefinition {
  id: string;
  title: string;
  category: string;
  objective: string;
  starterCode: Record<string, string>; // filename -> code
  hiddenTests: string[];
  successCriteria: string[];
}

interface TrainingState {
  currentTask: UTaskDefinition | null;
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
    successCriteria: ['Must declare int', 'Must declare float', 'Must declare FString']
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
    successCriteria: ['Must call Super::BeginPlay()']
  }
];

export const useTrainingCore = create<TrainingState>((set, get) => ({
  currentTask: null,
  documents: [],
  activeDocumentId: null,
  diagnostics: [],
  consoleOutput: [],
  isCompiling: false,
  isTesting: false,
  masteryState: {
    'basics_1': 'available',
    'unreal_1': 'available',
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

    set({ isCompiling: true, diagnostics: [], consoleOutput: ['[Build Worker] Starting UBT Build...', '[Clangd Bridge] Analyzing semantic snapshot...'] });

    // Mock compile delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const activeDocContent = state.documents.find(d => d.filePath.endsWith('.cpp'))?.textBuffer || '';

    // Simple mock compilation checks
    const newDiagnostics: FDiagnostic[] = [];
    const newLogs: string[] = ['[Build Worker] Compilation finished in 1.42s'];

    if (state.currentTask.id === 'unreal_1') {
      if (!activeDocContent.includes('Super::BeginPlay()')) {
        newDiagnostics.push({
          id: 'err_1',
          severity: 'error',
          category: 'Layer 3: Unreal-specific rules',
          file: 'MyActor.cpp',
          line: 7,
          message: 'Missing Super call in virtual method.',
          explanation: 'Overriding an Actor lifecycle method requires calling the parent equivalent to ensure base initialization executes.',
          suggestedFix: 'Add Super::BeginPlay(); inside your method.'
        });
        newLogs.push('[Evaluator] Compilation Failed! Task Rules Violated.');
      } else {
        newLogs.push('[Evaluator] Compilation Success.');
      }
    }

    set({ isCompiling: false, isTesting: true, diagnostics: newDiagnostics, consoleOutput: [...get().consoleOutput, ...newLogs] });

    if (newDiagnostics.length > 0) {
      set({ isTesting: false });
      return; // Stop if compile failed
    }

    await new Promise(resolve => setTimeout(resolve, 800)); // Mock testing delay
    set({ 
      isTesting: false, 
      consoleOutput: [...get().consoleOutput, '[Test Flow] Evaluator ran hidden tests.', '[Test Flow] All success criteria met.'],
      masteryState: { ...state.masteryState, [state.currentTask.id]: 'completed' }
    });
  }
}));

export const getMockTasks = () => mockTasks;
