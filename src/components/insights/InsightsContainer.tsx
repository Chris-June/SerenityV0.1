import React, { useEffect, useState } from 'react';
import { Message } from '@/types';
import { analyzeSentiment } from '@/services/sentiment-analyzer';
import { summarizeConversation } from '@/services/conversation-summarizer';
import { generateRecommendations } from '@/services/recommendation-engine';
import { assessCrisis } from '@/services/crisis-detector';
import { SentimentDisplay } from './SentimentDisplay';
import { ConversationSummary } from './ConversationSummary';
import { RecommendationList } from './RecommendationList';
import { CrisisAlert } from '../alerts/CrisisAlert';

interface InsightsContainerProps {
  messages: Message[];
  userProfile: any; // Replace with proper type
  onRecommendationSelect?: (recommendation: any) => void;
  onCrisisAction?: (action: string) => void;
  className?: string;
}

export const InsightsContainer: React.FC<InsightsContainerProps> = ({
  messages,
  userProfile,
  onRecommendationSelect,
  onCrisisAction,
  className = '',
}) => {
  const [sentiment, setSentiment] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [crisisAssessment, setCrisisAssessment] = useState<any>(null);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);

  useEffect(() => {
    if (messages.length === 0) return;

    // Analyze latest message
    const latestMessage = messages[messages.length - 1];
    const sentimentAnalysis = analyzeSentiment(latestMessage.content);
    setSentiment(sentimentAnalysis);

    // Generate conversation summary
    const conversationSummary = summarizeConversation(messages);
    setSummary(conversationSummary);

    // Get personalized recommendations
    const getRecommendations = async () => {
      const recs = await generateRecommendations(messages, userProfile);
      setRecommendations(recs);
    };
    getRecommendations();

    // Assess crisis level
    const crisis = assessCrisis(messages);
    setCrisisAssessment(crisis);
    setShowCrisisAlert(crisis.severity !== 'none');
  }, [messages, userProfile]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Crisis Alert */}
      {showCrisisAlert && crisisAssessment && (
        <CrisisAlert
          assessment={crisisAssessment}
          onClose={() => setShowCrisisAlert(false)}
          onAction={onCrisisAction}
        />
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {sentiment && (
            <SentimentDisplay
              sentiment={sentiment}
              className="h-full"
            />
          )}
          
          {recommendations.length > 0 && (
            <RecommendationList
              recommendations={recommendations}
              onSelect={onRecommendationSelect}
            />
          )}
        </div>

        {/* Right Column */}
        <div>
          {summary && (
            <ConversationSummary
              summary={summary}
              className="h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};
