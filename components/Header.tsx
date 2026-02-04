
import React from 'react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  selectedClass: string;
  onClassChange: (cls: string) => void;
  availableClasses: string[];
}

const Header: React.FC<HeaderProps> = ({
  currentView,
  isDarkMode,
  toggleDarkMode,
  selectedClass,
  onClassChange,
  availableClasses
}) => {
  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard de Desempenho';
      case 'list-stats': return 'Estatísticas por Quiz';
      case 'questions': return 'Análise de Itens';
      case 'student-detail': return 'Perfil Individual';
      case 'data-sources': return 'Configurações';
      case 'quiz-list': return 'Meus Quizzes';
      case 'quiz-builder': return 'Criador de Quiz';
      default: return 'Visão Geral';
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-[#f0f2f4] dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 py-4 sticky top-0 z-10 transition-colors shrink-0">
      <div className="flex items-center gap-4 text-[#111418] dark:text-white">
        <div className="p-2 bg-primary/5 rounded-lg">
          <span className="material-symbols-outlined text-primary filled">analytics</span>
        </div>
        <div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">{getTitle()}</h2>
          {selectedClass !== 'Todas as Turmas' && (
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest animate-in slide-in-from-top-1">
              Turma: {selectedClass}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 justify-end gap-4 items-center">
        {/* Class Filter */}
        <div className="hidden md:flex items-center gap-2 bg-[#f0f2f4] dark:bg-slate-800 rounded-lg px-3 h-10 border border-transparent focus-within:border-primary/30 transition-all">
          <span className="material-symbols-outlined text-[#617589] text-xl">filter_list</span>
          <select
            value={selectedClass}
            onChange={(e) => onClassChange(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-sm font-bold text-[#111418] dark:text-white cursor-pointer min-w-[120px] max-w-[200px]"
          >
            {availableClasses.map(cls => (
              <option key={cls} value={cls} className="dark:bg-slate-900">{cls}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center rounded-lg h-10 w-10 bg-[#f0f2f4] dark:bg-slate-800 text-[#111418] dark:text-white hover:bg-primary/10 transition-colors"
            title="Alternar Tema"
          >
            <span className="material-symbols-outlined">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
