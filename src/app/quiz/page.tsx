// src/app/quiz/page.tsx
import { QuizGenerator } from "@/components/ai/QuizGenerator";

export default function QuizPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 container mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold mb-2">Personalized Quiz Generator</h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Transform your notes into an interactive quiz to test your knowledge and find your weak spots.
        </p>
      </div>
      <QuizGenerator />
    </main>
  );
}