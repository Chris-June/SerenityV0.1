import { useState, useCallback, useRef } from 'react';
import { generateAffirmationExpansion } from '@/services/openai';

interface UseAffirmationAIReturn {
  expandedContent: string | null;
  isLoading: boolean;
  error: string | null;
  generateExpansion: (affirmation: string) => Promise<void>;
}

// Cache for storing previously generated expansions
const expansionCache = new Map<string, string>();

export function useAffirmationAI(): UseAffirmationAIReturn {
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentRequestRef = useRef<string | null>(null);

  const generateExpansion = useCallback(async (affirmation: string) => {
    // If already loading or no affirmation, don't proceed
    if (isLoading || !affirmation) return;

    // Check cache first
    if (expansionCache.has(affirmation)) {
      setExpandedContent(expansionCache.get(affirmation)!);
      return;
    }

    try {
      // Set current request
      currentRequestRef.current = affirmation;
      
      setIsLoading(true);
      setError(null);
      setExpandedContent(null);

      const content = await generateAffirmationExpansion(affirmation);
      
      // Only update state if this is still the current request
      if (currentRequestRef.current === affirmation) {
        setExpandedContent(content);
        expansionCache.set(affirmation, content);
      }
    } catch (err) {
      if (currentRequestRef.current === affirmation) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        setExpandedContent(null);
      }
    } finally {
      if (currentRequestRef.current === affirmation) {
        setIsLoading(false);
        currentRequestRef.current = null;
      }
    }
  }, [isLoading]);

  return {
    expandedContent,
    isLoading,
    error,
    generateExpansion,
  };
}
