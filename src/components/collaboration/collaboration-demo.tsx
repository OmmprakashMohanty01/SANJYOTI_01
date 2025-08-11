'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Text, Line } from '@react-three/drei'
import { Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, MousePointer2, MessageCircle, Video, Mic, MicOff } from 'lucide-react'
import { Vector3 } from 'three'

interface Collaborator {
  id: string
  name: string
  color: string
  cursor: { x: number, y: number, z: number }
  isActive: boolean
}

interface Annotation {
  id: string
  position: [number, number, number]
  text: string
  author: string
  color: string
}

// Simulated collaborators for demo
const mockCollaborators: Collaborator[] = [
  { id: '1', name: 'Alice Chen', color: '#3B82F6', cursor: { x: -1, y: 1, z: 0 }, isActive: true },
  { id: '2', name: 'Bob Smith', color: '#10B981', cursor: { x: 1, y: -1, z: 0 }, isActive: true },
  { id: '3', name: 'Carol Davis', color: '#F59E0B', cursor: { x: 0, y: 0, z: 2 }, isActive: false },
]

function CollaborativeCursor({ collaborator, isAnimating }: { collaborator: Collaborator, isAnimating: boolean }) {
  const meshRef = useRef<any>(null)
  
  useFrame((state) => {
    if (meshRef.current && isAnimating) {
      // Simulate cursor movement
      const time = state.clock.elapsedTime
      meshRef.current.position.x = collaborator.cursor.x + Math.sin(time + parseInt(collaborator.id)) * 0.5
      meshRef.current.position.y = collaborator.cursor.y + Math.cos(time + parseInt(collaborator.id)) * 0.3
      meshRef.current.position.z = collaborator.cursor.z + Math.sin(time * 0.5) * 0.2
    }
  })

  if (!collaborator.isActive) return null

  return (
    <group>
      <Sphere
        ref={meshRef}
        args={[0.1, 16, 16]}
        position={[collaborator.cursor.x, collaborator.cursor.y, collaborator.cursor.z]}
      >
        <meshStandardMaterial 
          color={collaborator.color} 
          emissive={collaborator.color}
          emissiveIntensity={0.2}
        />
      </Sphere>
      <Text
        position={[collaborator.cursor.x, collaborator.cursor.y + 0.3, collaborator.cursor.z]}
        fontSize={0.15}
        color={collaborator.color}
        anchorX="center"
        anchorY="bottom"
      >
        {collaborator.name}
      </Text>
    </group>
  )
}

function AnnotationMarker({ annotation }: { annotation: Annotation }) {
  return (
    <group>
      <Sphere args={[0.05, 8, 8]} position={annotation.position}>
        <meshStandardMaterial color={annotation.color} />
      </Sphere>
      <Text
        position={[annotation.position[0], annotation.position[1] + 0.2, annotation.position[2]]}
        fontSize={0.1}
        color="#ffffff"
        anchorX="center"
        anchorY="bottom"
        maxWidth={2}
      >
        {annotation.text}
      </Text>
    </group>
  )
}

function CollaborativeScene({ collaborators, annotations, isLive }: { 
  collaborators: Collaborator[], 
  annotations: Annotation[], 
  isLive: boolean 
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff6b6b" />
      
      {/* Main lesson objects */}
      <Box position={[-2, 0, 0]} args={[1, 1, 1]}>
        <meshStandardMaterial color="#3B82F6" />
      </Box>
      <Sphere position={[2, 0, 0]} args={[0.8, 32, 32]}>
        <meshStandardMaterial color="#10B981" />
      </Sphere>
      <Box position={[0, 2, 0]} args={[1.5, 0.2, 0.8]}>
        <meshStandardMaterial color="#F59E0B" />
      </Box>
      
      {/* Collaborative cursors */}
      {collaborators.map((collaborator) => (
        <CollaborativeCursor 
          key={collaborator.id} 
          collaborator={collaborator} 
          isAnimating={isLive}
        />
      ))}
      
      {/* Annotations */}
      {annotations.map((annotation) => (
        <AnnotationMarker key={annotation.id} annotation={annotation} />
      ))}
      
      <OrbitControls enableZoom={true} />
    </>
  )
}

export function CollaborationDemo() {
  const [isLive, setIsLive] = useState(false)
  const [isMicOn, setIsMicOn] = useState(false)
  const [collaborators] = useState<Collaborator[]>(mockCollaborators)
  const [annotations] = useState<Annotation[]>([
    {
      id: '1',
      position: [-2, 1.2, 0],
      text: 'This represents the electron shell structure',
      author: 'Alice Chen',
      color: '#3B82F6'
    },
    {
      id: '2',
      position: [2, -0.8, 0],
      text: 'Notice the molecular bonding here',
      author: 'Bob Smith',
      color: '#10B981'
    }
  ])

  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')

  useEffect(() => {
    if (isLive) {
      setConnectionStatus('connecting')
      setTimeout(() => setConnectionStatus('connected'), 1500)
    } else {
      setConnectionStatus('disconnected')
    }
  }, [isLive])

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Real-time Collaboration</h1>
          <p className="text-muted-foreground text-lg">
            Experience seamless multi-user 3D learning with low-latency synchronization
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Collaboration Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-4">Session Controls</h3>
              <div className="space-y-4">
                <Button
                  onClick={() => setIsLive(!isLive)}
                  className={`w-full ${isLive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                  data-cursor-hover
                >
                  {isLive ? 'Leave Session' : 'Join Session'}
                </Button>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setIsMicOn(!isMicOn)}
                    variant={isMicOn ? 'default' : 'outline'}
                    className="flex-1"
                    data-cursor-hover
                  >
                    {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" className="flex-1" data-cursor-hover>
                    <Video className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-500' : 
                    connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                  }`} />
                  <span className="text-sm capitalize">{connectionStatus}</span>
                </div>

                {connectionStatus === 'connected' && (
                  <div className="text-sm text-muted-foreground">
                    Latency: <span className="text-green-500 font-medium">85ms</span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-4">
                <Users className="w-5 h-5 inline mr-2" />
                Collaborators ({collaborators.filter(c => c.isActive).length})
              </h3>
              <div className="space-y-3">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center space-x-3 p-2 rounded-lg bg-muted/10"
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: collaborator.color }}
                    />
                    <span className="font-medium">{collaborator.name}</span>
                    {collaborator.isActive && (
                      <Badge variant="secondary" className="ml-auto">
                        Active
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-4">
                <MessageCircle className="w-5 h-5 inline mr-2" />
                Annotations
              </h3>
              <div className="space-y-3">
                {annotations.map((annotation) => (
                  <div
                    key={annotation.id}
                    className="p-3 rounded-lg bg-muted/10 border-l-4"
                    style={{ borderLeftColor: annotation.color }}
                  >
                    <p className="text-sm">{annotation.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      — {annotation.author}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 3D Collaborative Space */}
          <div className="lg:col-span-3">
            <Card className="glass p-4 h-96 lg:h-[600px] relative">
              {!isLive && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-semibold mb-2">Join the Collaboration</p>
                    <p className="text-muted-foreground">
                      Click "Join Session" to start collaborating in real-time
                    </p>
                  </div>
                </div>
              )}
              
              <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <Suspense fallback={null}>
                  <CollaborativeScene 
                    collaborators={collaborators}
                    annotations={annotations}
                    isLive={isLive}
                  />
                </Suspense>
              </Canvas>

              {isLive && (
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                    Live
                  </Badge>
                  <Badge variant="secondary">
                    {collaborators.filter(c => c.isActive).length} users
                  </Badge>
                </div>
              )}
            </Card>

            {/* Performance Metrics */}
            {isLive && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6"
              >
                <Card className="glass p-4 text-center">
                  <div className="text-2xl font-bold text-green-500">85ms</div>
                  <div className="text-sm text-muted-foreground">Network Latency</div>
                </Card>
                <Card className="glass p-4 text-center">
                  <div className="text-2xl font-bold text-blue-500">120fps</div>
                  <div className="text-sm text-muted-foreground">Render Rate</div>
                </Card>
                <Card className="glass p-4 text-center">
                  <div className="text-2xl font-bold text-purple-500">99.8%</div>
                  <div className="text-sm text-muted-foreground">Sync Accuracy</div>
                </Card>
                <Card className="glass p-4 text-center">
                  <div className="text-2xl font-bold text-orange-500">4</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}