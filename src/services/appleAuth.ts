import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { OAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Platform } from 'react-native';

export interface AppleSignInResult {
  user: any;
  isNewUser?: boolean;
  email?: string;
  fullName?: {
    givenName: string;
    familyName: string;
  };
}

/**
 * Check if Apple Sign In is available on this device
 */
export const isAppleSignInAvailable = async (): Promise<boolean> => {
  if (Platform.OS !== 'ios') {
    return false;
  }
  
  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch (error) {
    console.warn('[AppleAuth] Failed to check availability:', error);
    return false;
  }
};

/**
 * Sign in with Apple using Firebase Authentication
 */
export const signInWithApple = async (): Promise<AppleSignInResult> => {
  try {
    console.log('[AppleAuth] Starting Apple Sign In flow');
    
    // Check if Apple Sign In is available
    const isAvailable = await isAppleSignInAvailable();
    if (!isAvailable) {
      throw new Error('Apple Sign In is not available on this device');
    }

    // Generate a secure nonce for the request
    const rawNonce = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
    
    // Hash the nonce using SHA256
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      rawNonce,
      { encoding: Crypto.CryptoEncoding.HEX }
    );

    console.log('[AppleAuth] Generated nonce, requesting Apple credentials');

    // Request Apple authentication with nonce
    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce, // Pass hashed nonce to Apple
    });

    console.log('[AppleAuth] Received Apple credential response');

    // Verify we received an identity token
    if (!appleCredential.identityToken) {
      throw new Error('Apple Sign In failed - no identity token returned');
    }

    // Create Firebase credential using the identity token and raw nonce
    const provider = new OAuthProvider('apple.com');
    const firebaseCredential = provider.credential({
      idToken: appleCredential.identityToken,
      rawNonce: rawNonce, // Use raw nonce for Firebase, not hashed
    });

    console.log('[AppleAuth] Created Firebase credential, signing in');

    // Sign in with Firebase
    const result = await signInWithCredential(auth, firebaseCredential);
    
    console.log('[AppleAuth] Firebase sign in successful');

    // Prepare the result
    const signInResult: AppleSignInResult = {
      user: result.user,
      isNewUser: (result as any).additionalUserInfo?.isNewUser,
    };

    // Store user info if provided (only available on first sign-in)
    if (appleCredential.fullName) {
      signInResult.fullName = {
        givenName: appleCredential.fullName.givenName || '',
        familyName: appleCredential.fullName.familyName || '',
      };
      console.log('[AppleAuth] User name available:', signInResult.fullName);
    }

    if (appleCredential.email) {
      signInResult.email = appleCredential.email;
      console.log('[AppleAuth] User email available:', signInResult.email);
    }

    return signInResult;

  } catch (error: any) {
    console.error('[AppleAuth] Apple Sign In failed:', error);
    
    // Handle specific Apple Sign In errors
    if (error.code === 'ERR_REQUEST_CANCELED') {
      throw new Error('Apple Sign In was canceled by the user');
    } else if (error.code === 'ERR_REQUEST_FAILED') {
      throw new Error('Apple Sign In request failed. Please try again.');
    } else if (error.code === 'ERR_INVALID_RESPONSE') {
      throw new Error('Invalid response from Apple. Please try again.');
    } else if (error.code === 'ERR_REQUEST_NOT_HANDLED') {
      throw new Error('Apple Sign In is not configured properly');
    } else if (error.code === 'ERR_REQUEST_NOT_INTERACTIVE') {
      throw new Error('Apple Sign In requires user interaction');
    }
    
    // Handle Firebase auth errors
    if (error.code === 'auth/invalid-credential') {
      throw new Error('Invalid Apple credentials. Please try again.');
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      throw new Error('An account already exists with the same email address but different sign-in credentials.');
    } else if (error.code === 'auth/missing-or-invalid-nonce') {
      throw new Error('Authentication failed due to invalid nonce. Please try again.');
    }

    // Re-throw the error with a generic message if we don't recognize it
    throw new Error(error.message || 'Apple Sign In failed. Please try again.');
  }
};

/**
 * Check if the current user signed in with Apple
 */
export const isAppleUser = (): boolean => {
  const user = auth.currentUser;
  if (!user) return false;
  
  return user.providerData.some(
    provider => provider.providerId === 'apple.com'
  );
};