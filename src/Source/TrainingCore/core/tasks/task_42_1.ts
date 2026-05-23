import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_42_1: UTaskDefinition = {
    id: 'task_42_1',
    title: '42.1. Move Semantics — Zero-Copy Transfers via MoveTemp',
    category: 'Stage 10: Modern C++ Features',
    objective: `# Zero-Copy Memory Shifting via MoveTemp

In deep database RPG designs (such as the sprawling equipment slots and split-sack inventories of *Baldur's Gate 3* and *Path of Exile*), players constantly move clusters of items around their UI screen panels.

Each item record often contains structural strings, statistical custom modifiers, nested status effects, and alignment codes. Doing a standard assignment during a swap:
- \`FItemRecord Temp = Equipment[SlotA];\`
- This triggers a **deep copy**. The memory allocator allocates a brand new heap space for Temp, and copies *every string and array* byte-by-byte from SlotA.
- Doing dynamic deep copies in the middle of active player gameplay triggers **heap allocations** and micro-stalls, blocking game thread continuity.

To solve this, Unreal Engine implements **Move Semantics** via the \`MoveTemp()\` utility macro (Unreal's platform wrapper for \`std::move\`).

Instead of copying data, \`MoveTemp()\` **steals the pointer reference** from the source object. The memory buffer doesn't change on the hardware; only the metadata pointers swap. This results in a lightning-fast pointer shift, reducing allocations to **absolute zero**!

*Warning:* After moving a variable with \`MoveTemp()\`, the original source is left in a valid but empty state.

---

### 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-1.5ms to -3.0ms during UI operations)**: Converts slow variable allocation routines into lightning fast register updates. Eliminates heavy loops and copies.
*   **RAM Impact (Reduces dynamic fragmentation)**: Zero dynamic stack-to-heap transfers, keeping memory blocks clean and unified.
*   **GPU, VRAM, Net Impact (0.0ms Directly)**: Neutral.

---

## Your Task
Write an inventory slot modifier swapping function \`void TransferInventorySlot(TArray<FString>& SourceList, TArray<FString>& TargetList)\`:
1. Use \`MoveTemp()\` to move the content of \`SourceList\` into \`TargetList\`.
2. Do not use standard loops or normal copying operators.
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"
#include "Containers/Array.h"
#include "Containers/UnrealString.h"

void TransferInventorySlot(TArray<FString>& SourceList, TArray<FString>& TargetList)
{
    // TODO: Transfer data from SourceList to TargetList using MoveTemp to steal the reference pointers
}
`,
    },
    hiddenTests: ['TransferInventorySlot', 'MoveTemp', 'SourceList', 'TargetList'],
    successCriteria: [
      'Function named TransferInventorySlot',
      'Uses MoveTemp matching assignment',
      'TargetList receives Moved SourceList contents'
    ],
    rules: [
      {
        id: 'r42_1_movetemp',
        type: 'exercise',
        description: 'Verify MoveTemp transfer usage',
        evaluate: (code) => {
          const c = condense(code);
          return {
            passed: c.includes('TargetList=MoveTemp(SourceList)') || c.includes('targetlist=movetemp(sourcelist)'),
            error: 'You must assign TargetList with the moved representation of SourceList: TargetList = MoveTemp(SourceList);',
            fix: 'TargetList = MoveTemp(SourceList);'
          };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_42_1',
        title: 'MoveTemp Zero-Allocation Transfer',
        explanation: 'Enables zero-copy heap pointer shifting across array variables, reclaiming 100% of standard memcpy overhead cycles.',
        code: {
          'Source.cpp': `void TransferInventorySlot(TArray<FString>& SourceList, TArray<FString>& TargetList)
{
    TargetList = MoveTemp(SourceList);
}
`
        }
      }
    ]
};
