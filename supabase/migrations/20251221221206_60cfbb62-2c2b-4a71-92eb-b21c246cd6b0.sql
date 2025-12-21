-- Add unique constraint for student_id and date combination for upsert
ALTER TABLE public.attendance 
ADD CONSTRAINT attendance_student_date_unique UNIQUE (student_id, date);