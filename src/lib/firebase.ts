import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
  Auth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

const extra = (Constants.expoConfig?.extra || {}) as Record<string, string>;

// Pro web build použij přímo process.env, pro native použij expo config
const firebaseConfig = {
  apiKey: Platform.OS === 'web' ? process.env.FIREBASE_API_KEY : extra.FIREBASE_API_KEY,
  authDomain: Platform.OS === 'web' ? process.env.FIREBASE_AUTH_DOMAIN : extra.FIREBASE_AUTH_DOMAIN,
  projectId: Platform.OS === 'web' ? process.env.FIREBASE_PROJECT_ID : extra.FIREBASE_PROJECT_ID,
  storageBucket: Platform.OS === 'web' ? process.env.FIREBASE_STORAGE_BUCKET : extra.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Platform.OS === 'web' ? process.env.FIREBASE_MESSAGING_SENDER_ID : extra.FIREBASE_MESSAGING_SENDER_ID,
  appId: Platform.OS === 'web' ? process.env.FIREBASE_APP_ID : extra.FIREBASE_APP_ID,
};

// Debug log pro kontrolu configu
console.log('[Firebase] Config loaded:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasProjectId: !!firebaseConfig.projectId,
  hasAppId: !!firebaseConfig.appId,
  authDomain: firebaseConfig.authDomain
});

// Přidáme ještě více debuggingu
console.log('[Firebase] Raw config values:', {
  apiKey: firebaseConfig.apiKey?.substring(0, 10) + '...',
  projectId: firebaseConfig.projectId,
  appId: firebaseConfig.appId?.substring(0, 10) + '...',
  platform: Platform.OS,
  hasExtra: !!extra,
  extraKeys: Object.keys(extra)
});

if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.appId ||
  !firebaseConfig.projectId
) {
  // Neházej chybu při dev bez klíčů, jen varuj:
  console.warn(
    "[Firebase] Missing config. Fill FIREBASE_* in app.config.ts/.env before signing in."
  );
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// initializeAuth musí být voláno před getAuth() pro RN/Expo perzistenci
let auth: Auth;
try {
  // Pokud už je inicializovaný, prostě ho získáme:
  if (getApps().length) {
    auth = getAuth();
  } else {
    if (Platform.OS === 'web') {
      auth = initializeAuth(app);
    } else {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
  }
} catch (e) {
  // Při HMR a opakovaném importu může být initializeAuth už hotové:
  auth = getAuth();
}

const db = getFirestore(app);
const storage = getStorage(app);

// Diagnostická funkce pro kontrolu Firebase konfigurace
export function assertFirebaseConfig(): { isValid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!firebaseConfig.apiKey) missing.push('FIREBASE_API_KEY');
  if (!firebaseConfig.authDomain) missing.push('FIREBASE_AUTH_DOMAIN');
  if (!firebaseConfig.projectId) missing.push('FIREBASE_PROJECT_ID');
  if (!firebaseConfig.storageBucket) missing.push('FIREBASE_STORAGE_BUCKET');
  if (!firebaseConfig.messagingSenderId) missing.push('FIREBASE_MESSAGING_SENDER_ID');
  if (!firebaseConfig.appId) missing.push('FIREBASE_APP_ID');
  
  return {
    isValid: missing.length === 0,
    missing
  };
}

// Debug funkce pro zobrazení runtime konfigurace
export function logFirebaseConfigDebug(): void {
  console.log('[Firebase Debug] Runtime config check:');
  console.log('Constants.expoConfig.extra:', Constants.expoConfig?.extra);
  console.log('Platform.OS:', Platform.OS);
  console.log('process.env keys:', Object.keys(process.env || {}).filter(k => k.startsWith('FIREBASE_')));
  console.log('Final firebaseConfig:', firebaseConfig);
}

export { app, auth, db, storage };