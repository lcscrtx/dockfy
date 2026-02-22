import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Imovel {
    id: string;
    user_id?: string;
    apelido: string;
    endereco: string;
    cep: string;
    cidade: string;
    estado: string;
    bairro: string;
    tipo: 'residencial' | 'comercial' | 'terreno' | 'rural';
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
    fetchImoveis: () => Promise<void>;
    addImovel: (imovel: Omit<Imovel, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
    updateImovel: (id: string, data: Partial<Imovel>) => Promise<void>;
    deleteImovel: (id: string) => Promise<void>;
    getImovelById: (id: string) => Imovel | undefined;
}

export const useImovelStore = create<ImovelStoreState>((set, get) => ({
    imoveis: [],
    loading: false,

    fetchImoveis: async () => {
        set({ loading: true });
        const { data, error } = await supabase
            .from('imoveis')
            .select('*')
            .order('apelido', { ascending: true });

        if (!error && data) {
            set({ imoveis: data as Imovel[] });
        }
        set({ loading: false });
    },

    addImovel: async (imovel) => {
        const { data: { user } } = await supabase.auth.getUser();

        const row = {
            ...imovel,
            user_id: user?.id,
        };

        const { error } = await supabase.from('imoveis').insert(row);

        if (!error) {
            await get().fetchImoveis();
        } else {
            console.error('Error adding imovel:', error.message);
        }
    },

    updateImovel: async (id, data) => {
        const { error } = await supabase
            .from('imoveis')
            .update(data)
            .eq('id', id);

        if (!error) {
            await get().fetchImoveis();
        } else {
            console.error('Error updating imovel:', error.message);
        }
    },

    deleteImovel: async (id) => {
        const { error } = await supabase
            .from('imoveis')
            .delete()
            .eq('id', id);

        if (!error) {
            set((state) => ({
                imoveis: state.imoveis.filter((i) => i.id !== id),
            }));
        } else {
            console.error('Error deleting imovel:', error.message);
        }
    },

    getImovelById: (id) => get().imoveis.find((i) => i.id === id),
}));
