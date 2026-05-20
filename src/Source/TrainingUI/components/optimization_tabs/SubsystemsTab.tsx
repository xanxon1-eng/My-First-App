
import React from 'react';
import { CheckCircle, X, Monitor, Cpu, Database, HardDrive, Radio, GitBranch, Shield, CircleDashed, Smartphone, Activity, Zap, LayoutTemplate, Box, Waves, ClipboardList, EyeOff, Layers, BarChart3, Globe, Folder, Hexagon, Save, Triangle, Image, Palette, Crosshair, Sliders, Music, Package, Eye, TrendingDown, Flame, Terminal, ShieldAlert, Map, Trash2, Code, Server, Shuffle, Wind, Lock, Wifi, Navigation, Sword, Trees, Droplets, Mountain, Users, Clock, Sun, Settings, Grid, Network } from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock } from './OptimizationHelpers';

export const SubsystemsTab = () => (
  <div className="space-y-6">
    <PageHeader title="UE Subsystems Architecture" subtitle="Lifetime-managed singleton classes for scalable, event-driven, decoupled systems." />
    <HighlightBox type="success" className="my-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <strong className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Recommended Architecture</strong>
      </div>
      <p className="text-emerald-100/90 text-sm italic">Lazy-loading, reactive Event-Driven Subsystems utilizing dynamic C++ multicast delegates to replace heavy class ticks.</p>
    </HighlightBox>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Lifecycle Managed Categories" icon={Layers} color={COLORS.kingfisher.blue}>
        <p className="text-sm mb-3 font-semibold text-white">Subsystems auto-instantiate aligned with their parent object's lifetime. They replace singletons and bloated controller graphs:</p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-kingfisher-muted">
          <li><strong>Engine (UEngineSubsystem):</strong> Perserves across the entire life of the compiled process. Ideal for dynamic network master configurations.</li>
          <li><strong>GameInstance (UGameInstanceSubsystem):</strong> Lives over the entire game session, retaining memory cleanly through map transfers. Great for user progress profiles.</li>
          <li><strong>World (UWorldSubsystem):</strong> Scope is bound to the current Level. Initialized on load and garbage collected instantly on map teardown. Perfect for match-round timers.</li>
          <li><strong>LocalPlayer (ULocalPlayerSubsystem):</strong> Created uniquely per physical player controller (split-screen safe).</li>
        </ul>
      </SectionCard>

      <SectionCard title="Reactivity: Eliminating Subsystem Ticks" icon={Radio} color={COLORS.status.success}>
        <p className="text-sm text-kingfisher-muted mb-3">
          Having a subsystem tick at 60Hz simply to poll player stats is a severe performance waste. Each ticking class registers in the engine's main tick checklist, incurring overhead.
        </p>
        <p className="text-xs text-kingfisher-muted mb-3">
          <strong>The Event-Driven Fix:</strong> Restrict Subsystem Ticking entirely (<code>bCanEverTick = false</code>). Declare dynamic multicast delegates in C++. Broadcasters fire only when critical state changes actually occur (like taking damage or gaining loot), updating dependent UI views cleanly.
        </p>
        <MultiplayerImpact 
          gpu="0.0ms (Zero direct impact on graphics hardware)" 
          cpu="-0.6ms (Eliminates actor-style tick list management and updates instruction prefetch registers)" 
          ram="+180B per registered listener (Insignificant footprint)" 
          latency="0ms (Synchronous event dispatches ensure zero delay in state modifications)" 
        />
      </SectionCard>
    </div>

    <SectionCard title="C++ Reactive Multicast Subsystem" icon={Code} color={COLORS.status.info}>
      <p className="text-sm text-kingfisher-muted mb-3">
        Declaring a C++ World Subsystem that leverages multicast events with dynamic data parameters, preserving server tick budgets:
      </p>
      <CodeBlock code={`// MatchStateSubsystem.h - Event-driven world subsystem
#pragma once
#include "CoreMinimal.h"
#include "Subsystems/WorldSubsystem.h"
#include "MatchStateSubsystem.generated.h"

// 1. Declare dynamic multicast delegate
DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnMatchStateChanged, EMatchState, NewState, float, TimeRemaining);

UCLASS()
class SPECIALIZED_API UMatchStateSubsystem : public UWorldSubsystem
{
    GENERATED_BODY()

public:
    UMatchStateSubsystem() {}

    // Multicast delegate instance accessible by UI, AActors, or AI
    UPROPERTY(BlueprintAssignable, Category = "Match State")
    FOnMatchStateChanged OnMatchStateChanged;

    // Trigger state changes authorities-only, dispatching callback lists
    void TransitionToState(EMatchState TargetState, float StateDuration)
    {
        CurrentState = TargetState;
        Duration = StateDuration;

        // Broadcast to all active listeners. 
        // Zero polling from ticking receivers!
        if (OnMatchStateChanged.IsBound())
        {
            OnMatchStateChanged.Broadcast(CurrentState, Duration);
        }
    }

protected:
    virtual void Initialize(FSubsystemCollectionBase& Collection) override
    {
        Super::Initialize(Collection);
        CurrentState = EMatchState::Warmup;
    }

    virtual void Deinitialize() override
    {
        OnMatchStateChanged.Clear(); // Terminate clean listeners
        Super::Deinitialize();
    }

private:
    EMatchState CurrentState;
    float Duration;
};`} />
    </SectionCard>

    <SectionCard title="Subsystem Features & Constraints" icon={Shield} color={COLORS.kingfisher.blue}>
      <FeatureMatrix 
        has={[
          "Auto-registration during gameplay launch, avoiding manual reference patching or singletons",
          "Direct, standardized interface retrieval from C++ and blueprint graphs easily",
          "Explicitly declared setup (Initialize) and dismantlement (Deinitialize) lifecycle callbacks"
        ]}
        missing={[
          "Native variable replication channels (variables within subsystems cannot replicate natively—data must proxy through the GameState instead)",
          "Default editor visual graph layouts for custom modular blueprints",
          "Automatic global cross-server serialization mapping"
        ]}
        howToUse="To integrate: Subclass from UWorldSubsystem or UGameInstanceSubsystem in C++. Implement Initialize() to bind events and Deinitialize() to cleanly release them. Fetch instances on demand via GetWorld()->GetSubsystem<UMatchStateSubsystem>() anywhere in your code."
      />
    </SectionCard>
  </div>
);
