// src/components/ui/AnimatedHeading.tsx
'use client'

import { motion } from 'framer-motion';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
}

const sentenceVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.1,
      staggerChildren: 0.04,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function AnimatedHeading({ text, className }: AnimatedHeadingProps) {
  return (
    <motion.h1
      className={className}
      variants={sentenceVariants}
      initial="hidden"
      animate="visible"
      key={text} // Add key to re-trigger animation if text changes
    >
      {text.split("").map((char, index) => (
        <motion.span key={char + "-" + index} variants={letterVariants}>
          {char}
        </motion.span>
      ))}
    </motion.h1>
  );
}