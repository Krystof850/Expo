import React, { useState, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import { isSuperwallSupported } from '../utils/environment';
import Constants from 'expo-constants';

interface ConditionalSuperwallProviderProps {
  children: React.ReactNode;
}

// Dynamický import pro Superwall - jen pokud je podporován
const ConditionalSuperwallProvider: React.FC<ConditionalSuperwallProviderProps> = ({ children }) => {
  const superwallSupported = isSuperwallSupported();
  const [isRestoring, setIsRestoring] = useState(false);
  const restoringRef = useRef(false);
  
  if (!superwallSupported) {
    // V Expo Go - bez Superwall
    console.log('🚀 Running in Expo Go - Superwall disabled');
    return <>{children}</>;
  }

  // V development/production buildu - s Superwall
  console.log('🚀 Running in Development/Production Build - Superwall enabled');
  
  try {
    const { CustomPurchaseControllerProvider, SuperwallProvider, Superwall } = require('expo-superwall');
    const superwallApiKey = Constants.expoConfig?.extra?.SUPERWALL_API_KEY;

    // onPurchaseRestore callback - volá se když uživatel klikne na Restore v paywallu
    const handlePurchaseRestore = async () => {
      // Zabráníme vícenásobnému volání restore
      if (restoringRef.current) {
        console.log('[ConditionalSuperwallProvider] Restore already in progress, ignoring...');
        return;
      }

      console.log('[ConditionalSuperwallProvider] Starting purchase restore...');
      restoringRef.current = true;
      setIsRestoring(true);

      try {
        // Zavolej nativní StoreKit restore přes Superwall
        console.log('[ConditionalSuperwallProvider] Calling Superwall.restorePurchases()...');
        const restoreResult = await Superwall.restorePurchases();
        console.log('[ConditionalSuperwallProvider] Superwall restore result:', restoreResult);

        if (restoreResult?.success !== false) {
          // Úspěšné obnovení nebo žádné chyby
          console.log('[ConditionalSuperwallProvider] Purchases restored successfully');
          
          // Zavři paywall automaticky
          try {
            await Superwall.dismissPaywall();
            console.log('[ConditionalSuperwallProvider] Paywall dismissed after successful restore');
          } catch (dismissError) {
            console.warn('[ConditionalSuperwallProvider] Could not dismiss paywall:', dismissError);
          }

          // Zobraz potvrzení uživateli
          Alert.alert(
            'Purchases Restored',
            'Your previous purchases have been successfully restored.',
            [{ text: 'OK' }]
          );
        } else if (restoreResult?.error?.code === 'no_purchases_found') {
          // Žádné nákupy k obnovení
          console.log('[ConditionalSuperwallProvider] No previous purchases found');
          Alert.alert(
            'No Previous Purchases',
            'No previous purchases found for this Apple ID.',
            [{ text: 'OK' }]
          );
        } else {
          // Obecná chyba
          throw new Error(restoreResult?.error?.message || 'Unknown restore error');
        }
      } catch (error: any) {
        console.error('[ConditionalSuperwallProvider] Error during restore:', error);
        
        // Zpracování specifických chyb
        let errorMessage = 'An error occurred while restoring purchases. Please try again.';
        
        if (error.code === 'user_cancelled' || error.message?.includes('cancelled')) {
          console.log('[ConditionalSuperwallProvider] User cancelled restore');
          return; // Nebudeme zobrazovat chybu pro zrušení
        } else if (error.code === 'store_unavailable' || error.message?.includes('store')) {
          errorMessage = 'App Store is currently unavailable. Please try again later.';
        } else if (error.code === 'network_error' || error.message?.includes('network')) {
          errorMessage = 'Please check your internet connection and try again.';
        }
        
        Alert.alert('Restore Error', errorMessage, [{ text: 'OK' }]);
      } finally {
        restoringRef.current = false;
        setIsRestoring(false);
        console.log('[ConditionalSuperwallProvider] Restore process completed');
      }
    };

    return (
      <CustomPurchaseControllerProvider
        controller={{
          onPurchaseRestore: handlePurchaseRestore
        }}
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