import * as React from 'react';
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { isSuperwallSupported } from '../utils/environment';

// Typ pro Superwall subscription context
interface SuperwallContextType {
  presentPaywall: (placement?: string) => Promise<boolean>;
  isSubscribed: boolean;
  subscriptionStatus: string;
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
  const { user, setHasSubscription } = useAuth() as any;
  
  // ATOMIC paywall presentation lock using useRef (synchronní)
  const presentingRef = React.useRef(false);
  const pendingPromiseRef = React.useRef<Promise<boolean> | null>(null);

  try {
    const { useUser, usePlacement } = require('expo-superwall');
    
    // Hook pro správu uživatele a subscription status (MINIMÁLNÍ)
    const { subscriptionStatus, identify } = useUser();
    
    // Hook pro prezentaci paywall - JEDNODUCHÉ
    const { registerPlacement } = usePlacement({
      onError: (error: any) => {
        console.error('[SuperwallIntegration] Paywall error:', error);
        
        // ATOMIC: Clear presentation lock on error
        presentingRef.current = false;
        pendingPromiseRef.current = null;
      },
      onPresent: (info: any) => {
        console.log('[SuperwallIntegration] Paywall presented:', info);
      },
      onDismiss: (info: any, result: any) => {
        console.log('[SuperwallIntegration] Paywall dismissed:', info, result);
        
        // ATOMIC: Clear presentation lock
        presentingRef.current = false;
        pendingPromiseRef.current = null;
        
        // Aktualizuj subscription status po nákupu NEBO restore
        if (result?.purchased === true || result?.type === 'purchased') {
          console.log('[SuperwallIntegration] Purchase successful:', result);
          setHasSubscription(true);
        } else if (result?.type === 'restored') {
          console.log('[SuperwallIntegration] Purchase restored:', result);  
          setHasSubscription(true);
        } else {
          console.log('[SuperwallIntegration] Paywall dismissed without purchase:', result);
        }
      },
    });

    // Aktualizuj subscription status při změnách (JEDNODUŠE)
    useEffect(() => {
      const isActive = subscriptionStatus?.status === 'ACTIVE';
      setHasSubscription(isActive);
    }, [subscriptionStatus?.status, setHasSubscription]);

    // Identifikuj uživatele JEDNOU
    useEffect(() => {
      if (user?.uid) {
        identify(user.uid);
      }
    }, [user?.uid]);

    // ROBUST paywall presentation with ATOMIC lock
    const presentPaywall = React.useCallback(async (placement = 'zario-template-3a85-2025-09-10'): Promise<boolean> => {
      // ATOMIC check: return existing promise if already presenting
      if (presentingRef.current) {
        console.log('[SuperwallIntegration] Paywall already presenting, returning existing promise...');
        return pendingPromiseRef.current || Promise.resolve(false);
      }
      
      console.log('[SuperwallIntegration] Presenting paywall with placement:', placement);
      
      // ATOMIC: Set lock immediately (synchronous)
      presentingRef.current = true;
      
      const promise = (async () => {
        try {
          await registerPlacement({
            placement,
            feature() {
              console.log('[SuperwallIntegration] Premium feature unlocked!');
              setHasSubscription(true);
            }
          });
          
          console.log('[SuperwallIntegration] Placement registered successfully');
          return true;
          
        } catch (error) {
          console.error('[SuperwallIntegration] Error presenting paywall:', error);
          // Error callback will clear the lock
          return false;
        }
      })();
      
      // Store pending promise for concurrent callers
      pendingPromiseRef.current = promise;
      
      return promise;
    }, [registerPlacement, setHasSubscription]);

    const contextValue: SuperwallContextType = {
      presentPaywall,
      isSubscribed: subscriptionStatus?.status === 'ACTIVE',
      subscriptionStatus: subscriptionStatus?.status || 'UNKNOWN'
    };

    return (
      <SuperwallContext.Provider value={contextValue}>
        {children}
      </SuperwallContext.Provider>
    );

  } catch (error) {
    console.warn('[SuperwallIntegration] Superwall hooks not available:', error);
    
    // Fallback context pro případ chyby
    const contextValue: SuperwallContextType = {
      presentPaywall: async () => {
        console.log('[SuperwallIntegration] Superwall not available - cannot present paywall');
        return false;
      },
      isSubscribed: false,
      subscriptionStatus: 'ERROR'
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
  const { setHasSubscription } = useAuth() as any;

  useEffect(() => {
    // V prostředí bez Superwall povolit přístup, aby nedošlo k deadlock
    console.log('[SuperwallIntegration] Superwall disabled - allowing access to prevent deadlock');
    setHasSubscription(true); // OPRAVA: Nastav na true místo false, aby se předešlo deadlock
  }, [setHasSubscription]);

  const contextValue: SuperwallContextType = {
    presentPaywall: async () => {
      console.log('[SuperwallIntegration] Superwall disabled - cannot present paywall, allowing access');
      return true; // OPRAVA: Vrať true místo false
    },
    isSubscribed: true, // OPRAVA: true místo false
    subscriptionStatus: 'DISABLED_ALLOWED'
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