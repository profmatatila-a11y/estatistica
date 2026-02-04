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
        <div className="p-6 flex flex-col gap-6 animate-in fade-in duration-500">
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

            {/* Students Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#dbe0e6] dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-y-auto h-[calc(100vh-280px)] custom-scrollbar">
                    <table className="w-full text-left table-fixed">
                        <thead className="bg-[#f8fafc] dark:bg-slate-800/50 text-[#617589] dark:text-slate-400 text-xs font-bold uppercase sticky top-0 z-10 backdrop-blur-md shadow-sm">
                            <tr>
                                <th className="px-6 py-4 w-auto">Aluno</th>
                                <th className="px-6 py-4 w-40">Turma</th>
                                <th className="px-6 py-4 w-32 text-center">Média</th>
                                <th className="px-6 py-4 w-32 text-center">Envios</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredStudents.map((student) => (
                                <tr
                                    key={student.id}
                                    onClick={() => onStudentClick(student.id)}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-4">
                                            <div className="relative shrink-0">
                                                <img src={student.avatar} alt={student.name} className="size-10 rounded-full border border-slate-100 dark:border-slate-700" />
                                            </div>
                                            <div className="truncate min-w-0">
                                                <p className="text-sm font-bold text-[#111418] dark:text-white group-hover:text-primary transition-colors truncate">{student.name}</p>
                                                <p className="text-[10px] text-[#617589] truncate">{student.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                            {student.class || 'Sem Turma'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className={`text-sm font-bold ${student.average >= 70 ? 'text-green-600' : student.average >= 50 ? 'text-primary' : 'text-red-500'
                                                }`}>
                                                {student.average}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <span className="text-sm font-bold text-[#111418] dark:text-white">{student.exercisesDone}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredStudents.length === 0 && (
                        <div className="p-12 text-center flex flex-col items-center gap-3">
                            <span className="material-symbols-outlined text-4xl text-slate-300">person_off</span>
                            <p className="text-[#617589]">Nenhum aluno encontrado.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentsView;
