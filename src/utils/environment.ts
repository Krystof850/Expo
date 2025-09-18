import Constants, { ExecutionEnvironment } from 'expo-constants';
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
    isExpoGo: env === ExecutionEnvironment.StoreClient,
    isDevelopmentBuild: env === ExecutionEnvironment.Bare,
    isProduction: env === ExecutionEnvironment.Standalone,
    environment: env
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