import { useState } from "react";
import { Activity, Brain, Heart, Sun, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/context/ChatContext";

type MoodLevel = 1 | 2 | 3;

interface Strategy {
  icon: React.ElementType;
  title: string;
  mood: Record<MoodLevel, string[]>;
}

type Strategies = Record<string, Strategy>;

const strategies: Strategies = {
  physical: {
    icon: Activity,
    title: "Physical Activities",
    mood: {
      1: [
        "Take a gentle walk",
        "Do simple stretches",
        "Practice deep breathing",
        "Progressive muscle relaxation",
        "Light yoga poses",
      ],
      2: [
        "Go for a jog",
        "Try a home workout",
        "Dance to upbeat music",
        "Practice tai chi",
        "Bike ride",
      ],
      3: [
        "High-intensity workout",
        "Join a sports activity",
        "Try a new exercise class",
        "Go hiking",
        "Swimming",
      ],
    },
  },
  mental: {
    icon: Brain,
    title: "Mental Exercises",
    mood: {
      1: [
        "Simple breathing meditation",
        "Guided imagery",
        "Basic grounding exercises",
        "Counting techniques",
        "Mindful observation",
      ],
      2: [
        "Mindfulness meditation",
        "Gratitude journaling",
        "Positive affirmations",
        "Puzzle solving",
        "Reading",
      ],
      3: [
        "Learn something new",
        "Creative problem solving",
        "Memory exercises",
        "Language learning",
        "Strategic games",
      ],
    },
  },
  emotional: {
    icon: Heart,
    title: "Emotional Support",
    mood: {
      1: [
        "Call a trusted friend",
        "Write about feelings",
        "Self-compassion exercises",
        "Contact a support group",
        "Practice acceptance",
      ],
      2: [
        "Connect with friends",
        "Express creativity",
        "Practice empathy",
        "Join group activities",
        "Share experiences",
      ],
      3: [
        "Mentor others",
        "Volunteer",
        "Lead group activities",
        "Share success stories",
        "Support others",
      ],
    },
  },
  relaxation: {
    icon: Sun,
    title: "Relaxation Techniques",
    mood: {
      1: [
        "Deep breathing exercises",
        "Progressive relaxation",
        "Calming music",
        "Gentle stretching",
        "Warm bath",
      ],
      2: [
        "Guided meditation",
        "Nature sounds",
        "Light yoga",
        "Aromatherapy",
        "Mindful walking",
      ],
      3: [
        "Advanced meditation",
        "Create a relaxation space",
        "Teach relaxation to others",
        "Combine techniques",
        "Design a routine",
      ],
    },
  },
  creative: {
    icon: Book,
    title: "Creative Activities",
    mood: {
      1: [
        "Simple coloring",
        "Doodling",
        "Listen to music",
        "Gentle crafts",
        "Nature photography",
      ],
      2: [
        "Drawing",
        "Journal writing",
        "Playlist creation",
        "Basic crafting",
        "Poetry writing",
      ],
      3: [
        "Art projects",
        "Story writing",
        "Music composition",
        "Complex crafts",
        "Digital creation",
      ],
    },
  },
};

export function CopingStrategies() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof strategies>("physical");
  const { state } = useChat();

  // Get the most recent mood value or default to 2 (okay)
  const currentMoodValue = (state.moods.length > 0 ? state.moods[state.moods.length - 1].value : 2) as MoodLevel;

  const moodLevels: MoodLevel[] = [1, 2, 3];

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Category Navigation */}
      <Card className="border-b">
        <CardHeader>
          <CardTitle>Personalized Coping Strategies</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <ScrollArea className="w-full" orientation="horizontal">
            <div className="flex space-x-2">
              {Object.entries(strategies).map(([key, { icon: Icon, title }]) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  className="flex-shrink-0 flex items-center gap-2"
                  onClick={() => setSelectedCategory(key as keyof typeof strategies)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{title}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Strategies Content */}
      <div className="space-y-6">
        {/* Current Mood Strategies */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Recommended for Your Current Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {strategies[selectedCategory].mood[currentMoodValue].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Mood Levels */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">All {strategies[selectedCategory].title} Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {moodLevels.map((moodLevel) => (
                <div key={moodLevel} className="space-y-2">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    {moodLevel === 1 ? "When feeling down" : 
                     moodLevel === 2 ? "When feeling okay" : 
                     "When feeling great"}
                  </h3>
                  <div className="space-y-2">
                    {strategies[selectedCategory].mood[moodLevel].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
