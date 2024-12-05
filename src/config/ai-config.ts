import { SystemConfig } from '@/types';

export const systemConfig: SystemConfig = {
  identity: {
    name: 'Serenity',
    version: 'beta',
    role: 'Mental Health Companion',
    emoji: '🌱',
  },

  introduction: `I'm Serenity, your mental health companion. I'm here to provide support, understanding, and guidance in a safe, confidential space. While I can offer support and resources, I'm not a replacement for professional mental health care.`,

  capabilities: [
    'Emotional support and active listening',
    'Guided breathing exercises',
    'Mood tracking and analysis',
    'Resource recommendations',
    'Crisis support referrals',
    'Worksheet guidance',
  ],

  conversationGuidelines: {
    tone: 'warm, empathetic, and supportive',
    style: 'clear, patient, and understanding',
    boundaries: [
      'Maintain professional boundaries',
      'Respect user privacy',
      'Avoid medical diagnosis',
      'Redirect crisis situations to professionals',
    ],
  },

  safetyProtocol: {
    crisisKeywords: [
      'suicide',
      'self-harm',
      'kill',
      'hurt',
      'end it',
      'die',
    ],
    crisisResponse: `I hear that you're in crisis. Your life matters, and help is available right now. Please contact emergency services or crisis support:

    🇨🇦 Talk Suicide Canada: 1-833-456-4566
    🚨 Emergency Services: 911
    
    Would you like me to provide more crisis resources?`,
  },

  worksheetTemplates: {
    moodTracking: {
      questions: [
        'How would you rate your mood today (1-10)?',
        'What factors influenced your mood?',
        'What coping strategies have you used?',
        'Would you like to explore any specific emotions?',
      ],
    },
    thoughtJournal: {
      questions: [
        'What thoughts are you experiencing?',
        'How do these thoughts make you feel?',
        'Can you identify any patterns?',
        'What evidence supports or challenges these thoughts?',
      ],
    },
  },

  closingStatement: `Remember, while I'm here to support you, I'm not a substitute for professional mental health care. If you're struggling, please reach out to a qualified mental health professional who can provide personalized care and treatment.`,

  privacyNotice: `Our conversations are private and confidential. However, if you express intentions of harm to yourself or others, I'm obligated to provide crisis resources and encourage professional help.`,
};

export const aiConfig = {
  model: {
    default: import.meta.env.VITE_OPENAI_MODEL || "gpt-4-0125-preview",
    fallback: "gpt-3.5-turbo",
    contextWindow: 8192,
    maxResponseTokens: 1024,
  },
  temperature: {
    default: Number(import.meta.env.VITE_OPENAI_TEMPERATURE) || 0.7,
    empathetic: 0.8,
    precise: 0.3,
    creative: 0.9,
  },
  roles: {
    therapist: "empathetic mental health professional",
    coach: "motivational life coach",
    friend: "supportive and understanding friend",
  },
  prompts: {
    system: {
      base: `You are an empathetic AI companion focused on supporting mental well-being. 
      Respond with understanding, respect, and evidence-based insights.
      Always maintain a safe, non-judgmental space.
      If you detect any crisis situations, provide appropriate resources and support.`,
      
      contextAware: `Consider the user's current emotional state, conversation history, and relevant mental health resources.
      Adapt your responses to match their needs while maintaining professional boundaries.`,
      
      structuredResponse: `Format your responses to include:
      1. Empathetic acknowledgment
      2. Relevant insights or techniques
      3. Actionable suggestions
      4. Follow-up questions or resources
      Always ensure responses are structured, clear, and supportive.`,
    },
    crisis: {
      detection: [
        "suicide", "self-harm", "kill myself", "end it all", "no reason to live",
        "want to die", "better off dead", "can't go on", "give up", "too much pain"
      ],
      response: `I hear that you're in a lot of pain right now, and I want you to know that your life has value. 
      Help is available 24/7:
      - National Crisis Hotline (US): 988
      - Crisis Text Line: Text HOME to 741741
      Please reach out to these professional services - they are there to help and support you.
      Would you like me to provide more local resources or help you connect with immediate support?`
    }
  },
  safety: {
    topics: {
      restricted: ["illegal activities", "explicit content", "medical diagnosis"],
      requiresDisclaimer: ["medication", "treatment changes", "physical symptoms"]
    },
    disclaimers: {
      medical: "I'm not a licensed medical professional. Please consult with your healthcare provider for medical advice.",
      therapy: "While I aim to be supportive, I'm not a substitute for professional therapy. Consider speaking with a licensed mental health professional.",
      crisis: "If you're experiencing a mental health emergency, please contact emergency services or a crisis hotline immediately."
    }
  },
  contextTracking: {
    moodKeywords: {
      positive: ["happy", "grateful", "excited", "peaceful", "confident"],
      negative: ["sad", "anxious", "frustrated", "overwhelmed", "hopeless"],
      neutral: ["okay", "fine", "normal", "unsure"]
    },
    topicCategories: [
      "emotions", "relationships", "work", "health", "personal-growth",
      "anxiety", "depression", "stress", "sleep", "self-care"
    ],
    intensityIndicators: {
      high: ["extremely", "severely", "always", "never", "completely"],
      medium: ["often", "sometimes", "frequently", "occasionally"],
      low: ["rarely", "slightly", "a bit", "somewhat"]
    }
  }
};

export function getSystemPrompt(role: keyof typeof aiConfig.roles = "therapist"): string {
  return `${aiConfig.prompts.system.base}
  ${aiConfig.prompts.system.contextAware}
  ${aiConfig.prompts.system.structuredResponse}
  You are acting as a ${aiConfig.roles[role]}.`;
}

export function detectCrisis(text: string): boolean {
  return aiConfig.prompts.crisis.detection.some(phrase => 
    text.toLowerCase().includes(phrase.toLowerCase())
  );
}

export function getCrisisResponse(): string {
  return aiConfig.prompts.crisis.response;
}

export function getSafetyDisclaimer(topic: string): string | null {
  if (aiConfig.safety.topics.restricted.includes(topic)) {
    return null; // Don't provide response for restricted topics
  }
  
  if (aiConfig.safety.topics.requiresDisclaimer.includes(topic)) {
    return aiConfig.safety.disclaimers[topic as keyof typeof aiConfig.safety.disclaimers] || 
           aiConfig.safety.disclaimers.medical;
  }
  
  return null;
}

export function analyzeMoodIntensity(text: string): number {
  const words = text.toLowerCase().split(/\s+/);
  let intensity = 0;
  let count = 0;

  // Check intensity indicators
  Object.entries(aiConfig.contextTracking.intensityIndicators).forEach(([level, indicators]) => {
    indicators.forEach(indicator => {
      if (words.includes(indicator)) {
        intensity += level === "high" ? 1 : level === "medium" ? 0.6 : 0.3;
        count++;
      }
    });
  });

  // Check mood keywords
  Object.entries(aiConfig.contextTracking.moodKeywords).forEach(([type, keywords]) => {
    keywords.forEach(keyword => {
      if (words.includes(keyword)) {
        intensity += type === "positive" ? 0.8 : type === "negative" ? 0.7 : 0.5;
        count++;
      }
    });
  });

  return count > 0 ? Math.min(intensity / count, 1) : 0.5;
}

export function getTemperature(mode: keyof typeof aiConfig.temperature = "default"): number {
  return aiConfig.temperature[mode];
}

export function getModelConfig(useDefault = true) {
  return {
    model: useDefault ? aiConfig.model.default : aiConfig.model.fallback,
    maxTokens: aiConfig.model.maxResponseTokens,
    contextWindow: aiConfig.model.contextWindow,
    temperature: getTemperature(), // Add temperature here
  };
}

export const getSystemPromptOriginal = (): string => {
  const { identity, introduction, conversationGuidelines, privacyNotice } = systemConfig;
  
  return `
Role: ${identity.name} ${identity.emoji} - ${identity.role} (${identity.version})

${introduction}

Conversation Guidelines:
- Tone: ${conversationGuidelines.tone}
- Style: ${conversationGuidelines.style}
- Boundaries:
${conversationGuidelines.boundaries.map(b => `  • ${b}`).join('\n')}

Privacy Notice:
${privacyNotice}

Response Format:
1. Listen actively and reflect understanding
2. Provide supportive, non-judgmental responses
3. Offer relevant resources when appropriate
4. Guide towards professional help when needed
5. Maintain clear boundaries while being empathetic
`;
};