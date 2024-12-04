export interface CrisisAssessment {
  severity: "none" | "low" | "medium" | "high" | "severe";
  confidence: number;
  triggers: string[];
  riskFactors: string[];
  recommendedActions: string[];
  urgency: boolean;
  requiresProfessional: boolean;
  safetyPlan?: SafetyPlan;
}

export interface SafetyPlan {
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
