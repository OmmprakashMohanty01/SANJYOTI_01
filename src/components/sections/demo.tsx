'use client'

import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Environment, Text } from '@react-three/drei'
import { ARButton, XR } from '@react-three/xr'
import { Suspense, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { useRenderBudget } from '@/hooks/useRenderBudget'

function FloatingGeometry({ position, color }: { position: [number, number, number], color: string }) {
  const meshRef = useRef<Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime + position[0]) * 0.3
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime + position[1]) * 0.3
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5
    }
  })

  return (
    <Box ref={meshRef} position={position} args={[1, 1, 1]}>
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </Box>
  )
}

function DemoScene() {
  const { shouldRender, adaptiveQuality, currentFPS } = useRenderBudget({ targetFPS: 60 })
  
  if (!shouldRender) return null

  return (
    <>
      <ambientLight intensity={adaptiveQuality === 'high' ? 0.4 : 0.2} />
      <pointLight position={[10, 10, 10]} intensity={adaptiveQuality === 'high' ? 1 : 0.5} />
      {adaptiveQuality !== 'low' && <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff6b6b" />}
      
      <FloatingGeometry position={[-2, 0, 0]} color="#3B82F6" />
      <FloatingGeometry position={[2, 0, 0]} color="#10B981" />
      <FloatingGeometry position={[0, 2, 0]} color="#F59E0B" />
      
      <Sphere position={[0, -2, 0]} args={[0.5, 32, 32]}>
        <meshPhysicalMaterial
          color="#8B5CF6"
          metalness={0.9}
          roughness={0.1}
          transmission={adaptiveQuality === 'high' ? 0.9 : 0}
          thickness={0.5}
        />
      </Sphere>
      
      <Environment preset={adaptiveQuality === 'high' ? "night" : "dawn"} />
      <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={1} />

      <Text position={[-3.5, -3, 0]} fontSize={0.2} color="white">
        {`FPS: ${Math.round(currentFPS)} | Quality: ${adaptiveQuality}`}
      </Text>
    </>
  )
}

export function Demo() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            See It In
            <span className="text-primary block">Action</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our engine adapts to your device for optimal performance. Try the AR mode on a supported device!
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="h-96 lg:h-[500px] rounded-xl overflow-hidden glass mb-8 relative"
        >
          <div className="absolute left-1/2 -translate-x-1/2 z-10 bottom-8">
              <ARButton />
          </div>
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <XR>
                <Suspense fallback={null}>
                  <DemoScene />
                </Suspense>
            </XR>
          </Canvas>
        </motion.div>
      </div>
    </section>
  )
}