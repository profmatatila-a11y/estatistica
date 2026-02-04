import React, { useEffect, useState } from 'react';
import { quizService } from '../../services/quizService';
import { Quiz } from '../../types';


interface QuizListProps {
    statusFilter?: string; // Optional filter if we want to add later
    selectedClass: string;
    onEdit: (quizId: string) => void;
    onCreateNew: () => void;
    onViewResults: (quizId: string) => void;
}

export function QuizList({ selectedClass, onEdit, onCreateNew, onViewResults }: QuizListProps) {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuizzes();
    }, []);

    const loadQuizzes = async () => {
        setLoading(true);
        try {
            const data = await quizService.getAllQuizzes();
            setQuizzes(data);
        } catch (error) {
            console.error('Falha ao carregar quizzes:', error);
            // Silent fail for now, just show empty state or logs
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este Quiz? Todas as respostas e questões serão perdidas.')) {
            try {
                await quizService.deleteQuiz(id);
                setQuizzes(quizzes.filter(q => q.id !== id));
            } catch (error) {
                console.error(error);
                alert('Erro ao excluir quiz.');
            }
        }
    };

    const copyLink = (id: string, title: string) => {
        const link = `${window.location.origin}/?quizId=${id}`;
        navigator.clipboard.writeText(link);
        alert(`Link copiado para "${title}"!`);
    };

    const filteredQuizzes = selectedClass === 'Todas as Turmas'
        ? quizzes
        : quizzes.filter(q => q.target_class === selectedClass);


    if (loading) return <div className="p-8 text-center text-slate-500">Carregando seus quizzes...</div>;

    return (
        <div className="p-6 w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Meus Quizzes</h1>
                    <p className="text-slate-500">Gerencie suas avaliações</p>
                </div>
                <button
                    onClick={onCreateNew}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-sm flex items-center gap-2 transition-colors"
                >
                    <span className="material-symbols-outlined">add</span>
                    Criar Novo Quiz
                </button>
            </div>

            {filteredQuizzes.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">history_edu</span>
                    <p className="text-slate-500 font-medium"> Nenhum quiz encontrado {selectedClass !== 'Todas as Turmas' ? `para a turma ${selectedClass}` : ''}.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Nome do Quiz</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 w-32">Turma</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 w-32">Data</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 w-40 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredQuizzes.map(quiz => (
                                    <tr key={quiz.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                                                    <span className="material-symbols-outlined text-lg">quiz</span>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-800">{quiz.title}</div>
                                                    <div className="text-xs text-slate-500 truncate max-w-xs">{quiz.description || 'Sem descrição'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">
                                            <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-600">
                                                {quiz.target_class || 'Geral'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-500">
                                            {new Date(quiz.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1 transition-opacity">
                                                <button
                                                    onClick={() => copyLink(quiz.id, quiz.title)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip-trigger"
                                                    title="Copiar Link"
                                                >
                                                    <span className="material-symbols-outlined text-lg">link</span>
                                                </button>
                                                <button
                                                    onClick={() => onViewResults(quiz.id)}
                                                    className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                    title="Ver Resultados"
                                                >
                                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                                </button>
                                                <button
                                                    onClick={() => onEdit(quiz.id)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(quiz.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Excluir"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
