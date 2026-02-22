import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, Briefcase, FileSignature, FileText, Building2, Wallet, FileCheck2, Handshake } from 'lucide-react';
import { schemaRegistry } from '../config/schemas';

// Map icons to template IDs locally for the UI
const templateIcons: Record<string, React.ReactNode> = {
    compra_venda_imovel: <Home className="w-6 h-6" />,
    locacao_residencial: <Building2 className="w-6 h-6" />,
    locacao_comercial: <Briefcase className="w-6 h-6" />,
    proposta_compra: <Handshake className="w-6 h-6" />,
    autorizacao_venda: <FileSignature className="w-6 h-6" />,
    recibo_sinal: <Wallet className="w-6 h-6" />,
    termo_vistoria: <FileCheck2 className="w-6 h-6" />,
    admin_imobiliaria: <FileText className="w-6 h-6" />
};

export function Templates() {
    const navigate = useNavigate();
    // Get all schemas as an array
    const templates = Object.values(schemaRegistry);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center pt-10 pb-20 px-4">
            <div className="w-full max-w-6xl mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6 flex items-center gap-1"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Voltar ao Dashboard
                </button>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Galeria de Templates</h1>
                <p className="text-slate-500 mt-1">Escolha um modelo inteligente para começar a gerar seu documento.</p>
            </div>

            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {templates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => navigate(`/wizard/${template.id}`)}
                        className="group flex flex-col p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-800 hover:shadow-lg transition-all text-left h-full shadow-sm"
                    >
                        <div className="flex justify-between items-center w-full mb-6 relative">
                            <span className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                {templateIcons[template.id] || <FileText className="w-6 h-6" />}
                            </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-2">{template.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-3">
                            {template.description}
                        </p>
                        <div className="mt-auto pt-6 text-sm font-semibold text-slate-400 group-hover:text-slate-900 transition-colors flex items-center">
                            Usar Template &rarr;
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
