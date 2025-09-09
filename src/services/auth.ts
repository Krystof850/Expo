import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (e: any) {
    throw new Error(mapAuthError(e));
  }
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (e: any) {
    throw new Error(mapAuthError(e));
  }
}

export async function sendResetEmail(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (e: any) {
    throw new Error(mapAuthError(e));
  }
}

function mapAuthError(e: any): string {
  const code = e?.code || "";
  if (code.includes("auth/invalid-credential")) return "Špatný email nebo heslo.";
  if (code.includes("auth/user-not-found")) return "Účet s tímto emailem neexistuje.";
  if (code.includes("auth/wrong-password")) return "Špatné heslo.";
  if (code.includes("auth/email-already-in-use")) return "Email je již registrován.";
  if (code.includes("auth/weak-password")) return "Heslo je příliš slabé (min. 6 znaků).";
  if (code.includes("auth/invalid-email")) return "Neplatný formát emailu.";
  return "Akce selhala. Zkus to znovu.";
}