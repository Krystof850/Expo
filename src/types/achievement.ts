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
}