import type { SchemaField } from '../types/schema';
import { useFormContext, Controller } from 'react-hook-form';
import { applyMask } from '../lib/masks';

interface DynamicFieldProps {
    field: SchemaField;
}

// Determine if a field needs input masking based on its ID
function getMaskType(fieldId: string): 'cpf_cnpj' | 'cpf' | 'cnpj' | 'phone' | null {
    if (fieldId.includes('cpf_cnpj') || fieldId.includes('cnpj_cpf')) return 'cpf_cnpj';
    if (fieldId.includes('cpf')) return 'cpf';
    if (fieldId.includes('cnpj')) return 'cnpj';
    if (fieldId.includes('telefone') || fieldId.includes('celular')) return 'phone';
    return null;
}

export function DynamicField({ field }: DynamicFieldProps) {
    const { register, watch, control, formState: { errors } } = useFormContext();

    const fieldError = errors[field.id]?.message as string | undefined;

    // Check dependencies
    if (field.dependsOn) {
        const parentValue = watch(field.dependsOn.field);
        if (parentValue !== field.dependsOn.value) {
            return null;
        }
    }

    const baseClasses = `flex w-full rounded-md border px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white
    ${fieldError ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}`;

    const maskType = getMaskType(field.id);
    const needsMask = maskType !== null && (field.type === 'text' || field.type === 'number' || field.type === 'email' || field.type === 'date');

    return (
        <div className="flex flex-col space-y-1.5 w-full mb-4">
            <label className="text-sm font-semibold text-slate-800" htmlFor={field.id}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>

            {(field.type === 'text' || field.type === 'number' || field.type === 'email' || field.type === 'date') ? (
                needsMask ? (
                    // Use Controller for masked fields — safer than overriding register().onChange
                    <Controller
                        name={field.id}
                        control={control}
                        defaultValue=""
                        render={({ field: controllerField }) => (
                            <input
                                id={field.id}
                                type="text"
                                placeholder={field.placeholder}
                                className={baseClasses}
                                value={controllerField.value || ''}
                                onChange={(e) => {
                                    const masked = applyMask(e.target.value, maskType);
                                    controllerField.onChange(masked);
                                }}
                                onBlur={controllerField.onBlur}
                                ref={controllerField.ref}
                            />
                        )}
                    />
                ) : (
                    <input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        className={baseClasses}
                        {...register(field.id)}
                    />
                )
            ) : field.type === 'select' ? (
                <select
                    id={field.id}
                    className={baseClasses}
                    {...register(field.id)}
                >
                    <option value="" disabled>Selecione uma opção</option>
                    {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : field.type === 'radio' ? (
                <div className="flex flex-col space-y-2 mt-1">
                    {field.options?.map((opt) => (
                        <label key={opt.value} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-slate-50 p-2 rounded-md transition-colors border border-transparent hover:border-slate-200">
                            <input
                                type="radio"
                                value={opt.value}
                                className="w-4 h-4 text-slate-900 border-slate-300 focus:ring-slate-900"
                                {...register(field.id)}
                            />
                            <span className="text-slate-700 font-medium">{opt.label}</span>
                        </label>
                    ))}
                </div>
            ) : null}

            {fieldError && (
                <span className="text-red-500 text-xs font-medium mt-1 animate-in fade-in slide-in-from-top-1">
                    {fieldError}
                </span>
            )}
        </div>
    );
}
