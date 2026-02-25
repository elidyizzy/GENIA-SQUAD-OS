# Skill: /xlsx

## Metadata
- **Nome**: Excel/Spreadsheet Processing
- **Comando**: /xlsx
- **Agente**: @dev
- **Categoria**: documents
- **Versao**: 2.0

## Descricao
Criacao, edicao e analise de planilhas com suporte a formulas, formatacao, analise de dados e visualizacao.

## Quando Usar
- Criar planilhas com formulas
- Ler e analisar dados
- Modificar planilhas preservando formulas
- Analise e visualizacao de dados
- Recalcular formulas

## Requisitos de Qualidade

### Zero Erros de Formula
Todo arquivo Excel deve ter ZERO erros (#REF!, #DIV/0!, #VALUE!, #N/A, #NAME?)

### Cores Padrao (Modelos Financeiros)
- **Texto azul**: Inputs hardcoded
- **Texto preto**: TODAS as formulas
- **Texto verde**: Links de outras abas
- **Texto vermelho**: Links externos
- **Fundo amarelo**: Assumpcoes importantes

## Pandas - Analise de Dados
```python
import pandas as pd

# Ler Excel
df = pd.read_excel('arquivo.xlsx')
all_sheets = pd.read_excel('arquivo.xlsx', sheet_name=None)  # Todas as abas

# Analisar
df.head()      # Preview
df.info()      # Info das colunas
df.describe()  # Estatisticas

# Escrever
df.to_excel('output.xlsx', index=False)
```

## OpenPyXL - Formulas e Formatacao

### Criar Arquivo
```python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

wb = Workbook()
sheet = wb.active

# Adicionar dados
sheet['A1'] = 'Produto'
sheet['B1'] = 'Valor'
sheet.append(['Item 1', 100])
sheet.append(['Item 2', 200])

# Formula (NUNCA hardcodar valores calculados)
sheet['B4'] = '=SUM(B2:B3)'

# Formatacao
sheet['A1'].font = Font(bold=True)
sheet['A1'].fill = PatternFill('solid', start_color='FFFF00')
sheet.column_dimensions['A'].width = 20

wb.save('output.xlsx')
```

### Editar Arquivo Existente
```python
from openpyxl import load_workbook

wb = load_workbook('existente.xlsx')
sheet = wb.active

# Modificar
sheet['A1'] = 'Novo Valor'
sheet.insert_rows(2)

wb.save('modificado.xlsx')
```

## REGRA CRITICA: Usar Formulas

### ERRADO - Hardcodar valores
```python
total = df['Sales'].sum()
sheet['B10'] = total  # Hardcoda 5000
```

### CORRETO - Usar formulas Excel
```python
sheet['B10'] = '=SUM(B2:B9)'
```

## Recalcular Formulas
```bash
python recalc.py output.xlsx
```

O script:
- Usa LibreOffice para recalcular
- Escaneia TODAS as celulas por erros
- Retorna JSON com erros detalhados

## Formatacao de Numeros

| Tipo | Formato |
|------|---------|
| Anos | Texto ("2024") |
| Moeda | $#,##0 |
| Percentual | 0.0% |
| Multiplos | 0.0x |
| Negativos | Parenteses (123) |

## Best Practices
- **pandas**: Analise de dados, operacoes bulk
- **openpyxl**: Formatacao complexa, formulas
- Indices sao 1-based (row=1, column=1 = A1)
- `data_only=True` le valores calculados (perde formulas se salvar)

## Dependencias
```bash
pip install pandas openpyxl
```

## Tasks Relacionadas
- task:criar-relatorio-excel
- task:analisar-dados

## Workflows
- workflow:processar-dados
- workflow:gerar-relatorios
