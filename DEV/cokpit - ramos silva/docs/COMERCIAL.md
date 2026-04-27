# Documentação Comercial — Cockpit Ramos Silva
**Versão:** 1.0 | **Data:** 2026-04-26 | **Produzido por:** GEN.IA SQUAD

---

## O PROBLEMA QUE NINGUÉM VIA — ATÉ VIRAR CRISE

Toda segunda-feira, André chegava cedo.

Abria o navegador. Acessava o portal da PGFN. Baixava o arquivo. Esperava. Filtrava à mão. Copiava para uma planilha. Abria outra aba para checar o CNPJ no site da Receita. Outra para ver o endereço no Google Maps. Mais uma para pesquisar o nome do sócio no LinkedIn. Tentava entrar no portal do TRF para verificar se a empresa tinha execução fiscal.

Repetia esse processo para cada empresa que parecia promissora.

Na melhor das semanas, conseguia enriquecer 8 leads com qualidade. Na pior, 3.

O escritório Ramos Silva é especializado em reestruturação tributária. O trabalho deles tem impacto real: empresas com dívidas ativas milionárias com a União que precisam de alguém capaz de negociar, reestruturar, preservar o caixa e manter as operações vivas. O mercado é enorme. A inteligência do time é incontestável.

Mas o processo de captação era artesanal. Lento. Inconsistente. E totalmente dependente do tempo de André.

O POP (Procedimento Operacional Padrão) de Captação de Clientes PGFN/TRF do escritório documentou o problema com precisão cirúrgica: são pelo menos **6 fontes de dados diferentes**, acessadas manualmente, uma a uma, para qualificar um único lead. Sem integração. Sem histórico. Sem rastreabilidade.

E enquanto isso, a base pública da PGFN cresce a cada atualização. São **mais de 5 milhões de CNPJs** com dívidas ativas. Um oceano de oportunidades — sem nenhuma rede para pescar.

---

## A SOLUÇÃO QUE A GEN.IA SQUAD CONSTRUIU

Não construímos um CRM. Não entregamos uma planilha melhor. Não automatizamos o caos.

Reconstruímos o processo do zero. Com inteligência.

### A Espinha Dorsal: Sincronização Automática com a PGFN

A base de leads do Cockpit não é alimentada por André. É alimentada pelos próprios dados do governo.

O sistema conecta diretamente com os **Dados Abertos da PGFN** — 4 arquivos públicos, atualizados periodicamente, que cobrem 100% dos devedores da União: tributários previdenciários, não previdenciários, FGTS e não tributários. O script faz o download, processa os CSVs em streaming (para não explodir a memória), detecta a categoria de cada arquivo automaticamente, acumula os valores por CNPJ e executa um único upsert no banco.

Resultado: **2.435.916 CNPJs carregados**, todos com o breakdown de dívida por categoria, todos disponíveis para André filtrar e priorizar.

Sem abrir um portal. Sem copiar e colar. Sem duplicatas.

### O Banco de Leads: Inteligência antes da Prospecção

Antes de falar com qualquer empresa, André já sabe quem vale a pena.

A tabela de leads classifica automaticamente cada empresa:
- **Classe A** — dívida acima de R$ 3 milhões (prioridade máxima)
- **Classe B** — entre R$ 1 e R$ 3 milhões
- **Classe C** — abaixo de R$ 1 milhão (filtrado por padrão)

Filtros por estado, classificação, nome ou CNPJ. Ordenação por valor. E um painel com o breakdown da dívida por categoria — exatamente como o portal Regularize da PGFN, mas integrado ao fluxo de trabalho.

André seleciona os leads que fazem sentido. Clica "Mover para Pipeline". E o lead aparece no Kanban.

### O Pipeline: Do Lead Bruto à Proposta em Cliques

O Pipeline é um Kanban com 7 estágios:

```
Lead Bruto → Enriquecido → Qualificado → Contato → Diagnóstico → Proposta → Fechado
```

Cada card carrega o nome da empresa, o CNPJ, o valor da dívida e os ícones de enriquecimento — cinza (pendente) ou verde (feito). André vê de relance o que já foi trabalhado.

Abrindo o card, ele tem 4 ações de enriquecimento on-demand — cada uma com um botão, um estado de carregamento e um resultado visual imediato:

---

**1. Dados Cadastrais**
Antes: André abria o site da Receita, copiava os campos um a um.
Agora: Um clique. O sistema consulta o CNPJ.ws (que aceita IPs de servidor, diferente da maioria das APIs públicas), extrai situação cadastral, CNAE, capital social, endereço completo e quadro societário. Tudo formatado, tudo salvo.

**2. Validação Operacional**
Antes: André abria o Google Maps, digitava o endereço, verificava se a empresa existia de verdade.
Agora: Um clique. O Geoapify geocodifica o nome da empresa + município + estado e retorna um link direto para o Google Maps com as coordenadas exatas.

**3. Inteligência Jurídica**
Antes: André tentava acessar o portal do TRF da região, navegava por formulários lentos, às vezes bloqueados, copiava os processos à mão.
Agora: Um clique. O sistema identifica automaticamente qual TRF (1 a 6) corresponde ao estado da empresa, consulta a **API pública do CNJ (DataJud)** via Elasticsearch e retorna todos os processos do CNPJ: número, classe, tribunal, data. Indicador de risco: Baixo, Médio ou Alto.

**4. Decisores**
Antes: André pesquisava os sócios no LinkedIn, tentava encontrar o responsável financeiro, raramente conseguia um email.
Agora: Um clique. O sistema usa os sócios do QSA (retornados no enriquecimento cadastral) e consulta o Apollo.io para cada um — retornando cargo atual, email corporativo e link do LinkedIn. Se o Apollo não encontrar perfis, exibe os próprios sócios do quadro societário como ponto de partida.

---

### O Dashboard: Visão Executiva em Tempo Real

Para os sócios do escritório, o Cockpit entrega uma visão de funil completa:
- Total de leads na base PGFN
- Leads ativos por estágio do pipeline
- Volume total de dívida em prospecção
- Taxa de conversão entre estágios
- Histórico de captação por semana

Sem precisar perguntar para André "como estão as prospecções".

---

## O QUE ISSO MUDA NO MERCADO

Empresas com dívida ativa ainda são prospectadas com cold call. Com pesquisa manual. Com planilha.

Enquanto isso, o time de agentes da GEN.IA SQUAD entregou ao escritório Ramos Silva um sistema que:

- Monitora **a base inteira da PGFN** automaticamente — não os 20 leads que André conseguia processar por semana
- Qualifica **2,4 milhões de CNPJs** com critérios objetivos antes de qualquer contato humano
- Enriquece um lead em **menos de 30 segundos** — contra 45 minutos do processo manual
- Rastrea **todo o histórico de movimentação** de cada oportunidade, com timestamp imutável
- Entrega inteligência jurídica de **6 tribunais federais** num único clique, via API oficial do CNJ

A diferença não é de eficiência. É de escala.

O prospector não é mais limitado pelo tempo que leva para enriquecer um lead. Ele é limitado apenas pela sua capacidade de fechar negócios.

**Empresas ainda prospectam copiando planilha.**
**O escritório Ramos Silva prospecta com inteligência de dados.**

---

## ESCOPO ENTREGUE (v1)

| Módulo | Status | Detalhe |
|---|---|---|
| Sync PGFN | Entregue | 2,4M CNPJs, breakdown por categoria, sem duplicatas |
| Banco de Leads | Entregue | Filtros, classificação A/B/C, ações mover/descartar |
| Pipeline Kanban | Entregue | 7 estágios, drag-and-drop, histórico imutável |
| Enriquecimento Cadastral | Entregue | CNPJ.ws + BrasilAPI fallback |
| Validação Operacional | Entregue | Geoapify → link Google Maps |
| Inteligência Jurídica | Entregue | DataJud CNJ API — TRF 1 a 6 |
| Decisores | Entregue | Apollo.io + fallback QSA |
| Dashboard Executivo | Entregue | KPIs, funil, gráficos (Recharts) |
| Configurações | Entregue | API keys, filtros, log de sync |

---

## PRÓXIMOS HORIZONTES (v2 — sugestão)

| Evolução | Impacto |
|---|---|
| Alerta automático de novos leads A na base | André é notificado sem precisar abrir o Cockpit |
| Integração WhatsApp / Email automatizado | Primeiro contato sai do próprio Cockpit |
| Score de propensão por CNAE + dívida + processos | IA ranqueia os melhores leads antes de André |
| Multi-usuário com perfis | Time de prospecção com rastreabilidade individual |
| Exportação de relatório por lead (PDF) | Dossiê completo para a reunião de diagnóstico |

---

*Documentação produzida pela GEN.IA SQUAD*
*Projeto: Cockpit Ramos Silva | Entrega: 2026-04-26*
