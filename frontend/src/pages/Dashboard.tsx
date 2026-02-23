import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  Home,
  Plus,
  RefreshCw,
  Search,
  Send,
  FileText,
  Clock3,
} from "lucide-react";
import { useDocumentStore } from "../store/documentStore";
import { useFinanceiroStore } from "../store/financeiroStore";
import { useAuth } from "../contexts/AuthContext";

const timeFilters = ["Hoje", "7 dias", "30 dias", "1 ano"] as const;

function StatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { bg: string; text: string; dot: string; label: string; icon: typeof Clock3 }
  > = {
    gerado: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-700",
      dot: "bg-blue-500",
      label: "Gerado",
      icon: FileText,
    },
    enviado: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-700",
      dot: "bg-amber-500",
      label: "Enviado",
      icon: Send,
    },
    assinado: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      label: "Assinado",
      icon: CheckCircle2,
    },
    rascunho: {
      bg: "bg-slate-100 border-slate-200",
      text: "text-slate-700",
      dot: "bg-slate-500",
      label: "Rascunho",
      icon: Clock3,
    },
  };

  const state = map[status] || map.rascunho;
  const Icon = state.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${state.bg} ${state.text}`}
    >
      <Icon size={12} />
      <span className={`w-1.5 h-1.5 rounded-full ${state.dot}`} />
      {state.label}
    </span>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { documents, loading, fetchDocuments } = useDocumentStore();
  const { recebimentos, fetchRecebimentos } = useFinanceiroStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<string>("30 dias");

  useEffect(() => {
    fetchDocuments();
    fetchRecebimentos();
  }, [fetchDocuments, fetchRecebimentos]);

  const allContracts = useMemo(
    () => documents.filter((d) => d.schema_id !== "quick_task"),
    [documents],
  );
  const tasks = useMemo(
    () => documents.filter((d) => d.schema_id === "quick_task" && d.status !== "assinado"),
    [documents],
  );

  const filteredContracts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return allContracts.filter(
      (d) =>
        !query ||
        d.title?.toLowerCase().includes(query) ||
        d.id?.toLowerCase().includes(query) ||
        d.schema_id?.toLowerCase().includes(query),
    );
  }, [allContracts, searchQuery]);

  const receitaMes = useMemo(
    () =>
      recebimentos
        .filter((r) => {
          if (!r.data_pagamento || r.status !== "pago") return false;
          const paymentDate = new Date(r.data_pagamento);
          const now = new Date();
          return (
            paymentDate.getMonth() === now.getMonth() &&
            paymentDate.getFullYear() === now.getFullYear()
          );
        })
        .reduce((sum, r) => sum + (r.valor || 0), 0),
    [recebimentos],
  );

  const locacoes = useMemo(
    () =>
      allContracts.filter(
        (d) =>
          d.schema_id === "locacao_residencial" ||
          d.schema_id === "locacao_comercial",
      ),
    [allContracts],
  );

  const vendas = useMemo(
    () => allContracts.filter((d) => d.schema_id === "compra_venda_imovel"),
    [allContracts],
  );

  const expiringContracts = useMemo(
    () => {
      const now = new Date();
      const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      return allContracts.filter((d) => {
        const data = d.form_data as Record<string, string | undefined>;
        const endDateStr =
          data?.data_termino || data?.data_fim || data?.vigencia_fim;
        if (!endDateStr) return false;
        const endDate = new Date(endDateStr);
        return endDate >= now && endDate <= in30Days;
      });
    },
    [allContracts],
  );

  const chartSeries = useMemo(() => {
    const series = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));

      const count = allContracts.filter((doc) => {
        const created = new Date(doc.created_at);
        return (
          created.getDate() === date.getDate() &&
          created.getMonth() === date.getMonth() &&
          created.getFullYear() === date.getFullYear()
        );
      }).length;

      return {
        label: date
          .toLocaleDateString("pt-BR", { weekday: "short" })
          .replace(".", ""),
        value: count,
      };
    });

    return series;
  }, [allContracts]);

  const totalChart = chartSeries.reduce((sum, item) => sum + item.value, 0);
  const maxChart = Math.max(...chartSeries.map((item) => item.value), 1);

  const recentActivity = useMemo(
    () =>
      [...documents]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, 8),
    [documents],
  );

  const firstName = user?.email
    ? ((user.user_metadata as { full_name?: string } | undefined)?.full_name?.trim()
      ? (user.user_metadata as { full_name?: string }).full_name!.trim().split(" ")[0]
      : user.email
          .split("@")[0]
          .replace(/[._]/g, " ")
          .split(" ")[0])
    : "Operador";

  const kpiCards = [
    {
      label: "Receita recebida",
      value: `R$ ${receitaMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      tone: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Contratos",
      value: allContracts.length.toLocaleString("pt-BR"),
      icon: FileText,
      tone: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label: "Locações",
      value: locacoes.length.toLocaleString("pt-BR"),
      icon: Building2,
      tone: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      label: "Vendas",
      value: vendas.length.toLocaleString("pt-BR"),
      icon: Home,
      tone: "text-amber-600 bg-amber-50 border-amber-100",
    },
  ];

  return (
    <div className="page-shell">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-text-tertiary">
            Dashboard
          </p>
          <h1 className="text-[30px] font-semibold text-text-primary leading-tight mt-1">
            Olá, {firstName}
            <span className="text-blue-600">.</span>
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            Insights operacionais dos contratos e da receita do mês.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="surface-card p-1">
            {timeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={timeFilter === filter ? "btn-segment btn-segment-active" : "btn-segment"}
              >
                {filter}
              </button>
            ))}
          </div>
          <button onClick={() => navigate("/templates")} className="btn-primary">
            <Plus size={16} />
            Novo documento
          </button>
        </div>
      </div>

      {expiringContracts.length > 0 && (
        <div className="surface-card mb-4 p-3.5 border-amber-200 bg-amber-50/70">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-amber-900">
                {expiringContracts.length} contrato(s) com vencimento em até 30 dias
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {expiringContracts.slice(0, 3).map((contract) => (
                  <button
                    key={contract.id}
                    onClick={() => navigate(`/document/${contract.id}`)}
                    className="btn-chip border-amber-200 text-amber-800 hover:bg-amber-100"
                  >
                    {contract.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4 items-start">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="surface-card overflow-hidden h-auto self-start">
            <div className="panel-head px-4 py-3 flex items-center justify-between">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                {kpi.label}
              </p>
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${kpi.tone}`}>
                <kpi.icon size={14} />
              </div>
            </div>
            <div className="px-4 pt-3 pb-4">
              <p className="text-[26px] leading-none font-semibold text-text-primary">
                {kpi.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <section className="surface-card overflow-hidden mb-4">
        <div className="panel-head px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm font-semibold text-text-primary">Monitoramento de contratos</p>
          <div className="relative w-full sm:w-72">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
            <input
              type="text"
              placeholder="Filtrar tabela..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-9 w-full rounded-lg border border-base bg-white pl-9 pr-3 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {loading ? (
          <div className="h-48 flex flex-col items-center justify-center">
            <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
            <p className="text-sm text-text-tertiary mt-2">Carregando dados...</p>
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm text-text-tertiary">
            Nenhum contrato encontrado para o filtro atual.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead>
                <tr className="border-b border-base bg-white">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                    Documento
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                    Criado em
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.slice(0, 12).map((doc) => {
                  const formData = doc.form_data as Record<string, string | undefined>;
                  const value = formData?.valor_total || formData?.valor_aluguel;
                  return (
                    <tr
                      key={doc.id}
                      onClick={() => navigate(`/document/${doc.id}`)}
                      className="border-b border-base/70 hover:bg-blue-50/25 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-text-primary line-clamp-1">
                          {doc.title}
                        </p>
                        <p className="text-[11px] text-text-tertiary mt-0.5 font-mono">
                          {doc.id}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">
                        {doc.schema_id?.replace(/_/g, " ")}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={doc.status || "rascunho"} />
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">
                        {new Date(doc.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-text-primary whitespace-nowrap">
                        {value ? `R$ ${Number(value).toLocaleString("pt-BR")}` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-4">
        <section className="xl:col-span-8 surface-card overflow-hidden">
          <div className="panel-head px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                <BarChart3 size={14} />
              </div>
              <p className="text-sm font-semibold text-text-primary">Volume de contratos</p>
            </div>
            <span className="pill-soft">
              {timeFilter}
            </span>
          </div>

          <div className="px-4 py-4">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-[32px] leading-none font-semibold text-text-primary">
                  {totalChart.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  contratos gerados nos últimos 7 dias
                </p>
              </div>
              <p className="text-xs font-semibold text-emerald-600">
                +{Math.max(1, tasks.length)} em relação ao ciclo anterior
              </p>
            </div>

            <div className="rounded-xl border border-base bg-[var(--color-surface-subtle)] p-4 subtle-grid">
              <div className="h-52 flex items-end gap-3">
                {chartSeries.map((item) => {
                  const height = Math.max(12, Math.round((item.value / maxChart) * 100));
                  const isPeak = item.value === maxChart;
                  return (
                    <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
                      <div className="h-40 w-full flex items-end justify-center">
                        <div
                          className={`w-[68%] rounded-md ${isPeak
                              ? "bg-[#1F2937] shadow-[0_10px_20px_rgba(31,41,55,0.22)]"
                              : "bg-slate-300/70"
                            }`}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-text-tertiary font-semibold uppercase">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <aside className="xl:col-span-4 surface-card overflow-hidden">
          <div className="panel-head px-4 py-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
              <ClipboardList size={14} />
            </div>
            <p className="text-sm font-semibold text-text-primary">Atividades recentes</p>
          </div>
          <div className="px-4 py-3 space-y-2 max-h-[320px] overflow-y-auto">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-text-tertiary">Sem atividades no momento.</p>
            ) : (
              recentActivity.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-lg border border-base bg-white px-3 py-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-text-primary truncate">
                      {doc.title}
                    </p>
                    <StatusBadge status={doc.status || "rascunho"} />
                  </div>
                  <p className="text-[11px] text-text-tertiary mt-1">
                    {new Date(doc.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
