import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
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

      // Use existing progress collection with temptation data
      const userProgressRef = doc(db, 'progress', userId);
      const userProgressDoc = await getDoc(userProgressRef);

      if (userProgressDoc.exists()) {
        const existingData = userProgressDoc.data();
        const currentTemptations = existingData.temptationsByTimeOfDay || {
          morning: 0,
          afternoon: 0,
          evening: 0,
          night: 0,
        };

        // Update existing document
        await updateDoc(userProgressRef, {
          [`temptationsByTimeOfDay.${timeOfDay}`]: (currentTemptations[timeOfDay] || 0) + 1,
          lastTemptationUpdate: Date.now()
        });
      } else {
        // Create new document with temptation data
        const initialData = {
          userId,
          temptationsOvercome: 0,
          temptationsByTimeOfDay: {
            morning: timeOfDay === 'morning' ? 1 : 0,
            afternoon: timeOfDay === 'afternoon' ? 1 : 0,
            evening: timeOfDay === 'evening' ? 1 : 0,
            night: timeOfDay === 'night' ? 1 : 0,
          },
          lastTemptationUpdate: Date.now(),
          // Add default progress fields to avoid conflicts
          startTime: Date.now(),
          currentStreak: 0,
          bestStreak: 0,
          totalResets: 0,
          currentOrbLevel: 1,
          lastUpdated: Date.now()
        };
        await setDoc(userProgressRef, initialData);
      }

      console.log(`📊 Temptation tracked: ${timeOfDay} (hour: ${hour})`);
    } catch (error) {
      console.error('❌ Error tracking temptation generation:', error);
    }
  }

  // Track when user successfully completes a task
  static async trackTemptationOvercome(userId: string): Promise<void> {
    try {
      // Use existing progress collection
      const userProgressRef = doc(db, 'progress', userId);
      const userProgressDoc = await getDoc(userProgressRef);

      if (userProgressDoc.exists()) {
        const existingData = userProgressDoc.data();
        const currentOvercome = existingData.temptationsOvercome || 0;

        // Update existing document
        await updateDoc(userProgressRef, {
          temptationsOvercome: currentOvercome + 1,
          lastTemptationUpdate: Date.now()
        });
      } else {
        // Create new document with first successful completion
        const initialData = {
          userId,
          temptationsOvercome: 1,
          temptationsByTimeOfDay: {
            morning: 0,
            afternoon: 0,
            evening: 0,
            night: 0,
          },
          lastTemptationUpdate: Date.now(),
          // Add default progress fields
          startTime: Date.now(),
          currentStreak: 0,
          bestStreak: 0,
          totalResets: 0,
          currentOrbLevel: 1,
          lastUpdated: Date.now()
        };
        await setDoc(userProgressRef, initialData);
      }

      console.log('🎉 Temptation overcome tracked successfully');
    } catch (error) {
      console.error('❌ Error tracking temptation overcome:', error);
    }
  }

  // Get user's temptation statistics from progress collection
  static async getUserTemptationStats(userId: string): Promise<TemptationData | null> {
    try {
      const userProgressRef = doc(db, 'progress', userId);
      const userProgressDoc = await getDoc(userProgressRef);

      if (userProgressDoc.exists()) {
        const data = userProgressDoc.data();
        return {
          userId,
          temptationsOvercome: data.temptationsOvercome || 0,
          temptationsByTimeOfDay: data.temptationsByTimeOfDay || {
            morning: 0,
            afternoon: 0,
            evening: 0,
            night: 0,
          },
          lastUpdated: data.lastTemptationUpdate || Date.now()
        };
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
  }
}