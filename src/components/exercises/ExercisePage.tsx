import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Wind, Brain, Heart, Sparkles } from 'lucide-react';

const exercises = [
  {
    id: 'deep-breathing',
    title: 'Deep Breathing',
    description: 'Practice mindful breathing techniques to reduce stress and anxiety.',
    icon: Wind,
    duration: '5-10 minutes',
    benefits: ['Reduces stress and anxiety', 'Improves focus', 'Promotes relaxation'],
    path: '/exercises/breathing'
  },
  {
    id: 'guided-meditation',
    title: 'Guided Meditation',
    description: 'Follow along with calming meditation sessions for inner peace.',
    icon: Brain,
    duration: '10-15 minutes',
    benefits: ['Enhances mindfulness', 'Reduces stress', 'Improves emotional balance'],
    path: '/exercises/meditation'
  },
  {
    id: 'gratitude-practice',
    title: 'Gratitude Practice',
    description: 'Cultivate appreciation and positivity through guided gratitude exercises.',
    icon: Heart,
    duration: '5-10 minutes',
    benefits: ['Increases positivity', 'Improves well-being', 'Enhances relationships'],
    path: '/exercises/gratitude'
  },
  {
    id: 'mood-lifting',
    title: 'Mood Lifting',
    description: 'Engage in activities designed to elevate your mood and energy.',
    icon: Sparkles,
    duration: '10-15 minutes',
    benefits: ['Boosts mood', 'Increases energy', 'Promotes positive thinking'],
    path: '/exercises/mood'
  }
];

export function ExercisePage() {
  const navigate = useNavigate();

  return (
    <div className="container py-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-4 animate-text bg-gradient-to-r from-primary via-emerald-500 via-teal-400 to-primary bg-clip-text text-transparent bg-300%">
          Wellness Exercises
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our collection of mindfulness and well-being exercises designed to support your mental health journey.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((exercise, index) => {
          const Icon = exercise.icon;
          return (
            <motion.div
              key={exercise.id}
              className="rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">{exercise.title}</h2>
                </div>
                <p className="text-muted-foreground mb-4">{exercise.description}</p>
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-2">Duration: {exercise.duration}</div>
                  <div className="space-y-1">
                    {exercise.benefits.map((benefit, i) => (
                      <div key={i} className="text-sm text-muted-foreground flex items-center">
                        <span className="mr-2">•</span>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => navigate(exercise.path)}
                >
                  Start Exercise
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
