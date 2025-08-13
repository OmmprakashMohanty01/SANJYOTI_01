// src/app/page.tsx
import { FuturisticHero } from '@/components/sections/FuturisticHero';
import { Features } from '@/components/sections/features';
import { ArCta } from '@/components/sections/ar-cta';
import { WaveDivider } from '@/components/effects/WaveDivider';

export default function HomePage() {
  return (
    <main>
      {/* Each major component is wrapped in a section to control its layout and prevent overlap */}
      <section className="relative min-h-screen w-full flex items-center justify-center">
        <FuturisticHero />
      </section>
      
      <section className="relative min-h-screen w-full flex items-center justify-center">
        <Features />
      </section>
      
      {/* The wave divider sits between the main sections */}
      <WaveDivider />
      
      <section className="relative w-full flex items-center justify-center py-24">
        <ArCta />
      </section>
    </main>
  );
}