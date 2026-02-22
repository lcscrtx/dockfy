import { useNavigate } from 'react-router-dom';
import { Home, Briefcase, FileSignature, FileText, Building2, Wallet, FileCheck2, Handshake } from 'lucide-react';
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
    const templates = Object.values(schemaRegistry);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Bar (same pattern as Board/Dashboard) */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Galeria de Templates</h1>
                        <p className="text-xs text-slate-500">Escolha um modelo inteligente para começar a gerar seu documento.</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        </div>
    );
}
