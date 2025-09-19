import Constants from 'expo-constants';
import { Platform } from 'react-native';

export interface AppEnvironment {
  isExpoGo: boolean;
  isDevelopmentBuild: boolean;
  isProduction: boolean;
  environment: string;
}

export const detectAppEnvironment = (): AppEnvironment => {
  const env = Constants.executionEnvironment;
  
  return {
    isExpoGo: env === 'storeClient',
    isDevelopmentBuild: env === 'bare',
    isProduction: env === 'standalone',
    environment: env || 'unknown'
  };
};

export const isSuperwallSupported = (): boolean => {
  // Superwall nefunguje na webu ani v Expo Go
  if (Platform.OS === 'web') {
    return false;
  }
  
  const { isExpoGo } = detectAppEnvironment();
  return !isExpoGo; // Superwall funguje jen na native platformách mimo Expo Go
};