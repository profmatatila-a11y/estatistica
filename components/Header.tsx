
import React from 'react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, isDarkMode, toggleDarkMode }) => {
  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard de Desempenho';
      case 'list-stats': return 'Estatísticas por Lista';
      case 'questions': return 'Análise de Itens (Questões)';
      case 'student-detail': return 'Perfil Individual do Aluno';
      case 'data-sources': return 'Configuração de Fontes de Dados';
      default: return 'Painel de Controle';
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-[#f0f2f4] dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 py-4 sticky top-0 z-10 transition-colors shrink-0">
      <div className="flex items-center gap-4 text-[#111418] dark:text-white">
        <div className="p-2 bg-primary/5 rounded-lg">
          <span className="material-symbols-outlined text-primary filled">analytics</span>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-tight">{getTitle()}</h2>
      </div>

      <div className="flex flex-1 justify-end gap-6 items-center">
        <label className="flex flex-col w-full max-w-xs group">
          <div className="flex w-full items-stretch rounded-lg h-10 bg-[#f0f2f4] dark:bg-slate-800 group-focus-within:ring-2 ring-primary/20 transition-all">
            <div className="text-[#617589] flex items-center justify-center pl-4">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input
              className="w-full bg-transparent border-none focus:ring-0 text-[#111418] dark:text-white placeholder:text-[#617589] px-4 text-sm"
              placeholder="Buscar aluno ou turma..."
            />
          </div>
        </label>

        <div className="flex gap-2">
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center rounded-lg h-10 w-10 bg-[#f0f2f4] dark:bg-slate-800 text-[#111418] dark:text-white hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button className="relative flex items-center justify-center rounded-lg h-10 w-10 bg-[#f0f2f4] dark:bg-slate-800 text-[#111418] dark:text-white hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
          </button>
        </div>

        <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95">
          <span className="material-symbols-outlined text-sm">sync</span>
          <span className="hidden sm:inline">Sincronizar Google Drive</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
