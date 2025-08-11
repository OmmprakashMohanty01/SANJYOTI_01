'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Stage, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

function Model(props: any) {
  // IMPORTANT: You need to find a 3D model of a heart and place it here
  const { scene } = useGLTF('/models/heart/heart.gltf')
  return <primitive object={scene} {...props} />
}

export function ArCta() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="h-96 rounded-xl overflow-hidden glass"
        >
          <Canvas camera={{ fov: 45 }}>
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.6}>
                <Model scale={0.01} />
              </Stage>
            </Suspense>
            <OrbitControls autoRotate />
          </Canvas>
        </motion.div>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Immersive AR Skill Simulations
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