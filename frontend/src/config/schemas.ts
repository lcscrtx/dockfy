import type { DocumentSchema } from '../types/schema';

// 1. Contrato de Compra e Venda de Imóvel
export const compraVendaImovelSchema: DocumentSchema = {
    id: 'compra_venda_imovel',
    title: 'Contrato de Compra e Venda de Imóvel',
    description: 'Documento para formalizar a transação de compra e venda imobiliária com segurança.',
    steps: [
        {
            id: 'vendedor',
            title: 'Dados do Vendedor',
            fields: [
                { id: 'vendedor_nome', label: 'Nome Completo', type: 'text', required: true, placeholder: 'Ex: Carlos Alberto Gomes' },
                { id: 'vendedor_cpf_cnpj', label: 'CPF / CNPJ', type: 'text', required: true, placeholder: '000.000.000-00 ou 00.000.000/0000-00' },
                { id: 'vendedor_rg', label: 'RG', type: 'text', required: true },
                { id: 'vendedor_estado_civil', label: 'Estado Civil', type: 'select', required: true, options: [{ label: 'Solteiro(a)', value: 'solteiro' }, { label: 'Casado(a)', value: 'casado' }, { label: 'Divorciado(a)', value: 'divorciado' }, { label: 'Viúvo(a)', value: 'viuvo' }] },
                { id: 'vendedor_profissao', label: 'Profissão', type: 'text', required: true },
                { id: 'vendedor_regime_bens', label: 'Regime de Bens (Se casado)', type: 'select', options: [{ label: 'Não aplicável', value: 'na' }, { label: 'Comunhão Parcial', value: 'parcial' }, { label: 'Comunhão Universal', value: 'universal' }, { label: 'Separação Total', value: 'separacao' }] },
                { id: 'vendedor_endereco', label: 'Endereço Completo', type: 'text', required: true }
            ]
        },
        {
            id: 'comprador',
            title: 'Dados do Comprador',
            fields: [
                { id: 'comprador_nome', label: 'Nome Completo', type: 'text', required: true },
                { id: 'comprador_cpf', label: 'CPF', type: 'text', required: true },
                { id: 'comprador_rg', label: 'RG', type: 'text', required: true },
                { id: 'comprador_estado_civil', label: 'Estado Civil', type: 'select', required: true, options: [{ label: 'Solteiro(a)', value: 'solteiro' }, { label: 'Casado(a)', value: 'casado' }, { label: 'Divorciado(a)', value: 'divorciado' }, { label: 'Viúvo(a)', value: 'viuvo' }] },
                { id: 'comprador_profissao', label: 'Profissão', type: 'text', required: true },
                { id: 'comprador_regime_bens', label: 'Regime de Bens (Se casado)', type: 'select', options: [{ label: 'Não aplicável', value: 'na' }, { label: 'Comunhão Parcial', value: 'parcial' }, { label: 'Comunhão Universal', value: 'universal' }, { label: 'Separação Total', value: 'separacao' }] },
                { id: 'comprador_endereco', label: 'Endereço Completo', type: 'text', required: true }
            ]
        },
        {
            id: 'imovel',
            title: 'Dados do Imóvel',
            fields: [
                { id: 'imovel_endereco', label: 'Endereço Completo do Imóvel', type: 'text', required: true },
                { id: 'imovel_matricula', label: 'Número da Matrícula', type: 'text', required: true },
                { id: 'imovel_cartorio', label: 'Cartório de Registro (Ex: 1º CRI de SP)', type: 'text', required: true },
                { id: 'imovel_area', label: 'Área Total (m²)', type: 'number', required: true },
                { id: 'imovel_tipo', label: 'Tipo do Imóvel', type: 'select', required: true, options: [{ label: 'Apartamento', value: 'apartamento' }, { label: 'Casa', value: 'casa' }, { label: 'Terreno', value: 'terreno' }, { label: 'Sala Comercial', value: 'sala' }] },
                { id: 'imovel_vagas', label: 'Número de Vagas de Garagem', type: 'number', required: true },
                { id: 'imovel_iptu', label: 'Inscrição Imobiliária (IPTU)', type: 'text', required: true }
            ]
        },
        {
            id: 'negociacao',
            title: 'Condições da Negociação',
            fields: [
                { id: 'valor_total', label: 'Valor Total do Imóvel (R$)', type: 'number', required: true },
                { id: 'valor_sinal', label: 'Valor do Sinal/Arras (R$)', type: 'number', required: true },
                { id: 'forma_pagamento', label: 'Forma de Pagamento Base', type: 'select', required: true, options: [{ label: 'À Vista', value: 'avista' }, { label: 'Financiamento Bancário', value: 'financiamento' }, { label: 'Parcelamento Direto', value: 'parcelado' }] },
                { id: 'parcelas_obs', label: 'Detalhes das Parcelas (Se houver)', type: 'text' },
                { id: 'data_posse', label: 'Previsão de Entrega da Posse', type: 'text', required: true, placeholder: 'Ex: Na assinatura do contrato ou 30 dias após' },
                { id: 'resp_itbi', label: 'Responsável pelo ITBI/Despesas', type: 'select', required: true, options: [{ label: 'Comprador', value: 'comprador' }, { label: 'Vendedor', value: 'vendedor' }] },
                { id: 'multa_desistencia', label: 'Multa por Desistência (%)', type: 'number', required: true },
                { id: 'foro', label: 'Foro (Cidade das disputas)', type: 'text', required: true, placeholder: 'Ex: São Paulo - SP' }
            ]
        }
    ]
};

// 2. Contrato de Locação Residencial (Aprimorado)
export const locacaoResidencialSchema: DocumentSchema = {
    id: 'locacao_residencial',
    title: 'Contrato de Locação Residencial',
    description: 'Gere um contrato de locação completo e seguro.',
    steps: [
        {
            id: 'step_locador',
            title: 'Dados do Locador',
            fields: [
                { id: 'locador_nome', label: 'Nome Completo / Razão Social', type: 'text', required: true },
                { id: 'locador_cpf_cnpj', label: 'CPF / CNPJ', type: 'text', required: true },
                { id: 'locador_estado_civil', label: 'Estado Civil', type: 'select', required: true, options: [{ label: 'Solteiro(a)', value: 'solteiro' }, { label: 'Casado(a)', value: 'casado' }, { label: 'Divórcio(a)', value: 'divorciado' }, { label: 'Pessoa Jurídica', value: 'pj' }] },
                { id: 'locador_endereco', label: 'Endereço Físico ou Sede', type: 'text', required: true }
            ]
        },
        {
            id: 'step_locatario',
            title: 'Dados do Locatário',
            fields: [
                { id: 'locatario_nome', label: 'Nome Completo', type: 'text', required: true },
                { id: 'locatario_cpf', label: 'CPF', type: 'text', required: true },
                { id: 'locatario_estado_civil', label: 'Estado Civil', type: 'select', required: true, options: [{ label: 'Solteiro(a)', value: 'solteiro' }, { label: 'Casado(a)', value: 'casado' }, { label: 'Divorciado(a)', value: 'divorciado' }] },
                { id: 'locatario_endereco', label: 'Endereço Atual (Antes da locação)', type: 'text', required: true }
            ]
        },
        {
            id: 'step_imovel',
            title: 'Objeto da Locação',
            fields: [
                { id: 'imovel_endereco', label: 'Endereço Completo do Imóvel', type: 'text', required: true },
                { id: 'imovel_tipo', label: 'Tipo do Imóvel', type: 'select', required: true, options: [{ label: 'Apartamento', value: 'apartamento' }, { label: 'Casa de Rua', value: 'casa' }, { label: 'Casa de Condomínio', value: 'condominio' }] },
                { id: 'imovel_finalidade', label: 'Finalidade', type: 'radio', required: true, options: [{ label: 'Restritamente Residencial', value: 'residencial' }] }
            ]
        },
        {
            id: 'step_condicoes',
            title: 'Condições do Contrato',
            fields: [
                { id: 'valor_aluguel', label: 'Valor Mensal (R$)', type: 'number', required: true },
                { id: 'data_inicio', label: 'Data de Início da Vingência', type: 'text', required: true, placeholder: 'Ex: 01/03/2026' },
                { id: 'prazo_meses', label: 'Prazo da Locação (em meses)', type: 'number', required: true, placeholder: 'Ex: 30' },
                { id: 'indice_reajuste', label: 'Índice de Reajuste', type: 'select', required: true, options: [{ label: 'IGP-M', value: 'igpm' }, { label: 'IPCA', value: 'ipca' }, { label: 'INPC', value: 'inpc' }] },
                { id: 'tipo_garantia', label: 'Garantia Locatícia', type: 'select', required: true, options: [{ label: 'Fiador', value: 'fiador' }, { label: 'Caução em Dinheiro', value: 'caucao' }, { label: 'Seguro Fiança', value: 'seguro' }, { label: 'Sem Garantia', value: 'nenhuma' }] },
                { id: 'valor_multa', label: 'Multa Rescisória (Equivalente a qtd. Aluguéis)', type: 'number', required: true, placeholder: 'Ex: 3' },
                { id: 'foro', label: 'Foro (Cidade das disputas)', type: 'text', required: true }
            ]
        }
    ]
};

// 3. Contrato de Locação Comercial
export const locacaoComercialSchema: DocumentSchema = {
    id: 'locacao_comercial',
    title: 'Contrato de Locação Comercial',
    description: 'Instrumento para locação estruturada para uso empresarial (não residencial).',
    steps: [
        {
            id: 'locador',
            title: 'Partes - Locador',
            fields: [
                { id: 'locador_dados_completos', label: 'Dados Completos do Locador (Nome/Razão Social, CPF/CNPJ, Endereço)', type: 'text', required: true }
            ]
        },
        {
            id: 'locatario',
            title: 'Partes - Locatário',
            fields: [
                { id: 'locatario_dados_completos', label: 'Dados Completos do Locatário (Empresa, CNPJ, Sede, Representante)', type: 'text', required: true }
            ]
        },
        {
            id: 'imovel',
            title: 'Dados do Imóvel Comercial',
            fields: [
                { id: 'imovel_endereco', label: 'Endereço Completo', type: 'text', required: true },
                { id: 'imovel_tipo', label: 'Tipo', type: 'select', required: true, options: [{ label: 'Loja de Rua', value: 'loja' }, { label: 'Sala Comercial', value: 'sala' }, { label: 'Galpão Industrial', value: 'galpao' }] },
                { id: 'imovel_area', label: 'Área Total Útil (m²)', type: 'number', required: true },
                { id: 'destinacao_comercial', label: 'Destinação Comercial Principal', type: 'text', required: true, placeholder: 'Ex: Padaria e Confeitaria' },
                { id: 'atividade_exercida', label: 'Atividade Exata a ser Exercida', type: 'text', required: true }
            ]
        },
        {
            id: 'condicoes',
            title: 'Condições Comerciais',
            fields: [
                { id: 'valor_aluguel', label: 'Valor Mensal (R$)', type: 'number', required: true },
                { id: 'prazo_meses', label: 'Prazo do Contrato (meses)', type: 'number', required: true, placeholder: 'Ex: 60' },
                { id: 'indice_reajuste', label: 'Índice de Reajuste', type: 'select', required: true, options: [{ label: 'IGP-M', value: 'igpm' }, { label: 'IPCA', value: 'ipca' }] },
                { id: 'garantia', label: 'Garantia', type: 'select', required: true, options: [{ label: 'Fiador PJ', value: 'fiadorpj' }, { label: 'Fiador PF', value: 'fiadorpf' }, { label: 'Seguro Fiança Banco', value: 'segurobanco' }, { label: 'Caução', value: 'caucao' }] },
                { id: 'clausula_renovacao', label: 'Regra da Cláusula de Renovação', type: 'text', placeholder: 'Ex: Garantida caso aviso prévio de 180 dias' },
                { id: 'seguro_obrigatorio', label: 'Seguro Contra Incêndio é Obrigatório?', type: 'radio', required: true, options: [{ label: 'Sim, a cargo do locatário', value: 'sim' }, { label: 'Não', value: 'nao' }] },
                { id: 'multa', label: 'Multa Rescisória Antecipada', type: 'text', required: true, placeholder: 'Ex: 3 aluguéis vigentes proporcionais' },
                { id: 'foro', label: 'Foro (Cidade das disputas)', type: 'text', required: true }
            ]
        }
    ]
};

// 4. Proposta de Compra de Imóvel
export const propostaCompraSchema: DocumentSchema = {
    id: 'proposta_compra',
    title: 'Proposta de Compra de Imóvel',
    description: 'Documento preliminar de negociação contendo valores, prazos e condições oferecidas.',
    steps: [
        {
            id: 'partes',
            title: 'Formuladores da Proposta',
            fields: [
                { id: 'dados_proponente', label: 'Dados do Proponente / Comprador', type: 'text', required: true, placeholder: 'Nome completo, CPF e contatos informais' },
                { id: 'dados_proprietario', label: 'Dados do Proprietário / Vendedor', type: 'text', required: true }
            ]
        },
        {
            id: 'imovel',
            title: 'Identificação',
            fields: [
                { id: 'identificacao_imovel', label: 'Identificação do Imóvel', type: 'text', required: true, placeholder: 'Edifício tal, Apto X, Rua Y. Matrícula (opcional)' }
            ]
        },
        {
            id: 'condicoes',
            title: 'Oferta',
            fields: [
                { id: 'valor_ofertado', label: 'Valor Total Ofertado (R$)', type: 'number', required: true },
                { id: 'forma_pagamento', label: 'Forma e Fluxo de Pagamento', type: 'text', required: true, placeholder: 'Ex: R$50mil à vista, resto bancário' },
                { id: 'valor_sinal', label: 'Valor do Sinal Prometido (R$)', type: 'number', required: true },
                { id: 'prazo_validade', label: 'Prazo de Validade desta Proposta', type: 'text', required: true, placeholder: 'Ex: 48 horas a partir do envio' },
                { id: 'condicoes_extras', label: 'Condições Extras (Ex: Sujeito à aprovação de crédito)', type: 'text' },
                { id: 'data_emissao', label: 'Data de Emissão', type: 'text', required: true },
                { id: 'assinaturas', label: 'Considerar C.C de Corretores/Assinaturas de Testemunhas?', type: 'radio', options: [{ label: 'Sim', value: 'sim' }, { label: 'Não', value: 'nao' }] }
            ]
        }
    ]
};

// 5. Autorização de Venda (Imobiliária)
export const autorizacaoVendaSchema: DocumentSchema = {
    id: 'autorizacao_venda',
    title: 'Autorização de Venda Imobiliária',
    description: 'Contrato de prestação de serviços e corretagem imobiliária (exclusividade ou não).',
    steps: [
        {
            id: 'proprietario',
            title: 'Proprietário',
            fields: [
                { id: 'proprietario_nome', label: 'Nome Completo', type: 'text', required: true },
                { id: 'proprietario_cpf_cnpj', label: 'CPF / CNPJ', type: 'text', required: true },
                { id: 'proprietario_endereco', label: 'Endereço Atual do Proprietário', type: 'text', required: true }
            ]
        },
        {
            id: 'imobiliaria',
            title: 'Corretor / Imobiliária',
            fields: [
                { id: 'imobiliaria_nome', label: 'Nome do Corretor ou Razão Social', type: 'text', required: true },
                { id: 'imobiliaria_creci', label: 'Número no CRECI', type: 'text', required: true },
                { id: 'imobiliaria_cnpj', label: 'CNPJ (Se PJ)', type: 'text' },
                { id: 'imobiliaria_endereco', label: 'Endereço Sede', type: 'text', required: true }
            ]
        },
        {
            id: 'imovel',
            title: 'O Imóvel Angariado',
            fields: [
                { id: 'imovel_endereco', label: 'Endereço do Imóvel para Venda', type: 'text', required: true },
                { id: 'imovel_matricula', label: 'Nº da Matrícula', type: 'text', required: true },
                { id: 'imovel_tipo', label: 'Tipologia do Imóvel', type: 'text', required: true, placeholder: 'Ex: Cobertura Duplex' }
            ]
        },
        {
            id: 'condicoes',
            title: 'Regras de Agenciamento',
            fields: [
                { id: 'valor_venda', label: 'Valor Mínimo/Desejado de Venda (R$)', type: 'number', required: true },
                { id: 'percentual_comissao', label: 'Percentual de Comissão (%)', type: 'number', required: true },
                { id: 'prazo_autorizacao', label: 'Prazo de Validade da Autorização (dias)', type: 'number', required: true },
                { id: 'exclusividade', label: 'Possui Exclusividade de Venda?', type: 'radio', required: true, options: [{ label: 'Sim (Somente esta imobiliária)', value: 'sim' }, { label: 'Não (Aberta a outras)', value: 'nao' }] },
                { id: 'multa_direta', label: 'Multa por venda por fora (caso Exclusividade)', type: 'text', placeholder: 'Ex: Pagamento integral da comissão de 6%' },
                { id: 'foro', label: 'Foro (Cidade das disputas)', type: 'text', required: true }
            ]
        }
    ]
};

// 6. Recibo de Sinal / Arras
export const reciboSinalSchema: DocumentSchema = {
    id: 'recibo_sinal',
    title: 'Recibo de Sinal (Arras)',
    description: 'Documento legal de adiantamento atrelando a obrigação de celebrar um contrato futuro.',
    steps: [
        {
            id: 'pagador_recebedor',
            title: 'Partes Financeiras',
            fields: [
                { id: 'pagador_nome', label: 'Nome de quem está Pagando o Sinal', type: 'text', required: true },
                { id: 'pagador_cpf', label: 'CPF', type: 'text', required: true },
                { id: 'recebedor_nome', label: 'Nome de quem está Recebendo o Sinal', type: 'text', required: true },
                { id: 'recebedor_cpf_cnpj', label: 'CPF / CNPJ de quem recebe', type: 'text', required: true }
            ]
        },
        {
            id: 'valores',
            title: 'Valores e Objeto',
            fields: [
                { id: 'valor_pago', label: 'Valor Exato Pago (R$)', type: 'number', required: true },
                { id: 'forma_pagamento', label: 'Forma de Pagamento (PIX, TED, Dinheiro, etc)', type: 'text', required: true },
                { id: 'data_pagamento', label: 'Data Efetiva do Pagamento', type: 'text', required: true },
                { id: 'imovel_referencia', label: 'Qual o imóvel referência da transação?', type: 'text', required: true },
                { id: 'tipo_arras', label: 'Tipo Legal das Arras', type: 'select', required: true, options: [{ label: 'Confirmatórias (Garante negócio sem direito a desiste)', value: 'confirmatorias' }, { label: 'Penitenciais (Permitem desistência com perda do valor)', value: 'penitenciais' }] },
                { id: 'assinaturas_testemunhas', label: 'Requerer assinatura de 2 Testemunhas no Rodapé?', type: 'radio', options: [{ label: 'Sim', value: 'sim' }, { label: 'Não', value: 'nao' }] }
            ]
        }
    ]
};

// 7. Termo de Vistoria de Imóvel
export const termoVistoriaSchema: DocumentSchema = {
    id: 'termo_vistoria',
    title: 'Termo de Vistoria de Imóvel',
    description: 'Laudo de entrada e saída atestando o estado físico de conservação da propriedade.',
    steps: [
        {
            id: 'partes',
            title: 'Identificação',
            fields: [
                { id: 'dados_locador', label: 'Dados do Locador / Proprietário', type: 'text', required: true },
                { id: 'dados_locatario', label: 'Dados do Locatário / Inquilino', type: 'text', required: true },
                { id: 'imovel_endereco', label: 'Endereço Completo do Imóvel Vistoriado', type: 'text', required: true },
                { id: 'data_vistoria', label: 'Data Exata da Inspeção/Vistoria', type: 'text', required: true }
            ]
        },
        {
            id: 'estado_critico',
            title: 'Inspeção',
            fields: [
                { id: 'estado_comodos', label: 'Descrição Geral do Estado Paredes/Pisos/Tetos', type: 'text', required: true, placeholder: 'Ex: Pintura nova branca, piso cerâmico intacto exceto sala' },
                { id: 'estado_moveis', label: 'Inventário e Estado de Móveis (Se for mobiliado/semi)', type: 'text' },
                { id: 'leitura_agua', label: 'Leitura/Relógio da Água (Sabesp/Concessionária)', type: 'text', required: true },
                { id: 'leitura_luz', label: 'Leitura/Relógio da Luz (Enel/Concessionária)', type: 'text', required: true },
                { id: 'leitura_gas', label: 'Leitura/Relógio de Gás (Comgás/Tubulação)', type: 'text' },
                { id: 'fotos_anexas', label: 'Haverá anexo fotográfico obrigatório?', type: 'radio', required: true, options: [{ label: 'Sim', value: 'sim' }, { label: 'Não', value: 'nao' }] },
                { id: 'assinaturas_obrigatorias', label: 'Locatário concorda plenamente com a vistoria?', type: 'radio', options: [{ label: 'Sim', value: 'sim' }, { label: 'Não - Requerer Campo de Ressalva', value: 'ressalva' }] }
            ]
        }
    ]
};

// 8. Contrato de Administração Imobiliária
export const adminImobiliariaSchema: DocumentSchema = {
    id: 'admin_imobiliaria',
    title: 'Contrato de Administração Imobiliária',
    description: 'Otorga poderes para a Imobiliária/Administradora gerir, alugar e repassar valores do imóvel.',
    steps: [
        {
            id: 'proprietario',
            title: 'Proprietário (Outorgante)',
            fields: [
                { id: 'proprietario_nome', label: 'Nome', type: 'text', required: true },
                { id: 'proprietario_cpf', label: 'CPF', type: 'text', required: true },
                { id: 'proprietario_endereco', label: 'Endereço Residencial Atual', type: 'text', required: true }
            ]
        },
        {
            id: 'administradora',
            title: 'Administradora (Outorgada)',
            fields: [
                { id: 'imobiliaria_razao_social', label: 'Razão Social da Imobiliária', type: 'text', required: true },
                { id: 'imobiliaria_cnpj', label: 'CNPJ', type: 'text', required: true },
                { id: 'imobiliaria_creci', label: 'CRECI', type: 'text', required: true },
                { id: 'imobiliaria_endereco', label: 'Endereço Comercial da Imobiliária', type: 'text', required: true }
            ]
        },
        {
            id: 'condicoes',
            title: 'Regras da Administração',
            fields: [
                { id: 'percentual_taxa', label: 'Taxa de Administração (Percentual % sobre os aluguéis)', type: 'number', required: true, placeholder: 'Ex: 10' },
                { id: 'resp_imobiliaria', label: 'Escopo Exato das Responsabilidades', type: 'text', required: true, placeholder: 'Ex: Emissão de boletos, cobrança, repasse até dia 15, vistoria.' },
                { id: 'prazo_contrato', label: 'Prazo deste contrato de administração (meses)', type: 'number', required: true },
                { id: 'taxas_adicionais', label: 'Cláusula de Taxa sobre o 1º Mês de Aluguel (Taxa de Agenciamento Nova Locação)', type: 'text', placeholder: 'Ex: O 1º aluguel fica 100% com a Imobiliária' },
                { id: 'autorizacao_judicial', label: 'Autoriza ingresso automático na justiça (Ações de Despejo) em nome do Proprietário?', type: 'radio', required: true, options: [{ label: 'Sim', value: 'sim' }, { label: 'Não', value: 'nao' }] },
                { id: 'foro', label: 'Foro (Cidade das disputas)', type: 'text', required: true }
            ]
        }
    ]
};

// Exportar todos juntos num único dicionário exportável mapeado pelo ID
export const schemaRegistry: Record<string, DocumentSchema> = {
    [compraVendaImovelSchema.id]: compraVendaImovelSchema,
    [locacaoResidencialSchema.id]: locacaoResidencialSchema,
    [locacaoComercialSchema.id]: locacaoComercialSchema,
    [propostaCompraSchema.id]: propostaCompraSchema,
    [autorizacaoVendaSchema.id]: autorizacaoVendaSchema,
    [reciboSinalSchema.id]: reciboSinalSchema,
    [termoVistoriaSchema.id]: termoVistoriaSchema,
    [adminImobiliariaSchema.id]: adminImobiliariaSchema
};
