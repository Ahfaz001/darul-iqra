import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { ArrowLeft, BookOpen, Plus, Upload, Trash2, FileText, Globe, Eye } from 'lucide-react';
import { notifyNewHadith } from '@/hooks/useSendNotification';

interface HadithBook {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  language: string;
  file_path: string;
  file_url: string;
  file_size: number | null;
  created_at: string;
}

const LANGUAGES = [
  { value: 'english', label: 'English', labelNative: 'English' },
  { value: 'urdu', label: 'Urdu', labelNative: 'اردو' },
  { value: 'roman_urdu', label: 'Roman Urdu', labelNative: 'Roman Urdu' },
  { value: 'arabic', label: 'Arabic', labelNative: 'العربية' },
];

const HadithManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [books, setBooks] = useState<HadithBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  
  // Form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('hadith_books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch books",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File too large",
          description: "Maximum file size is 50MB",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a title and select a file",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${language}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('hadith-books')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('hadith-books')
        .getPublicUrl(filePath);

      // Save book metadata
      const { error: dbError } = await supabase
        .from('hadith_books')
        .insert({
          title: title.trim(),
          author: author.trim() || null,
          description: description.trim() || null,
          language,
          file_path: filePath,
          file_url: urlData.publicUrl,
          file_size: selectedFile.size,
          uploaded_by: user?.id
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Book uploaded successfully"
      });

      // Send push notification to all students
      notifyNewHadith(title.trim(), author.trim());

      // Reset form
      setTitle('');
      setAuthor('');
      setDescription('');
      setLanguage('english');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsUploadOpen(false);
      fetchBooks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload book",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (book: HadithBook) => {
    if (!confirm(`Are you sure you want to delete "${book.title}"?`)) return;

    try {
      // Delete from storage
      await supabase.storage
        .from('hadith-books')
        .remove([book.file_path]);

      // Delete from database
      const { error } = await supabase
        .from('hadith_books')
        .delete()
        .eq('id', book.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Book deleted successfully"
      });
      fetchBooks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive"
      });
    }
  };

  const filteredBooks = filterLanguage === 'all' 
    ? books 
    : books.filter(b => b.language === filterLanguage);

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
  };

  const getLanguageLabel = (lang: string) => {
    const found = LANGUAGES.find(l => l.value === lang);
    return found ? `${found.label} (${found.labelNative})` : lang;
  };

  return (
    <>
      <Helmet>
        <title>Hadith Books Management | Idarah Tarjumat-ul-Qur'an</title>
        <meta name="description" content="Upload and manage Hadith books" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border/50 sticky top-0 z-50">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate('/admin')}
                  className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <img 
                  src={madrasaLogo} 
                  alt="Madrasa Logo" 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0"
                />
                <div className="min-w-0">
                  <h1 className="font-display font-bold text-primary text-sm sm:text-lg truncate">
                    Hadith Books
                  </h1>
                  <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Upload and manage Hadith collections</p>
                </div>
              </div>
              
              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs sm:text-sm shrink-0">
                    <Upload className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Upload Book</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Upload Hadith Book</DialogTitle>
                    <DialogDescription>
                      Upload a PDF or document for students to read
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpload} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Book Title *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Sahih Bukhari"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="e.g., Imam Bukhari"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Language *</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label} ({lang.labelNative})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of the book..."
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Upload File *</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <label 
                          htmlFor="file-upload"
                          className="cursor-pointer"
                        >
                          {selectedFile ? (
                            <div className="flex items-center justify-center gap-2 text-primary">
                              <FileText className="h-5 w-5" />
                              <span className="font-medium">{selectedFile.name}</span>
                              <span className="text-muted-foreground">
                                ({formatFileSize(selectedFile.size)})
                              </span>
                            </div>
                          ) : (
                            <div className="text-muted-foreground">
                              <Upload className="h-8 w-8 mx-auto mb-2" />
                              <p>Click to select PDF or Document</p>
                              <p className="text-xs">Max 50MB</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsUploadOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={uploading || !selectedFile}>
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Filter */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <Select value={filterLanguage} onValueChange={setFilterLanguage}>
              <SelectTrigger className="w-[150px] sm:w-[200px] h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue placeholder="Filter by language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label} ({lang.labelNative})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {filteredBooks.length} book(s)
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredBooks.length === 0 ? (
            <Card className="bg-card border-border/30">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Books Yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Upload your first Hadith book for students to read
                </p>
                <Button onClick={() => setIsUploadOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Book
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((book) => (
                <Card key={book.id} className="bg-card border-border/30 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(book)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                      {book.title}
                    </h3>
                    {book.author && (
                      <p className="text-sm text-muted-foreground mb-2">
                        by {book.author}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                        {getLanguageLabel(book.language)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(book.file_size)}
                      </span>
                    </div>
                    
                    {book.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {book.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(book.created_at), 'MMM d, yyyy')}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(book.file_url, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default HadithManagement;
