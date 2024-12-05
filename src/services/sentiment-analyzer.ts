import { Message } from "@/types";
import { aiConfig } from "@/config/ai-config";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  console.error(' OpenAI API Key is missing in sentiment analyzer');
  throw new Error('VITE_OPENAI_API_KEY is not set in environment variables');
} else {
  console.log(' OpenAI API Key is configured in sentiment analyzer');
}

interface SentimentAnalysis {
  score: number; // -1 to 1
  magnitude: number; // 0 to 1
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    love: number;
  };
  topics: {
    name: string;
    sentiment: number;
    confidence: number;
  }[];
  language: {
    formality: number;
    certainty: number;
    urgency: number;
  };
}

const emotionKeywords = {
  joy: [
    { word: "happy", weight: 0.8 },
    { word: "excited", weight: 0.9 },
    { word: "grateful", weight: 0.7 },
    { word: "peaceful", weight: 0.6 },
    { word: "wonderful", weight: 0.8 },
  ],
  sadness: [
    { word: "sad", weight: 0.8 },
    { word: "depressed", weight: 0.9 },
    { word: "lonely", weight: 0.7 },
    { word: "hopeless", weight: 0.9 },
    { word: "miserable", weight: 0.8 },
  ],
  anger: [
    { word: "angry", weight: 0.8 },
    { word: "frustrated", weight: 0.7 },
    { word: "annoyed", weight: 0.6 },
    { word: "furious", weight: 0.9 },
    { word: "irritated", weight: 0.6 },
  ],
  fear: [
    { word: "afraid", weight: 0.8 },
    { word: "anxious", weight: 0.7 },
    { word: "worried", weight: 0.6 },
    { word: "scared", weight: 0.8 },
    { word: "terrified", weight: 0.9 },
  ],
  surprise: [
    { word: "surprised", weight: 0.7 },
    { word: "shocked", weight: 0.8 },
    { word: "amazed", weight: 0.7 },
    { word: "unexpected", weight: 0.6 },
    { word: "astonished", weight: 0.8 },
  ],
  love: [
    { word: "love", weight: 0.9 },
    { word: "caring", weight: 0.7 },
    { word: "supportive", weight: 0.6 },
    { word: "compassionate", weight: 0.7 },
    { word: "kind", weight: 0.6 },
  ],
};

const languageIndicators = {
  formality: {
    formal: ["would", "please", "thank you", "appreciate", "regards"],
    informal: ["hey", "yeah", "cool", "gonna", "wanna"],
  },
  certainty: {
    certain: ["definitely", "absolutely", "certainly", "always", "never"],
    uncertain: ["maybe", "perhaps", "possibly", "might", "sometimes"],
  },
  urgency: {
    high: ["immediately", "urgent", "asap", "emergency", "now"],
    low: ["whenever", "eventually", "sometime", "later", "soon"],
  },
};

export async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  try {
    console.log(' Starting sentiment analysis for text');
    console.log(' Using model:', import.meta.env.VITE_OPENAI_MODEL || "gpt-3.5-turbo");

    const words = text.toLowerCase().split(/\s+/);
    const analysis: SentimentAnalysis = {
      score: 0,
      magnitude: 0,
      emotions: {
        joy: 0,
        sadness: 0,
        anger: 0,
        fear: 0,
        surprise: 0,
        love: 0,
      },
      topics: [],
      language: {
        formality: 0.5,
        certainty: 0.5,
        urgency: 0.5,
      },
    };

    // Analyze emotions
    let totalEmotionScore = 0;
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      keywords.forEach(({ word, weight }) => {
        const count = words.filter(w => w === word || w.includes(word)).length;
        if (count > 0) {
          analysis.emotions[emotion as keyof typeof analysis.emotions] += weight * count;
          totalEmotionScore += weight * count;
        }
      });
    });

    // Normalize emotions
    if (totalEmotionScore > 0) {
      Object.keys(analysis.emotions).forEach(emotion => {
        analysis.emotions[emotion as keyof typeof analysis.emotions] /= totalEmotionScore;
      });
    }

    // Calculate overall sentiment score
    analysis.score = 
      (analysis.emotions.joy + analysis.emotions.love) -
      (analysis.emotions.sadness + analysis.emotions.anger + analysis.emotions.fear);
    analysis.magnitude = Math.abs(analysis.score);

    // Analyze topics
    aiConfig.contextTracking.topicCategories.forEach(topic => {
      const topicWords = words.filter(w => w.includes(topic.toLowerCase()));
      if (topicWords.length > 0) {
        analysis.topics.push({
          name: topic,
          sentiment: calculateTopicSentiment(topicWords, text),
          confidence: Math.min(topicWords.length / words.length * 3, 1),
        });
      }
    });

    // Analyze language style
    analysis.language = analyzeLinguisticStyle(words);

    console.log(' Sentiment analysis complete:', analysis);
    
    return analysis;
  } catch (error) {
    console.error(' Error in sentiment analysis:', error);
    throw new Error('Failed to analyze sentiment');
  }
}

function calculateTopicSentiment(topicWords: string[], context: string): number {
  const windowSize = 5; // Words before and after topic word
  let sentiment = 0;
  let count = 0;

  topicWords.forEach(topicWord => {
    const words = context.toLowerCase().split(/\s+/);
    const index = words.indexOf(topicWord);
    if (index !== -1) {
      const start = Math.max(0, index - windowSize);
      const end = Math.min(words.length, index + windowSize);
      const window = words.slice(start, end);

      // Calculate sentiment in window
      Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
        keywords.forEach(({ word, weight }) => {
          if (window.includes(word)) {
            sentiment += emotion === "joy" || emotion === "love" ? weight : -weight;
            count++;
          }
        });
      });
    }
  });

  return count > 0 ? sentiment / count : 0;
}

function analyzeLinguisticStyle(words: string[]): SentimentAnalysis["language"] {
  const style = {
    formality: 0.5,
    certainty: 0.5,
    urgency: 0.5,
  };

  // Analyze formality
  const formalCount = languageIndicators.formality.formal.filter(w => words.includes(w)).length;
  const informalCount = languageIndicators.formality.informal.filter(w => words.includes(w)).length;
  if (formalCount + informalCount > 0) {
    style.formality = formalCount / (formalCount + informalCount);
  }

  // Analyze certainty
  const certainCount = languageIndicators.certainty.certain.filter(w => words.includes(w)).length;
  const uncertainCount = languageIndicators.certainty.uncertain.filter(w => words.includes(w)).length;
  if (certainCount + uncertainCount > 0) {
    style.certainty = certainCount / (certainCount + uncertainCount);
  }

  // Analyze urgency
  const highUrgencyCount = languageIndicators.urgency.high.filter(w => words.includes(w)).length;
  const lowUrgencyCount = languageIndicators.urgency.low.filter(w => words.includes(w)).length;
  if (highUrgencyCount + lowUrgencyCount > 0) {
    style.urgency = highUrgencyCount / (highUrgencyCount + lowUrgencyCount);
  }

  return style;
}

export function getEmotionalTone(analysis: SentimentAnalysis): string {
  const dominantEmotion = Object.entries(analysis.emotions)
    .reduce((a, b) => a[1] > b[1] ? a : b)[0];

  const intensity = analysis.magnitude;
  const intensityWord = 
    intensity > 0.8 ? "very " :
    intensity > 0.5 ? "moderately " :
    intensity > 0.3 ? "somewhat " : "";

  return `${intensityWord}${dominantEmotion}`;
}

export function getSentimentSummary(analysis: SentimentAnalysis): string {
  const tone = getEmotionalTone(analysis);
  const topTopics = analysis.topics
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 2)
    .map(t => t.name);

  return `The message appears ${tone}, discussing ${topTopics.join(" and ")}. ` +
    `The language style is ${analysis.language.formality > 0.6 ? "formal" : "casual"} ` +
    `and ${analysis.language.certainty > 0.6 ? "confident" : "uncertain"}.`;
}
