import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Search, FileCheck, Building2, Home, FileSignature, Loader2 } from 'lucide-react';
import { useDocumentStore } from '../store/documentStore';

export function Dashboard() {
    const navigate = useNavigate();
    const { documents, loading, fetchDocuments } = useDocumentStore();

    // Fetch documents from Supabase on mount
    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    // Derive KPIs from real data
    const totalGerados = documents.filter((d) => d.status === 'gerado').length;
    const totalLocacoes = documents.filter((d) => d.schema_id?.includes('locacao')).length;
    const totalVendas = documents.filter(
        (d) => d.schema_id === 'compra_venda_imovel' || d.schema_id === 'autorizacao_venda' || d.schema_id === 'proposta_compra'
    ).length;
    const totalRascunhos = documents.filter((d) => d.status === 'rascunho').length;

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Meus Documentos</h1>
                        <p className="text-xs text-slate-500">Crie e gerencie seus contratos de forma simples e rápida.</p>
                    </div>
                    <button
                        onClick={() => navigate('/templates')}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all active:scale-[0.97]"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Documento
                    </button>
                </div>
            </header>

            <div className="flex-1 px-6 lg:px-8 py-8">
                {/* KPIs */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div className="bg-white overflow-hidden rounded-xl border border-slate-200 shadow-sm p-5 hover:border-blue-200 transition-colors cursor-default">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <FileCheck className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-500 truncate">Total Gerados</p>
                                <h3 className="text-2xl font-bold text-slate-900">{totalGerados}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden rounded-xl border border-slate-200 shadow-sm p-5 hover:border-emerald-200 transition-colors cursor-default">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-500 truncate">Locações</p>
                                <h3 className="text-2xl font-bold text-slate-900">{totalLocacoes}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden rounded-xl border border-slate-200 shadow-sm p-5 hover:border-purple-200 transition-colors cursor-default">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                                <Home className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-500 truncate">Vendas</p>
                                <h3 className="text-2xl font-bold text-slate-900">{totalVendas}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden rounded-xl border border-slate-200 shadow-sm p-5 hover:border-slate-300 transition-colors cursor-default">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                <FileSignature className="w-5 h-5 text-slate-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-500 truncate">Rascunhos</p>
                                <h3 className="text-2xl font-bold text-slate-900">{totalRascunhos}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documents Table */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h3 className="text-base font-semibold text-slate-900">Contratos Recentes</h3>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar contratos..."
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 sm:text-sm transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Documento</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tipo</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valor Base</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-slate-400 mx-auto" />
                                        </td>
                                    </tr>
                                ) : documents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center text-slate-400">
                                                <FileText className="w-12 h-12 mb-3 opacity-30" />
                                                <p className="text-sm font-medium text-slate-500">Nenhum contrato gerado ainda.</p>
                                                <p className="text-xs text-slate-400 mt-1">Clique em "Novo Documento" para começar.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    documents.map((doc) => (
                                        <tr
                                            key={doc.id}
                                            onClick={() => navigate(`/document/${doc.id}`)}
                                            className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{doc.title}</span>
                                                    <span className="text-xs text-slate-500">{doc.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800">
                                                    {doc.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {doc.status === 'assinado' ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                        Assinado
                                                    </span>
                                                ) : doc.status === 'enviado' ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                                        Enviado
                                                    </span>
                                                ) : doc.status === 'gerado' ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                        Gerado
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                                        Rascunho
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {new Date(doc.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {doc.value}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
