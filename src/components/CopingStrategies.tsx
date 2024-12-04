import { useState } from "react";
import { Activity, Brain, Heart, Sun, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/context/ChatContext";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col space-y-6 p-4 max-h-[80vh]">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-1">Coping Strategies</h2>
        <p className="text-sm text-muted-foreground">Select a category to view personalized strategies</p>
      </div>

      <div className="grid md:grid-cols-[200px,1fr] gap-6">
        {/* Category Navigation - Vertical */}
        <div className="space-y-2">
          {Object.entries(strategies).map(([key, { icon: Icon, title }]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              className={cn(
                "w-full justify-start gap-2",
                selectedCategory === key && "bg-primary text-primary-foreground"
              )}
              onClick={() => setSelectedCategory(key as keyof typeof strategies)}
            >
              <Icon className="h-4 w-4" />
              <span>{title}</span>
            </Button>
          ))}
        </div>

        {/* Strategies Content */}
        <ScrollArea className="h-[calc(80vh-8rem)]">
          <div className="space-y-6 pr-4">
            {/* Current Mood Strategies */}
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {(() => {
                    const Icon = strategies[selectedCategory].icon;
                    return <Icon className="h-5 w-5" />;
                  })()}
                  Recommended for Your Current Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {strategies[selectedCategory].mood[currentMoodValue].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
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
                <CardTitle className="text-lg">All {strategies[selectedCategory].title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {moodLevels.map((moodLevel) => (
                    <div key={moodLevel} className="space-y-3">
                      <h3 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          moodLevel === 1 ? "bg-red-500" :
                          moodLevel === 2 ? "bg-yellow-500" :
                          "bg-green-500"
                        )} />
                        {moodLevel === 1 ? "When feeling down" : 
                         moodLevel === 2 ? "When feeling okay" : 
                         "When feeling great"}
                      </h3>
                      <div className="grid gap-2">
                        {strategies[selectedCategory].mood[moodLevel].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-lg bg-card hover:bg-accent transition-colors"
                          >
                            <div className={cn(
                              "h-2 w-2 rounded-full",
                              moodLevel === 1 ? "bg-red-500" :
                              moodLevel === 2 ? "bg-yellow-500" :
                              "bg-green-500"
                            )} />
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
        </ScrollArea>
      </div>
    </div>
  );
}
