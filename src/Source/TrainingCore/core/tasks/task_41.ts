import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_41: UTaskDefinition = {
    id: 'task_41',
    title: '41. Templates — Generic Programming',
    category: 'Stage 10: Modern C++ Features',
    objective: `# C++ Templates

Without templates, you'd write \`MaxInt(int a, int b)\`, \`MaxFloat(float a, float b)\`, \`MaxDouble(…)\` — endless duplication.

With templates, one definition works for any comparable type:
\`\`\`cpp
template <typename T>
T GetMax(T A, T B)
{
    return (A > B) ? A : B;
}

GetMax(3, 7);           // T=int → 7
GetMax(3.5f, 2.1f);     // T=float → 3.5f
\`\`\`

Unreal uses templates pervasively: \`TArray<T>\`, \`TMap<K,V>\`, \`Cast<T>()\`, \`MakeShared<T>()\`.

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Write a template function \`GetMax\` that returns the larger of two values \`A\` and \`B\` of type \`T\`.
`,
    starterCode: {
      'Source.h': `// TODO: Write template <typename T> T GetMax(T A, T B)
`,
    },
    hiddenTests: ['template', 'typename T', 'T GetMax', 'T A', 'T B'],
    successCriteria: [
      'template <typename T> prefix',
      'Function named GetMax returning T',
      'Parameters T A and T B',
    ],
    rules: [
      {
        id: 'r36_tmpl_sig',
        type: 'exercise',
        description: 'template <typename T> T GetMax(T A, T B)',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: (c.includes('template<typenameT>') || c.includes('template<classT>')) && c.includes('TGetMax(TA,TB)'),
            error: 'Signature must be: template <typename T> T GetMax(T A, T B)',
            fix: 'template <typename T>\nT GetMax(T A, T B) { return (A > B) ? A : B; }',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_36a',
        title: 'Template GetMax with ternary',
        code: {
          'Source.h': `template <typename T>
T GetMax(T A, T B)
{
    return (A > B) ? A : B;
}

// Usage:
// int32 MaxHP  = GetMax(100, 200);    // → 200
// float MaxDmg = GetMax(45.5f, 12.0f); // → 45.5f
`,
        },
        explanation: 'The compiler generates a separate function body for each unique T used. No runtime overhead compared to non-template — it\'s purely compile-time code generation.',
      },
    ],
  };
