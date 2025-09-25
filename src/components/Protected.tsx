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

// OFICIÁLNÍ SUPERWALL PATTERN - Komponenta pro supported environments s unconditional hooks
const SuperwallProtectedContent: React.FC<ProtectedProps> = ({ children, placement = PAYWALL_PLACEMENT }) => {
  // OFICIÁLNÍ ZPŮSOB: Všechny hooks musí být na začátku komponenty - unconditional podle React rules
  const { useUser, usePlacement } = require('expo-superwall');
  
  // OFICIÁLNÍ PATTERN: useUser hook podle dokumentace
  const { subscriptionStatus } = useUser();
  
  // State hooks - musí být unconditional
  const [paywallDismissed, setPaywallDismissed] = useState(false);
  const placementRegisteredRef = useRef(false);
  
  // OFICIÁLNÍ PATTERN: usePlacement hook podle dokumentace s safe error handling
  const { registerPlacement, state } = usePlacement({
    onError: (error: string) => {
      console.error('[Protected] Paywall error:', error);
    },
    onPresent: (paywallInfo: any) => {
      console.log('[Protected] Paywall presented:', paywallInfo?.name ?? 'unknown');
    },
    onDismiss: async (paywallInfo: any, result: any) => {
      console.log('[Protected] Paywall dismissed:', paywallInfo?.name, result?.type);
      
      if (result?.type === 'purchased' || result?.type === 'restored') {
        console.log('[Protected] Purchase/restore successful - Superwall SDK will automatically update subscription status');
        // OFICIÁLNÍ ZPŮSOB: SDK automaticky aktualizuje subscription status
      } else {
        console.log('[Protected] Paywall dismissed without purchase');
        setPaywallDismissed(true);
      }
    },
    onSkip: (reason: any) => {
      console.log('[Protected] Paywall skipped:', reason?.type ?? 'unknown');
    },
  });

  // Callback hooks - musí být unconditional
  const handleRetryPaywall = useCallback(() => {
    setPaywallDismissed(false);
    placementRegisteredRef.current = false;
  }, []);

  // OFICIÁLNÍ ZPŮSOB: Safe null checking podle Superwall best practices
  const hasActiveSubscription = subscriptionStatus?.status === 'ACTIVE';
  
  // OFICIÁLNÍ PATTERN: Register placement podle dokumentace
  useEffect(() => {
    if (!hasActiveSubscription && !paywallDismissed && !placementRegisteredRef.current) {
      placementRegisteredRef.current = true;
      
      console.log('[Protected] Registering placement:', placement);
      console.log('[Protected] Current subscription status:', subscriptionStatus?.status ?? 'undefined');
      
      // OFICIÁLNÍ ZPŮSOB: registerPlacement podle dokumentace
      registerPlacement({
        placement: placement || PAYWALL_PLACEMENT,
        params: {
          // Safe params object
          timestamp: Date.now(),
        },
        feature: () => {
          console.log('[Protected] Premium feature unlocked by Superwall SDK!');
          // Feature function volána pouze pokud má user přístup
        }
      }).catch((error: unknown) => {
        console.error('[Protected] Failed to register placement:', error);
        // Continue gracefully even if placement registration fails
      });
    }
  }, [hasActiveSubscription, paywallDismissed, placement, registerPlacement, subscriptionStatus?.status]);

  // Reset placement registration when paywall is dismissed
  useEffect(() => {
    if (paywallDismissed) {
      placementRegisteredRef.current = false;
    }
  }, [paywallDismissed]);

  // CRÍTICO FIX: Conditional rendering BEZ early returns - všechny hooks musí být executed
  // OFICIÁLNÍ ZPŮSOB: Pokud má active subscription, zobraz obsah
  if (hasActiveSubscription) {
    return <>{children}</>;
  }

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

  // Show loading state based on paywall state
  if (state.status === 'presented') {
    return <CenteredSpinner text="Processing..." />;
  }

  return <CenteredSpinner text="Checking subscription..." />;
};

// Komponenta pro unsupported environments
const UnsupportedEnvironmentContent: React.FC = () => (
  <View style={styles.centered}>
    <Text style={styles.unsupportedTitle}>Subscriptions not supported</Text>
    <Text style={styles.unsupportedText}>
      Purchases are not available in Expo Go/Web.{'\n'}
      Please use a production build to access premium features.
    </Text>
  </View>
);

// Hlavní komponenta s proper environment handling
const Protected: React.FC<ProtectedProps> = ({ children, placement = PAYWALL_PLACEMENT }) => {
  const { 
    loading, 
    subscriptionLoading, 
    subscriptionResolved, 
    isAuthenticated, 
  } = useAuth();
  
  const { isSupported } = useSuperwall();

  // CRITICAL: Check auth first before subscription loading
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // Gate: zobrazuj cokoliv až po tom, co máme auth hotové a subscriptionResolved===true
  if (loading || subscriptionLoading || !subscriptionResolved) {
    return <CenteredSpinner text="Loading..." />;
  }

  // OFICIÁLNÍ PATTERN: Handle unsupported environments
  if (subscriptionResolved && !isSupported) {
    return <UnsupportedEnvironmentContent />;
  }

  // OFICIÁLNÍ PATTERN: Render Superwall protected content pouze pro supported environments
  try {
    return (
      <SuperwallProtectedContent placement={placement}>
        {children}
      </SuperwallProtectedContent>
    );
  } catch (error) {
    console.error('[Protected] Superwall component error:', error);
    return <UnsupportedEnvironmentContent />;
  }
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