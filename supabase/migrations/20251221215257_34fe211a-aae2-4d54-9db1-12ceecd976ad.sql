-- Add is_published column to exam_results
ALTER TABLE public.exam_results 
ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false;