'use client'

import React from 'react';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    // The `min-h-screen` ensures the background always covers the full view height.
    // `pt-24` adds padding at the top to account for the fixed navigation bar.
    // `pb-12` adds padding at the bottom for better spacing.
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 pb-12"
    >
      {/* 
        This container centers the content and provides horizontal padding.
        All page-specific content will be rendered inside this div.
      */}
      <div className="container mx-auto px-4">
        {children}
      </div>
    </motion.main>
  );
}