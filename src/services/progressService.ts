import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  Timestamp,
  onSnapshot 
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
          lastUpdated: (data.lastUpdated instanceof Timestamp) ? data.lastUpdated.toMillis() : (typeof data.lastUpdated === 'number' ? data.lastUpdated : Date.now()),
          // Temptation tracking fields
          temptationsOvercome: data.temptationsOvercome || 0,
          temptationsByTimeOfDay: data.temptationsByTimeOfDay || {
            morning: 0,
            afternoon: 0,
            evening: 0,
            night: 0,
          },
          lastTemptationUpdate: data.lastTemptationUpdate || Date.now(),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error; // Propagate error to prevent accidental data overwrite
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
      // Initialize temptation tracking
      temptationsOvercome: 0,
      temptationsByTimeOfDay: {
        morning: 0,
        afternoon: 0,
        evening: 0,
        night: 0,
      },
      lastTemptationUpdate: now,
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
      // Don't auto-update currentOrbLevel - preserve manual database changes
      
      const updatedProgress: Partial<UserProgress> = {
        startTime,
        currentStreak: totalDays,
        // currentOrbLevel removed - let database keep manual values
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
        currentOrbLevel: 1, // Default fallback if no existing progress
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
    try {
      let progress = await this.getUserProgress(userId);
      
      if (!progress) {
        progress = await this.initializeUserProgress(userId);
      }
      
      return progress;
    } catch (error) {
      console.error('Error in getOrCreateUserProgress, falling back to local storage:', error);
      throw error; // Let caller handle fallback to prevent data loss
    }
  }

  /**
   * Subscribe to real-time user progress updates
   */
  static subscribeToUserProgress(
    userId: string, 
    callback: (progress: UserProgress | null) => void
  ): () => void {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, userId);
      
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const progress: UserProgress = {
            userId,
            startTime: data.startTime || Date.now(),
            currentStreak: data.currentStreak || 0,
            bestStreak: data.bestStreak || 0,
            currentOrbLevel: data.currentOrbLevel || 1,
            totalResets: data.totalResets || 0,
            lastUpdated: (data.lastUpdated instanceof Timestamp) ? data.lastUpdated.toMillis() : (typeof data.lastUpdated === 'number' ? data.lastUpdated : Date.now()),
            // Temptation tracking fields for real-time sync
            temptationsOvercome: data.temptationsOvercome || 0,
            temptationsByTimeOfDay: data.temptationsByTimeOfDay || {
              morning: 0,
              afternoon: 0,
              evening: 0,
              night: 0,
            },
            lastTemptationUpdate: data.lastTemptationUpdate || Date.now(),
          };
          callback(progress);
        } else {
          callback(null);
        }
      }, (error) => {
        console.error('Real-time listener error:', error);
        callback(null);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up real-time listener:', error);
      return () => {};
    }
  }

  /**
   * Track when AI generates a task (for time of day statistics)
   */
  static async trackTemptationGenerated(userId: string): Promise<void> {
    try {
      const now = new Date();
      const hour = now.getHours();
      
      // Determine time of day category
      let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
      if (hour >= 6 && hour < 12) {
        timeOfDay = 'morning';
      } else if (hour >= 12 && hour < 18) {
        timeOfDay = 'afternoon';
      } else if (hour >= 18 && hour < 23) {
        timeOfDay = 'evening';
      } else {
        timeOfDay = 'night';
      }

      // Get or create user progress first
      const existingProgress = await this.getOrCreateUserProgress(userId);
      
      const currentTemptations = existingProgress.temptationsByTimeOfDay || {
        morning: 0,
        afternoon: 0,
        evening: 0,
        night: 0,
      };

      // Update existing document
      const docRef = doc(db, this.COLLECTION_NAME, userId);
      await updateDoc(docRef, {
        [`temptationsByTimeOfDay.${timeOfDay}`]: (currentTemptations[timeOfDay] || 0) + 1,
        lastTemptationUpdate: serverTimestamp(),
      });

      console.log(`📊 Temptation tracked: ${timeOfDay} (hour: ${hour})`);
    } catch (error) {
      console.error('❌ Error tracking temptation generation:', error);
    }
  }

  /**
   * Track when user successfully completes a task
   */
  static async trackTemptationOvercome(userId: string): Promise<void> {
    try {
      // Get or create user progress first
      const existingProgress = await this.getOrCreateUserProgress(userId);
      const currentOvercome = existingProgress.temptationsOvercome || 0;

      // Update existing document
      const docRef = doc(db, this.COLLECTION_NAME, userId);
      await updateDoc(docRef, {
        temptationsOvercome: currentOvercome + 1,
        lastTemptationUpdate: serverTimestamp(),
      });

      console.log('🎉 Temptation overcome tracked successfully');
    } catch (error) {
      console.error('❌ Error tracking temptation overcome:', error);
    }
  }
}