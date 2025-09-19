import * as Constants from 'expo-constants';
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