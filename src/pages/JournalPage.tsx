import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  PlusCircle, Search, Save, X, Download, 
  Upload, Trash2, Edit2, Tag, Hash, Activity 
} from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { useJournalStorage, JournalEntry, DEFAULT_CATEGORIES, NewJournalEntry } from '@/hooks/use-journal-storage';
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EntryFormData {
  title: string;
  content: string;
  mood: string;
  category: string;
  tags: string[];
  newTag: string;
}

interface JournalStatsProps {
  entries: JournalEntry[];
}

function JournalStats({ entries }: JournalStatsProps) {
  const totalEntries = entries.length;
  const totalWords = entries.reduce((acc, entry) => acc + entry.content.split(' ').length, 0);
  const mostUsedTags = entries.reduce((acc, entry) => {
    entry.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as { [tag: string]: number });

  return (
    <Card className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Journal Statistics</h2>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span>Total Entries:</span>
          <span className="text-primary">{totalEntries}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Total Words:</span>
          <span className="text-primary">{totalWords}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Most Used Tags:</span>
          <div className="flex flex-wrap gap-2">
            {Object.keys(mostUsedTags).sort((a, b) => mostUsedTags[b] - mostUsedTags[a]).slice(0, 5).map(tag => (
              <Badge key={tag} variant="secondary">
                {tag} ({mostUsedTags[tag]})
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function JournalPage() {
  const { entries, addEntry, deleteEntry, updateEntry, exportEntries, importEntries, getAllTags } = useJournalStorage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<'all' | '7days' | '30days' | '90days'>('all');
  const [showStats, setShowStats] = useState(true);
  const [entryForm, setEntryForm] = useState<EntryFormData>({
    title: '',
    content: '',
    mood: '',
    category: 'Personal',
    tags: [],
    newTag: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setEntryForm({
      title: '',
      content: '',
      mood: '',
      tags: [],
      category: 'Personal',
      newTag: '',
    });
    setEditingEntry(null);
  };

  const handleOpenDialog = (entry?: JournalEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setEntryForm({
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        tags: [...entry.tags],
        category: entry.category,
        newTag: '',
      });
    } else {
      resetForm();
    }
    setIsEntryDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEntryDialogOpen(false);
    resetForm();
  };

  const handleSaveEntry = () => {
    if (!entryForm.title || !entryForm.content) {
      toast({
        title: "Error",
        description: "Journal entry cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    const entryData: NewJournalEntry = {
      title: entryForm.title,
      content: entryForm.content,
      mood: entryForm.mood,
      tags: entryForm.tags,
      category: entryForm.category,
    };

    if (editingEntry) {
      updateEntry(editingEntry.id, entryData);
      toast({
        title: "Entry Updated",
        description: "Your journal entry has been updated successfully.",
      });
    } else {
      try {
        addEntry(entryData);
        toast({
          title: "Entry Saved",
          description: "Your journal entry has been successfully saved.",
        });
      } catch (error) {
        console.error("Failed to save journal entry:", error);
        toast({
          title: "Error",
          description: "Failed to save journal entry.",
          variant: "destructive"
        });
      }
    }

    handleCloseDialog();
  };

  const handleAddTag = () => {
    if (!entryForm.newTag.trim()) return;
    const trimmedNewTag = entryForm.newTag.trim();
    if (!entryForm.tags.includes(trimmedNewTag)) {
      setEntryForm(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedNewTag],
        newTag: '',
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEntryForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleExport = () => {
    try {
      exportEntries();
      toast({
        title: "Export Successful",
        description: "Your journal entries have been exported successfully.",
      });
    } catch (error: unknown) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your journal entries.",
        variant: "destructive",
      });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importEntries(file);
      toast({
        title: "Import Successful",
        description: "Your journal entries have been imported successfully.",
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: `There was an error importing your journal entries: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = (id: string) => {
    deleteEntry(id);
    toast({
      title: "Entry Deleted",
      description: "Your journal entry has been deleted.",
    });
  };

  const existingTags = getAllTags();

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      entry.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;

    let matchesDate = true;
    if (selectedDateRange !== 'all') {
      const now = new Date();
      const entryDate = new Date(entry.date);
      const days = {
        '7days': 7,
        '30days': 30,
        '90days': 90
      }[selectedDateRange];
      
      const startDate = subDays(now, days);
      matchesDate = isAfter(entryDate, startDate);
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  return (
    <>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
            Journal
          </h1>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
            <Button variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2" onClick={() => handleOpenDialog()}>
                  <PlusCircle className="w-4 h-4" />
                  New Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}</DialogTitle>
                  <DialogDescription>
                    {editingEntry ? 'Edit your existing journal entry below.' : 'Create a new journal entry to document your thoughts and feelings.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Give your entry a title..."
                      value={entryForm.title}
                      onChange={(e) => setEntryForm({ ...entryForm, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={entryForm.category}
                      onValueChange={(value) => setEntryForm({ ...entryForm, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEFAULT_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {entryForm.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="gap-1"
                        >
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Input
                            placeholder="Add a tag..."
                            value={entryForm.newTag}
                            onChange={(e) => setEntryForm({ ...entryForm, newTag: e.target.value })}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag();
                              }
                            }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="p-0" side="top" align="start">
                          <Command>
                            <CommandInput placeholder="Search tags..." />
                            <CommandEmpty>No tags found.</CommandEmpty>
                            <CommandGroup>
                              {existingTags
                                .filter(tag => 
                                  tag.toLowerCase().includes((entryForm.newTag || '').toLowerCase()) &&
                                  !entryForm.tags.includes(tag)
                                )
                                .map(tag => (
                                  <CommandItem
                                    key={tag}
                                    onSelect={() => {
                                      setEntryForm(prev => ({
                                        ...prev,
                                        newTag: '',
                                        tags: [...prev.tags, tag]
                                      }));
                                    }}
                                  >
                                    <Tag className="mr-2 h-4 w-4" />
                                    {tag}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <Button type="button" variant="outline" onClick={handleAddTag}>
                        Add Tag
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Your Thoughts</Label>
                    <Textarea
                      id="content"
                      placeholder="Write your thoughts here..."
                      className="min-h-[200px] resize-none"
                      value={entryForm.content}
                      onChange={(e) => setEntryForm({ ...entryForm, content: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEntry} className="gap-2">
                      <Save className="w-4 h-4" />
                      {editingEntry ? 'Update' : 'Save'} Entry
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {showStats && <JournalStats entries={entries} />}

        <div className="flex flex-col gap-4">
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search entries by title, content, tags, or category..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {DEFAULT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDateRange} onValueChange={(value: "all" | "7days" | "30days" | "90days") => setSelectedDateRange(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setShowStats(prev => !prev)}
            >
              <Activity className="h-4 w-4" />
              {showStats ? 'Hide' : 'Show'} Stats
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredEntries.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                {entries.length === 0 
                  ? "No journal entries yet."
                  : "No entries match your search."}
              </p>
              {entries.length === 0 && (
                <Button onClick={() => handleOpenDialog()} variant="outline" className="gap-2">
                  <PlusCircle className="w-4 h-4" />
                  Create Your First Entry
                </Button>
              )}
            </Card>
          ) : (
            filteredEntries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle>{entry.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Hash className="h-4 w-4" />
                        {entry.category}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(entry.date, 'MMM d, yyyy')}
                      {entry.lastEdited && (
                        <span className="block text-xs">
                          Edited: {format(entry.lastEdited, 'MMM d, yyyy')}
                        </span>
                      )}
                    </span>
                  </div>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {entry.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(entry)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this journal entry? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(entry.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
      <Toaster />
    </>
  );
}
