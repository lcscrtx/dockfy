import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDocumentStore } from "../store/documentStore";
import { useVersionStore, type DocumentVersion } from "../store/versionStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    ArrowLeft as ArrowLeftIcon,
    RefreshCw as ArrowPathIcon,
    PenSquare as PencilSquareIcon,
    Check as CheckIcon,
    X as XMarkIcon,
    Copy as DocumentDuplicateIcon,
    Trash2 as TrashIcon,
    Download as ArrowDownTrayIcon,
    Printer as PrinterIcon,
    Clock as ClockIcon,
} from "lucide-react";

export function DocumentDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        documents,
        loading,
        fetchDocuments,
        updateDocumentContent,
        updateDocumentStatus,
        duplicateDocument,
        deleteDocument,
    } = useDocumentStore();
    const { versions, loading: versionsLoading, fetchVersions } =
        useVersionStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");
    const [showVersions, setShowVersions] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    useEffect(() => {
        if (id) {
            fetchVersions(id);
        }
    }, [id, fetchVersions]);

    const doc = documents.find((d) => d.id === id);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <ArrowPathIcon className="w-8 h-8 animate-spin text-text-tertiary" />
            </div>
        );
    }

    if (!doc) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-text-tertiary mb-4">Documento não encontrado.</p>
                <button
                    onClick={() => navigate("/")}
                    className="text-blue-600 hover:underline text-sm font-medium"
                >
                    ← Voltar
                </button>
            </div>
        );
    }

    const handleStartEdit = () => {
        setEditContent(doc.markdown_content);
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        await updateDocumentContent(doc.id, editContent);
        setIsEditing(false);
        if (id) fetchVersions(id);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditContent("");
    };

    const handleDuplicate = async () => {
        const newId = await duplicateDocument(doc.id);
        if (newId) navigate(`/document/${newId}`);
    };

    const handleDelete = async () => {
        if (window.confirm("Tem certeza? Esta ação não pode ser desfeita.")) {
            await deleteDocument(doc.id);
            navigate("/");
        }
    };

    const handleStatusChange = async (
        status: "rascunho" | "gerado" | "enviado" | "assinado",
    ) => {
        await updateDocumentStatus(doc.id, status);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPdf = async () => {
        type Html2PdfBuilder = {
            set: (options: {
                margin: [number, number];
                filename: string;
                html2canvas: { scale: number; useCORS: boolean };
                jsPDF: { unit: "mm"; format: "a4"; orientation: "portrait" };
            }) => Html2PdfBuilder;
            from: (element: HTMLElement) => Html2PdfBuilder;
            save: () => void;
        };

        const html2pdfModule = await import("html2pdf.js");
        const html2pdf = html2pdfModule.default as unknown as () => Html2PdfBuilder;
        const element = contentRef.current;
        if (!element) return;

        html2pdf()
            .set({
                margin: [10, 15],
                filename: `${doc.title}.pdf`,
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .from(element)
            .save();
    };

    const handleRestoreVersion = async (version: DocumentVersion) => {
        await updateDocumentContent(doc.id, version.markdown_content);
        setShowVersions(false);
        if (id) fetchVersions(id);
    };

    const statusBadge = (status: string) => {
        const map: Record<string, { bg: string; text: string; label: string }> = {
            assinado: {
                bg: "bg-emerald-50 border-emerald-200",
                text: "text-emerald-700",
                label: "Assinado",
            },
            enviado: {
                bg: "bg-amber-50 border-amber-200",
                text: "text-amber-700",
                label: "Enviado",
            },
            gerado: {
                bg: "bg-blue-50 border-blue-200",
                text: "text-blue-700",
                label: "Gerado",
            },
            rascunho: {
                bg: "bg-slate-50 border-slate-200",
                text: "text-slate-600",
                label: "Rascunho",
            },
        };
        const s = map[status] || map.rascunho;
        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${s.bg} ${s.text}`}
            >
                {s.label}
            </span>
        );
    };

    const safeMarkdown = doc.markdown_content.replace(/<br\s*\/?>/gi, "  \n");

    return (
        <div className="min-h-screen flex flex-col bg-canvas">
            {/* Header */}
            <header className="bg-white/92 backdrop-blur border-b border-base sticky top-0 z-10">
                <div className="px-4 sm:px-6 lg:px-8 min-h-16 py-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/")}
                            className="btn-icon p-1.5"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-semibold text-text-primary">
                                    {doc.title}
                                </h1>
                                {statusBadge(doc.status)}
                            </div>
                            <p className="text-xs text-text-tertiary mt-0.5">
                                {doc.id} · {doc.type} · Criado em{" "}
                                {new Date(doc.created_at).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap lg:justify-end">
                        <button
                            onClick={() => setShowVersions(!showVersions)}
                            className="btn-secondary px-3 py-2"
                            title="Histórico de versões"
                        >
                            <ClockIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Versões</span>
                            {versions.length > 0 && (
                                <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full font-semibold">
                                    {versions.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={handlePrint}
                            className="btn-icon"
                            title="Imprimir"
                        >
                            <PrinterIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleDownloadPdf}
                            className="btn-icon"
                            title="Baixar PDF"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleDuplicate}
                            className="btn-icon"
                            title="Duplicar"
                        >
                            <DocumentDuplicateIcon className="w-4 h-4" />
                        </button>
                        {!isEditing && (
                            <button
                                onClick={handleStartEdit}
                                className="btn-primary px-3 py-2"
                            >
                                <PencilSquareIcon className="w-4 h-4" />
                                Editar
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex-1 flex">
                {showVersions && (
                    <button
                        onClick={() => setShowVersions(false)}
                        className="fixed inset-0 bg-black/25 z-20 lg:hidden"
                        aria-label="Fechar histórico"
                    />
                )}
                {/* Main Content */}
                <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-auto">
                    {/* Status selector */}
                    <div className="surface-card px-4 py-3 mb-6 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mr-2">
                            Status:
                        </span>
                        {(
                            ["rascunho", "gerado", "enviado", "assinado"] as const
                        ).map((s) => (
                            <button
                                key={s}
                                onClick={() => handleStatusChange(s)}
                                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors capitalize ${doc.status === s
                                    ? "bg-blue-50 border-blue-300 text-blue-700"
                                    : "border-base text-text-secondary hover:bg-black/5"
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                        <div className="flex-1" />
                        <button
                            onClick={handleDelete}
                            className="btn-icon hover:text-red-600 hover:bg-red-50"
                            title="Excluir"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {isEditing ? (
                        <div className="flex flex-col h-full">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="flex-1 w-full border border-base rounded-lg p-6 text-sm font-mono min-h-[500px] focus:outline-none focus:ring-2 focus:ring-blue-500/25 resize-none bg-white shadow-soft"
                            />
                            <div className="flex items-center justify-end gap-3 mt-4">
                                <button
                                    onClick={handleCancelEdit}
                                    className="btn-secondary px-4 py-2"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="btn-primary px-4 py-2"
                                >
                                    <CheckIcon className="w-4 h-4" />
                                    Salvar alterações
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            ref={contentRef}
                            className="surface-card p-8 max-w-4xl mx-auto prose prose-slate prose-headings:text-text-primary prose-p:text-text-secondary prose-li:text-text-secondary"
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
                                {safeMarkdown}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* Version History Sidebar */}
                {showVersions && (
                    <div className="fixed inset-y-0 right-0 z-30 w-[88vw] max-w-xs sm:w-72 border-l border-base bg-white overflow-y-auto shrink-0 shadow-mid lg:static lg:w-72 lg:max-w-none lg:shadow-none">
                        <div className="px-4 py-4 border-b border-base flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-text-primary">
                                Histórico de Versões
                            </h3>
                            <button
                                onClick={() => setShowVersions(false)}
                                className="btn-icon p-0.5"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {versionsLoading ? (
                                <div className="p-4 text-center">
                                    <ArrowPathIcon className="w-5 h-5 animate-spin text-text-tertiary mx-auto" />
                                </div>
                            ) : versions.length === 0 ? (
                                <div className="p-4 text-center">
                                    <p className="text-xs text-text-tertiary">
                                        Nenhuma versão anterior.
                                    </p>
                                </div>
                            ) : (
                                versions.map((v) => (
                                    <div
                                        key={v.id}
                                        className="p-4 hover:bg-slate-50 transition-colors"
                                    >
                                        <p className="text-xs font-semibold text-text-secondary">
                                            Versão #{v.version_number}
                                        </p>
                                        <p className="text-[11px] text-text-tertiary mt-0.5">
                                            {new Date(v.created_at).toLocaleDateString("pt-BR", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                        <button
                                            onClick={() => handleRestoreVersion(v)}
                                            className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                                        >
                                            Restaurar versão
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
