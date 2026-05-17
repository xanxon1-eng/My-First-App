import React, { useState, useEffect } from 'react';
import { 
  Bird, 
  Download,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  console.log("App component initializing...");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Handle PWA Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });

    window.addEventListener('appinstalled', () => {
      setShowInstallBtn(false);
      setDeferredPrompt(null);
    });

    // Service Worker logic is disabled in preview to avoid blank screen issues
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  };

  const handleUpdate = () => {
    setIsUpdating(true);
    // Force reload to get new version
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="h-screen bg-kingfisher-dark text-kingfisher-surface flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 p-8 h-64 w-64 bg-kingfisher-warm/10 blur-[100px] pointer-events-none rounded-full"></div>
      <div className="absolute bottom-0 left-0 p-8 h-96 w-96 bg-kingfisher-blue/10 blur-[120px] pointer-events-none rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center text-center gap-8 max-w-md w-full"
      >
        {/* App Icon / Logo */}
        <div className="w-24 h-24 bg-kingfisher-deep rounded-3xl flex items-center justify-center shadow-2xl shadow-kingfisher-deep/30 text-white relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
          <div className="relative z-10">
            <Bird className="w-14 h-14" />
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-kingfisher-surface">
            Kingfisher <span className="text-kingfisher-warm font-black">App</span>
          </h1>
          <p className="text-kingfisher-muted font-medium">Simple. Powerful. Refined.</p>
        </div>

        {/* Buttons Section */}
        <div className="w-full space-y-4">
          <AnimatePresence>
            {showInstallBtn && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-3 bg-kingfisher-blue hover:bg-kingfisher-blue/90 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-kingfisher-blue/20 transition-all active:scale-[0.98]"
              >
                <Download className="w-5 h-5" />
                Install Kingfisher
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="w-full flex items-center justify-center gap-3 bg-kingfisher-dark/50 border border-kingfisher-blue/20 hover:border-kingfisher-blue/40 text-kingfisher-surface font-semibold py-4 px-8 rounded-2xl transition-all disabled:opacity-50"
          >
            <RefreshCw className={cn("w-5 h-5", isUpdating && "animate-spin")} />
            {isUpdating ? "Updating..." : "Check for Updates"}
          </button>
        </div>

        {/* Version */}
        <p className="text-[10px] text-kingfisher-muted font-black tracking-widest uppercase mt-4">
          Version 1.1.0 • Stable
        </p>
      </motion.div>
    </div>
  );
}

