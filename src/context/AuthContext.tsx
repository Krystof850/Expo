import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { isSuperwallSupported } from "../utils/environment";
import { Alert, Platform } from 'react-native';

type AuthState = {
  user: User | null;
  loading: boolean;
  hasSubscription: boolean;
  subscriptionLoading: boolean;
  isAuthenticated: boolean;
  canAccessProtected: boolean;
  logout: () => Promise<void>;
  checkSubscriptionStatus: () => Promise<void>;
  presentPaywall: (placement?: string) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  setHasSubscription: (hasSubscription: boolean) => void;
};

const AuthCtx = createContext<AuthState>({
  user: null,
  loading: true,
  hasSubscription: false,
  subscriptionLoading: false,
  isAuthenticated: false,
  canAccessProtected: false,
  logout: async () => {},
  checkSubscriptionStatus: async () => {},
  presentPaywall: async () => false,
  restorePurchases: async () => false,
  setHasSubscription: () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const superwallSupported = isSuperwallSupported();

  // Derived state for easier access control
  const isAuthenticated = user !== null;
  const canAccessProtected = isAuthenticated && hasSubscription;

  // Check subscription status using Superwall - this will be handled by useSuperwallUser hook
  const checkSubscriptionStatus = useCallback(async () => {
    if (!superwallSupported) {
      // In Expo Go, default to false
      setHasSubscription(false);
      return;
    }

    console.log('[AuthContext] Checking subscription status...');
    // The actual subscription checking is now handled by useSuperwallUser hook
    // This function remains for API compatibility but the real logic is in SuperwallIntegration
  }, [superwallSupported]);

  // Present paywall using Superwall - delegated to SuperwallIntegration
  const presentPaywall = useCallback(async (placement = 'zario-template-3a85-2025-09-10'): Promise<boolean> => {
    console.log('[AuthContext] Paywall presentation should be handled via useSuperwall hook directly');
    
    // DEPRECATED: Callers should use useSuperwall().presentPaywall instead
    // For now, log a warning and return false to indicate this path is deprecated
    // Deprecated: Callers should use useSuperwall().presentPaywall instead
    return false;
  }, []);

  // Manual restore purchases using Superwall native functionality (for profile button)
  const restorePurchases = useCallback(async (): Promise<boolean> => {
    // Only run on iOS/Android native platforms with Superwall support
    if (Platform.OS === 'web') {
      console.log('[AuthContext] Restore purchases not supported on web platform');
      Alert.alert('Not Supported', 'Restore purchases is only available on mobile devices.');
      return false;
    }

    if (!superwallSupported) {
      console.log('[AuthContext] Superwall not supported - restore not available');
      Alert.alert('Not Available', 'Restore purchases is not available in this environment.');
      return false;
    }

    try {
      setSubscriptionLoading(true);
      console.log('[AuthContext] Manual restore purchases via Superwall...');
      
      // Use Superwall's native restore functionality directly
      // Note: This is the same method called by CustomPurchaseControllerProvider.onPurchaseRestore
      const { Superwall } = require('expo-superwall');
      
      if (Superwall && Superwall.restorePurchases) {
        const restoreResult = await Superwall.restorePurchases();
        console.log('[AuthContext] Manual Superwall restore result:', restoreResult);
        
        // Handle the result similar to CustomPurchaseControllerProvider
        if (restoreResult?.success !== false) {
          console.log('[AuthContext] Manual restore successful');
          Alert.alert(
            'Purchases Restored',
            'Your previous purchases have been successfully restored.',
            [{ text: 'OK' }]
          );
          return true;
        } else if (restoreResult?.error?.code === 'no_purchases_found') {
          console.log('[AuthContext] No previous purchases found');
          Alert.alert(
            'No Previous Purchases',
            'No previous purchases found for this Apple ID.',
            [{ text: 'OK' }]
          );
          return false;
        } else {
          throw new Error(restoreResult?.error?.message || 'Unknown restore error');
        }
      } else {
        throw new Error('Superwall restore method not available');
      }
    } catch (error: any) {
      console.error('[AuthContext] Error during manual restore:', error);
      
      // Handle specific error cases
      let errorMessage = 'An error occurred while restoring purchases. Please try again.';
      
      if (error.code === 'user_cancelled' || error.message?.includes('cancelled')) {
        console.log('[AuthContext] User cancelled manual restore operation');
        return false; // Don't show error for user cancellation
      } else if (error.code === 'store_unavailable' || error.message?.includes('store')) {
        errorMessage = 'App Store is currently unavailable. Please try again later.';
      } else if (error.code === 'network_error' || error.message?.includes('network')) {
        errorMessage = 'Please check your internet connection and try again.';
      } else if (error.message?.includes('not available')) {
        // Fallback for environments where Superwall restore is not available
        console.log('[AuthContext] Superwall restore not available, showing generic message');
        Alert.alert(
          'Restore Purchases', 
          'Restore purchases functionality will be available in the production version of the app.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      Alert.alert('Restore Error', errorMessage, [{ text: 'OK' }]);
      return false;
    } finally {
      setSubscriptionLoading(false);
    }
  }, [superwallSupported]);

  // Firebase auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      
      // Check subscription status when user changes
      if (u) {
        checkSubscriptionStatus();
      } else {
        setHasSubscription(false);
      }
    });
    return unsub;
  }, [checkSubscriptionStatus]);

  // Check subscription status on mount if Superwall is supported
  useEffect(() => {
    if (superwallSupported && user) {
      checkSubscriptionStatus();
    }
  }, [superwallSupported, user, checkSubscriptionStatus]);

  async function logout() {
    setHasSubscription(false);
    await signOut(auth);
  }

  const value: AuthState = {
    user,
    loading,
    hasSubscription,
    subscriptionLoading,
    isAuthenticated,
    canAccessProtected,
    logout,
    checkSubscriptionStatus,
    presentPaywall,
    restorePurchases,
    setHasSubscription,
  };

  return (
    <AuthCtx.Provider value={value}>
      {children}
    </AuthCtx.Provider>
  );
};

export function useAuth() {
  return useContext(AuthCtx);
}

// Additional hooks for specific use cases
export function useSubscription() {
  const { hasSubscription, subscriptionLoading, checkSubscriptionStatus, presentPaywall, restorePurchases } = useAuth();
  return {
    hasSubscription,
    subscriptionLoading,
    checkSubscriptionStatus,
    presentPaywall,
    restorePurchases,
  };
}

export function useAccessControl() {
  const { isAuthenticated, hasSubscription, canAccessProtected } = useAuth();
  return {
    isAuthenticated,
    hasSubscription,
    canAccessProtected,
  };
}