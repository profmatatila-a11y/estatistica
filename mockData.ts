
import { Student, Activity, ClassStats, DataSource } from './types';

export const STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    avatar: 'https://picsum.photos/seed/carlos/100/100',
    class: '3º Ano A',
    average: 5.8,
    trend: -18,
    exercisesDone: 34,
    completionRate: 65,
    recentDrop: 18
  },
  {
    id: '2',
    name: 'Ana Oliveira',
    avatar: 'https://picsum.photos/seed/ana/100/100',
    class: '1º Ano C',
    average: 6.5,
    trend: -12,
    exercisesDone: 42,
    completionRate: 78,
    recentDrop: 12
  },
  {
    id: '3',
    name: 'Pedro Santos',
    avatar: 'https://picsum.photos/seed/pedro/100/100',
    class: '2º Ano B',
    average: 6.1,
    trend: -15,
    exercisesDone: 28,
    completionRate: 54,
    recentDrop: 15
  },
  {
    id: '4',
    name: 'Juliana Lima',
    avatar: 'https://picsum.photos/seed/juliana/100/100',
    class: '3º Ano B',
    average: 9.0,
    trend: -10,
    exercisesDone: 50,
    completionRate: 98,
    recentDrop: 10
  }
];

export const ACTIVITIES: Activity[] = [
  { id: '1', title: 'Lista de Logaritmos', class: '3º Ano B', timestamp: 'Postado há 2h', type: 'exercise' },
  { id: '2', title: 'Correção Automática', class: '1º Ano A', timestamp: '24 alunos concluíram', type: 'correction' },
  { id: '3', title: 'Alerta de Desempenho', class: '2º Ano C', timestamp: 'Baixa média em Geometria', type: 'alert' },
  { id: '4', title: 'Simulado ENEM', class: 'Geral', timestamp: 'Novo arquivo detectado', type: 'exam' }
];

export const CLASS_STATS: ClassStats[] = [
  { id: '1', name: '3º Ano A', period: 'Matutino', studentCount: 32, averageScore: 8.4, exercisesCount: 452, progress: 85 },
  { id: '2', name: '1º Ano C', period: 'Vespertino', studentCount: 28, averageScore: 7.2, exercisesCount: 312, progress: 65 },
  { id: '3', name: '2º Ano B', period: 'Matutino', studentCount: 30, averageScore: 6.8, exercisesCount: 289, progress: 52 }
];

export const DATA_SOURCES: DataSource[] = [
  { id: '1', name: 'Notas_Finais_2023_S1.xlsx', status: 'synced', lastSync: 'há 15 min', rows: 4250 },
  { id: '2', name: 'Frequencia_Mensal_Escolas.csv', status: 'processing', lastSync: 'há 2 dias', rows: 12800 },
  { id: '3', name: 'Pesquisa_Docente_2022.xlsx', status: 'error', lastSync: 'Expirado', rows: 0, errorMsg: 'Link expirado ou privado' }
];

export const EVOLUTION_DATA = [
  { month: 'Fev', score: 7.2 },
  { month: 'Mar', score: 7.4 },
  { month: 'Abr', score: 7.1 },
  { month: 'Mai', score: 7.5 },
  { month: 'Jun', score: 7.3 },
  { month: 'Jul', score: 7.8 },
];

export const COMPETENCY_DATA = [
  { subject: 'Lógica', value: 85 },
  { subject: 'Leitura', value: 70 },
  { subject: 'Escrita', value: 90 },
  { subject: 'Cálculo', value: 65 },
  { subject: 'Geometria', value: 80 },
];
