import { Message } from "@/types";
import { analyzeSentiment } from "./sentiment-analyzer";
import { summarizeConversation } from "./conversation-summarizer";
import { searchSimilar } from "./knowledge-base";

interface Recommendation {
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

interface UserProfile {
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

export async function generateRecommendations(
  messages: Message[],
  userProfile: UserProfile
): Promise<Recommendation[]> {
  // Analyze recent conversation
  const summary = summarizeConversation(messages);
  const lastMessage = messages[messages.length - 1];
  const sentiment = analyzeSentiment(lastMessage.content);

  // Get relevant resources
  const resources = await searchSimilar(lastMessage.content, 5);

  // Generate recommendations based on different factors
  const recommendations: Recommendation[] = [
    ...generateMoodBasedRecommendations(sentiment),
    ...generateProgressBasedRecommendations(summary, userProfile),
    ...generateResourceBasedRecommendations(resources),
    ...generatePersonalizedActivities(userProfile, sentiment),
  ];

  // Sort and filter recommendations
  return prioritizeRecommendations(recommendations, userProfile);
}

function generateMoodBasedRecommendations(
  sentiment: ReturnType<typeof analyzeSentiment>
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const { emotions, intensity } = sentiment;

  if (emotions.anxiety > 0.5) {
    recommendations.push({
      type: "technique",
      title: "Grounding Exercise",
      description: "A simple 5-4-3-2-1 sensory awareness exercise to reduce anxiety",
      priority: emotions.anxiety * intensity,
      tags: ["anxiety", "mindfulness", "immediate-relief"],
      timeRequired: "5 minutes",
      difficulty: "beginner",
      effectiveness: 0.8,
    });
  }

  if (emotions.sadness > 0.5) {
    recommendations.push({
      type: "activity",
      title: "Mood-Lifting Activity",
      description: "Engage in a small, enjoyable activity to improve your mood",
      priority: emotions.sadness * intensity,
      tags: ["depression", "self-care", "activation"],
      timeRequired: "15-30 minutes",
      difficulty: "beginner",
      effectiveness: 0.7,
    });
  }

  if (intensity > 0.8) {
    recommendations.push({
      type: "professional",
      title: "Professional Support",
      description: "Consider speaking with a mental health professional",
      priority: intensity,
      tags: ["professional-help", "support", "therapy"],
      effectiveness: 0.9,
    });
  }

  return recommendations;
}

function generateProgressBasedRecommendations(
  summary: ReturnType<typeof summarizeConversation>,
  profile: UserProfile
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Check for recurring challenges
  summary.topics
    .filter(topic => topic.sentiment < 0 && topic.mentions > 1)
    .forEach(topic => {
      const existingStrategy = profile.progress.effectiveStrategies
        .find(strategy => strategy.includes(topic.name));

      if (existingStrategy) {
        recommendations.push({
          type: "technique",
          title: `Revisit: ${existingStrategy}`,
          description: "Return to a strategy that has helped you before",
          priority: Math.abs(topic.sentiment) * 0.8,
          tags: [topic.name, "proven-effective", "familiar"],
          effectiveness: 0.8,
        });
      } else {
        recommendations.push({
          type: "resource",
          title: `New Strategy for ${topic.name}`,
          description: `Learn a new approach to manage ${topic.name}`,
          priority: Math.abs(topic.sentiment) * 0.7,
          tags: [topic.name, "learning", "skill-building"],
          effectiveness: 0.7,
        });
      }
    });

  // Check for progress and suggest next steps
  if (summary.insights.progress.length > 0) {
    recommendations.push({
      type: "activity",
      title: "Build on Progress",
      description: "Take the next step in your well-being journey",
      priority: 0.6,
      tags: ["progress", "growth", "momentum"],
      difficulty: "intermediate",
      effectiveness: 0.8,
    });
  }

  return recommendations;
}

function generateResourceBasedRecommendations(
  resources: Awaited<ReturnType<typeof searchSimilar>>
): Recommendation[] {
  return resources.map(resource => ({
    type: "resource",
    title: resource.metadata?.title || "Relevant Resource",
    description: resource.content,
    priority: resource.metadata?.relevance || 0.5,
    tags: (resource.metadata?.topic as string[]) || [],
    timeRequired: resource.metadata?.timeRequired,
    difficulty: resource.metadata?.difficulty as "beginner" | "intermediate" | "advanced",
    effectiveness: resource.metadata?.effectiveness || 0.5,
  }));
}

function generatePersonalizedActivities(
  profile: UserProfile,
  sentiment: ReturnType<typeof analyzeSentiment>
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Match activities to user preferences
  const { timeAvailable, activityLevel, socialPreference, learningStyle } = profile.preferences;

  // Time-based recommendations
  if (timeAvailable === "limited") {
    recommendations.push({
      type: "technique",
      title: "Quick Mindfulness Break",
      description: "A brief mindfulness exercise you can do anywhere",
      priority: 0.8,
      tags: ["quick", "mindfulness", "stress-relief"],
      timeRequired: "2-5 minutes",
      difficulty: "beginner",
      effectiveness: 0.7,
    });
  }

  // Activity level recommendations
  if (activityLevel === "high" && sentiment.emotions.anxiety > 0.3) {
    recommendations.push({
      type: "activity",
      title: "Energy Release Exercise",
      description: "Channel anxiety into physical activity",
      priority: 0.7,
      tags: ["exercise", "anxiety-management", "physical"],
      timeRequired: "20-30 minutes",
      difficulty: "intermediate",
      effectiveness: 0.8,
    });
  }

  // Social preference recommendations
  if (socialPreference === "group" && sentiment.emotions.sadness > 0.3) {
    recommendations.push({
      type: "social",
      title: "Group Support Session",
      description: "Connect with others who understand",
      priority: 0.7,
      tags: ["social", "support", "connection"],
      timeRequired: "1 hour",
      effectiveness: 0.8,
    });
  }

  // Learning style recommendations
  if (learningStyle === "visual") {
    recommendations.push({
      type: "resource",
      title: "Guided Visualization",
      description: "A visual journey for relaxation and clarity",
      priority: 0.6,
      tags: ["visual", "relaxation", "meditation"],
      timeRequired: "10 minutes",
      difficulty: "beginner",
      effectiveness: 0.7,
    });
  }

  return recommendations;
}

function prioritizeRecommendations(
  recommendations: Recommendation[],
  profile: UserProfile
): Recommendation[] {
  // Filter out completed activities
  const filtered = recommendations.filter(
    rec => !profile.progress.completedActivities.includes(rec.title)
  );

  // Adjust priorities based on user profile
  const adjusted = filtered.map(rec => ({
    ...rec,
    priority: calculateAdjustedPriority(rec, profile),
  }));

  // Sort by priority and limit to top 5
  return adjusted
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5);
}

function calculateAdjustedPriority(
  recommendation: Recommendation,
  profile: UserProfile
): number {
  let priority = recommendation.priority;

  // Boost priority for matching interests
  if (profile.interests.some(interest => 
    recommendation.tags.includes(interest)
  )) {
    priority *= 1.2;
  }

  // Boost priority for matching challenges
  if (profile.challenges.some(challenge =>
    recommendation.tags.includes(challenge)
  )) {
    priority *= 1.3;
  }

  // Adjust for time availability
  if (recommendation.timeRequired) {
    const minutes = parseTimeRequired(recommendation.timeRequired);
    if (profile.preferences.timeAvailable === "limited" && minutes > 15) {
      priority *= 0.7;
    }
  }

  // Adjust for difficulty
  if (recommendation.difficulty === "advanced" && 
      profile.progress.completedActivities.length < 5) {
    priority *= 0.8;
  }

  return Math.min(priority, 1);
}

function parseTimeRequired(timeStr: string): number {
  const match = timeStr.match(/(\d+)(?:-(\d+))?\s*minutes?/);
  if (!match) return 0;
  
  const [_, min, max] = match;
  return max ? (parseInt(min) + parseInt(max)) / 2 : parseInt(min);
}
