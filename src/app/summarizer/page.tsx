'use client';

import { useEffect } from 'react';
import { useUserActions } from '@/store/useUserState';
import { Summarizer } from "@/components/ai/Summarizer";
import { PageHeader } from '@/components/layout/PageHeader'; // This component provides the heading
import { MainLayout } from '@/components/layout/MainLayout';

export default function SummarizerPage() {
  const { setCurrentPageContext } = useUserActions();

  useEffect(() => {
    setCurrentPageContext("AI Summarizer");
  }, [setCurrentPageContext]);

  return (
    <MainLayout>
      {/* --- RESTORED: The dynamic, animated header --- */}
      <PageHeader 
        title="AI Summarizer"
        subtitle="Turn any text into a concise summary and key points instantly. Powered by SanJyoti AI."
      />
      <div className="flex justify-center">
        <Summarizer />
      </div>
    </MainLayout>
  );
}