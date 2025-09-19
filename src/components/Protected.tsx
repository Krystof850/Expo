import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useSuperwall } from "./SuperwallIntegration";
import { ActivityIndicator, View } from "react-native";

export const Protected: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { loading, subscriptionLoading, canAccessProtected, isAuthenticated, hasSubscription } = useAuth();
  const { presentPaywall } = useSuperwall();
  
  // Lokální state pro řízení paywall flow
  const [paywallInFlight, setPaywallInFlight] = useState(false);
  const [paywallAttempted, setPaywallAttempted] = useState(false);

  // Present paywall when user is authenticated but doesn't have subscription
  useEffect(() => {
    const showPaywall = async () => {
      if (isAuthenticated && !hasSubscription && !subscriptionLoading && !paywallAttempted) {
        console.log('[Protected] User authenticated but no subscription - presenting paywall');
        
        setPaywallInFlight(true);
        setPaywallAttempted(true);
        
        try {
          const success = await presentPaywall('zario-template-3a85-2025-09-10');
          console.log('[Protected] Paywall result:', success);
        } catch (error) {
          console.error('[Protected] Error presenting paywall:', error);
        } finally {
          setPaywallInFlight(false);
        }
      }
    };

    showPaywall();
  }, [isAuthenticated, hasSubscription, subscriptionLoading, paywallAttempted]); // REMOVED presentPaywall from dependencies!

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

  // Redirect to main app if user is authenticated but doesn't have subscription AND paywall was attempted
  // (this prevents deadlock if user declined paywall - but only after some delay to avoid infinite loops)
  if (isAuthenticated && !hasSubscription && !subscriptionLoading && paywallAttempted && !paywallInFlight) {
    console.log('[Protected] User authenticated but no subscription and paywall attempted - allowing access');
    // Místo redirect, prostě povolit přístup - uživatel si může koupit subscription později
    // return <Redirect href="/(tabs)" />;
  }

  // Only render children if user has full access (authenticated + subscription)
  if (canAccessProtected) {
    return <>{children}</>;
  }

  // Pokud je uživatel authenticated a paywall byl attempted, povolit přístup
  if (isAuthenticated && paywallAttempted) {
    return <>{children}</>;
  }

  // Fallback - should not reach here
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
};