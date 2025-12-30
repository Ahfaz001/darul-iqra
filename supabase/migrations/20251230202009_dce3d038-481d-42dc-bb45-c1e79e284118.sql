
-- Create table for Quran audio uploads
CREATE TABLE public.quran_audio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  surah_number INTEGER,
  reciter TEXT,
  language TEXT NOT NULL DEFAULT 'arabic',
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  duration_seconds INTEGER,
  cover_url TEXT,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quran_audio ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view quran audio" 
ON public.quran_audio 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert quran audio" 
ON public.quran_audio 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update quran audio" 
ON public.quran_audio 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete quran audio" 
ON public.quran_audio 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_quran_audio_updated_at
BEFORE UPDATE ON public.quran_audio
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for quran audio
INSERT INTO storage.buckets (id, name, public) 
VALUES ('quran-audio', 'quran-audio', true);

-- Storage policies for quran-audio bucket
CREATE POLICY "Anyone can view quran audio files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'quran-audio');

CREATE POLICY "Admins can upload quran audio files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'quran-audio' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update quran audio files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'quran-audio' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete quran audio files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'quran-audio' AND has_role(auth.uid(), 'admin'::app_role));
