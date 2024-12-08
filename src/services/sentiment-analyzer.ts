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

export interface SentimentAnalysis {
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
    { word: "elated", weight: 0.9 },
    { word: "content", weight: 0.7 },
    { word: "cheerful", weight: 0.8 },
    { word: "thrilled", weight: 0.9 },
    { word: "joyful", weight: 0.8 },
    { word: "gleeful", weight: 0.8 },
    { word: "ecstatic", weight: 0.9 },
    { word: "blissful", weight: 0.7 },
    { word: "radiant", weight: 0.8 },
    { word: "upbeat", weight: 0.6 },
    { word: "lighthearted", weight: 0.7 },
    { word: "buoyant", weight: 0.7 },
    { word: "overjoyed", weight: 0.9 },
    { word: "delighted", weight: 0.8 },
    { word: "exuberant", weight: 0.9 },
    { word: "optimistic", weight: 0.6 },
    { word: "euphoric", weight: 0.9 },
    { word: "satisfied", weight: 0.7 },
    { word: "hopeful", weight: 0.6 },
    { word: "sunny", weight: 0.5 },
    { word: "jubilant", weight: 0.9 },
  ],
  sadness: [
    { word: "sad", weight: 0.8 },
    { word: "depressed", weight: 0.9 },
    { word: "lonely", weight: 0.7 },
    { word: "hopeless", weight: 0.9 },
    { word: "miserable", weight: 0.8 },
    { word: "heartbroken", weight: 0.9 },
    { word: "tearful", weight: 0.8 },
    { word: "melancholy", weight: 0.7 },
    { word: "downcast", weight: 0.7 },
    { word: "blue", weight: 0.6 },
    { word: "sorrowful", weight: 0.8 },
    { word: "despondent", weight: 0.9 },
    { word: "forlorn", weight: 0.8 },
    { word: "grief-stricken", weight: 0.9 },
    { word: "dismal", weight: 0.7 },
    { word: "aching", weight: 0.6 },
    { word: "wistful", weight: 0.7 },
    { word: "heavy-hearted", weight: 0.8 },
    { word: "mournful", weight: 0.8 },
    { word: "disheartened", weight: 0.7 },
    { word: "broken", weight: 0.9 },
    { word: "troubled", weight: 0.7 },
    { word: "devastated", weight: 0.9 },
    { word: "weary", weight: 0.6 },
    { word: "downhearted", weight: 0.8 },
    { word: "low", weight: 0.6 },
  ],
  anger: [
    { word: "angry", weight: 0.8 },
    { word: "frustrated", weight: 0.7 },
    { word: "annoyed", weight: 0.6 },
    { word: "furious", weight: 0.9 },
    { word: "irritated", weight: 0.6 },
    { word: "outraged", weight: 0.9 },
    { word: "resentful", weight: 0.7 },
    { word: "bitter", weight: 0.6 },
    { word: "enraged", weight: 0.9 },
    { word: "hostile", weight: 0.8 },
    { word: "exasperated", weight: 0.7 },
    { word: "agitated", weight: 0.6 },
    { word: "infuriated", weight: 0.9 },
    { word: "vindictive", weight: 0.7 },
    { word: "irate", weight: 0.8 },
    { word: "seething", weight: 0.9 },
    { word: "belligerent", weight: 0.8 },
    { word: "wrathful", weight: 0.9 },
    { word: "fuming", weight: 0.8 },
    { word: "vengeful", weight: 0.7 },
    { word: "pissed", weight: 0.6 },
    { word: "raging", weight: 0.9 },
    { word: "provoked", weight: 0.7 },
    { word: "cross", weight: 0.6 },
    { word: "irascible", weight: 0.8 },
    { word: "spiteful", weight: 0.7 },
  ],
  fear: [
    { word: "afraid", weight: 0.8 },
    { word: "anxious", weight: 0.7 },
    { word: "worried", weight: 0.6 },
    { word: "scared", weight: 0.8 },
    { word: "terrified", weight: 0.9 },
    { word: "nervous", weight: 0.7 },
    { word: "panicked", weight: 0.9 },
    { word: "apprehensive", weight: 0.6 },
    { word: "fearful", weight: 0.8 },
    { word: "paranoid", weight: 0.7 },
    { word: "uneasy", weight: 0.6 },
    { word: "dreadful", weight: 0.8 },
    { word: "alarmed", weight: 0.7 },
    { word: "shaken", weight: 0.7 },
    { word: "jumpy", weight: 0.6 },
    { word: "startled", weight: 0.8 },
    { word: "intimidated", weight: 0.7 },
    { word: "spooked", weight: 0.6 },
    { word: "aghast", weight: 0.9 },
    { word: "trembling", weight: 0.8 },
    { word: "timid", weight: 0.6 },
    { word: "horrified", weight: 0.9 },
    { word: "quaking", weight: 0.7 },
    { word: "worriedly", weight: 0.6 },
    { word: "phobic", weight: 0.8 },
    { word: "distraught", weight: 0.7 },
  ],

  surprise: [
    { word: "surprised", weight: 0.7 },
    { word: "shocked", weight: 0.8 },
    { word: "amazed", weight: 0.7 },
    { word: "unexpected", weight: 0.6 },
    { word: "astonished", weight: 0.8 },
    { word: "startled", weight: 0.7 },
    { word: "overwhelmed", weight: 0.8 },
    { word: "dumbfounded", weight: 0.9 },
    { word: "perplexed", weight: 0.7 },
    { word: "stunned", weight: 0.8 },
    { word: "flabbergasted", weight: 0.9 },
    { word: "baffled", weight: 0.8 },
    { word: "bewildered", weight: 0.8 },
    { word: "astounded", weight: 0.9 },
    { word: "wide-eyed", weight: 0.7 },
    { word: "speechless", weight: 0.8 },
    { word: "marveling", weight: 0.7 },
    { word: "aghast", weight: 0.8 },
    { word: "jolted", weight: 0.6 },
    { word: "incredulous", weight: 0.8 },
    { word: "awed", weight: 0.8 },
    { word: "wonderstruck", weight: 0.9 },
    { word: "nonplussed", weight: 0.7 },
  ],

  love: [
    { word: "love", weight: 0.9 },
    { word: "caring", weight: 0.7 },
    { word: "supportive", weight: 0.6 },
    { word: "compassionate", weight: 0.7 },
    { word: "kind", weight: 0.6 },
    { word: "affectionate", weight: 0.8 },
    { word: "cherished", weight: 0.9 },
    { word: "devoted", weight: 0.8 },
    { word: "adored", weight: 0.9 },
    { word: "valued", weight: 0.7 },
    { word: "fond", weight: 0.7 },
    { word: "tender", weight: 0.6 },
    { word: "romantic", weight: 0.8 },
    { word: "admired", weight: 0.7 },
    { word: "loyal", weight: 0.8 },
    { word: "affinity", weight: 0.6 },
    { word: "devotion", weight: 0.8 },
    { word: "beloved", weight: 0.9 },
    { word: "warmhearted", weight: 0.7 },
    { word: "endearing", weight: 0.8 },
    { word: "appreciated", weight: 0.6 },
    { word: "passionate", weight: 0.9 },
    { word: "smitten", weight: 0.7 },
    { word: "heartfelt", weight: 0.8 },
    { word: "intimate", weight: 0.8 },
    { word: "amorous", weight: 0.7 },
  ],
};

const languageIndicators = {
  formality: {
    formal: [
      "hereby", "furthermore", "consequently", "therefore", "moreover",
      "accordingly", "pursuant", "aforementioned", "whereas", "henceforth",
      "notwithstanding", "therein", "herewith", "thereafter", "ergo",
      "inasmuch", "subsequently", "heretofore", "thus", "commensurate",
      "expeditiously", "notably", "pertinent", "hitherto", "respectively",
      "concurrent", "exemplary", "presumptive", "prevalent", "perceptibly",
      "customarily", "mandatorily", "as stipulated", "as prescribed"
    ],
    informal: [
      "like", "basically", "kinda", "sorta", "gonna",
      "wanna", "gotta", "yeah", "uh-huh", "meh",
      "nah", "yep", "nope", "ain't", "totally",
      "whatever", "oops", "okie", "dunno", "geez",
      "bruh", "yo", "dude", "uh-oh", "whoa",
      "my bad", "lol", "bro", "lemme", "wassup",
      "gotcha", "nah bro", "welp", "huh", "ya know"
    ]
  },
  certainty: {
    formal: [
      "undoubtedly", "certainly", "definitively", "unequivocally", "assuredly",
      "indubitably", "positively", "unquestionably", "irrefutably", "decisively",
      "categorically", "incontrovertibly", "resolutely", "infallibly", "without doubt",
      "authoritatively", "absolutely", "conclusively", "irrevocably", "no question",
      "beyond dispute", "with confidence", "undeniably", "demonstrably", "evidently",
      "incontestably", "conclusively proven", "imperatively", "proven beyond doubt"
    ],
    informal: [
      "maybe", "perhaps", "possibly", "probably", "might",
      "I guess", "not sure", "could be", "I think", "dunno",
      "sort of", "kinda", "might be", "I suppose", "it depends",
      "who knows", "kinda sorta", "hard to say", "possibly could",
      "I wonder", "if anything", "likely", "I dunno", "just a hunch",
      "could go either way", "might as well", "whatever works", "your call"
    ]
  },
  urgency: {
    high: [
      "immediately", "urgent", "asap", "emergency", "now",
      "without delay", "right away", "instantly", "this instant", "at once",
      "forthwith", "posthaste", "pronto", "straightaway", "promptly",
      "right this second", "time-sensitive", "do it now", "pressing", "imminent",
      "at the earliest convenience", "critical", "mandatory", "top priority", "imperative",
      "expedite", "rush", "can't wait", "emergent", "on the double"
    ],
    low: [
      "whenever", "eventually", "sometime", "later", "soon",
      "no rush", "take your time", "when you can", "at your leisure", "after a while",
      "whenever convenient", "someday", "in due course", "down the line", "at some point",
      "no hurry", "at your own pace", "it's fine whenever", "on your schedule", "later on",
      "in the distant future", "maybe later", "by and by", "when feasible", "if and when"
    ],
  },
};

export async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  try {
    // Use emotionKeywords to enhance emotion detection
    const emotions: SentimentAnalysis['emotions'] = {
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      surprise: 0,
      love: 0
    };

    // Check text against emotion keywords
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      keywords.forEach(({ word, weight }) => {
        const wordCount = (text.toLowerCase().match(new RegExp(word.toLowerCase(), 'g')) || []).length;
        emotions[emotion as keyof typeof emotions] += wordCount * weight;
      });
    });

    // Use OpenAI to get sentiment analysis
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Analyze the sentiment of the following text. Provide a score between -1 and 1, where -1 is very negative, 0 is neutral, and 1 is very positive. Also provide an emotional breakdown."
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    const sentimentText = response.choices[0].message.content || '';
    
    // Parse the sentiment response (you might need to adjust this parsing logic)
    const sentimentMatch = sentimentText.match(/Score: (-?\d+\.?\d*)/);
    const score = sentimentMatch ? parseFloat(sentimentMatch[1]) : 0;

    const analysis: SentimentAnalysis = {
      score: score,
      magnitude: Math.abs(score),
      emotions: emotions,
      topics: [],
      language: {
        formality: calculateLanguageIndicator(text, languageIndicators.formality),
        certainty: calculateLanguageIndicator(text, languageIndicators.certainty),
        urgency: 0, // You might want to implement a more sophisticated urgency calculation
      },
    };

    return analysis;
  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    throw error;
  }
}

function calculateLanguageIndicator(text: string, indicators: { formal: string[], informal: string[] }): number {
  const words = text.toLowerCase().split(/\s+/);
  const formalCount = words.filter(word => indicators.formal.includes(word)).length;
  const informalCount = words.filter(word => indicators.informal.includes(word)).length;

  // Calculate a formality score between 0 and 1
  const totalIndicators = formalCount + informalCount;
  return totalIndicators > 0 ? formalCount / totalIndicators : 0.5;
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
