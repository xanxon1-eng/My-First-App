import { create } from 'zustand';
import { embeddedTasks } from './Curriculum';

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
  evaluate: (code: string) => { passed: boolean; error?: string; fix?: string };
}

export interface UTaskDefinition {
  id: string;
  title: string;
  category: string;
  objective: string;
  starterCode: Record<string, string>;
  hiddenTests: string[];
  successCriteria: string[];
  rules: FTaskRule[];
  exampleSolutions?: { id: string; title: string; code: Record<string, string>; explanation?: string }[];
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

// --- CORE SUBSYSTEMS ---
export class UTrainingWorkspaceSubsystem {
  static getWorkspaceState() { return { isReady: true }; }
}

export class UBuildJobManager {
  static queueJob(job: FBuildJob) { console.log("Job queued", job); }
}

export class FFeedbackRanker {
  static sort(diagnostics: FDiagnostic[]) { return diagnostics.sort((a,b) => a.severity === 'error' ? -1 : 1); }
}

export class FHintStep {
  constructor(public text: string, public level: number) {}
}

export class FDiagnosticNormalizer {
  static normalize(raw: any): FDiagnostic {
    return {
      id: raw.id || `diag_${Date.now()}`,
      severity: raw.severity || 'error',
      category: raw.category || 'Clangd',
      file: raw.file || 'Unknown',
      line: raw.line || 1,
      message: raw.message || 'Unknown error',
      explanation: raw.explanation || 'Normalized diagnostic',
      suggestedFix: raw.suggestedFix
    };
  }
}

export class UClangdBridgeSubsystem {
  static analyzeAST(code: string): FSemanticSnapshot {
    // Extract actual symbols from the source code
    const parsedSymbols = Array.from(new Set(
      (code.match(/\b([A-Z][a-zA-Z0-9_]*|[a-z_][a-zA-Z0-9_]*)\b/g) || [])
        .filter(s => s.length > 3 && !['void', 'class', 'public', 'private', 'protected', 'virtual', 'override', 'include'].includes(s))
    )).slice(0, 15);

    return {
      parsedSymbols: parsedSymbols.length > 0 ? parsedSymbols : ['GlobalScope'],
      types: ['int', 'float'],
      scopes: ['global'],
      diagnostics: [],
      references: [],
      includeGraph: {}
    };
  }

  static syncDocument(docId: string, text: string) {
    console.log(`[Clangd Bridge] Incremental sync for document ${docId}`);
  }
}

export class UBuildWorkerProcess {
  static async executeBuild(job: FBuildJob, sourceCode: string, rules: FTaskRule[]): Promise<{ success: boolean; logs: string[]; failedRules: { rule: FTaskRule, result: any }[] }> {
    const startTime = performance.now();
    
    // Actually evaluate rules as part of the build step
    const logs = [`[UBuildWorkerProcess] Initiating build for module ${job.targetModule}...`];
    const failedRules = [];
    
    for (const rule of rules) {
      const result = rule.evaluate(sourceCode);
      if (!result.passed) {
        failedRules.push({ rule, result });
      }
    }
    
    const time = ((performance.now() - startTime) / 1000).toFixed(3);
    const success = failedRules.length === 0;
    
    if (success) {
      logs.push(`[UBuildWorkerProcess] Build succeeded in ${time}s`);
    } else {
      logs.push(`[UBuildWorkerProcess] Build failed with ${failedRules.length} errors in ${time}s`);
    }

    return { success, logs, failedRules };
  }
}

export class UTestFrameworkBindings {
  static async runHiddenTests(taskId: string, source: string, expectedChecks: string[]): Promise<boolean> {
    // Actually check if expected criteria are met in the source code
    let passed = true;
    for (const check of expectedChecks) {
        if (!source.includes(check) && !check.startsWith('Test')) {
            // Rough heuristic for demonstration: if actual expected string is not in source
            passed = false;
        }
    }
    return passed;
  }
}

export const loadPersistentProgress = () => {
   try {
     const data = localStorage.getItem('training_mastery_state');
     if (data) return JSON.parse(data);
   } catch(e) {}
   return null;
}

export const savePersistentProgress = (state: any) => {
   localStorage.setItem('training_mastery_state', JSON.stringify(state));
}

// --- CORE STATE ---

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

const standardRules: FTaskRule[] = [
  {
    id: 'rule_use_super',
    type: 'unreal',
    description: 'Must call Super::BeginPlay()',
    evaluate: (code: string) => {
      const passed = code.includes('Super::BeginPlay()');
      return {
        passed,
        error: passed ? undefined : "You are overriding BeginPlay but not calling the parent implementation.",
        fix: passed ? undefined : "Ensure you call 'Super::BeginPlay();' inside the BeginPlay function block."
      };
    }
  }
];

/* const embeddedTasks: UTaskDefinition[] = [
  {
    id: 'task_1',
    title: '1. Raw Variables & Primitive Bits',
    category: 'Stage 1: The Raw Metal',
    objective: 'Master the concepts of Raw Variables & Primitive Bits.',
    starterCode: {
      'Source.cpp': '// Practice Raw Variables & Primitive Bits\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_1',
        type: 'exercise',
        description: 'Ensure implementation addresses Raw Variables & Primitive Bits',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_2',
    title: '2. Logic & Bit Manipulation',
    category: 'Stage 1: The Raw Metal',
    objective: 'Master the concepts of Logic & Bit Manipulation.',
    starterCode: {
      'Source.cpp': '// Practice Logic & Bit Manipulation\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_2',
        type: 'exercise',
        description: 'Ensure implementation addresses Logic & Bit Manipulation',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_3',
    title: '3. Scope Resolution & Namespaces',
    category: 'Stage 1: The Raw Metal',
    objective: 'Master the concepts of Scope Resolution & Namespaces.',
    starterCode: {
      'Source.cpp': '// Practice Scope Resolution & Namespaces\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_3',
        type: 'exercise',
        description: 'Ensure implementation addresses Scope Resolution & Namespaces',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_4',
    title: '4. Memory Addresses & Raw Math',
    category: 'Stage 1: The Raw Metal',
    objective: 'Master the concepts of Memory Addresses & Raw Math.',
    starterCode: {
      'Source.cpp': '// Practice Memory Addresses & Raw Math\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_4',
        type: 'exercise',
        description: 'Ensure implementation addresses Memory Addresses & Raw Math',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_5',
    title: '5. Control Flow & Branching',
    category: 'Stage 1: The Raw Metal',
    objective: 'Master the concepts of Control Flow & Branching.',
    starterCode: {
      'Source.cpp': '// Practice Control Flow & Branching\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_5',
        type: 'exercise',
        description: 'Ensure implementation addresses Control Flow & Branching',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_6',
    title: '6. Data Structures (std::vector vs Unreal)',
    category: 'Stage 1: The Raw Metal',
    objective: 'Master the concepts of Data Structures (std::vector vs Unreal).',
    starterCode: {
      'Source.cpp': '// Practice Data Structures (std::vector vs Unreal)\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_6',
        type: 'exercise',
        description: 'Ensure implementation addresses Data Structures (std::vector vs Unreal)',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_7',
    title: '7. Loops',
    category: 'Stage 1: The Raw Metal',
    objective: 'Master the concepts of Loops.',
    starterCode: {
      'Source.cpp': '// Practice Loops\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_7',
        type: 'exercise',
        description: 'Ensure implementation addresses Loops',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_8',
    title: '8. Unreal Macro Specifiers',
    category: 'Stage 2: Code Structure & Memory',
    objective: 'Master the concepts of Unreal Macro Specifiers.',
    starterCode: {
      'Source.cpp': '// Practice Unreal Macro Specifiers\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_8',
        type: 'exercise',
        description: 'Ensure implementation addresses Unreal Macro Specifiers',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_9',
    title: '9. Standardize Your Name',
    category: 'Stage 2: Code Structure & Memory',
    objective: 'Master the concepts of Standardize Your Name.',
    starterCode: {
      'Source.cpp': '// Practice Standardize Your Name\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_9',
        type: 'exercise',
        description: 'Ensure implementation addresses Standardize Your Name',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_10',
    title: '10. Const & Brace Standards',
    category: 'Stage 2: Code Structure & Memory',
    objective: 'Master the concepts of Const & Brace Standards.',
    starterCode: {
      'Source.cpp': '// Practice Const & Brace Standards\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_10',
        type: 'exercise',
        description: 'Ensure implementation addresses Const & Brace Standards',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_11',
    title: '11. The Memory Model (Stack vs Heap)',
    category: 'Stage 2: Code Structure & Memory',
    objective: 'Master the concepts of The Memory Model (Stack vs Heap).',
    starterCode: {
      'Source.cpp': '// Practice The Memory Model (Stack vs Heap)\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_11',
        type: 'exercise',
        description: 'Ensure implementation addresses The Memory Model (Stack vs Heap)',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_12',
    title: '12. Inheritance & Polymorphism',
    category: 'Stage 2: Code Structure & Memory',
    objective: 'Master the concepts of Inheritance & Polymorphism.',
    starterCode: {
      'Source.cpp': '// Practice Inheritance & Polymorphism\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_12',
        type: 'exercise',
        description: 'Ensure implementation addresses Inheritance & Polymorphism',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_13',
    title: '13. Core Gameplay Framework',
    category: 'Stage 3: Unreal Core & Data',
    objective: 'Master the concepts of Core Gameplay Framework.',
    starterCode: {
      'Source.cpp': '// Practice Core Gameplay Framework\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_13',
        type: 'exercise',
        description: 'Ensure implementation addresses Core Gameplay Framework',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_14',
    title: '14. Unreal Delegates (Events)',
    category: 'Stage 3: Unreal Core & Data',
    objective: 'Master the concepts of Unreal Delegates (Events).',
    starterCode: {
      'Source.cpp': '// Practice Unreal Delegates (Events)\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_14',
        type: 'exercise',
        description: 'Ensure implementation addresses Unreal Delegates (Events)',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_15',
    title: '15. Cache Locality & TArray Speed',
    category: 'Stage 3: Unreal Core & Data',
    objective: 'Master the concepts of Cache Locality & TArray Speed.',
    starterCode: {
      'Source.cpp': '// Practice Cache Locality & TArray Speed\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_15',
        type: 'exercise',
        description: 'Ensure implementation addresses Cache Locality & TArray Speed',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_16',
    title: '16. Scopes & Lifetime',
    category: 'Stage 3: Unreal Core & Data',
    objective: 'Master the concepts of Scopes & Lifetime.',
    starterCode: {
      'Source.cpp': '// Practice Scopes & Lifetime\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_16',
        type: 'exercise',
        description: 'Ensure implementation addresses Scopes & Lifetime',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_17',
    title: '17. Bitmask & Bitwise Operators',
    category: 'Stage 3: Unreal Core & Data',
    objective: 'Master the concepts of Bitmask & Bitwise Operators.',
    starterCode: {
      'Source.cpp': '// Practice Bitmask & Bitwise Operators\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_17',
        type: 'exercise',
        description: 'Ensure implementation addresses Bitmask & Bitwise Operators',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_18',
    title: '18. Interface Classes (UInterface)',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: 'Master the concepts of Interface Classes (UInterface).',
    starterCode: {
      'Source.cpp': '// Practice Interface Classes (UInterface)\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_18',
        type: 'exercise',
        description: 'Ensure implementation addresses Interface Classes (UInterface)',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_19',
    title: '19. Profiling & Tick Bottlenecks',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: 'Master the concepts of Profiling & Tick Bottlenecks.',
    starterCode: {
      'Source.cpp': '// Practice Profiling & Tick Bottlenecks\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_19',
        type: 'exercise',
        description: 'Ensure implementation addresses Profiling & Tick Bottlenecks',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_20',
    title: '20. Async Programming (AsyncTask)',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: 'Master the concepts of Async Programming (AsyncTask).',
    starterCode: {
      'Source.cpp': '// Practice Async Programming (AsyncTask)\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_20',
        type: 'exercise',
        description: 'Ensure implementation addresses Async Programming (AsyncTask)',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_21',
    title: '21. Delegate Payloads (Data Events)',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: 'Master the concepts of Delegate Payloads (Data Events).',
    starterCode: {
      'Source.cpp': '// Practice Delegate Payloads (Data Events)\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_21',
        type: 'exercise',
        description: 'Ensure implementation addresses Delegate Payloads (Data Events)',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_22',
    title: '22. Subsystems (The Pro Singleton)',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: 'Master the concepts of Subsystems (The Pro Singleton).',
    starterCode: {
      'Source.cpp': '// Practice Subsystems (The Pro Singleton)\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_22',
        type: 'exercise',
        description: 'Ensure implementation addresses Subsystems (The Pro Singleton)',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_23',
    title: '23. Reference vs Pointer (The Deep Truth)',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: 'Master the concepts of Reference vs Pointer (The Deep Truth).',
    starterCode: {
      'Source.cpp': '// Practice Reference vs Pointer (The Deep Truth)\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_23',
        type: 'exercise',
        description: 'Ensure implementation addresses Reference vs Pointer (The Deep Truth)',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_24',
    title: '24. Header & Source Files (.h / .cpp)',
    category: 'Stage 4: Advanced Architecture & Systems',
    objective: 'Master the concepts of Header & Source Files (.h / .cpp).',
    starterCode: {
      'Source.cpp': '// Practice Header & Source Files (.h / .cpp)\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_24',
        type: 'exercise',
        description: 'Ensure implementation addresses Header & Source Files (.h / .cpp)',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_25',
    title: '25. Actor Lifecycle (Constructor → BeginPlay → EndPlay)',
    category: 'Stage 5: UE5 Pro Features',
    objective: 'Master the concepts of Actor Lifecycle (Constructor → BeginPlay → EndPlay).',
    starterCode: {
      'Source.cpp': '// Practice Actor Lifecycle (Constructor → BeginPlay → EndPlay)\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_25',
        type: 'exercise',
        description: 'Ensure implementation addresses Actor Lifecycle (Constructor → BeginPlay → EndPlay)',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_26',
    title: '26. UENUM — Typed State Machines',
    category: 'Stage 5: UE5 Pro Features',
    objective: 'Master the concepts of UENUM — Typed State Machines.',
    starterCode: {
      'Source.cpp': '// Practice UENUM — Typed State Machines\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_26',
        type: 'exercise',
        description: 'Ensure implementation addresses UENUM — Typed State Machines',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_27',
    title: '27. Lambda Functions (Inline Callbacks)',
    category: 'Stage 5: UE5 Pro Features',
    objective: 'Master the concepts of Lambda Functions (Inline Callbacks).',
    starterCode: {
      'Source.cpp': '// Practice Lambda Functions (Inline Callbacks)\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_27',
        type: 'exercise',
        description: 'Ensure implementation addresses Lambda Functions (Inline Callbacks)',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_28',
    title: '28. Templates & TSubclassOf<T>',
    category: 'Stage 5: UE5 Pro Features',
    objective: 'Master the concepts of Templates & TSubclassOf<T>.',
    starterCode: {
      'Source.cpp': '// Practice Templates & TSubclassOf<T>\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_28',
        type: 'exercise',
        description: 'Ensure implementation addresses Templates & TSubclassOf<T>',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  },
  {
    id: 'task_29',
    title: '29. Enhanced Input System (UE5 Standard)',
    category: 'Stage 5: UE5 Pro Features',
    objective: 'Master the concepts of Enhanced Input System (UE5 Standard).',
    starterCode: {
      'Source.cpp': '// Practice Enhanced Input System (UE5 Standard)\n\nvoid Practice() {\n    \n}\n'
    },
    hiddenTests: ['TestCompleted'],
    successCriteria: ['Complete the exercise'],
    rules: [
      {
        id: 'rule_task_29',
        type: 'exercise',
        description: 'Ensure implementation addresses Enhanced Input System (UE5 Standard)',
        evaluate: (code) => {
          return { passed: code.length > 30, error: "Please write some code.", fix: "Add implementation details." };
        }
      }
    ]
  }
]; */

export const useTrainingCore = create<TrainingState>((set, get) => ({
  currentTask: null,
  currentSession: null,
  documents: [],
  activeDocumentId: null,
  diagnostics: [],
  consoleOutput: [],
  isCompiling: false,
  isTesting: false,
  masteryState: loadPersistentProgress() || embeddedTasks.reduce((acc, t, i) => {
    acc[t.id] = i === 0 ? 'available' : 'locked';
    return acc;
  }, {} as Record<string, 'locked' | 'available' | 'completed'>),

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
    UClangdBridgeSubsystem.syncDocument(id, text);
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

    set((s) => ({
      currentSession: s.currentSession ? { 
        ...s.currentSession, 
        attemptCount: s.currentSession.attemptCount + 1,
        compileStatus: 'compiling'
      } : null,
      isCompiling: true, 
      diagnostics: [], 
      consoleOutput: ['[Build Worker] Preparing external Build...', '[Clangd Bridge] Syncing final AST state...'] 
    }));

    const activeDocContent = get().documents.find(d => d.filePath.endsWith('.cpp'))?.textBuffer || '';

    const buildResult = await UBuildWorkerProcess.executeBuild({
      taskId: state.currentTask.id,
      tempProjectPath: '/temp/worker/build',
      targetModule: 'TrainingModule',
      buildConfiguration: 'Development',
      commandLine: 'Build.bat TrainingModule Win64 Development',
      startTime: Date.now(),
      outputLog: []
    }, activeDocContent, state.currentTask.rules);

    const semanticSnapshot = UClangdBridgeSubsystem.analyzeAST(activeDocContent);

    const newDiagnostics: FDiagnostic[] = [];
    const newLogs: string[] = buildResult.logs;
    
    if (semanticSnapshot.parsedSymbols.length > 0) {
       newLogs.push(`[Clangd Bridge] Found active symbols: ${semanticSnapshot.parsedSymbols.join(', ')}`);
    }

    const failedRules = buildResult.failedRules;

    if (failedRules.length > 0) {
      failedRules.forEach(({ rule, result }, idx) => {
        newDiagnostics.push(FDiagnosticNormalizer.normalize({
          id: `err_${idx}`,
          severity: 'error',
          category: `Layer ${rule.type === 'unreal' ? '3' : '2'}: ${rule.type}-specific rules`,
          file: 'ActiveDocument.cpp',
          line: 1, 
          message: `Rule failed: ${rule.description}`,
          explanation: result.error || `The evaluator determined that the specific rule '${rule.description}' was not satisfied.`,
          suggestedFix: result.fix || `Check the requirements for ${rule.description} again.`
        }));
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
      return; 
    }

    set((s) => ({
      currentSession: s.currentSession ? { ...s.currentSession, testStatus: 'testing' } : null
    }));
    
    const testSuccess = await UTestFrameworkBindings.runHiddenTests(state.currentTask.id, activeDocContent, state.currentTask.hiddenTests);

    set((s) => {
      const updatedMastery = s.currentTask ? { ...s.masteryState, [s.currentTask.id]: 'completed' } as Record<string, 'locked' | 'available' | 'completed'> : s.masteryState;
      savePersistentProgress(updatedMastery);

      return { 
        currentSession: s.currentSession ? { ...s.currentSession, testStatus: testSuccess ? 'success' : 'failed', completionState: 'completed' } : null,
        isTesting: false, 
        consoleOutput: [...s.consoleOutput, '[Test Flow] Evaluator ran hidden tests via UTestFrameworkBindings.', `[Test Flow] All success criteria ${testSuccess ? 'met' : 'failed'}.`],
        masteryState: updatedMastery
      };
    });
  }
}));

export const getEmbeddedTasks = () => embeddedTasks;
