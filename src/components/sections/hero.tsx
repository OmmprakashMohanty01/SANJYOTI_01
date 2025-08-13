'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useRipple } from '@/hooks/useRipple'
import { useMemo, useState } from 'react'

// --- Animation Variants (defined outside the component for performance) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: i * 0.2 },
  }),
};

const letterVariants = {
  hidden: { y: 20, opacity: 0, filter: "blur(4px)" },
  visible: { y: 0, opacity: 1, filter: "blur(0px)", transition: { type: "spring", damping: 12, stiffness: 100 } },
};

// --- Reusable Animated Text Component (with performance and accessibility improvements) ---
const AnimatedText = ({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) => {
  // Code Improvement: Memoize the letters array to prevent re-creation on every render
  const letters = useMemo(() => Array.from(text), [text]);
  
  return (
    <motion.div
      className={className}
      style={{ display: "flex", overflow: "hidden" }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
      aria-label={text} // Good for screen readers on the container
    >
      {letters.map((letter, index) => (
        // Accessibility Improvement: Add aria-hidden to prevent screen readers from reading letter by letter
        <motion.span aria-hidden="true" variants={letterVariants} key={index}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

// --- Main Hero Component ---
export function Hero() {
  const heroButtonRef = useRipple<HTMLButtonElement>();
  const [isHovering, setIsHovering] = useState(false);
  
  // UX Improvement: Centralized animation timing
  const baseDelay = 0.5;

  return (
    <section className="min-h-screen flex items-center justify-center relative pt-24 pb-12">
      <div className="container mx-auto px-4 text-center">
        
        <div className="flex flex-col items-center">
          {/* Visual Improvement: Staggered entrance for more impact */}
          <AnimatedText text="The Future of Learning," className="text-5xl lg:text-7xl font-bold leading-tight" delay={baseDelay} />
          {/* Visual Improvement: Added a subtle text glow for better pop */}
          <AnimatedText text="Personalized." className="text-5xl lg:text-7xl font-bold leading-tight text-gradient-animated mt-2 text-glow" delay={baseDelay + 0.5} />
        </div>

        {/* Visual Improvement: Enhanced paragraph entrance animation */}
        <motion.p 
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: baseDelay + 1 }}
          className="text-xl text-muted-foreground mt-8 mb-10 max-w-3xl mx-auto leading-relaxed"
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
              className="group btn-glow-icon px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-300 btn-ripple flex items-center mx-auto"
              data-cursor-hover
            >
              Start Your Journey
              {/* Visual Improvement: Smoother icon micro-interaction */}
              <motion.div 
                animate={{ x: isHovering ? 4 : 0 }} 
                transition={{ type: "spring", stiffness: 300 }}
              >
                  <ArrowRight className="ml-2 h-5 w-5" />
              </motion.div>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}