
import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { COMPETENCY_DATA, EVOLUTION_DATA } from '../mockData';

const StudentDetail: React.FC = () => {
  const historyData = [
    { name: 'Simulado Termodinâmica', date: '12 Mai 2024', cat: 'Física', score: 9.2, avg: 7.8 },
    { name: 'Análise Combinatória II', date: '08 Mai 2024', cat: 'Matemática', score: 8.5, avg: 7.1 },
    { name: 'Redação: IA', date: '01 Mai 2024', cat: 'Português', score: 7.8, avg: 8.0 },
    { name: 'Guerra Fria', date: '24 Abr 2024', cat: 'História', score: 9.5, avg: 8.2 },
  ];

  return (
    <div className="p-8 flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Student Profile Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-[#dbe0e6] dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <img 
            src="https://picsum.photos/seed/joao/200/200" 
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white dark:border-slate-800 shadow-lg object-cover"
            alt="Joao"
          />
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111418] dark:text-white">João Silva</h1>
            <p className="text-[#617589] dark:text-slate-400 text-base">Turma: 3º Ano B - Ensino Médio</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-green-600 font-bold">
              <span className="material-symbols-outlined text-sm">cloud_done</span>
              <span>Google Drive: Sincronizado Hoje, 10:30</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#f0f2f4] dark:bg-slate-800 text-[#111418] dark:text-white font-bold rounded-lg hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
            PDF
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors">
            <span className="material-symbols-outlined text-xl">edit</span>
            Editar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#dbe0e6] dark:border-slate-800 shadow-sm">
          <p className="text-[#617589] text-xs font-bold uppercase tracking-widest">Média Geral</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold dark:text-white">8.5</p>
            <span className="text-green-600 text-sm font-bold">+0.5</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-green-500 h-full" style={{ width: '85%' }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#dbe0e6] dark:border-slate-800 shadow-sm">
          <p className="text-[#617589] text-xs font-bold uppercase tracking-widest">Crescimento</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold dark:text-white">+12%</p>
            <span className="text-green-600 text-sm font-bold">+2%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-primary h-full" style={{ width: '65%' }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#dbe0e6] dark:border-slate-800 shadow-sm">
          <p className="text-[#617589] text-xs font-bold uppercase tracking-widest">Atividades</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold dark:text-white">42</p>
            <span className="text-primary text-sm font-bold">+5</span>
          </div>
          <p className="text-slate-400 text-xs mt-2 italic">Meta: 50 exercícios/mês</p>
        </div>
      </div>

      {/* Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-[#dbe0e6] dark:border-slate-800 shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white self-start mb-8">Radar de Competências</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={COMPETENCY_DATA}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Radar
                  name="João Silva"
                  dataKey="value"
                  stroke="#137fec"
                  strokeWidth={2}
                  fill="#137fec"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparison Line Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-[#dbe0e6] dark:border-slate-800 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-8">Desempenho vs. Média da Turma</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={EVOLUTION_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} domain={[6, 9]} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="score" name="João Silva" stroke="#137fec" strokeWidth={3} dot={{ fill: '#137fec', r: 4 }} />
                <Line type="monotone" dataKey="avg" name="Média Turma" stroke="#9ca3af" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#dbe0e6] dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#f0f2f4] dark:border-slate-800">
          <h3 className="text-lg font-bold dark:text-white">Histórico de Atividades</h3>
          <p className="text-sm text-[#617589]">Exercícios sincronizados do Drive</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f0f2f4] dark:bg-slate-800/50 text-[#617589] text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Exercício</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4 text-center">Nota</th>
                <th className="px-6 py-4 text-center">Média Turma</th>
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
                  <td className="px-6 py-4 text-center text-slate-400">{item.avg.toFixed(1)}</td>
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
