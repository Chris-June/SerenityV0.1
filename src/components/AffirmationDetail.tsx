import { useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAffirmationAI } from '@/hooks/use-affirmation-ai';
import { Button } from '@/components/ui/button';

interface AffirmationDetailProps {
  affirmation: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AffirmationDetail({ affirmation, isOpen, onClose }: AffirmationDetailProps) {
  const { expandedContent, isLoading, error, generateExpansion } = useAffirmationAI();

  // Only generate expansion when modal opens with new affirmation
  useEffect(() => {
    if (isOpen && affirmation && !expandedContent) {
      generateExpansion(affirmation);
    }
  }, [isOpen, affirmation]); // Remove generateExpansion from deps

  console.log('📊 AffirmationDetail render:', { 
    isOpen, 
    affirmation, 
    isLoading, 
    hasError: !!error, 
    hasContent: !!expandedContent 
  });

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{affirmation}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Let's explore this affirmation together
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : expandedContent ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed">
                  {expandedContent}
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
