import { useState } from 'react';
import { generateAffirmationExpansion } from '@/services/openai';

interface UseAffirmationAIReturn {
  expandedContent: string | null;
  isLoading: boolean;
  error: string | null;
  generateExpansion: (affirmation: string) => Promise<void>;
}

export function useAffirmationAI(): UseAffirmationAIReturn {
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateExpansion = async (affirmation: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const content = await generateAffirmationExpansion(affirmation);
      setExpandedContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setExpandedContent(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    expandedContent,
    isLoading,
    error,
    generateExpansion,
  };
}
