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
  return isDevelopmentBuild || isExpoGo || __DEV__;
};