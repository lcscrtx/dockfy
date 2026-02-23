import { useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useWizardStore } from "../store/wizardStore";
import { useDocumentStore } from "../store/documentStore";
import { schemaRegistry } from "../config/schemas";
import { useTemplateStore } from "../store/templateStore";
import { DynamicField } from "../components/DynamicField";
import { generateDocumentMarkdown } from "../lib/documentGenerator";
import { ArrowLeft, ArrowRight, Loader2, Check } from "lucide-react";
import type { SchemaField } from "../types/schema";

export function Wizard() {
  const { schemaId } = useParams<{ schemaId: string }>();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");
  const navigate = useNavigate();

  const { currentStepIndex, formData, nextStep, prevStep, setFormData, reset } = useWizardStore();
  const { addDocument } = useDocumentStore();
  const { customTemplates, fetchTemplates } = useTemplateStore();

  useEffect(() => {
    reset();
    if (schemaId === "custom") fetchTemplates();
  }, [schemaId, reset, fetchTemplates]);

  const isCustom = schemaId === "custom";
  const customTemplate = customTemplates.find((t) => t.id === templateId);
  const schema = !isCustom && schemaId ? schemaRegistry[schemaId] : null;

  const customFields = useMemo(() => {
    if (!isCustom || !customTemplate?.markdown_template) return [];
    const storedFields = customTemplate.fields_schema ?? [];
    if (storedFields.length > 0) {
      return storedFields.map((id: string) => ({
        id,
        label: id.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
        type: "text" as const,
        required: true,
      }));
    }

    const matches = customTemplate.markdown_template.match(/\{\{([^}]+)\}\}/g) || [];
    const unique = [
      ...new Set(
        matches.map((m: string) => m.replace(/\{\{|\}\}/g, "").trim()),
      ),
    ] as string[];
    return unique.map((id: string) => ({
      id,
      label: id.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
      type: "text" as const,
      required: true,
    }));
  }, [isCustom, customTemplate]);

  const steps = schema
    ? schema.steps
    : customFields.length > 0
      ? [{ title: customTemplate?.title || "Preencher campos", fields: customFields }]
      : [];

  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  const isFieldValid = (field: SchemaField, value: string | undefined) => {
    const val = (value ?? "").trim();
    if (field.required && !val) return false;
    if (!val) return true;

    if (field.type === "number") {
      const parsed = Number(val);
      return Number.isFinite(parsed);
    }

    if (field.type === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }

    if (field.type === "date") {
      return !Number.isNaN(Date.parse(val));
    }

    if (field.id.includes("cpf_cnpj")) {
      const digits = val.replace(/\D/g, "");
      return digits.length === 11 || digits.length === 14;
    }
    if (field.id.includes("cpf")) {
      return val.replace(/\D/g, "").length === 11;
    }
    if (field.id.includes("cnpj")) {
      return val.replace(/\D/g, "").length === 14;
    }

    return true;
  };

  const isStepValid = () => {
    if (!currentStep) return false;
    return currentStep.fields.every((field) =>
      isFieldValid(field, formData[field.id]),
    );
  };

  const handleFinish = async () => {
    const title = schema?.title || customTemplate?.title || "Documento";
    const docId = `DOC-${Date.now().toString().slice(-6)}`;

    let markdown_content = "";
    if (isCustom && customTemplate?.markdown_template) {
      markdown_content = customTemplate.markdown_template.replace(
        /\{\{\s*([^}]+)\s*\}\}/g,
        (_match: string, key: string) => formData[key.trim()] || `{{${key.trim()}}}`,
      );
    } else if (schemaId) {
      markdown_content = generateDocumentMarkdown(schemaId, formData);
    }

    const parteName =
      formData.comprador_nome ||
      formData.locatario_nome ||
      formData.proponente_nome ||
      formData.vendedor_nome ||
      docId;

    await addDocument({
      id: docId,
      title: `${title} - ${parteName}`,
      schema_id: schemaId || "custom",
      type: schema?.title || customTemplate?.title || "Documento",
      status: "gerado",
      value: "-",
      markdown_content,
      form_data: formData,
    });

    reset();
    navigate("/");
  };

  if (!schema && !isCustom) {
    if (!schemaId) {
      return (
        <div className="flex items-center justify-center h-full text-text-tertiary">
          Selecione um modelo para iniciar o preenchimento.
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center h-full text-text-tertiary">
        Modelo não encontrado.
      </div>
    );
  }

  if (isCustom && !customTemplate) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={24} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center">
      {/* Top Progress Header */}
      <div className="w-full bg-white/92 backdrop-blur border-b border-base sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 min-h-16 py-3 flex items-center justify-between gap-2">
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost px-2"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Voltar
          </button>

          <div className="flex items-center gap-4 flex-1 justify-center">
            <h1 className="text-[15px] font-bold text-text-primary text-center">
              {schema?.title || customTemplate?.title}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full tracking-wider uppercase border border-blue-100">
              Etapa {currentStepIndex + 1} de {totalSteps}
            </span>
          </div>

          <div className="w-24" />
        </div>

        <div className="h-0.5 w-full bg-slate-100">
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Form */}
      <div className="w-full max-w-2xl px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col">
        {currentStep && (
          <div className="surface-card rounded-2xl p-6 sm:p-8 flex-1">
            <div className="mb-8 border-b border-base pb-6">
              <h2 className="text-xl font-bold text-text-primary">{currentStep.title}</h2>
              <p className="text-sm text-text-tertiary mt-2">
                Preencha os campos abaixo com atenção. Eles comporão o documento final.
              </p>
            </div>

            <div className="space-y-6">
              {currentStep.fields.map((field: SchemaField) => (
                <DynamicField
                  key={field.id}
                  field={field}
                  value={formData[field.id] || ""}
                  onChange={(val) => setFormData(field.id, val as string)}
                  onAutoFill={(data) => {
                    Object.entries(data).forEach(([k, v]) =>
                      setFormData(k, v as string),
                    );
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-8 w-full">
          <button
            onClick={() => prevStep()}
            disabled={currentStepIndex === 0}
            className="btn-secondary px-6 py-3 disabled:opacity-50 disabled:pointer-events-none"
          >
            Etapa Anterior
          </button>

          {currentStepIndex < totalSteps - 1 ? (
            <button
              onClick={() => nextStep(totalSteps)}
              disabled={!isStepValid()}
              className="btn-primary px-8 py-3 font-bold disabled:opacity-50"
            >
              Próxima Etapa
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!isStepValid()}
              className="btn-primary px-8 py-3 font-bold disabled:opacity-50"
            >
              <Check size={18} strokeWidth={3} />
              Finalizar e Gerar Documento
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
