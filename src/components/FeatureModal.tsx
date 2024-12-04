import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFeatureModal } from '@/hooks/use-feature-modal';
import { MoodTracker } from '@/components/MoodTracker';
import { BreathingExercise } from '@/components/BreathingExercise';
import { CopingStrategies } from '@/components/CopingStrategies';
import { HabitTracker } from '@/components/HabitTracker';
import { AffirmationCard } from '@/components/AffirmationCard';
import { SelfCareReminders } from '@/components/SelfCareReminders';
import { SleepTracker } from '@/components/SleepTracker';
import { EmergencyResources } from '@/components/EmergencyResources';

const featureComponents: Record<string, {
  component: React.ComponentType;
  title: string;
  scrollable?: boolean;
}> = {
  mood: {
    component: MoodTracker,
    title: 'Mood Tracker',
  },
  breathing: {
    component: BreathingExercise,
    title: 'Breathing Exercise',
  },
  coping: {
    component: CopingStrategies,
    title: 'Coping Strategies',
  },
  habits: {
    component: HabitTracker,
    title: 'Habit Tracker',
  },
  affirmations: {
    component: AffirmationCard,
    title: 'Daily Affirmations',
  },
  selfcare: {
    component: SelfCareReminders,
    title: 'Self-Care Reminders',
  },
  sleep: {
    component: SleepTracker,
    title: 'Sleep Analysis',
    scrollable: true,
  },
  emergency: {
    component: EmergencyResources,
    title: 'Emergency Resources',
  },
};

export function FeatureModal() {
  const { isOpen, feature, closeModal } = useFeatureModal();
  const featureData = feature ? featureComponents[feature] : null;
  const Component = featureData?.component;
  const title = featureData?.title || '';
  const isScrollable = featureData?.scrollable || false;

  if (!Component) return null;

  const content = isScrollable ? (
    <ScrollArea className="h-[80vh]">
      <Component />
    </ScrollArea>
  ) : (
    <Component />
  );

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Access and manage your {title.toLowerCase()} settings and activities.
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}