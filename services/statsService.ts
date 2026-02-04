import { supabase } from './supabase';
import { Student, ClassStats, ListStats, QuestionStat, Quiz, QuizAttempt, Question } from '../types';

export const statsService = {
    async fetchAllStats(targetActivities: number = 5) {
        // 1. Fetch all necessary data
        const { data: quizzes, error: quizzesError } = await supabase
            .from('quizzes')
            .select('*');
        if (quizzesError) throw quizzesError;

        const { data: attempts, error: attemptsError } = await supabase
            .from('quiz_attempts')
            .select('*')
            .order('start_time', { ascending: true }); // Ordered by time for evolution
        if (attemptsError) throw attemptsError;

        // Fetch answers for detailed question analysis
        // Warning: This might be heavy if there are thousands of answers. 
        // For MVP with < 1000 attempts, it's fine.
        const { data: answers, error: answersError } = await supabase
            .from('quiz_answers')
            .select('*');
        if (answersError) throw answersError;

        const { data: questions, error: questionsError } = await supabase
            .from('questions')
            .select('*');
        if (questionsError) throw questionsError;

        return this.processData(quizzes || [], attempts || [], answers || [], questions || [], targetActivities);
    },

    processData(quizzes: Quiz[], attempts: QuizAttempt[], answers: any[], questions: Question[], targetActivities: number) {
        // Maps
        const classMap: Record<string, { totalScore: number; count: number; studentEmails: Set<string>; exercises: number }> = {};
        const studentMap: Record<string, { name: string; class: string; history: { month: string; score: number; listName?: string }[]; email: string }> = {};
        const listMap: Record<string, { totalScore: number; count: number }> = {};
        const timelineMap: Record<string, { total: number; count: number }> = {};
        const questionMap: Record<string, Record<string, Record<string, number>>> = {}; // quizId -> questionId -> answerText -> count

        // Helper to find quiz
        const getQuiz = (id: string) => quizzes.find(q => q.id === id);
        const getQuestion = (id: string) => questions.find(q => q.id === id);

        attempts.forEach(attempt => {
            const quiz = getQuiz(attempt.quiz_id);
            if (!quiz) return;

            const score = attempt.score || 0;
            const studentEmail = attempt.student_email;
            const studentName = attempt.student_name || studentEmail.split('@')[0];
            const className = quiz.target_class || 'Geral';
            const date = new Date(attempt.start_time).toLocaleDateString('pt-BR'); // DD/MM/YYYY

            // --- List Stats ---
            if (!listMap[quiz.title]) {
                listMap[quiz.title] = { totalScore: 0, count: 0 };
            }
            listMap[quiz.title].totalScore += score;
            listMap[quiz.title].count += 1;

            // --- Timeline ---
            if (!timelineMap[date]) timelineMap[date] = { total: 0, count: 0 };
            timelineMap[date].total += score;
            timelineMap[date].count += 1;

            // --- Class Stats ---
            if (!classMap[className]) {
                classMap[className] = { totalScore: 0, count: 0, studentEmails: new Set(), exercises: 0 };
            }
            classMap[className].totalScore += score;
            classMap[className].count += 1;
            classMap[className].studentEmails.add(studentEmail);
            classMap[className].exercises += 1;

            // --- Student Stats ---
            if (!studentMap[studentEmail]) {
                studentMap[studentEmail] = {
                    name: studentName,
                    class: className,
                    history: [],
                    email: studentEmail
                };
            }
            studentMap[studentEmail].history.push({
                month: date,
                score: score,
                listName: quiz.title
            });
        });

        // Loop Aggregates

        // 1. Evolution Data
        const evolutionData = Object.entries(timelineMap).map(([date, data]) => ({
            month: date,
            score: data.count > 0 ? Number(((data.total / data.count)).toFixed(1)) : 0,
            avg: data.count > 0 ? Number(((data.total / data.count)).toFixed(1)) : 0
        })).sort((a, b) => {
            const [d1, m1, y1] = a.month.split('/').map(Number);
            const [d2, m2, y2] = b.month.split('/').map(Number);
            return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
        });

        // 2. Class Stats
        const classStats: ClassStats[] = Object.entries(classMap).map(([name, data], idx) => ({
            id: String(idx + 1),
            name,
            period: 'Geral',
            studentCount: data.studentEmails.size,
            averageScore: data.count > 0 ? Number((data.totalScore / data.count).toFixed(1)) : 0,
            exercisesCount: data.exercises,
            progress: Math.min(100, (data.exercises / targetActivities) * 100)
        }));

        // 3. List Stats
        const listStats: ListStats[] = Object.entries(listMap).map(([name, data], idx) => ({
            id: String(idx + 1),
            name,
            averageScore: data.count > 0 ? Number((data.totalScore / data.count).toFixed(1)) : 0,
            submissionCount: data.count
        })).sort((a, b) => b.submissionCount - a.submissionCount);

        // 4. Students
        const students: Student[] = Object.entries(studentMap).map(([email, data], idx) => {
            const avg = data.history.length > 0 ? data.history.reduce((a, b) => a + b.score, 0) / data.history.length : 0;
            return {
                id: email, // Use email as ID for consistency
                name: data.name,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=f1f5f9&color=64748b&bold=true`,
                class: data.class,
                average: Number(avg.toFixed(1)),
                trend: 0,
                exercisesDone: data.history.length,
                completionRate: 100, // Placeholder
                recentDrop: 0,
                history: data.history
            };
        });

        // 5. Question Analysis
        // Need to process `answers`
        const questionStats: QuestionStat[] = [];
        // Group answers by Quiz -> Question
        const quizQuestionsMap: Record<string, Record<string, { text: string, answers: Record<string, number>, correct?: string }>> = {};

        answers.forEach(ans => {
            // Find attempt to get quiz_id if not in answer? 
            // answer table has attempt_id.
            const attempt = attempts.find(a => a.id === ans.attempt_id);
            if (!attempt) return;
            const quiz = getQuiz(attempt.quiz_id);
            if (!quiz) return;
            const question = getQuestion(ans.question_id);
            if (!question) return;

            const listName = quiz.title;
            const qTitle = question.text; // Text might be HTML

            if (!quizQuestionsMap[listName]) quizQuestionsMap[listName] = {};
            if (!quizQuestionsMap[listName][question.id]) {
                quizQuestionsMap[listName][question.id] = {
                    text: qTitle,
                    answers: {},
                    correct: question.type === 'multiple_choice'
                        ? question.options?.find((o: any) => o.isCorrect)?.text
                        : question.correct_answer
                };
            }

            const ansText = ans.answer_text || '(Em branco)';
            if (!quizQuestionsMap[listName][question.id].answers[ansText]) {
                quizQuestionsMap[listName][question.id].answers[ansText] = 0;
            }
            quizQuestionsMap[listName][question.id].answers[ansText]++;
        });

        // Transform to QuestionStat
        Object.entries(quizQuestionsMap).forEach(([listName, qMap]) => {
            Object.values(qMap).forEach((qData, idx) => {
                const totalAnswers = Object.values(qData.answers).reduce((a, b) => a + b, 0);
                const distribution = Object.entries(qData.answers).map(([answer, count]) => ({
                    answer,
                    count,
                    percentage: totalAnswers > 0 ? Number(((count / totalAnswers) * 100).toFixed(1)) : 0
                })).sort((a, b) => b.count - a.count);

                questionStats.push({
                    id: `${listName}-${idx}`,
                    title: qData.text,
                    listName: listName,
                    totalAnswers,
                    distribution,
                    mostCommonAnswer: distribution[0]?.answer || '',
                    suggestedCorrect: qData.correct
                });
            });
        });

        return { students, classStats, evolutionData, listStats, questionStats };
    }
};
