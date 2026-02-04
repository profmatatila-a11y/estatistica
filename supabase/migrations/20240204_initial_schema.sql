-- Create tables for Native Quiz Feature

-- Quizzes Table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT,
    target_class TEXT, -- Optional: to assign to specific class
    is_active BOOLEAN DEFAULT true
);

-- Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    text TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('multiple_choice', 'text')),
    points NUMERIC DEFAULT 1,
    options JSONB, -- For multiple choice: [{ label: "A", text: "...", isCorrect: true }]
    correct_answer TEXT -- For text questions or simple validation
);

-- Student Attempts Table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    student_email TEXT NOT NULL, -- Identifying student by email for now
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    score NUMERIC,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed'))
);

-- Answers Table (for storing student responses)
CREATE TABLE IF NOT EXISTS public.quiz_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    attempt_id UUID REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    is_correct BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (policies can be refined later, creating basic open access for now for simplicity as Auth is not fully strict yet)
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

-- Policies (Permissive for development/MVP, identifying 'admin' logic via email would be next step)
-- Ideally, reads should be public for students taking quizzes? Or restricted?
-- For now: Public read for quizzes.
CREATE POLICY "Enable read access for all users" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Enable insert for teachers" ON public.quizzes FOR INSERT WITH CHECK (true); -- TODO: restrict

CREATE POLICY "Enable read access for all users" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Enable insert for teachers" ON public.questions FOR INSERT WITH CHECK (true);

-- Attempts: Students can insert their own attempts (via email match arguably, but app-side logic for now)
CREATE POLICY "Enable insert for all" ON public.quiz_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON public.quiz_attempts FOR UPDATE USING (true);
CREATE POLICY "Enable read for all" ON public.quiz_attempts FOR SELECT USING (true);

CREATE POLICY "Enable insert for all" ON public.quiz_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for all" ON public.quiz_answers FOR SELECT USING (true);
