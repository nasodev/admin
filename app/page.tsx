'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  UserProfile,
  getPendingUsers,
  getAllUsers,
} from '@/lib/users';
import { Users, UserCheck, UserX, Clock, ArrowRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  href?: string;
}

function StatCard({ title, value, description, icon: Icon, href }: StatCardProps) {
  const content = (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
      {href && (
        <div className="absolute bottom-2 right-2">
          <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>
      )}
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block rounded-lg transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        {content}
      </Link>
    );
  }

  return content;
}

export default function DashboardPage() {
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [pending, all] = await Promise.all([
        getPendingUsers(),
        getAllUsers(),
      ]);
      setPendingUsers(pending);
      setAllUsers(all);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const approvedCount = allUsers.filter((u) => u.status === 'approved').length;
  const rejectedCount = allUsers.filter((u) => u.status === 'rejected').length;

  return (
    <AdminLayout
      title="대시보드"
      onRefresh={loadData}
      isRefreshing={isRefreshing}
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="전체 사용자"
            value={allUsers.length}
            description="등록된 전체 사용자 수"
            icon={Users}
            href="/users"
          />
          <StatCard
            title="승인 대기"
            value={pendingUsers.length}
            description="승인이 필요한 가입 요청"
            icon={Clock}
            href="/users"
          />
          <StatCard
            title="승인됨"
            value={approvedCount}
            description="승인된 사용자 수"
            icon={UserCheck}
          />
          <StatCard
            title="거절됨"
            value={rejectedCount}
            description="거절된 가입 요청 수"
            icon={UserX}
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>빠른 작업</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Link href="/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" aria-hidden="true" />
                  사용자 관리
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start" disabled>
                캘린더 관리 (준비 중…)
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                텔레그램 설정 (준비 중…)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Pending Users */}
        {pendingUsers.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>최근 가입 요청</CardTitle>
              <Link href="/users">
                <Button variant="ghost" size="sm">
                  전체 보기
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pendingUsers.slice(0, 5).map((user) => (
                  <div
                    key={user.uid}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.createdAt
                          ? new Intl.DateTimeFormat('ko-KR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }).format(user.createdAt)
                          : '-'}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      대기중
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
