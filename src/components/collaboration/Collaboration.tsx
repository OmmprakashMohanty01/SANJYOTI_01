'use client'

import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Cone } from '@react-three/drei';
import { supabase } from '@/lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Users, UserPlus, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion-3d'; 
import * as THREE from 'three';

type PresencePayload = {
    key: string;
    newPresences: any[];
}

interface Collaborator {
  id: string;
  name: string;
  color: string;
  position: { x: number; y: number; z: number };
}

function CollaborativeCursor({ collaborator }: { collaborator: Collaborator }) {
  const cursorRef = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (cursorRef.current) {
      cursorRef.current.position.lerp(new THREE.Vector3(collaborator.position.x, collaborator.position.y, collaborator.position.z), delta * 15);
    }
  });

  return (
    <group>
      <Cone ref={cursorRef} args={[0.1, 0.4, 8]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={collaborator.color} emissive={collaborator.color} emissiveIntensity={1} />
      </Cone>
      <Text
        position={[collaborator.position.x, collaborator.position.y + 0.5, collaborator.position.z]}
        fontSize={0.2}
        color="white"
        anchorX="center"
      >
        {collaborator.name}
      </Text>
    </group>
  );
}

export function Collaboration() {
  const [userName, setUserName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [collaborators, setCollaborators] = useState<Record<string, Collaborator>>({});
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const channelRef = useRef<RealtimeChannel | null>(null);
  const myIdRef = useRef<string>('');
  const myColorRef = useRef<string>('');

  const handleJoin = () => {
    if (!userName.trim()) return;
    myIdRef.current = `user-${Date.now()}`;
    myColorRef.current = `hsl(${Math.random() * 360}, 100%, 70%)`;
    setHasJoined(true);
  };

  useEffect(() => {
    if (!hasJoined) return;
    const room = 'shared-3d-room';
    const channel = supabase.channel(room, { config: { presence: { key: myIdRef.current } } });
    channelRef.current = channel;

    channel.on('presence', { event: 'join' }, (payload: PresencePayload) => {});
    channel.on('presence', { event: 'leave' }, (payload: { leftPresences: any[] }) => {
      setCollaborators(prev => {
        const newCollaborators = { ...prev };
        payload.leftPresences.forEach(p => delete newCollaborators[p.key]);
        return newCollaborators;
      });
    });
    channel.on('broadcast', { event: 'cursor-move' }, ({ payload }: { payload: Collaborator }) => {
      if (payload.id !== myIdRef.current) {
        setCollaborators(prev => ({ ...prev, [payload.id]: payload }));
      }
    });
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        setConnectionStatus('connected');
        await channel.track({ name: userName, color: myColorRef.current });
      } else {
        setConnectionStatus('disconnected');
      }
    });

    return () => { if (channelRef.current) supabase.removeChannel(channelRef.current); };
  }, [hasJoined, userName]);

  const onPointerMove = (event: any) => {
    if (!hasJoined || !channelRef.current || connectionStatus !== 'connected') return;
    const position = { x: event.point.x, y: event.point.y, z: event.point.z };
    const myData: Collaborator = { id: myIdRef.current, name: userName, color: myColorRef.current, position };
    channelRef.current.send({ type: 'broadcast', event: 'cursor-move', payload: myData });
  };

  if (!hasJoined) {
    return (
        <div className="flex items-center justify-center h-[70vh]">
            <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} transition={{type: 'spring'}}>
                <Card className="glass p-8 text-center max-w-md">
                    <UserPlus className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Join the Collaborative Session</h2>
                    <p className="text-muted-foreground mb-6">Enter your name to join other learners in this shared 3D space.</p>
                    <form onSubmit={handleJoin} className="flex gap-2">
                        <Input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Your Name..." className="bg-background/50" />
                        <Button type="submit">Join</Button>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[85vh]">
        <div className="lg:col-span-3 h-full rounded-lg overflow-hidden glass">
            <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} />
                <gridHelper args={[20, 20]} />
                <mesh rotation={[-Math.PI / 2, 0, 0]} onPointerMove={onPointerMove}>
                    <planeGeometry args={[20, 20]} />
                    <meshStandardMaterial transparent opacity={0} />
                </mesh>
                <AnimatePresence>
                    {Object.values(collaborators).map(collab => (
                        <motion.group key={collab.id} initial={{scale: 0}} animate={{scale: 1}}>
                            <CollaborativeCursor collaborator={collab} />
                        </motion.group>
                    ))}
                </AnimatePresence>
                <OrbitControls />
            </Canvas>
        </div>
        <div className="lg:col-span-1 h-full">
            <Card className="glass p-6 h-full">
                <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2"><Users /> Participants</div>
                    {connectionStatus === 'connected' ? <Wifi className="text-green-500" /> : <WifiOff className="text-red-500" />}
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-primary/10 rounded-lg">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: myColorRef.current }}/>
                        <p className="font-semibold">{userName} (You)</p>
                    </div>
                    {Object.values(collaborators).map(collab => (
                         <div key={collab.id} className="flex items-center gap-3 p-2 bg-secondary rounded-lg">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: collab.color }}/>
                            <p>{collab.name}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    </div>
  );
}