'use client'

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ThemeProvider() {
  const pathname = usePathname();

  useEffect(() => {
    // This function runs every time the page changes.
    // First, it removes any old theme classes from the body.
    document.body.classList.remove('theme-dashboard', 'theme-ai-feature', 'theme-ar');

    // Then, it adds the correct theme class based on the current URL path.
    if (pathname === '/learn') {
      document.body.classList.add('theme-dashboard');
    } else if (pathname.startsWith('/ar')) {
      document.body.classList.add('theme-ar');
    } else if (['/summarizer', '/quiz', '/chat', '/collaborate'].includes(pathname)) {
      document.body.classList.add('theme-ai-feature');
    }
    // If none of these match (like the homepage), the default theme from globals.css is used.
    
  }, [pathname]); // This effect re-runs whenever the pathname changes.

  // This component doesn't render any visible HTML. Its only job is to manage the body class.
  return null;
}