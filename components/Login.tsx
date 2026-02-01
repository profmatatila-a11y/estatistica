import React, { useState } from 'react';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Check credentials provided by the user
        if (email === 'oliveiraatila@yahoo.com.br' && password === '@Lilika18#') {
            localStorage.setItem('isAuthenticated', 'true');
            onLogin();
        } else {
            setError('Credenciais incorretas. Tente novamente.');
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-[#dbe0e6] dark:border-slate-800 p-8 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="bg-primary rounded-2xl size-14 flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/30">
                        <span className="material-symbols-outlined text-3xl filled">functions</span>
                    </div>
                    <h2 className="text-2xl font-black text-[#111418] dark:text-white uppercase tracking-tight">Painel do Professor</h2>
                    <p className="text-[#617589] dark:text-slate-400 mt-2 text-sm">Entre com suas credenciais de administrador</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#617589] uppercase tracking-wider ml-1">Email</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">person</span>
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-[#dbe0e6] dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#617589] uppercase tracking-wider ml-1">Senha</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-[#dbe0e6] dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 p-3 rounded-xl flex items-center gap-3 animate-shake">
                            <span className="material-symbols-outlined text-red-500 text-lg">error</span>
                            <p className="text-red-600 dark:text-red-400 text-xs font-bold">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/30 mt-2 text-base"
                    >
                        Acessar Painel
                    </button>
                </form>

                <div className="mt-10 border-t border-slate-100 dark:border-slate-800 pt-6 text-center">
                    <p className="text-[#617589] text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                        Sistema de Gestão de Desempenho Matemático <br />
                        <span className="text-primary/60">Versão de Administrador Autorizado</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
