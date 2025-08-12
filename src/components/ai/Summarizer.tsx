// src/components/ai/Summarizer.tsx
'use client'

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";
import { AiLoader } from "../ui/AiLoader"; // <-- New loader component

interface Summary {
  narrative: string;
  bullets: string[];
}

export function Summarizer() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }
    setIsLoading(true);
    setError("");
    setSummary(null);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Error: ${response.statusText}`);
      }

      const data: Summary = await response.json();
      setSummary(data);
    } catch (err: any) {
      setError(err.message || "Failed to get summary. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="glass p-6">
        <form onSubmit={handleSubmit}>
          <h3 className="text-xl font-semibold mb-4">QuickScribe Summarizer</h3>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your lesson text, article, or notes here..."
            className="min-h-[150px] bg-background/50"
            disabled={isLoading}
          />
          <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
            {isLoading ? (
              "Generating..."
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Summary
              </>
            )}
          </Button>
        </form>
      </Card>

      <div className="mt-6">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mt-4"
            >
              {/* --- NEW LOADER --- */}
              <AiLoader text="SanJyoti AI is thinking..." />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 text-red-500 text-center bg-red-500/10 p-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card className="glass p-6 mt-6">
                <h4 className="font-semibold text-lg mb-2">Narrative Summary</h4>
                <p className="text-muted-foreground mb-4">{summary.narrative}</p>
                <h4 className="font-semibold text-lg mb-2">Key Points</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {summary.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
