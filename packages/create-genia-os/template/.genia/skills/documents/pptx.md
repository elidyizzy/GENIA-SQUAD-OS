# Skill: /pptx

## Metadata
- **Nome**: PowerPoint Processing
- **Comando**: /pptx
- **Agente**: @dev
- **Categoria**: documents
- **Versao**: 2.0

## Descricao
Criacao, edicao e analise de apresentacoes PowerPoint com suporte a layouts, comentarios, notas do apresentador e temas.

## Quando Usar
- Criar novas apresentacoes
- Modificar/editar slides
- Trabalhar com layouts
- Adicionar comentarios ou notas
- Extrair conteudo de apresentacoes

## Extracao de Texto
```bash
python -m markitdown apresentacao.pptx
```

## Estrutura de Arquivos PPTX

| Arquivo | Conteudo |
|---------|----------|
| `ppt/presentation.xml` | Metadata e referencias |
| `ppt/slides/slide{N}.xml` | Conteudo dos slides |
| `ppt/notesSlides/` | Notas do apresentador |
| `ppt/comments/` | Comentarios |
| `ppt/slideLayouts/` | Templates de layout |
| `ppt/slideMasters/` | Master slides |
| `ppt/theme/` | Tema e estilos |
| `ppt/media/` | Imagens e midia |

## Criar Apresentacao (html2pptx)

### Design Principles
1. **Considerar o assunto**: Tom, industria, mood
2. **Branding**: Cores da empresa/organizacao
3. **Paleta contextual**: Cores que refletem o tema
4. **Declarar abordagem**: Explicar escolhas antes do codigo

### Workflow
1. Ler `html2pptx.md` completamente
2. Criar HTML para cada slide (720pt x 405pt para 16:9)
3. Usar JavaScript com `html2pptx.js`
4. Validar visualmente com thumbnails

### Paletas de Cores (Exemplos)
```
Classic Blue: #1C2833, #2E4053, #AAB7B8, #F4F6F6
Teal & Coral: #5EA8A7, #277884, #FE4447, #FFFFFF
Bold Red: #C0392B, #E74C3C, #F39C12, #F1C40F
Black & Gold: #BF9A4A, #000000, #F4F6F6
```

### Dicas de Layout
- **Duas colunas**: Header full-width, duas colunas abaixo
- **Full-slide**: Chart/tabela ocupando slide inteiro
- **NUNCA**: Empilhar verticalmente texto + chart

## Editar Apresentacao Existente

### Workflow
1. Desempacotar: `python ooxml/scripts/unpack.py apresentacao.pptx diretorio`
2. Editar XMLs em `ppt/slides/`
3. Validar: `python ooxml/scripts/validate.py diretorio --original apresentacao.pptx`
4. Reempacotar: `python ooxml/scripts/pack.py diretorio output.pptx`

## Usar Template Existente

### Workflow
1. Extrair texto e criar thumbnails
2. Analisar template e criar inventario
3. Criar outline com mapeamento de slides
4. Reordenar slides: `python scripts/rearrange.py template.pptx working.pptx 0,34,34,50`
5. Extrair inventario: `python scripts/inventory.py working.pptx inventory.json`
6. Gerar JSON de substituicao
7. Aplicar: `python scripts/replace.py working.pptx replacement.json output.pptx`

## Criar Thumbnails
```bash
python scripts/thumbnail.py template.pptx [output_prefix]
# Opcoes: --cols 4 (3-6)
```

## Converter para Imagens
```bash
# PPTX → PDF
soffice --headless --convert-to pdf apresentacao.pptx

# PDF → JPEG
pdftoppm -jpeg -r 150 apresentacao.pdf slide
```

## Dependencias
```bash
# Python
pip install markitdown defusedxml

# Node
npm install pptxgenjs playwright react-icons sharp

# Sistema
sudo apt-get install libreoffice poppler-utils
```

## Tasks Relacionadas
- task:criar-apresentacao
- task:gerar-slides-dados
- task:adaptar-template

## Workflows
- workflow:criar-pitch-deck
- workflow:relatorio-visual
