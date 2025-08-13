'use client'

import { Canvas, useFrame, extend } from '@react-three/fiber'
import { shaderMaterial, useScroll, ScrollControls, Sphere, Trail } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useMemo, useRef } from 'react'
import { Group, Color, Mesh } from 'three'
import * as THREE from 'three'

// --- Custom Gradient Shader for the Ring ---
const RingShaderMaterial = shaderMaterial(
  { uTime: 0, uColorA: new Color('#480ca8'), uColorB: new Color('#4cc9f0') },
  `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  `uniform float uTime; uniform vec3 uColorA; uniform vec3 uColorB; varying vec2 vUv;
   void main() {
     float mixValue = sin((vUv.x + uTime * 0.1) * 10.0) * 0.5 + 0.5;
     vec3 finalColor = mix(uColorA, uColorB, mixValue);
     float edgeGlow = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
     gl_FragColor = vec4(finalColor, edgeGlow * 0.5); 
   }`
);
extend({ RingShaderMaterial });

const EnergyRing = () => {
    const materialRef = useRef<any>(null!);
    const meshGroupRef = useRef<THREE.Group>(null!);
    const particle1Ref = useRef<THREE.Mesh>(null!);
    const particle2Ref = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const elapsedTime = state.clock.getElapsedTime();
        if (materialRef.current) materialRef.current.uTime = elapsedTime;
        if (meshGroupRef.current) meshGroupRef.current.rotation.z = elapsedTime * 0.1;
        if (particle1Ref.current) {
            particle1Ref.current.position.x = 1.6 * Math.cos(elapsedTime * 0.6);
            particle1Ref.current.position.z = 1.6 * Math.sin(elapsedTime * 0.6);
        }
        if (particle2Ref.current) {
            particle2Ref.current.position.x = 1.7 * Math.cos(-elapsedTime * 0.4);
            particle2Ref.current.position.z = 1.7 * Math.sin(-elapsedTime * 0.4);
        }
    });

    return (
        <group ref={meshGroupRef} rotation-x={0.2}>
            <mesh rotation-x={Math.PI * 0.5}>
                <torusGeometry args={[1.5, 0.03, 16, 100]} />
                {/* @ts-ignore */}
                <ringShaderMaterial ref={materialRef} transparent blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh rotation-x={Math.PI * 0.5}>
                <torusGeometry args={[1.5, 0.06, 16, 100]} />
                <meshStandardMaterial color="#480ca8" emissive="#480ca8" emissiveIntensity={0.25} transparent opacity={0.1} />
            </mesh>
            <Trail width={1} color={"#4cc9f0"} length={8} decay={0.9}>
                <Sphere ref={particle1Ref} args={[0.04]}><meshStandardMaterial color="#4cc9f0" emissive="#4cc9f0" emissiveIntensity={2} /></Sphere>
            </Trail>
            <Trail width={1.2} color={"#f72585"} length={4} decay={0.95}>
                <Sphere ref={particle2Ref} args={[0.05]}><meshStandardMaterial color="#f72585" emissive="#f72585" emissiveIntensity={1.5} /></Sphere>
            </Trail>
        </group>
    );
};

const DataParticles = ({ count = 5000 }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const theta = Math.acos(THREE.MathUtils.randFloatSpread(2));
        const phi = THREE.MathUtils.randFloat(0, Math.PI * 2);
        const r = 8;
        pos.set([ r * Math.sin(theta) * Math.cos(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(theta) ], i * 3);
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.01} color="#480ca8" transparent opacity={0.6} />
    </points>
  );
};

const SceneContent = () => {
    const scroll = useScroll();
    const sceneGroupRef = useRef<Group>(null!);

    useFrame(() => {
        if(sceneGroupRef.current){
            sceneGroupRef.current.position.y = -scroll.offset * 12;
        }
    });

    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={10} />
            <group ref={sceneGroupRef}>
                <EnergyRing />
                <DataParticles />
            </group>
            <EffectComposer>
                <Bloom luminanceThreshold={0.5} intensity={0.5} levels={9} mipmapBlur />
            </EffectComposer>
        </>
    )
}

export function ThreeDBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-50">
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <Suspense fallback={null}>
          <ScrollControls pages={3} damping={0.1}>
              <SceneContent />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}