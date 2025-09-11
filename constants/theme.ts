// Theme colors matching the HTML template CSS variables
export const COLORS = {
  // CSS variables from the HTML template
  primaryAction: '#38BDF8',      // --primary-action: sky-400
  secondaryBackground: '#1E3A8A', // --secondary-background: blue-900
  mainText: '#FFFFFF',           // --main-text: white
  ctaText: '#0F172A',           // --cta-text: slate-900
  accentGreen: '#34D399',       // --accent-green: emerald-400
  defaultBg: '#0B1120',         // --default-bg: very dark blue
  
  // Additional colors for UI states
  questionLabel: 'rgba(125, 211, 252, 0.8)', // sky-300/80 from template
  progressTrack: 'rgba(255, 255, 255, 0.2)',  // white/20 for progress bar background
  answerButton: 'rgba(56, 189, 248, 0.2)',    // sky-400/20 from template
  answerButtonBorder: 'rgba(56, 189, 248, 0.5)', // sky-400/50 from template  
  answerButtonHover: 'rgba(56, 189, 248, 0.4)',  // sky-400/40 hover state
} as const;

export const SPACING = {
  page: 32,      // p-8 equivalent (32px)
  gap: 20,       // standard gap between elements
  small: 16,     // smaller spacing
  large: 40,     // larger spacing
} as const;

export const TYPOGRAPHY = {
  questionLabel: {
    fontSize: 20,
    fontWeight: '500' as const,
    color: COLORS.questionLabel,
  },
  questionText: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: COLORS.mainText,
    lineHeight: 32,
  },
  answerText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.mainText,
  },
  nextButton: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: COLORS.ctaText,
  },
} as const;

// Gradient definitions matching the template
export const GRADIENTS = {
  progress: ['#38BDF8', '#34D399'], // sky-400 to emerald-400
  background: [
    'rgba(49, 46, 129, 0.7)',   // indigo-900/70
    'rgba(30, 58, 138, 0.6)',   // blue-900/60  
    'rgba(15, 23, 42, 0.8)',    // slate-900/80
  ],
} as const;