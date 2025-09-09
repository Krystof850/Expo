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

// Přímo nastavíme redirect URI na hodnotu z Google Cloud Console
const redirectUri = 'https://auth.expo.io/@anonymous/expo-on-replit';

console.log('[Auth] Redirect URI:', redirectUri);

export async function signInWithGoogle(): Promise<User> {
  try {
    console.log('[Auth] Starting Google Sign In...');
    
    // Získej Google Client ID z konfigurace
    const extra = (Constants.expoConfig?.extra || {}) as Record<string, string>;
    const googleClientId = extra.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    
    if (!googleClientId) {
      throw new Error("Google Client ID není nakonfigurovaný. Přidejte GOOGLE_CLIENT_ID do app.config.ts");
    }

    // Vytvoř Auth Request
    const request = new AuthSession.AuthRequest({
      clientId: googleClientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {},
    });

    // Připrav a spusť autentifikaci
    const result = await request.promptAsync({
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    });

    if (result.type === 'success') {
      console.log('[Auth] Google auth success, exchanging code for token...');
      console.log('[Auth] Authorization code received:', result.params.code?.substring(0, 10) + '...');
      
      try {
        // Vyměň authorization code za access token
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId: googleClientId,
            code: result.params.code,
            extraParams: {
              code_verifier: request.codeVerifier || '',
            },
            redirectUri,
          },
          {
            tokenEndpoint: 'https://oauth2.googleapis.com/token',
          }
        );

        console.log('[Auth] Token exchange successful');
        console.log('[Auth] Has ID token:', !!tokenResult.idToken);
        console.log('[Auth] Has access token:', !!tokenResult.accessToken);
        
        if (!tokenResult.idToken) {
          throw new Error("Google neposkytl ID token");
        }

        console.log('[Auth] Creating Firebase credential...');
        
        // Vytvoř Firebase credential z Google tokenu
        const credential = GoogleAuthProvider.credential(
          tokenResult.idToken,
          tokenResult.accessToken
        );

        console.log('[Auth] Firebase credential created, signing in...');

        // Přihlaš se do Firebase
        const firebaseResult = await signInWithCredential(auth, credential);
        console.log('[Auth] Google Sign In successful for:', firebaseResult.user.email);
        
        return firebaseResult.user;
        
      } catch (tokenError: any) {
        console.error('[Auth] Token exchange or Firebase sign-in failed:', tokenError);
        throw tokenError;
      }
    } else {
      console.log('[Auth] Google auth result type:', result.type);
      if (result.type === 'cancel') {
        throw new Error("Přihlášení přes Google bylo zrušeno");
      } else {
        throw new Error(`Google přihlášení selhalo: ${result.type}`);
      }
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