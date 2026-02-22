import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Search, FileCheck, Building2, Home, FileSignature, Loader2, ListTodo, Trash2 } from 'lucide-react';
import { useDocumentStore } from '../store/documentStore';
import { TemplateSelectorModal } from '../components/TemplateSelectorModal';
import type { SavedDocument } from '../store/documentStore';

export function Dashboard() {
    const navigate = useNavigate();
    const { documents, loading, fetchDocuments, deleteDocument } = useDocumentStore();
    const [selectedTask, setSelectedTask] = useState<SavedDocument | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    // Split into contracts and tasks
    const allContracts = documents.filter((d) => d.schema_id !== 'quick_task');
    const allTasks = documents.filter((d) => d.schema_id === 'quick_task');

    // Filter by search query
    const lowerQuery = searchQuery.toLowerCase();
    const contracts = allContracts.filter(d =>
        !searchQuery ||
        d.title.toLowerCase().includes(lowerQuery) ||
        d.id.toLowerCase().includes(lowerQuery) ||
        d.type?.toLowerCase().includes(lowerQuery) ||
        d.value?.toLowerCase().includes(lowerQuery)
    );

    const tasks = allTasks.filter(t =>
        !searchQuery ||
        t.title.toLowerCase().includes(lowerQuery)
    );

    // Derive KPIs from ALL contracts (not just filtered)
    const totalGerados = allContracts.filter((d) => d.status === 'gerado').length;
    const totalLocacoes = allContracts.filter((d) => d.schema_id?.includes('locacao')).length;
    const totalVendas = allContracts.filter(
        (d) => d.schema_id === 'compra_venda_imovel' || d.schema_id === 'autorizacao_venda' || d.schema_id === 'proposta_compra'
    ).length;
    const totalTasks = allTasks.length;

    const handleDeleteTask = async (e: React.MouseEvent, taskId: string) => {
        e.stopPropagation();
        await deleteDocument(taskId);
    };

    const statusBadge = (status: string) => {
        const map: Record<string, { bg: string; text: string; label: string }> = {
            assinado: { bg: 'bg-emerald-100 border-emerald-200', text: 'text-emerald-800', label: 'Assinado' },
            enviado: { bg: 'bg-amber-100 border-amber-200', text: 'text-amber-800', label: 'Enviado' },
            gerado: { bg: 'bg-blue-100 border-blue-200', text: 'text-blue-800', label: 'Gerado' },
            rascunho: { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-700', label: 'Rascunho' },
        };
        const s = map[status] || map.rascunho;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${s.bg} ${s.text}`}>
                {s.label}
            </span>
        );
    };

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
                    <div className="bg-white overflow-hidden rounded-xl border border-slate-200 shadow-sm p-5 hover:border-blue-200 transition-colors">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <FileCheck className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-500 truncate">Contratos</p>
                                <h3 className="text-2xl font-bold text-slate-900">{totalGerados}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden rounded-xl border border-slate-200 shadow-sm p-5 hover:border-emerald-200 transition-colors">
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
                    <div className="bg-white overflow-hidden rounded-xl border border-slate-200 shadow-sm p-5 hover:border-purple-200 transition-colors">
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
                    <div className="bg-white overflow-hidden rounded-xl border border-slate-200 shadow-sm p-5 hover:border-amber-200 transition-colors">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                <ListTodo className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-500 truncate">Tarefas</p>
                                <h3 className="text-2xl font-bold text-slate-900">{totalTasks}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stacked layout for tables */}
                <div className="space-y-6">

                    {/* Contracts Table — full width */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <FileSignature className="w-4 h-4 text-slate-400" />
                                <h3 className="text-base font-semibold text-slate-900">Contratos</h3>
                                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md font-medium">{contracts.length}</span>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar documentos e tarefas..."
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Documento</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tipo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <Loader2 className="w-6 h-6 animate-spin text-slate-400 mx-auto" />
                                            </td>
                                        </tr>
                                    ) : contracts.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center text-slate-400">
                                                    <FileText className="w-10 h-10 mb-2 opacity-30" />
                                                    <p className="text-sm font-medium text-slate-500">Nenhum contrato gerado.</p>
                                                    <p className="text-xs text-slate-400 mt-1">Clique em "Novo Documento" para começar.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        contracts.map((doc) => (
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
                                                <td className="px-6 py-4 whitespace-nowrap">{statusBadge(doc.status)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                    {new Date(doc.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{doc.value}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tasks Table — full width */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-5 py-5 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ListTodo className="w-4 h-4 text-amber-500" />
                                <h3 className="text-base font-semibold text-slate-900">Tarefas</h3>
                                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md font-medium">{tasks.length}</span>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {loading ? (
                                <div className="px-5 py-12 text-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-slate-400 mx-auto" />
                                </div>
                            ) : tasks.length === 0 ? (
                                <div className="px-5 py-12 text-center">
                                    <ListTodo className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-slate-500">Nenhuma tarefa.</p>
                                    <p className="text-xs text-slate-400 mt-1">Crie tarefas no Board.</p>
                                </div>
                            ) : (
                                tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={() => setSelectedTask(task)}
                                        className="px-5 py-4 hover:bg-amber-50/50 transition-colors cursor-pointer group flex items-start gap-3"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                                                {task.title}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {new Date(task.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} · {statusBadge(task.status)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => handleDeleteTask(e, task.id)}
                                            className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 p-1 rounded transition-all"
                                            title="Excluir tarefa"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Template Selector Modal */}
            {selectedTask && (
                <TemplateSelectorModal
                    taskTitle={selectedTask.title}
                    taskId={selectedTask.id}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </div>
    );
}
