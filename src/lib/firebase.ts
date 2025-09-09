import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
} from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Constants from "expo-constants";

const extra = (Constants.expoConfig?.extra || {}) as Record<string, string>;

const firebaseConfig = {
  apiKey: extra.FIREBASE_API_KEY,
  authDomain: extra.FIREBASE_AUTH_DOMAIN,
  projectId: extra.FIREBASE_PROJECT_ID,
  storageBucket: extra.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: extra.FIREBASE_MESSAGING_SENDER_ID,
  appId: extra.FIREBASE_APP_ID,
};

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
let auth;
try {
  // Pokud už je inicializovaný, prostě ho získáme:
  auth = getApps().length ? getAuth() : initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // Při HMR a opakovaném importu může být initializeAuth už hotové:
  auth = getAuth();
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };