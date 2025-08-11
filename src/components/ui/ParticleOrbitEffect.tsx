// src/components/ui/ParticleOrbitEffect.tsx
'use client'

import React, { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils"; // Assuming you have this utility function

export interface ParticleOrbitEffectProps {
  className?: string;
  style?: React.CSSProperties;
  particleCount?: number;
  radius?: number;
  particleSpeed?: number;
  radiusScale?: number;
  intensity?: number;
  fadeOpacity?: number;
  colorRange?: [number, number]; // HSL hue range
  disabled?: boolean;
  followMouse?: boolean;
  autoColors?: boolean;
  particleSize?: number;
}

interface Particle {
  size: number;
  position: { x: number; y: number };
  offset: { x: number; y: number };
  shift: { x: number; y: number };
  speed: number;
  targetSize: number;
  fillColor: string;
  orbit: number;
  hue: number;
  trail: Array<{ x: number; y: number; alpha: number }>;
}

const ParticleOrbitEffect: React.FC<ParticleOrbitEffectProps> = ({
  className,
  style,
  particleCount = 25,
  radius = 70,
  particleSpeed = 0.025,
  radiusScale = 1.5,
  intensity = 1,
  fadeOpacity = 0.05,
  colorRange = [180, 280], // Cool color range (blue, purple, pink)
  disabled = false,
  followMouse = true,
  autoColors = true,
  particleSize = 2
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({
    x: 0,
    y: 0,
    isDown: false,
    radiusScale: 1,
  });
  const colorTimerRef = useRef(0);

  const generateColor = useCallback((hue?: number) => {
    const h = hue ?? (colorRange[0] + Math.random() * (colorRange[1] - colorRange[0]));
    return `hsl(${h}, 70%, 60%)`;
  }, [colorRange]);

  const createParticles = useCallback((initialX: number, initialY: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const hue = colorRange[0] + Math.random() * (colorRange[1] - colorRange[0]);
      particles.push({
        size: particleSize,
        position: { x: initialX, y: initialY },
        offset: { x: 0, y: 0 },
        shift: { x: initialX, y: initialY },
        speed: particleSpeed + Math.random() * particleSpeed,
        targetSize: particleSize,
        fillColor: generateColor(hue),
        orbit: radius * 0.5 + radius * 0.5 * Math.random(),
        hue,
        trail: []
      });
    }
    return particles;
  }, [particleCount, particleSpeed, particleSize, radius, generateColor, colorRange]);
  
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouseRef.current.x = window.innerWidth / 2;
    mouseRef.current.y = window.innerHeight / 2;
    particlesRef.current = createParticles(mouseRef.current.x, mouseRef.current.y);
  }, [createParticles]);

  useEffect(() => {
    if (disabled || 'ontouchstart' in window) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!followMouse) return;
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    const handleMouseDown = () => { mouseRef.current.isDown = true; };
    const handleMouseUp = () => { mouseRef.current.isDown = false; };

    const draw = () => {
      if (!context || !canvas) return;
      
      if (autoColors) {
        colorTimerRef.current += 0.016;
        if (colorTimerRef.current >= 2) {
          colorTimerRef.current = 0;
          particlesRef.current.forEach(particle => {
            particle.hue = colorRange[0] + Math.random() * (colorRange[1] - colorRange[0]);
            particle.fillColor = generateColor(particle.hue);
          });
        }
      }

      const targetScale = mouseRef.current.isDown ? radiusScale : 1;
      mouseRef.current.radiusScale += (targetScale - mouseRef.current.radiusScale) * 0.02;

      context.clearRect(0, 0, canvas.width, canvas.height);

      for (const particle of particlesRef.current) {
        particle.offset.x += particle.speed * intensity;
        particle.offset.y += particle.speed * intensity;
        particle.shift.x += (mouseRef.current.x - particle.shift.x) * particle.speed * intensity;
        particle.shift.y += (mouseRef.current.y - particle.shift.y) * particle.speed * intensity;
        
        const orbitRadius = particle.orbit * mouseRef.current.radiusScale * intensity;
        particle.position.x = particle.shift.x + Math.cos(particle.offset.x) * orbitRadius;
        particle.position.y = particle.shift.y + Math.sin(particle.offset.y) * orbitRadius;

        particle.position.x = Math.max(0, Math.min(particle.position.x, canvas.width));
        particle.position.y = Math.max(0, Math.min(particle.position.y, canvas.height));

        particle.trail.push({ x: particle.position.x, y: particle.position.y, alpha: 1 });
        const maxTrailLength = Math.max(5, Math.floor(40 * intensity));
        if (particle.trail.length > maxTrailLength) {
          particle.trail.shift();
        }

        particle.trail.forEach((p, i) => { p.alpha = (i + 1) / particle.trail.length * fadeOpacity * 20; });

        if (particle.trail.length > 1) {
          for (let j = 1; j < particle.trail.length; j++) {
            const prev = particle.trail[j - 1];
            const curr = particle.trail[j];
            context.beginPath();
            context.strokeStyle = particle.fillColor;
            context.lineWidth = particle.size * 0.3 * curr.alpha;
            context.globalAlpha = curr.alpha;
            context.moveTo(prev.x, prev.y);
            context.lineTo(curr.x, curr.y);
            context.stroke();
          }
        }

        particle.size += (particle.targetSize - particle.size) * 0.05;
        if (Math.abs(particle.size - particle.targetSize) < 0.1) {
          particle.targetSize = particleSize + Math.random() * particleSize * 2;
        }

        context.beginPath();
        context.fillStyle = particle.fillColor;
        context.globalAlpha = 0.9;
        context.arc(particle.position.x, particle.position.y, particle.size * 0.5, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    updateCanvasDimensions();
    window.addEventListener("resize", updateCanvasDimensions);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", updateCanvasDimensions);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    disabled, followMouse, particleCount, radius, particleSpeed, radiusScale, 
    intensity, fadeOpacity, colorRange, autoColors, particleSize, 
    updateCanvasDimensions, createParticles, generateColor
  ]);

  if (disabled) return null;

  return (
    <div className={cn("fixed top-0 left-0 z-50 pointer-events-none w-full h-full", className)}>
      <canvas ref={canvasRef} className="w-screen h-screen block" style={style} aria-hidden="true" />
    </div>
  );
};

export default ParticleOrbitEffect;