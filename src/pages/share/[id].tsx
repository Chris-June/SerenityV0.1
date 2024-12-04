import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Message } from '@/types';
import { Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SharedMessage() {
  const { id } = useParams();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch the shared message from your backend
    const messages = JSON.parse(localStorage.getItem('chat-messages') || '[]');
    const shared = messages.find((m: Message) => m.shareUrl?.includes(id));
    setMessage(shared || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <Brain className="h-8 w-8 text-primary" />
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Message Not Found</h1>
        <p className="text-muted-foreground">
          This shared message may have expired or been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-card rounded-lg shadow-lg overflow-hidden border">
        <div className="p-4 border-b bg-muted/50">
          <h1 className="text-lg font-semibold">Shared Message</h1>
        </div>
        <div className="p-6">
          <div className={cn(
            'rounded-lg p-4',
            message.sender === 'user'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          )}>
            <div className="flex items-start gap-2">
              {message.sender === 'companion' && (
                <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className="flex-1 break-words">
                {message.content}
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Shared on {new Date(message.timestamp).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
