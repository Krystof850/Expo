import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { isSuperwallSupported } from "../utils/environment";

type AuthState = {
  user: User | null;
  loading: boolean;
  subscriptionLoading: boolean;
  subscriptionResolved: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  checkSubscriptionStatus: () => Promise<void>;
  presentPaywall: (placement?: string) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  setSubscriptionLoading: (v: boolean) => void;
  setSubscriptionResolved: (v: boolean) => void;
};

const AuthCtx = createContext<AuthState>({
  user: null,
  loading: true,
  subscriptionLoading: false,
  subscriptionResolved: false,
  isAuthenticated: false,
  logout: async () => {},
  checkSubscriptionStatus: async () => {},
  presentPaywall: async () => false,
  restorePurchases: async () => false,
  setSubscriptionLoading: () => {},
  setSubscriptionResolved: () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const superwallSupported = isSuperwallSupported();
  const [subscriptionLoading, setSubscriptionLoading] = useState(superwallSupported);
  const [subscriptionResolved, setSubscriptionResolved] = useState(false);

  // Derived state for easier access control
  const isAuthenticated = user !== null;

  // Check subscription status using Superwall - this will be handled by useSuperwallUser hook
  const checkSubscriptionStatus = useCallback(async () => {
    if (!superwallSupported) {
      return;
    }

    // DŮLEŽITÉ: Neprovádíme žádnou akci - subscription status je automaticky
    // aktualizován v SuperwallIntegration.tsx pomocí useUser() hooku
    // Tato funkce existuje pouze pro API kompatibilitu s komponentami
    console.log('[AuthContext] checkSubscriptionStatus called - status handled by SuperwallIntegration');
  }, [superwallSupported]);

  // Present paywall using Superwall - delegated to SuperwallIntegration
  const presentPaywall = useCallback(async (placement = 'premium_gate'): Promise<boolean> => {
    console.log('[AuthContext] Paywall presentation should be handled via useSuperwall hook directly');
    
    // DEPRECATED: Callers should use useSuperwall().presentPaywall instead
    // For now, log a warning and return false to indicate this path is deprecated
    // Deprecated: Callers should use useSuperwall().presentPaywall instead
    return false;
  }, []);

  // Restore purchases - OFFICIÁLNÍ ZPŮSOB podle dokumentace
  const restorePurchases = useCallback(async (): Promise<boolean> => {
    if (!superwallSupported) {
      console.log('[AuthContext] Superwall not supported - cannot restore purchases');
      return false;
    }

    try {
      setSubscriptionLoading(true);
      console.log('[AuthContext] Restoring purchases...');
      
      // OFICIÁLNÍ ZPŮSOB: Call Superwall restore podle dokumentace
      const { Superwall } = require('expo-superwall');
      await Superwall.restorePurchases();
      console.log('[AuthContext] Purchase restore completed');
      return true;
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
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      
      // OFICIÁLNÍ ZPŮSOB: Placement trigger je nyní v SuperwallIntegration po identify()
      if (u && superwallSupported) {
        try {
          checkSubscriptionStatus();
        } catch (error) {
          console.error('[AuthContext] Error handling user login:', error);
          checkSubscriptionStatus();
        }
      }
    });
    return unsub;
  }, [checkSubscriptionStatus, superwallSupported]);

  // Check subscription status on mount if Superwall is supported
  useEffect(() => {
    if (superwallSupported && user) {
      checkSubscriptionStatus();
    }
  }, [superwallSupported, user, checkSubscriptionStatus]);

  async function logout() {
    try {
      // OFICIÁLNÍ ZPŮSOB: Reset Superwall před Firebase logout podle dokumentace
      if (superwallSupported) {
        const { Superwall } = require('expo-superwall');
        await Superwall.reset();
        console.log('[AuthContext] Superwall reset completed before logout');
      }
      
      // Firebase logout
      await signOut(auth);
      console.log('[AuthContext] Logout completed successfully');
    } catch (error) {
      console.error('[AuthContext] Error during logout:', error);
      // Fallback - still try to sign out even if Superwall reset fails
      await signOut(auth);
    }
  }

  const value: AuthState = {
    user,
    loading,
    subscriptionLoading,
    subscriptionResolved,
    isAuthenticated,
    logout,
    checkSubscriptionStatus,
    presentPaywall,
    restorePurchases,
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
  const { subscriptionLoading, checkSubscriptionStatus, presentPaywall, restorePurchases } = useAuth();
  return {
    subscriptionLoading,
    checkSubscriptionStatus,
    presentPaywall,
    restorePurchases,
  };
}