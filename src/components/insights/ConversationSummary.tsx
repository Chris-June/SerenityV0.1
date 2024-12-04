import React from 'react';
import { motion } from 'framer-motion';
import { ConversationSummary as Summary } from '@/types/conversation';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ConversationSummaryProps {
  summary: Summary;
  className?: string;
}

export const ConversationSummary: React.FC<ConversationSummaryProps> = ({
  summary,
  className = '',
}) => {
  const emotionalJourneyData = [
    { name: 'Start', value: getEmotionValue(summary.emotionalJourney.start) },
    { name: 'Middle', value: getEmotionValue(summary.emotionalJourney.middle) },
    { name: 'End', value: getEmotionValue(summary.emotionalJourney.end) },
  ];

  return (
    <div className={`${className} space-y-4`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard 
          label="Total Messages" 
          value={(summary.metrics.messageCount ?? 0).toString()} 
        />
        <MetricCard 
          label="Words per Message" 
          value={`${(summary.metrics.averageResponseTime ?? 0).toFixed(1)}s`} 
        />
        <MetricCard 
          label="Engagement" 
          value={`${((summary.metrics.engagementScore ?? 0) * 100).toFixed(0)}%`} 
        />
        <MetricCard 
          label="Sentiment" 
          value={
            summary.topics?.length > 0 
              ? (summary.topics.reduce((acc, topic) => acc + (topic?.sentiment ?? 0), 0) / summary.topics.length > 0 
                  ? 'POSITIVE' 
                  : 'NEGATIVE')
              : 'NEUTRAL'
          } 
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold animate-text bg-gradient-to-r from-primary via-emerald-500 to-primary bg-clip-text text-transparent bg-300% mb-4">
          Conversation Summary
        </h3>
        
        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-[#1a1a1a] rounded-lg"
        >
          <p className="text-muted-foreground">{summary.overview}</p>
        </motion.div>

        {/* Emotional Journey */}
        <div className="mb-6">
          <h4 className="text-sm font-medium animate-text bg-gradient-to-r from-primary via-emerald-500 to-primary bg-clip-text text-transparent bg-300% mb-3">
            Emotional Journey
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emotionalJourneyData}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="50%" stopColor="#2DD4BF" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                  axisLine={{ stroke: '#6B7280' }}
                  tickLine={{ stroke: '#6B7280' }}
                  scale="auto"
                  allowDataOverflow={false}
                  height={30}
                  minTickGap={5}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                  axisLine={{ stroke: '#6B7280' }}
                  tickLine={{ stroke: '#6B7280' }}
                  allowDataOverflow={false}
                  scale="auto"
                  domain={[0, 'auto']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #2a2a2a',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4, stroke: '#1a1a1a' }}
                  activeDot={{ fill: '#2DD4BF', strokeWidth: 2, r: 6, stroke: '#1a1a1a' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Points */}
        <div className="mb-6">
          <h4 className="text-sm font-medium animate-text bg-gradient-to-r from-primary via-teal-400 to-primary bg-clip-text text-transparent bg-300% mb-3">
            Key Points
          </h4>
          <ul className="space-y-3">
            {summary.keyPoints.map((point, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors duration-300"
              >
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary/20 text-primary text-sm mr-3">
                  {index + 1}
                </span>
                <p className="text-foreground">{point}</p>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Topics */}
        <div className="mb-6">
          <h4 className="text-sm font-medium animate-text bg-gradient-to-r from-primary via-emerald-500 to-primary bg-clip-text text-transparent bg-300% mb-3">
            Key Topics
          </h4>
          <div className="grid gap-2">
            {summary.topics.map((topic) => (
              <div
                key={topic.name}
                className="flex items-center justify-between p-2 rounded-lg bg-[#1a1a1a]"
              >
                <span className="text-sm text-foreground">{topic.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {topic.mentions} mentions
                  </span>
                  <div className="w-16 bg-muted rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${topic.sentiment * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patterns */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <h5 className="text-sm font-medium text-blue-800 mb-2">Patterns</h5>
              <ul className="space-y-1">
                {summary.insights.patterns.map((pattern, index) => (
                  <li key={index} className="text-sm text-blue-600">
                    • {pattern}
                  </li>
                ))}
              </ul>
            </div>

            {/* Progress */}
            <div className="p-3 bg-green-50 rounded-lg">
              <h5 className="text-sm font-medium text-green-800 mb-2">Progress</h5>
              <ul className="space-y-1">
                {summary.insights.progress.map((item, index) => (
                  <li key={index} className="text-sm text-green-600">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(summary.metrics).map(([key, value]) => (
            <div
              key={key}
              className="p-3 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]"
            >
              <div className="text-sm text-muted-foreground capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-lg font-semibold text-foreground">
                {typeof value === 'number' && key.includes('Score')
                  ? `${Math.round(value * 100)}%`
                  : value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="p-3 bg-gray-50 rounded-lg">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-lg font-semibold text-gray-800">{value}</p>
  </div>
);

function getEmotionValue(emotion: string): number {
  const values = {
    'very positive': 1,
    'somewhat positive': 0.5,
    'neutral': 0,
    'somewhat negative': -0.5,
    'very negative': -1,
  };
  return values[emotion as keyof typeof values] || 0;
}
