import * as React from 'react';
import { createContext, useContext, useEffect, ReactNode, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { isSuperwallSupported } from '../utils/environment';

// Typ pro Superwall subscription context
interface SuperwallContextType {
  isSupported: boolean;
  subscriptionStatus: string;
  isSubscribed: boolean;
}

const SuperwallContext = createContext<SuperwallContextType | null>(null);

// Hook pro použití Superwall context
export function useSuperwall() {
  const context = useContext(SuperwallContext);
  if (!context) {
    throw new Error('useSuperwall must be used within SuperwallIntegration');
  }
  return context;
}

// Komponenta s aktivním Superwall pro native platformy (podle oficiální dokumentace)
const SuperwallEnabledIntegration: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const { user, setSubscriptionLoading, setSubscriptionResolved } = useAuth() as any;

  // OFICIÁLNÍ PATTERN: Hooks musí být unconditional podle React rules
  const { useUser } = require('expo-superwall');
  
  // OFICIÁLNÍ ZPŮSOB: useUser hook podle dokumentace
  const { subscriptionStatus, identify } = useUser();
  
  // OFICIÁLNÍ ZPŮSOB: Safe null checking podle Superwall best practices
  const firstStatusSeenRef = useRef(false);
  useEffect(() => {
    try {
      console.log('[SuperwallIntegration] Superwall subscription status:', subscriptionStatus?.status ?? 'undefined');
      
      // Safe checking: Resolve loading pouze při validním status update
      if (!firstStatusSeenRef.current && subscriptionStatus?.status) {
        firstStatusSeenRef.current = true;
        setSubscriptionLoading(false);
        setSubscriptionResolved(true);
        console.log('[SuperwallIntegration] Superwall SDK ready, subscription status resolved');
      }
    } catch (error) {
      console.error('[SuperwallIntegration] Error processing subscription status:', error);
      // Fail safely - resolve loading to prevent infinite loading
      setSubscriptionLoading(false);
      setSubscriptionResolved(true);
    }
  }, [subscriptionStatus?.status, setSubscriptionLoading, setSubscriptionResolved]); // Safe dependency

  // OFICIÁLNÍ PATTERN: Safe user identification podle dokumentace
  useEffect(() => {
    const identifyUser = async () => {
      try {
        if (user?.uid && typeof user.uid === 'string' && user.uid.trim()) {
          await identify(user.uid);
          console.log('[SuperwallIntegration] User identified with Superwall:', user.uid);
        }
      } catch (error) {
        console.error('[SuperwallIntegration] Failed to identify user:', error);
        // Continue gracefully - don't crash on identification failure
      }
    };
    
    identifyUser();
  }, [user?.uid, identify]);

  // OFICIÁLNÍ ZPŮSOB: Safe context value podle Superwall best practices
  const contextValue: SuperwallContextType = {
    isSupported: true,
    subscriptionStatus: subscriptionStatus?.status ?? 'UNKNOWN', // Nullish coalescing
    isSubscribed: subscriptionStatus?.status === 'ACTIVE', // Safe comparison
  };

  return (
    <SuperwallContext.Provider value={contextValue}>
      {children}
    </SuperwallContext.Provider>
  );
};

// Komponenta pro prostředí bez Superwall (Expo Go, web)
const SuperwallDisabledIntegration: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const { setSubscriptionLoading, setSubscriptionResolved } = useAuth() as any;

  useEffect(() => {
    try {
      // V prostředí bez Superwall - bezpečně resolve loading states
      setSubscriptionLoading(false);
      setSubscriptionResolved(true);
      console.log('[SuperwallIntegration] Disabled environment - loading resolved');
    } catch (error) {
      console.error('[SuperwallIntegration] Error in disabled environment:', error);
    }
  }, [setSubscriptionLoading, setSubscriptionResolved]);

  const contextValue: SuperwallContextType = {
    isSupported: false,
    subscriptionStatus: 'DISABLED',
    isSubscribed: false,
  };

  return (
    <SuperwallContext.Provider value={contextValue}>
      {children}
    </SuperwallContext.Provider>
  );
};

// Hlavní komponenta
const SuperwallIntegration: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const superwallSupported = isSuperwallSupported();

  if (superwallSupported) {
    return <SuperwallEnabledIntegration>{children}</SuperwallEnabledIntegration>;
  }

  return <SuperwallDisabledIntegration>{children}</SuperwallDisabledIntegration>;
};

export default SuperwallIntegration;