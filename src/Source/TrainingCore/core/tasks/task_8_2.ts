import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_8_2: UTaskDefinition = {
    id: 'task_8_2',
    title: '8.2. USTRUCT — Cache Padding & Alignment',
    category: 'Stage 2: Code Structure & Memory',
    objective: `# Cache Padding & Alignment (Deep Dive)

The Data-Oriented Design optimization guide emphasizes **Contiguous Memory**. However, simply putting a raw \`USTRUCT()\` in a \`TArray\` is not enough. You must understand **Byte Padding**.

CPUs fetch memory from RAM in 64-byte chunks called **Cache Lines**. If a struct has bad variable packing, the compiler automatically inserts invisible "padding bytes" to keep memory aligned.
\`\`\`cpp
struct FBadPacked { 
    bool A;      // 1 byte
    // 7 bytes INVISIBLE PADDING added by compiler here
    double B;    // 8 bytes
    bool C;      // 1 byte
    // 7 bytes INVISIBLE PADDING added by compiler here
}; // Total Size: 24 bytes! (only 10 bytes used)
\`\`\`

If you order members **Largest DataType to Smallest DataType**, padding is eliminated:
\`\`\`cpp
struct FGoodPacked { 
    double B;    // 8 bytes
    bool A;      // 1 byte
    bool C;      // 1 byte
}; // Total Size: 16 bytes!
\`\`\`

### 🌍 RPG Hardware Impact Matrix
*   **CPU Impact (-2.2ms per system)**: Fits twice as many items into a single L1 cache line fetch.
*   **RAM Impact (35%+ Reduction)**: Reclaims millions of bytes from large dense buffers (e.g. foliage states or pathfinding grids).

## Your Task
Fix the alignment of \`FPathNode\`. Reorder the properties from largest to smallest to eliminate compiler padding blocks.
(Pointer \`AActor*\` is 8 bytes, \`float\` is 4 bytes, \`bool\` is 1 byte).
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"
#include "PathNode.generated.h"

USTRUCT()
struct FPathNode
{
    GENERATED_BODY()

    // TODO: Re-order these variables (Largest byte size to smallest)
    bool bIsWalkable;
    AActor* Occupant;
    float Cost;
};
`,
    },
    hiddenTests: ['FPathNode', 'AActor*', 'float', 'bool'],
    successCriteria: [
      'Order variables: AActor* -> float -> bool',
    ],
    rules: [
      {
        id: 'r8_2_order',
        type: 'exercise',
        description: 'Variables ordered by size (Pointer=8, float=4, bool=1)',
        evaluate: (code) => {
          const stripped = condense(code);
          const iBool = stripped.indexOf('boolbIsWalkable;');
          const iPtr = stripped.indexOf('AActor*Occupant;');
          const iFloat = stripped.indexOf('floatCost;');
          
          if (iPtr === -1 || iFloat === -1 || iBool === -1) return { passed: false, error: 'Make sure all three variables are present.', fix: '' };
          
          return {
            passed: (iPtr < iFloat && iFloat < iBool),
            error: 'You must order them: \n1) AActor* Occupant (8 bytes)\n2) float Cost (4 bytes)\n3) bool bIsWalkable (1 byte)',
            fix: 'AActor* Occupant;\nfloat Cost;\nbool bIsWalkable;',
          };
        },
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_8_2',
        title: 'Perfectly Packed Struct',
        explanation: 'By placing the 8-byte pointer first, the 4-byte float second, and the 1-byte bool last, the struct naturally aligns perfectly in the RAM pipeline without forcing the compiler to inject any hidden dead-space zero bytes.',
        code: {
          'Source.h': `USTRUCT()
struct FPathNode
{
    GENERATED_BODY()

    AActor* Occupant; // 8 bytes
    float Cost;       // 4 bytes
    bool bIsWalkable; // 1 byte
};
`,
        },
      },
    ],
  };
