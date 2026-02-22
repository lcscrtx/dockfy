import { useEffect, useState } from 'react';
import { useImovelStore, type Imovel } from '../store/imovelStore';
import { usePersonaStore } from '../store/personaStore';
import { Plus, Search, Loader2, Home, Pencil, Trash2, X, Save, Building, MapPin } from 'lucide-react';

const TIPO_OPTIONS: { value: Imovel['tipo']; label: string; icon: typeof Home; color: string }[] = [
    { value: 'residencial', label: 'Residencial', icon: Home, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'comercial', label: 'Comercial', icon: Building, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { value: 'terreno', label: 'Terreno', icon: MapPin, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'rural', label: 'Rural', icon: MapPin, color: 'bg-amber-50 text-amber-700 border-amber-200' },
];

const emptyForm: Omit<Imovel, 'id' | 'user_id' | 'created_at'> = {
    apelido: '',
    endereco: '',
    cep: '',
    cidade: '',
    estado: '',
    bairro: '',
    tipo: 'residencial',
    area_total: '',
    area_construida: '',
    matricula: '',
    iptu: '',
    descricao: '',
    proprietario_id: '',
};

export function Imoveis() {
    const { imoveis, loading, fetchImoveis, addImovel, updateImovel, deleteImovel } = useImovelStore();
    const { personas, fetchPersonas } = usePersonaStore();
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [filterTipo, setFilterTipo] = useState<string>('all');

    useEffect(() => {
        fetchImoveis();
        fetchPersonas();
    }, [fetchImoveis, fetchPersonas]);

    // Only show owners in the dropdown
    const proprietarios = personas.filter(p => p.tipo === 'proprietario' || p.tipo === 'vendedor' || p.tipo === 'generico');

    const filteredImoveis = imoveis.filter((i) => {
        const matchSearch = i.apelido.toLowerCase().includes(search.toLowerCase()) ||
            i.endereco?.toLowerCase().includes(search.toLowerCase()) ||
            i.cidade?.toLowerCase().includes(search.toLowerCase());
        const matchTipo = filterTipo === 'all' || i.tipo === filterTipo;
        return matchSearch && matchTipo;
    });

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (imovel: Imovel) => {
        setEditingId(imovel.id);
        setForm({
            apelido: imovel.apelido,
            endereco: imovel.endereco || '',
            cep: imovel.cep || '',
            cidade: imovel.cidade || '',
            estado: imovel.estado || '',
            bairro: imovel.bairro || '',
            tipo: imovel.tipo,
            area_total: imovel.area_total || '',
            area_construida: imovel.area_construida || '',
            matricula: imovel.matricula || '',
            iptu: imovel.iptu || '',
            descricao: imovel.descricao || '',
            proprietario_id: imovel.proprietario_id || '',
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.apelido.trim()) return;
        setSaving(true);
        if (editingId) {
            await updateImovel(editingId, form);
        } else {
            await addImovel(form);
        }
        setSaving(false);
        setShowModal(false);
    };

    const handleDelete = async (id: string) => {
        await deleteImovel(id);
    };

    const getTipoBadge = (tipo: string) => {
        const opt = TIPO_OPTIONS.find((t) => t.value === tipo) || TIPO_OPTIONS[0];
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
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Imóveis</h1>
                        <p className="text-xs text-slate-500">Cadastre imóveis para preencher contratos automaticamente.</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all active:scale-[0.97]"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Imóvel
                    </button>
                </div>
            </header>

            <div className="flex-1 px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por apelido, endereço ou cidade..."
                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 sm:text-sm transition-colors"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setFilterTipo('all')}
                            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${filterTipo === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        >
                            Todos ({imoveis.length})
                        </button>
                        {TIPO_OPTIONS.map((opt) => {
                            const count = imoveis.filter((i) => i.tipo === opt.value).length;
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

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                    </div>
                ) : filteredImoveis.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <Home className="w-16 h-16 text-slate-200 mb-4" />
                        <p className="text-slate-500 font-medium">
                            {search || filterTipo !== 'all' ? 'Nenhum imóvel encontrado.' : 'Nenhum imóvel cadastrado.'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            {search || filterTipo !== 'all' ? 'Tente alterar os filtros.' : 'Clique em "Novo Imóvel" para começar.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredImoveis.map((imovel) => {
                            const proprietario = personas.find(p => p.id === imovel.proprietario_id);
                            return (
                                <div
                                    key={imovel.id}
                                    className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                                                <Home className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-900">{imovel.apelido}</h3>
                                                <p className="text-xs text-slate-400 mt-0.5">{imovel.cidade} - {imovel.estado}</p>
                                            </div>
                                        </div>
                                        {getTipoBadge(imovel.tipo)}
                                    </div>

                                    <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                                        {imovel.endereco && <p className="truncate">📍 {imovel.endereco}, {imovel.bairro}</p>}
                                        {imovel.area_total && <p>📐 Área total: {imovel.area_total}</p>}
                                        {proprietario && <p className="truncate">👤 Prop: {proprietario.nome}</p>}
                                    </div>

                                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                                        <button
                                            onClick={() => openEdit(imovel)}
                                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(imovel.id)}
                                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
                        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">
                                {editingId ? 'Editar Imóvel' : 'Novo Imóvel'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Imóvel</label>
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

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Apelido do Imóvel *</label>
                                <input
                                    type="text"
                                    value={form.apelido}
                                    onChange={(e) => updateField('apelido', e.target.value)}
                                    placeholder="Ex: Apto Bela Vista, Casa da Praia..."
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Apenas para identificação no sistema.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Proprietário</label>
                                <select
                                    value={form.proprietario_id || ''}
                                    onChange={(e) => updateField('proprietario_id', e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="">Selecione o proprietário...</option>
                                    {proprietarios.map(p => (
                                        <option key={p.id} value={p.id}>{p.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Endereço Completo</label>
                                    <input
                                        type="text"
                                        value={form.endereco}
                                        onChange={(e) => updateField('endereco', e.target.value)}
                                        placeholder="Rua, Número, Complemento"
                                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Bairro</label>
                                    <input type="text" value={form.bairro} onChange={(e) => updateField('bairro', e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">CEP</label>
                                    <input type="text" value={form.cep} onChange={(e) => updateField('cep', e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Cidade</label>
                                    <input type="text" value={form.cidade} onChange={(e) => updateField('cidade', e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Estado (UF)</label>
                                    <input type="text" value={form.estado} onChange={(e) => updateField('estado', e.target.value)} maxLength={2} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase" />
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Área Total</label>
                                    <input type="text" value={form.area_total} onChange={(e) => updateField('area_total', e.target.value)} placeholder="Ex: 120m²" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Área Construída</label>
                                    <input type="text" value={form.area_construida} onChange={(e) => updateField('area_construida', e.target.value)} placeholder="Ex: 80m²" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Matrícula</label>
                                    <input type="text" value={form.matricula} onChange={(e) => updateField('matricula', e.target.value)} placeholder="Nº da Matrícula" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Índice Cadastral / IPTU</label>
                                    <input type="text" value={form.iptu} onChange={(e) => updateField('iptu', e.target.value)} placeholder="Nº do IPTU" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Descrição detalhada</label>
                                <textarea
                                    value={form.descricao}
                                    onChange={(e) => updateField('descricao', e.target.value)}
                                    placeholder="Descreva o imóvel..."
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-24"
                                />
                            </div>

                        </div>

                        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!form.apelido.trim() || saving}
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
