import { Message, AIConfig } from "@/types";
import { analyzeSentiment, getSentimentSummary } from "./sentiment-analyzer";
import { aiConfig } from "@/config/ai-config";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  console.error(' OpenAI API Key is missing in conversation summarizer');
  throw new Error('VITE_OPENAI_API_KEY is not set in environment variables');
} else {
  console.log(' OpenAI API Key is configured in conversation summarizer');
}

interface ConversationSummary {
  overview: string;
  keyPoints: string[];
  emotionalJourney: {
    start: string;
    middle: string;
    end: string;
  };
  topics: {
    name: string;
    mentions: number;
    sentiment: number;
  }[];
  insights: {
    patterns: string[];
    suggestions: string[];
    progress: string[];
  };
  metrics: {
    duration: number; // minutes
    messageCount: number;
    averageResponseTime: number; // seconds
    engagementScore: number; // 0-1
  };
}

interface SegmentAnalysis {
  content: string;
  sentiment: number;
  topics: string[];
  timestamp: Date;
}

const config: AIConfig = aiConfig;

export async function summarizeConversation(messages: Message[]): Promise<ConversationSummary> {
  console.log(' Starting conversation summarization', { messageCount: messages.length });
  
  if (messages.length === 0) {
    console.log(' No messages to summarize, returning empty summary');
    return createEmptySummary();
  }

  try {
    console.log(' Analyzing conversation segments');
    const segments = await analyzeSegments(messages);
    
    console.log(' Analyzing conversation topics');
    const topics = analyzeTopics(segments);
    
    console.log(' Generating conversation insights');
    const insights = generateInsights(segments, topics);
    
    console.log(' Calculating conversation metrics');
    const metrics = await calculateMetrics(messages);

    const summary = {
      overview: await generateOverview(segments, topics),
      keyPoints: await extractKeyPoints(segments),
      emotionalJourney: trackEmotionalJourney(segments),
      topics,
      insights,
      metrics,
    };

    console.log(' Conversation summary complete', { summary });
    return summary;
  } catch (error) {
    console.error(' Error in conversation summarization:', error);
    throw error;
  }
}

async function analyzeSegments(messages: Message[]): Promise<SegmentAnalysis[]> {
  return Promise.all(messages.map(async message => {
    const sentiment = await analyzeSentiment(message.content);
    return {
      content: message.content,
      sentiment: sentiment.score,
      topics: sentiment.topics.map(t => t.name),
      timestamp: new Date(message.timestamp),
    };
  }));
}

function analyzeTopics(segments: SegmentAnalysis[]): ConversationSummary["topics"] {
  const topicMap = new Map<string, { mentions: number; sentiments: number[] }>();

  segments.forEach(segment => {
    segment.topics.forEach(topic => {
      const existing = topicMap.get(topic) || { mentions: 0, sentiments: [] };
      existing.mentions++;
      existing.sentiments.push(segment.sentiment);
      topicMap.set(topic, existing);
    });
  });

  return Array.from(topicMap.entries()).map(([name, data]) => ({
    name,
    mentions: data.mentions,
    sentiment: average(data.sentiments),
  }));
}

function generateInsights(
  segments: SegmentAnalysis[],
  topics: ConversationSummary["topics"]
): ConversationSummary["insights"] {
  const insights: ConversationSummary["insights"] = {
    patterns: [],
    suggestions: [],
    progress: [],
  };

  // Analyze patterns
  const sentimentPattern = analyzeSentimentPattern(segments);
  if (sentimentPattern) {
    insights.patterns.push(sentimentPattern);
  }

  const topicPattern = analyzeTopicPattern(topics);
  if (topicPattern) {
    insights.patterns.push(topicPattern);
  }

  // Generate suggestions
  topics.forEach(topic => {
    if (topic.sentiment < 0) {
      insights.suggestions.push(
        generateSuggestionForTopic(topic.name, Math.abs(topic.sentiment))
      );
    }
  });

  // Track progress
  const progressMarkers = identifyProgressMarkers(segments);
  insights.progress = progressMarkers;

  return insights;
}

async function generateOverview(
  segments: SegmentAnalysis[],
  topics: ConversationSummary["topics"]
): Promise<string> {
  try {
    const conversationContext = segments.map(segment => ({
      content: segment.content,
      sentiment: segment.sentiment,
      topics: segment.topics
    }));

    const prompt = `Please provide a concise overview of this conversation. Key points:
    - Main topics discussed: ${topics.map(t => t.name).join(', ')}
    - Conversation segments: ${JSON.stringify(conversationContext)}
    Focus on the main themes, progression of discussion, and any notable patterns.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: config.model.default,
      temperature: config.getTemperature("default"),
      max_tokens: 250
    });

    return completion.choices[0]?.message?.content || 'Unable to generate overview';
  } catch (error) {
    console.error('Error generating overview with OpenAI:', error);
    // Fallback to basic overview generation
    return `Discussion covering ${topics.length} topics: ${topics.map(t => t.name).join(', ')}. ${
      segments.length
    } message segments analyzed.`;
  }
}

async function extractKeyPoints(segments: SegmentAnalysis[]): Promise<string[]> {
  return Promise.all(segments.filter(s => 
    Math.abs(s.sentiment) > 0.5 || s.topics.length > 1
  ).map(async segment => {
    const sentiment = await analyzeSentiment(segment.content);
    return getSentimentSummary(sentiment);
  })).then(summaries => 
    [...new Set(summaries.filter(Boolean))].slice(0, 5)
  );
}

function trackEmotionalJourney(segments: SegmentAnalysis[]): ConversationSummary["emotionalJourney"] {
  const third = Math.floor(segments.length / 3);
  
  return {
    start: describeSentiment(average(segments.slice(0, third).map(s => s.sentiment))),
    middle: describeSentiment(average(segments.slice(third, third * 2).map(s => s.sentiment))),
    end: describeSentiment(average(segments.slice(third * 2).map(s => s.sentiment))),
  };
}

async function calculateMetrics(messages: Message[]): Promise<ConversationSummary["metrics"]> {
  const duration = (messages[messages.length - 1].timestamp - messages[0].timestamp) / 60000;

  const responseTimes = messages
    .slice(1)
    .map((msg, i) => 
      Number(msg.timestamp) - Number(messages[i].timestamp)
    );

  const engagementScore = await calculateEngagementScore(messages);

  return {
    duration,
    messageCount: messages.length,
    averageResponseTime: average(responseTimes) / 1000,
    engagementScore,
  };
}

async function calculateEngagementScore(messages: Message[]): Promise<number> {
  const factors = {
    responseTime: 0.3,
    messageLength: 0.3,
    topicContinuity: 0.4,
  };

  const scores = {
    responseTime: await calculateResponseTimeScore(messages),
    messageLength: calculateMessageLengthScore(messages),
    topicContinuity: await calculateTopicContinuityScore(messages),
  };

  return Object.entries(factors).reduce(
    (score, [factor, weight]) => 
      score + weight * scores[factor as keyof typeof scores],
    0
  );
}

function calculateResponseTimeScore(messages: Message[]): number {
  const responseTimes = messages
    .slice(1)
    .map((msg, i) => 
      Number(msg.timestamp) - Number(messages[i].timestamp)
    );

  const avgResponseTime = average(responseTimes);
  return Math.min(30000 / avgResponseTime, 1); // Score decreases as response time increases
}

function calculateMessageLengthScore(messages: Message[]): number {
  const avgLength = average(messages.map(m => m.content.length));
  return Math.min(avgLength / 100, 1); // Normalize to 0-1
}

async function calculateTopicContinuityScore(messages: Message[]): Promise<number> {
  let continuityCount = 0;
  
  return Promise.all(messages.slice(1).map(async (msg, i) => {
    const prevTopics = await analyzeSentiment(messages[i].content).then(analysis => analysis.topics);
    const currentTopics = await analyzeSentiment(msg.content).then(analysis => analysis.topics);
    
    return hasCommonElements(
      prevTopics.map(t => t.name),
      currentTopics.map(t => t.name)
    );
  })).then(results => {
    continuityCount = results.filter(Boolean).length;
    return continuityCount / (messages.length - 1);
  });
}

function analyzeSentimentPattern(segments: SegmentAnalysis[]): string | null {
  const sentiments = segments.map(s => s.sentiment);
  const trend = calculateTrend(sentiments);
  
  if (Math.abs(trend) < 0.1) return null;
  
  return trend > 0
    ? "Emotional state gradually improved throughout the conversation"
    : "Conversation revealed increasing emotional challenges";
}

function analyzeTopicPattern(topics: ConversationSummary["topics"]): string | null {
  const significantTopics = topics.filter(t => t.mentions > 1);
  if (significantTopics.length === 0) return null;

  const mainTopic = significantTopics[0];
  return `Recurring focus on ${mainTopic.name} (mentioned ${mainTopic.mentions} times)`;
}

function generateSuggestionForTopic(topic: string, intensity: number): string {
  const suggestions = {
    anxiety: [
      "Consider practicing mindfulness or breathing exercises",
      "Explore anxiety management techniques",
      "Schedule time for relaxation",
    ],
    depression: [
      "Maintain daily routines and self-care",
      "Set small, achievable goals",
      "Reach out to supportive people",
    ],
    sleep: [
      "Establish a consistent sleep schedule",
      "Create a relaxing bedtime routine",
      "Limit screen time before bed",
    ],
    relationships: [
      "Practice active listening",
      "Express feelings openly and honestly",
      "Set healthy boundaries",
    ],
  };

  const topicSuggestions = suggestions[topic as keyof typeof suggestions];
  if (!topicSuggestions) return "";

  const index = Math.min(
    Math.floor(intensity * topicSuggestions.length),
    topicSuggestions.length - 1
  );
  return topicSuggestions[index];
}

function identifyProgressMarkers(segments: SegmentAnalysis[]): string[] {
  const progress: string[] = [];
  const sentiments = segments.map(s => s.sentiment);
  
  // Check for improvement
  if (calculateTrend(sentiments) > 0.2) {
    progress.push("Shows positive emotional progress");
  }

  // Check for topic exploration
  const uniqueTopics = new Set(segments.flatMap(s => s.topics));
  if (uniqueTopics.size > 3) {
    progress.push("Explored multiple aspects of well-being");
  }

  // Check for engagement
  if (segments.length > 10) {
    progress.push("Maintained sustained engagement");
  }

  return progress;
}

function describeSentiment(score: number): string {
  if (score > 0.5) return "very positive";
  if (score > 0.2) return "somewhat positive";
  if (score > -0.2) return "neutral";
  if (score > -0.5) return "somewhat negative";
  return "very negative";
}

function calculateTrend(numbers: number[]): number {
  if (numbers.length < 2) return 0;
  
  const xMean = (numbers.length - 1) / 2;
  const yMean = average(numbers);
  
  let numerator = 0;
  let denominator = 0;
  
  numbers.forEach((y, x) => {
    numerator += (x - xMean) * (y - yMean);
    denominator += Math.pow(x - xMean, 2);
  });
  
  return denominator === 0 ? 0 : numerator / denominator;
}

function average(numbers: number[]): number {
  return numbers.length === 0 ? 0 : 
    numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

function hasCommonElements<T>(arr1: T[], arr2: T[]): boolean {
  return arr1.some(item => arr2.includes(item));
}

function createEmptySummary(): ConversationSummary {
  return {
    overview: "No conversation data available.",
    keyPoints: [],
    emotionalJourney: {
      start: "neutral",
      middle: "neutral",
      end: "neutral",
    },
    topics: [],
    insights: {
      patterns: [],
      suggestions: [],
      progress: [],
    },
    metrics: {
      duration: 0,
      messageCount: 0,
      averageResponseTime: 0,
      engagementScore: 0,
    },
  };
}
