import { useState } from 'react';
import { Plus, Check, X, Trophy, Target, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface Habit {
  id: string;
  name: string;
  category: string;
  streak: number;
  completed: boolean;
  createdAt: Date;
}

const categories = [
  { value: 'mindfulness', label: 'Mindfulness' },
  { value: 'self-care', label: 'Self Care' },
  { value: 'exercise', label: 'Exercise' },
  { value: 'social', label: 'Social Connection' },
  { value: 'sleep', label: 'Sleep Hygiene' },
];

const habitSuggestions = {
  mindfulness: [
    'Practice 5-minute meditation',
    'Write in gratitude journal',
    'Do breathing exercises',
    'Mindful walking',
  ],
  'self-care': [
    'Take medication on time',
    'Drink enough water',
    'Eat regular meals',
    'Practice positive affirmations',
  ],
  exercise: [
    'Take a 10-minute walk',
    'Do gentle stretching',
    'Practice yoga',
    'Exercise for 20 minutes',
  ],
  social: [
    'Call a friend or family member',
    'Join a support group meeting',
    'Share feelings with someone',
    'Attend a social event',
  ],
  sleep: [
    'Maintain consistent bedtime',
    'No screens before bed',
    'Practice bedtime routine',
    'Get 8 hours of sleep',
  ],
};

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const handleAddHabit = () => {
    if (!newHabit.trim() || !selectedCategory) return;

    const habit: Habit = {
      id: crypto.randomUUID(),
      name: newHabit,
      category: selectedCategory,
      streak: 0,
      completed: false,
      createdAt: new Date(),
    };

    setHabits([...habits, habit]);
    setNewHabit('');
    setSelectedCategory('');
    setShowDialog(false);
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        return {
          ...habit,
          completed: !habit.completed,
          streak: !habit.completed ? habit.streak + 1 : habit.streak - 1,
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const getProgressPercentage = () => {
    if (habits.length === 0) return 0;
    return (habits.filter(h => h.completed).length / habits.length) * 100;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Habits & Goals
          </span>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCategory && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Suggestions:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {habitSuggestions[selectedCategory as keyof typeof habitSuggestions].map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          className="justify-start"
                          onClick={() => setNewHabit(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Input
                    placeholder="Enter habit name"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                  />
                </div>

                <Button onClick={handleAddHabit} disabled={!newHabit.trim() || !selectedCategory}>
                  Add Habit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {habits.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Daily Progress</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <Progress value={getProgressPercentage()} />
            </div>
          )}

          <div className="space-y-2">
            {habits.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No habits added yet.</p>
                <p className="text-sm">Add a habit to start tracking your progress!</p>
              </div>
            ) : (
              habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Button
                      variant={habit.completed ? 'default' : 'outline'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleHabit(habit.id)}
                    >
                      {habit.completed ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                    <div>
                      <p className="font-medium">{habit.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {categories.find(c => c.value === habit.category)?.label}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {habit.streak > 0 && (
                      <div className="flex items-center gap-1 text-primary">
                        <Trophy className="h-4 w-4" />
                        <span className="text-sm font-medium">{habit.streak}</span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteHabit(habit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}