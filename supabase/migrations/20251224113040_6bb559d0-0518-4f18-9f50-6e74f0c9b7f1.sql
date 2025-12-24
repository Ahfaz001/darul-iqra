-- Create book_pages table for storing OCR extracted text per page
CREATE TABLE public.book_pages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  page_number integer NOT NULL,
  text_content text NOT NULL DEFAULT '',
  normalized_text text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(book_id, page_number)
);

-- Enable RLS
ALTER TABLE public.book_pages ENABLE ROW LEVEL SECURITY;

-- Anyone can view book pages (since books are public)
CREATE POLICY "Anyone can view book pages" 
  ON public.book_pages 
  FOR SELECT 
  USING (true);

-- Admins can insert/update/delete book pages
CREATE POLICY "Admins can insert book pages" 
  ON public.book_pages 
  FOR INSERT 
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update book pages" 
  ON public.book_pages 
  FOR UPDATE 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete book pages" 
  ON public.book_pages 
  FOR DELETE 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add index for fast search
CREATE INDEX idx_book_pages_book_id ON public.book_pages(book_id);
CREATE INDEX idx_book_pages_normalized_text ON public.book_pages USING gin(to_tsvector('simple', normalized_text));

-- Add ocr_status column to books table to track OCR progress
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS ocr_status text DEFAULT 'pending';
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS ocr_pages_done integer DEFAULT 0;

-- Trigger to update updated_at
CREATE TRIGGER update_book_pages_updated_at
  BEFORE UPDATE ON public.book_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();