import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, Heart, Wind, Smile, Timer, PlayCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const exercises = [
  {
    id: 'breathing',
    title: 'Deep Breathing',
    description: 'A simple but effective technique for reducing stress and anxiety',
    duration: '5 min',
    category: 'Relaxation',
    icon: Wind,
    progress: 75,
  },
  {
    id: 'meditation',
    title: 'Guided Meditation',
    description: 'Focus your mind and find inner peace',
    duration: '10 min',
    category: 'Mindfulness',
    icon: Brain,
    progress: 30,
  },
  {
    id: 'gratitude',
    title: 'Gratitude Practice',
    description: 'Cultivate appreciation for the positive aspects of life',
    duration: '5 min',
    category: 'Positivity',
    icon: Heart,
    progress: 50,
  },
  {
    id: 'mood-lift',
    title: 'Mood Lifting',
    description: 'Activities designed to boost your mood',
    duration: '15 min',
    category: 'Emotional Wellness',
    icon: Smile,
    progress: 0,
  },
];

export function ExercisesPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
          Wellness Exercises
        </h1>
        <Button variant="outline" className="gap-2">
          <Timer className="w-4 h-4" />
          View History
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((exercise) => {
          const Icon = exercise.icon;
          return (
            <Card key={exercise.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle>{exercise.title}</CardTitle>
                      <CardDescription>{exercise.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">{exercise.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{exercise.progress}%</span>
                  </div>
                  <Progress value={exercise.progress} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Timer className="w-4 h-4" />
                      {exercise.duration}
                    </span>
                    <Button className="gap-2">
                      <PlayCircle className="w-4 h-4" />
                      Start Exercise
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
