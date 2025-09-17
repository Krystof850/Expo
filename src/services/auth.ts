import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithCredential,
  GoogleAuthProvider,
  User,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

// Re-export Apple Sign In functionality
export { signInWithApple, isAppleSignInAvailable, isAppleUser } from './appleAuth';

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  try {
    console.log('[Auth] Attempting sign up for:', email);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    console.log('[Auth] Sign up successful for:', email);
    
    // Send email verification immediately after signup
    try {
      await sendEmailVerification(cred.user);
      console.log('[Auth] Email verification sent to:', email);
    } catch (verificationError) {
      console.error('[Auth] Failed to send verification email:', verificationError);
      // Don't throw error here, just log it - user is still created
    }
    
    return cred.user;
  } catch (e: any) {
    console.error('[Auth] Sign up failed:', e);
    throw createAuthError(e);
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
    throw createAuthError(e);
  }
}

export async function sendResetEmail(email: string): Promise<void> {
  try {
    console.log('[Auth] Sending password reset email to:', email);
    await sendPasswordResetEmail(auth, email);
    console.log('[Auth] Password reset email sent successfully');
  } catch (e: any) {
    console.error('[Auth] Password reset failed:', e);
    throw createAuthError(e);
  }
}

/**
 * Check if email already exists in Firebase Auth and return provider info
 */
export async function checkEmailExists(email: string): Promise<{ exists: boolean; methods: string[]; hasPassword: boolean }> {
  try {
    console.log('[Auth] Checking if email exists:', email);
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    const exists = signInMethods.length > 0;
    const hasPassword = signInMethods.includes('password');
    console.log('[Auth] Email exists:', exists, 'Methods:', signInMethods, 'Has password:', hasPassword);
    return { exists, methods: signInMethods, hasPassword };
  } catch (e: any) {
    console.error('[Auth] Failed to check email existence:', e);
    // If we can't check, assume it doesn't exist to allow signup attempt
    return { exists: false, methods: [], hasPassword: false };
  }
}

// Konfigurace pro Google OAuth
WebBrowser.maybeCompleteAuthSession();

// Nastavíme redirect URI přímo
const redirectUri = 'expo-on-replit://';

console.log('[Auth] Redirect URI:', redirectUri);

export async function signInWithGoogle(): Promise<User> {
  try {
    console.log('[Auth] Starting Google Sign In with WebBrowser...');
    
    // Získej Google Client ID z konfigurace
    const extra = (Constants.expoConfig?.extra || {}) as Record<string, string>;
    const googleClientId = extra.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    
    if (!googleClientId) {
      throw new Error("Google Client ID není nakonfigurovaný. Přidejte GOOGLE_CLIENT_ID do app.config.ts");
    }

    // Použij WebBrowser přístup pro jednodušší OAuth flow
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${googleClientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('openid profile email')}&` +
      `state=google_sign_in`;

    console.log('[Auth] Opening Google auth in WebBrowser...');
    
    const result = await WebBrowser.openAuthSessionAsync(
      authUrl,
      redirectUri
    );

    console.log('[Auth] WebBrowser result type:', result.type);

    if (result.type === 'success') {
      console.log('[Auth] Auth session successful, processing URL...');
      
      // Extrahuj authorization code z URL
      const url = new URL(result.url);
      const code = url.searchParams.get('code');
      
      if (!code) {
        throw new Error("Authorization code nebyl nalezen v odpovědi");
      }

      console.log('[Auth] Authorization code received, exchanging for token...');
      
      // Vyměň authorization code za access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: googleClientId,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error(`Token exchange failed: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      console.log('[Auth] Token exchange successful');
      console.log('[Auth] Has ID token:', !!tokenData.id_token);
      console.log('[Auth] Has access token:', !!tokenData.access_token);

      if (!tokenData.id_token) {
        throw new Error("Google neposkytl ID token");
      }

      console.log('[Auth] Creating Firebase credential...');
      
      // Vytvoř Firebase credential z Google tokenu
      const credential = GoogleAuthProvider.credential(
        tokenData.id_token,
        tokenData.access_token
      );

      console.log('[Auth] Firebase credential created, signing in...');

      // Přihlaš se do Firebase
      const firebaseResult = await signInWithCredential(auth, credential);
      console.log('[Auth] Google Sign In successful for:', firebaseResult.user.email);
      
      return firebaseResult.user;
      
    } else if (result.type === 'cancel') {
      throw new Error("Přihlášení přes Google bylo zrušeno");
    } else {
      throw new Error(`Google přihlášení selhalo: ${result.type}`);
    }
  } catch (e: any) {
    console.error('[Auth] Google Sign In failed:', e);
    throw createAuthError(e);
  }
}

function createAuthError(e: any, customMessage?: string): Error {
  const originalCode = e?.code || "";
  const originalMessage = e?.message || "";
  
  // Create friendly message based on error code
  let friendlyMessage = customMessage;
  if (!friendlyMessage) {
    if (originalCode.includes("auth/invalid-credential")) friendlyMessage = "Incorrect email or password.";
    else if (originalCode.includes("auth/user-not-found")) friendlyMessage = "Account with this email does not exist.";
    else if (originalCode.includes("auth/wrong-password")) friendlyMessage = "Incorrect password.";
    else if (originalCode.includes("auth/email-already-in-use")) friendlyMessage = "Email is already registered.";
    else if (originalCode.includes("auth/weak-password")) friendlyMessage = "Password is too weak (min. 6 characters).";
    else if (originalCode.includes("auth/invalid-email")) friendlyMessage = "Invalid email format.";
    else if (originalCode.includes("auth/user-disabled")) friendlyMessage = "This account has been disabled. Please contact support.";
    else if (originalCode.includes("auth/too-many-requests")) friendlyMessage = "Too many failed attempts. Please try again later.";
    else if (originalCode.includes("auth/account-exists-with-different-credential")) {
      friendlyMessage = "Account with this email already exists with a different sign-in method.";
    }
    else if (originalMessage.includes("Client ID")) friendlyMessage = "Google sign-in is not properly configured.";
    else friendlyMessage = originalMessage || "Action failed. Please try again.";
  }
  
  // Create new error with friendly message but preserve original code
  const authError = new Error(friendlyMessage);
  (authError as any).code = originalCode;
  return authError;
}