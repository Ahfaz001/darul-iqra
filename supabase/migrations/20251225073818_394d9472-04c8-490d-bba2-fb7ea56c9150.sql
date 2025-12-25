-- Add email column to admissions table
ALTER TABLE public.admissions ADD COLUMN email text;

-- Add index for email lookups
CREATE INDEX idx_admissions_email ON public.admissions(email);