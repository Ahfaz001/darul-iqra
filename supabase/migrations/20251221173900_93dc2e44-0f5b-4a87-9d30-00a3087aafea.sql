-- Create storage bucket for hadith books
INSERT INTO storage.buckets (id, name, public)
VALUES ('hadith-books', 'hadith-books', true);

-- Create hadith_books table
CREATE TABLE public.hadith_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  description TEXT,
  language TEXT NOT NULL DEFAULT 'english',
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hadith_books ENABLE ROW LEVEL SECURITY;

-- Everyone can view hadith books
CREATE POLICY "Anyone can view hadith books"
  ON public.hadith_books FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert books
CREATE POLICY "Admins can insert hadith books"
  ON public.hadith_books FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Only admins can update books
CREATE POLICY "Admins can update hadith books"
  ON public.hadith_books FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Only admins can delete books
CREATE POLICY "Admins can delete hadith books"
  ON public.hadith_books FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Storage policies for hadith-books bucket
CREATE POLICY "Anyone can view hadith book files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'hadith-books');

CREATE POLICY "Admins can upload hadith book files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'hadith-books' AND 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete hadith book files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'hadith-books' AND 
    public.has_role(auth.uid(), 'admin')
  );

-- Add trigger for updated_at
CREATE TRIGGER update_hadith_books_updated_at
  BEFORE UPDATE ON public.hadith_books
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();