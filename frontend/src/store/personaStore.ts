import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Persona {
    id: string;
    user_id?: string;
    nome: string;
    cpf_cnpj: string;
    rg: string;
    estado_civil: string;
    profissao: string;
    endereco: string;
    regime_bens: string;
    telefone: string;
    email: string;
    tipo: 'proprietario' | 'inquilino' | 'comprador' | 'vendedor' | 'generico';
    created_at: string;
}

interface PersonaStoreState {
    personas: Persona[];
    loading: boolean;
    fetchPersonas: () => Promise<void>;
    addPersona: (persona: Omit<Persona, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
    updatePersona: (id: string, data: Partial<Persona>) => Promise<void>;
    deletePersona: (id: string) => Promise<void>;
    getPersonaById: (id: string) => Persona | undefined;
}

export const usePersonaStore = create<PersonaStoreState>((set, get) => ({
    personas: [],
    loading: false,

    fetchPersonas: async () => {
        set({ loading: true });
        const { data, error } = await supabase
            .from('personas')
            .select('*')
            .order('nome', { ascending: true });

        if (!error && data) {
            set({ personas: data as Persona[] });
        }
        set({ loading: false });
    },

    addPersona: async (persona) => {
        const { data: { user } } = await supabase.auth.getUser();

        const row = {
            ...persona,
            user_id: user?.id,
        };

        const { error } = await supabase.from('personas').insert(row);

        if (!error) {
            await get().fetchPersonas();
        } else {
            console.error('Error adding persona:', error.message);
        }
    },

    updatePersona: async (id, data) => {
        const { error } = await supabase
            .from('personas')
            .update(data)
            .eq('id', id);

        if (!error) {
            await get().fetchPersonas();
        } else {
            console.error('Error updating persona:', error.message);
        }
    },

    deletePersona: async (id) => {
        const { error } = await supabase
            .from('personas')
            .delete()
            .eq('id', id);

        if (!error) {
            set((state) => ({
                personas: state.personas.filter((p) => p.id !== id),
            }));
        } else {
            console.error('Error deleting persona:', error.message);
        }
    },

    getPersonaById: (id) => get().personas.find((p) => p.id === id),
}));
