import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const breathingPatterns = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Inhale, hold, exhale, and hold - each for 4 counts',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'Inhale for 4, hold for 7, exhale for 8',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
  },
  {
    id: 'relaxing',
    name: 'Relaxing Breath',
    description: 'Inhale for 4, exhale for 6',
    inhale: 4,
    hold1: 0,
    exhale: 6,
    hold2: 0,
  },
];

export function BreathingExercise() {
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const totalCycleDuration = 
    selectedPattern.inhale + 
    selectedPattern.hold1 + 
    selectedPattern.exhale + 
    selectedPattern.hold2;

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 / (totalCycleDuration * 100));
          
          if (newProgress >= 100) {
            // Reset and move to next phase
            const phases: ('inhale' | 'hold1' | 'exhale' | 'hold2')[] = ['inhale', 'hold1', 'exhale', 'hold2'];
            const currentIndex = phases.indexOf(phase);
            const nextPhase = phases[(currentIndex + 1) % phases.length];
            setPhase(nextPhase);
            return 0;
          }
          
          return newProgress;
        });
      }, 10);

      setTimer(interval);
    } else if (timer) {
      clearInterval(timer);
      setTimer(null);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, phase, totalCycleDuration, timer]);

  const getCurrentInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold1':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'hold2':
        return 'Hold';
    }
  };

  const getCurrentDuration = () => {
    switch (phase) {
      case 'inhale':
        return selectedPattern.inhale;
      case 'hold1':
        return selectedPattern.hold1;
      case 'exhale':
        return selectedPattern.exhale;
      case 'hold2':
        return selectedPattern.hold2;
    }
  };

  const resetExercise = () => {
    setIsPlaying(false);
    setPhase('inhale');
    setProgress(0);
    if (timer) clearInterval(timer);
    setTimer(null);
  };

  return (
    <div className="container max-w-4xl py-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="rounded-lg bg-primary/10 p-3 w-fit mx-auto mb-4">
          <Wind className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4 animate-text bg-gradient-to-r from-primary via-emerald-500 via-teal-400 to-primary bg-clip-text text-transparent bg-300%">
          Deep Breathing Exercise
        </h1>
        <p className="text-xl text-muted-foreground">
          Follow along with guided breathing patterns to reduce stress and promote relaxation.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {breathingPatterns.map((pattern, index) => (
          <motion.div
            key={pattern.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant={selectedPattern.id === pattern.id ? "default" : "outline"}
              className="w-full h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => {
                setSelectedPattern(pattern);
                resetExercise();
              }}
            >
              <div className="font-semibold">{pattern.name}</div>
              <div className="text-sm text-muted-foreground">{pattern.description}</div>
            </Button>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] p-8 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-4xl font-bold mb-4">{getCurrentInstruction()}</div>
        <div className="text-6xl font-bold mb-8 animate-text bg-gradient-to-r from-primary via-emerald-500 via-teal-400 to-primary bg-clip-text text-transparent bg-300%">
          {Math.ceil(getCurrentDuration() * (1 - progress / 100))}
        </div>
        <Progress value={progress} className="mb-8" />
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            className="w-32"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <>
                <Pause className="mr-2 h-5 w-5" /> Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" /> Start
              </>
            )}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-32"
            onClick={resetExercise}
          >
            <RotateCcw className="mr-2 h-5 w-5" /> Reset
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
