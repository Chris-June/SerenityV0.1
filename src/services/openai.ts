import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, you should proxy through a backend
});

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  console.error(' OpenAI API Key is missing');
  throw new Error('VITE_OPENAI_API_KEY is not set in environment variables');
} else {
  console.log(' OpenAI API Key is configured');
}

export async function generateAffirmationExpansion(affirmation: string): Promise<string> {
  try {
    console.log('🔄 Generating affirmation expansion for:', affirmation);
    
    const MODEL = "gpt-4o-mini";
    console.log('🤖 Using model:', MODEL);

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a wise and empathetic philosopher, drawing from the wisdom of Stoic philosophers and Socratic questioning. 
          When presented with an affirmation, respond in two parts:
          1. First, provide a warm and empathetic expansion of the affirmation that validates the person's experience
          2. Then, add a philosophical perspective, either:
             - A Socratic exploration that gently questions and deepens understanding through "What if..." or "Have you considered..."
             - Or a Stoic wisdom that connects to universal human experiences and virtues
          Keep the total response concise but impactful, maintaining a supportive and encouraging tone.`
        },
        {
          role: 'user',
          content: `Please expand on this affirmation: "${affirmation}"`
        }
      ],
      model: MODEL,
      temperature: 0.7,
      max_tokens: 300,
      frequency_penalty: 0.2,
      presence_penalty: 0.1
    });

    console.log('✅ Received affirmation expansion response');
    return completion.choices[0].message.content || '';
  } catch (error: unknown) {
    console.error('❌ Error generating affirmation expansion:', error);
    
    // Type guard to check if error is an object with a response property
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const apiError = error as { response?: { status?: number } };
      
      if (apiError.response?.status === 404) {
        throw new Error('Model access error. Please try again later.');
      }
      if (apiError.response?.status === 429) {
        throw new Error('Rate limit reached. Please try again in a few moments.');
      }
    }
    
    // Handle other error types
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to generate affirmation expansion';
    
    throw new Error(errorMessage);
  }
}
