import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_7_2: UTaskDefinition = {
    id: 'task_7_2',
    title: '7.2. Loops — While Loop',
    category: 'Stage 1: The Raw Metal',
    objective: `# While Loop

A \`while\` loop is used when you want to repeat a block of code as long as a condition is true, without necessarily knowing how many times it will run beforehand.

\`\`\`cpp
int32 i = 0;
while (i < 5) 
{ 
    ++i; 
}
\`\`\`

## 🌍 Multiplayer Consideration
When writing C++ for Unreal, always ask: *Does the server need to know about this?* or *Does the client need to see this?* Ensure variables are explicitly replicated if needed, and RPCs (Remote Procedure Calls) are used to communicate state changes across the network.

## Your Task
Write a function \`int32 CalculateTicksToHeal(int32 CurrentHealth, int32 MaxHealth, int32 HealPerTick)\` that:
1. Uses a \`while\` loop to keep adding \`HealPerTick\` to \`CurrentHealth\` until \`CurrentHealth\` is greater than or equal to \`MaxHealth\`.
2. Keeps track of how many "ticks" (iterations) it took.
3. Returns the number of \`Ticks\`.
`,
    starterCode: {
      'Source.cpp': `int32 CalculateTicksToHeal(int32 CurrentHealth, int32 MaxHealth, int32 HealPerTick)
{
    int32 Ticks = 0;

    // TODO: use a while loop until CurrentHealth >= MaxHealth

    return Ticks;
}
`,
    },
    hiddenTests: ['while', 'Ticks', 'CurrentHealth'],
    successCriteria: [
      'Use a while loop checking CurrentHealth against MaxHealth',
      'Increase CurrentHealth by HealPerTick inside the loop',
      'Increment Ticks inside the loop',
    ],
    rules: [
      {
        id: 'r7_2_loop',
        type: 'exercise',
        description: 'A while loop guards MaxHealth',
        evaluate: (code) => {
          const c = condense(code);
          const ok = c.includes('while(CurrentHealth<MaxHealth)') || c.includes('while(MaxHealth>CurrentHealth)');
          return {
            passed: ok,
            error: 'Must loop while CurrentHealth < MaxHealth.',
            fix: 'while (CurrentHealth < MaxHealth) { ... }',
          };
        },
      },
      {
        id: 'r7_2_heal',
        type: 'exercise',
        description: 'CurrentHealth is increased by HealPerTick',
        evaluate: (code) => ({
          passed: condense(code).includes('CurrentHealth+=HealPerTick;') || condense(code).includes('CurrentHealth=CurrentHealth+HealPerTick;'),
          error: 'Must heal CurrentHealth inside the loop.',
          fix: 'CurrentHealth += HealPerTick;',
        }),
      },
      {
        id: 'r7_2_ticks',
        type: 'exercise',
        description: 'Ticks is incremented',
        evaluate: (code) => ({
          passed: condense(code).includes('Ticks++;') || condense(code).includes('++Ticks;') || condense(code).includes('Ticks+=1;'),
          error: 'Must increment Ticks inside the loop.',
          fix: '++Ticks;',
        }),
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_7_2a',
        title: 'Iterative Healing',
        explanation: 'We iterate as long as health is less than maximum, incrementing the tick counter each cycle.',
        code: {
          'Source.cpp': `int32 CalculateTicksToHeal(int32 CurrentHealth, int32 MaxHealth, int32 HealPerTick)
{
    int32 Ticks = 0;
    while (CurrentHealth < MaxHealth)
    {
        CurrentHealth += HealPerTick;
        ++Ticks;
    }
    return Ticks;
}
`,
        },
      },
    ],
  };
