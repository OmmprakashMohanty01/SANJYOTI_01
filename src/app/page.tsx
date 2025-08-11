import { Hero } from '@/components/sections/hero'
import { Features } from '@/components/sections/features'
import { ArCta } from '@/components/sections/ar-cta'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <ArCta />
    </main>
  )
}