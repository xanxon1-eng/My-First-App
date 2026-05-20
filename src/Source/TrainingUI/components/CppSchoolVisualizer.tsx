import React, { useState, useEffect } from 'react';
import { useTrainingCore } from '../../TrainingCore/core/TrainingCore';
import { Bird, Play, Zap, Shield, Heart, HelpCircle, Activity, RefreshCw, Cpu, Award, HardDrive, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function CppSchoolVisualizer() {
  const { currentTask, documents, currentSession } = useTrainingCore();

  // Simulation states
  const [simHealth, setSimHealth] = useState(100);
  const [simMaxHealth, setSimMaxHealth] = useState(100);
  const [simDamage, setSimDamage] = useState(45.5);
  const [simAlive, setSimAlive] = useState(true);
  const [activeTab, setActiveTab] = useState<'simulation' | 'mem_graph'>('simulation');

  // Task-specific simulator states
  const [strikeCount, setStrikeCount] = useState(0);
  const [strikeAnim, setStrikeAnim] = useState(false);
  const [damageIndicators, setDamageIndicators] = useState<{ id: number; value: number }[]>([]);
  const [pointerWriteCompleted, setPointerWriteCompleted] = useState(false);
  const [ammoCount, setAmmoCount] = useState(30);

  // Vector push_back entries
  const [vectorElements, setVectorElements] = useState<number[]>([]);
  
  // Interactive Slider for Control Flow evaluation
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

  // Parse user edited values dynamically from Monaco editor text buffers to make simulation react to code!
  useEffect(() => {
    if (!documents || documents.length === 0) return;
    const cppCode = documents.find(d => d.filePath.endsWith('.cpp'))?.textBuffer || '';
    const hCode = documents.find(d => d.filePath.endsWith('.h'))?.textBuffer || '';
    const activeCode = cppCode + '\n' + hCode;

    // Regex extractors
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

    // Reset strike values when task changes
    setStrikeCount(0);
    setPointerWriteCompleted(false);
  }, [documents, currentTask]);

  // Handle task evaluations specifically
  const isCompileSuccess = currentSession?.compileStatus === 'success';
  const isTaskSuccess = currentSession?.completionState === 'completed';

  // Trigger strike handler
  const triggerSkeletalStrike = () => {
    if (simHealth <= 0) return;
    setStrikeAnim(true);
    setTimeout(() => setStrikeAnim(false), 500);

    const dmgValue = Math.round(simDamage);
    const currentHP = simHealth - dmgValue;
    setSimHealth(currentHP);
    setStrikeCount(v => v + 1);

    // Append Damage floaty
    const indicatorId = Date.now();
    setDamageIndicators(prev => [...prev, { id: indicatorId, value: dmgValue }]);
    setTimeout(() => {
      setDamageIndicators(prev => prev.filter(ind => ind.id !== indicatorId));
    }, 1200);

    if (currentHP <= 0) {
      setSimAlive(false);
    }
  };

  // Reset Task 2 properties
  const resetBattleScene = () => {
    setSimHealth(simMaxHealth);
    setSimAlive(true);
    setStrikeCount(0);
  };

  // Deref pointer flash write helper
  const executeDerefWrite = () => {
    setPointerWriteCompleted(true);
    const cppCode = documents.find(d => d.filePath.endsWith('.cpp'))?.textBuffer || '';
    const derefAmmoMatch = cppCode.match(/\*AmmoPtr\s*=\s*(\d+)/);
    if (derefAmmoMatch) {
      setAmmoCount(parseInt(derefAmmoMatch[1], 10));
    } else {
      setAmmoCount(15); // Fallback standard starter
    }
  };

  // Vector push elements helper
  const addVectorPushElement = () => {
    if (vectorElements.length >= 8) return;
    const values = [100, 200, 300, 400, 500];
    const nextVal = values[vectorElements.length] || Math.floor((Math.random() + 1) * 300);
    setVectorElements(prev => [...prev, nextVal]);
  };

  // Compile helper to populate initial vector
  useEffect(() => {
    if (currentTask?.id === 'task_5') {
      if (isCompileSuccess) {
        setVectorElements([100, 200, 300]);
      } else {
        setVectorElements([]);
      }
    }
  }, [isCompileSuccess, currentTask]);

  // Network logs generator helper
  useEffect(() => {
    if (currentTask?.id === 'task_3') {
      if (isCompileSuccess) {
        setLogPackets([
          { id: 1, sender: 'client', text: 'std::cout << "Hello Unreal";' },
          { id: 2, sender: 'server', text: 'UDP Broadcast Stream: Established on port 7777' },
          { id: 3, sender: 'client', text: 'Successfully printed "Hello Unreal" to Std::Out log buffer.' }
        ]);
      } else {
        setLogPackets([
          { id: 1, sender: 'server', text: 'Awaiting local client connection...' }
        ]);
      }
    }
  }, [isCompileSuccess, currentTask]);

  // Loop Step Simulator
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

  // Nested Loop stepping duplicate scanner
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

  if (!currentTask) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-kingfisher-muted bg-kingfisher-dark/40 h-full p-6 text-center">
        <Activity className="w-12 h-12 mb-4 opacity-30 text-kingfisher-blue" />
        <p className="text-sm">Compile your code to watch live graphics.</p>
      </div>
    );
  }

  // Evaluate Custom user health states for Task 6
  const getParsedHealthState = (hp: number) => {
    // Exact Javascript equivalent of what they implement in task_6
    if (hp > 50) return { label: 'HEALTHY', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (hp > 0) return { label: 'WOUNDED', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: 'DEAD', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 border-l border-kingfisher-border/30 overflow-hidden h-full">
      {/* Viewport Header tabs */}
      <div className="h-11 border-b border-kingfisher-border/30 bg-black/40 flex items-center justify-between px-4 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-kingfisher-warm" />
          <span className="text-[10px] font-mono font-semibold text-white tracking-widest uppercase">
            UViewportClient::Render
          </span>
        </div>

        <div className="flex bg-black/40 p-1 rounded-md border border-white/5">
          <button
            onClick={() => setActiveTab('simulation')}
            className={`px-3 py-1 text-[9px] font-mono font-bold tracking-wider rounded uppercase transition-all ${
              activeTab === 'simulation' ? 'bg-kingfisher-blue/20 text-white shadow-sm' : 'text-kingfisher-muted hover:text-white'
            }`}
          >
            Virtual Game Window
          </button>
          <button
            onClick={() => setActiveTab('mem_graph')}
            className={`px-3 py-1 text-[9px] font-mono font-bold tracking-wider rounded uppercase transition-all ${
              activeTab === 'mem_graph' ? 'bg-kingfisher-blue/20 text-white shadow-sm' : 'text-kingfisher-muted hover:text-white'
            }`}
          >
            HEX RAM Layout
          </button>
        </div>
      </div>

      {/* Render selected tab */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-center min-h-0 relative select-none">
        
        {/* Verification Success Tag */}
        {isTaskSuccess && (
          <div className="absolute top-4 left-4 z-10 bg-emerald-700/80 backdrop-blur border border-emerald-500 rounded p-2 text-[10px] font-mono flex items-center gap-2 text-white shadow-xl">
            <CheckCircle className="w-4 h-4" />
            <div>
              <span className="font-bold">VERIFIED_COMPILE: TRUE</span>
              <div className="text-[8px] text-emerald-200">All Success Criteria Met</div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'simulation' ? (
            <motion.div
              key="sim"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 w-full bg-black/60 rounded-xl border border-kingfisher-border/30 p-4 flex flex-col min-h-[300px] shadow-2xl relative overflow-hidden"
            >
              {/* Background scanlines overlay to feel like local terminal screen */}
              <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-20" />

              {/* Task 1 & 2: Structural Variables and Skeletal Strike Strike */}
              {(currentTask.id === 'task_1' || currentTask.id === 'task_2') && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide border-b border-white/5 pb-2">
                    UWorldState::CombatSession_01
                  </div>

                  <div className="flex-1 flex items-center justify-around my-6 relative">
                    {/* Character Column */}
                    <div className="flex flex-col items-center relative">
                      {/* Character Sprite Placeholder */}
                      <motion.div
                        animate={
                          strikeAnim
                            ? { x: [-10, 15, 0], filter: ['brightness(1)', 'brightness(1.8) red', 'brightness(1)'] }
                            : {}
                        }
                        className={`w-16 h-20 rounded-lg flex items-center justify-center text-white relative transition-all ${
                          simAlive ? 'bg-gradient-to-t from-blue-700 to-sky-500 shadow-[0_0_15px_rgba(2,132,199,0.4)]' : 'bg-red-950/60 leading-none text-zinc-500 rotate-90 scale-90 translate-y-4'
                        }`}
                      >
                        <Bird className={`w-8 h-8 ${simAlive ? 'text-white' : 'text-zinc-600'}`} />

                        {/* Damage Number Indicators */}
                        {damageIndicators.map((ind) => (
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
                      
                      <span className="text-[10px] font-mono text-white mt-3 font-semibold uppercase">Hero Character</span>
                      
                      {/* Live stats */}
                      <div className="mt-2 w-32 bg-zinc-800 rounded-md border border-zinc-700 p-1.5 space-y-1">
                        <div className="flex justify-between text-[8px] font-mono">
                          <span className="text-zinc-400">Health:</span>
                          <span className="text-white font-bold">{simHealth} / {simMaxHealth}</span>
                        </div>
                        <div className="w-full bg-red-950 h-1.5 rounded overflow-hidden">
                          <div
                            className="bg-red-500 h-full transition-all duration-300"
                            style={{ width: `${Math.max(0, (simHealth / simMaxHealth) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Combat divider or strike animation */}
                    <div className="w-1 border-l-2 border-dashed border-zinc-800 h-16" />

                    {/* Skeletal Enemy Column */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-20 bg-gradient-to-t from-red-800 to-rose-600 rounded-lg flex items-center justify-center text-white shadow-[0_0_15px_rgba(244,63,94,0.3)] border border-red-500/30">
                        <span className="text-xl font-mono">💀</span>
                      </div>
                      <span className="text-[10px] font-mono text-white mt-3 font-semibold uppercase">Skeleton mob</span>
                      
                      <div className="mt-2 w-32 bg-zinc-800 rounded border border-zinc-700 p-1.5 text-center">
                        <span className="text-[9px] font-mono text-zinc-400">Weapon DMG:</span>
                        <div className="text-[11px] font-mono text-rose-400 font-bold">{simDamage}f</div>
                      </div>
                    </div>
                  </div>

                  {/* Task 2: Action trigger buttons */}
                  {currentTask.id === 'task_2' && (
                    <div className="flex items-center justify-center gap-3 border-t border-white/5 pt-3">
                      <button
                        onClick={resetBattleScene}
                        className="p-1 px-3 text-[10px] bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono font-semibold rounded hover:bg-zinc-700 active:scale-95 transition-all flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Reset
                      </button>
                      <button
                        disabled={!simAlive}
                        onClick={triggerSkeletalStrike}
                        className="p-1.5 px-4 text-[10px] bg-rose-600 border border-rose-500 text-white font-mono font-bold rounded shadow-lg shadow-rose-900/30 hover:bg-rose-500 disabled:opacity-30 active:scale-95 transition-all flex items-center gap-1"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Strike Hero ({strikeCount}/2)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Task 3: Client Server standard console logs stream */}
              {currentTask.id === 'task_3' && (
                <div className="flex-1 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">
                    Network Standard Socket Logging
                  </span>
                  
                  <div className="flex-1 my-4 flex flex-col gap-2 font-mono text-xs bg-black/50 p-4 border border-zinc-800 rounded-lg overflow-y-auto max-h-52">
                    {logPackets.map((pkt) => (
                      <div key={pkt.id} className="flex gap-2">
                        <span className={`text-[9px] uppercase px-1 rounded font-bold shrink-0 ${pkt.sender === 'client' ? 'bg-indigo-950 text-indigo-400 border border-indigo-500/20' : 'bg-amber-950 text-amber-400 border border-amber-500/20'}`}>
                          {pkt.sender}
                        </span>
                        <span className={pkt.sender === 'client' ? 'text-white' : 'text-zinc-400'}>{pkt.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-zinc-400 border-t border-white/5 pt-2 flex items-center gap-1 font-mono">
                    <Info className="w-3 h-3 text-kingfisher-blue" />
                    <span>Compile successfully using `std::cout` to stream packets to server console logs.</span>
                  </div>
                </div>
              )}

              {/* Task 4: Pointers / Hex memory mapping deref write */}
              {currentTask.id === 'task_4' && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide border-b border-white/5 pb-2 mb-4">
                    Gun module & Memory address dereferencing Write
                  </div>

                  <div className="flex-1 flex items-center justify-around my-2 gap-4">
                    {/* Visual weapon view */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-36 h-20 bg-zinc-800 border border-zinc-700 rounded-lg flex flex-col items-center justify-center p-3">
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-6 rounded-full border border-yellow-500/30 transition-all ${
                                i < Math.floor(ammoCount / 5) ? 'bg-yellow-400' : 'bg-zinc-950'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400">Ammo Clip: <span className="text-white font-bold">{ammoCount} / 30</span></div>
                      </div>
                    </div>

                    {/* Flash Deref trigger */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={executeDerefWrite}
                        className="p-2 py-1.5 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500 font-mono font-bold rounded shadow-xl active:scale-95 transition-all flex items-center gap-1"
                      >
                        <Zap className="w-3.5 h-3.5 text-yellow-300 fill-current" />
                        <span>*AmmoPtr = 15;</span>
                      </button>
                      <span className="text-[8px] font-mono text-zinc-500 max-w-xs leading-relaxed text-center">Dereferences through AmmoPtr memory slot and modifies Ammo variable block.</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-indigo-950/20 border border-indigo-900/30 rounded mt-2 text-[9px] font-mono text-indigo-300 leading-normal">
                    <span className="font-bold text-indigo-400">Pointer Truth:</span> A pointer slot is a RAM coordinate. `AmmoPtr` holds address `0x7FFEE3C` pointing directly to variables.
                  </div>
                </div>
              )}

              {/* Task 5: Dynamic Arrays push_back heap layout */}
              {currentTask.id === 'task_5' && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-4">
                    std::vector&lt;int32&gt; Scores (Heap Buffer)
                  </div>

                  {/* Array elements rendering */}
                  <div className="flex-1 flex items-center justify-center gap-2 flex-wrap max-h-36 overflow-y-auto mb-4">
                    {vectorElements.length === 0 ? (
                      <div className="h-20 flex items-center justify-center text-zinc-600 font-mono text-xs border-2 border-dashed border-zinc-800 rounded-lg w-full">
                        Empty Vector Container. Compile code to populate elements.
                      </div>
                    ) : (
                      vectorElements.map((val, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ scale: 0.2, y: 15 }}
                          animate={{ scale: 1, y: 0 }}
                          className="w-14 h-14 bg-zinc-800 border border-kingfisher-blue rounded-md flex flex-col items-center justify-center text-white relative shadow-md font-mono"
                        >
                          <span className="text-[8px] text-zinc-400 absolute top-1">[{idx}]</span>
                          <span className="text-xs font-bold text-kingfisher-warm mt-3">{val}</span>
                        </motion.div>
                      ))
                    )}
                  </div>

                  <div className="flex items-center justify-center pt-2 border-t border-white/5">
                    <button
                      disabled={vectorElements.length === 0}
                      onClick={addVectorPushElement}
                      className="p-1 px-4 text-[10px] bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded font-mono font-bold active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Zap className="w-3 h-3 text-emerald-400" /> Push Back Element
                    </button>
                  </div>
                </div>
              )}

              {/* Task 6: Control Flow, slider dynamic mapping */}
              {currentTask.id === 'task_6' && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide border-b border-white/5 pb-2 mb-4">
                    Control Flow Tester: switch / if condition
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    {/* Character status graphic */}
                    <div className="flex items-center gap-4">
                      {/* Interactive graphic state based on health */}
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center border font-semibold text-lg font-mono ${
                        sliderHealth > 50 ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400' :
                        sliderHealth > 0 ? 'bg-amber-950/40 border-amber-500/50 text-amber-400 animate-pulse' :
                        'bg-red-950/40 border-red-500/50 text-red-500'
                      }`}>
                        {sliderHealth > 50 ? '🛡️' : sliderHealth > 0 ? '🤕' : '💀'}
                      </div>
                      
                      <div>
                        <div className="text-[9px] font-mono text-zinc-500 uppercase font-semibold">GetHealthState() Return:</div>
                        <div className={`text-base font-mono font-extrabold border px-2.5 py-1 rounded inline-block mt-1 ${getParsedHealthState(sliderHealth).color}`}>
                          {getParsedHealthState(sliderHealth).label}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Slider */}
                    <div className="w-full max-w-sm mt-2">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                        <span>Dead (0)</span>
                        <span>Wounded (1-50)</span>
                        <span>Healthy (51-100)</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderHealth}
                        onChange={(e) => setSliderHealth(parseInt(e.target.value, 10))}
                        className="w-full accent-kingfisher-warm cursor-pointer"
                      />
                      <div className="text-center font-mono text-xs text-white mt-1.5 font-bold">Health: {sliderHealth}%</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Task 7.1 to 7.4 Loops Breakers and continues stepper */}
              {(currentTask.id.startsWith('task_7') && currentTask.id !== 'task_7_5') && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">
                    {currentTask.title} Simulation Loop Matrix
                  </div>

                  <div className="flex justify-center flex-wrap gap-2.5 my-3">
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

                  {/* Summary row */}
                  <div className="bg-black/30 border border-white/5 rounded p-2 text-xs font-mono flex justify-between items-center px-4 mt-2 mb-2">
                    <div className="text-neutral-400">Total Loop Accumulator:</div>
                    <div className="font-extrabold text-kingfisher-warm text-sm">{loopTotal}</div>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={stepWhileOrForLoop}
                      disabled={loopState === 'running'}
                      className="p-1 px-4 text-[10px] bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 border border-zinc-700 text-white rounded font-mono font-bold flex items-center gap-1.5 shadow active:scale-95 transition-all"
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

              {/* Task 7.5: Nested loops scanner O(N^2) duplicates finder */}
              {currentTask.id === 'task_7_5' && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">
                    O(N^2) Nested Scanning Scanner
                  </div>

                  <div className="flex justify-center gap-3 my-4">
                    {nestedElements.map((val, idx) => {
                      const isI = idx === nestedI;
                      const isJ = idx === nestedJ;
                      const isMatched = duplicateMatchIndex && duplicateMatchIndex.includes(idx);
                      
                      let bg = 'bg-zinc-800 border-zinc-750 text-zinc-300';
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
                          
                          {/* Inner loop variables indicator */}
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
                      {nestedState === 'idle' && 'Awaiting scanner sweep...'}
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

              {/* Fallback general template for remaining / advanced tasks */}
              {!currentTask.id.startsWith('task_') && (
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <Award className="w-10 h-10 text-kingfisher-warm mb-3 animate-bounce" />
                  <span className="font-mono text-xs text-white font-bold">{currentTask.title}</span>
                  <p className="text-[10px] font-mono text-zinc-500 mt-1 max-w-xs leading-normal">
                    Gameplay Sandbox generated compiled binary module. Success criteria verified safely via AST Bridge and Clangd evaluation.
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            // HEX RAM Memory Layout tab
            <motion.div
              key="hex"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 w-full bg-black/80 rounded-xl border border-kingfisher-border/30 p-4 flex flex-col min-h-[300px] shadow-2xl font-mono overflow-auto"
            >
              <div className="text-[10px] border-b border-white/5 pb-2 uppercase tracking-wider text-zinc-500 mb-3 flex justify-between items-center">
                <span>Kernel RAM Map (Hex blocks)</span>
                <span className="text-zinc-600">64-Bit Addressing</span>
              </div>

              {/* Memory block lines */}
              <div className="space-y-2.5 text-xs text-zinc-400">
                <div className="flex gap-4 p-1 rounded hover:bg-white/5 border border-transparent">
                  <span className="text-zinc-600 font-semibold">0x7FFEE3C0</span>
                  <span className="text-indigo-400 font-bold">[ 100 ]</span>
                  <span className="text-zinc-500">int32 Health variable stack segment</span>
                </div>
                <div className="flex gap-4 p-1 rounded hover:bg-white/5 border border-transparent">
                  <span className="text-zinc-600 font-semibold">0x7FFEE3C4</span>
                  <span className="text-amber-400 font-bold">[ 45.50 ]</span>
                  <span className="text-zinc-500">float Damage variable stack segment</span>
                </div>
                <div className="flex gap-4 p-1 rounded hover:bg-white/5 border border-transparent">
                  <span className="text-zinc-600 font-semibold">0x7FFEE3C8</span>
                  <span className="text-emerald-400 font-bold">[ true ]</span>
                  <span className="text-zinc-500">bool bIsAlive variable stack segment</span>
                </div>
                <div className="flex gap-4 p-1 rounded hover:bg-white/5 border border-transparent">
                  <span className="text-zinc-600 font-semibold">0x7FFEE3D0</span>
                  <span className="text-white font-bold">[ 0x7FFEE3C0 ]</span>
                  <span className="text-zinc-500">int32* AmmoPtr pointing to Address 0x7FFEE3C0</span>
                </div>
                <div className="flex gap-4 p-1 rounded hover:bg-white/5 border border-transparent">
                  <span className="text-zinc-600 font-semibold">0x7FFEE3F0</span>
                  <span className="text-indigo-400 font-bold">[ Vector array capacity(8) ]</span>
                  <span className="text-zinc-500">A heap buffer tracking int32 vectors</span>
                </div>
              </div>

              <div className="mt-auto p-3 bg-zinc-900/40 border border-zinc-800 rounded text-[9px] text-zinc-500 leading-normal">
                <span className="text-zinc-400 font-bold uppercase block mb-1">Architecture Reflection Point</span>
                When Unreal compiles, UProperty references are scanned so that pointers are indexed. Any bare pointer has no reflection reference block in Kernel RAM and risks being garbage collected.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
