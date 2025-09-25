import React, { ReactNode, useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useUser, usePlacement } from 'expo-superwall';
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

// OFICIÁLNÍ SUPERWALL PATTERN - Main protected content component
const Protected: React.FC<ProtectedProps> = ({ children, placement = PAYWALL_PLACEMENT }) => {
  const { loading, isAuthenticated } = useAuth();
  
  // OFICIÁLNÍ ZPŮSOB: useUser hook z Superwall SDK
  const { subscriptionStatus } = useUser();
  
  // Local state for paywall management
  const [paywallDismissed, setPaywallDismissed] = useState(false);
  const placementRegisteredRef = useRef(false);
  
  // OFICIÁLNÍ ZPŮSOB: usePlacement hook podle example aplikace
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
        console.log('[Protected] Purchase/restore successful');
        Alert.alert("Success! 🎉", "Subscription activated successfully!");
      } else {
        console.log('[Protected] Paywall dismissed without purchase');
        setPaywallDismissed(true);
      }
    },
    onSkip: (reason: any) => {
      console.log('[Protected] Paywall skipped:', reason?.type ?? 'unknown');
    },
  });

  // Retry paywall callback
  const handleRetryPaywall = useCallback(() => {
    setPaywallDismissed(false);
    placementRegisteredRef.current = false;
  }, []);

  // OFICIÁLNÍ ZPŮSOB: Check subscription status
  const hasActiveSubscription = subscriptionStatus?.status === 'ACTIVE';
  
  // OFICIÁLNÍ PATTERN: Always register placement - let SDK decide according to docs
  useEffect(() => {
    if (!paywallDismissed && !placementRegisteredRef.current) {
      placementRegisteredRef.current = true;
      
      console.log('[Protected] Registering placement:', placement);
      console.log('[Protected] Current subscription status:', subscriptionStatus?.status ?? 'undefined');
      
      // OFICIÁLNÍ ZPŮSOB: registerPlacement according to example app
      registerPlacement({
        placement: placement || PAYWALL_PLACEMENT,
        feature: () => {
          console.log('[Protected] Feature unlocked by Superwall SDK!');
        },
      }).catch((error: unknown) => {
        console.error('[Protected] Failed to register placement:', error);
      });
    }
  }, [paywallDismissed, placement, registerPlacement, subscriptionStatus?.status]);

  // Reset placement registration when paywall is dismissed
  useEffect(() => {
    if (paywallDismissed) {
      placementRegisteredRef.current = false;
    }
  }, [paywallDismissed]);

  // OFICIÁLNÍ ZPŮSOB: Loading state first - prevent premature redirects
  if (loading) {
    return <CenteredSpinner text="Loading..." />;
  }

  // Auth check after loading is complete
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // OFICIÁLNÍ ZPŮSOB: If has active subscription, show content
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
  if (state?.status === 'presented') {
    return <CenteredSpinner text="Processing..." />;
  }

  return <CenteredSpinner text="Checking subscription..." />;
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