import React, { useEffect, useState } from 'react';
import { quizService } from '../../services/quizService';
import { QuizAttempt, Quiz, Question } from '../../types';

interface QuizResultsProps {
    quizId: string;
    onBack: () => void;
}

export function QuizResults({ quizId, onBack }: QuizResultsProps) {
    const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);
    const [attemptAnswers, setAttemptAnswers] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, [quizId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [attemptsData, quizDetails] = await Promise.all([
                quizService.getQuizAttempts(quizId),
                quizService.getQuizDetails(quizId)
            ]);
            const sortedAttempts = attemptsData.sort((a, b) =>
                (a.student_name || '').localeCompare(b.student_name || '')
            );
            setAttempts(sortedAttempts);
            setQuiz(quizDetails.quiz as Quiz);
            setQuestions(quizDetails.questions);
        } catch (error) {
            console.error(error);
            alert('Erro ao carregar resultados.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (attempt: QuizAttempt) => {
        try {
            const { answers } = await quizService.getAttemptDetails(attempt.id);
            setSelectedAttempt(attempt);
            setAttemptAnswers(answers);
        } catch (error) {
            alert('Erro ao carregar respostas.');
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Carregando resultados...</div>;

    return (
        <div className="p-6 w-full max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Resultados: {quiz?.title}</h1>
                    <p className="text-slate-500">
                        {attempts.length} {attempts.length === 1 ? 'tentativa' : 'tentativas'} registradas
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aluno</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data / Hora</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nota</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Detalhes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {attempts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                        Nenhum aluno realizou este quiz ainda.
                                    </td>
                                </tr>
                            ) : (
                                attempts.map((attempt) => (
                                    <tr key={attempt.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800">{attempt.student_name || 'Aluno'}</div>
                                            <div className="text-xs text-slate-500">{attempt.student_email}</div>
                                        </td>
                                        <td className="p-4 text-slate-600 text-sm">
                                            {new Date(attempt.start_time).toLocaleString('pt-BR')}
                                        </td>
                                        <td className="p-4 font-bold text-slate-800">
                                            {attempt.score !== undefined ? attempt.score : '-'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${attempt.status === 'completed'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {attempt.status === 'completed' ? 'Concluído' : 'Em Andamento'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleViewDetails(attempt)}
                                                className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                                title="Ver Respostas"
                                            >
                                                <span className="material-symbols-outlined text-xl">visibility</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Detalhes */}
            {selectedAttempt && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Detalhes da Tentativa</h2>
                                <p className="text-slate-500 text-sm">
                                    Aluno: <span className="font-semibold text-slate-700">{selectedAttempt.student_name}</span> •
                                    Nota: <span className="font-bold text-primary">{selectedAttempt.score}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedAttempt(null)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <div className="flex flex-col gap-6">
                                {questions.map((q, index) => {
                                    const answer = attemptAnswers.find(a => a.question_id === q.id);
                                    const studentAnswerText = answer?.answer_text || '(Sem resposta)';

                                    // Determine correctness logic (simplified)
                                    let isCorrect = false;
                                    let correctAnswerText = '';

                                    if (q.type === 'multiple_choice' && q.options) {
                                        const correctOpt = q.options.find((o: any) => o.isCorrect);
                                        correctAnswerText = correctOpt?.text || '';

                                        // Check exact match (text)
                                        if (studentAnswerText === correctAnswerText) {
                                            isCorrect = true;
                                        }
                                        // Check if answer is a letter (A, B, C...) matching the correct index
                                        else if (/^[A-E]$/i.test(studentAnswerText)) {
                                            const letterIndex = studentAnswerText.toUpperCase().charCodeAt(0) - 65; // A=0, B=1...
                                            if (q.options[letterIndex] && q.options[letterIndex].isCorrect) {
                                                isCorrect = true;
                                            }
                                        }
                                    } else {
                                        correctAnswerText = q.correct_answer || '';
                                        isCorrect = studentAnswerText.toLowerCase().trim() === correctAnswerText.toLowerCase().trim();
                                    }

                                    return (
                                        <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                                            <div className="flex gap-3 mb-3">
                                                <span className="bg-slate-200 text-slate-600 font-bold text-xs h-6 px-2 flex items-center justify-center rounded">
                                                    #{index + 1}
                                                </span>
                                                <p className="font-medium text-slate-800" dangerouslySetInnerHTML={{ __html: q.text }} />
                                            </div>

                                            <div className="pl-9 flex flex-col gap-2">
                                                <div className={`p-3 rounded-lg border text-sm ${isCorrect
                                                    ? 'bg-green-50 border-green-200 text-green-800'
                                                    : 'bg-red-50 border-red-200 text-red-800'
                                                    }`}>
                                                    <span className="font-bold block text-xs uppercase opacity-70 mb-1">Resposta do Aluno:</span>
                                                    {studentAnswerText}
                                                </div>

                                                {!isCorrect && (
                                                    <div className="p-3 rounded-lg border bg-blue-50 border-blue-200 text-blue-800 text-sm">
                                                        <span className="font-bold block text-xs uppercase opacity-70 mb-1">Resposta Correta:</span>
                                                        {correctAnswerText}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button
                                onClick={() => setSelectedAttempt(null)}
                                className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
