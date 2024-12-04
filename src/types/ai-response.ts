export interface StructuredResponse {
  type: 'empathy' | 'suggestion' | 'question' | 'resource' | 'crisis' | 'clarification';
  content: string;
  metadata?: {
    confidence?: number;
    sources?: string[];
    followUp?: string[];
    tags?: string[];
    severity?: 'low' | 'medium' | 'high' | 'crisis';
    actionItems?: string[];
  };
}

export interface AIResponse {
  messages: StructuredResponse[];
  context?: {
    mood?: string;
    topics?: string[];
    intensity?: number;
    relevantResources?: string[];
  };
  suggestedActions?: {
    immediate?: string[];
    shortTerm?: string[];
    longTerm?: string[];
  };
}

export interface Document {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
  similarity?: number;
}
