import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Video, Headphones, Link, ExternalLink, BookmarkPlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const resources = [
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
  {
    id: 4,
    title: 'Building Healthy Habits',
    description: 'A step-by-step guide to creating and maintaining healthy habits',
    type: 'Article',
    readTime: '12 min',
    category: 'Wellness',
    icon: Link,
  },
];

export function ResourcesPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
          Resources
        </h1>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search resources..." className="pl-10" />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Card key={resource.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle>{resource.title}</CardTitle>
                          <CardDescription>{resource.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline">{resource.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {resource.type} • {resource.readTime || resource.duration}
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <BookmarkPlus className="h-4 w-4" />
                        </Button>
                        <Button className="gap-2">
                          <ExternalLink className="w-4 h-4" />
                          Open
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Additional tab contents would go here */}
      </Tabs>
    </div>
  );
}
