import { useEffect, useMemo } from 'react';
import { schemaRegistry } from '../config/schemas';
import { useWizardStore } from '../store/wizardStore';
import { useDocumentStore } from '../store/documentStore';
import { DynamicField } from '../components/DynamicField';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildZodSchema } from '../lib/zodBuilder';
import { motion, AnimatePresence } from 'framer-motion';
import { generateDocumentMarkdown } from '../lib/documentGenerator';

export function Wizard() {
    const { templateId } = useParams<{ templateId: string }>();
    const navigate = useNavigate();

    const { currentStepIndex, formData, setFormData, nextStep, prevStep, reset, setSchemaId, schemaId } = useWizardStore();
    const addDocument = useDocumentStore((s) => s.addDocument);

    const schema = schemaRegistry[templateId || schemaId] || schemaRegistry['locacao_residencial'];

    useEffect(() => {
        if (templateId) {
            setSchemaId(templateId);
            reset();
        }
    }, [templateId, setSchemaId, reset]);

    const totalSteps = schema.steps.length;
    const currentStepIndexSafe = Math.min(currentStepIndex, Math.max(0, totalSteps - 1));
    const currentStep = schema.steps[currentStepIndexSafe] || schema.steps[0];

    const stepZodSchema = useMemo(() => buildZodSchema(currentStep.fields), [currentStep]);

    const methods = useForm({
        resolver: zodResolver(stepZodSchema),
        defaultValues: formData,
        mode: 'onTouched'
    });

    const { handleSubmit, reset: resetForm } = methods;

    useEffect(() => {
        resetForm(formData);
    }, [currentStepIndex, resetForm, formData]);

    useEffect(() => {
        if (currentStepIndex === 0 && Object.keys(formData).length === 0) {
            reset();
        }
    }, []);

    const onValidNext = async (data: Record<string, string>) => {
        const currentData = { ...formData, ...data };

        Object.entries(data).forEach(([key, value]) => {
            setFormData(key, value as string);
        });

        if (currentStepIndex === totalSteps - 1) {
            const markdownText = generateDocumentMarkdown(schemaId, currentData);
            useWizardStore.getState().setGeneratedDocument(markdownText);

            const newDocId = `DOC-${Math.floor(Math.random() * 9000) + 1000}`;

            const valueField = currentData['valor_aluguel'] || currentData['valor_total'] || currentData['valor_ofertado'] || currentData['valor_pago'] || currentData['valor_venda'] || '';
            const valueDisplay = valueField ? `R$ ${valueField}` : '-';
            const typeLabel = schema.title.split(' ').slice(0, 2).join(' ');

            // Save to Supabase
            await addDocument({
                id: newDocId,
                schema_id: schemaId,
                title: `${schema.title} - ${currentData['locador_nome'] || currentData['vendedor_nome'] || currentData['proprietario_nome'] || currentData['recebedor_nome'] || currentData['dados_proponente'] || 'Cliente'}`,
                type: typeLabel,
                status: 'gerado',
                value: valueDisplay,
                markdown_content: markdownText,
                form_data: currentData,
            });

            navigate(`/document/${newDocId}`);
        } else {
            nextStep(totalSteps);
        }
    };

    const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center pt-10 pb-20 px-4">
            <div className="w-full max-w-3xl mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6 flex items-center gap-1"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Voltar ao Início
                </button>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{schema.title}</h1>
                <p className="text-slate-500 mt-1">{schema.description}</p>
            </div>

            <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-500">
                        Passo {currentStepIndex + 1} de {totalSteps}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                        {Math.round(progressPercentage)}% concluído
                    </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                        className="bg-slate-900 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-2xl font-bold text-slate-900">{currentStep.title}</h2>
                    {currentStep.description && (
                        <p className="text-slate-500 mt-1">{currentStep.description}</p>
                    )}
                </div>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onValidNext)} className="p-8">
                        <div className="overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStepIndex}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="grid grid-cols-1 gap-4"
                                >
                                    {currentStep.fields.map((field) => (
                                        <DynamicField key={field.id} field={field} />
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="mt-10 flex justify-between items-center pt-6 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStepIndex === 0}
                                className={`px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2
                  ${currentStepIndex === 0
                                        ? 'text-slate-300 cursor-not-allowed bg-slate-50'
                                        : 'text-slate-600 hover:bg-slate-100 bg-white border border-slate-200 shadow-sm'}`}
                            >
                                Voltar
                            </button>
                            <button
                                type="submit"
                                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm active:scale-[0.98] flex items-center gap-2"
                            >
                                {currentStepIndex === totalSteps - 1 ? (
                                    <>Finalizar Documento <CheckCircle2 className="w-4 h-4 ml-1" /></>
                                ) : (
                                    <>Próximo Passo <ChevronRight className="w-4 h-4 ml-1" /></>
                                )}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
