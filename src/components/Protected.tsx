import React, { ReactNode, useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useSuperwall } from './SuperwallIntegration';
import { PAYWALL_PLACEMENT } from '../constants/paywall';

interface ProtectedProps {
  children: ReactNode;
  placement?: string;
}

// Centralized spinner component
const CenteredSpinner: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <View style={styles.centered}>
    <ActivityIndicator size="large" color="#2563eb" />
    <Text style={styles.loadingText}>{text}</Text>
  </View>
);

const Protected: React.FC<ProtectedProps> = ({ children, placement = PAYWALL_PLACEMENT }) => {
  const { 
    loading, 
    subscriptionLoading, 
    subscriptionResolved, 
    isAuthenticated, 
  } = useAuth();
  
  const { isSupported } = useSuperwall();
  const [paywallDismissed, setPaywallDismissed] = useState(false);

  // CRITICAL: Check auth first before subscription loading
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // Gate: zobrazuj cokoliv až po tom, co máme auth hotové a subscriptionResolved===true
  if (loading || subscriptionLoading || !subscriptionResolved) {
    return <CenteredSpinner text="Loading..." />;
  }

  // CRITICAL: Handle unsupported environments
  if (subscriptionResolved && !isSupported) {
    return (
      <View style={styles.centered}>
        <Text style={styles.unsupportedTitle}>Subscriptions not supported</Text>
        <Text style={styles.unsupportedText}>
          Purchases are not available in Expo Go/Web.{'\n'}
          Please use a production build to access premium features.
        </Text>
      </View>
    );
  }

  // OFICIÁLNÍ SUPERWALL PATTERN - hooks only for supported environments (architect feedback)
  const SuperwallPaywallTrigger: React.FC = () => {
    if (!isSupported) return null;
    
    const { usePlacement, useUser } = require('expo-superwall');
    
    // OFICIÁLNÍ ZPŮSOB: Číst subscription status přímo od Superwall SDK
    const { subscriptionStatus } = useUser();
    const hasActiveSubscription = subscriptionStatus?.status === 'ACTIVE';
      
      // Hook pro prezentaci paywall podle oficiální dokumentace
      const { registerPlacement } = usePlacement({
        onError: (error: any) => {
          console.log('[Protected] Paywall error:', error);
        },
        onPresent: (info: any) => {
          console.log('[Protected] Paywall presented:', info);
        },
        onDismiss: async (info: any, result: any) => {
          console.log('[Protected] Paywall dismissed:', info, result);
          
          // OFICIÁLNÍ ZPŮSOB: Superwall SDK automaticky updatuje subscription status
          // Nepotřebujeme custom logic - SDK komunikuje s Apple App Store automaticky
          
          if (result?.purchased === true || result?.type === 'purchased') {
            console.log('[Protected] Purchase successful - Superwall SDK will automatically update subscription status');
            
            // Sync podle dokumentace - ale Superwall SDK to dělá automaticky
            try {
              const { Superwall } = require('expo-superwall');
              await Superwall.syncPurchases?.().catch(() => {});
            } catch (error) {
              console.log('[Protected] Purchase sync handled by SDK');
            }
          } else if (result?.type === 'restored') {
            console.log('[Protected] Purchase restored - Superwall SDK will automatically update subscription status');
            
            try {
              const { Superwall } = require('expo-superwall');
              await Superwall.syncPurchases?.().catch(() => {});
            } catch (error) {
              console.log('[Protected] Restore sync handled by SDK');
            }
          } else {
            console.log('[Protected] Paywall dismissed without purchase');
            setPaywallDismissed(true);
          }
        },
      });

      // OFICIÁLNÍ PATTERN: Pokud nemá subscription, zaregistruj placement
      const placementRegisteredRef = useRef(false);
      useEffect(() => {
        if (!hasActiveSubscription && !paywallDismissed && isSupported && !placementRegisteredRef.current) {
          console.log('[Protected] User needs subscription - registering placement:', placement);
          console.log('[Protected] Current Superwall subscription status:', subscriptionStatus?.status);
          
          placementRegisteredRef.current = true;
          
          // OFICIÁLNÍ ZPŮSOB: registerPlacement automaticky rozhodne, zda zobrazit paywall
          const unregister = registerPlacement({
            placement,
            feature() {
              console.log('[Protected] Premium feature unlocked by Superwall SDK!');
              // Superwall SDK automaticky updatoval subscription status
            }
          });
          
          // Cleanup function (architect feedback)
          return () => {
            if (typeof unregister === 'function') {
              unregister();
            }
            placementRegisteredRef.current = false;
          };
        }
      }, [hasActiveSubscription, paywallDismissed, isSupported, placement, subscriptionStatus, registerPlacement]);

      // OFICIÁLNÍ ZPŮSOB: Pokud má active subscription, zobraz obsah
      if (hasActiveSubscription) {
        return <>{children}</>;
      }

      return null;
  };

  // Manual retry handler pro dismissed paywall
  const handleRetryPaywall = () => {
    setPaywallDismissed(false);
  };

  // Show dismissed state with retry option
  if (paywallDismissed) {
    return (
      <View style={styles.centered}>
        <Text style={styles.subscriptionTitle}>Subscription Required</Text>
        <Text style={styles.subscriptionText}>
          You need an active subscription to access this content.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={handleRetryPaywall}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render oficiální Superwall pattern
  return (
    <>
      <SuperwallPaywallTrigger />
      <CenteredSpinner text="Checking subscription..." />
    </>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  unsupportedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  unsupportedText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  subscriptionText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Protected;