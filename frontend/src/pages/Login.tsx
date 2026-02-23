import { useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export function Login() {
    const { signIn, signUp } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            if (isSignUp) {
                const { error: signUpError } = await signUp(email, password);
                if (signUpError) {
                    setError(signUpError);
                } else {
                    setSuccess("Conta criada! Verifique seu e-mail.");
                    setIsSignUp(false);
                }
            } else {
                const { error: signInError } = await signIn(email, password);
                if (signInError) {
                    setError(signInError);
                }
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Erro ao autenticar.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-canvas relative overflow-hidden flex flex-col items-center justify-center px-4">
            <div className="absolute -top-24 -left-20 w-[520px] h-[520px] rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-28 -right-24 w-[480px] h-[480px] rounded-full bg-blue-800/10 blur-3xl pointer-events-none" />

            {/* Brand */}
            <div className="mb-8 flex items-center gap-2 text-text-primary font-bold text-2xl tracking-tight relative z-10">
                <img
                    src="/logo-elia.svg"
                    alt="elia"
                    className="w-9 h-9 rounded-lg shadow-low"
                />
                elia
            </div>

            <div className="w-full max-w-sm bg-white/95 backdrop-blur rounded-2xl shadow-mid border border-base overflow-hidden relative z-10">
                <div className="px-8 py-8">
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-text-primary tracking-tight">
                            {isSignUp ? "Criar conta" : "Acesse sua conta"}
                        </h2>
                        <p className="text-sm text-text-tertiary mt-1">
                            {isSignUp ? "Preencha seus dados para começar." : "Bem-vindo de volta ao elia."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-700 text-sm font-medium px-4 py-3 rounded-lg border border-red-100 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-emerald-50 text-emerald-700 text-sm font-medium px-4 py-3 rounded-lg border border-emerald-100 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                                {success}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-text-secondary">E-mail corporativo</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                                <input
                                    type="email"
                                    placeholder="exemplo@empresa.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full h-11 pl-10 pr-4 bg-[var(--color-surface-subtle)] border border-base rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-low"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-text-secondary">Senha</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full h-11 pl-10 pr-4 bg-[var(--color-surface-subtle)] border border-base rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-low"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-low active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    {isSignUp ? "Criar conta" : "Entrar"}
                                    <ArrowRight size={16} strokeWidth={2.5} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-[var(--color-surface-subtle)] border-t border-base px-8 py-5 text-center">
                    <p className="text-sm text-text-secondary">
                        {isSignUp ? "Já tem uma conta?" : "Ainda não tem conta?"}{" "}
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError("");
                                setSuccess("");
                            }}
                            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            {isSignUp ? "Entrar" : "Criar uma agora"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
