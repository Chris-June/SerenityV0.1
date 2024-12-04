export interface Recommendation {
  type: "resource" | "technique" | "activity" | "professional" | "social";
  title: string;
  description: string;
  priority: number; // 0-1
  tags: string[];
  timeRequired?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  effectiveness?: number; // 0-1
  prerequisites?: string[];
  followUp?: string[];
}
