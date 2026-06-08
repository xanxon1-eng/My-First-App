import { UTaskDefinition } from '../TrainingCore';
import { stripComments, condense, hasStr, hasRegex } from '../Curriculum';

export const task_12_2: UTaskDefinition = {
    id: 'task_12_2',
    title: '12.2. Inheritance & Polymorphism — Quest DAG Hierarchy Dependency Tracing & Cycle Validation',
    category: 'Stage 2: Code Structure & Memory',
    objective: `# Quest DAG Hierarchy Tracing & Circle G-Buffer Validation

In open-world RPGs with deeply branching storylines (like *Baldur's Gate 3* or *The Witcher 3*), quest progression is modeled as a **Directed Acyclic Graph (DAG)**. Each quest stage represents a node, and the prerequisites (e.g. "Kill the Gryphon before talking to the Baron") are directed edges.

If designers accidentally introduce a circular dependency (e.g. Quest A requires Quest B, which requires Quest C, which requires Quest A), the quest engine will enter a recursive evaluation loop, locks up, and freezes the Game Thread CPU completely, crashing the client.

To ensure game-state safety, we implement a **Topo-Tracer & Cycle Validator** in C++ that checks narrative graph safety during initialization or boot-time using **Depth First Search (DFS)** graph traversal coloring rules:
*   **Visited Set**: Keeps track of nodes that have been fully analyzed and are verified as loop-free.
*   **Recursion Stack Set**: Holds nodes in the current traversal path. If we hit a node that is *already* in the recursion stack, we have detected a circular dependency loop (cycle)!

---

## 🌍 RPG Hardware Impact Matrix (Concrete Metrics)
*   **CPU Impact (Eliminates -25ms GC/Game Thread freeze spikes)**: Validates complex narrative graphs containing 500+ storylines in under 0.8ms during boot, preventing game-state lockups during gameplay.
*   **GPU Impact (0.0ms directly)**: Prevents graphics processing pauses due to main-thread state lock stutters.
*   **RAM Impact (+4MB Allocation footprint)**: Pre-allocates topological structures.
*   **VRAM Impact (0.0ms directly)**: No rendering resource allocations.
*   **Latency, Ping, Jitter Impact**: Replicating a single verified linear integer ID of the active quest node is orders of magnitude lighter than streaming nested lists of resolved sub-conditions.

## ⚡ Unreal Engine 5.5 Capabilities Benchmark
*   📊 **What UE5 Has**:
    1.  **\`TMap\` and \`TArray\` Structs**: Contiguous pre-allocated associative elements for graph mappings.
    2.  \`UGameInstanceSubsystem\`: Global singleton instance to run graph-validation routines on boot.
*   ⚠️ **What UE5 Lacks**:
    1.  **No Native Story DAG Validator**: Standard quest editors and data assets are completely unstructured. There are no built-in protection blocks against circular dependency deadlocks inside quest structures.
    2.  **No Event-Driven Topo-Checking**: Standard blueprints enforce manual nested graph checking, leading to O(N^2) evaluation loops.
*   🛠️ **How to Use / Workaround**:
    Write a lightweight C++ validation subsystem that runs circular dependency checks when a level loads. If a cycle is detected, immediately write a fatal log entry to the console to halt execution, informing the narrative designer exactly where the cycle is.

---

## Your Task
Implement a recursive circular-dependency (cycle) detection algorithm for quest nodes:
1. Implement the function \`bool DetectQuestCycle(int32 NodeId, const TMap<int32, TArray<int32>>& QuestGraph, TSet<int32>& Visited, TSet<int32>& RecStack)\`.
2. Check if \`RecStack.Contains(NodeId)\`. If yes, a cycle is detected, return \`true\`.
3. Check if \`Visited.Contains(NodeId)\`. If yes, this node has already been safely checked, return \`false\`.
4. Add the current \`NodeId\` to both \`Visited\` and \`RecStack\`.
5. If \`QuestGraph.Contains(NodeId)\`, iterate through its prerequisites:
   - For each neighbor, recursively call \`DetectQuestCycle(Neighbor, QuestGraph, Visited, RecStack)\`.
   - If that call returns \`true\`, propagate \`true\` upwards immediately.
6. Before returning \`false\`, remove the current \`NodeId\` from \`RecStack\` (backtracking).
`,
    starterCode: {
      'Source.cpp': `#include "CoreMinimal.h"
#include "Containers/Map.h"
#include "Containers/Array.h"
#include "Containers/Set.h"

// TODO: Implement recursive Depth First Search (DFS) for cycle detection
bool DetectQuestCycle(int32 NodeId, const TMap<int32, TArray<int32>>& QuestGraph, 
                      TSet<int32>& Visited, TSet<int32>& RecStack)
{
    // 1. If currently in recursion path (RecStack), cycle found -> return true
    
    // 2. If already fully evaluated (Visited), skip -> return false
    
    // 3. Mark NodeId in both Visited and RecStack
    
    // 4. Recurse into neighbors inside QuestGraph if it Contains(NodeId)
    
    // 5. Backtrack: remove from RecStack, and return false
    return false;
}
`,
    },
    hiddenTests: ['DetectQuestCycle', 'RecStack.Contains', 'Visited.Contains', 'RecStack.Add', 'Visited.Add', 'RecStack.Remove', 'Contains(NodeId)'],
    successCriteria: [
      'DetectQuestCycle verifies if recursion stack already contains active node',
      'Uses dynamic visited set checks to avoid redundant processing',
      'Backtracks recursion stack properly before returning false'
    ],
    rules: [
      {
        id: 'r12_2_dfs_cycle',
        type: 'exercise',
        description: 'Verify DFS quest graph cycle validation rules',
        evaluate: (code) => {
          const c = condense(code);
          const hasRecStackCheck = c.includes('RecStack.Contains(NodeId)') || c.includes('recstack.contains(nodeid)');
          const hasVisitedCheck = c.includes('Visited.Contains(NodeId)') || c.includes('visited.contains(nodeid)');
          const hasBacktrack = c.includes('RecStack.Remove(NodeId)') || c.includes('recstack.remove(nodeid)');
          const hasAdd = c.includes('RecStack.Add(NodeId)') && c.includes('Visited.Add(NodeId)');

          if (hasRecStackCheck && hasVisitedCheck && hasBacktrack && hasAdd) {
             return { passed: true, error: '', fix: '' };
          }
          return {
            passed: false,
            error: 'DetectQuestCycle must track recursion stack (for cycle detection) and visited set (for skipping redundant nodes) and backtrack RecStack properly on return.',
            fix: 'if (RecStack.Contains(NodeId)) return true;\n    if (Visited.Contains(NodeId)) return false;\n    Visited.Add(NodeId);\n    RecStack.Add(NodeId);\n    if (QuestGraph.Contains(NodeId)) {\n        for (int32 Neighbor : QuestGraph[NodeId]) {\n            if (DetectQuestCycle(Neighbor, QuestGraph, Visited, RecStack)) return true;\n        }\n    }\n    RecStack.Remove(NodeId);\n    return false;'
          };
        }
      }
    ],
    exampleSolutions: [
      {
        id: 'sol_12_2',
        title: 'Recursive Graph Path Tracer',
        explanation: 'Implements dynamic topological DFS cycle tracing with O(V + E) complexity to catch story deadlock conditions at system startup.',
        code: {
          'Source.cpp': `bool DetectQuestCycle(int32 NodeId, const TMap<int32, TArray<int32>>& QuestGraph, 
                      TSet<int32>& Visited, TSet<int32>& RecStack)
{
    if (RecStack.Contains(NodeId))
    {
        return true;
    }
    if (Visited.Contains(NodeId))
    {
        return false;
    }

    Visited.Add(NodeId);
    RecStack.Add(NodeId);

    if (QuestGraph.Contains(NodeId))
    {
        for (int32 Neighbor : QuestGraph[NodeId])
        {
            if (DetectQuestCycle(Neighbor, QuestGraph, Visited, RecStack))
            {
                return true;
            }
        }
    }

    RecStack.Remove(NodeId);
    return false;
}
`
        }
      }
    ]
};
