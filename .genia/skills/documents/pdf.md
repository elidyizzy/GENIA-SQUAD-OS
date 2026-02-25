# Skill: /pdf

## Metadata
- **Nome**: PDF Processing
- **Comando**: /pdf
- **Agente**: @dev
- **Categoria**: documents
- **Versao**: 2.0

## Descricao
Toolkit completo para manipulacao de PDFs: extrair texto e tabelas, criar novos PDFs, mesclar/dividir documentos e preencher formularios.

## Quando Usar
- Extrair texto de PDFs
- Extrair tabelas para Excel/CSV
- Mesclar multiplos PDFs
- Dividir PDF em paginas
- Criar novos PDFs
- Preencher formularios PDF
- Adicionar marca d'agua
- OCR em PDFs escaneados

## Bibliotecas Python

### pypdf - Operacoes Basicas
```python
from pypdf import PdfReader, PdfWriter

# Ler PDF
reader = PdfReader("documento.pdf")
print(f"Paginas: {len(reader.pages)}")

# Extrair texto
text = ""
for page in reader.pages:
    text += page.extract_text()
```

### Mesclar PDFs
```python
from pypdf import PdfWriter, PdfReader

writer = PdfWriter()
for pdf_file in ["doc1.pdf", "doc2.pdf", "doc3.pdf"]:
    reader = PdfReader(pdf_file)
    for page in reader.pages:
        writer.add_page(page)

with open("mesclado.pdf", "wb") as output:
    writer.write(output)
```

### Dividir PDF
```python
reader = PdfReader("input.pdf")
for i, page in enumerate(reader.pages):
    writer = PdfWriter()
    writer.add_page(page)
    with open(f"pagina_{i+1}.pdf", "wb") as output:
        writer.write(output)
```

### pdfplumber - Extrair Tabelas
```python
import pdfplumber
import pandas as pd

with pdfplumber.open("documento.pdf") as pdf:
    all_tables = []
    for page in pdf.pages:
        tables = page.extract_tables()
        for table in tables:
            if table:
                df = pd.DataFrame(table[1:], columns=table[0])
                all_tables.append(df)

if all_tables:
    combined_df = pd.concat(all_tables, ignore_index=True)
    combined_df.to_excel("tabelas.xlsx", index=False)
```

### reportlab - Criar PDFs
```python
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

doc = SimpleDocTemplate("relatorio.pdf", pagesize=letter)
styles = getSampleStyleSheet()
story = []

story.append(Paragraph("Titulo", styles['Title']))
story.append(Spacer(1, 12))
story.append(Paragraph("Conteudo aqui...", styles['Normal']))

doc.build(story)
```

## Comandos CLI

### pdftotext (poppler-utils)
```bash
pdftotext input.pdf output.txt
pdftotext -layout input.pdf output.txt  # Preserva layout
```

### qpdf
```bash
qpdf --empty --pages file1.pdf file2.pdf -- merged.pdf  # Mesclar
qpdf input.pdf --pages . 1-5 -- pages1-5.pdf  # Extrair paginas
```

## Quick Reference

| Tarefa | Biblioteca | Codigo |
|--------|------------|--------|
| Mesclar PDFs | pypdf | `writer.add_page(page)` |
| Extrair texto | pdfplumber | `page.extract_text()` |
| Extrair tabelas | pdfplumber | `page.extract_tables()` |
| Criar PDFs | reportlab | Canvas ou Platypus |
| OCR | pytesseract | Converter para imagem primeiro |
| Formularios | pypdf/pdf-lib | Ver forms.md |

## Dependencias
```bash
pip install pypdf pdfplumber reportlab pytesseract pdf2image
```

## Tasks Relacionadas
- task:extrair-dados-pdf
- task:gerar-relatorio-pdf

## Workflows
- workflow:processar-documentos
