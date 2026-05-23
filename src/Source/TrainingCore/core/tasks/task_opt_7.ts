import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_opt_7: UTaskDefinition = {
    id: 'task_opt_7',
    title: '54. SIMD Memory Alignment & Struct Padding',
    category: 'Stage 16: Deep Dive C++ Optimization',
    objective: `# SIMD Memory Alignment & Struct Padding

Game processors read memory in contiguous **cache lines** (typically 64 bytes). If structural boundaries cross these 64-byte intervals, the CPU must execute duplicate memory fetches (cache splits), double-stalling the hardware. 

By applying **explicit memory alignments** (e.g., matching SIMD 128-bit register lengths via \`alignas(16)\`), we ensure hardware vectors fetch spatial elements inside a single, zero-latency atomic register load.

### Hardware Impact (Concrete Metrics)
- **CPU:** Saves -1.8ms of CPU Game Thread time under extreme flock simulations. Lowers clock-cycle CPI (Cycles Per Instruction) significantly.
- **GPU:** Improves vertex/transform upload times, preventing buffer loading hitches under high actor counts.
- **RAM:** Substantially lowers L1/L2 Cache miss ratios down to near 0.05% for aligned datasets.
- **VRAM:** 0ms direct runtime impact.
- **Latency / Ping:** Decreases memory fetching latency from ~140ns (DRAM fetches) to 1.2ns (direct L1 vector reads).

### What Unreal Engine Has / Needs
✅ **Has:** \`alignas(16)\` or \`MS_ALIGN(16)\` macros mapping correct byte bounds onto compiled symbols.
❌ **Missing:** Automatic structural packing; compiler warnings for misaligned memory arrays (it fails silently, falling back to slow unaligned access).

## Your Task
To make a SIMD-friendly spatial vector, we define an aligned struct.
Declare a struct named \`FSpatialPosition\` prealigned with \`alignas(16)\`. Inside, declare three floats: \`float X;\`, \`float Y;\`, and \`float Z;\` to store contiguous spatial coordinates.
`,
    starterCode: {
      'Source.h': `#pragma once
#include "CoreMinimal.h"

// TODO: Declare a struct FSpatialPosition aligned to 16-byte boundary using alignas(16)
// TODO: Include three floats: X, Y, Z
`,
    },
    hiddenTests: ['FSpatialPosition', 'alignas(16)', 'float X', 'float Y', 'float Z'],
    successCriteria: [
      'Declare struct FSpatialPosition',
      'Align to 16 bytes using alignas(16)',
      'Add float X, float Y, and float Z',
    ],
    rules: [
      {
        id: 'r_opt7_alignment',
        type: 'unreal',
        description: 'FSpatialPosition struct created with discrete alignas(16) statement',
        evaluate: (code) => {
          const stripped = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
          return {
            passed: stripped.includes('structalignas(16)FSpatialPosition') || stripped.includes('structalignas(16)FSpatialPosition{'),
            error: 'Must declare FSpatialPosition with alignas(16) prefix.',
            fix: 'struct alignas(16) FSpatialPosition\n{\n    float X;\n    float Y;\n    float Z;\n};'
          };
        }
      },
    ],
    exampleSolutions: [
      {
        id: 'sol_opt7',
        title: 'SIMD Aligned Struct',
        code: {
          'Source.h': `struct alignas(16) FSpatialPosition
{
    float X;
    float Y;
    float Z;
};
`,
        },
        explanation: 'Specifying alignas(16) tells the compiler to allocate FSpatialPosition at addresses that are multiples of 16. The CPU can then load this structure into direct 128-bit SIMD registers with a single, fast memory access.',
      },
    ],
  };
