import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, ArrowLeft, Timer, PictureInPicture, Settings2, X, Maximize, Smartphone, Lock } from 'lucide-react';
import { COLORS } from '../../../constants/colors';

interface GymTimerProps {
  onBack: () => void;
}

export const GymTimer: React.FC<GymTimerProps> = ({ onBack }) => {
  const [initialSeconds, setInitialSeconds] = useState(120);
  const [seconds, setSeconds] = useState(120);
  const [isActive, setIsActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [manualInput, setManualInput] = useState('2:00');
  
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [nativeVideoExposed, setNativeVideoExposed] = useState(false);

  const timerRef = useRef<any>(null);
  const wakeLockRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const docPipCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const secondsRef = useRef(seconds);
  const initialSecondsRef = useRef(initialSeconds);

  useEffect(() => {
    secondsRef.current = seconds;
    initialSecondsRef.current = initialSeconds;
  }, [seconds, initialSeconds]);

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      }
    } catch (err) {
      console.warn('Wake Lock error:', err);
    }
  };

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && nativeVideoExposed) requestWakeLock();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [nativeVideoExposed]);

  useEffect(() => {
    if (isActive && seconds > 0) {
      timerRef.current = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, seconds]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `Timer: ${formatTime(seconds)}`,
        artist: 'Gym Session',
      });
      navigator.mediaSession.setActionHandler('play', () => setIsActive(true));
      navigator.mediaSession.setActionHandler('pause', () => setIsActive(false));
    }
  }, [seconds, isActive]);

  useEffect(() => {
    const renderLoop = setInterval(() => {
      const canvases = [canvasRef.current, docPipCanvasRef.current];
      
      canvases.forEach(canvas => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const currentSeconds = secondsRef.current;
        const currentInitial = initialSecondsRef.current;

        ctx.fillStyle = COLORS.kingfisher.dark || '#1a1c23'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const r = 110;
        
        ctx.lineWidth = 12;
        ctx.strokeStyle = COLORS.kingfisher.border || '#2a2d36';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.strokeStyle = COLORS.kingfisher.warm || '#ff6b6b';
        ctx.lineCap = 'round';
        ctx.beginPath();
        
        const progress = isNaN(currentSeconds / currentInitial) ? 0 : currentSeconds / currentInitial;
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (2 * Math.PI * (1 - progress));
        
        if (progress < 1) {
          ctx.arc(cx, cy, r, startAngle, endAngle, false);
          ctx.stroke();
        }
        
        ctx.fillStyle = COLORS.kingfisher.warm || '#ff6b6b'; 
        ctx.font = 'bold 60px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(formatTime(currentSeconds), cx, cy);
      });
    }, 1000 / 30); 

    return () => clearInterval(renderLoop);
  }, []);

  const setupVideoStream = async () => {
    const canvas = canvasRef.current as any;
    const video = videoRef.current;
    if (!canvas || !video) return false;

    try {
      let stream;
      if (canvas.captureStream) stream = canvas.captureStream(30);
      else if (canvas.mozCaptureStream) stream = canvas.mozCaptureStream(30);
      else return false;

      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') await audioCtx.resume();
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0; 
        
        const dst = audioCtx.createMediaStreamDestination();
        oscillator.connect(gainNode);
        gainNode.connect(dst);
        oscillator.start();
        
        const audioTrack = dst.stream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = true;
          stream.addTrack(audioTrack);
        }
      }

      video.srcObject = stream;
      video.muted = false; 

      // FIX: Apply experimental properties programmatically to avoid React TS errors
      (video as any).autoPictureInPicture = true;
      (video as any).disablePictureInPicture = false;
      
      await video.play();
      return true;
    } catch (err) {
      console.warn("Video stream setup failed:", err);
      return false;
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setSeconds(initialSeconds); };
  const handleSetDuration = (secs: number) => { setIsActive(false); setInitialSeconds(secs); setSeconds(secs); setIsEditing(false); };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = manualInput.split(':');
    let total = parts.length === 2 ? parseInt(parts[0]) * 60 + parseInt(parts[1]) : parseInt(parts[0]);
    if (!isNaN(total) && total > 0) handleSetDuration(total);
  };

  const togglePip = async () => {
    const streamReady = await setupVideoStream();
    if (!streamReady) {
      showToast("Canvas streaming unsupported on this browser.", "error");
      return;
    }

    const video = videoRef.current as any;

    if ('documentPictureInPicture' in window) {
      try {
        const docPip = (window as any).documentPictureInPicture;
        if (docPip.window) { docPip.window.close(); return; }
        const pipWindow = await docPip.requestWindow({ width: 300, height: 300 });
        const newCanvas = pipWindow.document.createElement('canvas');
        newCanvas.width = 300; newCanvas.height = 300;
        newCanvas.style.cssText = 'width: 100%; height: 100%; object-fit: contain;';
        pipWindow.document.body.style.cssText = 'margin: 0; background: #1a1c23; display: flex; align-items: center; justify-content: center;';
        pipWindow.document.body.appendChild(newCanvas);
        docPipCanvasRef.current = newCanvas;
        pipWindow.addEventListener('pagehide', () => { docPipCanvasRef.current = null; });
        return; 
      } catch (err) { console.warn("Doc PiP failed", err); }
    }

    if ('requestPictureInPicture' in HTMLVideoElement.prototype && document.pictureInPictureEnabled) {
      try {
        if (document.pictureInPictureElement) await document.exitPictureInPicture();
        else await video.requestPictureInPicture();
        return; 
      } catch (err) { console.warn("Standard PiP failed", err); }
    }

    setNativeVideoExposed(true);
    requestWakeLock();
    
    setTimeout(() => {
      if (video.requestFullscreen) video.requestFullscreen();
      else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
    }, 100);
  };

  const progress = seconds / initialSeconds;

  return (
    <div className="flex flex-col h-full w-full bg-kingfisher-dark text-white font-sans overflow-hidden relative">
      
      <canvas ref={canvasRef} width={300} height={300} className="fixed -left-[9999px] pointer-events-none" />

      <div className={nativeVideoExposed ? "fixed inset-0 z-50 flex flex-col items-center pt-20 bg-kingfisher-dark/95 backdrop-blur-md px-6" : ""}>
        <AnimatePresence>
          {nativeVideoExposed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-sm">
              <button onClick={() => setNativeVideoExposed(false)} className="absolute top-6 right-6 p-2 bg-kingfisher-panel rounded-full text-kingfisher-muted hover:text-white border border-kingfisher-border">
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center space-y-2 mb-6">
                <h2 className="text-xl font-bold text-kingfisher-warm">Native PiP Active</h2>
                <div className="bg-kingfisher-panel p-4 rounded-xl border border-kingfisher-border text-left space-y-3 text-sm mt-4 shadow-xl">
                  <p className="flex items-center gap-3 text-kingfisher-muted"><Maximize className="w-4 h-4 text-kingfisher-warm shrink-0"/> <span>1. If video isn't fullscreen, tap the Fullscreen icon.</span></p>
                  <p className="flex items-center gap-3 text-kingfisher-muted"><Smartphone className="w-4 h-4 text-kingfisher-warm shrink-0"/> <span>2. Press your phone's <b>Home</b> button.</span></p>
                  <p className="flex items-center gap-3 text-emerald-400 mt-2 border-t border-kingfisher-border pt-3"><Lock className="w-4 h-4 shrink-0"/> <span>Screen Wake Lock Enabled.</span></p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <video 
          ref={videoRef} 
          className={nativeVideoExposed ? "w-64 h-64 object-contain rounded-2xl shadow-2xl border-2 border-kingfisher-border bg-black z-50" : "fixed -left-[9999px] pointer-events-none"} 
          controls={nativeVideoExposed} 
          playsInline 
          // Removed TS-breaking attributes here; they are now set via ref in setupVideoStream
        />
      </div>

      <header className="h-14 border-b border-kingfisher-border bg-kingfisher-panel flex items-center justify-between px-4 shrink-0">
        <button onClick={onBack} className="flex items-center gap-2 text-kingfisher-muted hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-kingfisher-warm" />
          <span className="font-semibold text-sm">Gym Session</span>
        </div>
        <button onClick={togglePip} className="flex items-center gap-2 text-kingfisher-muted hover:text-white transition-colors text-sm font-medium p-2 rounded-lg hover:bg-kingfisher-panel shadow">
          <PictureInPicture className="w-4 h-4 text-kingfisher-warm" />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="mb-8 flex gap-3 z-10">
          <button onClick={() => handleSetDuration(90)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${initialSeconds === 90 ? 'bg-kingfisher-warm text-kingfisher-dark shadow-lg' : 'bg-kingfisher-panel text-kingfisher-muted border border-kingfisher-border'}`}>1:30 Min</button>
          <button onClick={() => handleSetDuration(120)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${initialSeconds === 120 ? 'bg-kingfisher-warm text-kingfisher-dark shadow-lg' : 'bg-kingfisher-panel text-kingfisher-muted border border-kingfisher-border'}`}>2:00 Min</button>
          <button onClick={() => setIsEditing(!isEditing)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${isEditing ? 'bg-kingfisher-warm text-kingfisher-dark' : 'bg-kingfisher-panel text-kingfisher-muted border border-kingfisher-border'}`}>
            <Settings2 className="w-3 h-3" /> Custom
          </button>
        </div>

        <AnimatePresence>
          {isEditing && (
            <motion.form initial={{ opacity: 0, scale: 0.9, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -10 }} onSubmit={handleManualSubmit} className="absolute top-20 z-20 bg-kingfisher-panel border border-kingfisher-border p-4 rounded-xl shadow-2xl flex flex-col gap-3 backdrop-blur-md">
              <label className="text-xs text-kingfisher-muted font-bold uppercase tracking-wider">Set Duration (M:SS)</label>
              <div className="flex gap-2">
                <input autoFocus type="text" value={manualInput} onChange={(e) => setManualInput(e.target.value)} className="bg-kingfisher-dark border border-kingfisher-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-kingfisher-warm w-24 font-mono" placeholder="2:00"/>
                <button type="submit" className="bg-kingfisher-warm text-kingfisher-dark px-4 py-2 rounded text-sm font-bold">Set</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-kingfisher-border"/>
            <motion.circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray="282.7" initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: 282.7 * (1 - (isNaN(progress) ? 0 : progress)) }} transition={{ duration: 1, ease: "linear" }} className="text-kingfisher-warm" strokeLinecap="round"/>
          </svg>
          <div className="text-6xl md:text-8xl font-mono font-bold tracking-tighter relative z-10 text-kingfisher-warm">
            {formatTime(seconds)}
          </div>
        </div>

        <div className="mt-16 flex items-center gap-8 z-10">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={resetTimer} className="p-4 bg-kingfisher-panel border border-kingfisher-border text-kingfisher-muted hover:text-white rounded-full transition-colors hover:bg-kingfisher-panel/50">
            <RotateCcw className="w-6 h-6" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleTimer} className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-colors ${isActive ? 'bg-red-500/20 text-red-500 border border-red-500/40' : 'bg-kingfisher-warm text-kingfisher-dark'}`}>
            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </motion.button>
          <div className="w-14 shrink-0" />
        </div>
      </div>
      
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }} animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }} exit={{ opacity: 0, y: 20, x: "-50%", scale: 0.9 }} className={`fixed bottom-6 left-1/2 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 text-sm font-semibold ${toast.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="p-1 hover:bg-kingfisher-panel/50 rounded"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GymTimer;