'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useRipple } from '@/hooks/useRipple'

// This component will handle the staggered text animation
const AnimatedText = ({ text, className }: { text: string, className?: string }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.2 },
    },
  };

  const child = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

export function Hero() {
  const heroButtonRef = useRipple<HTMLButtonElement>();

  return (
    <section className="min-h-screen flex items-center justify-center relative pt-24 pb-12">
      <div className="container mx-auto px-4 text-center">
        
        {/* FIX: The entire headline is now a flex column for proper stacking */}
        <div className="flex flex-col items-center">
          <AnimatedText text="The Future of Learning," className="text-5xl lg:text-7xl font-bold leading-tight" />
          
          {/* FIX: "Personalized" now has the animated gradient and no box */}
          <AnimatedText text="Personalized." className="text-5xl lg:text-7xl font-bold leading-tight text-gradient-animated mt-2" />
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-xl text-muted-foreground mt-8 mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          Welcome to SanJyoti. Experience the world's first adaptive learning platform with AI mentors, emotional recognition, and immersive AR simulations.
        </motion.p>
        
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
        >
          <Link href="/learn" passHref>
            <motion.button
              ref={heroButtonRef}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group btn-glow-icon px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-300 btn-ripple flex items-center mx-auto"
              data-cursor-hover
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 btn-icon" /> {/* NEW: Added icon */}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}