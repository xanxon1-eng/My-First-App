import React, { useState, useEffect } from 'react';
import { useTrainingCore } from '../../TrainingCore/core/TrainingCore';
import { Bird, Play, Zap, Shield, Heart, HelpCircle, Activity, RefreshCw, Cpu, Award, HardDrive, CheckCircle, Info, Eye, EyeOff, AlertTriangle, Search, Database, Layers, Sliders, Globe, Server, Link, Trash2, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Generic Universal Visualizer Component
const UniversalTaskVisualizer = ({ task, documents, session }: { task: any, documents: any[], session: any }) => {
  const [extractedVars, setExtractedVars] = useState<{type: string, name: string, value: string}[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  
  useEffect(() => {
    if (session?.compileStatus === 'compiling') {
      setIsCompiling(true);
    } else {
      setTimeout(() => setIsCompiling(false), 800);
    }
  }, [session?.compileStatus]);

  useEffect(() => {
    const cppCode = documents.find(d => d.filePath.endsWith('.cpp'))?.textBuffer || '';
    const hCode = documents.find(d => d.filePath.endsWith('.h'))?.textBuffer || '';
    const code = hCode + '\n' + cppCode;

    const vars: {type: string, name: string, value: string}[] = [];
    const regex = /(int32|float|bool|FString|int|auto)\s+([a-zA-Z0-9_]+)\s*(?:=\s*([^;]+))?;/g;
    let match;
    let fallbackCount = 0;
    while ((match = regex.exec(code)) !== null) {
      if (fallbackCount++ > 15) break; 
      vars.push({
        type: match[1],
        name: match[2],
        value: match[3] ? match[3].trim() : 'Uninitialized'
      });
    }
    setExtractedVars(vars);
  }, [documents, task]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full px-6 py-4 animate-fade-in relative overflow-hidden text-sm">
      <div className="flex flex-col items-center justify-center text-center mb-6 z-10 w-full relative">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />
        <div className="relative inline-flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-lg mb-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-mono font-bold text-white text-xs uppercase tracking-widest">
            {task.title}
          </span>
        </div>
      </div>

      <div className="w-full max-w-lg bg-black/60 rounded-xl border border-white/10 p-5 shadow-2xl flex flex-col relative z-10 overflow-hidden font-mono group transition-colors hover:border-emerald-500/30">
        <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2 text-zinc-300">
             <Cpu className="w-4 h-4 text-kingfisher-warm" />
             <span className="text-[10px] uppercase font-bold tracking-widest">Virtual Context Inspector</span>
          </div>
          <div className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
             {task.category || 'Sandbox Module'}
          </div>
        </div>
        
        {isCompiling ? (
          <div className="flex-1 flex flex-col items-center justify-center py-10 space-y-3">
             <div className="w-8 h-8 rounded-full border-t-2 border-l-2 border-emerald-400 animate-spin" />
             <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold animate-pulse">Running GCC Fast-Compile...</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2 max-h-[180px]">
            {extractedVars.length > 0 ? (
              extractedVars.map((v, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest w-12">{v.type}</span>
                    <span className="text-xs text-indigo-300 font-bold">{v.name}</span>
                  </div>
                  <div className="text-xs text-emerald-400 bg-black/40 px-2 py-0.5 rounded border border-emerald-500/20 font-bold truncate max-w-[150px]" title={v.value}>
                    {v.value}
                  </div>
                </div>
              ))
            ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500">
                  <span className="text-2xl mb-2 opacity-50">✦</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold">Initializing architectural memory context</span>
                </div>
            )}
          </div>
        )}
        
        <div className="mt-4 pt-3 border-t border-white/10 text-[9px] text-zinc-500 leading-normal flex items-start gap-2">
          <Info className="w-3 h-3 text-zinc-400 shrink-0" />
          <span>Dynamically traces architectural variables mapped in the active structural block via simulated AST Reflection pointers.</span>
        </div>
      </div>
    </div>
  );
};

export function CppSchoolVisualizer() {
  const { currentTask, documents, currentSession } = useTrainingCore();

  // Basic Simulation States (Tasks 1 & 2)
  const [simHealth, setSimHealth] = useState(100);
  const [simMaxHealth, setSimMaxHealth] = useState(100);
  const [simDamage, setSimDamage] = useState(45.5);
  const [simAlive, setSimAlive] = useState(true);
  const [strikeCount, setStrikeCount] = useState(0);
  const [strikeAnim, setStrikeAnim] = useState(false);
  const [damageIndicators, setDamageIndicators] = useState<{ id: number; value: number }[]>([]);
  const [pointerWriteCompleted, setPointerWriteCompleted] = useState(false);
  const [ammoCount, setAmmoCount] = useState(30);

  // Vector push_back entries
  const [vectorElements, setVectorElements] = useState<number[]>([]);
  const [sliderHealth, setSliderHealth] = useState(75);

  // Loops stepper indexes
  const [loopElements, setLoopElements] = useState<number[]>([15, -4, 8, 0, 12, -2]);
  const [loopActiveIdx, setLoopActiveIdx] = useState(-1);
  const [loopTotal, setLoopTotal] = useState(0);
  const [loopState, setLoopState] = useState<'idle' | 'running' | 'break' | 'continue' | 'finished'>('idle');
  const [loopSpeed, setLoopSpeed] = useState(800);

  // Nested Loops Stepper (HasDuplicate)
  const [nestedElements, setNestedElements] = useState<number[]>([4, 12, 8, 12, 19]);
  const [nestedI, setNestedI] = useState(-1);
  const [nestedJ, setNestedJ] = useState(-1);
  const [duplicateMatchIndex, setDuplicateMatchIndex] = useState<[number, number] | null>(null);
  const [nestedState, setNestedState] = useState<'idle' | 'scanning' | 'matched' | 'finished'>('idle');

  // Client Server Terminal lines
  const [logPackets, setLogPackets] = useState<{ id: number; sender: 'client' | 'server'; text: string }[]>([]);

  // --- NEW ADVANCED RPG-OPTIMIZED SANDBOX STATE POOLS ---
  const [activeLogType, setActiveLogType] = useState<'FString' | 'FName' | 'FText'>('FString');
  const [consoleLogItems, setConsoleLogItems] = useState<{ type: 'log' | 'warn' | 'err'; text: string; cost: string }[]>([
    { type: 'log', text: 'Initializing Virtual Logger Module (VisLog)...', cost: '0.00ms' }
  ]);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  
  // GC-simulation cells representing RAM register blocks
  const [memoryCells, setMemoryCells] = useState<{ addr: string; name: string; value: string; isProtected: boolean; type: string }[]>([
    { addr: '0x00A1F0C0', name: 'Health', value: '100', isProtected: true, type: 'int32' },
    { addr: '0x00A1F0C4', name: 'CurrentWeapon', value: '0x08FBA1C4', isProtected: false, type: 'UWeapon*' },
    { addr: '0x00A1F0C8', name: 'Scores_Heap', value: '0x09EEF000', isProtected: true, type: 'int32*' },
    { addr: '0x00A1F0CC', name: 'Ammo', value: '30', isProtected: true, type: 'int32' },
    { addr: '0x00A1F0D0', name: 'TempSpawnActor', value: '0x06A1B8C0', isProtected: false, type: 'AActor*' }
  ]);
  const [gcProgress, setGcProgress] = useState<'idle' | 'sweeping' | 'swept'>('idle');
  const [gcConsoleLog, setGcConsoleLog] = useState<string[]>([]);
  const [isGcRunning, setIsGcRunning] = useState(false);

  // TMap bucket entries
  const [tmapEntries, setTmapEntries] = useState<{ key: string; value: string; bucket: number }[]>([
    { key: 'IronSword', value: 'Dmg: 15', bucket: 1 },
    { key: 'HealthPotion', value: 'Heal: 50', bucket: 3 },
    { key: 'ShieldOfLight', value: 'Def: 25', bucket: 0 },
    { key: 'ScrollOfFire', value: 'Spell: Fireball', bucket: 2 }
  ]);
  const [tmapKeyInput, setTmapKeyInput] = useState('HealthPotion');
  const [tmapSearchResult, setTmapSearchResult] = useState<string | null>(null);
  const [tmapSearchingBucket, setTmapSearchingBucket] = useState<number | null>(null);
  const [tmapConsoleLog, setTmapConsoleLog] = useState('');
  const [tmapIsSearching, setTmapIsSearching] = useState(false);

  // Control Flow state machine enums
  const [activePlayerState, setActivePlayerState] = useState<'IDLE' | 'COMBAT' | 'RESTING' | 'DEAD'>('IDLE');
  const [assertionLogs, setAssertionLogs] = useState<string[]>([]);
  const [isScreenCrashed, setIsScreenCrashed] = useState(false);

  // Tick & Gameplay Timers
  const [tickerFps, setTickerFps] = useState(60);
  const [useDeltaTime, setUseDeltaTime] = useState(true);
  const [dronePos, setDronePos] = useState({ x: 0, y: 0, scale: 1 });
  const [countdownTimer, setCountdownTimer] = useState<number | null>(null);
  const [countdownPercent, setCountdownPercent] = useState(100);
  const [spellTriggered, setSpellTriggered] = useState(false);

  // Reflection/Blueprints node wires
  const [bpEditAnywhere, setBpEditAnywhere] = useState(true);
  const [bpBlueprintReadWrite, setBpBlueprintReadWrite] = useState(true);
  const [bpPulseActive, setBpPulseActive] = useState(false);
  const [bpTriggerLogs, setBpTriggerLogs] = useState<string[]>([]);

  // Asset async stream loaders
  const [spawnedSubclass, setSpawnedSubclass] = useState('AWizardHero');
  const [asyncLoadPercent, setAsyncLoadPercent] = useState(-1);
  const [asyncLoadLogs, setAsyncLoadLogs] = useState<string[]>([]);
  const [asyncThreadsActive, setAsyncThreadsActive] = useState(0);
  const [vsmShadowCacheLocked, setVsmShadowCacheLocked] = useState(false);

  // Dynamic values parser connecting Monaco editor to sandbox variables
  useEffect(() => {
    if (!documents || documents.length === 0) return;
    const cppCode = documents.find(d => d.filePath.endsWith('.cpp'))?.textBuffer || '';
    const hCode = documents.find(d => d.filePath.endsWith('.h'))?.textBuffer || '';
    const activeCode = cppCode + '\n' + hCode;

    const healthMatch = activeCode.match(/Health\s*=\s*(\d+)/i);
    const damageMatch = activeCode.match(/Damage\s*=\s*([\d.]+)/i);
    const aliveMatch = activeCode.match(/bIsAlive\s*=\s*(true|false)/i);
    const ammoMatch = activeCode.match(/Ammo\s*=\s*(\d+)/);
    const derefAmmoMatch = activeCode.match(/\*AmmoPtr\s*=\s*(\d+)/);

    if (healthMatch) {
      const parsedHP = parseInt(healthMatch[1], 10);
      setSimHealth(parsedHP);
      setSimMaxHealth(parsedHP);
    } else {
      setSimHealth(100);
      setSimMaxHealth(100);
    }

    if (damageMatch) {
      setSimDamage(parseFloat(damageMatch[1]));
    } else {
      setSimDamage(45.5);
    }

    if (aliveMatch) {
      setSimAlive(aliveMatch[1] === 'true');
    } else {
      setSimAlive(true);
    }

    if (ammoMatch) {
      setAmmoCount(parseInt(ammoMatch[1], 10));
    } else {
      setAmmoCount(30);
    }

    if (derefAmmoMatch && pointerWriteCompleted) {
      setAmmoCount(parseInt(derefAmmoMatch[1], 10));
    }

    setStrikeCount(0);
    setPointerWriteCompleted(false);
  }, [documents, currentTask]);

  const isCompileSuccess = currentSession?.compileStatus === 'success';
  const isTaskSuccess = currentSession?.completionState === 'completed';

  // Combat strike operators
  const triggerSkeletalStrike = () => {
    if (simHealth <= 0) return;
    setStrikeAnim(true);
    setTimeout(() => setStrikeAnim(false), 500);

    const dmgValue = Math.round(simDamage);
    const currentHP = simHealth - dmgValue;
    setSimHealth(currentHP);
    setStrikeCount(v => v + 1);

    const indicatorId = Date.now();
    setDamageIndicators(prev => [...prev, { id: indicatorId, value: dmgValue }]);
    setTimeout(() => {
      setDamageIndicators(prev => prev.filter(ind => ind.id !== indicatorId));
    }, 1200);

    if (currentHP <= 0) {
      setSimAlive(false);
    }
  };

  const resetBattleScene = () => {
    setSimHealth(simMaxHealth);
    setSimAlive(true);
    setStrikeCount(0);
  };

  // Address Dereferencer write
  const executeDerefWrite = () => {
    setPointerWriteCompleted(true);
    const cppCode = documents.find(d => d.filePath.endsWith('.cpp'))?.textBuffer || '';
    const derefAmmoMatch = cppCode.match(/\*AmmoPtr\s*=\s*(\d+)/);
    
    let targetVal = 15;
    if (derefAmmoMatch) {
      targetVal = parseInt(derefAmmoMatch[1], 10);
    }
    setAmmoCount(targetVal);

    setMemoryCells(cells => cells.map(cell => {
      if (cell.name === 'Ammo') {
        return { ...cell, value: String(targetVal) };
      }
      return cell;
    }));
  };

  const addVectorPushElement = () => {
    if (vectorElements.length >= 8) return;
    const values = [100, 200, 300, 400, 500];
    const nextVal = values[vectorElements.length] || Math.floor((Math.random() + 1) * 300);
    setVectorElements(prev => [...prev, nextVal]);
  };

  useEffect(() => {
    if (currentTask?.id === 'task_5') {
      if (isCompileSuccess) {
        setVectorElements([100, 200, 300]);
      } else {
        setVectorElements([]);
      }
    }
  }, [isCompileSuccess, currentTask]);

  useEffect(() => {
    if (currentTask?.id === 'task_3') {
      setLogPackets(isCompileSuccess ? [
        { id: 1, sender: 'client', text: 'std::cout << "Hello Unreal";' },
        { id: 2, sender: 'server', text: 'UDP Broadcast Stream: Established on port 7777' },
        { id: 3, sender: 'client', text: 'Successfully printed "Hello Unreal" to Std::Out log buffer.' }
      ] : [
        { id: 1, sender: 'server', text: 'Awaiting local client connection...' }
      ]);
    }
  }, [isCompileSuccess, currentTask]);

  // Dynamic loops evaluator
  const stepWhileOrForLoop = async () => {
    if (loopState === 'running') return;
    setLoopState('running');
    setLoopTotal(0);
    setLoopActiveIdx(0);

    let accum = 0;
    const isBreakTask = currentTask?.id === 'task_7_4';

    for (let i = 0; i < loopElements.length; i++) {
      setLoopActiveIdx(i);
      const val = loopElements[i];

      if (isBreakTask) {
        if (val === 0) {
          setLoopState('break');
          await delay(loopSpeed);
          break;
        }
        if (val < 0) {
          setLoopState('continue');
          await delay(loopSpeed);
          continue;
        }
      }

      setLoopState('running');
      accum += val;
      setLoopTotal(accum);
      await delay(loopSpeed);
    }
    setLoopState('finished');
  };

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  // Nested Duplicate elements scanner checks
  const stepNestedScanner = async () => {
    if (nestedState === 'scanning') return;
    setNestedState('scanning');
    setDuplicateMatchIndex(null);
    setNestedI(-1);
    setNestedJ(-1);

    const length = nestedElements.length;
    let found = false;

    for (let i = 0; i < length; i++) {
      setNestedI(i);
      await delay(loopSpeed);

      for (let j = i + 1; j < length; j++) {
        setNestedJ(j);
        await delay(loopSpeed);

        if (nestedElements[i] === nestedElements[j]) {
          setDuplicateMatchIndex([i, j]);
          setNestedState('matched');
          found = true;
          break;
        }
      }
      if (found) break;
    }
    if (!found) {
      setNestedState('finished');
    }
  };

  // --- TRIGGER ACTION MUTATORS FOR ADVANCED TABS ---

  // Trigger Local GC sweeps (Task 9)
  const triggerGCSweep = async () => {
    if (isGcRunning) return;
    setIsGcRunning(true);
    setGcProgress('sweeping');
    setGcConsoleLog([]);

    const log = (msg: string) => setGcConsoleLog(prev => [...prev, `[FGCUnrealCollector] ${msg}`]);

    log('Triggerig garbage collection pass sequentially...');
    await delay(300);
    log('Gathering cluster objects... Found 5 primary GC roots.');
    await delay(300);
    log('Scanning memory address space for naked / unprotected pointers...');
    await delay(400);

    setMemoryCells(cells => cells.map(cell => {
      if (!cell.isProtected && cell.type.endsWith('*')) {
        log(`CRASH WARNING: Swept GC-dangling unprotected pointer '${cell.name}' at address ${cell.addr}!`);
        return { ...cell, value: '0x00000000 (DANGLING!!)' };
      }
      if (cell.isProtected) {
        log(`Protected Variable verified: Retaining registered UPROPERTY block '${cell.name}'`);
      }
      return cell;
    }));

    await delay(300);
    log('Sinking unreferenced material pipelines...');
    setGcProgress('swept');
    setIsGcRunning(false);
  };

  // Trigger O(1) TMap key lookup scanning (Task 35)
  const triggerTMapLookup = async () => {
    if (tmapIsSearching) return;
    setTmapIsSearching(true);
    setTmapSearchResult(null);
    setTmapConsoleLog('Hashing key to index bucket: hash(Key) % BucketCount...');
    setTmapSearchingBucket(null);

    await delay(400);
    const key = tmapKeyInput.trim();
    const cleanKey = key.toLowerCase();
    
    // Simple custom hash calculation
    let hash = 0;
    for (let i = 0; i < cleanKey.length; i++) hash += cleanKey.charCodeAt(i);
    const targetBucket = hash % 4;

    setTmapSearchingBucket(targetBucket);
    setTmapConsoleLog(`Bucket target computed: Slot [${targetBucket}]. Querying contiguous memory register directly...`);
    await delay(400);

    const match = tmapEntries.find(entry => entry.key.toLowerCase() === cleanKey);
    if (match) {
      setTmapSearchResult(match.value);
      setTmapConsoleLog(`O(1) Step retrieval SUCCESS: Key '${key}' mapped to slot [${targetBucket}]. Value: '${match.value}'`);
    } else {
      setTmapSearchResult('ERROR: Entry not defined.');
      setTmapConsoleLog(`O(1) Step retrieval FAIL: Hash directed to Slot [${targetBucket}] but register contains null.`);
    }
    setTmapIsSearching(false);
  };

  // Launch countdown timer simulation (Task 46)
  const startGameplayTimer = () => {
    if (countdownTimer !== null) {
      clearInterval(countdownTimer);
    }
    setSpellTriggered(false);
    setCountdownPercent(100);
    
    let rem = 3.0;
    const intervalId = window.setInterval(() => {
      rem -= 0.1;
      if (rem <= 0) {
        clearInterval(intervalId);
        setCountdownTimer(null);
        setCountdownPercent(0);
        setSpellTriggered(true);
        // Clean event logs
        setConsoleLogItems(prev => [
          { type: 'warn', text: 'OnTimerExpired Countdown complete! Multicast spell explosion broadcasted.', cost: '1.45ms' },
          ...prev
        ]);
        setTimeout(() => setSpellTriggered(false), 2000);
      } else {
        setCountdownPercent(Math.round((rem / 3.0) * 100));
      }
    }, 100);

    setCountdownTimer(intervalId);
  };

  // Trigger multiline debug logs simulation (Task 10/32/34)
  const addVisualLogsMessage = (txt: string, type: 'log' | 'warn' | 'err' = 'log') => {
    let costStr = '0.04ms (FName Hash lookup)';
    if (activeLogType === 'FString') costStr = '0.45ms (Dynamic heap memory copy)';
    if (activeLogType === 'FText') costStr = '0.98ms (Table Localization translation parsing)';

    setConsoleLogItems(prev => [
      { type, text: `[UE_LOG] ${txt}`, cost: costStr },
      ...prev
    ]);
  };

  // Broadcast Multi-cast Delegate (Task 18)
  const broadcastMulticastEvent = async () => {
    if (bpPulseActive) return;
    setBpPulseActive(true);
    setBpTriggerLogs([]);

    const log = (msg: string) => setBpTriggerLogs(prev => [...prev, msg]);

    log('Event Dispatched: OnTakeDamage.Broadcast(Damage=45.5f);');
    await delay(350);
    log('Delegate Listener 1: UpdatePlayerHUDWidget() fired. Recalculating state...');
    await delay(350);
    log('Delegate Listener 2: PlayMetaSoundSoundEffect(SkelStrikeSpell) loaded onto GameAudioThread');
    await delay(350);
    log('Delegate Listener 3: TriggerQuestSystemObjectiveCheck() -> Evaluated 14 conditions, Quest is green.');
    await delay(300);
    
    setBpPulseActive(false);
  };

  // Soft Reference loads (Task 23/24)
  const triggerSoftLoad = () => {
    if (asyncLoadPercent !== -1) return;
    setAsyncLoadPercent(0);
    setAsyncLoadLogs([]);

    const log = (msg: string) => setAsyncLoadLogs(prev => [...prev, `[Streamable] ${msg}`]);

    log('TSoftObjectPtr loading sequence initialized...');
    
    let count = 0;
    const intervalId = window.setInterval(() => {
      count += 20;
      setAsyncLoadPercent(count);
      
      if (count === 20) log('Locating asset on disk: /Game/Enemies/Boss_Golgoth...');
      if (count === 60) log('Reading file binary streams into GPU cache pools...');
      if (count === 80) log('Resolving skeleton bone transformation handles...');
      
      if (count >= 100) {
        clearInterval(intervalId);
        log('Asset loaded successfully! Transforming reference to active heap.');
        setAsyncLoadPercent(-1);
      }
    }, 300);
  };

  // Dispatch heavy math lambda to parallel Thread (Task 38/40)
  const dispatchWorkerThread = async () => {
    setAsyncThreadsActive(prev => prev + 1);
    setConsoleLogItems(prev => [
      { type: 'log', text: 'Offloaded skeletal trajectory curves calculation to custom Worker-Thread [TaskGraph 3]', cost: '0.02ms (GameThread saved ~6.5ms)' },
      ...prev
    ]);
    await delay(1200);
    setAsyncThreadsActive(prev => Math.max(0, prev - 1));
    setConsoleLogItems(prev => [
      { type: 'warn', text: 'Worker-Thread task complete. Matrix indices returned to GameThread successfully.', cost: '1.20ms callback' },
      ...prev
    ]);
  };

  // DeltaTime dynamic displacement loop
  useEffect(() => {
    let id: number;
    let offset = 0;
    const animate = () => {
      // Scale dynamic drift speed based on target framing
      const scalar = useDeltaTime ? (1.0 / tickerFps) * 60 : 1.0;
      offset += 0.05 * scalar;
      
      setDronePos({
        x: Math.sin(offset) * 45,
        y: Math.cos(offset) * 15,
        scale: 1 + Math.sin(offset * 2) * 0.1
      });
      id = requestAnimationFrame(animate);
    };
    id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [tickerFps, useDeltaTime]);

  // Determine lesson group mode
  const getTaskGroup = (taskId: string): 'combat' | 'console' | 'pointers' | 'arrays' | 'control_flow' | 'loops' | 'nested_loops' | 'actor_lifecycle' | 'reflection_bp' | 'assets_pro' | 'optimization_pro' => {
    if (taskId === 'task_1' || taskId === 'task_2') return 'combat';
    if (['task_3', 'task_10', 'task_32', 'task_34'].includes(taskId)) return 'console';
    if (['task_4', 'task_9', 'task_15', 'task_16', 'task_31', 'task_36', 'task_37', 'task_39', 'task_42', 'task_43'].includes(taskId)) return 'pointers';
    if (['task_5', 'task_35'].includes(taskId)) return 'arrays';
    if (['task_6', 'task_19', 'task_30'].includes(taskId)) return 'control_flow';
    if (taskId === 'task_7_5') return 'nested_loops';
    if (taskId.startsWith('task_7')) return 'loops';
    if (['task_13', 'task_14', 'task_45', 'task_46'].includes(taskId)) return 'actor_lifecycle';
    if (['task_8', 'task_11', 'task_12', 'task_17', 'task_18', 'task_20', 'task_26', 'task_27', 'task_28', 'task_29', 'task_33', 'task_44'].includes(taskId)) return 'reflection_bp';
    if (['task_NEW_LIGHTING', 'task_opt_1', 'task_opt_2', 'task_opt_3', 'task_opt_4', 'task_opt_5', 'task_opt_6'].includes(taskId)) return 'optimization_pro';
    return 'assets_pro';
  };

  const mode = getTaskGroup(currentTask?.id || '');

  // Parse custom health statuses for switch visualizers
  const getParsedHealthState = (hp: number) => {
    if (hp > 50) return { label: 'HEALTHY', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (hp > 0) return { label: 'WOUNDED', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: 'DEAD', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
  };

  // Multi-tier RPG-Hardware and Network Impact Matrix calculations
  const getCoreDiagnostics = (): { gpu: string; cpu: string; ram: string; vram: string; ping: string; info: string; ueFeatures: string[]; missingFeatures: string[] } => {
    switch (mode) {
      case 'combat':
        return {
          gpu: '0.12ms (Skinned meshes bone updates)',
          cpu: '1.45ms (Collision traces and character state evaluations)',
          ram: '84MB (Hero meshes, animations, skeletal weights)',
          vram: '32MB (Shader skeleton buffers)',
          ping: 'Average +2.5ms (UDP Net packet evaluations)',
          info: 'Direct skeletal strike actions and damage indicator triggers mapped dynamically.',
          ueFeatures: ['SkeletalMeshComponent dynamic morph bounds', 'PoseableMesh attachments'],
          missingFeatures: ['Automatic broadphase hitbox collision pruning (requires spatial hashing logic)']
        };
      case 'console':
        return {
          gpu: '0.00ms (Text-heavy simulation)',
          cpu: activeLogType === 'FString' ? '0.45ms (Overhead string copies)' : activeLogType === 'FName' ? '0.02ms (Global symbol hashing)' : '0.85ms (Localization translates)',
          ram: activeLogType === 'FString' ? '320KB (Accumulates heap memory stutters)' : '40KB (Symbol index arrays)',
          vram: '0.5MB (Unicode character caching)',
          ping: 'None',
          info: 'Evaluates the performance differences between dynamic FStrings, symbols (FNames), and FText localized blocks.',
          ueFeatures: ['String localization lookup tables', 'FName global string dictionary indexing'],
          missingFeatures: ['Automated string-duplication memory sweeping (forces manual use of String Tables)']
        };
      case 'pointers':
        return {
          gpu: '0.00ms (Core RAM layout)',
          cpu: '0.05ms (O(1) direct address dereferencing)',
          ram: '16 bytes (Naked memory allocation without class blocks, highly fragmented under high loops)',
          vram: '0.00ms',
          ping: 'None',
          info: 'Deref pointers write straight to RAM coordinate segments. GC sweep recycles blocks without macros.',
          ueFeatures: ['Unreal Garbage Collector reference trees', 'UProperty reflection tree headers'],
          missingFeatures: ['Naked C++ raw pointers memory protections (GC ignores naked objects completely)']
        };
      case 'arrays':
        return {
          gpu: '0.00ms',
          cpu: 'O(1) instant hash lookup (vs O(N) linear iteration for simple vectors)',
          ram: '32KB (Bucket registry and hash maps arrays)',
          vram: '0.00ms',
          ping: 'None',
          info: 'TMap lookup performs key symbol hashing, resolving target bucket instantly without sweeping elements.',
          ueFeatures: ['TMap hash-map buckets serialization', 'TArray contiguous dynamic memory reallocation'],
          missingFeatures: ['Multi-threaded atomic map lookups (you must implement critical locks manually)']
        };
      case 'control_flow':
        return {
          gpu: '0.00ms',
          cpu: '0.01ms (Simple branch registers)',
          ram: '4 bytes (UENUM state tracking blocks)',
          vram: '0.00ms',
          ping: '+1.5ms (Server State replication interval)',
          info: 'State evaluation is handled via local conditional nodes. Assertions prevent thread violations.',
          ueFeatures: ['check(), ensure(), verify() error handlers', 'UENUM byte-serialization macros'],
          missingFeatures: ['Automatic player state rollback validation (requires custom predictor state wrappers)']
        };
      case 'loops':
      case 'nested_loops':
        return {
          gpu: '0.00ms',
          cpu: mode === 'nested_loops' ? '4.80ms O(N^2) (Very heavy on wide inventories!)' : '0.12ms O(N) (Linear sum evaluations)',
          ram: '128 bytes (Registers stack storage)',
          vram: '0.00ms',
          ping: 'None',
          info: 'Nested loops step indices iteratively. O(N^2) calculations degrade performance exponentially.',
          ueFeatures: ['Fast range-based TArray iterators', 'Pre-allocated heap structures'],
          missingFeatures: ['O(N) unique array lookup hashing (must implement custom spatial registry)']
        };
      case 'actor_lifecycle':
        return {
          gpu: '1.20ms (FVector transform evaluations)',
          cpu: useDeltaTime ? '1.80ms (Frame independent movement ticks)' : '5.40/8.20ms (Game runs at speed of graphics, highly unstable!)',
          ram: '24KB (Kinematic positional buffers)',
          vram: '8MB (Positional buffer matrices)',
          ping: '+12ms (Network replication tick checks)',
          info: 'Ticks moving drone representation. FPS slider changes frame timings. Timers cue Spell cast callbacks.',
          ueFeatures: ['Component Ticking sharing loops', 'FTimerManager gameplay callbacks register'],
          missingFeatures: ['Automatic sub-stepped physics sync under high server loops (must enable async physics manually)']
        };
      case 'reflection_bp':
        return {
          gpu: '0.22ms (Visual Node wires dynamic shader lines)',
          cpu: bpPulseActive ? '1.45ms (Disperses multi-cast event pointers to 3 listeners)' : '0.02ms',
          ram: '640KB (Event listener registry vectors)',
          vram: '1.2MB (Node graph graphics cache)',
          ping: '+15ms (Multicast delegate RPCs)',
          info: 'Reflection graph linking delegates and blueprint visibility specifiers interactively.',
          ueFeatures: ['Unreal Header Tool (UHT) macros generating metadata', 'Multicast dynamic delegate bindings'],
          missingFeatures: ['Dynamic delegate compile-time type-safety warnings (fails at runtime unless properly bound)']
        };
      case 'optimization_pro':
        const tid = currentTask?.id;
        if (tid === 'task_NEW_LIGHTING') return { gpu: '-4.5ms (Shadow Map bounds locking)', cpu: '0.12ms', ram: '45MB', vram: '-120MB', ping: 'None', info: 'Hardware Lumen raytracing bypassed via dynamic bounds.', ueFeatures: ['Virtual Shadow Maps', 'Distance Fields'], missingFeatures: ['Dynamic probe cache culling'] };
        if (tid === 'task_opt_1') return { gpu: '0.0ms', cpu: '-3.2ms (Contiguous memory iteration)', ram: '-15MB (Struct padding)', vram: '0.0ms', ping: 'None', info: 'Optimal L1/L2 cache hits through data-oriented arrays.', ueFeatures: ['TArray', 'Fast TMap operations'], missingFeatures: ['Built-in struct padding analyzers'] };
        if (tid === 'task_opt_2') return { gpu: '0.0ms', cpu: '-5.8ms (GameThread bypass)', ram: '12MB (Worker queues)', vram: '0.0ms', ping: 'None', info: 'Offloading pathfinding to TaskGraph workers.', ueFeatures: ['TaskGraph', 'FAsyncTask'], missingFeatures: ['Automated atomic locking'] };
        if (tid === 'task_opt_3') return { gpu: '0.0ms', cpu: '-8.5ms (Mass Entity updates)', ram: '-120MB (No UObject overhead)', vram: '0.0ms', ping: 'None', info: '10,000 active entities ticking securely in ECS.', ueFeatures: ['MassEntity', 'Fragments'], missingFeatures: ['Visual ECS debugger tool'] };
        if (tid === 'task_opt_4') return { gpu: '0.0ms', cpu: '-2.4ms (Retained Slate widgets)', ram: '8MB', vram: '4MB', ping: 'None', info: 'Manual invalidation prevents Slate pre-pass loops.', ueFeatures: ['Retainer Box', 'Invalidation Box'], missingFeatures: ['Auto-dirtying bindings'] };
        if (tid === 'task_opt_5') return { gpu: '0.0ms', cpu: '-4.6ms (Replication prioritization)', ram: '110MB', vram: '0.0ms', ping: '<25ms (Stable!)', info: 'IRIS and NetDormancy strip replication bandwidth.', ueFeatures: ['IRIS Repl', 'NetDormancy'], missingFeatures: ['Automated replication stress testing'] };
        return { gpu: '-6.2ms (PSO and ISM batching)', cpu: '-3.5ms (Draw Thread limits)', ram: '48MB', vram: '-250MB (Shared textures)', ping: 'None', info: 'Baking PSOs and instancing saves draw calls.', ueFeatures: ['HISM', 'PSO Cache'], missingFeatures: ['Automatic shader permutation cullers'] };
      default:
        return {
          gpu: '1.85ms (LOD and shader caches evaluation)',
          cpu: asyncThreadsActive > 0 ? '0.15ms (Offloaded to parallel thread)' : '6.45ms (Async load prevent Game thread freeze)',
          ram: '12.4MB (Asynchronous assets streaming heap pools)',
          vram: '46.0MB (Async texture allocations)',
          ping: 'None',
          info: 'Async Streamable manager stream-loads boss character assets in background. Math offloaded safely.',
          ueFeatures: ['FStreamableManager async loading system', 'TaskGraph parallel worker threads'],
          missingFeatures: ['Automated automatic cache sweep collectors (must write custom memory unloaders)']
        };
    }
  };

  const diagnostics = getCoreDiagnostics();

  return (
    <div className="flex-1 flex flex-col bg-slate-900 border-l border-white/10 overflow-hidden h-full">
      {/* Viewport Header */}
      <div className="h-11 border-b border-white/10 bg-black/40 flex items-center justify-between px-4 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-rose-400" />
          <span className="text-[10px] font-mono font-semibold text-white tracking-widest uppercase">
            UViewportClient::Render ({mode.toUpperCase()} VIEWPORT)
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-start min-h-0 relative select-none">
        
        {/* Verification Success Tag */}
        {isTaskSuccess && (
          <div className="mb-4 bg-emerald-700/80 backdrop-blur border border-emerald-500 rounded p-2 text-[10px] font-mono flex items-center gap-2 text-white shadow-xl max-w-xs shrink-0 self-start">
            <CheckCircle className="w-4 h-4" />
            <div>
              <span className="font-bold">VERIFIED_COMPILE: TRUE</span>
              <div className="text-[8px] text-emerald-200">All Success Criteria Met</div>
            </div>
          </div>
        )}

        {/* Unreal C++ System Diagnostic Metrics HUD */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 p-3.5 bg-black/45 rounded-xl border border-white/5 mb-4 shrink-0 font-mono text-[10px]">
          <div>
            <span className="text-zinc-500 uppercase block mb-0.5">GPU Raster Timer:</span>
            <span className="font-bold text-sky-400 block">{diagnostics.gpu}</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase block mb-0.5">CPU Thread Load:</span>
            <span className="font-bold text-amber-400 block">{diagnostics.cpu}</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase block mb-0.5">Sys RAM Footprint:</span>
            <span className="font-bold text-purple-400 block">{diagnostics.ram}</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase block mb-0.5">VRAM Allocation:</span>
            <span className="font-bold text-pink-400 block">{diagnostics.vram}</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase block mb-0.5">Avg Ping (30Hz):</span>
            <span className="font-bold text-emerald-400 block">{diagnostics.ping}</span>
          </div>
        </div>

        {/* Dynamic Sandbox Display */}
        <div className="flex-1 min-h-[300px] relative flex flex-col">
          <AnimatePresence mode="wait">
            {isScreenCrashed ? (
              <motion.div
                key="crash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-red-950/90 border border-red-500 flex flex-col items-center justify-center p-6 text-center font-mono rounded-xl shadow-2xl"
              >
                <AlertTriangle className="w-12 h-12 text-red-400 animate-bounce mb-3" />
                <h3 className="text-red-300 font-extrabold text-sm uppercase tracking-widest">! UNCONTROLLED CORE FAULT !</h3>
                <p className="text-xs text-red-400 max-w-sm my-2 leading-relaxed">
                  Exception ACCESS_VIOLATION triggered by thread execution safety: 
                </p>
                <div className="bg-black/60 p-3 rounded border border-red-500/20 text-xs text-red-400 max-w-xs text-left my-1">
                  {assertionLogs[0] || "Assertion check() failed: code variable null pointer violation inside Arena.cpp. Thread frozen."}
                </div>
                <button
                  onClick={() => setIsScreenCrashed(false)}
                  className="mt-4 px-4 py-1 bg-red-800 hover:bg-red-700 text-white font-bold text-xs rounded transition-all shadow-inner active:scale-95"
                >
                  Restart Sandbox Kernal
                </button>
              </motion.div>
            ) : null}

            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 w-full bg-black/60 rounded-xl border border-white/10 p-4 flex flex-col shadow-2xl overflow-hidden relative"
            >
              {/* Scanlines overlay to feel like local client terminal window */}
              <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-20" />

              {/* 1. COMBAT VIEW (Task 1 & 2) */}
              {mode === 'combat' && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide border-b border-white/5 pb-2">
                    UWorldState::CombatSession_01
                  </div>

                  <div className="flex-1 flex items-center justify-around my-6 relative min-h-[160px]">
                    <div className="flex flex-col items-center relative">
                      <motion.div
                        animate={strikeAnim ? { x: [-10, 15, 0], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] } : {}}
                        className={`w-16 h-20 rounded-lg flex items-center justify-center text-white relative transition-all ${
                          simAlive ? 'bg-gradient-to-t from-blue-700 to-sky-500 shadow-[0_0_15px_rgba(2,132,199,0.4)]' : 'bg-red-950/60 rotate-90 scale-90 translate-y-4'
                        }`}
                      >
                        <Bird className={`w-8 h-8 ${simAlive ? 'text-white' : 'text-zinc-650'}`} />
                        {damageIndicators.map(ind => (
                          <motion.div
                            key={ind.id}
                            initial={{ opacity: 1, y: 0, scale: 0.8 }}
                            animate={{ opacity: 0, y: -50, scale: 1.4 }}
                            transition={{ duration: 1 }}
                            className="absolute -top-12 text-red-400 font-extrabold text-xl font-mono"
                          >
                            -{ind.value}!
                          </motion.div>
                        ))}
                      </motion.div>
                      <span className="text-[10px] font-mono text-white mt-3 font-semibold uppercase">Hero character</span>
                      <div className="mt-2 w-32 bg-zinc-800 rounded border border-zinc-700 p-1.5 space-y-1">
                        <div className="flex justify-between text-[8px] font-mono text-zinc-300">
                          <span>Health:</span>
                          <span className="text-white font-bold">{simHealth} / {simMaxHealth}</span>
                        </div>
                        <div className="w-full bg-zinc-950 h-1.5 rounded overflow-hidden">
                          <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${Math.max(0, (simHealth / simMaxHealth) * 100)}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="w-1 border-l-2 border-dashed border-zinc-800 h-16" />

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-20 bg-gradient-to-t from-red-800 to-rose-600 rounded-lg flex items-center justify-center text-white shadow-[0_0_15px_rgba(244,63,94,0.3)] border border-red-500/30">
                        <span className="text-2xl">💀</span>
                      </div>
                      <span className="text-[10px] font-mono text-white mt-3 font-semibold uppercase">skeleton mob</span>
                      <div className="mt-2 w-32 bg-zinc-800 border border-zinc-700 p-1.5 text-center rounded">
                        <span className="text-[8px] font-mono text-zinc-400">Weapon DMG:</span>
                        <div className="text-[11px] font-mono text-rose-400 font-bold">{simDamage}f</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 border-t border-white/5 pt-3">
                    <button
                      onClick={resetBattleScene}
                      className="p-1 px-3 text-[10px] bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono font-semibold rounded hover:bg-zinc-700 transition-all flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset
                    </button>
                    <button
                      disabled={!simAlive}
                      onClick={triggerSkeletalStrike}
                      className="p-1.5 px-4 text-[10px] bg-rose-600 border border-rose-500 text-white font-mono font-bold rounded shadow-lg hover:bg-rose-500 disabled:opacity-30 active:scale-95 transition-all flex items-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Strike ({strikeCount}/2)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. CONSOLE & TYPE STREAMS (Task 3, 10, 32, 34) */}
              {mode === 'console' && (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                        String Types & Logging Inspector
                      </span>
                      <div className="flex gap-1 text-[9px]">
                        {['FString', 'FName', 'FText'].map(type => (
                          <button
                            key={type}
                            onClick={() => setActiveLogType(type as any)}
                            className={`px-2 py-0.5 rounded font-mono ${
                              activeLogType === type 
                                ? 'bg-rose-950 text-rose-300 border border-rose-500/30' 
                                : 'bg-zinc-800/60 text-zinc-400 hover:text-white'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-2 bg-zinc-950/40 rounded border border-white/5 text-[9px] text-zinc-400 mb-3 space-y-1">
                      {activeLogType === 'FString' && (
                        <p><strong>FString:</strong> Dynamic, mutable char array. High allocation costs (+0.45ms) when modified due to dynamic reallocations in the RAM heap.</p>
                      )}
                      {activeLogType === 'FName' && (
                        <p><strong>FName:</strong> Symbols. Instantly compared in O(1) via dynamic index hashes. High memory efficiency (8 bytes) inside standard bones and game maps.</p>
                      )}
                      {activeLogType === 'FText' && (
                        <p><strong>FText:</strong> Localization block. Automatically caches localized text strings. Ideal for client-facing dialogue text interfaces (BG3 / Witcher 3).</p>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 my-2 flex flex-col gap-1 font-mono text-xs bg-black/60 p-3 h-40 border border-zinc-800 rounded-lg overflow-y-auto">
                    {consoleLogItems.map((log, idx) => (
                      <div key={idx} className="flex justify-between items-start py-0.5 border-b border-white/5 last:border-0 text-[10px]">
                        <div className="flex gap-1.5">
                          <span className={`uppercase font-bold text-[8px] px-1 rounded ${
                            log.type === 'err' ? 'bg-red-950 text-red-400' : log.type === 'warn' ? 'bg-amber-950 text-amber-400' : 'bg-sky-950 text-sky-400'
                          }`}>
                            {log.type}
                          </span>
                          <span className="text-zinc-300">{log.text}</span>
                        </div>
                        <span className="text-[9px] text-zinc-650 shrink-0 font-bold">{log.cost}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 border-t border-white/5 pt-3 select-none">
                    <button
                      onClick={() => addVisualLogsMessage(`WitcherQuest_Act1::Stage_01 - Dispatched Novigrad Crowds Update`, 'log')}
                      className="flex-1 p-1 text-[9px] bg-zinc-805 border border-zinc-700 text-zinc-300 rounded hover:bg-zinc-700 font-mono transition-all"
                    >
                      Log Standard info
                    </button>
                    <button
                      onClick={() => addVisualLogsMessage(`PathFinding Warning: H-Navmesh route for NPC [40] stalled. Resolving collision broadphase.`, 'warn')}
                      className="flex-1 p-1 text-[9px] bg-amber-950/30 border border-amber-900/40 text-amber-400 rounded hover:bg-amber-800/40 font-mono transition-all"
                    >
                      Log warning
                    </button>
                    <button
                      onClick={() => addVisualLogsMessage(`CRITICAL STALL: Material instance Permutation shader count exceeded [128]. Draw Thread frozen for 16.7ms.`, 'err')}
                      className="flex-1 p-1 text-[9px] bg-red-950/30 border border-red-900/40 text-red-400 rounded hover:bg-red-800/40 font-mono transition-all"
                    >
                      Log Error
                    </button>
                  </div>
                </div>
              )}

              {/* 3. MEMORY POINTERS & GC SWEEP (Task 4, 9, 15, 16, 31, 36, 37, 39, 42, 43) */}
              {mode === 'pointers' && (
                <div className="flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                        RAM Register & Garbage Collection Sandbox
                      </span>
                      <span className="text-[9px] tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {currentTask?.id === 'task_9' ? 'GC PROTECTED DEMO' : 'ADDRESS POINTER INSPECTOR'}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                    {/* RAM Register UI */}
                    <div className="border border-white/5 p-2 bg-black/40 rounded-lg overflow-y-auto max-h-48">
                      <div className="text-[9px] uppercase tracking-wider text-zinc-500 mb-2 font-mono font-bold">Physical RAM Cells (0x00A1F0...)</div>
                      <div className="space-y-1 font-mono text-[10px]">
                        {memoryCells.map((cell, idx) => (
                          <div
                            key={idx}
                            onMouseEnter={() => setHoveredCell(idx)}
                            onMouseLeave={() => setHoveredCell(null)}
                            className={`flex justify-between p-1.5 rounded transition-colors ${
                              hoveredCell === idx ? 'bg-white/10' : 'bg-white/5'
                            } ${cell.isProtected ? 'border-l-2 border-emerald-500' : 'border-l-2 border-red-500'}`}
                          >
                            <div className="flex gap-1.5">
                              <span className="text-zinc-500 text-[8px]">{cell.addr}</span>
                              <span className="text-sky-300 font-bold">{cell.name}</span>
                              <span className="text-[8px] text-zinc-600">({cell.type})</span>
                            </div>
                            <span className={`font-bold ${cell.value.includes('DANGLING') ? 'text-red-400' : 'text-emerald-400'}`}>
                              {cell.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* GC status drawer */}
                    <div className="border border-white/5 p-2 bg-black/60 rounded-lg flex flex-col justify-between font-mono text-[9px]">
                      <div>
                        <div className="text-zinc-500 uppercase font-bold mb-1.5">GC Logs Console Feed:</div>
                        <div className="h-28 overflow-y-auto space-y-1 pr-1 bg-black/40 p-1.5 rounded border border-white/5">
                          {gcConsoleLog.length > 0 ? (
                            gcConsoleLog.map((log, i) => <div key={i} className="text-zinc-400 leading-normal">{log}</div>)
                          ) : (
                            <div className="text-zinc-600 text-center py-4">Awaiting GC collections trigger...</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <span className="text-zinc-400">GC Protection:</span>
                        <span className="font-bold text-emerald-400">UPROPERTY() Macro</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-white/5 pt-3">
                    <button
                      onClick={executeDerefWrite}
                      className="flex-1 p-2 bg-indigo-600/90 hover:bg-indigo-500 border border-indigo-500 font-mono text-[10px] font-bold text-white rounded shadow-inner active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>*AmmoPtr = 15; (Write coordinate)</span>
                    </button>
                    <button
                      onClick={triggerGCSweep}
                      disabled={isGcRunning}
                      className="flex-1 p-2 bg-rose-900 hover:bg-rose-800 disabled:opacity-40 border border-rose-600 font-mono text-[10px] font-bold text-white rounded shadow-inner active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Collect Garbage Sweep</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 4. TMAP HASH MAP SCOPES & BROADPHASES (Task 5 & 35) */}
              {mode === 'arrays' && (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                        TMap Hash Map O(1) Bucket Indexing vs Arrays (TArray)
                      </span>
                      <span className="text-[9px] uppercase hover:text-white px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        BROADPHASE PHYSICS SOLVER
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                    {/* TMap Bucket list */}
                    <div className="border border-white/5 p-2 bg-black/40 rounded-lg flex flex-col justify-between">
                      <div>
                        <div className="text-[9px] font-mono text-zinc-500 uppercase font-bold mb-2">Hash Space Register (Buckets [0-3])</div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                          {Array.from({ length: 4 }).map((_, i) => {
                            const entriesInBucket = tmapEntries.filter(e => e.bucket === i);
                            const isHl = tmapSearchingBucket === i;
                            return (
                              <div
                                key={i}
                                className={`p-2 rounded border transition-all ${
                                  isHl 
                                    ? 'bg-rose-950/40 border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)] animate-pulse' 
                                    : 'bg-zinc-800/50 border-white/5'
                                }`}
                              >
                                <div className="text-[8px] text-zinc-500">BUCKET STATE [{i}]</div>
                                <div className="mt-1 space-y-1">
                                  {entriesInBucket.length > 0 ? (
                                    entriesInBucket.map((entry, idx) => (
                                      <div key={idx} className="flex flex-col">
                                        <span className="text-yellow-400 font-bold">{entry.key}</span>
                                        <span className="text-[9px] text-zinc-400">{entry.value}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <span className="text-zinc-650 italic text-[9px]">Empty registry</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Vector simulation container in standard arrays */}
                      <div className="border-t border-white/5 pt-2 mt-2">
                        <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                          <span>Vector Stack items count:</span>
                          <span>Cap: {vectorElements.length}/8 elements</span>
                        </div>
                        <div className="flex gap-1 overflow-x-auto min-h-8">
                          {vectorElements.map((v, i) => (
                            <div key={i} className="px-2.5 py-1 bg-zinc-800 border border-sky-500 rounded text-[10px] text-white font-mono font-bold">
                              {v}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Hashing outputs */}
                    <div className="border border-white/5 p-2 bg-black/60 rounded-lg flex flex-col justify-between text-[10px] font-mono">
                      <div>
                        <div className="text-zinc-500 uppercase font-bold mb-1.5">Array Map Hashing Analytics:</div>
                        <div className="p-2.5 bg-zinc-950/60 border border-white/5 rounded text-[10px] text-zinc-400 h-28 overflow-y-auto leading-normal">
                          {tmapConsoleLog || 'Awaiting O(1) hash lookup query...'}
                          {tmapSearchResult && (
                            <div className="mt-2 p-1 bg-emerald-950/20 border border-emerald-500/20 rounded text-emerald-400 font-bold">
                              Result Data Found: {tmapSearchResult} (retrieved instantly!)
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Search controls */}
                      <div className="flex gap-1 pt-1.5 border-t border-white/5">
                        <input
                          type="text"
                          value={tmapKeyInput}
                          onChange={e => setTmapKeyInput(e.target.value)}
                          placeholder="Type 'IronSword'..."
                          className="flex-1 p-1 bg-zinc-800 border border-zinc-700 text-white rounded text-[10px] font-mono font-bold"
                        />
                        <button
                          onClick={triggerTMapLookup}
                          className="p-1 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-mono font-bold inline-flex items-center gap-1"
                        >
                          <Search className="w-3 h-3" /> Query
                        </button>
                      </div>
                    </div>
                  </div>

                  {currentTask?.id === 'task_5' && (
                    <div className="flex items-center justify-center pt-2 border-t border-white/5">
                      <button
                        disabled={vectorElements.length === 0}
                        onClick={addVectorPushElement}
                        className="p-1.5 px-4 text-[10px] bg-zinc-800 hover:bg-zinc-700 border border-zinc-750 text-white rounded font-mono font-bold active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <Zap className="w-3 h-3 text-emerald-400" /> Push Back Element
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 5. CONTROL FLOW, STATEMACHINES, AND ASSERTS (Task 6, 19, 30) */}
              {mode === 'control_flow' && (
                <div className="flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                        Switch State Machines & Game-thread Asserts check()
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                    {/* Left: switch UENUM controls */}
                    <div className="border border-white/5 p-2 bg-black/40 rounded-lg flex flex-col justify-between">
                      <div>
                        <div className="text-[9px] font-mono text-zinc-500 uppercase font-bold mb-1.5">UENUM :: EPlayerState Switch status</div>
                        <div className="flex flex-wrap gap-1.5">
                          {['IDLE', 'COMBAT', 'RESTING', 'DEAD'].map(state => (
                            <button
                              key={state}
                              onClick={() => {
                                setActivePlayerState(state as any);
                                if (state === 'DEAD') setSliderHealth(0);
                                else if (sliderHealth === 0) setSliderHealth(75);
                              }}
                              className={`px-3 py-1.5 rounded font-mono text-[9px] font-bold ${
                                activePlayerState === state
                                  ? 'bg-rose-950 text-rose-300 border border-rose-500/30 shadow'
                                  : 'bg-zinc-800/50 text-zinc-400 hover:text-white'
                              }`}
                            >
                              {state}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Health flow slider */}
                      <div className="mt-4 border-t border-white/5 pt-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">Health slider compiler tracker:</span>
                          <span className={`text-[10px] font-mono font-bold inline-block px-1.5 py-0.5 rounded ${getParsedHealthState(sliderHealth).color}`}>
                            {getParsedHealthState(sliderHealth).label}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={sliderHealth}
                          onChange={e => {
                            const hp = parseInt(e.target.value, 10);
                            setSliderHealth(hp);
                            if (hp === 0) setActivePlayerState('DEAD');
                            else if (activePlayerState === 'DEAD') setActivePlayerState('IDLE');
                          }}
                          className="w-full accent-rose-400 cursor-pointer"
                        />
                        <div className="text-center font-mono text-[10px] text-white mt-1">Value: {sliderHealth}% health points</div>
                      </div>
                    </div>

                    {/* Right: Assertions Diagnostic Terminal */}
                    <div className="border border-white/5 p-2 bg-black/60 rounded-lg flex flex-col justify-between font-mono text-[10px]">
                      <div>
                        <div className="text-zinc-500 uppercase font-bold mb-1.5">Event Assert logs:</div>
                        <div className="h-28 overflow-y-auto space-y-1 pr-1 bg-black/40 p-1.5 rounded border border-white/5 text-[9px] text-zinc-400">
                          <p className="text-zinc-500">[Diagnostics] Awaiting assert deployment...</p>
                          {assertionLogs.map((log, i) => (
                            <div key={i} className="text-amber-400">{log}</div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-1 pt-1.5 border-t border-white/5 select-none text-[8px]">
                        <button
                          onClick={() => {
                            setIsScreenCrashed(true);
                            setAssertionLogs(prev => ['[check()] FATAL: check(bIsAlive) Assertion failed in Player.cpp! Thread killed directly.', ...prev]);
                          }}
                          className="flex-1 p-1 bg-red-950/40 border border-red-900/40 text-red-400 font-bold rounded hover:bg-red-800/40"
                        >
                          Trigger check() Fatal
                        </button>
                        <button
                          onClick={() => {
                            setAssertionLogs(prev => ['[ensure()] WARN: ensure(Health > 0) failed! Captured callstack data trace smoothly.', ...prev]);
                          }}
                          className="flex-1 p-1 bg-amber-950/40 border border-amber-900/40 text-amber-400 font-bold rounded hover:bg-amber-800/40"
                        >
                          Trigger ensure() Warn
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. SINGLE LOOPS (Task 7.1 to 7.4) */}
              {mode === 'loops' && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">
                    {currentTask?.title || ''} Simulation Loop Matrix
                  </div>

                  <div className="flex justify-center flex-wrap gap-2.5 my-3 min-h-[50px]">
                    {loopElements.map((val, idx) => {
                      const isActive = idx === loopActiveIdx;
                      return (
                        <div
                          key={idx}
                          className={`w-12 h-12 rounded border font-mono flex flex-col items-center justify-center transition-all relative ${
                            isActive
                              ? 'bg-kingfisher-warm border-kingfisher-deep text-black font-extrabold scale-110 shadow-[0_0_15px_rgba(233,187,147,0.5)]'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                          }`}
                        >
                          <span className="text-[8px] opacity-75">[{idx}]</span>
                          <span className="text-xs font-bold">{val}</span>
                          {idx === loopActiveIdx && (
                            <span className="absolute -bottom-5 text-[7px] font-bold text-kingfisher-warm font-mono tracking-widest">
                              ACTIVE
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-black/30 border border-white/5 rounded p-2 text-xs font-mono flex justify-between items-center px-4 mt-2 mb-2">
                    <div className="text-neutral-400">Total Loop Accumulator:</div>
                    <div className="font-extrabold text-kingfisher-warm text-sm">{loopTotal}</div>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={stepWhileOrForLoop}
                      disabled={loopState === 'running'}
                      className="p-1.5 px-4 text-[10px] bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 border border-zinc-700 text-white rounded font-mono font-bold flex items-center gap-1.5 shadow active:scale-95 transition-all"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>{loopState === 'idle' || loopState === 'finished' ? 'Evaluate Loop Step' : 'Evaluating...'}</span>
                    </button>
                    {loopState !== 'idle' && (
                      <span className="text-[9px] font-mono font-semibold uppercase tracking-wider text-rose-400 animate-pulse">
                        STATE: {loopState}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* 7. NESTED LOOPS COMPILER (Task 7.5) */}
              {mode === 'nested_loops' && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">
                    O(N^2) Nested Scanning Duplicate Finder
                  </div>

                  <div className="flex justify-center gap-3 my-4">
                    {nestedElements.map((val, idx) => {
                      const isI = idx === nestedI;
                      const isJ = idx === nestedJ;
                      const isMatched = duplicateMatchIndex && duplicateMatchIndex.includes(idx);
                      
                      let bg = 'bg-zinc-800 border-white/5 text-zinc-350';
                      if (isMatched) {
                        bg = 'bg-rose-950/40 border-rose-500 text-rose-300 font-extrabold shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-pulse';
                      } else if (isI) {
                        bg = 'bg-indigo-950/40 border-indigo-500 text-indigo-400 font-bold scale-105';
                      } else if (isJ) {
                        bg = 'bg-amber-950/40 border-amber-500 text-amber-400 font-bold scale-105';
                      }

                      return (
                        <div
                          key={idx}
                          className={`w-11 h-11 rounded border font-mono flex flex-col items-center justify-center transition-all relative ${bg}`}
                        >
                          <span className="text-[7px] text-zinc-500">[{idx}]</span>
                          <span className="text-xs">{val}</span>
                          <div className="absolute -bottom-5 flex flex-col items-center text-[7px] font-bold font-mono">
                            {isI && <span className="text-indigo-400">INDEX i</span>}
                            {isJ && <span className="text-amber-400">INDEX j</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-black/30 rounded p-2 text-[10px] font-mono flex items-center justify-between border border-white/5 mt-4 min-h-8 px-4">
                    <span className="text-zinc-400">Matrix Scanner Output:</span>
                    <span className="font-bold text-zinc-300 uppercase shrink-0">
                      {nestedState === 'idle' && 'Awaiting duplicate sweeps...'}
                      {nestedState === 'scanning' && `Loops nested comparison: comparing idx ${nestedI} with ${nestedJ}`}
                      {nestedState === 'matched' && 'Match Swapped: Duplicate found (Index 1 & 3 contain duplicate 12!)'}
                      {nestedState === 'finished' && 'Sweep completed. No duplicates matched.'}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                      onClick={stepNestedScanner}
                      disabled={nestedState === 'scanning'}
                      className="p-1 px-4 text-[10px] bg-zinc-800 hover:bg-zinc-750 disabled:opacity-40 border border-zinc-700 text-white rounded font-mono font-bold flex items-center gap-1.5 shadow active:scale-95 transition-all"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Start Duplicate Scanner</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 8. LEVEL VIEWPORT PHYSICAL ACTOR, TIMERS, TRANSFORMS (Task 13, 14, 45, 46) */}
              {mode === 'actor_lifecycle' && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      2D LEVEL VIEWPORT: Actor Tick and DeltaTime Ticking
                    </span>
                  </div>

                  {/* Level Viewboard graphic */}
                  <div className="flex-1 min-h-[140px] bg-black/60 rounded border border-white/5 relative flex items-center justify-center overflow-hidden">
                    {/* Viewport grid vector outlines */}
                    <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-10" />
                    
                    <motion.div
                      animate={{
                        x: dronePos.x,
                        y: dronePos.y,
                        scale: dronePos.scale
                      }}
                      className="w-10 h-10 rounded-full bg-indigo-600 border border-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.5)] flex items-center justify-center text-white font-bold text-xs"
                    >
                      🤖
                    </motion.div>

                    {spellTriggered && (
                      <motion.div
                        initial={{ scale: 0.1, opacity: 1 }}
                        animate={{ scale: 3, opacity: 0 }}
                        transition={{ duration: 1.2 }}
                        className="absolute w-24 h-24 rounded-full border-4 border-rose-500 bg-rose-500/10 pointer-events-none"
                      />
                    )}

                    {countdownTimer !== null && (
                      <div className="absolute top-2 right-2 bg-black/80 p-1.5 rounded text-[8px] font-mono text-zinc-400 flex items-center gap-1.5 border border-white/5">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                        <span>Timer active: {countdownPercent}%</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2 text-[10px] font-mono">
                    <div className="border border-white/5 p-2 bg-black/40 rounded flex flex-col justify-between space-y-1">
                      <div className="flex justify-between items-center text-[9px] text-zinc-500 font-bold uppercase">Tick Engine controls</div>
                      <div className="flex gap-2 text-[9px]">
                        {[{ label: '120fps', val: 120 }, { label: '60fps', val: 60 }, { label: '10fps (mobile)', val: 10 }].map(opt => (
                          <button
                            key={opt.val}
                            onClick={() => setTickerFps(opt.val)}
                            className={`flex-1 py-1 rounded font-bold ${
                              tickerFps === opt.val ? 'bg-indigo-950 text-indigo-400 border border-indigo-500/20' : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-2 pt-1 border-t border-white/5">
                        <span className="text-[9px] text-zinc-400 font-semibold">Enable DeltaTime scale:</span>
                        <input
                          type="checkbox"
                          checked={useDeltaTime}
                          onChange={e => setUseDeltaTime(e.target.checked)}
                          className="accent-rose-500 w-3.5 h-3.5"
                        />
                      </div>
                    </div>

                    <div className="border border-white/5 p-2 bg-black/40 rounded flex flex-col justify-between text-[9px]">
                      <div>
                        <span className="text-zinc-500 uppercase font-bold block mb-1">DeltaTime Movement Math Formula:</span>
                        {useDeltaTime ? (
                          <span className="text-emerald-400 block p-1 bg-emerald-950/20 rounded border border-emerald-950/40">
                            Displacement = 45.0f * (1.0f / {tickerFps}s) = {(45.0 * (1.0 / tickerFps)).toFixed(3)} units/tick (Constant speed!)
                          </span>
                        ) : (
                          <span className="text-red-400 block p-1 bg-red-950/20 rounded border border-red-950/30">
                            Displacement = 45.0f units/tick (Runs speed of render loop! Ticks 12x faster at 120 FPS than 10 FPS.)
                          </span>
                        )}
                      </div>

                      <button
                        onClick={startGameplayTimer}
                        className="mt-2 w-full p-1.5 bg-rose-600 hover:bg-rose-500 font-bold text-white rounded font-mono text-[10px]"
                      >
                        SetTimer(CooldownCallback, 3.0s);
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 9. REFLECTION GRAPH & BLUEPRINTS WIRE NETWORK (Task 8, 11, 12, 17, 18, 20, 26, 27, 28, 29, 33, 44) */}
              {mode === 'reflection_bp' && (
                <div className="flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest animate-pulse">
                        UCLASS Blueprint Node Orchestrator & Multi-cast Delegates
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 my-2 font-mono text-[9px]">
                    <div className="border border-white/5 p-2 bg-black/40 rounded flex flex-col justify-between">
                      <div>
                        <div className="text-[9px] uppercase font-bold text-zinc-500 mb-2">Simulated BP Details Panel</div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>EditAnywhere Macro:</span>
                            <input
                              type="checkbox"
                              checked={bpEditAnywhere}
                              onChange={e => setBpEditAnywhere(e.target.checked)}
                              className="accent-rose-500 w-3 h-3"
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <span>BlueprintReadWrite Macro:</span>
                            <input
                              type="checkbox"
                              checked={bpBlueprintReadWrite}
                              onChange={e => setBpBlueprintReadWrite(e.target.checked)}
                              className="accent-rose-500 w-3 h-3"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-white/5 pt-3 space-y-1">
                        <span className="text-zinc-500 block">PROPERTY VISIBILITY IN GRAPH:</span>
                        {bpEditAnywhere ? (
                          <span className="text-emerald-400 bg-emerald-950/20 p-1 rounded border border-emerald-900/30 font-bold block">
                            VISIBLE - Editable on Class blueprints details.
                          </span>
                        ) : (
                          <span className="text-zinc-550 bg-zinc-800/40 p-1 rounded font-bold block">
                            HIDDEN - Invisible to Unreal Editor details panel.
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Nodes wire pulses */}
                    <div className="border border-white/5 p-2 bg-black/60 rounded flex flex-col justify-between">
                      <div>
                        <span className="text-zinc-500 uppercase font-bold block mb-1.5">Delegate Callback log:</span>
                        <div className="h-28 overflow-y-auto space-y-1 bg-black/30 p-1.5 border border-white/5 text-zinc-400">
                          {bpTriggerLogs.length > 0 ? (
                            bpTriggerLogs.map((log, i) => <div key={i} className="text-sky-350">{log}</div>)
                          ) : (
                            <div className="text-zinc-650 text-center py-4 text-[9px]">Awaiting event broadcast trigger...</div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={broadcastMulticastEvent}
                        disabled={bpPulseActive}
                        className="mt-2 w-full p-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold rounded font-mono text-[10px]"
                      >
                        Disptach OnTakeDamage.Broadcast();
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 10. ENTERPRISE ASYNC LOADERS & DYNAMIC TEMPLATES (Task 21, 22, 23, 24, 25, 38, 40, 41, 47) */}
              {mode === 'assets_pro' && (
                <div className="flex-1 flex flex-col justify-between text-xs font-mono">
                  <div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                        TSoftObjectPtr Stream loaders & Thread worker queues
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 my-2 text-[10px]">
                    {/* Soft reference loadings progress */}
                    <div className="border border-white/5 p-2 bg-black/50 rounded flex flex-col justify-between">
                      <div>
                        <div className="text-[9px] uppercase font-bold text-zinc-500 mb-2">Asynchronous Assets loader (FStreamableManager)</div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[9px]">
                            <span>Soft class spawns:</span>
                            <span className="text-sky-300 font-bold">{spawnedSubclass}</span>
                          </div>
                          
                          {asyncLoadPercent !== -1 ? (
                            <div className="w-full bg-zinc-950 h-3 rounded overflow-hidden relative">
                              <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${asyncLoadPercent}%` }} />
                              <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white font-bold">{asyncLoadPercent}%</span>
                            </div>
                          ) : (
                            <span className="text-zinc-500 text-[9px] italic block">Reference stream in standby state.</span>
                          )}
                        </div>
                      </div>

                      <div className="h-20 overflow-y-auto space-y-0.5 bg-zinc-950/60 p-1 rounded border border-white/5 text-[8px] text-zinc-400">
                        {asyncLoadLogs.map((log, i) => <div key={i}>{log}</div>)}
                      </div>

                      <button
                        onClick={triggerSoftLoad}
                        className="p-1 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded text-[9px] font-bold"
                      >
                        Stream soft character layout
                      </button>
                    </div>

                    {/* Thread task offloader queues */}
                    <div className="border border-white/5 p-2 bg-black/60 rounded flex flex-col justify-between">
                      <div>
                        <div className="text-[9px] uppercase font-bold text-zinc-500 mb-2">Game Core Thread Work Dispatcher</div>
                        <div className="space-y-1 text-[8px]">
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-zinc-500">Main Game Thread status:</span>
                            <span className="text-emerald-400 font-bold uppercase">Smooth ticking (16.7ms safe)</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-zinc-500">Active worker thread load:</span>
                            <span className="text-yellow-400 font-bold">{asyncThreadsActive} dynamic lambdas running</span>
                          </div>
                        </div>
                      </div>

                      <div className="border border-white/5 p-2 bg-black/40 rounded flex flex-col justify-between gap-2 text-[9px]">
                        <span className="text-zinc-400">VSM Shadow Map Cache (Task 47):</span>
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] text-zinc-500">Enable wind materials culling past 45m:</span>
                          <button
                            onClick={() => {
                              setVsmShadowCacheLocked(!vsmShadowCacheLocked);
                              addVisualLogsMessage(
                                vsmShadowCacheLocked 
                                  ? 'Unlocked materials vertex sway. Shadow Map cache hits drops, GPU demand increased!' 
                                  : 'Locked dynamic vertex sway. Shadow Cache hits stabilizes, saving 3.5ms GPU time!',
                                'warn'
                              );
                            }}
                            className={`p-1 px-3 text-[9px] font-bold rounded ${vsmShadowCacheLocked ? 'bg-emerald-950 text-emerald-400' : 'bg-red-910 text-red-400 border border-red-500/20'}`}
                          >
                            {vsmShadowCacheLocked ? 'VSM LOCKED (Safe)' : 'VSM UNLOCKED (3.5ms lag)'}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={dispatchWorkerThread}
                        className="w-full p-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded text-[9.5px]"
                      >
                        Dispatch curves calculation to parallel Worker Thread
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 11. AAA OPTIMIZATION PRO (Tasks 47-53) */}
              {mode === 'optimization_pro' && (
                <div className="flex-1 flex flex-col justify-between text-xs font-mono">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                       <Zap className="w-3 h-3 text-emerald-400" />
                       AAA Enterprise Optimization Profiler
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center p-6 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-scanlines opacity-20 pointer-events-none" />
                    <div className="w-full flex items-center justify-between mb-8">
                       <div className="flex flex-col items-center">
                          <Cpu className="w-8 h-8 text-amber-400 mb-2" />
                          <span className="text-[9px] uppercase text-zinc-500">Game Thread Process</span>
                       </div>
                       <div className="flex-1 h-px bg-gradient-to-r from-amber-500/0 via-emerald-500/50 to-blue-500/0 mx-4 relative animate-pulse">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-black text-[8px] text-emerald-400 border border-emerald-500/30 rounded">
                            {currentTask?.id === 'task_opt_2' ? 'ASYNC THREAD DISPATCH' : 'OPTIMAL PIPELINE'}
                          </div>
                       </div>
                       <div className="flex flex-col items-center">
                          <Monitor className="w-8 h-8 text-blue-400 mb-2" />
                          <span className="text-[9px] uppercase text-zinc-500">Render Hardware</span>
                       </div>
                    </div>
                    
                    <div className="w-full bg-zinc-950/80 border border-white/10 p-4 rounded text-center">
                       <span className="text-emerald-400 font-bold block text-sm mb-2">{currentTask?.title}</span>
                       <span className="text-zinc-400 text-[10px]">{currentTask?.objective?.substring(0, 150)}...</span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 w-full">
                       <div className="border border-emerald-500/20 bg-emerald-950/20 p-2 rounded text-center">
                         <span className="block text-[8px] text-emerald-500 tracking-widest uppercase mb-1">Engine Solution</span>
                         <span className="text-[9px] text-zinc-300 font-bold">{diagnostics.ueFeatures[0]}</span>
                       </div>
                       <div className="border border-amber-500/20 bg-amber-950/20 p-2 rounded text-center">
                         <span className="block text-[8px] text-amber-500 tracking-widest uppercase mb-1">Impact Vectors</span>
                         <span className="text-[10px] text-white font-bold">{diagnostics.cpu} / {diagnostics.gpu}</span>
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
