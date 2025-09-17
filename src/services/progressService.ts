import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProgress } from '../types/achievement';
import { getCurrentOrbLevel, convertTimeToDays } from '../utils/orbLogic';

export class ProgressService {
  private static COLLECTION_NAME = 'userProgress';

  /**
   * Get user progress from Firebase
   */
  static async getUserProgress(userId: string): Promise<UserProgress | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          userId,
          startTime: data.startTime || Date.now(),
          currentStreak: data.currentStreak || 0,
          bestStreak: data.bestStreak || 0,
          currentOrbLevel: data.currentOrbLevel || 1,
          totalResets: data.totalResets || 0,
          lastUpdated: data.lastUpdated?.toMillis() || Date.now(),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return null;
    }
  }

  /**
   * Initialize user progress for new user
   */
  static async initializeUserProgress(userId: string): Promise<UserProgress> {
    const now = Date.now();
    const initialProgress: UserProgress = {
      userId,
      startTime: now,
      currentStreak: 0,
      bestStreak: 0,
      currentOrbLevel: 1,
      totalResets: 0,
      lastUpdated: now,
    };

    try {
      const docRef = doc(db, this.COLLECTION_NAME, userId);
      await setDoc(docRef, {
        ...initialProgress,
        lastUpdated: serverTimestamp(),
      });
      
      console.log('User progress initialized successfully');
      return initialProgress;
    } catch (error) {
      console.error('Error initializing user progress:', error);
      throw error;
    }
  }

  /**
   * Update user progress with current timer data
   */
  static async updateUserProgress(
    userId: string, 
    time: { days: number; hours: number; minutes: number; seconds: number },
    startTime: number
  ): Promise<UserProgress> {
    try {
      const totalDays = convertTimeToDays(time);
      const currentLevel = getCurrentOrbLevel(totalDays);
      
      const updatedProgress: Partial<UserProgress> = {
        startTime,
        currentStreak: totalDays,
        currentOrbLevel: currentLevel.id,
        lastUpdated: Date.now(),
      };

      // Update best streak if current is higher
      const existingProgress = await this.getUserProgress(userId);
      if (existingProgress && totalDays > existingProgress.bestStreak) {
        updatedProgress.bestStreak = totalDays;
      }

      const docRef = doc(db, this.COLLECTION_NAME, userId);
      await updateDoc(docRef, {
        ...updatedProgress,
        lastUpdated: serverTimestamp(),
      });

      // Return updated progress
      const newProgress = await this.getUserProgress(userId);
      return newProgress || {
        userId,
        startTime,
        currentStreak: totalDays,
        bestStreak: updatedProgress.bestStreak || totalDays,
        currentOrbLevel: currentLevel.id,
        totalResets: 0,
        lastUpdated: Date.now(),
      };
      
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
  }

  /**
   * Reset timer (when user fails)
   */
  static async resetUserTimer(userId: string): Promise<UserProgress> {
    try {
      const existingProgress = await this.getUserProgress(userId);
      const now = Date.now();
      
      const resetProgress: Partial<UserProgress> = {
        startTime: now,
        currentStreak: 0,
        currentOrbLevel: 1, // Reset to basic orb
        totalResets: (existingProgress?.totalResets || 0) + 1,
        lastUpdated: now,
      };

      // Keep best streak unchanged
      if (existingProgress?.bestStreak) {
        resetProgress.bestStreak = existingProgress.bestStreak;
      }

      const docRef = doc(db, this.COLLECTION_NAME, userId);
      await updateDoc(docRef, {
        ...resetProgress,
        lastUpdated: serverTimestamp(),
      });

      console.log('User timer reset successfully');
      
      // Return updated progress
      const newProgress = await this.getUserProgress(userId);
      return newProgress || {
        userId,
        startTime: now,
        currentStreak: 0,
        bestStreak: existingProgress?.bestStreak || 0,
        currentOrbLevel: 1,
        totalResets: resetProgress.totalResets || 1,
        lastUpdated: now,
      };
      
    } catch (error) {
      console.error('Error resetting user timer:', error);
      throw error;
    }
  }

  /**
   * Get or create user progress
   */
  static async getOrCreateUserProgress(userId: string): Promise<UserProgress> {
    let progress = await this.getUserProgress(userId);
    
    if (!progress) {
      progress = await this.initializeUserProgress(userId);
    }
    
    return progress;
  }
}