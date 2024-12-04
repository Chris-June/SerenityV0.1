import { useState, useEffect } from 'react';
import { Bell, Check, Clock, Droplets, Brain, Heart, Sun } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Reminder {
  id: string;
  title: string;
  description: string;
  icon: typeof Bell;
  interval: number; // in minutes
  lastTriggered?: Date;
  enabled: boolean;
}

const defaultReminders: Reminder[] = [
  {
    id: 'water',
    title: 'Hydration Check',
    description: 'Take a moment to drink some water',
    icon: Droplets,
    interval: 60, // every hour
    enabled: true,
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness Break',
    description: 'Take 3 deep breaths and center yourself',
    icon: Brain,
    interval: 120, // every 2 hours
    enabled: true,
  },
  {
    id: 'movement',
    title: 'Movement Break',
    description: 'Stand up and stretch for a minute',
    icon: Heart,
    interval: 90, // every 1.5 hours
    enabled: true,
  },
  {
    id: 'sunlight',
    title: 'Natural Light',
    description: 'Get some natural light if possible',
    icon: Sun,
    interval: 180, // every 3 hours
    enabled: true,
  },
];

export function SelfCareReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(defaultReminders);
  const [nextReminder, setNextReminder] = useState<Reminder | null>(null);
  const { toast } = useToast();

  const calculateNextReminder = () => {
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
          // Trigger reminder
          toast({
            title: reminder.title,
            description: reminder.description,
            duration: 10000,
          });

          // Update last triggered time
          setReminders(prev => prev.map(r => 
            r.id === reminder.id ? { ...r, lastTriggered: now } : r
          ));
        }
      });

      calculateNextReminder();
    }, 60000);

    return () => clearInterval(interval);
  }, [reminders, toast]);

  useEffect(() => {
    calculateNextReminder();
  }, [reminders]);

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    ));
  };

  const getTimeUntilNext = (reminder: Reminder) => {
    if (!reminder.lastTriggered) return 'Due now';
    
    const lastTriggered = new Date(reminder.lastTriggered);
    const nextTrigger = new Date(lastTriggered.getTime() + reminder.interval * 60000);
    const timeUntilNext = nextTrigger.getTime() - new Date().getTime();
    
    if (timeUntilNext <= 0) return 'Due now';
    
    const minutes = Math.floor(timeUntilNext / 60000);
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Self-Care Reminders
          </span>
          {nextReminder && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Next: {getTimeUntilNext(nextReminder)}</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reminders.map((reminder) => {
            const Icon = reminder.icon;
            return (
              <div
                key={reminder.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg transition-colors",
                  reminder.enabled ? "bg-muted/50" : "bg-background"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-full",
                    reminder.enabled ? "bg-primary/10" : "bg-muted"
                  )}>
                    <Icon className={cn(
                      "h-4 w-4",
                      reminder.enabled ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div>
                    <h4 className="font-medium">{reminder.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Every {reminder.interval / 60} hours
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {reminder.lastTriggered && reminder.enabled && (
                    <span className="text-sm text-muted-foreground">
                      {getTimeUntilNext(reminder)}
                    </span>
                  )}
                  <Switch
                    checked={reminder.enabled}
                    onCheckedChange={() => toggleReminder(reminder.id)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}