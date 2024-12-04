import { Brain, MessageSquare, PieChart, ThumbsUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InteractionMode } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ModeSelectorProps {
  currentMode: InteractionMode;
  onModeChange: (mode: InteractionMode) => void;
}

const modeIcons = {
  conversational: MessageSquare,
  reflective: Brain,
  visualization: PieChart,
  feedback: ThumbsUp,
  crisis: Heart,
};

const modeLabels = {
  conversational: 'Chat',
  reflective: 'Reflect',
  visualization: 'Visualize',
  feedback: 'Feedback',
  crisis: 'Support',
};

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const CurrentIcon = modeIcons[currentMode];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 relative group",
            currentMode === 'crisis' && "text-red-500"
          )}
        >
          <CurrentIcon className="h-4 w-4" />
          <span className="sr-only">Select interaction mode</span>
          <span className="absolute hidden group-hover:block right-0 -bottom-1 translate-y-full px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg whitespace-nowrap">
            Current: {modeLabels[currentMode]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(modeIcons) as InteractionMode[]).map((mode) => {
          const Icon = modeIcons[mode];
          return (
            <DropdownMenuItem
              key={mode}
              onClick={() => onModeChange(mode)}
              className={cn(
                "gap-2",
                mode === currentMode && "bg-accent",
                mode === 'crisis' && "text-red-500"
              )}
            >
              <Icon className="h-4 w-4" />
              {modeLabels[mode]}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}