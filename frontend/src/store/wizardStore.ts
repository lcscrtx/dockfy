import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WizardState {
  schemaId: string;
  currentStepIndex: number;
  formData: Record<string, string>;
  generatedDocument: string | null;
  setSchemaId: (id: string) => void;
  setFormData: (key: string, value: string) => void;
  setGeneratedDocument: (documentText: string | null) => void;
  nextStep: (totalSteps: number) => void;
  prevStep: () => void;
  reset: () => void;
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      schemaId: "locacao_residencial",
      currentStepIndex: 0,
      formData: {},
      generatedDocument: null,
      setSchemaId: (id) => set({ schemaId: id }),
      setGeneratedDocument: (doc) => set({ generatedDocument: doc }),
      setFormData: (key, value) =>
        set((state) => ({
          formData: { ...state.formData, [key]: value },
        })),
      nextStep: (totalSteps) =>
        set((state) => {
          if (state.currentStepIndex < totalSteps - 1) {
            return { currentStepIndex: state.currentStepIndex + 1 };
          }
          return state;
        }),
      prevStep: () =>
        set((state) => {
          if (state.currentStepIndex > 0) {
            return { currentStepIndex: state.currentStepIndex - 1 };
          }
          return state;
        }),
      reset: () =>
        set({ currentStepIndex: 0, formData: {}, generatedDocument: null }),
    }),
    {
      name: "blue-wizard",
    },
  ),
);
