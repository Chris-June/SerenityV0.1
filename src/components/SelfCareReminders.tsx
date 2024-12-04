import { 
  Droplets, Wind, Eye, Activity, Dumbbell, 
  Footprints, Brain, Heart, Leaf, Pencil, Smile, 
  Book, Palette, BookOpen, Phone, Laugh, Sun, 
  Mountain, Cloud, Settings2
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Reminder {
  id: string;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  interval: number; // in minutes
  lastTriggered?: Date;
  enabled: boolean;
  notificationsEnabled: boolean;
}

// All available reminders that users can choose from
const reminderLibrary: Omit<Reminder, 'enabled' | 'notificationsEnabled' | 'lastTriggered'>[] = [
  // Physical Health
  {
    id: 'water',
    title: 'Hydration Check',
    description: 'Take a moment to drink some water',
    icon: Droplets,
    interval: 60,
  },
  {
    id: 'posture',
    title: 'Posture Check',
    description: 'Check and adjust your posture if needed',
    icon: Wind,
    interval: 45,
  },
  {
    id: 'eyerest',
    title: 'Eye Rest',
    description: 'Look away from screen for 20 seconds (20-20-20 rule)',
    icon: Eye,
    interval: 20,
  },
  {
    id: 'stretch',
    title: 'Quick Stretch',
    description: 'Do some quick stretches for your neck and shoulders',
    icon: Activity,
    interval: 90,
  },
  {
    id: 'exercise',
    title: 'Exercise Reminder',
    description: 'Time for a quick workout or walk',
    icon: Dumbbell,
    interval: 240,
  },
  {
    id: 'walk',
    title: 'Walking Break',
    description: 'Take a short walk to refresh your mind',
    icon: Footprints,
    interval: 180,
  },

  // Mental Wellness
  {
    id: 'mindfulness',
    title: 'Mindfulness Break',
    description: 'Take 3 deep breaths and center yourself',
    icon: Brain,
    interval: 120,
  },
  {
    id: 'gratitude',
    title: 'Gratitude Moment',
    description: "Think of one thing you're grateful for today",
    icon: Heart,
    interval: 240,
  },
  {
    id: 'meditation',
    title: 'Mini Meditation',
    description: 'Take a 2-minute meditation break',
    icon: Leaf,
    interval: 180,
  },
  {
    id: 'journaling',
    title: 'Journal Prompt',
    description: 'Write down your thoughts or feelings',
    icon: Pencil,
    interval: 360,
  },
  {
    id: 'affirmation',
    title: 'Daily Affirmation',
    description: 'Repeat your personal affirmation',
    icon: Smile,
    interval: 480,
  },

  // Creative & Learning
  {
    id: 'reading',
    title: 'Reading Time',
    description: 'Take a moment to read something inspiring',
    icon: Book,
    interval: 240,
  },
  {
    id: 'creativity',
    title: 'Creative Break',
    description: 'Engage in a quick creative activity',
    icon: Palette,
    interval: 300,
  },
  {
    id: 'learning',
    title: 'Learning Moment',
    description: 'Learn something new today',
    icon: BookOpen,
    interval: 480,
  },

  // Social & Emotional
  {
    id: 'connect',
    title: 'Social Connection',
    description: 'Reach out to a friend or family member',
    icon: Phone,
    interval: 480,
  },
  {
    id: 'kindness',
    title: 'Random Act of Kindness',
    description: 'Do something kind for someone',
    icon: Heart,
    interval: 480,
  },
  {
    id: 'laugh',
    title: 'Laughter Break',
    description: 'Watch or read something funny',
    icon: Laugh,
    interval: 240,
  },

  // Environment & Nature
  {
    id: 'sunlight',
    title: 'Natural Light',
    description: 'Get some natural light if possible',
    icon: Sun,
    interval: 180,
  },
  {
    id: 'plants',
    title: 'Plant Check',
    description: 'Check on or water your plants',
    icon: Leaf,
    interval: 1440,
  },
  {
    id: 'outdoor',
    title: 'Outdoor Time',
    description: 'Spend a few minutes outside',
    icon: Mountain,
    interval: 240,
  },
  {
    id: 'weather',
    title: 'Weather Check',
    description: 'Check the weather and plan accordingly',
    icon: Cloud,
    interval: 360,
  },

  // Nutrition & Energy
  {
    id: 'snack',
    title: 'Healthy Snack',
    description: 'Have a nutritious snack if needed',
    icon: undefined,
    interval: 180,
  },
  {
    id: 'caffeine',
    title: 'Caffeine Check',
    description: "Consider switching to water if it's late in the day",
    icon: undefined,
    interval: 240,
  },
  {
    id: 'meal',
    title: 'Regular Meals',
    description: "Don't skip your meals - take time to eat mindfully",
    icon: undefined,
    interval: 240,
  },
  {
    id: 'energy',
    title: 'Energy Check',
    description: 'Assess your energy levels and take action',
    icon: undefined,
    interval: 180,
  },

  // Evening Routine
  {
    id: 'winddown',
    title: 'Evening Wind Down',
    description: 'Start preparing for rest - dim lights, relax',
    icon: undefined,
    interval: 1440,
  },
  {
    id: 'relaxation',
    title: 'Relaxation Time',
    description: 'Do something relaxing before bed',
    icon: undefined,
    interval: 1440,
  },
];

// Initial default reminders (subset of library)
const defaultReminders: Reminder[] = reminderLibrary
  .slice(0, 8)
  .map(reminder => ({
    ...reminder,
    enabled: true,
    notificationsEnabled: false,
  }));

const timeIntervals = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' },
  { value: '120', label: '2 hours' },
  { value: '180', label: '3 hours' },
  { value: '240', label: '4 hours' },
  { value: '360', label: '6 hours' },
  { value: '480', label: '8 hours' },
  { value: '720', label: '12 hours' },
  { value: '1440', label: '24 hours' },
];

export function SelfCareReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(defaultReminders);
  const [nextReminder, setNextReminder] = useState<Reminder | null>(null);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const { toast } = useToast();

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  const sendNotification = useCallback((reminder: Reminder) => {
    if ('Notification' in window && Notification.permission === 'granted' && reminder.notificationsEnabled) {
      new Notification(reminder.title, {
        body: reminder.description,
        icon: '/favicon.ico', // Add your app icon path here
      });
    }
  }, []);

  const calculateNextReminder = useCallback(() => {
    const now = new Date();
    let nextRem: Reminder | null = null;
    let earliestTime = Infinity;

    reminders.forEach(reminder => {
      if (!reminder.enabled) return;

      const lastTriggered = reminder.lastTriggered ? new Date(reminder.lastTriggered) : new Date(0);
      const nextTrigger = new Date(lastTriggered.getTime() + reminder.interval * 60000);
      const timeUntilNext = nextTrigger.getTime() - now.getTime();

      if (timeUntilNext < earliestTime && timeUntilNext > 0) {
        earliestTime = timeUntilNext;
        nextRem = reminder;
      }
    });

    setNextReminder(nextRem);
  }, [reminders, setNextReminder]);

  const handleIntervalChange = (reminderId: string, value: string) => {
    const newInterval = parseInt(value);
    if (!isNaN(newInterval)) {
      setReminders(prev => prev.map(r => 
        r.id === reminderId ? { ...r, interval: newInterval } : r
      ));
    }
  };

  const toggleNotifications = (reminderId: string) => {
    setReminders(prev => prev.map(r => 
      r.id === reminderId ? { ...r, notificationsEnabled: !r.notificationsEnabled } : r
    ));
  };

  useEffect(() => {
    // Check for reminders every minute
    const interval = setInterval(() => {
      const now = new Date();
      
      reminders.forEach(reminder => {
        if (!reminder.enabled) return;

        const lastTriggered = reminder.lastTriggered ? new Date(reminder.lastTriggered) : new Date(0);
        const timeSinceLastTrigger = now.getTime() - lastTriggered.getTime();
        
        if (timeSinceLastTrigger >= reminder.interval * 60000) {
          // Send both toast and push notification
          toast({
            title: reminder.title,
            description: reminder.description,
            duration: 10000,
          });

          sendNotification(reminder);

          // Update last triggered time
          setReminders(prev => prev.map(r => 
            r.id === reminder.id ? { ...r, lastTriggered: now } : r
          ));
        }
      });

      calculateNextReminder();
    }, 60000);

    return () => clearInterval(interval);
  }, [reminders, toast, sendNotification, calculateNextReminder]);

  useEffect(() => {
    calculateNextReminder();
  }, [calculateNextReminder]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Self-Care Reminders</h2>
        <div className="flex space-x-2">
          <Dialog open={showLibrary} onOpenChange={setShowLibrary}>
            <DialogTrigger asChild>
              <Button variant="outline">
                Add Reminder
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Reminders</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                {reminderLibrary
                  .filter(libReminder => !reminders.some(r => r.id === libReminder.id))
                  .map(reminder => (
                    <Card 
                      key={reminder.id}
                      className={cn("cursor-pointer hover:bg-muted/50 transition-colors")}
                      onClick={() => {
                        setReminders(prev => [...prev, {
                          ...reminder,
                          enabled: true,
                          notificationsEnabled: false,
                        }]);
                        toast({
                          title: "Reminder Added",
                          description: `Added ${reminder.title} to your reminders`,
                        });
                      }}
                    >
                      <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2")}>
                        <CardTitle className={cn("text-sm font-medium")}>
                          <div className={cn("flex items-center space-x-2")}>
                            {reminder.icon && <reminder.icon className={cn("h-4 w-4")} />}
                            <span>{reminder.title}</span>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className={cn("space-y-1")}>
                        <p className={cn("text-sm text-muted-foreground")}>{reminder.description}</p>
                        <p className={cn("text-xs text-muted-foreground mt-2")}>
                          Default interval: {reminder.interval} minutes
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Reminder Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 overflow-y-auto">
                {reminders.map(reminder => (
                  <div 
                    key={reminder.id} 
                    className={cn(
                      "flex items-center justify-between space-x-4 p-4 rounded-lg",
                      "bg-muted/50",
                      reminder.enabled ? "border-2 border-primary" : ""
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      {reminder.icon && <reminder.icon className="h-5 w-5" />}
                      <div>
                        <h4 className="font-medium">{reminder.title}</h4>
                        <p className="text-sm text-muted-foreground">{reminder.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">Interval (minutes)</span>
                        <Select
                          value={reminder.interval.toString()}
                          onValueChange={(value) => handleIntervalChange(reminder.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Select interval" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeIntervals.map(interval => (
                              <SelectItem key={interval.value} value={interval.value}>
                                {interval.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">Notifications</span>
                        <Switch
                          checked={reminder.notificationsEnabled}
                          onCheckedChange={() => toggleNotifications(reminder.id)}
                        />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setEditingReminder(reminder)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {reminders.map(reminder => (
          <Card key={reminder.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="flex items-center space-x-2">
                  {reminder.icon && <reminder.icon className="h-4 w-4" />}
                  <span>{reminder.title}</span>
                </div>
              </CardTitle>
              <Switch
                checked={reminder.enabled}
                onCheckedChange={() =>
                  setReminders(prev =>
                    prev.map(r =>
                      r.id === reminder.id ? { ...r, enabled: !r.enabled } : r
                    )
                  )
                }
              />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {reminder.description}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Interval: {reminder.interval} minutes
                {reminder.lastTriggered && (
                  <> | Last triggered: {new Date(reminder.lastTriggered).toLocaleTimeString()}</>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {nextReminder && (
        <div className="text-sm text-muted-foreground">
          Next reminder: {nextReminder.title} in{' '}
          {Math.round(
            (new Date(nextReminder.lastTriggered!).getTime() +
              nextReminder.interval * 60000 -
              new Date().getTime()) /
              60000
          )}{' '}
          minutes
        </div>
      )}
      <Dialog 
        open={editingReminder !== null} 
        onOpenChange={() => setEditingReminder(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Reminder</DialogTitle>
          </DialogHeader>
          {editingReminder && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input 
                  value={editingReminder.title}
                  onChange={(e) => setEditingReminder(prev => 
                    prev ? { ...prev, title: e.target.value } : null
                  )}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  value={editingReminder.description}
                  onChange={(e) => setEditingReminder(prev => 
                    prev ? { ...prev, description: e.target.value } : null
                  )}
                />
              </div>
              <div>
                <Label>Interval</Label>
                <Select
                  value={editingReminder.interval.toString()}
                  onValueChange={(value) => setEditingReminder(prev => 
                    prev ? { ...prev, interval: parseInt(value) } : null
                  )}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeIntervals.map(interval => (
                      <SelectItem key={interval.value} value={interval.value}>
                        {interval.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setEditingReminder(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    if (editingReminder) {
                      setReminders(prev => 
                        prev.map(r => 
                          r.id === editingReminder.id ? editingReminder : r
                        )
                      );
                      setEditingReminder(null);
                    }
                  }}
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}