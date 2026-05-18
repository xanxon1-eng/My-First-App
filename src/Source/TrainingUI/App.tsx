import React, { useState, useEffect } from 'react';
import { Bird, Download } from 'lucide-react';
import { MainMenu } from './components/MainMenu';
import { GymTimer } from './components/GymTimer';
import { CppSchool } from './components/CppSchool';
import { OptimizationGuide } from './components/OptimizationGuide';

type AppView = 'menu' | 'school' | 'timer' | 'optimization';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('menu');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  
  // Robust initial detection - stick to standalone only to avoid false positives in mobile browsers
  const [isStandalone, setIsStandalone] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches || 
           (navigator as any).standalone === true;
  });

  const [isAndroidFirefox] = useState(() => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent;
    const isAndroid = /Android/i.test(ua);
    const isFirefox = /Firefox|FxiOS|Focus/i.test(ua) || (/Gecko/i.test(ua) && !/Chrome/i.test(ua));
    return isAndroid && isFirefox;
  });

  useEffect(() => {
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (navigator as any).standalone === true;
      setIsStandalone(standalone);
      return standalone;
    };

    // Initial check
    checkStandalone();
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
    
    const ua = navigator.userAgent;
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

  return (
    <div className="h-full w-full bg-kingfisher-dark overflow-hidden">
      {currentView === 'menu' && (
        <MainMenu 
          onSelectView={setCurrentView} 
          isAndroidFirefox={isAndroidFirefox}
          isStandalone={isStandalone}
          showInstallButton={showInstallButton}
          onInstallClick={handleInstallClick}
        />
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

      {currentView === 'optimization' && (
        <OptimizationGuide onBack={() => setCurrentView('menu')} />
      )}
    </div>
  );
}

