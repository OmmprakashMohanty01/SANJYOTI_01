// src/components/layout/PersistentCTA.tsx
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function PersistentCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const toggleVisibility = () => {
      // Show the button if scrolled more than a full screen height
      if (window.scrollY > window.innerHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Don't show the CTA on the dashboard page itself
  if (pathname === '/learn') {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-40" // z-index is lower than chat widget
        >
          <Link href="/learn" passHref>
            <Button className="persistent-cta rounded-full h-16 shadow-lg">
              <span className="mr-2">Start Your Journey</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}