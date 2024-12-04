import { Document } from '@/types';
import { mentalHealthResources } from '@/data/mental-health-resources';

// In-memory vector store simulation
let documents: Document[] = [];

// Simple vector representation (in production, use a proper embedding model)
function getEmbedding(text: string): number[] {
  // Simple TF-IDF-like representation
  const words = text.toLowerCase().split(/\W+/);
  const wordCount = new Map<string, number>();
  
  words.forEach(word => {
    if (word.length > 2) { // Skip very short words
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    }
  });

  // Convert to vector (simplified)
  return Array.from(wordCount.values());
}

// Cosine similarity with length normalization
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    // Pad shorter array with zeros
    const maxLength = Math.max(a.length, b.length);
    if (a.length < maxLength) a = [...a, ...Array(maxLength - a.length).fill(0)];
    if (b.length < maxLength) b = [...b, ...Array(maxLength - b.length).fill(0)];
  }

  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  
  return dotProduct / (magnitudeA * magnitudeB || 1); // Avoid division by zero
}

export async function addDocument(content: string, metadata: Record<string, any> = {}) {
  const embedding = getEmbedding(content);
  documents.push({
    id: `doc_${documents.length + 1}`,
    content,
    embedding,
    metadata,
  });
}

export async function searchSimilar(query: string, topK: number = 3): Promise<Document[]> {
  const queryEmbedding = getEmbedding(query);
  
  return documents
    .map(doc => ({
      ...doc,
      similarity: cosineSimilarity(queryEmbedding, doc.embedding),
    }))
    .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
    .slice(0, topK);
}

export async function searchByMetadata(
  criteria: {
    type?: string;
    topic?: string[];
    difficulty?: string;
    effectiveness?: number;
  },
  limit: number = 5
): Promise<Document[]> {
  return documents
    .filter(doc => {
      const meta = doc.metadata;
      return (
        (!criteria.type || meta.type === criteria.type) &&
        (!criteria.topic || criteria.topic.some(t => meta.topic.includes(t))) &&
        (!criteria.difficulty || meta.difficulty === criteria.difficulty) &&
        (!criteria.effectiveness || meta.effectiveness >= criteria.effectiveness)
      );
    })
    .slice(0, limit);
}

// Initialize with mental health resources
export async function initializeKnowledgeBase() {
  // Clear existing documents
  documents = [];

  // Add all resources
  for (const resource of mentalHealthResources) {
    await addDocument(resource.content, resource.metadata);
  }

  // Add some combined resources for better context
  const depressionResources = await searchByMetadata({ topic: ['depression'] });
  if (depressionResources.length >= 2) {
    await addDocument(
      `Combined depression insights: ${depressionResources.map(d => d.content).join(' ')}`,
      { type: 'combined', topic: ['depression', 'comprehensive'] }
    );
  }

  const anxietyResources = await searchByMetadata({ topic: ['anxiety'] });
  if (anxietyResources.length >= 2) {
    await addDocument(
      `Combined anxiety insights: ${anxietyResources.map(d => d.content).join(' ')}`,
      { type: 'combined', topic: ['anxiety', 'comprehensive'] }
    );
  }

  console.log(`Knowledge base initialized with ${documents.length} documents`);
}
