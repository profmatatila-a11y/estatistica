
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { STUDENTS, ACTIVITIES, CLASS_STATS, EVOLUTION_DATA } from '../mockData';

interface DashboardProps {
  onStudentClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStudentClick }) => {
  return (
    <div className="p-8 flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div>
        <h3 className="text-2xl font-bold text-[#111418] dark:text-white">Bem-vindo de volta, Prof. Átila</h3>
        <p className="text-[#617589] dark:text-slate-400">Análise pedagógica baseada nas últimas atividades do Google Drive.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 flex flex-col gap-2 rounded-xl p-6 border border-[#dbe0e6] dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <p className="text-[#617589] dark:text-slate-400 text-sm font-medium">Média Geral</p>
            <span className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded text-green-600 dark:text-green-400 material-symbols-outlined text-sm">trending_up</span>
          </div>
          <p className="text-[#111418] dark:text-white tracking-tight text-3xl font-bold">78.5%</p>
          <p className="text-[#078838] text-sm font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">arrow_upward</span>
            +5.2% vs mês anterior
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 flex flex-col gap-2 rounded-xl p-6 border border-[#dbe0e6] dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <p className="text-[#617589] dark:text-slate-400 text-sm font-medium">Exercícios Realizados</p>
            <span className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 material-symbols-outlined text-sm">task_alt</span>
          </div>
          <p className="text-[#111418] dark:text-white tracking-tight text-3xl font-bold">1,240</p>
          <p className="text-primary text-sm font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">add</span>
            12% novos envios
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 flex flex-col gap-2 rounded-xl p-6 border border-[#dbe0e6] dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <p className="text-[#617589] dark:text-slate-400 text-sm font-medium">Taxa de Participação</p>
            <span className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded text-orange-600 dark:text-orange-400 material-symbols-outlined text-sm">group</span>
          </div>
          <p className="text-[#111418] dark:text-white tracking-tight text-3xl font-bold">92%</p>
          <p className="text-[#e73908] text-sm font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">arrow_downward</span>
            -1.5% absenteísmo
          </p>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Evolution Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-[#dbe0e6] dark:border-slate-800 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-[#111418] dark:text-white text-lg font-bold">Evolução da Nota Média</h4>
              <p className="text-[#617589] dark:text-slate-400 text-sm">Desempenho consolidado de todas as turmas</p>
            </div>
            <select className="text-xs font-semibold bg-[#f0f2f4] dark:bg-slate-800 border-none rounded-lg focus:ring-1 focus:ring-primary text-[#111418] dark:text-white px-3 py-1.5">
              <option>Últimos 6 meses</option>
              <option>Último ano</option>
            </select>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EVOLUTION_DATA}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#137fec" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#137fec" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} dx={-10} domain={[6, 9]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  itemStyle={{ color: '#137fec', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="score" stroke="#137fec" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-[#dbe0e6] dark:border-slate-800 p-6 shadow-sm flex flex-col">
          <h4 className="text-[#111418] dark:text-white text-lg font-bold mb-4">Atividades Recentes</h4>
          <div className="flex flex-col gap-4">
            {ACTIVITIES.map((activity) => (
              <div key={activity.id} className="flex gap-4 items-start p-2 hover:bg-background-light dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer group">
                <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
                  activity.type === 'exercise' ? 'bg-blue-100 dark:bg-blue-900/40 text-primary' :
                  activity.type === 'correction' ? 'bg-green-100 dark:bg-green-900/40 text-green-600' :
                  activity.type === 'alert' ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-600' :
                  'bg-purple-100 dark:bg-purple-900/40 text-purple-600'
                }`}>
                  <span className="material-symbols-outlined text-xl">
                    {activity.type === 'exercise' ? 'description' :
                     activity.type === 'correction' ? 'check_circle' :
                     activity.type === 'alert' ? 'warning' : 'upload_file'}
                  </span>
                </div>
                <div className="flex flex-col truncate">
                  <p className="text-sm font-bold text-[#111418] dark:text-white group-hover:text-primary transition-colors">{activity.title}</p>
                  <p className="text-xs text-[#617589] dark:text-slate-400">{activity.class} • {activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-auto w-full text-center text-primary text-sm font-bold pt-4 hover:underline">
            Ver todas as atividades
          </button>
        </div>
      </div>

      {/* Critical Students & Class Performance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Class Performance */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-[#dbe0e6] dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="flex justify-between items-center p-6 border-b border-[#f0f2f4] dark:border-slate-800">
            <h4 className="text-[#111418] dark:text-white text-lg font-bold">Desempenho por Turma</h4>
            <button className="text-sm text-primary font-bold flex items-center gap-1 hover:underline">
              Exportar Tudo <span className="material-symbols-outlined text-base">download</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f0f2f4] dark:bg-slate-800/50 text-[#617589] dark:text-slate-400 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-3">Turma</th>
                  <th className="px-6 py-3">Média</th>
                  <th className="px-6 py-3">Exercícios</th>
                  <th className="px-6 py-3">Progresso</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f4] dark:divide-slate-800">
                {CLASS_STATS.map((stat) => (
                  <tr key={stat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#111418] dark:text-white">{stat.name} - {stat.period}</span>
                        <span className="text-xs text-[#617589] dark:text-slate-400">{stat.studentCount} Alunos</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${stat.averageScore >= 8 ? 'text-green-600' : stat.averageScore >= 7 ? 'text-primary' : 'text-orange-600'}`}>
                        {stat.averageScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#111418] dark:text-slate-300">{stat.exercisesCount}</td>
                    <td className="px-6 py-4">
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${stat.progress}%` }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-xl">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Critical Students */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-slate-800 rounded-xl p-6 flex flex-col gap-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-[#111418] dark:text-white text-lg font-bold">Alunos em Alerta</h4>
              <p className="text-[#617589] text-xs">Quedas estatísticas recentes</p>
            </div>
            <span className="bg-[#fdebea] text-[#e73908] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Ação</span>
          </div>
          <div className="flex flex-col gap-3">
            {STUDENTS.map((student) => (
              <div 
                key={student.id} 
                onClick={onStudentClick}
                className="flex items-center justify-between p-3 rounded-lg border border-[#fdebea] bg-[#fef5f4] dark:bg-red-950/20 dark:border-red-900/30 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex gap-3 items-center">
                  <img src={student.avatar} className="size-10 rounded-full border-2 border-white shadow-sm" alt={student.name} />
                  <div className="truncate">
                    <p className="text-[#111418] dark:text-white text-sm font-bold leading-none">{student.name}</p>
                    <p className="text-[#617589] text-xs mt-1">Queda de {Math.abs(student.recentDrop || 0)}%</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-primary">chevron_right</span>
              </div>
            ))}
          </div>
          <button className="w-full text-center py-2 text-primary text-xs font-bold uppercase tracking-wider hover:underline">
            Ver Todos os Relatórios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
