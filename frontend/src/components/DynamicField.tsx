import { useState } from "react";
import type { SchemaField } from "../types/schema";
import { PersonaSelector } from "./PersonaSelector";
import { ImovelSelector } from "./ImovelSelector";
import type { Persona } from "../store/personaStore";
import type { Imovel } from "../store/imovelStore";
import { applyMask } from "../lib/masks";

interface DynamicFieldProps {
    field: SchemaField;
    value: string;
    onChange: (value: string) => void;
    onAutoFill?: (fields: Record<string, string>) => void;
}

export function DynamicField({ field, value, onChange, onAutoFill }: DynamicFieldProps) {
    const [selectedPersonaId, setSelectedPersonaId] = useState("");
    const [selectedImovelId, setSelectedImovelId] = useState("");

    const baseInputClass =
        "input-base block h-[42px] px-3 py-2.5";

    const handleMaskedChange = (inputValue: string) => {
        const maskType =
            field.id.includes("cpf_cnpj")
                ? "cpf_cnpj"
                : field.id.includes("cnpj")
                    ? "cnpj"
                    : field.id.includes("cpf")
                        ? "cpf"
                        : field.id.includes("telefone") || field.id.includes("phone")
                            ? "phone"
                            : null;
        onChange(maskType ? applyMask(inputValue, maskType) : inputValue);
    };

    // Check if field should render a persona selector
    if (
        field.id.includes("locador_nome") ||
        field.id.includes("locatario_nome") ||
        field.id.includes("vendedor_nome") ||
        field.id.includes("comprador_nome") ||
        field.id.includes("proprietario_nome") ||
        field.id.includes("contratante_nome") ||
        field.id.includes("contratado_nome") ||
        field.id.includes("admin_nome")
    ) {
        const prefix = field.id.replace("_nome", "");
        return (
            <div className="space-y-2.5">
                <label className="block text-sm font-medium text-text-secondary">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>

                <PersonaSelector
                    label="Usar pessoa cadastrada (opcional)"
                    selectedId={selectedPersonaId}
                    onChange={(id: string, persona: Persona | undefined) => {
                        setSelectedPersonaId(id);
                        if (persona && onAutoFill) {
                            const fills: Record<string, string> = {
                                [`${prefix}_id`]: id,
                                [field.id]: persona.nome,
                                [`${prefix}_cpf_cnpj`]: persona.cpf_cnpj,
                                [`${prefix}_rg`]: persona.rg || "",
                                [`${prefix}_estado_civil`]: persona.estado_civil || "",
                                [`${prefix}_profissao`]: persona.profissao || "",
                                [`${prefix}_endereco`]: persona.endereco || "",
                                [`${prefix}_regime_bens`]: persona.regime_bens || "",
                                [`${prefix}_telefone`]: persona.telefone || "",
                                [`${prefix}_email`]: persona.email || "",
                            };
                            onAutoFill(fills);
                        }
                    }}
                />

                <input
                    type="text"
                    value={value}
                    onChange={(e) => handleMaskedChange(e.target.value)}
                    placeholder={field.placeholder || "Ou digite manualmente"}
                    required={field.required}
                    className={baseInputClass}
                />
            </div>
        );
    }

    // Check if field should render an imovel selector
    if (field.id === "imovel_endereco") {
        return (
            <div className="space-y-2.5">
                <label className="block text-sm font-medium text-text-secondary">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>

                <ImovelSelector
                    label="Usar imóvel cadastrado (opcional)"
                    selectedId={selectedImovelId}
                    onChange={(id: string, imovel: Imovel | undefined) => {
                        setSelectedImovelId(id);
                        if (imovel && onAutoFill) {
                            const fills: Record<string, string> = {
                                imovel_id: id,
                                imovel_endereco: imovel.endereco,
                                imovel_cep: imovel.cep || "",
                                imovel_cidade: imovel.cidade || "",
                                imovel_estado: imovel.estado || "",
                                imovel_bairro: imovel.bairro || "",
                                imovel_tipo: imovel.tipo || "",
                                imovel_area_total: imovel.area_total || "",
                                imovel_area_construida: imovel.area_construida || "",
                                imovel_matricula: imovel.matricula || "",
                                imovel_iptu: imovel.iptu || "",
                                imovel_descricao: imovel.descricao || "",
                            };
                            onAutoFill(fills);
                        }
                    }}
                />

                <input
                    type="text"
                    value={value}
                    onChange={(e) => handleMaskedChange(e.target.value)}
                    placeholder={field.placeholder || "Ou digite manualmente"}
                    required={field.required}
                    className={baseInputClass}
                />
            </div>
        );
    }

    // Standard field rendering
    if (field.type === "select" && field.options) {
        return (
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={baseInputClass}
                    required={field.required}
                >
                    <option value="">Selecione...</option>
                    {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    if (field.type === "radio" && field.options) {
        return (
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <div className="flex flex-wrap gap-3">
                    {field.options.map((opt) => (
                        <label
                            key={opt.value}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer text-sm transition-all ${value === opt.value
                                ? "bg-blue-50 border-blue-400 text-blue-700 font-medium"
                                : "border-base text-text-secondary hover:bg-slate-50"
                                }`}
                        >
                            <input
                                type="radio"
                                name={field.id}
                                value={opt.value}
                                checked={value === opt.value}
                                onChange={(e) => onChange(e.target.value)}
                                className="sr-only"
                            />
                            {opt.label}
                        </label>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={field.type === "number" ? "number" : field.type === "email" ? "email" : field.type === "date" ? "date" : "text"}
                value={value}
                onChange={(e) => handleMaskedChange(e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                className={baseInputClass}
            />
        </div>
    );
}
