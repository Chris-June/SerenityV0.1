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
      console.log('🎬 Starting affirmation expansion in hook');
      setIsLoading(true);
      setError(null);

      const content = await generateAffirmationExpansion(affirmation);
      console.log('✅ Successfully generated affirmation expansion');
      setExpandedContent(content);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('❌ Error in useAffirmationAI hook:', errorMessage);
      setError(errorMessage);
      setExpandedContent(null);
    } finally {
      setIsLoading(false);
      console.log('🏁 Completed affirmation expansion process');
    }
  };

  return {
    expandedContent,
    isLoading,
    error,
    generateExpansion,
  };
}
