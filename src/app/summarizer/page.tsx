// src/app/summarizer/page.tsx  <-- This is the correct file and path
import { Summarizer } from "@/components/ai/Summarizer";

export default function SummarizerPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 container mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold mb-2">AI Summarizer</h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Turn any text into a concise summary and key points instantly. Powered by SanJyoti AI.
        </p>
      </div>
      <Summarizer />
    </main>
  );
}