// src/app/learn/page.tsx
'use client'

import { useEffect, useState, Suspense } from 'react';
import { useUserActions, useUserState } from '@/store/useUserState';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Target, RotateCcw } from 'lucide-react';
import { Pathfinder } from '@/components/ai/Pathfinder';

const BRAIN_MODEL_PATH = '/models/brain/brain.gltf';

function BrainModel() {
  const { scene } = useGLTF(BRAIN_MODEL_PATH);
  const { completedLessons } = useUserState();
  
  const totalScore = completedLessons.reduce((sum, lesson) => sum + lesson.score, 0);
  const averageScore = completedLessons.length > 0 ? totalScore / completedLessons.length : 0;
  const scale = 0.5 + (averageScore / 100) * 0.5;
  
  return <primitive object={scene} scale={scale} />;
}

function ProgressVisualization() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <Environment preset="city" />
      <Suspense fallback={null}>
        <BrainModel />
      </Suspense>
      <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={1} />
    </>
  );
}

export default function LearnPage() {
  const { setCurrentPageContext } = useUserActions();
  const { completedLessons } = useUserState();
  const { resetProgress } = useUserActions();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setCurrentPageContext("Learning Dashboard");
  }, [setCurrentPageContext]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const totalScore = completedLessons.reduce((sum, lesson) => sum + lesson.score, 0);
  const averageScore = completedLessons.length > 0 ? Math.round(totalScore / completedLessons.length) : 0;
  
  return (
    <div className="min-h-screen pt-24 pb-12 container mx-auto px-4 space-y-12">
      <div>
        <h1 className="text-4xl font-bold mb-2">Learning Dashboard</h1>
        <p className="text-muted-foreground text-lg">
            Welcome back! Here is your progress at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
                <Card className="glass p-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/20 rounded-lg"><BookOpen className="w-6 h-6 text-primary" /></div>
                        <div><p className="text-2xl font-bold">{completedLessons.length}</p><p className="text-muted-foreground">Lessons Done</p></div>
                    </div>
                </Card>
                <Card className="glass p-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-orange-500/20 rounded-lg"><Target className="w-6 h-6 text-orange-500" /></div>
                        <div><p className="text-2xl font-bold">{averageScore}%</p><p className="text-muted-foreground">Average Score</p></div>
                    </div>
                </Card>
            </div>
             <Card className="glass p-4">
              <div className="h-96 rounded-lg overflow-hidden">
                <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                  <ProgressVisualization />
                </Canvas>
              </div>
            </Card>
        </div>

        <div>
            <Pathfinder />
        </div>
      </div>
       <div className="text-center">
            <Button onClick={resetProgress} variant="destructive">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All Progress
            </Button>
       </div>
    </div>
  );
}