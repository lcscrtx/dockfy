// Types defining how our Schema-Driven wizard works

export type FieldType =
  | "text"
  | "number"
  | "email"
  | "select"
  | "radio"
  | "date";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SchemaField {
  id: string; // The variable name, e.g., 'locador_nome'
  label: string;
  type: FieldType;
  required?: boolean;
  options?: SelectOption[]; // Used for select or radio types
  placeholder?: string;
  dependsOn?: {
    field: string;
    value: string;
  }; // Used to optionally hide/show this field
}

export interface SchemaStep {
  id: string;
  title: string;
  description?: string;
  fields: SchemaField[];
}

export interface DocumentSchema {
  id: string; // e.g., 'locacao_residencial'
  title: string;
  description: string;
  steps: SchemaStep[];
}
