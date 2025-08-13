// src/components/effects/WaveDivider.tsx
'use client';

import React from 'react';

interface WaveDividerProps {
  color?: string; // Allows customizing the wave color
  flip?: boolean; // If true, flips the wave vertically
}

export const WaveDivider: React.FC<WaveDividerProps> = ({
  color = '#ffffff',
  flip = false
}) => {
  return (
    <div
      className={`wave-divider ${flip ? 'rotate-180' : ''}`}
      style={{ lineHeight: 0 }}
    >
      <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '80px' }}
      >
        <path
          d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19
             c-82.26-17.34-168.06-16.33-250.45.39
             -57.84,11.73-114,31.07-172,41.86
             A600.21,600.21,0,0,1,0,27.35V120H1200V95.8
             C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
          fill={color}
        />
      </svg>
    </div>
  );
};
