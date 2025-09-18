import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithCredential,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Google Sign-In imports - only on native platforms
let GoogleSignin: any;
let statusCodes: any;
let isErrorWithCode: any;
let isSuccessResponse: any;

if (Platform.OS !== 'web') {
  const googleSigninModule = require('@react-native-google-signin/google-signin');
  GoogleSignin = googleSigninModule.GoogleSignin;
  statusCodes = googleSigninModule.statusCodes;
  isErrorWithCode = googleSigninModule.isErrorWithCode;
  isSuccessResponse = googleSigninModule.isSuccessResponse;
}

// Re-export Apple Sign In functionality
export { signInWithApple, isAppleSignInAvailable, isAppleUser } from './appleAuth';

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  try {
    console.log('[Auth] Attempting sign up for:', email);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    console.log('[Auth] Sign up successful for:', email);
    return cred.user;
  } catch (e: any) {
    console.error('[Auth] Sign up failed:', e);
    const friendlyError = mapAuthError(e);
    throw new Error(friendlyError);
  }
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  try {
    console.log('[Auth] Attempting sign in for:', email);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    console.log('[Auth] Sign in successful for:', email);
    return cred.user;
  } catch (e: any) {
    console.error('[Auth] Sign in failed:', e);
    const friendlyError = mapAuthError(e);
    throw new Error(friendlyError);
  }
}

export async function sendResetEmail(email: string): Promise<void> {
  try {
    console.log('[Auth] Sending password reset email to:', email);
    await sendPasswordResetEmail(auth, email);
    console.log('[Auth] Password reset email sent successfully');
  } catch (e: any) {
    console.error('[Auth] Password reset failed:', e);
    const friendlyError = mapAuthError(e);
    throw new Error(friendlyError);
  }
}

// Konfigurace pro Google Sign-In
let isGoogleConfigured = false;

function configureGoogleSignIn() {
  if (isGoogleConfigured) return;
  
  // Only configure on native platforms
  if (Platform.OS === 'web') {
    console.log('[Auth] Google Sign-In not available on web platform');
    return;
  }
  
  if (!GoogleSignin) {
    console.warn('[Auth] Google Sign-In module not available');
    return;
  }
  
  try {
    const extra = (Constants.expoConfig?.extra || {}) as Record<string, string>;
    const webClientId = extra.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const iosClientId = extra.IOS_GOOGLE_CLIENT_ID || process.env.IOS_GOOGLE_CLIENT_ID;
    
    if (!webClientId) {
      console.warn('[Auth] Google Web Client ID not configured');
      return;
    }
    
    console.log('[Auth] Configuring Google Sign-In...');
    console.log('[Auth] Web Client ID:', webClientId ? 'present' : 'missing');
    console.log('[Auth] iOS Client ID:', iosClientId ? 'present' : 'missing');
    
    GoogleSignin.configure({
      webClientId: webClientId,
      iosClientId: iosClientId,
      scopes: ['openid', 'profile', 'email'],
      offlineAccess: false,
    });
    
    isGoogleConfigured = true;
    console.log('[Auth] Google Sign-In configured successfully');
  } catch (error) {
    console.error('[Auth] Failed to configure Google Sign-In:', error);
  }
}

// Configure Google Sign-In immediately
configureGoogleSignIn();

export async function signInWithGoogle(): Promise<User> {
  // Platform check
  if (Platform.OS === 'web') {
    throw new Error('Google Sign-In není dostupný na web platformě. Použijte email/password přihlášení.');
  }
  
  if (!GoogleSignin || !isSuccessResponse) {
    throw new Error('Google Sign-In není dostupný na této platformě');
  }
  
  try {
    console.log('[Auth] Starting Google Sign In with react-native-google-signin...');
    
    // Ensure Google Sign-In is configured
    configureGoogleSignIn();
    
    if (!isGoogleConfigured) {
      throw new Error("Google Client ID není nakonfigurovaný. Přidejte GOOGLE_CLIENT_ID do app.config.ts");
    }

    // Check if device has Google Play Services (Android only)
    if (Platform.OS === 'android') {
      console.log('[Auth] Checking Google Play Services...');
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    }
    
    console.log('[Auth] Initiating Google Sign-In...');
    const response = await GoogleSignin.signIn();
    
    if (!isSuccessResponse(response)) {
      if (response.type === 'cancelled') {
        throw new Error('Přihlášení přes Google bylo zrušeno');
      }
      throw new Error('Google přihlášení selhalo');
    }
    
    const { data: userInfo } = response;
    console.log('[Auth] Google Sign In successful for:', userInfo.user.email);
    console.log('[Auth] Has ID token:', !!userInfo.idToken);
    
    if (!userInfo.idToken) {
      throw new Error('Google neposkytl ID token');
    }
    
    console.log('[Auth] Creating Firebase credential...');
    
    // Create Firebase credential from Google tokens
    // Use idToken for Firebase authentication (accessToken not needed for Firebase)
    const credential = GoogleAuthProvider.credential(
      userInfo.idToken,
      null // accessToken not required for Firebase
    );
    
    console.log('[Auth] Firebase credential created, signing in...');
    
    // Sign in to Firebase
    const firebaseResult = await signInWithCredential(auth, credential);
    console.log('[Auth] Firebase Sign In successful for:', firebaseResult.user.email);
    
    return firebaseResult.user;
    
  } catch (error: any) {
    console.error('[Auth] Google Sign In failed:', error);
    
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          throw new Error('Google přihlášení již probíhá');
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          throw new Error('Google Play Services nejsou dostupné');
        case statusCodes.SIGN_IN_CANCELLED:
          throw new Error('Přihlášení přes Google bylo zrušeno');
        case statusCodes.SIGN_IN_REQUIRED:
          throw new Error('Je vyžadováno přihlášení přes Google');
        default:
          console.error('[Auth] Unknown Google Sign In error code:', error.code);
      }
    }
    
    const friendlyError = mapAuthError(error);
    throw new Error(friendlyError);
  }
}

function mapAuthError(e: any): string {
  const code = e?.code || "";
  const message = e?.message || "";
  
  if (code.includes("auth/invalid-credential")) return "Špatný email nebo heslo.";
  if (code.includes("auth/user-not-found")) return "Účet s tímto emailem neexistuje.";
  if (code.includes("auth/wrong-password")) return "Špatné heslo.";
  if (code.includes("auth/email-already-in-use")) return "Email je již registrován.";
  if (code.includes("auth/weak-password")) return "Heslo je příliš slabé (min. 6 znaků).";
  if (code.includes("auth/invalid-email")) return "Neplatný formát emailu.";
  if (code.includes("auth/account-exists-with-different-credential")) {
    return "Účet s tímto emailem již existuje s jinou metodou přihlášení.";
  }
  if (message.includes("Client ID")) return "Google přihlášení není správně nakonfigurováno.";
  if (message.includes("Play Services")) return "Google Play Services nejsou dostupné nebo jsou zastaralé.";
  if (message.includes("SIGN_IN_CANCELLED")) return "Přihlášení přes Google bylo zrušeno.";
  if (message.includes("IN_PROGRESS")) return "Google přihlášení již probíhá.";
  
  return e?.message || "Akce selhala. Zkus to znovu.";
}