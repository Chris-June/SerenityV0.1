interface Resource {
  content: string;
  metadata: {
    type: 'condition' | 'technique' | 'intervention' | 'crisis' | 'wellness' | 'research' | 'exercise' | 'sleep' | 'nutrition' | 'social';
    topic: string[];
    source?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    timeRequired?: string;
    effectiveness?: number; // 1-5 scale
  };
}

export const mentalHealthResources: Resource[] = [
  // Conditions and Symptoms
  {
    content: "Depression symptoms often include persistent sadness, loss of interest in activities, changes in sleep and appetite, difficulty concentrating, and feelings of worthlessness.",
    metadata: {
      type: 'condition',
      topic: ['depression', 'symptoms', 'mood'],
      effectiveness: 5
    }
  },
  {
    content: "Anxiety can manifest as excessive worry, restlessness, difficulty concentrating, muscle tension, and sleep problems. Physical symptoms may include rapid heartbeat and sweating.",
    metadata: {
      type: 'condition',
      topic: ['anxiety', 'symptoms', 'stress'],
      effectiveness: 5
    }
  },

  // Therapeutic Techniques
  {
    content: "Cognitive Behavioral Therapy (CBT) helps identify and change negative thought patterns and behaviors. It is effective for depression, anxiety, and other mental health conditions.",
    metadata: {
      type: 'technique',
      topic: ['therapy', 'cbt', 'thoughts'],
      source: 'American Psychological Association',
      effectiveness: 5
    }
  },
  {
    content: "Mindfulness meditation involves focusing on the present moment without judgment. Regular practice can reduce stress, anxiety, and improve emotional regulation.",
    metadata: {
      type: 'technique',
      topic: ['mindfulness', 'meditation', 'stress-reduction'],
      difficulty: 'beginner',
      timeRequired: '5-10 minutes',
      effectiveness: 4
    }
  },

  // Exercise and Physical Health
  {
    content: "Regular aerobic exercise increases endorphins, improves mood, reduces anxiety, and helps with sleep. Even 30 minutes of walking can make a difference.",
    metadata: {
      type: 'exercise',
      topic: ['physical-health', 'mood', 'anxiety'],
      difficulty: 'beginner',
      timeRequired: '30 minutes',
      effectiveness: 4
    }
  },
  {
    content: "Yoga combines physical postures, breathing exercises, and meditation. It can reduce stress, improve flexibility, and enhance mind-body connection.",
    metadata: {
      type: 'exercise',
      topic: ['yoga', 'stress-reduction', 'mindfulness'],
      difficulty: 'beginner',
      timeRequired: '15-60 minutes',
      effectiveness: 4
    }
  },

  // Sleep Hygiene
  {
    content: "Good sleep hygiene includes maintaining a consistent sleep schedule, creating a relaxing bedtime routine, and optimizing your sleep environment (dark, quiet, cool).",
    metadata: {
      type: 'sleep',
      topic: ['sleep-hygiene', 'routine', 'wellness'],
      difficulty: 'beginner',
      effectiveness: 5
    }
  },
  {
    content: "The 4-7-8 breathing technique can help with sleep: inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 4 times.",
    metadata: {
      type: 'technique',
      topic: ['sleep', 'breathing', 'relaxation'],
      difficulty: 'beginner',
      timeRequired: '2 minutes',
      effectiveness: 4
    }
  },

  // Nutrition and Mental Health
  {
    content: "A balanced diet rich in omega-3 fatty acids, vegetables, fruits, and whole grains can support brain health and mood regulation.",
    metadata: {
      type: 'nutrition',
      topic: ['diet', 'wellness', 'mood'],
      effectiveness: 4
    }
  },
  {
    content: "Limiting caffeine and alcohol intake can improve sleep quality and reduce anxiety symptoms.",
    metadata: {
      type: 'nutrition',
      topic: ['diet', 'sleep', 'anxiety'],
      effectiveness: 4
    }
  },

  // Social Support and Relationships
  {
    content: "Building and maintaining strong social connections can provide emotional support, reduce stress, and improve overall mental well-being.",
    metadata: {
      type: 'social',
      topic: ['relationships', 'support', 'wellness'],
      effectiveness: 5
    }
  },
  {
    content: "Active listening skills include maintaining eye contact, showing empathy, and avoiding judgment. These skills strengthen relationships and provide better support.",
    metadata: {
      type: 'social',
      topic: ['communication', 'relationships', 'support'],
      difficulty: 'intermediate',
      effectiveness: 4
    }
  },

  // Crisis Support
  {
    content: "If you are having thoughts of suicide, remember that help is available 24/7. Crisis hotlines provide immediate, confidential support from trained professionals.",
    metadata: {
      type: 'crisis',
      topic: ['suicide', 'emergency', 'support'],
      effectiveness: 5
    }
  },
  {
    content: "During a panic attack, focus on slow, deep breathing. Remember that panic attacks are temporary and typically peak within 10 minutes.",
    metadata: {
      type: 'crisis',
      topic: ['panic', 'anxiety', 'coping'],
      difficulty: 'beginner',
      timeRequired: '10-20 minutes',
      effectiveness: 4
    }
  },

  // Wellness Practices
  {
    content: "Gratitude journaling involves writing down things you are thankful for. This practice can improve mood, optimism, and life satisfaction.",
    metadata: {
      type: 'wellness',
      topic: ['gratitude', 'journaling', 'positive-psychology'],
      difficulty: 'beginner',
      timeRequired: '5-10 minutes',
      effectiveness: 4
    }
  },
  {
    content: "Progressive muscle relaxation involves tensing and relaxing muscle groups in sequence. This can reduce physical tension and anxiety.",
    metadata: {
      type: 'technique',
      topic: ['relaxation', 'anxiety', 'stress-reduction'],
      difficulty: 'beginner',
      timeRequired: '10-15 minutes',
      effectiveness: 4
    }
  },

  // Research-Based Insights
  {
    content: "Studies show that combining therapy with medication is often more effective than either treatment alone for depression.",
    metadata: {
      type: 'research',
      topic: ['depression', 'treatment', 'effectiveness'],
      source: 'National Institute of Mental Health',
      effectiveness: 5
    }
  },
  {
    content: "Regular meditation practice has been shown to reduce anxiety symptoms by up to 60% in clinical studies.",
    metadata: {
      type: 'research',
      topic: ['meditation', 'anxiety', 'effectiveness'],
      source: 'Journal of Clinical Psychology',
      effectiveness: 4
    }
  },

  // Daily Coping Strategies
  {
    content: "The 5-4-3-2-1 grounding technique: Name 5 things you see, 4 things you feel, 3 things you hear, 2 things you smell, and 1 thing you taste.",
    metadata: {
      type: 'technique',
      topic: ['grounding', 'anxiety', 'mindfulness'],
      difficulty: 'beginner',
      timeRequired: '5 minutes',
      effectiveness: 4
    }
  },
  {
    content: "Setting SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) can help break down overwhelming tasks and reduce anxiety.",
    metadata: {
      type: 'technique',
      topic: ['goals', 'productivity', 'anxiety'],
      difficulty: 'intermediate',
      effectiveness: 4
    }
  }
];
