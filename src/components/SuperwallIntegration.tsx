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
  const { user, setHasSubscription, setSubscriptionLoading, setSubscriptionResolved } = useAuth() as any;

  try {
    const { useUser } = require('expo-superwall');
    
    // Hook pro správu uživatele podle oficiální dokumentace
    const { subscriptionStatus, identify } = useUser();
    
    // Automaticky aktualizuj AuthContext při změně subscription status
    const firstStatusSeenRef = useRef(false);
    useEffect(() => {
      console.log('[SuperwallIntegration] Subscription status changed:', subscriptionStatus);
      
      // Při prvním status resolve loading
      if (!firstStatusSeenRef.current && subscriptionStatus?.status) {
        firstStatusSeenRef.current = true;
        setSubscriptionLoading(false);
        setSubscriptionResolved(true);
      }
      
      // Mapuj pouze ACTIVE a TRIAL jako platné subscription
      const statusValue = subscriptionStatus?.status;
      const hasActiveSubscription = statusValue === 'ACTIVE' || statusValue === 'TRIAL';
      
      console.log('[SuperwallIntegration] Setting hasSubscription to:', hasActiveSubscription, 'based on status:', statusValue);
      setHasSubscription(hasActiveSubscription);
    }, [subscriptionStatus, setHasSubscription, setSubscriptionLoading, setSubscriptionResolved]);

    // Identifikuj uživatele podle dokumentace
    useEffect(() => {
      if (user?.uid) {
        identify(user.uid);
        console.log('[SuperwallIntegration] User identified:', user.uid);
      }
    }, [user?.uid, identify]);

    const contextValue: SuperwallContextType = {
      isSupported: true,
      subscriptionStatus: subscriptionStatus?.status || 'UNKNOWN',
      isSubscribed: subscriptionStatus?.status ? (subscriptionStatus.status === 'ACTIVE' || subscriptionStatus.status === 'TRIAL') : false,
    };

    return (
      <SuperwallContext.Provider value={contextValue}>
        {children}
      </SuperwallContext.Provider>
    );

  } catch (error) {
    console.warn('⚠️ Superwall not available:', error);
    
    // CRITICAL: Set subscription loading states like DisabledIntegration (architect feedback)
    useEffect(() => {
      setHasSubscription(false);
      setSubscriptionLoading(false);
      setSubscriptionResolved(true);
    }, [setHasSubscription, setSubscriptionLoading, setSubscriptionResolved]);
    
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
  const { setHasSubscription, setSubscriptionLoading, setSubscriptionResolved } = useAuth() as any;

  useEffect(() => {
    // V prostředí bez Superwall NEPOVOLIT přístup - žádné falešné "OK"
    setHasSubscription(false);
    // CRITICAL: nastavit loading states aby se dostal k redirect (architect feedback)
    setSubscriptionLoading(false);
    setSubscriptionResolved(true);
  }, [setHasSubscription, setSubscriptionLoading, setSubscriptionResolved]);

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