import { SentimentAnalysis } from '@/types';

export async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4-0125-preview',
        messages: [
          {
            role: 'system',
            content: `Analyze the sentiment and emotions in the following text. 
            Return a JSON object with:
            - score (-1 to 1, negative to positive)
            - magnitude (0 to infinity, intensity)
            - emotions (joy, sadness, anger, fear, surprise from 0 to 1)
            - topics (array of relevant mental health topics)`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze sentiment');
    }

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    return {
      score: analysis.score,
      magnitude: analysis.magnitude,
      emotions: analysis.emotions,
      topics: analysis.topics,
    };
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return {
      score: 0,
      magnitude: 0,
      emotions: {
        joy: 0,
        sadness: 0,
        anger: 0,
        fear: 0,
        surprise: 0,
      },
      topics: [],
    };
  }
}