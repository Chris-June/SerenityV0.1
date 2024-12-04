import { useState, useEffect } from 'react';

// Define types for all our storable data
export interface MoodEntry {
  date: Date;
  value: number;
  notes?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  category: string;
  date: Date;
  lastEdited?: Date;
}

export interface MeditationSession {
  id: string;
  date: Date;
  duration: number; // in minutes
  type: string;
  completed: boolean;
}

export interface GoalEntry {
  id: string;
  title: string;
  description: string;
  deadline?: Date;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

interface AppData {
  moodEntries: MoodEntry[];
  journalEntries: JournalEntry[];
  meditationSessions: MeditationSession[];
  goals: GoalEntry[];
  lastSync?: Date;
}

const STORAGE_KEY = 'serenity-app-data';

const defaultAppData: AppData = {
  moodEntries: [],
  journalEntries: [],
  meditationSessions: [],
  goals: [],
};

export function useAppStorage() {
  const [appData, setAppData] = useState<AppData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return {
          ...parsed,
          moodEntries: parsed.moodEntries.map((entry: MoodEntry) => ({
            ...entry,
            date: new Date(entry.date),
          })),
          journalEntries: parsed.journalEntries.map((entry: JournalEntry) => ({
            ...entry,
            date: new Date(entry.date),
            lastEdited: entry.lastEdited ? new Date(entry.lastEdited) : undefined,
          })),
          meditationSessions: parsed.meditationSessions.map((session: MeditationSession) => ({
            ...session,
            date: new Date(session.date),
          })),
          goals: parsed.goals.map((goal: GoalEntry) => ({
            ...goal,
            deadline: goal.deadline ? new Date(goal.deadline) : undefined,
            createdAt: new Date(goal.createdAt),
            completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
          })),
          lastSync: parsed.lastSync ? new Date(parsed.lastSync) : undefined,
        };
      }
    } catch (error) {
      console.error('Error loading app data:', error);
    }
    return defaultAppData;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch (error) {
      console.error('Error saving app data:', error);
    }
  }, [appData]);

  // Mood tracking functions
  const addMoodEntry = (entry: Omit<MoodEntry, 'date'>) => {
    setAppData(prev => ({
      ...prev,
      moodEntries: [...prev.moodEntries, { ...entry, date: new Date() }],
    }));
  };

  // Journal functions
  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'date' | 'lastEdited'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      date: new Date(),
      lastEdited: new Date(),
    };
    setAppData(prev => ({
      ...prev,
      journalEntries: [...prev.journalEntries, newEntry],
    }));
  };

  // Meditation functions
  const addMeditationSession = (session: Omit<MeditationSession, 'id' | 'date'>) => {
    const newSession: MeditationSession = {
      ...session,
      id: crypto.randomUUID(),
      date: new Date(),
    };
    setAppData(prev => ({
      ...prev,
      meditationSessions: [...prev.meditationSessions, newSession],
    }));
  };

  // Goal tracking functions
  const addGoal = (goal: Omit<GoalEntry, 'id' | 'completed' | 'createdAt' | 'completedAt'>) => {
    const newGoal: GoalEntry = {
      ...goal,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date(),
    };
    setAppData(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
  };

  // Analytics functions
  const getAnalytics = () => {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      totalJournalEntries: appData.journalEntries.length,
      journalEntriesLast7Days: appData.journalEntries.filter(entry => entry.date >= last7Days).length,
      journalEntriesLast30Days: appData.journalEntries.filter(entry => entry.date >= last30Days).length,
      
      averageMoodLast7Days: calculateAverageMood(appData.moodEntries.filter(entry => entry.date >= last7Days)),
      averageMoodLast30Days: calculateAverageMood(appData.moodEntries.filter(entry => entry.date >= last30Days)),
      
      totalMeditationMinutes: appData.meditationSessions.reduce((acc, session) => acc + session.duration, 0),
      meditationSessionsLast7Days: appData.meditationSessions.filter(session => session.date >= last7Days).length,
      
      activeGoals: appData.goals.filter(goal => !goal.completed).length,
      completedGoalsLast30Days: appData.goals.filter(goal => goal.completed && goal.completedAt && goal.completedAt >= last30Days).length,
    };
  };

  const calculateAverageMood = (entries: MoodEntry[]) => {
    if (entries.length === 0) return 0;
    return entries.reduce((acc, entry) => acc + entry.value, 0) / entries.length;
  };

  return {
    appData,
    addMoodEntry,
    addJournalEntry,
    addMeditationSession,
    addGoal,
    getAnalytics,
  };
}
