import { Achievement } from '../types/achievement';

// Orb configuration based on timer duration
export interface OrbLevel {
  id: number;
  title: string;
  description: string;
  daysRequired: number;
  orbType: 'basic' | 'aura' | 'galaxy' | 'heartbeat' | 'lightning' | 'fire' | 'wave' | 'nature';
}

export const ORB_LEVELS: OrbLevel[] = [
  {
    id: 1,
    title: "Starting Journey",
    description: "Begin your procrastination-free transformation",
    daysRequired: 0,
    orbType: 'basic',
  },
  {
    id: 2,
    title: "First Steps",
    description: "Stay focused for the first few days",
    daysRequired: 3,
    orbType: 'aura',
  },
  {
    id: 3,
    title: "Galactic Focus", 
    description: "Maintain focus for a full week",
    daysRequired: 7,
    orbType: 'galaxy',
  },
  {
    id: 4,
    title: "Heartbeat Rhythm",
    description: "Build consistent habits over weeks",
    daysRequired: 21,
    orbType: 'heartbeat',
  },
  {
    id: 5,
    title: "Lightning Strike",
    description: "Complete a full month of focus",
    daysRequired: 30,
    orbType: 'lightning',
  },
  {
    id: 6,
    title: "Fire Keeper",
    description: "Reach new levels of productivity",
    daysRequired: 45,
    orbType: 'fire',
  },
  {
    id: 7,
    title: "Wave Master",
    description: "Master long-term dedication",
    daysRequired: 70,
    orbType: 'wave',
  },
  {
    id: 8,
    title: "Nature Guardian",
    description: "Achieve ultimate transformation",
    daysRequired: 90,
    orbType: 'nature',
  },
];

/**
 * Get current orb level based on timer duration (in days)
 */
export function getCurrentOrbLevel(days: number): OrbLevel {
  // Find the highest level that the user has achieved
  let currentLevel = ORB_LEVELS[0]; // Start with basic level
  
  for (const level of ORB_LEVELS) {
    if (days >= level.daysRequired) {
      currentLevel = level;
    } else {
      break; // Stop at first level that requires more days
    }
  }
  
  return currentLevel;
}

/**
 * Get next orb level for progress tracking
 */
export function getNextOrbLevel(currentDays: number): OrbLevel | null {
  const currentLevel = getCurrentOrbLevel(currentDays);
  const currentIndex = ORB_LEVELS.findIndex(level => level.id === currentLevel.id);
  
  // Return next level if available
  if (currentIndex < ORB_LEVELS.length - 1) {
    return ORB_LEVELS[currentIndex + 1];
  }
  
  return null; // Already at max level
}

/**
 * Calculate days until next orb level
 */
export function getDaysUntilNextLevel(currentDays: number): number | null {
  const nextLevel = getNextOrbLevel(currentDays);
  if (!nextLevel) return null;
  
  return nextLevel.daysRequired - currentDays;
}

/**
 * Convert timer time to total days
 */
export function convertTimeToDays(time: { days: number; hours: number; minutes: number; seconds: number }): number {
  return time.days + (time.hours / 24) + (time.minutes / (24 * 60)) + (time.seconds / (24 * 60 * 60));
}

/**
 * Calculate progress percentage toward next level
 */
export function getProgressToNextLevel(currentDays: number): number {
  const currentLevel = getCurrentOrbLevel(currentDays);
  const nextLevel = getNextOrbLevel(currentDays);
  
  if (!nextLevel) return 100; // Already at max level
  
  const progressDays = currentDays - currentLevel.daysRequired;
  const totalDaysRequired = nextLevel.daysRequired - currentLevel.daysRequired;
  
  return Math.min(100, (progressDays / totalDaysRequired) * 100);
}