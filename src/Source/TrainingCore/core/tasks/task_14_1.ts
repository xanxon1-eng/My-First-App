import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_14_1: UTaskDefinition = {
    id: 'task_14_1',
    title: '14.1. Tick & DeltaTime — Load-Shedding & Tick-Slicing',
    category: 'Stage 3: Unreal Core & Data',
    objective: `# Tick Slicing & Significance Management

Ticking 1,000 active AI agents or status-effect controllers on every single frame drops system framerates by wasting valuable Game Thread CPU cycles repeating slow checks.

By applying **Tick Slicing** (or frame amortisation), we distribute expensive gameplay checks over multiple offset frames. For example, instead of updating navigation paths every frame, we do it every \`4\` frames:
- Frame 0: Update Group A
- Frame 1: Update Group B
- Frame 2: Update Group C
- Frame 3: Update Group D

A local frame counter tracks the offset index:
- \`if (FrameCounter % SliceInterval == TargetOffset)\`

### 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (-4.5ms to -9.0ms)**: Distributes heavy simulation loops uniformly across multiple frames, shaving massive spikes into flat, clean lines.
*   **GPU Impact (0.0ms directly)**: Pure CPU simulation balancing.
*   **RAM Impact (0.0ms directly)**: Zero allocations.
*   **VRAM Impact (0.0ms directly)**: Pure mathematical calculation.
*   **Latency & Ping Impact (-15ms to -30ms server response)**: Prevents server ticks from dipping below critical target rates (e.g., 30Hz), minimizing server rubberbanding.

### ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**: Significance Manager to selectively disable tick intervals on far or off-screen actors, and TickGroups to categorize frame execution order.
*   ⚠️ **What UE5 Lacks**: Native automated frame-modulo tick amortisers for Blueprint actors out-of-the-box.

## Your Task
Implement a function \`bool ShouldUpdateThisFrame(int32 FrameID, int32 Interval, int32 Offset)\` that:
1. Performs modulo mathematics: checks if the current \`FrameID\` matches the target frame slice.
2. Returns \`true\` if \`(FrameID % Interval) == Offset\`.
3. Returns \`false\` otherwise.
`,
    starterCode: {
      'Source.cpp': `bool ShouldUpdateThisFrame(int32 FrameID, int32 Interval, int32 Offset)
{
    // TODO: Write a load-shedding tick-slicing check using modulo
    
    return false;
}
`,
    },
    hiddenTests: ['FrameID % Interval', '== Offset'],
    successCriteria: [
      'Implement modulo math check',
      'Compare against Offset',
      'Return Boolean outcome'
    ],
    rules: [
      {
        id: 'r14_1_slice',
        type: 'exercise',
        description: 'Verify tick slicing logic',
        evaluate: (code) => {
          const c = condense(code);
          const ok = c.includes('(FrameID%Interval)==Offset') || c.includes('FrameID%Interval==Offset') || c.includes('frameid%interval==offset');
          return {
            passed: ok,
            error: 'You must return whether (FrameID % Interval) equals Offset.',
            fix: 'return (FrameID % Interval) == Offset;'
          };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_14_1',
        title: 'Modulo-Based Frame Amortisation',
        explanation: 'Enables massive-entity load-shedding, cutting down dynamic CPU thread overhead by spreading heavy workloads across multiple frames.',
        code: {
          'Source.cpp': `bool ShouldUpdateThisFrame(int32 FrameID, int32 Interval, int32 Offset)
{
    return (FrameID % Interval) == Offset;
}
`
        }
      }
    ]
};
