import { useNavigate } from 'react-router-dom';
import { X, Home, Briefcase, FileSignature, FileText, Building2, Wallet, FileCheck2, Handshake } from 'lucide-react';
import { schemaRegistry } from '../config/schemas';
import type { ReactNode } from 'react';

const templateIcons: Record<string, ReactNode> = {
    compra_venda_imovel: <Home className="w-5 h-5" />,
    locacao_residencial: <Building2 className="w-5 h-5" />,
    locacao_comercial: <Briefcase className="w-5 h-5" />,
    proposta_compra: <Handshake className="w-5 h-5" />,
    autorizacao_venda: <FileSignature className="w-5 h-5" />,
    recibo_sinal: <Wallet className="w-5 h-5" />,
    termo_vistoria: <FileCheck2 className="w-5 h-5" />,
    admin_imobiliaria: <FileText className="w-5 h-5" />,
};

interface TemplateSelectorModalProps {
    taskTitle: string;
    taskId: string;
    onClose: () => void;
}

export function TemplateSelectorModal({ taskTitle, taskId, onClose }: TemplateSelectorModalProps) {
    const navigate = useNavigate();
    const templates = Object.values(schemaRegistry);

    const handleSelect = (templateId: string) => {
        // Navigate to wizard with task context in state
        navigate(`/wizard/${templateId}`, {
            state: { fromTaskId: taskId, taskTitle },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Converter em documento</h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Escolha o modelo para: <span className="font-medium text-slate-700">"{taskTitle}"</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors -mt-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Template Grid */}
                <div className="p-4 overflow-y-auto flex-1">
                    <div className="grid grid-cols-2 gap-3">
                        {templates.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => handleSelect(template.id)}
                                className="group flex flex-col p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left"
                            >
                                <span className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors w-fit mb-3">
                                    {templateIcons[template.id] || <FileText className="w-5 h-5" />}
                                </span>
                                <h4 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-2">{template.title}</h4>
                                <p className="text-xs text-slate-400 line-clamp-2">{template.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
