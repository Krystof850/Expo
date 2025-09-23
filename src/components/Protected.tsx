import React, { useEffect, useState, useRef } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useSuperwall } from "./SuperwallIntegration";
import { ActivityIndicator, View } from "react-native";

// Komponenta pro monitoring subscription v chráněné zóně
const ProtectedWithMonitoring: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { hasSubscription, checkSubscriptionStatus } = useAuth();
  const { presentPaywall } = useSuperwall();
  const [subscriptionLost, setSubscriptionLost] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Pravidelná kontrola subscription každou minutu
  useEffect(() => {
    console.log('[SUBSCRIPTION-MONITOR] Starting subscription monitoring...');
    
    const startMonitoring = () => {
      // Vyčistit existující interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Spustit nový interval - kontrola každou minutu (60000ms)
      intervalRef.current = setInterval(async () => {
        try {
          console.log('[SUBSCRIPTION-MONITOR] Checking subscription status...');
          await checkSubscriptionStatus();
          
          if (!hasSubscription) {
            console.log('[SUBSCRIPTION-MONITOR] ❌ Subscription expired - presenting paywall');
            setSubscriptionLost(true);
          }
        } catch (error) {
          console.error('[SUBSCRIPTION-MONITOR] Error checking subscription:', error);
        }
      }, 60000); // 1 minuta
    };

    startMonitoring();

    // Cleanup při unmount
    return () => {
      if (intervalRef.current) {
        console.log('[SUBSCRIPTION-MONITOR] Stopping subscription monitoring');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [checkSubscriptionStatus, hasSubscription]);

  // Pokud monitoring detekoval vypršení subscription - prezentuj paywall
  useEffect(() => {
    if (subscriptionLost && !hasSubscription) {
      console.log('[SUBSCRIPTION-MONITOR] Presenting paywall for expired subscription');
      presentPaywall('zario-template-3a85-2025-09-10')
        .then((success) => {
          console.log('[SUBSCRIPTION-MONITOR] Paywall result:', success);
          if (success) {
            // Subscription was renewed
            setSubscriptionLost(false);
          }
        })
        .catch((error) => {
          console.error('[SUBSCRIPTION-MONITOR] Error presenting paywall:', error);
        });
    }
  }, [subscriptionLost, hasSubscription, presentPaywall]);

  // Pokud subscription vyprší, blokovat přístup až do obnovení
  if (!hasSubscription) {
    console.log('[SUBSCRIPTION-MONITOR] ❌ No active subscription - access denied');
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
};

export const Protected: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { loading, subscriptionLoading, canAccessProtected, isAuthenticated, hasSubscription } = useAuth();
  const { presentPaywall } = useSuperwall();
  
  // Hard paywall state - bez možnosti obcházení
  const [paywallInFlight, setPaywallInFlight] = useState(false);
  const [paywallRetryTick, setPaywallRetryTick] = useState(0);

  // Hard paywall - Present when no subscription, retry after dismissal
  useEffect(() => {
    const showPaywall = async () => {
      if (isAuthenticated && !hasSubscription && !subscriptionLoading && !paywallInFlight) {
        console.log('[HARD-PAYWALL] No subscription detected - presenting hard paywall');
        
        setPaywallInFlight(true);
        
        try {
          const success = await presentPaywall('zario-template-3a85-2025-09-10');
          console.log('[HARD-PAYWALL] Paywall result:', success);
          
          if (!success) {
            // Paywall was dismissed without purchase - trigger retry
            console.log('[HARD-PAYWALL] Paywall dismissed - will retry');
            setTimeout(() => {
              setPaywallRetryTick(prev => prev + 1);
            }, 1000); // Retry po 1 sekundě
          }
        } catch (error) {
          console.error('[HARD-PAYWALL] Error presenting paywall:', error);
          // Retry po error
          setTimeout(() => {
            setPaywallRetryTick(prev => prev + 1);
          }, 2000);
        } finally {
          setPaywallInFlight(false);
        }
      }
    };

    showPaywall();
  }, [isAuthenticated, hasSubscription, subscriptionLoading, paywallInFlight, paywallRetryTick]);

  // Show loading while checking auth or subscription status
  if (loading || subscriptionLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // Show loading while paywall is being presented
  if (isAuthenticated && !hasSubscription && paywallInFlight) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // HARD PAYWALL: Only authenticated users WITH subscription can access
  if (canAccessProtected) {
    return <ProtectedWithMonitoring>{children}</ProtectedWithMonitoring>;
  }

  // No subscription = Hard paywall (no bypass allowed)
  if (isAuthenticated && !hasSubscription && !paywallInFlight) {
    console.log('[HARD-PAYWALL] Access denied - no active subscription');
    // Show persistent paywall screen that can't be bypassed
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Fallback loading state
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
};