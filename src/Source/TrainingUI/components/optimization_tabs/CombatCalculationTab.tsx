import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, X, Shield, Cpu, Database, Settings, Zap, ArrowRight,
  RefreshCw, Layers, Sparkles, HardDrive, Trash2, Box, Code, Play, 
  Activity, Radio, Shuffle, Users, Layers3, Flame, Sword, Search, Crosshair, 
  Target, BarChart, Server
} from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { SectionCard, HighlightBox, PageHeader, CodeBlock, StatRow, MultiplayerImpact, FeatureMatrix } from './OptimizationHelpers';

export const CombatCalculationTab: React.FC = () => {
  const [activeTabSection, setActiveTabSection] = useState<'async_sweeps' | 'lock_free_queues' | 'bitmask_filters'>('async_sweeps');

  useEffect(() => {
    const target = (window as any).__scrollTarget;
    if (target) {
      if (target === 'async-sweeps') {
        setActiveTabSection('async_sweeps');
      } else if (target === 'lock-free-queues') {
        setActiveTabSection('lock_free_queues');
      } else if (target === 'bitmask-filters') {
        setActiveTabSection('bitmask_filters');
      }
    }
  }, []);

  // Simulator State: Async Hit Sweeps
  const [targetCount, setTargetCount] = useState(5);
  const [useAsync, setUseAsync] = useState(true);
  
  // Calculate simulated timings
  // Base sweep cost + per-target intersection cost
  const syncCpuCost = 0.5 + (targetCount * 0.15); 
  const asyncGameThreadCost = 0.1 + (targetCount * 0.01); // Minimal overhead
  const asyncWorkerCost = 0.4 + (targetCount * 0.1); 
  // Simulated total frame time to show impact
  const totalSyncFrame = 16.0 + syncCpuCost;
  const totalAsyncFrame = 16.0 + asyncGameThreadCost;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Combat Calculation & Resolution System" 
        subtitle="Lock-free multithreaded combat processing, bitmask filtering, and async hit-detection architectures for high-frequency ARPG/CRPG workloads." 
      />

      <HighlightBox type="success" className="my-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-emerald-400" />
          <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">High-Density Combat Scaling</strong>
        </div>
        <p className="text-emerald-100/90 text-sm">
          In games like Path of Exile or heavily modded Witcher 3, standard Unreal Engine synchronous traces (`SweepMultiByChannel`) and serialized damage calculations on the Game Thread will completely freeze the framerate when hitting 50+ enemies at once. Utilizing Async Traces, Lock-Free MPSC Queues, and 64-bit State Bitmasks guarantees a flat 16.6ms frame time even during extreme screen-wide AoE explosions.
        </p>
      </HighlightBox>

      {/* Internal Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'async_sweeps', icon: Crosshair, label: 'Async Hit Sweeps (O(1) GameThread)' },
          { id: 'lock_free_queues', icon: Server, label: 'Lock-Free Damage Queues' },
          { id: 'bitmask_filters', icon: Layers, label: 'O(1) Bitmask Filtering (BG3 Style)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabSection(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
              activeTabSection === tab.id
                ? 'bg-kingfisher-blue/20 border-kingfisher-blue/50 text-white shadow-md'
                : 'bg-black/20 border-white/5 text-kingfisher-muted hover:text-white hover:bg-black/40'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTabSection === tab.id ? 'text-blue-400' : 'text-zinc-500'}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- SECTION: ASYNC SWEEPS --- */}
      {activeTabSection === 'async_sweeps' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <SectionCard id="async-sweeps" title="Interactive Workload Simulator: AoE Hit Detection" icon={Activity} color={COLORS.kingfisher.blue}>
            <div className="p-4 bg-black/30 rounded-xl border border-white/5 mb-6">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                
                {/* Controls */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                       <label className="text-xs font-bold text-kingfisher-muted tracking-wider uppercase">Enemies Hit in AoE Swing</label>
                       <span className="text-sm font-mono text-white font-bold">{targetCount} Targets</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={targetCount} 
                      onChange={(e) => setTargetCount(parseInt(e.target.value))}
                      className="w-full accent-blue-500 h-2 bg-black rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono">
                      <span>1</span>
                      <span>50</span>
                      <span>100</span>
                    </div>
                  </div>

                  <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`relative w-10 h-5 rounded-full transition-colors ${useAsync ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                        <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${useAsync ? 'translate-x-5' : ''}`}></div>
                      </div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {useAsync ? 'Async Overlap (Task Graph)' : 'Synchronous Overlap (Game Thread)'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Live Metrics */}
                <div className="flex-1 space-y-3">
                  <div className={`p-3 rounded-lg border transition-all ${
                    !useAsync && totalSyncFrame > 16.67 
                      ? 'bg-red-500/10 border-red-500/30' 
                      : 'bg-black/40 border-white/5'
                  }`}>
                    <div className="text-[10px] uppercase text-zinc-400 font-bold mb-1 tracking-wider">Game Thread CPU Impact</div>
                    <div className="flex items-end gap-2">
                      <div className={`text-3xl font-mono font-bold ${
                        !useAsync && totalSyncFrame > 16.67 ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {useAsync ? asyncGameThreadCost.toFixed(2) : syncCpuCost.toFixed(2)}ms
                      </div>
                      <div className="text-xs text-zinc-500 pb-1 font-mono">
                        (Total Frame: {useAsync ? totalAsyncFrame.toFixed(2) : totalSyncFrame.toFixed(2)}ms)
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-black/40 border-white/5 rounded-lg border">
                    <div className="text-[10px] uppercase text-zinc-400 font-bold mb-1 tracking-wider">Background Worker Thread CPU</div>
                    <div className="text-xl font-mono font-bold text-blue-400">
                      {useAsync ? asyncWorkerCost.toFixed(2) : '0.00'}ms
                    </div>
                  </div>
                </div>
              </div>

              <CodeBlock code={`// C++ Synchronous (BAD for dense crowds - Locks Game Thread)
TArray<FHitResult> OutHits;
GetWorld()->SweepMultiByChannel(OutHits, StartLoc, EndLoc, Quat, ECC_Pawn, ColShape);
for (const FHitResult& Hit : OutHits) { ApplyDamage(Hit.GetActor()); }

// C++ Asynchronous (GOOD - Instantly frees Game Thread)
FTraceDelegate TraceDelegate;
TraceDelegate.BindUObject(this, &UMyCombatComponent::OnAoEHitResolved);
GetWorld()->AsyncSweepByChannel(
    EAsyncTraceType::Multi, 
    StartLoc, EndLoc, ECC_Pawn, ColShape, FCollisionQueryParams(), 
    FCollisionResponseParams(), &TraceDelegate
);`} />
            </div>

            <MultiplayerImpact 
              gpu="0.0ms (Physics queries are purely CPU bounds-checks)"
              cpu={useAsync ? "-14.5ms (Game Thread unblocked for massive 100-target swings)" : "+15.0ms Game Thread Stutter Locks"}
              ram="Minimal. FHitResult delegates captured and dropped out of scope cleanly."
              vram="0.0ms"
              latency="Massive ping stabilization. Server tick rate stays locked at 60Hz instead of dropping to 15Hz during heavy combat."
            />
          </SectionCard>
        </div>
      )}

      {/* --- SECTION: LOCK-FREE QUEUES --- */}
      {activeTabSection === 'lock_free_queues' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
           <SectionCard id="lock-free-queues" title="Lock-Free Damage Resolution Queues" icon={Server} color={COLORS.status.warning}>
            <p className="text-sm text-kingfisher-muted mb-4">
              In CRPGs and ARPGs (Path of Exile), a single fireball might hit 50 targets, each requiring 5 math formulas (resistances, armor, crit checks, damage type conversions). Running this synchronously drops FPS. Instead, the Game Thread strictly queues a minimal <code>FDmgRequest</code> struct into a lock-free queue. A dedicated background Combat Thread pops these requests, performs heavy RNG/Stat math, and queues a <code>FDmgResult</code> back to the Game Thread for health updates.
            </p>
            
            <div className="bg-black/30 p-4 border border-amber-500/30 rounded-xl mb-4">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Shuffle className="w-3.5 h-3.5" /> Pipeline Flow (MPSC)
              </h4>
              <div className="flex flex-col md:flex-row items-center gap-4 text-xs font-mono">
                <div className="flex-1 bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg text-center w-full">
                  <span className="text-blue-300 block mb-1">Game Thread (Client/Server)</span>
                  <span className="text-zinc-400">Queue.Enqueue(Target, 500 DMG)</span>
                </div>
                <div className="text-zinc-500 rotate-90 md:rotate-0"><ArrowRight className="w-4 h-4"/></div>
                <div className="flex-1 bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg text-center w-full shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <span className="text-amber-300 block mb-1">Background Combat Thread</span>
                  <span className="text-zinc-400">Pops Queue</span><br/>
                  <span className="text-zinc-400">Armor Math & Crit RNG</span>
                </div>
                <div className="text-zinc-500 rotate-90 md:rotate-0"><ArrowRight className="w-4 h-4"/></div>
                <div className="flex-1 bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-lg text-center w-full">
                  <span className="text-emerald-300 block mb-1">Game Thread (Next Frame)</span>
                  <span className="text-zinc-400">Apply Health Delta</span>
                </div>
              </div>
            </div>

            <CodeBlock code={`// C++ Lock-Free Queue Definition (Thread-Safe without OS Mutex Locks)
#include "Containers/SpscQueue.h" // Or MpscQueue

struct FDamageRequest {
    TWeakObjectPtr<AActor> Target;
    float RawDamage;
    uint32 DamageTypeHash;
};

// Global Subsystem Queue
TMpscQueue<FDamageRequest> GCombatDamageQueue;

// Game Thread simply pushes data and continues instantly
void UCombatSystem::ApplyPoEDamage(AActor* Target, float BaseDmg) {
    FDamageRequest Req = { Target, BaseDmg, FNV1a("Fire") };
    GCombatDamageQueue.Enqueue(MoveTemp(Req)); 
}

// Background Task continuously evaluates math without hitting GameThread
void FCombatWorker::DoWork() {
    FDamageRequest Req;
    while (GCombatDamageQueue.Dequeue(Req)) {
        if (Req.Target.IsValid()) {
             float Final = CalculateHeavyArmorPenetration(Req);
             GResolvedDamageQueue.Enqueue({Req.Target, Final});
        }
    }
}`} />
          </SectionCard>
        </div>
      )}

      {/* --- SECTION: BITMASK FILTERS --- */}
      {activeTabSection === 'bitmask_filters' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
           <SectionCard id="bitmask-filters" title="O(1) Bitmask Condition Filters" icon={Layers} color={COLORS.status.success}>
            <p className="text-sm text-kingfisher-muted mb-4">
              CRPGs like Baldur's Gate 3 need to evaluate hundreds of passive conditions instantaneously. "If Target is <strong>Undead</strong> AND <strong>Burning</strong> AND <strong>Charmed</strong>, apply 50% extra Holy Damage". Checking standard TArrays of string tags or enumerating UGameplayEffects loops the CPU. Converting states to a 64-bit mask processes 64 conditions in exactly <strong>1 CPU cycle (1 Nanosecond)</strong> via Bitwise AND operations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl">
                 <h4 className="text-xs font-bold text-red-400 uppercase mb-2">The Slow Way (O(N Array Loops))</h4>
                 <CodeBlock code={`// Loops array memory, cache misses galore
bool CheckSynergy(TArray<FName>& ActiveTags) {
   bool bIsUndead = ActiveTags.Contains("Undead");
   bool bIsBurning = ActiveTags.Contains("Burning");
   return bIsUndead && bIsBurning;
}`} />
               </div>
               
               <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl">
                 <h4 className="text-xs font-bold text-emerald-400 uppercase mb-2">The O(1) Bitmask Way (Registers)</h4>
                 <CodeBlock code={`// 1 CPU clock cycle inline evaluation
enum ECombatState : uint64 {
    Undead  = 1ULL << 0,  // 0001
    Burning = 1ULL << 1,  // 0010
};

// Evaluated inside CPU Register effortlessly
bool CheckSynergy(uint64 CurrentStateMask) {
   uint64 Required = ECombatState::Undead | ECombatState::Burning;
   return (CurrentStateMask & Required) == Required;
}`} />
               </div>
            </div>

            <FeatureMatrix 
              has={["Enum Bitflags natively supported in C++ (1ULL << N)", "GameplayTagContainers (UE5 Native, though internally uses TArray/Hash logic which is slightly slower than pure uint64)"]}
              missing={["Automated visually-driven uint64 Bitmask Editor in Blueprints without custom C++ UI customizations"]}
              howToUse='Instead of spawning and destroying Actor Components for status effects (e.g., "UBurningComponent"), have the player maintain a single uint64 variable `ActiveStates`. Bitwise OR (|) to combine states, Bitwise AND (&) to query, and Bitwise AND NOT (&~) to remove.'
            />
          </SectionCard>
        </div>
      )}
    </div>
  );
};
