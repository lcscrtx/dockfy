import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FileText, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export function Login() {
    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();

    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        if (isSignUp) {
            const { error } = await signUp(email, password);
            if (error) {
                setError(error);
            } else {
                setSuccessMessage('Conta criada! Verifique seu e-mail para confirmar o cadastro.');
            }
        } else {
            const { error } = await signIn(email, password);
            if (error) {
                setError(error);
            } else {
                navigate('/');
            }
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                        <FileText className="w-7 h-7 text-white" />
                    </div>
                    <span className="font-bold text-3xl tracking-tight text-slate-900">Dockfy</span>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
                        {isSignUp ? 'Criar Conta' : 'Entrar'}
                    </h2>
                    <p className="text-sm text-slate-500 text-center mb-8">
                        {isSignUp
                            ? 'Crie sua conta para começar a gerar contratos.'
                            : 'Acesse sua conta para gerenciar seus documentos.'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 font-medium">
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 font-medium">
                                {successMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    {isSignUp ? 'Criar Conta' : 'Entrar'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError(null);
                                setSuccessMessage(null);
                            }}
                            className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"
                        >
                            {isSignUp
                                ? 'Já tem uma conta? Entrar'
                                : 'Não tem conta? Criar agora'}
                        </button>
                    </div>
                </div>

                <p className="text-xs text-slate-400 text-center mt-6">
                    Ao continuar, você concorda com os Termos de Uso e Política de Privacidade.
                </p>
            </div>
        </div>
    );
}
