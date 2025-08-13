'use client';

import { useEffect } from 'react';
import { useUserActions } from '@/store/useUserState';
import { QuizGenerator } from "@/components/ai/QuizGenerator";
import { PageHeader } from '@/components/layout/PageHeader';
import { MainLayout } from '@/components/layout/MainLayout';

export default function QuizPage() {
  const { setCurrentPageContext } = useUserActions();

  useEffect(() => {
    setCurrentPageContext("QuizForge AI");
  }, [setCurrentPageContext]);

  return (
    <MainLayout>
      {/* --- RESTORED: The dynamic, animated header --- */}
      <PageHeader 
        title="Personalized Quiz Generator"
        subtitle="Transform your notes into an interactive quiz to test your knowledge and find your weak spots."
      />
       <div className="flex justify-center">
        <QuizGenerator />
      </div>
    </MainLayout>
  );
}