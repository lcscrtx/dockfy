import { useEffect, useState, type DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentStore, type SavedDocument } from '../store/documentStore';
import { FileText, Plus, GripVertical, Loader2 } from 'lucide-react';

const COLUMNS = [
    { id: 'rascunho', title: 'Rascunho', color: 'bg-slate-400', lightBg: 'bg-slate-50', border: 'border-slate-200' },
    { id: 'gerado', title: 'Gerado', color: 'bg-blue-500', lightBg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'enviado', title: 'Enviado', color: 'bg-amber-500', lightBg: 'bg-amber-50', border: 'border-amber-200' },
    { id: 'assinado', title: 'Assinado', color: 'bg-emerald-500', lightBg: 'bg-emerald-50', border: 'border-emerald-200' },
] as const;

type ColumnId = (typeof COLUMNS)[number]['id'];

function KanbanCard({ doc, onDragStart }: { doc: SavedDocument; onDragStart: (e: DragEvent, id: string) => void }) {
    const navigate = useNavigate();

    const typeLabel = doc.type || 'Documento';
    const dateStr = new Date(doc.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, doc.id)}
            onClick={() => navigate(`/document/${doc.id}`)}
            className="bg-white rounded-xl border border-slate-200 p-4 cursor-grab active:cursor-grabbing hover:border-slate-300 hover:shadow-md transition-all group select-none"
        >
            <div className="flex items-start justify-between mb-2">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{doc.id}</span>
                <GripVertical className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {doc.title}
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                    {typeLabel}
                </span>
                {doc.value && doc.value !== '-' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700">
                        {doc.value}
                    </span>
                )}
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{dateStr}</span>
            </div>
        </div>
    );
}

export function Board() {
    const navigate = useNavigate();
    const { documents, loading, fetchDocuments, updateDocumentStatus } = useDocumentStore();
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const getColumnDocs = (columnId: string) =>
        documents.filter((d) => d.status === columnId);

    const handleDragStart = (e: DragEvent, docId: string) => {
        e.dataTransfer.setData('text/plain', docId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: DragEvent, columnId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverColumn(columnId);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDrop = async (e: DragEvent, columnId: ColumnId) => {
        e.preventDefault();
        setDragOverColumn(null);
        const docId = e.dataTransfer.getData('text/plain');
        if (docId) {
            await updateDocumentStatus(docId, columnId);
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Top Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Board</h1>
                        <p className="text-xs text-slate-500">Arraste os contratos entre as colunas para atualizar o status.</p>
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

            {/* Board */}
            <div className="flex-1 p-6 lg:p-8 overflow-x-auto overflow-y-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                    </div>
                ) : (
                    <div className="flex gap-5 min-w-max h-full">
                        {COLUMNS.map((col) => {
                            const colDocs = getColumnDocs(col.id);
                            const isOver = dragOverColumn === col.id;

                            return (
                                <div
                                    key={col.id}
                                    className={`w-[300px] flex flex-col rounded-xl border transition-colors ${isOver ? `${col.border} ${col.lightBg}` : 'border-slate-200 bg-slate-50/60'
                                        }`}
                                    onDragOver={(e) => handleDragOver(e, col.id)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, col.id)}
                                >
                                    {/* Column Header */}
                                    <div className="px-4 py-3 flex items-center gap-2.5 border-b border-slate-200/60">
                                        <div className={`w-2.5 h-2.5 rounded-full ${col.color}`}></div>
                                        <h3 className="text-sm font-semibold text-slate-900">{col.title}</h3>
                                        <span className="ml-auto text-xs font-medium text-slate-400 bg-white border border-slate-200 rounded-md px-2 py-0.5">
                                            {colDocs.length}
                                        </span>
                                    </div>

                                    {/* Cards */}
                                    <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                        {colDocs.length === 0 ? (
                                            <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center text-center transition-colors ${isOver ? col.border : 'border-slate-200'
                                                }`}>
                                                <FileText className="w-8 h-8 text-slate-300 mb-2" />
                                                <p className="text-xs text-slate-400 font-medium">
                                                    {isOver ? 'Solte aqui' : 'Sem contratos'}
                                                </p>
                                            </div>
                                        ) : (
                                            colDocs.map((doc) => (
                                                <KanbanCard
                                                    key={doc.id}
                                                    doc={doc}
                                                    onDragStart={handleDragStart}
                                                />
                                            ))
                                        )}
                                    </div>

                                    {/* Add footer */}
                                    <div className="px-3 py-2 border-t border-slate-200/60">
                                        <button
                                            onClick={() => navigate('/templates')}
                                            className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 py-2 rounded-lg hover:bg-white transition-colors"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            Adicionar
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
