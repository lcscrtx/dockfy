import { useEffect, useMemo, useState } from "react";
import {
  BookText,
  Check,
  Copy,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { schemaRegistry } from "../config/schemas";
import { useClauseStore, type ContractClause } from "../store/clauseStore";

type ClauseForm = {
  title: string;
  contract_type: string;
  content: string;
};

const emptyForm: ClauseForm = {
  title: "",
  contract_type: "geral",
  content: "",
};

const contractTypeOptions = [
  { value: "geral", label: "Geral (reutilizável em qualquer contrato)" },
  ...Object.entries(schemaRegistry).map(([id, schema]) => ({
    value: id,
    label: schema.title,
  })),
  { value: "custom", label: "Modelos personalizados" },
];

function getContractTypeLabel(value: string) {
  return (
    contractTypeOptions.find((option) => option.value === value)?.label ?? value
  );
}

export function ClauseLibrary() {
  const {
    clauses,
    loading,
    error,
    fetchClauses,
    addClause,
    updateClause,
    deleteClause,
    clearError,
  } = useClauseStore();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string>("");
  const [form, setForm] = useState<ClauseForm>(emptyForm);

  useEffect(() => {
    fetchClauses();
  }, [fetchClauses]);

  const filteredClauses = useMemo(() => {
    const query = search.toLowerCase();
    return clauses.filter((clause) => {
      const matchSearch =
        !query ||
        clause.title.toLowerCase().includes(query) ||
        clause.content.toLowerCase().includes(query);
      const matchType =
        typeFilter === "all" || clause.contract_type === typeFilter;
      return matchSearch && matchType;
    });
  }, [clauses, search, typeFilter]);

  const openNew = () => {
    clearError();
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (clause: ContractClause) => {
    clearError();
    setEditingId(clause.id);
    setForm({
      title: clause.title,
      contract_type: clause.contract_type,
      content: clause.content,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      contract_type: form.contract_type,
      content: form.content.trim(),
    };

    const ok = editingId
      ? await updateClause(editingId, payload)
      : await addClause(payload);

    setSaving(false);
    if (ok) setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Excluir esta cláusula da biblioteca?")) return;
    await deleteClause(id);
  };

  const handleCopy = async (clause: ContractClause) => {
    try {
      await navigator.clipboard.writeText(clause.content);
      setCopiedId(clause.id);
      window.setTimeout(() => setCopiedId(""), 1600);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = clause.content;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedId(clause.id);
      window.setTimeout(() => setCopiedId(""), 1600);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-base sticky top-0 z-10">
        <div className="px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">
              Biblioteca de Cláusulas
            </h1>
            <p className="text-xs text-text-tertiary">
              Crie cláusulas padrão e reutilize por tipo de contrato.
            </p>
          </div>
          <button onClick={openNew} className="btn-primary">
            <Plus className="w-4 h-4" />
            Nova cláusula
          </button>
        </div>
      </header>

      <div className="flex-1 px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-lg">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por título ou texto da cláusula..."
              className="input-base pl-9"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="input-base md:w-[320px]"
          >
            <option value="all">Todos os tipos de contrato</option>
            {contractTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="h-56 flex flex-col items-center justify-center">
            <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
            <p className="text-sm text-text-tertiary mt-2">Carregando cláusulas...</p>
          </div>
        ) : filteredClauses.length === 0 ? (
          <div className="h-56 surface-card border-dashed flex flex-col items-center justify-center text-center px-4">
            <BookText className="w-9 h-9 text-text-tertiary mb-3" />
            <p className="text-sm font-semibold text-text-primary">
              Nenhuma cláusula encontrada.
            </p>
            <p className="text-xs text-text-tertiary mt-1">
              Crie cláusulas e reaproveite nos seus modelos personalizados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredClauses.map((clause) => (
              <article key={clause.id} className="surface-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-text-primary">
                      {clause.title}
                    </p>
                    <span className="mt-1 inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                      {getContractTypeLabel(clause.contract_type)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(clause)}
                      className="btn-icon"
                      title="Copiar texto da cláusula"
                    >
                      {copiedId === clause.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => openEdit(clause)}
                      className="btn-icon"
                      title="Editar cláusula"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(clause.id)}
                      className="btn-icon hover:text-red-600"
                      title="Excluir cláusula"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-text-secondary mt-3 whitespace-pre-wrap line-clamp-6">
                  {clause.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-[12px] w-full max-w-3xl mx-4 border border-base flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-base flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                {editingId ? "Editar cláusula" : "Nova cláusula"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="btn-icon"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                  Título da cláusula *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder="Ex: Cláusula de reajuste anual"
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                  Tipo de contrato *
                </label>
                <select
                  value={form.contract_type}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      contract_type: event.target.value,
                    }))
                  }
                  className="input-base"
                >
                  {contractTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                  Conteúdo da cláusula (Markdown) *
                </label>
                <textarea
                  value={form.content}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, content: event.target.value }))
                  }
                  placeholder="Ex: ### Cláusula X&#10;O LOCATÁRIO se compromete..."
                  className="w-full min-h-[220px] border border-base rounded-[10px] p-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-base flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title.trim() || !form.content.trim() || saving}
                className="btn-primary disabled:bg-slate-300 disabled:border-slate-300"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Salvar cláusula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
