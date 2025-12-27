import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import StudentLayout from '@/components/StudentLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import PDFViewer from '@/components/PDFViewer';
import { 
  BookOpen, 
  Search, 
  Eye, 
  FileText, 
  Globe, 
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

interface QuranUpload {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_size: number | null;
  total_pages: number | null;
  cover_url: string | null;
  language: string;
  is_searchable: boolean;
  created_at: string;
}

const LANGUAGES = [
  { value: 'arabic', label: 'Arabic', labelNative: 'العربية' },
  { value: 'urdu', label: 'Urdu Translation', labelNative: 'اردو' },
  { value: 'english', label: 'English Translation', labelNative: 'English' },
];

const StudentQuran: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [quranList, setQuranList] = useState<QuranUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [viewingQuran, setViewingQuran] = useState<QuranUpload | null>(null);

  useEffect(() => {
    fetchQuranList();
  }, []);

  const fetchQuranList = async () => {
    try {
      const { data, error } = await supabase
        .from('quran_uploads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuranList(data || []);
    } catch (error) {
      console.error('Error fetching Quran list:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuranList = quranList.filter(quran => {
    const matchesSearch = quran.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quran.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLanguage = filterLanguage === 'all' || quran.language === filterLanguage;
    return matchesSearch && matchesLanguage;
  });

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
  };

  const getLanguageLabel = (lang: string) => {
    const language = LANGUAGES.find(l => l.value === lang);
    return language ? language.label : lang;
  };

  const getLanguageColor = (lang: string) => {
    switch (lang) {
      case 'arabic':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
      case 'urdu':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'english':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (viewingQuran) {
    return (
      <PDFViewer 
        fileUrl={viewingQuran.file_url} 
        title={viewingQuran.title}
        onClose={() => setViewingQuran(null)}
      />
    );
  }

  return (
    <StudentLayout>
      <Helmet>
        <title>Quran | Student Portal</title>
        <meta name="description" content="Read and study the Holy Quran with translations" />
      </Helmet>

      <div className="min-h-screen bg-background">

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-accent py-8 px-4">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary-foreground/20">
                <BookOpen className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold text-primary-foreground ${isRTL ? 'font-urdu' : ''}`}>
                  القرآن الكریم
                </h1>
                <p className="text-primary-foreground/80">Holy Quran - Read & Study</p>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/70" />
                <Input
                  placeholder="Search Quran..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/20 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                />
              </div>
              <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                <SelectTrigger className="w-full sm:w-48 bg-background/20 border-primary-foreground/20 text-primary-foreground">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Language" />
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
          </div>
        </div>

        {/* Content */}
        <main className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredQuranList.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground">No Quran uploads yet</h3>
                <p className="text-muted-foreground">
                  Please check back later for Quran PDFs
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuranList.map((quran) => (
                <Card 
                  key={quran.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  onClick={() => setViewingQuran(quran)}
                >
                  {/* Cover */}
                  <div className="h-40 sm:h-48 bg-gradient-to-br from-primary to-accent flex items-center justify-center relative overflow-hidden">
                    {quran.cover_url ? (
                      <img 
                        src={quran.cover_url} 
                        alt={quran.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-center text-primary-foreground">
                        <BookOpen className="h-16 w-16 mx-auto mb-2 opacity-50" />
                        <p className="text-lg font-arabic">القرآن</p>
                      </div>
                    )}
                    
                    {/* Searchable badge */}
                    <div className="absolute top-3 right-3">
                      {quran.is_searchable ? (
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Searchable
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="h-3 w-3 mr-1" />
                          Non-Searchable
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-foreground line-clamp-2 flex-1">
                        {quran.title}
                      </h3>
                      <Badge className={getLanguageColor(quran.language)}>
                        {getLanguageLabel(quran.language)}
                      </Badge>
                    </div>

                    {quran.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {quran.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{quran.total_pages || '?'} pages</span>
                      </div>
                      <span>{formatFileSize(quran.file_size)}</span>
                    </div>

                    <Button 
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingQuran(quran);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Read Quran
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </StudentLayout>
  );
};

export default StudentQuran;
