import { Message } from "@/types";
import { analyzeSentiment } from "./sentiment-analyzer";
import { summarizeConversation } from "./conversation-summarizer";

interface CrisisAssessment {
  severity: "none" | "low" | "medium" | "high" | "severe";
  confidence: number;
  triggers: string[];
  riskFactors: string[];
  recommendedActions: string[];
  urgency: boolean;
  requiresProfessional: boolean;
  safetyPlan?: SafetyPlan;
}

interface SafetyPlan {
  warningSignals: string[];
  copingStrategies: string[];
  supportContacts: {
    name: string;
    relationship: string;
    contact: string;
  }[];
  professionalResources: {
    name: string;
    type: string;
    contact: string;
    hours: string;
  }[];
  safeEnvironment: string[];
  reasonsToLive: string[];
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

export function assessCrisis(messages: Message[]): CrisisAssessment {
  const recentMessages = messages.slice(-5);
  const lastMessage = messages[messages.length - 1];
  
  const sentiment = analyzeSentiment(lastMessage.content);
  const conversation = summarizeConversation(messages);
  
  const assessment = {
    severity: "none" as CrisisAssessment["severity"],
    confidence: 0,
    triggers: [] as string[],
    riskFactors: [] as string[],
    recommendedActions: [] as string[],
    urgency: false,
    requiresProfessional: false,
  };

  // Check for crisis indicators
  const indicators = detectCrisisIndicators(recentMessages);
  const risks = detectRiskFactors(recentMessages);
  const protective = detectProtectiveFactors(recentMessages);

  // Assess severity
  assessment.severity = calculateSeverity(indicators, risks, protective);
  assessment.confidence = calculateConfidence(indicators, sentiment);
  assessment.triggers = indicators;
  assessment.riskFactors = risks;
  assessment.recommendedActions = generateRecommendedActions(assessment.severity);
  assessment.urgency = isUrgent(assessment.severity, indicators);
  assessment.requiresProfessional = requiresProfessional(assessment.severity, risks);

  // Generate safety plan if needed
  if (assessment.severity !== "none" && assessment.severity !== "low") {
    assessment.safetyPlan = generateSafetyPlan(assessment, protective);
  }

  return assessment;
}

function detectCrisisIndicators(messages: Message[]): string[] {
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

  return indicators;
}

function detectRiskFactors(messages: Message[]): string[] {
  const factors: string[] = [];
  const text = messages.map(m => m.content.toLowerCase()).join(" ");

  Object.entries(riskFactors).forEach(([category, phrases]) => {
    phrases.forEach(phrase => {
      if (text.includes(phrase)) {
        factors.push(`${category}:${phrase}`);
      }
    });
  });

  return factors;
}

function detectProtectiveFactors(messages: Message[]): string[] {
  const factors: string[] = [];
  const text = messages.map(m => m.content.toLowerCase()).join(" ");

  Object.entries(protectiveFactors).forEach(([category, phrases]) => {
    phrases.forEach(phrase => {
      if (text.includes(phrase)) {
        factors.push(`${category}:${phrase}`);
      }
    });
  });

  return factors;
}

function calculateSeverity(
  indicators: string[],
  risks: string[],
  protective: string[]
): CrisisAssessment["severity"] {
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
  sentiment: ReturnType<typeof analyzeSentiment>
): number {
  const explicitCount = indicators.filter(i => i.includes(":explicit:")).length;
  const implicitCount = indicators.filter(i => i.includes(":implicit:")).length;
  
  return Math.min(
    (explicitCount * 0.4 + implicitCount * 0.2 + Math.abs(sentiment.score) * 0.4),
    1
  );
}

function generateRecommendedActions(severity: CrisisAssessment["severity"]): string[] {
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
        name: "National Crisis Text Line",
        type: "Crisis Support",
        contact: "Text HOME to 741741",
        hours: "24/7",
      },
      {
        name: "SAMHSA National Helpline",
        type: "Mental Health Support",
        contact: "1-800-662-4357",
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
