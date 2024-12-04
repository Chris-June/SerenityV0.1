export interface UserProfile {
  interests: string[];
  challenges: string[];
  preferences: {
    timeAvailable: "limited" | "moderate" | "flexible";
    activityLevel: "low" | "medium" | "high";
    socialPreference: "individual" | "group" | "both";
    learningStyle: "visual" | "auditory" | "kinesthetic";
  };
  progress: {
    completedActivities: string[];
    effectiveStrategies: string[];
    challengingAreas: string[];
  };
}
