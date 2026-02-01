
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Student, ClassStats, Activity } from '../types';
import { ACTIVITIES } from '../mockData';

interface DashboardProps {
  onStudentClick: (id: string) => void;
  students: Student[];
  classStats: ClassStats[];
  activityName: string;
  evolutionData: any[];
  listStats: any[];
  selectedList: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onStudentClick, students, classStats, activityName, evolutionData, listStats, selectedList }) => {
  const isFiltered = selectedList !== 'Todas as Listas';

  const filteredStudentsData = React.useMemo(() => {
    if (!isFiltered) return students;
    return students.map(s => {
      const entry = s.history.find(h => h.listName === selectedList);
      return entry ? { ...s, average: entry.score } : null;
    }).filter((s): s is Student => s !== null);
  }, [students, selectedList, isFiltered]);

  const overallAvg = filteredStudentsData.length > 0
    ? (filteredStudentsData.reduce((acc, s) => acc + s.average, 0) / filteredStudentsData.length).toFixed(1)
    : '0.0';

  const totalExercises = isFiltered
    ? filteredStudentsData.length
    : classStats.reduce((acc, c) => acc + c.exercisesCount, 0);

  const activeActivityName = isFiltered ? selectedList : activityName;

  // Get recent 4 students as "Recent Activities"
  const recentStudents = [...filteredStudentsData].slice(0, 4);
  const activities = recentStudents.map(s => ({
    icon: 'assignment_turned_in',
    title: activeActivityName,
    subtitle: `${s.name} • Nota: ${s.average.toFixed(1)}`,
    color: 'bg-blue-50 text-blue-600'
  }));

  return (
    <div className="p-8 flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div>
        <h3 className="text-2xl font-bold text-[#111418] dark:text-white">Relatórios em Tempo Real</h3>
        <p className="text-[#617589] dark:text-slate-400">Análise pedagógica baseada na sua planilha do Google Drive.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 flex flex-col gap-2 rounded-xl p-6 border border-[#dbe0e6] dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <p className="text-[#617589] dark:text-slate-400 text-sm font-medium">Média Geral</p>
            <span className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded text-green-600 dark:text-green-400 material-symbols-outlined text-sm">trending_up</span>
          </div>
          <p className="text-[#111418] dark:text-white tracking-tight text-3xl font-bold">{overallAvg}%</p>
          <p className="text-slate-500 text-sm font-medium flex items-center gap-1">
            Média de todos os alunos
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 flex flex-col gap-2 rounded-xl p-6 border border-[#dbe0e6] dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <p className="text-[#617589] dark:text-slate-400 text-sm font-medium">Exercícios Realizados</p>
            <span className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 material-symbols-outlined text-sm">task_alt</span>
          </div>
          <p className="text-[#111418] dark:text-white tracking-tight text-3xl font-bold">{totalExercises.toLocaleString()}</p>
          <p className="text-primary text-sm font-medium flex items-center gap-1">
            Total de envios detectados
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 flex flex-col gap-2 rounded-xl p-6 border border-[#dbe0e6] dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <p className="text-[#617589] dark:text-slate-400 text-sm font-medium">Total de Alunos</p>
            <span className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded text-orange-600 dark:text-orange-400 material-symbols-outlined text-sm">groups</span>
          </div>
          <p className="text-[#111418] dark:text-white tracking-tight text-3xl font-bold">{students.length}</p>
          <p className="text-slate-500 text-sm font-medium flex items-center gap-1">
            Alunos ativos na planilha
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 flex flex-col gap-2 rounded-xl p-6 border border-[#dbe0e6] dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <p className="text-[#617589] dark:text-slate-400 text-sm font-medium">Total de Listas</p>
            <span className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded text-purple-600 dark:text-purple-400 material-symbols-outlined text-sm">format_list_bulleted</span>
          </div>
          <p className="text-[#111418] dark:text-white tracking-tight text-3xl font-bold">{listStats?.length || 0}</p>
          <p className="text-slate-500 text-sm font-medium flex items-center gap-1">
            Listas identificadas
          </p>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Evolution Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-[#dbe0e6] dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-[#111418] dark:text-white text-lg font-bold">Evolução da Nota Média</h4>
              <p className="text-sm text-[#617589]">Desempenho consolidado</p>
            </div>
          </div>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolutionData.length > 0 ? evolutionData : [{ month: 'Sem dados', score: 0 }]}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#137fec" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#137fec" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#617589', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#617589', fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="score" name="Média" stroke="#137fec" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#dbe0e6] dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-6">Últimos Lançamentos</h3>
          <div className="flex flex-col gap-6">
            {activities.length > 0 ? activities.map((activity, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className={`p-2.5 rounded-lg ${activity.color}`}>
                  <span className="material-symbols-outlined text-xl">{activity.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#111418] dark:text-white leading-tight">{activity.title}</p>
                  <p className="text-xs text-[#617589] mt-1">{activity.subtitle}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-400 italic">Nenhum envio recente.</p>
            )}
          </div>
        </div>
      </div>

      {/* Critical Students & Class Performance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Class Performance */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-[#dbe0e6] dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="flex justify-between items-center p-6 border-b border-[#f0f2f4] dark:border-slate-800">
            <h4 className="text-[#111418] dark:text-white text-lg font-bold">Desempenho por Turma</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f0f2f4] dark:bg-slate-800/50 text-[#617589] dark:text-slate-400 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-3">Turma</th>
                  <th className="px-6 py-3">Média</th>
                  <th className="px-6 py-3">Exercícios</th>
                  <th className="px-6 py-3">Alunos</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f4] dark:divide-slate-800">
                {classStats.map((stat) => (
                  <tr key={stat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#111418] dark:text-white">{stat.name}</span>
                        <span className="text-xs text-[#617589] dark:text-slate-400">{stat.period}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${stat.averageScore >= 8 ? 'text-green-600' : stat.averageScore >= 7 ? 'text-primary' : 'text-orange-600'}`}>
                        {stat.averageScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#111418] dark:text-slate-300">{stat.exercisesCount}</td>
                    <td className="px-6 py-4 text-sm text-[#111418] dark:text-slate-300">{stat.studentCount}</td>
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

        {/* Ranking / Students List */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-slate-800 rounded-xl p-6 flex flex-col gap-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-[#111418] dark:text-white text-lg font-bold">Ranking de Alunos</h4>
              <p className="text-[#617589] text-xs">Melhores médias na planilha</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {students.sort((a, b) => b.average - a.average).slice(0, 10).map((student) => (
              <div
                key={student.id}
                onClick={() => onStudentClick(student.id)}
                className="flex items-center justify-between p-3 rounded-lg border border-[#f0f2f4] dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all cursor-pointer"
              >
                <div className="flex gap-3 items-center">
                  <img src={student.avatar} className="size-10 rounded-full border-2 border-white shadow-sm" alt={student.name} />
                  <div className="truncate">
                    <p className="text-[#111418] dark:text-white text-sm font-bold leading-none">{student.name}</p>
                    <p className="text-[#617589] text-xs mt-1">Média: {student.average}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-primary">chevron_right</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
