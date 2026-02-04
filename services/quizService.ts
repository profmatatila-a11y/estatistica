
import { supabase } from './supabase';
import { Quiz, Question, QuizAttempt } from '../types';

export const quizService = {
    // Generic Methods
    async uploadImage(file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `quiz_images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('quiz-assets')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('quiz-assets')
            .getPublicUrl(filePath);

        return data.publicUrl;
    },

    // Teacher Methods
    async getAllQuizzes() {
        const { data, error } = await supabase
            .from('quizzes')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data as Quiz[];
    },

    async deleteQuiz(quizId: string) {
        // Application-level Cascade Delete
        // 1. Delete all answers linked to attempts of this quiz
        // Note: Faster to let DB handle it, but this guarantees it works without "ON DELETE CASCADE"
        const { data: attempts } = await supabase.from('quiz_attempts').select('id').eq('quiz_id', quizId);

        if (attempts && attempts.length > 0) {
            const attemptIds = attempts.map(a => a.id);
            await supabase.from('quiz_answers').delete().in('attempt_id', attemptIds);
            await supabase.from('quiz_attempts').delete().eq('quiz_id', quizId);
        }

        // 2. Delete all questions
        await supabase.from('questions').delete().eq('quiz_id', quizId);

        // 3. Delete the quiz itself
        const { error } = await supabase
            .from('quizzes')
            .delete()
            .eq('id', quizId);
        if (error) throw error;
    },

    async updateQuiz(quizId: string, updates: Partial<Quiz>) {
        const { error } = await supabase
            .from('quizzes')
            .update(updates)
            .eq('id', quizId);
        if (error) throw error;
    },

    async updateQuestion(questionId: string, updates: Partial<Question>) {
        const { error } = await supabase
            .from('questions')
            .update(updates)
            .eq('id', questionId);
        if (error) throw error;
    },

    async deleteQuestion(questionId: string) {
        const { error } = await supabase
            .from('questions')
            .delete()
            .eq('id', questionId);
        if (error) throw error;
    },

    async createQuiz(quiz: Omit<Quiz, 'id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('quizzes')
            .insert(quiz)
            .select()
            .single();
        if (error) throw error;
        return data as Quiz;
    },

    async addQuestion(question: Omit<Question, 'id'>) {
        const { data, error } = await supabase
            .from('questions')
            .insert(question)
            .select()
            .single();
        if (error) throw error;
        return data as Question;
    },

    async getQuizzesByClass(className?: string) {
        let query = supabase.from('quizzes').select('*').eq('is_active', true);
        if (className) {
            query = query.eq('target_class', className);
        }
        const { data, error } = await query;
        if (error) throw error;
        return data as Quiz[];
    },

    async getQuizDetails(quizId: string) {
        const { data: quiz, error: quizError } = await supabase
            .from('quizzes')
            .select('*')
            .eq('id', quizId)
            .single();

        if (quizError) throw quizError;

        const { data: questions, error: qError } = await supabase
            .from('questions')
            .select('*')
            .eq('quiz_id', quizId);

        if (qError) throw qError;

        return { quiz, questions: questions as Question[] };
    },

    // Student Methods
    async startAttempt(quizId: string, studentEmail: string, studentName: string) {
        const { data, error } = await supabase
            .from('quiz_attempts')
            .insert({
                quiz_id: quizId,
                student_email: studentEmail,
                student_name: studentName,
                start_time: new Date().toISOString(),
                status: 'in_progress'
            })
            .select()
            .single();
        if (error) throw error;
        return data as QuizAttempt;
    },

    async submitAnswer(attemptId: string, questionId: string, answerText: string, isCorrect: boolean) {
        const { error } = await supabase
            .from('quiz_answers')
            .insert({
                attempt_id: attemptId,
                question_id: questionId,
                answer_text: answerText,
                is_correct: isCorrect
            });
        if (error) throw error;
    },

    async finishAttempt(attemptId: string, score: number) {
        const { error } = await supabase
            .from('quiz_attempts')
            .update({
                end_time: new Date().toISOString(),
                status: 'completed',
                score: score
            })
            .eq('id', attemptId);
        if (error) throw error;
    },
    async getQuizAttempts(quizId: string) {
        const { data, error } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('quiz_id', quizId)
            .order('start_time', { ascending: false });
        if (error) throw error;
        return data as QuizAttempt[];
    },
    async getAttemptDetails(attemptId: string) {
        const { data: attempt, error: attemptError } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('id', attemptId)
            .single();

        if (attemptError) throw attemptError;

        const { data: answers, error: answersError } = await supabase
            .from('quiz_answers')
            .select('*')
            .eq('attempt_id', attemptId);

        if (answersError) throw answersError;

        return { attempt, answers: answers || [] };
    },
};
