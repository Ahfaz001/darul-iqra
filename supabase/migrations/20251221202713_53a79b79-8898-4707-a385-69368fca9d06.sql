-- Create table for exam questions with multi-language support
CREATE TABLE public.exam_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text_ur TEXT NOT NULL,
  question_text_en TEXT,
  question_text_roman TEXT,
  marks INTEGER NOT NULL DEFAULT 1,
  question_type TEXT NOT NULL DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for exam assignments (which users can take which exams)
CREATE TABLE public.exam_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  UNIQUE(exam_id, student_id)
);

-- Create table for exam submissions (student answers)
CREATE TABLE public.exam_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  question_id UUID NOT NULL REFERENCES public.exam_questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(exam_id, student_id, question_id)
);

-- Add duration and language columns to exams table
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60;
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS original_content TEXT;
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS is_translated BOOLEAN DEFAULT false;

-- Enable RLS on new tables
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for exam_questions
CREATE POLICY "Anyone authenticated can view exam questions"
ON public.exam_questions FOR SELECT
USING (true);

CREATE POLICY "Teachers and admins can create questions"
ON public.exam_questions FOR INSERT
WITH CHECK (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Teachers and admins can update questions"
ON public.exam_questions FOR UPDATE
USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete questions"
ON public.exam_questions FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for exam_assignments
CREATE POLICY "Students can view their own assignments"
ON public.exam_assignments FOR SELECT
USING (student_id = auth.uid());

CREATE POLICY "Teachers and admins can view all assignments"
ON public.exam_assignments FOR SELECT
USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Teachers and admins can create assignments"
ON public.exam_assignments FOR INSERT
WITH CHECK (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Teachers and admins can update assignments"
ON public.exam_assignments FOR UPDATE
USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete assignments"
ON public.exam_assignments FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for exam_submissions
CREATE POLICY "Students can view their own submissions"
ON public.exam_submissions FOR SELECT
USING (student_id = auth.uid());

CREATE POLICY "Students can create their own submissions"
ON public.exam_submissions FOR INSERT
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own submissions"
ON public.exam_submissions FOR UPDATE
USING (student_id = auth.uid());

CREATE POLICY "Teachers and admins can view all submissions"
ON public.exam_submissions FOR SELECT
USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_exam_questions_updated_at
BEFORE UPDATE ON public.exam_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for exam assignments
ALTER PUBLICATION supabase_realtime ADD TABLE public.exam_assignments;