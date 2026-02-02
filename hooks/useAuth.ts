// admin/hooks/useAuth.ts
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { login as authLogin, logout as authLogout } from '@/lib/auth';
import { getUserProfile, UserProfile } from '@/lib/users';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setState({ user, profile, loading: false, error: null });
      } else {
        setState({ user: null, profile: null, loading: false, error: null });
      }
    });
    return unsubscribe;
  }, []);

  const login = async (name: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await authLogin(name, password);
    } catch {
      setState(prev => ({
        ...prev,
        loading: false,
        error: '이름 또는 비밀번호가 틀렸습니다'
      }));
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    await authLogout();
  };

  const isAdmin = state.profile?.role === 'admin';

  return {
    user: state.user,
    profile: state.profile,
    loading: state.loading,
    error: state.error,
    isAdmin,
    login,
    logout,
  };
}
