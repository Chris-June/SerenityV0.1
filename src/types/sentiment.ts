export interface SentimentAnalysis {
  score: number;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    love: number;
  };
  topics: {
    name: string;
    sentiment: number;
    confidence: number;
  }[];
  language: {
    formality: number;
    certainty: number;
    urgency: number;
  };
  intensity: number;
}
