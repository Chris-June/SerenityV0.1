import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrisisAssessment } from '@/types/crisis';

interface CrisisAlertProps {
  assessment: CrisisAssessment;
  onClose?: () => void;
  onAction?: (action: string) => void;
  className?: string;
}

export const CrisisAlert: React.FC<CrisisAlertProps> = ({
  assessment,
  onClose,
  onAction,
  className = '',
}) => {
  const severityColors = {
    none: 'bg-gray-50 border-gray-200',
    low: 'bg-blue-50 border-blue-200',
    medium: 'bg-yellow-50 border-yellow-200',
    high: 'bg-orange-50 border-orange-200',
    severe: 'bg-red-50 border-red-200',
  };

  const severityTextColors = {
    none: 'text-gray-800',
    low: 'text-blue-800',
    medium: 'text-yellow-800',
    high: 'text-orange-800',
    severe: 'text-red-800',
  };

  if (assessment.severity === 'none') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-4 right-4 max-w-md w-full z-50 ${className}`}
      >
        <div
          className={`p-4 rounded-lg border ${
            severityColors[assessment.severity]
          } shadow-lg`}
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  assessment.urgency ? 'animate-pulse' : ''
                } ${severityTextColors[assessment.severity]}`}
                style={{ backgroundColor: 'currentColor' }}
              />
              <h3
                className={`font-semibold ${
                  severityTextColors[assessment.severity]
                }`}
              >
                {assessment.severity.charAt(0).toUpperCase() +
                  assessment.severity.slice(1)}{' '}
                Risk Level
              </h3>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="mt-4">
            {/* Recommended Actions */}
            <div className="space-y-2">
              {assessment.recommendedActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => onAction?.(action)}
                    className={`w-full p-2 text-left rounded ${
                      severityColors[assessment.severity]
                    } hover:bg-opacity-75 transition-colors`}
                  >
                    {action}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Safety Plan */}
            {assessment.safetyPlan && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4
                  className={`text-sm font-medium mb-2 ${
                    severityTextColors[assessment.severity]
                  }`}
                >
                  Safety Plan
                </h4>
                
                {/* Emergency Contacts */}
                <div className="space-y-2">
                  {assessment.safetyPlan.supportContacts.map((contact) => (
                    <a
                      key={contact.name}
                      href={`tel:${contact.contact}`}
                      className={`block p-2 rounded ${
                        severityColors[assessment.severity]
                      } hover:bg-opacity-75 transition-colors`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{contact.name}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            ({contact.relationship})
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {contact.contact}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Coping Strategies */}
                <div className="mt-4">
                  <h5 className="text-sm font-medium mb-2">
                    Immediate Coping Strategies
                  </h5>
                  <ul className="text-sm space-y-1">
                    {assessment.safetyPlan.copingStrategies.map(
                      (strategy, index) => (
                        <li key={index}>• {strategy}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {assessment.confidence > 0 && (
            <div className="mt-4 text-xs text-gray-500">
              Confidence level: {Math.round(assessment.confidence * 100)}%
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
