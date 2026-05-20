import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_opt_4: UTaskDefinition = {
    id: 'task_opt_4',
    title: '51. UMG Invalidation & Slate Optimization',
    category: 'Stage 14: Algorithms & Simulation',
    objective: `# UMG UI Optimization & Invalidation

Eradicating Slate tick overhead for complex RPG HUDs. Baldur's Gate 3 features complex HUD panels showing multiple dynamic stat bars and items. By default, UMG widgets recalculate layout matrices on *every frame*, costing multiple ms on the CPU.

### Hardware Impact (Concrete Metrics)
- **CPU:** Reduces UMG layout pre-passes from 4.8ms to under 0.2ms during passive screens!
- **GPU:** +0.2ms allocation step for GPU Slate cached vertex drawings.
- **RAM:** Consumes ~18MB to store widget hierarchies in active cache panels.
- **VRAM:** +25MB to retain compiled Slate UI texture channels in VRAM cache.
- **Latency / Ping:** Eliminates layout stutter peaks, leading to stable button press response under 10ms.

### What Unreal Engine Has / Needs
✅ **Has:** \`Invalidation Box\` wrapper caching Slate drawings and skipping Tick pre-passes entirely.
❌ **Missing:** Automatic dynamic dirtying inside nested object data bindings (must manually mark widgets as dirty from C++).

## Your Task
To manually invalidate a widget (forcing it to re-draw only when health changes, rather than every frame), call \`InvalidateLayoutAndVolatility()\` on a \`UWidget\`.
In the function \`UpdateHealthDisplay\`, call that method on the provided \`HealthBarWidget\`.
`,
    starterCode: {
      'Source.cpp': `#include "Blueprint/UserWidget.h"
#include "Components/ProgressBar.h"

void UpdateHealthDisplay(UProgressBar* HealthBarWidget, float NewHealth)
{
    HealthBarWidget->SetPercent(NewHealth);

    // TODO: Force Slate to redraw this specifically and bypass frame ticking!
    // Call InvalidateLayoutAndVolatility() on HealthBarWidget.
}
`,
    },
    hiddenTests: ['InvalidateLayoutAndVolatility'],
    successCriteria: [
      'Call InvalidateLayoutAndVolatility() on the widget',
    ],
    rules: [
      {
        id: 'r_opt4_inval',
        type: 'unreal',
        description: 'Layout Invalidated manually',
        evaluate: (code) => {
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
          return {
            passed: stripped.includes('HealthBarWidget->InvalidateLayoutAndVolatility();'),
            error: 'Must call HealthBarWidget->InvalidateLayoutAndVolatility();',
            fix: 'HealthBarWidget->InvalidateLayoutAndVolatility();'
          };
        }
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_opt4',
        title: 'Manual Slate Invalidation',
        code: {
          'Source.cpp': `void UpdateHealthDisplay(UProgressBar* HealthBarWidget, float NewHealth)
{
    HealthBarWidget->SetPercent(NewHealth);
    HealthBarWidget->InvalidateLayoutAndVolatility();
}
`,
        },
        explanation: 'By using an Invalidation Box in UMG and triggering manual C++ invalidation calls ONLY when numbers change, we save massive amounts of CPU time compared to Event Tick bindings.',
      },
    ],
  };
