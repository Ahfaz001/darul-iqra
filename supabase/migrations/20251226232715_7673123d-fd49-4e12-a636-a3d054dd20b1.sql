-- Create quran_uploads table
CREATE TABLE public.quran_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  total_pages INTEGER,
  cover_url TEXT,
  language TEXT NOT NULL DEFAULT 'arabic',
  is_searchable BOOLEAN DEFAULT false,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create quran_pages table for searchable content
CREATE TABLE public.quran_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quran_id UUID NOT NULL REFERENCES public.quran_uploads(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  text_content TEXT NOT NULL DEFAULT '',
  surah_numbers TEXT[],
  ayat_range TEXT,
  para_number INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(quran_id, page_number)
);

-- Enable RLS
ALTER TABLE public.quran_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quran_pages ENABLE ROW LEVEL SECURITY;

-- RLS policies for quran_uploads
CREATE POLICY "Anyone can view quran uploads"
ON public.quran_uploads FOR SELECT
USING (true);

CREATE POLICY "Admins can insert quran uploads"
ON public.quran_uploads FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update quran uploads"
ON public.quran_uploads FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete quran uploads"
ON public.quran_uploads FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for quran_pages
CREATE POLICY "Anyone can view quran pages"
ON public.quran_pages FOR SELECT
USING (true);

CREATE POLICY "Admins can insert quran pages"
ON public.quran_pages FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update quran pages"
ON public.quran_pages FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete quran pages"
ON public.quran_pages FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger for quran_uploads
CREATE TRIGGER update_quran_uploads_updated_at
BEFORE UPDATE ON public.quran_uploads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for quran files (100MB max)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('quran', 'quran', true, 104857600);

-- Storage policies for quran bucket
CREATE POLICY "Anyone can view quran files"
ON storage.objects FOR SELECT
USING (bucket_id = 'quran');

CREATE POLICY "Admins can upload quran files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'quran' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update quran files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'quran' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete quran files"
ON storage.objects FOR DELETE
USING (bucket_id = 'quran' AND has_role(auth.uid(), 'admin'::app_role));