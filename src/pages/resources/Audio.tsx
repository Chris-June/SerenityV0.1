import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Headphones, ExternalLink, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const audioResources = [
  {
    id: 1,
    title: 'Stress Relief Techniques',
    description: 'Quick and effective techniques for immediate stress relief',
    duration: '8 min',
    category: 'Stress Management',
    narrator: 'Dr. James Wilson',
  },
  {
    id: 2,
    title: 'Sleep Meditation',
    description: 'Calming meditation to help you fall asleep naturally',
    duration: '30 min',
    category: 'Sleep',
    narrator: 'Maria Garcia',
  },
  {
    id: 3,
    title: 'Anxiety Relief Breathing',
    description: 'Guided breathing exercises for anxiety relief',
    duration: '12 min',
    category: 'Anxiety Management',
    narrator: 'Alex Thompson',
  },
];

export function Audio() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {audioResources.map((audio) => (
        <Card key={audio.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{audio.title}</CardTitle>
              <Headphones className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>{audio.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{audio.narrator}</span>
                <span>{audio.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{audio.category}</Badge>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <BookmarkPlus className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Listen
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
