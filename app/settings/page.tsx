'use client';

import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <AdminLayout title="설정">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" aria-hidden="true" />
            시스템 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Settings className="mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-lg font-semibold">준비 중…</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              시스템 설정 기능이 곧 추가됩니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
