import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface SavedDocument {
    id: string;
    schema_id: string;
    title: string;
    type: string;
    status: 'gerado' | 'rascunho';
    value: string;
    markdown_content: string;
    form_data: Record<string, string>;
    created_at: string;
    user_id?: string;
}

interface DocumentStoreState {
    documents: SavedDocument[];
    loading: boolean;
    fetchDocuments: () => Promise<void>;
    addDocument: (doc: Omit<SavedDocument, 'created_at' | 'user_id'>) => Promise<void>;
    getDocumentById: (id: string) => SavedDocument | undefined;
}

export const useDocumentStore = create<DocumentStoreState>((set, get) => ({
    documents: [],
    loading: false,

    fetchDocuments: async () => {
        set({ loading: true });
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            set({ documents: data as SavedDocument[] });
        }
        set({ loading: false });
    },

    addDocument: async (doc) => {
        const { data: { user } } = await supabase.auth.getUser();

        const row = {
            id: doc.id,
            schema_id: doc.schema_id,
            title: doc.title,
            type: doc.type,
            status: doc.status,
            value: doc.value,
            markdown_content: doc.markdown_content,
            form_data: doc.form_data,
            user_id: user?.id,
        };

        const { error } = await supabase.from('documents').insert(row);

        if (!error) {
            // Re-fetch to get the server-side created_at
            await get().fetchDocuments();
        } else {
            console.error('Error saving document:', error.message);
        }
    },

    getDocumentById: (id) => get().documents.find((d) => d.id === id),
}));
