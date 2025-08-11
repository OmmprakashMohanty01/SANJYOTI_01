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
        color="#5865F2"
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.1}
      />
    </Sphere>
  )
}

function HeroScene() {
  return (
    <>
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={100} />
      <Suspense fallback={null}>
        <AnimatedSphere />
      </Suspense>
      <Environment preset="city" />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
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
            The Future of Learning, 
            <span className="text-primary block animate-glow">Personalized.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Welcome to SanJyoti. Experience the world's first adaptive learning platform with AI mentors, emotional recognition, and immersive AR simulations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/learn">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-300"
                data-cursor-hover
              >
                Start Your Journey
              </motion.button>
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="h-96 lg:h-[500px] w-full"
        >
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
            <HeroScene />
          </Canvas>
        </motion.div>
      </div>
    </section>
  )
}