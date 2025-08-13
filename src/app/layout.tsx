import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Navigation } from '@/components/layout/navigation'
import { ClarityEngineWidget } from '@/components/ai/ClarityEngineWidget'
import ParticleOrbitEffect from '@/components/ui/ParticleOrbitEffect'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { ThreeDBackground } from '@/components/effects/ThreeDBackground'
import { PersistentCTA } from '@/components/layout/PersistentCTA'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '600', '700']
});

export const metadata: Metadata = {
  title: 'SanJyoti - The Future of Learning',
  description: 'Next-generation adaptive learning with AI mentors and immersive 3D/AR simulations.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SanJyoti Learning',
  },
}

export const viewport: Viewport = {
  themeColor: '#0F172A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <Providers>
          <ThemeProvider />
          <ParticleOrbitEffect />
          {/* The single, global 3D background is rendered here for all pages */}
          <ThreeDBackground /> 
          <Navigation />
          {/* All page content (children) will render on top of the background */}
          {children}
          <PersistentCTA />
          <ClarityEngineWidget />
        </Providers>
      </body>
    </html>
  )
}