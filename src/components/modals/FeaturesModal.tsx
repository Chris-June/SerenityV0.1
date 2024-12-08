import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LucideIcon } from "lucide-react";

interface FeatureDetails {
  icon: LucideIcon;
  title: string;
  description: string;
  expandedContent?: {
    overview?: string;
    benefits?: string[];
    howItWorks?: string[];
    tips?: string[];
  };
  new?: boolean;
}

interface FeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: FeatureDetails | undefined;
}

export function FeaturesModal({ isOpen, onClose, feature }: FeaturesModalProps) {
  if (!feature) return null;

  const { icon: Icon, title, description, expandedContent } = feature;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-semibold">
              {title}
              {feature.new && (
                <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  New
                </span>
              )}
            </DialogTitle>
          </div>
          <DialogDescription className="text-lg text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[60vh] pr-4">
          {expandedContent?.overview && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Overview</h3>
              <p className="text-muted-foreground">{expandedContent.overview}</p>
            </div>
          )}

          {expandedContent?.benefits && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Key Benefits</h3>
              <ul className="list-disc list-inside space-y-2">
                {expandedContent.benefits.map((benefit, index) => (
                  <li key={index} className="text-muted-foreground">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {expandedContent?.howItWorks && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">How It Works</h3>
              <ul className="list-decimal list-inside space-y-2">
                {expandedContent.howItWorks.map((step, index) => (
                  <li key={index} className="text-muted-foreground">
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {expandedContent?.tips && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Pro Tips</h3>
              <ul className="list-disc list-inside space-y-2">
                {expandedContent.tips.map((tip, index) => (
                  <li key={index} className="text-muted-foreground">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
