// src/components/ui/AiLoader.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface AiLoaderProps {
  className?: string;
  text?: string;
}

export function AiLoader({ className, text }: AiLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping"></div>
        <div className="absolute inset-2 rounded-full border-2 border-primary/50 animate-ping" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute inset-4 rounded-full border-2 border-primary"></div>
      </div>
      {text && <p className="text-muted-foreground animate-pulse">{text}</p>}
    </div>
  );
}