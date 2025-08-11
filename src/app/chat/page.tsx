// src/app/chat/page.tsx
import { LinguaMentor } from "@/components/ai/LinguaMentor";

export default function ChatPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 container mx-auto px-4 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl lg:text-5xl font-bold mb-2">AI Language Buddy</h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Chat with LinguaMentor to practice your English. It will correct your mistakes in real-time.
        </p>
      </div>
      <LinguaMentor />
    </main>
  );
}