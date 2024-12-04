import { useState, useEffect, useCallback } from 'react';
import { Smile, Meh, Frown, TrendingUp, Calendar, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStorage } from '@/hooks/use-app-storage';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

export function MoodTracker() {
  const { appData, addMoodEntry } = useAppStorage();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);

  const moods = [
    { 
      value: 1, 
      icon: Frown, 
      label: 'Struggling',
      color: 'from-red-500/10 to-red-500/5',
      strategies: [
        'Practice deep breathing exercises',
        'Call a trusted friend or family member',
        'Use grounding techniques (5-4-3-2-1 method)',
        'Take a gentle walk outside',
        'Write in your journal'
      ]
    },
    { 
      value: 2, 
      icon: Meh, 
      label: 'Okay',
      color: 'from-yellow-500/10 to-yellow-500/5',
      strategies: [
        'Practice mindfulness meditation',
        'Create a gratitude list',
        'Listen to uplifting music',
        'Do light exercise',
        'Engage in a creative activity'
      ]
    },
    { 
      value: 3, 
      icon: Smile, 
      label: 'Good',
      color: 'from-green-500/10 to-green-500/5',
      strategies: [
        'Set goals for tomorrow',
        'Help someone else',
        'Try something new',
        'Practice a hobby',
        'Share your positive experience'
      ]
    },
  ];

  const generateInsights = useCallback(() => {
    const recentMoods = appData.moodEntries.slice(-7);
    const averageMood = recentMoods.reduce((acc, mood) => acc + mood.value, 0) / recentMoods.length;
    const moodTrend = recentMoods[recentMoods.length - 1].value - recentMoods[0].value;

    const newInsights = [];
    
    if (moodTrend > 0) {
      newInsights.push("Your mood has been improving over the past week! Keep up the great work!");
    } else if (moodTrend < 0) {
      newInsights.push("Your mood has dipped recently. Consider trying some of the suggested coping strategies.");
    }

    if (averageMood > 2.5) {
      newInsights.push("You've maintained a positive mood overall. What strategies have been working well for you?");
    }

    const consistentTime = recentMoods.every((mood, i, arr) => {
      if (i === 0) return true;
      const prevTime = new Date(arr[i-1].date).getHours();
      const currentTime = new Date(mood.date).getHours();
      return Math.abs(prevTime - currentTime) <= 2;
    });

    if (consistentTime) {
      newInsights.push("You've been consistent with your mood tracking. This helps build a more accurate picture of your well-being.");
    }

    setInsights(newInsights);
  }, [appData.moodEntries]);

  useEffect(() => {
    if (appData.moodEntries.length >= 3) {
      generateInsights();
    }
  }, [generateInsights, appData.moodEntries]);

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
    addMoodEntry({ value });
  };

  const chartData = appData.moodEntries
    .slice(-7)
    .map(entry => ({
      value: entry.value,
      formattedDate: format(new Date(entry.date), 'MM/dd'),
    }));

  // Add empty entries for missing days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const formattedDate = format(date, 'MM/dd');
    const existingEntry = chartData.find(entry => entry.formattedDate === formattedDate);
    return existingEntry || { formattedDate, value: null };
  }).reverse();

  const getCurrentMood = () => moods.find((m) => m.value === selectedMood);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>How are you feeling?</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReport(!showReport)}
            >
              {showReport ? <Calendar className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showReport ? (
            <div className="space-y-6">
              <div className="flex justify-center gap-4">
                {moods.map(({ value, icon: Icon, label, color }) => (
                  <Button
                    key={value}
                    variant={selectedMood === value ? 'default' : 'outline'}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 h-auto relative group",
                      selectedMood === value && "ring-2 ring-primary"
                    )}
                    onClick={() => handleMoodSelect(value)}
                  >
                    <div className={cn(
                      "absolute inset-0 rounded-lg bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity",
                      color
                    )} />
                    <Icon className="h-6 w-6 relative z-10" />
                    <span className="text-sm relative z-10">{label}</span>
                  </Button>
                ))}
              </div>

              {selectedMood && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Personalized Strategies</h4>
                  </div>
                  <div className="grid gap-2">
                    {getCurrentMood()?.strategies.map((strategy, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>{strategy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={last7Days}>
                    <XAxis
                      dataKey="formattedDate"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={[1, 3]}
                      ticks={[1, 2, 3]}
                      tickFormatter={(value) => 
                        moods.find(m => m.value === value)?.label || ''
                      }
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const mood = moods.find(
                            m => m.value === payload[0].value
                          );
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="flex items-center gap-2">
                                {mood && <mood.icon className="h-4 w-4" />}
                                <span className="font-medium">
                                  {mood?.label}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {payload[0].payload.formattedDate}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{
                        r: 4,
                        fill: "hsl(var(--background))",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {insights.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Mood Insights
                  </h4>
                  {insights.map((insight, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-muted/50 text-sm"
                    >
                      {insight}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}