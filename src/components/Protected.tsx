import React, { useEffect } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";

export const Protected: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { loading, subscriptionLoading, canAccessProtected, isAuthenticated, hasSubscription, presentPaywall } = useAuth();

  // Present paywall when user is authenticated but doesn't have subscription
  useEffect(() => {
    if (isAuthenticated && !hasSubscription && !subscriptionLoading) {
      presentPaywall();
    }
  }, [isAuthenticated, hasSubscription, subscriptionLoading, presentPaywall]);

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

  // Show loading while paywall is being presented for users without subscription
  if (isAuthenticated && !hasSubscription) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Only render children if user has full access (authenticated + subscription)
  if (canAccessProtected) {
    return <>{children}</>;
  }

  // Fallback - should not reach here
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
};