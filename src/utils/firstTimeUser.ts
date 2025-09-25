import AsyncStorage from '@react-native-async-storage/async-storage';

const FIRST_TIME_USER_KEY = 'first_time_user';

/**
 * Check if this is the user's first time opening the app
 * Returns true only on the very first app launch
 */
export const isFirstTimeUser = async (): Promise<boolean> => {
  try {
    const firstTimeData = await AsyncStorage.getItem(FIRST_TIME_USER_KEY);
    return firstTimeData === null; // null means never set, so it's first time
  } catch (error) {
    console.error('Error checking first time user:', error);
    return false; // Default to false if error occurs
  }
};

/**
 * Mark that the user has opened the app (no longer first time)
 * Should be called immediately after first app launch
 */
export const markFirstTimeComplete = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(FIRST_TIME_USER_KEY, 'completed');
    console.log('📱 First time user status marked as completed');
  } catch (error) {
    console.error('Error marking first time complete:', error);
  }
};

/**
 * Reset first time user status (for development/testing only)
 */
export const resetFirstTimeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(FIRST_TIME_USER_KEY);
    console.log('📱 First time user status reset');
  } catch (error) {
    console.error('Error resetting first time user:', error);
  }
};