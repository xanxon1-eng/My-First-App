import React from 'react';
import { Bird, Timer, GraduationCap, Download, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { COLORS } from '../../../constants/colors';

interface MainMenuProps {
  onSelectView: (view: 'school' | 'timer' | 'optimization') => void;
  isAndroidFirefox?: boolean;
  isStandalone?: boolean;
  showInstallButton?: boolean;
  onInstallClick?: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ 
  onSelectView, 
  isAndroidFirefox, 
  isStandalone,
  showInstallButton,
  onInstallClick
}) => {
  // Logic simplified to follow user instructions exactly:
  // Android Firefox Logic (Website/Browser): Hide gym timer and school, show install button.
  // Installed App Experience: Show all content, hide install button.
  const isFirefoxWebsite = isAndroidFirefox && !isStandalone;
  
  // Decisions based on flags
  const showContentButtons = !isFirefoxWebsite;
  const showBigInstallButton = isFirefoxWebsite;
  const showSmallInstallButton = !isStandalone && !isAndroidFirefox && showInstallButton;

  return (
    <div className="flex flex-col items-center justify-between h-full w-full bg-kingfisher-dark p-4 sm:p-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mt-auto md:mt-8 mb-6 md:mb-8 shrink-0"
      >
        <div className="w-16 h-16 md:w-20 md:h-20 bg-kingfisher-deep rounded-2xl flex items-center justify-center text-white shadow-2xl mb-4">
          <Bird className="w-10 h-10 md:w-12 md:h-12 text-kingfisher-warm" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight text-center">
          Kingfisher <span className="text-kingfisher-warm">Hub</span>
        </h1>
        {isFirefoxWebsite && (
          <p className="mt-4 text-kingfisher-muted max-w-xs text-center text-sm md:text-base leading-relaxed">
            Please install the application to your home screen to access the full experience on Android Firefox.
          </p>
        )}
      </motion.div>

      <div className="flex flex-col md:flex-row gap-3 md:gap-6 w-full max-w-2xl px-2 mb-auto">
        {showContentButtons && (
          <>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: `${COLORS.kingfisher.warm}1A` }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectView('timer')}
              className="flex-1 flex flex-row md:flex-col items-center justify-start md:justify-center p-4 md:p-10 bg-kingfisher-panel border border-kingfisher-border rounded-2xl md:rounded-3xl transition-colors group min-h-[80px] md:min-h-0"
            >
              <div className="p-3 md:p-4 bg-kingfisher-panel rounded-xl md:rounded-full mr-4 md:mr-0 md:mb-6 group-hover:bg-kingfisher-warm/20 transition-colors shrink-0">
                <Timer className="w-6 h-6 md:w-12 md:h-12 text-kingfisher-warm" />
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-white">Gym Timer</h2>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: `${COLORS.kingfisher.blue}1A` }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectView('school')}
              className="flex-1 flex flex-row md:flex-col items-center justify-start md:justify-center p-4 md:p-10 bg-kingfisher-panel border border-kingfisher-border rounded-2xl md:rounded-3xl transition-colors group min-h-[80px] md:min-h-0"
            >
              <div className="p-3 md:p-4 bg-kingfisher-panel rounded-xl md:rounded-full mr-4 md:mr-0 md:mb-6 group-hover:bg-kingfisher-blue/20 transition-colors shrink-0">
                <GraduationCap className="w-6 h-6 md:w-12 md:h-12 text-kingfisher-blue" />
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-white text-center">C++ School</h2>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: `${COLORS.kingfisher.warm}1A` }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectView('optimization')}
              className="flex-1 flex flex-row md:flex-col items-center justify-start md:justify-center p-4 md:p-10 bg-kingfisher-panel border border-kingfisher-border rounded-2xl md:rounded-3xl transition-colors group min-h-[80px] md:min-h-0"
            >
              <div className="p-3 md:p-4 bg-kingfisher-panel rounded-xl md:rounded-full mr-4 md:mr-0 md:mb-6 group-hover:bg-kingfisher-warm/20 transition-colors shrink-0">
                <Settings className="w-6 h-6 md:w-12 md:h-12 text-kingfisher-warm" />
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-white text-center text-left md:text-center">Optimization</h2>
            </motion.button>
          </>
        )}

        {showBigInstallButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onInstallClick}
            className="w-full flex items-center justify-center gap-3 p-5 md:p-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl md:rounded-3xl font-bold shadow-2xl transition-all group min-h-[64px]"
          >
            <Download className="w-7 h-7 md:w-8 md:h-8 group-hover:translate-y-0.5 transition-transform" />
            <span className="text-lg md:text-xl">Install App</span>
          </motion.button>
        )}

        {showSmallInstallButton && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onInstallClick}
            className="md:hidden flex items-center justify-center gap-3 p-4 bg-kingfisher-panel border border-emerald-900/50 rounded-2xl transition-all text-emerald-400 font-semibold min-h-[56px]"
          >
            <Download className="w-5 h-5" />
            <span>Install App</span>
          </motion.button>
        )}
      </div>

      {isFirefoxWebsite && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 mb-4 p-4 bg-kingfisher-panel rounded-2xl border border-kingfisher-border max-w-xs w-full"
        >
          <h4 className="text-[10px] font-semibold text-kingfisher-warm uppercase tracking-wider mb-2 text-center">How to install</h4>
          <p className="text-xs text-kingfisher-muted leading-relaxed text-center">
            Tap the <span className="text-white font-bold">three dots</span> in the browser menu and select <span className="text-white font-bold">"Install"</span>.
          </p>
        </motion.div>
      )}

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
