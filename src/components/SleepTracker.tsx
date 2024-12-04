import { useState } from "react";
import { Moon, CloudMoon, Clock, Star, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAnimationFocus } from "@/hooks/use-animation-focus";

interface SleepEntry {
  date: Date;
  duration: number;
  quality: number;
  notes: string[];
}

const relaxationStories = [
  {
    title: "Peaceful Forest Walk",
    content:
      "Imagine yourself walking through a serene forest. The gentle rustling of leaves in the breeze creates a soothing melody. Sunlight filters through the canopy above, creating dancing patterns on the soft earth beneath your feet. The air is crisp and clean, filled with the fresh scent of pine and wildflowers.",
    duration: "10 min",
  },
  {
    title: "Ocean Waves",
    content:
      "Listen to the rhythmic sound of waves gently lapping at the shore. Feel the warm sand beneath you and the soft sea breeze on your skin. Watch as seabirds glide peacefully overhead, and let the endless horizon calm your mind. The steady rhythm of the waves helps you find your own peaceful rhythm.",
    duration: "15 min",
  },
  {
    title: "Mountain Meditation",
    content:
      "Picture yourself at the peak of a majestic mountain, above the clouds. The air is clear and cool, and the view stretches endlessly in all directions. Feel the solid earth beneath you, grounding you in this moment. Let the vast perspective help you see your thoughts from a new, peaceful vantage point.",
    duration: "12 min",
  },
];

const sleepTips = [
  {
    icon: Clock,
    tip: "Maintain a consistent sleep schedule",
    description: "Go to bed and wake up at the same time daily",
  },
  {
    icon: Sun,
    tip: "Get natural light exposure",
    description: "Spend time outdoors during daylight hours",
  },
  {
    icon: CloudMoon,
    tip: "Create a relaxing bedtime routine",
    description: "Wind down with calming activities before bed",
  },
];

export function SleepTracker() {
  const [sleepDuration, setSleepDuration] = useState<number>(7);
  const [sleepQuality, setSleepQuality] = useState<number>(3);
  const [selectedStory, setSelectedStory] = useState<string>("");
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const { isElementFocused } = useAnimationFocus();

  const qualityOptions = [
    { value: 1, label: "Poor", color: "text-red-500" },
    { value: 2, label: "Fair", color: "text-orange-500" },
    { value: 3, label: "Good", color: "text-yellow-500" },
    { value: 4, label: "Very Good", color: "text-lime-500" },
    { value: 5, label: "Excellent", color: "text-green-500" },
  ];

  const getSleepQualityColor = (quality: number) => {
    const option = qualityOptions.find((opt) => opt.value === quality);
    return option?.color || "text-muted-foreground";
  };

  const getRecommendations = () => {
    if (sleepQuality <= 2) {
      return [
        "Try deep breathing exercises before bed",
        "Avoid screens 1 hour before sleep",
        "Consider a white noise machine",
        "Keep your bedroom cool and dark",
      ];
    } else if (sleepQuality <= 4) {
      return [
        "Maintain your current bedtime routine",
        "Try light stretching before bed",
        "Practice gratitude journaling",
      ];
    } else {
      return [
        "Great job! Keep maintaining your sleep hygiene",
        "Share your successful sleep habits",
        "Help others improve their sleep quality",
      ];
    }
  };

  const logSleep = () => {
    const newEntry: SleepEntry = {
      date: new Date(),
      duration: sleepDuration,
      quality: sleepQuality,
      notes: getRecommendations(),
    };
    setEntries([newEntry, ...entries]);
  };

  return (
    <div className="space-y-6 py-4">
      {/* Main Input Section */}
      <Card data-card-id="sleep-input" animated={isElementFocused('sleep-input')}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Sleep Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sleep Duration Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Sleep Duration</h4>
              <span className="text-2xl font-bold">{sleepDuration}h</span>
            </div>
            <Slider
              value={[sleepDuration]}
              onValueChange={([value]) => setSleepDuration(value)}
              min={0}
              max={12}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Sleep Quality Selection */}
          <div className="space-y-4">
            <h4 className="font-medium">Sleep Quality</h4>
            <div className="flex gap-2">
              {qualityOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    sleepQuality === option.value ? "default" : "outline"
                  }
                  className={cn(
                    "flex-1",
                    sleepQuality === option.value && option.color
                  )}
                  onClick={() => setSleepQuality(option.value)}
                >
                  <Star
                    className={cn(
                      "h-4 w-4 mr-2",
                      sleepQuality >= option.value
                        ? "fill-current"
                        : "fill-none"
                    )}
                  />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={logSleep} className="w-full">
            Log Sleep
          </Button>
        </CardContent>
      </Card>

      {/* Relaxation Stories */}
      <Card data-card-id="relaxation-stories" animated={isElementFocused('relaxation-stories')}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudMoon className="h-5 w-5" />
            Bedtime Stories & Relaxation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedStory} onValueChange={setSelectedStory}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a relaxation story" />
            </SelectTrigger>
            <SelectContent>
              {relaxationStories.map((story) => (
                <SelectItem key={story.title} value={story.title}>
                  <div className="flex items-center justify-between">
                    <span>{story.title}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {story.duration}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedStory && (
            <div className="p-4 rounded-lg border bg-muted/50">
              <p className="text-sm">
                {relaxationStories.find((s) => s.title === selectedStory)?.content}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sleep Tips */}
      <Card data-card-id="sleep-tips" animated={isElementFocused('sleep-tips')}>
        <CardHeader>
          <CardTitle>Sleep Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {sleepTips.map((tip, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <tip.icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="font-medium leading-none">{tip.tip}</p>
                  <p className="text-sm text-muted-foreground">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sleep History */}
      {entries.length > 0 && (
        <Card data-card-id="sleep-history" animated={isElementFocused('sleep-history')}>
          <CardHeader>
            <CardTitle>Sleep History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entries.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {entry.date.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {entry.duration} hours
                    </p>
                  </div>
                  <Progress
                    value={entry.quality * 20}
                    className={cn(
                      "w-[60px]",
                      getSleepQualityColor(entry.quality)
                    )}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
