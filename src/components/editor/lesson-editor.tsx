'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Text } from '@react-three/drei'
import { Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Save, Play, Eye, Settings, Plus } from 'lucide-react'

interface LessonElement {
  id: string
  type: 'box' | 'sphere' | 'text'
  position: [number, number, number]
  properties: any
}

function InteractiveScene({ elements }: { elements: LessonElement[] }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} />
      
      {elements.map((element) => {
        switch (element.type) {
          case 'box':
            return (
              <Box
                key={element.id}
                position={element.position}
                args={element.properties.size || [1, 1, 1]}
              >
                <meshStandardMaterial color={element.properties.color || '#3B82F6'} />
              </Box>
            )
          case 'sphere':
            return (
              <Sphere
                key={element.id}
                position={element.position}
                args={element.properties.radius ? [element.properties.radius, 32, 32] : [1, 32, 32]}
              >
                <meshStandardMaterial color={element.properties.color || '#10B981'} />
              </Sphere>
            )
          case 'text':
            return (
              <Text
                key={element.id}
                position={element.position}
                fontSize={element.properties.size || 0.5}
                color={element.properties.color || '#ffffff'}
                anchorX="center"
                anchorY="middle"
              >
                {element.properties.content || 'Sample Text'}
              </Text>
            )
          default:
            return null
        }
      })}
      
      <OrbitControls enableZoom={true} />
    </>
  )
}

export function LessonEditor() {
  const [lessonData, setLessonData] = useState({
    title: 'New 3D Lesson',
    description: 'An interactive 3D learning experience',
    difficulty: 'Beginner',
    duration: 15
  })

  const [elements, setElements] = useState<LessonElement[]>([
    {
      id: '1',
      type: 'box',
      position: [-2, 0, 0],
      properties: { size: [1, 1, 1], color: '#3B82F6' }
    },
    {
      id: '2',
      type: 'sphere',
      position: [2, 0, 0],
      properties: { radius: 0.8, color: '#10B981' }
    },
    {
      id: '3',
      type: 'text',
      position: [0, 2, 0],
      properties: { content: 'Interactive 3D Lesson', size: 0.3, color: '#ffffff' }
    }
  ])

  const [selectedElement, setSelectedElement] = useState<string | null>(null)

  const addElement = (type: 'box' | 'sphere' | 'text') => {
    const newElement: LessonElement = {
      id: Date.now().toString(),
      type,
      position: [0, 0, 0],
      properties: type === 'text' 
        ? { content: 'New Text', size: 0.5, color: '#ffffff' }
        : { color: '#F59E0B' }
    }
    setElements([...elements, newElement])
  }

  const exportLesson = () => {
    const lessonJson = {
      metadata: lessonData,
      scene: {
        elements: elements,
        camera: { position: [0, 0, 8], fov: 50 },
        lighting: {
          ambient: { intensity: 0.6 },
          directional: { position: [10, 10, 10], intensity: 1 }
        }
      },
      interactions: [],
      assessments: []
    }

    const blob = new Blob([JSON.stringify(lessonJson, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${lessonData.title.toLowerCase().replace(/\s+/g, '-')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Lesson Editor</h1>
          <p className="text-muted-foreground text-lg">
            Create immersive 3D learning experiences with our advanced authoring tools
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Editor Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-4">Lesson Properties</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={lessonData.title}
                    onChange={(e) => setLessonData({...lessonData, title: e.target.value})}
                    className="glass"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={lessonData.description}
                    onChange={(e) => setLessonData({...lessonData, description: e.target.value})}
                    className="glass"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <select
                    id="difficulty"
                    value={lessonData.difficulty}
                    onChange={(e) => setLessonData({...lessonData, difficulty: e.target.value})}
                    className="w-full p-2 glass rounded-md"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-4">Add Elements</h3>
              <div className="space-y-2">
                <Button
                  onClick={() => addElement('box')}
                  className="w-full"
                  variant="outline"
                  data-cursor-hover
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Box
                </Button>
                <Button
                  onClick={() => addElement('sphere')}
                  className="w-full"
                  variant="outline"
                  data-cursor-hover
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sphere
                </Button>
                <Button
                  onClick={() => addElement('text')}
                  className="w-full"
                  variant="outline"
                  data-cursor-hover
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Text
                </Button>
              </div>
            </Card>

            <div className="flex space-x-2">
              <Button onClick={exportLesson} className="flex-1" data-cursor-hover>
                <Save className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" className="flex-1" data-cursor-hover>
                <Play className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="lg:col-span-2">
            <Card className="glass p-4 h-96 lg:h-[600px]">
              <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <Suspense fallback={null}>
                  <InteractiveScene elements={elements} />
                </Suspense>
              </Canvas>
            </Card>
          </div>

          {/* Element Properties */}
          <div className="lg:col-span-1">
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-4">Scene Elements</h3>
              <div className="space-y-3">
                {elements.map((element) => (
                  <div
                    key={element.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedElement === element.id
                        ? 'bg-primary/20 border border-primary/40'
                        : 'bg-muted/10 hover:bg-muted/20'
                    }`}
                    onClick={() => setSelectedElement(element.id)}
                    data-cursor-hover
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">{element.type}</span>
                      <Settings className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Position: ({element.position.join(', ')})
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {selectedElement && (
              <Card className="glass p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Element Properties</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Color</Label>
                    <Input
                      type="color"
                      value={elements.find(e => e.id === selectedElement)?.properties.color || '#3B82F6'}
                      onChange={(e) => {
                        setElements(elements.map(el =>
                          el.id === selectedElement
                            ? { ...el, properties: { ...el.properties, color: e.target.value } }
                            : el
                        ))
                      }}
                      className="glass h-10"
                    />
                  </div>
                  {/* Add more property editors based on element type */}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}