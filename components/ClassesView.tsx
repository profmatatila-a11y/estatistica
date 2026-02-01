import React from 'react';
import { ClassStats, Student } from '../types';

interface ClassesViewProps {
    classStats: ClassStats[];
    students: Student[];
    onStudentClick: (id: string) => void;
}

const ClassesView: React.FC<ClassesViewProps> = ({ classStats, students, onStudentClick }) => {
    return (
        <div className="p-8 flex flex-col gap-8 animate-in fade-in duration-500">
            <div>
                <h3 className="text-2xl font-bold text-[#111418] dark:text-white">Gestão por Turmas</h3>
                <p className="text-[#617589] dark:text-slate-400">Visão detalhada de desempenho agrupada por sala de aula.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classStats.map((c) => (
                    <div key={c.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-[#dbe0e6] dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                                    {c.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#111418] dark:text-white group-hover:text-primary transition-colors">{c.name}</h4>
                                    <p className="text-xs text-[#617589]">{c.studentCount} Alunos Ativos</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold rounded-full">
                                {c.averageScore.toFixed(1)}% Média
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1.5">
                                    <span className="text-[#617589]">Progresso da Ementa</span>
                                    <span className="text-primary">{c.progress.toFixed(0)}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-1000"
                                        style={{ width: `${c.progress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                                <p className="text-xs font-bold text-[#617589] mb-3 uppercase tracking-wider">Top Alunos da Turma</p>
                                <div className="flex flex-col gap-2">
                                    {students
                                        .filter(s => s.class === c.name)
                                        .sort((a, b) => b.average - a.average)
                                        .slice(0, 3)
                                        .map((student) => (
                                            <div
                                                key={student.id}
                                                onClick={() => onStudentClick(student.id)}
                                                className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <img src={student.avatar} alt={student.name} className="size-6 rounded-full" />
                                                    <span className="text-sm text-[#111418] dark:text-slate-300 truncate w-32">{student.name}</span>
                                                </div>
                                                <span className="text-xs font-bold text-primary">{student.average}%</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {classStats.length === 0 && (
                    <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <span className="material-symbols-outlined text-5xl text-slate-300">school</span>
                        <p className="text-[#617589] font-medium">Nenhuma turma detectada na planilha.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassesView;
