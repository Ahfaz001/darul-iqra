import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import StudentLayout from '@/components/StudentLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { BookOpen, Globe, Search, ExternalLink, FileText } from 'lucide-react';

interface HadithBook {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  language: string;
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

const StudentHadith: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [books, setBooks] = useState<HadithBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredBooks = books.filter(book => {
    const matchesLanguage = filterLanguage === 'all' || book.language === filterLanguage;
    const matchesSearch = searchQuery === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLanguage && matchesSearch;
  });

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
  };

  const getLanguageLabel = (lang: string) => {
    const found = LANGUAGES.find(l => l.value === lang);
    return found ? found.labelNative : lang;
  };

  const getLanguageColor = (lang: string) => {
    switch (lang) {
      case 'english': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300';
      case 'urdu': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300';
      case 'roman_urdu': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300';
      case 'arabic': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <StudentLayout>
      <Helmet>
        <title>Hadith Library | Idarah Tarjumat-ul-Qur'an</title>
        <meta name="description" content="Browse and read Hadith books in multiple languages" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-accent py-6 px-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-1 text-primary-foreground">📖 Hadith Library</h1>
            <p className="text-primary-foreground/80">Browse Hadith books in multiple languages</p>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          {/* Bismillah Header */}
          <div className="text-center mb-8">
            <p className="text-2xl font-arabic text-primary mb-2">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <p className="text-muted-foreground">In the name of Allah, the Most Gracious, the Most Merciful</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books... کتابیں تلاش کریں"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages • تمام</SelectItem>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label} • {lang.labelNative}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Language Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={filterLanguage === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterLanguage('all')}
            >
              All
            </Button>
            {LANGUAGES.map((lang) => (
              <Button
                key={lang.value}
                variant={filterLanguage === lang.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterLanguage(lang.value)}
              >
                {lang.labelNative}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredBooks.length === 0 ? (
            <Card className="bg-card border-border/30">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Books Found • کوئی کتاب نہیں ملی
                </h3>
                <p className="text-muted-foreground text-center">
                  {searchQuery || filterLanguage !== 'all' 
                    ? 'Try adjusting your search or filter'
                    : 'No Hadith books have been uploaded yet'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((book) => (
                <Card 
                  key={book.id} 
                  className="bg-card border-border/30 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  onClick={() => window.open(book.file_url, '_blank')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <BookOpen className="h-7 w-7 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                          {book.title}
                        </h3>
                        {book.author && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {book.author}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${getLanguageColor(book.language)}`}>
                            {getLanguageLabel(book.language)}
                          </span>
                          {book.file_size && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {formatFileSize(book.file_size)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {book.description && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                        {book.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(book.created_at), 'MMM d, yyyy')}
                      </span>
                      <span className="text-xs text-primary flex items-center gap-1 group-hover:underline">
                        Open Book <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Info Card */}
          <Card className="mt-8 bg-gradient-to-r from-primary/5 to-emerald-500/10 dark:from-primary/10 dark:to-emerald-500/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    About Hadith • حدیث کے بارے میں
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Hadith are the sayings, actions, and approvals of Prophet Muhammad ﷺ. 
                    These collections are essential sources for understanding Islam.
                    <br />
                    <span className="font-arabic">
                      حدیث نبی کریم ﷺ کے اقوال، افعال اور تقریرات ہیں۔
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </StudentLayout>
  );
};

export default StudentHadith;
