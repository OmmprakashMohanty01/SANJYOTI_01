'use client';

import { useEffect } from 'react';
import { useUserActions } from '@/store/useUserState';
import { LinguaMentor } from "@/components/ai/LinguaMentor";
import { PageHeader } from '@/components/layout/PageHeader';
import { MainLayout } from '@/components/layout/MainLayout';

export default function ChatPage() {
  const { setCurrentPageContext } = useUserActions();

  useEffect(() => {
    setCurrentPageContext("Clarity Engine");
  }, [setCurrentPageContext]);

  return (
    // We use the MainLayout to provide the consistent page structure and background
    <MainLayout>
      {/* 
        This div centers the content vertically and horizontally within the layout.
        It ensures both the header and the chat component are visible and properly aligned.
      */}
      <div className="flex flex-col items-center w-full">
        <PageHeader 
          title="AI Language Buddy"
          subtitle="Chat with LinguaMentor to practice your English. It will correct your mistakes in real-time."
        />
        <div className="w-full mt-4">
            <LinguaMentor />
        </div>
      </div>
    </MainLayout>
  );
}