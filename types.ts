
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
  history: { month: string; score: number; listName?: string }[];
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

export interface ListStats {
  id: string;
  name: string;
  averageScore: number;
  submissionCount: number;
}

export interface AnswerDistribution {
  answer: string;
  count: number;
  percentage: number;
}

export interface QuestionStat {
  id: string;
  title: string;
  listName: string;
  totalAnswers: number;
  distribution: AnswerDistribution[];
  mostCommonAnswer: string;
  suggestedCorrect?: string;
  isQuiz?: boolean;
}


export interface Quiz {
  id: string;
  title: string;
  description?: string;
  custom_header?: string; // "Dizeres" customizáveis
  target_class?: string;
  is_active: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  text: string; // HTML allowed from Rich Text
  image_url?: string;
  type: 'multiple_choice' | 'text';
  points: number;
  options?: { label: string; text: string; isCorrect: boolean }[];
  correct_answer?: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  student_name?: string;
  student_email: string;
  start_time: string;
  end_time?: string;
  score?: number;
  status: 'in_progress' | 'completed';
}

export type ViewState = 'dashboard' | 'classes' | 'students' | 'student-detail' | 'list-stats' | 'questions' | 'data-sources' | 'reports' | 'quiz-builder' | 'quiz-list' | 'quiz-results';

