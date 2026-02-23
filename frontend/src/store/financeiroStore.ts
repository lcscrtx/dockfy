import { create } from "zustand";
import { supabase } from "../lib/supabase";

export interface Recebimento {
  id: string;
  user_id: string;
  imovel_id?: string;
  locatario_id?: string;
  documento_id?: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: "pendente" | "pago" | "atrasado";
  referencia_mes_ano: string; // e.g. "10/2026"
  descricao?: string;
  created_at: string;
}

interface FinanceiroStoreState {
  recebimentos: Recebimento[];
  loading: boolean;
  getCurrentUserId: () => Promise<string | null>;
  fetchRecebimentos: () => Promise<void>;
  addRecebimento: (
    recebimento: Omit<Recebimento, "id" | "user_id" | "created_at">,
  ) => Promise<void>;
  updateRecebimento: (id: string, data: Partial<Recebimento>) => Promise<void>;
  deleteRecebimento: (id: string) => Promise<void>;
  marcarComoPago: (id: string, dataPagamento: string) => Promise<void>;
}

export const useFinanceiroStore = create<FinanceiroStoreState>((set, get) => ({
  recebimentos: [],
  loading: false,

  getCurrentUserId: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  },

  fetchRecebimentos: async () => {
    set({ loading: true });
    const userId = await get().getCurrentUserId();
    if (!userId) {
      set({ recebimentos: [], loading: false });
      return;
    }

    const { data, error } = await supabase
      .from("recebimentos")
      .select("*")
      .eq("user_id", userId)
      .order("data_vencimento", { ascending: false });

    if (!error && data) {
      const today = new Date().toISOString().split("T")[0];
      const overdueIds = data
        .filter((r) => r.status === "pendente" && r.data_vencimento < today)
        .map((r) => r.id);

      if (overdueIds.length > 0) {
        await supabase
          .from("recebimentos")
          .update({ status: "atrasado" })
          .in("id", overdueIds)
          .eq("user_id", userId);
      }

      set({
        recebimentos: (data as Recebimento[]).map((r) =>
          overdueIds.includes(r.id) ? { ...r, status: "atrasado" } : r,
        ),
      });
    }
    set({ loading: false });
  },

  addRecebimento: async (recebimento) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;

    const row = {
      ...recebimento,
      user_id: userId,
    };

    const { error } = await supabase.from("recebimentos").insert(row);

    if (!error) {
      await get().fetchRecebimentos();
    } else {
      console.error("Error adding recebimento:", error.message);
    }
  },

  updateRecebimento: async (id, data) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;

    const { error } = await supabase
      .from("recebimentos")
      .update(data)
      .eq("id", id)
      .eq("user_id", userId);

    if (!error) {
      await get().fetchRecebimentos();
    } else {
      console.error("Error updating recebimento:", error.message);
    }
  },

  deleteRecebimento: async (id) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;

    const { error } = await supabase
      .from("recebimentos")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (!error) {
      set((state) => ({
        recebimentos: state.recebimentos.filter((r) => r.id !== id),
      }));
    } else {
      console.error("Error deleting recebimento:", error.message);
    }
  },

  marcarComoPago: async (id, dataPagamento) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;

    const { error } = await supabase
      .from("recebimentos")
      .update({ status: "pago", data_pagamento: dataPagamento })
      .eq("id", id)
      .eq("user_id", userId);

    if (!error) {
      set((state) => ({
        recebimentos: state.recebimentos.map((r) =>
          r.id === id
            ? { ...r, status: "pago", data_pagamento: dataPagamento }
            : r,
        ),
      }));
    } else {
      console.error("Error marking as paid:", error.message);
    }
  },
}));
