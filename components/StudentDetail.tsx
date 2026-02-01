
import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { COMPETENCY_DATA } from '../mockData';
import { Student } from '../types';

interface StudentDetailProps {
  student?: Student;
  onBack: () => void;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student, onBack }) => {
  if (!student) return (
    <div className="p-8 flex items-center justify-center h-full">
      <p className="text-[#617589]">Selecione um aluno para ver os detalhes.</p>
    </div>
  );

  const historyData = [
    { name: 'Última Atividade', date: 'Recentemente', cat: 'Matemática', score: student.average, avg: 7.5 },
  ];

  return (
    <div className="p-8 flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Student Profile Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-[#dbe0e6] dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <img
            src={student.avatar}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white dark:border-slate-800 shadow-lg object-cover"
            alt={student.name}
          />
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111418] dark:text-white">{student.name}</h1>
            <p className="text-[#617589] dark:text-slate-400 text-base">Turma: {student.class}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-green-600 font-bold">
              <span className="material-symbols-outlined text-sm">cloud_done</span>
              <span>Dados sincronizados da planilha</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#dbe0e6] dark:border-slate-800 shadow-sm">
          <p className="text-[#617589] text-xs font-bold uppercase tracking-widest">Média do Aluno</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold dark:text-white">{student.average}</p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-green-500 h-full" style={{ width: `${student.average * 10}%` }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#dbe0e6] dark:border-slate-800 shadow-sm">
          <p className="text-[#617589] text-xs font-bold uppercase tracking-widest">Exercícios</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold dark:text-white">{student.exercisesDone}</p>
          </div>
          <p className="text-slate-400 text-xs mt-2 italic">Total de envios computados</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#dbe0e6] dark:border-slate-800 shadow-sm">
          <p className="text-[#617589] text-xs font-bold uppercase tracking-widest">Status</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold text-primary">Ativo</p>
          </div>
          <p className="text-slate-400 text-xs mt-2 italic">Presente na última leitura</p>
        </div>
      </div>

      {/* Analysis Charts */}
      <div className="flex flex-col gap-6">
        {/* Comparison Line Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-[#dbe0e6] dark:border-slate-800 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-8">Desempenho no Período</h3>
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={student.history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="score" name={student.name} stroke="#137fec" strokeWidth={3} dot={{ fill: '#137fec', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#dbe0e6] dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#f0f2f4] dark:border-slate-800">
          <h3 className="text-lg font-bold dark:text-white">Log de Atividades</h3>
          <p className="text-sm text-[#617589]">Registros vinculados ao email: {student.id}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f0f2f4] dark:bg-slate-800/50 text-[#617589] text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Exercício</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4 text-center">Nota</th>
                <th className="px-6 py-4 text-right">Arquivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f2f4] dark:divide-slate-800 text-sm">
              {historyData.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold dark:text-white">{item.name}</span>
                      <span className="text-[10px] text-primary font-bold uppercase">{item.cat}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{item.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-green-600">{item.score.toFixed(1)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary font-bold hover:underline flex items-center justify-end gap-1">
                      <span className="material-symbols-outlined text-base">drive_file_move</span>
                      Drive
                    </button>
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

export default StudentDetail;
