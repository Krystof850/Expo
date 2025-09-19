import React, { createContext, useContext, useEffect, ReactNode } from 'react';
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
const SuperwallEnabledIntegration: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, setHasSubscription } = useAuth() as any;

  try {
    const { useUser, usePlacement, useSuperwallEvents } = require('expo-superwall');
    
    // Hook pro správu uživatele a subscription status
    const { subscriptionStatus, identify } = useUser();
    
    // Hook pro sledování událostí
    useSuperwallEvents({
      onSubscriptionStatusChange: (newStatus: any) => {
        console.log('[SuperwallIntegration] Subscription status changed:', newStatus.status);
        const isActive = newStatus.status === 'ACTIVE';
        setHasSubscription(isActive);
      },
      onPaywallDismiss: (info: any, result: any) => {
        console.log('[SuperwallIntegration] Paywall dismissed:', info, result);
        // Po zavření paywall zkontroluj subscription status
        setTimeout(() => {
          const isActive = subscriptionStatus?.status === 'ACTIVE';
          console.log('[SuperwallIntegration] Post-dismissal subscription check:', {
            status: subscriptionStatus?.status,
            isActive
          });
          setHasSubscription(isActive);
        }, 1000);
      }
    });
    
    // Hook pro prezentaci paywall - použití SPRÁVNÉHO present method
    const { present } = usePlacement({
      onError: (error: any) => {
        console.error('[SuperwallIntegration] Paywall error:', error);
      },
      onPresent: (info: any) => {
        console.log('[SuperwallIntegration] Paywall presented:', info);
      },
      onDismiss: (info: any, result: any) => {
        console.log('[SuperwallIntegration] Paywall dismissed:', info, result);
        
        // Aktualizuj subscription status po nákupu nebo restore
        if (result?.type === 'purchased' || result?.type === 'restored') {
          console.log('[SuperwallIntegration] Purchase/restore successful:', result);
          setHasSubscription(true);
        }
      },
    });

    // Aktualizuj subscription status při změnách
    useEffect(() => {
      const isActive = subscriptionStatus?.status === 'ACTIVE';
      console.log('[SuperwallIntegration] Subscription status update:', {
        status: subscriptionStatus?.status,
        isActive
      });
      
      setHasSubscription(isActive);
    }, [subscriptionStatus, setHasSubscription]);

    // Automaticky identifikuj uživatele při přihlášení
    useEffect(() => {
      if (user && user.uid) {
        console.log('[SuperwallIntegration] Identifying user in Superwall:', user.uid);
        identify(user.uid);
      }
    }, [user, identify]);

    // SPRÁVNÁ funkce pro prezentaci paywall pomocí present()
    const presentPaywall = async (placement = 'zario-template-3a85-2025-09-10'): Promise<boolean> => {
      console.log('[SuperwallIntegration] Presenting paywall with placement:', placement);
      
      try {
        const result = await present({ placement });
        console.log('[SuperwallIntegration] Present result:', result);
        
        // Zkontroluj, jestli byl nákup úspěšný
        const success = result?.type === 'purchased' || result?.type === 'restored';
        if (success) {
          setHasSubscription(true);
        }
        
        return success;
      } catch (error) {
        console.error('[SuperwallIntegration] Error presenting paywall:', error);
        return false;
      }
    };

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
const SuperwallDisabledIntegration: React.FC<{ children: ReactNode }> = ({ children }) => {
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
const SuperwallIntegration: React.FC<{ children: ReactNode }> = ({ children }) => {
  const superwallSupported = isSuperwallSupported();

  if (superwallSupported) {
    return <SuperwallEnabledIntegration>{children}</SuperwallEnabledIntegration>;
  }

  return <SuperwallDisabledIntegration>{children}</SuperwallDisabledIntegration>;
};

export default SuperwallIntegration;