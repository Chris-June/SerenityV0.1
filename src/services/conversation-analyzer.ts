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
  topics: TopicAnalysis[];
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
  current: string;
}

interface TopicAnalysis {
  name: string;
  frequency: number;
  sentiment: number;
  relatedTopics: string[];
  resources: string[];
}

export async function analyzeConversation(messages: Message[]): Promise<ConversationInsights> {
  // Use OpenAI for advanced text analysis
  const conversationText = messages.map(m => m.content).join(' ');
  
  try {
    // Get relevant context from knowledge base
    const lastMessage = messages[messages.length - 1];
    const relevantContext = await searchSimilar(lastMessage.content, 3);
    
    // Combine conversation text with relevant context for better analysis
    const contextEnhancedText = `${conversationText}\n\nRelevant Context:\n${relevantContext.map(doc => doc.content).join('\n')}`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system", 
          content: "Analyze the following conversation and provide insights about mood, topics, and engagement."
        },
        {
          role: "user", 
          content: contextEnhancedText
        }
      ],
      max_tokens: 300
    });

    const aiInsights = completion.choices[0].message.content || '';

    return {
      mood: analyzeMood(messages),
      topics: await analyzeTopics(messages),
      concerns: identifyConcerns(messages),
      progress: trackProgress(messages),
      engagement: calculateEngagement(messages),
      current: aiInsights
    };
  } catch (error) {
    console.error('Error analyzing conversation with OpenAI:', error);
    // Fallback to existing analysis methods if OpenAI fails
    return {
      mood: analyzeMood(messages),
      topics: await analyzeTopics(messages),
      concerns: identifyConcerns(messages),
      progress: trackProgress(messages),
      engagement: calculateEngagement(messages),
      current: 'Unable to generate AI insights'
    };
  }
}

function analyzeMood(messages: Message[]): ConversationInsights["mood"] {
  let currentMood = "neutral";
  let intensity = 0;
  const moodScores: number[] = [];

  messages.forEach(msg => {
    const words = msg.content.toLowerCase().split(/\s+/);
    
    // Check mood keywords
    const moodKeywords = aiConfig.contextTracking?.moodKeywords as Record<string, string[]>;
    for (const [type, keywords] of Object.entries(moodKeywords)) {
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

async function analyzeTopics(messages: Message[]): Promise<TopicAnalysis[]> {
  const conversationText = messages.map(m => m.content).join(' ');
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Analyze the conversation and extract key topics with their frequency, sentiment, and related resources."
        },
        {
          role: "user",
          content: conversationText
        }
      ]
    });

    const topicAnalysisText = response.choices[0].message.content || '';
    
    // Parse the response into TopicAnalysis array
    const topics: TopicAnalysis[] = JSON.parse(topicAnalysisText);
    
    return topics;
  } catch (error) {
    console.error("Error analyzing topics:", error);
    return [];
  }
}

function identifyConcerns(messages: Message[]): string[] {
  const concerns = new Set<string>();
  const text = messages.map(m => m.content).join(" ").toLowerCase();

  // Check for crisis indicators
  aiConfig.prompts.crisis.detection.forEach((phrase: string) => {
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
  const companionMessages = messages.filter(m => m.sender === "ai");

  // Calculate user participation
  const userParticipation = userMessages.length / messages.length;

  // Calculate response quality (based on message length and follow-ups)
  const avgUserLength = average(userMessages.map(m => m.content.length));
  const responseQuality = Math.min(avgUserLength / 100, 1); // Normalize to 0-1

  // Calculate follow-up rate
  const followUps = messages.filter((m, i) => 
    i > 0 && 
    m.sender === "user" && 
    messages[i-1].sender === "ai"
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

  const intensityIndicators = aiConfig.contextTracking?.intensityIndicators as { [key: string]: string[] };
  Object.entries(intensityIndicators).forEach(([level, indicators]: [string, string[]]) => {
    indicators.forEach((indicator: string) => {
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
