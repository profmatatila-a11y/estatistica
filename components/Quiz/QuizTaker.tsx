import React, { useEffect, useState } from 'react';
import { quizService } from '../../services/quizService';
import { Quiz, Question } from '../../types';

export function QuizTaker({ userEmail: defaultEmail, className, quizId }: { userEmail?: string; className?: string, quizId?: string }) {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const [finished, setFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);

    // Student Identity State
    const [studentName, setStudentName] = useState('');
    const [studentEmail, setStudentEmail] = useState(defaultEmail || '');
    const [isIdentified, setIsIdentified] = useState(false);

    useEffect(() => {
        // If a specific quizId is provided (Public Mode), load it directly
        if (quizId) {
            loadSingleQuiz(quizId);
        } else if (isIdentified) {
            loadQuizzes();
        }
    }, [isIdentified, className, quizId]);

    const loadSingleQuiz = async (id: string) => {
        setLoading(true);
        try {
            const { quiz, questions: qData } = await quizService.getQuizDetails(id);
            setActiveQuiz(quiz as Quiz);
            setQuestions(qData);
        } catch (error) {
            console.error('Error loading quiz:', error);
            alert('Quiz não encontrado ou erro ao carregar.');
        } finally {
            setLoading(false);
        }
    };

    const handleIdentification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (studentName && studentEmail) {
            setIsIdentified(true);
            // If we already have the quiz loaded (Public Mode), start the attempt immediately
            if (activeQuiz && !attemptId) {
                await startQuizAttempt(activeQuiz);
            }
        } else {
            alert('Por favor, preencha nome e email.');
        }
    };

    const loadQuizzes = async () => {
        setLoading(true);
        try {
            const data = await quizService.getQuizzesByClass(className);
            setQuizzes(data);
        } catch (error) {
            console.error('Error loading quizzes:', error);
        } finally {
            setLoading(false);
        }
    };

    const startQuizAttempt = async (quiz: Quiz) => {
        setLoading(true);
        try {
            // Need to verify if questions are loaded, if not (from list view), load them
            let qData = questions;
            if (questions.length === 0 || activeQuiz?.id !== quiz.id) {
                const details = await quizService.getQuizDetails(quiz.id);
                qData = details.questions;
                setQuestions(qData);
            }

            const attempt = await quizService.startAttempt(quiz.id, studentEmail, studentName);

            setActiveQuiz(quiz);
            setAttemptId(attempt.id);
            setAnswers({});
            setFinished(false);
        } catch (error) {
            console.error('Error starting quiz:', error);
            alert('Falha ao iniciar o quiz. Verifique sua conexão.');
        } finally {
            setLoading(false);
        }
    };

    // Wrapper for List Mode start
    const handleStartFromList = (quiz: Quiz) => {
        startQuizAttempt(quiz);
    };

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async () => {
        if (!attemptId || !activeQuiz) return;

        if (!confirm('Tem certeza que deseja finalizar o quiz?')) return;

        setLoading(true);
        let correctCount = 0;

        try {
            for (const q of questions) {
                const studentAnswer = answers[q.id];
                let isCorrect = false;

                if (q.type === 'multiple_choice' && q.options) {
                    const correctOpt = q.options.find(o => o.isCorrect);
                    if (correctOpt && studentAnswer === correctOpt.text) {
                        isCorrect = true;
                    }
                } else {
                    if (q.correct_answer && studentAnswer?.toLowerCase().trim() === q.correct_answer.toLowerCase().trim()) {
                        isCorrect = true;
                    }
                }

                if (isCorrect) correctCount += (Number(q.points) || 1);

                await quizService.submitAnswer(attemptId, q.id, studentAnswer || '', isCorrect);
            }

            await quizService.finishAttempt(attemptId, correctCount);
            setScore(correctCount);
            setFinished(true);

        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Erro ao enviar respostas. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // 1. Identification Screen
    if (!isIdentified) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 w-full max-w-md">
                    {/* Branding for ID Screen */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">Matemática Online</h1>
                        <h2 className="text-lg text-slate-700 font-medium">Prof. Átila de Oliveira</h2>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-6 text-center border-b pb-4">Identificação</h3>
                    <form onSubmit={handleIdentification} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                            <input
                                required
                                className="w-full border-slate-300 rounded-lg shadow-sm p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={studentName}
                                onChange={e => setStudentName(e.target.value)}
                                placeholder="Seu nome"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input
                                required
                                type="email"
                                className="w-full border-slate-300 rounded-lg shadow-sm p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={studentEmail}
                                onChange={e => setStudentEmail(e.target.value)}
                                placeholder="seu@email.com"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-200"
                        >
                            {activeQuiz ? 'Iniciar Quiz' : 'Entrar'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    // 4. Results Screen (Detailed Feedback)
    if (finished) {
        return (
            <div className="min-h-screen bg-slate-50 p-4 md:p-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Header Card */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                        <div className="mb-4">
                            <span className="material-symbols-outlined text-6xl text-green-500 bg-green-50 rounded-full p-4">check_circle</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Finalizado!</h2>
                        <p className="text-slate-600 mb-6">Parabéns pelo esforço, {studentName.split(' ')[0]}!</p>

                        <div className="inline-flex flex-col items-center bg-slate-50 px-8 py-4 rounded-xl border border-slate-100">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Nota Final</span>
                            <span className="text-5xl font-black text-indigo-600">{score}</span>
                        </div>
                    </div>

                    {/* Feedback List */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 ml-2 border-l-4 border-indigo-500 pl-4">Gabarito e Correção</h3>

                        {questions.map((q, idx) => {
                            const studentAnswer = answers[q.id];
                            let isCorrect = false;
                            let correctAnswerText = '';

                            if (q.type === 'multiple_choice' && q.options) {
                                const correctOpt = q.options.find(o => o.isCorrect);
                                correctAnswerText = correctOpt ? correctOpt.text : 'Gabarito não definido';
                                isCorrect = studentAnswer === correctAnswerText;
                            } else {
                                correctAnswerText = q.correct_answer || 'Resposta (Texto)';
                                isCorrect = studentAnswer?.toLowerCase().trim() === correctAnswerText.toLowerCase().trim();
                            }

                            return (
                                <div key={q.id} className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                                    <div className="flex gap-4 mb-4">
                                        <span className={`flex-shrink-0 size-8 flex items-center justify-center rounded-full text-sm font-bold text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {isCorrect ? '✓' : '✕'}
                                        </span>
                                        <div className="flex-1">
                                            <div
                                                className="font-medium text-lg text-slate-800 prose prose-slate max-w-none mb-2"
                                                dangerouslySetInnerHTML={{ __html: q.text }}
                                            />
                                            {q.image_url && (
                                                <img src={q.image_url} alt="Questão" className="mb-4 rounded-lg max-h-64 object-contain bg-slate-50 border border-slate-100" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                                        <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                            <p className={`font-bold uppercase text-xs mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>Sua Resposta</p>
                                            <p className={`font-medium ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                                                {studentAnswer || '(Sem resposta)'}
                                            </p>
                                        </div>

                                        {!isCorrect && (
                                            <div className="p-4 rounded-lg border bg-slate-50 border-slate-200">
                                                <p className="font-bold uppercase text-xs text-slate-500 mb-1">Resposta Correta</p>
                                                <p className="font-medium text-slate-800">{correctAnswerText}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-center pt-8 pb-20">
                        <button
                            onClick={() => {
                                setFinished(false);
                                setAttemptId(null);
                                setActiveQuiz(null);
                                setScore(0);
                                setAnswers({});
                            }}
                            className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-black shadow-lg transition-transform hover:-translate-y-1 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Voltar para Lista de Quizzes
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Active Quiz Interface
    if (activeQuiz && isIdentified) {
        return (
            <div className="min-h-screen bg-slate-50 pb-20">
                {/* Custom Branding Header */}
                <div className="bg-white shadow-sm border-b border-slate-200 p-6 text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Matemática Online</h1>
                    <h2 className="text-lg text-slate-700 font-medium">Prof. Átila de Oliveira</h2>
                    {activeQuiz.custom_header && (
                        <div
                            className="mt-4 text-slate-600 max-w-2xl mx-auto italic prose prose-slate"
                            dangerouslySetInnerHTML={{ __html: activeQuiz.custom_header }}
                        />
                    )}
                </div>

                <div className="max-w-3xl mx-auto p-4 md:p-8">
                    <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-blue-600">
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">{activeQuiz.title}</h1>
                        <p className="text-slate-600">{activeQuiz.description}</p>
                        <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-slate-500">
                            <span>Aluno: <strong className="text-slate-900">{studentName}</strong></span>
                            <span>{Object.keys(answers).length} de {questions.length} respondidas</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {(questions || []).map((q, idx) => (
                            <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex gap-4 mb-4">
                                    <span className="flex-shrink-0 bg-slate-100 text-slate-600 size-8 flex items-center justify-center rounded-lg text-sm font-bold">{idx + 1}</span>
                                    <div className="flex-1">
                                        {/* Rich Text Question */}
                                        <div
                                            className="font-medium text-lg text-slate-800 prose prose-slate max-w-none"
                                            dangerouslySetInnerHTML={{ __html: q.text }}
                                        />
                                        {/* Question Image */}
                                        {q.image_url && (
                                            <img src={q.image_url} alt="Questão" className="mt-4 rounded-lg max-h-96 object-contain border border-slate-100 bg-slate-50" />
                                        )}
                                    </div>
                                </div>

                                {q.type === 'multiple_choice' ? (
                                    <div className="space-y-3 ml-12">
                                        {q.options?.map((opt, oIdx) => (
                                            <label
                                                key={oIdx}
                                                className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all group ${answers[q.id] === opt.text
                                                    ? 'bg-blue-50 border-blue-500 shadow-sm'
                                                    : 'hover:bg-slate-50 border-slate-200'
                                                    }`}
                                            >
                                                <div className={`size-5 rounded-full border flex items-center justify-center mr-4 transition-colors ${answers[q.id] === opt.text
                                                    ? 'border-blue-500 bg-blue-500'
                                                    : 'border-slate-300 group-hover:border-slate-400'
                                                    }`}>
                                                    {answers[q.id] === opt.text && <div className="size-2 bg-white rounded-full" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name={`q-${q.id}`}
                                                    value={opt.text}
                                                    checked={answers[q.id] === opt.text}
                                                    onChange={() => handleAnswerChange(q.id, opt.text)}
                                                    className="hidden"
                                                />
                                                <div className="flex-1">
                                                    <span className="font-bold text-slate-500 mr-2">{opt.label})</span>
                                                    <span className={answers[q.id] === opt.text ? 'text-slate-900 font-medium' : 'text-slate-600'}>
                                                        {opt.text}
                                                    </span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="ml-12">
                                        <textarea
                                            className="w-full border-slate-300 rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                            rows={3}
                                            placeholder="Digite sua resposta aqui..."
                                            value={answers[q.id] || ''}
                                            onChange={e => handleAnswerChange(q.id, e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-end gap-4">
                        <button
                            onClick={handleSubmit}
                            className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5"
                        >
                            Finalizar e Enviar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Quiz List (Only shown if no specific quizId passed)
    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Quizzes Disponíveis</h1>
                    <p className="text-slate-500">Bem-vindo(a), {studentName}</p>
                </div>
                <button
                    onClick={() => setIsIdentified(false)}
                    className="text-sm text-blue-600 font-medium hover:underline"
                >
                    Alterar Aluno
                </button>
            </div>

            {quizzes.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <div className="bg-slate-50 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-slate-400 text-3xl">assignment_late</span>
                    </div>
                    <p className="text-slate-600 font-medium text-lg">Nenhum quiz disponível no momento.</p>
                    <p className="text-slate-400 text-sm mt-1">Tente atualizar a página mais tarde.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map(quiz => (
                        <div key={quiz.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-2xl">quiz</span>
                                </div>
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                                    Disponível
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-2 truncate" title={quiz.title}>{quiz.title}</h3>
                            <p className="text-slate-600 text-sm mb-6 line-clamp-2 h-10">{quiz.description || 'Sem descrição.'}</p>

                            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs text-slate-500 font-medium">
                                    {quiz.target_class ? `Turma: ${quiz.target_class}` : 'Geral'}
                                </span>
                                <button
                                    onClick={() => handleStartFromList(quiz)}
                                    className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-black transition-colors"
                                >
                                    Iniciar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
