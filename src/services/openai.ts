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
    console.log(' Generating affirmation expansion for:', affirmation);
    console.log(' Using model:', import.meta.env.VITE_OPENAI_MODEL || "gpt-3.5-turbo");

    const prompt = `Given the affirmation: "${affirmation}"

Create a personalized, empathetic, and encouraging expansion of this affirmation. The response should:
1. Acknowledge the deeper meaning behind the affirmation
2. Connect it to real-life experiences and emotions
3. Offer gentle encouragement and validation
4. Be written in a warm, conversational tone
5. Be around 3-4 sentences long

The response should feel like a supportive friend offering wisdom and understanding.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a compassionate and wise mentor, skilled at providing personalized insights and emotional support."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: import.meta.env.VITE_OPENAI_MODEL || "gpt-3.5-turbo",
      temperature: Number(import.meta.env.VITE_OPENAI_TEMPERATURE) || 0.7,
      max_tokens: Number(import.meta.env.VITE_OPENAI_MAX_TOKENS) || 200,
      frequency_penalty: Number(import.meta.env.VITE_OPENAI_FREQUENCY_PENALTY) || 0,
      presence_penalty: Number(import.meta.env.VITE_OPENAI_PRESENCE_PENALTY) || 0
    });

    console.log(' Received affirmation expansion response');
    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error(' Error generating affirmation expansion:', error);
    throw new Error('Failed to generate affirmation expansion');
  }
}
