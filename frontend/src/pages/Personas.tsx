import { useEffect, useState } from 'react';
import { usePersonaStore, type Persona } from '../store/personaStore';
import { Plus, Search, Loader2, UserCircle2, Pencil, Trash2, X, Save, Building2, Key, ShoppingBag, Users, User } from 'lucide-react';

const TIPO_OPTIONS: { value: Persona['tipo']; label: string; icon: typeof User; color: string }[] = [
    { value: 'proprietario', label: 'Proprietário', icon: Building2, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'inquilino', label: 'Inquilino', icon: Key, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'comprador', label: 'Comprador', icon: ShoppingBag, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { value: 'vendedor', label: 'Vendedor', icon: Users, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'generico', label: 'Genérico', icon: User, color: 'bg-slate-100 text-slate-700 border-slate-200' },
];

const ESTADO_CIVIL_OPTIONS = [
    { label: 'Solteiro(a)', value: 'solteiro' },
    { label: 'Casado(a)', value: 'casado' },
    { label: 'Divorciado(a)', value: 'divorciado' },
    { label: 'Viúvo(a)', value: 'viuvo' },
];

const REGIME_OPTIONS = [
    { label: 'Não aplicável', value: 'na' },
    { label: 'Comunhão Parcial', value: 'parcial' },
    { label: 'Comunhão Universal', value: 'universal' },
    { label: 'Separação Total', value: 'separacao' },
];

const emptyForm: Omit<Persona, 'id' | 'user_id' | 'created_at'> = {
    nome: '',
    cpf_cnpj: '',
    rg: '',
    estado_civil: '',
    profissao: '',
    endereco: '',
    regime_bens: 'na',
    telefone: '',
    email: '',
    tipo: 'generico',
};

export function Personas() {
    const { personas, loading, fetchPersonas, addPersona, updatePersona, deletePersona } = usePersonaStore();
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [filterTipo, setFilterTipo] = useState<string>('all');

    useEffect(() => {
        fetchPersonas();
    }, [fetchPersonas]);

    const filteredPersonas = personas.filter((p) => {
        const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase()) ||
            p.cpf_cnpj?.includes(search) ||
            p.email?.toLowerCase().includes(search.toLowerCase());
        const matchTipo = filterTipo === 'all' || p.tipo === filterTipo;
        return matchSearch && matchTipo;
    });

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (persona: Persona) => {
        setEditingId(persona.id);
        setForm({
            nome: persona.nome,
            cpf_cnpj: persona.cpf_cnpj || '',
            rg: persona.rg || '',
            estado_civil: persona.estado_civil || '',
            profissao: persona.profissao || '',
            endereco: persona.endereco || '',
            regime_bens: persona.regime_bens || 'na',
            telefone: persona.telefone || '',
            email: persona.email || '',
            tipo: persona.tipo,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.nome.trim()) return;
        setSaving(true);
        if (editingId) {
            await updatePersona(editingId, form);
        } else {
            await addPersona(form);
        }
        setSaving(false);
        setShowModal(false);
    };

    const handleDelete = async (id: string) => {
        await deletePersona(id);
    };

    const getTipoBadge = (tipo: string) => {
        const opt = TIPO_OPTIONS.find((t) => t.value === tipo) || TIPO_OPTIONS[4];
        const Icon = opt.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${opt.color}`}>
                <Icon className="w-3 h-3" />
                {opt.label}
            </span>
        );
    };

    const updateField = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Pessoas</h1>
                        <p className="text-xs text-slate-500">Cadastre pessoas para preencher contratos automaticamente.</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all active:scale-[0.97]"
                    >
                        <Plus className="w-4 h-4" />
                        Nova Pessoa
                    </button>
                </div>
            </header>

            <div className="flex-1 px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nome, CPF ou email..."
                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 sm:text-sm transition-colors"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setFilterTipo('all')}
                            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${filterTipo === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        >
                            Todos ({personas.length})
                        </button>
                        {TIPO_OPTIONS.map((opt) => {
                            const count = personas.filter((p) => p.tipo === opt.value).length;
                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => setFilterTipo(opt.value)}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${filterTipo === opt.value ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                >
                                    {opt.label} ({count})
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Cards Grid */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                    </div>
                ) : filteredPersonas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <UserCircle2 className="w-16 h-16 text-slate-200 mb-4" />
                        <p className="text-slate-500 font-medium">
                            {search || filterTipo !== 'all' ? 'Nenhuma pessoa encontrada.' : 'Nenhuma pessoa cadastrada.'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            {search || filterTipo !== 'all' ? 'Tente alterar os filtros.' : 'Clique em "Nova Pessoa" para começar.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredPersonas.map((persona) => (
                            <div
                                key={persona.id}
                                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                                            {persona.nome.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900">{persona.nome}</h3>
                                            {persona.cpf_cnpj && (
                                                <p className="text-xs text-slate-400 mt-0.5">{persona.cpf_cnpj}</p>
                                            )}
                                        </div>
                                    </div>
                                    {getTipoBadge(persona.tipo)}
                                </div>

                                <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                                    {persona.profissao && <p>🏢 {persona.profissao}</p>}
                                    {persona.telefone && <p>📱 {persona.telefone}</p>}
                                    {persona.email && <p>✉️ {persona.email}</p>}
                                    {persona.endereco && <p className="truncate">📍 {persona.endereco}</p>}
                                </div>

                                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        onClick={() => openEdit(persona)}
                                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(persona.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">
                                {editingId ? 'Editar Pessoa' : 'Nova Pessoa'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto flex-1 p-6 space-y-4">
                            {/* Tipo */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
                                <div className="flex gap-2 flex-wrap">
                                    {TIPO_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => updateField('tipo', opt.value)}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${form.tipo === opt.value ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Nome */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome Completo *</label>
                                <input
                                    type="text"
                                    value={form.nome}
                                    onChange={(e) => updateField('nome', e.target.value)}
                                    placeholder="Ex: Carlos Alberto Gomes"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* CPF + RG */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">CPF / CNPJ</label>
                                    <input
                                        type="text"
                                        value={form.cpf_cnpj}
                                        onChange={(e) => updateField('cpf_cnpj', e.target.value)}
                                        placeholder="000.000.000-00"
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">RG</label>
                                    <input
                                        type="text"
                                        value={form.rg}
                                        onChange={(e) => updateField('rg', e.target.value)}
                                        placeholder="00.000.000-0"
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Estado Civil + Profissão */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Estado Civil</label>
                                    <select
                                        value={form.estado_civil}
                                        onChange={(e) => updateField('estado_civil', e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    >
                                        <option value="">Selecionar...</option>
                                        {ESTADO_CIVIL_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Profissão</label>
                                    <input
                                        type="text"
                                        value={form.profissao}
                                        onChange={(e) => updateField('profissao', e.target.value)}
                                        placeholder="Ex: Empresário"
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Regime de Bens */}
                            {form.estado_civil === 'casado' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Regime de Bens</label>
                                    <select
                                        value={form.regime_bens}
                                        onChange={(e) => updateField('regime_bens', e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    >
                                        {REGIME_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Endereço */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Endereço Completo</label>
                                <input
                                    type="text"
                                    value={form.endereco}
                                    onChange={(e) => updateField('endereco', e.target.value)}
                                    placeholder="Rua, nº, Bairro, Cidade - UF"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Telefone + Email */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefone</label>
                                    <input
                                        type="text"
                                        value={form.telefone}
                                        onChange={(e) => updateField('telefone', e.target.value)}
                                        placeholder="(00) 00000-0000"
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        placeholder="email@exemplo.com"
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!form.nome.trim() || saving}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {editingId ? 'Salvar Alterações' : 'Cadastrar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
