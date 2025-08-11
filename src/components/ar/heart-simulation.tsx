'use client'

import { Canvas } from '@react-three/fiber'
import { ARButton, XR, Interactive, useHitTest } from '@react-three/xr'
import { useGLTF, Text, OrbitControls, Stage } from '@react-three/drei'
import { useState, useRef, Suspense } from 'react'
import { Mesh } from 'three'

function HeartModel({ ...props }) {
  // CORRECTED: Using the new, consistent path
  const { scene } = useGLTF('/models/heart/heart.gltf')
  return <primitive object={scene} {...props} />
}

function ARScene() {
  const [active, setActive] = useState(false)
  const [label, setLabel] = useState("Click and drag to explore the heart.")
  const modelRef = useRef<Mesh>(null!)

  useHitTest((hitMatrix) => {
    if (modelRef.current) {
      hitMatrix.decompose(modelRef.current.position, modelRef.current.quaternion, modelRef.current.scale)
    }
  })

  return (
    <>
      <Suspense fallback={null}>
        <Stage environment="city" intensity={0.6}>
          <Interactive
              onSelect={() => setActive(!active)}
              onHover={() => setLabel("This is the Aorta, the main artery.")}
              onBlur={() => setLabel("Click and drag to explore the heart.")}
          >
            <HeartModel 
              ref={modelRef} 
              scale={active ? 0.015 : 0.01} 
            />
          </Interactive>
        </Stage>
      </Suspense>
      
      <Text position={[0, 1, -2]} fontSize={0.2} color="white" anchorX="center">
        {label}
      </Text>
      
      <OrbitControls />
    </>
  )
}

export function HeartSimulation() {
  return (
    <div className="w-full h-screen relative">
      <ARButton 
        sessionInit={{ requiredFeatures: ["hit-test"] }}
        className="ar-button"
      />
      <Canvas>
        <XR>
          <ARScene />
        </XR>
      </Canvas>
      <style jsx global>{`
        .ar-button {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          padding: 1rem 2rem;
          background-color: #5865F2;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          z-index: 100;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}