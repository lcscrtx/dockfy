import { useEffect } from "react";
import { usePersonaStore, type Persona } from "../store/personaStore";
import { UserGroupIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface PersonaSelectorProps {
    label: string;
    selectedId: string;
    onChange: (id: string, persona: Persona | undefined) => void;
    filterType?: Persona["tipo"][];
}

export function PersonaSelector({
    label,
    selectedId,
    onChange,
    filterType,
}: PersonaSelectorProps) {
    const { personas, loading, fetchPersonas } = usePersonaStore();

    useEffect(() => {
        if (personas.length === 0) {
            fetchPersonas();
        }
    }, [fetchPersonas, personas.length]);

    const filtered = filterType
        ? personas.filter((p) => filterType.includes(p.tipo))
        : personas;

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-sm text-text-tertiary py-2">
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                Carregando pessoas...
            </div>
        );
    }

    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-1.5">
                <UserGroupIcon className="w-4 h-4 text-text-tertiary" />
                {label}
            </label>
            <select
                value={selectedId}
                onChange={(e) => {
                    const p = personas.find((p) => p.id === e.target.value);
                    onChange(e.target.value, p);
                }}
                className="input-base block h-[42px] px-3 py-2.5"
            >
                <option value="">Selecionar pessoa...</option>
                {filtered.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.nome} ({p.tipo}) — {p.cpf_cnpj}
                    </option>
                ))}
            </select>
            {filtered.length === 0 && (
                <p className="text-xs text-text-tertiary mt-1">
                    Nenhuma pessoa cadastrada.{" "}
                    <a href="/pessoas" className="text-blue-600 hover:underline">
                        Cadastrar →
                    </a>
                </p>
            )}
        </div>
    );
}
