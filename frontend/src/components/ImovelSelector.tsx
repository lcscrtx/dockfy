import { useEffect, useState } from 'react';
import { useImovelStore, type Imovel } from '../store/imovelStore';
import { Home, ChevronDown, X, Search } from 'lucide-react';

// Map between form field suffixes and imovel fields
const FIELD_MAPPING: Record<string, keyof Imovel> = {
    '_endereco_imovel': 'endereco',
    '_endereco': 'endereco', // Fallback for pure '_endereco' if no '_endereco_imovel'
    '_bairro': 'bairro',
    '_cidade': 'cidade',
    '_estado': 'estado',
    '_cep': 'cep',
    '_area_total': 'area_total',
    '_area_construida': 'area_construida',
    '_matricula': 'matricula',
    '_iptu': 'iptu',
    '_descricao_imovel': 'descricao',
    '_descricao': 'descricao'
};

interface ImovelSelectorProps {
    stepFields: { id: string }[];
    onFillFields: (fieldValues: Record<string, string>) => void;
}

export function ImovelSelector({ stepFields, onFillFields }: ImovelSelectorProps) {
    const { imoveis, fetchImoveis } = useImovelStore();
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchImoveis();
    }, [fetchImoveis]);

    // Check if any step field maps to imovel fields AND that it pertains to the property (not a person's address)
    // To distinguish between a person's _endereco and a property's _endereco, step fields typically group property fields
    // We check if the step has fields with 'imovel', 'matricula' or 'iptu'
    const hasImovelFields = stepFields.some((f) =>
        f.id.includes('imovel') || f.id.includes('venda_') || f.id.includes('locacao_') || f.id.includes('matricula') || f.id.includes('iptu') || f.id.includes('area_')
    ) && stepFields.some((f) => Object.keys(FIELD_MAPPING).some((suffix) => f.id.endsWith(suffix)));


    if (!hasImovelFields || imoveis.length === 0) return null;

    const filteredImoveis = imoveis.filter((i) =>
        i.apelido.toLowerCase().includes(search.toLowerCase()) ||
        i.endereco?.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelectImovel = (imovel: Imovel) => {
        const fieldValues: Record<string, string> = {};

        // Avoid overwriting persona address if this step is mixed (usually they're separate steps, but just in case)
        stepFields.forEach((field) => {
            // First try exact property suffixes like _endereco_imovel
            for (const [suffix, imovelKey] of Object.entries(FIELD_MAPPING)) {
                if (field.id.endsWith(suffix)) {
                    // Quick heuristic: If field is just generic '_endereco' and there is another field like '_cpf', it's probably a person's address
                    if (suffix === '_endereco' || suffix === '_cidade' || suffix === '_estado' || suffix === '_cep' || suffix === '_bairro') {
                        if (stepFields.some(f => f.id.endsWith('_cpf') || f.id.endsWith('_rg') || f.id.endsWith('_estado_civil'))) {
                            continue; // Skip setting generic address if person fields are present
                        }
                    }

                    const value = imovel[imovelKey];
                    if (value && typeof value === 'string') {
                        fieldValues[field.id] = value;
                    }
                    break;
                }
            }
        });

        onFillFields(fieldValues);
        setIsOpen(false);
        setSearch('');
    };

    const tipoLabel: Record<string, string> = {
        residencial: 'Residencial',
        comercial: 'Comercial',
        terreno: 'Terreno',
        rural: 'Rural',
    };

    return (
        <div className="mb-6">
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-left hover:bg-emerald-100 transition-colors group"
                >
                    <Home className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div className="flex-1">
                        <span className="text-sm font-semibold text-emerald-900">Preencher com imóvel cadastrado</span>
                        <span className="text-xs text-emerald-600 block mt-0.5">
                            {imoveis.length} {imoveis.length === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}
                        </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-emerald-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-[320px] flex flex-col overflow-hidden">
                        {/* Search */}
                        <div className="p-3 border-b border-slate-100">
                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar imóvel..."
                                    autoFocus
                                    className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* List */}
                        <div className="overflow-y-auto flex-1">
                            {filteredImoveis.length === 0 ? (
                                <div className="p-4 text-center text-sm text-slate-400">
                                    Nenhum imóvel encontrado.
                                </div>
                            ) : (
                                filteredImoveis.map((imovel) => (
                                    <button
                                        key={imovel.id}
                                        type="button"
                                        onClick={() => handleSelectImovel(imovel)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
                                    >
                                        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                            <Home className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">{imovel.apelido}</p>
                                            <p className="text-xs text-slate-400 truncate">
                                                {imovel.cidade} - {imovel.estado} · {tipoLabel[imovel.tipo] || imovel.tipo}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
