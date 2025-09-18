export interface Achievement {
  id: number;
  title: string;
  description: string;
  isUnlocked: boolean;
  target?: string;
  orbType: 'basic' | 'aura' | 'galaxy' | 'heartbeat' | 'lightning' | 'fire' | 'wave' | 'nature';
}

export interface UserProgress {
  userId: string;
  startTime: number;
  currentStreak: number;
  bestStreak: number;
  currentOrbLevel: number;
  totalResets: number;
  lastUpdated: number;
  // Temptation tracking fields
  temptationsOvercome?: number;
  temptationsByTimeOfDay?: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  lastTemptationUpdate?: number;
}