'use client';

import { useEffect } from 'react';
import { useUserActions } from '@/store/useUserState';
import { Collaboration } from '@/components/collaboration/Collaboration';
import { PageHeader } from '@/components/layout/PageHeader';
import { MainLayout } from '@/components/layout/MainLayout';

export default function CollaboratePage() {
  const { setCurrentPageContext } = useUserActions();

  useEffect(() => {
    setCurrentPageContext("Real-Time Collaboration");
  }, [setCurrentPageContext]);

  return (
    <MainLayout>
      {/* --- RESTORED: The dynamic, animated header --- */}
      <PageHeader
        title="Real-Time Collaboration"
        subtitle="Join a shared 3D space and learn with others. See their cursors move in real-time."
      />
      <Collaboration />
    </MainLayout>
  );
}