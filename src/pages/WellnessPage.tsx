import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AffirmationCard } from '@/components/AffirmationCard';
import { SelfCareReminders } from '@/components/SelfCareReminders';
import { SleepTracker } from '@/components/SleepTracker';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

export function WellnessPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'affirmations';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  useEffect(() => {
    // Validate tab parameter
    if (!['affirmations', 'selfcare', 'sleep'].includes(currentTab)) {
      setSearchParams({ tab: 'affirmations' });
    }
  }, [currentTab, setSearchParams]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight">Wellness Center</h1>
        <p className="text-muted-foreground">
          Track and improve your overall well-being with personalized tools and insights.
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="affirmations">Affirmation Cards</TabsTrigger>
          <TabsTrigger value="selfcare">Self-Care Reminders</TabsTrigger>
          <TabsTrigger value="sleep">Sleep Tracker</TabsTrigger>
        </TabsList>

        <TabsContent value="affirmations" className="space-y-4">
          <div className="max-w-xl mx-auto">
            <AffirmationCard />
          </div>
        </TabsContent>

        <TabsContent value="selfcare" className="space-y-4">
          <SelfCareReminders />
        </TabsContent>

        <TabsContent value="sleep" className="space-y-4">
          <SleepTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
}
