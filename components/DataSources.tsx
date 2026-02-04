import React from 'react';

interface DataSourcesProps {
  sheetUrl: string;
  onConnect: (url: string) => void;
  activityName: string;
  onNameChange: (name: string) => void;
  targetActivities: number;
  onTargetChange: (target: number) => void;
}

const DataSources: React.FC<DataSourcesProps> = ({
  activityName, onNameChange, targetActivities, onTargetChange
}) => {
  return (
    <div className="p-8 flex flex-col gap-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h3 className="text-[#111418] dark:text-white text-3xl font-black leading-tight tracking-tight">Configurações Gerais</h3>
        <p className="text-[#617589] text-base">Personalize os parâmetros de visualização do dashboard.</p>
      </div>

      {/* Settings Card */}
      <div className="p-8 rounded-2xl shadow-sm bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-slate-800 flex flex-col gap-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-3xl">tune</span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#111418] dark:text-white">Parâmetros</h4>
            <p className="text-sm text-[#617589]">Ajuste como os dados são calculados e exibidos.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-bold text-[#111418] dark:text-white mb-2">Meta de Atividades (Semestre)</h4>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#617589] text-xl">flag</span>
              <input
                type="number"
                min="1"
                value={targetActivities}
                onChange={(e) => onTargetChange(Number(e.target.value))}
                className="w-full rounded-xl text-[#111418] border border-[#dbe0e6] dark:border-slate-700 dark:bg-slate-800 dark:text-white h-14 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <p className="text-xs text-[#617589] mt-2">Usado para calcular a barra de progresso das turmas.</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#111418] dark:text-white mb-2">Nome do Período/Atividade</h4>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#617589] text-xl">label</span>
              <input
                value={activityName}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full rounded-xl text-[#111418] border border-[#dbe0e6] dark:border-slate-700 dark:bg-slate-800 dark:text-white h-14 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-slate-400"
                placeholder="Ex: 1º Bimestre"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20 rounded-xl flex items-center gap-3">
        <span className="material-symbols-outlined text-blue-600">info</span>
        <p className="text-blue-700 dark:text-blue-400 text-sm">
          Os dados são carregados automaticamente do sistema de Quizzes Nativos. Não é necessário conectar planilhas externas.
        </p>
      </div>

    </div>
  );
};

export default DataSources;
