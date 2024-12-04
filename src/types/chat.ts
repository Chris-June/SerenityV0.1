export interface SentimentAnalysis {
  score: number;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
  };
  topics: string[];
}

export interface MessageReaction {
  type: 'like' | 'heart' | 'dislike';
  userId: string;
  timestamp: string | Date;
}

export interface MessageAction {
  type: 'retry' | 'resend' | 'copy' | 'reply' | 'share' | 'bookmark' | 'delete';
  timestamp: string | Date;
}

export interface StructuredResponse {
  type: 'empathy' | 'suggestion' | 'question' | 'resource' | 'crisis' | 'clarification';
  content: string;
  metadata?: {
    tags?: string[];
    confidence?: number;
    sources?: string[];
    actionItems?: string[];
  };
}

export interface Message {
  id: string;
  content: string | StructuredResponse;
  sender: 'user' | 'companion';
  timestamp: string | Date;
  replyTo?: string;
  sentiment?: SentimentAnalysis;
  structured?: boolean;
  topics?: string[];
  isBookmarked?: boolean;
  reactions?: MessageReaction[];
  metadata?: {
    tags?: string[];
    confidence?: number;
    sources?: string[];
    actionItems?: string[];
  };
}

export interface SearchFilters {
  bookmarked: boolean;
  hasReplies: boolean;
  sentiment: string | null;
  dateRange: 'today' | 'week' | 'month' | 'all';
  topics?: string[];
}

export type InteractionMode = 'conversational' | 'reflective' | 'visualization' | 'feedback' | 'crisis';

export interface Mood {
  timestamp: string | Date;
  value: number;  // -1 to 1 scale
  note?: string;
  tags?: string[];
  activities?: string[];
}
