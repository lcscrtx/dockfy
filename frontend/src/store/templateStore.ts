import { create } from "zustand";
import { supabase } from "../lib/supabase";

// Helper to extract fields like {{nome_cliente}} from markdown
export const extractTemplateFields = (markdown: string): string[] => {
  const regex = /\{\{([^}]+)\}\}/g;
  const matches = Array.from(markdown.matchAll(regex));
  // get unique matches, trim whitespace
  return [...new Set(matches.map((m) => m[1].trim()))];
};

export interface CustomTemplate {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  markdown_template: string;
  fields_schema: string[]; // array of field names
  created_at: string;
}

interface TemplateStoreState {
  customTemplates: CustomTemplate[];
  loading: boolean;
  getCurrentUserId: () => Promise<string | null>;
  fetchTemplates: () => Promise<void>;
  addTemplate: (
    template: Omit<
      CustomTemplate,
      "id" | "user_id" | "created_at" | "fields_schema"
    >,
  ) => Promise<void>;
  updateTemplate: (id: string, data: Partial<CustomTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
}

export const useTemplateStore = create<TemplateStoreState>((set, get) => ({
  customTemplates: [],
  loading: false,

  getCurrentUserId: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  },

  fetchTemplates: async () => {
    set({ loading: true });
    const userId = await get().getCurrentUserId();
    if (!userId) {
      set({ customTemplates: [], loading: false });
      return;
    }

    const { data, error } = await supabase
      .from("custom_templates")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      set({ customTemplates: data as CustomTemplate[] });
    }
    set({ loading: false });
  },

  addTemplate: async (template) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;

    const fields = extractTemplateFields(template.markdown_template);

    const row = {
      ...template,
      fields_schema: fields,
      user_id: userId,
    };

    const { error } = await supabase.from("custom_templates").insert(row);

    if (!error) {
      await get().fetchTemplates();
    } else {
      console.error("Error adding template:", error.message);
    }
  },

  updateTemplate: async (id, data) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;

    const updateData = { ...data };

    // If markdown changed, re-extract fields
    if (data.markdown_template) {
      updateData.fields_schema = extractTemplateFields(data.markdown_template);
    }

    const { error } = await supabase
      .from("custom_templates")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId);

    if (!error) {
      await get().fetchTemplates();
    } else {
      console.error("Error updating template:", error.message);
    }
  },

  deleteTemplate: async (id) => {
    const userId = await get().getCurrentUserId();
    if (!userId) return;

    const { error } = await supabase
      .from("custom_templates")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (!error) {
      set((state) => ({
        customTemplates: state.customTemplates.filter((t) => t.id !== id),
      }));
    } else {
      console.error("Error deleting template:", error.message);
    }
  },
}));
