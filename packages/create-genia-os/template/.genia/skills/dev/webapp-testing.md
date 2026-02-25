# Skill: /webapp-testing

## Metadata
- **Nome**: Web Application Testing
- **Comando**: /webapp-testing
- **Agente**: @qa
- **Categoria**: dev
- **Versao**: 2.0

## Descricao
Toolkit para interagir e testar aplicacoes web locais usando Playwright. Suporta verificacao de funcionalidade frontend, debug de comportamento UI, capturas de tela e logs do browser.

## Quando Usar
- Testar aplicacoes web locais
- Verificar funcionalidade frontend
- Debugar comportamento de UI
- Capturar screenshots
- Ver logs do browser

## Scripts Helper

- `scripts/with_server.py` - Gerencia lifecycle do servidor

**Sempre rodar scripts com `--help` primeiro** para ver uso.

## Arvore de Decisao

```
Tarefa → E HTML estatico?
├── Sim → Ler arquivo HTML para identificar selectors
│         ├── Sucesso → Escrever script Playwright
│         └── Falha → Tratar como dinamico
│
└── Nao (webapp dinamico) → Servidor ja rodando?
    ├── Nao → Rodar: python scripts/with_server.py --help
    │         Usar helper + script Playwright simplificado
    │
    └── Sim → Reconhecimento-depois-acao:
        1. Navegar e esperar networkidle
        2. Screenshot ou inspecionar DOM
        3. Identificar selectors do estado renderizado
        4. Executar acoes com selectors descobertos
```

## Usando with_server.py

### Servidor Unico
```bash
python scripts/with_server.py --server "npm run dev" --port 5173 -- python automation.py
```

### Multiplos Servidores (backend + frontend)
```bash
python scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python automation.py
```

## Script de Automacao

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)  # Sempre headless
    page = browser.new_page()
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')  # CRITICO: Esperar JS executar

    # ... logica de automacao

    browser.close()
```

## Padrao Reconhecimento-Depois-Acao

### 1. Inspecionar DOM renderizado
```python
page.screenshot(path='/tmp/inspect.png', full_page=True)
content = page.content()
page.locator('button').all()
```

### 2. Identificar selectors dos resultados

### 3. Executar acoes com selectors descobertos

## Armadilha Comum

**NAO** inspecionar DOM antes de esperar `networkidle` em apps dinamicos

**SIM** esperar `page.wait_for_load_state('networkidle')` antes de inspecao

## Best Practices

- Usar scripts bundled como caixas pretas
- Usar `sync_playwright()` para scripts sincronos
- Sempre fechar browser quando terminar
- Usar selectors descritivos: `text=`, `role=`, CSS, IDs
- Adicionar waits apropriados: `wait_for_selector()`, `wait_for_timeout()`

## Exemplos de Selectors

```python
# Por texto
page.click('text=Submit')

# Por role
page.get_by_role('button', name='Submit').click()

# Por CSS
page.click('.btn-primary')
page.click('#submit-button')

# Por data-testid
page.click('[data-testid="submit-btn"]')
```

## Capturando Logs do Console

```python
page.on('console', lambda msg: print(f"Console: {msg.text}"))
page.goto('http://localhost:5173')
```

## Screenshots

```python
# Pagina inteira
page.screenshot(path='screenshot.png', full_page=True)

# Elemento especifico
page.locator('.card').screenshot(path='card.png')
```

## Arquivos de Referencia

- `examples/element_discovery.py` - Descobrir botoes, links, inputs
- `examples/static_html_automation.py` - Usar file:// URLs
- `examples/console_logging.py` - Capturar logs do console

## Tasks Relacionadas
- task:testar-frontend
- task:automacao-e2e
- task:debug-ui

## Workflows
- workflow:qa-automatizado
- workflow:validacao-frontend
