// Design System podle HTML reference - Poppins + blue gradient theme
export const COLORS = {
  // Core color palette z HTML reference
  primaryAction: '#38BDF8',              // sky-400 - primary cyan/blue
  secondaryBackground: '#1E3A8A',        // blue-800 - dark blue
  mainText: '#FFFFFF',                   // white text
  ctaText: '#0F172A',                    // slate-900 - dark text for white buttons
  accentGreen: '#34D399',                // emerald-400 - accent color
  defaultBg: '#0B1120',                  // very dark background
  
  // Progress bar colors
  progressFill: '#38BDF8',               // sky-400 gradient with glow
  progressTrack: 'rgba(255, 255, 255, 0.2)', // white/20 backdrop
  
  // Text colors podle HTML
  questionLabel: '#7DD3FC',              // sky-300/80 - light blue for question labels
  descriptionText: '#BAE6FD',            // sky-200/80 - lighter blue for descriptions
  
  // Button colors podle HTML reference
  selectButton: {
    background: 'rgba(56, 189, 248, 0.2)',      // sky-400/20 
    border: 'rgba(56, 189, 248, 0.5)',          // sky-400/50
    hover: 'rgba(56, 189, 248, 0.4)',           // sky-400/40
  },
  
  nextButton: {
    background: '#FFFFFF',                        // white background
    text: '#0F172A',                             // slate-900 text
    shadow: 'rgba(255, 255, 255, 0.2)',         // white/20 shadow
  },
  
  // Gradient colors z HTML reference  
  gradientStart: '#6366F1',              // indigo-500 top-left
  gradientMiddle: '#3B82F6',             // blue-500 middle
  gradientEnd: '#1E293B',                // slate-800 bottom-right
  
  // Floating blur ball colors
  blurBall1: 'rgba(56, 189, 248, 0.4)',         // sky-400/40
  blurBall2: 'rgba(30, 58, 138, 0.4)',          // blue-800/40  
  blurBall3: 'rgba(56, 189, 248, 0.2)',         // sky-400/20
  blurBall4: 'rgba(52, 211, 153, 0.2)',         // emerald-400/20
} as const;

export const SPACING = {
  page: 32,      // p-8 equivalent (32px) - main container padding
  gap: 20,       // space-y-8 equivalent - gap between elements  
  small: 16,     // gap-4 equivalent - smaller spacing
  large: 40,     // larger spacing for sections
  button: 16,    // py-4 equivalent - button padding
  content: 32,   // space-y-8 equivalent - content spacing
} as const;

export const RADIUS = {
  button: 50,    // rounded-full for buttons
  card: 16,      // rounded-xl for cards
  small: 8,      // rounded-lg for small elements
} as const;

export const SHADOWS = {
  button: {
    shadowColor: COLORS.nextButton.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  progress: {
    shadowColor: COLORS.progressFill,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 4,
  },
  text: {
    // Text shadow values for iOS/Android (web fallback needed)
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
} as const;

// Poppins font family variants
export const FONTS = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium', 
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  extrabold: 'Poppins_800ExtraBold',
} as const;

export const TYPOGRAPHY = {
  // Question label - "Question 1" text
  questionLabel: {
    fontFamily: FONTS.medium,
    fontSize: 20,                          // text-xl
    fontWeight: '500' as const,
    color: COLORS.questionLabel,
    textAlign: 'center' as const,
    ...SHADOWS.text,                       // text shadow
  },
  
  // Main question title - "What is your gender?"
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,                          // text-2xl (reduced from 30)
    fontWeight: '700' as const,
    color: COLORS.mainText,
    lineHeight: 30,                        // leading-tight (adjusted proportionally)
    textAlign: 'left' as const,
    ...SHADOWS.text,                       // text shadow
  },
  
  // Description text - "This helps us..."
  description: {
    fontFamily: FONTS.regular,
    fontSize: 16,                          // text-base
    fontWeight: '400' as const,
    color: COLORS.descriptionText,
    lineHeight: 24,
    textAlign: 'center' as const,
    ...SHADOWS.text,                       // subtle text shadow
  },
  
  // Selection button text - "Male", "Female"
  buttonSelect: {
    fontFamily: FONTS.semibold,
    fontSize: 18,                          // text-lg
    fontWeight: '600' as const,
    color: COLORS.mainText,
    textAlign: 'center' as const,
  },
  
  // Next button text
  buttonNext: {
    fontFamily: FONTS.bold,
    fontSize: 18,                          // text-lg
    fontWeight: '700' as const,
    color: COLORS.nextButton.text,
    textAlign: 'center' as const,
  },
  
  // Auth form labels
  formLabel: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    fontWeight: '500' as const,
    color: COLORS.mainText,
  },
  
  // Input text
  input: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    fontWeight: '400' as const,
    color: COLORS.mainText,
  },
} as const;

// Gradient definitions podle HTML reference
export const GRADIENTS = {
  // Main background gradient - blue theme
  background: [
    COLORS.gradientStart,    // indigo-500 top-left
    COLORS.gradientMiddle,   // blue-500 middle  
    COLORS.gradientEnd,      // slate-800 bottom-right
  ],
  
  // Progress bar gradient with glow effect
  progress: [
    '#06B6D4',              // cyan-500
    '#22D3EE',              // cyan-400  
  ],
  
  // Button gradients
  selectButton: [
    'rgba(56, 189, 248, 0.2)',  // sky-400/20
    'rgba(56, 189, 248, 0.1)',  // sky-400/10
  ],
} as const;

// Animation durations podle HTML reference
export const ANIMATIONS = {
  gradient: 15000,          // 15s ease infinite
  blurBall1: 9000,          // 9s ease-in-out infinite
  blurBall2: 11000,         // 11s ease-in-out infinite  
  blurBall3: 13000,         // 13s ease-in-out infinite
  blurBall4: 10000,         // 10s ease-in-out infinite
  transition: 300,          // standard transition duration
  spring: {
    damping: 12,
    stiffness: 100,
  },
} as const;