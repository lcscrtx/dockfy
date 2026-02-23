import { useEffect, useState } from "react";
import { useDocumentStore } from "../store/documentStore";
import type { SavedDocument } from "../store/documentStore";
import {
  RefreshCw,
  LayoutGrid,
  AlertCircle,
  MousePointer2,
  GripVertical,
} from "lucide-react";

const columns = [
  {
    key: "rascunho",
    label: "Rascunho",
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    board: "from-slate-50 to-white",
  },
  {
    key: "gerado",
    label: "Aguardando Revisão",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    board: "from-blue-50/70 to-white",
  },
  {
    key: "enviado",
    label: "Enviado",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    board: "from-amber-50/70 to-white",
  },
  {
    key: "assinado",
    label: "Assinado",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    board: "from-emerald-50/70 to-white",
  },
];

export function Board() {
  const { documents, loading, fetchDocuments, updateDocumentStatus } =
    useDocumentStore();
  const [draggedDoc, setDraggedDoc] = useState<SavedDocument | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const docsByStatus = (status: string) =>
    documents.filter(
      (d) => d.schema_id !== "quick_task" && (d.status || "rascunho") === status,
    );

  const handleDrop = async (status: string) => {
    if (!draggedDoc || draggedDoc.status === status) return;
    await updateDocumentStatus(draggedDoc.id, status as SavedDocument["status"]);
    setDraggedDoc(null);
  };

  const totalContracts = documents.filter((d) => d.schema_id !== "quick_task").length;

  return (
    <div className="page-shell flex flex-col pt-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Board de Contratos
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            Acompanhe o ciclo de vida dos contratos por etapa.
          </p>
        </div>
        <div className="surface-subtle rounded-lg px-3 py-2.5 flex items-center gap-3 shadow-low w-fit">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
            <LayoutGrid size={16} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Total em andamento
            </p>
            <p className="text-sm font-semibold text-text-primary">{totalContracts} contratos</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-text-tertiary mb-4 font-medium">
        <MousePointer2 size={14} />
        Arraste os cards para mover entre colunas.
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <RefreshCw size={24} className="text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-5 h-full min-w-max">
            {columns.map((col) => {
              const columnDocs = docsByStatus(col.key);
              return (
                <div
                  key={col.key}
                  className={`w-[320px] flex flex-col flex-shrink-0 rounded-xl border border-base bg-gradient-to-b ${col.board}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(col.key)}
                >
                  <div className="flex items-center justify-between p-4 border-b border-base">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                      <h3 className="text-sm font-semibold text-text-primary">{col.label}</h3>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${col.badge}`}
                      >
                        {columnDocs.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 p-3 overflow-y-auto space-y-3">
                    {columnDocs.length === 0 && (
                      <div className="h-24 border-2 border-dashed border-base rounded-xl flex items-center justify-center text-xs text-text-tertiary font-medium bg-white/60">
                        Nenhum contrato nesta etapa
                      </div>
                    )}

                    {columnDocs.map((doc) => {
                      const data = doc.form_data as Record<string, string | undefined>;
                      const partePrincipal =
                        data?.locatario_nome ||
                        data?.comprador_nome ||
                        data?.proponente_nome ||
                        "";

                      return (
                        <div
                          key={doc.id}
                          draggable
                          onDragStart={() => setDraggedDoc(doc)}
                          className="surface-card p-4 cursor-grab active:cursor-grabbing hover:border-blue-300 hover:shadow-mid transition-all group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider">
                              {doc.id}
                            </span>
                            <GripVertical size={14} className="text-text-tertiary/70" />
                          </div>

                          <h4 className="text-sm font-semibold text-text-primary leading-snug mb-2">
                            {doc.title}
                          </h4>

                          {partePrincipal && (
                            <div className="text-xs text-text-secondary mb-3 line-clamp-1">
                              Parte:{" "}
                              <span className="font-medium text-text-primary">{partePrincipal}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-3 border-t border-base">
                            <span className="text-xs text-text-tertiary font-medium flex items-center gap-1.5">
                              <AlertCircle size={14} />
                              {new Date(doc.created_at).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </span>
                            <div
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${col.badge}`}
                            >
                              {col.key}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
