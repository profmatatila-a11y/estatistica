
export interface Student {
  id: string;
  name: string;
  avatar: string;
  class: string;
  average: number;
  trend: number;
  exercisesDone: number;
  completionRate: number;
  recentDrop?: number;
  history: { month: string; score: number }[];
}

export interface Activity {
  id: string;
  title: string;
  class: string;
  timestamp: string;
  type: 'exercise' | 'correction' | 'alert' | 'exam';
}

export interface ClassStats {
  id: string;
  name: string;
  period: string;
  studentCount: number;
  averageScore: number;
  exercisesCount: number;
  progress: number;
}

export interface DataSource {
  id: string;
  name: string;
  status: 'synced' | 'processing' | 'error';
  lastSync: string;
  rows: number;
  errorMsg?: string;
}

export type ViewState = 'dashboard' | 'classes' | 'students' | 'student-detail' | 'data-sources' | 'reports';
