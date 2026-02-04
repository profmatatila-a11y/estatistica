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
            setAttempts(attemptsData);
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
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
