import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useUser } from 'expo-superwall';

type AuthState = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
};

const AuthCtx = createContext<AuthState>({
  user: null,
  loading: true,
  isAuthenticated: false,
  logout: async () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // OFICIÁLNÍ ZPŮSOB: useUser hook z official Superwall SDK  
  const { identify, signOut: superwallSignOut } = useUser();

  // Derived state for easier access control
  const isAuthenticated = user !== null;

  // Firebase auth state listener - OFICIÁLNÍ PATTERN podle example aplikace
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      
      // OFICIÁLNÍ ZPŮSOB: User identification podle Superwall example
      if (u?.uid) {
        try {
          await identify(u.uid);
          console.log('[AuthContext] User identified with Superwall:', u.uid);
        } catch (error) {
          console.error('[AuthContext] Failed to identify user with Superwall:', error);
        }
      }
    });
    return unsub;
  }, [identify]);

  // OFICIÁLNÍ ZPŮSOB: Logout podle example aplikace
  async function logout() {
    try {
      // SUPERWALL RESET: Vymaže user identity v Superwall
      superwallSignOut();
      console.log('[AuthContext] Superwall signOut completed');
      
      // Firebase logout - tím se vymaže i Firebase persistence
      await signOut(auth);
      console.log('[AuthContext] Firebase logout completed successfully');
    } catch (error) {
      console.error('[AuthContext] Error during logout:', error);
      // Fallback - still try to sign out even if Superwall fails
      try {
        await signOut(auth);
      } catch (fallbackError) {
        console.error('[AuthContext] Fallback logout also failed:', fallbackError);
      }
    }
  }

  const value: AuthState = {
    user,
    loading,
    isAuthenticated,
    logout,
  };

  return (
    <AuthCtx.Provider value={value}>
      {children}
    </AuthCtx.Provider>
  );
};

export function useAuth() {
  return useContext(AuthCtx);
}