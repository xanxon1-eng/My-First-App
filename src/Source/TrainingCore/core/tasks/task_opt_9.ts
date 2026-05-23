import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_opt_9: UTaskDefinition = {
    id: 'task_opt_9',
    title: '56. Custom FArchive Serialization & Binary Packing',
    category: 'Stage 16: Deep Dive C++ Optimization',
    objective: `# Custom FArchive Serialization & Binary Packing

Writing save-games or state inventories (like Witcher 3 or Baldur\'s Gate 3 loot structures) into standard text formats like JSON or XML takes huge CPU cycles in string parsing and causes massive heap memory fragmentation.

In Unreal C++, dynamic variables serialize directly to binary using \`FArchive\` streaming arrays. Overloading the \`<<\` dynamic operator lets us stream packed structs directly in/out of memory-mapped binary files, delivering save/load processes with zero string allocation spikes.

### Hardware Impact (Concrete Metrics)
- **CPU:** Reduces save-game construction by -8.5ms CPU Game Thread time. Eliminates long garbage collection stalls.
- **GPU:** Avoids CPU draw thread freezes, resolving camera pans and micro-hitches during saving checkpoints.
- **RAM:** Eradicates heavy FString storage allocations, saving hundreds of megabytes during loading loops.
- **VRAM:** No direct impact.
- **Latency / Ping:** Speeds up disk save serialization speeds from seconds to microseconds.

### What Unreal Engine Has / Needs
✅ **Has:** Unified \`FArchive\` serialization stream architecture. The single operator \`Ar << Variable;\` handles BOTH reading and writing depending on the active archive state!
❌ **Missing:** Automatic binary compaction (redundant variables compile unless the developer manually implements bitmasks or field serializers).

## Your Task
Let's write a binary serializable loot record.
Declare a structure named \`FLootInventoryRecord\` containing:
1. Two public variables: \`int32 ItemID;\` and \`int32 Count;\`
2. Override the friend operator \`<<\` for streaming into an archive:
\`friend FArchive& operator<<(FArchive& Ar, FLootInventoryRecord& Record)\`
Inside, serialize the two fields by inserting them into \`Ar\` sequentially (\`Ar << Record.ItemID;\` and \`Ar << Record.Count;\`), then return \`Ar;\`.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "Serialization/Archive.h"

struct FLootInventoryRecord
{
    int32 ItemID;
    int32 Count;

    // TODO: Declare friend FArchive& operator<<(FArchive& Ar, FLootInventoryRecord& Record)
    // TODO: Inside, stream Record.ItemID and Record.Count, then return Ar
};
`,
    },
    hiddenTests: ['FLootInventoryRecord', 'ItemID', 'Count', 'friend FArchive& operator<<', 'Ar << Record.ItemID', 'Ar << Record.Count'],
    successCriteria: [
      'Create FLootInventoryRecord struct',
      'Override friend FArchive& operator<<',
      'Serialize Record.ItemID and Record.Count',
      'Return FArchive reference Ar',
    ],
    rules: [
      {
        id: 'r_opt9_serialization',
        type: 'unreal',
        description: 'Binary FArchive operator override configured seamlessly',
        evaluate: (code) => {
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
          const hasOp = stripped.includes('friendFArchive&operator<<(FArchive&Ar,FLootInventoryRecord&Record)');
          const hasItemID = stripped.includes('Ar<<Record.ItemID');
          const hasCount = stripped.includes('Ar<<Record.Count');
          const hasReturn = stripped.includes('returnAr');
          
          if (!hasOp) return { passed: false, error: 'Must declare friend FArchive& operator<<(FArchive& Ar, FLootInventoryRecord& Record) correctly.', fix: 'friend FArchive& operator<<(FArchive& Ar, FLootInventoryRecord& Record)' };
          if (!hasItemID || !hasCount) return { passed: false, error: 'Must stream ItemID and Count inside the archive using the << operator.', fix: 'Ar << Record.ItemID;\nAr << Record.Count;' };
          if (!hasReturn) return { passed: false, error: 'Must return the archive reference Ar.', fix: 'return Ar;' };
          
          return { passed: true, error: '', fix: '' };
        }
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_opt9',
        title: 'Archive Serialization',
        code: {
          'Source.h': `struct FLootInventoryRecord
{
    int32 ItemID;
    int32 Count;

    friend FArchive& operator<<(FArchive& Ar, FLootInventoryRecord& Record)
    {
        Ar << Record.ItemID;
        Ar << Record.Count;
        return Ar;
    }
};
`,
        },
        explanation: 'The Unified << syntax evaluates whether Ar is loading or saving at runtime and handles bitwise reads/writes transparently, resulting in extremely fast binary serialization onto disks.',
      },
    ],
  };
