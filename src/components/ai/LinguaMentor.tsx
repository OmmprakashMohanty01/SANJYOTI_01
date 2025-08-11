// src/components/ai/LinguaMentor.tsx
'use client'

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send, User, Sparkles, Loader } from "lucide-react";
import * as Tooltip from '@radix-ui/react-tooltip';

interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

interface AIMessage {
  reply: string;
  hasCorrection: boolean;
  corrections: Correction[];
}

interface Message {
  role: 'user' | 'model';
  content: string | AIMessage;
}

export function LinguaMentor() {
  const [conversation, setConversation] = useState<Message[]>([
    { role: 'model', content: { reply: "Hello! I'm LinguaMentor. Type a message in English to start practicing, and I'll help you with any mistakes.", hasCorrection: false, corrections: [] } }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedConversation = [...conversation, userMessage];
    setConversation(updatedConversation);
    setInput("");
    setIsLoading(true);

    try {
      // --- THIS IS THE FIX ---
      // We now send the entire conversation history, including the model's first message.
      // The backend will handle filtering it correctly for the API call.
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: updatedConversation }),
      });
      // ----------------------

      if (!response.ok) throw new Error("Failed to get a response from the AI.");

      const aiData: AIMessage = await response.json();
      const aiMessage: Message = { role: 'model', content: aiData };
      setConversation(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error(error);
      const errorMessage: Message = { role: 'model', content: { reply: "Sorry, I encountered an error. Please try again.", hasCorrection: false, corrections: [] } };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderUserMessage = (message: Message, index: number) => {
    const nextMessage = conversation[index + 1];
    let correctedContent: React.ReactNode = message.content as string;

    if (nextMessage && nextMessage.role === 'model' && (nextMessage.content as AIMessage).hasCorrection) {
      const correction = (nextMessage.content as AIMessage).corrections[0];
      if (correction && (message.content as string).includes(correction.original)) {
        correctedContent = (
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <span className="bg-red-500/20 px-1 rounded-md line-through cursor-pointer">
                  {correction.original}
                </span>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="bg-background text-foreground p-3 rounded-lg shadow-lg border border-primary text-sm max-w-xs z-50" sideOffset={5}>
                  <p><strong className="text-primary">Corrected:</strong> {correction.corrected}</p>
                  <p className="mt-2"><strong className="text-primary">Reason:</strong> {correction.explanation}</p>
                  <Tooltip.Arrow className="fill-background" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        );
      }
    }
    
    return <p>{correctedContent}</p>
  }

  return (
    <Card className="glass w-full max-w-2xl mx-auto h-[70vh] flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {conversation.map((message, index) => (
          <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
            {message.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center"><Sparkles className="h-5 w-5 text-primary-foreground" /></div>}
            <div className={`p-4 rounded-lg max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-secondary rounded-bl-none'}`}>
              {message.role === 'user' ? renderUserMessage(message, index) : (message.content as AIMessage).reply}
            </div>
            {message.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center"><User className="h-5 w-5 text-secondary-foreground" /></div>}
          </div>
        ))}
         {isLoading && (
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center"><Loader className="h-5 w-5 text-primary-foreground animate-spin" /></div>
                <div className="p-4 rounded-lg bg-secondary rounded-bl-none">
                    <p className="text-muted-foreground italic">LinguaMentor is typing...</p>
                </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Practice your English here..."
            className="flex-1 bg-background/50"
            disabled={isLoading}
            autoComplete="off"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}