import { cn } from "@/lib/utils";

interface AnimatedBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animate?: boolean;
  className?: string;
}

export function AnimatedBorder({
  children,
  animate = true,
  className,
  ...props
}: AnimatedBorderProps) {
  return (
    <>
      <style>
        {`
          @property --border-angle {
            syntax: "<angle>";
            initial-value: 0turn;
            inherits: false;
          }

          @keyframes rotate-gradient {
            0% {
              --border-angle: 0turn;
            }
            100% {
              --border-angle: 1turn;
            }
          }

          .animated-border-gradient {
            --border-angle: 0turn;
            background: linear-gradient(
              var(--border-angle),
              hsl(var(--primary)) 0%,
              hsl(var(--muted)) 25%,
              hsl(var(--primary)) 50%,
              hsl(var(--muted)) 75%,
              hsl(var(--primary)) 100%
            );
            animation: rotate-gradient 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }

          .animated-border-gradient::before {
            content: "";
            position: absolute;
            inset: 0;
            background: inherit;
            border-radius: inherit;
            filter: blur(8px);
            opacity: 0.5;
            animation: rotate-gradient 8s cubic-bezier(0.4, 0, 0.2, 1) infinite reverse;
          }
        `}
      </style>
      <div className={cn("relative p-[1px] overflow-hidden rounded-lg group", className)} {...props}>
        {/* Animated border gradient */}
        {animate && (
          <div className="absolute inset-0 rounded-lg animated-border-gradient" />
        )}
        
        {/* Content with background */}
        <div className="relative bg-background rounded-lg z-10">
          {children}
        </div>
      </div>
    </>
  );
}
