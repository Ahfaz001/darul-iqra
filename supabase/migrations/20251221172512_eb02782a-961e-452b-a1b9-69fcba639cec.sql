-- Create attendance status enum
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'excused');

-- Create exams table
CREATE TABLE public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  exam_date DATE NOT NULL,
  total_marks INTEGER NOT NULL DEFAULT 100,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exam results table
CREATE TABLE public.exam_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  marks_obtained INTEGER NOT NULL,
  grade TEXT,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(exam_id, student_id)
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status attendance_status NOT NULL DEFAULT 'present',
  marked_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Exams policies
CREATE POLICY "Anyone authenticated can view exams"
  ON public.exams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers and admins can create exams"
  ON public.exams FOR INSERT
  TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Teachers and admins can update exams"
  ON public.exams FOR UPDATE
  TO authenticated
  USING (
    has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete exams"
  ON public.exams FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Exam results policies
CREATE POLICY "Students can view their own results"
  ON public.exam_results FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers and admins can view all results"
  ON public.exam_results FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Teachers and admins can insert results"
  ON public.exam_results FOR INSERT
  TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Teachers and admins can update results"
  ON public.exam_results FOR UPDATE
  TO authenticated
  USING (
    has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete results"
  ON public.exam_results FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Attendance policies
CREATE POLICY "Students can view their own attendance"
  ON public.attendance FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers and admins can view all attendance"
  ON public.attendance FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Teachers and admins can mark attendance"
  ON public.attendance FOR INSERT
  TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Teachers and admins can update attendance"
  ON public.attendance FOR UPDATE
  TO authenticated
  USING (
    has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete attendance"
  ON public.attendance FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Add triggers for updated_at
CREATE TRIGGER update_exams_updated_at
  BEFORE UPDATE ON public.exams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exam_results_updated_at
  BEFORE UPDATE ON public.exam_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();