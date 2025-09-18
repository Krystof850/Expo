import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithCredential,
  GoogleAuthProvider,
  User,
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
    const friendlyError = mapAuthError(e);
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
  
  return e?.message || "Akce selhala. Zkus to znovu.";
}