import { create } from "zustand";
import { supabase } from "../lib/supabase";

export interface Imovel {
  id: string;
  user_id?: string;
  apelido: string;
  endereco: string;
  cep: string;
  cidade: string;
  estado: string;
  bairro: string;
  tipo: "residencial" | "comercial" | "industrial" | "terreno" | "rural";
  area_total: string;
  area_construida: string;
  matricula: string;
  iptu: string;
  descricao: string;
  proprietario_id?: string;
  created_at: string;
}

interface ImovelStoreState {
  imoveis: Imovel[];
  loading: boolean;
  getCurrentUserId: () => Promise<string | null>;
  fetchImoveis: () => Promise<void>;
  addImovel: (
    imovel: Omit<Imovel, "id" | "user_id" | "created_at">,
  ) => Promise<void>;
  createImovel: (
    imovel: Omit<Imovel, "id" | "user_id" | "created_at">,
  ) => Promise<void>;
  updateImovel: (id: string, data: Partial<Imovel>) => Promise<void>;
  deleteImovel: (id: string) => Promise<void>;
  getImovelById: (id: string) => Imovel | undefined;
}

export const useImovelStore = create<ImovelStoreState>((set, get) => ({
  imoveis: [],
  loading: false,

  getCurrentUserId: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  },

  fetchImoveis: async () => {
    set({ loading: true });
    const userId = await get().getCurrentUserId();
    if (!userId) {
      set({ imoveis: [], loading: false });
      return;
    }

    const { data, error } = await supabase
      .from("imoveis")
      .select("*")
      .eq("user_id", userId)
      .order("apelido", { ascending: true });

    if (!error && data) {
      set({ imoveis: data as Imovel[] });
    }
    set({ loading: false });
  },

  addImovel: async (imovel) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;

    const row = {
      ...imovel,
      user_id: userId,
    };

    let { error } = await supabase.from("imoveis").insert(row);

    if (
      error &&
      row.tipo === "industrial" &&
      /check|enum|constraint|invalid input value/i.test(error.message)
    ) {
      ({ error } = await supabase.from("imoveis").insert({
        ...row,
        tipo: "comercial",
      }));
    }

    if (!error) {
      await get().fetchImoveis();
    } else {
      console.error("Error adding imovel:", error.message);
    }
  },
  createImovel: async (imovel) => {
    await get().addImovel(imovel);
  },

  updateImovel: async (id, data) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;

    let { error } = await supabase
      .from("imoveis")
      .update(data)
      .eq("id", id)
      .eq("user_id", userId);

    if (
      error &&
      data.tipo === "industrial" &&
      /check|enum|constraint|invalid input value/i.test(error.message)
    ) {
      ({ error } = await supabase
        .from("imoveis")
        .update({ ...data, tipo: "comercial" })
        .eq("id", id)
        .eq("user_id", userId));
    }

    if (!error) {
      await get().fetchImoveis();
    } else {
      console.error("Error updating imovel:", error.message);
    }
  },

  deleteImovel: async (id) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;

    const { error } = await supabase
      .from("imoveis")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (!error) {
      set((state) => ({
        imoveis: state.imoveis.filter((i) => i.id !== id),
      }));
    } else {
      console.error("Error deleting imovel:", error.message);
    }
  },

  getImovelById: (id) => get().imoveis.find((i) => i.id === id),
}));
