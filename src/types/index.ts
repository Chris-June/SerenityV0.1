export * from './sentiment';
export * from './conversation';
export * from './recommendation';
export * from './crisis';
export * from './user';

export interface Message {
  id: string;
  content: string;
  timestamp: number;
  sender: 'user' | 'ai';
  type: 'text' | 'action' | 'system';
  metadata?: Record<string, string | number | boolean>;
}

export interface Mood {
  value: number;
  label: string;
  timestamp: Date;
}

export interface SentimentAnalysis {
  score: number; // -1 to 1
  magnitude: number; // 0 to +inf
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
  };
  topics: {
    name: string;
    sentiment: number;
    confidence: number;
  }[];
  language?: {
    formality: number;
    certainty: number;
    urgency: number;
  };
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  link?: string;
  type: 'article' | 'exercise' | 'contact';
}

export interface EmergencyContact {
  name: string;
  number: string;
  description: string;
}

export type InteractionMode = 
  | 'conversational'
  | 'reflective'
  | 'visualization'
  | 'feedback'
  | 'crisis';

export interface SystemConfig {
  identity: {
    name: string;
    version: string;
    role: string;
    emoji: string;
  };
  introduction: string;
  capabilities: string[];
  conversationGuidelines: {
    tone: string;
    style: string;
    boundaries: string[];
  };
  safetyProtocol: {
    crisisKeywords: string[];
    crisisResponse: string;
  };
  worksheetTemplates: {
    [key: string]: {
      questions: string[];
    };
  };
  closingStatement: string;
  privacyNotice: string;
}

export interface AIConfig {
  model: {
    default: string;
    fallback: string;
    contextWindow: number;
    maxResponseTokens: number;
  };
  temperature: {
    default: number;
    empathetic: number;
    precise: number;
    creative: number;
  };
  roles: {
    therapist: string;
    coach: string;
    friend: string;
  };
  prompts: Record<string, string | number | boolean>;
  safety: Record<string, string | number | boolean>;
  contextTracking?: {
    moodKeywords: {
      [mood: string]: string[];
    };
    intensityIndicators: {
      high: string[];
      medium: string[];
      low: string[];
    };
  };
  getTemperature(mode?: keyof AIConfig['temperature']): number;
}