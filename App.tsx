
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StudentDetail from './components/StudentDetail';
import DataSources from './components/DataSources';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onStudentClick={() => setCurrentView('student-detail')} />;
      case 'student-detail':
        return <StudentDetail />;
      case 'data-sources':
        return <DataSources />;
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
