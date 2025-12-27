import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import StudentLayout from '@/components/StudentLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Search, User, FileText, ExternalLink, Globe } from 'lucide-react';
import { toast } from 'sonner';
import PDFViewer from '@/components/PDFViewer';

interface Book {
  id: string;
  title: string;
  author: string | null;
  language: string;
  description: string | null;
  file_url: string;
  file_size: number | null;
  cover_url: string | null;
  total_pages: number | null;
  created_at: string;
}

const LANGUAGES = [
  { value: 'all', label: 'All Languages', labelNative: 'تمام زبانیں' },
  { value: 'urdu', label: 'Urdu', labelNative: 'اردو' },
  { value: 'english', label: 'English', labelNative: 'English' },
  { value: 'roman', label: 'Roman Urdu', labelNative: 'Roman' },
];

const StudentBooks = () => {
  const { t } = useLanguage();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

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

  const filteredBooks = books.filter(book => {
    const matchesLanguage = filterLanguage === 'all' || book.language === filterLanguage;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLanguage && matchesSearch;
  });

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
  };

  const getLanguageLabel = (lang: string) => {
    const language = LANGUAGES.find(l => l.value === lang);
    return language ? language.labelNative : lang;
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
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleOpenBook = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseViewer = () => {
    setSelectedBook(null);
  };

  return (
    <StudentLayout>
      <Helmet>
        <title>Books Library | Idarah Tarjumat-ul-Qur'an Wa Sunnah</title>
        <meta name="description" content="Browse and read Islamic books from Idarah Tarjumat-ul-Qur'an Wa Sunnah digital library." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-6 px-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-1">📚 Books Library</h1>
            <p className="text-teal-100">Read Islamic books from our digital library</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-6 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-300 h-5 w-5" />
                <Input
                  placeholder="Search books by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-teal-200 focus:bg-white/20"
                />
              </div>
              <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                <SelectTrigger className="w-full sm:w-48 bg-white/10 border-white/20 text-white">
                  <Globe className="h-4 w-4 mr-2" />
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
          </div>
        </div>

        {/* Quick Language Filters */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <Button
                key={lang.value}
                variant={filterLanguage === lang.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterLanguage(lang.value)}
                className={filterLanguage === lang.value ? 'bg-teal-600 hover:bg-teal-700' : ''}
              >
                {lang.labelNative}
              </Button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        <div className="container mx-auto px-4 pb-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">No books found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery || filterLanguage !== 'all' 
                  ? 'Try adjusting your search or filter' 
                  : 'Books will be added soon'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <Card 
                  key={book.id} 
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-0 bg-white dark:bg-gray-800"
                  onClick={() => handleOpenBook(book)}
                >
                  <div className="relative">
                    {/* Book Cover or Placeholder */}
                    <div className="h-48 bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                      {book.cover_url ? (
                        <img 
                          src={book.cover_url} 
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="h-20 w-20 text-white/50" />
                      )}
                    </div>
                    
                    {/* Language Badge */}
                    <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(book.language)}`}>
                      {getLanguageLabel(book.language)}
                    </span>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button className="bg-white text-teal-700 hover:bg-teal-50">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Read Book
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-1 line-clamp-2 text-gray-900 dark:text-white group-hover:text-teal-600 transition-colors">
                      {book.title}
                    </h3>
                    
                    {book.author && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1 mb-2">
                        <User className="h-3 w-3" />
                        {book.author}
                      </p>
                    )}

                    {book.description && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                        {book.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {formatFileSize(book.file_size)}
                      </span>
                      {book.total_pages && (
                        <span>{book.total_pages} pages</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="container mx-auto px-4 pb-8">
          <Card className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">About Our Library</h3>
                  <p className="text-teal-100 text-sm leading-relaxed">
                    Our digital library contains a collection of Islamic books including Quran, Hadith, Fiqh, 
                    and other religious texts. Books are available in Urdu, English, and Roman Urdu for 
                    easy access and learning. Click on any book to start reading directly in your browser.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedBook && (
        <PDFViewer
          fileUrl={selectedBook.file_url}
          title={selectedBook.title}
          onClose={handleCloseViewer}
        />
      )}
    </StudentLayout>
  );
};

export default StudentBooks;
