import { create } from "zustand";
import { supabase } from "../lib/supabase";

export interface DocumentVersion {
  id: string;
  document_id: string;
  user_id: string;
  markdown_content: string;
  form_data: Record<string, string>;
  version_number: number;
  created_at: string;
}

interface VersionStoreState {
  versions: DocumentVersion[];
  loading: boolean;
  fetchVersions: (documentId: string) => Promise<void>;
}

export const useVersionStore = create<VersionStoreState>((set) => ({
  versions: [],
  loading: false,

  fetchVersions: async (documentId: string) => {
    set({ loading: true });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      set({ versions: [], loading: false });
      return;
    }

    const { data, error } = await supabase
      .from("document_versions")
      .select("*")
      .eq("document_id", documentId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      set({ versions: data as DocumentVersion[] });
    }
    set({ loading: false });
  },
}));
