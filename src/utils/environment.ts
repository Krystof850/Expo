import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

// Global __DEV__ declaration for TypeScript
declare const __DEV__: boolean;

export interface AppEnvironment {
  isExpoGo: boolean;
  isDevelopmentBuild: boolean;
  isProduction: boolean;
  environment: string;
}

export const detectAppEnvironment = (): AppEnvironment => {
  const env = Constants.executionEnvironment;
  
  // Debug log for troubleshooting
  console.log('[Environment] Detection:', { 
    executionEnvironment: env, 
    platform: Platform.OS 
  });
  
  return {
    isExpoGo: env === ExecutionEnvironment.StoreClient,
    isDevelopmentBuild: env === ExecutionEnvironment.Bare,
    isProduction: env === ExecutionEnvironment.Standalone,
    environment: env || 'unknown'
  };
};

export const isSuperwallSupported = (): boolean => {
  // Superwall nefunguje na webu ani v Expo Go
  if (Platform.OS === 'web') {
    return false;
  }
  
  const env = Constants.executionEnvironment;
  // Superwall works in development builds and production builds, not in Expo Go
  const supported = env !== ExecutionEnvironment.StoreClient;
  
  console.log('[Superwall] Support check:', { 
    platform: Platform.OS, 
    executionEnvironment: env, 
    supported 
  });
  
  return supported;
};

// Mock product data pro development testování (před App Store Connect)
export interface MockProductData {
  id: string;
  name: string;
  price: number;
  priceString: string;
  currency: string;
  period: string;
}

export const getMockProductData = (): MockProductData[] => {
  return [
    {
      id: 'Annual_16',
      name: 'Annual Premium Subscription',
      price: 16.99,
      priceString: '$16.99',
      currency: 'USD',
      period: 'year'
    },
    {
      id: 'Monthly_17', 
      name: 'Monthly Premium Subscription',
      price: 1.99,
      priceString: '$1.99',
      currency: 'USD',
      period: 'month'
    }
  ];
};

export const isDevelopmentEnvironment = (): boolean => {
  const { isDevelopmentBuild, isExpoGo } = detectAppEnvironment();
  // Use process.env.NODE_ENV as fallback if __DEV__ is undefined
  const isDevMode = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development';
  return isDevelopmentBuild || isExpoGo || isDevMode;
};