// This file contains the template text for the 8 available schemas.
// The engine replaces `{{ key }}` with the value from the form data.

const templatesRegistry: Record<string, string> = {
    compra_venda_imovel: `
# INSTRUMENTO PARTICULAR DE COMPRA E VENDA DE IMÓVEL

Pelo presente instrumento particular, de um lado, **{{ vendedor_nome }}**, {{ vendedor_estado_civil }}, {{ vendedor_profissao }}, portador do RG nº **{{ vendedor_rg }}** e CPF/CNPJ nº **{{ vendedor_cpf_cnpj }}**, residente e domiciliado em **{{ vendedor_endereco }}** (doravante denominado(a) **VENDEDOR(A)**);

E, de outro lado, **{{ comprador_nome }}**, {{ comprador_estado_civil }}, {{ comprador_profissao }}, portador do RG nº **{{ comprador_rg }}** e CPF nº **{{ comprador_cpf }}**, residente e domiciliado em **{{ comprador_endereco }}** (doravante denominado(a) **COMPRADOR(A)**);

### CLÁUSULA 1ª - DO OBJETO E IMÓVEL
O **VENDEDOR** é legítimo proprietário do imóvel correspondente a um/uma **{{ imovel_tipo }}**, com área total de **{{ imovel_area }}** m², situado em **{{ imovel_endereco }}**. 
O imóvel encontra-se matriculado sob o nº **{{ imovel_matricula }}** no **{{ imovel_cartorio }}**. Inscrição municipal (IPTU): **{{ imovel_iptu }}**. Possui direito a **{{ imovel_vagas }}** vaga(s) de garagem.

### CLÁUSULA 2ª - DO PREÇO E CONDIÇÕES DE PAGAMENTO
O preço certo e ajustado da presente compra e venda é de **R$ {{ valor_total }}**.

1. **Sinal/Arras**: R$ **{{ valor_sinal }}** como sinal e princípio de pagamento.
2. **Saldo Remanescente e Forma**: **{{ forma_pagamento }}**.
3. **Detalhes das Parcelas**: **{{ parcelas_obs }}**

### CLÁUSULA 3ª - DA POSSE E TRANSFERÊNCIA
A posse precária do imóvel será transferida ao **COMPRADOR** na seguinte previsão: **{{ data_posse }}**.
Fica ajustado que o responsável pelas despesas de transferência, registro e ITBI será o(a) **{{ resp_itbi }}**.

### CLÁUSULA 4ª - DAS PENALIDADES E DESISTÊNCIA
Em caso de desistência ou arrependimento por qualquer das partes, haverá a aplicação de multa compensatória no valor de **{{ multa_desistencia }}%** sobre o valor total do contrato.

### CLÁUSULA 5ª - DO FORO DE ELEIÇÃO
Para dirimir quaisquer dúvidas oriundas deste contrato, as partes elegem o foro de **{{ foro }}**, renunciando a qualquer outro por mais privilegiado que seja.

E por estarem assim justos e contratados, assinam o presente contrato em 02 (duas) vias de igual teor e forma.

<br/>
<br/>
<br/>

___________________________________________________
**{{ vendedor_nome }}**
Vendedor(a)

<br/>
<br/>
<br/>

___________________________________________________
**{{ comprador_nome }}**
Comprador(a)

<br/>
<br/>
<br/>

___________________________________________________
**Testemunha 1**
CPF:

<br/>
<br/>
<br/>

___________________________________________________
**Testemunha 2**
CPF:
`,

    locacao_residencial: `
# CONTRATO DE LOCAÇÃO RESIDENCIAL

Pelo presente instrumento particular, as partes abaixo qualificadas celebram o presente contrato de locação de imóvel residencial, com base na Lei do Inquilinato (Lei nº 8.245/1991):

**LOCADOR(A):** **{{ locador_nome }}**, portador do CPF/CNPJ nº **{{ locador_cpf_cnpj }}**, {{ locador_estado_civil }}, residente e domiciliado/sede em **{{ locador_endereco }}**.

**LOCATÁRIO(A):** **{{ locatario_nome }}**, portador do CPF nº **{{ locatario_cpf }}**, {{ locatario_estado_civil }}, residente e domiciliado em **{{ locatario_endereco }}**.

### CLÁUSULA 1ª - DO IMÓVEL E FINALIDADE
O **LOCADOR** dá em locação ao **LOCATÁRIO** o imóvel de sua propriedade restrito à modalidade **{{ imovel_tipo }}**, situado à **{{ imovel_endereco }}**. A finalidade desta locação é estritamente **{{ imovel_finalidade }}**. 

### CLÁUSULA 2ª - DO VALOR, PRAZO E REAJUSTE
O valor do aluguel mensal fica ajustado em **R$ {{ valor_aluguel }}**, com vigência a partir de **{{ data_inicio }}** e prazo total estipulado em **{{ prazo_meses }} meses**.
O reajuste do aluguel, caso o contrato seja renovado tacitamente ou por aditivo, será calculado anualmente com base no acumulado do índice **{{ indice_reajuste }}**.

### CLÁUSULA 3ª - DAS GARANTIAS LOCATÍCIAS
Como garantia fiel das obrigações financeiras e acessórias assumidas neste instrumento, o **LOCATÁRIO** apresenta o modelo de: **{{ tipo_garantia }}**.

### CLÁUSULA 4ª - DA MULTA RESCISÓRIA
No caso de devolução do imóvel ou rescisão antecipada motivada por quebra de contrato, incidirá a multa estipulada equivalente a **{{ valor_multa }} aluguéis vigentes**, devidos e calculados proporcionalmente ao tempo não cumprido do contrato estipulado na Cláusula 2ª.

### CLÁUSULA 5ª - DO FORO
Para dirimir quaisquer demandas ou litígios oriundos deste Contrato de Locação, as partes elegem o foro da comarca de **{{ foro }}**.

E por estarem assim justos e contratados, assinam o presente instrumento.

<br/>
<br/>
<br/>

___________________________________________________
**{{ locador_nome }}**
Locador(a)

<br/>
<br/>
<br/>

___________________________________________________
**{{ locatario_nome }}**
Locatário(a)
`,

    locacao_comercial: `
# CONTRATO DE LOCAÇÃO NÃO RESIDENCIAL (COMERCIAL)

**LOCADOR(A):** **{{ locador_dados_completos }}**

**LOCATÁRIO(A):** **{{ locatario_dados_completos }}**

### CLÁUSULA 1ª - DO OBJETO E CARACTERÍSTICAS
O presente contrato tem como objeto o imóvel de formato **{{ imovel_tipo }}**, com área útil e locável estipulada de **{{ imovel_area }}**m², situado no endereço **{{ imovel_endereco }}**.

**Destinação e Atividade Comercial:** O imóvel supracitado será utilizado primordialmente para **{{ destinacao_comercial }}**, sendo a atividade exata a ser exercida legalmente correspondente a: **{{ atividade_exercida }}**.

### CLÁUSULA 2ª - DO ALUGUEL, PRAZO MENSAL E ÍNDICES
O **LOCATÁRIO** pagará mensalmente, a título de aluguel pleno, o valor de **R$ {{ valor_aluguel }}**.
O prazo inquestionável desta locação comercial é de **{{ prazo_meses }} meses**. 
Índice de reajuste econômico anual acordado entre as partes: **{{ indice_reajuste }}**.

### CLÁUSULA 3ª - DE SEGUROS E PROTEÇÃO PATRIMONIAL DO PONTO
Conforme acordado preliminarmente, a garantia prestada é: **{{ garantia }}**.
Obrigação expressa sobre a contratação de Seguro contra Incêndio e Sinistros: **{{ seguro_obrigatorio }}**.

### CLÁUSULA 4ª - DA RENOVAÇÃO E RESCISÃO ANTECIPADA
Regras definidas para Cláusula de Renovação: **{{ clausula_renovacao }}**.
Penalidade estipulada para Rescisão e Multas Antecipadas: **{{ multa }}**.

### CLÁUSULA 5ª - DO FORO DE ELEIÇÃO
Fica eleito o Foro da Comarca de **{{ foro }}** para processamento de litígios.

E por estarem em perfeito e mútuo acordo comercial, assinam o presente.

<br/>
<br/>
<br/>

___________________________________________________
**LOCADOR**

<br/>
<br/>
<br/>

___________________________________________________
**LOCATÁRIO**
`,

    proposta_compra: `
# PROPOSTA FORMAL VINCULANTE DE COMPRA DE IMÓVEL

**DATA DE EMISSÃO DA PROPOSTA:** **{{ data_emissao }}**

### 1. PROPONENTE (COMPRADOR INTERESSADO)
**{{ dados_proponente }}**

### 2. PROPRIETÁRIO ALVO
**{{ dados_proprietario }}**

### 3. IMÓVEL DE INTERESSE
A presente proposta formaliza a intenção inegociável para a aquisição da totalidade do bem imóvel correspondente a:
**{{ identificacao_imovel }}**.

### 4. DO VALOR OFERTADO E ESTRUTURA DE PAGAMENTO
Pela compra definitiva do referido imóvel, o **PROPONENTE** oferece firmar negócio pagando o Valor Total de **R$ {{ valor_ofertado }}**.
Este montante será honrado seguindo esta forma e fluxo financeiro detalhado a seguir: 
**{{ forma_pagamento }}**.

*Sinal/Arras Ofertado na assinatura desta proposta e aceitação mútua pelo proprietário:* **R$ {{ valor_sinal }}**.

### 5. DA VALIDADE JURÍDICA E CONDIÇÕES EXTRAS ESPERADAS
*Condições e Ressalvas Estipuladas ao Negócio:* **{{ condicoes_extras }}**
*A presente proposta tem prazo de validade inflexível atrelada a expirar em:* **{{ prazo_validade }}**.

Assinaturas e CC de Corretores Adicionais?: **{{ assinaturas }}**

<br/>
<br/>
<br/>

_____________________________________________
**Assinatura do Proponente**
`,

    autorizacao_venda: `
# CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CORRETAGEM E AUTORIZAÇÃO DE VENDA

**OUTORGANTE (PROPRIETÁRIO):** **{{ proprietario_nome }}**, pessoa física ou jurídica inscrita no CPF/CNPJ **{{ proprietario_cpf_cnpj }}**, com domicílio/sede administrativo localizado em **{{ proprietario_endereco }}**.

**OUTORGADA (IMOBILIÁRIA INSTITUÍDA/CORRETOR):** **{{ imobiliaria_nome }}**, corretora ou pessoa jurídica registrada legalmente no CRECI sob nº **{{ imobiliaria_creci }}**, possuidora do CNPJ nº **{{ imobiliaria_cnpj }}**, estabelecida em **{{ imobiliaria_endereco }}**.

### CLÁUSULA 1ª - DO OBJETO E CONDIÇÕES DE MERCADO E VENDA
O **OUTORGANTE** de livre e espontânea vontade autoriza expressamente a **OUTORGADA** a promover a divulgação, captação de clientes e a venda do imóvel sob sua propriedade, classificado como **{{ imovel_tipo }}**, devidamente registrado sob a Matrícula n° **{{ imovel_matricula }}** e localizado no endereço **{{ imovel_endereco }}**.
Fica estabelecido que o valor mínimo de autorização base para captação no mercado e negociação de venda pública é de **R$ {{ valor_venda }}**.

### CLÁUSULA 2ª - DOS HONORÁRIOS, COMISSÃO E EXCLUSIVIDADE
Os honorários de corretagem devidos à **OUTORGADA**, em caso de sucesso na indicação de comprador e concretização da venda ou sinal de arras, será equivalente a **{{ percentual_comissao }}%** calculados sobre o valor transacionado e apurado no instrumento de venda.
É decretado que esta autorização profissional possui caráter de Exclusividade Mercantil?: **{{ exclusividade }}**.
*Cláusulas restritivas de Multas ou infração por descumprimento de agenciamento:* **{{ multa_direta }}**.

### CLÁUSULA 3ª - DOS PRAZOS DE VIGÊNCIA DO SERVIÇO
A presente Autorização Oficial de Vendas é concedida à contratada pelo prazo restrito de **{{ prazo_autorizacao }} dias**.

### CLÁUSULA 4ª - DO FORO PARA REGULARIZAÇÃO
As partes escolhem eleger de comum acordo o Foro da Comarca de **{{ foro }}** para o processamento e acionamento de eventuais cobranças por infração das cláusulas acima.

Para a validade jurídica das disposições contidas, firmam o presente.

<br/>
<br/>
<br/>

_____________________________________________
**Outorgante (Proprietário)**

<br/>
<br/>
<br/>

_____________________________________________
**Outorgada (Imobiliária/Corretor)**
`,

    recibo_sinal: `
# RECIBO OFICIAL DE SINAL E PRINCÍPIO DE PAGAMENTO E ARRAS INSTITUÍDAS

EU, **{{ recebedor_nome }}**, regularmente inscrito e portador do CPF/CNPJ nº **{{ recebedor_cpf_cnpj }}**, DECLARO para todos os fins de direito e comprovação mercantil e financeira que, espontânea e validamente, **RECEBI MÚTUO E QUITAÇÃO** oriundo de **{{ pagador_nome }}**, portador(a) legal do CPF nº **{{ pagador_cpf }}**, o volume de fluxo e a exata quantia pecuniária descrita na ordem abaixo:

**VALOR CELEBRADO: R$ {{ valor_pago }}**

A referida e atestada transferência interbancária ou modal atesta o repasse de valores feito através de **{{ forma_pagamento }}**, ocorrido com confirmação integral de fundos na data cravada de **{{ data_pagamento }}**.

O presente Termo de Recibo de Quitação tem por ÚNICA finalidade e natureza formal a confirmação temporal da reserva e do princípio contábil do negócio alinhado ou proposto em proposta adjacente ou vinculada sobre o bem imóvel em negociação a seguir descrito: **{{ imovel_referencia }}**.

### ESTIPULAÇÃO E LEITURA JURÍDICA DAS ARRAS APLICÁVEIS:
Fica devidamente formalizado e pacificado em comum determinação contratual entre o receptor assinante e as partes interessadas do fluxo de capitais descritos acima que tal montante materializa efetivo "Arras" na categoria e modelo: **{{ tipo_arras }}**.

Condições marginais e sub-assinaturas/testemunhas declaratórias da visualização atestadas para além do valor monetário no Instrumento de Fechamento: **{{ assinaturas_testemunhas }}**.

Declaro ser verdade a transição líquida descrita no caput e confirmo a quitação desta sub-parcela e as chaves de transferência do sinal sem quaisquer objeção ao recebedor.

<br/>
<br/>
<br/>

_____________________________________________
**Assinatura de quem Paga (Pagador)**

<br/>
<br/>
<br/>

_____________________________________________
**Assinatura Legítima de Recebimento de Valores Supracitados**
`,

    termo_vistoria: `
# LAUDO PRELIMINAR E TERMO DE VISTORIA IMOBILIÁRIA CAUTELAR

**Dados Descritivos do Imóvel Em Vistoria:** **{{ imovel_endereco }}**
**Data Efetiva da Vistoria Imobiliária In Loco:** **{{ data_vistoria }}**

O Termo Caucionário e de Vistoria estabelece visual e descritivamente as condições atuais e exatas estruturais do bem imobiliário listado no título, atestadas pela análise acurada de ambas as partes (ou procuradores) logo abaixo formalmente descritas.

### 1. PARTES RELACIONADAS:
**Proprietário / Titular Ocupante Atual / Locador:** **{{ dados_locador }}**
**Inquilino Promitente / Locatário Adquirente:** **{{ dados_locatario }}**

### 2. RESULTADO DA INSPEÇÃO GERAL E ESTRUTURAL DA PLANTA:
O estado técnico geral avaliado dos cômodos divididos na planta (o escopo comtemplando detalhadamente a averiguação da pintura das paredes, a padronização das cerâmicas e assoalho, verificação da azulejaria e reboco geral, higidez em vidros das janelas instaladas e eventuais vícios e fissuras em gesso ou reboco no teto) foi classificado resumidamente como descreve o parecer a seguir:
> **{{ estado_comodos }}**

### 3. CONDIÇÃO AVALIADA DE MOBILIÁRIO E INVENTÁRIO (Se Aplicável Integrado Ao Bem):
> **{{ estado_moveis }}**

### 4. MEMÓRIA EM REGISTROS LEITURISTAS DE ENTRADA E APURAÇÃO DE MARCADORES FÍSICOS:
Em face as responsabilidades delegadas para a ocupação do imóvel e seus débitos de repasse para o Locatário:
*   **Aferição no Hidrômetro (Água):** Registra o montante visualizado de **{{ leitura_agua }}**
*   **Aferição no Relógio Elétrico (Luz):** Registra a posição final do ciclo anterior confirmada de **{{ leitura_luz }}**
*   **Aferição do Relógio Controlador (Gás):** Registra a taxa em metros cúbicos cravada no instante: **{{ leitura_gas }}**

Considerações a parte; Foram exigidos registros ou dossiês de Anexos Fotográficos com o aval do perito à esta Assinatura Documental Base?: **{{ fotos_anexas }}**.
O(A) Indivíduo Inquilino e Contratante concorda plenamente e sem vícios ou ressalvas impeditórias na planta visitada e listada supra?: **{{ assinaturas_obrigatorias }}**.

Por ser a expressão puramente verdadeira da ordem física contemporânea do bem na competência cronológica desta data; assinam este Laudo Pericial Simples como prova documental as partes vinculadas.

<br/>
<br/>
<br/>

_____________________________________________
**Locador / Vistoriador / Avaliador Subscritor**

<br/>
<br/>
<br/>

_____________________________________________
**Inquilino Plenamente Ciente das Avaliações Declaradas**
`,

    admin_imobiliaria: `
# CONTRATO GERAL DE PRESTAÇÃO DE SERVIÇOS TÉCNICOS E ADMINISTRAÇÃO EXTRAJUDICIAL DA PAUTA IMOBILIÁRIA

Este instrumento particular baliza acordos corporativos e civis plenos garantidos entre os subscritos:

**OUTORGANTE CONSTITUIDOR CONCEDENTE (Titular Proprietário):** **{{ proprietario_nome }}**, detentor e dono oficial listado e pessoa física/jurídica sob o rito do código de identificação governamental portando e regida pelo documento de Inscrição da Receita (CPF/CNPJ) válido: **{{ proprietario_cpf }}** e regularmente atestado e residente civil em **{{ proprietario_endereco }}**.

**OUTORGADA MANDATÁRIA EMPRESARIAL (Gestora Administradora Credenciada e Instituída - Imobiliária):** **{{ imobiliaria_razao_social }}**, Pessoa Jurídica de Direito Privado registrada em federação para o livre exercício e faturamento sob base do CNPJ corporativo atuante nº **{{ imobiliaria_cnpj }}**, contendo Inscrição Estatuária Permanentemente habilitada no conselho regional do CRECI registrado nos assentamentos da região de operação submetida e reconhecida como sob o registro de filiação oficial de marca: Instituição Imobiliária Creci nº **{{ imobiliaria_creci }}**, abertamente sediada operativa e estruturalmente acessível através das portarias matriculadas e fixas apontadas primariamente no centro de endereço administrativo principal e subsidiário e comarcal respectivo para citação e recebimentos logradouros em: **{{ imobiliaria_endereco }}**.

### CLÁUSULA 1ª - DO RESUMO MATERIAL DO OBJETO CONTRATADO
Pelo presente e claro mandato impresso em firma declarada por autoria; o legítimo titular do ponto listado na figura primogênita jurídica identificada como o Outorgante Concedente livre e autonomamente sem quaisquer vícios ocultos coacionantes da deliberalidade que autorram, formal e oficialmente AUTORIZA, NOMEIA irrestritamente a delegação e CONSTITUI e empossa para todos os devidos e subjacentes fins previstos nas normas regradas; a Outorgada Administradora Eleita e Contratada para que atue como Gestora Comercial Representante frente ao mercado.
A responsabilidade exata conferida por este mandato limita-se a:
> **{{ resp_imobiliaria }}**

### CLÁUSULA 2ª - DA APURAÇÃO DAS ESCALAS DE REMUNERAÇÃO, MARGEM DE TAXAS E DEFINIÇÃO DE RECEITA DO REPASSE
Fica terminantemente cravado determinadamente que em via de contra-partida à plenitude dos serviços complexos de assessoria e burocracia despendida pela Outorgada, a mesma reserva-se ao direito a reter uma margem técnica corporativa repassada administrativamente do total bruto na extração descontada no extrato mensal rotativo originado dos repasses pecuniários captados pelas garantias.
A Taxa Administrativa acordada e precificada é de: **{{ percentual_taxa }}%** fixos sobre todo e qualquer montante recebido. 

Caso o supracitado cliente final alocado atrase as contas do aluguel; o repasse do percentual supracitado devida sobre a multa incidirá também sobre honorários de cobrança suplementar de inadimplência solidária e estritamente aplicável baseando juros calculados pelo tempo de infrações.

Foi acordada Cláusula de Agenciamento de Nova Locação para custear campanhas atrativas de aluguel inicial e vistoria?: **{{ taxas_adicionais }}**.

### CLÁUSULA 3ª - RITO EXTRAJUDICIAL NOTARIAL E AUTORIZAÇÕES JUDICIAIS
Existe para o atual mandatário nesta constituição o empossamento formal que comprove a delegação e o aval da cláusula restritiva limitante contratual aditada expressa notarial válida que permita a iniciativa extrajudicial visando e permitindo representação passiva processual em Juízo Ordinário Estadual do polo da mandatária se figurando como proponente em pautas como despejo cautelar preventivo?:
> **{{ autorizacao_judicial }}**

### CLÁUSULA 4ª - DOS PRAZOS BALIZADORES RECORRENTES DA VIGÊNCIA E AS NORMAS CONFLITANTES DE ATENUAÇÃO
Fica perene e atestado que como métrica basal e temporânea imutável de referencial de segurança relacional o Prazo linear e cronometrado de vigência primário e irretratável do contrato balizador base das tratativas de gestão de representação comercial terá curso ininterrupto pelo tempo cravado de: 
> **{{ prazo_contrato }} meses.**

### CLÁUSULA 5ª - DO FORO CÍVEL GEOGRÁFICO DE APURAÇÃO DE DESVIO DE CONFLITOS PROCESSUAIS
E tendo fixados em toda a sua vasta complexidade reguladora as obrigações morais; para tratar de desavenças litígios jurídicos e financeiros futuros prováveis as partes arroladas serão obrigatoriamente julgadas, ajuizadas sob os ritos locais da referida demarcação geográfica restritiva das procuradorias cartoriais locais eleita por força inquestionável deste documento: 
> **{{ foro }}**.

E por fim, após leitura minuciosa do instrumento e estando em integral concordância e pacto expresso, assinam as partes vinculadas.

<br/>
<br/>
<br/>

_____________________________________________
**Proprietário Concedente / Titular Constituinte do Mandato Pleno do Imóvel Listado**

<br/>
<br/>
<br/>

_____________________________________________
**Diretoria Legal Administradora / Representante Expresso Procurador Preposto**
`
};

export function generateDocumentMarkdown(templateId: string, data: Record<string, any>): string {
    const template = templatesRegistry[templateId];

    if (!template) {
        return "# Error\nTemplate não encontrado.";
    }

    // Replace keys using regex (Ex: {{ campo_nome }})
    return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key) => {
        // Find the key in formData, if not found or empty, display a placeholder line for manual insertion
        const value = data[key];
        return value ? String(value) : "_____________________";
    });
}
