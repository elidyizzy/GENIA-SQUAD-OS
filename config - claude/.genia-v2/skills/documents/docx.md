# Skill: /docx

## Metadata
- **Nome**: Word Document Processing
- **Comando**: /docx
- **Agente**: @dev
- **Categoria**: documents
- **Versao**: 2.0

## Descricao
Criacao, edicao e analise de documentos Word com suporte a tracked changes, comentarios, formatacao e extracao de texto.

## Quando Usar
- Criar novos documentos Word
- Modificar/editar conteudo
- Trabalhar com tracked changes
- Adicionar comentarios
- Extrair texto de documentos

## Arvore de Decisao

### Ler/Analisar
→ Usar "Extracao de texto" ou "Acesso XML raw"

### Criar Novo Documento
→ Usar **docx-js** (JavaScript)

### Editar Documento Existente
- Documento proprio + mudancas simples → "Edicao OOXML basica"
- Documento de terceiros → **Workflow de Redlining**
- Docs juridicos/academicos/empresariais → **Workflow de Redlining**

## Extracao de Texto
```bash
# Converter para markdown com tracked changes
pandoc --track-changes=all documento.docx -o output.md
```

## Acesso XML Raw

### Desempacotar arquivo
```bash
python ooxml/scripts/unpack.py <arquivo.docx> <diretorio>
```

### Estrutura de arquivos
- `word/document.xml` - Conteudo principal
- `word/comments.xml` - Comentarios
- `word/media/` - Imagens e midia
- Tracked changes: `<w:ins>` (insercoes) e `<w:del>` (delecoes)

## Criar Novo Documento (docx-js)

```javascript
import { Document, Paragraph, TextRun, Packer } from 'docx';

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: "Titulo", bold: true, size: 32 }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun("Conteudo do documento..."),
        ],
      }),
    ],
  }],
});

// Exportar
const buffer = await Packer.toBuffer(doc);
fs.writeFileSync("documento.docx", buffer);
```

## Workflow de Redlining

### 1. Obter markdown
```bash
pandoc --track-changes=all arquivo.docx -o atual.md
```

### 2. Identificar mudancas
- Agrupar em batches de 3-10 mudancas
- Metodos de localizacao: secao/heading, paragrafos numerados, grep patterns

### 3. Ler documentacao e desempacotar
```bash
python ooxml/scripts/unpack.py arquivo.docx diretorio
```

### 4. Implementar mudancas em batches
Usar `get_node` para encontrar nos, implementar mudancas, `doc.save()`

### 5. Reempacotar
```bash
python ooxml/scripts/pack.py diretorio documento-revisado.docx
```

### 6. Verificacao final
```bash
pandoc --track-changes=all documento-revisado.docx -o verificacao.md
```

## Principio: Edicoes Minimas e Precisas

### ERRADO - Substitui sentenca inteira
```xml
<w:del><w:delText>O prazo e 30 dias.</w:delText></w:del>
<w:ins><w:t>O prazo e 60 dias.</w:t></w:ins>
```

### CORRETO - Marca apenas o que mudou
```xml
<w:r><w:t>O prazo e </w:t></w:r>
<w:del><w:delText>30</w:delText></w:del>
<w:ins><w:t>60</w:t></w:ins>
<w:r><w:t> dias.</w:t></w:r>
```

## Converter para Imagens
```bash
# DOCX → PDF
soffice --headless --convert-to pdf documento.docx

# PDF → JPEG
pdftoppm -jpeg -r 150 documento.pdf pagina
```

## Dependencias
```bash
# Python
pip install defusedxml

# Node
npm install docx

# Sistema
sudo apt-get install pandoc libreoffice poppler-utils
```

## Tasks Relacionadas
- task:criar-contrato
- task:revisar-documento
- task:gerar-relatorio-word

## Workflows
- workflow:revisao-documentos
- workflow:geracao-contratos
