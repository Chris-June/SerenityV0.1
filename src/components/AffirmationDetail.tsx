import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAffirmationAI } from '@/hooks/use-affirmation-ai';

interface AffirmationDetailProps {
  affirmation: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AffirmationDetail({ affirmation, isOpen, onClose }: AffirmationDetailProps) {
  const { expandedContent, isLoading, error, generateExpansion } = useAffirmationAI();

  useEffect(() => {
    if (isOpen && affirmation) {
      generateExpansion(affirmation);
    }
  }, [isOpen, affirmation]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{affirmation}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          ) : expandedContent ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {expandedContent}
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
