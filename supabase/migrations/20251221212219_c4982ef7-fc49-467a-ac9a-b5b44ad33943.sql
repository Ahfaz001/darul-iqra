-- Allow students to update their own exam assignments (for start_time, status, end_time)
CREATE POLICY "Students can update their own assignments" 
ON public.exam_assignments 
FOR UPDATE 
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- Add unique constraint for exam_results to support upsert properly
ALTER TABLE public.exam_results 
ADD CONSTRAINT exam_results_exam_student_unique UNIQUE (exam_id, student_id);