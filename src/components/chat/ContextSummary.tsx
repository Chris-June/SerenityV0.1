import { AIResponse } from '@/types/ai-response';
import { Brain, Target, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ContextSummaryProps {
  context: AIResponse['context'];
  suggestedActions: AIResponse['suggestedActions'];
}

export function ContextSummary({ context, suggestedActions }: ContextSummaryProps) {
  if (!context && !suggestedActions) return null;

  return (
    <Card className="bg-muted/50">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10">
            <Brain className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-sm">Context & Suggestions</CardTitle>
            <CardDescription className="text-xs">
              Based on our conversation
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {context && (
          <>
            {context.mood && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Mood</span>
                  <span>{context.mood}</span>
                </div>
                {context.intensity !== undefined && (
                  <Progress value={context.intensity * 100} />
                )}
              </div>
            )}

            {context.topics && context.topics.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">Key Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {context.topics.map((topic) => (
                    <Badge key={topic} variant="outline">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {context.relevantResources && context.relevantResources.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">Related Resources</h4>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  {context.relevantResources.map((resource, index) => (
                    <li key={index}>{resource}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {suggestedActions && (
          <div className="space-y-4 pt-2">
            {suggestedActions.immediate && suggestedActions.immediate.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium">Immediate Actions</h4>
                </div>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  {suggestedActions.immediate.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}

            {suggestedActions.shortTerm && suggestedActions.shortTerm.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-medium">Short-term Goals</h4>
                </div>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  {suggestedActions.shortTerm.map((action, index) => (
                    <li key={index}>{action}</li>
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
