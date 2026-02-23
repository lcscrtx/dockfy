import { useEffect, useMemo, useRef, useState } from "react";
import { useTemplateStore, type CustomTemplate } from "../store/templateStore";
import { useClauseStore } from "../store/clauseStore";
import { schemaRegistry } from "../config/schemas";
import {
  Plus as PlusIcon,
  Search as MagnifyingGlassIcon,
  RefreshCw as ArrowPathIcon,
  Code as CodeBracketSquareIcon,
  Trash2 as TrashIcon,
  X as XMarkIcon,
  Check as CheckIcon,
  Pencil as PencilSquareIcon,
  FileCode as CodeBracketIcon,
  BookText as BookTextIcon,
} from "lucide-react";

const clauseTypeOptions = [
  { value: "all", label: "Todos os tipos" },
  { value: "geral", label: "Geral" },
  ...Object.entries(schemaRegistry).map(([id, schema]) => ({
    value: id,
    label: schema.title,
  })),
  { value: "custom", label: "Modelos personalizados" },
];

const clauseTypeLabel = (value: string) =>
  clauseTypeOptions.find((option) => option.value === value)?.label ?? value;

export function CustomTemplates() {
  const {
    customTemplates,
    loading,
    fetchTemplates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
  } = useTemplateStore();
  const {
    clauses,
    loading: clausesLoading,
    error: clausesError,
    fetchClauses,
    clearError: clearClausesError,
  } = useClauseStore();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [markdownTemplate, setMarkdownTemplate] = useState("");
  const [clauseSearch, setClauseSearch] = useState("");
  const [clauseTypeFilter, setClauseTypeFilter] = useState("all");
  const markdownRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  useEffect(() => {
    if (!showModal) return;
    clearClausesError();
    fetchClauses();
  }, [showModal, fetchClauses, clearClausesError]);

  const filteredTemplates = customTemplates.filter((t) => {
    const query = search.toLowerCase();
    return (
      !search ||
      t.title.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query)
    );
  });

  const filteredClauses = useMemo(() => {
    const query = clauseSearch.toLowerCase();
    return clauses.filter((clause) => {
      const matchSearch =
        !query ||
        clause.title.toLowerCase().includes(query) ||
        clause.content.toLowerCase().includes(query);
      const matchType =
        clauseTypeFilter === "all" || clause.contract_type === clauseTypeFilter;
      return matchSearch && matchType;
    });
  }, [clauses, clauseSearch, clauseTypeFilter]);

  const handleOpenNew = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setMarkdownTemplate("");
    setClauseSearch("");
    setClauseTypeFilter("all");
    setShowModal(true);
  };

  const handleOpenEdit = (template: CustomTemplate) => {
    setEditingId(template.id);
    setTitle(template.title);
    setDescription(template.description || "");
    setMarkdownTemplate(template.markdown_template);
    setClauseSearch("");
    setClauseTypeFilter("all");
    setShowModal(true);
  };

  const handleInsertClause = (content: string) => {
    const textarea = markdownRef.current;
    const current = markdownTemplate;

    if (!textarea) {
      const appended = current.trim()
        ? `${current.trimEnd()}\n\n${content}`
        : content;
      setMarkdownTemplate(appended);
      return;
    }

    const start = textarea.selectionStart ?? current.length;
    const end = textarea.selectionEnd ?? current.length;
    const before = current.slice(0, start);
    const after = current.slice(end);
    const prefix =
      before.length === 0
        ? ""
        : before.endsWith("\n\n")
          ? ""
          : before.endsWith("\n")
            ? "\n"
            : "\n\n";
    const suffix = after.length === 0 || after.startsWith("\n") ? "" : "\n";

    const next = `${before}${prefix}${content}${suffix}${after}`;
    const cursorPos = (before + prefix + content).length;

    setMarkdownTemplate(next);
    requestAnimationFrame(() => {
      const element = markdownRef.current;
      if (!element) return;
      element.focus();
      element.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const handleSave = async () => {
    if (!title || !markdownTemplate) return;
    setSaving(true);

    if (editingId) {
      await updateTemplate(editingId, {
        title,
        description: description || null,
        markdown_template: markdownTemplate,
      });
    } else {
      await addTemplate({
        title,
        description: description || null,
        markdown_template: markdownTemplate,
      });
    }

    setSaving(false);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-base sticky top-0 z-10">
        <div className="px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Meus Modelos</h1>
            <p className="text-xs text-text-tertiary">
              Crie seus próprios contratos usando variáveis mágicas.
            </p>
          </div>
          <button
            onClick={handleOpenNew}
            className="btn-primary"
          >
            <PlusIcon className="w-4 h-4" />
            Criar Modelo
          </button>
        </div>
      </header>

      <div className="flex-1 px-6 lg:px-8 py-8">
        <div className="relative mb-6 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-text-tertiary" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar modelo..."
            className="block w-full pl-10 pr-3 py-2.5 border border-base rounded-lg bg-white placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <ArrowPathIcon className="w-8 h-8 animate-spin text-text-tertiary" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center surface-card border-dashed">
            <CodeBracketSquareIcon className="w-12 h-12 text-slate-200 mb-3" />
            <p className="text-text-tertiary font-semibold">
              Você ainda não criou nenhum modelo próprio.
            </p>
            <button
              onClick={handleOpenNew}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 mt-2"
            >
              Criar meu primeiro modelo →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="surface-card p-5 hover:border-blue-400 hover:shadow-mid transition-all group flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
                    <CodeBracketIcon className="w-5 h-5" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(template)}
                      className="p-1.5 text-text-tertiary hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="p-1.5 text-text-tertiary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-blue-700 transition-colors">
                  {template.title}
                </h3>
                {template.description && (
                  <p className="text-sm text-text-tertiary mt-1 line-clamp-2">
                    {template.description}
                  </p>
                )}

                <div className="mt-auto pt-4 flex flex-wrap gap-2">
                  {template.fields_schema &&
                    template.fields_schema.slice(0, 3).map((field) => (
                      <span
                        key={field}
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-black/5 text-text-secondary border border-base"
                      >
                        {field}
                      </span>
                    ))}
                  {template.fields_schema &&
                    template.fields_schema.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-black/5 text-text-tertiary border border-base">
                        +{template.fields_schema.length - 3} campos
                      </span>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Editor */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[85vh] mx-4 flex flex-col animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-base flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  {editingId ? "Editar Modelo" : "Novo Modelo de Contrato"}
                </h2>
                <p className="text-xs text-text-tertiary mt-0.5">
                  Use{" "}
                  <code className="bg-black/5 px-1 py-0.5 rounded text-blue-600">{`{{nome_variavel}}`}</code>{" "}
                  para criar campos dinâmicos.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-text-tertiary hover:text-text-secondary p-2 rounded-lg hover:bg-black/5 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 shrink-0">
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                    Nome do Modelo *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Contrato de Prestação de Serviços"
                    className="w-full border border-base rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                    Descrição (Breve)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Para que serve este contrato?"
                    className="w-full border border-base rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-[400px]">
                <label className="block text-sm font-semibold text-text-secondary mb-1.5 flex justify-between items-end">
                  <span>Conteúdo do Contrato *</span>
                  <span className="text-xs font-normal text-text-tertiary">
                    Suporta formatação Markdown (.md)
                  </span>
                </label>
                <textarea
                  ref={markdownRef}
                  value={markdownTemplate}
                  onChange={(e) => setMarkdownTemplate(e.target.value)}
                  placeholder="## CONTRATO DE PRESTAÇÃO DE SERVIÇOS&#10;&#10;Pelo presente instrumento, {{nome_contratante}} e {{nome_contratado}} firmam acordo..."
                  className="flex-1 w-full border border-base rounded-lg p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="surface-card p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg border border-blue-100 bg-blue-50 text-blue-600 flex items-center justify-center">
                      <BookTextIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        Inserir cláusulas da biblioteca
                      </p>
                      <p className="text-xs text-text-tertiary">
                        Reutilize cláusulas por tipo de contrato.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-3 mb-3">
                  <input
                    type="text"
                    value={clauseSearch}
                    onChange={(event) => setClauseSearch(event.target.value)}
                    placeholder="Buscar cláusula..."
                    className="input-base"
                  />
                  <select
                    value={clauseTypeFilter}
                    onChange={(event) => setClauseTypeFilter(event.target.value)}
                    className="input-base"
                  >
                    {clauseTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {clausesError && (
                  <div className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 mb-3">
                    {clausesError}
                  </div>
                )}

                <div className="max-h-52 overflow-y-auto space-y-2">
                  {clausesLoading ? (
                    <div className="h-20 flex items-center justify-center text-text-tertiary">
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    </div>
                  ) : filteredClauses.length === 0 ? (
                    <div className="rounded-[10px] border border-dashed border-base px-3 py-4 text-xs text-text-tertiary text-center">
                      Nenhuma cláusula encontrada.
                    </div>
                  ) : (
                    filteredClauses.map((clause) => (
                      <div
                        key={clause.id}
                        className="rounded-[10px] border border-base bg-white px-3 py-2.5 flex items-start justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">
                            {clause.title}
                          </p>
                          <p className="text-[11px] text-blue-700 mt-0.5">
                            {clauseTypeLabel(clause.contract_type)}
                          </p>
                          <p className="text-xs text-text-tertiary mt-1 line-clamp-2 whitespace-pre-wrap">
                            {clause.content}
                          </p>
                        </div>
                        <button
                          onClick={() => handleInsertClause(clause.content)}
                          className="btn-secondary h-8 px-2.5 text-xs whitespace-nowrap"
                        >
                          Inserir
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-base flex items-center justify-end gap-3 bg-white rounded-b-2xl shrink-0">
              <button
                onClick={() => setShowModal(false)}
                className="btn-ghost px-4 py-2.5 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!title || !markdownTemplate || saving}
                className="btn-primary disabled:bg-slate-300"
              >
                {saving ? (
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckIcon className="w-4 h-4" />
                )}
                Salvar Modelo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
