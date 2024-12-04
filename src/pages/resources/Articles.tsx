import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ExternalLink, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const articles = [
  {
    id: 1,
    title: 'Understanding Anxiety',
    description: 'A comprehensive guide to managing anxiety and stress',
    readTime: '10 min',
    category: 'Mental Health',
    author: 'Dr. Sarah Johnson',
  },
  {
    id: 2,
    title: 'The Science of Happiness',
    description: 'Research-backed strategies for improving mental well-being',
    readTime: '12 min',
    category: 'Positive Psychology',
    author: 'Dr. Michael Chen',
  },
  {
    id: 3,
    title: 'Building Emotional Resilience',
    description: 'Techniques to strengthen your emotional well-being',
    readTime: '8 min',
    category: 'Self-Development',
    author: 'Emma Thompson, LMFT',
  },
];

export function Articles() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Card key={article.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{article.title}</CardTitle>
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>{article.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{article.author}</span>
                <span>{article.readTime} read</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{article.category}</Badge>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <BookmarkPlus className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Read
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
