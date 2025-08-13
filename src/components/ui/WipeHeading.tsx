'use client'

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WipeHeadingProps {
  text: string;
  className?: string;
  delay?: number;
}

export function WipeHeading({ text, className, delay = 0 }: WipeHeadingProps) {
  // This is a container for the words. It helps stagger the animation of each word.
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  // This defines the animation for each individual word: sliding up from below.
  const wordVariants = {
    hidden: { y: '110%' }, // Start completely hidden below the parent
    visible: {
      y: '0%', // Animate to its final position
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 150,
      },
    },
  };

  // We split the input string into an array of words to animate them one by one.
  const words = text.split(" ");

  return (
    <motion.h1
      className={cn("font-bold", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {words.map((word, index) => (
        // Each word is wrapped in a span that acts as a "mask" with overflow-hidden.
        <span key={index} className="inline-block overflow-hidden pb-2 -mb-2">
          {/* This inner span is the part that actually moves up from below. */}
          <motion.span className="inline-block" variants={wordVariants}>
            {word}
          </motion.span>
          {/* We add a non-breaking space back between the words. */}
          {index < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </motion.h1>
  );
}