'use client'

'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Home, Book, Bot, HeartPulse, FileText, MessageCircle, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button' // ✅ Added import

const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/learn", label: "Dashboard", icon: Book },
    { href: "/chat", label: "Clarity Engine", icon: MessageCircle },
    { href: "/summarizer", label: "Summarizer", icon: FileText },
    { href: "/quiz", label: "QuizForge", icon: Bot },
    { href: "/ar-simulation", label: "AR Sim", icon: HeartPulse },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; }
  }, [isOpen]);

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.07, duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "glass-scrolled" : "glass-top"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2" data-cursor-hover>
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">SanJyoti</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="nav-link">
                  <link.icon className="w-4 h-4" /> <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Navigation Trigger */}
            <div className="md:hidden">
                <Button onClick={() => setIsOpen(true)} variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
            <motion.div 
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-lg flex flex-col items-center justify-center"
            >
                <Button onClick={() => setIsOpen(false)} variant="ghost" size="icon" className="absolute top-4 right-4">
                    <X className="h-8 w-8" />
                </Button>
                <nav className="flex flex-col items-center gap-8">
                    {navLinks.map(link => (
                        <motion.div key={link.href} variants={linkVariants}>
                            <Link href={link.href} className="text-2xl font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-3">
                                <link.icon className="w-6 h-6" />
                                {link.label}
                            </Link>
                        </motion.div>
                    ))}
                </nav>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}