import React, { useState } from 'react';
import { Student } from '../types';

interface StudentsViewProps {
    students: Student[];
    onStudentClick: (id: string) => void;
}

const StudentsView: React.FC<StudentsViewProps> = ({ students, onStudentClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState('Todas');

    const classes = ['Todas', ...Array.from(new Set(students.map(s => s.class)))];

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = selectedClass === 'Todas' || s.class === selectedClass;
        return matchesSearch && matchesClass;
    });

    return (
        <div className="p-8 flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-[#111418] dark:text-white">Diretório de Alunos</h3>
                    <p className="text-[#617589] dark:text-slate-400">Gerencie e acompanhe o desempenho individual de cada estudante.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-sm">
                        {students.length} Alunos Totais
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#617589]">search</span>
                    <input
                        type="text"
                        placeholder="Buscar por nome do aluno..."
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-3 bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-slate-800 rounded-xl text-sm outline-none dark:text-white min-w-[150px]"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                >
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStudents.map((student) => (
                    <div
                        key={student.id}
                        onClick={() => onStudentClick(student.id)}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-[#dbe0e6] dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-4">
                                <img src={student.avatar} alt={student.name} className="size-20 rounded-2xl shadow-sm group-hover:scale-105 transition-transform" />
                                <div className={`absolute -bottom-1 -right-1 size-5 rounded-full border-2 border-white dark:border-slate-900 ${student.average >= 70 ? 'bg-green-500' : student.average >= 50 ? 'bg-blue-500' : 'bg-red-500'
                                    }`}></div>
                            </div>

                            <h4 className="font-bold text-[#111418] dark:text-white mb-1 group-hover:text-primary transition-colors">{student.name}</h4>
                            <p className="text-xs text-[#617589] font-medium mb-4">{student.class}</p>

                            <div className="grid grid-cols-2 w-full gap-2 pt-4 border-t border-slate-50 dark:border-slate-800">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-[#617589] uppercase font-bold tracking-wider">Média</span>
                                    <span className="text-sm font-bold text-primary">{student.average}%</span>
                                </div>
                                <div className="flex flex-col border-l border-slate-50 dark:border-slate-800 pl-2">
                                    <span className="text-[10px] text-[#617589] uppercase font-bold tracking-wider">Envios</span>
                                    <span className="text-sm font-bold text-[#111418] dark:text-white">{student.exercisesDone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredStudents.length === 0 && (
                    <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <span className="material-symbols-outlined text-5xl text-slate-300">person_search</span>
                        <p className="text-[#617589] font-medium">Nenhum aluno encontrado com esses filtros.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentsView;
