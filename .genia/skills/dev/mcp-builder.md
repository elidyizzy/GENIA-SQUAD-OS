# Skill: /mcp-builder

## Metadata
- **Nome**: MCP Server Builder
- **Comando**: /mcp-builder
- **Agente**: @dev
- **Categoria**: dev
- **Versao**: 2.0

## Descricao
Guia para criar servidores MCP (Model Context Protocol) de alta qualidade que permitem LLMs interagirem com servicos externos atraves de tools bem projetadas.

## Quando Usar
- Construir servidores MCP
- Integrar APIs externas
- Criar tools para LLMs
- Python (FastMCP) ou TypeScript (MCP SDK)

## Stack Recomendada

- **Linguagem**: TypeScript (melhor suporte SDK)
- **Transport**: Streamable HTTP para servidores remotos, stdio para locais

## Workflow de Alto Nivel

### Fase 1: Pesquisa e Planejamento

#### 1.1 Design MCP Moderno
- **API Coverage vs Workflow Tools**: Balancear cobertura de endpoints com tools de workflow
- **Naming**: Prefixos consistentes (`github_create_issue`, `github_list_repos`)
- **Contexto**: Retornar dados focados e relevantes
- **Erros**: Mensagens que guiam para solucoes

#### 1.2 Documentacao MCP
```
Sitemap: https://modelcontextprotocol.io/sitemap.xml
Paginas: https://modelcontextprotocol.io/specification/draft.md
```

#### 1.3 Documentacao SDK
- **TypeScript**: https://github.com/modelcontextprotocol/typescript-sdk
- **Python**: https://github.com/modelcontextprotocol/python-sdk

### Fase 2: Implementacao

#### 2.1 Estrutura do Projeto (TypeScript)
```
mcp-server/
├── src/
│   ├── index.ts        # Entry point
│   ├── tools/          # Tools definitions
│   ├── resources/      # Resources
│   └── utils/          # Helpers
├── package.json
└── tsconfig.json
```

#### 2.2 Infraestrutura Core
- Cliente API com autenticacao
- Helpers de error handling
- Formatacao de resposta (JSON/Markdown)
- Suporte a paginacao

#### 2.3 Implementar Tools

**Input Schema** (Zod para TypeScript, Pydantic para Python):
```typescript
const schema = z.object({
  query: z.string().describe("Search query"),
  limit: z.number().optional().default(10)
});
```

**Annotations**:
- `readOnlyHint`: true/false
- `destructiveHint`: true/false
- `idempotentHint`: true/false

### Fase 3: Review e Teste

#### 3.1 Qualidade de Codigo
- Sem codigo duplicado (DRY)
- Error handling consistente
- Cobertura de tipos completa
- Descricoes de tools claras

#### 3.2 Build e Teste
```bash
# TypeScript
npm run build
npx @modelcontextprotocol/inspector

# Python
python -m py_compile server.py
```

### Fase 4: Avaliacoes

Criar 10 perguntas de avaliacao:
- Independentes
- Read-only
- Complexas (multiplas tool calls)
- Realisticas
- Verificaveis

**Formato XML**:
```xml
<evaluation>
  <qa_pair>
    <question>Pergunta complexa aqui?</question>
    <answer>Resposta verificavel</answer>
  </qa_pair>
</evaluation>
```

## Exemplo TypeScript

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({
  name: "my-mcp-server",
  version: "1.0.0"
});

server.registerTool({
  name: "search_items",
  description: "Search for items by query",
  inputSchema: z.object({
    query: z.string(),
    limit: z.number().optional()
  }),
  handler: async ({ query, limit = 10 }) => {
    const results = await api.search(query, limit);
    return {
      content: [{ type: "text", text: JSON.stringify(results) }]
    };
  }
});
```

## Exemplo Python (FastMCP)

```python
from fastmcp import FastMCP
from pydantic import BaseModel

mcp = FastMCP("my-server")

class SearchInput(BaseModel):
    query: str
    limit: int = 10

@mcp.tool
async def search_items(input: SearchInput) -> str:
    results = await api.search(input.query, input.limit)
    return json.dumps(results)
```

## Recursos de Referencia
- `reference/mcp_best_practices.md` - Guidelines universais
- `reference/node_mcp_server.md` - Guia TypeScript
- `reference/python_mcp_server.md` - Guia Python
- `reference/evaluation.md` - Guia de avaliacoes

## Tasks Relacionadas
- task:criar-mcp-server
- task:integrar-api-externa

## Workflows
- workflow:desenvolvimento-integracao
