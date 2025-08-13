'use client';

import { useEffect } from 'react';
import { useUserActions } from '@/store/useUserState';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/MainLayout';

export default function EffectsPage() {
  const { setCurrentPageContext } = useUserActions();

  useEffect(() => {
    setCurrentPageContext("Effects Showcase");
  }, [setCurrentPageContext]);

  const rainbowText = [
    { text: 'Learn with ', variant: 'default' as const },
    { text: 'AI', variant: 'rainbow' as const },
    { text: ' like never before', variant: 'default' as const },
  ];

  return (
    <MainLayout>
      {/* --- RESTORED: The dynamic, animated header --- */}
      <PageHeader 
        title="Animated Text Effects"
        subtitle="A showcase of dynamic, code-only typography for a futuristic feel."
      />
      
      <div className="space-y-12 mt-12">
        <Card className="glass p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-muted-foreground">Gradient Animation</h2>
            <AnimatedText 
                text="SanJyoti Learning Platform"
                variant="gradient"
                speed={5}
                el="h1"
                className="text-4xl md:text-5xl"
            />
        </Card>

        <Card className="glass p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-muted-foreground">Rainbow Pulse on Keywords</h2>
             <AnimatedText 
                text={rainbowText}
                el="h2"
                className="text-3xl md:text-4xl"
            />
        </Card>
        
        <Card className="glass p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-muted-foreground">Hover Glow & Scale Effect</h2>
             <AnimatedText 
                text="Hover over these words."
                variant="glow"
                el="h2"
                className="text-3xl md:text-4xl cursor-pointer"
            />
        </Card>
      </div>
    </MainLayout>
  );
}