-- Add columns to exam_submissions for storing answer grading
ALTER TABLE public.exam_submissions 
ADD COLUMN IF NOT EXISTS answer_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS marks_awarded integer DEFAULT 0;

-- Add constraint for valid status values
ALTER TABLE public.exam_submissions 
ADD CONSTRAINT valid_answer_status CHECK (answer_status IN ('pending', 'correct', 'wrong'));