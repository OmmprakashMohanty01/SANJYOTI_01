'use client'

import { useEffect } from 'react';
import { useUserActions } from '@/store/useUserState';
import { HeartSimulation } from "@/components/ar/heart-simulation";

export default function ArSimulationPage() {
    const { setCurrentPageContext } = useUserActions();

    useEffect(() => {
        // Set the context for the Clarity Engine AI when the page loads
        setCurrentPageContext("AR Heart Simulation");
    }, [setCurrentPageContext]);

    return (
        <div className="min-h-screen relative">
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
                <h1 className="text-4xl font-bold">Immersive Heart Simulation</h1>
                <p className="text-muted-foreground mt-2">
                    Explore the model on your screen, or press "Enter AR" on a supported device.
                </p>
            </div>
            <HeartSimulation />
        </div>
    );
}