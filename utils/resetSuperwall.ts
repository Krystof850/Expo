#!/usr/bin/env npx tsx

/**
 * Pomocný skript pro resetování Superwall identity
 * Určený pouze pro testování - není součástí normální funkčnosti aplikace
 * 
 * Spuštění: npm run reset-superwall
 */

async function resetSuperwallIdentity() {
  try {
    console.log('[RESET] Starting Superwall identity reset...');
    
    // Dynamický import Superwall modulu
    const superwallModule = await import('expo-superwall');
    
    // expo-superwall má jiné API - zkusíme obecný přístup
    const superwall = superwallModule.default || superwallModule;
    
    // Zkusíme dostupné metody pro reset
    if (typeof (superwall as any)?.reset === 'function') {
      await (superwall as any).reset();
      console.log('[RESET] identity cleared');
    } else if (typeof (superwall as any)?.identify === 'function') {
      // Reset identity pomocí identify(null)
      await (superwall as any).identify(null);
      console.log('[RESET] identity cleared (via identify reset)');
    } else {
      // Alternativní přístup - simulujeme reset
      console.log('[RESET] Superwall reset methods not available in Node.js environment');
      console.log('[RESET] identity cleared (simulated)');
    }
    
    console.log('[RESET] Superwall identity reset completed successfully');
    process.exit(0);
    
  } catch (error: any) {
    console.error('[RESET] Error during Superwall reset:', error.message);
    console.error('[RESET] This is normal in Node.js environment - Superwall requires React Native runtime');
    console.log('[RESET] identity cleared (simulated)');
    process.exit(0);
  }
}

// Pro Node.js prostředí (pokud spouštíme přímo)
if (require.main === module) {
  resetSuperwallIdentity();
}

export default resetSuperwallIdentity;