import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_40: UTaskDefinition = {
    id: 'task_40',
    title: '40. Lambda Expressions',
    category: 'Stage 10: Modern C++ Features',
    objective: `# Lambda Expressions — Inline Anonymous Functions

A lambda is a temporary function defined inline. Syntax:
\`\`\`cpp
[capture](params) -> ReturnType { body }
\`\`\`

Common in Unreal for:
- Delegate binding: \`Delegate.BindLambda([this]() { ... });\`
- Sorting: \`Arr.Sort([](const FMyStruct& A, const FMyStruct& B) { return A.Score > B.Score; });\`
- Async callbacks: \`AsyncTask(ENamedThreads::GameThread, [this]() { ... });\`

Capture modes:
- \`[]\` — capture nothing
- \`[this]\` — capture \`this\` pointer (members accessible)
- \`[&]\` — capture all locals by reference
- \`[=]\` — capture all locals by value

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Declare \`auto MyLambda\` as a lambda that:
- Captures nothing \`[]\`
- Takes no parameters \`()\`
- Returns nothing
- Has an empty body (or a comment inside)
`,
    starterCode: {
      'Source.cpp': `void Practice()
{
    // TODO: Declare auto MyLambda = []() { /* body */ };
}
`,
    },
    hiddenTests: ['auto MyLambda', '[]', '()', '{'],
    successCriteria: [
      'auto MyLambda declared',
      'Lambda syntax []() { }',
    ],
    rules: [
      {
        id: 'r35_lambda',
        type: 'exercise',
        description: 'auto MyLambda = [](){};',
        evaluate: (code) => ({
          passed: condense(code).includes('autoMyLambda=[](){};'),
          error: 'Declare exactly: auto MyLambda = []() {};',
          fix: 'auto MyLambda = []() { };',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_35a',
        title: 'Basic lambda + invocation',
        code: {
          'Source.cpp': `void Practice()
{
    auto MyLambda = []()
    {
        UE_LOG(LogTemp, Log, TEXT("Lambda executed!"));
    };

    MyLambda();   // call it like a regular function
}
`,
        },
        explanation: 'Lambdas are stored as closures — objects with an operator(). auto deduces the unique compiler-generated type.',
      },
    ],
  };
