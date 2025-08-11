// src/components/ai/Pathfinder.tsx
'use client'

import { useState } from "react";
import { useUserState } from "@/store/useUserState";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Compass, Loader, Lightbulb } from "lucide-react";
import { Badge } from "../ui/badge";

interface Recommendation {
  recommendationId: string | null;
  reason: string;
  details: {
    id: string;
    title: string;
    difficulty: string;
    category: string;
  } | null;
}

export function Pathfinder() {
  const { completedLessons, learningGoal } = useUserState();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getRecommendation = async () => {
    setIsLoading(true);
    setError("");
    setRecommendation(null);

    try {
      const response = await fetch('/api/get-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedLessons, goal: learningGoal }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch recommendation.");
      }
      const data = await response.json();
      setRecommendation(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass p-6">
      <div className="flex items-center mb-4">
        <Compass className="w-6 h-6 mr-3 text-primary" />
        <h3 className="text-xl font-semibold">Pathfinder AI Advisor</h3>
      </div>
      <p className="text-muted-foreground mb-4">
        Not sure what to learn next? Let our AI analyze your progress and suggest the perfect next step for you.
      </p>

      <Button onClick={getRecommendation} disabled={isLoading} className="w-full">
        {isLoading ? <Loader className="animate-spin mr-2" /> : <Lightbulb className="mr-2 h-4 w-4" />}
        Find My Next Lesson
      </Button>

      <div className="mt-4 min-h-[100px]">
        <AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center pt-4">
              <p>Analyzing your learning journey...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-500 text-center pt-4">
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {recommendation && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mt-4 p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong className="text-foreground">AI Recommendation:</strong> {recommendation.reason}
                </p>
                {recommendation.details && (
                  <div className="p-4 bg-background/50 rounded-md">
                    <h4 className="font-semibold">{recommendation.details.title}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{recommendation.details.category}</Badge>
                      <Badge>{recommendation.details.difficulty}</Badge>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}