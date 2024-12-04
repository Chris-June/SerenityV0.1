import { useAppStorage } from "@/hooks/use-app-storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { Activity, BookOpen, Brain, Calendar } from 'lucide-react';

export function InsightsPage() {
  const { appData, getAnalytics } = useAppStorage();
  const analytics = getAnalytics();

  // Prepare mood trend data
  const thirtyDaysAgo = subDays(new Date(), 30);
  const moodTrendData = appData.moodEntries
    .filter(entry => entry.date >= thirtyDaysAgo)
    .map(entry => ({
      date: format(entry.date, 'MMM dd'),
      mood: entry.value
    }));

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground">
          Track your progress and discover patterns in your wellness journey.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Journal Entries
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalJournalEntries}</div>
            <p className="text-xs text-muted-foreground">
              +{analytics.journalEntriesLast7Days} in last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Mood
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.averageMoodLast7Days.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 7 days average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Meditation Minutes
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalMeditationMinutes}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.meditationSessionsLast7Days} sessions this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Goals
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeGoals}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.completedGoalsLast30Days} completed in 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mood Trends */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Mood Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodTrendData}>
                <XAxis 
                  dataKey="date" 
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
                  domain={[0, 3]}
                  ticks={[1, 2, 3]}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="mood"
                  strokeWidth={2}
                  stroke="hsl(var(--primary))"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
