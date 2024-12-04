import { useState, useEffect } from 'react';
import { Quote, RefreshCw, Heart, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const affirmations = [
  {
    text: "I am worthy of love, respect, and happiness",
    category: "self-worth"
  },
  {
    text: "I choose to be confident and self-assured",
    category: "confidence"
  },
  {
    text: "I am getting stronger every day",
    category: "growth"
  },
  {
    text: "I trust in my ability to make good decisions",
    category: "trust"
  },
  {
    text: "My potential to succeed is infinite",
    category: "success"
  },
  {
    text: "I am in charge of my own happiness",
    category: "happiness"
  },
  {
    text: "I radiate positive energy and attract positivity",
    category: "positivity"
  },
  {
    text: "I am resilient and can overcome any challenge",
    category: "resilience"
  },
  {
    text: "My mind is full of brilliant ideas",
    category: "creativity"
  },
  {
    text: "I deserve peace, joy, and all good things",
    category: "deservingness"
  }
];

const moodBasedAffirmations = {
  1: [ // For low mood
    "I acknowledge my feelings, and they are valid",
    "This moment is temporary, and I am strong",
    "I am doing the best I can, and that is enough",
    "Small steps forward are still progress",
    "I give myself permission to take things one day at a time"
  ],
  2: [ // For neutral mood
    "I choose to focus on what I can control",
    "I am growing and learning every day",
    "I trust in my journey and timing",
    "My presence matters in this world",
    "I embrace all opportunities for growth"
  ],
  3: [ // For good mood
    "I am grateful for this moment of joy",
    "My positive energy inspires others",
    "I deserve all the good things coming my way",
    "I choose to spread happiness and light",
    "My happiness contributes to the world's happiness"
  ]
};

export function AffirmationCard() {
  const [currentAffirmation, setCurrentAffirmation] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    return affirmations[randomIndex].text;
  };

  const refreshAffirmation = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentAffirmation(getRandomAffirmation());
      setIsLiked(false);
      setIsAnimating(false);
    }, 300);
  };

  const shareAffirmation = async () => {
    try {
      await navigator.share({
        title: 'Daily Affirmation',
        text: currentAffirmation,
        url: window.location.href
      });
    } catch (error) {
      console.log('Sharing failed:', error);
    }
  };

  useEffect(() => {
    setCurrentAffirmation(getRandomAffirmation());
  }, []);

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Quote className="h-5 w-5 text-primary" />
          Daily Affirmation
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div
            className={cn(
              "min-h-[80px] flex items-center justify-center text-center p-4 rounded-lg bg-muted/50 transition-opacity duration-300",
              isAnimating && "opacity-0"
            )}
          >
            <p className="text-lg font-medium">{currentAffirmation}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className={cn(
                "transition-colors",
                isLiked && "text-red-500 hover:text-red-600"
              )}
            >
              <Heart className={cn(
                "h-4 w-4",
                isLiked && "fill-current"
              )} />
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={shareAffirmation}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={refreshAffirmation}
                disabled={isAnimating}
              >
                <RefreshCw className={cn(
                  "h-4 w-4",
                  isAnimating && "animate-spin"
                )} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}