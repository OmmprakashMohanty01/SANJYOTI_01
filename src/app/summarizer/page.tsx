// src/app/summarizer/page.tsx
'use client'; // <-- Required for hooks

import { useEffect } from 'react';
import { useUserActions } from '@/store/useUserState';
import { Summarizer } from "@/components/ai/Summarizer";
import { AnimatedHeading } from '@/components/ui/AnimatedHeading'; // <-- Import component

export default function SummarizerPage() {
  const { setCurrentPageContext } = useUserActions();

  useEffect(() => {
    setCurrentPageContext("AI Summarizer");
  }, [setCurrentPageContext]);

  return (
    <main className="min-h-screen pt-24 pb-12 container mx-auto px-4">
      <div className="text-center mb-12">
        {/* --- Glow class applied --- */}
        <AnimatedHeading 
          text="AI Summarizer" 
          className="text-4xl lg:text-5xl font-bold mb-2 text-glow"
        />
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto mt-2">
          Turn any text into a concise summary and key points instantly.
        </p>
      </div>
      <Summarizer />
    </main>
  );
}
