import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Student, ClassStats } from '../types';

interface ReportsViewProps {
    classStats: ClassStats[];
    students: Student[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ classStats, students }) => {
    // Colors for bars
    const COLORS = ['#137fec', '#059669', '#7c3aed', '#db2777', '#ea580c'];

    return (
        <div className="p-8 flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-start print:hidden">
                <div>
                    <h3 className="text-2xl font-bold text-[#111418] dark:text-white">Relatórios Analíticos</h3>
                    <p className="text-[#617589] dark:text-slate-400">Análise comparativa e desempenho individual detalhado.</p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-[#dbe0e6] dark:border-slate-700 rounded-lg text-sm font-bold text-[#111418] dark:text-white hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                    Exportar PDF
                </button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @media print {
          nav, aside, header, .print\\:hidden { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; width: 100% !important; }
          .p-8 { padding: 0 !important; }
          .shadow-sm, .shadow-lg { box-shadow: none !important; border: 1px solid #eee !important; }
          .bg-primary { background-color: #137fec !important; -webkit-print-color-adjust: exact; }
          .text-white { color: #fff !important; }
          body { background: white !important; }
          .grid { display: block !important; }
          .lg\\:col-span-2, .lg\\:col-span-3 { width: 100% !important; margin-bottom: 20px; }
          table { width: 100% !important; border-collapse: collapse; }
          th, td { border: 1px solid #eee !important; }
        }
      `}} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Comparison Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-[#dbe0e6] dark:border-slate-800 p-6 shadow-sm">
                    <h4 className="font-bold text-[#111418] dark:text-white mb-6">Média por Turma</h4>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={classStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#617589', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#617589', fontSize: 12 }} domain={[0, 100]} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="averageScore" name="Média (%)" radius={[4, 4, 0, 0]}>
                                    {classStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-primary rounded-2xl p-6 text-white shadow-lg shadow-primary/20 flex flex-col justify-between">
                    <div>
                        <span className="material-symbols-outlined text-4xl opacity-50 mb-4">insights</span>
                        <h4 className="text-xl font-bold mb-2">Insight Pedagógico</h4>
                        <p className="text-blue-50 text-sm leading-relaxed">
                            {classStats.length > 0
                                ? `A turma ${classStats.sort((a, b) => b.averageScore - a.averageScore)[0].name} lidera o ranking com ${classStats[0].averageScore.toFixed(1)}% de aproveitamento.`
                                : "Aguardando sincronização de dados para gerar insights."
                            }
                        </p>
                    </div>
                    <div className="pt-6 border-t border-white/10 mt-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Total de Alunos</p>
                                <p className="text-3xl font-bold">{students.length}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Exercícios</p>
                                <p className="text-3xl font-bold">{classStats.reduce((acc, c) => acc + c.exercisesCount, 0)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#dbe0e6] dark:border-slate-800 shadow-sm overflow-hidden text-left">
                <div className="p-6 border-b border-slate-50 dark:border-slate-800">
                    <h4 className="font-bold text-[#111418] dark:text-white">Desempenho Individual Completo</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase tracking-wider">Aluno</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase tracking-wider">Turma</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase tracking-wider">Envios</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase tracking-wider">Aproveitamento</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {students.sort((a, b) => b.average - a.average).map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img src={s.avatar} alt="" className="size-8 rounded-full" />
                                            <span className="text-sm font-bold text-[#111418] dark:text-white">{s.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617589]">{s.class}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111418] dark:text-white font-medium">{s.exercisesDone} atividades</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${s.average}%` }} />
                                            </div>
                                            <span className="text-sm font-bold text-primary">{s.average}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${s.average >= 70 ? 'bg-green-100 text-green-700' :
                                            s.average >= 50 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {s.average >= 70 ? 'Excelente' : s.average >= 50 ? 'Regular' : 'Atenção'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsView;
