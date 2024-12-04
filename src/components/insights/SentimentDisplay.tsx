import React from 'react';
import { motion } from 'framer-motion';
import { SentimentAnalysis } from '@/types/sentiment';

interface SentimentDisplayProps {
  sentiment: SentimentAnalysis;
  className?: string;
}

export const SentimentDisplay: React.FC<SentimentDisplayProps> = ({
  sentiment,
  className = '',
}) => {
  const emotionColors = {
    joy: 'bg-yellow-100 text-yellow-800',
    sadness: 'bg-blue-100 text-blue-800',
    anger: 'bg-red-100 text-red-800',
    fear: 'bg-purple-100 text-purple-800',
    surprise: 'bg-green-100 text-green-800',
    love: 'bg-pink-100 text-pink-800',
  };

  const getEmotionBar = (emotion: keyof typeof emotionColors, value: number) => (
    <motion.div
      key={emotion}
      className="mb-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center">
        <span className="w-20 text-sm text-muted-foreground capitalize">{emotion}</span>
        <div className="flex-1 ml-2">
          <div className="w-full bg-muted rounded-full h-2.5">
            <motion.div
              className={`h-2.5 rounded-full ${emotionColors[emotion]}`}
              initial={{ width: '0%' }}
              animate={{ width: `${value * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <span className="ml-2 text-sm text-muted-foreground">
          {Math.round(value * 100)}%
        </span>
      </div>
    </motion.div>
  );

  return (
    <div className={`p-4 bg-transparent rounded-lg shadow ${className}`}>
      <h3 className="mb-4 text-lg font-semibold animate-text bg-gradient-to-r from-primary via-emerald-500 to-primary bg-clip-text text-transparent bg-300%">
        Emotional Analysis
      </h3>
      <div className="space-y-4">
        <div className="mb-6">
          {Object.entries(sentiment.emotions).map(([emotion, value]) =>
            getEmotionBar(emotion as keyof typeof emotionColors, value)
          )}
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium animate-text bg-gradient-to-r from-primary via-emerald-500 to-primary bg-clip-text text-transparent bg-300%">
                Language Style
              </h4>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Formality</span>
                  <span className="text-sm font-medium">
                    {sentiment.language.formality > 0.6 ? 'Formal' : 'Casual'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Certainty</span>
                  <span className="text-sm font-medium">
                    {sentiment.language.certainty > 0.6 ? 'Confident' : 'Uncertain'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Urgency</span>
                  <span className="text-sm font-medium">
                    {sentiment.language.urgency > 0.6 ? 'High' : 'Low'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium animate-text bg-gradient-to-r from-primary via-emerald-500 to-primary bg-clip-text text-transparent bg-300%">
                Topics
              </h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {sentiment.topics.map((topic) => (
                  <span
                    key={topic.name}
                    className={`px-2 py-1 text-xs rounded-full ${
                      topic.sentiment > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {topic.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
