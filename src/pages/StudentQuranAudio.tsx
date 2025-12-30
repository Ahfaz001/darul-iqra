import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Search, 
  Play, 
  Music, 
  Clock, 
  User,
  Download,
  Loader2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AudioPlayer from '@/components/AudioPlayer';
import StudentLayout from '@/components/StudentLayout';

interface QuranAudio {
  id: string;
  title: string;
  description: string | null;
  surah_number: number | null;
  reciter: string | null;
  language: string;
  file_url: string;
  file_size: number | null;
  duration_seconds: number | null;
  cover_url: string | null;
  created_at: string;
}

const LANGUAGES = [
  { value: 'all', label: 'All Languages', labelNative: 'All' },
  { value: 'arabic', label: 'Arabic', labelNative: 'العربية' },
  { value: 'urdu', label: 'Urdu', labelNative: 'اردو' },
  { value: 'arabic-urdu', label: 'Arabic/Urdu Both', labelNative: 'عربی/اردو دونوں' },
  { value: 'english', label: 'English', labelNative: 'English' },
  { value: 'hindi', label: 'Hindi', labelNative: 'हिंदी' },
];

const StudentQuranAudio: React.FC = () => {
  const [audioList, setAudioList] = useState<QuranAudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [currentAudio, setCurrentAudio] = useState<QuranAudio | null>(null);

  useEffect(() => {
    fetchAudioList();
  }, []);

  const fetchAudioList = async () => {
    try {
      const { data, error } = await supabase
        .from('quran_audio')
        .select('*')
        .order('surah_number', { ascending: true, nullsFirst: false })
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

  const filteredAudioList = audioList.filter(audio => {
    const matchesSearch = audio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (audio.reciter?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (audio.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLanguage = filterLanguage === 'all' || audio.language === filterLanguage;
    return matchesSearch && matchesLanguage;
  });

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
      case 'arabic-urdu': return 'bg-teal-500/10 text-teal-600 border-teal-200';
      case 'english': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'hindi': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const handleDownload = async (audio: QuranAudio) => {
    try {
      const response = await fetch(audio.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${audio.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Download started');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download audio');
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
    <StudentLayout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Music className="h-10 w-10" />
              <h1 className="text-3xl md:text-4xl font-bold">Quran With Translation</h1>
            </div>
            <p className="text-lg opacity-90 mb-6">
              Listen to Quran recitation with translation audio
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                <Input
                  placeholder="Search by title, reciter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                <SelectTrigger className="w-full sm:w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Filter by language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label} {lang.labelNative !== lang.label && `(${lang.labelNative})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredAudioList.length === 0 ? (
            <div className="text-center py-20">
              <Music className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Audio Found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterLanguage !== 'all' 
                  ? 'Try adjusting your search or filter' 
                  : 'No audio has been uploaded yet'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAudioList.map((audio) => (
                <Card 
                  key={audio.id} 
                  className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
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
                    {audio.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {audio.description}
                      </p>
                    )}
                    
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
                        onClick={() => setCurrentAudio(audio)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </Button>
                      <Button 
                        variant="outline"
                        size="icon"
                        onClick={() => handleDownload(audio)}
                        title="Download for offline"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentQuranAudio;
