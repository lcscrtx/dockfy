import { useEffect, useState } from "react";
import { usePersonaStore, type Persona } from "../store/personaStore";
import {
    Plus,
    Search,
    RefreshCw,
    Users,
    Trash2,
    X,
    Check,
    Pencil,
} from "lucide-react";

type PersonaForm = {
    nome: string;
    tipo: "fisica" | "juridica";
    cpf_cnpj: string;
    rg: string;
    email: string;
    telefone: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    nacionalidade: string;
    estado_civil: string;
    profissao: string;
    regime_bens: string;
};

const emptyPersona: PersonaForm = {
    nome: "",
    tipo: "fisica",
    cpf_cnpj: "",
    rg: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    nacionalidade: "Brasileiro(a)",
    estado_civil: "",
    profissao: "",
    regime_bens: "",
};

export function Personas() {
    const { personas, loading, fetchPersonas, createPersona, updatePersona, deletePersona } =
        usePersonaStore();
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Persona | null>(null);
    const [form, setForm] = useState<PersonaForm>(emptyPersona);
    const [filterTipo, setFilterTipo] = useState<string>("all");
    const [saveError, setSaveError] = useState("");

    useEffect(() => {
        fetchPersonas();
    }, [fetchPersonas]);

    const filtered = personas.filter((p) => {
        const matchSearch =
            p.nome?.toLowerCase().includes(search.toLowerCase()) ||
            p.cpf_cnpj?.toLowerCase().includes(search.toLowerCase());
        const matchTipo = filterTipo === "all" || p.tipo === filterTipo;
        return matchSearch && matchTipo;
    });

    const openCreate = () => {
        setEditing(null);
        setForm(emptyPersona);
        setSaveError("");
        setShowModal(true);
    };

    const openEdit = (p: Persona) => {
        setEditing(p);
        const tipoPessoa: PersonaForm["tipo"] =
            p.tipo === "juridica" ? "juridica" : "fisica";
        setForm({
            nome: p.nome || "",
            tipo: tipoPessoa,
            cpf_cnpj: p.cpf_cnpj || "",
            rg: p.rg || "",
            email: p.email || "",
            telefone: p.telefone || "",
            endereco: p.endereco || "",
            cidade: p.cidade || "",
            estado: p.estado || "",
            cep: p.cep || "",
            nacionalidade: p.nacionalidade || "Brasileiro(a)",
            estado_civil: p.estado_civil || "",
            profissao: p.profissao || "",
            regime_bens: p.regime_bens || "",
        });
        setSaveError("");
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.nome.trim()) return;
        setSaveError("");
        try {
            if (editing) {
                await updatePersona(editing.id, form);
            } else {
                await createPersona(form);
            }
            setShowModal(false);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Falha ao salvar pessoa.";
            setSaveError(message);
        }
    };

    const inputClass = "input-base";

    return (
        <div className="page-shell">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Gestão de Partes
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Mantenha o cadastro de clientes, fiadores e contratantes atualizado.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-semibold text-sm px-4 py-2.5 rounded-lg transition-all active:scale-[0.98]"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    Nova Parte
                </button>
            </div>

            <div className="bg-white border border-slate-200 shadow-soft rounded-xl overflow-hidden flex flex-col">
                {/* Toolbar */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                    <div className="relative w-80">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nome ou CPF/CNPJ..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                            {[
                                { key: "all", label: "Todos" },
                                { key: "fisica", label: "Pessoa Física" },
                                { key: "juridica", label: "Pessoa Jurídica" },
                            ].map((f) => (
                                <button
                                    key={f.key}
                                    onClick={() => setFilterTipo(f.key)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${filterTipo === f.key
                                            ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50"
                                            : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex justify-center py-20 bg-white">
                        <RefreshCw size={24} className="text-blue-500 animate-spin mb-4" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-slate-200">
                            <Users size={24} className="text-slate-400" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 mb-1">
                            Nenhuma parte cadastrada
                        </h3>
                        <p className="text-sm text-slate-500 max-w-sm">
                            Use o botão Nova Parte acima para cadastrar clientes, fiadores ou empresas.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200">
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">Parte</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">Documento</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">Contato</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wide text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((p) => (
                                    <tr
                                        key={p.id}
                                        className="hover:bg-slate-50/80 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-50 text-blue-600 rounded-lg border border-blue-100/50">
                                                    <Users size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{p.nome}</p>
                                                    <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${p.tipo === "juridica" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}>
                                                        {p.tipo === "juridica" ? "Jurídica" : "Física"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                                            {p.cpf_cnpj || "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-700">{p.email || "Sem e-mail"}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{p.telefone || "Sem telefone"}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEdit(p)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm("Excluir?")) deletePersona(p.id);
                                                    }}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl px-8 py-6 shadow-xl border border-slate-200 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editing ? "Editar Parte Registrada" : "Cadastrar Nova Parte"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5 overflow-y-auto pr-2 pb-6">
                            {saveError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                    {saveError}
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">Nome Completo / Razão Social *</label>
                                    <input
                                        value={form.nome}
                                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">Tipo</label>
                                    <select
                                        value={form.tipo}
                                        onChange={(e) => setForm({ ...form, tipo: e.target.value as "fisica" | "juridica" })}
                                        className={inputClass}
                                    >
                                        <option value="fisica">Pessoa Física</option>
                                        <option value="juridica">Pessoa Jurídica</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">CPF/CNPJ</label>
                                    <input
                                        value={form.cpf_cnpj}
                                        onChange={(e) => setForm({ ...form, cpf_cnpj: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">E-mail</label>
                                    <input
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">Telefone</label>
                                    <input
                                        value={form.telefone}
                                        onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                {form.tipo === "fisica" && (
                                    <>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">RG</label>
                                            <input
                                                value={form.rg}
                                                onChange={(e) => setForm({ ...form, rg: e.target.value })}
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">Estado Civil</label>
                                            <input
                                                value={form.estado_civil}
                                                onChange={(e) => setForm({ ...form, estado_civil: e.target.value })}
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">Profissão</label>
                                            <input
                                                value={form.profissao}
                                                onChange={(e) => setForm({ ...form, profissao: e.target.value })}
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">Regime de Bens</label>
                                            <input
                                                value={form.regime_bens}
                                                onChange={(e) => setForm({ ...form, regime_bens: e.target.value })}
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">Nacionalidade</label>
                                            <input
                                                value={form.nacionalidade}
                                                onChange={(e) => setForm({ ...form, nacionalidade: e.target.value })}
                                                className={inputClass}
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="col-span-2">
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">Endereço Completo</label>
                                    <input
                                        value={form.endereco}
                                        onChange={(e) => setForm({ ...form, endereco: e.target.value })}
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
                                disabled={!form.nome.trim()}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all disabled:opacity-50"
                            >
                                <Check size={16} strokeWidth={2.5} />
                                {editing ? "Salvar Alterações" : "Salvar Parte"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
