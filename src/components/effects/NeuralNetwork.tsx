'use client'

import React, { useRef, useEffect } from 'react';

const NeuralNetwork: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let animationFrameId: number;

        const particles: Particle[] = [];
        // UPDATE: Increased particle density for a richer effect
        const particleCount = Math.floor(width * height / 15000); 
        const maxDistance = 130;

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 1.5 + 0.5;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(139, 92, 246, 0.8)';
                ctx.fill();
            }
        }

        function init() {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(Math.random() * width, Math.random() * height));
            }
        }

        function connect() {
            if (!ctx) return;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = 1 - distance / maxDistance;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        // UPDATE: Slightly more visible lines
                        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.6})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);
            for (const particle of particles) {
                particle.update();
                particle.draw();
            }
            connect();
            animationFrameId = requestAnimationFrame(animate);
        }
        
        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles.length = 0;
            init();
        };

        init();
        animate();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            // UPDATE: Increased opacity for better visibility
            className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-60"
        />
    );
};

export default NeuralNetwork;