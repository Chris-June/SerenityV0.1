import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recommendation } from '@/types/recommendation';

interface RecommendationListProps {
  recommendations: Recommendation[];
  onSelect?: (recommendation: Recommendation) => void;
  className?: string;
}

export const RecommendationList: React.FC<RecommendationListProps> = ({
  recommendations,
  onSelect,
  className = '',
}) => {
  const typeIcons = {
    resource: '📚',
    technique: '🎯',
    activity: '🏃‍♂️',
    professional: '👨‍⚕️',
    social: '👥',
  };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  return (
    <div className={`bg-transparent rounded-lg shadow ${className}`}>
      <div className="p-4">
        <h3 className="text-lg font-semibold animate-text bg-gradient-to-r from-primary via-emerald-500 to-primary bg-clip-text text-transparent bg-300% mb-4">
          Personalized Recommendations
        </h3>
        
        <div className="space-y-4">
          <AnimatePresence>
            {recommendations.map((recommendation, index) => (
              <motion.div
                key={recommendation.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-[#2a2a2a] rounded-lg hover:bg-[#1a1a1a] transition-all cursor-pointer"
                onClick={() => onSelect?.(recommendation)}
              >
                <div className="flex items-start">
                  {/* Icon and Type */}
                  <div className="flex-shrink-0 mr-4">
                    <span className="text-2xl" role="img" aria-label={recommendation.type}>
                      {typeIcons[recommendation.type as keyof typeof typeIcons]}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="font-medium mb-1 animate-text bg-gradient-to-r from-primary via-emerald-500 to-primary bg-clip-text text-transparent bg-300%">
                      {recommendation.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {recommendation.description}
                    </p>

                    {/* Tags and Metadata */}
                    <div className="flex flex-wrap gap-2">
                      {recommendation.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Details */}
                    <div className="mt-2 flex items-center text-xs text-muted-foreground">
                      {recommendation.timeRequired && (
                        <span className="mr-4">
                          ⏱ {recommendation.timeRequired}
                        </span>
                      )}
                      
                      {recommendation.difficulty && (
                        <div className={`px-2 py-0.5 rounded-full text-xs ${
                          difficultyColors[recommendation.difficulty]
                        }`}>
                          {recommendation.difficulty}
                        </div>
                      )}

                      {recommendation.effectiveness && (
                        <span>
                          📊 {Math.round(recommendation.effectiveness * 100)}% effective
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Priority Indicator */}
                  <div className="flex-shrink-0 ml-4">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: `rgb(${Math.round(
                          255 * (1 - recommendation.priority)
                        )}, ${Math.round(255 * recommendation.priority)}, 0)`,
                      }}
                    />
                  </div>
                </div>

                {/* Prerequisites and Follow-ups */}
                {(recommendation.prerequisites?.length || recommendation.followUp?.length) && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    {recommendation.prerequisites?.length > 0 && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-gray-500">
                          Prerequisites:
                        </span>
                        <ul className="mt-1 text-xs text-gray-600">
                          {recommendation.prerequisites.map((prereq) => (
                            <li key={prereq}>• {prereq}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {recommendation.followUp?.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-gray-500">
                          Follow-up:
                        </span>
                        <ul className="mt-1 text-xs text-gray-600">
                          {recommendation.followUp.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
