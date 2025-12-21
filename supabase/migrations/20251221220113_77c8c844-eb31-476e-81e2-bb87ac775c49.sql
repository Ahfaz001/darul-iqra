-- Add policy for teachers and admins to update exam submissions (for grading)
CREATE POLICY "Teachers and admins can update submissions for grading" 
ON public.exam_submissions 
FOR UPDATE 
USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));