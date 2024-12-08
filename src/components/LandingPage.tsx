import { Button } from '@/components/ui/button';
import { 
  Heart, 
 
  Wind, 
  Sparkles,
  Brain,
  LineChart,
  Fingerprint,
  BarChart3,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SentimentDisplay } from '@/components/insights/SentimentDisplay';
import { RecommendationList } from '@/components/insights/RecommendationList';
import { Recommendation } from '@/types/recommendation';
import { ConversationSummary } from '@/components/insights/ConversationSummary';
import { useState, useEffect } from 'react';
import { FeaturesModal } from '@/components/modals/FeaturesModal';

interface LandingPageProps {
  onStart: () => void;
}

// Demo data for new features
const demoSentiment = {
  score: 0.7,
  emotions: {
    joy: 0.8,
    sadness: 0.1,
    anger: 0.05,
    fear: 0.15,
    surprise: 0.3,
    love: 0.6,
  },
  topics: [
    { name: 'wellness', sentiment: 0.8, confidence: 0.9 },
    { name: 'mindfulness', sentiment: 0.7, confidence: 0.85 },
    { name: 'progress', sentiment: 0.9, confidence: 0.95 },
  ],
  language: {
    formality: 0.7,
    certainty: 0.8,
    urgency: 0.3,
  },
  intensity: 0.65,
};

const demoRecommendations = [
  {
    type: "technique" as const,
    title: 'Morning Mindfulness Ritual',
    description: 'Start your day with a 5-minute mindfulness practice to set a positive tone.',
    priority: 0.9,
    tags: ['mindfulness', 'morning-routine', 'wellness'],
    timeRequired: '5 minutes',
    difficulty: 'beginner' as const,
    effectiveness: 0.85,
  },
  {
    type: "activity" as const,
    title: 'Nature Walk Meditation',
    description: 'Combine gentle exercise with mindfulness through a guided nature walk.',
    priority: 0.8,
    tags: ['exercise', 'outdoors', 'meditation'],
    timeRequired: '20 minutes',
    difficulty: 'beginner' as const,
    effectiveness: 0.9,
  },
] satisfies Recommendation[];

const demoSummary = {
  overview: "Recent conversations show positive engagement with wellness practices and growing emotional awareness.",
  keyPoints: [
    "Consistent progress in daily mindfulness practice",
    "Improved emotional regulation techniques",
    "Growing interest in holistic wellness",
  ],
  emotionalJourney: {
    start: "somewhat positive",
    middle: "very positive",
    end: "very positive",
  },
  topics: [
    { name: "mindfulness", mentions: 5, sentiment: 0.8 },
    { name: "wellness", mentions: 3, sentiment: 0.9 },
    { name: "progress", mentions: 4, sentiment: 0.7 },
  ],
  insights: {
    patterns: [
      "Regular morning practice",
      "Positive response to nature-based activities",
    ],
    suggestions: [
      "Consider group activities",
      "Explore advanced techniques",
    ],
    progress: [
      "Consistent daily practice",
      "Improved stress management",
    ],
  },
  metrics: {
    duration: 45,
    messageCount: 28,
    averageResponseTime: 12,
    engagementScore: 0.9,
  },
};

export function LandingPage({ onStart }: LandingPageProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<(typeof features)[0] | null>(null);

  useEffect(() => {
    setMounted(true);
    // Add keyframes to document
    const style = document.createElement('style');
    style.textContent = `
      @keyframes glow {
        0%, 100% {
          box-shadow: 0 0 8px #22c55e, 0 0 15px #22c55e, 0 0 22px #22c55e;
        }
        50% {
          box-shadow: 0 0 15px #22c55e, 0 0 30px #22c55e, 0 0 45px #22c55e;
        }
      }
      .glow-effect {
        animation: glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      .feature-icon {
        position: relative;
        z-index: 10;
        padding: 1rem;
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: linear-gradient(to right, var(--primary), #22c55e);
      }
      .feature-icon.glow-effect {
        animation-delay: calc(var(--delay) * 200ms);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!mounted) return null;

  const features = [
    {
      icon: Heart,
      title: 'Emotional Support',
      description: 'A safe space to express your feelings and thoughts without judgment',
      expandedContent: {
        overview: 'Our emotional support system provides a judgment-free environment where you can freely express your thoughts, feelings, and concerns. Using advanced natural language processing, we understand the nuances of your emotions and provide appropriate support.',
        benefits: [
          'Express yourself freely without fear of judgment',
          'Receive empathetic and understanding responses',
          'Track your emotional journey over time',
          'Access support 24/7 whenever you need it'
        ],
        howItWorks: [
          'Start a conversation about anything that\'s on your mind',
          'Our AI analyzes your emotional state and context',
          'Receive personalized responses and support',
          'Get suggestions for coping strategies when needed'
        ],
        tips: [
          'Be honest and open about your feelings',
          'Use specific examples when describing situations',
          'Take time to reflect on the responses',
          'Regular check-ins can help track emotional patterns'
        ]
      }
    },
    {
      icon: Brain,
      title: 'Mental Wellness',
      description: 'Evidence-based techniques to support your mental health journey',
      expandedContent: {
        overview: 'Our mental wellness features are built on scientifically-proven techniques and strategies to support your psychological well-being. We combine cognitive behavioral therapy principles with modern technology to provide effective mental health support.',
        benefits: [
          'Access to evidence-based mental health techniques',
          'Personalized strategies based on your needs',
          'Progress tracking and insights',
          'Integration with professional mental health resources'
        ],
        howItWorks: [
          'Complete an initial assessment of your mental health needs',
          'Receive personalized recommendations and techniques',
          'Practice exercises and track your progress',
          'Get regular feedback and adjustments to your plan'
        ],
        tips: [
          'Consistency is key - try to practice techniques regularly',
          'Start with shorter sessions and gradually increase duration',
          'Keep notes about what works best for you',
          'Don\'t hesitate to adjust techniques to fit your needs'
        ]
      }
    },
    {
      icon: BarChart3,
      title: 'Sentiment Analysis',
      description: 'Advanced emotional analysis with real-time insights and patterns',
      new: true,
      expandedContent: {
        overview: 'Our sentiment analysis feature uses cutting-edge AI to analyze your emotional patterns and provide real-time insights. This helps you better understand your emotional trends and identify areas for growth.',
        benefits: [
          'Real-time emotional pattern recognition',
          'Detailed mood tracking and analysis',
          'Identification of emotional triggers',
          'Personalized recommendations based on patterns'
        ],
        howItWorks: [
          'AI analyzes your conversations and interactions',
          'Emotional patterns are identified and categorized',
          'Visual representations of your emotional journey',
          'Actionable insights are generated based on analysis'
        ],
        tips: [
          'Regular interaction provides more accurate analysis',
          'Review your emotional patterns weekly',
          'Use insights to identify triggers and patterns',
          'Share relevant insights with your mental health professional'
        ]
      }
    },
    {
      icon: Lightbulb,
      title: 'Smart Recommendations',
      description: 'Personalized suggestions based on your unique needs and progress',
      new: true,
      expandedContent: {
        overview: 'Our smart recommendation system learns from your interactions and progress to provide personalized suggestions that evolve with your journey. Using advanced machine learning, we tailor recommendations to your specific needs and goals.',
        benefits: [
          'Personalized recommendations based on your progress',
          'Adaptive suggestions that evolve with you',
          'Integration with your daily routine',
          'Evidence-based activities and exercises'
        ],
        howItWorks: [
          'System analyzes your usage patterns and preferences',
          'AI generates personalized recommendations',
          'Feedback is collected to improve future suggestions',
          'Recommendations adapt based on your progress'
        ],
        tips: [
          'Provide feedback on recommendations to improve accuracy',
          'Try different suggested activities to find what works best',
          'Track your progress with recommended activities',
          'Balance different types of recommended activities'
        ]
      }
    },
    {
      icon: LineChart,
      title: 'Progress Tracking',
      description: 'Monitor your emotional well-being with intuitive mood tracking',
      expandedContent: {
        overview: 'Our progress tracking feature helps you visualize and understand your emotional well-being journey. With intuitive charts and detailed insights, you can see how far you\'ve come and identify areas for growth.',
        benefits: [
          'Visual representation of your progress',
          'Detailed insights into patterns and trends',
          'Goal setting and milestone tracking',
          'Export capabilities for sharing with professionals'
        ],
        howItWorks: [
          'Regular mood and activity logging',
          'AI-powered pattern recognition',
          'Generation of progress reports and insights',
          'Goal tracking and milestone celebrations'
        ],
        tips: [
          'Log your mood at consistent times each day',
          'Use tags to track specific triggers or situations',
          'Review your progress weekly and monthly',
          'Share progress reports with your support network'
        ]
      }
    },
    {
      icon: Wind,
      title: 'Breathing Exercises',
      description: 'Simple techniques to help manage stress and anxiety',
      expandedContent: {
        overview: 'Our breathing exercises feature offers a variety of research-backed breathing techniques to help you manage stress, reduce anxiety, and improve focus. These exercises can be done anywhere, anytime.',
        benefits: [
          'Immediate stress and anxiety relief',
          'Improved focus and concentration',
          'Better sleep quality',
          'Enhanced emotional regulation'
        ],
        howItWorks: [
          'Choose from various breathing techniques',
          'Follow guided animations and instructions',
          'Track your practice sessions',
          'Receive recommendations for specific situations'
        ],
        tips: [
          'Start with short sessions (2-3 minutes)',
          'Practice in a quiet, comfortable environment',
          'Use reminders to maintain regular practice',
          'Try different techniques for different situations'
        ]
      }
    },
    {
      icon: AlertCircle,
      title: 'Crisis Detection',
      description: 'Proactive risk assessment and immediate support resources',
      new: true,
      expandedContent: {
        overview: 'Our crisis detection system uses advanced AI to identify potential crisis situations and provide immediate access to appropriate support resources. This proactive approach helps ensure you get help when you need it most.',
        benefits: [
          'Early detection of potential crisis situations',
          'Immediate access to support resources',
          'Integration with emergency services',
          'Customizable emergency contact list'
        ],
        howItWorks: [
          'AI monitors conversations for crisis indicators',
          'Risk assessment is performed in real-time',
          'Immediate connection to appropriate resources',
          'Optional notification of emergency contacts'
        ],
        tips: [
          'Keep emergency contact information up to date',
          'Familiarize yourself with available resources',
          'Don\'t hesitate to use crisis support',
          'Share relevant information with your support network'
        ]
      }
    },
    {
      icon: Fingerprint,
      title: 'Private & Secure',
      description: 'Your data is protected with state-of-the-art encryption',
      expandedContent: {
        overview: 'We prioritize your privacy and security with state-of-the-art encryption and strict data protection protocols. Your personal information and conversations are kept completely confidential and secure.',
        benefits: [
          'End-to-end encryption for all data',
          'Strict privacy controls and permissions',
          'Regular security audits and updates',
          'Transparent data handling policies'
        ],
        howItWorks: [
          'Data is encrypted during transmission and storage',
          'Regular security updates and maintenance',
          'Strict access controls and authentication',
          'Automated security monitoring and threat detection'
        ],
        tips: [
          'Use a strong, unique password',
          'Enable two-factor authentication',
          'Regularly review privacy settings',
          'Keep your app and system updated'
        ]
      }
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="relative pb-24">
        <div className="flex flex-col items-center justify-center pt-16">
          <motion.div
            className="relative mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.2, 0.4]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="relative z-10 p-2 rounded-full bg-gradient-to-r from-primary to-emerald-500 glow-effect"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 0 15px #22c55e, 0 0 30px #22c55e, 0 0 45px #22c55e",
                  "0 0 30px #22c55e, 0 0 60px #22c55e, 0 0 90px #22c55e",
                  "0 0 15px #22c55e, 0 0 30px #22c55e, 0 0 45px #22c55e"
                ]
              }}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <Heart className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-8 pb-4 animate-text bg-gradient-to-r from-primary via-emerald-500 via-teal-400 to-primary bg-clip-text text-transparent bg-300%"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Better Mental Wellness
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground text-center mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your personal companion for emotional support, guidance, and mental health insights
          </motion.p>
          <motion.div 
            className="mt-10 flex items-center justify-center gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              size="lg"
              onClick={onStart}
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Click Here to Enter
              <Sparkles className="ml-2 h-4 w-4 group-hover:animate-pulse" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="relative py-16">
        <div className="absolute inset-0 bg-background/95" />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight animate-text bg-gradient-to-r from-primary via-emerald-500 via-teal-400 to-primary bg-clip-text text-transparent bg-300%">
              Intelligent Features in Action
            </h2>
            <p className="mt-4 text-muted-foreground">
              Experience our advanced AI capabilities through interactive demonstrations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden">
                <div className="relative p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold animate-text bg-gradient-to-r from-primary via-emerald-500 via-teal-400 to-primary bg-clip-text text-transparent bg-300%">
                      Real-time Emotional Analysis
                    </h3>
                  </div>
                  <SentimentDisplay sentiment={demoSentiment} />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden">
                <div className="relative p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold animate-text bg-gradient-to-r from-primary via-emerald-500 via-teal-400 to-primary bg-clip-text text-transparent bg-300%">
                      Smart Recommendations
                    </h3>
                  </div>
                  <RecommendationList recommendations={demoRecommendations} />
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden">
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <LineChart className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold animate-text bg-gradient-to-r from-primary via-emerald-500 via-teal-400 to-primary bg-clip-text text-transparent bg-300%">
                    Conversation Insights
                  </h3>
                </div>
                <ConversationSummary summary={demoSummary} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4 animate-text bg-gradient-to-r from-primary via-emerald-500 via-teal-400 to-primary bg-clip-text text-transparent bg-300%">
            Features Designed for Your Well-being
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and insights to support your mental health journey
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-4 gap-y-12 lg:max-w-none lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="flex flex-col items-center text-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden">
                    {feature.new && (
                      <span className="absolute -top-2 -right-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                        New
                      </span>
                    )}
                    <div className="relative p-6">
                      <motion.div
                        className="feature-icon glow-effect"
                        style={{ '--delay': index } as React.CSSProperties}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground mb-4">{feature.description}</p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setSelectedFeature(feature)}
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </dl>
        </div>

        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block">
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 blur-lg opacity-75" />
              <div className="relative rounded-lg border bg-card/50 backdrop-blur-sm p-6">
                <p className="text-base text-muted-foreground max-w-2xl">
                  While Serenity provides support and resources, it's not a replacement for
                  professional mental health care. If you're in crisis, please reach out to
                  emergency services or mental health professionals.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <FeaturesModal
        isOpen={!!selectedFeature}
        onClose={() => setSelectedFeature(null)}
        feature={selectedFeature || undefined}
      />
    </div>
  );
}