import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, ChevronRight, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

const prompts = [
  "What's something that made you smile today?",
  "Who is someone you're grateful to have in your life?",
  "What's a simple pleasure you enjoyed recently?",
  "What's something you're looking forward to?",
  "What's a challenge you've overcome that you're grateful for?",
  "What's something about your body or health you appreciate?",
  "What's a skill or ability you're thankful to have?",
  "What's something in nature that brings you joy?",
  "What's a memory you're grateful to have?",
  "What's something you like about yourself?"
];

interface GratitudeEntry {
  prompt: string;
  response: string;
  timestamp: Date;
}

export function GratitudePractice() {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const handleNext = () => {
    if (response.trim()) {
      const newEntry = {
        prompt: prompts[currentPromptIndex],
        response: response.trim(),
        timestamp: new Date(),
      };
      setEntries([...entries, newEntry]);
      setResponse('');

      if (currentPromptIndex < prompts.length - 1) {
        setCurrentPromptIndex(currentPromptIndex + 1);
      } else {
        setIsComplete(true);
      }
    }
  };

  const handleReset = () => {
    setCurrentPromptIndex(0);
    setResponse('');
    setIsComplete(false);
  };

  const handleSave = () => {
    const gratitudeData = {
      date: new Date().toISOString(),
      entries: entries,
    };
    
    // Save to localStorage
    const savedEntries = JSON.parse(localStorage.getItem('gratitudeEntries') || '[]');
    savedEntries.push(gratitudeData);
    localStorage.setItem('gratitudeEntries', JSON.stringify(savedEntries));

    // You could also save to a backend here
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)]">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="rounded-lg bg-primary/10 p-3 w-fit mx-auto mb-4">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4 animate-text bg-gradient-to-r from-primary via-emerald-500 via-teal-400 to-primary bg-clip-text text-transparent bg-300%">
          Gratitude Practice
        </h1>
        <p className="text-xl text-muted-foreground">
          Take a moment to reflect on the things you're grateful for.
        </p>
      </motion.div>

      {!isComplete ? (
        <motion.div
          className="max-w-2xl mx-auto rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] p-6 md:p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center mb-8">
            <div className="text-sm text-muted-foreground mb-2">
              Prompt {currentPromptIndex + 1} of {prompts.length}
            </div>
            <h2 className="text-2xl font-semibold">
              {prompts[currentPromptIndex]}
            </h2>
          </div>

          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Write your response here..."
            className="min-h-[200px] mb-6 w-full"
          />

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleNext}
              disabled={!response.trim()}
              className="min-w-[120px]"
            >
              {currentPromptIndex < prompts.length - 1 ? (
                <>
                  Next <ChevronRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                'Complete'
              )}
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="max-w-2xl mx-auto space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Practice Complete! 🎉
            </h2>
            <p className="text-muted-foreground">
              Here are your gratitude reflections:
            </p>
          </div>

          <div className="grid gap-4">
            {entries.map((entry, index) => (
              <Card key={index} className="p-6">
                <div className="text-sm text-muted-foreground mb-2">
                  {entry.prompt}
                </div>
                <div className="text-lg">{entry.response}</div>
              </Card>
            ))}
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <Button
              size="lg"
              onClick={handleSave}
              className="min-w-[160px]"
            >
              <Save className="mr-2 h-5 w-5" />
              Save Entries
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleReset}
              className="min-w-[160px]"
            >
              Start New Practice
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
