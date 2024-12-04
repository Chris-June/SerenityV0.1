import { useState, useEffect } from 'react';
import { Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          switch (phase) {
            case 'inhale':
              setPhase('hold');
              return 0;
            case 'hold':
              setPhase('exhale');
              return 0;
            case 'exhale':
              setPhase('inhale');
              return 0;
          }
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  return (
    <div className="p-6 bg-card rounded-lg shadow-sm border">
      <h3 className="text-lg font-medium mb-4">Breathing Exercise</h3>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32">
          <Circle
            className={cn(
              'w-full h-full transition-transform duration-500',
              isActive &&
                phase === 'inhale' &&
                'animate-[pulse_4s_ease-in-out_infinite]'
            )}
          />
          <span className="absolute inset-0 flex items-center justify-center text-lg">
            {phase === 'inhale' && 'Breathe In'}
            {phase === 'hold' && 'Hold'}
            {phase === 'exhale' && 'Breathe Out'}
          </span>
        </div>
        <Progress value={progress} className="w-full" />
        <Button
          onClick={() => setIsActive(!isActive)}
          variant={isActive ? 'destructive' : 'default'}
        >
          {isActive ? 'Stop' : 'Start'} Exercise
        </Button>
      </div>
    </div>
  );
}