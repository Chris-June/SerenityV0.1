import { Message } from "@/types";
import { aiConfig } from "@/config/ai-config";
import { searchSimilar } from "./knowledge-base";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  console.error(' OpenAI API Key is missing in conversation analyzer');
  throw new Error('VITE_OPENAI_API_KEY is not set in environment variables');
} else {
  console.log(' OpenAI API Key is configured in conversation analyzer');
}

interface ConversationInsights {
  mood: {
    current: string;
    trend: "improving" | "declining" | "stable";
    intensity: number;
  };
  topics: string[];
  concerns: string[];
  progress: {
    insights: string[];
    challenges: string[];
    achievements: string[];
  };
  engagement: {
    userParticipation: number; // 0-1
    responseQuality: number; // 0-1
    followUpRate: number; // 0-1
  };
}

interface TopicAnalysis {
  name: string;
  frequency: number;
  sentiment: number;
  relatedTopics: string[];
  resources: string[];
}

export async function analyzeConversation(messages: Message[]): Promise<ConversationInsights> {
  console.log(' Starting conversation analysis', { messageCount: messages.length });
  const recentMessages = messages.slice(-10); // Focus on recent context
  const userMessages = recentMessages.filter(m => m.sender === "user");
  const companionMessages = recentMessages.filter(m => m.sender === "companion");

  try {
    // Analyze mood and intensity
    console.log(' Analyzing mood and sentiment');
    const moodAnalysis = analyzeMood(userMessages);
    console.log(' Mood analysis complete:', moodAnalysis);

    console.log(' Analyzing conversation topics');
    const topicsFound = await analyzeTopics(userMessages);
    console.log(' Topics identified:', topicsFound);

    console.log(' Identifying potential concerns');
    const concernsIdentified = identifyConcerns(userMessages);
    
    console.log(' Tracking conversation progress');
    const progressTracking = trackProgress(recentMessages);
    
    console.log(' Calculating engagement metrics');
    const engagementMetrics = calculateEngagement(recentMessages);

    const insights = {
      mood: moodAnalysis,
      topics: topicsFound,
      concerns: concernsIdentified,
      progress: progressTracking,
      engagement: engagementMetrics,
    };

    console.log(' Conversation analysis complete', { insights });
    return insights;
  } catch (error) {
    console.error(' Error in conversation analysis:', error);
    throw error;
  }
}

function analyzeMood(messages: Message[]): ConversationInsights["mood"] {
  let currentMood = "neutral";
  let intensity = 0;
  let moodScores: number[] = [];

  messages.forEach(msg => {
    const words = msg.content.toLowerCase().split(/\s+/);
    
    // Check mood keywords
    for (const [type, keywords] of Object.entries(aiConfig.contextTracking.moodKeywords)) {
      const matchCount = keywords.filter(k => words.includes(k)).length;
      if (matchCount > 0) {
        currentMood = type;
        moodScores.push(type === "positive" ? 1 : type === "negative" ? -1 : 0);
      }
    }

    // Calculate intensity
    intensity = Math.max(intensity, calculateIntensity(msg.content));
  });

  // Calculate mood trend
  const trend = calculateMoodTrend(moodScores);

  return {
    current: currentMood,
    trend,
    intensity,
  };
}

async function analyzeTopics(messages: Message[]): Promise<string[]> {
  const text = messages.map(m => m.content).join(" ");
  const words = text.toLowerCase().split(/\s+/);
  const topics = new Set<string>();

  // Check predefined topics
  aiConfig.contextTracking.topicCategories.forEach(topic => {
    if (words.some(w => w.includes(topic.toLowerCase()))) {
      topics.add(topic);
    }
  });

  // Get relevant resources
  const relevantDocs = await searchSimilar(text, 3);
  relevantDocs.forEach(doc => {
    if (doc.metadata?.topic) {
      (doc.metadata.topic as string[]).forEach(t => topics.add(t));
    }
  });

  return Array.from(topics);
}

function identifyConcerns(messages: Message[]): string[] {
  const concerns = new Set<string>();
  const text = messages.map(m => m.content).join(" ").toLowerCase();

  // Check for crisis indicators
  aiConfig.prompts.crisis.detection.forEach(phrase => {
    if (text.includes(phrase)) {
      concerns.add("crisis");
    }
  });

  // Check for other concerns
  const concernIndicators = {
    sleep: ["trouble sleeping", "insomnia", "nightmares"],
    anxiety: ["worried", "anxious", "panic"],
    depression: ["hopeless", "worthless", "depressed"],
    relationships: ["lonely", "conflict", "breakup"],
    work: ["stressed", "overwhelmed", "burnout"],
  };

  Object.entries(concernIndicators).forEach(([concern, indicators]) => {
    if (indicators.some(i => text.includes(i))) {
      concerns.add(concern);
    }
  });

  return Array.from(concerns);
}

function trackProgress(messages: Message[]): ConversationInsights["progress"] {
  const progress = {
    insights: [] as string[],
    challenges: [] as string[],
    achievements: [] as string[],
  };

  const insightIndicators = ["realize", "understand", "learned"];
  const challengeIndicators = ["struggle", "difficult", "hard"];
  const achievementIndicators = ["managed to", "accomplished", "proud"];

  messages.forEach(msg => {
    const text = msg.content.toLowerCase();
    
    if (insightIndicators.some(i => text.includes(i))) {
      progress.insights.push(msg.content);
    }
    if (challengeIndicators.some(i => text.includes(i))) {
      progress.challenges.push(msg.content);
    }
    if (achievementIndicators.some(i => text.includes(i))) {
      progress.achievements.push(msg.content);
    }
  });

  return progress;
}

function calculateEngagement(messages: Message[]): ConversationInsights["engagement"] {
  const userMessages = messages.filter(m => m.sender === "user");
  const companionMessages = messages.filter(m => m.sender === "companion");

  // Calculate user participation
  const userParticipation = userMessages.length / messages.length;

  // Calculate response quality (based on message length and follow-ups)
  const avgUserLength = average(userMessages.map(m => m.content.length));
  const responseQuality = Math.min(avgUserLength / 100, 1); // Normalize to 0-1

  // Calculate follow-up rate
  const followUps = messages.filter((m, i) => 
    i > 0 && 
    m.sender === "user" && 
    messages[i-1].sender === "companion"
  ).length;
  const followUpRate = followUps / companionMessages.length;

  return {
    userParticipation,
    responseQuality,
    followUpRate,
  };
}

function calculateIntensity(text: string): number {
  const words = text.toLowerCase().split(/\s+/);
  let intensity = 0;
  let count = 0;

  Object.entries(aiConfig.contextTracking.intensityIndicators).forEach(([level, indicators]) => {
    indicators.forEach(indicator => {
      if (words.includes(indicator)) {
        intensity += level === "high" ? 1 : level === "medium" ? 0.6 : 0.3;
        count++;
      }
    });
  });

  return count > 0 ? Math.min(intensity / count, 1) : 0.5;
}

function calculateMoodTrend(scores: number[]): "improving" | "declining" | "stable" {
  if (scores.length < 2) return "stable";
  
  const recentScores = scores.slice(-3);
  const trend = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  
  if (trend > 0.3) return "improving";
  if (trend < -0.3) return "declining";
  return "stable";
}

function average(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}
