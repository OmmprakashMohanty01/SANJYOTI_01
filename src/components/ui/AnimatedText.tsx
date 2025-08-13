'use client'

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// --- Type Definitions for our component props ---
type TextSegment = {
  text: string;
  variant?: 'rainbow' | 'default';
};

type AnimatedTextProps = {
  text: string | TextSegment[];
  variant?: 'gradient' | 'glow' | 'default';
  speed?: number;
  className?: string;
  // --- THIS IS THE FIX ---
  // We use React.ElementType, which is the correct and robust way
  // to define a prop that can be a component or an HTML tag like 'h1'.
  el?: React.ElementType;
};

// --- Animation Variants (defined outside for performance) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: i * 0.2 },
  }),
};

const letterVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100,
    },
  },
};

// --- The Main Reusable Component ---
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  variant = 'default',
  speed = 4,
  className,
  el: Component = 'div', // The prop is now correctly typed and renamed to 'Component'
}) => {

  const textSegments = useMemo(() => {
    if (typeof text === 'string') {
      return [{ text, variant: 'default' }];
    }
    return text;
  }, [text]);

  const mainClassName = cn(
    'font-bold', // Default styling
    {
      'text-gradient-animated': variant === 'gradient',
    },
    className
  );

  const animationStyle = {
    animationDuration: `${speed}s`,
  };

  // We now render the `Component` variable directly.
  return (
    <Component className={mainClassName} style={variant === 'gradient' ? animationStyle : {}}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label={typeof text === 'string' ? text : text.map(t => t.text).join('')}
      >
        {textSegments.map((segment, segIndex) => (
          <span key={segIndex} className="inline-block">
            {segment.text.split('').map((char, charIndex) => (
              <motion.span
                key={char + '-' + charIndex}
                className="inline-block"
                variants={letterVariants}
                aria-hidden="true"
              >
                {segment.variant === 'rainbow' ? (
                  <span className="text-rainbow-pulse" style={animationStyle}>{char === " " ? "\u00A0" : char}</span>
                ) : variant === 'glow' ? (
                  <motion.span
                    whileHover={{ 
                        scale: 1.1, 
                        textShadow: '0 0 10px #00CFFF, 0 0 20px #FF00AA',
                        transition: { duration: 0.3 }
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ) : (
                  char === " " ? "\u00A0" : char
                )}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.span>
    </Component>
  );
};