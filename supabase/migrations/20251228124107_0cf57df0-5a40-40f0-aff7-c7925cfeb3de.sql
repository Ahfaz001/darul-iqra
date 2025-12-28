-- Add session_token column for single device login
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS session_token TEXT,
ADD COLUMN IF NOT EXISTS session_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create index for faster session lookups
CREATE INDEX IF NOT EXISTS idx_profiles_session_token ON public.profiles(session_token);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);