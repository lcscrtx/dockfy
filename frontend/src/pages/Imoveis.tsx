import { useEffect, useState } from "react";
import { useImovelStore, type Imovel } from "../store/imovelStore";
import {
    Plus,
    RefreshCw,
    Building2,
    Trash2,
    X,
    Check,
    Pencil,
    MapPin,
} from "lucide-react";

type ImovelForm = {
    apelido: string;
    endereco: string;
    cep: string;
    cidade: string;
    estado: string;
    bairro: string;
    tipo: Imovel["tipo"];
    area_total: string;
    area_construida: string;
    matricula: string;
    iptu: string;
    descricao: string;
};

const emptyImovel: ImovelForm = {
    apelido: "",
    endereco: "",
    cep: "",
    cidade: "",
    estado: "",
    bairro: "",
    tipo: "residencial",
    area_total: "",
    area_construida: "",
    matricula: "",
    iptu: "",
    descricao: "",
};

export function Imoveis() {
    const { imoveis, loading, fetchImoveis, createImovel, updateImovel, deleteImovel } =
        useImovelStore();
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Imovel | null>(null);
    const [form, setForm] = useState<ImovelForm>(emptyImovel);

    useEffect(() => {
        fetchImoveis();
    }, [fetchImoveis]);

    const filtered = imoveis;

    const openCreate = () => {
        setEditing(null);
        setForm(emptyImovel);
        setShowModal(true);
    };

    const openEdit = (i: Imovel) => {
        setEditing(i);
        setForm({
            apelido: i.apelido || "",
            endereco: i.endereco || "",
            cep: i.cep || "",
            cidade: i.cidade || "",
            estado: i.estado || "",
            bairro: i.bairro || "",
            tipo: i.tipo || "residencial",
            area_total: i.area_total || "",
            area_construida: i.area_construida || "",
            matricula: i.matricula || "",
            iptu: i.iptu || "",
            descricao: i.descricao || "",
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.apelido.trim()) return;
        if (editing) {
            await updateImovel(editing.id, form);
        } else {
            await createImovel(form);
        }
        setShowModal(false);
    };

    const inputClass = "input-base";

    return (
        <div className="page-shell">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Gestão de Imóveis
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Mantenha o portfólio de imóveis para uso em contratos de aluguel ou venda.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-semibold text-sm px-4 py-2.5 rounded-lg transition-all active:scale-[0.98]"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    Cadastrar Imóvel
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <RefreshCw size={24} className="text-blue-500 animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-200 rounded-xl shadow-soft">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-slate-200">
                        <Building2 size={24} className="text-slate-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">
                        Nenhum imóvel cadastrado
                    </h3>
                    <p className="text-sm text-slate-500 max-w-sm text-center">
                        Adicione dados de propriedades para facilitar o preenchimento automático.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((i) => (
                        <div
                            key={i.id}
                            className="bg-white rounded-xl p-6 border border-slate-200 shadow-soft hover:shadow-md hover:border-blue-300 transition-all group flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-100">
                                    <Building2 size={20} strokeWidth={2} />
                                </div>
                                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEdit(i)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                        <Pencil size={14} strokeWidth={2.5} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm("Excluir?")) deleteImovel(i.id);
                                        }}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={14} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-1">
                                {i.apelido}
                            </h3>

                            <div className="flex items-start gap-2 text-sm text-slate-600 mt-2">
                                <MapPin size={14} className="mt-0.5 text-slate-400 flex-shrink-0" />
                                <span className="line-clamp-2 leading-relaxed">
                                    {i.endereco}
                                    {(i.cidade || i.estado) && <span>, {i.cidade} - {i.estado}</span>}
                                </span>
                            </div>

                            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                                    {i.tipo || "Residencial"}
                                </span>

                                {i.area_total && (
                                    <span className="text-xs font-semibold text-slate-500">
                                        {i.area_total} m²
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl px-8 py-6 shadow-xl border border-slate-200 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editing ? "Editar Imóvel" : "Cadastrar Imóvel"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5 overflow-y-auto pr-2 pb-6">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">Nome do Imóvel / Apelido *</label>
                                    <input
                                        value={form.apelido}
                                        onChange={(e) => setForm({ ...form, apelido: e.target.value })}
                                        className={inputClass}
                                        placeholder="Ex: Apartamento Copacabana"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">Endereço (Rua, Número, Complemento)</label>
                                    <input
                                        value={form.endereco}
                                        onChange={(e) => setForm({ ...form, endereco: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">Bairro</label>
                                    <input
                                        value={form.bairro}
                                        onChange={(e) => setForm({ ...form, bairro: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">CEP</label>
                                    <input
                                        value={form.cep}
                                        onChange={(e) => setForm({ ...form, cep: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">Cidade</label>
                                    <input
                                        value={form.cidade}
                                        onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">Estado</label>
                                    <input
                                        value={form.estado}
                                        onChange={(e) => setForm({ ...form, estado: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">Tipo da Propriedade</label>
                                    <select
                                        value={form.tipo}
                                        onChange={(e) =>
                                            setForm({ ...form, tipo: e.target.value as Imovel["tipo"] })
                                        }
                                        className={inputClass}
                                    >
                                        <option value="residencial">Residencial</option>
                                        <option value="comercial">Comercial</option>
                                        <option value="industrial">Industrial</option>
                                        <option value="rural">Rural</option>
                                        <option value="terreno">Terreno</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">Nº da Matrícula (RGI)</label>
                                    <input
                                        value={form.matricula}
                                        onChange={(e) => setForm({ ...form, matricula: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">Área Total (m²)</label>
                                    <input
                                        value={form.area_total}
                                        onChange={(e) => setForm({ ...form, area_total: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">Inscrição de IPTU</label>
                                    <input
                                        value={form.iptu}
                                        onChange={(e) => setForm({ ...form, iptu: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!form.apelido.trim()}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all disabled:opacity-50"
                            >
                                <Check size={16} strokeWidth={2.5} />
                                {editing ? "Atualizar Registro" : "Cadastrar Imóvel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
