
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StudentDetail from './components/StudentDetail';
import DataSources from './components/DataSources';
import ClassesView from './components/ClassesView';
import ReportsView from './components/ReportsView';
import { ViewState, Student, ClassStats } from './types';
import { fetchSheetData, processStats } from './services/googleSheets';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    students: Student[],
    classStats: ClassStats[],
    evolutionData: any[]
  } | null>(null);

  // You can replace this with your actual Google Sheets Published CSV URL
  const [sheetUrl, setSheetUrl] = useState(localStorage.getItem('sheetUrl') || '');
  const [activityName, setActivityName] = useState(localStorage.getItem('activityName') || 'Atividade de Matemática');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (sheetUrl) {
      loadData(sheetUrl);
    }
  }, [sheetUrl]);

  const loadData = async (url: string) => {
    setLoading(true);
    try {
      const rawData = await fetchSheetData(url);
      const { students, classStats, evolutionData } = processStats(rawData);
      setData({ students, classStats, evolutionData });
      localStorage.setItem('sheetUrl', url);
    } catch (error) {
      alert('Erro ao carregar dados da planilha. Verifique se ela está publicada como CSV.');
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (name: string) => {
    setActivityName(name);
    localStorage.setItem('activityName', name);
  };

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const handleStudentClick = (id: string) => {
    setSelectedStudentId(id);
    setCurrentView('student-detail');
  };

  const renderContent = () => {
    if (loading) return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-[#617589] font-medium">Sincronizando com Google Drive...</p>
      </div>
    );

    if (!sheetUrl && currentView !== 'data-sources') {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-4">
          <span className="material-symbols-outlined text-6xl text-primary/40">database</span>
          <h3 className="text-xl font-bold dark:text-white">Nenhuma fonte de dados conectada</h3>
          <p className="text-[#617589] max-w-md">Para começar, conecte o link da sua planilha do Google nas configurações.</p>
          <button
            onClick={() => setCurrentView('data-sources')}
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            Configurar Conexão
          </button>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard
          onStudentClick={handleStudentClick}
          students={data?.students || []}
          classStats={data?.classStats || []}
          activityName={activityName}
          evolutionData={data?.evolutionData || []}
        />;
      case 'classes':
        return <ClassesView
          classStats={data?.classStats || []}
          students={data?.students || []}
          onStudentClick={handleStudentClick}
        />;
      case 'reports':
        return <ReportsView
          classStats={data?.classStats || []}
          students={data?.students || []}
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
          onConnect={loadData}
          activityName={activityName}
          onNameChange={handleNameChange}
        />;
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

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden w-full">
      <Sidebar currentView={currentView} setView={setCurrentView} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentView={currentView}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
