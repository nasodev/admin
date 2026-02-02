'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { getPendingUsers } from '@/lib/users';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AdminLayout({
  children,
  title,
  onRefresh,
  isRefreshing = false,
}: AdminLayoutProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      getPendingUsers().then((users) => setPendingCount(users.length));
    }
  }, [user, isAdmin, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">로딩 중…</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-destructive">관리자 권한이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar pendingCount={pendingCount} />
      <div className="pl-64 transition-[padding] duration-200">
        <Header
          title={title}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
