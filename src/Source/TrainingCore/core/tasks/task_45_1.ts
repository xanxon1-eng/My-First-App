import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_45_1: UTaskDefinition = {
    id: 'task_45_1',
    title: '45.1. Math Data Types — 2D Shallow Water Equations (SWE) Fluid Solver Math',
    category: 'Stage 11: Framework Architecture',
    objective: `# 2D Shallow Water Equations (SWE) Fluid Solver Math

In high-end open world RPGs like *Crimson Desert* or *The Witcher 3*, interactive hydrology systems (rivers, puddles, shore ripples) enhance visual immersion. Simulating waves, current vectors, and buoyancy dynamics in real-time requires the discretization of the **Shallow Water Equations (Saint-Venant continuity equations)**.

The continuity model states that the height of a fluid field cell ($H$) changes over time based on the divergence of the horizontal fluid velocity field ($u$, $v$):

$$\\frac{\\partial H}{\\partial t} + \\frac{\\partial (u D)}{\\partial x} + \\frac{\\partial (v D)}{\\partial y} = 0$$

Where:
*   $H$ is the dynamic fluid height.
*   $D$ is the local water depth ($H$ minus the underlying terrain height).
*   $u, v$ are the horizontal velocity components.

Discretizing this continuity equation on a staggered 2D finite-difference grid, the rate of change of height at coordinate $(x, y)$ is:

$$dH\\_dt = -\\frac{Depth}{CellSize} \\times (u\\_{right} - u\\_{left} + v\\_{down} - v\\_{up})$$

Using Euler integration, the new water height in the next frame is calculated as:

$$H\\_{new} = H\\_{current} + dH\\_dt \\times DeltaTime$$

---

## 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (Consumes +1.8ms Game Thread without LODs)**: Running complex 2D Jacobi-relaxed fluid solver loops on the Game Thread can saturate threads. Slicing update frequencies to a 30Hz target and utilizing camera-distance frustum LOD culling reclaims up to **-1.5ms CPU**.
*   **GPU Impact (+1.15ms on GPU)**: Compiling the wave propagation solver into Niagara dynamic GPU compute buffers completely frees the CPU. Custom HLSL screen-space depth displacement shaders (SSDM) consume minor rendering overhead.
*   **RAM Impact (+16MB allocation memory)**: Pre-allocates double-buffered height map pools.
*   **VRAM Impact (+18MB Render Target textures)**: Stores fluid displacement textures on the GPU G-Buffer to feed active material sways.
*   **Latency, Ping, Jitter Impact**: Physics-based buoyancy floating calculations are checked locally on clients, while server RPC packets are throttled down to a low 10Hz frequency to synchronize static physics coordinates.

## ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**:
    1.  **Niagara Grid 2D Collections**: Support running basic GPU compute fluid solvers directly on the graphics card.
    2.  Landscapes that support standard Material Virtual Textures (MVT) for height blending.
*   ⚠️ **What UE5 Lacks**:
    1.  **No Native C++ to Niagara Buoyancy Solver Integrations**: Out-of-the-box templates cannot easily read back localized Niagara fluid height offsets to the CPU physics thread to compute custom buoyant float metrics for rafts or dynamic skeletal characters.
    2.  **No Adaptive LOD Solver Throttling**: Grids run at constant resolution, ignoring camera distance, wasting GPU bounds.
*   🛠️ **How to Use / Workaround**:
    Write a lightweight C++ solver subsystem running on dynamic background Task threads. Distribute water grid calculations asynchronously, apply linear buoyancy lift forces on CPU capsules, and upload the computed heightfields to GPU Dynamic Textures dynamically.

---

## Your Task
Implement the core mathematical discretized height solver for a single cell on a dynamic river grid:
1. Implement the function \`float SolveWaterHeight(float CurrentHeight, float Depth, float CellSize, float DeltaTime, float ULeft, float URight, float VUp, float VDown)\`.
2. Compute the rate of fluid change: \`float dH_dt = -(Depth / CellSize) * (URight - ULeft + VDown - VUp)\`.
3. Compute and return the new height: \`CurrentHeight + dH_dt * DeltaTime\`.
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"

// TODO: Implement discretized Shallow Water Equations to solve fluid height
float SolveWaterHeight(float CurrentHeight, float Depth, float CellSize, float DeltaTime, 
                       float ULeft, float URight, float VUp, float VDown)
{
    // 1. Calculate height rate of change dH_dt based on divergence
    // dH_dt = -(Depth / CellSize) * (URight - ULeft + VDown - VUp)
    
    // 2. Return Euler integrated new height value (CurrentHeight + dH_dt * DeltaTime)
    return CurrentHeight;
}
`,
    },
    hiddenTests: ['SolveWaterHeight', 'dH_dt', 'CellSize', 'DeltaTime', 'ULeft', 'URight', 'VUp', 'VDown'],
    successCriteria: [
      'SolveWaterHeight uses fluid height divergence math',
      'Integrates height change securely with DeltaTime',
      'Correct math precedence checks applied'
    ],
    rules: [
      {
        id: 'r45_1_math',
        type: 'exercise',
        description: 'Verify Shallow Water Equations discretized cell logic',
        evaluate: (code) => {
          const c = condense(code);
          const hasDivergence = c.includes('(URight-ULeft+VDown-VUp)') || c.includes('(uright-uleft+vdown-vup)') || c.includes('(URight-ULeft)+(VDown-VUp)');
          const hasIntegration = c.includes('DeltaTime') && c.includes('CurrentHeight');

          if (hasDivergence && hasIntegration) {
             return { passed: true, error: '', fix: '' };
          }
          return {
            passed: false,
            error: 'SolveWaterHeight must compute rate of fluid height change using discretized Saint-Venant equations and integrate it dynamically via DeltaTime.',
            fix: 'float dH_dt = -(Depth / CellSize) * (URight - ULeft + VDown - VUp);\n    return CurrentHeight + dH_dt * DeltaTime;'
          };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_45_1',
        title: 'Shallow Water Grid Solver',
        explanation: 'Provides O(1) mathematical grid cell height field updates, enabling lightweight buoyancy calculations on CPU threads.',
        code: {
          'Source.cpp': `float SolveWaterHeight(float CurrentHeight, float Depth, float CellSize, float DeltaTime, 
                       float ULeft, float URight, float VUp, float VDown)
{
    float dH_dt = -(Depth / CellSize) * (URight - ULeft + VDown - VUp);
    return CurrentHeight + dH_dt * DeltaTime;
}
`
        }
      }
    ]
};
