import React from 'react';
import { ListStats } from '../types';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface ListStatsViewProps {
    listStats: ListStats[];
}

const ListStatsView: React.FC<ListStatsViewProps> = ({ listStats }) => {
    const COLORS = ['#137fec', '#059669', '#7c3aed', '#db2777', '#ea580c'];

    return (
        <div className="p-8 flex flex-col gap-8 animate-in fade-in duration-500">
            <div>
                <h3 className="text-2xl font-bold text-[#111418] dark:text-white">Desempenho por Lista</h3>
                <p className="text-[#617589] dark:text-slate-400">Análise detalhada de cada lista de exercícios enviada.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Comparison Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-[#dbe0e6] dark:border-slate-800 p-6 shadow-sm">
                    <h4 className="font-bold text-[#111418] dark:text-white mb-6">Média de Aproveitamento por Lista</h4>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={listStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#617589', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#617589', fontSize: 12 }} domain={[0, 100]} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="averageScore" name="Média (%)" radius={[4, 4, 0, 0]}>
                                    {listStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-primary rounded-2xl p-6 text-white shadow-lg shadow-primary/20 flex flex-col justify-between">
                    <div>
                        <span className="material-symbols-outlined text-4xl opacity-50 mb-4">list_alt</span>
                        <h4 className="text-xl font-bold mb-2">Visão Geral das Listas</h4>
                        <p className="text-blue-50 text-sm leading-relaxed">
                            {listStats.length > 0
                                ? `Você já enviou ${listStats.length} listas diferentes. A lista com maior volume de envios é "${listStats[0].name}".`
                                : "Nenhuma lista identificada ainda. Certifique-se de que sua planilha possui uma coluna para identificar as listas."
                            }
                        </p>
                    </div>
                    <div className="pt-6 border-t border-white/10 mt-6 text-center">
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Média Geral das Atividades</p>
                        <p className="text-4xl font-bold">
                            {listStats.length > 0
                                ? (listStats.reduce((acc, curr) => acc + curr.averageScore, 0) / listStats.length).toFixed(1)
                                : "0"
                            }%
                        </p>
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#dbe0e6] dark:border-slate-800 shadow-sm overflow-hidden text-left">
                <div className="p-6 border-b border-slate-50 dark:border-slate-800">
                    <h4 className="font-bold text-[#111418] dark:text-white">Tabela de Listas</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase tracking-wider">Nome da Lista</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase tracking-wider">Total de Envios</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase tracking-wider">Aproveitamento Médio</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {listStats.map((list) => (
                                <tr key={list.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-bold text-[#111418] dark:text-white">{list.name}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#617589]">
                                        {list.submissionCount} respostas
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full" style={{ width: `${list.averageScore}%` }} />
                                            </div>
                                            <span className="text-sm font-bold text-primary">{list.averageScore}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${list.averageScore >= 70 ? 'bg-green-100 text-green-700' :
                                            list.averageScore >= 50 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {list.averageScore >= 70 ? 'Ótimo' : list.averageScore >= 50 ? 'Bom' : 'Revisar Conteúdo'}
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

export default ListStatsView;
