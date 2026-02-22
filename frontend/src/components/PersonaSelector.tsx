import { useEffect, useState } from 'react';
import { usePersonaStore, type Persona } from '../store/personaStore';
import { UserCircle2, ChevronDown, X, Search } from 'lucide-react';

// Map between form field prefixes and persona fields
const FIELD_MAPPING: Record<string, keyof Persona> = {
    '_nome': 'nome',
    '_cpf_cnpj': 'cpf_cnpj',
    '_cpf': 'cpf_cnpj',
    '_rg': 'rg',
    '_estado_civil': 'estado_civil',
    '_profissao': 'profissao',
    '_endereco': 'endereco',
    '_regime_bens': 'regime_bens',
    '_telefone': 'telefone',
    '_email': 'email',
};

interface PersonaSelectorProps {
    stepFields: { id: string }[];
    onFillFields: (fieldValues: Record<string, string>) => void;
}

export function PersonaSelector({ stepFields, onFillFields }: PersonaSelectorProps) {
    const { personas, fetchPersonas } = usePersonaStore();
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchPersonas();
    }, [fetchPersonas]);

    // Check if any step field matches persona fields
    const hasPersonaFields = stepFields.some((f) =>
        Object.keys(FIELD_MAPPING).some((suffix) => f.id.endsWith(suffix))
    );

    if (!hasPersonaFields || personas.length === 0) return null;

    const filteredPersonas = personas.filter((p) =>
        p.nome.toLowerCase().includes(search.toLowerCase()) ||
        p.cpf_cnpj?.includes(search)
    );

    const handleSelectPersona = (persona: Persona) => {
        const fieldValues: Record<string, string> = {};

        stepFields.forEach((field) => {
            for (const [suffix, personaKey] of Object.entries(FIELD_MAPPING)) {
                if (field.id.endsWith(suffix)) {
                    const value = persona[personaKey];
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
        proprietario: 'Proprietário',
        inquilino: 'Inquilino',
        comprador: 'Comprador',
        vendedor: 'Vendedor',
        generico: 'Genérico',
    };

    return (
        <div className="mb-6">
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-left hover:bg-blue-100 transition-colors group"
                >
                    <UserCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                        <span className="text-sm font-semibold text-blue-900">Preencher com pessoa cadastrada</span>
                        <span className="text-xs text-blue-600 block mt-0.5">
                            {personas.length} {personas.length === 1 ? 'pessoa disponível' : 'pessoas disponíveis'}
                        </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-blue-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
                                    placeholder="Buscar pessoa..."
                                    autoFocus
                                    className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            {filteredPersonas.length === 0 ? (
                                <div className="p-4 text-center text-sm text-slate-400">
                                    Nenhuma pessoa encontrada.
                                </div>
                            ) : (
                                filteredPersonas.map((persona) => (
                                    <button
                                        key={persona.id}
                                        type="button"
                                        onClick={() => handleSelectPersona(persona)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                                            {persona.nome.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">{persona.nome}</p>
                                            <p className="text-xs text-slate-400">
                                                {persona.cpf_cnpj && `${persona.cpf_cnpj} · `}
                                                {tipoLabel[persona.tipo] || persona.tipo}
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
