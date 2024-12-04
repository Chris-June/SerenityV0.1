export interface ConversationSummary {
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
