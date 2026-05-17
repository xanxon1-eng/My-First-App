import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, ArrowLeft, Timer, PictureInPicture, Settings2, X } from 'lucide-react';
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
  
  // SOLUTION 3 STATE: In-App Mock PiP Fallback
  const [inAppPip, setInAppPip] = useState(false);

  const timerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Ref for the modern Document PiP canvas
  const docPipCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  useEffect(() => {
    if (isActive && seconds > 0) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
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
    // We update both the hidden DOM Canvas and the Document PiP Canvas if it exists
    const canvases = [canvasRef.current, docPipCanvasRef.current];
    
    canvases.forEach(canvas => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Premium dark backdrop rendering
      ctx.fillStyle = COLORS.kingfisher.dark; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Timer text styling
      ctx.fillStyle = COLORS.kingfisher.warm; 
      ctx.font = 'bold 80px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(formatTime(seconds), canvas.width / 2, canvas.height / 2);
    });
  }, [seconds]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    if ((canvas as any).captureStream) {
      try {
        const stream = (canvas as any).captureStream(30);
        video.srcObject = stream;
        video.play().catch((err) => {
          console.log("Canvas video stream warmup deferred until action:", err);
        });
      } catch (err) {
        console.error("Failed to initialize capture stream:", err);
      }
    }
  }, []);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(initialSeconds);
  };

  const handleSetDuration = (secs: number) => {
    setIsActive(false);
    setInitialSeconds(secs);
    setSeconds(secs);
    setIsEditing(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = manualInput.split(':');
    let total = 0;
    if (parts.length === 2) {
      total = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else {
      total = parseInt(parts[0]);
    }
    if (!isNaN(total) && total > 0) {
      handleSetDuration(total);
    }
  };

  const togglePip = async () => {
    const video = videoRef.current as any;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Toggle off if In-App Mock PiP is currently on
    if (inAppPip) {
      setInAppPip(false);
      return;
    }
    
    let hasAttemptedNative = false;

    // SOLUTION 1: Document Picture-in-Picture API (Modern Chrome/Edge)
    if ('documentPictureInPicture' in window) {
      try {
        hasAttemptedNative = true;
        const docPip = (window as any).documentPictureInPicture;
        
        if (docPip.window) {
          docPip.window.close();
          docPipCanvasRef.current = null;
          return;
        }

        const pipWindow = await docPip.requestWindow({ width: 300, height: 300 });
        
        // Setup new canvas solely for the detached OS PiP Window
        const newCanvas = pipWindow.document.createElement('canvas');
        newCanvas.width = 300;
        newCanvas.height = 300;
        newCanvas.style.width = '100%';
        newCanvas.style.height = '100%';
        newCanvas.style.objectFit = 'contain';
        pipWindow.document.body.style.margin = '0';
        pipWindow.document.body.style.backgroundColor = COLORS.kingfisher.dark;
        pipWindow.document.body.style.display = 'flex';
        pipWindow.document.body.style.alignItems = 'center';
        pipWindow.document.body.style.justifyContent = 'center';
        pipWindow.document.body.appendChild(newCanvas);
        
        docPipCanvasRef.current = newCanvas;

        // Force initial paint immediately
        const ctx = newCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = COLORS.kingfisher.dark;
          ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
          ctx.fillStyle = COLORS.kingfisher.warm;
          ctx.font = 'bold 80px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(formatTime(seconds), newCanvas.width / 2, newCanvas.height / 2);
        }

        pipWindow.addEventListener('pagehide', () => {
          docPipCanvasRef.current = null;
        });
        
        return; // Success, exit out
      } catch (err: any) {
        console.warn("Document PiP failed, falling back...", err);
      }
    }

    const hasCaptureStream = !!(canvas as any).captureStream;

    if (hasCaptureStream && !video.srcObject) {
      try { video.srcObject = (canvas as any).captureStream(30); } catch (e) {}
    }

    // ORIGINAL ATTEMPT: Standard Video PiP API 
    if (hasCaptureStream && 'requestPictureInPicture' in HTMLVideoElement.prototype && document.pictureInPictureEnabled) {
      try {
        hasAttemptedNative = true;
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          try { await video.play(); } catch(e){} 
          await video.requestPictureInPicture();
        }
        return; 
      } catch (err: any) {
        console.warn("Standard Video PiP failed, falling back...", err);
      }
    }

    // SOLUTION 2: Apple Safari WebKit Video PiP API
    if (hasCaptureStream && video.webkitSupportsPresentationMode && video.webkitSupportsPresentationMode('picture-in-picture')) {
      try {
        hasAttemptedNative = true;
        if (video.webkitPresentationMode === 'picture-in-picture') {
          video.webkitSetPresentationMode('inline');
        } else {
          try { await video.play(); } catch(e){}
          video.webkitSetPresentationMode('picture-in-picture');
        }
        return; 
      } catch (err: any) {
        console.warn("Safari Video PiP failed, falling back...", err);
      }
    }

    // SOLUTION 3: In-App Floating Overlay Mock PiP (Ultimate Fallback)
    setInAppPip(true);
    showToast(hasAttemptedNative 
      ? "Native PiP APIs failed. Using in-app floating overlay." 
      : "Native PiP unsupported. Using in-app floating overlay.", "success");
  };

  const progress = seconds / initialSeconds;

  return (
    <div className="flex flex-col h-full w-full bg-kingfisher-dark text-white font-sans overflow-hidden relative">
      
      {/* Hidden elements for Stream PiP */}
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={300} 
        className="fixed -left-[9999px] -top-[9999px] pointer-events-none" 
      />
      <video 
        ref={videoRef} 
        className="fixed -left-[9999px] -top-[9999px] pointer-events-none" 
        muted 
        playsInline 
      />

      <header className="h-14 border-b border-kingfisher-border bg-kingfisher-panel flex items-center justify-between px-4 shrink-0">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-kingfisher-muted hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-kingfisher-warm" />
          <span className="font-semibold text-sm">Gym Session</span>
        </div>
        <button 
          onClick={togglePip}
          className="flex items-center gap-2 text-kingfisher-muted hover:text-white transition-colors text-sm font-medium p-2 rounded-lg hover:bg-kingfisher-panel"
          title="Miniature Overlay (PiP)"
        >
          <PictureInPicture className="w-4 h-4 text-kingfisher-warm" />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="mb-8 flex gap-3 z-10">
          <button 
            onClick={() => handleSetDuration(90)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              initialSeconds === 90 
                ? 'bg-kingfisher-warm text-kingfisher-dark shadow-lg shadow-kingfisher-warm/20' 
                : 'bg-kingfisher-panel text-kingfisher-muted border border-kingfisher-border hover:border-kingfisher-warm/50'
            }`}
          >
            1:30 Min
          </button>
          <button 
            onClick={() => handleSetDuration(120)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              initialSeconds === 120 
                ? 'bg-kingfisher-warm text-kingfisher-dark shadow-lg shadow-kingfisher-warm/20' 
                : 'bg-kingfisher-panel text-kingfisher-muted border border-kingfisher-border hover:border-kingfisher-warm/50'
            }`}
          >
            2:00 Min
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
              isEditing ? 'bg-kingfisher-warm text-kingfisher-dark' : 'bg-kingfisher-panel text-kingfisher-muted border border-kingfisher-border'
            }`}
          >
            <Settings2 className="w-3 h-3" />
            Custom
          </button>
        </div>

        <AnimatePresence>
          {isEditing && (
            <motion.form 
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              onSubmit={handleManualSubmit}
              className="absolute top-20 z-20 bg-kingfisher-panel border border-kingfisher-border p-4 rounded-xl shadow-2xl flex flex-col gap-3 backdrop-blur-md"
            >
              <label className="text-xs text-kingfisher-muted font-bold uppercase tracking-wider">Set Duration (M:SS)</label>
              <div className="flex gap-2">
                <input 
                  autoFocus
                  type="text" 
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="bg-kingfisher-dark border border-kingfisher-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-kingfisher-warm w-24 font-mono"
                  placeholder="2:00"
                />
                <button 
                  type="submit"
                  className="bg-kingfisher-warm text-kingfisher-dark px-4 py-2 rounded text-sm font-bold hover:bg-kingfisher-warm/80 transition-colors"
                >
                  Set
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              className="text-kingfisher-border"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray="282.7"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: 282.7 * (1 - (isNaN(progress) ? 0 : progress)) }}
              transition={{ duration: 1, ease: "linear" }}
              className="text-kingfisher-warm"
              strokeLinecap="round"
            />
          </svg>

          <div className="text-6xl md:text-8xl font-mono font-bold tracking-tighter relative z-10 text-kingfisher-warm">
            {formatTime(seconds)}
          </div>
        </div>

        <div className="mt-16 flex items-center gap-8 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={resetTimer}
            className="p-4 bg-kingfisher-panel border border-kingfisher-border text-kingfisher-muted hover:text-white rounded-full transition-colors hover:bg-kingfisher-panel/50"
          >
            <RotateCcw className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-colors ${
              isActive 
                ? 'bg-red-500/20 text-red-500 border border-red-500/40 hover:bg-red-500/30' 
                : 'bg-kingfisher-warm text-kingfisher-dark hover:bg-kingfisher-warm/80'
            }`}
          >
            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </motion.button>

          <div className="w-14 shrink-0" />
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={isActive ? 'running' : 'stopped'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-8 text-kingfisher-muted font-medium text-sm text-center min-h-[20px]"
          >
            {seconds === 0 ? "Session Complete!" : isActive ? "Active Rest Interval" : "Interval Paused"}
          </motion.p>
        </AnimatePresence>
      </div>
      
      {/* SOLUTION 3 UI: Draggable In-App Fallback Layer */}
      <AnimatePresence>
        {inAppPip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            drag
            className="fixed bottom-24 right-6 z-50 w-48 h-48 bg-kingfisher-panel rounded-2xl shadow-2xl border border-kingfisher-border flex flex-col items-center justify-center overflow-hidden cursor-move"
          >
            <button 
              onClick={() => setInAppPip(false)}
              className="absolute top-3 right-3 p-1 bg-kingfisher-dark/50 hover:bg-kingfisher-dark rounded-full text-kingfisher-muted hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="text-4xl font-mono font-bold tracking-tighter text-kingfisher-warm mb-2">
              {formatTime(seconds)}
            </div>
            <div className="flex gap-3">
               <button onClick={toggleTimer} className="p-2 bg-kingfisher-dark rounded-full text-kingfisher-warm hover:bg-kingfisher-dark/80 transition-colors shadow-lg">
                 {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
               </button>
               <button onClick={resetTimer} className="p-2 bg-kingfisher-dark rounded-full text-kingfisher-muted hover:text-white transition-colors shadow-lg">
                 <RotateCcw className="w-4 h-4" />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 20, x: "-50%", scale: 0.9 }}
            className={`fixed bottom-6 left-1/2 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 text-sm font-semibold ${
              toast.type === 'error'
                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}
          >
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="p-1 hover:bg-kingfisher-panel/50 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-8 flex justify-center opacity-30" />
    </div>
  );
};

export default GymTimer;