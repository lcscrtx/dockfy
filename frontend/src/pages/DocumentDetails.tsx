import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, FileCheck2, Printer, Edit3, ArrowLeft } from 'lucide-react';
import { useWizardStore } from '../store/wizardStore';
import { useDocumentStore } from '../store/documentStore';
import { schemaRegistry } from '../config/schemas';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function DocumentDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { documents, fetchDocuments } = useDocumentStore();
    const { generatedDocument: wizardDoc, schemaId: wizardSchemaId } = useWizardStore();

    // Fetch from Supabase if not already loaded
    useEffect(() => {
        if (documents.length === 0) {
            fetchDocuments();
        }
    }, [documents.length, fetchDocuments]);

    // Find the document
    const savedDoc = documents.find((d) => d.id === id);

    const markdownContent = savedDoc?.markdown_content || wizardDoc;
    const resolvedSchemaId = savedDoc?.schema_id || wizardSchemaId;
    const currentSchema = schemaRegistry[resolvedSchemaId] || schemaRegistry['locacao_residencial'];

    const handlePrint = () => {
        window.print();
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
                        <div className="prose prose-slate prose-sm max-w-none relative z-10 prose-headings:font-serif prose-headings:font-bold prose-headings:text-black prose-headings:text-center prose-headings:uppercase prose-p:font-serif prose-p:text-slate-900 prose-p:leading-relaxed prose-p:text-justify prose-li:font-serif prose-li:text-justify print:prose-p:text-black print:text-black">
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
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 h-full pt-2 pb-20 hidden lg:flex flex-col gap-6 print:hidden sticky top-6">
                    <div className="bg-white border text-center border-slate-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                        <h3 className="font-bold text-slate-900 text-xl mb-2">Contrato Pronto!</h3>
                        <p className="text-sm text-slate-500 mb-6">O que você deseja fazer com este documento agora?</p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handlePrint}
                                disabled={!markdownContent}
                                className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Download className="w-4 h-4" />
                                Baixar PDF ou Imprimir
                            </button>

                            <button
                                onClick={() => navigate(-1)}
                                className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all"
                            >
                                <Edit3 className="w-4 h-4" />
                                Corrigir Dados (Voltar)
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                        <h4 className="font-semibold text-blue-900 text-sm mb-2 flex items-center gap-2">
                            <Printer className="w-4 h-4" />
                            Dica de Impressão
                        </h4>
                        <p className="text-xs text-blue-800 leading-relaxed">
                            Ao clicar em "Baixar PDF ou Imprimir", o seu navegador abrirá a tela de impressão. Em <strong>"Destino"</strong>, você pode escolher a impressora ou a opção <strong>"Salvar como PDF"</strong> para enviar pelo WhatsApp.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
