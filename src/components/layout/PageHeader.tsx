'use client'

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// We can reuse the WipeHeading component internally for a consistent feel
const WipeHeading = ({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) => {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05, delayChildren: delay } },
  };
  const wordVariants = {
    hidden: { y: '110%' },
    visible: { y: '0%', transition: { type: 'spring', damping: 15, stiffness: 150 } },
  };
  const words = text.split(" ");

  return (
    <motion.h1
      className={cn("font-bold", className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      aria-label={text}
    >
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden pb-2 -mb-2">
          <motion.span className="inline-block" variants={wordVariants}>
            {word}
          </motion.span>
          {index < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </motion.h1>
  );
};

// This is the main component we will use on our pages
interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="text-center mb-12 pt-12">
      <WipeHeading 
        text={title} 
        // The color-changing effect is applied here!
        className="text-4xl lg:text-5xl mb-2 text-gradient-animated" 
      />
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-muted-foreground text-lg max-w-3xl mx-auto"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}