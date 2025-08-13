// src/components/sections/ar-cta.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Stage, OrbitControls } from '@react-three/drei'
import { Suspense, useRef, useEffect } from 'react' // <-- Import useRef and useEffect
import { gsap } from 'gsap' // <-- Import GSAP
import { ScrollTrigger } from 'gsap/ScrollTrigger' // <-- Import ScrollTrigger
import { Group } from 'three'

gsap.registerPlugin(ScrollTrigger); // Register the plugin

function Model(props: any) {
  const { scene } = useGLTF('/models/heart/heart.gltf')
  return <primitive object={scene} {...props} />
}

export function ArCta() {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<Group>(null);

  // This effect sets up the scroll-based animation
  useEffect(() => {
    if (containerRef.current && modelRef.current) {
      // Create a GSAP timeline that is controlled by the scroll position
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom", // Animation starts when the top of the container hits the bottom of the viewport
          end: "bottom top", // Animation ends when the bottom of the container hits the top of the viewport
          scrub: 1, // Smoothly scrubs the animation based on scroll (1 second lag)
        }
      });

      // Add animations to the timeline
      tl.to(modelRef.current.rotation, {
        y: Math.PI * 2, // Rotate the heart 360 degrees on the Y axis
        duration: 1,
        ease: "none",
      });
       tl.to(modelRef.current.rotation, {
        x: -Math.PI * 0.25, // Tilt it slightly on the X axis
        duration: 1,
        ease: "none",
      }, "<"); // The "<" starts this animation at the same time as the previous one
    }
    // Cleanup function to kill the ScrollTrigger instance when the component unmounts
    return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="py-24 bg-background">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="h-96 lg:h-[500px] rounded-xl overflow-hidden glass"
        >
          <Canvas camera={{ fov: 45 }}>
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.6}>
                <group ref={modelRef}> {/* Wrap model in a group to apply ref */}
                    <Model scale={0.01} />
                </group>
              </Stage>
            </Suspense>
            {/* We disable OrbitControls so GSAP has full control during scroll */}
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          </Canvas>
        </motion.div>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-glow">
            Immersive AR Simulations
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Don't just read about it—experience it. SanJyoti projects complex subjects like human biology into your world, allowing you to interact, explore, and learn in a way that's never been possible before.
          </p>
          <Link href="/ar-simulation">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-300"
              data-cursor-hover
            >
              Try the Heart Simulation
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}