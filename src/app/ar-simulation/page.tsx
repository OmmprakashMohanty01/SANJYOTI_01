'use client'

import { useEffect, useState } from 'react';
import { useUserActions } from '@/store/useUserState';
import { HeartSimulation } from "@/components/ar/heart-simulation";
import { ARHelpModal } from '@/components/ar/ARHelpModal';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader'; // <-- Import the new component

export default function ArSimulationPage() {
    const { setCurrentPageContext } = useUserActions();
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    useEffect(() => {
        setCurrentPageContext("AR Heart Simulation");
    }, [setCurrentPageContext]);

    return (
        <>
            <ARHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
            <div className="min-h-screen relative flex flex-col">
                {/* --- REPLACE THE OLD HEADER --- */}
                {/* We wrap the header to position it on top of the 3D canvas */}
                <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
                    <div className="container mx-auto">
                        <PageHeader 
                            title="Immersive Heart Simulation"
                            subtitle="Explore the model on your screen, or press 'Enter AR' on a supported device."
                        />
                    </div>
                </div>

                <Button 
                    onClick={() => setIsHelpOpen(true)}
                    className="absolute top-5 right-5 z-20"
                    variant="secondary"
                >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    AR Help
                </Button>

                {/* The canvas takes up the full screen */}
                <div className="flex-grow">
                    <HeartSimulation />
                </div>
            </div>
        </>
    );
}