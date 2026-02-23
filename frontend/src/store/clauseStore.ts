import { create } from "zustand";
import { supabase } from "../lib/supabase";

export interface ContractClause {
  id: string;
  user_id: string;
  title: string;
  contract_type: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface ClauseStoreState {
  clauses: ContractClause[];
  loading: boolean;
  error: string;
  getCurrentUserId: () => Promise<string | null>;
  fetchClauses: () => Promise<void>;
  addClause: (payload: {
    title: string;
    contract_type: string;
    content: string;
  }) => Promise<boolean>;
  updateClause: (
    id: string,
    payload: {
      title: string;
      contract_type: string;
      content: string;
    },
  ) => Promise<boolean>;
  deleteClause: (id: string) => Promise<boolean>;
  clearError: () => void;
}

const MISSING_TABLE_HINT =
  "Tabela de cláusulas não encontrada. Rode as migrations do Supabase para habilitar o recurso.";

function mapSupabaseError(message?: string) {
  const msg = message ?? "Erro ao processar cláusulas.";
  if (msg.includes("relation") && msg.includes("clause_library")) {
    return MISSING_TABLE_HINT;
  }
  return msg;
}

export const useClauseStore = create<ClauseStoreState>((set, get) => ({
  clauses: [],
  loading: false,
  error: "",

  getCurrentUserId: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  },

  clearError: () => set({ error: "" }),

  fetchClauses: async () => {
    set({ loading: true, error: "" });
    const userId = await get().getCurrentUserId();
    if (!userId) {
      set({ clauses: [], loading: false });
      return;
    }

    const { data, error } = await supabase
      .from("clause_library")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      set({
        clauses: [],
        loading: false,
        error: mapSupabaseError(error.message),
      });
      return;
    }

    set({ clauses: (data as ContractClause[]) ?? [], loading: false });
  },

  addClause: async (payload) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase.from("clause_library").insert({
      ...payload,
      user_id: userId,
    });

    if (error) {
      set({ error: mapSupabaseError(error.message) });
      return false;
    }

    await get().fetchClauses();
    return true;
  },

  updateClause: async (id, payload) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from("clause_library")
      .update(payload)
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      set({ error: mapSupabaseError(error.message) });
      return false;
    }

    await get().fetchClauses();
    return true;
  },

  deleteClause: async (id) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return false;

    const { error } = await supabase
      .from("clause_library")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      set({ error: mapSupabaseError(error.message) });
      return false;
    }

    set((state) => ({
      clauses: state.clauses.filter((clause) => clause.id !== id),
    }));
    return true;
  },
}));
