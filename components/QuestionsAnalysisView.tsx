import React, { useState } from 'react';
import { QuestionStat } from '../types';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

interface QuestionsAnalysisViewProps {
    questionStats: QuestionStat[];
}

const QuestionsAnalysisView: React.FC<QuestionsAnalysisViewProps> = ({ questionStats }) => {
    const [selectedQuestion, setSelectedQuestion] = useState<QuestionStat | null>(questionStats[0] || null);

    const COLORS = ['#137fec', '#059669', '#7c3aed', '#db2777', '#ea580c', '#64748b'];

    return (
        <div className="p-8 flex flex-col gap-8 animate-in fade-in duration-500">
            <div>
                <h3 className="text-2xl font-bold text-[#111418] dark:text-white">Análise por Questão</h3>
                <p className="text-[#617589] dark:text-slate-400">Descubra quais questões tiveram maior taxa de erro e veja a distribuição das respostas.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Questions List */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-[#dbe0e6] dark:border-slate-800 shadow-sm overflow-hidden h-[600px] flex flex-col">
                    <div className="p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                        <h4 className="font-bold text-sm text-[#111418] dark:text-white uppercase tracking-wider">Selecione uma Questão</h4>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {questionStats.map((q) => (
                            <button
                                key={q.id}
                                onClick={() => setSelectedQuestion(q)}
                                className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0 ${selectedQuestion?.id === q.id ? 'bg-primary/5 border-r-4 border-r-primary' : ''}`}
                            >
                                <p className={`text-sm font-medium line-clamp-2 ${selectedQuestion?.id === q.id ? 'text-primary' : 'text-[#111418] dark:text-white'}`}>
                                    {q.title}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[#617589]">
                                        {q.totalAnswers} respostas
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Question Detail */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {selectedQuestion ? (
                        <>
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#dbe0e6] dark:border-slate-800 p-8 shadow-sm">
                                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">Questão Selecionada</span>
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
                                                    {selectedQuestion.distribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                    formatter={(value: number, name: string, props: any) => [`${value} alunos (${props.payload.percentage}%)`, props.payload.answer]}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <h5 className="text-sm font-bold text-[#617589] uppercase tracking-wider mb-2">Distribuição de Respostas</h5>
                                        {selectedQuestion.distribution.map((item, idx) => (
                                            <div key={idx} className="flex flex-col gap-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-medium text-[#111418] dark:text-white truncate max-w-[200px]">{item.answer}</span>
                                                    <span className="font-bold text-primary">{item.percentage}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${item.percentage}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-primary/20 p-2 rounded-lg text-primary">
                                        <span className="material-symbols-outlined">lightbulb</span>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-primary mb-1">Dica Pedagógica</h5>
                                        <p className="text-sm text-primary/80 leading-relaxed">
                                            A resposta mais comum para esta questão foi <strong>"{selectedQuestion.mostCommonAnswer}"</strong> com {selectedQuestion.distribution[0].percentage}% de frequência. Se isto diverge do gabarito, pode indicar um erro comum de interpretação que vale a pena revisar em sala.
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
