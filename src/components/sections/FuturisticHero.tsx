'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useRipple } from '@/hooks/useRipple'
import { useMemo, useState } from 'react'
import { WipeHeading } from '@/components/ui/WipeHeading'

const containerVariants = { /* ... (no changes) ... */ };
const letterVariants = { /* ... (no changes) ... */ };
const AnimatedText = ({ /* ... (no changes) ... */ });

export function FuturisticHero() {
  const heroButtonRef = useRipple<HTMLButtonElement>();
  const [isHovering, setIsHovering] = useState(false);
  const baseDelay = 0.2;

  return (
    // FIX: Removed min-h-screen. This component now naturally fills the parent <section>.
    <div className="container mx-auto px-4 text-center">
      <div className="flex flex-col items-center">
          <WipeHeading text="The Future of Learning," className="text-5xl md:text-6xl lg:text-7xl" delay={baseDelay} />
          <WipeHeading text="Personalized." className="text-5xl md:text-6xl lg:text-7xl text-gradient-animated mt-1 md:mt-3" delay={baseDelay + 0.5} />
      </div>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: baseDelay + 1 }}
        className="text-lg md:text-xl text-muted-foreground mt-6 mb-10 max-w-2xl mx-auto leading-relaxed"
      >
        Welcome to SanJyoti. Experience the world's first adaptive learning platform with AI mentors, emotional recognition, and immersive AR simulations.
      </motion.p>
      <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: baseDelay + 1.2 }}
      >
        <Link href="/learn" passHref>
          <motion.button
            ref={heroButtonRef}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group btn-primary-glow btn-ripple flex items-center mx-auto"
            data-cursor-hover
          >
            Start Your Journey
            <motion.div animate={{ x: isHovering ? 4 : 0 }} transition={{ type: "spring", stiffness: 300 }}>
                <ArrowRight className="ml-2 h-5 w-5" />
            </motion.div>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}