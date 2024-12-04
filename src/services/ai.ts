import { Message } from "@/types";
import { StructuredResponse, AIResponse } from "@/types/ai-response";
import { 
  aiConfig, 
  getSystemPrompt, 
  detectCrisis, 
  getCrisisResponse,
  getSafetyDisclaimer,
  getTemperature,
  getModelConfig
} from "@/config/ai-config";
import { analyzeConversation } from "./conversation-analyzer";
import { searchSimilar } from "./knowledge-base";

export async function generateAIResponse(messages: Message[]): Promise<AIResponse> {
  try {
    // Analyze conversation context
    const conversationInsights = await analyzeConversation(messages);
    const lastMessage = messages[messages.length - 1];
    
    // Check for crisis
    if (detectCrisis(lastMessage.content)) {
      return generateCrisisResponse(conversationInsights);
    }

    // Get relevant resources
    const relevantResources = await searchSimilar(lastMessage.content, 3);

    // Generate structured response
    const structuredMessages = await generateStructuredMessages(
      messages,
      conversationInsights,
      relevantResources
    );

    return {
      messages: structuredMessages,
      context: {
        mood: conversationInsights.mood.current,
        intensity: conversationInsights.mood.intensity,
        topics: conversationInsights.topics,
        relevantResources: relevantResources.map(r => r.content),
      },
      suggestedActions: await generateSuggestedActions(
        conversationInsights,
        relevantResources
      ),
    };
  } catch (error) {
    console.error("Error generating AI response:", error);
    return generateErrorResponse();
  }
}

async function generateStructuredMessages(
  messages: Message[],
  insights: Awaited<ReturnType<typeof analyzeConversation>>,
  resources: Awaited<ReturnType<typeof searchSimilar>>
): Promise<StructuredResponse[]> {
  const structuredMessages: StructuredResponse[] = [];

  // Add empathetic acknowledgment
  structuredMessages.push({
    type: "empathy",
    content: generateEmpathyResponse(insights),
    metadata: {
      confidence: 0.9,
      mood: insights.mood.current,
      intensity: insights.mood.intensity,
    },
  });

  // Add relevant insights or techniques
  if (resources.length > 0) {
    structuredMessages.push({
      type: "suggestion",
      content: resources[0].content,
      metadata: {
        confidence: 0.8,
        source: resources[0].metadata?.source,
        tags: resources[0].metadata?.topic as string[],
      },
    });
  }

  // Add follow-up questions or prompts
  if (insights.topics.length > 0) {
    structuredMessages.push({
      type: "question",
      content: generateFollowUpQuestion(insights),
      metadata: {
        confidence: 0.7,
        topics: insights.topics,
        followUp: generateFollowUpQuestions(insights),
      },
    });
  }

  return structuredMessages;
}

function generateEmpathyResponse(insights: Awaited<ReturnType<typeof analyzeConversation>>): string {
  const { mood, concerns } = insights;
  
  if (concerns.includes("crisis")) {
    return getCrisisResponse();
  }

  const empathyTemplates = {
    positive: [
      "I'm glad to hear you're feeling [mood]. That's wonderful!",
      "It's great that you're experiencing [mood] moments.",
    ],
    negative: [
      "I hear how [mood] you're feeling. It's completely valid to feel this way.",
      "I'm sorry you're feeling [mood]. Let's work through this together.",
    ],
    neutral: [
      "Thank you for sharing how you're feeling.",
      "I appreciate you opening up about your experience.",
    ],
  };

  const templates = empathyTemplates[mood.current as keyof typeof empathyTemplates] || empathyTemplates.neutral;
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  return template.replace("[mood]", mood.current);
}

function generateFollowUpQuestion(insights: Awaited<ReturnType<typeof analyzeConversation>>): string {
  const { topics, progress } = insights;
  
  if (progress.challenges.length > 0) {
    return "What do you think would help you overcome these challenges?";
  }
  
  if (progress.insights.length > 0) {
    return "How has this realization changed your perspective?";
  }
  
  if (topics.length > 0) {
    return `Would you like to explore more about ${topics[0]}?`;
  }
  
  return "How else can I support you today?";
}

function generateFollowUpQuestions(insights: Awaited<ReturnType<typeof analyzeConversation>>): string[] {
  const questions: string[] = [];
  const { topics, concerns, progress } = insights;

  if (topics.includes("anxiety")) {
    questions.push("What triggers your anxiety the most?");
    questions.push("Have you tried any relaxation techniques?");
  }

  if (topics.includes("depression")) {
    questions.push("What activities usually help lift your mood?");
    questions.push("Would you like to explore some coping strategies?");
  }

  if (concerns.includes("sleep")) {
    questions.push("How has your sleep routine been lately?");
    questions.push("Would you like to learn about sleep hygiene techniques?");
  }

  if (progress.challenges.length > 0) {
    questions.push("What support do you need to overcome these challenges?");
  }

  return questions.slice(0, 3); // Limit to 3 questions
}

async function generateSuggestedActions(
  insights: Awaited<ReturnType<typeof analyzeConversation>>,
  resources: Awaited<ReturnType<typeof searchSimilar>>
) {
  const actions = {
    immediate: [] as string[],
    shortTerm: [] as string[],
  };

  // Add immediate actions based on concerns
  insights.concerns.forEach(concern => {
    if (concern === "crisis") {
      actions.immediate.push("Contact a mental health professional or crisis hotline");
      actions.immediate.push("Reach out to a trusted friend or family member");
    }
    if (concern === "anxiety") {
      actions.immediate.push("Try a 5-minute breathing exercise");
      actions.immediate.push("Step away from stressful situations if possible");
    }
  });

  // Add short-term actions based on topics and resources
  resources.forEach(resource => {
    if (resource.metadata?.actionItems) {
      actions.shortTerm.push(...(resource.metadata.actionItems as string[]));
    }
  });

  return actions;
}

function generateCrisisResponse(insights: Awaited<ReturnType<typeof analyzeConversation>>): AIResponse {
  return {
    messages: [
      {
        type: "crisis",
        content: getCrisisResponse(),
        metadata: {
          severity: "high",
          immediate: true,
          requiresAction: true,
        },
      },
    ],
    context: {
      mood: insights.mood.current,
      intensity: insights.mood.intensity,
      topics: ["crisis", ...insights.topics],
    },
    suggestedActions: {
      immediate: [
        "Contact emergency services if in immediate danger",
        "Call the National Crisis Hotline: 988",
        "Reach out to a trusted person for support",
      ],
      shortTerm: [
        "Schedule an appointment with a mental health professional",
        "Create a safety plan with professional help",
        "Join a support group or community",
      ],
    },
  };
}

function generateErrorResponse(): AIResponse {
  return {
    messages: [
      {
        type: "clarification",
        content: "I apologize, but I'm having trouble responding right now. Please try again or rephrase your message.",
        metadata: {
          severity: "low",
          retryable: true,
        },
      },
    ],
    context: {
      mood: "neutral",
      intensity: 0.5,
      topics: [],
    },
    suggestedActions: {
      immediate: ["Try rephrasing your message", "Wait a moment and try again"],
      shortTerm: [],
    },
  };
}
