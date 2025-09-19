import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithCredential,
  GoogleAuthProvider,
  User,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { ProgressService } from './progressService';

// Google Sign-In imports - lazy loading with error handling
let GoogleSignin: any = null;
let statusCodes: any = null;
let isErrorWithCode: any = null;
let isSuccessResponse: any = null;
let GoogleSigninButton: any = null;

// Lazy load Google Sign-In module with error handling
const loadGoogleSignIn = () => {
  if (Platform.OS === 'web' || GoogleSignin) return GoogleSignin !== null;
  
  try {
    const googleSigninModule = require('@react-native-google-signin/google-signin');
    GoogleSignin = googleSigninModule.GoogleSignin;
    statusCodes = googleSigninModule.statusCodes;
    isErrorWithCode = googleSigninModule.isErrorWithCode;
    isSuccessResponse = googleSigninModule.isSuccessResponse;
    GoogleSigninButton = googleSigninModule.GoogleSigninButton;
    console.log('[Auth] ✅ Google Sign-In module loaded successfully');
    return true;
  } catch (error: any) {
    console.log('[Auth] ⚠️ Google Sign-In module not available in this build:', error.message);
    return false;
  }
};

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
  if (isGoogleConfigured) return true;
  
  // Only configure on native platforms
  if (Platform.OS === 'web') {
    console.log('[Auth] Google Sign-In not available on web platform');
    return false;
  }
  
  // Try to load Google Sign-In module first
  const isLoaded = loadGoogleSignIn();
  if (!isLoaded || !GoogleSignin) {
    console.warn('[Auth] ⚠️ Google Sign-In module not available - app will work without it');
    return false;
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
    console.log('[Auth] ✅ Google Sign-In configured successfully');
    return true;
  } catch (error) {
    console.error('[Auth] ❌ Failed to configure Google Sign-In:', error);
    return false;
  }
}

// Note: Google Sign-In will be configured when first needed

export async function signInWithGoogle(): Promise<User> {
  // Platform check
  if (Platform.OS === 'web') {
    throw new Error('Google Sign-In není dostupný na web platformě. Použijte email/password přihlášení.');
  }
  
  try {
    console.log('[Auth] Starting Google Sign In with react-native-google-signin...');
    
    // Try to configure Google Sign-In
    const isConfigured = configureGoogleSignIn();
    if (!isConfigured || !GoogleSignin || !isSuccessResponse) {
      // Check if we're in Expo Go
      const isExpoGo = Constants.appOwnership === 'expo';
      if (isExpoGo) {
        throw new Error('Google Sign-In není podporován v Expo Go aplikaci. Použijte email přihlášení nebo si stáhněte development build.');
      } else {
        throw new Error('Google Sign-In není dostupný v tomto buildu aplikace. Potřebujete nový development build s Google Sign-In modulem.');
      }
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
    
    if (isErrorWithCode && isErrorWithCode(error)) {
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

// Export Google Sign-In button component and availability check
export { GoogleSigninButton };

export const isGoogleSignInAvailable = (): boolean => {
  if (Platform.OS === 'web') return false;
  
  const isLoaded = loadGoogleSignIn();
  return isLoaded && GoogleSignin !== null;
};

/**
 * Delete user account with robust re-authentication flow
 * @param currentPassword - Required for email/password users
 * @returns Promise<void>
 */
export async function deleteUserAccount(currentPassword?: string): Promise<void> {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('Žádný uživatel není přihlášen');
  }

  try {
    console.log('[Auth] Starting account deletion for user:', user.email);
    
    // Always attempt deletion first - let Firebase determine if re-auth is needed
    await attemptAccountDeletion(user);
    
  } catch (error: any) {
    if (error.code === 'auth/requires-recent-login') {
      console.log('[Auth] Re-authentication required, performing provider-specific reauth');
      
      // Perform re-authentication based on provider
      await performReAuthentication(user, currentPassword);
      
      // Retry deletion after re-authentication
      await attemptAccountDeletion(user);
    } else {
      throw error; // Re-throw other errors
    }
  }
}

/**
 * Attempt to delete user account and data
 */
async function attemptAccountDeletion(user: User): Promise<void> {
  // Delete user data from Firestore before deleting auth account
  console.log('[Auth] Deleting user data from Firestore...');
  try {
    await ProgressService.deleteUserData(user.uid);
    console.log('[Auth] User data deleted from Firestore successfully');
  } catch (firestoreError: any) {
    console.error('[Auth] Failed to delete Firestore data:', firestoreError);
    // Don't continue with auth deletion if data deletion fails
    // This ensures user data isn't left orphaned
    throw new Error('Failed to delete user data. Please try again or contact support.');
  }
  
  // Delete the Firebase Auth account
  console.log('[Auth] Deleting Firebase Auth account...');
  await deleteUser(user);
  
  console.log('[Auth] Account deletion successful');
}

/**
 * Perform re-authentication based on user's auth provider
 */
async function performReAuthentication(user: User, currentPassword?: string): Promise<void> {
  const providerData = user.providerData;
  
  // Find the auth provider
  const hasEmailProvider = providerData.some(p => p.providerId === 'password');
  const hasGoogleProvider = providerData.some(p => p.providerId === 'google.com');
  const hasAppleProvider = providerData.some(p => p.providerId === 'apple.com');
  
  if (hasEmailProvider) {
    // Email/password re-authentication
    if (!currentPassword) {
      throw new Error('Pro smazání účtu je vyžadováno aktuální heslo');
    }
    
    if (!user.email) {
      throw new Error('Email uživatele není dostupný pro re-authentication');
    }
    
    console.log('[Auth] Re-authenticating with email/password');
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
  } else if (hasGoogleProvider) {
    // Google re-authentication
    console.log('[Auth] Re-authenticating with Google');
    
    if (Platform.OS === 'web') {
      throw new Error('Google re-authentication není podporována na webu. Kontaktujte podporu.');
    }
    
    const isConfigured = configureGoogleSignIn();
    if (!isConfigured || !GoogleSignin) {
      throw new Error('Google Sign-In není dostupný pro re-authentication');
    }
    
    // Get fresh Google token
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) {
      throw new Error('Google re-authentication selhala');
    }
    
    const { data: userInfo } = response;
    if (!userInfo.idToken) {
      throw new Error('Google neposkytl ID token pro re-authentication');
    }
    
    const credential = GoogleAuthProvider.credential(userInfo.idToken, null);
    await reauthenticateWithCredential(user, credential);
    
  } else if (hasAppleProvider) {
    // Apple re-authentication using expo-apple-authentication
    console.log('[Auth] Re-authenticating with Apple');
    
    try {
      // Import Apple auth dynamically since it may not be available
      const { signInWithApple } = await import('./appleAuth');
      
      // Get fresh Apple credential - this will show Apple Sign In prompt
      const appleCredential = await signInWithApple();
      
      // The signInWithApple function returns the signed-in user, but we need to re-auth the existing user
      // We need to get the credential from the Apple Sign In flow
      throw new Error('Apple re-authentication vyžaduje speciální tok. Odhlaste se a přihlaste znovu přes Apple.');
      
    } catch (appleError: any) {
      console.error('[Auth] Apple re-authentication failed:', appleError);
      throw new Error('Apple re-authentication selhala. Odhlaste se a přihlaste znovu.');
    }
    
  } else {
    throw new Error('Neznámý poskytovatel přihlášení - nelze provést re-authentication');
  }
  
  console.log('[Auth] Re-authentication completed successfully');
}