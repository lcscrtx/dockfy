// This file contains the template text for the 8 available schemas.
// The engine replaces `{{ key }}` with the value from the form data.

const templatesRegistry: Record<string, string> = {
  compra_venda_imovel: `
# INSTRUMENTO PARTICULAR DE COMPRA E VENDA DE IMÓVEL

Pelo presente instrumento particular, de um lado, **{{ vendedor_nome }}**, {{ vendedor_estado_civil }}, profissão **{{ vendedor_profissao }}**, portador do RG nº **{{ vendedor_rg }}** e CPF/CNPJ nº **{{ vendedor_cpf_cnpj }}**, sob regime de bens **{{ vendedor_regime_bens }}**, residente e domiciliado em **{{ vendedor_endereco }}** (doravante denominado(a) **VENDEDOR(A)**);

E, de outro lado, **{{ comprador_nome }}**, {{ comprador_estado_civil }}, profissão **{{ comprador_profissao }}**, portador do RG nº **{{ comprador_rg }}** e CPF nº **{{ comprador_cpf }}**, sob regime de bens **{{ comprador_regime_bens }}**, residente e domiciliado em **{{ comprador_endereco }}** (doravante denominado(a) **COMPRADOR(A)**).

As partes têm entre si justo e contratado a compra e venda do imóvel descrito nas cláusulas abaixo.

### CLÁUSULA 1ª - DO OBJETO
Constitui objeto deste contrato o imóvel do tipo **{{ imovel_tipo }}**, com área total de **{{ imovel_area }} m²**, localizado em **{{ imovel_endereco }}**, matriculado sob nº **{{ imovel_matricula }}** junto ao **{{ imovel_cartorio }}**, inscrição imobiliária (IPTU) nº **{{ imovel_iptu }}**, com **{{ imovel_vagas }}** vaga(s) de garagem.

### CLÁUSULA 2ª - DO PREÇO E DA FORMA DE PAGAMENTO
O preço certo e ajustado para a presente transação é de **{{ valor_total }}**, a ser pago da seguinte forma:
1. **Sinal/arras**: **{{ valor_sinal }}**, pago na assinatura deste instrumento.
2. **Saldo remanescente**: conforme modalidade **{{ forma_pagamento }}**.
3. **Detalhamento complementar**: **{{ parcelas_obs }}**.

### CLÁUSULA 3ª - DAS DECLARAÇÕES DO VENDEDOR
O **VENDEDOR** declara, sob as penas da lei, que:
1. É legítimo proprietário do imóvel objeto deste contrato.
2. O imóvel será transferido livre de ônus não informados ao **COMPRADOR**.
3. Entregará a documentação necessária para a escritura e registro.

### CLÁUSULA 4ª - DA POSSE, ENTREGA E TRANSFERÊNCIA
A imissão na posse do imóvel ocorrerá em **{{ data_posse }}**, observada a quitação dos valores pactuados e o cumprimento das obrigações documentais pelas partes.

### CLÁUSULA 5ª - DOS TRIBUTOS, DESPESAS E EMOLUMENTOS
As despesas relativas a ITBI, escritura, registro e demais custos cartorários serão de responsabilidade do(a) **{{ resp_itbi }}**, salvo ajuste escrito em sentido diverso.

### CLÁUSULA 6ª - DO INADIMPLEMENTO
No caso de inadimplemento de qualquer obrigação contratual, a parte inadimplente responderá por perdas e danos, correção monetária, juros legais e demais encargos cabíveis.

### CLÁUSULA 7ª - DA DESISTÊNCIA E MULTA COMPENSATÓRIA
Se houver desistência imotivada de qualquer das partes após a assinatura deste instrumento, incidirá multa compensatória de **{{ multa_desistencia }}%** sobre o valor total do contrato, sem prejuízo de indenização complementar, quando cabível.

### CLÁUSULA 8ª - DAS DISPOSIÇÕES GERAIS
1. Qualquer alteração deste contrato deverá ser formalizada por escrito e assinada pelas partes.
2. A eventual tolerância quanto ao descumprimento de cláusulas não importará novação ou renúncia de direitos.
3. Este contrato obriga as partes e seus sucessores a qualquer título.

### CLÁUSULA 9ª - DO FORO
Para dirimir quaisquer dúvidas oriundas deste contrato, as partes elegem o foro da comarca de **{{ foro }}**, com renúncia expressa de qualquer outro, por mais privilegiado que seja.

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

Pelo presente instrumento particular, as partes abaixo qualificadas celebram o presente contrato de locação residencial, regido pela Lei nº 8.245/1991 (Lei do Inquilinato), Código Civil e demais normas aplicáveis.

**LOCADOR(A):** **{{ locador_nome }}**, portador do CPF/CNPJ nº **{{ locador_cpf_cnpj }}**, {{ locador_estado_civil }}, residente e domiciliado/sede em **{{ locador_endereco }}**.

**LOCATÁRIO(A):** **{{ locatario_nome }}**, portador do CPF nº **{{ locatario_cpf }}**, {{ locatario_estado_civil }}, residente e domiciliado em **{{ locatario_endereco }}**.

### CLÁUSULA 1ª - DO OBJETO E DA FINALIDADE
O **LOCADOR** dá em locação ao **LOCATÁRIO** o imóvel do tipo **{{ imovel_tipo }}**, localizado em **{{ imovel_endereco }}**, para uso **{{ imovel_finalidade }}**, sendo vedada a alteração de destinação sem autorização expressa e escrita do **LOCADOR**.

### CLÁUSULA 2ª - DO PRAZO DE LOCAÇÃO
A locação inicia-se em **{{ data_inicio }}** e vigorará por **{{ prazo_meses }} meses**, encerrando-se automaticamente ao final do prazo, salvo prorrogação formal ou tácita na forma da legislação.

### CLÁUSULA 3ª - DO ALUGUEL E DO PAGAMENTO
O aluguel mensal é fixado em **{{ valor_aluguel }}**, devendo ser pago até o dia 05 de cada mês, por meio ajustado entre as partes, sendo considerado quitado após confirmação do crédito.

### CLÁUSULA 4ª - DO REAJUSTE
O valor do aluguel será reajustado a cada 12 (doze) meses, contado do início da locação, pelo índice **{{ indice_reajuste }}** ou por outro que venha a substituí-lo legalmente.

### CLÁUSULA 5ª - DOS ENCARGOS DA LOCAÇÃO
São de responsabilidade do **LOCATÁRIO** os encargos ordinários de uso e fruição do imóvel, incluindo consumo de água, energia elétrica, gás, condomínio ordinário e demais despesas correlatas, salvo disposição legal em contrário.

### CLÁUSULA 6ª - DA GARANTIA LOCATÍCIA
Para garantia do cumprimento das obrigações contratuais, o **LOCATÁRIO** apresenta a modalidade **{{ tipo_garantia }}**, que deverá permanecer válida durante toda a vigência da locação.

### CLÁUSULA 7ª - DA CONSERVAÇÃO E VISTORIA
O **LOCATÁRIO** declara receber o imóvel em condições de uso, comprometendo-se a conservá-lo, restituí-lo ao final da locação no estado em que o recebeu, ressalvado desgaste natural, e permitir vistoria prévia mediante aviso razoável.

### CLÁUSULA 8ª - DAS BENFEITORIAS
Benfeitorias úteis ou voluptuárias realizadas sem autorização expressa do **LOCADOR** não serão indenizáveis, nem conferirão direito de retenção, ressalvadas as hipóteses legais de benfeitorias necessárias.

### CLÁUSULA 9ª - DAS VEDAÇÕES
É vedado ao **LOCATÁRIO** ceder, sublocar, emprestar ou transferir, total ou parcialmente, os direitos deste contrato sem autorização prévia e escrita do **LOCADOR**.

### CLÁUSULA 10ª - DA MORA E INADIMPLEMENTO
O atraso no pagamento de aluguel ou encargos autoriza a cobrança de multa moratória, juros e correção monetária na forma da lei, sem prejuízo das medidas judiciais cabíveis.

### CLÁUSULA 11ª - DA RESCISÃO ANTECIPADA
Na hipótese de rescisão antecipada imotivada pelo **LOCATÁRIO**, incidirá multa equivalente a **{{ valor_multa }} aluguéis**, calculada proporcionalmente ao período contratual não cumprido.

### CLÁUSULA 12ª - DA DEVOLUÇÃO DO IMÓVEL
Encerrada a locação, o imóvel deverá ser desocupado e devolvido ao **LOCADOR** livre de pessoas e bens, com quitação de encargos e entrega das chaves, observadas as condições pactuadas.

### CLÁUSULA 13ª - DO FORO
Para dirimir quaisquer controvérsias decorrentes deste contrato, as partes elegem o foro da comarca de **{{ foro }}**, com renúncia de qualquer outro, por mais privilegiado que seja.

E por estarem justos e contratados, assinam o presente instrumento em 02 (duas) vias de igual teor e forma.

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

As partes acima identificadas celebram o presente contrato de locação comercial, com fundamento na Lei nº 8.245/1991 e demais normas aplicáveis.

### CLÁUSULA 1ª - DO OBJETO
Constitui objeto deste contrato a locação do imóvel comercial do tipo **{{ imovel_tipo }}**, com área aproximada de **{{ imovel_area }} m²**, situado em **{{ imovel_endereco }}**.

### CLÁUSULA 2ª - DA DESTINAÇÃO COMERCIAL
O imóvel será utilizado para **{{ destinacao_comercial }}**, com atividade principal descrita como **{{ atividade_exercida }}**, sendo vedada alteração de ramo sem anuência prévia e escrita do **LOCADOR**.

### CLÁUSULA 3ª - DO PRAZO
O prazo de vigência da locação é de **{{ prazo_meses }} meses**, iniciando-se na data de assinatura ou entrega das chaves, o que ocorrer por último, podendo ser renovado por termo aditivo.

### CLÁUSULA 4ª - DO ALUGUEL E ENCARGOS
O aluguel mensal será de **{{ valor_aluguel }}**, com pagamento na forma ajustada entre as partes.
São de responsabilidade do **LOCATÁRIO** os encargos incidentes sobre o uso do imóvel, incluindo consumos, condomínio ordinário, taxas operacionais e tributos que a lei lhe atribuir.

### CLÁUSULA 5ª - DO REAJUSTE
O aluguel será reajustado anualmente com base no índice **{{ indice_reajuste }}**, ou no índice substituto legalmente aplicável.

### CLÁUSULA 6ª - DA GARANTIA
Como garantia das obrigações contratuais, o **LOCATÁRIO** oferece **{{ garantia }}**.

### CLÁUSULA 7ª - DO SEGURO
Fica estabelecido que a contratação de seguro contra incêndio/sinistro será: **{{ seguro_obrigatorio }}**.

### CLÁUSULA 8ª - DAS OBRIGAÇÕES OPERACIONAIS
O **LOCATÁRIO** compromete-se a manter licenças e autorizações administrativas necessárias ao exercício da atividade, respeitar normas de segurança e não realizar obras estruturais sem autorização expressa do **LOCADOR**.

### CLÁUSULA 9ª - DA RENOVAÇÃO
As partes ajustam, para fins de renovação, a seguinte condição específica: **{{ clausula_renovacao }}**.

### CLÁUSULA 10ª - DA RESCISÃO E PENALIDADES
Em caso de rescisão antecipada imotivada ou descumprimento contratual, será aplicada a penalidade descrita em **{{ multa }}**, sem prejuízo das perdas e danos eventualmente apuradas.

### CLÁUSULA 11ª - DO FORO
Fica eleito o foro da comarca de **{{ foro }}** para dirimir conflitos decorrentes deste instrumento, com renúncia de qualquer outro, por mais privilegiado que seja.

E por estarem em pleno acordo, assinam o presente contrato em 02 (duas) vias de igual teor e forma.

<br/>
<br/>
<br/>

___________________________________________________
**{{ locador_dados_completos }}**

<br/>
<br/>
<br/>

___________________________________________________
**{{ locatario_dados_completos }}**
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
`,
};

const EMPTY_FIELD_FALLBACK = "_____________________";

const enumLabelsByField: Record<string, Record<string, string>> = {
  vendedor_estado_civil: {
    solteiro: "solteiro(a)",
    casado: "casado(a)",
    divorciado: "divorciado(a)",
    viuvo: "viuvo(a)",
  },
  comprador_estado_civil: {
    solteiro: "solteiro(a)",
    casado: "casado(a)",
    divorciado: "divorciado(a)",
    viuvo: "viuvo(a)",
  },
  locador_estado_civil: {
    solteiro: "solteiro(a)",
    casado: "casado(a)",
    divorciado: "divorciado(a)",
    pj: "pessoa juridica",
  },
  locatario_estado_civil: {
    solteiro: "solteiro(a)",
    casado: "casado(a)",
    divorciado: "divorciado(a)",
  },
  vendedor_regime_bens: {
    na: "nao aplicavel",
    parcial: "comunhao parcial",
    universal: "comunhao universal",
    separacao: "separacao total",
  },
  comprador_regime_bens: {
    na: "nao aplicavel",
    parcial: "comunhao parcial",
    universal: "comunhao universal",
    separacao: "separacao total",
  },
  imovel_tipo: {
    apartamento: "apartamento",
    casa: "casa",
    condominio: "casa em condominio",
    terreno: "terreno",
    sala: "sala comercial",
    loja: "loja",
    galpao: "galpao industrial",
  },
  imovel_finalidade: {
    residencial: "residencial",
  },
  forma_pagamento: {
    avista: "a vista",
    financiamento: "financiamento bancario",
    parcelado: "parcelamento direto",
  },
  resp_itbi: {
    comprador: "comprador",
    vendedor: "vendedor",
  },
  indice_reajuste: {
    igpm: "IGP-M",
    ipca: "IPCA",
    inpc: "INPC",
  },
  tipo_garantia: {
    fiador: "fiador",
    caucao: "caucao em dinheiro",
    seguro: "seguro fianca",
    nenhuma: "sem garantia",
  },
  garantia: {
    fiadorpj: "fiador PJ",
    fiadorpf: "fiador PF",
    segurobanco: "seguro fianca bancario",
    caucao: "caucao",
  },
  seguro_obrigatorio: {
    sim: "sim, a cargo do locatario",
    nao: "nao",
  },
};

const moneyFields = new Set([
  "valor_total",
  "valor_sinal",
  "valor_aluguel",
  "valor_ofertado",
  "valor_venda",
  "valor_pago",
]);

function isEmptyValue(value: string | number | null | undefined): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === "string") {
    return value.trim() === "";
  }
  return false;
}

function parseNumericValue(raw: string | number): number | null {
  if (typeof raw === "number") {
    return Number.isFinite(raw) ? raw : null;
  }

  const cleaned = raw.replace(/[^\d,.-]/g, "").trim();
  if (!cleaned) {
    return null;
  }

  const normalized = cleaned.includes(",")
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatValueByField(
  key: string,
  value: string | number | null | undefined,
): string {
  if (isEmptyValue(value)) {
    return EMPTY_FIELD_FALLBACK;
  }

  const rawValue = String(value).trim();
  const enumField = enumLabelsByField[key];
  if (enumField && enumField[rawValue]) {
    return enumField[rawValue];
  }

  if (moneyFields.has(key)) {
    const numeric = parseNumericValue(value as string | number);
    if (numeric !== null) {
      return numeric.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    }
  }

  return rawValue;
}

export function generateDocumentMarkdown(
  templateId: string,
  data: Record<string, string | number | null | undefined>,
): string {
  const template = templatesRegistry[templateId];

  if (!template) {
    return "# Error\nTemplate não encontrado.";
  }

  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key) =>
    formatValueByField(key, data[key]),
  );
}
