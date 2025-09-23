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

  // Restore purchases using Superwall native functionality (production-ready)
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
      console.log('[AuthContext] Restoring purchases via Superwall...');
      
      // Use Superwall's native restore functionality
      const superwallModule = require('expo-superwall');
      
      if (superwallModule && superwallModule.restorePurchases) {
        const restoreResult = await superwallModule.restorePurchases();
        console.log('[AuthContext] Superwall restore result:', restoreResult);
        
        // Note: Superwall handles subscription validation and entitlement checking internally
        // The subscription status will be updated automatically by SuperwallIntegration
        // via the onDismiss callback when result.type === 'restored'
        
        Alert.alert(
          'Restore Complete', 
          'If you had any previous purchases, they have been restored to your account. Your subscription status will be updated shortly.',
          [{ text: 'OK' }]
        );
        
        return true;
      } else {
        throw new Error('Superwall restore method not available');
      }
    } catch (error: any) {
      console.error('[AuthContext] Error restoring purchases via Superwall:', error);
      
      // Handle specific error cases
      let errorMessage = 'An error occurred while restoring purchases. Please try again.';
      
      if (error.code === 'user_cancelled' || error.message?.includes('cancelled')) {
        console.log('[AuthContext] User cancelled restore operation');
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
  }, [superwallSupported, setHasSubscription]);

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