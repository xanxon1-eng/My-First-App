import React from 'react';
import { Network, Database, Cpu, HardDrive, MessageSquare, Mic, Film, Code, Shield } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { SectionCard, HighlightBox, PageHeader, MultiplayerImpact, FeatureMatrix, CodeBlock } from './OptimizationHelpers';

export const QuestDialogueTab = () => (
  <div className="space-y-6 pb-12">
    <PageHeader 
      title="Quest, Dialogue & Cinematic State Engines" 
      subtitle="Architecting branching conversations, voice-over streaming, and quest delta tracking inspired by The Witcher 3 and Baldur's Gate 3 to eliminate dialogue load screens and cinematic stutters." 
    />

    <HighlightBox type="success" className="my-4">
      <div className="flex flex-col gap-2 mb-2">
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> 
          The Branching Dialogue Bottleneck
        </strong>
      </div>
      <p className="text-emerald-100/90 text-sm leading-relaxed">
        True RPGs require thousands of dialogue trees, millions of words of text, and highly conditional branching paths (e.g., "Did I kill the beast?", "Am I holding the amulet?"). Navigating these nodes via traditional Object-Oriented memory structures leads to catastrophic heap allocations. We optimize this by compressing dialogue trees into <strong>Flat Integer Bytecode Buffers</strong> and asynchronous audio queues.
      </p>
    </HighlightBox>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard id="dialogue-bytecode" title="Dialogue Compilation & Bytecode" icon={Database} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3">
          If every dialogue node is a <code className="text-white">UObject</code> Blueprint node, holding references to audio clips, cinematic cameras, and logic scripts, memory bloats severely.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-4">
          <li><strong>Compile Branching to Bytecode:</strong> External dialogue editors (like Twine or articy:draft) should export data as JSON. On game cook, the engine translates JSON into a flat contiguous <strong>Bytecode array</strong>. A conversation becomes a simple array of instructions.</li>
          <li><strong>Zero Object Allocation:</strong> While talking, the dialogue manager points to an index in the array. Bypasses creating thousands of individual instances logic processors.</li>
          <li><strong>Bitmask Conditionals:</strong> Similar to combat bitmasks, conditional dialogue branches perform purely bitwise checks (e.g., <code className="text-blue-300">PlayerState & QUEST_24_COMPLETE</code>). No slow string comparisons!</li>
        </ul>
        <MultiplayerImpact 
          gpu="0.0 ms" 
          cpu="-4.5 ms (Bypassing object evaluation and string hashes reduces Game Thread cost drastically)" 
          ram="-350 MB System RAM (Entire multi-language script fits under 20MB of text array blocks)" 
          latency="0.0 ms (Evaluation logic runs identically over network frames securely)"
        />
      </SectionCard>

      <SectionCard id="cinematic-culling" title="Cinematic DOF & Background Culling" icon={Film} color={COLORS.kingfisher.warm}>
        <p className="text-sm mb-3">
          Dynamic cutscenes place a camera in front of characters, but rendering the entire city behind them destroys frame rates when executing ultra-high-quality cinematic lighting.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-4">
          <li><strong>Cinematic DOF Clipping:</strong> Calculate the focal distance of the depth-of-field. Immediately un-render (cull) actors that fall completely into the outer blurred background layers preventing GPU overdraw.</li>
          <li><strong>Animation Distance Optimization:</strong> Force NPCs outside of the cinematic camera boundaries into absolute LOD 3 (skip bones).</li>
          <li><strong>Oodle Prefetching:</strong> Inject invisible dialogue bytecode instructions 3 lines *before* a cutscene ends, scheduling localized level streaming on worker threads. Ensures the open world is fully decompressed by the time the dialogue terminates without rubber-banding.</li>
        </ul>
        <MultiplayerImpact 
          gpu="-8.2 ms (Culling background characters and applying aggressive depth-clipping limits render overhead)" 
          cpu="-2.0 ms (Saves Game Thread evaluation for invisible mesh transforms)" 
          ram="-150 MB (Unloads unneeded high-resolution background textures conditionally)" 
          latency="0.0 ms (Visual culling only)"
        />
      </SectionCard>
    </div>

    <SectionCard id="audio-facial-streaming" title="Facial Animation & V.O. Streaming" icon={Mic} color={COLORS.status.success}>
      <p className="text-sm text-kingfisher-muted mb-4">
        Hundreds of hours of Voice-Over (V.O.) and Facial Morph Targets (FaceFX natively) cannot fit into RAM.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-kingfisher-muted mb-4">
        <div className="p-3 bg-black/30 rounded border border-emerald-500/20">
          <strong className="text-emerald-400 block mb-1">Pipelined Audio Contexts</strong>
          <p className="leading-relaxed">Instead of pre-loading audio into <code className="text-white">USoundWave</code> caches, stream localized OGG files directly from the NVMe chunks via <strong>FStreamableManager</strong> async handles. Only the active, previous, and next dialogue lines are held in memory simultaneously.</p>
        </div>
        <div className="p-3 bg-black/30 rounded border border-blue-500/20">
          <strong className="text-blue-400 block mb-1">Procedural Lip-Sync Curves</strong>
          <p className="leading-relaxed">Bake audio frequency curves into linear color data textures or float arrays during cook. Run the facial morph solver asynchronously or inject via vertex shader offsets, leaving the skeleton entirely out of the Game Thread loop.</p>
        </div>
      </div>
      <MultiplayerImpact 
        gpu="+0.5 ms (Procedural vertex displacement morphs)" 
        cpu="-3.2 ms (Avoids synchronous garbage collection sweeps while tracking thousands of audio nodes)" 
        ram="-1.5 GB System RAM (Prevents massive audio bulk data caches)" 
        latency="Avoids high server ping (Prevents GC pauses on the dedicated server)"
      />
    </SectionCard>

    <SectionCard title="C++ Logic: Dialogue Bitmask Check" icon={Code} color={COLORS.status.info}>
      <p className="text-xs text-kingfisher-muted mb-2">Resolving conditional dialogue paths in constant <strong>O(1)</strong> time during conversations.</p>
      <CodeBlock code={`// Check if player has exactly the conditions required to show a dialogue branch
// using blazing fast 64-bit integer Bitwise AND matching.

bool UDialogueSystem::IsBranchAvailable(const FDialogueInstruction& Node)
{
    // A single 64-bit passport of active world states (e.g. Quests completed, items held)
    const uint64 PlayerState = WorldStateSubsystem->GetPlayerBitmask();
    
    // Check if the Player's state contains ALL the specific required bits of the Node
    if ((PlayerState & Node.RequiredBitmask) != Node.RequiredBitmask)
    {
        return false; // Fast failure. CPU execution: <0.1 ns
    }

    // Check if the Node explicitly restricts based on exclusion bits 
    if ((PlayerState & Node.ExclusionBitmask) != 0)
    {
        return false; // e.g., "Player must NOT have killed the NPC"
    }

    return true; 
}
`} />
    </SectionCard>

    <SectionCard title="Unreal Engine Cinematic Limits" icon={Shield} color={COLORS.kingfisher.blue}>
      <FeatureMatrix 
        has={[
          "Level Sequencer & Movie Scene: Powerful visual tools for staging character positions, camera cuts, and audio drops.",
          "FStreamableManager: Background loader capable of handling discrete Audio streaming chunks without lagging frames.",
          "Audio Modulation Plugin: Procedurally fading crowd noise while cinematic lines begin mixing."
        ]}
        missing={[
          "Out-of-the-box non-blocking Dialogue Graph Editors (standard Behavior Trees are meant for AI, not billion-line scripts).",
          "Advanced Caching Data structs for conditional branching evaluation (must be programmed or adapted from third-party plugins like articy).",
          "Automated dynamic texture-dropping of background geometry strictly behind depth-of-field."
        ]}
        howToUse="Export narratives from dedicated authoring tools via JSON. Parse JSON via commanding C++ structures and flat structs (TArray<FDialogueInstruction>). Hook up FSequencer dynamically passing active morph targets and stream audio synchronously. For condition checks, employ a Bitmask tagging central registry."
      />
    </SectionCard>

    <SectionCard id="quest-hierarchy-tracer" title="Quest Hierarchy Dependency Tracer & DAG Validation" icon={Network} color={COLORS.kingfisher.warm}>
      <p className="text-sm text-kingfisher-muted mb-4">
        Massive RPGs contain 500+ node dialogue hierarchies and intersecting quest conditions. A simple misplaced dependency check (e.g. "Quest A requires Quest B, but Quest B requires Quest A") can lock up the entire game engine in an infinite while-loop logic compilation at runtime.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted mb-4">
        <li><strong>Pre-flight DAG (Directed Acyclic Graph) Validator:</strong> Instead of trusting runtime state evaluation, execute a C++ DAG traversal over all dialogue and quest bytecode during a separate Cook/Boot step.</li>
        <li><strong>Topological Sorting:</strong> Sort nodes topologically. If a topological sort fails (encounters a cycle), immediately throw a hard compile assertion warning designers of the deadlock narrative condition before the game boots.</li>
        <li><strong>Boot Time Tracing:</strong> Loading an entire graph recursively at runtime spikes CPU. The DAG Validator processes these relationships at boot-time or cook-time, baking safe execution paths.</li>
      </ul>
      <MultiplayerImpact 
        gpu="0.0 ms" 
        cpu="-4.5 ms (Eliminates deep recursive hierarchical condition sweeping on the Game Thread during conversations)" 
        ram="+12 MB (Runtime Directed Acyclic Graph structure tracking dependencies)" 
        latency="0.0 ms"
      />
      <FeatureMatrix 
        has={[
          "Cook Commandlets for static analysis checks during build time",
          "Automated Testing frameworks to build integration tests"
        ]}
        missing={[
          "Native Narrative DAG Cycle detection (must write a custom C++ Topological Sort algorithm for your data structures)"
        ]}
        howToUse="Export all dialogues and quests to JSON, parse into a custom C++ Topological Graph, and run depth-first search (DFS) validations strictly as an Editor commandlet prior to shipping."
      />
    </SectionCard>

  </div>
);
