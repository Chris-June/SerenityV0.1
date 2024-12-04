import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AllResources } from './resources/AllResources';
import { Articles } from './resources/Articles';
import { Videos } from './resources/Videos';
import { Audio } from './resources/Audio';
import { Tools } from './resources/Tools';

export function ResourcesPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight">Resources</h1>
        <p className="text-muted-foreground">
          Discover a collection of carefully curated resources to support your mental well-being journey.
        </p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search resources..." className="pl-8" />
        </div>
        <Button>Search</Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <AllResources />
        </TabsContent>
        <TabsContent value="articles" className="space-y-4">
          <Articles />
        </TabsContent>
        <TabsContent value="videos" className="space-y-4">
          <Videos />
        </TabsContent>
        <TabsContent value="audio" className="space-y-4">
          <Audio />
        </TabsContent>
        <TabsContent value="tools" className="space-y-4">
          <Tools />
        </TabsContent>
      </Tabs>
    </div>
  );
}
