import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Video, Headphones, ExternalLink, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const allResources = [
  {
    id: 1,
    title: 'Understanding Anxiety',
    description: 'A comprehensive guide to managing anxiety and stress',
    type: 'Article',
    readTime: '10 min',
    category: 'Mental Health',
    icon: BookOpen,
  },
  {
    id: 2,
    title: 'Mindfulness Meditation Guide',
    description: 'Learn the basics of mindfulness meditation',
    type: 'Video',
    duration: '15 min',
    category: 'Meditation',
    icon: Video,
  },
  {
    id: 3,
    title: 'Stress Relief Techniques',
    description: 'Quick and effective techniques for immediate stress relief',
    type: 'Audio',
    duration: '8 min',
    category: 'Stress Management',
    icon: Headphones,
  },
  // Add more resources here
];

export function AllResources({ resources = allResources }: { resources?: typeof allResources }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource) => (
        <Card key={resource.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{resource.title}</CardTitle>
              <resource.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>{resource.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-x-2">
                <Badge>{resource.type}</Badge>
                <Badge variant="outline">{resource.category}</Badge>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <BookmarkPlus className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
