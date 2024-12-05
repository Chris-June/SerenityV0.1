import { Message, SentimentAnalysis, CrisisAssessment, SafetyPlan } from "@/types";
import { analyzeSentiment } from "./sentiment-analyzer";
import { summarizeConversation } from "./conversation-summarizer";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  console.error('🔴 OpenAI API Key is missing in crisis detector');
  throw new Error('VITE_OPENAI_API_KEY is not set in environment variables');
} else {
  console.log('🟢 OpenAI API Key is configured in crisis detector');
}

const crisisIndicators = {
  suicidal: {
    explicit: [
      "want to die",
      "kill myself",
      "end my life",
      "suicide",
      "better off dead",
    ],
    implicit: [
      "can't go on",
      "no reason to live",
      "what's the point",
      "tired of life",
      "give up",
    ],
    behavioral: [
      "saying goodbye",
      "giving away",
      "putting affairs in order",
      "making arrangements",
      "final wishes",
    ],
  },
  selfHarm: {
    explicit: [
      "cut myself",
      "hurt myself",
      "self harm",
      "self-harm",
      "self injury",
    ],
    implicit: [
      "deserve pain",
      "feel something",
      "punish myself",
      "make it hurt",
      "physical pain",
    ],
  },
  harm: {
    toOthers: [
      "hurt them",
      "make them pay",
      "revenge",
      "destroy",
      "kill",
    ],
    fromOthers: [
      "afraid they'll",
      "threatened",
      "scared of them",
      "might hurt me",
      "in danger",
    ],
  },
};

const riskFactors = {
  personal: [
    "previous attempt",
    "mental health history",
    "substance use",
    "isolation",
    "recent loss",
  ],
  situational: [
    "job loss",
    "relationship end",
    "financial crisis",
    "health issues",
    "trauma",
  ],
  behavioral: [
    "not sleeping",
    "not eating",
    "withdrawal",
    "agitation",
    "impulsivity",
  ],
};

const protectiveFactors = {
  social: [
    "family support",
    "friends",
    "therapist",
    "community",
    "pets",
  ],
  personal: [
    "hope",
    "future plans",
    "responsibilities",
    "beliefs",
    "coping skills",
  ],
  resources: [
    "treatment",
    "medication",
    "support group",
    "crisis plan",
    "safe environment",
  ],
};

async function analyzeMessagesWithAI(messages: Message[]): Promise<{
  riskLevel: string;
  analysis: string;
  recommendations: string[];
}> {
  const messageContent = messages.map(msg => msg.content).join('\n');
  
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a mental health analysis assistant. Analyze the following messages for signs of crisis, emotional distress, or concerning patterns. Provide a risk assessment and recommendations."
        },
        {
          role: "user",
          content: messageContent
        }
      ],
      model: "gpt-3.5-turbo",
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from OpenAI');

    // Parse the response (assuming a structured response)
    const analysis = {
      riskLevel: response.includes('high risk') ? 'high' : 
                 response.includes('medium risk') ? 'medium' : 'low',
      analysis: response,
      recommendations: response.split('\n').filter(line => line.includes('recommend'))
    };

    return analysis;
  } catch (error) {
    console.error('Error analyzing messages with AI:', error);
    return {
      riskLevel: 'unknown',
      analysis: 'Error analyzing messages',
      recommendations: ['Seek professional help if in immediate crisis']
    };
  }
}

export async function assessCrisis(messages: Message[]): Promise<CrisisAssessment> {
  console.log('🚨 Starting crisis detection analysis', { messageCount: messages.length });

  try {
    const recentMessages = messages.slice(-5);
    const lastMessage = messages[messages.length - 1];
    
    console.log('📊 Analyzing sentiment patterns');
    const sentiment: SentimentAnalysis = await analyzeSentiment(lastMessage.content);
    
    console.log('💭 Analyzing conversation context');
    const conversationSummary = await summarizeConversation(messages);
    
    console.log('🔍 Checking for crisis indicators');
    const indicators = detectCrisisIndicators(recentMessages);
    const risks = detectRiskFactors(recentMessages);
    const protective = detectProtectiveFactors(recentMessages);

    console.log('🔍 Checking for AI-powered analysis');
    const aiAnalysis = await analyzeMessagesWithAI(messages);

    console.log('⚖️ Evaluating severity level');
    const severity = calculateSeverity(indicators, risks, protective);
    let confidence = calculateConfidence(indicators, sentiment);
    const recommendedActions = generateRecommendedActions(severity);
    const urgency = isUrgent(severity, indicators);
    const needsProfessional = requiresProfessional(severity, risks);

    // Use conversation summary to enhance assessment
    if (conversationSummary) {
      // Add any additional risk indicators from conversation context
      const contextualRisks = extractContextualRisks(conversationSummary.overview);
      risks.push(...contextualRisks);

      // Adjust confidence based on conversation context
      const contextConfidence = calculateContextConfidence(conversationSummary.overview);
      confidence *= contextConfidence;
    }

    let safetyPlan: SafetyPlan | undefined;
    if (severity === 'medium' || severity === 'high' || severity === 'severe') {
      safetyPlan = generateSafetyPlan({ 
        severity, 
        confidence, 
        triggers: indicators, 
        riskFactors: risks, 
        recommendedActions, 
        urgency, 
        requiresProfessional: needsProfessional,
        timestamp: new Date().toISOString()
      }, protective);
    }
    
    console.log('💡 Generating recommendations based on severity:', severity);
    const baseRecommendations = generateRecommendedActions(severity);
    const recommendations = [...new Set([...baseRecommendations, ...aiAnalysis.recommendations])];

    const assessment: CrisisAssessment = {
      severity,
      confidence,
      triggers: indicators,
      riskFactors: risks,
      recommendedActions: recommendations,
      urgency,
      requiresProfessional: needsProfessional,
      timestamp: new Date().toISOString()
    };

    if (safetyPlan) {
      assessment.safetyPlan = safetyPlan;
    }

    console.log('✅ Crisis detection complete', { assessment });
    return assessment;
  } catch (error) {
    console.error('❌ Error in crisis detection:', error);
    throw new Error('Failed to complete crisis detection');
  }
}

function detectCrisisIndicators(messages: Message[]): string[] {
  console.log('🔍 Checking crisis indicators in messages');
  try {
    const indicators: string[] = [];
    const text = messages.map(m => m.content.toLowerCase()).join(" ");

    // Check all types of indicators
    Object.entries(crisisIndicators).forEach(([type, categories]) => {
      Object.entries(categories).forEach(([category, phrases]) => {
        phrases.forEach(phrase => {
          if (text.includes(phrase)) {
            indicators.push(`${type}:${category}:${phrase}`);
          }
        });
      });
    });

    console.log('✅ Crisis indicators check complete');
    return indicators;
  } catch (error) {
    console.error('❌ Error checking crisis indicators:', error);
    throw error;
  }
}

function detectRiskFactors(messages: Message[]): string[] {
  console.log('🔍 Checking risk factors in messages');
  try {
    const factors: string[] = [];
    const text = messages.map(m => m.content.toLowerCase()).join(" ");

    Object.entries(riskFactors).forEach(([category, phrases]) => {
      phrases.forEach(phrase => {
        if (text.includes(phrase)) {
          factors.push(`${category}:${phrase}`);
        }
      });
    });

    console.log('✅ Risk factors check complete');
    return factors;
  } catch (error) {
    console.error('❌ Error checking risk factors:', error);
    throw error;
  }
}

function detectProtectiveFactors(messages: Message[]): string[] {
  console.log('🔍 Checking protective factors in messages');
  try {
    const factors: string[] = [];
    const text = messages.map(m => m.content.toLowerCase()).join(" ");

    Object.entries(protectiveFactors).forEach(([category, phrases]) => {
      phrases.forEach(phrase => {
        if (text.includes(phrase)) {
          factors.push(`${category}:${phrase}`);
        }
      });
    });

    console.log('✅ Protective factors check complete');
    return factors;
  } catch (error) {
    console.error('❌ Error checking protective factors:', error);
    throw error;
  }
}

function calculateSeverity(
  indicators: string[],
  risks: string[],
  protective: string[]
): CrisisAssessment["severity"] {
  console.log('⚖️ Evaluating severity based on indicators');
  const score = 
    indicators.length * 2 + 
    risks.length - 
    protective.length;

  if (score <= 0) return "none";
  if (score <= 2) return "low";
  if (score <= 4) return "medium";
  if (score <= 6) return "high";
  return "severe";
}

function calculateConfidence(
  indicators: string[],
  sentiment: SentimentAnalysis
): number {
  console.log('📊 Calculating confidence score');
  const explicitCount = indicators.filter(i => i.includes(":explicit:")).length;
  const implicitCount = indicators.filter(i => i.includes(":implicit:")).length;
  
  return Math.min(
    (explicitCount * 0.4 + implicitCount * 0.2 + Math.abs(sentiment.score) * 0.4),
    1
  );
}

function generateRecommendedActions(severity: CrisisAssessment["severity"]): string[] {
  console.log('💡 Generating recommendations based on severity:', severity);
  const actions: string[] = [];

  switch (severity) {
    case "severe":
      actions.push("Contact emergency services immediately");
      actions.push("Do not leave the person alone");
      actions.push("Remove access to potential means of harm");
      break;
    case "high":
      actions.push("Contact crisis hotline or mental health professional");
      actions.push("Activate support network");
      actions.push("Create or review safety plan");
      break;
    case "medium":
      actions.push("Schedule urgent mental health appointment");
      actions.push("Connect with trusted support person");
      actions.push("Review coping strategies");
      break;
    case "low":
      actions.push("Monitor situation");
      actions.push("Provide resources for support");
      actions.push("Encourage self-care activities");
      break;
    default:
      actions.push("Continue supportive conversation");
      actions.push("Maintain awareness of changes");
  }

  return actions;
}

function isUrgent(
  severity: CrisisAssessment["severity"],
  indicators: string[]
): boolean {
  console.log('🚨 Checking if situation is urgent');
  return (
    severity === "severe" ||
    severity === "high" ||
    indicators.some(i => i.includes(":explicit:"))
  );
}

function requiresProfessional(
  severity: CrisisAssessment["severity"],
  risks: string[]
): boolean {
  console.log('👨‍⚕️ Checking if professional help is required');
  return (
    severity === "severe" ||
    severity === "high" ||
    risks.length >= 3
  );
}

function generateSafetyPlan(
  assessment: CrisisAssessment,
  protective: string[]
): SafetyPlan {
  console.log('📝 Generating safety plan');
  return {
    warningSignals: assessment.triggers.map(t => t.split(":")[2]),
    copingStrategies: [
      "Deep breathing exercises",
      "Grounding techniques",
      "Call a friend",
      "Physical exercise",
      "Mindfulness meditation",
    ],
    supportContacts: [
      {
        name: "Crisis Hotline",
        relationship: "Professional Support",
        contact: "988",
      },
      {
        name: "Emergency Services",
        relationship: "Emergency Support",
        contact: "911",
      },
    ],
    professionalResources: [
      {
        name: "Crisis Services Canada",
        type: "Crisis Support",
        contact: "1-833-456-4566",
        hours: "24/7",
      },
      {
        name: "Hope for Wellness Helpline",
        type: "Mental Health Support",
        contact: "1-855-242-3310",
        hours: "24/7",
      },
    ],
    safeEnvironment: [
      "Remove access to potential means of harm",
      "Stay in a safe, familiar environment",
      "Be around supportive people",
      "Maintain a structured routine",
    ],
    reasonsToLive: protective
      .filter(p => p.startsWith("personal:"))
      .map(p => p.split(":")[1]),
  };
}

function extractContextualRisks(summary: string): string[] {
  const contextualRisks: string[] = [];
  
  // Check for patterns indicating isolation
  if (summary.toLowerCase().includes('alone') || 
      summary.toLowerCase().includes('lonely') || 
      summary.toLowerCase().includes('isolated')) {
    contextualRisks.push('social isolation');
  }

  // Check for patterns indicating hopelessness
  if (summary.toLowerCase().includes('hopeless') || 
      summary.toLowerCase().includes('pointless') || 
      summary.toLowerCase().includes('give up')) {
    contextualRisks.push('expressed hopelessness');
  }

  // Check for patterns indicating loss
  if (summary.toLowerCase().includes('lost') || 
      summary.toLowerCase().includes('death') || 
      summary.toLowerCase().includes('died')) {
    contextualRisks.push('recent loss or grief');
  }

  return contextualRisks;
}

function calculateContextConfidence(summary: string): number {
  let contextConfidence = 1.0;

  // Increase confidence if the conversation shows consistent patterns
  if (summary.length > 200) {
    contextConfidence *= 1.2; // More context generally means more confidence
  }

  // Decrease confidence if the conversation seems inconsistent or unclear
  if (summary.toLowerCase().includes('unclear') || 
      summary.toLowerCase().includes('inconsistent')) {
    contextConfidence *= 0.8;
  }

  // Ensure confidence stays within reasonable bounds
  return Math.min(Math.max(contextConfidence, 0.5), 1.5);
}
