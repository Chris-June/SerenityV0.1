import { StructuredResponse } from '@/types/ai-response';
import { cn } from '@/lib/utils';
import {
  Brain,
  Heart,
  Lightbulb,
  HelpCircle,
  BookOpen,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StructuredMessageProps {
  message: StructuredResponse;
}

export function StructuredMessage({ message }: StructuredMessageProps) {
  const [expanded, setExpanded] = useState(false);

  const icons = {
    empathy: Heart,
    suggestion: Lightbulb,
    question: HelpCircle,
    resource: BookOpen,
    crisis: AlertTriangle,
    clarification: Brain,
  };

  const colors = {
    empathy: 'text-pink-500 bg-pink-500/10',
    suggestion: 'text-yellow-500 bg-yellow-500/10',
    question: 'text-blue-500 bg-blue-500/10',
    resource: 'text-green-500 bg-green-500/10',
    crisis: 'text-red-500 bg-red-500/10',
    clarification: 'text-purple-500 bg-purple-500/10',
  };

  const Icon = icons[message.type];

  return (
    <Card className="relative group animate-fadeIn">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className={cn('p-2 rounded-full', colors[message.type])}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-sm capitalize">{message.type}</CardTitle>
            {message.metadata?.confidence && (
              <CardDescription className="text-xs">
                Confidence: {Math.round(message.metadata.confidence * 100)}%
              </CardDescription>
            )}
          </div>
          {(message.metadata?.sources?.length || message.metadata?.actionItems?.length) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{message.content}</p>

        {expanded && (
          <div className="mt-4 space-y-4">
            {message.metadata?.tags && (
              <div className="flex flex-wrap gap-2">
                {message.metadata.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {message.metadata?.sources && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Sources:</h4>
                <ul className="text-sm space-y-1">
                  {message.metadata.sources.map((source, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <ExternalLink className="h-3 w-3" />
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {message.metadata?.actionItems && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Action Items:</h4>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  {message.metadata.actionItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {message.metadata?.followUp && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Follow-up Questions:</h4>
                <ul className="text-sm space-y-1">
                  {message.metadata.followUp.map((question, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-primary hover:underline cursor-pointer"
                    >
                      <HelpCircle className="h-3 w-3" />
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
