import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

const activities = [
  {
    title: "Power Pose",
    description: "Stand tall with your hands on your hips for 30 seconds",
    duration: 30,
    benefits: ["Increases confidence", "Reduces stress hormones"],
  },
  {
    title: "Positive Affirmations",
    description: "Repeat three positive statements about yourself",
    duration: 45,
    benefits: ["Builds self-esteem", "Promotes positive thinking"],
  },
  {
    title: "Quick Movement",
    description: "Do some stretching or light movement to energize yourself",
    duration: 60,
    benefits: ["Releases endorphins", "Increases energy levels"],
  },
  {
    title: "Mindful Appreciation",
    description: "Focus on three things you can see, hear, and feel",
    duration: 45,
    benefits: ["Grounds you in the present", "Shifts focus to positives"],
  },
  {
    title: "Victory Celebration",
    description: "Celebrate with a victory dance or gesture",
    duration: 30,
    benefits: ["Triggers positive emotions", "Creates joy through movement"],
  },
  {
    title: "Smile Exercise",
    description: "Hold a gentle smile while taking deep breaths",
    duration: 40,
    benefits: ["Reduces stress", "Activates positive neural pathways"],
  },
  {
    title: "Gratitude Moment",
    description: "Think of three things you're thankful for right now",
    duration: 45,
    benefits: ["Increases happiness", "Improves perspective"],
  },
  {
    title: "Energy Shake",
    description: "Gently shake your body to release tension",
    duration: 35,
    benefits: ["Releases physical tension", "Energizes body and mind"],
  },
  {
    title: "Laughter Break",
    description: "Practice laughing (even if forced) to lift your mood",
    duration: 30,
    benefits: ["Releases endorphins", "Reduces stress instantly"],
  },
  {
    title: "Positive Memory",
    description: "Recall and visualize a happy memory in detail",
    duration: 50,
    benefits: ["Boosts mood", "Strengthens positive associations"],
  },
  {
    title: "Color Visualization",
    description: "Imagine being surrounded by your favorite uplifting color",
    duration: 40,
    benefits: ["Calms mind", "Enhances mood through color"],
  },
  {
    title: "Self-Compassion Pause",
    description: "Give yourself kind and encouraging words",
    duration: 45,
    benefits: ["Builds self-compassion", "Reduces negative self-talk"],
  }
];

export function MoodLifting() {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<number[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [mode, setMode] = useState<'selection' | 'sequence' | 'single'>('selection');

  const currentActivity = activities[selectedActivity ?? currentActivityIndex];
  const isComplete = mode === 'sequence' && completedActivities.length === activities.length;

  const startActivity = () => {
    setIsActive(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (currentActivity.duration * 10));
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsActive(false);
          if (mode === 'sequence') {
            setCompletedActivities([...completedActivities, currentActivityIndex]);
          }
          return 100;
        }
        return newProgress;
      });
    }, 100);
  };

  const nextActivity = () => {
    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1);
      setProgress(0);
    }
  };

  const resetExercise = () => {
    setCurrentActivityIndex(0);
    setIsActive(false);
    setProgress(0);
    setCompletedActivities([]);
    setMode('selection');
    setSelectedActivity(null);
  };

  const startSequence = () => {
    setMode('sequence');
    setCurrentActivityIndex(0);
    setCompletedActivities([]);
    setProgress(0);
  };

  const selectActivity = (index: number) => {
    setSelectedActivity(index);
    setMode('single');
    setProgress(0);
    setIsActive(false);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] flex flex-col">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="rounded-lg bg-primary/10 p-3 w-fit mx-auto mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4 animate-text bg-gradient-to-r from-primary via-emerald-500 via-teal-400 to-primary bg-clip-text text-transparent bg-300%">
          Mood Lifting Exercise
        </h1>
        <p className="text-xl text-muted-foreground">
          Choose a single activity or try the complete sequence.
        </p>
      </motion.div>

      {mode === 'selection' && (
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex justify-center gap-4 mb-8">
            <Button
              size="lg"
              onClick={startSequence}
              className="min-w-[200px]"
            >
              Start Full Sequence
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="p-6 hover:border-primary/50 cursor-pointer transition-all"
                  onClick={() => selectActivity(index)}
                >
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold mb-2">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{activity.description}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {activity.benefits.map((benefit, i) => (
                        <span
                          key={i}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-center text-muted-foreground">
                    Duration: {activity.duration} seconds
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {mode !== 'selection' && (
        <>
          {mode === 'sequence' && (
            <div className="flex items-center justify-center mb-8 max-w-2xl mx-auto w-full">
              <div className="text-sm text-muted-foreground mr-4">
                Progress: {completedActivities.length}/{activities.length}
              </div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(completedActivities.length / activities.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {!isComplete ? (
            <motion.div
              className="max-w-2xl mx-auto w-full rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] p-6 md:p-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-2">
                  {currentActivity.title}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {currentActivity.description}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {currentActivity.benefits.map((benefit, index) => (
                    <span
                      key={index}
                      className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              <Progress value={progress} className="mb-8" />

              <div className="flex justify-center gap-4">
                {mode === 'sequence' ? (
                  !completedActivities.includes(currentActivityIndex) ? (
                    <Button
                      size="lg"
                      onClick={startActivity}
                      disabled={isActive}
                      className="min-w-[140px]"
                    >
                      {isActive ? (
                        `${Math.ceil((currentActivity.duration * (100 - progress)) / 100)}s`
                      ) : (
                        'Start Activity'
                      )}
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={nextActivity}
                      className="min-w-[140px]"
                    >
                      Next Activity <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  )
                ) : (
                  <div className="flex gap-4">
                    <Button
                      size="lg"
                      onClick={startActivity}
                      disabled={isActive}
                      className="min-w-[140px]"
                    >
                      {isActive ? (
                        `${Math.ceil((currentActivity.duration * (100 - progress)) / 100)}s`
                      ) : (
                        'Start Activity'
                      )}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setMode('selection')}
                      className="min-w-[140px]"
                    >
                      Choose Another
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="max-w-2xl mx-auto w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="p-8 text-center">
                <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-4">
                  Exercise Complete! 🎉
                </h2>
                <p className="text-muted-foreground mb-6">
                  Great job completing all the mood-lifting activities! How are you feeling now?
                </p>
                <Button
                  size="lg"
                  onClick={resetExercise}
                  className="min-w-[140px]"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Start Again
                </Button>
              </Card>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
