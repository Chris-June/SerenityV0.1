import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, ExternalLink, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const videos = [
  {
    id: 1,
    title: 'Mindfulness Meditation Guide',
    description: 'Learn the basics of mindfulness meditation',
    duration: '15 min',
    category: 'Meditation',
    instructor: 'Sarah Williams',
  },
  {
    id: 2,
    title: 'Guided Relaxation Session',
    description: 'A calming session to help reduce stress and anxiety',
    duration: '20 min',
    category: 'Relaxation',
    instructor: 'David Miller',
  },
  {
    id: 3,
    title: 'Yoga for Mental Clarity',
    description: 'Simple yoga poses to improve focus and mental clarity',
    duration: '25 min',
    category: 'Exercise',
    instructor: 'Lisa Chen',
  },
];

export function Videos() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <Card key={video.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{video.title}</CardTitle>
              <Video className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>{video.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{video.instructor}</span>
                <span>{video.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{video.category}</Badge>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <BookmarkPlus className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Watch
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
