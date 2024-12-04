import OpenAI from 'openai';

// WARNING: This is a development-only implementation.
// TODO: For production:
// 1. Move this API endpoint to a secure backend server
// 2. Never expose API keys in the frontend
// 3. Implement proper authentication and rate limiting
// 4. Use environment variables securely stored in the backend

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { affirmation } = await req.json();

    if (!affirmation) {
      return new Response(JSON.stringify({ error: 'Affirmation is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

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
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 200,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    const expandedContent = completion.choices[0].message.content;

    return new Response(JSON.stringify({ content: expandedContent }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in affirmation expansion:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate affirmation expansion' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
