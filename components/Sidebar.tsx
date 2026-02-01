
import React from 'react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'classes', label: 'Turmas', icon: 'group' },
    { id: 'list-stats', label: 'Listas', icon: 'format_list_bulleted' },
    { id: 'questions', label: 'Itens (Questões)', icon: 'rule' },
    { id: 'reports', label: 'Relatórios', icon: 'analytics' },
    { id: 'students', label: 'Alunos', icon: 'school' },
    { id: 'data-sources', label: 'Fontes de Dados', icon: 'database' },
  ];

  return (
    <aside className="w-64 border-r border-[#dbe0e6] dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0 flex flex-col justify-between p-4 shrink-0 transition-all z-20 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col gap-6">
        {/* Brand */}
        <div className="flex gap-3 items-center">
          <div className="bg-primary rounded-lg size-10 flex items-center justify-center text-white">
            <span className="material-symbols-outlined filled">functions</span>
          </div>
          <div className="flex flex-col truncate">
            <h1 className="text-[#111418] dark:text-white text-base font-bold leading-tight">Matemática</h1>
            <p className="text-[#617589] text-xs font-normal truncate">atiladeoliveira.com.br</p>
          </div>
        </div>

        {/* External Website Link */}
        <a
          href="https://atiladeoliveira.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-3 bg-primary/5 hover:bg-primary/10 text-primary rounded-xl transition-all border border-primary/10 mt-2 mb-4 group"
        >
          <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">language</span>
          <span className="text-sm font-bold">Meu Web Site</span>
          <span className="material-symbols-outlined text-xs ml-auto opacity-50">open_in_new</span>
        </a>

        {/* User Card */}
        <div className="flex gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl items-center">
          <img
            src="https://ui-avatars.com/api/?name=Prof+Atila&background=137fec&color=fff&bold=true"
            className="size-10 rounded-full border border-primary/20"
            alt="Prof"
          />
          <div className="flex flex-col truncate">
            <p className="text-sm font-bold truncate dark:text-white">Prof. Átila Oliveira</p>
            <p className="text-[10px] text-slate-500 truncate uppercase tracking-wider">Administrador</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${currentView === item.id
                ? 'bg-primary/10 text-primary font-semibold'
                : 'hover:bg-primary/5 hover:text-primary/80 text-[#617589] dark:text-slate-400 font-medium'
                }`}
            >
              {currentView === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full" />
              )}
              <span className={`material-symbols-outlined ${currentView === item.id ? 'filled' : ''}`}>
                {item.icon}
              </span>
              <p className="text-sm">{item.label}</p>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        {/* Cloud Status */}
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/20">
          <span className="material-symbols-outlined text-green-600">cloud_done</span>
          <div className="flex flex-col">
            <p className="text-green-700 dark:text-green-400 text-xs font-bold">Google Drive Sync</p>
            <p className="text-green-600 dark:text-green-500 text-[10px]">Atualizado agora</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2 border-t border-[#f0f2f4] dark:border-slate-800 pt-4 text-[#617589] hover:text-red-500 transition-colors w-full"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          <span className="text-sm font-medium">Sair da Conta</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
