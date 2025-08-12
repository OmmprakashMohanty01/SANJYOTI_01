// src/hooks/useRipple.ts
import React from 'react';

export const useRipple = <T extends HTMLElement>() => {
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleClick = (e: MouseEvent) => {
      // Add ripple class if it doesn't exist
      element.classList.add('btn-ripple');

      const circle = document.createElement("span");
      const diameter = Math.max(element.clientWidth, element.clientHeight);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - (element.offsetLeft + radius)}px`;
      circle.style.top = `${e.clientY - (element.offsetTop + radius)}px`;
      circle.classList.add("ripple");
      
      const existingRipple = element.getElementsByClassName("ripple")[0];
      if (existingRipple) {
        existingRipple.remove();
      }
      
      element.appendChild(circle);
    };

    element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('click', handleClick);
    };
  }, []);

  return ref;
};