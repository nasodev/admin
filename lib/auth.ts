// admin/lib/auth.ts
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';

function nameToEmail(name: string): string {
  return `${name}@kidchat.local`;
}

export async function login(name: string, password: string): Promise<void> {
  const email = nameToEmail(name);
  await signInWithEmailAndPassword(auth, email, password);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}
