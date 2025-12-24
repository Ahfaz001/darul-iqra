import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Plus, Trash2, ExternalLink, ArrowLeft, Upload, FileText, User, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import madrasaLogo from '@/assets/madrasa-logo.jpg';

interface Book {
  id: string;
  title: string;
  author: string | null;
  language: string;
  description: string | null;
  file_path: string;
  file_url: string;
  file_size: number | null;
  cover_url: string | null;
  total_pages: number | null;
  created_at: string;
}

const LANGUAGES = [
  { value: 'urdu', label: 'Urdu', labelNative: 'اردو' },
  { value: 'english', label: 'English', labelNative: 'English' },
  { value: 'roman', label: 'Roman Urdu', labelNative: 'Roman' },
];

const BookManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterLanguage, setFilterLanguage] = useState('all');

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('urdu');
  const [totalPages, setTotalPages] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error('File size must be less than 50MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim() || !user) {
      toast.error('Please fill in the title and select a file');
      return;
    }

    setUploading(true);
    try {
      // Generate unique file path
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${language}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('books')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('books')
        .getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase
        .from('books')
        .insert({
          title: title.trim(),
          author: author.trim() || null,
          description: description.trim() || null,
          language,
          file_path: filePath,
          file_url: urlData.publicUrl,
          file_size: selectedFile.size,
          total_pages: totalPages ? parseInt(totalPages) : null,
          uploaded_by: user.id,
        });

      if (dbError) throw dbError;

      toast.success('Book uploaded successfully!');
      resetForm();
      setDialogOpen(false);
      fetchBooks();
    } catch (error) {
      console.error('Error uploading book:', error);
      toast.error('Failed to upload book');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (book: Book) => {
    if (!confirm(`Are you sure you want to delete "${book.title}"?`)) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('books')
        .remove([book.file_path]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('books')
        .delete()
        .eq('id', book.id);

      if (dbError) throw dbError;

      toast.success('Book deleted successfully');
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book');
    }
  };

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setDescription('');
    setLanguage('urdu');
    setTotalPages('');
    setSelectedFile(null);
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
    const language = LANGUAGES.find(l => l.value === lang);
    return language ? `${language.label} (${language.labelNative})` : lang;
  };

  const getLanguageColor = (lang: string) => {
    switch (lang) {
      case 'urdu':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
      case 'english':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'roman':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <Helmet>
        <title>Book Management - Admin Panel</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-6 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/admin')}
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <img 
                  src={madrasaLogo} 
                  alt="Madrasa Logo" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                    <BookOpen className="h-6 w-6" />
                    Book Management
                  </h1>
                  <p className="text-teal-100 text-sm">Manage library books</p>
                </div>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-teal-700 hover:bg-teal-50">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Book
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Upload New Book
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="title">Book Title *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter book title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Enter author name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="language">Language *</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label} - {lang.labelNative}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="pages">Total Pages</Label>
                      <Input
                        id="pages"
                        type="number"
                        value={totalPages}
                        onChange={(e) => setTotalPages(e.target.value)}
                        placeholder="Enter total pages (optional)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter book description (optional)"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="file">PDF File * (Max 50MB)</Label>
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                      {selectedFile && (
                        <p className="text-sm text-gray-500 mt-1">
                          Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={handleUpload}
                      disabled={uploading || !selectedFile || !title.trim()}
                      className="w-full bg-teal-600 hover:bg-teal-700"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Book
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Globe className="h-5 w-5 text-gray-500" />
            <Select value={filterLanguage} onValueChange={setFilterLanguage}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label} - {lang.labelNative}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500">
              {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Books Grid */}
        <div className="container mx-auto px-4 pb-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
          ) : filteredBooks.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">No books yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Start by uploading your first book
                </p>
                <Button onClick={() => setDialogOpen(true)} className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Book
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-32 bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center relative">
                    <BookOpen className="h-16 w-16 text-white/50" />
                    <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(book.language)}`}>
                      {getLanguageLabel(book.language)}
                    </span>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-1 line-clamp-2">{book.title}</h3>
                    
                    {book.author && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1 mb-2">
                        <User className="h-3 w-3" />
                        {book.author}
                      </p>
                    )}

                    {book.description && (
                      <p className="text-gray-500 text-sm line-clamp-2 mb-3">{book.description}</p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {formatFileSize(book.file_size)}
                      </span>
                      {book.total_pages && <span>{book.total_pages} pages</span>}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(book.file_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(book)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookManagement;
