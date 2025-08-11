'use client'

import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import Link from 'next/link'

function AnimatedSphere() {
  return (
    <Sphere args={[1, 64, 64]} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color="#3B82F6"
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.1}
        metalness={0.8}
      />
    </Sphere>
  )
}

function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <AnimatedSphere />
      <Environment preset="night" />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
    </>
  )
}

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative pt-16">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
            Learn in
            <span className="text-primary block animate-glow">3D Space</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Experience the future of education with adaptive 3D lessons, AI tutoring, 
            and real-time collaboration that transforms how you learn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/learn">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-300"
                data-cursor-hover
                data-cursor-accent="#3B82F6"
              >
                Start Learning
              </motion.button>
            </Link>
            <Link href="/editor">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 glass border-2 border-white/20 rounded-lg font-semibold hover:border-primary/50 transition-all duration-300"
                data-cursor-hover
              >
                Create Lessons
              </motion.button>
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="h-96 w-full rounded-xl overflow-hidden glass"
        >
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          </Canvas>
        </motion.div>
      </div>
    </section>
  )
}