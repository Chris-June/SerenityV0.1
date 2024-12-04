import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Send,
  MessageCircle,
  Copy, 
  Reply, 
  X,
  Settings,
  Download,
  Settings2,
  HelpCircle,
  Plus,
  Search,
  MoreVertical,
  Activity,
  Info,
  RotateCcw,
  Trash2,
  Share,
  BookmarkPlus,
  ThumbsUp, 
  ThumbsDown, 
  Heart 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import { ModeSelector } from './ModeSelector';
import { analyzeSentiment } from '@/services/sentiment';
import { 
  Message,
  MessageAction,
  MessageReaction,
  SearchFilters,
  SentimentAnalysis,
  InteractionMode,
  StructuredResponse
} from '@/types/chat';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

// Utility functions
const formatMessageTime = (timestamp: string | Date) => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

function getTopics(messages: Message[]): { topic: string; count: number }[] {
  const topics = messages.reduce((acc, message) => {
    if (typeof message.content === 'object' && message.content.metadata?.tags) {
      message.content.metadata.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(topics)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);
}

interface ChatInterfaceProps {
  /** Initial mode for the chat interface */
  initialMode?: InteractionMode;
  /** Custom class name for the container */
  className?: string;
  /** Whether to show the mode selector */
  showModeSelector?: boolean;
  /** Whether to enable sentiment analysis */
  enableSentimentAnalysis?: boolean;
  /** Callback when a message is sent */
  onMessageSent?: (message: Message) => void;
  /** Callback when sentiment analysis is complete */
  onSentimentAnalyzed?: (messageId: string, sentiment: SentimentAnalysis) => void;
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const getSentimentLabel = (sentiment: SentimentAnalysis): string => {
  const score = sentiment.score;
  if (score >= 0.6) return 'Positive';
  if (score >= 0.2) return 'Somewhat Positive';
  if (score >= -0.2) return 'Neutral';
  if (score >= -0.6) return 'Somewhat Negative';
  return 'Negative';
};

const getSentimentVariant = (sentiment: SentimentAnalysis): BadgeVariant => {
  const score = sentiment.score;
  if (score >= 0.6) return 'default';
  if (score >= 0.2) return 'secondary';
  if (score >= -0.2) return 'outline';
  return 'destructive';
};

const MessageActions = ({ message, onAction }: { message: Message; onAction: (message: Message, actionType: string) => void }) => {
  const isUserMessage = message.sender === 'user';
  const actions = [
    { id: 'reply', icon: Reply, label: 'Reply to message' },
    { id: 'share', icon: Share, label: 'Share message' },
    { id: 'copy', icon: Copy, label: 'Copy message' },
    ...(isUserMessage ? [{ id: 'delete', icon: Trash2, label: 'Delete message' }] : [])
  ];

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreVertical className="h-3 w-3" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map(({ id, icon: Icon, label }) => (
            <DropdownMenuItem
              key={id}
              onClick={() => onAction(message, id)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {message.sentiment?.score !== undefined && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Progress 
                  value={(message.sentiment.score + 1) * 50} 
                  className="w-16 h-1.5" 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sentiment Score: {Math.round(message.sentiment.score * 100)}%</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

// Default search filters
const defaultSearchFilters: SearchFilters = {
  bookmarked: false,
  hasReplies: false,
  sentiment: null,
  dateRange: 'all',
  topics: []
};

export function ChatInterface({
  initialMode = 'conversational',
  className,
  showModeSelector = true,
  enableSentimentAnalysis = true,
  onMessageSent,
  onSentimentAnalyzed
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(defaultSearchFilters);
  const [showSearch, setShowSearch] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [expandedSentiments, setExpandedSentiments] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { state, dispatch } = useChat();

  // Set initial mode on mount
  useEffect(() => {
    dispatch({ type: 'SET_MODE', payload: initialMode });
  }, [initialMode, dispatch]);

  // Auto-suggestions based on input
  useEffect(() => {
    if (input && isFocused) {
      const getSuggestions = async () => {
        // Simulate API call for suggestions
        const possibleSuggestions = [
          "How are you feeling today?",
          "Tell me more about that.",
          "What's on your mind?",
          "Would you like to explore that further?",
          "How does that make you feel?"
        ];
        
        const filtered = possibleSuggestions.filter(s => 
          s.toLowerCase().includes(input.toLowerCase()) && 
          s !== input
        ).slice(0, 3);
        
        setSuggestions(filtered);
      };

      const debounce = setTimeout(getSuggestions, 300);
      return () => clearTimeout(debounce);
    } else {
      setSuggestions([]);
    }
  }, [input, isFocused]);

  const renderSuggestions = () => {
    if (!isFocused || !suggestions.length) return null;

    return (
      <div className="absolute bottom-full mb-1 w-full bg-background border rounded-md shadow-lg">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start text-sm px-3 py-2 h-auto"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    );
  };

  // Persist messages to localStorage
  useEffect(() => {
    const loadSavedMessages = () => {
      const savedMessages = localStorage.getItem('chat-messages');
      if (!savedMessages) return;

      try {
        const messages = JSON.parse(savedMessages);
        
        // Validate messages array
        if (!Array.isArray(messages)) {
          throw new Error('Saved messages is not an array');
        }

        // Validate each message
        const validMessages = messages.filter(message => {
          const isValid = 
            typeof message === 'object' &&
            typeof message.id === 'string' &&
            typeof message.content === 'string' &&
            typeof message.sender === 'string' &&
            (typeof message.timestamp === 'string' || message.timestamp instanceof Date);
          
          if (!isValid) {
            console.warn('Found invalid message:', message);
          }
          return isValid;
        });

        console.log(`Filtered out ${messages.length - validMessages.length} invalid messages`);
        
        dispatch({ type: 'SET_MESSAGES', payload: validMessages });
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    loadSavedMessages();
  }, [dispatch]);

  // Save messages to localStorage when they change
  useEffect(() => {
    const saveMessages = () => {
      try {
        localStorage.setItem('chat-messages', JSON.stringify(state.messages));
      } catch (error) {
        console.error('Error saving messages to localStorage:', error);
        // Optionally show a user notification about the error
      }
    };

    saveMessages();
  }, [state.messages]);

  // Auto-scroll effect
  useEffect(() => {
    if (scrollRef.current) {
      const scrollToBottom = () => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
      };

      // Use requestAnimationFrame for smooth scrolling
      requestAnimationFrame(scrollToBottom);
    }
  }, [state.messages, isTyping]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update suggestions based on mode and context
  useEffect(() => {
    const updateSuggestions = () => {
      const mode = state.mode;
      const lastMessage = state.messages[state.messages.length - 1];
      
      if (!lastMessage) {
        // Initial suggestions based on mode
        const initialSuggestions = {
          conversational: [
            "Hi, I'd like to chat about...",
            "Can you help me with...",
            "I'm interested in learning about..."
          ],
          reflective: [
            "I've been thinking about...",
            "Today I felt...",
            "I'm trying to understand..."
          ],
          visualization: [
            "Can you show me...",
            "I'd like to see...",
            "Help me visualize..."
          ],
          feedback: [
            "My experience has been...",
            "I'd like to suggest...",
            "This could be improved by..."
          ],
          crisis: [
            "I need help with...",
            "I'm feeling overwhelmed by...",
            "Can you assist me with..."
          ]
        };

        setSuggestions(initialSuggestions[mode] || []);
        return;
      }

      // Context-aware suggestions based on last message
      if (lastMessage.sentiment) {
        const { score, emotions } = lastMessage.sentiment;
        const dominantEmotion = Object.entries(emotions)
          .reduce((prev, [emotion, value]) => 
            value > prev.value ? { emotion, value } : prev,
            { emotion: '', value: -1 }
          ).emotion;

        // Add emotion-specific suggestions with intensity based on score
        const getIntensityPrefix = (score: number) => {
          if (score > 0.7) return "very ";
          if (score > 0.3) return "quite ";
          if (score < -0.7) return "extremely ";
          if (score < -0.3) return "rather ";
          return "";
        };

        const emotionSuggestions = {
          joy: [
            `That's ${getIntensityPrefix(score)}wonderful! Tell me more about what made you so happy...`,
            `I can sense your ${getIntensityPrefix(score)}positive energy! What's contributing to this feeling?`,
            `Let's build on this ${getIntensityPrefix(score)}uplifting moment...`
          ],
          sadness: [
            `I hear that you're feeling ${getIntensityPrefix(Math.abs(score))}down. Would you like to talk more about it?`,
            `It seems like this is ${getIntensityPrefix(Math.abs(score))}difficult. What support would be most helpful?`,
            `Let's explore these ${getIntensityPrefix(Math.abs(score))}heavy feelings together...`
          ],
          anger: [
            `I can sense you're ${getIntensityPrefix(Math.abs(score))}frustrated. What would help right now?`,
            `This seems ${getIntensityPrefix(Math.abs(score))}upsetting. Let's work through it together...`,
            `I understand you're ${getIntensityPrefix(Math.abs(score))}angry. How can we address this?`
          ],
          fear: [
            `It's okay to feel ${getIntensityPrefix(Math.abs(score))}anxious. What's on your mind?`,
            `These ${getIntensityPrefix(Math.abs(score))}worrying thoughts are valid. Would you like to explore coping strategies?`,
            `Let's break down these ${getIntensityPrefix(Math.abs(score))}overwhelming feelings together...`
          ],
          surprise: [
            `That seems ${getIntensityPrefix(Math.abs(score))}unexpected! How are you processing this?`,
            `I can sense this ${getIntensityPrefix(Math.abs(score))}caught you off guard. What aspects surprised you most?`,
            `Let's explore this ${getIntensityPrefix(Math.abs(score))}surprising development...`
          ]
        };

        // Add general sentiment-based suggestions
        const generalSuggestions = score > 0 
          ? [
              "I'm glad you're feeling positive! What's contributing to this?",
              "It's great to hear you're doing well! Want to share more?",
              "Your optimism is wonderful! What's your perspective on this?"
            ]
          : [
              "I'm here to support you through this challenging time...",
              "Sometimes talking things through can help. Would you like to?",
              "Let's focus on what might help you feel better..."
            ];

        setSuggestions([
          ...emotionSuggestions[dominantEmotion as keyof typeof emotionSuggestions],
          ...generalSuggestions
        ]);
      }
    };

    updateSuggestions();
  }, [state.mode, state.messages]);

  // Memoize share handler
  const handleShare = useCallback(async (message: Message) => {
    const messageText = typeof message.content === 'string' 
      ? message.content 
      : message.content.content;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Shared from Serenity Chat',
          text: messageText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(messageText);
        // toast({
        //   title: "Message copied to clipboard",
        //   description: "The share feature isn't available, so we copied the message instead.",
        //   duration: 3000,
        // });
      }
    } catch (error) {
      console.error('Error sharing message:', error);
      // toast({
      //   title: "Couldn't share message",
      //   description: "Please try copying the message instead.",
      //   variant: "destructive",
      //   duration: 3000,
      // });
    }
  }, []);

  const handleReply = useCallback((message: Message) => {
    setReplyingTo(message);
    textareaRef.current?.focus();
  }, []);

  const renderReplyPreview = useCallback(() => {
    if (!replyingTo) return null;

    const content = typeof replyingTo.content === 'string'
      ? replyingTo.content
      : replyingTo.content.content;

    return (
      <div className="mb-2 p-2 border rounded-md bg-muted/50 relative">
        <div className="flex items-start gap-2">
          <Reply className="h-4 w-4 text-muted mt-1" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">
              Replying to {replyingTo.sender === 'user' ? 'yourself' : 'AI'}
            </p>
            <p className="text-sm truncate">{content}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 absolute top-1 right-1"
            onClick={() => setReplyingTo(null)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Cancel reply</span>
          </Button>
        </div>
      </div>
    );
  }, [replyingTo]);

  // Message deletion handler
  const handleDelete = useCallback((messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      dispatch({ type: 'DELETE_MESSAGE', payload: messageId });
      if (selectedMessage === messageId) {
        setSelectedMessage(null);
      }
    }
  }, [dispatch, selectedMessage]);

  // Message action handlers
  const handleMessageAction = useCallback(async (
    messageIdOrMessage: string | Message, 
    actionType: MessageAction['type'] | string
  ) => {
    let content: string;
    let message: Message | undefined;

    // Determine if we're working with a Message object or message ID
    if (typeof messageIdOrMessage === 'string') {
      message = state.messages.find(m => m.id === messageIdOrMessage);
      if (!message) {
        console.warn(`Message not found: ${messageIdOrMessage}`);
        return;
      }
    } else {
      message = messageIdOrMessage;
    }

    switch (actionType) {
      case 'reply':
        handleReply(message);
        break;
      case 'share':
        handleShare(message);
        break;
      case 'delete':
        handleDelete(message.id);
        break;
      case 'copy':
        content = typeof message.content === 'string' 
          ? message.content 
          : message.content.content;
        await navigator.clipboard.writeText(content);
        break;
      case 'bookmark':
        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            messageId: message.id,
            updates: { isBookmarked: true }
          }
        });
        break;
      case 'unbookmark':
        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            messageId: message.id,
            updates: { isBookmarked: false }
          }
        });
        break;
      default:
        console.warn(`Unhandled message action: ${actionType}`);
    }
  }, [state.messages, dispatch, handleReply, handleShare, handleDelete]);

  const filteredMessages = useMemo(() => {
    return state.messages.filter(message => {
      if (searchQuery) {
        const content = typeof message.content === 'string' 
          ? message.content 
          : message.content.content;
        
        if (!content.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
      }

      if (searchFilters.bookmarked && !message.isBookmarked) {
        return false;
      }

      if (searchFilters.hasReplies) {
        const hasReplies = state.messages.some(m => m.replyTo === message.id);
        if (!hasReplies) return false;
      }

      return true;
    });
  }, [state.messages, searchQuery, searchFilters]);

  const renderSentimentDetails = useCallback((message: Message) => {
    if (!message.sentiment) return null;

    const sentiment = message.sentiment;
    const variant = getSentimentVariant(sentiment);
    const label = getSentimentLabel(sentiment);
    const isExpanded = expandedSentiments.has(message.id);

    return (
      <div className="mt-2 space-y-2">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setExpandedSentiments(prev => {
            const newSet = new Set(prev);
            if (isExpanded) {
              newSet.delete(message.id);
            } else {
              newSet.add(message.id);
            }
            return newSet;
          })}
        >
          <Badge variant={variant}>
            {label}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {Math.round(sentiment.score * 100)}% confidence
          </span>
        </div>
        {isExpanded && sentiment.emotions && (
          <div className="space-y-2">
            <div className="text-xs font-medium">Emotions detected:</div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(sentiment.emotions)
                .sort(([, a], [, b]) => b - a)
                .map(([emotion, score]) => (
                  <Badge
                    key={emotion}
                    variant="outline"
                    className={cn(
                      "text-xs",
                      score > 0.5 && "border-primary/50"
                    )}
                  >
                    {emotion} ({Math.round(score * 100)}%)
                  </Badge>
                ))}
            </div>
          </div>
        )}
        {isExpanded && sentiment.topics && sentiment.topics.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium">Topics mentioned:</div>
            <div className="flex flex-wrap gap-1">
              {sentiment.topics.map(topic => (
                <Badge
                  key={topic}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery(topic);
                    setSearchFilters(prev => ({ ...prev, topics: [...(prev.topics || []), topic] }));
                  }}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }, [expandedSentiments, setExpandedSentiments, setSearchQuery, setSearchFilters]);

  const renderMessageFooter = useCallback((message: Message) => {
    const timestamp = new Date(message.timestamp);
    const timeString = timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    return (
      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          {message.isBookmarked && (
            <Badge variant="outline" className="px-1">
              Bookmarked
            </Badge>
          )}
          {message.replyTo && (
            <Badge variant="outline" className="px-1">
              Reply
            </Badge>
          )}
          {message.sentiment && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant={getSentimentVariant(message.sentiment)}
                    className="cursor-pointer"
                  >
                    {getSentimentLabel(message.sentiment)}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to view sentiment details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <time dateTime={timestamp.toISOString()}>{timeString}</time>
      </div>
    );
  }, []);

  const renderMessageContent = useCallback((message: Message) => {
    if (typeof message.content === 'string') {
      return (
        <div className="whitespace-pre-wrap break-words">
          {message.content}
        </div>
      );
    }

    const response = message.content as StructuredResponse;
    const typeColors: Record<StructuredResponse['type'], string> = {
      empathy: 'bg-purple-500/10 text-purple-500',
      suggestion: 'bg-blue-500/10 text-blue-500',
      question: 'bg-yellow-500/10 text-yellow-500',
      resource: 'bg-green-500/10 text-green-500',
      crisis: 'bg-red-500/10 text-red-500',
      clarification: 'bg-orange-500/10 text-orange-500'
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={cn("capitalize", typeColors[response.type])}
          >
            {response.type}
          </Badge>
          {response.metadata?.confidence && (
            <span className="text-xs text-muted-foreground">
              {Math.round(response.metadata.confidence * 100)}% confidence
            </span>
          )}
        </div>
        <div className="whitespace-pre-wrap break-words">
          {response.content}
        </div>
        {response.metadata?.actionItems && response.metadata.actionItems.length > 0 && (
          <div className="text-xs space-y-1">
            <div className="font-medium">Suggested actions:</div>
            <ul className="list-disc list-inside space-y-1">
              {response.metadata.actionItems.map((action, index) => (
                <li key={index} className="text-muted-foreground">{action}</li>
              ))}
            </ul>
          </div>
        )}
        {response.metadata?.sources && response.metadata.sources.length > 0 && (
          <div className="text-xs space-y-1">
            <div className="font-medium">Sources:</div>
            <ul className="list-disc list-inside space-y-1">
              {response.metadata.sources.map((source, index) => (
                <li key={index} className="text-muted-foreground">{source}</li>
              ))}
            </ul>
          </div>
        )}
        {response.metadata?.tags && response.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {response.metadata.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs"
                onClick={() => {
                  setSearchQuery(tag);
                  setSearchFilters(prev => ({ ...prev, topics: [...(prev.topics || []), tag] }));
                }}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  }, [setSearchQuery, setSearchFilters]);

  const renderMessageReactions = useCallback((reactions: MessageReaction[]) => {
    if (!reactions?.length) return null;

    const groupedReactions = reactions.reduce<Record<string, number>>((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="flex items-center gap-1">
        {Object.entries(groupedReactions).map(([type, count]) => (
          <div
            key={type}
            className="flex items-center gap-1 text-xs text-muted-foreground bg-[#1a1a1a] px-1.5 py-0.5 rounded-full"
          >
            {type === 'like' && <ThumbsUp className="h-3 w-3" />}
            {type === 'heart' && <Heart className="h-3 w-3" />}
            {type === 'dislike' && <ThumbsDown className="h-3 w-3" />}
            <span>{count}</span>
          </div>
        ))}
      </div>
    );
  }, []);

  const renderTopicsSection = () => {
    const topics = getTopics(state.messages);
    if (!topics.length) return null;

    return (
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Conversation Topics</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Info className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Topics extracted from conversation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex flex-wrap gap-2">
          {topics.map(({ topic, count }) => (
            <Badge
              key={topic}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => {
                setSearchQuery(topic);
                setSearchFilters(prev => ({ ...prev, topics: [...(prev.topics || []), topic] }));
              }}
            >
              {topic} ({count})
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const QuickActionsMenu = () => {
    if (!showQuickActions) return null;

    return (
      <div className="fixed bottom-24 right-8 bg-background border rounded-lg shadow-lg p-2 z-50">
        <div className="flex flex-col gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    dispatch({ type: 'CLEAR_MESSAGES' });
                    setShowQuickActions(false);
                  }}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear Chat
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear all messages</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    const messages = state.messages
                      .map(m => `${m.sender.toUpperCase()}: ${m.content}`)
                      .join('\n\n');
                    navigator.clipboard.writeText(messages);
                    setShowQuickActions(false);
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All Messages
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy conversation to clipboard</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    setShowSearch(prev => !prev);
                    setShowQuickActions(false);
                  }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {showSearch ? 'Hide Search' : 'Show Search'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle search panel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    );
  };

  const renderMessage = useCallback((message: Message) => {
    const isUserMessage = message.sender === 'user';
    const timestamp = new Date(message.timestamp);
    const timeString = formatMessageTime(timestamp);

    return (
      <div 
        key={message.id}
        className={cn(
          "flex flex-col gap-2 p-4",
          isUserMessage ? "items-end" : "items-start",
          message.replyTo && "ml-8"
        )}
      >
        {/* Message header with timestamp */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{isUserMessage ? 'You' : 'Assistant'}</span>
          <time dateTime={timestamp.toISOString()} className="text-xs">
            {timeString}
          </time>
        </div>
        
        {/* Message content */}
        <div className={cn(
          "max-w-[80%] rounded-lg p-3",
          isUserMessage ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          {renderMessageContent(message)}
        </div>

        {/* Message actions and reactions */}
        <div className="flex items-center gap-2">
          <MessageActions message={message} onAction={handleMessageAction} />
          {renderMessageReactions(message.reactions || [])}
        </div>
      </div>
    );
  }, [renderMessageContent, handleMessageAction, renderMessageReactions]);

  // Add keyboard navigation for selected message
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedMessage) return;

      const currentIndex = state.messages.findIndex(m => m.id === selectedMessage);
      if (currentIndex === -1) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            setSelectedMessage(state.messages[currentIndex - 1].id);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < state.messages.length - 1) {
            setSelectedMessage(state.messages[currentIndex + 1].id);
          }
          break;
        case 'Escape':
          setSelectedMessage(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMessage, state.messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isAnalyzing) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
      ...(replyingTo && { replyTo: replyingTo.id })
    };

    setInput('');
    setReplyingTo(null);
    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
    
    try {
      // Analyze sentiment if in reflective mode
      if (state.mode === 'reflective' && enableSentimentAnalysis) {
        const sentiment = await analyzeSentiment(input);
        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            messageId: newMessage.id,
            updates: { sentiment }
          }
        });
        onSentimentAnalyzed?.(newMessage.id, sentiment);
      }

      // Simulate AI response
      setIsTyping(true);
      const response: Message = {
        id: crypto.randomUUID(),
        content: {
          type: state.mode === 'reflective' ? 'empathy' : 'suggestion',
          content: 'This is a sample response. In a real app, this would come from your AI service.',
          metadata: {
            tags: ['sample', 'response'],
            confidence: 0.95,
            actionItems: ['Consider your feelings', 'Take deep breaths']
          }
        },
        sender: 'companion',
        timestamp: new Date().toISOString(),
        replyTo: newMessage.id
      };

      setTimeout(() => {
        dispatch({ type: 'ADD_MESSAGE', payload: response });
        setIsTyping(false);
        setIsAnalyzing(false);
      }, 1500);

    } catch (error) {
      console.error('Error processing message:', error);
      setIsTyping(false);
      setIsAnalyzing(false);
    }
    onMessageSent?.(newMessage);
  }, [input, replyingTo, dispatch, state.mode, isAnalyzing, enableSentimentAnalysis, onSentimentAnalyzed, onMessageSent]);

  // Memoize mode messages
  const getModeMessages = useMemo(() => ({
    conversational: "I'll keep our conversation casual and open. Feel free to share whatever's on your mind.",
    reflective: "I'll focus on understanding your feelings and thoughts more deeply. Let's explore together.",
    visualization: "I can generate calming images to help you express or process your feelings. Would you like to try that?",
    feedback: "I'd love to hear your thoughts about our interactions. Your feedback helps me improve.",
    crisis: "I'm here to help you through this difficult moment. Your safety is the top priority. Would you like to see some immediate support options?",
    default: "How can I support you today?"
  }), []);

  // Get mode change message
  const getModeChangeMessage = useCallback((mode: InteractionMode): string => {
    return getModeMessages[mode as keyof typeof getModeMessages] || getModeMessages.default;
  }, [getModeMessages]);

  // Handle mode change
  const handleModeChange = useCallback((mode: InteractionMode) => {
    const message = getModeChangeMessage(mode);
    
    dispatch({ type: 'SET_MODE', payload: mode });
    dispatch({ 
      type: 'ADD_MESSAGE', 
      payload: {
        id: crypto.randomUUID(),
        content: message,
        sender: 'companion',
        timestamp: new Date().toISOString(),
      }
    });
  }, [dispatch, getModeChangeMessage]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
    textareaRef.current?.focus();
  }, []);

  return (
    <div className={cn("min-h-screen w-[85%] mx-auto flex flex-col", className)}>
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Serenity Chat</h1>
          </div>
          {showModeSelector && (
            <ModeSelector 
              currentMode={state.mode} 
              onModeChange={handleModeChange}
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Search Dialog Trigger */}
          <Dialog open={showSearch} onOpenChange={setShowSearch}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search messages</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Search Messages</DialogTitle>
                <DialogDescription>
                  Search through your chat history and filter messages by various criteria.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchFilters(defaultSearchFilters);
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                </div>
                <Tabs defaultValue="filters">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="filters">Filters</TabsTrigger>
                    <TabsTrigger value="sort">Sort</TabsTrigger>
                  </TabsList>
                  <TabsContent value="filters" className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={searchFilters.bookmarked ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSearchFilters(f => ({ ...f, bookmarked: !f.bookmarked }))}
                      >
                        <BookmarkPlus className="h-3 w-3 mr-1" />
                        Bookmarked
                      </Badge>
                      <Badge
                        variant={searchFilters.hasReplies ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSearchFilters(f => ({ ...f, hasReplies: !f.hasReplies }))}
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Has Replies
                      </Badge>
                      <Badge
                        variant={searchFilters.sentiment === 'positive' ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSearchFilters(f => ({ 
                          ...f, 
                          sentiment: f.sentiment === 'positive' ? null : 'positive' 
                        }))}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Positive
                      </Badge>
                      <Badge
                        variant={searchFilters.sentiment === 'negative' ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSearchFilters(f => ({ 
                          ...f, 
                          sentiment: f.sentiment === 'negative' ? null : 'negative' 
                        }))}
                      >
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        Negative
                      </Badge>
                    </div>
                  </TabsContent>
                  <TabsContent value="sort" className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => {
                          setSearchFilters(f => ({ ...f, sortBy: 'newest' }));
                        }}
                      >
                        Latest First
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => {
                          setSearchFilters(f => ({ ...f, sortBy: 'oldest' }));
                        }}
                      >
                        Oldest First
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => {
                          setSearchFilters(f => ({ ...f, sortBy: 'reactions' }));
                        }}
                      >
                        Most Reactions
                      </Badge>
                    </div>
                  </TabsContent>
                </Tabs>
                {renderTopicsSection()}
              </div>
            </DialogContent>
          </Dialog>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowQuickActions(prev => !prev)}
                >
                  <MoreVertical className="h-5 w-5" />
                  <span className="sr-only">Quick actions</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quick actions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      {/* Quick Actions Menu */}
      <QuickActionsMenu />

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {filteredMessages.map(renderMessage)}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t">
        {renderReplyPreview()}
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay to allow clicking suggestions
              setTimeout(() => setIsFocused(false), 200);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            className="pr-20 min-h-[80px] resize-none"
          />
          {renderSuggestions()}
          <div className="absolute right-2 bottom-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0",
                      !input.trim() && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={handleSend}
                    disabled={!input.trim()}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message (Enter)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}