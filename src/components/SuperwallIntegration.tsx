import * as React from 'react';
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { isSuperwallSupported, isDevelopmentEnvironment, getMockProductData, MockProductData } from '../utils/environment';

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
        
        const isDev = isDevelopmentEnvironment();
        const mockProducts = getMockProductData();
        
        // Zkontroluj jestli produkty mají ceny
        const hasValidPrices = info?.products?.some((p: any) => p.price !== undefined && p.priceString !== undefined);
        
        if (isDev && !hasValidPrices) {
          console.warn('🔧 [DEVELOPMENT] Products missing prices - Testing requires physical device with Apple Sandbox');
          console.warn('📱 TESTING GUIDE:');
          console.warn('  1. Build app for physical iOS device (not simulator)');
          console.warn('  2. Set up Apple Sandbox test account in Settings > App Store > Sandbox Account');
          console.warn('  3. Products must be "Ready to Submit" in App Store Connect');
          console.warn('  4. Expected prices will be:');
          mockProducts.forEach((mock: MockProductData) => {
            console.warn(`     ${mock.id}: ${mock.priceString}/${mock.period} (${mock.name})`);
          });
          console.warn('  5. Use TestFlight for production-like testing');
        } else {
          console.log('✅ [PRODUCTION] Using real product prices from App Store/Sandbox');
        }
        
        // DEBUG: Log detailed product information
        console.log('[SuperwallIntegration] PRODUCT DEBUG:');
        console.log('  - Environment:', isDev ? 'DEVELOPMENT' : 'PRODUCTION');
        console.log('  - Has valid prices:', hasValidPrices);
        console.log('  - Product IDs:', info?.productIds);
        console.log('  - Products:', info?.products?.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price || 'undefined',
          priceString: p.priceString || 'undefined'
        })));
        console.log('  - Products load time:', info?.productsLoadCompleteTime);
        console.log('  - Products load duration:', info?.productsLoadDuration);
        console.log('  - URL:', info?.url);
        
        if (info?.productsLoadFailTime) {
          console.error('[SuperwallIntegration] Products failed to load at:', info.productsLoadFailTime);
        }
        
        // DEVELOPMENT GUIDE: Proper testing approach
        if (isDev) {
          console.log('');
          console.log('🚨 IMPORTANT - PRICING TESTING IN DEVELOPMENT:');
          console.log('   Expo development builds cannot display StoreKit prices locally.');
          console.log('   For proper pricing validation:');
          console.log('   • Test on physical device with Apple Sandbox account');
          console.log('   • Ensure products are configured in App Store Connect');
          console.log('   • Use TestFlight for production-ready testing');
          console.log('   • Products must be "Ready to Submit" status');
          console.log('');
        }
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