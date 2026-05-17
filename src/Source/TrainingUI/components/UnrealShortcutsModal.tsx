import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UnrealShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { group: 'Basic & Play', items: [
    { keys: ['Alt', 'P'], desc: 'Play / Simulate' },
    { keys: ['P'], desc: 'Show Nav Mesh' },
    { keys: ['Ctrl', 'Space'], desc: 'Content Browser' },
    { keys: ['Ctrl', 'B'], desc: 'Find in Content Browser' },
  ]},
  { group: 'Level Editing & Transform', items: [
    { keys: ['End'], desc: 'Snap to Floor' },
    { keys: ['Alt', 'End'], desc: 'Snap Pivot to Floor' },
    { keys: ['Alt', 'Transform'], desc: 'Duplicate & Transform' },
    { keys: ['W', 'E', 'R'], desc: 'Translate / Rotate / Scale' },
    { keys: ['Spacebar'], desc: 'Toggle Transform Tool' },
  ]},
  { group: 'Camera & Viewports', items: [
    { keys: ['F'], desc: 'Focus on Selected' },
    { keys: ['G'], desc: 'Game View' },
    { keys: ['Alt', 'G / H / J / K'], desc: 'Perspective / Front / Top / Side' },
    { keys: ['Ctrl', 'Shift', ','], desc: 'GPU Visualizer' },
  ]}
];

export function UnrealShortcutsModal({ isOpen, onClose }: UnrealShortcutsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-kingfisher-panel border border-kingfisher-border rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="flex items-center justify-between p-4 border-b border-kingfisher-border shrink-0 bg-kingfisher-dark">
              <div className="flex items-center gap-2 text-white">
                <Keyboard className="w-5 h-5 text-kingfisher-blue" />
                <h2 className="font-semibold">Unreal Engine Shortcuts</h2>
              </div>
              <button 
                onClick={onClose}
                className="text-kingfisher-muted hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 bg-kingfisher-panel">
              <p className="text-xs text-kingfisher-muted mb-4">
                Essential hotkeys to improve your level editing and development speed in Unreal Engine.
              </p>
              
              <div className="flex flex-col gap-6">
                {shortcuts.map((group, idx) => (
                  <div key={idx}>
                    <h3 className="text-xs font-semibold text-kingfisher-blue uppercase tracking-wider mb-3">
                      {group.group}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {group.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-1 border-b border-kingfisher-border/50 last:border-0 hover:bg-white/5 px-2 rounded-md transition-colors">
                          <span className="text-sm text-kingfisher-surface">{item.desc}</span>
                          <div className="flex items-center gap-1">
                            {item.keys.map((k, kIdx) => (
                              <span 
                                key={kIdx} 
                                className="px-2 py-0.5 text-xs font-mono bg-kingfisher-deep text-kingfisher-muted border border-kingfisher-border rounded shadow-sm whitespace-nowrap"
                              >
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
