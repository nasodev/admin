// admin/lib/users.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  role: 'admin' | 'royal' | 'member';
  createdAt: Date | null;
  approvedAt: Date | null;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    uid,
    name: data.name,
    email: data.email,
    status: data.status,
    role: data.role,
    createdAt: data.createdAt?.toDate() || null,
    approvedAt: data.approvedAt?.toDate() || null,
  };
}

export async function getPendingUsers(): Promise<UserProfile[]> {
  const q = query(
    collection(db, 'users'),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      uid: doc.id,
      name: data.name,
      email: data.email,
      status: data.status,
      role: data.role,
      createdAt: data.createdAt?.toDate() || null,
      approvedAt: data.approvedAt?.toDate() || null,
    };
  });
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const q = query(
    collection(db, 'users'),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      uid: doc.id,
      name: data.name,
      email: data.email,
      status: data.status,
      role: data.role,
      createdAt: data.createdAt?.toDate() || null,
      approvedAt: data.approvedAt?.toDate() || null,
    };
  });
}

export async function approveUser(uid: string): Promise<void> {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    status: 'approved',
    approvedAt: serverTimestamp(),
  });
}

export async function rejectUser(uid: string): Promise<void> {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    status: 'rejected',
  });
}
