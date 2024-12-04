import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { SentimentDisplay } from '@/components/insights/SentimentDisplay';
import { RecommendationList } from '@/components/insights/RecommendationList';
import { ConversationSummary } from '@/components/insights/ConversationSummary';

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
    type: 'technique',
    title: 'Morning Mindfulness Ritual',
    description: 'Start your day with a 5-minute mindfulness practice to set a positive tone.',
    priority: 0.9,
    tags: ['mindfulness', 'morning-routine', 'wellness'],
    timeRequired: '5 minutes',
    difficulty: 'beginner',
    effectiveness: 0.85,
  },
  {
    type: 'activity',
    title: 'Nature Walk Meditation',
    description: 'Combine gentle exercise with mindfulness through a guided nature walk.',
    priority: 0.8,
    tags: ['exercise', 'outdoors', 'meditation'],
    timeRequired: '20 minutes',
    difficulty: 'beginner',
    effectiveness: 0.9,
  },
];

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

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left Side - Text Content */}
            <motion.div 
              className="lg:w-1/2 mb-12 lg:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Your AI Companion for
                <span className="text-purple-600"> Emotional Wellness</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Experience personalized support powered by advanced emotional intelligence
                and real-time insights.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/chat"
                  className="px-8 py-4 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
                >
                  Start Your Journey
                </Link>
                <Link
                  href="/learn"
                  className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-full font-medium hover:bg-purple-50 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>

            {/* Right Side - Demo Components */}
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <SentimentDisplay sentiment={demoSentiment} className="mb-6" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-center text-gray-900 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Intelligent Features for Your Well-being
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Emotional Analysis */}
            <motion.div
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🎭</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Emotional Analysis
              </h3>
              <p className="text-gray-600">
                Advanced sentiment analysis provides real-time insights into your emotional state
                and communication patterns.
              </p>
            </motion.div>

            {/* Personalized Recommendations */}
            <motion.div
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Smart Recommendations
              </h3>
              <p className="text-gray-600">
                Get personalized suggestions for activities, techniques, and resources
                based on your unique needs and preferences.
              </p>
            </motion.div>

            {/* Progress Tracking */}
            <motion.div
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Progress Insights
              </h3>
              <p className="text-gray-600">
                Track your emotional journey and wellness progress with detailed analytics
                and actionable insights.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-center text-gray-900 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            See It in Action
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <RecommendationList
                recommendations={demoRecommendations}
                className="mb-8 lg:mb-0"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <ConversationSummary
                summary={demoSummary}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Well-being?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have discovered a more mindful and balanced life
              with our AI companion.
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-4 bg-white text-purple-600 rounded-full font-medium hover:bg-purple-50 transition-colors"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link href="/security" className="text-gray-400 hover:text-white">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-gray-400 hover:text-white">Documentation</Link></li>
                <li><Link href="/help" className="text-gray-400 hover:text-white">Help Center</Link></li>
                <li><Link href="/guides" className="text-gray-400 hover:text-white">Guides</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link></li>
                <li><Link href="/cookies" className="text-gray-400 hover:text-white">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © 2024 Serenity AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
