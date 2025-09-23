import React from 'react';
import { Alert } from 'react-native';
import { isSuperwallSupported } from '../utils/environment';
import Constants from 'expo-constants';
import { useAuth } from '../context/AuthContext';

interface ConditionalSuperwallProviderProps {
  children: React.ReactNode;
}

// Dynamický import pro Superwall - jen pokud je podporován
const ConditionalSuperwallProvider: React.FC<ConditionalSuperwallProviderProps> = ({ children }) => {
  const superwallSupported = isSuperwallSupported();
  
  // Hook must be at top level (React Hooks rules)
  const { checkSubscriptionStatus } = useAuth();
  
  if (!superwallSupported) {
    // V Expo Go - bez Superwall
    console.log('🚀 Running in Expo Go - Superwall disabled');
    return <>{children}</>;
  }

  // V development/production buildu - s Superwall
  console.log('🚀 Running in Development/Production Build - Superwall enabled');
  
  try {
    const { SuperwallProvider, CustomPurchaseControllerProvider, Superwall } = require('expo-superwall');
    const superwallApiKey = Constants.expoConfig?.extra?.SUPERWALL_API_KEY;

    const handlePurchaseRestore = async () => {
      console.log('[RESTORE] Starting restore purchases...');
      
      try {
        await Superwall.restorePurchases();
        console.log('[RESTORE] Superwall.restorePurchases() completed');
        
        if (Superwall.syncPurchases) {
          await Superwall.syncPurchases();
          console.log('[RESTORE] syncPurchases done');
        }
        
        // Refresh entitlementů přes stávající mechanismus
        await checkSubscriptionStatus();
        console.log('[RESTORE] Entitlements refreshed');
        
        Alert.alert('Restore Successful', 'Your purchases have been restored.');
      } catch (error: any) {
        console.error('[RESTORE] Error during restore:', error);
        
        if (error.message?.includes('no purchases') || error.message?.includes('not found')) {
          console.log('[RESTORE] No previous purchases found');
          Alert.alert('No Purchases Found', 'No previous purchases were found for this account.');
        } else {
          console.error('[RESTORE] Restore failed with error:', error);
          Alert.alert('Restore Failed', 'Unable to restore purchases. Please try again.');
        }
      }
    };

    return (
      <CustomPurchaseControllerProvider
        onPurchaseRestore={handlePurchaseRestore}
      >
        <SuperwallProvider
          apiKeys={{
            ios: superwallApiKey,
            android: superwallApiKey,
          }}
        >
          {children}
        </SuperwallProvider>
      </CustomPurchaseControllerProvider>
    );
  } catch (error) {
    console.warn('⚠️ Superwall not available:', error);
    return <>{children}</>;
  }
};

export default ConditionalSuperwallProvider;