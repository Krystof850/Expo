import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { isSuperwallSupported } from "../utils/environment";

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

  // Check subscription status using Superwall
  const checkSubscriptionStatus = useCallback(async () => {
    if (!superwallSupported) {
      // In Expo Go, default to false
      setHasSubscription(false);
      return;
    }

    try {
      setSubscriptionLoading(true);
      const { useUser } = require('expo-superwall');
      
      // In a real implementation, we'd use Superwall's subscription checking
      // For now, we'll use a placeholder that can be updated when the hooks are available
      // This is a limitation of the current React hook rules
      console.log('[AuthContext] Checking subscription status...');
      
      // Placeholder - in a real app, this would check Superwall's subscription status
      // You might need to restructure this to use hooks properly
      setHasSubscription(false);
    } catch (error) {
      console.error('[AuthContext] Error checking subscription:', error);
      setHasSubscription(false);
    } finally {
      setSubscriptionLoading(false);
    }
  }, [superwallSupported]);

  // Present paywall using Superwall
  const presentPaywall = useCallback(async (placement = 'zario-template-3a85-2025-09-10'): Promise<boolean> => {
    if (!superwallSupported) {
      console.log('[AuthContext] Superwall not supported - cannot present paywall');
      return false;
    }

    try {
      console.log('[AuthContext] Presenting paywall with placement:', placement);
      
      // This is a placeholder - in a real implementation, you'd need to restructure
      // to properly use Superwall hooks. The current React hook rules prevent
      // us from conditionally calling hooks inside this callback.
      
      // For now, we'll return false and let individual components handle paywall presentation
      // using the pattern shown in PremiumButton.tsx
      return false;
    } catch (error) {
      console.error('[AuthContext] Error presenting paywall:', error);
      return false;
    }
  }, [superwallSupported]);

  // Restore purchases
  const restorePurchases = useCallback(async (): Promise<boolean> => {
    if (!superwallSupported) {
      console.log('[AuthContext] Superwall not supported - cannot restore purchases');
      return false;
    }

    try {
      setSubscriptionLoading(true);
      console.log('[AuthContext] Restoring purchases...');
      
      // Placeholder for restore purchases logic
      // In a real implementation, this would call Superwall's restore method
      return false;
    } catch (error) {
      console.error('[AuthContext] Error restoring purchases:', error);
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