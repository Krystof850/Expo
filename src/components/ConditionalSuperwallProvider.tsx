import React from 'react';
import { isSuperwallSupported } from '../utils/environment';
import Constants from 'expo-constants';

interface ConditionalSuperwallProviderProps {
  children: React.ReactNode;
}

// Dynamický import pro Superwall - jen pokud je podporován
const ConditionalSuperwallProvider: React.FC<ConditionalSuperwallProviderProps> = ({ children }) => {
  const superwallSupported = isSuperwallSupported();
  
  if (!superwallSupported) {
    // V Expo Go - bez Superwall
    console.log('🚀 Running in Expo Go - Superwall disabled');
    return <>{children}</>;
  }

  // V development/production buildu - s Superwall
  console.log('🚀 Running in Development/Production Build - Superwall enabled');
  
  try {
    const { SuperwallProvider } = require('expo-superwall');
    const superwallApiKey = Constants.expoConfig?.extra?.SUPERWALL_API_KEY;

    return (
      <SuperwallProvider
        apiKeys={{
          ios: superwallApiKey,
          android: superwallApiKey,
        }}
      >
        {children}
      </SuperwallProvider>
    );
  } catch (error) {
    console.warn('⚠️ Superwall not available:', error);
    return <>{children}</>;
  }
};

export default ConditionalSuperwallProvider;