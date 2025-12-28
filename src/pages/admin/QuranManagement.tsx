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
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Eye, 
  ArrowLeft, 
  Upload, 
  FileText, 
  Globe, 
  ImagePlus,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import PDFViewer from '@/components/PDFViewer';
import { notifyNewQuran } from '@/hooks/useSendNotification';
import AdminMobileNav from '@/components/admin/AdminMobileNav';

interface QuranUpload {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
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

const QuranManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quranList, setQuranList] = useState<QuranUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [checkingPDF, setCheckingPDF] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterLanguage, setFilterLanguage] = useState('all');

  // PDF Viewer state
  const [viewingQuran, setViewingQuran] = useState<QuranUpload | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('arabic');
  const [totalPages, setTotalPages] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSearchable, setIsSearchable] = useState<boolean | null>(null);

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
      toast.error('Failed to load Quran uploads');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        toast.error('File size must be less than 100MB');
        return;
      }
      setSelectedFile(file);
      setIsSearchable(null);
      
      // Check if PDF is searchable
      await checkPDFSearchability(file);
    }
  };

  const checkPDFSearchability = async (file: File) => {
    setCheckingPDF(true);
    try {
      // Read first part of PDF and check for text content
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        // Simple heuristic: check if PDF contains text streams
        const hasText = content.includes('/Type /Page') && 
          (content.includes('BT') && content.includes('ET')) || // Text objects
          content.includes('/Contents') ||
          content.length > 50000; // Larger PDFs likely have text
        
        setIsSearchable(hasText);
        setCheckingPDF(false);
        
        if (hasText) {
          toast.success('PDF appears to be searchable!');
        } else {
          toast.warning('PDF may not be searchable (image-based)');
        }
      };
      reader.readAsText(file.slice(0, 100000)); // Read first 100KB
    } catch (error) {
      console.error('Error checking PDF:', error);
      setIsSearchable(false);
      setCheckingPDF(false);
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
        .from('quran')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('quran')
        .getPublicUrl(filePath);

      // Upload cover image if selected
      let coverUrl = null;
      if (selectedCover) {
        const coverExt = selectedCover.name.split('.').pop();
        const coverFileName = `covers/${Date.now()}-${Math.random().toString(36).substring(7)}.${coverExt}`;
        
        const { error: coverUploadError } = await supabase.storage
          .from('quran')
          .upload(coverFileName, selectedCover);
        
        if (!coverUploadError) {
          const { data: coverUrlData } = supabase.storage
            .from('quran')
            .getPublicUrl(coverFileName);
          coverUrl = coverUrlData.publicUrl;
        }
      }

      const { error: dbError } = await supabase
        .from('quran_uploads')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          language,
          file_path: filePath,
          file_url: urlData.publicUrl,
          file_size: selectedFile.size,
          cover_url: coverUrl,
          total_pages: totalPages ? parseInt(totalPages) : null,
          is_searchable: isSearchable || false,
          uploaded_by: user.id,
        });

      if (dbError) throw dbError;

      toast.success('Quran uploaded successfully!');
      
      // Send push notification to all students
      const langLabel = LANGUAGES.find(l => l.value === language)?.label || language;
      notifyNewQuran(title.trim(), langLabel);
      
      resetForm();
      setDialogOpen(false);
      fetchQuranList();
    } catch (error) {
      console.error('Error uploading Quran:', error);
      toast.error('Failed to upload Quran');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (quran: QuranUpload) => {
    if (!confirm(`Are you sure you want to delete "${quran.title}"?`)) return;

    try {
      const { error: storageError } = await supabase.storage
        .from('quran')
        .remove([quran.file_path]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
      }

      const { error: dbError } = await supabase
        .from('quran_uploads')
        .delete()
        .eq('id', quran.id);

      if (dbError) throw dbError;

      toast.success('Quran deleted successfully');
      fetchQuranList();
    } catch (error) {
      console.error('Error deleting Quran:', error);
      toast.error('Failed to delete Quran');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLanguage('arabic');
    setTotalPages('');
    setSelectedFile(null);
    setSelectedCover(null);
    setCoverPreview(null);
    setIsSearchable(null);
  };

  const filteredQuranList = filterLanguage === 'all' 
    ? quranList 
    : quranList.filter(q => q.language === filterLanguage);

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
      case 'arabic':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
      case 'urdu':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'english':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-700';
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
    <>
      <Helmet>
        <title>Quran Management - Admin Panel</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-4 sm:py-6 px-3 sm:px-4">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              {/* Left side */}
              <div className="flex items-center gap-2 sm:gap-4">
                <AdminMobileNav />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/admin')}
                  className="text-white hover:bg-white/20 h-9 w-9 shrink-0 hidden md:flex"
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
                    <span className="truncate">Quran Management</span>
                  </h1>
                  <p className="text-emerald-100 text-xs sm:text-sm">Upload & manage Quran PDFs</p>
                </div>
              </div>

              {/* Right side - Upload button */}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-white text-emerald-700 hover:bg-emerald-50 text-xs sm:text-sm">
                    <Plus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Upload Quran</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Upload Quran PDF
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Al-Quran with Urdu Translation"
                      />
                    </div>

                    <div>
                      <Label htmlFor="language">Language / Type *</Label>
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
                        placeholder="Enter description (optional)"
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
                      <Label htmlFor="file">PDF File * (Max 100MB)</Label>
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                      {selectedFile && (
                        <div className="mt-2 space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                          </p>
                          
                          {/* Searchability indicator */}
                          {checkingPDF ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Checking if PDF is searchable...
                            </div>
                          ) : isSearchable !== null && (
                            <div className={`flex items-center gap-2 text-sm ${isSearchable ? 'text-green-600' : 'text-amber-600'}`}>
                              {isSearchable ? (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  PDF is searchable (text-based)
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-4 w-4" />
                                  PDF may not be searchable (image-based)
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleUpload}
                      disabled={uploading || !selectedFile || !title.trim()}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Quran
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
              {filteredQuranList.length} file{filteredQuranList.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="container mx-auto px-3 sm:px-4 pb-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
            </div>
          ) : filteredQuranList.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">No Quran uploads yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Start by uploading the Holy Quran
                </p>
                <Button onClick={() => setDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Quran
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredQuranList.map((quran) => (
                <Card key={quran.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-32 sm:h-40 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center relative">
                    {quran.cover_url ? (
                      <img 
                        src={quran.cover_url} 
                        alt={quran.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-white/80">
                        <BookOpen className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm font-arabic">القرآن الكریم</p>
                      </div>
                    )}
                    
                    {/* Searchable badge */}
                    <div className="absolute top-2 right-2">
                      {quran.is_searchable ? (
                        <Badge className="bg-green-500 text-white text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Searchable
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <XCircle className="h-3 w-3 mr-1" />
                          Non-Searchable
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 flex-1">
                        {quran.title}
                      </h3>
                      <Badge className={getLanguageColor(quran.language)}>
                        {getLanguageLabel(quran.language)}
                      </Badge>
                    </div>

                    {quran.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                        {quran.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>{quran.total_pages || '?'} pages</span>
                      </div>
                      <span>{formatFileSize(quran.file_size)}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setViewingQuran(quran)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(quran)}
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

export default QuranManagement;
