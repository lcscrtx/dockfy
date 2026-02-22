import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, FileCheck2, Printer, Edit3, ArrowLeft, Copy, Save, X, Loader2 } from 'lucide-react';
import { useWizardStore } from '../store/wizardStore';
import { useDocumentStore } from '../store/documentStore';
import { schemaRegistry } from '../config/schemas';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function DocumentDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { documents, fetchDocuments, updateDocumentContent, duplicateDocument } = useDocumentStore();
    const { generatedDocument: wizardDoc, schemaId: wizardSchemaId } = useWizardStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const pdfRef = useRef<HTMLDivElement>(null);

    // Fetch from Supabase if not already loaded
    useEffect(() => {
        if (documents.length === 0) {
            fetchDocuments();
        }
    }, [documents.length, fetchDocuments]);

    const savedDoc = documents.find((d) => d.id === id);

    const markdownContent = savedDoc?.markdown_content || wizardDoc;
    const resolvedSchemaId = savedDoc?.schema_id || wizardSchemaId;
    const currentSchema = schemaRegistry[resolvedSchemaId] || schemaRegistry['locacao_residencial'];

    useEffect(() => {
        if (markdownContent && !isEditing) {
            setEditContent(markdownContent);
        }
    }, [markdownContent, isEditing]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPdf = async () => {
        if (!pdfRef.current || !markdownContent) return;
        setIsGeneratingPdf(true);

        try {
            // @ts-ignore
            const html2pdf = (await import('html2pdf.js')).default;
            const element = pdfRef.current;
            const opt = {
                margin: 15,
                filename: `${savedDoc?.title || 'Documento'}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
            };
            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Erro ao gerar o PDF. Verifique o console para mais detalhes.');
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!id || !savedDoc) return;
        setIsSaving(true);
        await updateDocumentContent(id, editContent);
        setIsEditing(false);
        setIsSaving(false);
    };

    const handleDuplicate = async () => {
        if (!id || !savedDoc) return;
        setIsDuplicating(true);
        const newId = await duplicateDocument(id);
        setIsDuplicating(false);
        if (newId) {
            navigate(`/document/${newId}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans">
            {/* Minimalist Header */}
            <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md print:hidden">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors border-r border-slate-700 pr-6 py-1"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Voltar ao Início
                        </button>
                        <div className="flex flex-col">
                            <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
                                <FileCheck2 className="w-5 h-5 text-blue-400" />
                                {savedDoc?.title || currentSchema.title}
                            </h1>
                            {savedDoc && (
                                <span className="text-xs text-slate-400">
                                    {savedDoc.id} • {new Date(savedDoc.created_at).toLocaleDateString('pt-BR')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-[1200px] mx-auto px-4 sm:px-6 py-8 w-full grid grid-cols-1 lg:grid-cols-4 gap-8 items-start h-[calc(100vh-4rem)]">

                {/* PDF/A4 Canvas Viewer */}
                <div className="lg:col-span-3 h-full flex flex-col items-center overflow-y-auto pt-2 pb-20 custom-scrollbar relative print:col-span-4 print:overflow-visible print:p-0">
                    <div className="w-full max-w-[850px] bg-white shadow-xl ring-1 ring-slate-900/5 min-h-[1100px] rounded-sm relative selection:bg-blue-100 mb-8 p-12 sm:p-20 flex flex-col print:shadow-none print:ring-0 print:p-0 print:m-0 print:w-full">
                        {isEditing ? (
                            <div className="flex-1 flex flex-col h-full min-h-[800px]">
                                <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-4">
                                    <h2 className="text-lg font-bold text-slate-900">Modo de Edição Livre</h2>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditContent(markdownContent || '');
                                            }}
                                            className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1.5"
                                        >
                                            <X className="w-4 h-4" /> Cancelar
                                        </button>
                                        <button
                                            onClick={handleSaveEdit}
                                            disabled={isSaving}
                                            className="px-3 py-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1.5"
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Salvar Alterações
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="flex-1 w-full p-4 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Comece a editar o conteúdo markdown do seu documento..."
                                />
                            </div>
                        ) : (
                            <div ref={pdfRef} className="prose prose-slate prose-sm max-w-none relative z-10 prose-headings:font-serif prose-headings:font-bold prose-headings:text-black prose-headings:text-center prose-headings:uppercase prose-p:font-serif prose-p:text-slate-900 prose-p:leading-relaxed prose-p:text-justify prose-li:font-serif prose-li:text-justify print:prose-p:text-black print:text-black">
                                {markdownContent ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {markdownContent}
                                    </ReactMarkdown>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 font-sans mt-32 print:hidden">
                                        <FileCheck2 className="w-16 h-16 mb-4 opacity-30" />
                                        <p className="font-semibold text-xl text-slate-600">Nenhum contrato gerado nesta aba.</p>
                                        <p className="text-base mt-2">Volte ao início e preencha um formulário para gerar um documento novo.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 h-full pt-2 pb-20 hidden lg:flex flex-col gap-6 print:hidden sticky top-6 overflow-y-auto custom-scrollbar">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 relative overflow-hidden flex-shrink-0">
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                        <h3 className="font-bold text-slate-900 text-lg mb-4">Ações do Documento</h3>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleDownloadPdf}
                                disabled={!markdownContent || isGeneratingPdf || isEditing}
                                className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 transition-all"
                            >
                                {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                Baixar PDF
                            </button>

                            <button
                                onClick={handlePrint}
                                disabled={!markdownContent || isEditing}
                                className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50 transition-all"
                            >
                                <Printer className="w-4 h-4" />
                                Imprimir
                            </button>

                            <hr className="my-2 border-slate-100" />

                            <button
                                onClick={() => setIsEditing(true)}
                                disabled={!markdownContent || !savedDoc || isEditing}
                                className="w-full inline-flex justify-start items-center gap-3 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 transition-all"
                            >
                                <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                                Editar Documento
                            </button>

                            <button
                                onClick={handleDuplicate}
                                disabled={!markdownContent || !savedDoc || isDuplicating}
                                className="w-full inline-flex justify-start items-center gap-3 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 transition-all"
                            >
                                {isDuplicating ? <Loader2 className="w-4 h-4 animate-spin mr-0.5 text-slate-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                                Duplicar Contrato
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex-shrink-0">
                        <h4 className="font-semibold text-blue-900 text-sm mb-2">
                            Dica de Edição
                        </h4>
                        <p className="text-xs text-blue-800 leading-relaxed mb-2">
                            A edição permite que você altere cláusulas livremente. As versões antigas são salvas no banco de dados para segurança jurídica.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
