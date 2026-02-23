import { useEffect } from "react";
import { useImovelStore, type Imovel } from "../store/imovelStore";
import { HomeModernIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface ImovelSelectorProps {
    label: string;
    selectedId: string;
    onChange: (id: string, imovel: Imovel | undefined) => void;
}

export function ImovelSelector({
    label,
    selectedId,
    onChange,
}: ImovelSelectorProps) {
    const { imoveis, loading, fetchImoveis } = useImovelStore();

    useEffect(() => {
        if (imoveis.length === 0) {
            fetchImoveis();
        }
    }, [fetchImoveis, imoveis.length]);

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-sm text-text-tertiary py-2">
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                Carregando imóveis...
            </div>
        );
    }

    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-1.5">
                <HomeModernIcon className="w-4 h-4 text-text-tertiary" />
                {label}
            </label>
            <select
                value={selectedId}
                onChange={(e) => {
                    const im = imoveis.find((i) => i.id === e.target.value);
                    onChange(e.target.value, im);
                }}
                className="input-base block h-[42px] px-3 py-2.5"
            >
                <option value="">Selecionar imóvel...</option>
                {imoveis.map((im) => (
                    <option key={im.id} value={im.id}>
                        {im.apelido} — {im.endereco}
                    </option>
                ))}
            </select>
            {imoveis.length === 0 && (
                <p className="text-xs text-text-tertiary mt-1">
                    Nenhum imóvel cadastrado.{" "}
                    <a href="/imoveis" className="text-blue-600 hover:underline">
                        Cadastrar →
                    </a>
                </p>
            )}
        </div>
    );
}
