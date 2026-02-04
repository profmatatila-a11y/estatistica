-- Add student_name column to quiz_attempts
ALTER TABLE public.quiz_attempts 
ADD COLUMN IF NOT EXISTS student_name TEXT;

-- Refresh policies just in case (optional, but good practice if we changed schema drastically, mostly new column needs no policy change for Select *).
