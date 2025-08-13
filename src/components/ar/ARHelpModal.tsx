// src/components/ar/ARHelpModal.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { HelpCircle, X, Camera, Wifi } from 'lucide-react'

interface ARHelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ARHelpModal({ isOpen, onClose }: ARHelpModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        <Card className="glass p-8 max-w-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <HelpCircle className="text-primary" />
                                    Using Augmented Reality
                                </h2>
                                <Button variant="ghost" size="icon" onClick={onClose}><X /></Button>
                            </div>
                            <div className="space-y-4 text-muted-foreground">
                                <div className="flex items-start gap-4">
                                    <Camera className="h-6 w-6 mt-1 text-accent-yellow flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-foreground">1. Allow Camera Access</h3>
                                        <p>Your browser will ask for permission to use your camera. This is required to place 3D models in your environment.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Wifi className="h-6 w-6 mt-1 text-accent-pink flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-foreground">2. Scan Your Environment</h3>
                                        <p>After entering AR, slowly move your device around to scan a flat surface, like a floor or a desk. A reticle or shape will appear when a surface is found.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <p className="p-2 bg-secondary rounded-full">👆</p>
                                    <div>
                                        <h3 className="font-semibold text-foreground">3. Tap to Place</h3>
                                        <p>Once you see the indicator, tap the screen to place the 3D model in your world. You can then walk around it and explore!</p>
                                    </div>
                                </div>
                            </div>
                            <Button onClick={onClose} className="w-full mt-6">Got It!</Button>
                        </Card>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}