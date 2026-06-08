import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_27_2: UTaskDefinition = {
    id: 'task_27_2',
    title: '27.2. USTRUCT — Flat Flyweight Delta Serialization (SaveGame Deltas via FArchive)',
    category: 'Stage 6: Blueprint Integration',
    objective: `# Flat Flyweight Delta Serialization (SaveGame FArchive)

In dialogue-heavy, choices-packed RPGs like *Baldur's Gate 3* or *The Witcher 3*, the engine must track the states of thousands of dynamic items, chest containers, open-world doors, dynamic buffs, and quest dialogue variables.

If the engine serializes this massive state using verbose text formats (such as JSON or XML) or relies on standard reflection-based dynamic property saving, it triggers extreme performance hitches:
*   **150ms Auto-Save Stutter**: Dynamic memory allocations, string parsing, and heap allocations lock the Game Thread, creating severe visual stutters during autosave points.
*   **Save File Bloat**: Verbose text tags waste megabytes of storage on disk, slowing down read/write operations.

To completely eliminate these frame-time stutters, we can pre-allocate flat arrays of simple C++ structs (\`USTRUCT\`) and pack only modified data (deltas) directly into a binary stream using Unreal's high-speed **\`FArchive\`** serializer class.

In Unreal C++, custom binary serialization is implemented by overriding the streaming operator \`<<\`. This writes variables directly to contiguous memory or disk bytes without a single dynamic string lookup or dynamic temporary heap allocation:

\`\`\`cpp
FArchive& operator<<(FArchive& Ar, FItemRecord& Record)
{
    Ar << Record.ItemId;
    Ar << Record.Quantity;
    return Ar;
}
\`\`\`

---

## 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (Reduces Save Hitching from 150ms to <0.5ms)**: Straight binary stream operators serialize tens of thousands of fields inside CPU caches, bypassing the Game Thread's reflection and memory-allocation subsystems completely.
*   **GPU Impact (0.0ms directly)**: Prevents draw-command drop stalls that happen when the CPU locks wait-mutexes during disk writing.
*   **RAM Impact (Saves -1.5GB system RAM cache buffers)**: Bypasses string-parsing intermediate buffers, executing streaming directly to file system blocks.
*   **VRAM Impact (0.0ms directly)**: Eliminates virtual shadow map or texture stream thrashing during high IO operations.
*   **Latency, Ping, Jitter Impact**: Binary-serialized delta arrays are extremely tiny, fitting inside a single MTU network packet (under 1500 bytes) for multiplayer replication swaps.

## ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**:
    1.  **\`FArchive\` Binary Foundation**: Heavy-duty, robust native streaming class used to write variables straight to memory or disk.
    2.  **\`USaveGame\` classes**: Standard framework container to pack basic game data variables.
*   ⚠️ **What UE5 Lacks**:
    1.  **No Native Automatic Delta-Compression**: General \`SaveGame\` pipelines serialize *every* property marked in class metadata, regardless of whether it actually changed since the game booted, wasting disk IO and memory bandwidth.
    2.  **No Async Save Safety by Default**: Writing raw \`UPROPERTY\` variables asynchronously can cause race crashes if properties are edited during memory packing.
*   🛠️ **How to Use / Workaround**:
    Leverage pre-allocated structs with an explicitly defined operator \`<<\` stream writer. When autosaving triggers, copy modified structs (deltas) to a dedicated writing thread, and pipe them directly into an \`FArchive\` stream to write bytes asynchronously in background workers.

---

## Your Task
Implement binary stream serialization for an active item record state:
1. Implement the stream operator \`FArchive& operator<<(FArchive& Ar, FItemRecord& Record)\`.
2. Inside the operator, pipe \`Record.ItemId\` (int32) and \`Record.Quantity\` (int32) straight into the \`Ar\` archive.
3. Return the archive reference \`Ar\` to allow fluent chaining.
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

struct FItemRecord
{
    int32 ItemId;
    int32 Quantity;
};

// TODO: Create the FArchive operator << serializer function 
// that packs ItemId and Quantity into the binary stream.
FArchive& operator<<(FArchive& Ar, FItemRecord& Record)
{
    // Pipe ItemId and Quantity into Ar, and then return Ar
    return Ar;
}
`,
    },
    hiddenTests: ['operator<<', 'FArchive', 'FItemRecord', 'ItemId', 'Quantity', '<<'],
    successCriteria: [
      'Overloads operator<< for FArchive and FItemRecord',
      'Pipes ItemId and Quantity using streaming operator <<',
      'Returns FArchive& to maintain correct chain-safety'
    ],
    rules: [
      {
        id: 'r27_2_binary_save',
        type: 'exercise',
        description: 'Verify FArchive stream serialization operator',
        evaluate: (code) => {
          const c = condense(code);
          const hasItemId = c.includes('Ar<<Record.ItemId');
          const hasQuantity = c.includes('Ar<<Record.Quantity') || c.includes('<<Record.Quantity');
          const hasReturn = c.includes('returnAr');

          if (hasItemId && hasQuantity && hasReturn) {
             return { passed: true, error: '', fix: '' };
          }
          return {
            passed: false,
            error: 'FArchive serialization operator must pipe ItemId and Quantity into the archive, and return the archive reference.',
            fix: 'Ar << Record.ItemId;\n    Ar << Record.Quantity;\n    return Ar;'
          };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_27_2',
        title: 'Binary Stream Overload',
        explanation: 'Implements native binary delta serialization, executing raw byte mappings in CPU registers to bypass reflection overhead completely.',
        code: {
          'Source.cpp': `FArchive& operator<<(FArchive& Ar, FItemRecord& Record)
{
    Ar << Record.ItemId;
    Ar << Record.Quantity;
    return Ar;
}
`
        }
      }
    ]
};
