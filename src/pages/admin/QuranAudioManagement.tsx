import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Plus, 
  Trash2, 
  Music, 
  Upload, 
  Loader2, 
  ArrowLeft,
  Play,
  Clock,
  User
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import AudioPlayer from '@/components/AudioPlayer';
import madrasaLogo from '@/assets/madrasa-logo.jpg';

interface QuranAudio {
  id: string;
  title: string;
  description: string | null;
  surah_number: number | null;
  reciter: string | null;
  language: string;
  file_path: string;
  file_url: string;
  file_size: number | null;
  duration_seconds: number | null;
  cover_url: string | null;
  created_at: string;
}

const LANGUAGES = [
  { value: 'arabic', label: 'Arabic', labelNative: 'العربية' },
  { value: 'urdu', label: 'Urdu', labelNative: 'اردو' },
  { value: 'english', label: 'English', labelNative: 'English' },
  { value: 'hindi', label: 'Hindi', labelNative: 'हिंदी' },
];

const QuranAudioManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [audioList, setAudioList] = useState<QuranAudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [currentAudio, setCurrentAudio] = useState<QuranAudio | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [surahNumber, setSurahNumber] = useState('');
  const [reciter, setReciter] = useState('');
  const [language, setLanguage] = useState('arabic');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    fetchAudioList();
  }, []);

  const fetchAudioList = async () => {
    try {
      const { data, error } = await supabase
        .from('quran_audio')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAudioList(data || []);
    } catch (error) {
      console.error('Error fetching audio list:', error);
      toast.error('Failed to load audio list');
    } finally {
      setLoading(false);
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast.error('Please select a valid audio file');
        return;
      }
      setAudioFile(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      setCoverFile(file);
    }
  };

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        resolve(Math.round(audio.duration));
      };
      audio.onerror = () => {
        resolve(0);
      };
      audio.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async () => {
    if (!title.trim() || !audioFile || !user) {
      toast.error('Please fill in the title and select an audio file');
      return;
    }

    setUploading(true);
    try {
      // Get audio duration
      const duration = await getAudioDuration(audioFile);

      // Upload audio file
      const audioFileName = `${Date.now()}_${audioFile.name.replace(/\s+/g, '_')}`;
      const { error: audioError } = await supabase.storage
        .from('quran-audio')
        .upload(audioFileName, audioFile);

      if (audioError) throw audioError;

      const { data: audioUrlData } = supabase.storage
        .from('quran-audio')
        .getPublicUrl(audioFileName);

      // Upload cover image if provided
      let coverUrl = null;
      if (coverFile) {
        const coverFileName = `covers/${Date.now()}_${coverFile.name.replace(/\s+/g, '_')}`;
        const { error: coverError } = await supabase.storage
          .from('quran-audio')
          .upload(coverFileName, coverFile);

        if (!coverError) {
          const { data: coverUrlData } = supabase.storage
            .from('quran-audio')
            .getPublicUrl(coverFileName);
          coverUrl = coverUrlData.publicUrl;
        }
      }

      // Save to database
      const { error: dbError } = await supabase
        .from('quran_audio')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          surah_number: surahNumber ? parseInt(surahNumber) : null,
          reciter: reciter.trim() || null,
          language,
          file_path: audioFileName,
          file_url: audioUrlData.publicUrl,
          file_size: audioFile.size,
          duration_seconds: duration || null,
          cover_url: coverUrl,
          uploaded_by: user.id,
        });

      if (dbError) throw dbError;

      toast.success('Audio uploaded successfully');
      resetForm();
      setDialogOpen(false);
      fetchAudioList();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload audio');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (audio: QuranAudio) => {
    try {
      // Delete from storage
      await supabase.storage
        .from('quran-audio')
        .remove([audio.file_path]);

      // Delete from database
      const { error } = await supabase
        .from('quran_audio')
        .delete()
        .eq('id', audio.id);

      if (error) throw error;

      toast.success('Audio deleted successfully');
      fetchAudioList();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete audio');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSurahNumber('');
    setReciter('');
    setLanguage('arabic');
    setAudioFile(null);
    setCoverFile(null);
  };

  const filteredAudioList = filterLanguage === 'all' 
    ? audioList 
    : audioList.filter(a => a.language === filterLanguage);

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getLanguageLabel = (lang: string) => {
    const language = LANGUAGES.find(l => l.value === lang);
    return language ? language.labelNative : lang;
  };

  const getLanguageColor = (lang: string) => {
    switch (lang) {
      case 'arabic': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'urdu': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'english': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'hindi': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  if (currentAudio) {
    return (
      <AudioPlayer
        audioUrl={currentAudio.file_url}
        title={currentAudio.title}
        reciter={currentAudio.reciter || undefined}
        coverUrl={currentAudio.cover_url || undefined}
        onClose={() => setCurrentAudio(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <img src={madrasaLogo} alt="Logo" className="h-12 w-12 rounded-full" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Music className="h-7 w-7 text-emerald-600" />
                Quran Audio Management
              </h1>
              <p className="text-muted-foreground">Upload and manage Quran with translation audio</p>
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Upload Audio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload Quran Audio</DialogTitle>
                <DialogDescription>
                  Upload MP3 audio file with Quran translation
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Surah Al-Fatiha with Urdu Translation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label} ({lang.labelNative})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="surah">Surah Number</Label>
                    <Input
                      id="surah"
                      type="number"
                      min="1"
                      max="114"
                      value={surahNumber}
                      onChange={(e) => setSurahNumber(e.target.value)}
                      placeholder="1-114"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reciter">Reciter</Label>
                    <Input
                      id="reciter"
                      value={reciter}
                      onChange={(e) => setReciter(e.target.value)}
                      placeholder="Reciter name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover">Cover Image (Optional)</Label>
                  <Input
                    id="cover"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                  />
                  {coverFile && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {coverFile.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audio">Audio File (MP3) *</Label>
                  <Input
                    id="audio"
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioChange}
                  />
                  {audioFile && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {audioFile.name} ({formatFileSize(audioFile.size)})
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={uploading || !title.trim() || !audioFile}
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
                      Upload Audio
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <Select value={filterLanguage} onValueChange={setFilterLanguage}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {LANGUAGES.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label} ({lang.labelNative})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Audio List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredAudioList.length === 0 ? (
          <div className="text-center py-20">
            <Music className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Audio Uploaded</h3>
            <p className="text-muted-foreground mb-4">
              Start by uploading your first Quran audio
            </p>
            <Button 
              onClick={() => setDialogOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Audio
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAudioList.map((audio) => (
              <Card key={audio.id} className="group hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{audio.title}</CardTitle>
                      {audio.reciter && (
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <User className="h-3 w-3" />
                          {audio.reciter}
                        </CardDescription>
                      )}
                    </div>
                    <Badge className={getLanguageColor(audio.language)}>
                      {getLanguageLabel(audio.language)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {audio.duration_seconds && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(audio.duration_seconds)}
                      </span>
                    )}
                    {audio.file_size && (
                      <span>{formatFileSize(audio.file_size)}</span>
                    )}
                    {audio.surah_number && (
                      <span>Surah {audio.surah_number}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentAudio(audio)}
                      className="flex-1"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Play
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Audio?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{audio.title}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(audio)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuranAudioManagement;
