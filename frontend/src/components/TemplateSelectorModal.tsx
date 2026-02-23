import { useNavigate } from "react-router-dom";
import {
    XMarkIcon,
    DocumentTextIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { schemaRegistry } from "../config/schemas";
import { useTemplateStore } from "../store/templateStore";
import { useEffect } from "react";

interface TemplateSelectorModalProps {
    taskTitle: string;
    taskId: string;
    onClose: () => void;
}

export function TemplateSelectorModal({
    taskTitle,
    taskId,
    onClose,
}: TemplateSelectorModalProps) {
    const navigate = useNavigate();
    const { customTemplates, fetchTemplates } = useTemplateStore();

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    const builtinSchemas = Object.values(schemaRegistry);

    const handleSelectBuiltin = (schemaId: string) => {
        navigate(`/wizard/${schemaId}?task=${taskId}`);
        onClose();
    };

    const handleSelectCustom = (templateId: string) => {
        navigate(`/wizard/custom?templateId=${templateId}&task=${taskId}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 overflow-hidden border border-base">
                <div className="px-6 py-4 border-b border-base flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary">
                            Gerar Documento para Tarefa
                        </h2>
                        <p className="text-xs text-text-tertiary mt-0.5 truncate">
                            Tarefa: {taskTitle}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn-icon"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-4 max-h-[60vh] overflow-y-auto space-y-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Templates base
                    </p>
                    {builtinSchemas.map((schema) => (
                        <button
                            key={schema.id}
                            onClick={() => handleSelectBuiltin(schema.id)}
                            className="w-full flex items-center gap-4 p-4 rounded-lg border border-base hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 flex-shrink-0 shadow-low">
                                <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-text-primary group-hover:text-blue-700 transition-colors">
                                    {schema.title}
                                </p>
                                <p className="text-xs text-text-tertiary line-clamp-1">
                                    {schema.description}
                                </p>
                            </div>
                            <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                        </button>
                    ))}

                    {customTemplates.length > 0 && (
                        <>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-3">
                                Meus modelos
                            </p>
                            {customTemplates.map((tmpl) => (
                                <button
                                    key={tmpl.id}
                                    onClick={() => handleSelectCustom(tmpl.id)}
                                    className="w-full flex items-center gap-4 p-4 rounded-lg border border-base hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 flex-shrink-0 shadow-low">
                                        <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-text-primary group-hover:text-blue-700 transition-colors">
                                            {tmpl.title}
                                        </p>
                                        <p className="text-xs text-text-tertiary line-clamp-1">
                                            {tmpl.description || "Modelo personalizado"}
                                        </p>
                                    </div>
                                    <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                                </button>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
