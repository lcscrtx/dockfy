import { create } from "zustand";
import { supabase } from "../lib/supabase";

export interface SavedDocument {
  id: string;
  schema_id: string;
  title: string;
  type: string;
  status: "rascunho" | "gerado" | "enviado" | "assinado";
  value: string;
  markdown_content: string;
  form_data: Record<string, string>;
  data_vencimento?: string | null;
  created_at: string;
  user_id?: string;
}

interface DocumentStoreState {
  documents: SavedDocument[];
  loading: boolean;
  getCurrentUserId: () => Promise<string | null>;
  fetchDocuments: () => Promise<void>;
  addDocument: (
    doc: Omit<SavedDocument, "created_at" | "user_id">,
  ) => Promise<void>;
  addQuickTask: (
    title: string,
    columnId: SavedDocument["status"],
  ) => Promise<void>;
  updateDocumentStatus: (
    id: string,
    status: SavedDocument["status"],
  ) => Promise<void>;
  updateDocumentContent: (id: string, content: string) => Promise<void>;
  duplicateDocument: (id: string) => Promise<string | undefined>;
  deleteDocument: (id: string) => Promise<void>;
  getDocumentById: (id: string) => SavedDocument | undefined;
}

export const useDocumentStore = create<DocumentStoreState>((set, get) => ({
  documents: [],
  loading: false,

  getCurrentUserId: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  },

  fetchDocuments: async () => {
    set({ loading: true });
    const userId = await get().getCurrentUserId();
    if (!userId) {
      set({ documents: [], loading: false });
      return;
    }

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      set({ documents: data as SavedDocument[] });
    }
    set({ loading: false });
  },

  addDocument: async (doc) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;

    const row = {
      id: doc.id,
      schema_id: doc.schema_id,
      title: doc.title,
      type: doc.type,
      status: doc.status,
      value: doc.value,
      markdown_content: doc.markdown_content,
      form_data: doc.form_data,
      data_vencimento: doc.data_vencimento,
      user_id: userId,
    };

    const { error } = await supabase.from("documents").insert(row);

    if (!error) {
      // Re-fetch to get the server-side created_at
      await get().fetchDocuments();
    } else {
      console.error("Error saving document:", error.message);
    }
  },

  addQuickTask: async (title, columnId) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;
    const taskId = `TASK-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    const row = {
      id: taskId,
      schema_id: "quick_task",
      title,
      type: "Tarefa",
      status: columnId,
      value: "-",
      markdown_content: "",
      form_data: {},
      user_id: userId,
    };

    const { error } = await supabase.from("documents").insert(row);

    if (!error) {
      await get().fetchDocuments();
    } else {
      console.error("Error creating quick task:", error.message);
    }
  },

  updateDocumentStatus: async (id, status) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;

    const { error } = await supabase
      .from("documents")
      .update({ status })
      .eq("id", id)
      .eq("user_id", userId);

    if (!error) {
      // Optimistic update locally
      set((state) => ({
        documents: state.documents.map((d) =>
          d.id === id ? { ...d, status } : d,
        ),
      }));
    } else {
      console.error("Error updating status:", error.message);
    }
  },

  updateDocumentContent: async (id, content) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;

    const doc = get().documents.find((d) => d.id === id);

    if (!doc) return;

    const { data: latestVersion } = await supabase
      .from("document_versions")
      .select("version_number")
      .eq("document_id", id)
      .eq("user_id", userId)
      .order("version_number", { ascending: false })
      .limit(1);

    const nextVersionNumber = (latestVersion?.[0]?.version_number ?? 0) + 1;

    // Save current version to history before updating
    await supabase.from("document_versions").insert({
      document_id: id,
      user_id: userId,
      markdown_content: doc.markdown_content,
      form_data: doc.form_data,
      version_number: nextVersionNumber,
    });

    const { error } = await supabase
      .from("documents")
      .update({ markdown_content: content })
      .eq("id", id)
      .eq("user_id", userId);

    if (!error) {
      set((state) => ({
        documents: state.documents.map((d) =>
          d.id === id ? { ...d, markdown_content: content } : d,
        ),
      }));
    } else {
      console.error("Error updating content:", error.message);
    }
  },

  duplicateDocument: async (id) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;

    const original = get().documents.find((d) => d.id === id);

    if (!original) return;

    const newId = `DOC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const originalWithoutCreatedAt = { ...original };
    delete (originalWithoutCreatedAt as Partial<SavedDocument>).created_at;
    const newDoc = {
      ...originalWithoutCreatedAt,
      id: newId,
      title: `${original.title} (Cópia)`,
      status: "rascunho",
      user_id: userId,
    };

    const { error } = await supabase.from("documents").insert(newDoc);

    if (!error) {
      await get().fetchDocuments();
      return newId;
    } else {
      console.error("Error duplicating document:", error.message);
      return undefined;
    }
  },

  deleteDocument: async (id) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;

    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (!error) {
      set((state) => ({
        documents: state.documents.filter((d) => d.id !== id),
      }));
    } else {
      console.error("Error deleting document:", error.message);
    }
  },

  getDocumentById: (id) => get().documents.find((d) => d.id === id),
}));
