'use client'

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ThemeProvider() {
  const pathname = usePathname();

  useEffect(() => {
    // Clear all theme classes first
    document.body.classList.remove('theme-dashboard', 'theme-ai-feature', 'theme-ar');

    // Apply the correct theme based on the current route
    if (pathname === '/learn') {
      document.body.classList.add('theme-dashboard');
    } else if (pathname.startsWith('/ar')) {
      document.body.classList.add('theme-ar');
    } else if (['/summarizer', '/quiz', '/chat'].includes(pathname)) {
      document.body.classList.add('theme-ai-feature');
    }
    // The default theme (for homepage) is applied if no other theme matches
    
  }, [pathname]);

  // This component doesn't render anything, it just applies a side effect.
  return null;
}