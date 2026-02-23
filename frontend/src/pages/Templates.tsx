import { useNavigate } from "react-router-dom";
import { schemaRegistry } from "../config/schemas";
import { useTemplateStore } from "../store/templateStore";
import { useEffect } from "react";
import {
  FileBadge,
  ArrowRight,
  RefreshCw,
  Layers,
  ShieldCheck,
  Clock3,
} from "lucide-react";

export function Templates() {
  const navigate = useNavigate();
  const { customTemplates, loading, fetchTemplates } = useTemplateStore();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const builtInSchemas = Object.entries(schemaRegistry);
  const validatedSchemaIds = new Set([
    "compra_venda_imovel",
    "locacao_residencial",
    "locacao_comercial",
  ]);

  const validatedSchemas = builtInSchemas.filter(([key]) =>
    validatedSchemaIds.has(key),
  );
  const inValidationSchemas = builtInSchemas.filter(
    ([key]) => !validatedSchemaIds.has(key),
  );

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Biblioteca de Modelos
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            Escolha um modelo para iniciar a criação do seu documento.
          </p>
        </div>
        <button onClick={() => navigate("/meus-modelos")} className="btn-secondary">
          <Layers size={16} />
          Ver Meus Modelos
        </button>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4 px-1">
          <h2 className="text-sm font-semibold text-text-primary">Documentos validados</h2>
          <span className="pill-soft text-[11px]">{validatedSchemas.length} modelos</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {validatedSchemas.map(([key, schema]) => (
            <button
              key={key}
              onClick={() => navigate(`/wizard/${key}`)}
              className="group surface-card p-6 text-left hover:border-blue-500/35 transition-all flex flex-col justify-between min-h-[176px]"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100/50">
                  <FileBadge size={20} strokeWidth={2} />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
                  {schema.title}
                </h3>
                <p className="text-sm text-text-tertiary">
                  {schema.steps.length} etapas ·{" "}
                  {schema.steps.reduce((acc, step) => acc + step.fields.length, 0)} campos
                  preenchíveis
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <ShieldCheck size={13} />
                  Validado
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-transform group-hover:translate-x-1">
                  Usar modelo <ArrowRight size={16} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4 px-1">
          <h2 className="text-sm font-semibold text-text-primary">
            Documentos em validação
          </h2>
          <span className="pill-soft text-[11px]">
            {inValidationSchemas.length} modelos
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {inValidationSchemas.map(([key, schema]) => (
            <button
              key={key}
              onClick={() => navigate(`/wizard/${key}`)}
              className="group surface-card p-6 text-left hover:border-blue-500/35 transition-all flex flex-col justify-between min-h-[176px]"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-slate-50 text-text-secondary flex items-center justify-center mb-4 border border-base">
                  <FileBadge size={20} strokeWidth={2} />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
                  {schema.title}
                </h3>
                <p className="text-sm text-text-tertiary">
                  {schema.steps.length} etapas ·{" "}
                  {schema.steps.reduce((acc, step) => acc + step.fields.length, 0)} campos
                  preenchíveis
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-xs font-semibold">
                  <Clock3 size={13} />
                  Em validação
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-transform group-hover:translate-x-1">
                  Usar modelo <ArrowRight size={16} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Models */}
      {customTemplates.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-text-primary mb-4 px-1">
            Modelos Customizados
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <RefreshCw size={24} className="text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {customTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => navigate(`/wizard/custom?templateId=${t.id}`)}
                  className="group surface-card p-6 text-left hover:border-blue-500/35 transition-all flex flex-col justify-between min-h-[176px]"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100/50">
                      <Layers size={20} strokeWidth={2} />
                    </div>
                    <h3 className="text-base font-semibold text-text-primary mb-1 line-clamp-1 group-hover:text-blue-700 transition-colors">
                      {t.title}
                    </h3>
                    <p className="text-sm text-text-tertiary line-clamp-2">
                      {t.description || t.markdown_template?.substring(0, 100)}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-transform group-hover:translate-x-1">
                    Usar modelo <ArrowRight size={16} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
