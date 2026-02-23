import { useEffect, useState } from "react";
import { useFinanceiroStore } from "../store/financeiroStore";
import { usePersonaStore } from "../store/personaStore";
import { useImovelStore } from "../store/imovelStore";
import {
  Plus as PlusIcon,
  Search as MagnifyingGlassIcon,
  RefreshCw as ArrowPathIcon,
  DollarSign as CurrencyDollarIcon,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  Trash2 as TrashIcon,
  X as XMarkIcon,
  Check as CheckIcon,
  Calendar as CalendarIcon,
  ArrowLeftRight as ArrowsRightLeftIcon,
} from "lucide-react";

export function Financeiro() {
  const {
    recebimentos,
    loading,
    fetchRecebimentos,
    addRecebimento,
    marcarComoPago,
    deleteRecebimento,
  } = useFinanceiroStore();
  const { personas, fetchPersonas } = usePersonaStore();
  const { imoveis, fetchImoveis } = useImovelStore();

  const [search, setSearch] = useState("");
  const [mesAtual, setMesAtual] = useState(() => {
    const today = new Date();
    return `${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
  });

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [valor, setValor] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [locatarioId, setLocatarioId] = useState("");
  const [imovelId, setImovelId] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    fetchRecebimentos();
    fetchPersonas();
    fetchImoveis();
  }, [fetchRecebimentos, fetchPersonas, fetchImoveis]);

  const locatarios = personas;

  // FunnelIcon by month and search
  const filteredRecebimentos = recebimentos.filter((r) => {
    const matchMes = r.referencia_mes_ano === mesAtual;

    const locatario = personas.find((p) => p.id === r.locatario_id);
    const imovel = imoveis.find((i) => i.id === r.imovel_id);

    const searchLower = search.toLowerCase();
    const matchSearch =
      !search ||
      locatario?.nome.toLowerCase().includes(searchLower) ||
      imovel?.apelido.toLowerCase().includes(searchLower) ||
      r.descricao?.toLowerCase().includes(searchLower);

    return matchMes && matchSearch;
  });

  const totalRecebido = filteredRecebimentos
    .filter((r) => r.status === "pago")
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalPendente = filteredRecebimentos
    .filter((r) => r.status !== "pago")
    .reduce((acc, curr) => acc + curr.valor, 0);

  const handlePreviousMonth = () => {
    const [mes, ano] = mesAtual.split("/").map(Number);
    const d = new Date(ano, mes - 2, 1); // -2 because JS months are 0-indexed and we want previous
    setMesAtual(
      `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`,
    );
  };

  const handleNextMonth = () => {
    const [mes, ano] = mesAtual.split("/").map(Number);
    const d = new Date(ano, mes, 1);
    setMesAtual(
      `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`,
    );
  };

  const handleSave = async () => {
    if (!valor || !dataVencimento || !locatarioId) return;
    setSaving(true);

    const [anoRef, mesRef] = dataVencimento.split("-");
    const referenciaMesAno =
      anoRef && mesRef ? `${mesRef}/${anoRef}` : mesAtual;

    await addRecebimento({
      valor: parseFloat(valor.replace(",", ".")),
      data_vencimento: dataVencimento,
      status: "pendente",
      referencia_mes_ano: referenciaMesAno,
      locatario_id: locatarioId,
      imovel_id: imovelId || undefined,
      descricao: descricao || undefined,
    });

    setSaving(false);
    setShowModal(false);
    // Reset form
    setValor("");
    setDataVencimento("");
    setLocatarioId("");
    setImovelId("");
    setDescricao("");
  };

  const handlePagar = async (id: string) => {
    const today = new Date().toISOString().split("T")[0];
    await marcarComoPago(id, today);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  const mesNomes = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const [mesView, anoView] = mesAtual.split("/");
  const mesLabel = `${mesNomes[parseInt(mesView) - 1]} de ${anoView}`;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-base sticky top-0 z-10">
        <div className="px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Financeiro</h1>
            <p className="text-xs text-text-tertiary">
              Controle de recebimentos e aluguéis por mês.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <PlusIcon className="w-4 h-4" />
            Novo Recebimento
          </button>
        </div>
      </header>

      <div className="flex-1 px-6 lg:px-8 py-8">
        {/* Fixed Top Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 bg-white p-4 rounded-lg shadow-low border border-base border-b-4 border-b-blue-500">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors border border-base"
            >
              <ArrowsRightLeftIcon className="w-4 h-4 rotate-180 text-text-secondary" />
            </button>
            <div className="flex items-center gap-2 min-w-[180px] justify-center">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-text-primary text-lg">
                {mesLabel}
              </span>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors border border-base"
            >
              <ArrowsRightLeftIcon className="w-4 h-4 text-text-secondary" />
            </button>
          </div>

          <div className="flex gap-6 w-full sm:w-auto">
            <div className="text-right">
              <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-0.5">
                Recebido
              </p>
              <p className="text-xl font-semibold text-emerald-600">
                {formatCurrency(totalRecebido)}
              </p>
            </div>
            <div className="w-px bg-black/10"></div>
            <div className="text-right">
              <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-0.5">
                Pendente
              </p>
              <p className="text-xl font-semibold text-amber-600">
                {formatCurrency(totalPendente)}
              </p>
            </div>
          </div>
        </div>

        <div className="relative mb-6 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-text-tertiary" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar inquilino ou imóvel..."
            className="block w-full pl-10 pr-3 py-2.5 border border-base rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <ArrowPathIcon className="w-8 h-8 animate-spin text-text-tertiary" />
          </div>
        ) : filteredRecebimentos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-lg border border-base border-dashed">
            <CurrencyDollarIcon className="w-12 h-12 text-slate-200 mb-3" />
            <p className="text-text-tertiary font-semibold">
              Nenhum recebimento registrado neste mês.
            </p>
            <p className="text-sm text-text-tertiary mt-1">
              Avance para o mês correto e clique em "Novo Recebimento".
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-base shadow-low overflow-hidden">
            <table className="min-w-full divide-y divide-base">
              <thead className="bg-white">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider"
                  >
                    Inquilino / Cliente
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider hidden md:table-cell"
                  >
                    Imóvel / Ref
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider"
                  >
                    Vencimento
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider"
                  >
                    Valor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-base">
                {filteredRecebimentos.map((rec) => {
                  const locatario = personas.find(
                    (p) => p.id === rec.locatario_id,
                  );
                  const imovel = imoveis.find((i) => i.id === rec.imovel_id);
                  const isPago = rec.status === "pago";
                  const isAtrasado =
                    !isPago &&
                    new Date(rec.data_vencimento) <
                    new Date(new Date().toISOString().split("T")[0]);

                  return (
                    <tr
                      key={rec.id}
                      className="hover:bg-blue-50/20 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-text-primary">
                          {locatario?.nome || "Não definido"}
                        </div>
                        <div className="text-xs text-text-tertiary">
                          {locatario?.cpf_cnpj || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="text-sm text-text-primary">
                          {imovel?.apelido || rec.descricao || "-"}
                        </div>
                        <div className="text-xs text-text-tertiary truncate max-w-[200px]">
                          {imovel?.endereco || ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm ${isAtrasado ? "text-red-600 font-semibold" : "text-text-primary"}`}
                        >
                          {new Date(rec.data_vencimento).toLocaleDateString(
                            "pt-BR",
                          )}
                        </div>
                        {isPago && rec.data_pagamento && (
                          <div className="text-xs text-emerald-600 font-semibold mt-0.5">
                            Pago dia{" "}
                            {new Date(rec.data_pagamento).toLocaleDateString(
                              "pt-BR",
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-text-primary">
                        {formatCurrency(rec.valor)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${isPago
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isAtrasado
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                        >
                          {isPago ? (
                            <CheckCircleIcon className="w-3.5 h-3.5" />
                          ) : (
                            <ClockIcon className="w-3.5 h-3.5" />
                          )}
                          {isPago
                            ? "Pago"
                            : isAtrasado
                              ? "Em Atraso"
                              : "Pendente"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                        <div className="flex items-center justify-end gap-2">
                          {!isPago && (
                            <button
                              onClick={() => handlePagar(rec.id)}
                              className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-md transition-colors"
                            >
                              Marcar Pago
                            </button>
                          )}
                          <button
                            onClick={() => deleteRecebimento(rec.id)}
                            className="text-text-tertiary hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Novo Recebimento */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4 flex flex-col">
            <div className="px-6 py-5 border-b border-base flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary border-l-4 border-blue-500 pl-3">
                Novo Recebimento - {mesLabel}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-text-tertiary hover:text-text-secondary p-1 rounded-lg hover:bg-black/5 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                  Inquilino / Cliente *
                </label>
                <select
                  value={locatarioId}
                  onChange={(e) => setLocatarioId(e.target.value)}
                  className="w-full border border-base rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione quem vai pagar...</option>
                  {locatarios.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                  Imóvel (Opcional)
                </label>
                <select
                  value={imovelId}
                  onChange={(e) => setImovelId(e.target.value)}
                  className="w-full border border-base rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Referente a qual imóvel?</option>
                  {imoveis.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.apelido}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                    Data de Vencimento *
                  </label>
                  <input
                    type="date"
                    value={dataVencimento}
                    onChange={(e) => setDataVencimento(e.target.value)}
                    className="w-full border border-base rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                    Valor (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="0.00"
                    className="w-full border border-base rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                  Descrição / Observação
                </label>
                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Aluguel + IPTU"
                  className="w-full border border-base rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-base flex items-center justify-end gap-3 bg-white rounded-b-2xl">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 text-sm font-semibold text-text-secondary hover:bg-black/10 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!valor || !dataVencimento || !locatarioId || saving}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                {saving ? (
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckIcon className="w-4 h-4" />
                )}
                Salvar Recebimento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
