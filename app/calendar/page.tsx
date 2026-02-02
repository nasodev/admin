'use client';

import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default function CalendarPage() {
  return (
    <AdminLayout title="캘린더 관리">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" aria-hidden="true" />
            캘린더 관리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-lg font-semibold">준비 중…</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              캘린더 관리 기능이 곧 추가됩니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
