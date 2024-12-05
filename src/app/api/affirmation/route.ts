import OpenAI from 'openai';

// WARNING: This is a development-only implementation.
// TODO: For production:
// 1. Move this API endpoint to a secure backend server
// 2. Never expose API keys in the frontend
// 3. Implement proper authentication and rate limiting
// 4. Use environment variables securely stored in the backend

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  console.error('🔴 OpenAI API Key is missing in affirmation route');
  throw new Error('VITE_OPENAI_API_KEY is not set in environment variables');
} else {
  console.log('🟢 OpenAI API Key is configured in affirmation route');
}

export async function POST(req: Request) {
  try {
    console.log('📥 Received affirmation request');
    const { affirmation } = await req.json();

    if (!affirmation) {
      console.warn('⚠️ No affirmation provided in request');
      return new Response(JSON.stringify({ error: 'Affirmation is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    console.log('📤 Processing affirmation:', affirmation);
    const prompt = `Take this affirmation and expand upon it, making it more personal and impactful: "${affirmation}".
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
      model: import.meta.env.VITE_OPENAI_MODEL || "gpt-4-0-mini",
      temperature: Number(import.meta.env.VITE_OPENAI_TEMPERATURE) || 0.7,
      max_tokens: Number(import.meta.env.VITE_OPENAI_MAX_TOKENS) || 200,
      frequency_penalty: Number(import.meta.env.VITE_OPENAI_FREQUENCY_PENALTY) || 0,
      presence_penalty: Number(import.meta.env.VITE_OPENAI_PRESENCE_PENALTY) || 0
    });

    const expandedContent = completion.choices[0].message.content;
    console.log('📥 Received OpenAI response for affirmation');

    return new Response(JSON.stringify({ content: expandedContent }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('🔴 Error in affirmation route:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate affirmation expansion' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
