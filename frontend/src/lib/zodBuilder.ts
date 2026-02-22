import { z } from 'zod';
import type { SchemaField } from '../types/schema';

export function buildZodSchema(fields: SchemaField[]) {
    const shape: Record<string, z.ZodTypeAny> = {};

    fields.forEach((field) => {
        let fieldSchema: z.ZodTypeAny;

        switch (field.type) {
            case 'text':
            case 'radio':
            case 'select':
                if (field.required) {
                    fieldSchema = z.string().min(1, 'Este campo é obrigatório');
                } else {
                    fieldSchema = z.string().optional();
                }

                // Custom validations based on field ID nomenclature
                if (field.id.includes('cpf_cnpj')) {
                    // Accepts either 14 chars (CPF mask) or 18 chars (CNPJ mask)
                    fieldSchema = z.string().refine((val) => val.length === 14 || val.length === 18, {
                        message: 'CPF (14) ou CNPJ (18) inválido'
                    });
                } else if (field.id.includes('cpf')) {
                    fieldSchema = z.string().length(14, 'CPF inválido (Ex: 000.000.000-00)');
                } else if (field.id.includes('cnpj')) {
                    fieldSchema = z.string().length(18, 'CNPJ inválido (Ex: 00.000.000/0000-00)');
                } else if (field.id.includes('rg')) {
                    // Basic length check for RG (can vary by state, so relaxed a bit)
                    fieldSchema = z.string().min(5, 'RG muito curto').max(15, 'RG muito longo');
                }
                break;

            case 'number':
                fieldSchema = z.coerce.number();
                if (!field.required) {
                    fieldSchema = fieldSchema.optional();
                }
                break;

            default:
                fieldSchema = z.string().optional();
        }

        shape[field.id] = fieldSchema;
    });

    return z.object(shape);
}
