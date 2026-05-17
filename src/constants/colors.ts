/**
 * Global Color Palette for the Kingfisher Training System
 * This file serves as the single source of truth for all brand and UI colors.
 */

export const COLORS = {
  // Brand Colors
  kingfisher: {
    dark: '#0c2557',     // Main background depth
    blue: '#787fb2',     // Primary accent / Action color
    muted: '#adbfc7',    // Secondary text / Icons
    surface: '#d1d0cd',  // Standard UI text / Surface elements
    warm: '#e9bb93',     // Highlights / Progress / Awards
    deep: '#b56c2a',     // Contrast accents / Active states
    panel: 'rgba(0, 0, 0, 0.2)',
    border: 'rgba(120, 127, 178, 0.3)',
  },

  // Functional Colors
  status: {
    success: '#22c55e',  // green-500
    successLight: '#4ade80', // green-400
    error: '#ef4444',    // red-500
    errorMuted: '#7f1d1d', // red-950
    warning: '#fbbf24',  // amber-400/500
    info: '#3b82f6',     // blue-500
    emerald: {
      500: '#10b981',
      600: '#059669',
    }
  },

  // Base Neutrals
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Utility Backgrounds (Slate variants used in Gym Timer)
  slate: {
    800: '#1e293b',
    850: '#172033',
    900: '#0f172a',
    950: '#020617',
  }
} as const;

export type ColorPalette = typeof COLORS;
