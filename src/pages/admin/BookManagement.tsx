import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Plus, Trash2, Eye, ArrowLeft, Upload, FileText, User, Globe, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import PDFViewer from '@/components/PDFViewer';

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

  // PDF Viewer state
  const [viewingBook, setViewingBook] = useState<Book | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('urdu');
  const [totalPages, setTotalPages] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

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
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Cover image must be less than 5MB');
        return;
      }
      setSelectedCover(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setCoverPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim() || !user) {
      toast.error('Please fill in the title and select a file');
      return;
    }

    setUploading(true);
    try {
      // Upload PDF file
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${language}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('books')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('books')
        .getPublicUrl(filePath);

      // Upload cover image if selected
      let coverUrl = null;
      if (selectedCover) {
        const coverExt = selectedCover.name.split('.').pop();
        const coverFileName = `covers/${Date.now()}-${Math.random().toString(36).substring(7)}.${coverExt}`;
        
        const { error: coverUploadError } = await supabase.storage
          .from('books')
          .upload(coverFileName, selectedCover);
        
        if (!coverUploadError) {
          const { data: coverUrlData } = supabase.storage
            .from('books')
            .getPublicUrl(coverFileName);
          coverUrl = coverUrlData.publicUrl;
        }
      }

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
          cover_url: coverUrl,
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
      const { error: storageError } = await supabase.storage
        .from('books')
        .remove([book.file_path]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
      }

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
    setSelectedCover(null);
    setCoverPreview(null);
  };

  const handleViewBook = (book: Book) => {
    setViewingBook(book);
  };

  const handleClosePDFViewer = () => {
    setViewingBook(null);
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
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 sm:py-6 px-3 sm:px-4">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              {/* Left side */}
              <div className="flex items-center gap-2 sm:gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/admin')}
                  className="text-white hover:bg-white/20 h-9 w-9 shrink-0"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <img 
                  src={madrasaLogo} 
                  alt="Madrasa Logo" 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/30 shrink-0"
                />
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                    <span className="truncate">Book Management</span>
                  </h1>
                  <p className="text-teal-100 text-xs sm:text-sm">Manage library books</p>
                </div>
              </div>

              {/* Right side - Upload button */}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-white text-teal-700 hover:bg-teal-50 text-xs sm:text-sm">
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Upload Book</span>
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
                      <Label htmlFor="cover">Cover Image (Optional, Max 5MB)</Label>
                      <Input
                        id="cover"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="cursor-pointer"
                      />
                      {coverPreview && (
                        <div className="mt-2 relative w-24 h-32">
                          <img 
                            src={coverPreview} 
                            alt="Cover preview" 
                            className="w-full h-full object-cover rounded border"
                          />
                        </div>
                      )}
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
        <div className="container mx-auto px-3 sm:px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-gray-500" />
              <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                <SelectTrigger className="w-40 sm:w-48">
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
            </div>
            <span className="text-sm text-gray-500">
              {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Books Grid */}
        <div className="container mx-auto px-3 sm:px-4 pb-8">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredBooks.map((book) => (
                <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-32 sm:h-40 bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center relative">
                    {book.cover_url ? (
                      <img 
                        src={book.cover_url} 
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-white/50" />
                    )}
                    <span className={`absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(book.language)}`}>
                      {getLanguageLabel(book.language)}
                    </span>
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="font-bold text-base sm:text-lg mb-1 line-clamp-2">{book.title}</h3>
                    
                    {book.author && (
                      <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm flex items-center gap-1 mb-2">
                        <User className="h-3 w-3" />
                        {book.author}
                      </p>
                    )}

                    {book.description && (
                      <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-3">{book.description}</p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
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
                        className="flex-1 text-xs sm:text-sm"
                        onClick={() => handleViewBook(book)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
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

      {/* PDF Viewer Modal */}
      {viewingBook && (
        <PDFViewer
          fileUrl={viewingBook.file_url}
          title={viewingBook.title}
          onClose={handleClosePDFViewer}
        />
      )}
    </>
  );
};

export default BookManagement;
