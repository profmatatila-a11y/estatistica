
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StudentDetail from './components/StudentDetail';
import DataSources from './components/DataSources';
import ClassesView from './components/ClassesView';
import ReportsView from './components/ReportsView';
import StudentsView from './components/StudentsView';
import Login from './components/Login';
import { ViewState, Student, ClassStats, ListStats, QuestionStat } from './types';
import ListStatsView from './components/ListStatsView';
import QuestionsAnalysisView from './components/QuestionsAnalysisView';
import { QuizList } from './components/Quiz/QuizList';
import { QuizBuilder } from './components/Quiz/QuizBuilder';
import { QuizTaker } from './components/Quiz/QuizTaker';
import { QuizResults } from './components/Quiz/QuizResults';
import { statsService } from './services/statsService';
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [viewingQuizId, setViewingQuizId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    students: Student[],
    classStats: ClassStats[],
    evolutionData: any[],
    listStats: ListStats[],
    questionStats: QuestionStat[]
  } | null>(null);

  // Check for Public Quiz URL
  const queryParams = new URLSearchParams(window.location.search);
  const publicQuizId = queryParams.get('quizId');

  // You can replace this with your actual Google Sheets Published CSV URL
  const [sheetUrl, setSheetUrl] = useState(localStorage.getItem('sheetUrl') || '');
  const [activityName, setActivityName] = useState(localStorage.getItem('activityName') || 'Atividade de Matemática');
  const [targetActivities, setTargetActivities] = useState(Number(localStorage.getItem('targetActivities')) || 5);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Load stats from Supabase
    if (!publicQuizId) {
      loadData(targetActivities);
    }
  }, [targetActivities, publicQuizId]);

  const loadData = async (target: number = 5) => {
    setLoading(true);
    try {
      const processed = await statsService.fetchAllStats(target);
      setData(processed);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (url: string) => {
    loadData(targetActivities);
  };

  const handleNameChange = (name: string) => {
    setActivityName(name);
    localStorage.setItem('activityName', name);
  };

  const handleTargetChange = (target: number) => {
    setTargetActivities(target);
    localStorage.setItem('targetActivities', String(target));
  };

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const handleStudentClick = (id: string) => {
    setSelectedStudentId(id);
    setCurrentView('student-detail');
  };

  const [selectedClass, setSelectedClass] = useState<string>('Todas as Turmas');

  const availableClasses = useMemo(() => {
    if (!data) return ['Todas as Turmas'];
    // Extract unique classes from classStats for consistency
    const classes = data.classStats.map(c => c.name).sort();
    return ['Todas as Turmas', ...classes];
  }, [data]);

  const renderContent = () => {
    if (loading) return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-[#617589] font-medium">Iniciando Sistema...</p>
      </div>
    );

    switch (currentView) {
      case 'dashboard':
        return <Dashboard
          onStudentClick={handleStudentClick}
          students={data?.students || []}
          classStats={data?.classStats || []}
          activityName={activityName}
          evolutionData={data?.evolutionData || []}
          listStats={data?.listStats || []}
          selectedClass={selectedClass}
        />;
      case 'classes':
        return <ClassesView
          classStats={data?.classStats || []}
          students={data?.students || []}
          onStudentClick={handleStudentClick}
          targetActivities={targetActivities}
        />;
      case 'reports':
        return <ReportsView
          classStats={data?.classStats || []}
          students={data?.students || []}
        />;
      case 'list-stats':
        return <ListStatsView listStats={data?.listStats || []} />;
      case 'questions':
        // Show all questions for now, or filter by quiz if we add that later
        return <QuestionsAnalysisView questionStats={data?.questionStats || []} />;
      case 'students':
        return <StudentsView
          students={data?.students || []}
          onStudentClick={handleStudentClick}
        />;
      case 'student-detail':
        const student = data?.students.find(s => s.id === selectedStudentId);
        return <StudentDetail
          student={student}
          onBack={() => setCurrentView('dashboard')}
        />;
      case 'data-sources':
        return <DataSources
          sheetUrl={sheetUrl}
          onConnect={handleConnect}
          activityName={activityName}
          onNameChange={handleNameChange}
          targetActivities={targetActivities}
          onTargetChange={handleTargetChange}
        />;
      case 'quiz-list':
        return <QuizList
          selectedClass={selectedClass}
          onEdit={(id) => {
            setEditingQuizId(id);
            setCurrentView('quiz-builder');
          }}
          onCreateNew={() => {
            setEditingQuizId(null);
            setCurrentView('quiz-builder');
          }}
          onViewResults={(id) => {
            setViewingQuizId(id);
            setCurrentView('quiz-results');
          }}
        />;
      case 'quiz-builder':
        return <QuizBuilder
          editingQuizId={editingQuizId}
          onCancel={() => setCurrentView('quiz-list')}
          onSuccess={() => setCurrentView('quiz-list')}
        />;
      case 'quiz-results':
        return <QuizResults
          quizId={viewingQuizId || ''}
          onBack={() => setCurrentView('quiz-list')}
        />;
      case 'student-quiz-menu':
        return <QuizTaker userEmail="aluno_teste@exemplo.com" />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-[#617589]">
            <span className="material-symbols-outlined text-6xl mb-4">construction</span>
            <p className="text-xl font-medium">Esta seção está em desenvolvimento.</p>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="mt-4 text-primary font-bold hover:underline"
            >
              Voltar ao Dashboard
            </button>
          </div>
        );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  // PUBLIC QUIZ ROUTE - Bypass Authentication
  if (publicQuizId) {
    return <QuizTaker quizId={publicQuizId} />;
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden w-full">
      <Sidebar currentView={currentView} setView={setCurrentView} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentView={currentView}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
          availableClasses={availableClasses}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
