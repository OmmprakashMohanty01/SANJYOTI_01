// src/components/sections/features.tsx
'use client'

import { motion } from 'framer-motion'
import { Brain, Users, Eye, FileText, Bot, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'

const features = [
  {
    icon: MessageCircle,
    title: 'Clarity Engine',
    description: 'Practice languages or ask any question with a conversational AI that helps you in real-time.',
    gradient: 'from-sky-500 to-indigo-500',
    href: '/chat' 
  },
  {
    icon: FileText,
    title: 'QuickScribe Summarizer',
    description: 'Condense long lessons into key points and narrative summaries with a single click.',
    gradient: 'from-yellow-500 to-amber-500',
    href: '/summarizer'
  },
  {
    icon: Bot,
    title: 'QuizForge AI',
    description: 'Turn your notes into personalized multiple-choice quizzes to test your knowledge instantly.',
    gradient: 'from-green-500 to-lime-500',
    href: '/quiz'
  },
  {
    icon: Eye,
    title: 'WebXR & AR Mode',
    description: 'Toggle between desktop and immersive AR experiences for spatial learning.',
    gradient: 'from-cyan-500 to-teal-500',
    href: '/ar-simulation'
  },
  {
    icon: Brain,
    title: 'Pathfinder AI',
    description: 'Get personalized recommendations on what to learn next based on your progress.',
    gradient: 'from-purple-500 to-pink-500',
    href: '/learn'
  },
  {
    icon: Users,
    title: 'Real-time Collaboration',
    description: 'Multiple learners interact in shared 3D environments with low-latency synchronization.',
    gradient: 'from-blue-500 to-cyan-500',
    href: '/collaborate'
  },
]

export function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-transparent to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            Revolutionary Learning
            <span className="text-primary block">Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Cutting-edge technology meets educational excellence to create 
            the most advanced learning platform ever built.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="glass p-6 rounded-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group flex flex-col justify-between"
              data-cursor-hover
            >
              <div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
              
              {feature.href && (
                <div className="mt-4">
                  <Link href={feature.href} passHref>
                    <Button variant="secondary" className="w-full">
                      Try It Now
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}