import React from 'react';
import { Bird, Timer, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

interface MainMenuProps {
  onSelectView: (view: 'school' | 'timer') => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectView }) => {
  return (
    <div className="flex flex-col items-center justify-between h-full w-full bg-kingfisher-dark p-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mt-auto md:mt-8 mb-8 shrink-0"
      >
        <div className="w-16 h-16 md:w-20 md:h-20 bg-kingfisher-deep rounded-2xl flex items-center justify-center text-white shadow-2xl mb-4">
          <Bird className="w-10 h-10 md:w-12 md:h-12" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Kingfisher <span className="text-kingfisher-warm">Hub</span>
        </h1>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-2xl px-2">
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(233, 187, 147, 0.1)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectView('timer')}
          className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 bg-kingfisher-panel border border-kingfisher-border rounded-3xl transition-colors group"
        >
          <div className="p-3 md:p-4 bg-kingfisher-panel rounded-full mb-3 md:mb-6 group-hover:bg-kingfisher-warm/20 transition-colors">
            <Timer className="w-8 h-8 md:w-12 md:h-12 text-kingfisher-warm" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Gym Timer</h2>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(120, 127, 178, 0.1)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectView('school')}
          className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 bg-kingfisher-panel border border-kingfisher-border rounded-3xl transition-colors group"
        >
          <div className="p-3 md:p-4 bg-kingfisher-panel rounded-full mb-3 md:mb-6 group-hover:bg-kingfisher-blue/20 transition-colors">
            <GraduationCap className="w-8 h-8 md:w-12 md:h-12 text-kingfisher-blue" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">C++ School</h2>
        </motion.button>
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1 }}
        className="mt-auto py-10 text-[10px] text-kingfisher-muted uppercase tracking-[0.2em] shrink-0"
      >
        {__APP_VERSION__}
      </motion.p>
    </div>
  );
};
