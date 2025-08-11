// src/app/layout.tsx
import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Navigation } from '@/components/layout/navigation'
import { ClarityEngineWidget } from '@/components/ai/ClarityEngineWidget' // <-- Import the new widget
import ParticleOrbitEffect from '@/components/ui/ParticleOrbitEffect'

const inter = Inter({ subsets: ['latin'] })

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
  themeColor: '#5865F2',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background`}>
        <Providers>
          <ParticleOrbitEffect />
          <Navigation />
          {children}
          <ClarityEngineWidget /> {/* <-- Add the widget here */}
        </Providers>
      </body>
    </html>
  )
}