// src/components/ai/ClarityEngineWidget.tsx
'use client'

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserState } from '@/store/useUserState';
import { Button } from '../ui/button';
import { MessageCircle, X, Send, Sparkles, Loader, CornerDownLeft } from 'lucide-react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

export function ClarityEngineWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { currentPageContext } = useUserState();
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/solve-doubt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: input, context: currentPageContext })
            });
            if (!response.ok) throw new Error("Failed to get response.");

            const data = await response.json();
            const aiMessage: ChatMessage = { role: 'model', content: data.answer };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I couldn't connect to my knowledge base. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="w-[350px] h-[500px] origin-bottom-right"
                    >
                        <Card className="glass h-full flex flex-col shadow-2xl">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Sparkles className="text-primary h-5 w-5"/>
                                    Clarity Engine
                                </h3>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                               {messages.map((msg, index) => (
                                   <div key={index} className={`flex gap-3 text-sm ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                       {msg.role === 'model' && <div className="w-6 h-6 rounded-full bg-primary flex-shrink-0"/>}
                                       <div className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                                            <div className="prose prose-sm prose-invert prose-p:my-0">
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        </div>

                                   </div>
                               ))}
                               {isLoading && (
                                   <div className="flex gap-3 text-sm">
                                       <div className="w-6 h-6 rounded-full bg-primary flex-shrink-0 animate-pulse"/>
                                       <div className="p-3 rounded-lg bg-secondary flex items-center">
                                            <Loader className="h-4 w-4 animate-spin"/>
                                       </div>
                                   </div>
                               )}
                                <div ref={chatEndRef}/>
                            </div>
                            <div className="p-4 border-t border-white/10">
                                <form onSubmit={handleSubmit} className="relative">
                                    <Input 
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask me anything..."
                                        className="bg-background/50 pr-10"
                                        disabled={isLoading}
                                    />
                                    <Button type="submit" size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isLoading}>
                                        <CornerDownLeft className="h-4 w-4"/>
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className="rounded-full h-16 w-16 shadow-2xl"
                >
                   {isOpen ? <X className="h-7 w-7"/> : <MessageCircle className="h-7 w-7"/>}
                </Button>
            </motion.div>
        </div>
    );
}