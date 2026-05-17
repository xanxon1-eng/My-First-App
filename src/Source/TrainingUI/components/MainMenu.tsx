import React from 'react';
import { Bird, Timer, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

interface MainMenuProps {
  onSelectView: (view: 'school' | 'timer') => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectView }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-kingfisher-dark p-6 overflow-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-12"
      >
        <div className="w-20 h-20 bg-kingfisher-deep rounded-2xl flex items-center justify-center text-white shadow-2xl mb-4">
          <Bird className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Kingfisher <span className="text-kingfisher-warm">Hub</span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(233, 187, 147, 0.1)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectView('timer')}
          className="flex flex-col items-center p-10 bg-kingfisher-panel border border-kingfisher-border rounded-3xl transition-colors group"
        >
          <div className="p-4 bg-kingfisher-panel rounded-full mb-6 group-hover:bg-kingfisher-warm/20 transition-colors">
            <Timer className="w-12 h-12 text-kingfisher-warm" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Gym Timer</h2>
          <p className="text-sm text-kingfisher-muted text-center">
            
          </p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(120, 127, 178, 0.1)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectView('school')}
          className="flex flex-col items-center p-10 bg-kingfisher-panel border border-kingfisher-border rounded-3xl transition-colors group"
        >
          <div className="p-4 bg-kingfisher-panel rounded-full mb-6 group-hover:bg-kingfisher-blue/20 transition-colors">
            <GraduationCap className="w-12 h-12 text-kingfisher-blue" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">C++ School</h2>
          <p className="text-sm text-kingfisher-muted text-center">
            
          </p>
        </motion.button>
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1 }}
        className="mt-auto py-8 text-[10px] text-kingfisher-muted uppercase tracking-[0.2em]"
      >
        Kingfisher Training Core
      </motion.p>
    </div>
  );
};
