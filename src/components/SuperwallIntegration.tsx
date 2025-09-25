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

  try {
    const { useUser } = require('expo-superwall');
    
    // Hook pro správu uživatele podle oficiální dokumentace
    const { subscriptionStatus, identify } = useUser();
    
    // OFICIÁLNÍ ZPŮSOB: Pouze resolve loading states, Superwall SDK automaticky spravuje subscription status
    const firstStatusSeenRef = useRef(false);
    useEffect(() => {
      console.log('[SuperwallIntegration] Superwall subscription status:', subscriptionStatus);
      
      // Resolve loading pouze při prvním status update od Superwall SDK
      if (!firstStatusSeenRef.current && subscriptionStatus) {
        firstStatusSeenRef.current = true;
        setSubscriptionLoading(false);
        setSubscriptionResolved(true);
        console.log('[SuperwallIntegration] Superwall SDK ready, subscription status resolved');
      }
    }, [subscriptionStatus, setSubscriptionLoading, setSubscriptionResolved]);

    // Identifikuj uživatele podle oficiální dokumentace
    useEffect(() => {
      if (user?.uid) {
        identify(user.uid);
        console.log('[SuperwallIntegration] User identified with Superwall:', user.uid);
      }
    }, [user?.uid, identify]);

    // OFICIÁLNÍ ZPŮSOB: Pouze expose Superwall SDK data bez custom logic
    const contextValue: SuperwallContextType = {
      isSupported: true,
      subscriptionStatus: subscriptionStatus?.status || 'UNKNOWN',
      isSubscribed: subscriptionStatus?.status === 'ACTIVE', // Pouze ACTIVE podle oficiální dokumentace
    };

    return (
      <SuperwallContext.Provider value={contextValue}>
        {children}
      </SuperwallContext.Provider>
    );

  } catch (error) {
    console.warn('⚠️ Superwall not available:', error);
    
    // CRITICAL: Set loading states for error fallback
    useEffect(() => {
      setSubscriptionLoading(false);
      setSubscriptionResolved(true);
    }, [setSubscriptionLoading, setSubscriptionResolved]);
    
    // Fallback context pro případ chyby
    const contextValue: SuperwallContextType = {
      isSupported: false,
      subscriptionStatus: 'ERROR',
      isSubscribed: false,
    };

    return (
      <SuperwallContext.Provider value={contextValue}>
        {children}
      </SuperwallContext.Provider>
    );
  }
};

// Komponenta pro prostředí bez Superwall (Expo Go, web)
const SuperwallDisabledIntegration: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const { setSubscriptionLoading, setSubscriptionResolved } = useAuth() as any;

  useEffect(() => {
    // V prostředí bez Superwall - pouze resolve loading states
    setSubscriptionLoading(false);
    setSubscriptionResolved(true);
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