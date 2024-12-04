import { Menu, Heart, Sparkles, BookOpen, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFeatureModal } from '@/hooks/use-feature-modal';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const features = [
  { id: 'mood', label: 'Mood Tracker', icon: Heart },
  { id: 'breathing', label: 'Breathing Exercise', icon: Sparkles },
  { id: 'coping', label: 'Coping Strategies', icon: BookOpen },
  { id: 'chat', label: 'AI Chat', icon: MessageCircle },
];

const navLinks = [
  { href: '/journal', label: 'Journal' },
  { href: '/insights', label: 'Insights' },
  { href: '/exercises', label: 'Exercises' },
  { href: '/resources', label: 'Resources' },
];

export function Header() {
  const { openModal } = useFeatureModal();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2a2a2a] bg-[#0a0a0a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0a0a]/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo Section */}
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="rounded-lg bg-primary/10 p-2 mr-2">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl animate-text bg-gradient-to-r from-primary via-teal-400 to-primary bg-clip-text text-transparent bg-300%">
              Serenity
            </span>
          </Link>
        </motion.div>

        {/* Navigation Links - Hidden on Mobile */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section - Features Menu & Theme Toggle */}
        <div className="flex items-center space-x-4">
          {/* Get Started Button - Hidden on Mobile */}
          <Button
            variant="default"
            className="hidden md:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => navigate('/')}
          >
            Get Started
          </Button>

          {/* Features Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#2a2a2a] hover:text-primary transition-colors">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle features menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] bg-[#1a1a1a] border-[#2a2a2a]">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <DropdownMenuItem
                    key={feature.id}
                    onClick={() => openModal(feature.id)}
                    className="flex items-center space-x-2 hover:bg-[#2a2a2a] hover:text-primary transition-colors focus:bg-[#2a2a2a] focus:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{feature.label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}