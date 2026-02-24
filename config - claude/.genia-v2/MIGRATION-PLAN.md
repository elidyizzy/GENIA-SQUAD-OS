# Plano de Migracao - GEN.IA v1 para v2

> Guia completo para migrar do sistema atual (anthropic-skills) para GEN.IA v2.

---

## 1. VISAO GERAL

### 1.1 De Onde Viemos
```
GEN.IA v1 (Atual)
├── anthropic-skills/skills/    # Skills isoladas
├── ag_kit_2/                   # Antigravity Kit
├── contexts/                   # Arquivos .md soltos
└── memory/                     # MEMORY.md
```

### 1.2 Para Onde Vamos
```
GEN.IA v2 (Novo)
├── .genia-v2/
│   ├── CONSTITUTION.md         # Governanca central
│   ├── development/
│   │   ├── agents/             # 6 agentes definidos
│   │   ├── tasks/              # Tasks reutilizaveis
│   │   └── workflows/          # 3 workflows principais
│   ├── skills/                 # Skills organizadas
│   ├── contexts/               # Contextos especializados
│   └── mcp/                    # Configuracoes MCP
```

---

## 2. MAPEAMENTO DE SKILLS

### 2.1 Skills que PERMANECEM (Documentos)
Estas skills continuam existindo e serao organizadas em `skills/documents/`:

| Skill Atual | Nova Localizacao | Status |
|-------------|------------------|--------|
| /pdf | skills/documents/pdf.md | MANTER |
| /xlsx | skills/documents/xlsx.md | MANTER |
| /docx | skills/documents/docx.md | MANTER |
| /pptx | skills/documents/pptx.md | MANTER |

**Acao**: Copiar e adaptar para novo formato.

### 2.2 Skills que PERMANECEM (Design/Dev)
Estas skills continuam em `skills/design/` e `skills/dev/`:

| Skill Atual | Nova Localizacao | Status |
|-------------|------------------|--------|
| /canvas-design | skills/design/canvas-design.md | MANTER |
| /frontend-design | skills/design/frontend-design.md | MANTER |
| /mcp-builder | skills/dev/mcp-builder.md | MANTER |
| /webapp-testing | skills/dev/webapp-testing.md | MANTER |

### 2.3 Skills que VIRAM TASKS
Algumas skills se tornam Tasks orquestraveis:

| Skill Atual | Task Equivalente | Motivo |
|-------------|------------------|--------|
| /doc-coauthoring | task:criar-documentacao | Usa multiplas skills |
| /skill-creator | task:criar-skill | Workflow complexo |

### 2.4 Skills do Antigravity Kit
Skills `ag-*` serao convertidas em **Contextos** ou **Guidelines**:

| Skill ag-* | Destino | Tipo |
|------------|---------|------|
| ag-api-patterns | contexts/api-patterns.md | Contexto |
| ag-python-patterns | contexts/python-patterns.md | Contexto |
| ag-database-design | contexts/database-design.md | Contexto |
| ag-clean-code | guidelines/clean-code.md | Guideline |
| ag-testing-patterns | guidelines/testing.md | Guideline |
| ag-nextjs-react-expert | contexts/nextjs-react.md | Contexto |
| ag-systematic-debugging | tasks/debug-sistematico.md | Task |

---

## 3. PASSOS DE MIGRACAO

### Fase 1: Preparacao (1 dia)

#### 1.1 Criar Estrutura v2
```bash
# Ja executado - estrutura criada em .genia-v2/
```

#### 1.2 Validar CONSTITUTION.md
- [ ] Revisar regras de governanca
- [ ] Ajustar hierarquia se necessario
- [ ] Validar quality gates

#### 1.3 Revisar Agentes
- [ ] Validar definicoes dos 6 agentes
- [ ] Ajustar comandos se necessario
- [ ] Definir interacoes

### Fase 2: Migracao de Skills (2-3 dias)

#### 2.1 Skills de Documentos
```bash
# Para cada skill de documento:
1. Ler skill original em anthropic-skills/skills/
2. Adaptar formato para .genia-v2/skills/documents/
3. Adicionar metadata (agente responsavel, inputs, outputs)
4. Testar skill migrada
```

**Template de Migracao:**
```markdown
# Skill: /nome

## Metadata
- **Agente**: @dev
- **Categoria**: documents
- **Versao**: 2.0

## Descricao
[Descricao da skill]

## Inputs
- [input 1]
- [input 2]

## Outputs
- [output 1]

## Uso
[Exemplos de uso]

## Relacionamentos
- **Tasks que usam**: [lista]
- **Workflows**: [lista]
```

#### 2.2 Skills de Design
```bash
# Migrar para skills/design/
- canvas-design.md
- frontend-design.md
```

#### 2.3 Skills de Dev
```bash
# Migrar para skills/dev/
- mcp-builder.md
- webapp-testing.md
```

### Fase 3: Conversao de ag-* (2 dias)

#### 3.1 Criar Contextos
```bash
# Para cada ag-* que vira contexto:
1. Extrair conhecimento do skill original
2. Formatar como contexto carregavel
3. Salvar em .genia-v2/contexts/
```

#### 3.2 Criar Tasks
```bash
# Para skills que viram tasks:
1. Identificar workflow do skill
2. Definir inputs/outputs
3. Listar skills que usa
4. Salvar em .genia-v2/development/tasks/
```

### Fase 4: Integracao (1 dia)

#### 4.1 Atualizar CLAUDE.md
```markdown
# Adicionar secao GEN.IA v2
## Sistema GEN.IA v2
Configuracao em `.genia-v2/`
- Constitution: `.genia-v2/CONSTITUTION.md`
- Agentes: `.genia-v2/development/agents/`
- Skills: `.genia-v2/skills/`
```

#### 4.2 Atualizar MEMORY.md
```markdown
# Atualizar referencias
- Apontar para nova estrutura
- Documentar migracao
```

#### 4.3 Testar Workflows
- [ ] Testar workflow Planning
- [ ] Testar workflow Development
- [ ] Testar workflow Delivery

### Fase 5: Deprecacao (gradual)

#### 5.1 Manter Compatibilidade (30 dias)
```
# Periodo de transicao
- anthropic-skills/ continua funcionando
- .genia-v2/ e o novo padrao
- Alertas quando usar skill antiga
```

#### 5.2 Remocao Final
```bash
# Apos validacao completa:
# 1. Backup de anthropic-skills/
# 2. Remover referencias antigas
# 3. Atualizar documentacao
```

---

## 4. CRONOGRAMA

| Fase | Duracao | Datas |
|------|---------|-------|
| Preparacao | 1 dia | Dia 1 |
| Migracao Skills | 2-3 dias | Dias 2-4 |
| Conversao ag-* | 2 dias | Dias 5-6 |
| Integracao | 1 dia | Dia 7 |
| Testes | 2 dias | Dias 8-9 |
| Transicao | 30 dias | Dias 10-40 |
| **Total** | **~40 dias** | - |

---

## 5. CHECKLIST FINAL

### Pre-Migracao
- [x] Estrutura .genia-v2/ criada
- [x] CONSTITUTION.md definida
- [x] Agentes documentados
- [x] Workflows definidos
- [ ] Backup de anthropic-skills/

### Migracao
- [ ] Skills de documentos migradas
- [ ] Skills de design migradas
- [ ] Skills de dev migradas
- [ ] ag-* convertidos
- [ ] Tasks criadas
- [ ] Contextos criados

### Pos-Migracao
- [ ] CLAUDE.md atualizado
- [ ] MEMORY.md atualizado
- [ ] Testes passando
- [ ] Documentacao completa
- [ ] anthropic-skills/ arquivado

---

## 6. ROLLBACK

Se algo der errado:

```bash
# 1. Manter anthropic-skills/ intacto durante transicao
# 2. Reverter CLAUDE.md para versao anterior
# 3. Remover referencias a .genia-v2/
# 4. Continuar usando sistema v1
```

---

## 7. BENEFICIOS ESPERADOS

### Organizacao
- Estrutura clara e padronizada
- Governanca definida (CONSTITUTION)
- Hierarquia de agentes

### Produtividade
- Workflows automatizados
- Tasks reutilizaveis
- Contextos carregaveis

### Qualidade
- Quality gates em cada fase
- Code review obrigatorio
- Documentacao enforced

### Escalabilidade
- Facil adicionar novos agentes
- Facil criar novas tasks
- Facil expandir workflows

---

*Plano criado por GEN.IA SQUAD - v2.0*
*Be Data - Elidy Izidio*
