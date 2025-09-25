import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { isSuperwallSupported } from "../utils/environment";

type AuthState = {
  user: User | null;
  loading: boolean;
  hasSubscription: boolean;
  subscriptionLoading: boolean;
  subscriptionResolved: boolean;
  isAuthenticated: boolean;
  canAccessProtected: boolean;
  logout: () => Promise<void>;
  checkSubscriptionStatus: () => Promise<void>;
  presentPaywall: (placement?: string) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  setHasSubscription: (hasSubscription: boolean) => void;
  setSubscriptionLoading: (v: boolean) => void;
  setSubscriptionResolved: (v: boolean) => void;
};

const AuthCtx = createContext<AuthState>({
  user: null,
  loading: true,
  hasSubscription: false,
  subscriptionLoading: false,
  subscriptionResolved: false,
  isAuthenticated: false,
  canAccessProtected: false,
  logout: async () => {},
  checkSubscriptionStatus: async () => {},
  presentPaywall: async () => false,
  restorePurchases: async () => false,
  setHasSubscription: () => {},
  setSubscriptionLoading: () => {},
  setSubscriptionResolved: () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  
  const superwallSupported = isSuperwallSupported();
  const [subscriptionLoading, setSubscriptionLoading] = useState(superwallSupported);
  const [subscriptionResolved, setSubscriptionResolved] = useState(false);

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

    // DŮLEŽITÉ: Neprovádíme žádnou akci - subscription status je automaticky
    // aktualizován v SuperwallIntegration.tsx pomocí useUser() hooku
    // Tato funkce existuje pouze pro API kompatibilitu s komponentami
    console.log('[AuthContext] checkSubscriptionStatus called - status handled by SuperwallIntegration');
  }, [superwallSupported]);

  // Present paywall using Superwall - delegated to SuperwallIntegration
  const presentPaywall = useCallback(async (placement = 'zario-template-3a85-2025-09-10'): Promise<boolean> => {
    console.log('[AuthContext] Paywall presentation should be handled via useSuperwall hook directly');
    
    // DEPRECATED: Callers should use useSuperwall().presentPaywall instead
    // For now, log a warning and return false to indicate this path is deprecated
    // Deprecated: Callers should use useSuperwall().presentPaywall instead
    return false;
  }, []);

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
    } catch (error: any) {
      console.error('[AuthContext] Error restoring purchases:', error);
      // Don't show error popup for restore failures as they are common
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
    subscriptionResolved,
    isAuthenticated,
    canAccessProtected,
    logout,
    checkSubscriptionStatus,
    presentPaywall,
    restorePurchases,
    setHasSubscription,
    setSubscriptionLoading,
    setSubscriptionResolved,
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