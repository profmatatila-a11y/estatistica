
import React, { useState } from 'react';
import { DATA_SOURCES } from '../mockData';

const DataSources: React.FC = () => {
  const [url, setUrl] = useState('');

  return (
    <div className="p-8 flex flex-col gap-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h3 className="text-[#111418] dark:text-white text-3xl font-black leading-tight tracking-tight">Fontes de Dados</h3>
        <p className="text-[#617589] text-base">Gerencie suas planilhas do Google Drive para processamento estatístico.</p>
      </div>

      {/* Connect Card */}
      <div className="p-8 rounded-2xl shadow-sm bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-slate-800">
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-3xl">add_link</span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#111418] dark:text-white">Conectar nova planilha</h4>
            <p className="text-sm text-[#617589]">Cole a URL do Google Sheets para importar novos dados de turmas.</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="text-[#111418] dark:text-white text-sm font-bold mb-2 block">Link do Google Sheets</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#617589] text-xl">link</span>
              <input 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-xl text-[#111418] border border-[#dbe0e6] dark:border-slate-700 dark:bg-slate-800 dark:text-white h-14 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-slate-400" 
                placeholder="https://docs.google.com/spreadsheets/d/..."
              />
            </div>
          </div>
          <button className="w-full md:w-auto h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">sync</span>
            <span>Conectar</span>
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-[#617589] bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg">
          <span className="material-symbols-outlined text-sm text-primary">info</span>
          <p>A planilha deve ter permissão de leitura para "Qualquer pessoa com o link".</p>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary filled">cloud_done</span>
            Fontes Conectadas
          </h4>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{DATA_SOURCES.length} Ativas</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {DATA_SOURCES.map((source) => (
            <div key={source.id} className={`flex flex-col md:flex-row items-center gap-4 p-5 bg-white dark:bg-slate-900 border rounded-2xl hover:shadow-md transition-all ${
              source.status === 'error' ? 'border-red-200 bg-red-50/20 dark:border-red-900/30' : 'border-[#dbe0e6] dark:border-slate-800'
            }`}>
              <div className={`h-14 w-14 flex items-center justify-center rounded-xl shrink-0 ${
                source.status === 'synced' ? 'bg-green-50 text-green-600' : 
                source.status === 'processing' ? 'bg-blue-50 text-primary' : 'bg-red-50 text-red-600'
              }`}>
                <span className={`material-symbols-outlined text-3xl ${source.status === 'processing' ? 'animate-spin' : ''}`}>
                  {source.status === 'synced' ? 'check_circle' : 
                   source.status === 'processing' ? 'sync' : 'warning'}
                </span>
              </div>

              <div className="flex-1 text-center md:text-left truncate">
                <p className="text-base font-bold dark:text-white truncate">{source.name}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-1 text-xs text-[#617589]">
                  <span className={`font-bold ${source.status === 'synced' ? 'text-green-600' : source.status === 'processing' ? 'text-primary' : 'text-red-600'}`}>
                    {source.status === 'synced' ? 'Sincronizado' : source.status === 'processing' ? 'Processando...' : 'Erro'}
                  </span>
                  <span>•</span>
                  <span>{source.lastSync}</span>
                  {source.rows > 0 && (
                    <>
                      <span>•</span>
                      <span>{source.rows.toLocaleString()} linhas</span>
                    </>
                  )}
                </div>
                {source.errorMsg && <p className="text-[10px] text-red-500 mt-1 font-bold italic">{source.errorMsg}</p>}
              </div>

              <div className="flex gap-2">
                <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                  <span className="material-symbols-outlined">refresh</span>
                </button>
                <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Banner */}
      <div className="bg-gradient-to-br from-primary to-blue-700 p-8 rounded-2xl text-white relative overflow-hidden group">
        <div className="relative z-10 flex flex-col gap-4">
          <h4 className="text-xl font-bold">Precisa de ajuda com a integração?</h4>
          <p className="text-white/80 max-w-md text-sm leading-relaxed">
            Consulte nossos tutoriais sobre como estruturar suas planilhas para garantir a leitura correta dos dados pelo sistema.
          </p>
          <button className="bg-white text-primary w-fit px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">menu_book</span>
            Documentação
          </button>
        </div>
        <span className="material-symbols-outlined absolute right-[-20px] bottom-[-20px] text-[240px] opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700">
          drive_file_move
        </span>
      </div>
    </div>
  );
};

export default DataSources;
