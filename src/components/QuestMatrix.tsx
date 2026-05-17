import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollText, ChevronRight, Split, AlertCircle, Map, Zap } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface QuestNode {
  id: string;
  title: string;
  description: string;
  choices: Choice[];
  worldImpact?: string;
  state: 'locked' | 'unlocked' | 'completed';
}

interface Choice {
  id: string;
  text: string;
  outcomeDescription: string;
  nextQuestIds: string[];
  impactRating: 'low' | 'high' | 'critical';
}

export default function QuestMatrix() {
  const [activeQuest, setActiveQuest] = useState<string | null>('1');
  const [worldState, setWorldState] = useState<string[]>([]);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);

  const quests: QuestNode[] = [
    {
      id: '1',
      title: "The Whispering Woods",
      description: "A village is plagued by a mysterious entity hiding in the old oak. Investigation reveals it's a spirit of a forgotten druid.",
      state: 'unlocked',
      choices: [
        {
          id: 'c1',
          text: "Exorcise the spirit",
          outcomeDescription: "The woods become safe, but the village loses its natural protection.",
          nextQuestIds: ['2a'],
          impactRating: 'high'
        },
        {
          id: 'c2',
          text: "Re-bind the spirit to the oak",
          outcomeDescription: "The entity remains, providing fertility to the land but demanding tribute.",
          nextQuestIds: ['2b'],
          impactRating: 'critical'
        }
      ]
    },
    {
      id: '2a',
      title: "The Dry Season",
      description: "Without the druid's spirit, the crops are failing. A greedy merchant offers a solution.",
      state: completedQuests.includes('1') && worldState.includes('Exorcised') ? 'unlocked' : 'locked',
      choices: [
        { id: 'c3', text: "Buy the merchant's seeds", outcomeDescription: "The village survives but is now in debt.", nextQuestIds: [], impactRating: 'low' },
        { id: 'c4', text: "Hunt for a new spirit", outcomeDescription: "Dangerous ritual begins.", nextQuestIds: [], impactRating: 'high' }
      ],
      worldImpact: "Woods are grey and silent."
    },
    {
      id: '2b',
      title: "The Blood Harvest",
      description: "The spirit demands a sacrifice. The villagers are divided.",
      state: completedQuests.includes('1') && worldState.includes('Bound') ? 'unlocked' : 'locked',
      choices: [
        { id: 'c5', text: "Stop the sacrifice", outcomeDescription: "The spirit rages, destroying half the village.", nextQuestIds: [], impactRating: 'critical' },
        { id: 'c6', text: "Allow the tribute", outcomeDescription: "A child is lost, but the crops are golden.", nextQuestIds: [], impactRating: 'high' }
      ],
      worldImpact: "Woods are vibrant but eerie."
    }
  ];

  const handleChoice = (questId: string, choice: Choice) => {
    setCompletedQuests([...completedQuests, questId]);
    if (choice.text.includes('Exorcise')) setWorldState([...worldState, 'Exorcised']);
    if (choice.text.includes('Re-bind')) setWorldState([...worldState, 'Bound']);
    
    if (choice.nextQuestIds.length > 0) {
      setActiveQuest(choice.nextQuestIds[0]);
    } else {
      setActiveQuest(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Quest Decision Matrix</h2>
          <p className="text-kingfisher-muted">Simulate the butterfly effect of player decisions on the game world.</p>
        </div>
        <div className="flex gap-2">
          {worldState.map(state => (
            <span key={state} className="px-3 py-1 bg-kingfisher-warm/20 text-kingfisher-warm border border-kingfisher-warm/30 rounded-full text-xs font-bold flex items-center gap-2">
              <Map className="w-3 h-3" /> {state}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Quest List */}
        <div className="bg-kingfisher-dark/40 border border-kingfisher-blue/20 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-kingfisher-blue mb-4">Available Outcomes</h3>
          {quests.map(q => (
            <div 
              key={q.id}
              className={`p-4 rounded-2xl border transition-all ${
                activeQuest === q.id 
                  ? 'bg-kingfisher-blue/10 border-kingfisher-blue border-l-4' 
                  : completedQuests.includes(q.id)
                    ? 'border-kingfisher-blue/10 opacity-50'
                    : 'border-kingfisher-blue/5 opacity-30'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <ScrollText className="w-4 h-4 text-kingfisher-blue" />
                <h4 className="font-bold text-sm">{q.title}</h4>
              </div>
              <p className="text-xs text-kingfisher-muted line-clamp-2">{q.description}</p>
            </div>
          ))}
        </div>

        {/* Current Active Decision */}
        <div className="lg:col-span-2 bg-kingfisher-dark/60 border border-kingfisher-blue/10 rounded-3xl p-8 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeQuest ? (
              <motion.div
                key={activeQuest}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <span className="text-[10px] font-bold text-kingfisher-warm uppercase px-2 py-1 bg-kingfisher-warm/10 rounded border border-kingfisher-warm/20 mb-4 inline-block">Active Decision Point</span>
                  <h3 className="text-4xl font-bold mb-4">{quests.find(q => q.id === activeQuest)?.title}</h3>
                  <p className="text-lg text-kingfisher-surface/80 leading-relaxed max-w-2xl">
                    {quests.find(q => q.id === activeQuest)?.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quests.find(q => q.id === activeQuest)?.choices.map(choice => (
                    <button
                      key={choice.id}
                      onClick={() => handleChoice(activeQuest, choice)}
                      className="group text-left p-6 bg-kingfisher-blue/5 border border-kingfisher-blue/10 rounded-2xl hover:bg-kingfisher-blue/10 hover:border-kingfisher-blue transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-kingfisher-blue">{choice.text}</span>
                        {choice.impactRating === 'critical' && <AlertCircle className="w-4 h-4 text-red-400 animate-pulse" />}
                      </div>
                      <p className="text-xs text-kingfisher-muted group-hover:text-kingfisher-surface">{choice.outcomeDescription}</p>
                      <div className="mt-4 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold text-kingfisher-warm uppercase flex items-center">Apply Decision <ChevronRight className="w-3 h-3" /></span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="p-6 bg-kingfisher-warm/10 rounded-full border border-kingfisher-warm/20">
                  <Zap className="w-12 h-12 text-kingfisher-warm" />
                </div>
                <h3 className="text-3xl font-bold">World State Converged</h3>
                <p className="text-kingfisher-muted max-w-md">Your decisions have shaped the world. The environment in your Unreal Engine project would now load specific level variants based on these flags.</p>
                <button 
                  onClick={() => {
                    setWorldState([]);
                    setCompletedQuests([]);
                    setActiveQuest('1');
                  }}
                  className="px-6 py-3 bg-kingfisher-blue text-white rounded-xl font-bold hover:bg-kingfisher-blue/80 transition-colors"
                >
                  Reset Simulation
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
