import { create } from "zustand";
import { supabase } from "../lib/supabase";

export interface Persona {
  id: string;
  user_id?: string;
  nome: string;
  tipo:
    | "fisica"
    | "juridica"
    | "proprietario"
    | "inquilino"
    | "comprador"
    | "vendedor"
    | "generico";
  cpf_cnpj: string;
  rg: string;
  estado_civil: string;
  profissao: string;
  endereco: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  nacionalidade?: string;
  regime_bens: string;
  telefone: string;
  email: string;
  created_at: string;
}

interface PersonaStoreState {
  personas: Persona[];
  loading: boolean;
  getCurrentUserId: () => Promise<string | null>;
  fetchPersonas: () => Promise<void>;
  addPersona: (
    persona: Omit<Persona, "id" | "user_id" | "created_at">,
  ) => Promise<void>;
  createPersona: (
    persona: Omit<Persona, "id" | "user_id" | "created_at">,
  ) => Promise<void>;
  updatePersona: (id: string, data: Partial<Persona>) => Promise<void>;
  deletePersona: (id: string) => Promise<void>;
  getPersonaById: (id: string) => Persona | undefined;
}

export const usePersonaStore = create<PersonaStoreState>((set, get) => ({
  personas: [],
  loading: false,

  getCurrentUserId: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  },

  fetchPersonas: async () => {
    set({ loading: true });
    const userId = await get().getCurrentUserId();
    if (!userId) {
      set({ personas: [], loading: false });
      return;
    }

    const { data, error } = await supabase
      .from("personas")
      .select("*")
      .eq("user_id", userId)
      .order("nome", { ascending: true });

    if (!error && data) {
      const mapped = (data as Persona[]).map((persona) => {
        const digits = (persona.cpf_cnpj ?? "").replace(/\D/g, "");
        const inferredTipo: Persona["tipo"] =
          persona.tipo === "juridica" || digits.length === 14
            ? "juridica"
            : persona.tipo === "fisica"
              ? "fisica"
              : "fisica";
        return {
          ...persona,
          tipo: inferredTipo,
        };
      });
      set({ personas: mapped });
    }
    set({ loading: false });
  },

  addPersona: async (persona) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;

    const baseRow = {
      nome: persona.nome,
      cpf_cnpj: persona.cpf_cnpj,
      rg: persona.rg,
      estado_civil: persona.estado_civil,
      profissao: persona.profissao,
      endereco: persona.endereco,
      regime_bens: persona.regime_bens,
      telefone: persona.telefone,
      email: persona.email,
      user_id: userId,
    };

    let { error } = await supabase.from("personas").insert({
      ...baseRow,
      tipo: persona.tipo,
    });

    // Backward-compatible fallback for schemas that don't accept "fisica/juridica" in tipo.
    if (
      error &&
      (persona.tipo === "fisica" || persona.tipo === "juridica") &&
      /check|enum|constraint|invalid input value/i.test(error.message)
    ) {
      ({ error } = await supabase.from("personas").insert({
        ...baseRow,
        tipo: "generico",
      }));
    }

    if (!error) {
      await get().fetchPersonas();
    } else {
      console.error("Error adding persona:", error.message);
      throw new Error(error.message);
    }
  },
  createPersona: async (persona) => {
    await get().addPersona(persona);
  },

  updatePersona: async (id, data) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;

    const updateData: Partial<Persona> = {};
    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.cpf_cnpj !== undefined) updateData.cpf_cnpj = data.cpf_cnpj;
    if (data.rg !== undefined) updateData.rg = data.rg;
    if (data.estado_civil !== undefined) updateData.estado_civil = data.estado_civil;
    if (data.profissao !== undefined) updateData.profissao = data.profissao;
    if (data.endereco !== undefined) updateData.endereco = data.endereco;
    if (data.regime_bens !== undefined) updateData.regime_bens = data.regime_bens;
    if (data.telefone !== undefined) updateData.telefone = data.telefone;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.tipo !== undefined) updateData.tipo = data.tipo;

    let { error } = await supabase
      .from("personas")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId);

    if (
      error &&
      updateData.tipo &&
      (updateData.tipo === "fisica" || updateData.tipo === "juridica") &&
      /check|enum|constraint|invalid input value/i.test(error.message)
    ) {
      ({ error } = await supabase
        .from("personas")
        .update({ ...updateData, tipo: "generico" })
        .eq("id", id)
        .eq("user_id", userId));
    }

    if (!error) {
      await get().fetchPersonas();
    } else {
      console.error("Error updating persona:", error.message);
      throw new Error(error.message);
    }
  },

  deletePersona: async (id) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;

    const { error } = await supabase
      .from("personas")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (!error) {
      set((state) => ({
        personas: state.personas.filter((p) => p.id !== id),
      }));
    } else {
      console.error("Error deleting persona:", error.message);
    }
  },

  getPersonaById: (id) => get().personas.find((p) => p.id === id),
}));
