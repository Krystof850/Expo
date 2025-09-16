import Constants, { ExecutionEnvironment } from 'expo-constants';

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
  const { isExpoGo } = detectAppEnvironment();
  return !isExpoGo; // Superwall funguje jen mimo Expo Go
};