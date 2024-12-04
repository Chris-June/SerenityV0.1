import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, ExternalLink, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tools = [
  {
    id: 1,
    title: 'Mood Tracker App',
    description: 'Track and analyze your daily mood patterns',
    type: 'Mobile App',
    category: 'Self-Monitoring',
    platform: 'iOS & Android',
  },
  {
    id: 2,
    title: 'Breathing Exercise Timer',
    description: 'Customizable timer for breathing exercises',
    type: 'Web App',
    category: 'Stress Management',
    platform: 'Web Browser',
  },
  {
    id: 3,
    title: 'Journal Template',
    description: 'Structured template for daily reflection',
    type: 'Downloadable',
    category: 'Journaling',
    platform: 'PDF',
  },
];

export function Tools() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <Card key={tool.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{tool.title}</CardTitle>
              <Wrench className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>{tool.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{tool.type}</span>
                <span>{tool.platform}</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{tool.category}</Badge>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <BookmarkPlus className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Access
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
