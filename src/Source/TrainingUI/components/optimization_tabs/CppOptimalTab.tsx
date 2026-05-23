
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const CppOptimalTab = () => (
  <div className="space-y-6 animate-fadeIn">
    <PageHeader
      title="Optimal C++ Practices"
      subtitle="Cache-coherent, Data-Oriented, and Multiplayer-ready C++ workflows. Code for the L1 cache."
    />

    <HighlightBox type="info">
      <strong>The Core Insight:</strong> Optimal C++ in Unreal is about respecting the L1/L2 cache and minimizing heap allocations. By keeping data packed, aligned, and using Unreal's natively optimized allocators, you keep the CPU continuously fed with data during a tight 16.7ms frame budget.
    </HighlightBox>

    <SectionCard id="data-alignment-padding" title="1. Data Alignment & Struct Padding" icon={Database} color={COLORS.status.success}>
      <p className="text-sm mb-3"><strong>Do: Order Variables from Largest to Smallest.</strong> C++ organically pads structs to match alignment requirements of their largest members. Ordering from largest (64-bit pointers/doubles) to smallest (8-bit bools) packs the data tightly, eliminating wasted RAM and massively improving CPU cache line utilization.</p>
      <div className="p-3 bg-black/20 rounded border border-emerald-500/10 text-xs mb-3">
        <strong className="text-emerald-400 block mb-1">BG3-style Entity Padding:</strong>
        <p className="text-kingfisher-muted text-xs leading-normal">In Baldur's Gate 3, there are tens of thousands of static and dynamic game objects in active regions. Ordering members from largest pointers to smallest boolean bits in your class/struct declarations keeps state footprints dense, saving megabytes of waste and improving cache efficiency during sweeps.</p>
      </div>
      <CodeBlock code={`// Optimal Memory Alignment (Padding Eliminated)
USTRUCT()
struct FCombatState
{
    GENERATED_BODY()
    
    AActor* Target;        // 8 bytes
    double HighPrecTime;   // 8 bytes
    float Health;          // 4 bytes
    uint32 StatusFlags;    // 4 bytes
    uint16 DamageTier;     // 2 bytes
    bool bIsActive;        // 1 byte
    bool bIsPoisoned;      // 1 byte
    // Total: 28 bytes (Perfectly packed, 0 wasted padding bytes!)
};`} />
      <MultiplayerImpact 
        gpu="0ms" 
        cpu="-0.4ms CPU (Bypasses CPU L1 cache line loading stalls during structural evaluation loops)" 
        ram="Saves ~12.5MB system RAM (Over 100k actively staged entity combat structures)" 
        vram="0ms" 
        latency="0ms" 
      />
    </SectionCard>

    <SectionCard id="fast-stack-allocations" title="2. Fast Stack Allocations (TInlineAllocator)" icon={Cpu} color={COLORS.kingfisher.warm}>
      <p className="text-sm mb-3"><strong>Do: Use TInlineAllocator for hot-path local arrays.</strong> When gathering items for a loop (like finding nearby actors or physics traces) where the maximum count is generally known, use <code>TInlineAllocator</code>. This allocates the array directly on the <em>Stack</em> rather than the <em>Heap</em>, entirely bypassing expensive contiguous RAM allocation calls.</p>
      <div className="p-3 bg-black/20 rounded border border-amber-500/10 text-xs mb-3">
        <strong className="text-amber-400 block mb-1">Witcher 3-style Attack Sweeps:</strong>
        <p className="text-kingfisher-muted text-xs leading-normal">Geralt initiating a Whirl sword spin. Sweeping nearby capsules for 10-15 surrounding actors. Allocating dynamic heap arrays inside the combat update is slow. Setting up a <code>TInlineAllocator&lt;16&gt;</code> executes the query directly on the fast CPU stack for zero heap cost.</p>
      </div>
      <CodeBlock code={`// Fast Path: Stack-allocated array for up to 16 hits
TArray<FHitResult, TInlineAllocator<16>> HitResults;

// The first 16 hits cost ZERO heap allocations.
// If it reaches 17, it seamlessly moves to the heap automatically.
GetWorld()->SweepMultiByChannel(HitResults, Start, End, ...);`} />
      <MultiplayerImpact 
        gpu="0ms" 
        cpu="-0.6ms CPU Game Thread (Eliminates high-frequency kernel heap allocation dispatches in combat loops)" 
        ram="-2.2MB Heap fragmentation prevention" 
        vram="0ms" 
        latency="0ms" 
      />
    </SectionCard>

    <SectionCard id="bitmask-replication" title="3. Bitmask Replication (Network Bandwidth)" icon={Radio} color={COLORS.status.info}>
      <p className="text-sm mb-3"><strong>Do: Pack grouped booleans into a single bitmask integer.</strong> Instead of replicating multiple separate boolean properties (which each incur RPC and property header byte overhead), tightly pack states into a single replicated <code>uint8</code> or <code>uint16</code> bitmask using standard C++ bitwise operators.</p>
      <div className="p-3 bg-black/20 rounded border border-blue-500/10 text-xs mb-3">
        <strong className="text-blue-400 block mb-1">PoE-style Status Effect Stacks:</strong>
        <p className="text-kingfisher-muted text-xs leading-normal">An enemy in Path of Exile can have Burning, Frozen, Shocked, Poisoned, Cursed, and Stunned simultaneously. Replicating 6 separate booleans triggers huge packet serialization blocks. Packing them into a single `uint8` bitmask sends all states in 1 byte, saving crucial bytes.</p>
      </div>
      <CodeBlock code={`UPROPERTY(ReplicatedUsing = OnRep_StateMask)
uint8 StateMask; // 1 byte handles 8 distinct states

// Packing the flags on the Server:
void SetState(EPlayerStateFlag Flag, bool bEnabled)
{
    if (bEnabled) StateMask |= (uint8)Flag;  // Turn ON
    else StateMask &= ~(uint8)Flag;          // Turn OFF
}`} />
      <MultiplayerImpact 
        gpu="0ms" 
        cpu="-0.2ms CPU (Cuts property replication graph evaluation and serialization workloads)" 
        ram="0ms" 
        vram="0ms" 
        latency="-6ms bandwidth latency (Prevents bufferbloat and packet drops on connection channels)" 
      />
    </SectionCard>

    <SectionCard id="engine-subsystems" title="4. Engine Subsystems (Decoupled Singletons)" icon={Layers} color={COLORS.kingfisher.blue}>
      <p className="text-sm mb-3"><strong>Do: Use UWorldSubsystem / UGameInstanceSubsystem for Managers.</strong> Do not use singletons or <code>AActor</code> manager classes dropped in a level. Subsystems have zero physical transform overhead, zero baseline network replication cost, and have their lifecycles automatically managed by the engine (auto-created and destroyed).</p>
      <MultiplayerImpact 
        gpu="0ms" 
        cpu="-0.3ms (Actor Tick overhead and component assembly checks eliminated entirely)" 
        ram="-180KB memory footprint (Bypasses heavy Actor properties)" 
        vram="0ms" 
        latency="0ms" 
      />
    </SectionCard>

    <SectionCard title="UE C++ Performance Matrix" icon={Activity} color={COLORS.kingfisher.warm}>
      <FeatureMatrix 
        has={[
          "TInlineAllocator & TFixedAllocator (stack/fixed-pool memory constructs natively defined)",
          "USTRUCT memory alignment macros with automatic type padding buffers",
          "Decoupled Subsystem lifecycles (UWorldSubsystem, ULocalPlayerSubsystem, UGameInstanceSubsystem)",
          "FFastArraySerializer for super-fast bitwise delta network replication"
        ]}
        missing={[
          "Native compiler checks for bad struct alignment (requires external static analysis checks in Rider or Visual Studio)",
          "Automatic boolean network bitmasking (forces manual bitwise coding)"
        ]}
        howToUse="Activate the 'Struct Layout' plugin in Rider to immediately inspect class alignment waste. Default to TInlineAllocator for local trace/sweep vectors. Inherit custom level systems from UWorldSubsystem instead of ticketing actors."
      />
    </SectionCard>
  </div>
);
