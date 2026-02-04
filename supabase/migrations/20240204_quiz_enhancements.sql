-- Add custom header text to quizzes (the "dizeres")
ALTER TABLE public.quizzes 
ADD COLUMN IF NOT EXISTS custom_header TEXT;

-- Add image URL to questions
ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Verify policies to ensure these new columns are accessible
-- (Existing policies are SELECT using true, so they should cover this, 
-- but explicit grants might be needed if RLS was stricter)
