import React, { ReactNode, useEffect, useState } from 'react';
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
    canAccessProtected, 
    isAuthenticated, 
    hasSubscription 
  } = useAuth();
  
  const { presentPaywall, isSupported } = useSuperwall();
  const [paywallTriggered, setPaywallTriggered] = useState(false);
  const [paywallDismissed, setPaywallDismissed] = useState(false);

  // CRITICAL: Check auth first before subscription loading (architect feedback)
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // Gate: zobrazuj cokoliv až po tom, co máme auth hotové a subscriptionResolved===true
  if (loading || subscriptionLoading || !subscriptionResolved) {
    return <CenteredSpinner text="Loading..." />;
  }

  // CRITICAL: Handle unsupported environments (architect feedback)
  if (subscriptionResolved && !isSupported && !hasSubscription) {
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

  // Trigger paywall once pro uživatele bez subscription (architect: no auto re-trigger)
  useEffect(() => {
    if (subscriptionResolved && isAuthenticated && !hasSubscription && !paywallTriggered && !paywallDismissed && isSupported) {
      console.log('[Protected] User needs subscription - triggering paywall:', placement);
      
      setPaywallTriggered(true);
      
      presentPaywall(placement)
        .then((success) => {
          console.log('[Protected] Paywall result:', success);
          if (!success) {
            // Set dismissed state instead of auto-retry (architect: stop re-trigger loop)
            setPaywallDismissed(true);
          }
        })
        .catch((error) => {
          console.error('[Protected] Error presenting paywall:', error);
          // Set dismissed state při error
          setPaywallDismissed(true);
        })
        .finally(() => {
          setPaywallTriggered(false);
        });
    }
  }, [subscriptionResolved, isAuthenticated, hasSubscription, paywallTriggered, paywallDismissed, placement, presentPaywall, isSupported]);

  // Manual retry handler (architect: user-triggered retry instead of auto-loop)
  const handleRetryPaywall = () => {
    setPaywallDismissed(false);
    setPaywallTriggered(false);
  };

  // Pokud má subscription, zobraz obsah
  if (hasSubscription) {
    return <>{children}</>;
  }

  // Show dismissed state with retry option (architect: prevent auto re-trigger loop)
  if (paywallDismissed && !hasSubscription) {
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

  // Loading state během paywall presentation
  return <CenteredSpinner text={paywallTriggered ? "Loading paywall..." : "Checking subscription..."} />;
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