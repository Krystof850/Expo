import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface TemptationData {
  userId: string;
  temptationsOvercome: number; // Successfully completed tasks
  temptationsByTimeOfDay: {
    morning: number;   // 6:00 - 11:59
    afternoon: number; // 12:00 - 17:59
    evening: number;   // 18:00 - 22:59
    night: number;     // 23:00 - 5:59
  };
  lastUpdated: number;
}

export class TemptationService {
  // Track when AI generates a task (for time of day statistics)
  static async trackTemptationGenerated(userId: string): Promise<void> {
    try {
      const now = new Date();
      const hour = now.getHours();
      
      // Determine time of day category
      let timeOfDay: keyof TemptationData['temptationsByTimeOfDay'];
      if (hour >= 6 && hour < 12) {
        timeOfDay = 'morning';
      } else if (hour >= 12 && hour < 18) {
        timeOfDay = 'afternoon';
      } else if (hour >= 18 && hour < 23) {
        timeOfDay = 'evening';
      } else {
        timeOfDay = 'night';
      }

      const userTemptationRef = doc(db, 'temptations', userId);
      const userTemptationDoc = await getDoc(userTemptationRef);

      if (userTemptationDoc.exists()) {
        // Update existing document
        await updateDoc(userTemptationRef, {
          [`temptationsByTimeOfDay.${timeOfDay}`]: increment(1),
          lastUpdated: Date.now()
        });
      } else {
        // Create new document
        const initialData: TemptationData = {
          userId,
          temptationsOvercome: 0,
          temptationsByTimeOfDay: {
            morning: timeOfDay === 'morning' ? 1 : 0,
            afternoon: timeOfDay === 'afternoon' ? 1 : 0,
            evening: timeOfDay === 'evening' ? 1 : 0,
            night: timeOfDay === 'night' ? 1 : 0,
          },
          lastUpdated: Date.now()
        };
        await setDoc(userTemptationRef, initialData);
      }

      console.log(`📊 Temptation tracked: ${timeOfDay} (hour: ${hour})`);
    } catch (error) {
      console.error('❌ Error tracking temptation generation:', error);
    }
  }

  // Track when user successfully completes a task
  static async trackTemptationOvercome(userId: string): Promise<void> {
    try {
      const userTemptationRef = doc(db, 'temptations', userId);
      const userTemptationDoc = await getDoc(userTemptationRef);

      if (userTemptationDoc.exists()) {
        // Update existing document
        await updateDoc(userTemptationRef, {
          temptationsOvercome: increment(1),
          lastUpdated: Date.now()
        });
      } else {
        // Create new document with first successful completion
        const initialData: TemptationData = {
          userId,
          temptationsOvercome: 1,
          temptationsByTimeOfDay: {
            morning: 0,
            afternoon: 0,
            evening: 0,
            night: 0,
          },
          lastUpdated: Date.now()
        };
        await setDoc(userTemptationRef, initialData);
      }

      console.log('🎉 Temptation overcome tracked successfully');
    } catch (error) {
      console.error('❌ Error tracking temptation overcome:', error);
    }
  }

  // Get user's temptation statistics
  static async getUserTemptationStats(userId: string): Promise<TemptationData | null> {
    try {
      const userTemptationRef = doc(db, 'temptations', userId);
      const userTemptationDoc = await getDoc(userTemptationRef);

      if (userTemptationDoc.exists()) {
        return userTemptationDoc.data() as TemptationData;
      } else {
        // Return default empty stats
        return {
          userId,
          temptationsOvercome: 0,
          temptationsByTimeOfDay: {
            morning: 0,
            afternoon: 0,
            evening: 0,
            night: 0,
          },
          lastUpdated: Date.now()
        };
      }
    } catch (error) {
      console.error('❌ Error fetching temptation stats:', error);
      return null;
    }
  }

  // Subscribe to real-time updates for temptation statistics
  static subscribeToTemptationStats(
    userId: string, 
    callback: (stats: TemptationData | null) => void
  ): (() => void) | null {
    try {
      const userTemptationRef = doc(db, 'temptations', userId);
      
      // Import onSnapshot dynamically to avoid import issues
      import('firebase/firestore').then(({ onSnapshot }) => {
        const unsubscribe = onSnapshot(userTemptationRef, (doc) => {
          if (doc.exists()) {
            callback(doc.data() as TemptationData);
          } else {
            // Return default empty stats
            callback({
              userId,
              temptationsOvercome: 0,
              temptationsByTimeOfDay: {
                morning: 0,
                afternoon: 0,
                evening: 0,
                night: 0,
              },
              lastUpdated: Date.now()
            });
          }
        });
        
        return unsubscribe;
      });
      
      return () => {}; // Placeholder return
    } catch (error) {
      console.error('❌ Error setting up temptation stats subscription:', error);
      return null;
    }
  }
}