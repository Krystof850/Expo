import * as React from 'react';
import { createContext, useContext, useEffect, ReactNode, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { isSuperwallSupported } from '../utils/environment';
import { PAYWALL_PLACEMENT } from '../constants/paywall';

// Typ pro Superwall subscription context
interface SuperwallContextType {
  presentPaywall: (placement?: string) => Promise<boolean>;
  isSubscribed: boolean;
  subscriptionStatus: string;
  isSupported: boolean;
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

// Komponenta s aktivním Superwall pro native platformy
const SuperwallEnabledIntegration: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const { user, setHasSubscription, setSubscriptionLoading, setSubscriptionResolved } = useAuth() as any;

  // Deferred promise pro propagaci paywall results (architect solution)
  const paywallResolverRef = useRef<((result: boolean) => void) | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inFlightPromiseRef = useRef<Promise<boolean> | null>(null);

  try {
    const { useUser, usePlacement } = require('expo-superwall');
    
    // Hook pro správu uživatele a subscription status (podle dokumentace)
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
    
    // Hook pro prezentaci paywall s promise bridging
    const { registerPlacement } = usePlacement({
      onError: (error: any) => {
        console.log('[SuperwallIntegration] Paywall error:', error);
        // Resolve s false při error
        if (paywallResolverRef.current) {
          paywallResolverRef.current(false);
          paywallResolverRef.current = null;
        }
      },
      onPresent: (info: any) => {
        console.log('[SuperwallIntegration] Paywall presented:', info);
      },
      onDismiss: async (info: any, result: any) => {
        console.log('[SuperwallIntegration] Paywall dismissed:', info, result);
        
        let purchaseSuccessful = false;
        
        // Clear timeout (architect feedback)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        // Aktualizuj subscription status po nákupu nebo restore
        if (result?.purchased === true || result?.type === 'purchased') {
          console.log('[SuperwallIntegration] Purchase successful:', result);
          setHasSubscription(true);
          purchaseSuccessful = true;
          
          // Sync po nákupu
          try {
            const { Superwall } = require('expo-superwall');
            await Superwall.syncPurchases?.().catch(() => {});
            console.log('[SuperwallIntegration] Purchase synced successfully');
          } catch (error) {
            console.log('[SuperwallIntegration] Purchase sync skipped (not available)');
          }
        } else if (result?.type === 'restored') {
          console.log('[SuperwallIntegration] Purchase restored:', result);  
          setHasSubscription(true);
          purchaseSuccessful = true;
          
          // Sync po restore
          try {
            const { Superwall } = require('expo-superwall');
            await Superwall.syncPurchases?.().catch(() => {});
            console.log('[SuperwallIntegration] Restore synced successfully');
          } catch (error) {
            console.log('[SuperwallIntegration] Restore sync skipped (not available)');
          }
        } else {
          console.log('[SuperwallIntegration] Paywall dismissed without purchase:', result);
        }

        // Bridge result back to presentPaywall caller (architect solution)
        if (paywallResolverRef.current) {
          paywallResolverRef.current(purchaseSuccessful);
          paywallResolverRef.current = null;
          inFlightPromiseRef.current = null;
        }
      },
    });

    // Identifikuj uživatele podle dokumentace
    useEffect(() => {
      if (user?.uid) {
        identify(user.uid);
        console.log('[SuperwallIntegration] User identified:', user.uid);
      }
    }, [user?.uid, identify]);

    // Promise-bridged presentPaywall with safeguards (architect solution)
    const presentPaywall = React.useCallback(async (placement = PAYWALL_PLACEMENT): Promise<boolean> => {
      console.log('[SuperwallIntegration] Presenting paywall with placement:', placement);
      
      // Return in-flight promise instead of false for concurrent calls (architect feedback)
      if (inFlightPromiseRef.current) {
        console.log('[SuperwallIntegration] Paywall already in flight - returning existing promise');
        return inFlightPromiseRef.current;
      }
      
      const promise = new Promise<boolean>((resolve) => {
        // Store resolver pro onDismiss callback
        paywallResolverRef.current = resolve;
        
        // Timeout safeguard (architect feedback)
        timeoutRef.current = setTimeout(() => {
          if (paywallResolverRef.current) {
            console.log('[SuperwallIntegration] Paywall timeout - resolving false');
            paywallResolverRef.current(false);
            paywallResolverRef.current = null;
            inFlightPromiseRef.current = null;
            timeoutRef.current = null;
          }
        }, 60000); // 60 second timeout
        
        try {
          registerPlacement({
            placement,
            feature() {
              console.log('[SuperwallIntegration] Premium feature unlocked!');
              setHasSubscription(true);
              // Immediate resolve když už má subscription
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
              resolve(true);
              paywallResolverRef.current = null;
              inFlightPromiseRef.current = null;
            }
          });
          
          console.log('[SuperwallIntegration] Placement registered successfully');
          
        } catch (error: any) {
          console.log('[SuperwallIntegration] Error presenting paywall:', error);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          resolve(false);
          paywallResolverRef.current = null;
          inFlightPromiseRef.current = null;
        }
      });
      
      inFlightPromiseRef.current = promise;
      return promise;
    }, [registerPlacement, setHasSubscription]);

    const contextValue: SuperwallContextType = {
      presentPaywall,
      isSubscribed: subscriptionStatus?.status ? (subscriptionStatus.status === 'ACTIVE' || subscriptionStatus.status === 'TRIAL') : false,
      subscriptionStatus: subscriptionStatus?.status || 'UNKNOWN',
      isSupported: true
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
      presentPaywall: async () => {
        console.log('[SuperwallIntegration] Superwall not available - cannot present paywall');
        return true; // Return true like disabled integration to prevent loops
      },
      isSubscribed: false,
      subscriptionStatus: 'ERROR',
      isSupported: false
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
    presentPaywall: async () => {
      // V dev prostředí bez Superwall nemůžeme prezentovat paywall
      console.log('[SuperwallIntegration] Superwall disabled - cannot present paywall');
      // Return true once a no-op to prevent loops (architect solution)
      return true;
    },
    isSubscribed: false,
    subscriptionStatus: 'DISABLED',
    isSupported: false
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