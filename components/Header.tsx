'use client';

import { Button } from '@/components/ui/button';
import { PasswordChangeDialog } from '@/components/PasswordChangeDialog';
import { LogOut, RefreshCw, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function Header({ title, onRefresh, isRefreshing = false }: HeaderProps) {
  const { logout, profile } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">
      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="새로고침"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
              aria-hidden="true"
              style={isRefreshing ? {} : undefined}
            />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          aria-label="알림"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
        </Button>

        <PasswordChangeDialog />

        <div className="ml-2 flex items-center gap-3 border-l pl-4">
          {profile && (
            <span className="text-sm text-muted-foreground">
              {profile.name}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
            로그아웃
          </Button>
        </div>
      </div>
    </header>
  );
}
