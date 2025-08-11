// src/components/ai/QuizGenerator.tsx
'use client'

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Sparkles, Loader, CheckCircle, XCircle, BookCopy, Repeat } from "lucide-react";

// Define the structure of a question
interface Question {
  question: string;
  options: string[];
  answer: string;
}

type QuizState = 'idle' | 'generating' | 'generated' | 'submitted';

export function QuizGenerator() {
  const [text, setText] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [error, setError] = useState("");
  
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please enter some text to generate a quiz from.");
      return;
    }
    setQuizState('generating');
    setError("");
    setQuestions([]);
    setUserAnswers({});

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Error: ${response.statusText}`);
      }

      const data: Question[] = await response.json();
      setQuestions(data);
      setQuizState('generated');
    } catch (err: any) {
      setError(err.message || "Failed to generate the quiz. Please try again.");
      setQuizState('idle');
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.answer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setQuizState('submitted');
  };

  const handleTryAgain = () => {
    setQuizState('idle');
    setText("");
    setQuestions([]);
    setUserAnswers({});
    setError("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {quizState === 'idle' || quizState === 'generating' ? (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="glass p-6">
              <form onSubmit={handleGenerateQuiz}>
                <h3 className="text-xl font-semibold mb-4">QuizForge AI</h3>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your lesson notes here and SanJyoti will create a quiz for you..."
                  className="min-h-[200px] bg-background/50"
                  disabled={quizState === 'generating'}
                />
                <Button type="submit" className="mt-4 w-full" disabled={quizState === 'generating'}>
                  {quizState === 'generating' ? <Loader className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Generate Quiz
                </Button>
              </form>
            </Card>
          </motion.div>
        ) : quizState === 'submitted' ? (
           <motion.div key="results" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
             <Card className="glass p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
                <p className="text-xl text-muted-foreground mb-6">Your Score:</p>
                <p className="text-6xl font-bold text-primary mb-8">{score} / {questions.length}</p>
                <Button onClick={handleTryAgain}>
                    <Repeat className="mr-2 h-4 w-4" /> Create a New Quiz
                </Button>
             </Card>
           </motion.div>
        ) : (
          <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {questions.map((q, index) => (
              <Card key={index} className="glass p-6 mb-4">
                <p className="font-semibold mb-4">{index + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((option, i) => (
                    <label key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-background/30 cursor-pointer hover:bg-background/50 transition-colors">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        onChange={() => handleAnswerChange(index, option)}
                        checked={userAnswers[index] === option}
                        className="form-radio h-4 w-4 text-primary bg-gray-700 border-gray-600 focus:ring-primary"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </Card>
            ))}
            <Button onClick={handleSubmitQuiz} className="w-full mt-4">Submit Quiz</Button>
          </motion.div>
        )}
      </AnimatePresence>

       <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-4 text-red-500 text-center bg-red-500/10 p-3 rounded-lg">
                {error}
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}