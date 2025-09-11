// Theme colors podle screenshotu - modrý gradient design
export const COLORS = {
  // Hlavní barvy podle screenshotu
  mainText: '#FFFFFF',                    // Bílý text
  ctaText: '#1a1a1a',                    // Tmavý text pro Next tlačítko
  
  // Progress bar - teal/cyan barva ze screenshotu
  progressFill: '#4DD0E1',               // Světlá cyan barva
  progressTrack: 'rgba(255, 255, 255, 0.2)', // Bílý track s průhledností
  
  // Question label - světlejší text
  questionLabel: 'rgba(255, 255, 255, 0.7)', // Bílá s průhledností
  
  // Answer buttons - poloprůhledné tlačítka
  answerButton: 'rgba(255, 255, 255, 0.15)',     // Poloprůhledná bílá
  answerButtonBorder: 'rgba(255, 255, 255, 0.3)', // Jemný bílý okraj
  answerButtonSelected: 'rgba(255, 255, 255, 0.25)', // Zvýrazněný stav
  
  // Next button - bílé tlačítko
  nextButton: '#FFFFFF',                  // Bílé pozadí
  
  // Gradient barvy pro pozadí (z světlé k tmavé modré)
  gradientStart: '#6BB6FF',              // Světlá modrá nahoře
  gradientMiddle: '#5B9BD5',             // Střední modrá
  gradientEnd: '#4682B4',                // Tmavá modrá dole
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

// Gradient definice podle screenshotu
export const GRADIENTS = {
  // Progress bar - jednoduchý cyan gradient
  progress: [COLORS.progressFill, COLORS.progressFill], 
  
  // Background - modrý gradient ze světlé k tmavé
  background: [
    COLORS.gradientStart,    // Světlá modrá nahoře
    COLORS.gradientMiddle,   // Střední modrá
    COLORS.gradientEnd,      // Tmavá modrá dole
  ],
} as const;