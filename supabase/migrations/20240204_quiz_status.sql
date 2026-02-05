-- Add status column to quizzes
ALTER TABLE public.quizzes 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));

-- Update existing records to 'published' to maintain current behavior (or 'draft' if preferred, but existing quizzes are likely active)
UPDATE public.quizzes SET status = 'published' WHERE status IS NULL;
