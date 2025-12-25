-- Create admissions table for storing admission form submissions
CREATE TABLE public.admissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  husband_name TEXT,
  age INTEGER NOT NULL,
  mobile_number TEXT NOT NULL,
  whatsapp_number TEXT,
  education_medium TEXT NOT NULL,
  declaration_agreed BOOLEAN NOT NULL DEFAULT false,
  submission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

-- Public can submit admissions (INSERT only)
CREATE POLICY "Anyone can submit admission form"
ON public.admissions
FOR INSERT
WITH CHECK (true);

-- Only admins can view all admissions
CREATE POLICY "Admins can view all admissions"
ON public.admissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update admissions
CREATE POLICY "Admins can update admissions"
ON public.admissions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete admissions
CREATE POLICY "Admins can delete admissions"
ON public.admissions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_admissions_updated_at
BEFORE UPDATE ON public.admissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();