import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  Auth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const extra = (Constants.expoConfig?.extra || {}) as Record<string, string>;
const isWeb = Platform.OS === 'web';

// On web, use direct process.env access (works with Replit secrets)
// On native, prefer Constants.expoConfig.extra then fallback to process.env
const firebaseConfig = {
  apiKey: isWeb ? process.env.FIREBASE_API_KEY : (extra.FIREBASE_API_KEY || process.env.FIREBASE_API_KEY),
  authDomain: isWeb ? process.env.FIREBASE_AUTH_DOMAIN : (extra.FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN),
  projectId: isWeb ? process.env.FIREBASE_PROJECT_ID : (extra.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID),
  storageBucket: isWeb ? process.env.FIREBASE_STORAGE_BUCKET : (extra.FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET),
  messagingSenderId: isWeb ? process.env.FIREBASE_MESSAGING_SENDER_ID : (extra.FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID),
  appId: isWeb ? process.env.FIREBASE_APP_ID : (extra.FIREBASE_APP_ID || process.env.FIREBASE_APP_ID),
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
  // Pokud chybí klíče, použij dummy hodnoty aby se aplikace nenasypala
  console.warn(
    "[Firebase] Missing config. Using dummy values. Firebase features won't work until you configure real keys."
  );
  firebaseConfig.apiKey = firebaseConfig.apiKey || "dummy-api-key";
  firebaseConfig.appId = firebaseConfig.appId || "1:123456789:web:dummy";
  firebaseConfig.projectId = firebaseConfig.projectId || "dummy-project";
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firebase Auth - Expo automatically handles persistence with AsyncStorage
let auth: Auth;
try {
  // For Expo/React Native, getAuth automatically uses AsyncStorage for persistence
  auth = getAuth(app);
  console.log('[Firebase] Auth initialized successfully with automatic persistence');
} catch (e) {
  // Handle double initialization during HMR
  auth = getAuth();
  console.log('[Firebase] Using existing auth instance');
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