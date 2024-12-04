import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JournalEntry } from "@/hooks/use-journal-storage";
import { Activity, BookOpen, Calendar, Tag } from "lucide-react";
import { subDays } from "date-fns";

interface JournalStatsProps {
  entries: JournalEntry[];
}

export function JournalStats({ entries }: JournalStatsProps) {
  // Calculate statistics
  const totalEntries = entries.length;
  const uniqueTags = new Set(entries.flatMap(entry => entry.tags)).size;
  const uniqueCategories = new Set(entries.map(entry => entry.category)).size;

  // Calculate streak
  let currentStreak = 0;
  let maxStreak = 0;
  let lastDate: Date | null = null;

  // Sort entries by date in descending order
  const sortedEntries = [...entries].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Calculate entries in last 7 days
  const last7Days = subDays(new Date(), 7);
  const entriesLast7Days = entries.filter(entry => 
    entry.date >= last7Days
  ).length;

  // Calculate average entries per week
  const firstEntry = sortedEntries[sortedEntries.length - 1];
  const lastEntry = sortedEntries[0];
  let averageEntriesPerWeek = 0;

  if (firstEntry && lastEntry) {
    const totalDays = Math.ceil((lastEntry.date.getTime() - firstEntry.date.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.max(1, Math.ceil(totalDays / 7));
    averageEntriesPerWeek = Math.round((totalEntries / totalWeeks) * 10) / 10;
  }

  // Calculate writing streak
  sortedEntries.forEach(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);

    if (!lastDate) {
      currentStreak = 1;
      maxStreak = 1;
      lastDate = entryDate;
      return;
    }

    const lastDateTime = lastDate.getTime();
    const entryDateTime = entryDate.getTime();
    const dayDifference = Math.floor((lastDateTime - entryDateTime) / (1000 * 60 * 60 * 24));

    if (dayDifference === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (dayDifference > 1) {
      currentStreak = 1;
    }

    lastDate = entryDate;
  });

  const stats = [
    {
      title: "Total Entries",
      value: totalEntries,
      description: `${entriesLast7Days} in last 7 days`,
      icon: BookOpen,
    },
    {
      title: "Current Streak",
      value: `${currentStreak} days`,
      description: `Longest: ${maxStreak} days`,
      icon: Activity,
    },
    {
      title: "Weekly Average",
      value: averageEntriesPerWeek,
      description: "Entries per week",
      icon: Calendar,
    },
    {
      title: "Categories & Tags",
      value: uniqueCategories,
      description: `${uniqueTags} unique tags`,
      icon: Tag,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
