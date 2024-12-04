import { useState, useEffect } from 'react';
import { format } from 'date-fns';

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

export type NewJournalEntry = Omit<JournalEntry, 'id' | 'date' | 'lastEdited'>;

const STORAGE_KEY = 'serenity-journal-entries';

export const DEFAULT_CATEGORIES = [
  'Personal',
  'Work',
  'Health',
  'Goals',
  'Gratitude',
  'Reflection',
  'Therapy',
  'Dreams',
  'Other'
] as const;

export function useJournalStorage() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored, (key, value) => 
          key === 'date' || key === 'lastEdited' ? new Date(value) : value
        );
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving journal entries:', error);
    }
  }, [entries]);

  const addEntry = (entry: NewJournalEntry) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date(),
      tags: entry.tags || [],
      category: entry.category || 'Other',
    };
    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  };

  const updateEntry = (id: string, updates: Partial<Omit<JournalEntry, 'id' | 'date'>>) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id 
          ? { 
              ...entry, 
              ...updates, 
              lastEdited: new Date(),
              tags: updates.tags || entry.tags,
              category: updates.category || entry.category,
            } 
          : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const getAllTags = (): string[] => {
    const tagSet = new Set<string>();
    entries.forEach(entry => {
      entry.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };

  const exportEntries = () => {
    try {
      const dataStr = JSON.stringify(entries, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `journal-entries-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting journal entries:', error);
      throw error;
    }
  };

  const importEntries = async (file: File) => {
    try {
      const text = await file.text();
      const imported = JSON.parse(text, (key, value) => 
        key === 'date' || key === 'lastEdited' ? new Date(value) : value
      );
      
      if (!Array.isArray(imported)) {
        throw new Error('Invalid journal data format');
      }

      setEntries(prev => {
        const newEntries = [...prev];
        imported.forEach(entry => {
          // Ensure imported entries have required fields
          entry.tags = entry.tags || [];
          entry.category = entry.category || 'Other';
          
          if (!newEntries.some(e => e.id === entry.id)) {
            newEntries.unshift(entry);
          }
        });
        return newEntries;
      });
    } catch (error) {
      console.error('Error importing journal entries:', error);
      throw error;
    }
  };

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    exportEntries,
    importEntries,
    getAllTags,
  };
}
