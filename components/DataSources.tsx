import React, { useState } from 'react';

interface DataSourcesProps {
  sheetUrl: string;
  onConnect: (url: string) => void;
  activityName: string;
  onNameChange: (name: string) => void;
  targetActivities: number;
  onTargetChange: (target: number) => void;
}

const DataSources: React.FC<DataSourcesProps> = ({
  sheetUrl, onConnect, activityName, onNameChange, targetActivities, onTargetChange
}) => {
  const [url, setUrl] = useState(sheetUrl);

  return (
    <div className="p-8 flex flex-col gap-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h3 className="text-[#111418] dark:text-white text-3xl font-black leading-tight tracking-tight">Fonte de Dados Única</h3>
        <p className="text-[#617589] text-base">Conecte sua planilha do Google Drive para processamento automático.</p>
      </div>

      {/* Connection Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: 'share', title: '1. Compartilhar', desc: 'No Google Sheets, vá em Arquivo > Compartilhar > Publicar na web.' },
          { icon: 'csv', title: '2. Formato CSV', desc: 'Selecione "Valores separados por vírgulas (.csv)" no formato de exportação.' },
          { icon: 'link', title: '3. Copiar Link', desc: 'Clique em publicar, copie o link gerado e cole abaixo.' }
        ].map((step, i) => (
          <div key={i} className="p-4 bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-slate-800 rounded-xl">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-xl">{step.icon}</span>
            </div>
            <p className="font-bold text-sm dark:text-white mb-1">{step.title}</p>
            <p className="text-xs text-[#617589]">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Connect Card */}
      <div className="p-8 rounded-2xl shadow-sm bg-white dark:bg-slate-900 border border-[#dbe0e6] dark:border-slate-800 flex flex-col gap-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-3xl">add_link</span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#111418] dark:text-white">Conectar Planilha</h4>
            <p className="text-sm text-[#617589]">Insira o nome da atividade e o link público da planilha CSV.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-[#111418] dark:text-white mb-2">Título da Atividade</h4>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#617589] text-xl">label</span>
              <input
                value={activityName}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full rounded-xl text-[#111418] border border-[#dbe0e6] dark:border-slate-700 dark:bg-slate-800 dark:text-white h-14 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-slate-400"
                placeholder="Ex: Simulado de Geometria, Lista 02..."
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#111418] dark:text-white mb-2">Atividades Planejadas</h4>
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
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <h4 className="text-sm font-bold text-[#111418] dark:text-white mb-2">Link da Planilha (CSV)</h4>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#617589] text-xl">link</span>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-xl text-[#111418] border border-[#dbe0e6] dark:border-slate-700 dark:bg-slate-800 dark:text-white h-14 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-slate-400"
                placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
              />
            </div>
          </div>
          <button
            onClick={() => onConnect(url)}
            className="w-full md:w-auto h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">sync</span>
            <span>Sincronizar Agora</span>
          </button>
        </div>

        {sheetUrl && (
          <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-green-600">check_circle</span>
              <div>
                <p className="text-green-700 dark:text-green-400 text-sm font-bold">Conectado com sucesso</p>
                <p className="text-green-600 dark:text-green-500 text-xs truncate max-w-[300px]">{sheetUrl}</p>
              </div>
            </div>
            <button
              onClick={() => { setUrl(''); onConnect(''); }}
              className="text-red-500 text-xs font-bold hover:underline"
            >
              Desconectar
            </button>
          </div>
        )}
      </div>

      {/* Help Banner */}
      <div className="bg-gradient-to-br from-primary/10 to-blue-700/5 p-8 rounded-2xl border border-primary/20 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col gap-4">
          <h4 className="text-xl font-bold dark:text-white">Estrutura Sugerida para o Google Forms</h4>
          <p className="text-[#617589] max-w-2xl text-sm leading-relaxed">
            Para garantir a leitura correta, sugerimos que seu formulário tenha as seguintes perguntas na ordem (ou capture os campos):
            <br /><br />
            1. <strong>Timestamp</strong> (Automático) | 2. <strong>Email</strong> | 3. <strong>Nome Completo</strong> | 4. <strong>Turma</strong> | 5+ <strong>Questões</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataSources;
