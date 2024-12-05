export interface StructuredResponse {
  type: 'empathy' | 'suggestion' | 'question' | 'resource' | 'crisis' | 'clarification' | 'safety';
  content: string;
  metadata?: {
    confidence?: number;
    sources?: string[];
    followUp?: string[];
    tags?: string[];
    severity?: 'low' | 'medium' | 'high' | 'crisis';
    actionItems?: string[];
    requiresImmediate?: boolean;
    priority?: 'low' | 'medium' | 'high';
    displayType?: 'normal' | 'prominent' | 'subtle';
    retryable?: boolean;
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

export interface DocumentMetadata {
  title?: string;
  description?: string;
  source?: string;
  timestamp?: string;
  category?: string;
  tags?: string[];
  actionItems?: string[];
  priority?: 'low' | 'medium' | 'high';
  status?: 'active' | 'archived' | 'draft';
  lastModified?: string;
}

export interface Document {
  id: string;
  content: string;
  embedding: number[];
  metadata: DocumentMetadata;
  similarity?: number;
}
