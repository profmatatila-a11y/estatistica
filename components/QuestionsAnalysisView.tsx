import React, { useState } from 'react';
import { QuestionStat } from '../types';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

interface QuestionsAnalysisViewProps {
    questionStats: QuestionStat[];
}

const QuestionsAnalysisView: React.FC<QuestionsAnalysisViewProps> = ({ questionStats }) => {
    const availableLists = Array.from(new Set(questionStats.map(q => q.listName))).sort();
    const [selectedListName, setSelectedListName] = useState<string>(availableLists[0] || '');

    const filteredQuestions = questionStats.filter(q => q.listName === selectedListName);
    const [selectedQuestion, setSelectedQuestion] = useState<QuestionStat | null>(filteredQuestions[0] || null);

    // Sync selected question when list or stats change
    React.useEffect(() => {
        const firstInList = questionStats.find(q => q.listName === selectedListName);
        setSelectedQuestion(firstInList || null);
    }, [selectedListName, questionStats]);

    // State to store correct answers (keyed by "listName|questionTitle")
    const [correctAnswers, setCorrectAnswers] = useState<Record<string, string>>(() => {
        const saved = localStorage.getItem('correctAnswers');
        return saved ? JSON.parse(saved) : {};
    });

    const handleSetCorrect = (listName: string, questionTitle: string, answer: string) => {
        const key = `${listName}|${questionTitle}`;
        const newCorrect = { ...correctAnswers, [key]: answer };
        setCorrectAnswers(newCorrect);
        localStorage.setItem('correctAnswers', JSON.stringify(newCorrect));
    };

    const COLORS = ['#137fec', '#059669', '#7c3aed', '#db2777', '#ea580c', '#64748b'];

    const getMarkedAnswer = (q: QuestionStat) => {
        const key = `${q.listName}|${q.title}`;
        return correctAnswers[key] || q.suggestedCorrect;
    };

    const getAccuracy = (q: QuestionStat) => {
        const correct = getMarkedAnswer(q);
        if (!correct) return null;
        const dist = q.distribution.find(d => d.answer === correct);
        return dist ? dist.percentage : 0;
    };

    return (
        <div className="p-8 flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-2xl font-bold text-[#111418] dark:text-white">Análise por Questão</h3>
                    <p className="text-[#617589] dark:text-slate-400">Marque o <strong>Gabarito</strong> clicando na resposta correta.</p>
                </div>
                {selectedQuestion && getAccuracy(selectedQuestion) !== null && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 px-6 py-3 rounded-xl flex flex-col items-center animate-in zoom-in duration-300">
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Taxa de Acerto</span>
                        <span className="text-2xl font-bold text-green-700 dark:text-green-400">{getAccuracy(selectedQuestion)}%</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Questions List and List Selector */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    {/* List Selector Dropdown */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#dbe0e6] dark:border-slate-800 p-4 shadow-sm">
                        <label className="text-[10px] font-bold text-[#617589] uppercase tracking-widest mb-2 block">Filtrar por Lista</label>
                        <select
                            value={selectedListName}
                            onChange={(e) => setSelectedListName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-bold text-[#111418] dark:text-white focus:ring-2 ring-primary/20 p-2 cursor-pointer"
                        >
                            {availableLists.map(list => (
                                <option key={list} value={list}>{list}</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#dbe0e6] dark:border-slate-800 shadow-sm overflow-hidden h-[500px] flex flex-col">
                        <div className="p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <h4 className="font-bold text-sm text-[#111418] dark:text-white uppercase tracking-wider">Questões</h4>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {filteredQuestions.map((q) => {
                                const isAnswered = !!getMarkedAnswer(q);
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setSelectedQuestion(q)}
                                        className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0 ${selectedQuestion?.id === q.id ? 'bg-primary/5 border-r-4 border-r-primary' : ''}`}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <p className={`text-sm font-medium line-clamp-2 ${selectedQuestion?.id === q.id ? 'text-primary' : 'text-[#111418] dark:text-white'}`}>
                                                {q.title}
                                            </p>
                                            {isAnswered && (
                                                <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[#617589]">
                                                {q.totalAnswers} respostas
                                            </span>
                                            {q.suggestedCorrect && !correctAnswers[`${q.listName}|${q.title}`] && (
                                                <span className="text-[9px] text-green-600 font-bold uppercase tracking-tighter bg-green-50 px-1 rounded">Auto</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Question Detail */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {selectedQuestion ? (
                        <>
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#dbe0e6] dark:border-slate-800 p-8 shadow-sm">
                                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">{selectedQuestion.listName}</span>
                                <h4 className="text-xl font-bold text-[#111418] dark:text-white mb-6 leading-relaxed">
                                    {selectedQuestion.title}
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <div className="h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={selectedQuestion.distribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="count"
                                                >
                                                    {selectedQuestion.distribution.map((entry, index) => {
                                                        const marked = getMarkedAnswer(selectedQuestion);
                                                        const isCorrect = marked === entry.answer;
                                                        return (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={isCorrect ? '#059669' : COLORS[index % COLORS.length]}
                                                                stroke={isCorrect ? '#fff' : 'none'}
                                                                strokeWidth={2}
                                                            />
                                                        );
                                                    })}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                    formatter={(value: number, name: string, props: any) => [`${value} alunos (${props.payload.percentage}%)`, props.payload.answer]}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <h5 className="text-sm font-bold text-[#617589] uppercase tracking-wider mb-2">Clique para definir o Gabarito:</h5>
                                        {selectedQuestion.distribution.map((item, idx) => {
                                            const marked = getMarkedAnswer(selectedQuestion);
                                            const isCorrect = marked === item.answer;
                                            const isAuto = selectedQuestion.suggestedCorrect === item.answer && !correctAnswers[`${selectedQuestion.listName}|${selectedQuestion.title}`];

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSetCorrect(selectedQuestion.listName, selectedQuestion.title, item.answer)}
                                                    className={`group flex flex-col gap-1 text-left p-2.5 rounded-xl border transition-all ${isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-200'}`}
                                                >
                                                    <div className="flex justify-between text-sm items-center">
                                                        <div className="flex items-center gap-2 truncate">
                                                            {isCorrect ? (
                                                                <span className="material-symbols-outlined text-green-600 text-lg">check_circle</span>
                                                            ) : (
                                                                <span className="material-symbols-outlined text-slate-300 text-lg group-hover:text-primary transition-colors">radio_button_unchecked</span>
                                                            )}
                                                            <span className={`font-medium truncate max-w-[180px] ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-[#111418] dark:text-white'}`}>
                                                                {item.answer}
                                                                {isAuto && <span className="ml-2 text-[10px] text-green-600/60">(Auto)</span>}
                                                            </span>
                                                        </div>
                                                        <span className={`font-bold ${isCorrect ? 'text-green-600' : 'text-primary'}`}>{item.percentage}%</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-700 ease-out"
                                                            style={{
                                                                width: `${item.percentage}%`,
                                                                backgroundColor: isCorrect ? '#059669' : COLORS[idx % COLORS.length]
                                                            }}
                                                        />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-primary/20 p-2 rounded-lg text-primary">
                                        <span className="material-symbols-outlined">analytics</span>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-primary mb-1">Análise de Desempenho</h5>
                                        <p className="text-sm text-primary/80 leading-relaxed">
                                            {getMarkedAnswer(selectedQuestion)
                                                ? `Com a resposta "${getMarkedAnswer(selectedQuestion)}" definida como correta, o índice de aproveitamento é de ${getAccuracy(selectedQuestion)}%.`
                                                : `Selecione a resposta correta acima para calcular o índice de acerto desta questão.`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#dbe0e6] dark:border-slate-800 p-20 flex flex-col items-center justify-center text-center">
                            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">quiz</span>
                            <h4 className="text-xl font-bold dark:text-white">Nenhuma questão selecionada</h4>
                            <p className="text-[#617589]">Escolha uma questão na lista à esquerda para ver os detalhes do desempenho.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionsAnalysisView;
