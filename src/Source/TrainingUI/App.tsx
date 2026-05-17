import React, { useState, useEffect } from 'react';
import { Bird, Download } from 'lucide-react';
import { MainMenu } from './components/MainMenu';
import { GymTimer } from './components/GymTimer';
import { CppSchool } from './components/CppSchool';

type AppView = 'menu' | 'school' | 'timer';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('menu');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  
  // Robust initial detection to prevent flash of content on first render
  const [isStandalone, setIsStandalone] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.matchMedia('(display-mode: fullscreen)').matches ||
           window.matchMedia('(display-mode: minimal-ui)').matches ||
           (navigator as any).standalone === true;
  });

  const [isAndroidFirefox] = useState(() => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent;
    return /Android/i.test(ua) && /Firefox/i.test(ua);
  });

  useEffect(() => {
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.matchMedia('(display-mode: fullscreen)').matches ||
                         window.matchMedia('(display-mode: minimal-ui)').matches ||
                         (navigator as any).standalone === true;
      setIsStandalone(standalone);
      return standalone;
    };

    const ua = navigator.userAgent;
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!checkStandalone()) {
        setShowInstallButton(true);
      }
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    if (isMobile && !checkStandalone()) {
      setShowInstallButton(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallButton(false);
      }
    } else {
      alert("To install: Open browser menu (three dots) and select 'Install' or 'Add to Home screen'");
    }
  };

  if (isAndroidFirefox && !isStandalone) {
    return (
      <div className="flex flex-col items-center justify-between h-full w-full bg-kingfisher-dark text-white p-8 text-center font-sans overflow-hidden">
        <div className="mt-auto flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-kingfisher-deep rounded-2xl flex items-center justify-center text-white shadow-2xl mb-8">
            <Bird className="w-10 md:w-12 h-10 md:h-12" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">Install Kingfisher App</h2>
          <p className="text-kingfisher-muted mb-10 max-w-xs leading-relaxed text-sm md:text-base">
            To access the full experience on Android Firefox, please install the application to your home screen.
          </p>
          
          <button 
            onClick={handleInstallClick}
            className="flex items-center justify-center gap-3 w-full max-w-xs py-4 md:py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-xl transition-all active:scale-95 group"
          >
            <Download className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
            <span className="text-lg">Install App</span>
          </button>
          
          <div className="mt-8 md:mt-12 p-4 bg-kingfisher-panel rounded-xl border border-kingfisher-border max-w-xs">
            <h4 className="text-[10px] font-semibold text-kingfisher-warm uppercase tracking-wider mb-2">How to install</h4>
            <p className="text-xs text-kingfisher-muted leading-tight">
              Tap the <span className="text-white font-bold">three dots</span> in the browser menu and select <span className="text-white font-bold">"Install"</span>.
            </p>
          </div>
        </div>
        
        <p className="mt-auto pt-10 text-[10px] text-kingfisher-muted opacity-50 uppercase tracking-[0.2em] shrink-0">
          {__APP_VERSION__}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-kingfisher-dark overflow-hidden">
      {currentView === 'menu' && (
        <MainMenu onSelectView={setCurrentView} />
      )}
      
      {currentView === 'timer' && (
        <GymTimer onBack={() => setCurrentView('menu')} />
      )}
      
      {currentView === 'school' && (
        <CppSchool 
          onBack={() => setCurrentView('menu')} 
          showInstallButton={showInstallButton}
          onInstallClick={handleInstallClick}
        />
      )}
    </div>
  );
}

