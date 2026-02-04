-- Enable DELETE for all tables (Development/MVP mode)
-- In production, this should be restricted to admin users

CREATE POLICY "Enable delete for all users" ON public.quizzes FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON public.questions FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON public.quiz_attempts FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON public.quiz_answers FOR DELETE USING (true);

-- Ensure Update policies exist too (missed in initial schema?)
-- Quizzes
CREATE POLICY "Enable update for all users" ON public.quizzes FOR UPDATE USING (true);
-- Questions
CREATE POLICY "Enable update for all users" ON public.questions FOR UPDATE USING (true);
