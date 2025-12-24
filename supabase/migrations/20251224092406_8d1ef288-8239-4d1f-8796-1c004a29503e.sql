-- Create books table
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  language TEXT NOT NULL DEFAULT 'urdu',
  description TEXT,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  cover_url TEXT,
  total_pages INTEGER,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Anyone can view books
CREATE POLICY "Anyone can view books" 
ON public.books 
FOR SELECT 
USING (true);

-- Admins can insert books
CREATE POLICY "Admins can insert books" 
ON public.books 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update books
CREATE POLICY "Admins can update books" 
ON public.books 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete books
CREATE POLICY "Admins can delete books" 
ON public.books 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for books
INSERT INTO storage.buckets (id, name, public) VALUES ('books', 'books', true);

-- Storage policies for books bucket
CREATE POLICY "Anyone can view book files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'books');

CREATE POLICY "Admins can upload book files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'books' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update book files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'books' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete book files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'books' AND has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON public.books
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();